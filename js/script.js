document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-text');
    const todoDateInput = document.getElementById('todo-date');
    const todoList = document.getElementById('todo-list');
    const filterAllBtn = document.getElementById('filter-all');
    const filterActiveBtn = document.getElementById('filter-active');
    const filterDoneBtn = document.getElementById('filter-done');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = String(date.getFullYear()).slice(2);
        return `${day}/${month}/${year}`;
    };

    
    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    
    const renderTodos = () => {
        todoList.innerHTML = '';
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return !todo.done;
            if (currentFilter === 'done') return todo.done;
        });

        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item', 'flex', 'items-center', 'justify-between', 'p-4', 'bg-white', 'rounded-xl', 'shadow-md');

            if (todo.done) {
                todoItem.classList.add('done');
            }

            // Menggunakan fungsi formatDate untuk memformat tanggal
            const formattedTargetDate = formatDate(todo.targetDate);
            const formattedCreatedAt = formatDate(todo.createdAt);
            const formattedCompletedAt = todo.done ? formatDate(todo.completedAt) : '';

            todoItem.innerHTML = `
                <div class="flex items-center space-x-4 flex-grow">
                    <input type="checkbox" data-id="${todo.id}" ${todo.done ? 'checked' : ''}
                        class="form-checkbox h-5 w-5 text-indigo-600 rounded-full border-gray-300 focus:ring-indigo-500 cursor-pointer">
                    <div>
                        <div class="flex items-center space-x-2">
                            <!-- Coretan hanya diterapkan pada teks nama tugas -->
                            <span class="text-lg font-medium text-gray-900 ${todo.done ? 'line-through' : ''}">${todo.text}</span>
                            ${todo.done ? `<span class="text-sm font-bold text-green-600">✅ Completed!</span>` : ''}
                        </div>
                        <div class="text-sm text-gray-500 mt-1">
                            <p>Target: ${formattedTargetDate}</p>
                            <p>Dibuat: ${formattedCreatedAt}</p>
                            ${todo.done ? `<p>Selesai: ${formattedCompletedAt}</p>` : ''}
                        </div>
                    </div>
                </div>
                <button class="delete-btn px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200" data-id="${todo.id}">Hapus</button>
            `;
            todoList.appendChild(todoItem);
        });
    };

  
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const todoText = todoInput.value.trim();
        const todoTargetDate = todoDateInput.value;

        if (todoText && todoTargetDate) {
            const newTodo = {
                id: Date.now(),
                text: todoText,
                targetDate: todoTargetDate,
                createdAt: new Date(),
                done: false,
                completedAt: null
            };
            todos.push(newTodo);
            saveTodos();
            renderTodos();
            todoInput.value = '';
            todoDateInput.value = '';
        }
    });


    todoList.addEventListener('click', (e) => {
        const target = e.target;
        const id = parseInt(target.dataset.id);

       
        if (target.matches('input[type="checkbox"]')) {
            const todoIndex = todos.findIndex(todo => todo.id === id);
            if (todoIndex !== -1) {
                todos[todoIndex].done = target.checked;
                todos[todoIndex].completedAt = target.checked ? new Date() : null;
                saveTodos();
                renderTodos();
            }
        }

    
        if (target.matches('.delete-btn')) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
        }
    });

    
    const setFilter = (filter) => {
        currentFilter = filter;
        
        document.querySelectorAll('.button-filter').forEach(btn => {
            btn.classList.remove('active');
        });

        if (filter === 'all') {
            filterAllBtn.classList.add('active');
        } else if (filter === 'active') {
            filterActiveBtn.classList.add('active');
        } else if (filter === 'done') {
            filterDoneBtn.classList.add('active');
        }

        renderTodos();
    };

    filterAllBtn.addEventListener('click', () => setFilter('all'));
    filterActiveBtn.addEventListener('click', () => setFilter('active'));
    filterDoneBtn.addEventListener('click', () => setFilter('done'));
    
    setFilter('all');
    renderTodos();
});
