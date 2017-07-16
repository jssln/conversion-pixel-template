// @flow

type APIOptions = {
  setTagId?: string,
  recordPageLoad?: string,
  recordConversion?: string,
};

const DEFAULT_OPTIONS = {
  setTagId: 'setTag',
  recordPageLoad: 'trackPageLoad',
  recordConversion: 'trackConversion',
};

// TODO: Also make these configurable.
const PARAMS = {
  tagId: 'tid',
  eventName: 'ev',
  eventData: 'ed',
};

// TODO: Also make these configurable.
const EVENT_NAMES = {
  pageLoad: 'pageload',
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
  options: ?APIOptions,
) {
  if (!window[functionName] || !window[functionName].queue) {
    // We are running in an environment where the init code did not run first (so the rest of this code won't work),
    // or the queue has already been replaced.
    return;
  }

  const eventQueue: Array<any> = window[functionName].queue;
  eventQueue.forEach(eventArgs => handleCall(functionName, ...eventArgs));
  window[functionName] = handleCall;
}


function handleCall(
  functionName: string,
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
      recordPageLoad(functionName, firstArg);
    } else if (command === DEFAULT_OPTIONS.recordConversion) {
      recordConversion(functionName, firstArg, data);
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
  data?: Object,
) {
  const params = {};
  params[PARAMS.eventName] = EVENT_NAMES.pageLoad;
  if (isValidDataObject(data)) {
    params[PARAMS.eventData] = data;
  }
  sendEvent(params);
}


function recordConversion(
  functionName: string,
  eventName: string,
  data?: Object,
) {
  const params = {};
  params[PARAMS.eventName] = eventName;
  if (isValidDataObject(data)) {
    params[PARAMS.eventData] = data;
  }
  sendEvent(params);
}

/**
 * Section: Helper methods
 */

function sendEvent() {
  // TODO
}

function isTagIdSet(functionName: string): boolean {
  return !!window[functionName].tagId;
}

function isValidDataObject(data: ?Object): boolean {
  return data && typeof(data) === 'object';
}


module.exports = {
  initMain,
};
