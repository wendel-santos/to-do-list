const newItem = document.getElementById('newItem')
const todoList = document.getElementById('todoList')
const btnAddTodo = document.querySelector('.btn-add-todo')
const inputSearchTodo = document.querySelector('.form-search')

//   ---- Functions ----   //
const getLocalStorage = () => JSON.parse(localStorage.getItem('todoList')) ?? []
const setLocalStorage = database => localStorage.setItem('todoList', JSON.stringify(database))
const clearTasks = () => document.getElementById('todoList').innerHTML = ''

const database = getLocalStorage()

const createItem = (task, status, index) => {
  const item = document.createElement('label')

  item.classList.add('todo-item')
  item.innerHTML = `
    <input type="checkbox" ${status} data-index=${index}>
    <div class="todo-item-div">${task}</div>
    <input type="button" value="X" data-index=${index}>
  `

  document.getElementById('todoList').appendChild(item)
}

const updateScreen = () => {
  clearTasks()
  database.forEach(({ task, status }, index) => 
    createItem(task, status, index))
}

const setLocalAndUpdate = database => {
  setLocalStorage(database)
  updateScreen()
}

const addTodoByEnter = e => {
  const inputValue = e.target.value
  const keyIsEnter = e.key === 'Enter'

  if (keyIsEnter && inputValue.length) {
    database.push({'task': inputValue, 'status': ''})
    setLocalAndUpdate(database)
    e.target.value = ''
  }
}

const addTodoByButton = () => {
  const inputValue = newItem.value
  
  if (inputValue.length) {
    database.push({'task': inputValue, 'status': ''})
    setLocalAndUpdate(database)
    newItem.value = ''
  }
}

const removeItem = index => {
  database.splice(index, 1)
  setLocalAndUpdate(database)
}

const updateItem = index => {
  const databaseIndex = database[index]

  databaseIndex.status = databaseIndex.status === '' ? 'checked' : ''
  setLocalAndUpdate(database)
}

const clickItem = e => {
  const element = e.target
  const elementTypeIsButton = element.type === 'button'
  const elementTypeIsCheckbox = element.type === 'checkbox'
  const index = element.dataset.index

  if (elementTypeIsButton) {
    removeItem(index)
  } else if (elementTypeIsCheckbox) {
    updateItem(index)
  }
}

const filterTodos = (todos, inputValue, returnMatchedTodos) => todos
  .filter(todo => {
    const matchedTodos = todo.textContent.toLowerCase().includes(inputValue)
    return returnMatchedTodos ? matchedTodos : !matchedTodos
  })

const manipulateClasses = (todo, classToAdd, classToHide) => {
  todo.forEach(todo => {
    todo.classList.remove(classToHide)
    todo.classList.add(classToAdd)
  })
}

const hideTodos = (todos, inputValue) => {
  const todoToRemove = filterTodos(todos, inputValue, false)
  manipulateClasses(todoToRemove, 'hidden', 'd-flex')
}

const showTodos = (todos, inputValue) => {
  const todoToAdd = filterTodos(todos, inputValue, true)
  manipulateClasses(todoToAdd, 'd-flex', 'hidden')
}

const searchTodo = e => {  
  const inputValue = e.target.value.toLowerCase()
  const todos = Array.from(todoList.children)

  hideTodos(todos, inputValue)
  showTodos(todos, inputValue)
}

//   ---- Listeners ----   //
newItem.addEventListener('keypress', addTodoByEnter)
btnAddTodo.addEventListener('click', addTodoByButton)
todoList.addEventListener('click', clickItem)
inputSearchTodo.addEventListener('input', searchTodo)
inputSearchTodo.addEventListener('submit', e => e.preventDefault())

updateScreen()