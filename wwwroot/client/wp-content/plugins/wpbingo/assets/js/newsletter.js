/**
 * Theme functions file
 *
 * Contains handlers for navigation, accessibility, header sizing
 * footer widgets and Featured Content slider
 *
 */
( function( $ ) {
	"use strict";
// Enable menu toggle for small screens.
	$(document).ready(function() {
		_wpbingo_count_view_product();
		$('.newsletterpopup .close-popup').on( "click", function(){
			_wpbingo_HideNLPopup();
			$.cookie("floomi_lpopup", 1, { expires : 24 * 60 * 60 * 1000 });
		});
		$('.newsletterpopup_overlay').on( "click", function(){
			_wpbingo_HideNLPopup();
			$.cookie("floomi_lpopup", 1, { expires : 24 * 60 * 60 * 1000 });
		});			
	});
	/* Show/hide NewsLetter Popup */
	$( window ).load(function() {
		_wpbingo_campbar();
		_wpbingo_ShowNLPopup();
	});
	/* Function Show NewsLetter Popup */
	function _wpbingo_ShowNLPopup() {
		if($('.newsletterpopup').length){
			var cookieValue = $.cookie("floomi_lpopup");
			if(cookieValue == 1) {
				$('#newsletterpopup').removeClass('show');
			}else{
				$('#newsletterpopup').addClass('show');
				setTimeout(function(){
					$('#newsletterpopup').addClass('transition');
				}, 300);
			}				
		}
	}
	/* Function Hide NewsLetter Popup when click on button Close */
	function _wpbingo_HideNLPopup(){
		$('#newsletterpopup').removeClass('transition');
		setTimeout(function(){
			$('#newsletterpopup').removeClass('show');
		}, 300);
	}
	/* Function Count View Product */
	function _wpbingo_count_view_product() {
		if( $(".product-count-view").length > 0 ){
			var id_product = $(".product-count-view").data("id_product");
			var min = $(".product-count-view").data("min") ? $(".product-count-view").data("min") : 30;
			var max = $(".product-count-view").data("max") ? $(".product-count-view").data("max") : 40;
			var timeout = $(".product-count-view").data("timeout") ? $(".product-count-view").data("timeout") : 10000;
			var cookieValue = $.cookie("product_"+id_product);
			if(cookieValue) {
				$("span",".product-count-view").html(cookieValue);
			}else{
				var rand = Math.round(Math.random() * (max - min)) + min;
				$("span",".product-count-view").html(rand);
				$.cookie("product_"+id_product, rand, { expires : 24 * 60 * 60 * 1000 });
			}
			setTimeout(function random() {
				var auto = Math.round(Math.random() * (max - min)) + min;
				$("span",".product-count-view").html(auto);
				setTimeout(random, timeout);
			}, timeout);
		}
	}
	function _wpbingo_campbar(){
		$(".close-campbar").on( "click", function() {
			$('.header-campbar').slideUp();
			$.cookie("floomi_campbar", 1, { expires : 24 * 60 * 60 * 1000 });
		});
		var cookieValue = $.cookie("floomi_campbar");
		if(cookieValue == 1) {
			$('.header-campbar').hide();
		}else{
			$('.header-campbar').removeClass('hidden');
		}
	}
} )( jQuery );