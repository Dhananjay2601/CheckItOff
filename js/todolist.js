// Class to define the properties and methods/functions of ToDoList

export default class ToDoList {
  constructor() {
    this._list = [];
  }

  getList() {
    return this._list;
  }

  clearList() {
    this._list = [];
  }

  addItemToList(itemObj) {
    this._list.push(itemObj);
  }

  removeItemFromList() {
    const list = this._list;
    for (let i = 0; i < list.length; i++) {
      list.splice(i, 1);
      break;
    }
  }
}
