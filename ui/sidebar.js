let students;
let loadStudentsButton;
let studentPanel;
let totalIndicator;
let uploadedIndicator;
let currentStudentIndex;
let currentStudentName;
let currentStudent;
let finishedInput;
let saveButton;
let summary1Input;
let summary2Input;
let learningsSection;
let nextStudentButton;
let previousStudentButton;

startUp();

function startUp() {
    students = [];
    initUi();
}

/**
 * Assign the relevant UI elements and add event listeners where needed.
 * Run once as soon as sidebar is loaded.
 */
function initUi() {

    learningsSection = document.getElementById('learningsSection');

    loadStudentsButton = document.getElementById('loadStudentsButton');
    loadStudentsButton.addEventListener('click', loadStudentsButtonClick);

    studentPanel = document.getElementById('studentPanel');
    totalIndicator = document.getElementById('totalIndicator');
    uploadedIndicator = document.getElementById('uploadedIndicator');

    currentStudentIndex = document.getElementById('currentStudentIndex');
    currentStudentName = document.getElementById('currentStudentName');

    finishedInput = document.getElementById('finishedInput');

    saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', saveButtonClick);

    summary1Input = document.getElementById('summary1');
    summary2Input = document.getElementById('summary2');

    nextStudentButton = document.getElementById('nextStudentButton');
    nextStudentButton.addEventListener('click', nextStudentButtonClick);

    previousStudentButton = document.getElementById('previousStudentButton');
    previousStudentButton.addEventListener('click', previousStudentButtonClick);
}

/**
 * Generate the required inputs to enter the learnings' data.
 * Run once as soon as students are received.
 */
function initLearningsUi() {
    let learnings = currentStudent.learnings;

    for (const learning of learnings) {

        let span = document.createElement('span');
        span.innerText = learning['prioritizedContent'];
        learningsSection.appendChild(span);

        let accomplishedLabel = document.createElement('label');
        accomplishedLabel.innerText = 'Logrado';

        let accomplishedInput = document.createElement('input');
        accomplishedInput.type = 'radio';
        accomplishedInput.value = 'accomplished';
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
        pendingInput.value = 'pending';
        pendingInput.name = 'status' + learnings.indexOf(learning);
        pendingInput.innerText = learning['prioritizedContent'];

        let div2 = document.createElement('div');
        div2.classList.add('d-flex', 'justify-content-between', 'align-items-baseline');
        div2.appendChild(pendingLabel);
        div2.appendChild(pendingInput);

        div1.insertAdjacentElement('afterend', div2);
    }
}

function updateCurrentStudentUi() {
    currentStudentName.innerText = currentStudent.name;
    currentStudentIndex.innerText = `${(students.indexOf(currentStudent) + 1)}/${students.length}`;

    finishedInput.checked = currentStudent.finished;

    summary1Input.value = currentStudent.summary1;
    summary2Input.value = currentStudent.summary2;

    for (let i = 0; i < currentStudent.learnings.length; i++) {

        let learningInputs = learningsSection.querySelectorAll(`[name=status${i}]`);

        learningInputs[0].checked = currentStudent.learnings[i].accomplished;
        learningInputs[1].checked = currentStudent.learnings[i].pending;
    }

    saveButton.disabled = students.indexOf(currentStudent) === students.length - 1;
    nextStudentButton.disabled = students.indexOf(currentStudent) === students.length - 1;
    previousStudentButton.disabled = students.indexOf(currentStudent) === 0;
}

function updateIndicatorsUi() {
    totalIndicator.innerText = students.length;

    if (students.length === 0) {
        totalIndicator.classList.add('text-danger');
        totalIndicator.classList.remove('text-primary');
    } else {
        totalIndicator.classList.add('text-primary');
        totalIndicator.classList.remove('text-danger');
    }

    let uploadedStudentsAmount = students.filter(alumno => alumno.uploaded).length;

    if (uploadedStudentsAmount === 0) {
        uploadedIndicator.classList.add('text-danger');
        uploadedIndicator.classList.remove('text-success');
    } else {
        uploadedIndicator.classList.add('text-success');
        uploadedIndicator.classList.remove('text-danger');
    }

    uploadedIndicator.innerText = uploadedStudentsAmount;
}

/**
 * Message the content script and set a callback for it's response..
 */
function loadStudentsButtonClick() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, 'loadStudents', receiveStudents);
    });
}

/**
 * Receive the students from the content script and apply the necessary UI changes.
 * @param response The students received from the content script.
 */
function receiveStudents(response) {
    students = response;

    if (students.length === 0) {
        studentPanel.classList.add('d-none');
        return;
    }

    studentPanel.classList.remove('d-none');
    currentStudent = students[0];

    loadStudentsButton.disabled = true;

    initLearningsUi();
    updateIndicatorsUi();
    updateCurrentStudentUi();
}

//TODO 20/11/2022: doc
function saveButtonClick() {
    //TODO 20/11/2022: validate form
    updateCurrentStudent();
    updateIndicatorsUi();
    updateCurrentStudentUi();
}

/**
 * Update the relevant currentStudent attributes.
 * Assign currentStudent the next student (if it exists).
 */
function updateCurrentStudent() {
    currentStudent.uploaded = true;

    currentStudent.finished = finishedInput.checked;

    for (let i = 0; i < currentStudent.learnings.length; i++) {
        let learningInputs = learningsSection.querySelectorAll(`[name=status${i}]`);

        currentStudent.learnings[i].accomplished = learningInputs[0].checked;
        currentStudent.learnings[i].pending = learningInputs[1].checked;
    }

    currentStudent.summary1 = summary1Input.value;
    currentStudent.summary2 = summary2Input.value;

    if (students.indexOf(currentStudent) !== students.length - 1) {
        currentStudent = students[students.indexOf(currentStudent) + 1];
    }
}

function nextStudentButtonClick() {
    currentStudent = students[students.indexOf(currentStudent) + 1];
    updateCurrentStudentUi();
}

function previousStudentButtonClick() {
    currentStudent = students[students.indexOf(currentStudent) - 1];
    updateCurrentStudentUi();
}