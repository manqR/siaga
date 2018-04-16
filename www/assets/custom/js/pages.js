'use strict';


/*
|------------------------------------------------------------------------------
| Cart
|------------------------------------------------------------------------------
*/

myApp.onPageInit('cart', function(page) {

	updateAmount();

	/* Change Quantity */
	$$('.page[data-page=cart] [data-action=change-quantity]').on('click', function(e) {
		e.preventDefault();
		var el = $(this).closest('.swipeout');
		var el_product_quantity = el.find('.product-quantity');
		var product_unit_price = el.find('.item-after').data('unit-price');
		var el_product_amount = el.find('.product-amount'); 
		myApp.prompt('Quantity', 
      function(value) {
        if(value > 0) {
					el_product_quantity.text(value);
					el_product_amount.text(product_unit_price * value);
				}
				updateAmount();
      }
    );
		myApp.swipeoutClose(el);
	});

	/* Remove Product */
	$$('.page[data-page=cart] [data-action=remove-product]').on('click', function(e) {
		e.preventDefault();
		var el = $(this).closest('.swipeout');
		myApp.confirm('Do you want to remove this product from cart?', 
			function() {
        myApp.swipeoutDelete(el, function(){
					myApp.addNotification({
						message: 'Removed from cart successfully.',
						hold: 1500,
						button: {
							text: ''
						},
						onClose: function() {
							updateAmount();
						}
					});
				});
      },
			function() {
				myApp.swipeoutClose(el);
			}
    );
	});

	function updateAmount() {
		var product_count = 0;
		var subtotal = 0;
		var discount = 0;
		var shipping_charges = 0;
		var grand_total = 0;

		product_count = $('.page[data-page=cart] .products-list li').length;

		$$('.page[data-page=cart] .products-list li').each(function() {
			var unit_price = $$(this).find('[data-unit-price]').data('unit-price');
			var quantity = $$(this).find('.product-quantity').text();
			subtotal += parseInt(unit_price * quantity);
			$$(this).find('.product-amount').text(parseInt(unit_price * quantity));
		})

		discount = (subtotal * $$('.page[data-page=cart] [data-discount-percent]').data('discount-percent')) / 100;

		shipping_charges = parseInt($$('.page[data-page=cart] .shipping-charges').text());

		grand_total = parseInt(subtotal - discount + shipping_charges);

		$$('.page[data-page=cart] .product-count').text(product_count);
		$$('.page[data-page=cart] .subtotal').text(subtotal);
		$$('.page[data-page=cart] .discount').text(discount);
		$$('.page[data-page=cart] .payable-amount').text(grand_total);
		$$('.page[data-page=cart] .toolbar-bottom .grand-total').text('₹' + grand_total);
	}

});

/*
|------------------------------------------------------------------------------
| Checkout
|------------------------------------------------------------------------------
*/

myApp.onPageInit('checkout', function(page) {

	$$('.page[data-page=checkout] [data-action=show-tab-address]').on('click', function(e) {
		e.preventDefault();
		myApp.showTab('#tab-address');
	});

	$('.page[data-page=checkout] form[name=shipping-address]').validate({
		rules: {
			name: {
				required: true
			},
			address: {
				required: true
			},
			city: {
				required: true
			},
			zip: {
				required: true
			}
		},
    messages: {
			name: {
				required: 'Please enter name.'
			},
			address: {
				required: 'Please enter address.'
			},
			city: {
				required: 'Please enter city.'
			},
			zip: {
				required: 'Please enter ZIP.'
			}
		},
		onkeyup: false,
    errorElement : 'div',
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().siblings('.input-error'));
		},
		submitHandler: function(form) {
			myApp.showTab('#tab-payment');
		}
	});

	$('.page[data-page=checkout] form[name=payment]').validate({
		ignore: '',
		rules: {
			payment_method: {
				required: true
			}
		},
    messages: {
			payment_method: {
				required: 'Please select a payment method.'
			}
		},
		onkeyup: false,
    errorElement : 'div',
		errorPlacement: function(error, element) {
			if(element.attr('name') == 'payment_method')
			{
				error.appendTo(element.parent().parent().siblings('li').find('.input-error'));	
			}
			else {
				error.appendTo(element.parent().siblings('.input-error'));	
			}
		},
		submitHandler: function(form) {
			myApp.showTab('#tab-done');
		}
	});

});


/*
|------------------------------------------------------------------------------
| Feedback
|------------------------------------------------------------------------------
*/

myApp.onPageInit('feedback', function(page) {

	$$('.page[data-page=feedback] form[name=feedback]').on('submit', function(e) {
		e.preventDefault();
		myApp.addNotification({
       message: 'Thank you for your valuable feedback.',
			hold: 2000,
			button: {
				text: ''
			}
		});
		mainView.router.load({
			url: 'home.html'
		});
	});

});

/*
|------------------------------------------------------------------------------
| Home
|------------------------------------------------------------------------------
*/

myApp.onPageInit('home', function(page) {

	// MAP		
	$(function() {
		var map = new GMaps({
			el: '#map',
      lat: -6.1828052,
      lng: 106.8308969,
      zoom: 14, 
      zoomControl: true,
      zoomControlOpt: {
				style: 'SMALL',
        position: 'TOP_LEFT'
      },
      panControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      overviewMapControl: false
    });

		map.addMarker({
			lat: -6.1828052,
			lng: 106.8308969,
			icon: {
				path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: '#DBBD31',
        fillOpacity: 1,
        strokeColor: '#000000',
        strokeWeight: 2,
        scale: 1
   		},
			animation: google.maps.Animation.DROP
		});

		map.addStyle({
			styledMapName: 'Light Monochrome',
      styles: snazzyMaps.lightMonochrome,
      mapTypeId: 'lightMonochrome'  
		});

    map.setStyle('lightMonochrome');
	});

	/* Hero Slider */
	
	var html = '';
	var slider = '';
	$.get(`${URL}/x-mob-slider.php`, 
		function(data, status){
			//myApp.hideIndicator();
			var slidex = '';		
			if(data != null){
	
				data.map((slide) => {	
					slidex +='<div class="swiper-slide" style="background-image: url('+slide.IMG_SLIDE+');">'+
								'<div class="slide-content">'+
								'</div>'+
							'</div>';					
					
				})

				slider = '<div class="swiper-container">'+
							'<div class="swiper-wrapper" >'+
							
								slidex +
								
							'</div>'+
							'<div class="swiper-pagination"></div>'+
						'</div>';
			
				$$(".swiper-wrapper").css("height", "");
				$$(".swiper-wrapper img").css("display", "none");
				$$("#temp_preview").css("display", "none");

				document.getElementById("inner_slider").innerHTML = '';
				document.getElementById("inner_slider").innerHTML = slider;

				// var mySwiper = myApp.swiper('.swiper-container', {
				// 	pagination:'.swiper-pagination',
				// 	speed: 400,
				// });
				myApp.swiper('.page[data-page=home] .slider-hero .swiper-container', {
					autoplay: 10000,
					loop: true,
					pagination: '.swiper-pagination',
					paginationClickable: true
				});
				//console.log(slidex);
		
			}
		}
	);

	/* menu home */
	var largest = 0

	$(".Tr6Hj").each(function(){
		var findHeight = $(this).height();
		if(findHeight > largest){
			largest = findHeight;
		}  
	});
	var Findwidth = $(window).width();	
	if(largest <= 62 && Findwidth < 375){ //Based on Iphone 7 width
		largest = largest+10; //Resolusi Iphone 7 kebawah		
		$(".Tr6Hj").css({"height":largest+"px"});
	}else{
		largest = largest+10; //Resolusi Iphone 7 keatas
		$(".Tr6Hj").css({"height":largest+"px"});
	}	
	/* end menu home */


	

});


/*
|------------------------------------------------------------------------------
| News Article
|------------------------------------------------------------------------------
*/

myApp.onPageInit('news-article', function(page) {

	$('.popup-article-comment form[name=article-comment]').validate({
		rules: {
			name: {
				required: true
			},
			email: {
				required: true,
        email:true
      },
      comment: {
				required: true
			}
		},
    messages: {
			name: {
				required: 'Please enter name.'
			},
			email: {
				required: 'Please enter email address.',
        email: 'Please enter a valid email address.'
      },
			comment: {
				required: 'Please enter comment.'
      }
		},
		ignore: '',
		onkeyup: false,
    errorElement : 'div',
		errorPlacement: function(error, element) {
			error.appendTo(element.parent().siblings('.input-error'));
		},
		submitHandler: function(form) {
			myApp.addNotification({
				message: 'Thank You',
				hold: 1500,
				button: {
					text: ''
				}
			});
			myApp.closeModal('.popup-article-comment');
		}
	});

	$$('.page[data-page=news-article] [data-action=share-article]').on('click', function(e) {
		e.preventDefault();
		var buttons = [
			{
        text: 'Share Article',
				label: true
      },
			{
				text: '<i class="fa fa-fw fa-lg fa-envelope-o color-red"></i>&emsp;<span>Email</span>'
			},
			{
				text: '<i class="fa fa-fw fa-lg fa-facebook color-facebook"></i>&emsp;<span>Facebook</span>'
			},
			{
				text: '<i class="fa fa-fw fa-lg fa-google-plus color-googleplus"></i>&emsp;<span>Google+</span>'
			},
			{
				text: '<i class="fa fa-fw fa-lg fa-linkedin color-linkedin"></i>&emsp;<span>LinkedIn</span>'
			},
			{
				text: '<i class="fa fa-fw fa-lg fa-twitter color-twitter"></i>&emsp;<span>Twitter</span>'
			},
			{
				text: '<i class="fa fa-fw fa-lg fa-whatsapp color-whatsapp"></i>&emsp;<span>WhatsApp</span>'
			}
    ];
		myApp.actions(buttons);
	});

});	

/*
|------------------------------------------------------------------------------
| Splash Screen
|------------------------------------------------------------------------------
*/

myApp.onPageInit('splash-screen', function(page) {

	// new Vivus('logo', {
	// 	duration: 125,
	// 	onReady: function(obj) {
	// 		obj.el.classList.add('animation-begin');
	// 	}
	// },
	// function(obj) {
	// 	obj.el.classList.add('animation-finish');

	// 	/* 3 seconds after logo animation is completed, open walkthrough screen. */
	// 	setTimeout(function(){
	// 		mainView.router.load({
	// 			url: 'walkthrough.html'
	// 		});
	// 	}, 2000);
	// });
		setTimeout(function(){
			mainView.router.load({
				url: 'walkthrough.html'
			});
		}, 2000);
	/* 1 second after page is loaded, show preloader. */
	setTimeout(function() {
		$$('.page[data-page=splash-screen] .splash-preloader').css('opacity', 1);
	}, 1000);

});


/*
|------------------------------------------------------------------------------
| Walkthrough
|------------------------------------------------------------------------------
*/

myApp.onPageInit('walkthrough', function(page) {

	/* Initialize Slider */
	myApp.swiper('.page[data-page=walkthrough] .walkthrough-container', {
		pagination: '.page[data-page=walkthrough] .walkthrough-pagination',
		paginationClickable: true
	});
	

});