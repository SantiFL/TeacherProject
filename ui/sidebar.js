let students;
let loadStudentsButton;
let finalizeButton;
let studentPanel;
let totalIndicator;
let uploadedIndicator;
let currentStudentIndex;
let currentStudentName;
let currentStudent;
let finishedInput;
let mainActionButton;
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

    finalizeButton = document.getElementById('finalizeButton');
    finalizeButton.addEventListener('click', finalizeButtonClick);

    studentPanel = document.getElementById('studentPanel');
    totalIndicator = document.getElementById('totalIndicator');
    uploadedIndicator = document.getElementById('uploadedIndicator');

    currentStudentIndex = document.getElementById('currentStudentIndex');
    currentStudentName = document.getElementById('currentStudentName');

    finishedInput = document.getElementById('finishedInput');

    mainActionButton = document.getElementById('mainActionButton');
    mainActionButton.addEventListener('click', mainActionButtonClick);

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
    learningsSection.innerHTML = "";

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

/**
 * Update the DOM elements related to the student being edited currently.
 * Also updates every button besides the "Load students" button.
 */
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

    nextStudentButton.disabled = students.indexOf(currentStudent) === students.length - 1;
    previousStudentButton.disabled = students.indexOf(currentStudent) === 0;
}

/**
 * Update the indicators' DOM elements.
 */
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
 * Message the content script and set a callback for its response.
 */
function loadStudentsButtonClick() {
    if (students.length !== 0 && !confirm("Se perderán los cambios no guardados.")) {
        return;
    }

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

    initLearningsUi();
    updateIndicatorsUi();
    updateCurrentStudentUi();
    updateMainActionButtonUi();
    updateLoadStudentsButtonUi();
    updateFinalizeButtonUi();
}

/**
 * Save changes made on the current student and setup to edit the next one.
 */
function mainActionButtonClick() {
    //TODO 20/11/2022: validate form?

    if (students.indexOf(currentStudent) !== students.length - 1) {
        nextStudentButtonClick();
        return;
    }

    updateCurrentStudent();
    updateIndicatorsUi();
    uploadChanges();
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
}

/**
 * Discard changes made on current student and setup to edit the next one.
 */
function nextStudentButtonClick() {
    updateCurrentStudent();
    if (students.indexOf(currentStudent) !== students.length - 1) {
        currentStudent = students[students.indexOf(currentStudent) + 1];
    }
    updateIndicatorsUi();
    updateCurrentStudentUi();
    updateMainActionButtonUi();
    updateFinalizeButtonUi();
}

/**
 * Discard changes made on current student and setup to edit the previous one.
 */
function previousStudentButtonClick() {
    updateCurrentStudent();
    if (students.indexOf(currentStudent) !== 0) {
        currentStudent = students[students.indexOf(currentStudent) - 1];
    }
    updateIndicatorsUi();
    updateCurrentStudentUi();
    updateMainActionButtonUi();
    updateFinalizeButtonUi();
}

function updateMainActionButtonUi() {
    if (students.indexOf(currentStudent) === students.length - 1) {
        mainActionButton.innerText = 'Guardar';
    } else {
        mainActionButton.innerText = 'Siguiente';
    }
}

function updateFinalizeButtonUi() {
    finalizeButton.disabled = students.length === 0;
}

function updateLoadStudentsButtonUi() {
    if (students.length === 0) {
        loadStudentsButton.disabled = true;
        loadStudentsButton.classList.add('btn-main');
        loadStudentsButton.classList.remove('btn-danger');
    } else {
        loadStudentsButton.disabled = false;
        loadStudentsButton.classList.add('btn-danger');
        loadStudentsButton.classList.remove('btn-main');
    }
}

function uploadChanges() {
    //TODO 12/5/2022: proper callback
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, 'uploadChanges', receiveUploadUpdate);
    });
}

function receiveUploadUpdate(url) {
    console.log(url);
    console.log('receivedupdate');
}


function finalizeButtonClick() {
    uploadChanges();
}