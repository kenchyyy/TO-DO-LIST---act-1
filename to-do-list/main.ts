import './style.css';

const input = document.getElementById("input") as HTMLInputElement;
const list = document.getElementById("list") as HTMLUListElement;
const form = document.getElementById("submit") as HTMLFormElement;
const date = document.getElementById("date") as HTMLInputElement;
const options = document.getElementById("options") as HTMLSelectElement;

type Task = {
  name: string;
  date: string;
  dateAdded: Date;
  id: string;
  finished: boolean;
};

let tasks: Task[] = [];

//listens for the event where the submit button is clicked and then creates the task
form.addEventListener("submit", e => {
  e.preventDefault();
  const newDate = new Date();
  const newTask: Task = {
    name: input.value,
    date: date.value,
    dateAdded: newDate,
    id: newDate.getTime().toString(),
    finished: false,
  };
  addTask(newTask); //creates a newly generated task list item from the given object
  tasks.push(newTask); //pushes the task to the array
  saveToLocal(); //saves the array to local storage every time submit is pressed
  sortTasks(); //sorts the tasks accordingly
});

// Function to add a task to the DOM
function addTask(task: Task): void {
  const name = task.name.trim();
  const item = document.createElement("li");
  item.setAttribute('data-id', task.id); //sets an id to the li element for easy access later on
  const del = document.createElement("span");
  const due = document.createElement("label");
  item.innerHTML = name;
  del.innerHTML = "\u00d7";
  due.innerHTML = `Due by: ${task.date}`;
  due.className = "due";
  item.appendChild(del);
  item.appendChild(due);
  list.appendChild(item);

  if (task.finished) {
    item.classList.add("done"); //adds the done class to the li element for the completion function
  }

  input.value = ""; //resets the input field
  date.value = ""; //resets the date input field
}

// event listener to handle the completion and deletion of task
list.addEventListener("click", (e) => {
  const clicked = e.target
  if (clicked instanceof HTMLLIElement) {
    const id = clicked.getAttribute('data-id');
    if (id) {
      const item = tasks.find(i => i.id === id);
      if (item) {
        clicked.classList.toggle("done");
        item.finished = !item.finished;
        saveToLocal();
        sortTasks();
      }
    }
  } else if (clicked instanceof HTMLSpanElement) {
    const li = clicked.parentElement;
    if (li && li instanceof HTMLLIElement) {
      const id = li.getAttribute('data-id');
      if (id) {
        deleteFromLocal(id);
      }
    }
  }
}, false);

// deletes the item from the local storage
function deleteFromLocal(id: string) {
  tasks = tasks.filter(task => task.id !== id);
  const item = list.querySelector(`li[data-id="${id}"]`);
  if (item) {
    item.remove();
  }
  saveToLocal();
}

// saves the list of tasks into the localstorage
function saveToLocal(): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//sorts the list according to the option chosen by the user
function sortTasks() {
  const option = options.value;
  const sortedTaskList = [...tasks];
  if (option === "1") {
    sortedTaskList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (option === "2") {
    sortedTaskList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  list.innerHTML = "";
  sortedTaskList.forEach(task => addTask(task));
}

// makes it so that the list is updated everytime the option is changed and not only when a new task is submitted
options.addEventListener("change", () => (
  sortTasks()
))

function showData() {
  const taskList = localStorage.getItem("tasks");
  if (taskList) {
    tasks = JSON.parse(taskList).map((data: any) => ({
      ...data,
      dateAdded: new Date(data.dateAdded)
    }));
    tasks.forEach(task => addTask(task));
    sortTasks();
  }
}

showData();
