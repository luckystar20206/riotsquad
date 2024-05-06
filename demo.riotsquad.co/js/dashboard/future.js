
function chartTheme(){
	if($('body').attr('data-theme-version') == "light"){
		return "Light";
	}else{
		return "Dark";
	}
}
function tradingfuture(){
  new TradingView.widget(
	{
	  "width": "100%",
	  "height": 516,
	  "symbol": "BINANCE:BTCUSDTPERP",
	  "interval": "D",
	  "timezone": "Etc/UTC",
	  "theme": chartTheme(),
	  "style": "1",
	  "locale": "en",
	  "toolbar_bg": "#f1f3f6",
	  "enable_publishing": false,
	  "withdateranges": true,
	  "hide_side_toolbar": false,
	  "allow_symbol_change": true,
	  "show_popup_button": true,
	  "popup_width": "1000",
	  "popup_height": "650",
	  "container_id": "tradingview_85dc0"
	}
  );
}

let open_trades = [];

var element = document.querySelector('body');
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if(mutation.attributeName === "data-theme-version"){
			tradingfuture();
		}
	});
});
let erpetual_html = "";
observer.observe(element, {
	attributes: true
});

jQuery(window).on('load',function(){
	setTimeout(function(){
		tradingfuture();
		get_cached_trades();
		erpetual_html = $("#calcForm").html();
	}, 1000); 
});

var table = document.getElementById('example-2');
async function get_cached_trades(){
    let trade_info = localStorage.getItem('trade_info');
	let sim_move_pct = localStorage.getItem('sim_move_pct') || 0.0;
    if(trade_info){
        let open_trades = JSON.parse(trade_info);

        // Remove the boilerplate row if it exists
        let boilerplateRow = document.getElementById('boilerplate');
        if(boilerplateRow){
            boilerplateRow.remove();
        }

        for(let trade of open_trades){
			let current_price = await fetch_price(trade.ticker);
			let simulated_price = parseFloat(parseFloat(current_price) + (parseFloat(current_price) * sim_move_pct / 100)).toFixed(2);
	
            let {pnl, pnl_pct} = calculate_pnl(parseFloat(trade.entry_price), simulated_price, parseFloat(trade.qty_val), trade.side);
            trade.pnl = pnl;
            trade.pnl_pct = pnl_pct;

            let existingRow = document.getElementById('trade-' + trade.time);
            if(existingRow){
				existingRow.cells[3].innerHTML = simulated_price; 
				existingRow.cells[4].innerHTML =  "$" + parseFloat(trade.pnl).toFixed(2);
				existingRow.cells[5].innerHTML = parseFloat(trade.pnl_pct).toFixed(2) + "%";
				let qtyCell = existingRow.cells[6];
				qtyCell.innerHTML = trade.qty_val + " " + trade.ticker.split("USDT")[0];
				qtyCell.classList.add('text-end'); 
			} else {
				let row = table.insertRow(-1);
				row.id = 'trade-' + trade.time;  
				row.dataset.time = trade.time; 
				row.insertCell(0).innerHTML = trade.ticker;
				row.insertCell(1).innerHTML = trade.side;
				row.insertCell(2).innerHTML = parseFloat(trade.entry_price).toFixed(2); 
				row.insertCell(3).innerHTML = simulated_price; 
				row.insertCell(4).innerHTML = "$" + parseFloat(trade.pnl).toFixed(2);
				row.insertCell(5).innerHTML = parseFloat(trade.pnl_pct).toFixed(2) + "%";
				let qtyCell = row.insertCell(6);
				qtyCell.innerHTML = trade.qty_val + " " + trade.ticker.split("USDT")[0];
				qtyCell.classList.add('text-end'); 
			}
        }
    }
}
setInterval(async function(){
	get_cached_trades();
}, 5000);

function calculate_pnl(entry_price, current_price, qty_val, side){
    let pnl = 0;
    let pnl_pct = 0;
    if(side == "LONG"){
        pnl = (current_price - entry_price) * qty_val;
        pnl_pct = ((current_price - entry_price) / entry_price) * 100;
    }else{
        pnl = (entry_price - current_price) * qty_val;
        pnl_pct = ((entry_price - current_price) / entry_price) * 100;
    }
    return {pnl, pnl_pct};
}

async function fetch_price (symbol){
	const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
	const data = await response.json();
	return data.price;
}

$('#calcForm').on('change','#margin', function(){
	let leverage = $(this).val();
	console.log(leverage);
	$('#marginVal').html(leverage);
})

function getFormValues(){
	return {
		openPrice: parseFloat($('#openPrice').val()),
		targetPrice: parseFloat($('#targetPrice').val()),
		size: parseFloat($('#size').val()),
		margin: parseFloat($('#margin').val()),
	}
}


$("#calcForm").on('click','#buyBtn', function(){
	const {openPrice, targetPrice, size, margin} = getFormValues();
	const roe = ((targetPrice - openPrice) / openPrice) * 100;
	const pnl = size + size * (roe/100);
	$('#calcForm').html("Waiting...");

	startListener([pnl, roe, size, margin, openPrice, targetPrice])
});

$("#calcForm").on('click','#sellBtn', function(){
	console.log("sellbtn click")
	const {openPrice, targetPrice, size, margin} = getFormValues();
	const ov = openPrice * size;
	const pnl = (ov * margin / targetPrice - (margin- 1 ) * size) * targetPrice;
	const roe = ((pnl - ov) / ov) * 100;
	$('#calcForm').html("Waiting...");

	startListener([pnl, roe, size, margin, openPrice, targetPrice])
});

function startListener(values){
  const symbol = localStorage.getItem('symbol') || 'btcusdt';

  console.log(values)
  const percInterval = setInterval(async function(){
	const val = localStorage.getItem('step_pct');
	console.log(val)
	if(val && !isNaN(parseFloat(val)) && Math.abs(parseFloat(val)) >= 0.05){
		animateResults(values);
	}

  }, 500)

	function animateResults(results){

		clearInterval(percInterval);
		$('#calcForm')[0].classList.add('d-none');
		$('#calcResults')[0].classList.remove('d-none');

		$('.res').each(function(index) {
			const $this = $(this);
			const resultValue = results[index];
			$this.prop('Counter', 0).animate({
				Counter: resultValue
			}, {
				duration: 5000,
				easing: 'swing',
				step: function(now) {
					$this.text(now.toFixed(2));
				}
			});
		});
	}

//   let base = 0;

//   ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_1m`);
//   ws.onopen = () => {
// 		console.log('WebSocket connection established.');
//   };

//         ws.onmessage = (msg) => {
//             const data = JSON.parse(msg.data);
//             let close = parseFloat(data.k.c);
// 			console.log(close)
//             if(base === 0){
// 				base = close;
// 			}else{
// 				let percDiff = (Math.abs(close - base) / base) * 100;
// 				if(percDiff >= 5) {
// 					animateResults(values);
// 					ws.close();
// 				}
// 			}
//         };

//         ws.onerror = (error) => {
//             console.error('WebSocket error:', error);
//         };

//         ws.onclose = () => {
//             console.log('WebSocket connection closed.');
//         };
}

$("#refresh-btn").on('click', function(){
	$('#calcForm')[0].classList.remove('d-none');
	$('#calcResults')[0].classList.add('d-none');
	$("#calcForm").html(erpetual_html);
});