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
 * @param element DOM element to hide.
 */
function hideElement(element) {
    element.classList.add('d-none');
    element.classList.add('invisible');
    element.classList.remove('visible');
    element.hidden = true;
}

/**
 * @param element DOM element to show.
 */
function showElement(element) {
    element.classList.add('visible');
    element.classList.remove('d-none');
    element.classList.remove('invisible');
    element.hidden = false;
}

function loadStudents(event) {

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

        student.summaries = [];

        for (const textArea of textAreas) {
            student.summaries.push(textArea.value);
        }

        students.push(student);
    }

    chrome.storage.sync.set({students});
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Got a message on content script!');
    sendResponse('this is my response!')
});
