"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var floomi = floomi || {};

/**
 * Is the DOM ready?
 *
 * This implementation is coming from https://gomakethings.com/a-native-javascript-equivalent-of-jquerys-ready-method/
 *
 * @param {Function} fn Callback function to run.
 */
floomi.helpers = {
  floomiDomReady: function floomiDomReady(fn) {
    if (typeof fn !== 'function') {
      return;
    }
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      return fn();
    }
    document.addEventListener('DOMContentLoaded', fn, false);
  },
  ajax: function ajax(action, nonce, extraParams, successCallback) {
    var ajax = new XMLHttpRequest();
    ajax.open('POST', floomi.ajaxurl, true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        successCallback.apply(this);
      }
    };
    var extraParamsStr = '';
    extraParams = Object.entries(extraParams);
    for (var i = 0; i < extraParams.length; i++) {
      extraParamsStr += '&' + extraParams[i].join('=');
    }
    ajax.send('action=' + action + '&nonce=' + nonce + extraParamsStr);
  },
  setCookie: function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },
  getCookie: function getCookie(cname) {
    var name = cname + "=",
      ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },
};

/**
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
floomi.navigation = {
  init: function init() {
    var self = this,
      siteNavigation = document.getElementById('site-navigation') == null ? document.getElementById('site-navigation-mobile') : document.getElementById('site-navigation'),
      offCanvas = document.getElementsByClassName('bwp-offcanvas-menu')[0],
      button = document.getElementsByClassName('menu-toggle')[0];
    if (siteNavigation === null) {
      return;
    }

    // Return early if the navigation don't exist.
    if (!siteNavigation && typeof button === 'undefined') {
      return;
    }
    if (typeof offCanvas === 'undefined') {
      return;
    }
    var closeButton = document.getElementsByClassName('mobile-menu-close')[0];

    // Return early if the button don't exist.
    if ('undefined' === typeof button) {
      return;
    }
    var menu = siteNavigation.getElementsByTagName('ul')[0];
    var mobileMenuClose = siteNavigation.getElementsByClassName('mobile-menu-close')[0];

    // Hide menu toggle button if menu is empty and return early.
    if ('undefined' === typeof menu) {
      button.style.display = 'none';
      return;
    }
    if (!menu.classList.contains('nav-menu')) {
      menu.classList.add('nav-menu');
    }
    var focusableEls = offCanvas.querySelectorAll('a[href]:not([disabled]):not(.mobile-menu-close)');
    var firstFocusableEl = focusableEls[0];
    button.addEventListener('click', function (e) {
      e.preventDefault();
      button.classList.add('open');
      offCanvas.classList.add('toggled');
      document.body.classList.add('mobile-menu-visible');

      //Toggle submenus
      var submenuToggles = offCanvas.querySelectorAll('.menu-item-has-children > .dropdown-symbol');
      var _iterator = _createForOfIteratorHelper(submenuToggles),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var submenuToggle = _step.value;
          submenuToggle.addEventListener('touchstart', submenuToggleHandler);
          submenuToggle.addEventListener('click', submenuToggleHandler);
          submenuToggle.addEventListener('keydown', function (e) {
            var isTabPressed = e.key === 'Enter' || e.keyCode === 13;
            if (!isTabPressed) {
              return;
            }
            e.preventDefault();
            var parent = submenuToggle.parentNode.parentNode;
            parent.getElementsByClassName('sub-menu')[0].classList.toggle('toggled');
          });
        }

        //Trap focus inside modal
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      firstFocusableEl.focus();
    });
    function submenuToggleHandler(e) {
      e.preventDefault();
      var parent = e.target.closest('li');
      parent.querySelector('.sub-menu').classList.toggle('toggled');
    }

    // Close the offcanvas when a anchor that contains a hash is clicked
    var anchors = offCanvas.querySelectorAll('a[href*="#"]');
    if (anchors.length) {
      var _iterator2 = _createForOfIteratorHelper(anchors),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var anchor = _step2.value;
          anchor.addEventListener('click', function (e) {
            if (e.target.hash && document.querySelector(e.target.hash) !== null && !e.target.classList.contains('bwp-tabs-nav-link')) {
              button.classList.remove('open');
              offCanvas.classList.remove('toggled');
              document.body.classList.remove('mobile-menu-visible');
            }
          });
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    var focusableEls = offCanvas.querySelectorAll('a[href]:not([disabled])');
    var firstFocusableEl = focusableEls[0];
    var lastFocusableEl = focusableEls[focusableEls.length - 1];
    var KEYCODE_TAB = 9;
    lastFocusableEl.addEventListener('keydown', function (e) {
      var isTabPressed = e.key === 'Tab' || e.keyCode === KEYCODE_TAB;
      if (!isTabPressed) {
        return;
      }
      if (e.shiftKey) /* shift + tab */{} else /* tab */{
          firstFocusableEl.focus();
        }
    });
    closeButton.addEventListener('click', function (e) {
      e.preventDefault();
      var buttonRect = button.getBoundingClientRect();
      if (buttonRect.top + buttonRect.height > 0) {
        button.focus();
      }
      button.classList.remove('open');
      offCanvas.classList.remove('toggled');
      document.body.classList.remove('mobile-menu-visible');
    });
    document.addEventListener('click', function (e) {
      if (e.target.closest('.bwp-offcanvas-menu') === null && !e.target.classList.contains('menu-toggle') && e.target.closest('.menu-toggle') === null) {
        button.classList.remove('open');
        offCanvas.classList.remove('toggled');
        document.body.classList.remove('mobile-menu-visible');
      }
    });

    // Get all the link elements within the menu.
    var links = menu.getElementsByTagName('a');

    // Get all the link elements with children within the menu.
    var linksWithChildren = menu.querySelectorAll('.menu-item-has-children > a, .page_item_has_children > a');

    // Toggle focus each time a menu link is focused or blurred.
    var _iterator3 = _createForOfIteratorHelper(links),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var link = _step3.value;
        link.addEventListener('focus', toggleFocus, true);
        link.addEventListener('blur', toggleFocus, true);
      }

      // Toggle focus each time a menu link with children receive a touch event.
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    var _iterator4 = _createForOfIteratorHelper(linksWithChildren),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var _link = _step4.value;
        _link.addEventListener('touchstart', toggleFocus, false);
      }

      /**
       * Sets or removes .focus class on an element.
       */
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    function toggleFocus() {
      if (event.type === 'focus' || event.type === 'blur') {
        var _self2 = this;
        // Move up through the ancestors of the current link until we hit .nav-menu.
        while (!_self2.classList.contains('nav-menu')) {
          // On li elements toggle the class .focus.
          if ('li' === _self2.tagName.toLowerCase()) {
            _self2.classList.toggle('focus');
          }
          _self2 = _self2.parentNode;
        }
      }
    }
  },
};


/**
 * Sticky header
 */
floomi.stickyHeader = {
  init: function init() {
    var _this = this,
      sticky = document.getElementsByClassName('sticky-header')[0],
      bwp_sticky = document.getElementsByClassName('bwp-sticky-header')[0],
      body = document.getElementsByTagName('body')[0];
    this.updatePaddingBottom();
    window.addEventListener('resize', this.updatePaddingBottom.bind(this));
    if ('undefined' === typeof sticky && 'undefined' === typeof bwp_sticky) {
      return;
    }
	if(mobileBreakpoint!== null){
		if (window.innerWidth >= mobileBreakpoint) {
			var sticky_selector = 'undefined' !== typeof sticky ? '.sticky-header' : '.bwp-desktop .bwp-sticky-header:not(.bt-d-none)';
		}else{
			var sticky_selector = 'undefined' !== typeof sticky ? '.sticky-header' : '.bwp-mobile .bwp-sticky-header:not(.bt-d-none)';
		}
	}else{
		var sticky_selector = 'undefined' !== typeof sticky ? '.sticky-header' : '.bwp-sticky-header';
	}
    if ('undefined' === typeof sticky) {
      sticky = bwp_sticky;
    }
    var topOffset = window.pageYOffset || document.documentElement.scrollTop;
    if (topOffset > 10) {
      sticky.classList.add('is-sticky');
      body.classList.add('sticky-header-active');
      window.dispatchEvent(new Event('floomi.sticky.header.activated'));
    }
    var header_offset_y = document.querySelector(sticky_selector).getBoundingClientRect().height;
    if (document.body.classList.contains('admin-bar')) {
      header_offset_y = header_offset_y - 32;
    }
    if (sticky.classList.contains('sticky-scrolltop') || document.querySelector('.bwp.sticky-scrolltop') !== null) {
      var lastScrollTop = 0;
      window.addEventListener('scroll', function () {
        var scroll = window.pageYOffset || document.documentElement.scrollTop,
          is_sticky = scroll > lastScrollTop || scroll < 10;
        if (document.querySelector('.bwp.sticky-scrolltop') !== null) {
          var bwp_header_height = document.querySelector('.bwp.sticky-scrolltop').getBoundingClientRect().height;
          is_sticky = scroll < bwp_header_height;
        }
        if (is_sticky) {
          sticky.classList.remove('is-sticky');
          body.classList.remove('sticky-header-active');
          _this.isHBStickyDeactivated('scrolltop');
          body.classList.add('on-header-area');
          window.dispatchEvent(new Event('floomi.sticky.header.deactivated'));
        } else {
          sticky.classList.add('is-sticky');
          body.classList.add('sticky-header-active');
          _this.isHBStickyActive('scrolltop');
          body.classList.remove('on-header-area');
          window.dispatchEvent(new Event('floomi.sticky.header.activated'));
        }
        lastScrollTop = scroll <= 0 ? 0 : scroll;
      }, false);
    } else {
      window.addEventListener('scroll', function () {
        var vertDist = window.scrollY;
        if (vertDist > header_offset_y) {
          sticky.classList.add('sticky-shadow');
          body.classList.add('sticky-header-active');
          _this.isHBStickyActive();
          window.dispatchEvent(new Event('floomi.sticky.header.activated'));
        } else {
          sticky.classList.remove('sticky-shadow');
          body.classList.remove('sticky-header-active');
          _this.isHBStickyDeactivated();
          window.dispatchEvent(new Event('floomi.sticky.header.deactivated'));
        }
      }, false);
    }
  },
  updatePaddingBottom: function updatePaddingBottom() {
    var body = document.getElementsByTagName('body')[0];
    var bwp_header_mb_height = document.querySelector('.bwp-header.bwp-mobile_toolbar .bwp-toolbar_header_row')?.getBoundingClientRect().height || 0;
    if (body.classList.contains('bt-d-none')) {
        return;
    }
    if (window.matchMedia('screen and (min-width: ' + mobileBreakpoint + 'px)').matches) {
      body.style.paddingBottom = `${bwp_header_mb_height}px`;
    } else {
      body.style.paddingBottom = `${bwp_header_mb_height}px`;
    }
  },
  isHBStickyActive: function isHBStickyActive(effect) {
    var bwp = document.querySelector('header.bwp-header'),
      has_admin_bar = document.body.classList.contains('admin-bar'),
      above_header_row = document.querySelector('.bwp-above_header_row'),
      main_header_row = document.querySelector('.bwp-main_header_row'),
      below_header_row = document.querySelector('.bwp-below_header_row');
    if (bwp === null) {
      return false;
    }
    var topVal = 0,
      convertToPositive = false;
    if (bwp.classList.contains('sticky-row-main-header-row')) {
      if (!above_header_row.classList.contains('bt-d-none')) {
        topVal = above_header_row.clientHeight;
      } else {
        convertToPositive = true;
      }

      // Admin Bar
      if (has_admin_bar) {
        topVal = topVal - 32;
      } else {
        if (!above_header_row.classList.contains('bt-d-none')) {
          convertToPositive = false;
        }
      }
      
      // Conert to negative value
      topVal = convertToPositive ? +Math.abs(topVal) : -Math.abs(topVal);
      bwp.style.top = "".concat(topVal, "px");
    }
    if (bwp.classList.contains('sticky-row-below-header-row')) {
      if (!below_header_row.classList.contains('bt-d-none')) {
        if (has_admin_bar) {
          topVal = bwp.clientHeight - below_header_row.clientHeight - 32 - parseFloat(getComputedStyle(below_header_row).borderBottomWidth);
        } else {
          topVal = bwp.clientHeight - below_header_row.clientHeight - parseFloat(getComputedStyle(below_header_row).borderBottomWidth);
        }
      }
      if (above_header_row.classList.contains('bt-d-none') && main_header_row.classList.contains('bt-d-none')) {
        convertToPositive = true;
      }

      // Conert to negative value
      topVal = convertToPositive ? +Math.abs(topVal) : -Math.abs(topVal);
      bwp.style.top = "".concat(topVal, "px");
    }
  },
  isHBStickyDeactivated: function isHBStickyDeactivated() {
    var bwp = document.querySelector('header.bwp_hb');
    var has_admin_bar = document.body.classList.contains('admin-bar');
    var adminBarOffset = has_admin_bar ? 0 : 0;

    if (bwp === null) {
        return false;
    }

    if (bwp.classList.contains('sticky-row-main-header-row')) {
        bwp.style.top = adminBarOffset + 'px';
    }

    if (bwp.classList.contains('sticky-row-below-header-row')) {
        var belowHeaderRow = document.querySelector('.bwp-below_header_row');
        if (belowHeaderRow && !belowHeaderRow.classList.contains('bt-d-none')) {
            bwp.style.top = adminBarOffset + 'px';
        }
    }
  }
};

/**
 * Floomi scroll direction
 */
floomi.scrollDirection = {
  init: function init() {
    var body = document.getElementsByTagName('body')[0];
    var lastScrollTop = 0;
    window.addEventListener('scroll', function () {
      var scroll = window.pageYOffset || document.documentElement.scrollTop;
      if (scroll > lastScrollTop) {
        body.classList.remove('bwp-scrolling-up');
        body.classList.add('bwp-scrolling-down');
      } else {
        body.classList.remove('bwp-scrolling-down');
        body.classList.add('bwp-scrolling-up');
      }
      lastScrollTop = scroll <= 0 ? 0 : scroll;
    }, false);
  }
};


floomi.helpers.floomiDomReady(function () {
  floomi.navigation.init();
  floomi.stickyHeader.init();
  floomi.scrollDirection.init();
});