const form = document.getElementById('transaction-form');
const tbody = document.querySelector('tbody');
const incomeCard = document.querySelector('.income p');
const expensesCard = document.querySelector('.expenses p');
const balanceCard = document.querySelector('.balance p');
const messageDiv = document.getElementById('message'); // Add this div in your HTML

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Update summary cards
function updateSummary() {
  let incomeTotal = 0;
  let expenseTotal = 0;

  transactions.forEach(tx => {
    if (tx.type === 'income') {
      incomeTotal += tx.amount;
    } else {
      expenseTotal += tx.amount;
    }
  });

  const balance = incomeTotal - expenseTotal;

  incomeCard.textContent = `GHS ${incomeTotal.toFixed(2)}`;
  expensesCard.textContent = `GHS ${expenseTotal.toFixed(2)}`;
  balanceCard.textContent = `GHS ${balance.toFixed(2)}`;
}

// Render transactions in table
function renderTransactions() {
  tbody.innerHTML = '';
  transactions.forEach((tx, idx) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${tx.date}</td>
      <td>${tx.description}</td>
      <td>GHS ${tx.amount.toFixed(2)}</td>
      <td>${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</td>
      <td><button class="delete-btn" data-index="${idx}">Delete</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Show feedback message
function showMessage(msg, isError = false) {
  if (!messageDiv) return;
  messageDiv.textContent = msg;
  messageDiv.style.color = isError ? 'red' : 'green';
  setTimeout(() => { messageDiv.textContent = ''; }, 2000);
}

// Handle form submission
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;

  // Validation
  if (!date || !description || isNaN(amount) || amount <= 0) {
    showMessage('Please enter valid data (amount must be positive).', true);
    return;
  }

  const newTransaction = { date, description, amount, type };
  transactions.push(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));

  renderTransactions();
  updateSummary();
  form.reset();
  showMessage('Transaction added successfully!');
});

// Handle delete button
tbody.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-btn')) {
    const idx = e.target.getAttribute('data-index');
    transactions.splice(idx, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderTransactions();
    updateSummary();
    showMessage('Transaction deleted.');
  }
});

// Initialize on load
renderTransactions();
updateSummary();