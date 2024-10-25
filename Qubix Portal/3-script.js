// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyChlhx-kTY4UQTU3azu9u8oro0r2FtFJJc",
  authDomain: "qubix-portal.firebaseapp.com",
  databaseURL: "https://qubix-portal-default-rtdb.firebaseio.com/",
  projectId: "qubix-portal",
  storageBucket: "qubix-portal.appspot.com",
  messagingSenderId: "781184232187",
  appId: "1:781184232187:web:b130c55c273e23ce435e5e"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.getElementById('add-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const studentName = document.getElementById('studentName').value;
  const studentClass = document.getElementById('studentClass').value;
  const mobileNumber = document.getElementById('mobileNumber').value;
  const instalment = document.getElementById('instalment').value;
  const totalFee = document.getElementById('totalFee').value;
  const joiningYear = document.getElementById('joiningYear').value;
  const addError = document.getElementById('addError');

  if (!studentName || !studentClass || !mobileNumber || !instalment || !totalFee || !joiningYear) {
    addError.textContent = 'Please fill in all fields.';
    return;
  }

  const studentData = {
    name: studentName,
    class: studentClass,
    mobile: mobileNumber,
    instalment: instalment,
    fee: totalFee,
    year: joiningYear
  };

  const studentRef = database.ref('students/' + studentName);
  studentRef.set(studentData, function(error) {
    if (error) {
      addError.textContent = 'Failed to save data. Try again.';
    } else {
      addError.textContent = 'Student details saved successfully!';
    }
  });

  clearForm();
  displayStudents();
});

document.getElementById('viewBtn').addEventListener('click', function() {
  transitionContent('addDetails', 'viewDetails', 'addBtn', 'viewBtn');
  displayStudents();
});

document.getElementById('addBtn').addEventListener('click', function() {
  transitionContent('viewDetails', 'addDetails', 'viewBtn', 'addBtn');
  clearForm();
});

document.getElementById('searchName').addEventListener('input', function() {
  displayStudents(this.value.toLowerCase());
});

function transitionContent(hideId, showId, deactivateBtn, activateBtn) {
  const hideElement = document.getElementById(hideId);
  const showElement = document.getElementById(showId);

  hideElement.classList.remove('active');
  hideElement.classList.add('transition-out');

  setTimeout(function() {
    hideElement.classList.remove('transition-out');
    hideElement.style.display = 'none';
    showElement.style.display = 'block';
    setTimeout(function() {
      showElement.classList.add('active');
    }, 50);
  }, 500);

  document.getElementById(deactivateBtn).classList.remove('active');
  document.getElementById(activateBtn).classList.add('active');
}

function displayStudents(searchName = '') {
  const studentList = document.getElementById('studentList');
  studentList.innerHTML = '';

  database.ref('students').once('value', function(snapshot) {
    const students = snapshot.val() || {};

    Object.keys(students).filter(name => name.toLowerCase().includes(searchName)).forEach(name => {
      const student = students[name];
      const studentItem = document.createElement('div');
      studentItem.classList.add('student-item');
      studentItem.innerHTML = `
        <span>${student.name}</span>
        <div>
          <button class="action-btn edit-btn">Edit</button>
          <button class="action-btn delete-btn">Delete</button>
        </div>
      `;

      studentItem.querySelector('.edit-btn').addEventListener('click', function() {
        editStudent(name);
      });

      studentItem.querySelector('.delete-btn').addEventListener('click', function() {
        deleteStudent(name);
      });

      studentList.appendChild(studentItem);
    });
  });
}

function editStudent(studentName) {
  const studentRef = database.ref('students/' + studentName);
  studentRef.once('value', function(snapshot) {
    const student = snapshot.val();
    if (student) {
      document.getElementById('studentName').value = student.name;
      document.getElementById('studentClass').value = student.class;
      document.getElementById('mobileNumber').value = student.mobile;
      document.getElementById('instalment').value = student.instalment;
      document.getElementById('totalFee').value = student.fee;
      document.getElementById('joiningYear').value = student.year;
      transitionContent('viewDetails', 'addDetails', 'viewBtn', 'addBtn');
      showDeleteButton();
    }
  });
}

function deleteStudent(studentName) {
  if (confirm(`Are you sure you want to delete ${studentName}?`)) {
    const studentRef = database.ref('students/' + studentName);
    studentRef.remove(function(error) {
      if (error) {
        alert('Failed to delete student. Try again.');
      } else {
        clearForm();
        displayStudents();
      }
    });
  }
}

function showDeleteButton() {
  let deleteBtn = document.getElementById('delete-btn');
  if (!deleteBtn) {
    deleteBtn = document.createElement('button');
    deleteBtn.id = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'btn';
    document.getElementById('addDetails').appendChild(deleteBtn);
    deleteBtn.addEventListener('click', function() {
      deleteStudent(document.getElementById('studentName').value);
    });
  }
}

function clearForm() {
  document.getElementById('studentName').value = '';
  document.getElementById('studentClass').value = '';
  document.getElementById('mobileNumber').value = '';
  document.getElementById('instalment').value = '';
  document.getElementById('totalFee').value = '';
  document.getElementById('joiningYear').value = '';
  const errorElement = document.getElementById('addError');
  if (errorElement) {
    errorElement.textContent = '';
  }
}
