let students;
let uploadedStudents;
let loadStudentsButton;
let studentsPanel;
let totalIndicator;
let uploadedIndicator;
let currentStudentIndex;
let currentStudentName;
let currentStudent;

startUp();

function startUp() {
    students = [];
    uploadedStudents = [];

    loadStudentsButton = document.getElementById('loadStudentsButton');
    loadStudentsButton.addEventListener('click', loadStudentsButtonClick);

    studentsPanel = document.getElementById('studentsPanel');
    totalIndicator = document.getElementById('totalIndicator');
    uploadedIndicator = document.getElementById('uploadedIndicator');

    currentStudentIndex = document.getElementById('currentStudentIndex');
    currentStudentName = document.getElementById('currentStudentName');

    initUi();
}

function initUi() {

    initIndicators();

    if (students.length === 0) {
        studentsPanel.classList.add('d-none');
        return;
    }

    currentStudent = students[0];
    initCurrentStudentSection();
    initLearningsSection();
    studentsPanel.classList.remove('d-none');
}

function initCurrentStudentSection() {
    currentStudentName.innerText = currentStudent.name;
    currentStudentIndex.innerText = `${(students.indexOf(currentStudent) + 1)}/${students.length}`;
}

function initIndicators() {
    totalIndicator.innerText = students.length;

    if (students.length === 0) {
        totalIndicator.classList.add('text-danger');
        totalIndicator.classList.remove('text-primary');
    } else {
        totalIndicator.classList.add('text-primary');
        totalIndicator.classList.remove('text-danger');
    }

    uploadedIndicator.innerText = '0';
}

function initLearningsSection(students) {

    let learnings = currentStudent.learnings;
    let learningsSection = document.getElementById('learningsSection');
    learningsSection.innerHTML = '';

    for (const learning of learnings) {

        let span = document.createElement('span');
        span.innerText = learning['prioritizedContent'];
        learningsSection.appendChild(span);

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

        let pendingLabel = document.createElement('label');
        pendingLabel.innerText = 'Pendiente';

        let pendingInput = document.createElement('input');
        pendingInput.type = 'radio';
        pendingInput.name = 'status' + learnings.indexOf(learning);
        pendingInput.innerText = learning['prioritizedContent'];

        let div2 = document.createElement('div');
        div2.classList.add('d-flex', 'justify-content-between', 'align-items-baseline');
        div2.appendChild(pendingLabel);
        div2.appendChild(pendingInput);

        div1.insertAdjacentElement('afterend', div2);
    }
}

function loadStudentsButtonClick() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, 'loadStudents', receiveStudents);
    });
    loadStudentsButton.disabled = true;
}

function receiveStudents(response) {
    students = response;
    initUi();
}