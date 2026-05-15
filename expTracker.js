const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const totalDisplay = document.getElementById("totalDisplay");
const itemName = document.getElementById("itemName");
const itemAmount = document.getElementById("itemAmount");
const itemCategory = document.getElementById("itemCategory");

let allExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
updateScreen(); // Call updateScreen on load to display saved expenses

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = itemName.value;
    const amount = parseFloat(itemAmount.value);
    const category = itemCategory.value;

    const expense = {
        id: Date.now(),
        name,
        amount,
        category
    };

    allExpenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(allExpenses)); // Save to localStorage
    updateScreen();
    form.reset();
});

function updateScreen() {
    list.innerHTML = "";
    let total = 0;

    if (allExpenses.length === 0) {
        list.innerHTML = "<p style='text-align:center; color:#888;'>No expenses added yet.</p>";
    }

    allExpenses.forEach(item => {
        total += item.amount;
        const li = document.createElement("li");
        li.className = `item ${item.category}`;

        li.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-category-tag">${item.category}</span>
            </div>
            <div class="item-amount-box">
                <span class="item-amount">₱${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
        `;

        const btn = document.createElement("button");
        btn.textContent = "x";
        btn.className = "del-btn";
        btn.onclick = () => deleteItem(item.id);

        li.appendChild(btn);
        list.appendChild(li);
    });

    totalDisplay.textContent = total.toFixed(2);
}

function deleteItem(id) {
    allExpenses = allExpenses.filter(e => e.id !== id);
    localStorage.setItem("expenses", JSON.stringify(allExpenses)); // Save to localStorage after deletion
    updateScreen();
}