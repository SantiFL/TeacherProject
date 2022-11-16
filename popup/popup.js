//Query active tabs
chrome.tabs.query({active: true, lastFocusedWindow: true}, initUi);

/**
 * Display the correct ui based on the current URL.
 */
function initUi(tabs) {

    // let allowedUrl = 'https://gestionestudiantes.cba.gov.ar/Escuelas/Aprendizajes';
    let allowedUrl = 'https://www.youtube.com'; //TODO 15/11/2022: placeholder

    //Define allowed URL
    let allowedUrlRegex = new RegExp(`^${allowedUrl}.+`, 'i');

    //Get current URL
    let currentUrl = tabs[0].url;

    if (allowedUrlRegex.test(currentUrl)) {
        updateUiAllowed();

        //Early exit to avoid else block
        return;
    }

    updateUiDenied();
}

/**
 * Display the ui seen on allowed sites.
 */
function updateUiAllowed() {
    let allowedSiteMainContainer = document.getElementById('allowedSiteMainContainer');
    let nonAllowedSiteMainContainer = document.getElementById('nonAllowedSiteMainContainer');
    showElement(allowedSiteMainContainer);
    hideElement(nonAllowedSiteMainContainer);
}

/**
 * Display the ui seen on non-allowed sites.
 */
function updateUiDenied() {
    let allowedSiteMainContainer = document.getElementById('allowedSiteMainContainer');
    let nonAllowedSiteMainContainer = document.getElementById('nonAllowedSiteMainContainer');
    hideElement(allowedSiteMainContainer);
    showElement(nonAllowedSiteMainContainer);
}

/**
 * @param element DOM element to hide.
 */
function hideElement(element) {
    element.classList.add('d-none');
    element.classList.add('invisible');
    element.classList.remove('visible');
}

/**
 * @param element DOM element to show.
 */
function showElement(element) {
    element.classList.add('visible');
    element.classList.remove('d-none');
    element.classList.remove('invisible');
}

/*
let nameInput = document.getElementById('nameInput');
let scoreInput = document.getElementById('scoreInput');
let saveButton = document.getElementById('saveButton');
let loadStudentsButton = document.getElementById('loadStudentsButton');

//TODO 14/11/2022: implement
let studentsTableId = 'placeholder';

let relevantInputId1 = 'MainContent_rptEstudiantes_txtSintesis1_0';
let relevantInputId2 = 'MainContent_rptEstudiantes_txtSintesis2_0';

let relevatInput1 = document.getElementById(relevantInputId1);
let relevatInput2 = document.getElementById(relevantInputId2);

loadStudentsButton.addEventListener('click', async () => {
    chrome.storage.sync.get('savedItems', saveItem);
});

saveButton.addEventListener("click", async () => {
    // let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    //
    // chrome.scripting.executeScript({
    //     target: {tabId: tab.id},
    //     func: setPageBackgroundColor,
    // });

    chrome.storage.sync.get('savedItems', saveItem);
});


function saveItem(synchedEntries) {

    let savedItems = new Array(synchedEntries['savedItems']);
    let newItem = getItem();

    savedItems.push(newItem);
}

function getItem() {
    let newItem = {
        name: 'John Placholder Doe',
        firstSummary: relevatInput1.getAttribute('value'),
        secondSummary: relevatInput2.getAttribute('value')
    };

    return newItem;
}
 */