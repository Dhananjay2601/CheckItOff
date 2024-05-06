import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";

// Created a NEW instance of class ToDoList and assigned it intoa variable "toDoList"
const toDoList = new ToDoList();

// Launch APP
document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
});

const initApp = () => {
  // Listener on the SUBMIT button of form
  const itemEntryForm = document.getElementById("itemEntryForm");
  itemEntryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    processSubmission();
  });

  // Listener on the CLEAR button of list
  const clearItems = document.getElementById("clearItems");
  clearItems.addEventListener("click", (event) => {
    const list = toDoList.getList();

    if (list.length) {
      const confirmed = confirm("Are you sure you want to clear entire list?");
      if (confirmed) {
        toDoList.clearList();
        // update persistent data
        updatePersistentData(toDoList.getList());
        refreshThePage();
      }
    }
  });

  // LOAD the list obj from LocalStorage when app starts
  loadListObject();
  refreshThePage();
};

// fn to LOAD list from localStorage everytime app is run
const loadListObject = () => {
  const storedList = localStorage.getItem("myToDoList");
  if (typeof storedList !== "string") return;
  const parsedList = JSON.parse(storedList);
  // we need to attach methods to the stored list objs again when they are loaded
  parsedList.forEach((itemObj) => {
    const newToDoItem = createNewItem(itemObj._id, itemObj._item);
    toDoList.addItemToList(newToDoItem);
  });
};

// fn to REFRESH the page
const refreshThePage = () => {
  clearListDisplay();
  renderlist();
  clearItemEntryInputField();
  setFocusOnItemEntryField();
};

// fn that CLEARS all the list elements
const clearListDisplay = () => {
  const parentElement = document.getElementById("listItems"); // 'listItems' is the parent component of all the list items
  deleteContents(parentElement); // we pass the entire parent to the delete fn
};

// DELETE fn to delete all the child element from a parent element
const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  // removes each child one by one until all of them are gone
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

// fn to RENDER list by using the 'new toDoList' object created above
const renderlist = () => {
  const list = toDoList.getList();
  list.forEach((item) => {
    buildListItem(item);
  });
};

// fn to CREATE DOM elements for each list ITEM
const buildListItem = (item) => {
  const div = document.createElement("div");
  div.className = "item";

  const check = document.createElement("input");
  check.type = "checkbox";
  check.id = item.getId();
  check.tabIndex = 0;

  addClickListenerToCheckbox(check);

  const label = document.createElement("label");
  label.htmlFor = item.getId();
  label.textContent = item.getItem();

  div.appendChild(check);
  div.appendChild(label);

  const container = document.getElementById("listItems");
  container.appendChild(div);
};

// Listener fn to REMOVE item from list once checked off with 1 secTimeout
const addClickListenerToCheckbox = (checkbox) => {
  checkbox.addEventListener("click", (event) => {
    toDoList.removeItemFromList(checkbox.id);
    updatePersistentData(toDoList.getList());
    // remove from persistent data
    const removedText = getLabelText(checkbox.id);
    updateScreenReaderConfirmation(removedText, "removed from list");
    setTimeout(() => {
      refreshThePage();
    }, 1000);
  });
};

// fn to GET label text for screen reader
const getLabelText = (checkboxId) => {
  return document.getElementById(checkboxId).nextElementSibling.textContent;
};

// fn to UPDATE persistent data
const updatePersistentData = (listArray) => {
  localStorage.setItem("myToDoList", JSON.stringify(listArray));
};

// fn to CLEAR the input field after refresh/reload
const clearItemEntryInputField = () => {
  document.getElementById("newItem").value = "";
};

// fn to FOCUS on input field after refresh/reload
const setFocusOnItemEntryField = () => {
  document.getElementById("newItem").focus();
};

const processSubmission = () => {
  const newEntryText = getNewEntry();
  if (!newEntryText.length) return;
  const nextItemId = calcNextItemId();
  const toDoItem = createNewItem(nextItemId, newEntryText);
  toDoList.addItemToList(toDoItem);

  // update persistent data
  updatePersistentData(toDoList.getList());
  updateScreenReaderConfirmation(newEntryText, "added");
  refreshThePage();
};

// fn to GET the entered text inside the input field
const getNewEntry = () => {
  return document.getElementById("newItem").value.trim();
};

// CHECK if items already exist on the list or if its the first one
const calcNextItemId = () => {
  let nextItemId = 1;
  const list = toDoList.getList();
  if (list.length > 0) {
    // refer to the last itme of the list
    nextItemId = list[list.length - 1].getId() + 1;
  }
  return nextItemId;
};

// fn to CREATE new item and assign it a id and text
const createNewItem = (itemId, itemText) => {
  const toDo = new ToDoItem();
  toDo.setId(itemId);
  toDo.setItem(itemText);
  return toDo;
};

// fn to UPDATE screen reader on the list item name
const updateScreenReaderConfirmation = (newEntryText, actionVerb) => {
  document.getElementById(
    "confirmation"
  ).textContent = `${newEntryText}${actionVerb}`;
};
