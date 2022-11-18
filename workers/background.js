chrome.runtime.onInstalled.addListener(initialSetup);

function initialSetup() {
    let students = [];
    chrome.storage.sync.set({students});
    chrome.action.onClicked.addListener(messageContentScript);
}

function messageContentScript(tab) {
    // let allowedUrl = 'https://gestionestudiantes.cba.gov.ar/Escuelas/Aprendizajes';
    let allowedUrl = 'file:///C:/'; //TODO 15/11/2022: placeholder

    //Define allowed URL
    let allowedUrlRegex = new RegExp(`^${allowedUrl}.+`, 'i');

    //Get current URL
    if (!allowedUrlRegex.test(tab.url)) {
        return;
    }

    chrome.tabs.sendMessage(tab.id, "clickedActionIcon");
}