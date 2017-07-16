// @flow

import downloadUtils from './helpers/download';
import { getRandomString, isValidObject } from './helpers/misc';
import urlUtils from './helpers/url';

import type { Params } from './types/types';


// TODO: Make these configurable.
const DEFAULT_OPTIONS = {
  setTagId: 'setTag',
  recordPageLoad: 'trackPageLoad',
  recordConversion: 'trackConversion',
};

const PARAMS = {
  tagId: 'tid',
  eventName: 'ev',
  eventData: 'ed',
  cacheBuster: 'cb',
  autoScrapedData: 'au',
};

const EVENT_NAMES = {
  pageLoad: 'pageload',
};

const AUTOSCRAPED_DATA_PARAMS = {
  currentPageUrl: 'loc',
  referrerUrl: 'ref',
  didPixelFireInIframe: 'inf',
  screenHeight: 'sht',
  screenWidth: 'swd',
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
function initMain(
  functionName: string,
  trackingServerUrl: string,
) {
  if (!window[functionName] || !window[functionName].queue) {
    // We are running in an environment where the init code did not run first (so the rest of this code won't work),
    // or the queue has already been replaced.
    return;
  }

  const eventQueue: Array<any> = window[functionName].queue;
  eventQueue.forEach(eventArgs => handleCall(functionName, trackingServerUrl, ...eventArgs));
  window[functionName] = handleCall;
}


function handleCall(
  functionName: string,
  trackingServerUrl: string,
  command: string,
  firstArg: string | Object,
  data?: Object,
) {
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
function setTagId(
  functionName: string,
  tagId: string,
) {
  if (typeof(tagId) === 'string') {
    window[functionName].tagId = tagId.trim();
  }
}

function recordPageLoad(
  functionName: string,
  trackingServerUrl: string,
  data?: Object,
) {
  const params = {};
  params[PARAMS.eventName] = EVENT_NAMES.pageLoad;
  if (isValidDataObject(data)) {
    params[PARAMS.eventData] = data;
  }
  sendEvent(functionName, trackingServerUrl, params);
}


function recordConversion(
  functionName: string,
  trackingServerUrl: string,
  eventName: string,
  data?: Object,
) {
  const params = {};
  params[PARAMS.eventName] = eventName;
  if (isValidDataObject(data)) {
    params[PARAMS.eventData] = data;
  }
  sendEvent(functionName, trackingServerUrl, params);
}


function sendEvent(
  functionName: string,
  trackingServerUrl: string,
  params: Object,
) {
  const augmentedParams = Object.assign({}, params, getAdditionalParams(functionName));
  const serializedParams = urlUtils.serializeParams(augmentedParams);
  const finalUrl = urlUtils.buildUrl(trackingServerUrl, serializedParams);

  // Most browsers limit GET requests to under 2048 characters. POST requests don't have this limit.
  if (finalUrl.length < 2048) {
    downloadUtils.get(finalUrl);
  } else {
    downloadUtils.post(trackingServerUrl, serializedParams);
  }
}


/**
 * Section: Helper methods
 */

function isTagIdSet(functionName: string): boolean {
  return !!window[functionName].tagId;
}

function getAdditionalParams(functionName: string) {
  const params = {};
  params[PARAMS.tagId] = window[functionName].tagId;
  params[PARAMS.autoScrapedData] = getAutoscrapedData();
  // Prevent browsers from caching the event url.
  params[PARAMS.cacheBuster] = getRandomString();
  return params;
}

function getAutoscrapedData(): Object {
  const data = {
    [AUTOSCRAPED_DATA_PARAMS.currentPageUrl]: location.href,
    [AUTOSCRAPED_DATA_PARAMS.referrerUrl]: document.referrer,
    [AUTOSCRAPED_DATA_PARAMS.didPixelFireInIframe]: window.top !== window,
  };
  // `screen` is not a public standard, but major browsers support it.
  if (screen) {
    data[AUTOSCRAPED_DATA_PARAMS.screenHeight] = screen.height;
    data[AUTOSCRAPED_DATA_PARAMS.screenWidth] = screen.width;
  }
  return data;
}


module.exports = {
  initMain,
};
