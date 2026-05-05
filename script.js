// LOGIN SYSTEM - Formal authentication
function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const msgDiv = document.getElementById("msg");

  if (user === "admin" && pass === "admin") {
    window.location.href = "admin.html";
  } 
  else if (user === "arun" && pass === "101") {
    setStudentData("Arun Kumar", "101", "arun");
  } 
  else if (user === "kiran" && pass === "102") {
    setStudentData("Kiran Rao", "102", "kiran");
  } 
  else if (user === "priya" && pass === "103") {
    setStudentData("Priya Sharma", "103", "priya");
  } 
  else if (user === "rahul" && pass === "104") {
    setStudentData("Rahul Verma", "104", "rahul");
  } 
  else {
    if(msgDiv) {
      msgDiv.style.display = "block";
      msgDiv.innerText = "Authentication failed. Invalid credentials.";
      setTimeout(() => {
        if(msgDiv) msgDiv.style.display = "none";
      }, 2000);
    }
  }
}

// Store student data in localStorage
function setStudentData(name, roll, key) {
  localStorage.setItem("studentName", name);
  localStorage.setItem("roll", roll);
  localStorage.setItem("key", key);
  window.location.href = "dashboard.html";
}

// Load student info on dashboard (only profile, NOT attendance)
function loadStudentProfile() {
  const name = localStorage.getItem("studentName");
  const roll = localStorage.getItem("roll");
  const container = document.getElementById("studentProfileContainer");
  if (container && name && roll) {
    container.innerHTML = `
      <div class="student-profile">
        <div class="student-name">${escapeHtml(name)}</div>
        <div class="student-roll">Roll Number: ${escapeHtml(roll)}</div>
      </div>
    `;
  } else if (container) {
    container.innerHTML = `<div class="student-profile" style="color:#b91c1c;">Session expired. Please login again.</div>`;
  }
}

// Helper to escape HTML
function escapeHtml(str) {
  if(!str) return "";
  return str.replace(/[&<>]/g, function(m) {
    if(m === '&') return '&amp;';
    if(m === '<') return '&lt;';
    if(m === '>') return '&gt;';
    return m;
  });
}

// ADMIN: Save attendance percentages for each student
function saveAttendance() {
  // Get percentage values (0-100) for each student
  const arunPercent = parseInt(document.getElementById("arun_percent")?.value) || 0;
  const kiranPercent = parseInt(document.getElementById("kiran_percent")?.value) || 0;
  const priyaPercent = parseInt(document.getElementById("priya_percent")?.value) || 0;
  const rahulPercent = parseInt(document.getElementById("rahul_percent")?.value) || 0;

  // Validate percentages (0-100)
  const percentages = [arunPercent, kiranPercent, priyaPercent, rahulPercent];
  let valid = true;
  for (let p of percentages) {
    if (p < 0 || p > 100) {
      valid = false;
      break;
    }
  }

  if (!valid) {
    const msgSpan = document.getElementById("adminMsg");
    if (msgSpan) {
      msgSpan.style.display = "block";
      msgSpan.className = "message-area";
      msgSpan.innerText = "Error: Please enter percentage between 0 and 100 for all students.";
      setTimeout(() => {
        if(msgSpan) msgSpan.style.display = "none";
      }, 3000);
    }
    return;
  }

  const attendanceData = {
    arun: arunPercent,
    kiran: kiranPercent,
    priya: priyaPercent,
    rahul: rahulPercent,
    lastUpdated: new Date().toLocaleString()
  };
  
  localStorage.setItem("attendance", JSON.stringify(attendanceData));
  const msgSpan = document.getElementById("adminMsg");
  if (msgSpan) {
    msgSpan.style.display = "block";
    msgSpan.className = "message-area success";
    msgSpan.innerText = "✓ Attendance percentages saved successfully!";
    setTimeout(() => {
      if(msgSpan) msgSpan.style.display = "none";
      msgSpan.className = "message-area";
    }, 2500);
  }
}

// Load previously saved attendance percentages for admin panel
function loadExistingAttendanceForAdmin() {
  const saved = localStorage.getItem("attendance");
  if (saved) {
    const data = JSON.parse(saved);
    if (document.getElementById("arun_percent")) document.getElementById("arun_percent").value = data.arun || 0;
    if (document.getElementById("kiran_percent")) document.getElementById("kiran_percent").value = data.kiran || 0;
    if (document.getElementById("priya_percent")) document.getElementById("priya_percent").value = data.priya || 0;
    if (document.getElementById("rahul_percent")) document.getElementById("rahul_percent").value = data.rahul || 0;
    
    // Show last updated info
    if (data.lastUpdated) {
      const infoSpan = document.getElementById("lastUpdatedInfo");
      if (infoSpan) infoSpan.innerText = `Last saved: ${data.lastUpdated}`;
    }
  }
}

// STUDENT: Show attendance percentage only when button is clicked
function displayAttendance() {
  const attendanceRaw = localStorage.getItem("attendance");
  const studentKey = localStorage.getItem("key");
  const resultContainer = document.getElementById("attendanceResult");
  const warningContainer = document.getElementById("warningContainer");

  if (!resultContainer) return;

  // Clear previous results before showing new
  resultContainer.innerHTML = "";
  if (warningContainer) warningContainer.innerHTML = "";

  if (!attendanceRaw || !studentKey) {
    resultContainer.innerHTML = `<div class="attendance-result" style="color:#6c757d;">📋 No attendance records found. Please contact admin.</div>`;
    return;
  }

  const data = JSON.parse(attendanceRaw);
  const percentage = data[studentKey];

  if (percentage === undefined) {
    resultContainer.innerHTML = `<div class="attendance-result" style="color:#6c757d;">Attendance not marked yet for this student.</div>`;
    return;
  }

  // Determine status message based on percentage
  let statusMessage = "";
  let icon = "";
  
  if (percentage >= 75) {
    statusMessage = "Good standing - Above 75%";
    icon = "✅";
  } else if (percentage >= 50) {
    statusMessage = "Moderate - Below 75%";
    icon = "⚠️";
  } else if (percentage >= 25) {
    statusMessage = "Low attendance - Needs improvement";
    icon = "⚠️";
  } else {
    statusMessage = "Critical - Very low attendance";
    icon = "❌";
  }

  // Show percentage card
  resultContainer.innerHTML = `
    <div class="attendance-result">
      <div class="percentage-big">${percentage}%</div>
      <div class="status-text">${icon} ${statusMessage}</div>
    </div>
  `;

  // Show warning if below 75%
  if (percentage < 75) {
    if (warningContainer) {
      warningContainer.innerHTML = `<div class="warning-message">⚠️ Alert: Your attendance is ${percentage}% which is below the required 75%. Please improve your attendance.</div>`;
    }
  } else {
    if (warningContainer) {
      warningContainer.innerHTML = `<div class="success-message">✓ Great! Your attendance is ${percentage}% - above the required 75%.</div>`;
    }
  }
}

// Auto load student profile on dashboard (but NOT attendance automatically)
if (window.location.pathname.includes("dashboard.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    loadStudentProfile();
    // Attach event to the "Check Attendance" button
    const checkBtn = document.getElementById("checkAttendanceBtn");
    if (checkBtn) {
      const newBtn = checkBtn.cloneNode(true);
      checkBtn.parentNode.replaceChild(newBtn, checkBtn);
      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        displayAttendance();
      });
    }
  });
}

// Admin page initialization
if (window.location.pathname.includes("admin.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    loadExistingAttendanceForAdmin();
    const saveBtn = document.getElementById("adminSaveBtn");
    if (saveBtn) {
      const freshBtn = saveBtn.cloneNode(true);
      saveBtn.parentNode.replaceChild(freshBtn, saveBtn);
      freshBtn.addEventListener("click", (e) => {
        e.preventDefault();
        saveAttendance();
      });
    }
  });
}