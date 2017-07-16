// @flow

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
function initTracking(
  functionName: string,
  version: string,
  urlOfMainCode: string,
): boolean {
  if (window[functionName]) {
    return true;
  }

  // Define the functionName to initially push events to a queue. (See bullet #2 above.)
  // To reduce our footprint in the global namespace, we make the queue a property of the function itself.
  //   (Yes, functions in Javascript can have properties, because they are objects.)
  window[functionName] = function() {
    const argumentsAsArray = Array.from(arguments);
    window[functionName].queue.push(argumentsAsArray);
  };
  window[functionName].queue = [];
  window[functionName].version = version;

  // Download the main code by inserting a <script> tag into the document.
  // If we tried to download it within this script, we would be restricted by the same-origin policy.
  const scriptElement = document.createElement('script');
  scriptElement.async = true;
  scriptElement.src = urlOfMainCode;
  const arbitraryScriptTagInPage = document.getElementsByTagName('script')[0];
  if (!arbitraryScriptTagInPage || !arbitraryScriptTagInPage.parentNode) {
    // This situation is not expected when running in the browser.
    return false;
  }
  // Downloading will begin after the script is inserted into the DOM.
  arbitraryScriptTagInPage.parentNode.insertBefore(scriptElement, arbitraryScriptTagInPage);

  return true;
}


module.exports = {
  initTracking,
};
