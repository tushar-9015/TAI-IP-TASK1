const addTodoBtn = document.getElementById("add-todo-btn");
const inputField = document.querySelector(".input-field");
const editTodoBtn = document.getElementById("edit");
const deleteTodoBtn = document.getElementById("delete");
const todoList = document.querySelector(".todo-list");

const TODO_LIST = JSON.parse(localStorage.getItem("TODO_LIST")) || [];

const noTodoMessage = document.createElement("p");
noTodoMessage.textContent = "No items found";

function addTodoHandler(event) {
  event.preventDefault();
  if (inputField.value.trim() === "") return;
  let newTodo = { id: +Math.random(), title: inputField.value, isDone: false };
  TODO_LIST.unshift(newTodo);
  createTodoComp(newTodo);
  inputField.value = "";
  if (todoList.contains(noTodoMessage) && TODO_LIST.length > 0)
    todoList.removeChild(noTodoMessage);

  localStorage.setItem("TODO_LIST", JSON.stringify(TODO_LIST));

  console.log(TODO_LIST);
}

class compClickHandler {
  constructor(e) {
    e.stopPropagation();
    if (this.classList.contains("is-done")) {
      this.classList.remove("is-done");
      TODO_LIST.find((el) => (this.id = el.id)).isDone = false;
    } else {
      this.classList.add("is-done");
      TODO_LIST.find((el) => (this.id = el.id)).isDone = true;
    }

    localStorage.setItem("TODO_LIST", JSON.stringify(TODO_LIST));
  }
}

function loadTodosFromStorage() {
  TODO_LIST.forEach((todo) => {
    createTodoComp(todo);
  });
}

loadTodosFromStorage();

function createTodoComp(element) {
  const li = document.createElement("li");
  li.classList.add("todo-comp");
  li.id = element.id;
  const p = document.createElement("p");
  p.textContent = element.title;
  li.appendChild(p);
  const div = document.createElement("div");
  div.classList.add("buttons");
  li.appendChild(div);
  const btnEdit = document.createElement("button");
  btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
  btnEdit.classList.add("edit");
  div.appendChild(btnEdit);

  btnEdit.addEventListener("click", editTodoHandler);

  const btnDelete = document.createElement("button");
  btnDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
  btnDelete.classList.add("delete");
  div.appendChild(btnDelete);

  btnDelete.addEventListener("click", deleteTodoHandler);

  li.addEventListener("click", compClickHandler);

  todoList.prepend(li);
}

function editTodoHandler(event) {
  event.stopImmediatePropagation();
  const titleElement = event.target.closest("li").querySelector("p");
  const mainCompId = event.target.closest("li").id;
  const oldText = titleElement.textContent;
  const newTitleInput = document.createElement("input");

  newTitleInput.addEventListener("click", (event) =>
    event.stopImmediatePropagation()
  );

  newTitleInput.setAttribute("type", "text");
  newTitleInput.classList.add("edit-todo-input-field");
  titleElement.parentNode.replaceChild(newTitleInput, titleElement);
  newTitleInput.value = oldText;
  newTitleInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const newText = document.createElement("p");
      newText.textContent = newTitleInput.value;
      newTitleInput.parentElement.replaceChild(newText, newTitleInput);
      for (const item of TODO_LIST) {
        if (item.id === +mainCompId) item.title = newTitleInput.value;
      }

      localStorage.setItem("TODO_LIST", JSON.stringify(TODO_LIST));
    }
    console.log(TODO_LIST);
  });
}

function deleteTodoHandler(event) {
  event.stopImmediatePropagation();
  const parentListEl = event.target.closest("li");
  todoList.removeChild(parentListEl);

  for (const el of TODO_LIST) {
    if (el.id === +parentListEl.id) TODO_LIST.splice(TODO_LIST.indexOf(el), 1);
  }

  console.log(TODO_LIST);

  if (TODO_LIST.length === 0) todoList.appendChild(noTodoMessage);

  localStorage.setItem("TODO_LIST", JSON.stringify(TODO_LIST));
}

if (TODO_LIST.length === 0) todoList.appendChild(noTodoMessage);

addTodoBtn.addEventListener("click", addTodoHandler);
