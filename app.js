let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let bizName = localStorage.getItem("bizName") || "My POS Shop";
document.getElementById("display-name").textContent = bizName;
document.getElementById("biz-name").value = bizName;

function saveBizName() {
  const name = document.getElementById("biz-name").value.trim();
  if (name) {
    localStorage.setItem("bizName", name);
    document.getElementById("display-name").textContent = name;
    bizName = name;
    alert("Business name saved!");
  }
}


renderProducts();
renderSale();

// Handle Product Form
document.getElementById("product-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const qty = parseInt(document.getElementById("product-qty").value);

  products.push({ name, price, qty });
  localStorage.setItem("products", JSON.stringify(products));

  this.reset();
  renderProducts();
});

// Render Product List
function renderProducts() {
  const list = document.getElementById("product-list");
  list.innerHTML = "";
  products.forEach((product, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${product.name} - ₦${product.price} (${product.qty} left)
      <button onclick="addToCart(${index})">Add to Sale</button>
    `;
    list.appendChild(li);
  });
}

// Add product to cart
function addToCart(index) {
  const product = products[index];
  if (product.qty <= 0) {
    alert("Out of stock!");
    return;
  }

  product.qty -= 1;
  cart.push({ name: product.name, price: product.price });
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("cart", JSON.stringify(cart));

  renderProducts();
  renderSale();
}

// Render Sale Cart
function renderSale() {
  const saleList = document.getElementById("sale-list");
  const totalDisplay = document.getElementById("total");
  saleList.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₦${item.price}`;
    saleList.appendChild(li);
    total += item.price;
  });

  totalDisplay.textContent = total;
}

// Print Full Receipt
document.getElementById("print-receipt").addEventListener("click", function () {
  if (cart.length === 0) {
    alert("No items in cart!");
    return;
  }

  const receiptWindow = window.open('', 'PRINT', 'height=600,width=400');
  const date = new Date();
  const receiptID = `#${Math.floor(Math.random() * 1000000)}`;
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  receiptWindow.document.write(`
    <html>
    <head>
      <title>Receipt</title>
      <style>
        body { font-family: monospace; padding: 10px; }
        h2, h3, p { text-align: center; margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border-bottom: 1px dashed #aaa; padding: 5px; text-align: left; }
        .total { font-weight: bold; font-size: 1.1em; }
        .footer { margin-top: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <h2>${bizName}</h2>
      <p>Receipt: ${receiptID}</p>
      <p>${date.toLocaleString()}</p>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>₦ Price</th>
          </tr>
        </thead>
        <tbody>
          ${cart.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.price}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <p class="total">Total: ₦${total}</p>

      <div class="footer">
        <p>Thank you for shopping with us!</p>
      </div>
    </body>
    </html>
  `);

  receiptWindow.document.close();
  receiptWindow.focus();
  receiptWindow.print();
  receiptWindow.close();

  // Clear cart after printing
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderSale();
});
