startUp();

function startUp() {
    chrome.storage.sync.get('students', initUi);
}

/**
 * Render the appropriate elements based on the students.
 */
function initUi(studentsObject) {

    let loadStudentsButton = document.getElementById('loadStudentsButton');
    loadStudentsButton.addEventListener('click', test);

    let students = studentsObject.students;

    if (students.length === 0) {
        hideStudentsPanel();
        return;
    }

    initIndicators(students);
    showStudentsPanel();
}

function hideStudentsPanel() {
    let studentsPanel = document.getElementById('studentsPanel');
    studentsPanel.classList.add('d-none');
}

function showStudentsPanel() {
    let studentsPanel = document.getElementById('studentsPanel');
    studentsPanel.classList.remove('d-none');
}

function initIndicators(students) {
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

function test() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            'loadStudents',
            callbackTest
        );
    });
}

function callbackTest(response) {
    console.log('got a response in iframe');
    console.log(response);
}