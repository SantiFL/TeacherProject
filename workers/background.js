chrome.runtime.onInstalled.addListener(initialSetup);

function initialSetup() {
    chrome.action.onClicked.addListener(onActionClick);
    chrome.commands.onCommand.addListener(onActionShortcut);
}

function onActionShortcut(command) {
    if (command === 'openSidebar') {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
            onActionClick(tabs[0]);
        });
    }
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