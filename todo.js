// KLASA TODO
class Todo {
    constructor(tasks) {
        // Inicjalizacja listy zadań
        this.tasks = [];
        // Inicjalizacja listy zadań z Local Storage
        this.loadFromLocalStorage();
    }

    // Metoda dodająca nowe zadanie
    addTask(name, dueDate) {
        const currentDate = new Date();
        const taskDueDate = new Date(dueDate);

        // Walidacja nowego zadania
        if (name.length < 3 || name.length > 255) {
            alert('Nazwa zadania musi mieć od 3 do 255 znaków.');
            return;
        }
        if (taskDueDate <= currentDate) {
            alert('Data wykonania zadania musi być pusta albo w przyszłości.');
            return;
        }

       // Tworzenie obiektu reprezentującego nowe zadanie
        const newTask = {
            name: name,
            dueDate: taskDueDate.toISOString(),
        };

        // Dodawanie nowego zadania do listy
        this.tasks.push(newTask);
        // Zapisywanie listy do Local Storage
        this.saveToLocalStorage();
        // Aktualizacja widoku
        this.draw();

        // Czyszczenie local storage po dodaniu zadania
        //localStorage.removeItem('tasks');
    }

    // Metoda usuwająca zadanie
    removeTask(task) {
        // Usuwanie zadania z listy
        this.tasks = this.tasks.filter(t => t !== task);
        // Zapisywanie listy do Local Storage
        this.saveToLocalStorage();
        // Aktualizacja widoku
        this.draw();
    }

    // Metoda edytująca zadanie
    editTask(task, newName, newDueDate) {
        // Zmiana nazwy  i daty zadania
        task.name = newName;
        task.dueDate = newDueDate;
        // Zapisywanie listy do Local Storage
        this.saveToLocalStorage();
        // Aktualizacja widoku
        this.draw();
    }

    // Metoda zapisująca listę do Local Storage
    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // Metoda rysująca listę zadań
    draw() {
        // Pobranie elementu listy
        const taskList = document.getElementById('taskList');
        // Wyczyszczenie istniejącej listy
        taskList.innerHTML = '';
        // Tworzenie nowych elementów listy
        this.tasks.forEach(task => {
            const listItem = createTaskListItem(task);
            taskList.appendChild(listItem);
        });
    }

    // Metoda wczytująca listę zadań z Local Storage
    loadFromLocalStorage() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        // Usunięcie duplikatów
        this.tasks = Array.from(new Set(storedTasks.map(task => JSON.stringify(task))))
            .map(task => JSON.parse(task));
    }

    // Metoda filterTasks
    filterTasks(searchTerm) {
        // Filtrowanie zadania na podstawie wpisanej frazy
        const filteredTasks = this.tasks.filter(task =>
        task.name.toLowerCase().includes(searchTerm)
        );
        // Aktualizacja widoku na podstawie przefiltrowanych zadań
        this.draw(filteredTasks);
        // Wyróżnianie wyszukiwanej frazy
        this.highlightSearchTerm(searchTerm);
    }

    // Dodanie metody highlightSearchTerm
    highlightSearchTerm(searchTerm) {
        // Usunięcie wcześniejszych wyróżnień
        this.removeHighlight();

        // Wyróżnienie wyszukiwanej frazy we wszystkich zadaniach
        const taskList = document.getElementById('taskList');
        taskList.childNodes.forEach(listItem => {
            const taskName = listItem.textContent.toLowerCase();
            if (taskName.includes(searchTerm)) {
                const highlightedText = this.getHighlightedText(taskName, searchTerm);
                listItem.innerHTML = highlightedText;
            }
        });
    }

    // Dodawanie metody removeHighlight
    removeHighlight() {
        // Usunięcie wyróżnień we wszystkich zadaniach
        const taskList = document.getElementById('taskList');
        taskList.childNodes.forEach(listItem => {
            listItem.innerHTML = listItem.textContent;
        });
    }

    // Dodanie metody getHighlightedText
    getHighlightedText(text, highlight) {
        // Wyróżnienie wyszukiwanej frazy w tekście
        const startIndex = text.index0f(highlight);
        const endIndex = startIndex + highlight.length;
        const highlightedText =
            text.substring(0, startIndex) +
            '<span class="highlight">' +
            text.substring(startIndex, endIndex) +
            '</span>' +
            text.substring(endIndex);
        return highlightedText;
    }
}

// INICJALIZACJA OBIEKTU TODO
const todo = new Todo();

// FUNKCJA TWORZĄCA ELEMENT LISTY DLA ZADANIA
function createTaskListItem(task) {
    const listItem = document.createElement('li');
    listItem.textContent = task.name + '(Termin: ' + new Date(task.dueDate).toLocaleString()+ ')';

    // Dodanie przycisku do usuwania zadania
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.onclick = function() {
        todo.removeTask(task);
    };

    // Dodanie przycisku do edycji zadania
    const editButton = document.createElement('button');
    editButton.textContent = 'Edytuj';
    editButton.onclick = function () {
        editTask(listItem, task);
    };

    listItem.appendChild(deleteButton);
    listItem.appendChild(editButton);
    return listItem;
    }

// FUNKCJA EDYTUJĄCA ZADANIE
function editTask(listItem, task) {
    // Sprawdzenie, czy formularz edycji nie istnieje już dla tego zadania
    if (listItem.querySelector('form')){
        return;
    }
    // Tworzenie formularza do edycji zadania
    const form = document.createElement('form');

    // Pole do wprowadzania nowej nazwy zadania
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Nowa nazwa zadania: ';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = task.name;
    form.appendChild(nameLabel);
    form.appendChild(nameInput);

    // Pole do wprowadzania nowej daty zadania
    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'Nowa data zadania: ';
    const dateInput = document.createElement('input');
    dateInput.type = 'datetime-local';
    dateInput.value = new Date(task.dueDate).toISOString().slice(0, -8); // Formatowanie daty
    form.appendChild(dateLabel);
    form.appendChild(dateInput);

    // Przycisk do zatwierdzania zmian
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.textContent = 'Zatwierdź';
    submitButton.onclick = function () {
        // Wywołanie metody editTask z obiektu Todo po zatwierdzeniu zmian
        todo.editTask(task, nameInput.value, dateInput.value);
        // Usunięcie formularza po zatwierdzeniu zmian
        form.remove();
    };

    form.appendChild(submitButton);

    // Dodawanie formularza do elementu listy
    listItem.appendChild(form);
}

// FUNKCJA INICJALIZUJACA LISTĘ ZADAŃ Z LOCAL STORAGE
function initializeTaskList() {
    // Pobranie listy zadań z Local Storage
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Usunięcie duplikatów
    const uniqueTasks = Array.from(new Set(storedTasks.map(task => JSON.stringify(task))))
        .map(task => JSON.parse(task));

    // Inicjalizacja obiektu todo z wczytaną listą zadań
    todo = new Todo(uniqueTasks);

    // Pobranie elementu z listy
    const taskList = document.getElementById('taskList');
    // Wyczyszczenie istniejącej listy
    taskList.innerHTML = '';
    // Tworzenie nowych elementów listy
    todo.tasks.forEach(task => {
        const listItem = createTaskListItem(task);
        taskList.appendChild(listItem);
        });
}

// FUNKCJA DODAJĄCA NOWE ZADANIE PO NACIŚNIĘCIU PRZYCISKU
function addTask() {
    // Pobranie wartości wpisane przez użytkownika
    const newTaskInput = document.getElementById('newTask');
    const dueDateInput = document.getElementById('dueData');

    // Sprawdzenie, czy nie są puste
    if (!newTaskInput.value || !dueDateInput.value) {
        alert('Wprowadź nazwę zadania i datę.');
        return;
    }

    // Wywołanie metody addTask z obiektu Todo
    todo.addTask(newTaskInput.value, dueDateInput.value);

    // Czyszczenie pól do dodawania nowego zadania
    newTaskInput.value = '';
    dueDateInput.value = '';
}

// Wywołanie metody draw z obiektu Todo po załadowaniu strony
todo.draw();
// Inicjalizacja listy zadań z Local Storage
initializeTaskList();