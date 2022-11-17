//Query active tabs
chrome.tabs.query({active: true, lastFocusedWindow: true}, initUi);

/**
 * Display the correct ui based on the current URL.
 */
function initUi(tabs) {

    // let allowedUrl = 'https://gestionestudiantes.cba.gov.ar/Escuelas/Aprendizajes';
    let allowedUrl = 'file:///C:/'; //TODO 15/11/2022: placeholder

    //Define allowed URL
    let allowedUrlRegex = new RegExp(`^${allowedUrl}.+`, 'i');

    //Get current URL
    let currentUrl = tabs[0].url;

    if (allowedUrlRegex.test(currentUrl)) {
        chrome.storage.sync.get('students', renderUiAllowed);

        //Early exit to avoid else block
        return;
    }

    renderUiDenied();
}

/**
 * Display the ui seen on allowed sites.
 */
function renderUiAllowed(students) {
    let allowedSiteMainContainer = document.getElementById('allowedSiteMainContainer');
    let nonAllowedSiteMainContainer = document.getElementById('nonAllowedSiteMainContainer');
    showElement(allowedSiteMainContainer);
    hideElement(nonAllowedSiteMainContainer);
    initIndicators(students['students']);
    initLearningForm(students['students']);
}

/**
 * Display the ui seen on non-allowed sites.
 */
function renderUiDenied() {
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

function initIndicators(students) {
    console.log(students);
    let totalIndicator = document.getElementById('totalIndicator');
    totalIndicator.innerText = students.length;

    let uploadedIndicator = document.getElementById('uploadedIndicator');
    uploadedIndicator.innerText = 0;
}


function initLearningForm(students) {

    let learnings = students[0].learnings;
    let studentForm = document.getElementById('studentForm');

    for (const learning of learnings) {

        let span = document.createElement('span');
        span.innerText = learning['prioritizedContent'];
        studentForm.children[0].insertAdjacentElement('afterend', span);

        let accomplishedLabel = document.createElement('label');
        accomplishedLabel.innerText = 'Logrado';

        let accomplishedInput = document.createElement('input');
        accomplishedInput.type = 'radio';
        accomplishedInput.name = 'status' + learnings.indexOf(learning);
        accomplishedInput.innerText = learning['prioritizedContent'];

        let div1 = document.createElement('div');
        div1.classList.add('d-flex', 'justify-content-between', 'align-items-baseline');
        div1.appendChild(accomplishedLabel);
        div1.appendChild(accomplishedInput);

        span.insertAdjacentElement('afterend', div1);

        let finishedLabel = document.createElement('label');
        finishedLabel.innerText = 'Finalizado';

        let finishedInput = document.createElement('input');
        finishedInput.type = 'radio';
        finishedInput.name = 'status' + learnings.indexOf(learning);
        finishedInput.innerText = learning['prioritizedContent'];

        let div2 = document.createElement('div');
        div2.classList.add('d-flex', 'justify-content-between', 'align-items-baseline');
        div2.appendChild(finishedLabel);
        div2.appendChild(finishedInput);

        div1.insertAdjacentElement('afterend', div2);
    }
}