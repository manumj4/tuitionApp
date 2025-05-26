const API_URL = 'http://localhost:3000/api/fees';
const STUDENTS_API = 'http://localhost:3000/api/students';
const token = localStorage.getItem('token');

const feeTableBody = document.getElementById('feeTable');
const searchInput = document.getElementById('searchStudent');
const monthSelect = document.getElementById('monthSelect');

let students = [];
let fees = [];

// Initialize month selector with current month
function initMonthSelector() {
  const now = new Date();
  const yearMonth = now.toISOString().substring(0, 7);
  monthSelect.value = yearMonth;
}

// Load all students for display
async function loadStudents() {
  const res = await fetch(STUDENTS_API, { headers: { Authorization: `Bearer ${token}` } });
  students = await res.json();
}

// Load fees filtered by month and optionally by student search text
async function loadFees() {
  const selectedMonth = monthSelect.value;
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Fetch all fees for the selected month from API
  const res = await fetch(`${API_URL}?month=${selectedMonth}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  fees = await res.json();

  // Filter students by search term
  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm)
  );

  // Build table rows for each filtered student for the selected month
  feeTableBody.innerHTML = filteredStudents.map(student => {
    const feeRecord = fees.find(f => f.studentId === student._id);

    const joiningDate = new Date(student.admissionDate);
    const joiningDateStr = joiningDate.toISOString().substring(0, 10);
    const joiningMonthStr = joiningDate.toISOString().substring(0, 7);

    const isPaid = feeRecord?.status === 'Paid';
    const isUnpaid = feeRecord?.status === 'Unpaid';

    return `
      <tr>
        <td>${student.fullName}</td>
        <td>₹${student.fees || 0}</td>
        <td>${joiningMonthStr} (${joiningDateStr})</td>
        <td>
          <select class="form-select fee-status" data-student-id="${student._id}">
            <option value="Unpaid" ${isUnpaid ? 'selected' : ''}>Unpaid</option>
            <option value="Paid" ${isPaid ? 'selected' : ''}>Paid</option>
          </select>
        </td>
        <td>${feeRecord ? new Date(feeRecord.date).toISOString().substring(0, 10) : '-'}</td>
      </tr>
    `;
  }).join('');

  // After rendering, attach change event listeners on all selects
  document.querySelectorAll('.fee-status').forEach(select => {
    select.addEventListener('change', async (e) => {
      const studentId = e.target.dataset.studentId;
      const status = e.target.value;
      await updateFeeStatus(studentId, status, selectedMonth);
      loadFees(); // reload table after update
    });
  });
}

// Update fee status for a student and month
async function updateFeeStatus(studentId, status, month) {
  // Try to find existing fee record for student and month
  const existingFee = fees.find(f => f.studentId === studentId);

  if (existingFee) {
    // Update existing record
    await fetch(`${API_URL}/${existingFee._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, date: new Date().toISOString() }),
    });
  } else {
    // Create new fee record with status and current date
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        studentId,
        amount: 0, // or use student.fees if needed here
        month,
        status,
        date: new Date().toISOString()
      }),
    });
  }
}

// Setup event handlers for search and month selector
function setupFilters() {
  searchInput.addEventListener('input', loadFees);
  monthSelect.addEventListener('change', loadFees);
}

async function init() {
  initMonthSelector();
  await loadStudents();
  setupFilters();
  await loadFees();
}

init();
