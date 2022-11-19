chrome.runtime.onInstalled.addListener(initialSetup);

function initialSetup() {
    chrome.action.onClicked.addListener(onActionClick);
}

function onActionClick(tab) {

    let prohibitedUrl = 'chrome://';

    let prohibitedUrlRegex = new RegExp(`^${prohibitedUrl}.+`, 'i');

    if (prohibitedUrlRegex.test(tab.url)) {
        console.log(`Prohibited URL: ${tab.url}`);
        return;
    }

    //inject the main content script
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: [
            'injected/main.js'
        ]
    });
}