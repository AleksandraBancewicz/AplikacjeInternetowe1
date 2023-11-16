// FUNKCJA INICJALIZUJĄCA LISTĘ ZADAŃ Z LOCAL STORAGE
function initializeTaskList() {
    // Pobranie listy zadań z Local Storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Tworzenie elementów listy na podstawie zapisanych zadań
    const taskList = document.getElementById('taskList');
    tasks.forEach(task => {
        const listItem = createTaskListItem(task);
        taskList.appendChild(listItem);
    });
}

// FUNKCJA DODAJĄCA NOWE ZADANIE PO NACIŚNIĘCIU PRZYCISKU
function addTask() {
    // Pobranie wartości wpisane przez użytkownika
    const newTaskInput = document.getElementById('newTask');
    const dueDateInput = document.getElementById('dueData');

    // Walidacja nowego zadania
    if (newTaskInput.value.length < 3 || newTaskInput.value.length > 255) {
        alert('Nazwa zadania musi mieć od 3 do 255 znaków.');
        return;
    }
    const currentDate = new Date();
    const dueDate = new Date(dueDateInput.value);

    if (dueDate <= currentDate) {
        alert('Data wykonania zadania musi być pusta albo w przyszłości.');
        return;
    }

    // Tworzenie obiektu reprezentującego nowe zadanie
    const newTask = {
        name: newTaskInput.value,
        dueDate: dueDate.toISOString(), // Zapisanie daty jako ISO String
    };
    // Dodawanie nowego zadania do Local Storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(newTask);
    localStorage.setItem('tasks',JSON.stringify(tasks));
    // Tworzenie nowego elementu listy i dodawanie go do widoku
    const taskList = document.getElementById('taskList');
    const listItem = createTaskListItem(newTask);
    taskList.appendChild(listItem);
    // Czyszczenie pola do dodawania nowego zadania
    newTaskInput.value = '';
    dueDateInput.value = '';
}

// FUNKCJA TWORZĄCA ELEMENT LISTY DLA ZADANIA
function createTaskListItem(task) {
    const listItem = document.createElement('li');
    listItem.textContent = task.name + '(Termin: ' + new Date(task.dueDate).toLocaleString()+ ')';

    // Dodanie przycisku do usuwania zadania
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.onclick = function() {
        removeTask(listItem, task);
    };

    // Dodanie obsługi kliknięcia na pozycję listy
    listItem.onclick = function() {
        editTask(listItem, task);
    };

    listItem.appendChild(deleteButton);
    return listItem;
}

// FUNKCJA USUWAJĄCA ZADANIE
function removeTask(listItem, task) {
    // Usunięcie zadania z Local Storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(t => t != task);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    //Usunięcie zadania z widoku
    listItem.remove();
}

// FUNKCJA EDYTUJĄCA ZADANIE
function editTask(listItem, task) {
    // Tworzenie pola edycji
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = task.name;

    // Obługa kliknięcia poza pole edycji
    document.addEventListener('click',function outsideClickHandler(event) {
        if (!listItem.contains(event.target)) {
            // Zapisanie zmian do Local Storage
            task.name = editInput.value;
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const updateTasks = tasks.map(t => (t === task ? task : t));
            localStorage.setItem('tasks', JSON.stringify(updateTasks));
            // Zastępowanie pola edycji tekstem
            listItem.removeChild(editInput);
            listItem.textContent = task.name + ' (Termin: ' + new Date(task.dueDate).toLocaleString() + ')';
            // Usunięcie obsługi kliknięcia poza pole edycji
            document.removeEventListener('click', outsideClickHandler);
        }
    });

    // Zamiana tekstu na pole edycji
    listItem.textContent = '';
    listItem.appendChild(editInput);
    editInput.focus(); // Ustawienie fokusa na nowo utworzonym polu edycji
}