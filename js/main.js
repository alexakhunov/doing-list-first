// looking for page's elements
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}

tasks.forEach(function (task) {
  // creating css class
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  // we create styles and forms for any new task which a user adds (previosly we have created such code in index.html)
  const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                         <span class="${cssClass}">${task.text}</span>
                         <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                            <img src="./img/tick.svg" alt="Done" width="18" height="18" />
                         </button>
                         <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/cross.svg" alt="Done" width="18" height="18" />
                         </button>
                         </div>
                      </li>`;

  // now we're adding a new task in the page. In HTML we got ul id="tasksList" (so we craeted a new const tasksList by calling element with such ID #tasksList). Using tools below `insertAdjacentHTML` we put in the and of block (use `beforehand`) our const taskHTML/ so check the page, now all added tasks appear on the page one by one
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
});

checkEmptyList();

// tasks adding
form.addEventListener("submit", addTask);

// tasks deleting
tasksList.addEventListener("click", deleteTask);

// marking task as "done"
tasksList.addEventListener("click", doneTask);

// this func makes tasks adding possible
function addTask(event) {
  // here, by ising PREVENTDEFAULT we cancel form sending
  event.preventDefault();

  // so, now we receive text which a user has put in const taskInput
  const taskText = taskInput.value;

  // discribing task as an Object
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // adding task in tasks Array
  tasks.push(newTask);

  // here we're adding task to LocalStorage
  saveToLocalStorage();

  // creating css class
  const cssClass = newTask.done ? "task-title task-title--done" : "task-title";

  // we create styles and forms for any new task which a user adds (previosly we have created such code in index.html)
  const taskHTML = `<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
                       <span class="${cssClass}">${newTask.text}</span>
                       <div class="task-item__buttons">
                          <button type="button" data-action="done" class="btn-action">
                          <img src="./img/tick.svg" alt="Done" width="18" height="18" />
                       </button>
                       <button type="button" data-action="delete" class="btn-action">
                          <img src="./img/cross.svg" alt="Done" width="18" height="18" />
                       </button>
                       </div>
                    </li>`;

  // now we're adding a new task in the page. In HTML we got ul id="tasksList" (so we craeted a new const tasksList by calling element with such ID #tasksList). Using tools below `insertAdjacentHTML` we put in the and of block (use `beforehand`) our const taskHTML/ so check the page, now all added tasks appear on the page one by one
  tasksList.insertAdjacentHTML("beforeend", taskHTML);

  // clearing input area and refuse focus on that
  taskInput.value = "";
  taskInput.focus();

  // if we received from a user at least one input (task) it means the label "task list is empty" must disappear. We hide our single task in HTML, creat const emptyList and by ising HTML clas (none) hide that
  // if (tasksList.children.length > 1) {
  //   emptyList.classList.add("none");
  // }

  checkEmptyList();
}

// this func makes tasks deleting possible
function deleteTask(event) {
  // checking that ckick was NOT!!! on button "delete task"
  if (event.target.dataset.action !== "delete") {
    return;
  }

  // checking that ckick was on button "delete task"
  const parentNode = event.target.closest(".list-group-item");

  // detecting task ID
  const id = +parentNode.id;

  // 1.. we want do delete task from array by pushing remove button. The 1st way - searching for task index (ID) in array via findKIndex
  // const index = tasks.findIndex(function (task) {
  //   if (task.id === id) {
  //     return true;
  //   }
  // });

  // +++ removing task from array
  // tasks.splice(index, 1);

  // 2.. we want do delete task from array by pushing remove button. The 2nd way - filtering task index (ID) in array via method filter
  tasks = tasks.filter((task) => taskInput.id !== id);

  // saving tasks into LocalStorage
  saveToLocalStorage();

  // removing task from web
  parentNode.remove();

  // now we're turning back "the list is empty" if no task exists
  // if (tasksList.children.length === 1) {
  //   emptyList.classList.remove("none");
  // }

  checkEmptyList();
}

// this func makes marking tasks as "done" possible
function doneTask(event) {
  // checking that ckick was NOT!!! on button "task done"
  if (event.target.dataset.action !== "done") {
    return;
  }

  // checking that ckick was on button "task done"
  const parentNode = event.target.closest(".list-group-item");

  // ID task determination
  const id = +parentNode.id;
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  // saving tasks into LocalStorage
  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
    <div class="empty-list__title">Список дел пуст</div>
  </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
