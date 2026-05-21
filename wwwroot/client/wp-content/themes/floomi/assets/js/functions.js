/**
 * Theme functions file
 *
 * Contains handlers for navigation, accessibility, header sizing
 * footer widgets and Featured Content slider
 *
 */
( function( $ ) {
	"use strict";
	var _body    = $( 'body' ),
		_window = $( window );
	$(document).ready(function() {
		_event_groupvariation_image();
		_filter_ajax_sort_count();
		_sticky_product();
		_sticky_nextproduct();
		_search_toggle();
		_categories_menu_toggle();
		_menu_categories();
		_back_to_top();
		_toggle_categories();
		_event_single_image();
		_event_ajax_search();
		_event_circlestime();
		_event_change_variation();
		_event_accordion_slider();
		_remove_animation_tab_visua();
		_event_video_product();
		_come_back();
		_event_single_sticky_grid();
		_load_video_popup();
		_moreverticalMenu();
		_click_button();
		_tab_information_mobile();
		_tab_description_accordion();
		_click_add_to_cart_icon();
		_click_add_to_cart_icon_text();
		_after_add_to_cart();
		_add_to_cart_single_product();
		_click_attribute_image();
		_update_total_wishlist();
		_active_form_login();
		_load_event_countdown();
		_load_360_view_product();
		_load_sale_nofication();
		_ajax_cart_header();
		_ajax_cart_page();
		_mouse_move_event();
		_click_copy_coupon();
		_click_copy_product_link();
		_click_quickview_button();
		_event_quick_buy();
		_change_variations_stock();
		_event_countdown_variation();
		_event_variations_select();
		_load_marquee();
		_header_slider();
		_phinfo_show_hover_info();
		_change_bmsm_variations();
		_load_product_hover_zoom();
		_fire_work();
		if(!$('body').hasClass('elementor-page')){
			_event_variable_thumb();
		}
		const selectors = [
			".related .bwp-swiper-slider",
			".recent-view .bwp-swiper-slider",
			".post-related .bwp-swiper-slider",
			".upsells .bwp-swiper-slider",
			".cross_sell .bwp-swiper-slider",
			".woocommerce-product-subcategorie-content .bwp-swiper-slider",
			".header-campbar .bwp-swiper-slider"
		];
		selectors.forEach(selector => _load_swiper_carousel($(selector)));
		$(".gallery-slider .bwp-swiper-slider").each(function(){
			_load_swiper_carousel($(this));
		});
		$(".bwp_recent_post_widget .bwp-swiper-slider").each(function(){
			_load_swiper_carousel($(this));
		});
		$(".wpbingo-countdown .wpbingo-countdown__content").each(function(){
			_wpbingo_countdown($(this));
		});
		window.addEventListener('load', () => {
			if( $('.related').length > 0 || $('.recent-view').length > 0 || $('.upsells').length > 0 || $('.cross_sell').length > 0 ){
				_load_swiper_product_nested();
			}
			
		});
	});
	$(document.body).on('wc_fragments_refreshed wc_fragments_loaded added_to_cart updated_wc_div', function() {
		if($('.woocommerce-cart-header').length){
			var totalStr = $('.woocommerce-cart-header').data('total_price');
			var totalClean = totalStr.toString().replace(/,/g, '');
			var total = parseFloat(totalClean);
			var shipStr = $('.woocommerce-cart-header').data('free_ship');
			var shipClean = shipStr.toString().replace(/,/g, '');
			var ship = parseFloat(shipClean);
			if(total>=ship){
				if(!$('.floomi-topcart').hasClass('fire-done')){
					$('.floomi-topcart').addClass('fire-done');
					_fire_work(true);
				}
			}else{
				$('.floomi-topcart').removeClass('fire-done');
			}
		}
    });
	$( document.body ).on( 'updated_cart_totals', function(){
		_ajax_cart_page();
	});
	_window.resize(function() {
		_moreverticalMenu();
	});

    function _fire_work($active) {
		if($('#fire_work').length > 0){
			const confetti = document.getElementById('fire_work');
			const confettiCtx = confetti.getContext('2d');
			let container, confettiElements = [], clickPosition;
			var rand = (min, max) => Math.random() * (max - min) + min;
			const confettiParams = {
				number: 120,
				size: { x: [4, 8], y: [8, 12] },
				initSpeed: 100,
				gravity: 4.5,
				drag: 0.3,
				terminalVelocity: 8,
				flipSpeed: 0.1 
			};
			const colors = [
				{ front : '#3B870A', back: '#235106' },
				{ front : '#B96300', back: '#6f3b00' },
				{ front : '#E23D34', back: '#88251f' },
				{ front : '#CD3168', back: '#7b1d3e' },
				{ front : '#664E8B', back: '#3d2f53' },
				{ front : '#394F78', back: '#222f48' },
				{ front : '#008A8A', back: '#005353' },
			];
			setupCanvas();
			updateConfetti();
			window.addEventListener('resize', () => {
				setupCanvas();
				hideConfetti();
			});
			function Conf() {
				this.randomModifier = rand(-1, 1);
				this.colorPair = colors[Math.floor(rand(0, colors.length))];
				this.dimensions = {
					x: rand(confettiParams.size.x[0], confettiParams.size.x[1]),
					y: rand(confettiParams.size.y[0], confettiParams.size.y[1]),
				};
				this.position = {
					x: clickPosition[0],
					y: clickPosition[1]
				};
				this.rotation = rand(0, 2 * Math.PI);
				this.scale = { x: 1, y: 1 };
				this.velocity = {
					x: rand(-confettiParams.initSpeed, confettiParams.initSpeed) * 0.4,
					y: rand(-confettiParams.initSpeed, confettiParams.initSpeed)
				};
				this.flipSpeed = rand(0.2, 1.5) * confettiParams.flipSpeed;
				if (this.position.y <= container.h) {
					this.velocity.y = -Math.abs(this.velocity.y);
				}
				this.terminalVelocity = rand(1, 1.5) * confettiParams.terminalVelocity;
				this.update = function () {
					this.velocity.x *= 0.98;
					this.position.x += this.velocity.x;

					this.velocity.y += (this.randomModifier * confettiParams.drag);
					this.velocity.y += confettiParams.gravity;
					this.velocity.y = Math.min(this.velocity.y, this.terminalVelocity);
					this.position.y += this.velocity.y;

					this.scale.y = Math.cos((this.position.y + this.randomModifier) * this.flipSpeed);
					this.color = this.scale.y > 0 ? this.colorPair.front : this.colorPair.back;
				}
			}
			function updateConfetti () {
				confettiCtx.clearRect(0, 0, container.w, container.h);
				confettiElements.forEach((c) => {
					c.update();
					confettiCtx.translate(c.position.x, c.position.y);
					confettiCtx.rotate(c.rotation);
					const width = (c.dimensions.x * c.scale.x);
					const height = (c.dimensions.y * c.scale.y);
					confettiCtx.fillStyle = c.color;
					confettiCtx.fillRect(-0.5 * width, -0.5 * height, width, height);
					confettiCtx.setTransform(1, 0, 0, 1, 0, 0)
				});
				confettiElements.forEach((c, idx) => {
					if (c.position.y > container.h ||
						c.position.x < -0.5 * container.x ||
						c.position.x > 1.5 * container.x) {
						confettiElements.splice(idx, 1)
					}
				});
				window.requestAnimationFrame(updateConfetti);
			}
			function setupCanvas() {
				container = {
					w: confetti.clientWidth,
					h: confetti.clientHeight
				};
				confetti.width = container.w;
				confetti.height = container.h;
			}
			function addConfetti(e) {
				const canvasBox = confetti.getBoundingClientRect();
				if (e) {
					clickPosition = [
						e.clientX - canvasBox.left,
						e.clientY - canvasBox.top
					];
				} else {
					clickPosition = [
						canvasBox.width * Math.random(),
						canvasBox.height * Math.random()
					];
				}
				for (let i = 0; i < confettiParams.number; i++) {
					confettiElements.push(new Conf())
				}
			}
			function hideConfetti() {
				confettiElements = [];
				window.cancelAnimationFrame(updateConfetti)
			}
			function confettiLoop() {
				for (let i = 0; i < 8; i++) {
					addConfetti();
				}
			}
			if($active){
				confettiLoop();
				return;
			}
			var totalStr = $('.woocommerce-cart-header').data('total_price');
			var totalClean = totalStr.toString().replace(/,/g, '');
			var total = parseFloat(totalClean);
			var shipStr = $('.woocommerce-cart-header').data('free_ship');
			var shipClean = shipStr.toString().replace(/,/g, '');
			var ship = parseFloat(shipClean);
			if(total>=ship){
				if(!$('.floomi-topcart').hasClass('fire-done')){
					$('.floomi-topcart').addClass('fire-done');
				}
			}else{
				$('.floomi-topcart').removeClass('fire-done');
			}
		}
	}

	function _banner_products_button() {
	    $('.bwp-banner-products').on('mouseenter', function() {
	        $(this).find('.bwp-banner-products-content').addClass('active');
	    });

	    $('.bwp-banner-products').on('mouseleave', function() {
	        $(this).find('.bwp-banner-products-content').removeClass('active');
	    });
	}

	function _load_product_hover_zoom(){
        $('.product-hover-zoom').each(function() {
            var $container = $(this);
            var $img = $container.find('.zoom-image');
            var zoomSrc = $img.data('zoom');
 
            if (!zoomSrc) return;
 
            $container.on('mousemove', function(e) {
                var offset = $container.offset();
                var x = e.pageX - offset.left;
                var y = e.pageY - offset.top;
                var width = $container.width();
                var height = $container.height();
 
                var xPercent = (x / width) * 100;
                var yPercent = (y / height) * 100;
 
                $img.css({
                    'transform-origin': xPercent + '% ' + yPercent + '%',
                    'transform': 'scale(1.5)'
                });
            });
 
            $container.on('mouseleave', function() {
                $img.css({
                    'transform': 'scale(1)',
                    'transform-origin': 'center center'
                });
            });
 
            $container.on('touchstart', function(e) {
                if (zoomSrc) {
                    $img.attr('src', zoomSrc);
                }
            });
 
            $container.on('touchmove', function(e) {
                var touch = e.originalEvent.touches[0];
                var offset = $container.offset();
                var x = touch.pageX - offset.left;
                var y = touch.pageY - offset.top;
                var width = $container.width();
                var height = $container.height();
 
                var xPercent = (x / width) * 100;
                var yPercent = (y / height) * 100;
 
                $img.css({
                    'transform-origin': xPercent + '% ' + yPercent + '%',
                    'transform': 'scale(1.5)'
                });
 
                e.preventDefault();
            });
 
            $container.on('touchend', function() {
                $img.css({
                    'transform': 'scale(1)',
                    'transform-origin': 'center center'
                });
            });
        });
    }
	function _load_swiper_product_nested() {
	    var sliders = document.querySelectorAll('.product-thumb-swiper');
	    sliders.forEach(function (slider) {
	        if (slider.swiper) {
	            slider.swiper.update();
	            if (slider.swiper.pagination && typeof slider.swiper.pagination.update === 'function') {
	                slider.swiper.pagination.update();
	            }
	            return;
	        }
	        var swiperChild = new Swiper(slider, {
	            slidesPerView: 1,
	            loop: false,
	            nested: true,
	            autoHeight: true,
	            preloadImages: false,
	            speed: 600,
	            observer: true,
	            observeParents: true,
	            watchOverflow: true,
	            lazy: {
	                loadPrevNext: true,
	                loadOnTransitionStart: true
	            },
	            navigation: {
					nextEl: slider.querySelector('.swiper-button-next'),
					prevEl: slider.querySelector('.swiper-button-prev'),
				},
	            pagination: {
	                el: slider.querySelector('.swiper-pagination'),
	                clickable: true,
	            },
	            on: {
	                init: function () {
	                    this.update();
	                    if (this.pagination && typeof this.pagination.update === 'function') {
	                        this.pagination.update();
	                    }
	                },
	                slideChange: function () {
	                    if (this.pagination && typeof this.pagination.update === 'function') {
	                        this.pagination.update();
	                    }
	                }
	            }
	        });
	        swiperChild.on('slideChangeTransitionEnd imagesReady', function () {
	            let parentSwiper = slider.closest('.bwp-swiper-slider')?.swiper;
	            if (parentSwiper) {
	                parentSwiper.updateAutoHeight();
	            }
	        });
	    });
	}

	function _phinfo_show_hover_info() {
		const OFFSET_X = 30;
		const OFFSET_Y = 30; 
		const SHOW_DELAY = 200; // ms
		const REPOSITION_DELAY = 10; // ms

		let cursorX = 0;
		let cursorY = 0;
		let hoverTimer = null;
		let positionTimer = null;
		let isHovering = false;
		const tooltipCache = {};
		const $tooltip = $('#global-phinfo-tooltip');

		function positionTooltip() {
			if (!$tooltip.length || !$tooltip.is(':visible') || !isHovering) {
				return;
			}

			const tooltipWidth = $tooltip.outerWidth();
			const tooltipHeight = $tooltip.outerHeight();
			const windowWidth = $(window).width();
			const windowHeight = $(window).height();
			const scrollTop = $(window).scrollTop();
			const scrollLeft = $(window).scrollLeft();

			// Calculate optimal position
			let topPosition = cursorY - tooltipHeight - OFFSET_Y;
			let leftPosition = cursorX + OFFSET_X;

			// Make sure tooltip stays within viewport
			if (topPosition < scrollTop) {
				topPosition = cursorY + OFFSET_Y; // Show below cursor instead
			}
			
			if (topPosition + tooltipHeight > windowHeight + scrollTop) {
				topPosition = windowHeight + scrollTop - tooltipHeight - 10;
			}

			if (leftPosition + tooltipWidth > windowWidth + scrollLeft) {
				leftPosition = cursorX - tooltipWidth - OFFSET_X;
			}
			
			if (leftPosition < scrollLeft) {
				leftPosition = scrollLeft + 10;
			}

			// Apply position with animation for smoother movement
			$tooltip.css({
				top: topPosition,
				left: leftPosition,
				visibility: 'visible'
			});
		}

		function debouncePosition() {
			if (positionTimer) {
				clearTimeout(positionTimer);
			}
			positionTimer = setTimeout(positionTooltip, REPOSITION_DELAY);
		}

		const $targets = $('.product-thumb-img[data-product_id], .product-thumb-img .swiper-wrapper[data-product_id]');
		$targets.on('mousemove', function(e) {
			if (!isHovering) return;
			
			cursorX = e.pageX;
			cursorY = e.pageY;
			debouncePosition();
		});

		$targets.on('mouseenter', function(e) {
			const $target = $(this);
			cursorX = e.pageX;
			cursorY = e.pageY;
			isHovering = true;

			const productID = $target.data('product_id');

			// Clear any existing timers
			if (hoverTimer) clearTimeout(hoverTimer);
			if (positionTimer) clearTimeout(positionTimer);

			hoverTimer = setTimeout(() => {
				if (!isHovering) return;

				if (tooltipCache[productID]) {
					$tooltip
						.html(tooltipCache[productID])
						.css({
							display: 'block',
							visibility: 'hidden',
							top: '-9999px',
							left: '-9999px'
						});

					// Position tooltip after content is loaded
					setTimeout(() => {
						if (isHovering) positionTooltip();
					}, 0);
					return;
				}

				// Ajax load tooltip content
				$.ajax({
					url: floomi_ajax.ajaxurl,
					type: 'POST', 
					data: {
						action: 'phinfo_get_tooltip',
						product_id: productID
					},
					success: function(response) {
						if (!isHovering) return;

						if (response.success && response.data) {
							tooltipCache[productID] = response.data;
							$tooltip
								.html(response.data)
								.css({
									display: 'block',
									visibility: 'hidden',
									top: '-9999px',
									left: '-9999px'  
								});

							// Position tooltip after content is loaded
							setTimeout(() => {
								if (isHovering) positionTooltip();
							}, 0);
						} else {
							$tooltip.empty().hide();
						}
					}
				});
			}, SHOW_DELAY);
		});

		$targets.on('mouseleave', function() {
			isHovering = false;
			if (hoverTimer) clearTimeout(hoverTimer);
			if (positionTimer) clearTimeout(positionTimer);
			
			$tooltip.fadeOut(100, function() {
				$(this).css({
					display: 'none',
					visibility: 'hidden'
				});
			});
		});

		// Handle window resize
		let resizeTimer;
		$(window).on('resize', function() {
			if (resizeTimer) clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				if (isHovering) positionTooltip();
			}, 100);
		});
	}

	function initCounterWidget(element) {
		const selectors = {
			counterNumber: '.bwp-counter-number'
		};
		const $counterNumber = $(element).find(selectors.counterNumber);
	
		if ($counterNumber.length === 0) return;
	
		const intersectionObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					observer.unobserve($counterNumber[0]);
	
					const data = $counterNumber.data();
					const decimalDigits = data.toValue.toString().match(/\.(.*)/);
	
					if (decimalDigits) {
						data.rounding = decimalDigits[1].length;
					}
	
					$counterNumber.numerator(data);
				}
			});
		});
	
		intersectionObserver.observe($counterNumber[0]);
	}

	function _load_swiper_carousel($elements) {
		$elements.each(function () {
			var $this = $(this);
			if ($this.hasClass('swiper-initialized')) return;
	
			new Swiper($this[0], {
				loop: $this.data('loop') || false,
				speed: $this.data('speed') || 600,
				effect: $this.data('effect') || 'slide',
				centeredSlides: $this.data('centered') || false,
				grabCursor: $this.data('grab-cursor') || false,
				slidesPerGroup: $this.data('slides-per-group') || 1,
				autoplay: $this.data('autoplay') ? {
					delay: $this.data('autoplay-delay') || 5000,
					disableOnInteraction: $this.data('autoplay-disable') || false
				} : false,
				navigation: {
					nextEl: $this.find('.bwp-swiper-button-next')[0],
					prevEl: $this.find('.bwp-swiper-button-prev')[0],
				},
				pagination: {
					el: $this.find('.swiper-pagination')[0],
					clickable: true,
					type: $this.data('pagination-type') || 'bullets'
				},
				scrollbar: {
					el: $this.find('.swiper-scrollbar')[0],
					draggable: true
				},
				lazy: {
					loadPrevNext: true
				},
				breakpoints: {
					0: {
						slidesPerView: $this.data('slides-per-view-xs') || 2, 
						spaceBetween: $this.data('slides-space-xs') || 15 
					},
					320: { 
						slidesPerView: $this.data('slides-per-view-xs') || 2, 
						spaceBetween: $this.data('slides-space-xs') || 15 
					},
					576: { 
						slidesPerView: $this.data('slides-per-view-sm') || 3, 
						spaceBetween: $this.data('slides-space-sm') || 15 
					},
					768: { 
						slidesPerView: $this.data('slides-per-view-md') || 3, 
						spaceBetween: $this.data('slides-space-md') || 15 
					},
					1024: { 
						slidesPerView: $this.data('slides-per-view-lg') || 4, 
						spaceBetween: $this.data('slides-space-lg') || 30 
					}
				}
			});
		});
	}

	function _disable_swiper_if_needed() {
		let $single_product = $(".bwp-single-product");
		
		if ($(window).width() > 991 && 
			($single_product.hasClass("one_column") || 
			 $single_product.hasClass("grid") || 
			 $single_product.hasClass("grid_sticky") || 
			 $single_product.hasClass("two_column"))) {
			$(".bwp-single-product .bwp-swiper-slider").each(function () {
				let swiperInstance = this.swiper;
				if (swiperInstance) {
					swiperInstance.destroy(true, true);
				}
			});
			$(".bwp-single-product .bwp-swiper-thumbs").each(function () {
				let swiperInstance = this.swiper;
				if (swiperInstance) {
					swiperInstance.destroy(true, true);
				}
			});
		}
	}

	function _load_swiper_thumbs_carousel($elements) {

		$elements.each(function () {
			var $this = $(this);
			if ($this.hasClass('swiper-initialized')) return;
	
			let $thumbs = $(".bwp-single-product .bwp-swiper-thumbs");
			let $slider = $(".bwp-single-product .bwp-swiper-slider");
	
			if ($slider.length) {
				let isClickingThumb = false;
				let thumbsSwiper = null;
				let mainSwiper = null;
				let lastDirection = null;
	
				function initThumbsSwiper() {
					if ($thumbs.length === 0) return;
	
					let direction = window.innerWidth < 768 ? "horizontal" : ($thumbs.data("thumbs-direction") || "horizontal");
					let slidesPerView = direction === "vertical" ? "auto" : ($thumbs.data("thumbs-per-view") || 4);
	
					if (thumbsSwiper) {
						thumbsSwiper.destroy(true, true);
					}
	
					thumbsSwiper = new Swiper($thumbs[0], {
						slidesPerView: slidesPerView,
						slidesPerGroup: 1,
						spaceBetween: 15,
						direction: direction,
						autoHeight: true,
						watchSlidesVisibility: true,
						watchSlidesProgress: true,
						watchOverflow: true,
						freeMode: true,
						loop: false,
						observer: true,
						observeParents: true,
						observeSlideChildren: true,
						breakpoints: {
							768: {
								direction: $thumbs.data("thumbs-direction") || "horizontal",
							}
						},
					});
	
					thumbsSwiper.on("click", function () {
						isClickingThumb = true;
						let clickedIndex = thumbsSwiper.clickedIndex;
						if (typeof clickedIndex !== "undefined" && clickedIndex !== mainSwiper.activeIndex) {
							mainSwiper.slideTo(clickedIndex);
						}
						setTimeout(() => isClickingThumb = false, 300);
					});
	
					lastDirection = direction;
				}
	
				function initMainSwiper() {
					if (mainSwiper) {
						mainSwiper.destroy(true, true);
					}
	
					mainSwiper = new Swiper($slider[0], { 
						centeredSlides: $slider.data('centered') || false,
						loop: $slider.data('loop') || false,
						slidesPerGroup: 1,
						navigation: {
							nextEl: $slider.find('.bwp-swiper-button-next')[0],
							prevEl: $slider.find('.bwp-swiper-button-prev')[0],
						},
						pagination: {
							el: $slider.find('.swiper-pagination')[0],
							clickable: true,
							type: $slider.data('pagination-type') || 'bullets'
						},
						keyboard: {
							enabled: true,
						},
						thumbs: thumbsSwiper ? { swiper: thumbsSwiper } : undefined,
						on: {
							slideChange: function () {
								if (!mainSwiper || !mainSwiper.slides || mainSwiper.activeIndex === undefined) {
									return;
								}
								let currentSlide = mainSwiper.slides[mainSwiper.activeIndex];
								if (currentSlide.classList.contains("product-360")) {
									mainSwiper.allowTouchMove = false;
								} else {
									mainSwiper.allowTouchMove = true;
								}
							}
						},
						breakpoints: {
							0: {
								slidesPerView: $slider.data('slides-per-view-xs') || 1, 
								spaceBetween: $slider.data('slides-space-xs') || 15 
							},
							320: { 
								slidesPerView: $slider.data('slides-per-view-xs') || 1, 
								spaceBetween: $slider.data('slides-space-xs') || 15 
							},
							576: { 
								slidesPerView: $slider.data('slides-per-view-sm') || 1, 
								spaceBetween: $slider.data('slides-space-sm') || 15 
							},
							768: { 
								slidesPerView: $slider.data('slides-per-view-md') || 1, 
								spaceBetween: $slider.data('slides-space-md') || 15 
							},
							1024: { 
								slidesPerView: $slider.data('slides-per-view-lg') || 1, 
								spaceBetween: $slider.data('slides-space-lg') || 30 
							}
						}
					});
	
					mainSwiper.on("slideChange", function () {
						if (!isClickingThumb && thumbsSwiper) {
							thumbsSwiper.slideTo(mainSwiper.activeIndex);
						}
						$('.zoomContainer').remove();
						setTimeout(updateZoom, 300);
					});
				}
	
				function updateZoom() {
					var $single_product = $(".bwp-single-product");
				
					if ($single_product.length > 0 && $single_product.hasClass("zoom")) {
						$('.zoomContainer').remove();
						
						var _data = $single_product.data();
						var $images;
				
						if ($single_product.hasClass("one_column") || $single_product.hasClass("grid") || $single_product.hasClass("two_column") || $single_product.hasClass("grid_sticky")) {
							$images = $(".bwp-swiper-slider .img-thumbnail:not(.product-360) img");
						} else {
							$images = $(".bwp-swiper-slider .img-thumbnail.swiper-slide-active:not(.product-360) img");
						}
				
						if ($(window).width() >= 991) {
							$images.each(function () {
								_load_zoom_single_inner($(this), _data);
							});
						}
					}
				}

				$('.variations_form').on('wc_variation_form show_variation reset_image', function() {
					setTimeout(() => {
						updateZoom();
						if (thumbsSwiper) {
							thumbsSwiper.slideTo(0, 500);
						}
						if (mainSwiper) {
							mainSwiper.slideTo(0, 500);
						}
					}, 100);
				});
	
				function checkResize() {
					let newDirection = window.innerWidth < 768 ? "horizontal" : ($thumbs.data("thumbs-direction") || "horizontal");
					if (newDirection !== lastDirection) {
						initThumbsSwiper();
						initMainSwiper();
					}
					_disable_swiper_if_needed();
				}
				if ($thumbs.length) initThumbsSwiper();
        		initMainSwiper();
				
				$(window).on("resize", checkResize);
				$(window).on("load", () => {
					if ($thumbs.length) initThumbsSwiper();
					initMainSwiper();
				});
				$(document).ready(function () {
					updateZoom();
					_disable_swiper_if_needed();
				});
			}
		});
	}

	function _bwp_image_hotspot($scope) {
		const selectors = {
			tooltipElm: '[data-tooltip]',
		};

		const $tooltipElm = $scope.find(selectors.tooltipElm);

		if (!$tooltipElm.length) return;

		const $hotspotWrapper = $scope.find('.bwp-image-hotspots, .bwp-image-hotspot-carousels');
		const tooltipOptions = JSON.parse($hotspotWrapper.attr('data-tooltip-options'));

		const {
			arrow: ttArrow,
			always_open: ttAlwaysOpen,
			trigger: ttTrigger,
			distance: ttDistance,
			animation,
			width: tooltipWidth,
			size: tooltipSize,
			// zindex: tooltipZindex,
		} = tooltipOptions;

		const id = $scope.data('id') || 'default-id';
		let bwpclass = `bwp-tooltip bwp-tooltip-${id}`;

		if (tooltipSize) {
			bwpclass += ` bwp-tooltip-size-${tooltipSize}`;
		}

		$tooltipElm.each(function () {
			const ttPosition = $(this).data('tooltip-position');

			$(this).bwptooltipster({
				trigger: ttTrigger,
				animation: animation,
				minWidth: tooltipWidth,
				// maxWidth: tooltipWidth,
				bwpclass: bwpclass,
				position: ttPosition,
				arrow: ttArrow === 'yes',
				distance: ttDistance,
				interactive: true,
				positionTracker: true,
				// zIndex: tooltipZindex,
			});

			if (ttAlwaysOpen === 'yes') {
				$(this).bwptooltipster('show');
			}
		});
	}

	function _event_variations_select(){
		$('form.variations_form').on('change', '.variations select', function () {
			setTimeout(function () {
				var variation_id = $('input[name="variation_id"]').val();
	
				$('.product-variations .variation-image').hide();
	
				if (variation_id) {
					$('.product-variations .variation-image[data-variation-id="' + variation_id + '"]').show();
	
					var variation_image_url = $('.product-variations .variation-image[data-variation-id="' + variation_id + '"]').data('image-url');
					$('#product-main-image').attr('src', variation_image_url);
				} else {
					var default_image_url = $('#product-main-image').data('default-image-url');
					if (default_image_url) {
						$('#product-main-image').attr('src', default_image_url);
					}
				}
			}, 100);
		});
	}
	function _wpbingo_countdown($element) {
		var e = $element.find('.wpbingo-countdown__content'),
			n = e.data("datetime"),
			r = e.data("years"),
			a = e.data("months"),
			o = e.data("weeks"),
			i = e.data("days"),
			s = e.data("hours"),
			c = e.data("minutes"),
			l = e.data("seconds"),
			u = e.data("labels"),
			d = e.data("expire-actions"),
			f = e.data("expire-url"),
			p = e.data("expire-text"),
			m = "";
		
		if (r) m += "Y";
		if (a) m += "O";
		if (o) m += "W";
		if (i) m += "D";
		if (s) m += "H";
		if (c) m += "M";
		if (l) m += "S";
		
		var h = {
			until: n === "negative" ? "" : n,
			format: m,
		};
		
		if (d) {
			h.alwaysExpire = true;
			if (d.includes("redirect") && f !== "") h.expiryUrl = f;
			if (d.includes("message") && p !== "") h.expiryText = p; 
			if (d.includes("hide")) {
				h.onExpiry = function() {
					e.hide();
				};
			}
		}
		
		if (u) h.labels = u;
		
		e.wpb_countdown("destroy");
		e.wpb_countdown(h);
	}

	function _mouse_move_event(){
		$('.bwp-button.style_7')
		.on('mouseenter', function(e) {
				var parentOffset = $(this).offset(),
				relX = e.pageX - parentOffset.left,
				relY = e.pageY - parentOffset.top;
				$(this).find('.mouse').css({top:relY, left:relX})
		})
		.on('mouseout', function(e) {
				var parentOffset = $(this).offset(),
				relX = e.pageX - parentOffset.left,
				relY = e.pageY - parentOffset.top;
			$(this).find('.mouse').css({top:relY, left:relX})
		});
	}
	// footer accordion
	function _wpb_accordion(){
		if ($(window).width() < 768) {
			$('.wpb-content_list.active_accordion .elementor-heading-title').off('click').on('click', function () {
				$(this).next().stop(true, true).slideToggle(300);
				$(this).parent().toggleClass('show');
			});
		}
	}

	/* Show/hide NewsLetter Popup */
	_window.load(function() {
		$("#loader").addClass("pre-loading");
		_body.addClass('loaded');		
	});
	function _load_sale_nofication(){
		if($(".sale-nofication").length){
			var $element 		= $('.sale-nofication');
			var time_start 		= 0;
			var start		 	= $element.data('start');
			time_start = start*1000;
			$(".close-notification",$element).on( "click", function() {
				if($element.hasClass('active')){
					$element.removeClass('active');
				}
			});
			setTimeout(function(){
				_sale_nofication_start(); 
			},time_start);
		}
	}
	/* Coupon Code */
	function _click_copy_coupon() {
		var cpnBtn = $(".bwp-coupon-code .click-to-copy");
		var cpnCode = $("#select-coupon");
		cpnBtn.on("click", function() {
			var copyText = cpnCode.val();
			var $temp = $("<input>");
			$("body").append($temp);
			$temp.val(copyText).select();
			document.execCommand("copy");
			$temp.remove();
			$(cpnBtn).addClass('copied-show');
			setTimeout(function() {
				$(cpnBtn).removeClass('copied-show');
			}, 1500);
		});
	}

	/* Copy Product Link */
	function _click_copy_product_link() {
		let copyText = $(".share-group");
		copyText.find("button").on("click", function (e) {
			e.preventDefault();
			let input = copyText.find("input.text");
			input.select();
			document.execCommand("copy");
			copyText.addClass("active");
			window.getSelection().removeAllRanges();
			setTimeout(function () {
				copyText.removeClass("active");
			}, 2500);
		});
	}
	
	/* Come Back */
	function _come_back(){
		if( $('.come-back-alert').length > 0 ){
			var title = $(document).attr("title");
			var change_out2,change_out1;
			var content1 = $('.come-back-alert').data('content1');
			var content2 = $('.come-back-alert').data('content2');
			document.addEventListener('visibilitychange', function (event) {
				if (document.hidden) {
					change_out2 = function () {
						$(document).attr("title", content2);
						setTimeout(function() { 
							change_out1();
						}, 500);
					};
					change_out1 = function () {
						$(document).attr("title", content1);
						setTimeout(function() { 
							change_out2();
						}, 500);
					};
					change_out1();
				} else {
					change_out1 = function () {};
					change_out2 = function () {};
					$(document).attr("title", title);
				}
			});
		}
	}

	function _sale_nofication_start(){
		if($(".sale-nofication").length){
			var $element 		= $('.sale-nofication');
			var stay 			= $element.data('stay');
			var user_purchased 	= $element.data('users');
			var list_time 		= $element.data('ranges');
			var list_products 		= $element.data('products');
			var products 		= list_products.split(',');
			var purchased 	= user_purchased.split(',');
			var time 			= list_time.split(',');
			var time_stay = stay*1000;
			var id_product = products[Math.floor(Math.random()*products.length)];
			var item_purchased = purchased[Math.floor(Math.random()*purchased.length)];
			var item_time = time[Math.floor(Math.random()*time.length)];
			$.ajax({
				url: floomi_ajax.ajaxurl,
				type: 'POST',
				dataType: 'json',
				data: {
					action : "floomi_time_nofication_ajax",
					id_product : id_product,
					security : floomi_ajax.ajax_nonce
				},
				success: function(results) {
					if (results){
						$("#image",$element).attr("src",results[0].image);
						$("a",$element).attr("href",results[0].href);
						$('.product-title a',$element).text(results[0].title);
						$('.notification-purchased .name',$element).text(item_purchased);
						$('.time-suggest',$element).text(item_time);
						$element.addClass('active');
					}
				}
			});
			$(".scroll-notification",$element).css("animation-duration", stay - 1.5+"s");
			setTimeout(function(){
				$element.removeClass('active');
				_load_sale_nofication();
			}, time_stay );
		}
	}	
	function _update_total_wishlist(){	
		$(document).on( 'woosw_change_count', function(event, count){
			var counter = $('.count-wishlist');
			counter.html( count );
		})
	}	
	function _filter_ajax_sort_count(){
		if(!$('.bwp-filter-ajax').length){
			$( ".sort-count" ).on('change', function(){
				var value = $(this).val();
				_setGetParameter('product_count',value);
			});
		}		
	}
	function _toggle_categories(){
		var $root = $(".widget_product_categories");
		if($(".current-cat-parent",$root).length > 0){
			var $current_parent = $(".current-cat-parent",$root);
			$current_parent.addClass('open');
			$("> .children",$current_parent).stop().slideToggle(400);
		}
		var $current = $(".current-cat",$root);
		$current.addClass('open');
		$("> .children",$current).stop().slideToggle(400);
		$( '.cat-parent',$root ).each(function(index) {
				var $element = $(this);
				if($(".children",$element).length > 0){
				$element.prepend('<span class="arrow"></span>');
				$(".arrow",$element).on( 'click', function(e) {
					e.preventDefault();
					$element.toggleClass('open').find( '> .children' ).stop().slideToggle(400);
				});
			}
		});
	}	
	function _back_to_top(){
		_window.scroll(function() {
			if ($(this).scrollTop() > 800) {
				$('.back-top').addClass('button-show');
			}else {
				$('.back-top').removeClass('button-show');
			}
		});
		$('.back-top').on( "click", function() {
			$('html, body').animate({
				scrollTop: 0
			}, 100);
			return false;
		});			
	}
	function _categories_menu_toggle(){
		if($('.categories-menu .btn-categories').length){
			$('.categories-menu .btn-categories').on( "click", function(){
				$('.wrapper-categories').toggleClass('bwp-active');
			});
		}
	}
	function _menu_categories(){
		$('.main-menu-category .menu-lines').on( "click", function() {
			if($('.main-category-menu').hasClass('active'))
				$('.main-category-menu').removeClass('active');
			else
				$('.main-category-menu').addClass('active');
				$('.close-menu-category').addClass('active');
			return false;
		});
		$('.close-menu-category').on( "click", function() {
			$('.main-category-menu').removeClass('active');
			$(this).removeClass('active');
		});
		$('.main-category-menu .close-menu').on( "click", function() {
			$('.main-category-menu').removeClass('active');
			$('.close-menu-category').removeClass('active');
		});
	}
	function _search_toggle() {
		var $searchToggle = $('.search-toggle');
		var $searchOverlay = $('.search-overlay');
		var $closeSearch = $('.close-search');
		var $closeOverlay = $('.close-search-overlay');
		var $ajaxSearch = $('form.ajax-search');
		var $resultSearchProductsContent = $('.result-search-products-content');
	  
		$searchToggle.on('click.break', function() {
		  $searchOverlay.toggleClass('search-visible');
		});
	  
		$([ $closeSearch[0], $closeOverlay[0] ]).on('click', function() {
			$searchOverlay.toggleClass('search-visible');
		});
	  
		$ajaxSearch.on('click', '.close-search', function() {
		  $resultSearchProductsContent.hide();
		  $('.result-search-products', $resultSearchProductsContent).hide();
		});
	}
	
	function _floomi_accordion_menu(){	
		var $elements = $(".categories-vertical-menu .widget-custom-menu");
		$('.widget-title',$elements).on( "click", function() {
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				$('div',$(this).parent()).slideUp();	
			}
			else{
				$('.widget-title',$elements).removeClass('active');
				$('div',$elements).slideUp();				
				$(this).addClass('active');
				$('div',$(this).parent()).slideDown();	
			}	
		});	
	}
	
	_floomi_accordion_menu();
	
	function _setGetParameter(paramName, paramValue)
	{
		var url = window.location.href;
		var hash = location.hash;
		url = url.replace(hash, '');
		if (url.indexOf(paramName + "=") >= 0)
		{
			var prefix = url.substring(0, url.indexOf(paramName));
			var suffix = url.substring(url.indexOf(paramName));
			suffix = suffix.substring(suffix.indexOf("=") + 1);
			suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
			url = prefix + paramName + "=" + paramValue + suffix;
		}
		else
		{
		if (url.indexOf("?") < 0)
			url += "?" + paramName + "=" + paramValue;
		else
			url += "&" + paramName + "=" + paramValue;
		}
		window.location.href = url + hash;
	}
	function _sticky_nextproduct(){
		var $parent = $(".single-product");
		if( $(".prev_next_buttons",$parent).length > 0 ){
			_window.scroll(function() {
				var scroll_top = _window.scrollTop();
				var offset_top = $(".woocommerce-tabs",$parent).offset().top;
				var distance   = (offset_top - scroll_top);
				if ( distance <= 0) {
					$('.prev_next_buttons',$parent).addClass('active');
				}else{
					$('.prev_next_buttons',$parent).removeClass('active');
				}
			});
		}
	}
	function _sticky_product() {
		var $parent = $(".single-product");
		var $stickyProduct = $(".sticky-product", $parent);
		if ($stickyProduct.length > 0) {
			_window.scroll(function () {
				var scroll_top = _window.scrollTop();
				var offset_top = $(".single_add_to_cart_button", $parent).offset().top;
				var distance = (offset_top - scroll_top);
				if (distance <= 0) {
					$stickyProduct.addClass('sticky');
					var stickyHeight = $stickyProduct.outerHeight();
					$('body').css('padding-bottom', stickyHeight);
				} else {
					$stickyProduct.removeClass('sticky');
					$('body').css('padding-bottom', 0);
				}
			});
		}
		$('.select-cart-option').on("click", function () {
			$('html, body').animate({
				scrollTop: 0
			}, 800);
		});
	}
	function _header_slider() {
	    jQuery(".bwp-swiper-slider.header-slider").each(function () {
	        var $this = jQuery(this);
	        var settings = $this.data("slider-settings") || {};

	        // Ép kiểu number an toàn
	        var slidesPerView = parseInt(settings.slides_per_view) || 1;
	        var slidesPerGroup = parseInt(settings.slides_to_scroll) || 1;
	        var spaceBetween = parseInt(settings.space_between) || 0;

	        if (settings.autoplay) {
	            settings.autoplay = {
	                delay: (settings.autoplay.delay || 3000),
	                disableOnInteraction: false
	            };
	        }

	        new Swiper($this[0], {
	            slidesPerView: slidesPerView,
	            slidesPerGroup: slidesPerGroup,
	            spaceBetween: spaceBetween,
	            loop: settings.loop === "yes",
	            autoHeight: settings.auto_height || false,
	            speed: settings.speed || 500,
	            autoplay: settings.autoplay || false,
	            navigation: {
	                nextEl: $this.find(".bwp-swiper-button-next")[0],
	                prevEl: $this.find(".bwp-swiper-button-prev")[0],
	            },
	            pagination: {
	                el: $this.find(".swiper-pagination")[0],
	                clickable: true,
	            },
	        });
	    });
	}
	//Dropdown Menu
	function _dropdown_menu(){
		$( ".pwb-dropdown" ).each(function(){
			var $dropdown = $(this);
			var active_text = $dropdown.find('li.active').text();
			if(active_text){
				$(".pwb-dropdown-toggle",$dropdown).html(active_text);
			}
			if($dropdown.hasClass('select_category')){
				var default_value = $( ".product-cat",".select_category" ).val();
				if( !default_value ){
					$( ".product-cat",".select_category" ).remove();
				}
			}
			$("li",$dropdown).on( "click", function() {
				$("li",$dropdown).removeClass("active");
				$(this).addClass('active');
				var this_text = $(this).text();
				$(".pwb-dropdown-toggle",$dropdown).html(this_text);
				$dropdown.removeClass("open");
				if($dropdown.hasClass('select_category')){
					var this_value = $(this).data("value");
					if(this_value){
						if( $( ".product-cat",".select_category" ).length <= 0 ){
							$( ".select_category" ).append( '<input type="hidden" name="product_cat" class="product-cat" value="">' );
						}
						$( ".product-cat",".select_category" ).val(this_value);
					}else{
						$( ".product-cat",".select_category" ).remove();
					}
				}				
			});
		});		
	}
	_dropdown_menu();
	function _click_toggle_filter(){
		$(".filter_sideout .button-filter-toggle").on( "click", function() {
			if($(this).hasClass('active')){
				_body.removeClass("not-scroll");
			}else{
				_body.addClass("not-scroll");
			}
		});
		$(".button-filter-toggle").on( "click", function() {
			if($(this).hasClass('active')){
				$(".button-filter-toggle").removeClass('active');
				$(".filter_sideout").removeClass('active');
				$(".sidebar-product-filter").removeClass('active');
				$(".main-archive-product").removeClass('active');
				$(".remove-sidebar").removeClass('active');
				$(".sidebar-product-filter").slideUp();
			}else{
				$(".button-filter-toggle").addClass('active');
				$(".filter_sideout").addClass('active');
				$(".sidebar-product-filter").addClass('active');
				$(".main-archive-product").addClass('active');
				$(".remove-sidebar").addClass('active');
				$(".sidebar-product-filter").slideDown();
			}
		});	
		$(".remove-sidebar").on( "click", function() {
			$(this).removeClass('active');
			$(".main-archive-product").removeClass('active');
			$(".sidebar-product-filter").removeClass('active');
			$(".button-filter-toggle").removeClass('active');
			_body.removeClass("not-scroll");
		});
	}
	_click_toggle_filter();
	function _event_single_image(){
		if($(".bwp-single-product").length){
			var $element = $(".bwp-single-product");
			var _data = $element.data();
			if($element.hasClass("zoom")){
				$('.variations_form').on('wc_variation_form show_variation reset_image', function() {
					if(_data.product_layout_thumb == "one_column" || _data.product_layout_thumb == "grid" || _data.product_layout_thumb == "two_column" || _data.product_layout_thumb == "grid_sticky" ){
						$('.zoomContainer:first .zoomWindowContainer .zoomWindow').css('background-image', 'url(' + $('#image').attr('src') + ')');
					}else{
						$('.zoomContainer .zoomWindowContainer .zoomWindow').css('background-image', 'url(' + $('#image').attr('src') + ')');
					}
					$('.zoomContainer .zoomLens').css('background-image', 'url(' + $('#image').attr('src') + ')');
				});
				if(_data.product_layout_thumb == "one_column" || _data.product_layout_thumb == "grid" || _data.product_layout_thumb == "two_column" || _data.product_layout_thumb == "grid_sticky"  ){
					_load_zoom_single_image(_data);
				}
			}
			if(_data.product_layout_thumb != "one_column" && _data.product_layout_thumb != "grid" && _data.product_layout_thumb != "two_column" && _data.product_layout_thumb != "grid_sticky" ){
				$('.variations_form').on('wc_variation_form show_variation reset_image', function() {
					if (typeof mainSwiper !== 'undefined') {
						mainSwiper.slideTo(0);
					}
				});
			}
			if(_data.product_layout_thumb == "one_column" || _data.product_layout_thumb == "grid" || _data.product_layout_thumb == "two_column" || _data.product_layout_thumb == "grid_sticky" ){
				$('.variations_form').on('wc_variation_form show_variation reset_image', function() {
					$(window).scrollTop( 50 );
				});
			}	
		}
	}
	function _load_zoom_single_image(_data){
		var $element = $(".image-additional");
		if (($(window).width()) >= 991){
			$(".img-thumbnail",$element).each(function(){
				var $parent_img = $("a",$(this));
				_load_zoom_single_inner($("img",$parent_img),_data);
			});
		}
	}
	function _load_zoom_single_inner($element,_data){
		if( $(".image-thumbnail").length > 0 ){
			var $gallery = "image-thumbnail";
		}else{
			var $gallery = false;
		}		
		$element.elevateZoom({
				zoomType : _data.zoomtype,
				scrollZoom  : _data.zoom_scroll,
				lensSize    : _data.lenssize,
				lensShape    : _data.lensshape,
				containLensZoom  : _data.zoom_contain_lens,
				gallery: $gallery,
				cursor: 'crosshair',
				galleryActiveClass: "active",
				lensBorder: _data.lensborder,
				borderSize : _data.bordersize,
				borderColour : _data.bordercolour,
		});	
	}
	function _moreverticalMenu(){
		var $element = $(".categories-vertical-menu");
		var max_number_1530 = $element.data("max_number_1530") ? $element.data("max_number_1530") : "15";	
		var max_number_1200 = $element.data("max_number_1200") ? $element.data("max_number_1200") : "8";
		var max_number_991 = $element.data("max_number_991") ? $element.data("max_number_991") : "6";
		if($(window).width() >= 1530){
			_appendMoreCategories($element,max_number_1530);
		}else if($(window).width() >= 1200){
			_appendMoreCategories($element,max_number_1200);
		}else if($(window).width() >= 992){
			_appendMoreCategories($element,max_number_991);
		}
	}
	function _appendMoreCategories($element,limit){
		var textmore = $element.data("textmore") ? $element.data("textmore") : "Load More";
		var closemore = $element.data("textclose") ? $element.data("textclose") : "Close";
		
		if($( "ul.menu >li",$element).length > limit && $element.find(".more-wrap").length <= 0){		
			$("ul.menu",$element).append('<div class="more-wrap"><span class="more-view">'+textmore+'</span></div>');
		}
		
		$(".more-wrap",$element).unbind( "click" );
		$(".more-wrap",$element).on( "click", function(){
			var this_more = $(this);
			if($(this).hasClass('open')){
				$("ul.menu >li",$element).each(function(i){
					if(i>limit-1){
						$(this).slideUp();
					}
				});
				$(this).removeClass('open');
				$(this_more).html('<span class="more-view">'+textmore+'</span>');
			}else{
				$('ul.menu >li',$element).each(function(i){
					if(i>limit-1){
						$(this).slideDown();
					}
				});
				$(this).addClass('open');
				$(this_more).html('<span class="more-view">'+closemore+'</span>');
			}
		});
		
		$("ul.menu >li",$element).css('display', 'block');
		$("ul.menu >li",$element).each(function(i){
			if(i> (limit -1)){ 
				$(this).css('display', 'none');
			}		
		});
	}
	/*Search JS*/
	function _event_ajax_search(){
		var $element = $(".ajax-search");
		$(".input-search",$element).on("keydown", function() {
			setTimeout(function($e){	
			var character = $e.val();
			var limit = $element.data("limit") ? $element.data("limit") : 5;
			var $category_search = $(".category-search",$element);
			var category = $("li.active",$category_search).data("value");
			if(character.length >= 2){
				$( ".result-search-products",$element ).empty();
				$( ".result-search-products",$element ).addClass("loading");
				$( ".result-search-products",$element ).show();
				$( ".result-search-products-content",$element ).show();
				$.ajax({
					url: floomi_ajax.ajaxurl,
					dataType: 'json',
					data: {
						action : "floomi_search_products_ajax",
						character : character,
						limit : limit,
						category : category,
						security : floomi_ajax.ajax_nonce
					},
					success: function(json) {
						var html = '';
						if (json.length) {
							for (var i = 0; i < json.length; i++) {
								if (!json[i]['category']) {
									html += '<li class="item-search">';
									html += '	<a class="item-image" href="' + json[i]['link'] + '"><img class="pull-left" src="' + json[i]['image'] + '"></a>';
									character = (character).toLowerCase(character);
									character = (character).replace("%20"," ");
									json[i]['name'] = (json[i]['name']).toLowerCase(json[i]['name']);
									json[i]['name'] = (json[i]['name']).replace(character, '<b>'+character+'</b>');
									html += '<div class="item-content">';
									html += '<a href="' + json[i]['link'] + '" title="' + json[i]['name'] + '"><span>'	+ json[i]['name'] + '</span></a>';
									if(json[i]['price']){
										html += '<div class="price">'+json[i]['price']+'</div>';
									}
									html += '</div></li>';
								}
							}
						}else{	
							html = '<li class="no-result-item">'+$element.data("noresult")+'</li>';
						}
						$( ".result-search-products",$element ).removeClass("loading");
						$( ".result-search-products",$element ).html(html);
					}
				});
			}else{
				$( ".result-search-products",$element ).removeClass("loading");
				$( ".result-search-products",$element ).empty();
				$( ".result-search-products",$element ).hide();
				$( ".result-search-products-content",$element ).hide();
			}				
		  }, 200, $(this));
		});	
		$(document).on("click", function (event) {
			if (!$(event.target).closest(".ajax-search").length) {
				$(".result-search-products-content").hide();
			}
		});
	}
	function _event_circlestime(){
		$( ".time-circles" ).each(function(){
			var $circles = $(this);
			$circles.TimeCircles({
					circle_bg_color: $circles.data("bg_color"),
					fg_width: $circles.data("fg_width"),
					bg_width: $circles.data("bg_width"),
					time: {
						Days: { 
							color: $circles.data("time_color"),
							text : $circles.data("text_day")
						},
						Hours: { 
							color: $circles.data("time_color"),
							text : $circles.data("text_hour")	
						},
						Minutes: { 
							color: $circles.data("time_color"),
							text : $circles.data("text_min")
						},
						Seconds: { 
							color: $circles.data("time_color"),
							text : $circles.data("text_sec")
						}
					}
			});
		});
	}
	function _event_accordion_slider(){
		$( ".bwp-slider .accordion" ).each(function(){
			var $accordion = $(this);
			$("li",$accordion).first().addClass("active");
			$("li",$accordion).on('hover', function(){
				$("li",$accordion).removeClass('active');
				$(this).addClass("active");
			});		
		});
	}
	function _remove_animation_tab_visua(){
		if(jQuery.fn.vcAccordion){
			var _isAnimated = jQuery.fn.vcAccordion.Constructor.prototype.isAnimated;
			jQuery.fn.vcAccordion.Constructor.prototype.isAnimated = function() {
				return 0;
			}
		}
	}
	function _event_video_product(){
		if($(".video-additional").length > 0){
			if($(".img-thumbnail",$element).length <= 0){
				$(".video-additional").addClass("active");
			}
			var $element = $("#image-thumbnail");
			$(".img-thumbnail-video",$element).on( "click", function(){
				$(".image-additional").removeClass("active");
				$(".img-thumbnail").removeClass("active");
				if(!$(".video-additional").hasClass("active")){
					$(".video-additional").addClass("active");
				}
				if(!$(this).hasClass("active")){
					$(this).addClass('active');
				}
			});
			$(".img-thumbnail",$element).on( "click", function(){
				$(".video-additional").removeClass("active");
				$(".img-thumbnail-video").removeClass("active");
				if(!$(".image-additional").hasClass("active")){
					$(".image-additional").addClass("active");
				}
			});	
		}
	}
	function _event_single_sticky_grid(){
		if ($(window).width() > 768 && $('.bwp-single-product.grid_sticky').length > 0) {
			var $element = $('.bwp-single-product.grid_sticky');
			var eventElemArray = [];
			var _count = 0;
			var _countFix = 0;
			var $image_array = $('.image-additional .img-thumbnail',$element);
			$('.content-thumbnail-scroll .img-thumbnail',$element).on( "click", function() {
				var $thumb = $(this).data('media-id'),
					$image = $('.image-additional .img-thumbnail[data-media-id='+ $thumb +']',$element);
				$( 'html, body' ).animate({ scrollTop: $image.offset().top }, '300' );
				$(this).addClass('active');
			});
			$(window).on('load scroll resize',function(){
				eventElemArray = [];
				_count = 0;
				$image_array.each(function(i,pager){
					eventElemArray.push( $(pager).offset().top );
				});
				for(var i = 0;i < eventElemArray.length; i++){
					if( $(window).scrollTop() + ($(window).height() * 0.5) > eventElemArray[i] ){
						_count++;
					}
				}
				if(_count !== _countFix){
					_countFix = _count;
					$('.content-thumbnail-scroll .img-thumbnail',$element).removeClass('active');
					$('.content-thumbnail-scroll .img-thumbnail',$element).eq(_count-1).addClass('active');
				}
			});
			// sticky thumb
			var $content = $('.image-additional',$element);
			var thumb_left = $('.content-thumbnail-scroll',$element).offset.left;
			var thumb_width = $('.content-thumbnail-scroll',$element).width() + 'px';
			var thumb_ToTop = $('.content-thumbnail-scroll',$element).offset().top;
			if( $content.height() > $('.content-thumbnail-scroll',$element).height() ){
				$(window).scroll(function() {
					var windowToTop = $(window).scrollTop();
					var thumb_height = $('.content-thumbnail-scroll',$element).height() + 'px';
					var stopsticky = ( $content.height() + $content.offset().top ) - windowToTop;
					if (windowToTop + 10 > thumb_ToTop) {
						$('.content-thumbnail-scroll',$element).css({
							'position': 'fixed',
							'top': '15px',
							'left': thumb_left,
							'width': thumb_width,
							'height': thumb_height
						});
					} else {
						$('.content-thumbnail-scroll',$element).removeAttr('style');
						$('.js-product-media-group .js-product-media',$element).removeAttr('style');
					}
					if(stopsticky < $('.content-thumbnail-scroll',$element).height()) {
						$('.content-thumbnail-scroll',$element).css({
							'position': 'absolute',
							'top': ($content.height() - $('.content-thumbnail-scroll',$element).height()) + 'px',
							'left': thumb_left,
							'width': thumb_width,
							'height': thumb_height
						});
					}
				});
			}
		}else{
			_load_swiper_thumbs_carousel($(".bwp-single-product.grid_sticky .image-additional"));
			_load_swiper_thumbs_carousel($(".bwp-single-product.grid_sticky .content-thumbnail-scroll .image-thumbnail"));
		}
	}
	function _load_video_popup() {
		var $video = $('.bwp-video'),
			$contentVideo = $('.content-video.modal'),
			$widgetVideo = $('.bwp-widget-video'),
			$modalDialog = $widgetVideo.find('.modal-dialog'),
			$videoAdditional = $('.video-additional iframe'),
			$imageAdditional = $(".image-additional #image"),
			$removeShowModal = $(".remove-show-modal"),
			$functionButton = $(".function-button"),
			$closeVideo = $(".close-video");
	
		var urlVideo = $video.data("src");
	
		function hideModalAndUpdateSrc() {
			if ($contentVideo.hasClass('show')) {
				$contentVideo.removeClass('show').css('display', 'none');
				$functionButton.removeClass('active');
				$modalDialog.removeClass('width height');
			}
			$("#video").attr('src', urlVideo);
			_body.removeClass("not-scroll");
		}
	
		$removeShowModal.on("click", hideModalAndUpdateSrc);
		$closeVideo.on("click", hideModalAndUpdateSrc);
	
		$video.on("click", function() {
			if (!$contentVideo.hasClass('show')) {
				$contentVideo.addClass('show').css('display', 'block');
				$functionButton.addClass('active');
				_body.addClass("not-scroll");
			}
	
			var wd_width = _window.width(),
				wd_height = _window.height();
	
			$modalDialog.addClass((wd_width <= (wd_height + 500)) ? 'width' : 'height');
		});
	
		function updateVideoSize() {
			$videoAdditional.css({
				"width": $imageAdditional.width(),
				"height": $imageAdditional.height()
			});
		}
		_window.on("resize", updateVideoSize);
		updateVideoSize();
	}	
	function _load_360_view_product() {
		if($('.product-360-view').length > 0){
			$('.product-360-view').each(function () {
				$(this).TreeSixtyImageRotate({
					totalFrames: $(this).data("count"),
					endFrame: $(this).data("count"),
					smallWidth: 'auto',
					smallHeight: 'auto',
					largeWidth: 'auto',
					largeHeight: 'auto',
					speed: 100,
					imagePlaceholderClass: "images-placeholder"
				}).initTreeSixty();
			});
		}
	}
	function _click_button(){
		//Menu Sidebar//
		$(".menu-sidebar .open-menu").on("click", function() {
			$(this).toggleClass('active');
			$('.menu-sidebar__content').toggleClass('active');
			$('.overlay-sidebar').toggleClass('active');
			_body.addClass("not-scroll");
		});
		$(".menu-sidebar .overlay-sidebar, .menu-sidebar .close-sidebar").on("click", function() {
			$('.menu-sidebar__content, .overlay-sidebar').removeClass('active');
			_body.removeClass("not-scroll");
		});

		//Size Guide//
		$('.size-guide .size-guide__click').on( "click", function() {
			if($('.size-guide').hasClass('active')){
				$('.size-guide').removeClass('active');	
				_body.removeClass("not-scroll");
			}else{
				$('.size-guide').addClass('active');
				_body.addClass("not-scroll");
			}
		});

		//Product Notify
		$('.product-notify').on("click", function() {
			$('.product-notify, .single-product-notify-me-form').toggleClass('active');
		});

		$('.notify-me-form-close, .close-back_notify_me-form').on("click", function() {
			$('.single-product-notify-me-form').removeClass('active');
		});

		//Form Login
		$(".showlogin").on("click", function() {
			if($('.woocommerce-form-login').hasClass('active')){
				$(this).removeClass('active');
				$('.woocommerce-form-login').removeClass('active');
				$('.woocommerce-form-login').slideUp();
			}else{
				$(this).addClass('active');
				$('.woocommerce-form-login').addClass('active');
				$('.woocommerce-form-login').slideDown();		
			}
		});

		$(".showcoupon").on("click", function() {
			$(this).toggleClass('active');
		});

		//Login Signup
		$(".button-next-reregister a").on("click", function(e) {
			e.preventDefault();
			$('.form-login').removeClass('active');
			$('.form-register').addClass('active');
			$('.form-login-register .title-sign').addClass('hidden');
			$('.form-login-register .title-register').removeClass('hidden');
		});

		$(".button-next-login a").on("click", function(e) {
			e.preventDefault();
			$('.form-register').removeClass('active');
			$('.form-login').addClass('active');
			$('.form-login-register .title-sign').removeClass('hidden');
			$('.form-login-register .title-register').addClass('hidden');
		});

		//Product Reviews
		$('#reviews .button-reviews').on("click", function() {
			$('#review_form_wrapper, .close-reviews-form, .close-btn, .modal').toggleClass('open');
		});

		$('#reviews .close-reviews-form, #review_form_wrapper .close-btn').on("click", function() {
			$('#review_form_wrapper, .close-reviews-form, .modal, .close-btn').removeClass('open');
		});

		//Social Share//
		$('.share-content .title, .modal-product-share .social-overlay, .modal-product-share .button-social-close').on("click", function() {
			$('.modal-product-share').toggleClass('active');
			_body.toggleClass("not-scroll");
		});
		
	}
	function _tab_description_accordion() {
		const $parent = $('.main-single-product .woocommerce-tabs.description-style-accordion');
		const $tab_accordion = $('.accordion-item', $parent);
		const $firstTabAccordion = $tab_accordion.first();
		$firstTabAccordion.addClass('active');
		$tab_accordion.on('click', function () {
			const $this = $(this);
			if ($this.is($firstTabAccordion)) {
				$this.toggleClass('active');
			} else {
				$this.toggleClass('active');
			}
		});
	}
	function _tab_information_mobile() {
		if (_window.width() > 991) return;
	
		const $parent = $('.main-single-product .woocommerce-tabs:not(.description-style-accordion)');
		if ($parent.length === 0) return;
	
		const $tabsPanels = $('.woocommerce-Tabs-panel', $parent);
		const $tabTitles = $('.tab-title', $parent);

		$tabTitles.first().addClass('active');
		$tabsPanels.first().slideDown();
	
		$tabTitles.on('click', function () {
			const $this = $(this);
			const id = $this.data('id');
			const $currentPanel = $('#' + id, $parent);
	
			if ($this.hasClass('active')) {
				$currentPanel.slideUp();
				$this.removeClass('active');
			} else {
				$tabsPanels.slideUp();
				$tabTitles.removeClass('active');
				$currentPanel.slideDown();
				$this.addClass('active');
			}
		});
	}
	function _after_add_to_cart(){
		$( _body ).on( 'added_to_cart', function(){
			var $element = $(".floomi-topcart");
			if( $element.hasClass("popup") ){
				$('.remove-cart-shadow').addClass('show');
				setTimeout(function(){$element.addClass('show');}, 200);
				_body.addClass("not-scroll");
			}else{
				$.ajax({
					url: floomi_ajax.ajaxurl,
					data: {
						"action" : "floomi_cartajax",
						"security" : floomi_ajax.ajax_nonce
					},
					success: function(results){
						if(results){
							$('.content-cart-popup').empty().html(results);
							if( !$(".content-cart-popup").hasClass("active") ){
								$(".content-cart-popup").addClass("active");
							}
							_ajax_cart_popup();
							_close_cart_popup();
						}
					},
					error: function(errorThrown) { console.log(errorThrown); },
				});				
			}
			_click_add_to_cart_icon();
			_click_add_to_cart_icon_text();
			if($('.woocommerce-cart-header').length){
				setTimeout(function() {
					var totalStr = $('.woocommerce-cart-header').data('total_price');
					var totalClean = totalStr.toString().replace(/,/g, '');
					var total = parseFloat(totalClean);
					var shipStr = $('.woocommerce-cart-header').data('free_ship');
					var shipClean = shipStr.toString().replace(/,/g, '');
					var ship = parseFloat(shipClean);
					if(total>=ship){
						if(!$('.floomi-topcart').hasClass('fire-done')){
							$('.floomi-topcart').addClass('fire-done');
							_fire_work(true);
						}
					}else{
						$('.floomi-topcart').removeClass('fire-done');
					}
				}, 300);
			}
		});
	}
	function _add_to_cart_single_product() {
		$('.bwp-single-info .single_add_to_cart_button.ajax-loading').on('click', function(e) {
			var $button = $(this);
			var product_id = $('input[name="add-to-cart"]').val();
			var quantity = $('input[name="quantity"]').val() || 1;
			var variation_id = $('input[name="variation_id"]').val();
		
			var grouped_products = {};
			$('.group_table .quantity-content input').each(function() {
				var product_id = $(this).attr('name').match(/\d+/)[0];
				var quantity = $(this).val();
				if (quantity > 0) {
					grouped_products[product_id] = quantity;
				}
			});
		
			e.preventDefault();
			if ($('form.variations_form').length) {
				var all_selected = true;
				$('form.variations_form select').each(function () {
					if (!$(this).val()) {
						all_selected = false;
					}
				});
		
				if (!all_selected) {
					return;
				}
			}
			$button.removeClass('added').addClass('loading');
		
			$.ajax({
				url: floomi_ajax.ajaxurl,
				type: 'POST',
				data: {
					action: "floomi_cartajax",
					security: floomi_ajax.ajax_nonce,
					product_id: product_id,
					variation_id: variation_id,
					quantity: quantity,
					grouped_products: grouped_products
				},
				success: function(results) {
					if(results){
						$button.removeClass('loading').addClass('added');
						$('.bwp-mobile_toolbar').addClass('active');
						var $element = $(".floomi-topcart");
						if ($element.hasClass("popup")) {
							$('.remove-cart-shadow').addClass('show');
							setTimeout(function() {
								$element.addClass('show');
							}, 200);
							_body.addClass("not-scroll");
						} else {
							$.ajax({
								url: floomi_ajax.ajaxurl,
								data: {
									"action" : "floomi_cartajax",
									"security" : floomi_ajax.ajax_nonce
								},
								success: function(results){
									if(results){
										$('.content-cart-popup').empty().html(results);
										if( !$(".content-cart-popup").hasClass("active") ){
											$(".content-cart-popup").addClass("active");
										}
										_ajax_cart_popup();
										_close_cart_popup();
									}
								},
								error: function(errorThrown) { console.log(errorThrown); },
							});
						}
						$('.container-quickview').removeClass('show show-content');
						$(document.body).trigger('wc_fragment_refresh');
					}
				},
				error: function(errorThrown) {
					console.log(errorThrown);
					$button.removeClass('loading');
				}
			});
		});
	}
	function _event_quick_buy() {
		var $form_cart = $('form.cart');
		if ($('.quick-buy', $form_cart).length <= 0) {
			return;
		}
		var $variations = $('.variations_form');
		$variations.on('show_variation', function (event, variation, allow) {
			event.preventDefault();
			if (allow) {
				$variations.find('.quick-buy').removeClass('disabled');
			} else {
				$variations.find('.quick-buy').addClass('disabled');
			}
		});
		$variations.on('hide_variation', function (event) {
			event.preventDefault();
			$variations.find('.quick-buy').addClass('disabled');
		});
		$('.quick-buy', $form_cart).on("click", function (event) {
			event.preventDefault();
			var $disabled = $(this).is(':disabled');
			if ($disabled) {
				return;
			}
			if ($(this).hasClass('ajax-loading')) {
				var grouped_products = {};
				$('.group_table input[name^="quantity"]').each(function () {
					var product_id = $(this).attr('name').match(/\d+/)[0];
					var quantity = $(this).val();
					if (quantity > 0) {
						grouped_products[product_id] = quantity;
					}
				});
				if ($('form.variations_form').length) {
					var all_selected = true;
					$('form.variations_form select').each(function () {
						if (!$(this).val()) {
							all_selected = false;
						}
					});
					if (!all_selected) {
						alert('Please select some product options before adding this product to your cart.');
						return;
					}
				}
				var product_id = $('input[name="add-to-cart"]').val();
				var quantity = $('input[name="quantity"]').val() || 1;
				var variation_id = $('input[name="variation_id"]').val();
				var form = $('<form>', {
					action: floomi_ajax.checkout_url,
					method: 'POST',
					style: 'display:none;'
				});
				form.append($('<input>', {
					type: 'hidden',
					name: 'add-to-cart',
					value: product_id
				}));
				form.append($('<input>', {
					type: 'hidden',
					name: 'quantity',
					value: quantity
				}));
				if (variation_id) {
					form.append($('<input>', {
						type: 'hidden',
						name: 'variation_id',
						value: variation_id
					}));
				}
				if (Object.keys(grouped_products).length > 0) {
					$.each(grouped_products, function (id, qty) {
						form.append($('<input>', {
							type: 'hidden',
							name: 'quantity[' + id + ']',
							value: qty
						}));
					});
				}
				$('body').append(form);
				form.submit();
			} else {
				$form_cart.append('<input type="hidden" name="quick_buy" value="1" />');
				$(this).parent().find('.single_add_to_cart_button').trigger('click');
			}
		});
	}
	function _ajax_cart_popup(){
		var woocommerce_form = $( '.woocommerce-cart-page-popup form' );
		woocommerce_form.on('change', '.qty', function(){
			$('.woocommerce-cart-page-popup').addClass("loadings");
			_post_ajax_cart_popup($(this));
		});
		woocommerce_form.on('click', '.remove', function(e){
			e.preventDefault();
			$(this).closest(".cart_item").addClass("hidden");
			$('.woocommerce-cart-page-popup').addClass("loadings");
			$(this).closest(".cart_item").find(".qty").val(0);
			_post_ajax_cart_popup($(this));
		});
	}
	function _post_ajax_cart_popup($element){
		var form = $element.closest('form');
		var formData = form.serialize();			
		$.post( form.attr('action'), formData, function() {
			$.ajax({
				url: floomi_ajax.ajaxurl,
				data: {
					"action" : "floomi_cartajax",
					"security" : floomi_ajax.ajax_nonce
				},
				success: function(results){
					if(results){
						$('.content-cart-popup').empty().html(results);
						$('.woocommerce-cart-page-popup').removeClass("loadings");
						$(document.body).trigger('wc_fragment_refresh');
						_ajax_cart_popup();
						_close_cart_popup();
					}
				},
				error: function(errorThrown) { console.log(errorThrown); },
			});
		});	
	}
	function _close_cart_popup(){
		$(".close-cart-popup").on( "click", function() {
			$('.content-cart-popup').empty().removeClass("active");
		});
	}
	function _ajax_cart_page(){
		var timeout;
		var cart_form = $( '.woocommerce-cart-form' );
		cart_form.on('change', '.qty', function(){
			if (timeout != undefined) clearTimeout(timeout);
			if ($(this).val() == '') return;
			timeout = setTimeout(function() {
				$('[name="update_cart"]',cart_form).trigger('click');
			}, 1000 );	
		});
	}	
	function _ajax_cart_header(){
		var topcart_form = $(".bwp-component-cart-icon .floomi-topcart");
		topcart_form.on('change', '.qty', function(){
			$('.cart-popup').addClass("loadings");
			var form = $(this).closest("form");
			var formData = form.serialize();		
			$.post( form.attr('action'), formData, function() {
				$(document.body).trigger('wc_fragment_refresh');
				setTimeout(function() {
					$('.cart-popup').removeClass("loadings");
				}, 500);
				topcart_form.addClass('show');
			});			
		});
	}
	function _click_add_to_cart_icon() {
		var $topcart = $(".bwp-component-cart-icon .floomi-topcart");
		var $removeCartShadow = $(".bwp-component-cart-icon .remove-cart-shadow");
		var $mobileToolbar = $(".bwp-mobile_toolbar");
		function closeCart() {
			$topcart.removeClass("show");
			$removeCartShadow.removeClass("show");
			$mobileToolbar.removeClass("active");
			_body.removeClass("not-scroll");
		}
		$topcart.on("click", ".cart-icon", function (e) {
			e.preventDefault();
			$topcart.addClass("show");
			$removeCartShadow.addClass("show");
			if ($topcart.hasClass("popup")) {
				_body.addClass("not-scroll");
			}
		});
		$topcart.on("click", ".cart-remove", function (e) {
			e.preventDefault();
			e.stopPropagation();
			closeCart();
		});
		$removeCartShadow.on("click", closeCart);
		$mobileToolbar.on('click', '.cart-icon', function () {
			$mobileToolbar.addClass("active");
		});
	}
	function _click_add_to_cart_icon_text() {
		var $topcart = $(".bwp-component-cart-icon-text .floomi-topcart");
		var $removeCartShadow = $(".bwp-component-cart-icon-text .remove-cart-shadow");
		var $mobileToolbar = $(".bwp-mobile_toolbar");
		$topcart.on('click', '.cart-icon', function (e) {
			e.preventDefault();
			$topcart.addClass("show");
			$removeCartShadow.addClass("show");
			if ($topcart.hasClass("popup")) {
				_body.addClass("not-scroll");
			}
		});
		function closeCart() {
			$topcart.removeClass("show");
			$removeCartShadow.removeClass("show");
			$mobileToolbar.removeClass("active");
			_body.removeClass("not-scroll");
		}
		$topcart.on('click', '.cart-remove', function (e) {
			e.preventDefault();
			e.stopPropagation();
			closeCart();
		});
		$removeCartShadow.on("click", closeCart);
		$mobileToolbar.on('click', '.cart-icon', function () {
			$mobileToolbar.addClass("active");
		});
	}
    function _click_attribute_image() {
	    $(".product-attribute .image-attribute").on("click", function () {
	        var $this = $(this);
	        var $parent   = $this.closest(".products-entry");
	        var $swiperEl = $parent.find(".product-thumb-swiper")[0];
	        var imageUrl  = $this.data("image");
	        if ($this.hasClass("active")) {
	            $this.removeClass("active");
	            if ($swiperEl && $swiperEl.swiper) {
	                var swiper = $swiperEl.swiper;
	                var $firstSlideImg = $($swiperEl).find(".swiper-slide img").first();
	                var original = $firstSlideImg.data("original");
	                if (original) {
	                    $firstSlideImg.attr("src", original);
	                }
	                swiper.slideTo(0);
	                swiper.update();
	            } else {
	                var $thumb = $parent.find(".woocommerce-LoopProduct-link img:last-child").first();
	                var original = $thumb.data("original");
	                if (original) {
	                    $thumb.attr("src", original);
	                }
	            }
	        } else {
	            $this.siblings().removeClass("active");
	            $this.addClass("active");
	            if ($swiperEl && $swiperEl.swiper) {
	                var swiper = $swiperEl.swiper;
	                var $firstSlideImg = $($swiperEl).find(".swiper-slide img").first();

	                if ($firstSlideImg.length && imageUrl) {
	                    if (!$firstSlideImg.data("original")) {
	                        $firstSlideImg.data("original", $firstSlideImg.attr("src"));
	                    }
	                    $firstSlideImg.attr("src", imageUrl);
	                }
	                swiper.slideTo(0);
	                swiper.update();
	            } else {
	                var $thumb = $parent.find(".woocommerce-LoopProduct-link img:last-child").first();
	                if (imageUrl) {
	                    if (!$thumb.data("original")) {
	                        $thumb.data("original", $thumb.attr("src"));
	                    }
	                    $thumb.attr("src", imageUrl);
	                }
	            }
	        }
	    });
	}

	function _event_variable_thumb(){
		if($('.product-wapper').hasClass('quick-shop')){
			function updateAttributes($parent_variations,$product_variations) {
				var selected = {};
				if($(window).width() > 991){
					var $parent_attribute = $parent_variations;
					var $attribute_card = $(".attribute-card:not(.mobile)",$parent_attribute);
				}else{
					var $parent_attribute = $('.content-form-attribute-contents',$parent_variations);
					var $attribute_card = $(".attribute-card",$parent_attribute);
				}
				var $original_product = $parent_variations.data('original_product');
				var $original_price = $original_product.price_html;
				var $original_image = $original_product.image;
				var $original_gallery = $original_product.gallery;
				$(".list-attribute.active",$parent_attribute).each(function() {
					var attrName = $(this).closest(".attribute-card").data("attribute_name");
					var attrValue = String($(this).attr("data-title"));
					selected[attrName] = attrValue;
				});
				var totalAttributes =$attribute_card.length;
				var selectedCount   = Object.keys(selected).length;
				var validVariations = $product_variations.filter(function(variation) {
					return Object.keys(selected).every(function(attr) {
						return variation.attributes[attr] === selected[attr];
					});
				});
				var allValues = {};
				var inStockValues = {};
				$.each(validVariations, function(i, v) {
					$.each(v.attributes, function(attr, val) {
						if (!allValues[attr]) allValues[attr] = [];
						if ($.inArray(val, allValues[attr]) === -1) {
							allValues[attr].push(val);
						}
						if (v.is_in_stock) {
							if (!inStockValues[attr]) inStockValues[attr] = [];
							if ($.inArray(val, inStockValues[attr]) === -1) {
								inStockValues[attr].push(val);
							}
						}
					});
				});
				$(".list-attribute",$parent_attribute).removeClass("disabled");
				$attribute_card.each(function() {
					var attrName = $(this).data("attribute_name");
					$(this).find(".list-attribute").each(function() {
						var val = String($(this).attr("data-title"));
						if (selectedCount == totalAttributes && selected[attrName]) {
							var matchedVariation = $product_variations.find(function(variation) {
								return Object.keys(selected).every(function(attr) {
									return variation.attributes[attr] === selected[attr];
								});
							});
							if (matchedVariation) {
								var priceHtml = matchedVariation.price_html || '';
								if(priceHtml){
									$(".price",$parent_variations).html(priceHtml);
								}else{
									$(".price",$parent_variations).html($original_price);
								}
								$('.single_add_to_cart_button',$parent_variations).prop('disabled', false).removeClass('disabled');
								$('.variable-atc',$parent_variations).removeClass('disabled');
								$(".cart .variation_id",$parent_variations).val(matchedVariation.variation_id);
								var $image = matchedVariation.image.thumb_src;
								if($image){
									$(".products-thumb img",$parent_variations).last().attr("src", $image);
								}else{
									if($original_gallery && $(".products-thumb img",$parent_variations).last().hasClass('hover-image')){
										$(".products-thumb img",$parent_variations).last().attr("src", $original_gallery);
									}else{
										$(".products-thumb img",$parent_variations).last().attr("src", $original_image);
									}
								}
								if($(window).width() < 1200 && $(window).width() > 991){
									$('.content-form-attribute',$parent_variations).css('transform','translateY(100%)');
								}
							}
						}else{
							$(".price",$parent_variations).html($original_price);
							if($original_gallery && $(".products-thumb img",$parent_variations).last().hasClass('hover-image')){
								$(".products-thumb img",$parent_variations).last().attr("src", $original_gallery);
							}else{
								$(".products-thumb img",$parent_variations).last().attr("src", $original_image);
							}
							$('.single_add_to_cart_button',$parent_variations).prop('disabled', true).addClass('disabled');
							$('.variable-atc',$parent_variations).addClass('disabled');
							if($(window).width() < 1200 && $(window).width() > 991){
								$('.content-form-attribute', $parent_variations).removeAttr('style');
							}
						}
						if ((selectedCount < totalAttributes && selected[attrName]) || totalAttributes == 1) {
							return;
						}
						if (!inStockValues[attrName] || $.inArray(val, inStockValues[attrName]) === -1) {
							$(this).addClass("disabled");
						} else {
							$(this).removeClass("disabled");
						}
					});
				});
			}
			$('.quick-shop .list-attribute').off("click").on("click", function (e) {
				if ($(this).hasClass("disabled")) return;
				var $this = $(this);
				var $parent_variations = $this.closest('.quick-shop');
				var $product_variations = $parent_variations.data('product_variations');
				var $original_product = $parent_variations.data('original_product');
				var $original_image = $original_product.image;
				var $thumb = $(".products-thumb img", $parent_variations).last();
				var $swiperEl = $parent_variations.find(".product-thumb-swiper")[0];
				var $hoverImage = $parent_variations.find('.hover-image.back');
				if ($this.hasClass("active")) {
					$this.removeClass("active");
				} else {
					var $group = $this.closest(".attribute-card");
					$group.find(".list-attribute").removeClass("active");
					$this.addClass("active");
				}
				if ($parent_variations.find('.list-attribute.active').length > 0) {
					$hoverImage.addClass('active');
				} else {
					$hoverImage.removeClass('active');
				}
				updateAttributes($parent_variations, $product_variations);
				var selected = {};
				$(".list-attribute.active", $parent_variations).each(function () {
					var attrName = $(this).closest(".attribute-card").data("attribute_name");
					var attrValue = String($(this).attr("data-title"));
					selected[attrName] = attrValue;
				});

				var matchedVariation = $product_variations.find(function (variation) {
					return Object.keys(selected).every(function (attr) {
						return variation.attributes[attr] === selected[attr];
					});
				});

				var imageUrl = matchedVariation && matchedVariation.image ? matchedVariation.image.thumb_src : null;

				if (Object.keys(selected).length === 0) {
					imageUrl = $original_image;
				}
				if ($swiperEl && $swiperEl.swiper) {
					var swiper = $swiperEl.swiper;
					var $firstSlideImg = $($swiperEl).find(".swiper-slide img").first();
					if (!$firstSlideImg.data("original")) {
						$firstSlideImg.data("original", $firstSlideImg.attr("src"));
					}
					$firstSlideImg.attr("src", imageUrl);
					swiper.slideTo(0);
					swiper.update();
				} else {
					if (!$thumb.data("original")) {
						$thumb.data("original", $thumb.attr("src"));
					}
					$thumb.attr("src", imageUrl);
				}
			});

			$('.quick-shop .single_add_to_cart_button').on( "click", function(e) {
				e.preventDefault();
				if(! $(this).hasClass('disabled')){
					var $thisbutton = $(this);
					$thisbutton.addClass('active');
					var $form = $thisbutton.closest('form.cart'),
						id = $thisbutton.val(),
						product_qty = $form.find('input[name=quantity]').val() || 1,
						product_id = $form.find('input[name=product_id]').val() || id,
						variation_id = $form.find('input[name=variation_id]').val() || 0;
					var data = {
						action: 'floomi_ajax_add_to_cart',
						product_id: product_id,
						product_sku: '',
						quantity: product_qty,
						variation_id: variation_id,
						security : floomi_ajax.ajax_nonce
					};
					$.ajax({
						type: 'POST',
						dataType: 'json',
						url: floomi_ajax.ajaxurl,
						data: data,
						complete: function (results) {
							$(document.body).trigger('wc_fragment_refresh');
							$thisbutton.removeClass('active');
							$('.product-wapper .single_add_to_cart_button').removeClass('active');
							var $element = $(".floomi-topcart");
							if( $element.hasClass("popup") ){
								$('.remove-cart-shadow').addClass('show');
								setTimeout(function(){$element.addClass('show');}, 200);
								_body.addClass("not-scroll");
							}else{
								$.ajax({
									url: floomi_ajax.ajaxurl,
									data: {
										"action" : "floomi_cartajax",
										"security" : floomi_ajax.ajax_nonce
									},
									success: function(results){
										if(results){
											$('.content-cart-popup').empty().html(results);
											if( !$(".content-cart-popup").hasClass("active") ){
												$(".content-cart-popup").addClass("active");
											}
											_ajax_cart_popup();
											_close_cart_popup();
										}
									},
									error: function(errorThrown) { console.log(errorThrown); },
								});				
							}
						},
					});
				}
			});
		}
	}
	function _click_login_ajax($element){
		$('form[data-login-ajax]',$element).on('submit', function(e){
			e.preventDefault();
			$('form[data-login-ajax] .button-login',$element).addClass("active");
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: floomi_ajax.ajaxurl,
				data: { 
					'action': 'floomi_login_ajax',
					'username': $('form[data-login-ajax] [data-username]',$element).val(), 
					'password': $('form[data-login-ajax] [data-password]',$element).val(),
					'security': $('form[data-login-ajax] #security',$element).val()
				},
				success: function(data){
					$('form[data-login-ajax] .button-login',$element).removeClass("active");
					if (data.loggedin == true){
						$('form[data-login-ajax] p.status',$element).html('<div class="woocommerce-message" role="alert">'+data.message+'</div>');
						document.location.href = floomi_ajax.redirecturl;
					}else{
						$('form[data-login-ajax] p.status',$element).addClass("error");
						$('form[data-login-ajax] p.status',$element).html('<ul class="woocommerce-error" role="alert"><li>'+data.message+'</li></ul>');
					}
				}
			});
		});
	}
	function preloadBackgroundImage(url, callback) {
		const img = new Image();
		img.src = url;
		img.onload = callback;
	}
	function _active_form_login() {
		var $formLoginRegister = $('.form-login-register');
		const bgElement = $('.sign__in--img');
	
		if (bgElement.length > 0) {
			const bgCss = bgElement.css('background-image');
	
			if (bgCss && typeof bgCss === 'string' && bgCss !== 'none') {
				const bgUrl = bgCss.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
	
				preloadBackgroundImage(bgUrl, function () {
					bgElement.addClass('loaded');
				});
			}
		}
	
		$(".bwp-mobile_toolbar .login-header").on("click", ".active-login.login-side", function (e) {
			e.preventDefault();
			$(this).closest(".bwp-mobile_toolbar").addClass("active");
		});
	
		$(".login-header").on("click", ".active-login.login-side", function (e) {
			e.preventDefault();
			_body.addClass("not-scroll");
			var $parent = $(this).closest('.login-header');
			var $form = $('.form-login-register', $parent);
	
			$form.toggleClass('active');
			_click_login_ajax($parent);
		});
	
		$(".login-header").on("click", ".close-login, .overlay_form-login-register", function () {
			if ($formLoginRegister.hasClass('active')) {
				$formLoginRegister.removeClass('active');
				$(".bwp-mobile_toolbar").removeClass("active");
				_body.removeClass("not-scroll");
			}
		});
	}
	function _load_event_countdown(){
		$('.product-countdown').each(function(event){
			var $this = $(this);
			_event_countdown( $(this) );
		});	
	}
	function _event_groupvariation_image(){
		if($(".bwp-single-product").length){
			var $element = $(".bwp-single-product");
			var _data = $element.data();
			var $old_image = $('.scroll-image .image-additional',$element).clone();
			var $old_thumbnail = $('.container-thumbnail-single .image-thumbnail',$element).clone();
			var variation_id  = 0;
			var variation_image = _data.list_variation_image;
			setTimeout(() => {
				$(".bwp-single-product .swiper").each(function(){
					_load_swiper_thumbs_carousel($(this));
					$('.video-additional iframe').on('load', function() {
						$(this).css("width", $(".image-additional #image").width());
						$(this).css("height", $(".image-additional #image").height());
					});
					$('.content-thumbnail-scroll .img-thumbnail-scroll img').on('load', function() {
						var imgWidth = $(this).width();
						var imgHeight = $(this).height();
						$('.content-thumbnail-scroll .img-thumbnail-video img').css("width", imgWidth);
						$('.content-thumbnail-scroll .img-thumbnail-video img').css("height", imgHeight);
					});
				});
			}, 100);
			if(variation_image){
				$('input[name="variation_id"]',$element).change(function() {
					if($('input[name="variation_id"]',$element).val()){
						variation_id  = $('.main-single-product .variations_form input[name="variation_id"]').val();
						if (String(variation_image).includes(String(variation_id))) {
							$('.scroll-image',$element).addClass('loading_variation');
							$('.container-thumbnail-single',$element).addClass('loading_variation');
						}
						$.ajax({
							url: floomi_ajax.ajaxurl,
							data: {
								"action" : "floomi_variation_group",
								'variation_id' : variation_id,
								'product_layout_thumb': _data.product_layout_thumb,
								"security" : floomi_ajax.ajax_nonce
							},
							success: function(results) {
								if(results && Object.keys(results).length > 0){
									$('.scroll-image',$element).addClass('loading_variation');
									$('.container-thumbnail-single',$element).addClass('loading_variation');
									setTimeout(() => {
										$(".bwp-single-product .swiper").each(function(){
											_load_swiper_thumbs_carousel($(this));
										});
									}, 100);
									$('.scroll-image',$element).empty().html(results.image);
									$('.container-thumbnail-single',$element).empty().html(results.thumbnail);
									if(_data.product_layout_thumb != "one_column" && _data.product_layout_thumb != "grid" && _data.product_layout_thumb != "two_column" && _data.product_layout_thumb != "grid_sticky" ){
										$(".bwp-single-product .swiper").each(function(){
											_load_swiper_thumbs_carousel($(this));
											$('.video-additional iframe').on('load', function() {
												$(this).css("width", $(".image-additional #image").width());
												$(this).css("height", $(".image-additional #image").height());
											});
											$('.content-thumbnail-scroll .img-thumbnail-scroll img').on('load', function() {
												var imgWidth = $(this).width();
												var imgHeight = $(this).height();
												$('.content-thumbnail-scroll .img-thumbnail-video img').css("width", imgWidth);
												$('.content-thumbnail-scroll .img-thumbnail-video img').css("height", imgHeight);
											});
										});
									}
									if( _data.product_layout_thumb == "grid_sticky"  ){
										_event_single_sticky_grid();
									}
									if(_data.product_layout_thumb == "one_column" || _data.product_layout_thumb == "grid" || _data.product_layout_thumb == "two_column" || _data.product_layout_thumb == "grid_sticky"  ){
										$('.zoomContainer').remove();
										_load_zoom_single_image(_data);
									}
									_load_360_view_product();
								}
							},
							complete: function() {
								setTimeout(function(){
									$('.scroll-image',$element).removeClass('loading_variation');
									$('.container-thumbnail-single',$element).removeClass('loading_variation');
								},200);
							},
							error: function(errorThrown) { console.log(errorThrown); },
						});
					}else{
						setTimeout(() => {
							$(".bwp-single-product .swiper").each(function(){
								_load_swiper_thumbs_carousel($(this));
							});
						}, 100);
						if($(window).width() < 991){
							if(_data.product_layout_thumb == "one_column" || _data.product_layout_thumb == "grid" || _data.product_layout_thumb == "two_column" || _data.product_layout_thumb == "grid_sticky"  ){
								$(".bwp-single-product .swiper").each(function(){
									_load_swiper_thumbs_carousel($(this));
								});
							}
						}
						$('.scroll-image',$element).empty().html($old_image);
						if(_data.product_layout_thumb != "one_column" && _data.product_layout_thumb != "grid" && _data.product_layout_thumb != "two_column" && _data.product_layout_thumb != "lagre_gallery"){
							$('.container-thumbnail-single',$element).empty().html($old_thumbnail);
						}
						if(_data.product_layout_thumb != "one_column" && _data.product_layout_thumb != "grid" && _data.product_layout_thumb != "two_column" && _data.product_layout_thumb != "grid_sticky" ){
							$(".bwp-single-product .swiper").each(function(){
								_load_swiper_thumbs_carousel($(this));
								$('.video-additional iframe').css("width",$(".image-additional #image").width());
								$('.video-additional iframe').css("height",$(".image-additional #image").height());
								$('.content-thumbnail-scroll .img-thumbnail-video img').css("width",$(".content-thumbnail-scroll .img-thumbnail-scroll img").width());
								$('.content-thumbnail-scroll .img-thumbnail-video img').css("height",$(".content-thumbnail-scroll .img-thumbnail-scroll img").height());
							});
						}
						if( _data.product_layout_thumb == "grid_sticky"  ){
							_event_single_sticky_grid();
						}
						if(_data.product_layout_thumb == "one_column" || _data.product_layout_thumb == "grid" || _data.product_layout_thumb == "two_column" || _data.product_layout_thumb == "grid_sticky"  ){
							$('.zoomContainer').remove();
							_load_zoom_single_image(_data);
						}
						_load_360_view_product();
					}
				});
			}
		}
	}
	function _change_variations_stock(){
		var $element = $(".bwp-single-product");
		if( $('.percent_quantity_stock.variation-stock',$element).length > 0 ){
			$('input[name="variation_id"]',$element).change(function() {
				var $variation_id  = $(this).val();
				if($variation_id){
					$('.percent_quantity_stock',$element).addClass('hidden');
					$('.percent_quantity_stock[data-variation_id="'+$variation_id+'"]',$element).removeClass('hidden');
				}else{
					$('.percent_quantity_stock',$element).addClass('hidden');
					$('.percent_quantity_stock.product_main',$element).removeClass('hidden');
				}
			});
		}
	}
	function _click_quickview_button(){
		$('.quickview-button').on( "click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			var product_id  = $(this).data('product_id');
			$(".quickview-"+product_id).addClass("loading");
			$.ajax({
				url: floomi_ajax.ajaxurl,
				data: {
					"action" : "floomi_quickviewproduct",
					'product_id' : product_id,
					"security" : floomi_ajax.ajax_nonce
				},
				success: function(results) {
					if(results){
						$('.container-quickview .bwp-quick-view').empty().html(results);
						$(".quickview-"+product_id).removeClass("loading");
						$("#quickview-carousel .bwp-swiper-slider").each(function(){
							_load_swiper_carousel($(this));
						});
						if (typeof jQuery.fn.tawcvs_variation_swatches_form !== 'undefined') {
							$('.variations_form').on('wc_variation_form show_variation reset_image', function () {
								const mainSwiperEl = $('#quickview-carousel .bwp-swiper-slider').get(0);
								if (mainSwiperEl && mainSwiperEl.swiper) {
									mainSwiperEl.swiper.slideTo(0, 500);
								}
							});
						}
						var countdown = $(".product-countdown", ".bwp-quick-view");
						if (countdown.length > 0) {
							countdown.each(function() {
								_event_countdown($(this));
							});
						}
						_change_bmsm_variations();
						_event_quick_buy();
						_close_quickview();
						_event_change_variation();
						_event_countdown_variation();
						_add_to_cart_single_product();
						$('.container-quickview').addClass('show');
						$("body").addClass("not-scroll");
						setTimeout(function(){
							$('.container-quickview').addClass('show-content');
						}, 300);
					}
				},
				error: function(errorThrown) { console.log(errorThrown); },
			});
		});
	}
	function _close_quickview(){
		const closeQuickView = (e) => {
			e.preventDefault();
			$("body").removeClass("not-scroll");
			const $quickviewContainer = $('.container-quickview')
		
			$quickviewContainer.removeClass("show-content");
		
			setTimeout(() => {
				$quickviewContainer.removeClass("show").find('.bwp-quick-view').empty();
			}, 300);
		
		};
		$('.quickview-overlay, .quickview-close').on("click", closeQuickView);
	}
	function _event_countdown_variation() {
		$('form.variations_form').on('woocommerce_variation_has_changed', function() {
			var variation_id = $(this).find('input[name="variation_id"]').val();
			$('.countdown-single-variation').hide();
			if (variation_id) {
				var countdownElement = $('#countdown-product_' + variation_id);
				if (countdownElement.length) {
					countdownElement.show();
				}
			}
		});
	}
	function _event_countdown($element) {
		var $this = $element;
		var $id = $this.data("id");
		var $current_time = new Date().getTime();
		var $sttime = $this.data('sttime');
		var $countdown_time = $this.data('cdtime');
		var $day = $this.data('day') || "D";
		var $hour = $this.data('hour') || "H";
		var $min = $this.data('min') || "M";
		var $sec = $this.data('sec') || "S";
		var $austDay = new Date($countdown_time * 1000);
	
		if ($sttime > $current_time) {
			$this.remove();
			return;
		}
	
		if ($countdown_time && $current_time > $countdown_time * 1000) {
			$this.remove();
			return;
		}
	
		if (!$countdown_time) {
			$this.remove();
			return;
		}
	
		$this.countdown($austDay, function(event) {
			$(this).html(
				event.strftime(
					'<span class="countdown-content">' +
					'<span class="countdown-section days"><span class="countdown-amount">%D</span><span class="countdown-text">' + $day + '</span></span>' +
					'<span class="countdown-separator">:</span>' +
					'<span class="countdown-section hours"><span class="countdown-amount">%H</span><span class="countdown-text">' + $hour + '</span></span>' +
					'<span class="countdown-separator">:</span>' +
					'<span class="countdown-section mins"><span class="countdown-amount">%M</span><span class="countdown-text">' + $min + '</span></span>' +
					'<span class="countdown-separator">:</span>' +
					'<span class="countdown-section secs"><span class="countdown-amount">%S</span><span class="countdown-text">' + $sec + '</span></span>' +
					'</span>'
				)
			);
		}).on('finish.countdown', function(event) {
			var $price = $this.data('price');
			$('#' + $id + ' .item-price > span').hide('slow', function() {
				$(this).remove();
			});
			$('#' + $id + ' .item-price').append('<span><span class="amount">' + $price + '</span></span>');
			$this.hide('slow', function() {
				$(this).remove();
			});
		});
	}
	function _change_bmsm_variations(){
		var $element = $(".bwp-single-product,.bwp-quick-view");
		if( $('.bmsm_content',$element).length > 0 ){
			$('input[name="variation_id"]',$element).change(function() {
				var $variation_id  = $(this).val();
				if($variation_id){
					$('.bmsm_content',$element).addClass('hidden');
					$('.bmsm_content[data-variation_id="'+$variation_id+'"]',$element).removeClass('hidden');
					var $val = $('form.cart input[name="quantity"]',$element).val();
					var selected = null;
					var maxQty = -1;
					$('.bmsm_content[data-variation_id="'+$variation_id+'"] .box','.bwp_bmsm').each(function(){
						var $qty = $(this).data('qty');
						if ($val >= $qty && $qty > maxQty) {
							maxQty = $qty;
							selected = $(this);
						}
					});
					$('.box','.bwp_bmsm').removeClass('active');
					if (selected) {
						selected.addClass('active');
					}
				}else{
					$('.bmsm_content',$element).addClass('hidden');
				}
			});
			$('.box','.bwp_bmsm').on( "click", function(e) {
				var $qty = $(this).data('qty');
				$('form.cart input[name="quantity"]',$element).val($qty);
				$('.box','.bwp_bmsm').removeClass('active');
				$(this).addClass('active');
			});
			$('form.cart input[name="quantity"]',$element).change(function() {
				var $val = $(this).val();
				var $variation_id  = $('input[name="variation_id"]',$element).val();
				var selected = null;
				var maxQty = -1;
				if($variation_id){
					$('.bmsm_content[data-variation_id="'+$variation_id+'"] .box','.bwp_bmsm').each(function(){
						var $qty = $(this).data('qty');
						if ($val >= $qty && $qty > maxQty) {
							maxQty = $qty;
							selected = $(this);
						}
					});
				}else{
					$('.box','.bwp_bmsm').each(function(){
						var $qty = $(this).data('qty');
						if ($val >= $qty && $qty > maxQty) {
							maxQty = $qty;
							selected = $(this);
						}
					});
				}
				$('.box','.bwp_bmsm').removeClass('active');
				if (selected) {
					selected.addClass('active');
				}
			});
		}
	}
	function _event_change_variation(){
		if ( $('.bwp-single-info .variations').length > 0 ){
			var $element = $('.bwp-single-info .variations');
			$("select", $element).each(function(event){
				var val_active =$("option:selected", this).val();
				if(val_active){
					var txt =$("option:selected", this).text();
					var $parent =$(this).closest('.type_attribute');
					$(".label span",$parent).html(txt);
				}
			});
			$('select',$element).on('change', function(){
				var val =$("option:selected", this).val();
				if(val){
					var txt =$("option:selected", this).text();
				}else{
					var txt ='';
				}
				var $parent =$(this).closest('.type_attribute');
				$(".label span",$parent).html(txt);
			});
		}
	}
	function _event_countdown_product($element){
		$('.product-countdown',$element).each(function(event){
			var $this = $(this);
			var $id = $(this).data("id");		
			var $current_time 	= new Date().getTime();
			var $sttime 	= $(this).data('sttime');
			var $countdown_time = $this.data('cdtime');
			var $day = $this.data('day') ? $this.data('day') : "D";
			var $hour = $this.data('hour') ? $this.data('hour') : "H";
			var $min = $this.data('min') ? $this.data('min') : "M";
			var $sec = $this.data('sec') ? $this.data('sec') : "S";			
			var $austDay 	= new Date();
			$austDay 		= new Date( $countdown_time * 1000 );	
			if( $sttime > $current_time  ){
				$this.remove();
				return ;
			}
			if( $countdown_time.length > 0 && $current_time > $countdown_time ){
				$this.remove();
				return ;
			}
			if( $countdown_time.length <= 0 ){
				$this.remove();
				return ;
			}
			$this.countdown($austDay, function(event) {
				$(this).html(
					event.strftime(
						'<span class="countdown-content">' +
						'<span class="countdown-section days"><span class="countdown-amount">%D</span><span class="countdown-text">' + $day + '</span></span>' +
						'<span class="countdown-separator">:</span>' +
						'<span class="countdown-section hours"><span class="countdown-amount">%H</span><span class="countdown-text">' + $hour + '</span></span>' +
						'<span class="countdown-separator">:</span>' +
						'<span class="countdown-section mins"><span class="countdown-amount">%M</span><span class="countdown-text">' + $min + '</span></span>' +
						'<span class="countdown-separator">:</span>' +
						'<span class="countdown-section secs"><span class="countdown-amount">%S</span><span class="countdown-text">' + $sec + '</span></span>' +
						'</span>'
					)
				);
			}).on('finish.countdown', function(event){
				$this.remove();
				$id = $this.data( 'id' );
				$target = this;
				$this.hide('slow', function(){ $(this).remove(); });	
				$price = $this.data( 'price' );
				$('#' + $id + ' .item-price > span').hide('slow', function(){ $('#' + $id + ' .item-price > span').remove(); });			
				$('#' + $id + ' .item-price' ).append( '<span><span class="amount">' + $price + '</span></span>' );
			});			
		});
	}
	function _load_marquee() {
		const $widget = $('.wpbingo-marquee-text');
		if ($widget.length && !$widget.hasClass("marquee-initialized")) {
			$widget.addClass("marquee-initialized");
		}
	}
	class Elementor_Js_Floomi {
		static getInstance() {
			if (!Elementor_Js_Floomi.instance) {
				Elementor_Js_Floomi.instance = new Elementor_Js_Floomi();
			}
			return Elementor_Js_Floomi.instance;
		}
		constructor() {
			$(window).on('elementor/frontend/init', () => {
				this.init();
			});
		}
		init() {
			elementorFrontend.hooks.addAction('frontend/element_ready/bwp-banner-products.default', () => {
				_banner_products_button();
			});
			elementorFrontend.hooks.addAction('frontend/element_ready/bwp-image-hotspot.default', ($scope) => {
				_bwp_image_hotspot($scope);
			});
			elementorFrontend.hooks.addAction('frontend/element_ready/bwp-video-popup.default', ($scope) => {
				_load_video_popup($scope);
			});
			elementorFrontend.hooks.addAction('frontend/element_ready/bwp-coupon-code.default', ($scope) => {
				_click_copy_coupon($scope);
			});
			elementorFrontend.hooks.addAction('frontend/element_ready/bwp-counter.default', ($scope) => {
				initCounterWidget($scope);
			});
			elementorFrontend.hooks.addAction('frontend/element_ready/bwp-product-list.default', () => {
				_event_variable_thumb();
				_phinfo_show_hover_info();
				_load_swiper_product_nested();
				_load_product_hover_zoom();
			});
			elementorFrontend.hooks.addAction('frontend/element_ready/bwp-filter-homepage.default', () => {
				if($('.bwp-product-list').length < 1){
					_event_variable_thumb();
					_load_swiper_product_nested();
					_load_product_hover_zoom();
				}
			});
			elementorFrontend.hooks.addAction('frontend/element_ready/bwp-countdown-product.default', ($scope) => {
				_load_event_countdown($scope);
			});
			elementorFrontend.hooks.addAction('frontend/element_ready/bwp-icon-list.default', ($scope) => {
				_wpb_accordion($scope);
			});
			elementorFrontend.hooks.addAction( 'frontend/element_ready/bwp-countdown.default', ($scope) => {
				let countdownElement     = $scope.find('.wpbingo-countdown');
				countdownElement.each(function(){
					_wpbingo_countdown($(this));
				});
			});
			['bwp-image-hotspot', 'bwp-image-hotspot-carousel'].forEach((widget) => {
				elementorFrontend.hooks.addAction(`frontend/element_ready/${widget}.default`, ($scope) => {
					_bwp_image_hotspot($scope);
				});
			});
			['bwp-button', 'bwp-image-banner', 'bwp-info-box','bwp-info-categories', 'bwp-recent-post'].forEach(widget => {
				elementorFrontend.hooks.addAction(`frontend/element_ready/${widget}.default`, _mouse_move_event);
			});
			elementorFrontend.hooks.addAction( 'frontend/element_ready/wpbingo-marquee-text.default', ($scope) => {
				const $widget = $scope.find( '.wpbingo-marquee-text' );
				if ( ! $widget.length ) {
				  return;
				}
				$widget.marquee();
				if (elementorFrontend.isEditMode()) {
					setTimeout(_load_marquee, 500);
				} else {
					$(window).on("load", _load_marquee);
				}
			});
		}
	}
	Elementor_Js_Floomi.getInstance();	

	//Filter Js//
	$.fn.binFilterProduct = function(opts) {
		/* default configuration */	
		var config = $.extend({}, {
			widget_id : null,
			taxonomy : null,
			id_taxonomy:null,
			base_url: null,
			attribute:null,
			showcount:null,
			show_price:null,
			relation:null,
			show_only_sale:null,
			show_in_stock:null,
			layout_shop:null,
			show_brand:null,
			array_value_url : null,
			canbeloaded : true,
			shop_paging:null,
		}, opts);
		$(document).ready(function(){
			_event_dropdown_filter();
			_event_filter_product();
			_event_click_pagination();
			if( $( "nav.woocommerce-pagination").hasClass("shop-loadmore") ){
				_event_click_load_more();
			}			
			if( $( "nav.woocommerce-pagination").hasClass("shop-infinity") ){
				_event_load_infinity();
			}
			_event_filter_clear();
			_event_click_taxonomies();
			_event_click_sub_categories();
			_event_replace_page_url();
			_toggle_categories_filter(true);
			window.addEventListener('load', () => {
				_load_swiper_product_nested();
			});
			$("li",".woocommerce-sort-count").on('click', function(){
				$("li",".woocommerce-sort-count").removeClass("active");
				$(this).addClass("active");
				_eventFilter();
				return false;
			});		

			$("li",".woocommerce-ordering").on('click', function(){
				_eventFilter();
				return false;
			});			

			var view_products = $(".display",".bwp-top-bar");
			$("a",view_products).on('click', function(e){
				e.preventDefault();
				if(!$(this).hasClass("active")){
					$("a",view_products).removeClass('active');
					var this_class	= $("ul.products").data("col");
					$(this).addClass('active');								
					_eventFilter();
				}
				return false;
			});

			$(".back-to-shop").on('click', function(){
				var $text = $(this).text();
				$(".text-title-heading").text($text);
				$("li",".woocommerce-product-subcategories").removeClass("active");
				$(".item-taxonomy",".filter_taxonomy_product").removeClass("active");
				$("input",config.widget_id).attr('checked', false);
				$("#price-filter-min-text",config.widget_id).val($("#bwp_slider_price",config.widget_id).data('min'));
				$("#price-filter-max-text",config.widget_id).val($("#bwp_slider_price",config.widget_id).data('max'));
				config.id_taxonomy = 0;
				config.taxonomy = "product_cat";			
				_eventFilter(1,true,true,true);
				return false;
			});
			if($(".woocommerce-product-subcategorie-content").length > 0){
				$(".woocommerce-product-subcategorie-content").addClass('active');
			}
		});		
		function _toggle_categories_filter($arrow){
			var $root = $(".bwp-filter-category");
			var $current = $(".item-category.active.cat-parent",$root);
			var $active = $(".item-category.active",$root).closest('.item-category');
			if(!$current.hasClass('open')){
				$current.addClass('open');
				$("> .children",$current).slideToggle();
			}
			$(".cat-parent:not(.open) > .children",$root).slideUp();
			$(".open:not(.current-cat) > .children",$root).slideUp();
			$(".open:not(.current-cat)",$root).removeClass('open');
			$current.parent(".item-category").addClass('open');
			$("> .children",$current.parent(".item-category")).slideToggle();
			$( '.cat-parent',$root ).each(function(){
				var $element = $(this);
				if($(".children",$element).length > 0){
					if($arrow){
						$element.prepend('<label class="arrow"></label>');
						$(".arrow",$element).on( 'click', function(e) {
							e.preventDefault();
							$element.toggleClass('open').find( '> .children' ).stop().slideToggle();
						});			
					}
				}
			});
			if( $active.length > 0){
				$( $active.closest('.cat-parent') ).addClass('open');
				$( $active.closest('.children') ).slideDown('open');
			}
		}
		function _event_click_sub_categories(){
			var $subcategories = $(".woocommerce-product-subcategories");
			$("li",$subcategories).on('click', function(e){
				e.preventDefault();
				if($(this).hasClass("active")){
					return;
				}				
				$("li",$subcategories).removeClass("active");
				$(this).addClass("active");
				config.id_taxonomy = $(this).data("id_category");
				config.taxonomy = "product_cat";
				var $text = $(".woocommerce-loop-category__title a",$(this)).text();
				$(".text-title-heading").text($text);
				if( $(".filter_taxonomy_product").length > 0){
					var $parent = $(".filter_taxonomy_product");
					$(".item-taxonomy",$parent).removeClass("active");
					$(".item-taxonomy",$parent).removeClass("current-cat");
					$(".item-taxonomy",$parent).removeClass('open');
					$(".children",$parent).stop().slideUp(400);
					$(".item-category[data-id_item="+$(this).data("id_category")+"]",".filter_category_product").addClass('active').addClass('current-cat');
				}		
				$("input",config.widget_id).attr('checked', false);
				$("#price-filter-min-text",config.widget_id).val($("#bwp_slider_price",config.widget_id).data('min'));
				$("#price-filter-max-text",config.widget_id).val($("#bwp_slider_price",config.widget_id).data('max'));
				_toggle_categories_filter();
				_eventFilter(1,true,true);
				return false;
			});
		}
		function _event_click_taxonomies(){
			var $taxonomies = $(".filter_taxonomy_product");
			$(".item-taxonomy a",$taxonomies).on('click', function(e){
				e.preventDefault();
				var $taxonomy = $(this).closest(".item-taxonomy");
				var $children = $taxonomy.parent(".children");
				
				if($taxonomy.hasClass("active")){
					return;
				}
				var $parent = $(this).closest(".filter_taxonomy_product");
				$(".item-taxonomy",".filter_taxonomy_product").removeClass("active");
				if(!$taxonomy.hasClass("open") && $children.length <= 0){
					$(".item-taxonomy",".filter_taxonomy_product").removeClass('open');
				}
				$(".cat-parent",$parent).removeClass('current-cat');
				$taxonomy.addClass("active");

				$($('.item-taxonomy.active').closest(".cat-parent")).addClass("current-cat");
				if($children.length > 0){
					$(".children",$children).stop().slideUp();
					_toggle_categories_filter();				
				}else if($taxonomy.hasClass("cat-parent")){
					$(".children",$parent).stop();
					_toggle_categories_filter();
				}else{
					$(".children",$parent).stop().slideUp();
					_toggle_categories_filter();
				}
				var $id_taxonomy = $taxonomy.data("id_item");
				var $text = $(".name",$(this)).text();
				$(".text-title-heading").text($text);
				if( $(".woocommerce-product-subcategories").length > 0){
					$("li",".woocommerce-product-subcategories").removeClass("active");
					$("li[data-id_category="+$id_taxonomy+"]",".woocommerce-product-subcategories").addClass('active');
				}
				config.taxonomy = $parent.data("taxonomy");
				config.id_taxonomy = $id_taxonomy;
				$("input",config.widget_id).attr('checked', false);
				$("#price-filter-min-text",config.widget_id).val($("#bwp_slider_price",config.widget_id).data('min'));
				$("#price-filter-max-text",config.widget_id).val($("#bwp_slider_price",config.widget_id).data('max'));
				_eventFilter(1,true,true);
				return false;
			});
		}
		
		function _event_dropdown_filter(){
			var $form_filter = $(".bwp-woocommerce-filter-product",".filter_dropdown");
			var $form_filter2 = $("#bwp_form_filter_product",".filter_popup");
			$("h3",$form_filter).on('click', function(){
				if($(this).parent().hasClass("active")){
					$(this).parent().removeClass("active");
				}else{
					$(this).parent().addClass("active");
				}
			});
			$("h3",$form_filter2).on('click', function(){
				if($(this).parent().hasClass("active")){
					$(this).parent().removeClass("active");
				}else{
					$(this).parent().addClass("active");
				}
			});	
		}	
		
		function _event_filter_clear(){
			$(".filter_clear_all",".woocommerce-filter-title").on('click', function(){
				$("input",config.widget_id).attr('checked', false);
				$("#price-filter-min-text",config.widget_id).val($("#bwp_slider_price",config.widget_id).data('min'));
				$("#price-filter-max-text",config.widget_id).val($("#bwp_slider_price",config.widget_id).data('max'));
				_eventFilter();
			});
			$("facet-remove").on('click', function(){
				if($(this).hasClass("facet-remove-price")){
					$("#price-filter-min-text",config.widget_id).val($("#bwp_slider_price",config.widget_id).data('min'));
					$("#price-filter-max-text",config.widget_id).val($("#bwp_slider_price",config.widget_id).data('max'));
				}else{
					$("input",$(this).closest(".content_filter")).attr('checked', false);
				}
				_eventFilter();
			});			
		}
		
		function _event_replace_page_url(){
			$("a.page-numbers").each(function() {
				var href = $(this).attr('href');
				var url = (href).replace("page/","page=");
				$(this).attr('href',url);
			});		
		}

		function _event_click_pagination(){
			$( "nav.woocommerce-pagination a.page-numbers").on('click', function(e){
					e.preventDefault();
					$('ul.products','.main-archive-product').scrollTop(300);
					var status_id = $(this).attr('href').split('=');
					var paged = (status_id[1]) ? status_id[1] : 1;
					_eventFilter(paged);
				return false;
			});		
		}
		
		function _event_click_load_more(){
			$( "nav.woocommerce-pagination .woocommerce-load-more").on('click', function(e){
				$(this).addClass("active");
				e.preventDefault();
				var paged = $(this).data('paged') + 1;
				_eventFilter(paged,false,false,false,true);
				_event_variable_thumb();
				return false;
			});		
		}
		
		function _event_load_infinity(){
			$(window).on('scroll', function(){
				var $loadMore = $(".woocommerce-load-more");
				if(!$loadMore.length) return;
				var loadMoreOffset = $loadMore.offset().top;
				var windowHeight = $(window).height();
				var scrollTop = $(window).scrollTop();
				if ( scrollTop + windowHeight >= loadMoreOffset + 100 && config.canbeloaded == true ){
					$( "nav.woocommerce-pagination").addClass("active");
					var paged = $(".woocommerce-load-more").data('paged') + 1;
					_eventFilter(paged,false,false,false,true);
					_event_variable_thumb();
					return false;
				}
			});
		}
		
		function _event_filter_product(){
			var min_price = $("#price-filter-min-text",config.widget_id).val();
			var max_price =  $("#price-filter-max-text",config.widget_id).val();
			$("#bwp_slider_price").slider({
				range:true,
				min: $("#bwp_slider_price",config.widget_id).data('min'),
				max: $("#bwp_slider_price",config.widget_id).data('max'),		
				values: [min_price,max_price],
				slide : function( event, ui ) {
					$("#text-price-filter-min-text",config.widget_id).html(
						accounting.formatMoney( ui.values[0], {
							symbol:    $("#bwp_slider_price",config.widget_id).data('symbol'),
						})
					);
					$("#text-price-filter-max-text",config.widget_id).html(
						accounting.formatMoney( ui.values[1], {
							symbol:    $("#bwp_slider_price",config.widget_id).data('symbol'),
						})
					);
					$("#price-filter-min-text",config.widget_id).val(ui.values[0]);
					$("#price-filter-max-text",config.widget_id).val(ui.values[1]);		
				},
				change: function( event, ui ) {
					_eventFilter();	
					return false;
				}		   			
			});	

			$( "#button-price-slider",config.widget_id ).on('click', function(e){
				e.preventDefault();
				_eventFilter();
				return false;
			});	
			
			$("input:checkbox",config.widget_id ).on('click', function(){
				_eventFilter();	
				return false;
			});			
			
			$("li",config.widget_id ).on('click', function(){
				if($(this).hasClass('active')){
					$(this).removeClass('active');
					$("input",$(this)).attr("checked", false);
				}else{
					$(this).addClass('active');
					$("input",$(this)).attr("checked", true);
				}	
				_eventFilter();	
				return false;
			});
			
			$("span",".woocommerce-filter-title" ).on('click', function(){
				if( $(this).hasClass("text-price") ){
					$("#price-filter-min-text",config.widget_id).val($("#bwp_slider_price",config.widget_id).data('min'));
					$("#price-filter-max-text",config.widget_id).val($("#bwp_slider_price",config.widget_id).data('max'));
				}else{
					var $name = $(this).data("name");
					var $value = $(this).data("value");
					$("input[value="+$value+"]","#"+$name+"").attr("checked", false);
				}
				_eventFilter();
				return false;
			});			
		}	
		
		function _eventFilter(paged=1,load=true,direction=false,back=false,loadmore=false){
				if(load){
					$('html, body').animate({
						scrollTop: 300
					}, 300);		
					$('.content-products-list','.main-archive-product').addClass('active');
					$('.content-products-list','.main-archive-product').append( '<div class="loading loading-filter"></div>' );	
				}
				var $filter = new Object();			
				$filter.orderby 		=	$('.woocommerce-ordering').find('li.active').data("value");
				$filter.product_count 	=	$('.woocommerce-sort-count').find('li.active').data("value");	
				$filter.views			= 	($('.view-grid.active').length > 0) ?  'grid' : 'list';	
				$filter.data 			= 	$("#bwp_form_filter_product",config.widget_id).serializeArray();
				if( direction === false ){
					$filter.default_min_price 	= $("#bwp_slider_price",config.widget_id).data("min");
					$filter.default_max_price 	= $("#bwp_slider_price",config.widget_id).data("max");	
					$filter.min_price 			= $("#price-filter-min-text",config.widget_id).val();	
					$filter.max_price 			= $("#price-filter-max-text",config.widget_id).val();
				}
				$filter.paged				= paged;
				$filter.loadmore			= loadmore ? 1 : 0;
				$filter.shop_paging			= $('.woocommerce-pagination').data("shop_paging") ? $('.woocommerce-pagination').data("shop_paging") : 'shop-pagination';
				jQuery.ajax({
					type: "POST", 
					url: floomi_ajax.ajaxurl,
					dataType: 'json',
					data: {
						filter 			: $filter,
						action 			: "bwp_filter_products_callback",
						taxonomy		: config.taxonomy,
						id_taxonomy 	: config.id_taxonomy,
						base_url 		: config.base_url,
						attribute 		: config.attribute,
						relation 		: config.relation,
						show_price 		: config.show_price,
						showcount 		: config.showcount,
						show_only_sale 	: config.show_only_sale,
						show_in_stock 	: config.show_in_stock,
						show_brand 		: config.show_brand,
						show_type 		: config.show_type,
						layout_shop 	: config.layout_shop,
						show_category 	: config.show_category,
						shop_paging 	: config.shop_paging,
						array_value_url : config.array_value_url
					},
					beforeSend: function( xhr ){
						config.canbeloaded = false;
					},					
					success: function (result) {
						config.canbeloaded = true;
						if (result.products){
							if(loadmore){
								var resultHtml = $(result.products);
								var listItems = resultHtml.find('>li');
								$('.content-products-list .products-list','.main-archive-product').append(listItems);
							}else{
								$('.content-products-list','.main-archive-product').html(result.products);
							}
							_click_quickview_button();
							_event_countdown_product( $('ul.products','.main-archive-product') );
							_click_attribute_image();
							_event_variable_thumb();
							_load_swiper_product_nested();
							_load_product_hover_zoom();

						}else{
							$('.content-products-list','.main-archive-product').html('');
						}
						
						if( config.taxonomy == 'product_cat'){
							if( config.id_taxonomy > 0){
								$(".back-to-shop").addClass("active");
							}else{
								$(".back-to-shop").removeClass("active");
							}					
						}
						if(result.result_description){
							$(".description-category").html(result.result_description).css('display','block');
						}else{
							$(".description-category").html("").css('display','none')
						}
						if(direction){
							if ($(".page-title").data("bg_default")){
								if(result.result_background){
									$(".page-title").css("background-image", "url(" + result.result_background + ")");
								}else{
									$(".page-title").css("background-image", "url(" + $(".page-title").data("bg_default") + ")");
								}
							}
						}
						_event_after_sucsess_ajax(result,config);
						_phinfo_show_hover_info();
						if(load){
							setTimeout(function() {
								$('.content-products-list','.main-archive-product').removeClass('active');
								$( '.loading','.main-archive-product' ).remove();
							}, 400);
						}
					},
					error:function(jqXHR, textStatus, errorThrown) {
						console.log("error " + textStatus);
						console.log("incoming Text " + jqXHR.responseText);
					}
				});
			return false;	
		}
		function _event_after_sucsess_ajax(result,config){
			if (result.pagination){
				if( $('nav.woocommerce-pagination').length > 0 ){
					$('nav.woocommerce-pagination').replaceWith(result.pagination);
				}else{
					$('.bwp-top-bar.bottom').append(result.pagination);
				}
			}else{
				$('nav.woocommerce-pagination').html('');
			}
			if (result.result_count) 
				$('.woocommerce-result-count').replaceWith(result.result_count);
			else
				$('.woocommerce-result-count').html('');
			if (result.total_html) 
				$('.woocommerce-found-posts').replaceWith(result.total_html);
			else
				$('.woocommerce-found-posts').html('');
			if (result.result_breadcrumb){
				$('.breadcrumb').html(result.result_breadcrumb);
			}
			$('.woocommerce-filter-title').html(result.result_title);
			$('.bwp-filter-ajax',config.widget_id).replaceWith(result.left_nav);
			if(($("#price-filter-min-text",config.widget_id).val() != $("#bwp_slider_price",config.widget_id).data("min")) || ($("#price-filter-max-text",config.widget_id).val() != $("#bwp_slider_price",config.widget_id).data("max")))
				var check_price = true;
			else
				var check_price = false;
			_event_dropdown_filter();
			_event_filter_product();
			_addClassProductList();
			_event_filter_clear();
			_event_click_pagination();
			if( $( "nav.woocommerce-pagination").hasClass("shop-loadmore") ){
				_event_click_load_more();
			}
			if( $( "nav.woocommerce-pagination").hasClass("shop-infinity") ){
				_event_load_infinity();
			}
			if (result.base_url != '') 
				history.pushState({}, "", result.base_url.replace(/&amp;/g, '&').replace(/%2C/g, ','));
		}
		function _addClassProductList(){
			var class_product_default = $("ul.products-list").data("col") ? $("ul.products-list").data("col") : "";
			var class_product_item = $('.view-grid.active').data('col') ? $('.view-grid.active').data('col') : class_product_default;
			if(class_product_item){
				var list_class 	= "col-lg-12 col-md-12 col-xs-12";	
				if($('.view-grid').hasClass('active')){
					$("ul.products-list").removeClass('list').addClass('grid');
					$("ul.products-list li").removeClass(list_class).addClass(class_product_item);
				}	
				if($('.view-list').hasClass('active')){
					$("ul.products-list").removeClass('grid').addClass('list');
					$("ul.products-list li").removeClass(class_product_item).addClass(list_class);
				}	
			}
		}
		return false;
	};
	
	//Element Filter Homepage Js//
	class Elementor_Js_Wpbingo {
		static getInstance() {
			if (!Elementor_Js_Wpbingo.instance) {
				Elementor_Js_Wpbingo.instance = new Elementor_Js_Wpbingo();
			}
			return Elementor_Js_Wpbingo.instance;
		}
		constructor() {
			$(window).on('elementor/frontend/init', () => {
				this.init();
			});
		}
		init() {
			elementorFrontend.hooks.addAction('frontend/element_ready/bwp-filter-homepage.default', ($scope) => {
				let bwpFilterHomepageElem     = $scope.find('.bwp-filter-homepage');
				bwpFilterHomepageElem.each(function() {
					var $element = $(this);
					$(".bwp-filter-toggle",$element).on('click', function(){
						if($(this).hasClass('active')){
							$(this).removeClass('active');
							$(".bwp-filter-attribute",$element).slideUp();
						}else{
							$(this).addClass('active');	
							$(".bwp-filter-attribute",$element).slideDown();
						}	
					});	
					
					$("li[data-value]",$element).on('click', function(){
						var $parent = $(this).parent();
						if($parent.hasClass('filter-orderby')){
							var order_text = $(this).text();
							$('.text-orderby').html(order_text);
						}
						if($parent.hasClass('filter-category') || $parent.hasClass('filter-orderby'))
							$("li",$parent).removeClass('active');
						else
							$(this).removeClass('active');
						
						if($(this).hasClass('active')){
							$(this).removeClass('active');
						}else{
							$(this).addClass('active');
						}
						if($element.hasClass("tab-category") || $element.hasClass("tab-product")){
							var $value = $(this).data("value");
							if ($(".content-products-" + $value, $element).length > 0) {
								$(".content-product-list", $element).addClass("hidden");
								$(".content-products-" + $value, $element).removeClass("hidden");
								var count_loadmore = $('.content-product-list:not(.hidden)',$element).attr("data-page_loadmore");
								$(".count_loadmore",$element).val(parseInt(count_loadmore));
								var post_count = parseInt($('.content-product-list:not(.hidden)',$element).attr("data-post_count"));
								var list_total = parseInt($('.content-product-list:not(.hidden)',$element).attr("data-list_total"));
								if (post_count < list_total){
									$(".products_loadmore",$element).show();
								}else{
									$(".products_loadmore",$element).hide();
								}
								if ($element.hasClass("carousel")) {
									$(".bwp-swiper-slider", $element).each(function () {
										if (this.swiper) {
											let swiper = this.swiper;
											swiper.update();
										}
									});	
								}
							}else{
								var count_loadmore = $(".count_loadmore",$element).data("default");
								$(".count_loadmore",$element).val(parseInt(count_loadmore));
								_eventFilterHomePage($element);
							}
						}else{
							_eventFilterHomePage($element);
						}
					});	
					
					$(".loadmore",$element).on('click', function(){
						_eventFilterHomePage($element,true);
					});	
					
					$('.clear_all',$element).on('click', function(e){
						var $content_filter 	= $(".bwp-filter-attribute",$element);
						var bwp_slider_price 	= $(".bwp_slider_price",$element);
						$("li",$content_filter).removeClass('active'); 
						$(".price-filter-min-text",$element).val(bwp_slider_price.data("min"));
						$(".price-filter-max-text",$element).val(bwp_slider_price.data("max"));
						$(".text-price-filter-min-text",$element).html(bwp_slider_price.data("min"));
						$(".text-price-filter-max-text",$element).html(bwp_slider_price.data("max"));
						$(".ui-slider-range",bwp_slider_price).css({"left": "0px", "width": "100%"});
						$("span",bwp_slider_price).first().css("left","0px");
						$("span",bwp_slider_price).last().css("left","100%");
						_eventFilterHomePage($element); 
					});		
					
					var min_price = $(".price-filter-min-text",$element).val();
					var max_price =  $(".price-filter-max-text",$element).val();
					$(".bwp_slider_price",$element).slider({
						range:true,
						min: $(".bwp_slider_price",$element).data('min'),
						max: $(".bwp_slider_price",$element).data('max'),		
						values: [min_price,max_price],
						slide : function( event, ui ) {
								$(".text-price-filter-min-text",$element).html(ui.values[0]);
								$(".text-price-filter-max-text",$element).html(ui.values[1]);
								$(".price-filter-min-text",$element).val(ui.values[0]);		
								$(".price-filter-max-text",$element).val(ui.values[1]);		
							},
						change: function( event, ui ) {
							_eventFilterHomePage($element);		
						}
					
					});	
				});				
			});			
		}
	}
	Elementor_Js_Wpbingo.getInstance();

	function _eventFilterHomePage($element,loadmore = false){
		if(loadmore){
			$('.loadmore',$element).addClass('loading');
		}else{
			$('.bwp-filter-content',$element).addClass('active');
			$('.bwp-filter-content',$element).append('<div class="loading loading-filter"></div>');
		}
		var $filter = new Object();
		$filter.content_product = 	$element.data("content_product") ? $element.data("content_product") : "",
		$filter.category 		=	$(".filter-category li.active",$element).data("value");
		$filter.orderby 		=	$(".filter-orderby li.active",$element).data("value");
		$filter.min_price 		= 	$(".price-filter-min-text",$element).val();
		$filter.max_price 		= 	$(".price-filter-max-text",$element).val();
		$filter.loadmore 		= 	(loadmore) ? 1 : 0;
		if(loadmore){
			$filter.paged 			= 	$(".count_loadmore",$element).val();
			$filter.product_count 	= 	$element.data("showmore");
		}else{
			$filter.paged			=	1;
			$filter.product_count 	= 	$element.data("numberposts");
		}
		
		var atributes			=	$element.data("atributes");
		if(atributes){
			var atributes		=	atributes.split(',');
			for(var i=0;i<atributes.length;i++){
				var atr = [];
				$("."+atributes[i]+" li.active",$element).each(function(index){
					atr[index] = $(this).data("value");
				});
				$filter[atributes[i]] = atr;
			}						
		}	
	
		var brands  = [];
		$(".filter-brand li.active",$element).each(function(index){
			brands[index] = $(this).data("value");
		});
		
		$filter.brand = brands;
		jQuery.ajax({
			type: "POST",
			url: floomi_ajax.ajaxurl,
			dataType: 'json',
			data: {
				filter: $filter,
				action: "bwp_filter_homepage_callback",
			},
			success: function (result) {
				const $loadmoreBtn = $('.loadmore', $element);
				const $filterContent = $('.bwp-filter-content', $element);
				const $productListWrapper = $('.content-product-list', $element);
				const $contentFilter = $(".bwp-filter-attribute", $element);

				const getValue = () => {
					if ($element.hasClass("tab-category")) return $filter.category;
					if ($element.hasClass("tab-product")) return $filter.orderby;
					return '';
				};
				const $value = getValue();

				// ========== HANDLE LOADMORE ==========
				if (loadmore) {
					$loadmoreBtn.addClass('loading');

					if (result.products) {
						const count_loadmore = parseInt($(".count_loadmore", $element).val()) || 0;
						const $visibleList = $('.content-product-list:not(.hidden) .products-list', $element);

						$visibleList.append(result.products)
							.find('.item-product')
							.addClass('elementor-grid-item');

						_load_swiper_product_nested();

						const nextPage = count_loadmore + 1;
						$(".count_loadmore", $element).val(nextPage);
						$(`.content-products-${$value}`, $element)
							.attr("data-page_loadmore", nextPage)
							.attr("data-post_count", result.post_count || 0);
					}
				}

				// ========== HANDLE NORMAL FILTER ==========
				else {
					const hasTab = $element.hasClass("tab-category") || $element.hasClass("tab-product");

					if (hasTab) {
						const $childProduct = $productListWrapper.first();
						const $carouselClone = $('.bwp-swiper-slider', $childProduct).clone();
						const $listClone = $('.products-list', $childProduct).clone();

						// Update product HTML
						const productsHTML = result.products || '';
						$listClone.html(productsHTML);
						$carouselClone.find('.swiper-wrapper').html(productsHTML);

						$productListWrapper.addClass("hidden");

						const count_loadmore = parseInt($(".count_loadmore", $element).val()) || 0;
						const list_total = result.list_total || 0;
						const post_count = result.post_count || 0;
						const newContent = `<div class="content-product-list content-products-${$value}" data-page_loadmore="${count_loadmore}" data-list_total="${list_total}" data-post_count="${post_count}"></div>`;

						$productListWrapper.last().after(newContent);

						const $target = $(`.content-products-${$value}`, $element);

						if ($element.hasClass("carousel")) {
							$target.html($carouselClone);
							$carouselClone.find('.item-product').addClass('swiper-slide');
							reInitSwiper($element);
						} else {
							$target.html($listClone);
							$listClone.find('.item-product').addClass('elementor-grid-item');
						}

						_load_swiper_product_nested();
						_event_countdown_product($(".products-list", $element));
					} else {
						const productsHTML = result.products || '';
						$('.products-list', $element).html(productsHTML);
						_event_countdown_product($(".products-list", $element));
					}

					// Rebind events
					_click_attribute_image();
					_click_add_to_cart_icon();
					_click_add_to_cart_icon_text();
					_event_variable_thumb();
					_click_quickview_button();
					_load_product_hover_zoom();
				}

				// ========== HANDLE LOADMORE BUTTON ==========
				$(".products_loadmore", $element)
					.toggle(result.loadmore && result.loadmore == 1);

				// ========== REMOVE LOADING ==========
				if (loadmore) {
					$loadmoreBtn.removeClass('loading');
				} else {
					$filterContent.removeClass('active');
					$('.loading', $element).remove();
				}

				// ========== HANDLE CLEAR FILTER ==========
				const min = $(".bwp_slider_price", $element).data("min");
				const max = $(".bwp_slider_price", $element).data("max");
				const minText = $(".price-filter-min-text", $element).val();
				const maxText = $(".price-filter-max-text", $element).val();

				if ($("li.active", $contentFilter).length > 0 || minText != min || maxText != max) {
					$(".clear_all", $element).show();
				} else {
					$(".clear_all", $element).hide();
				}
			},

			error: function (jqXHR, textStatus) {
				console.log("AJAX Error:", textStatus);
				console.log("Response:", jqXHR.responseText);
			}
		});
		
		return false;	
	}
	//Load more Product
	$( ".bwp-product-list.loadmore" ).each(function() {
		let $element = $(this);
		$element.find(".loadmore").on("click", function(e) {
			e.preventDefault();
			let paged = $element.find(".count_loadmore").val();
			$.ajax({
				type: "POST", 
				url: $element.data("url"),
				dataType: 'json',
				data: {
					action 		: "bwp_load_more_callback",
					category 	:  $element.data("category"),			
					orderby 	:  $element.data("orderby"),
					order 		:  $element.data("order"),
					numberposts :  $element.data("numberposts"),
					source 		:  $element.data("source"),
					attributes 	:  $element.data("attributes"),
					total 		:  $element.data("total"),
					content_product : 	$element.data("content_product") ? $element.data("content_product") : "",
					paged 		: 	paged,
				},
				beforeSend: function() {
                    $element.find(".loadmore").addClass("loading");
                },		
				success: function(result) {
                    if (result.products) {
                        $element.find(".products-list").append(result.products);
                        paged = parseInt(paged) + 1;
                        $element.find(".count_loadmore").val(paged);
                        _event_countdown_product($element.find(".products-list"));
                    }
                    if (result.check_loadmore == 1) {
                        $element.find(".products_loadmore").hide();
                    }
                    $element.find(".loadmore").removeClass("loading");
					_phinfo_show_hover_info();
                }
			});
		});	
	});
} )( jQuery );

