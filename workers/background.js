let students = [];

let savedItems = [
    {
        name: 'Jorge Lopez',
        firstSummary: '1st example',
        secondSummary: '2nd example'
    }
];

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({savedItems});
});