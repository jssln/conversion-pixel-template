// @flow

import type { Data, StringifiedData } from './types/types';


function serializeParams(
  params: Data,
): StringifiedData {
  const newParams =
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (typeof(value) === 'object') {
      newParams[key] = JSON.stringify(value);
    } else {
      newParams[key] = value;
    }
  });
  return newParams;
}

function buildUrl(
  baseUrl: string,
  params: StringifiedData,
) {
  const keyValuePairs = Object.keys(params).map((key) => {
    const value = params[key];
    return key + '=' + encodeURIComponent(value);
  });
  return baseUrl + '?' + keyValuePairs.join('&');
}


module.exports = {
  buildUrl,
  serializeParams,
};
