document.addEventListener('DOMContentLoaded', initStudents);

function initStudents(event) {

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