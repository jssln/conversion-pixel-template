/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _init = __webpack_require__(2);

(0, _init.initTracking)('trackForDemo', '1.0', './main.js');

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * This code initializes the conversion pixel. It has 2 jobs:
 *   1. Download the "main" code -- the actual core logic of the pixel.
 *   2. Create a queue to keep track of any events that are fired before the main code is downloaded.
 */

/**
 * @param functionName The name of the function that the end-user (e.g. advertiser) will invoke to
 *   fire a tracking event. This function will be defined globally in the browser, so make it unique!
 *   e.g. 'track' is probably bad; 'trackForMyCompanyName' is better.
 * @param version The version of your pixel. This is technically not required, but good practice. If you
 *   ever upgrade your pixel implementation, this version will help.
 * @param urlOfMainCode The url to the file that contains the main JS code of the pixel.
 * @return Whether the initialization setup succeeded.
 */
function initTracking(functionName, version, urlOfMainCode) {
  if (window[functionName]) {
    return true;
  }

  // Define the functionName to initially push events to a queue. (See bullet #2 above.)
  // To reduce our footprint in the global namespace, we make the queue a property of the function itself.
  //   (Yes, functions in Javascript can have properties, because they are objects.)
  window[functionName] = function () {
    var argumentsAsArray = Array.from(arguments);
    window[functionName].queue.push(argumentsAsArray);
  };
  window[functionName].queue = [];
  window[functionName].version = version;

  // Download the main code by inserting a <script> tag into the document.
  // If we tried to download it within this script, we would be restricted by the same-origin policy.
  var scriptElement = document.createElement('script');
  scriptElement.async = true;
  scriptElement.src = urlOfMainCode;
  var arbitraryScriptTagInPage = document.getElementsByTagName('script')[0];
  if (!arbitraryScriptTagInPage || !arbitraryScriptTagInPage.parentNode) {
    // This situation is not expected when running in the browser.
    return false;
  }
  // Downloading will begin after the script is inserted into the DOM.
  arbitraryScriptTagInPage.parentNode.insertBefore(scriptElement, arbitraryScriptTagInPage);

  return true;
}

module.exports = {
  initTracking: initTracking
};

/***/ })
/******/ ]);