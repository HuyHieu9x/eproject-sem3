(function ($) {
	"use strict";
	$( window ).on( 'elementor/frontend/init', () => {
		window.BwpCarouselWidget = class BwpCarouselWidget extends elementorModules.frontend.handlers.Base {
			getDefaultSettings() {
				return {
					selectors: {
						swiperContainer: '.bwp-swiper-slider',
						swiperSlide: '.swiper-slide',
					},
					slidesPerView: {
						widescreen: 3,
						desktop: 3,
						laptop: 3,
						tablet_extra: 3,
						tablet: 2,
						mobile_extra: 2,
						mobile: 1
					},
					slidesPerGroup: {
						widescreen: 1,
						desktop: 1,
						laptop: 1,
						tablet_extra: 1,
						tablet: 1,
						mobile_extra: 1,
						mobile: 1
					}
				};
			}

			getDefaultElements() {
				const selectors = this.getSettings('selectors');
				const $swiperContainer = this.$element.find(selectors.swiperContainer);
				if (!$swiperContainer.length) {
					return false;
				}
				return {
					$swiperContainer: $swiperContainer,
					$swiperSlide: this.$element.find(selectors.swiperSlide),
				};
			}

			getSliderSettings(prop) {
				const sliderSettings = ( undefined !== this.elements.$swiperContainer.data('slider-settings') ) ? this.elements.$swiperContainer.data('slider-settings') : '';

				if ( 'undefined' !== typeof prop && 'undefined' !== sliderSettings[prop] ) {
					return sliderSettings[prop];
				}

				return sliderSettings;
			}

			getWidgetID() {
				const widgetID = ( undefined !== this.elements.$swiperContainer.data('swiper-id') ) ? this.elements.$swiperContainer.data('swiper-id') : '';

				return widgetID;
			}

			getSlidesCount() {
				return this.elements.$swiperSlide.length;
			}

			getDeviceSlidesPerView(device) {
				const slidesPerViewKey = 'slides_per_view' + ('desktop' === device ? '' : '_' + device);
				return Math.min(this.getSlidesCount(), +this.getSliderSettings(slidesPerViewKey) || this.getSettings('slidesPerView')[device]);
			}

			getSlidesPerView(device) {
				return this.getDeviceSlidesPerView(device);
			}

			getDeviceSlidesToScroll(device) {
				const slidesToScrollKey = 'slides_to_scroll' + ('desktop' === device ? '' : '_' + device);
				return Math.min(this.getSlidesCount(), +this.getSliderSettings(slidesToScrollKey) || this.getSettings('slidesPerGroup')[device]);
			}

			getSlidesToScroll(device) {
				return this.getDeviceSlidesToScroll(device);
			}

			getSpaceBetween(device) {
				let propertyName = 'space_between';
				if (device && 'desktop' !== device) {
					propertyName += '_' + device;
				}
				return elementorFrontend.utils.controls.getResponsiveControlValue(this.getSliderSettings(), 'space_between', 'size', device) ?? 0;
			}

			getSwiperOptions() {
				const sliderSettings = this.getSliderSettings();
				let moduleNames = (sliderSettings.modules || '').split(',');
				let usedModules = moduleNames.map(name => {
				  name = name.trim();
				  try {
					return eval(name);
				  } catch (e) {
					return null;
				  }
				}).filter(Boolean);
				const swiperOptions = {
					grabCursor:                'yes' === sliderSettings.grab_cursor,
					slidesPerView:              this.getSlidesPerView('desktop'),
					slidesPerGroup:             this.getSlidesToScroll('desktop'),
					spaceBetween:               this.getSpaceBetween(),
					autoplay:                   'yes' === sliderSettings.autoplay,
					loop:                       'yes' === sliderSettings.loop,
					centeredSlides:             'yes' === sliderSettings.centered_slides,
					speed:                      sliderSettings.speed,
					autoHeight:                 sliderSettings.auto_height,
					effect: sliderSettings.effect,
					modules: usedModules,
					watchSlidesVisibility:      true,
					watchSlidesProgress:        true,
					preventClicksPropagation:   false,
					slideToClickedSlide:        false,
					handleElementorBreakpoints: true,
					cubeEffect: {
					  shadow: false
					},
					creativeEffect: {
						prev: {
						  shadow: true,
						  origin: "left center",
						  translate: ["-5%", 0, -200],
						  rotate: [0, 100, 0],
						},
						next: {
						  origin: "right center",
						  translate: ["5%", 0, -200],
						  rotate: [0, -100, 0],
						},
					},
				};

				swiperOptions.fadeEffect = {
					crossFade: true,
				};

				if ( sliderSettings.show_arrows ) {
					var prevEle = ( this.isEdit ) ? '.bwp-swiper-button-prev' : '.swiper-button-prev-' + this.getWidgetID();
					var nextEle = ( this.isEdit ) ? '.bwp-swiper-button-next' : '.swiper-button-next-' + this.getWidgetID();

					swiperOptions.navigation = {
						prevEl: prevEle,
						nextEl: nextEle,
					};
				}

				if ( sliderSettings.pagination ) {
					var paginationEle = ( this.isEdit ) ? '.swiper-pagination' : '.swiper-pagination-' + this.getWidgetID();

					swiperOptions.pagination = {
						el: paginationEle,
						type: sliderSettings.pagination,
						clickable: true
					};
				}

				if ( sliderSettings.show_scrollbar ) {
					var scrollbarEle = ( this.isEdit ) ? '.swiper-scrollbar' : '.swiper-scrollbar-' + this.getWidgetID();

					swiperOptions.scrollbar = {
						el: scrollbarEle,
						type: sliderSettings.scrollbar,
						draggable: true,
					};
				}

				const breakpointsSettings = {},
					breakpoints = elementorFrontend.config.responsive.activeBreakpoints;

				Object.keys(breakpoints).forEach(breakpointName => {
					breakpointsSettings[breakpoints[breakpointName].value] = {
						slidesPerView: this.getSlidesPerView(breakpointName),
						slidesPerGroup: this.getSlidesToScroll(breakpointName),
					};

					if ( this.getSpaceBetween(breakpointName) ) {
						breakpointsSettings[breakpoints[breakpointName].value].spaceBetween = this.getSpaceBetween(breakpointName);
					}
				});

				swiperOptions.breakpoints = breakpointsSettings;

				if ( !this.isEdit && sliderSettings.autoplay ) {
					swiperOptions.autoplay = {
						delay: sliderSettings.autoplay_speed,
						disableOnInteraction: !!sliderSettings.pause_on_interaction
					};
				}

				return swiperOptions;
			}

			bindEvents() {
				if (!this.elements) {
					return;
				}
				this.initSlider();
				this.toggleArrows();
				this.toggleDots();
				$(window).on("resize", this.handleResize.bind(this));
			}

			handleResize() {
				this.toggleArrows();
				this.toggleDots();
			}

			async initSlider() {
				const elementSettings = this.getElementSettings();
				const Swiper = elementorFrontend.utils.swiper;
				this.swiper = await new Swiper(this.elements.$swiperContainer, this.getSwiperOptions());

				if ('yes' === elementSettings.pause_on_hover) {
					this.togglePauseOnHover(true);
				}

				if ( 'yes' === elementSettings.equal_height_boxes ) {
					this.setEqualHeight();

					this.swiper.on('slideChange', function() {
						this.setEqualHeight();
					}.bind(this) );
				}
			}

			togglePauseOnHover(toggleOn) {
				if (toggleOn) {
					this.elements.$swiperContainer.on({
						mouseenter: () => {
							this.swiper.autoplay.stop();
						},
						mouseleave: () => {
							this.swiper.autoplay.start();
						}
					});
				} else {
					this.elements.$swiperContainer.off('mouseenter mouseleave');
				}
			}

			setEqualHeight() {
				const activeSlide = this.elements.$swiperContainer.find( '.swiper-slide-visible' );

				let maxHeight = -1;

				activeSlide.each( function() {
					let containerHeight = $(this).outerHeight();

					if ( maxHeight < containerHeight ) {
						maxHeight = containerHeight;
					}
				});
				activeSlide.each( function() {
					$(this).animate({ height: maxHeight }, { duration: 200, easing: 'linear' });
				});
			}

			toggleArrows() {
                $(".bwp-slider-arrow").each(function () {
					var $this = $(this);
					var hideOverWidth = parseInt($this.data("arrows-hide-over"));
					var hideUnderWidth = parseInt($this.data("arrows-hide-under"));
					var windowWidth = $(window).width();
			
					if (windowWidth > hideOverWidth || windowWidth < hideUnderWidth) {
						$this.hide();
					} else {
						$this.show();
					}
				});
            }

			toggleDots() {
                $(".swiper-pagination").each(function () {
					var $this = $(this);
					var hideOverWidth = parseInt($this.data("dots-hide-over"));
					var hideUnderWidth = parseInt($this.data("dots-hide-under"));
					var windowWidth = $(window).width();
			
					if (windowWidth > hideOverWidth || windowWidth < hideUnderWidth) {
						$this.hide();
					} else {
						$this.show();
					}
				});
            }
		}

		const widgets = {
			'info-box':         	'',
			'main-slider':         	'',
			'product-list': 		'',
			'filter-homepage': 		'',
			'recent-post': 	    	'',
			'instagram': 	    	'',
			'team-member': 	    	'',
			'testimonial': 	    	'',
			'brand': 	    		'',
			'product-categories': 	'',
			'countdown-product': 	'',
			'image-hotspot-carousel':	'',
			'info-categories': 	'',
		}

		$.each( widgets, function( widget, skin ) {
			if ( 'object' ===  typeof skin ) {
				$.each( skin, function( index, wSkin ) {
					elementorFrontend.elementsHandler.attachHandler( 'bwp-' + widget, BwpCarouselWidget, wSkin );
				});
			} else {
				elementorFrontend.elementsHandler.attachHandler( 'bwp-' + widget, BwpCarouselWidget );
			}
		});
		window.reInitSwiper = function ($element) {
			if (typeof window.BwpCarouselWidget !== 'undefined') {
				$(".bwp-swiper-slider", $element).each(function () {
					let swiperContainer = $(this).closest(".content-product-list");
					new window.BwpCarouselWidget({ 
						$element: swiperContainer 
					});
				});
			}   
		};
	} );
})(jQuery);