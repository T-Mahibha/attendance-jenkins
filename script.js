// Student Database
const students = {
  "arun": { name: "Arun Kumar", roll: "101" },
  "kiran": { name: "Kiran Rao", roll: "102" },
  "priya": { name: "Priya Sharma", roll: "103" },
  "rahul": { name: "Rahul Verma", roll: "104" }
};

// LOGIN LOGIC
function login() {
  const user = document.getElementById('username').value.toLowerCase();
  const pass = document.getElementById('password').value;
  const msg = document.getElementById('msg');

  if (user === 'admin' && pass === 'admin') {
    localStorage.setItem("key", "admin");
    window.location.href = 'home.html';
  } else if (students[user] && pass === students[user].roll) {
    localStorage.setItem("key", user);
    window.location.href = 'home.html';
  } else {
    msg.style.display = 'block';
    msg.innerText = "Invalid credentials!";
  }
}

// ADMIN SAVE LOGIC
document.getElementById('adminSaveBtn')?.addEventListener('click', () => {
  const data = {
    arun: document.getElementById('arun_percent').value,
    kiran: document.getElementById('kiran_percent').value,
    priya: document.getElementById('priya_percent').value,
    rahul: document.getElementById('rahul_percent').value
  };
  localStorage.setItem("attendance", JSON.stringify(data));
  const adminMsg = document.getElementById('adminMsg');
  adminMsg.style.display = 'block';
  adminMsg.className = "message-area success";
  adminMsg.innerText = "✅ Saved Successfully!";
  document.getElementById('lastUpdatedInfo').innerText = "Updated: " + new Date().toLocaleTimeString();
});

// STUDENT VIEW LOGIC
if (document.getElementById('studentProfileContainer')) {
  const userKey = localStorage.getItem("key");
  const student = students[userKey];
  if (student) {
    document.getElementById('studentProfileContainer').innerHTML = `
      <div class="student-profile">
        <div class="student-name">${student.name}</div>
        <div class="student-roll">Roll No: ${student.roll}</div>
      </div>`;
  }
}

document.getElementById('checkAttendanceBtn')?.addEventListener('click', () => {
  const attendanceRaw = localStorage.getItem("attendance");
  const studentKey = localStorage.getItem("key");
  const resultContainer = document.getElementById("attendanceResult");
  const warningContainer = document.getElementById("warningContainer");

  if (!attendanceRaw || !studentKey) {
    resultContainer.innerHTML = "No data found.";
    return;
  }

  const data = JSON.parse(attendanceRaw);
  const percentage = parseInt(data[studentKey] || 0);
  
  let icon = percentage >= 75 ? "✅" : "⚠️";
  let status = percentage >= 75 ? "Good standing" : "Attendance Low";

  resultContainer.innerHTML = `
    <div class="attendance-result">
      <div class="percentage-big">${percentage}%</div>
      <div class="status-text">${icon} ${status}</div>
    </div>`;

  if (warningContainer) {
    warningContainer.innerHTML = percentage < 75 
      ? `<div class="warning-message">⚠️ You are below the 75% requirement.</div>`
      : `<div class="success-message">✓ You meet the attendance requirement.</div>`;
  }
});