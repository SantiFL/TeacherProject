// Listener for messages sent from the sidebar content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'loadStudents') {
        sendResponse(obtainStudents());
        return;
    }
    if (message === 'uploadChanges') {
        uploadChanges(sendResponse);
    }

});

initUi();

function initUi() {

    let iframe = document.getElementById('studentManagerIFrame');

    if (!iframe) {
        generateIframe();
        iframe = document.getElementById('studentManagerIFrame');
    }

    if (iframe.hidden) {
        showElement(iframe);
        return;
    }

    hideElement(iframe);
}

/**
 * create an iframe element and append it to the current page's body.
 */
function generateIframe() {
    let iframe = document.createElement('iframe');
    iframe.id = 'studentManagerIFrame'; //TODO 17/11/2022: placeholder
    iframe.style.boxSizing = 'border-box';
    iframe.style.border = 'none';
    iframe.style.height = '100%';
    iframe.style.minWidth = '25rem';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.right = '0';
    iframe.style.zIndex = '999999999';
    iframe.style.borderLeft = '1px solid #ccc';
    iframe.style.boxShadow = '5px 0px 10px #ccc';
    iframe.src = chrome.runtime.getURL('ui/sidebar.html');
    iframe.hidden = true;
    document.body.appendChild(iframe);
}

/**
 * Hide an element using classes and it's hidden attribute.
 * @param element DOM element to hide.
 */
function hideElement(element) {
    element.classList.add('d-none');
    element.classList.add('invisible');
    element.classList.remove('visible');
    element.hidden = true;
}

/**
 * Display an element using classes and its hidden attribute.
 * @param element DOM element to show.
 */
function showElement(element) {
    element.classList.add('visible');
    element.classList.remove('d-none');
    element.classList.remove('invisible');
    element.hidden = false;
}

/**
 * Scrape the DOM for the students listed in the current page.
 * @returns An array of the students obtained from the current page.
 */
function obtainStudents() {

    let mainPanelSelector = '#MainContent_pnlEstudiantes';
    let mainPanel = document.querySelector(mainPanelSelector);

    let studentContainerSelector = '.col-lg-12';
    let studentContainers = mainPanel.querySelectorAll(studentContainerSelector);
    let students = [];

    for (const studentContainer of studentContainers) {

        if (studentContainer.children.length === 0) {
            //Omit empty ones
            continue;
        }

        let student = {};
        student.uploaded = false;

        let nameSelector = '.btn.btn-warning.btn-block span';
        let nameElement = studentContainer.querySelector(nameSelector);
        student.name = nameElement.innerText;

        let finishedInputSelector = 'input[type=checkbox]';
        let finishedInputElement = studentContainer.querySelector(finishedInputSelector);
        student.finished = finishedInputElement.checked;

        let learningsTable = studentContainer.querySelector('table');

        student.learnings = [];

        for (const row of learningsTable.rows) {

            //Skip header row
            if (row.rowIndex === 0) {
                continue;
            }

            let learning = {};

            let contentCell = row.children[0];
            learning.prioritizedContent = contentCell.innerText;

            let learningCell = row.children[1];
            learning.name = learningCell.innerText;

            let accomplishedCell = row.children[2];
            let accomplishedInput = accomplishedCell.querySelector('input');
            learning.accomplished = accomplishedInput.checked;

            let pendingCell = row.children[3];
            let pendingInput = pendingCell.querySelector('input');
            learning.pending = pendingInput.checked;

            student.learnings.push(learning);
        }

        let textAreas = studentContainer.querySelectorAll('textarea');

        student.summary1 = textAreas[0].value;
        student.summary2 = textAreas[1].value;

        students.push(student);
    }

    return students;
}

function uploadChanges(sendResponse) {
    let form = document.getElementById('aspnetForm');
    let url = 'https://gestionestudiantes.cba.gov.ar/Escuelas/' + form.getAttribute('action').slice(2);
    sendResponse(url);
}