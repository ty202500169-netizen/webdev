const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");
const itemLeft = document.getElementById("itemsLeft");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos") || "[]");
let filter = "all";

function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getFilteredTodos() {
    if (filter === "active") return todos.filter(t => !t.completed);
    if (filter === "completed") return todos.filter(t => t.completed);
    return todos;
}

function render() {
    list.innerHTML = "";

    const filtered = getFilteredTodos();

    filtered.forEach(todo => {
        const li = document.createElement("li");
        li.className =
            "todo-item" + (todo.completed ? " complete" : "");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;

        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            save();
            render();
        });

        const text = document.createElement("span");
        text.className = "text";
        text.textContent = todo.text;

        const del = document.createElement("button");
        del.className = "delete-btn";
        del.textContent = "Delete";

        del.addEventListener("click", () => {
            todos = todos.filter(t => t.id !== todo.id);
            save();
            render();
        });

        li.append(checkbox, text, del);
        list.appendChild(li);
    });

    const left = todos.filter(t => !t.completed).length;

    itemLeft.textContent =
        `${left} item${left !== 1 ? "s" : ""} left`;

    filterButtons.forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.filter === filter
        );
    });
}

function addTodo() {
    const text = input.value.trim();

    if (!text) return;

    todos.unshift({
        id: Date.now() + Math.random(),
        text,
        completed: false
    });

    input.value = "";

    save();
    render();

    input.focus();
}

addBtn.addEventListener("click", addTodo);

input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        addTodo();
    }
});

clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter(t => !t.completed);
    save();
    render();
});

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filter = btn.dataset.filter;
        render();
    });
});

render();