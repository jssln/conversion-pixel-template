// @flow

import { getRandomString } from './helpers';

import type { Params } from './types/types';


function get(fullUrl: string) {
  const imageElement = document.createElement('img');
  imageElement.src = fullUrl;
}

/**
 * Puts the data in a form element, and submits the form.
 */
function post(
  baseUrl: string,
  params: Params,
) {
  let formElement = createFormElement(baseUrl);
  formElement = addInputDataToForm(formElement, params);

  const randomName = getRandomString();
  const iframeElement = createIframeElement(randomName);
  formElement.appendChild(iframeElement);
  formElement.target = randomName;

  submitForm(formElement, iframeElement);
}


/**
 * Section: Helper functions to submit form
 */

function submitForm(
  formElement,
  iframeElement,
) {
  // After the form is attached to the DOM, the iframe will load.
  doWhenElementHasLoaded(iframeElement, () => {
    formElement.submit();
  });
  const attachForm = () => {
    document.body.appendChild(formElement);
  };

  if (document.readyState === 'complete') {
    attachForm();
  } else {
    doWhenElementHasLoaded(window, attachForm);
  }
}

function doWhenElementHasLoaded(
  domElement: Object,
  action: () => any,
) {
  const doActionAndDetach = () => {
    removeOnload(domElement, doActionAndDetach);
    action();
  };
  addOnload(domElement, doActionAndDetach);
}

function addOnload(
  domElement: Object,
  action: () => any,
) {
  // IE before version 9 does not support onload, and uses detachEvent/attachEvent instead.
  // https://www.nczonline.net/blog/2009/09/15/iframes-onload-and-documentdomain/
  const isPreIE9 = !!domElement.attachEvent;
  if (isPreIE9) {
    domElement.attachEvent('onload', action);
  } else {
    domElement.onload = action;
  }
}

function removeOnload(
  domElement: Object,
  action: () => any,
) {
  // IE before version 9 does not support onload, and uses detachEvent/attachEvent instead.
  // https://www.nczonline.net/blog/2009/09/15/iframes-onload-and-documentdomain/
  const isPreIE9 = !!domElement.detachEvent;
  if (isPreIE9) {
    domElement.detachEvent('onload', action);
  } else {
    domElement.onload = null;
  }
}


/**
 * Section: Helper functions to create elements
 */

function createFormElement(actionUrl: string) {
  const formElement = document.createElement('form');
  formElement.method = 'post';
  formElement.acceptCharset = 'utf-8';
  formElement.style.display = 'none';
  formElement.action = actionUrl;
  return formElement;
}

function addInputDataToForm(formElement, dataKeysToValues: Params) {
  Object.keys(params).forEach((key) => {
    const inputElement = document.createElement('input');
    inputElement.name = key;
    inputElement.value = params[key];
    formElement.appendChild(inputElement);
  });
  return formElement;
}

function createIframeElement(name: string) {
  const preIE9 = !!(window.attachEvent && !window.addEventListener);
  // Necessary to support IE 6 & 7, and 8 in compatible mode.
  // See https://stackoverflow.com/questions/2105815/weird-behaviour-of-iframe-name-attribute-set-by-jquery-in-ie
  const iframeString = preIE9 ? '<iframe name="' + name + '">' : 'iframe';
  const iframeElement = document.createElement(iframeString);
  iframeElement.id = name;
  iframeElement.name = name;
  return iframeElement;
}


module.exports = {
  get,
  post,
};
