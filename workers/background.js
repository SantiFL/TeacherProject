let color = 'blue';

chrome.runtime.onInstalled.addListener(() => {
    console.log('start up!');
    chrome.storage.sync.set({color});
});