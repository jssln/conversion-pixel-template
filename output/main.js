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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function getRandomString() {
  return String(Math.floor(Math.random() * 100000));
}

function isValidObject(data) {
  return data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object';
}

module.exports = {
  getRandomString: getRandomString,
  isValidObject: isValidObject
};

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _main = __webpack_require__(4);

(0, _main.initMain)('trackForDemo', 'localhost:3000/trackingDemo');

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _download = __webpack_require__(5);

var _download2 = _interopRequireDefault(_download);

var _misc = __webpack_require__(0);

var _url = __webpack_require__(6);

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// TODO: Make these configurable.
var DEFAULT_OPTIONS = {
  setTagId: 'setTag',
  recordPageLoad: 'trackPageLoad',
  recordConversion: 'trackConversion'
};

var PARAMS = {
  tagId: 'tid',
  eventName: 'ev',
  eventData: 'ed',
  cacheBuster: 'cb',
  autoScrapedData: 'au'
};

var EVENT_NAMES = {
  pageLoad: 'pageload'
};

var AUTOSCRAPED_DATA_PARAMS = {
  currentPageUrl: 'loc',
  referrerUrl: 'ref',
  didPixelFireInIframe: 'inf',
  screenHeight: 'sht',
  screenWidth: 'swd'
};

/**
 * The main function that should run after this script is downloaded. It has 2 jobs:
 *   1. Replace the previous dummy tracking function (which simply pushed events onto a queue)
 *      with the real function that sends data to the tracking server.
 *   2. Process any events that have been pushed to the queue.
 *
 * @param functionName The name of the function that the end-user (e.g. advertiser) will invoke to
 *   fire a tracking event.
 * @param options Optional configuration for names of the commands the advertiser will use.
 */
function initMain(functionName, trackingServerUrl) {
  if (!window[functionName] || !window[functionName].queue) {
    // We are running in an environment where the init code did not run first (so the rest of this code won't work),
    // or the queue has already been replaced.
    return;
  }

  var eventQueue = window[functionName].queue;
  eventQueue.forEach(function (eventArgs) {
    return handleCall.apply(undefined, [functionName, trackingServerUrl].concat(_toConsumableArray(eventArgs)));
  });
  window[functionName] = handleCall;
}

function handleCall(functionName, trackingServerUrl, command, firstArg, data) {
  if (command === DEFAULT_OPTIONS.setTagId) {
    setTagId(functionName, firstArg);
  } else {
    if (!isTagIdSet(functionName)) {
      return;
    }
    if (command === DEFAULT_OPTIONS.recordPageLoad) {
      recordPageLoad(functionName, trackingServerUrl, firstArg);
    } else if (command === DEFAULT_OPTIONS.recordConversion) {
      recordConversion(functionName, trackingServerUrl, firstArg, data);
    }
  }
}

/**
 * Sets the tagId "globally" on this browser page.
 * This behavior assumes each advertiser will only have 1 conversion pixel ID per webpage.
 */
function setTagId(functionName, tagId) {
  if (typeof tagId === 'string') {
    window[functionName].tagId = tagId.trim();
  }
}

function recordPageLoad(functionName, trackingServerUrl, data) {
  var params = {};
  params[PARAMS.eventName] = EVENT_NAMES.pageLoad;
  if (isValidDataObject(data)) {
    params[PARAMS.eventData] = data;
  }
  sendEvent(functionName, trackingServerUrl, params);
}

function recordConversion(functionName, trackingServerUrl, eventName, data) {
  var params = {};
  params[PARAMS.eventName] = eventName;
  if (isValidDataObject(data)) {
    params[PARAMS.eventData] = data;
  }
  sendEvent(functionName, trackingServerUrl, params);
}

function sendEvent(functionName, trackingServerUrl, params) {
  var augmentedParams = Object.assign({}, params, getAdditionalParams(functionName));
  var serializedParams = _url2.default.serializeParams(augmentedParams);
  var finalUrl = _url2.default.buildUrl(trackingServerUrl, serializedParams);

  // Most browsers limit GET requests to under 2048 characters. POST requests don't have this limit.
  if (finalUrl.length < 2048) {
    _download2.default.get(finalUrl);
  } else {
    _download2.default.post(trackingServerUrl, serializedParams);
  }
}

/**
 * Section: Helper methods
 */

function isTagIdSet(functionName) {
  return !!window[functionName].tagId;
}

function getAdditionalParams(functionName) {
  var params = {};
  params[PARAMS.tagId] = window[functionName].tagId;
  params[PARAMS.autoScrapedData] = getAutoscrapedData();
  // Prevent browsers from caching the event url.
  params[PARAMS.cacheBuster] = (0, _misc.getRandomString)();
  return params;
}

function getAutoscrapedData() {
  var _data;

  var data = (_data = {}, _defineProperty(_data, AUTOSCRAPED_DATA_PARAMS.currentPageUrl, location.href), _defineProperty(_data, AUTOSCRAPED_DATA_PARAMS.referrerUrl, document.referrer), _defineProperty(_data, AUTOSCRAPED_DATA_PARAMS.didPixelFireInIframe, window.top !== window), _data);
  // `screen` is not a public standard, but major browsers support it.
  if (screen) {
    data[AUTOSCRAPED_DATA_PARAMS.screenHeight] = screen.height;
    data[AUTOSCRAPED_DATA_PARAMS.screenWidth] = screen.width;
  }
  return data;
}

module.exports = {
  initMain: initMain
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _misc = __webpack_require__(0);

function get(fullUrl) {
  var imageElement = document.createElement('img');
  imageElement.src = fullUrl;
}

/**
 * Puts the data in a form element, and submits the form.
 */


function post(baseUrl, params) {
  var formElement = createFormElement(baseUrl);
  formElement = addInputDataToForm(formElement, params);

  var randomName = (0, _misc.getRandomString)();
  var iframeElement = createIframeElement(randomName);
  formElement.appendChild(iframeElement);
  formElement.target = randomName;

  submitForm(formElement, iframeElement);
}

/**
 * Section: Helper functions to submit form
 */

function submitForm(formElement, iframeElement) {
  // After the form is attached to the DOM, the iframe will load.
  doWhenElementHasLoaded(iframeElement, function () {
    formElement.submit();
  });
  var attachForm = function attachForm() {
    document.body.appendChild(formElement);
  };

  if (document.readyState === 'complete') {
    attachForm();
  } else {
    doWhenElementHasLoaded(window, attachForm);
  }
}

function doWhenElementHasLoaded(domElement, action) {
  var doActionAndDetach = function doActionAndDetach() {
    removeOnload(domElement, doActionAndDetach);
    action();
  };
  addOnload(domElement, doActionAndDetach);
}

function addOnload(domElement, action) {
  // IE before version 9 does not support onload, and uses detachEvent/attachEvent instead.
  // https://www.nczonline.net/blog/2009/09/15/iframes-onload-and-documentdomain/
  var isPreIE9 = !!domElement.attachEvent;
  if (isPreIE9) {
    domElement.attachEvent('onload', action);
  } else {
    domElement.onload = action;
  }
}

function removeOnload(domElement, action) {
  // IE before version 9 does not support onload, and uses detachEvent/attachEvent instead.
  // https://www.nczonline.net/blog/2009/09/15/iframes-onload-and-documentdomain/
  var isPreIE9 = !!domElement.detachEvent;
  if (isPreIE9) {
    domElement.detachEvent('onload', action);
  } else {
    domElement.onload = null;
  }
}

/**
 * Section: Helper functions to create elements
 */

function createFormElement(actionUrl) {
  var formElement = document.createElement('form');
  formElement.method = 'post';
  formElement.acceptCharset = 'utf-8';
  formElement.style.display = 'none';
  formElement.action = actionUrl;
  return formElement;
}

function addInputDataToForm(formElement, dataKeysToValues) {
  Object.keys(params).forEach(function (key) {
    var inputElement = document.createElement('input');
    inputElement.name = key;
    inputElement.value = params[key];
    formElement.appendChild(inputElement);
  });
  return formElement;
}

function createIframeElement(name) {
  var preIE9 = !!(window.attachEvent && !window.addEventListener);
  // Necessary to support IE 6 & 7, and 8 in compatible mode.
  // See https://stackoverflow.com/questions/2105815/weird-behaviour-of-iframe-name-attribute-set-by-jquery-in-ie
  var iframeString = preIE9 ? '<iframe name="' + name + '">' : 'iframe';
  var iframeElement = document.createElement(iframeString);
  iframeElement.id = name;
  iframeElement.name = name;
  return iframeElement;
}

module.exports = {
  get: get,
  post: post
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function serializeParams(params) {
  var newParams = Object.keys(params).forEach(function (key) {
    var value = params[key];
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
      newParams[key] = JSON.stringify(value);
    } else {
      newParams[key] = value;
    }
  });
  return newParams;
}

function buildUrl(baseUrl, params) {
  var keyValuePairs = Object.keys(params).map(function (key) {
    var value = params[key];
    return key + '=' + encodeURIComponent(value);
  });
  return baseUrl + '?' + keyValuePairs.join('&');
}

module.exports = {
  buildUrl: buildUrl,
  serializeParams: serializeParams
};

/***/ })
/******/ ]);