document.addEventListener('DOMContentLoaded', (event) => {
    const inputBox = document.getElementById('inputBox');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    const downloadBtn = document.getElementById('downloadBtn');
    const categorySelect = document.getElementById('categorySelect');
    const elementTypeSelect = document.getElementById('elementTypeSelect');

    let editTodo = null;

    // Function to add todo
    const addTodo = () => {
        const inputText = inputBox.value.trim();
        const category = categorySelect.value;
        const elementType = elementTypeSelect.value;

        if (inputText.length <= 0) {
            alert("You must write something in your to do");
            return false;
        }

        if (addBtn.value === "Edit") {
            editLocalTodos(editTodo.target.previousElementSibling.innerHTML.split(' [')[0]);
            editTodo.target.previousElementSibling.innerHTML = `${inputText} [${category}]`;
            editTodo.target.previousElementSibling.dataset.type = elementType;
            addBtn.value = "Add";
            inputBox.value = "";
        } else {
            const li = document.createElement("li");

            const element = document.createElement(elementType === 'text' ? 'p' : 'input');
            if (elementType === 'text') {
                element.innerHTML = `${inputText} [${category}]`;
            } else {
                element.type = elementType;
                element.name = inputText;
                element.value = inputText;
            }
            element.dataset.type = elementType;
            li.appendChild(element);

            const editBtn = document.createElement("button");
            editBtn.innerText = "Edit";
            editBtn.classList.add("btn", "editBtn");
            li.appendChild(editBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Remove";
            deleteBtn.classList.add("btn", "deleteBtn");
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
            inputBox.value = "";

            saveLocalTodos({ text: inputText, category, elementType });
        }
    }

    const updateTodo = (e) => {
        if (e.target.innerHTML === "Remove") {
            todoList.removeChild(e.target.parentElement);
            deleteLocalTodos(e.target.parentElement);
        }

        if (e.target.innerHTML === "Edit") {
            const text = e.target.previousElementSibling.innerHTML.split(' [')[0];
            inputBox.value = text;
            inputBox.focus();
            categorySelect.value = e.target.previousElementSibling.innerHTML.split(' [')[1].replace(']', '');
            elementTypeSelect.value = e.target.previousElementSibling.dataset.type;
            addBtn.value = "Edit";
            editTodo = e;
        }
    }

    const saveLocalTodos = (todo) => {
        let todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
        todos.push(todo);
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    const getLocalTodos = () => {
        let todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
        todos.forEach(todo => {
            const li = document.createElement("li");

            const element = document.createElement(todo.elementType === 'text' ? 'p' : 'input');
            if (todo.elementType === 'text') {
                element.innerHTML = `${todo.text} [${todo.category}]`;
            } else {
                element.type = todo.elementType;
                element.name = todo.text;
                element.value = todo.text;
            }
            element.dataset.type = todo.elementType;
            li.appendChild(element);

            const editBtn = document.createElement("button");
            editBtn.innerText = "Edit";
            editBtn.classList.add("btn", "editBtn");
            li.appendChild(editBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Remove";
            deleteBtn.classList.add("btn", "deleteBtn");
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
        });
    }

    const deleteLocalTodos = (todo) => {
        let todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
        const todoText = todo.children[0].innerHTML.split(' [')[0];
        const todoIndex = todos.findIndex(t => t.text === todoText);
        todos.splice(todoIndex, 1);
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    const editLocalTodos = (todo) => {
        let todos = JSON.parse(localStorage.getItem("todos"));
        const todoIndex = todos.findIndex(t => t.text === todo);
        todos[todoIndex].text = inputBox.value;
        todos[todoIndex].category = categorySelect.value;
        todos[todoIndex].elementType = elementTypeSelect.value;
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    const downloadList = () => {
        let todos = JSON.parse(localStorage.getItem("todos"));
        let text = '';
        todos.forEach(todo => {
            text += `${todo.text} [${todo.category}]\n`;
        });

        const filename = prompt("Enter the filename", "daves_todo_list.txt");
        if (!filename) return;

        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    document.addEventListener('DOMContentLoaded', getLocalTodos);
    addBtn.addEventListener('click', addTodo);
    todoList.addEventListener('click', updateTodo);
    downloadBtn.addEventListener('click', downloadList);

    // Function to update date and time
    function updateDateTime() {
        const now = new Date();
        const datetime = now.toLocaleString();
        document.getElementById('datetime').textContent = datetime;
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();
});
