const form = document.getElementById('medicine-form');
const tbody = document.querySelector('tbody');

let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

function renderInventory() {
  tbody.innerHTML = '';
  inventory.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.quantity}</td>
      <td>${item.expiry}</td>
    `;
    tbody.appendChild(row);
  });
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const expiry = document.getElementById('expiry').value;

  const newItem = { name, category, quantity, expiry };
  inventory.push(newItem);
  localStorage.setItem('inventory', JSON.stringify(inventory));

  renderInventory();
  form.reset();
});

renderInventory();
let sales = JSON.parse(localStorage.getItem('sales')) || [];

function addSale(name, quantity, price) {
  const date = new Date().toISOString().split('T')[0];
  const total = quantity * price;
  const sale = { name, quantity, price, total, date };
  sales.push(sale);
  localStorage.setItem('sales', JSON.stringify(sales));
  generateReceipt(sale);
}

function getDailySales() {
  const today = new Date().toISOString().split('T')[0];
  return sales.filter(s => s.date === today);
}

function getWeeklySales() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return sales.filter(s => new Date(s.date) >= weekAgo);
}

function generateReceipt(sale) {
  const receipt = `
    <h3>Receipt</h3>
    <p>Medicine: ${sale.name}</p>
    <p>Quantity: ${sale.quantity}</p>
    <p>Price: GHS ${sale.price}</p>
    <p>Total: GHS ${sale.total}</p>
    <p>Date: ${sale.date}</p>
  `;
  document.getElementById('receipt').innerHTML = receipt;
  window.print();
  let sales = JSON.parse(localStorage.getItem('sales')) || [];

const salesForm = document.getElementById('sales-form');
const receiptSection = document.getElementById('receipt');

salesForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('sale-name').value;
  const quantity = parseInt(document.getElementById('sale-quantity').value);
  const price = parseFloat(document.getElementById('sale-price').value);
  const date = new Date().toISOString().split('T')[0];
  const total = quantity * price;

  // Deduct from inventory
  const item = inventory.find(med => med.name.toLowerCase() === name.toLowerCase());
  if (!item || item.quantity < quantity) {
    alert('Not enough stock or medicine not found.');
    return;
  }
  item.quantity -= quantity;
  localStorage.setItem('inventory', JSON.stringify(inventory));
  renderInventory();

  // Record sale
  const sale = { name, quantity, price, total, date };
  sales.push(sale);
  localStorage.setItem('sales', JSON.stringify(sales));

  // Generate receipt
  receiptSection.innerHTML = `
    <h3>Receipt</h3>
    <p>Medicine: ${name}</p>
    <p>Quantity: ${quantity}</p>
    <p>Price per Unit: GHS ${price.toFixed(2)}</p>
    <p>Total: GHS ${total.toFixed(2)}</p>
    <p>Date: ${date}</p>
  `;
  window.print();

  salesForm.reset();
  
});

}