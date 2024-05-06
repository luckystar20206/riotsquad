 var Jiade = function(){
	 "use strict"
	/* Search Bar ============ */
	var screenWidth = $( window ).width();
	var screenHeight = $( window ).height();
	
	
	 var handleSelectPicker = function(){
		if(jQuery('.default-select').length > 0 ){
			jQuery('.default-select').selectpicker();
			jQuery('.default-select,.dataTables_wrapper select').selectpicker();

			
		}
		
	} 
	var handleMinHeight = function() {
        var win_h = window.outerHeight;
		var win_h = window.outerHeight;
		if (win_h > 0 ? win_h : screen.height) {
			$(".content-body").css("min-height", (window.innerHeight - 55) + "px");
		};
   }
	var handleDZhoverMove = function (){
		if(jQuery('.portofolio-social').length > 0){
			const dzAnchorTags = document.querySelectorAll(".portofolio-social li");
			dzAnchorTags.forEach((anchor) => {
				let sx = 0;
				let sy = 0;
				let ssize = 1;

				let dx = sx;
				let dy = sy;
				let dsize = ssize;

				let dzWidth = window.innerWidth;
				let dzHeight = window.innerHeight;

				anchor.addEventListener("mousemove", (e) => {
					const rect = anchor.getBoundingClientRect();
					const anchorCenterX = rect.left + rect.width / 2;
					const anchorCenterY = rect.top + rect.height / 2;

					dx = (e.clientX - anchorCenterX) * 0.90;
					dy = (e.clientY - anchorCenterY) * 0.90;

					dsize = 1.3;
				});

				anchor.addEventListener("mouseleave", (e) => {
					dx = 0;
					dy = 0;
					dsize = 1;
				});
			  
				window.addEventListener("resize", () => {
					dzWidth = window.innerWidth;
					dzHeight = window.innerHeight;
				});

				function lerp(a, b, t) {
					return (1 - t) * a + t * b;
				}

				function update() {
					sx = lerp(sx, dx, 0.1);
					sx = Math.floor(sx * 100) / 100;

					sy = lerp(sy, dy, 0.1);
					sy = Math.floor(sy * 100) / 100;

					ssize = lerp(ssize, dsize, 0.05);
					ssize = Math.floor(ssize * 100) / 100;

					anchor.style.transform = `translate(${sx}px, ${sy}px) scale(${ssize})`;
					requestAnimationFrame(update);
				}

				update();

			});
		}
	}


	var handlePreloader = function(){
		setTimeout(function() {
			jQuery('#preloader').remove();
			$('#main-wrapper').addClass('show');
		},1500);	
		
	}

    var handleMetisMenu = function() {
		if(jQuery('#menu').length > 0 ){
			$("#menu").metisMenu();
		}
		jQuery('.metismenu > .mm-active ').each(function(){
			if(!jQuery(this).children('ul').length > 0)
			{
				jQuery(this).addClass('active-no-child');
			}
		});
	}
   
	var handleAllChecked = function() {
		$("#checkAll, #checkAll4, #checkAll1, #checkAll2, #checkAll5").on('change',function() {
			$("td input:checkbox, .custom-checkbox input:checkbox").prop('checked', $(this).prop("checked"));
		});
		$(".checkAllInput").on('click',function() {
			jQuery(this).closest('.ItemsCheckboxSec').find('input[type="checkbox"]').prop('checked', true);		
		});
		$(".unCheckAllInput").on('click',function() {
			jQuery(this).closest('.ItemsCheckboxSec').find('input[type="checkbox"]').prop('checked', false);		
		});
	}

	var handleNavigation = function() {
		$(".nav-control").on('click', function() {

			$('#main-wrapper').toggleClass("menu-toggle");

			$(".hamburger").toggleClass("is-active");
		});
	}
  
	var handleCurrentActive = function() {
		for (var nk = window.location,
			o = $("ul#menu a").filter(function() {
				
				return this.href == nk;
				
			})
			.addClass("mm-active")
			.parent()
			.addClass("mm-active");;) 
		{
			
			if (!o.is("li")) break;
			
			o = o.parent()
				.addClass("mm-show")
				.parent()
				.addClass("mm-active");
		}
	}

	var handleMiniSidebar = function() {
		$("ul#menu>li").on('click', function() {
			const sidebarStyle = $('body').attr('data-sidebar-style');
			if (sidebarStyle === 'mini') {
				console.log($(this).find('ul'))
				$(this).find('ul').stop()
			}
		})
	}
   
    
	var handleDataAction = function() {
		$('a[data-action="collapse"]').on("click", function(i) {
			i.preventDefault(),
				$(this).closest(".card").find('[data-action="collapse"] i').toggleClass("mdi-arrow-down mdi-arrow-up"),
				$(this).closest(".card").children(".card-body").collapse("toggle");
		});

		$('a[data-action="expand"]').on("click", function(i) {
			i.preventDefault(),
				$(this).closest(".card").find('[data-action="expand"] i').toggleClass("icon-size-actual icon-size-fullscreen"),
				$(this).closest(".card").toggleClass("card-fullscreen");
		});



		$('[data-action="close"]').on("click", function() {
			$(this).closest(".card").removeClass().slideUp("fast");
		});

		$('[data-action="reload"]').on("click", function() {
			var e = $(this);
			e.parents(".card").addClass("card-load"),
				e.parents(".card").append('<div class="card-loader"><i class=" ti-reload rotate-refresh"></div>'),
				setTimeout(function() {
					e.parents(".card").children(".card-loader").remove(),
						e.parents(".card").removeClass("card-load")
				}, 2000)
		});
	}

    var handleHeaderHight = function() {
		const headerHight = $('.header').innerHeight();
		$(window).scroll(function() {
			if ($('body').attr('data-layout') === "horizontal" && $('body').attr('data-header-position') === "static" && $('body').attr('data-sidebar-position') === "fixed")
				$(this.window).scrollTop() >= headerHight ? $('.dlabnav').addClass('fixed') : $('.dlabnav').removeClass('fixed')
		});
	}
	
	var handleDzScroll = function() {
		jQuery('.dlab-scroll').each(function(){
			var scroolWidgetId = jQuery(this).attr('id');
			const ps = new PerfectScrollbar('#'+scroolWidgetId, {
			  wheelSpeed: 2,
			  wheelPropagation: true,
			  minScrollbarLength: 20
			});
            ps.isRtl = false;
		})
	}
	
	var handleMenuTabs = function() {
		if(screenWidth <= 991 ){
			jQuery('.menu-tabs .nav-link').on('click',function(){
				if(jQuery(this).hasClass('open'))
				{
					jQuery(this).removeClass('open');
					jQuery('.fixed-content-box').removeClass('active');
					jQuery('.hamburger').show();
				}else{
					jQuery('.menu-tabs .nav-link').removeClass('open');
					jQuery(this).addClass('open');
					jQuery('.fixed-content-box').addClass('active');
					jQuery('.hamburger').hide();
				}
			});
			jQuery('.close-fixed-content').on('click',function(){
				jQuery('.fixed-content-box').removeClass('active');
				jQuery('.hamburger').removeClass('is-active');
				jQuery('#main-wrapper').removeClass('menu-toggle');
				jQuery('.hamburger').show();
			});
		}
	}
	
	var handleChatbox = function() {
		jQuery('.bell-link').on('click',function(){
			jQuery('.chatbox').addClass('active');
		});
		jQuery('.chatbox-close').on('click',function(){
			jQuery('.chatbox').removeClass('active');
		});
	}
	
	var handleMenuWallet = function() {
		jQuery('.menu-wallet').on('click',function(){
			if(screenWidth <= 1600){
				jQuery('.wallet-open').addClass('active');
			}else{
				jQuery('.wallet-open').toggleClass('active');
			}
		});
		jQuery('.wallet-bar-close').on('click',function(){
			jQuery('.wallet-open').removeClass('active');
		});
		jQuery('.closed-icon').on('click',function(){
			jQuery('.wallet-open').removeClass('active');
		});
	}
	
	

	var handleBtnNumber = function() {
		$('.btn-number').on('click', function(e) {
			e.preventDefault();

			fieldName = $(this).attr('data-field');
			type = $(this).attr('data-type');
			var input = $("input[name='" + fieldName + "']");
			var currentVal = parseInt(input.val());
			if (!isNaN(currentVal)) {
				if (type == 'minus')
					input.val(currentVal - 1);
				else if (type == 'plus')
					input.val(currentVal + 1);
			} else {
				input.val(0);
			}
		});
	}
	
	var handleDzChatUser = function() {
		jQuery('.dlab-chat-user-box .dlab-chat-user').on('click',function(){
			jQuery('.dlab-chat-user-box').addClass('d-none');
			jQuery('.dlab-chat-history-box').removeClass('d-none');
            //$(".chatbox .msg_card_body").height(vHeightArea());
            //$(".chatbox .msg_card_body").css('height',vHeightArea());
		}); 
		
		jQuery('.dlab-chat-history-back').on('click',function(){
			jQuery('.dlab-chat-user-box').removeClass('d-none');
			jQuery('.dlab-chat-history-box').addClass('d-none');
		}); 
		
		jQuery('.dlab-fullscreen').on('click',function(){
			jQuery('.dlab-fullscreen').toggleClass('active');
		});
        
        /* var vHeight = function(){ */
            
        /* } */
        
        
	}
	
	
	
	var handleDzFullScreen = function() {
		jQuery('.dlab-fullscreen').on('click',function(e){
			if(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement) { 
				/* Enter fullscreen */
				if(document.exitFullscreen) {
					document.exitFullscreen();
				} else if(document.msExitFullscreen) {
					document.msExitFullscreen(); /* IE/Edge */
				} else if(document.mozCancelFullScreen) {
					document.mozCancelFullScreen(); /* Firefox */
				} else if(document.webkitExitFullscreen) {
					document.webkitExitFullscreen(); /* Chrome, Safari & Opera */
				}
			} 
			else { /* exit fullscreen */
				if(document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen();
				} else if(document.documentElement.webkitRequestFullscreen) {
					document.documentElement.webkitRequestFullscreen();
				} else if(document.documentElement.mozRequestFullScreen) {
					document.documentElement.mozRequestFullScreen();
				} else if(document.documentElement.msRequestFullscreen) {
					document.documentElement.msRequestFullscreen();
				}
			}		
		});
	}
	/* counter */
	
	var handleCounter = function(){
		if(jQuery(".counter").length>0) {
			 $(document).ready(function () {
				$('.counter').counterUp({
					delay: 10,
					time: 1000
				});
			});
		}
		
	}
	var handleshowPass = function(){
		jQuery('.show-pass').on('click',function(){
			jQuery(this).toggleClass('active');
			if(jQuery('#dlab-password').attr('type') == 'password'){
				jQuery('#dlab-password').attr('type','text');
			}else if(jQuery('#dlab-password').attr('type') == 'text'){
				jQuery('#dlab-password').attr('type','password');
			}
		});
	}
	
	var heartBlast = function (){
		$(".heart").on("click", function() {
			$(this).toggleClass("heart-blast");
		});
	}
	
	var handleDzLoadMore = function() {
		$(".dlab-load-more").on('click', function(e)
		{
			e.preventDefault();	//STOP default action
			$(this).append(' <i class="fas fa-sync"></i>');
			
			var dlabLoadMoreUrl = $(this).attr('rel');
			var dlabLoadMoreId = $(this).attr('id');
			
			$.ajax({
				method: "POST",
				url: dlabLoadMoreUrl,
				dataType: 'html',
				success: function(data) {
					$( "#"+dlabLoadMoreId+"Content").append(data);
					$('.dlab-load-more i').remove();
				}
			})
		});
	}
	
	var handleLightgallery = function () {
		if (jQuery('#lightgallery').length > 0) {
			lightGallery(document.getElementById('lightgallery'), {
				plugins: [lgThumbnail, lgZoom],
				selector: '.lg-item',
				thumbnail: true,
				exThumbImage: 'data-src'
			});
		}
	}
	var handleCustomFileInput = function() {
		$(".custom-file-input").on("change", function() {
			var fileName = $(this).val().split("\\").pop();
			$(this).siblings(".custom-file-label").addClass("selected").html(fileName);
		});
	}
    
  	var vHeight = function(){
        var ch = $(window).height() - 206;
        $(".chatbox .msg_card_body").css('height',ch);
    }
    
	var domoPanel = function(){
		$('.dlab-demo-trigger').on('click', function() {
				$('.dlab-demo-panel').addClass('show');
		  });
		  $('.dlab-demo-close, .bg-close').on('click', function() {
				$('.dlab-demo-panel').removeClass('show');
		  });
		  
		  $('.dlab-demo-bx').on('click', function() {
			  $('.dlab-demo-bx').removeClass('demo-active');
			  $(this).addClass('demo-active');
		  });
	} 
	
	
	
	var handleCkEditor = function(){
		if(jQuery("#ckeditor").length>0) {
			ClassicEditor
			.create( document.querySelector( '#ckeditor' ), {
				simpleUpload: {
                    uploadUrl: 'ckeditor-upload.php', 
                }
			} )
			.then( editor => {
				window.editor = editor;
			} )
			.catch( err => {
				console.error( err.stack );
			} );
		}
	}
	
	
	var handleMenuPosition = function(){
		
		if(screenWidth > 1024){
			$(".metismenu  li").unbind().each(function (e) {
				if ($('ul', this).length > 0) {
					var elm = $('ul:first', this).css('display','block');
					var off = elm.offset();
					var l = off.left;
					var w = elm.width();
					var elm = $('ul:first', this).removeAttr('style');
					var docH = $("body").height();
					var docW = $("body").width();
					
					if(jQuery('html').hasClass('rtl')){
						var isEntirelyVisible = (l + w <= docW);	
					}else{
						var isEntirelyVisible = (l > 0)?true:false;	
					}
						
					if (!isEntirelyVisible) {
						$(this).find('ul:first').addClass('left');
					} else {
						$(this).find('ul:first').removeClass('left');
					}
				}
			});
		}
	}
	/* Handle Page On Scroll ============ */
	var handlePageOnScroll = function(event){
		
		'use strict';
		var headerHeight = parseInt($('.header').css('height'), 10);
		
		$('.navbar-nav .scroll').on('click', function(event) 
		{
			event.preventDefault();
			
			console.log(jQuery(this).attr('href'));
			jQuery('.navbar-nav .scroll').parent().removeClass('active');
			jQuery(this).parent().addClass('active');
			
			if (this.hash !== "") {
				var hash = this.hash;	
				var seactionPosition = parseInt($(hash).offset().top, 10);
				
					var headerHeight =   parseInt($('.header .header-content').css('height'), 10);
				
				
				var scrollTopPosition = seactionPosition - headerHeight;
				$('html, body').animate({
					scrollTop: scrollTopPosition
				}, 800, function(){
					
				});
			}   
		});
		pageOnScroll();
		
	}

	/* Page On Scroll ============ */
	var pageOnScroll = function(event){
		
		if(jQuery('.navbar-nav').length > 0){
			
			var headerHeight = parseInt(jQuery('.header').height(), 10);
			
			jQuery(document).on("scroll", function(){
				
				var scrollPos = jQuery(this).scrollTop();
				jQuery('.navbar-nav .scroll').each(function () {
					var elementLink = jQuery(this);
					//
					var refElement = jQuery(elementLink.attr("href"));
					var seactionPosition = parseInt(jQuery(this.hash).offset().top, 10);
					var scrollTopPosition = (seactionPosition - headerHeight);
					
					
					//
					if (scrollTopPosition <= scrollPos){
						//console.log(elementLink.parent());
						jQuery('.navbar-nav .scroll').parent().removeClass('active');
						elementLink.parent().addClass("active");
					}
				});
				
			});
		}
	} 

	var handleCustomActions = function(){
		jQuery('.w3-delete').on('click',function(){
			jQuery(this).parents('tr').attr('style','background-color:red !important').fadeOut('slow',function(){
				jQuery(this).remove();
			});
		});
	}
	var handleImageSelect = function(){

		const $_SELECT_PICKER = $('.image-select');
		$_SELECT_PICKER.find('option').each((idx, elem) => {
			const $OPTION = $(elem);
			const IMAGE_URL = $OPTION.attr('data-thumbnail');
			if (IMAGE_URL) {
				$OPTION.attr('data-content', "<img src='%i'/> %s".replace(/%i/, IMAGE_URL).replace(/%s/, $OPTION.text()))
			}
		});
		$_SELECT_PICKER.selectpicker();
	}
	var handleDatetimepicker = function(){
		//    if(jQuery(".datepicker").length>0) {
		//        $('.datepicker').datetimepicker();
		//    }
			if(jQuery('.bt-datepicker').length > 0){
				$(".bt-datepicker").datepicker({ 
					autoclose: true, 
					todayHighlight: true
				}).datepicker('update', new Date());
			}
	   }

	   var handleThemeMode = function() {
		if(jQuery(".dz-theme-mode").length>0) {
	
			jQuery('.dz-theme-mode').on('click',function(){
				jQuery(this).toggleClass('active');
				console.log(jQuery(this).hasClass('active'));
				if(jQuery(this).hasClass('active')){
					jQuery('body').attr('data-theme-version','dark');
					setCookie('version', 'dark');
				}else{
					jQuery('body').attr('data-theme-version','light');
					setCookie('version', 'light');
				}
			});
			var version = getCookie('version');
			if(version != null){	
				jQuery('body').attr('data-theme-version', version);
			}
			jQuery('.dz-theme-mode').removeClass('active');
			
			jQuery(window).on('resize',function () {
				var version = getCookie('version');
				if(version != null){
					jQuery('body').attr('data-theme-version', version);
				}
			})
			
			setTimeout(function(){
				if(jQuery('body').attr('data-theme-version') === "dark")
				{
					jQuery('.dz-theme-mode').addClass('active');
				}
			},1600)
		}
	}
	var setCurrentYear = function(){
		const currentDate = new Date();
		let currentYear = currentDate.getFullYear();
	   let elements = document.getElementsByClassName('current-year'); 

		  for (const element of elements) {
		  element.innerHTML = currentYear;
	  }

}
  
	/* Header Fixed ============ */
	var headerFix = function(){
		'use strict';
		/* Main navigation fixed on top  when scroll down function custom */		
		jQuery(window).on('scroll', function () {
			
			if(jQuery('.header').length > 0){
				var menu = jQuery('.header');
				$(window).scroll(function(){
				  var sticky = $('.header'),
					  scroll = $(window).scrollTop();

				  if (scroll >=50){ sticky.addClass('is-fixed');
									}else {sticky.removeClass('is-fixed');}
				});				
			}
			
		});
		/* Main navigation fixed on top  when scroll down function custom end*/
	}
  
  
	/* Function ============ */
	return {
		init:function(){
			handleMetisMenu();
			handleAllChecked();
			handleNavigation();
			handleCurrentActive();
			handleMiniSidebar();
			handleDataAction();
			handleHeaderHight();
			handleMenuTabs();
			handleChatbox();
			handleMenuWallet();
			handleBtnNumber();
			handleDzChatUser();
			handleDzFullScreen();
			handleshowPass();
			heartBlast();
			handleThemeMode();
			handleDzLoadMore();
			handleLightgallery();
			handleCustomFileInput();
			vHeight();
			domoPanel();
			handleDatetimepicker();
			handleCkEditor();
			handleImageSelect();
			headerFix();
			handlePageOnScroll();
			handleSelectPicker();
			handleCounter();
			handleDZhoverMove();
			handleMinHeight();
			setCurrentYear();
		},

		
		load:function(){
			handlePreloader();
			handleCustomActions();
		},
		
		resize:function(){
			screenWidth = $( window ).width();
			vHeight();
			handleMenuWallet();
			
		},
		
		handleMenuPosition:function(){
			
			handleMenuPosition();
		},
	}
	
}();

/* Document.ready Start */	
jQuery(document).ready(function() {
	$('[data-bs-toggle="popover"]').popover();
    'use strict';
	Jiade.init();
	
});
/* Document.ready END */

/* Window Load START */
jQuery(window).on('load',function () {
	'use strict'; 
	Jiade.load();
	setTimeout(function(){
			Jiade.handleMenuPosition();
	}, 1000);
	
});
/*  Window Load END */
/* Window Resize START */
jQuery(window).on('resize',function () {
	'use strict'; 
	Jiade.resize();
	setTimeout(function(){
			Jiade.handleMenuPosition();
	}, 1000);
});
/*  Window Resize END */