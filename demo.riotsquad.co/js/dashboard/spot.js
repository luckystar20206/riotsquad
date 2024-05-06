const { createChart: createLightweightChart } = window.LightweightCharts;
let ws = null;
let sim_move_pct = 0.0;
let latestCandleData = null;
let lastClose = null;
let highestPrice = 0;
let lowestPrice = Infinity;
let candleSeries = [];

jQuery(window).on("load", function () {
  setTimeout(function () {
    sim_move_pct = localStorage.getItem("sim_move_pct") || 0.0;
    ws_klines();
    createCustomChart();
    localStorage.setItem("step_pct", 0);
  }, 1000);
})

async function binance_kline_fetch(timeframe = "1m", symbol = "BTCUSDT") {
  const response = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=250`
  );
  const data = await response.json();

  return data.map((item) => {
    return {
      time: item[0] / 1000, 
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    };
  });
}
async function createCustomChart() {
  const chartContainer = document.querySelector("#tradingview_85dc0");

  const TV_chart = createLightweightChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 516,
    layout: {
      background: { color: '#222' },
      textColor: '#DDD',
    },
    grid: {
      vertLines: { color: '#444' },
      horzLines: { color: '#444' },
    },
    timeScale: {
      timeVisible: true,
      tickMarkFormatter: (time, tickMarkType, locale) => {
        const date = new Date(time * 1000);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      },
    },
  });
  candleSeries = TV_chart.addCandlestickSeries();

  const data = await binance_kline_fetch();
  candleSeries.setData(data);

  window.addEventListener("resize", () => {
    const newChartWidth = chartContainer.clientWidth;
    const newChartHeight = chartContainer.clientHeight;

    TV_chart.resize(newChartWidth, newChartHeight);
  });
}
async function ws_klines(timeframe = "1m", symbol="btcusdt") {
  ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_${timeframe}`);
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    let close = parseFloat(data.k.c);
    let time = data.k.t / 1000;
    const newClose = close * (1 + sim_move_pct / 100);
    console.log(data)

    if (newClose > highestPrice) {
      highestPrice = newClose;
    }
    if (newClose < lowestPrice) {
      lowestPrice = newClose;
    }

    if (latestCandleData) {
      if (time !== latestCandleData.time) {
        lastClose = latestCandleData ? latestCandleData.close : null;
        highestPrice = newClose;
        lowestPrice = newClose;
      }
    }

    const candleData = {
      time: time,
      open: lastClose !== null ? lastClose : parseFloat(data.k.o),
      high: highestPrice,
      low: lowestPrice,
      close: newClose,
    };
    latestCandleData = candleData;
    candleSeries.update(candleData);
  };
}
function sim_price_move(event, pct_inct, qty) {
  event.preventDefault();
  sim_move_pct = Math.round((parseFloat(sim_move_pct) + parseFloat(pct_inct)) * 10000) / 10000;
  let step_pct = Math.round(pct_inct * 10000) / 10000;

  console.log("Simulating price move by", step_pct, "%", "New sim_move_pct", sim_move_pct);
  localStorage.setItem("step_pct", step_pct);

  if (latestCandleData) {
    let close = latestCandleData.close;
    const newClose = close * (1 + step_pct / 100);

    if (newClose > highestPrice) {
      highestPrice = newClose;
    }
    if (newClose < lowestPrice) {
      lowestPrice = newClose;
    }

    const candleData = {
      ...latestCandleData,
      high: highestPrice,
      low: lowestPrice,
      close: newClose,
    };
    candleSeries.update(candleData);
  }
  if (qty) {
    let ticker = $("#symbol-select").val();
    let entry_price = latestCandleData.close;
    let time = Date.now();
    let qty_val = parseFloat(qty);
    let side = step_pct > 0 ? "LONG" : "SHORT";

    let trade_info = {
      ticker: ticker,
      time: time,
      entry_price: entry_price,
      qty_val: qty_val,
      side: side,
      sim_move: sim_move_pct,
    };
    let existing_trades = JSON.parse(localStorage.getItem("trade_info")) || [];
    existing_trades.push(trade_info);
    localStorage.setItem("trade_info", JSON.stringify(existing_trades));
  }
  localStorage.setItem("sim_move_pct", sim_move_pct);
}
function timeframeChange (timeframe) {
  if (ws) {
    ws.close();
    sim_move_pct = localStorage.getItem("sim_move_pct") || 0.0;
    latestCandleData = null;
    lastClose = null;
    highestPrice = 0;
    lowestPrice = Infinity;
  }
  
  const symbol = document.querySelector('#symbol-select').value;

  if (timeframe === 1) {
    timeframe = "1m";
  } else if (timeframe === 5) {
    timeframe = "5m";
  } else if (timeframe === 15) {
    timeframe = "15m";
  } else if (timeframe === 30) {
    timeframe = "30m";
  } else if (timeframe === 60) {
    timeframe = "1h";
  } else if (timeframe === 240) {
    timeframe = "4h";
  }
  console.log("Timeframe changed to", timeframe);
  binance_kline_fetch(timeframe, symbol).then(data => {
    candleSeries.setData(data);
    ws_klines(timeframe, symbol.toLowerCase());
  });
}

$('#symbol-select').on('change', function () {
  symbolChange(this.value);
}); 

function symbolChange (symbol) {
  if (ws) {
    ws.close();
    sim_move_pct = localStorage.getItem("sim_move_pct") || 0.0;
    latestCandleData = null;
    lastClose = null;
    highestPrice = 0;
    lowestPrice = Infinity;
  }

  const timeframe = document.querySelector('.timeframe-nav .nav-link.active').innerText
  localStorage.setItem('symbol', symbol);

  binance_kline_fetch(timeframe, symbol).then(data => {
    candleSeries.setData(data);
    ws_klines(timeframe, symbol.toLowerCase());
  });
}