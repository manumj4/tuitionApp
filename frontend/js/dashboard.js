// authCheck.js logic
(function() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    alert('Session expired. Please log in again.');
    window.location.href = 'index.html';
  }
})();

const token = localStorage.getItem('token');

// Fetch dashboard data from API
async function fetchDashboardData() {
  try {
  //   let env = config["env"];
  //   const API = config[env].apiUrl; 
    // const apiUrl = API + '/dashboard/summary';
    const apiUrl = "https://spark-tuition.onrender.com" + '/dashboard/summary';

    const res = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    const data = await res.json();
    return data;
  } catch (err) {
    alert('Error fetching dashboard data. Please login again.');
    localStorage.clear();
    window.location.href = 'index.html';
  }
}

// Render the three summary cards
function renderSummaryCards(data) {
  document.getElementById('totalStudents').textContent = data.totalStudents;
  document.getElementById('totalFees').textContent = '₹' + data.totalFeesCollected.toFixed(2);
  document.getElementById('totalSalary').textContent = '₹' + data.totalSalaryPaid.toFixed(2);
}

// Render a bar chart for last 5 months
function renderChart(monthlyData) {
  const ctx = document.getElementById('summaryChart').getContext('2d');

  const labels = monthlyData.map(m => m.month);
  const studentsAdded = monthlyData.map(m => m.studentsAdded);
  const studentsRemoved = monthlyData.map(m => m.studentsRemoved);
  const feesCollected = monthlyData.map(m => m.feesCollected);
  const salaryGiven = monthlyData.map(m => m.salaryGiven);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Students Added',
          data: studentsAdded,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
        },
        {
          label: 'Students Removed',
          data: studentsRemoved,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
        },
        {
          label: 'Fees Collected (₹)',
          data: feesCollected,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
        },
        {
          label: 'Salary Given (₹)',
          data: salaryGiven,
          backgroundColor: 'rgba(255, 206, 86, 0.7)',
        },
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Render monthly summary table
function renderMonthlyTable(data) {
  const tableHtml = `
    <table class="table table-bordered mt-3">
      <thead>
        <tr>
          <th>Month</th>
          <th>Students Added</th>
          <th>Students Removed</th>
          <th>Fees Collected</th>
          <th>Salary Paid</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            <td>${row.month}</td>
            <td>${row.studentsAdded}</td>
            <td>${row.studentsRemoved}</td>
            <td>₹${row.feesCollected}</td>
            <td>₹${row.salaryGiven}</td>
          </tr>`).join('')}
      </tbody>
    </table>
  `;
  document.getElementById('summaryTable').innerHTML = tableHtml;
}

// Main entry to load dashboard
async function loadDashboard() {
  const data = await fetchDashboardData();
  if (!data) return;
  renderSummaryCards(data);
  renderChart(data.lastFiveMonths);
  renderMonthlyTable(data.lastFiveMonths);
}

loadDashboard();
