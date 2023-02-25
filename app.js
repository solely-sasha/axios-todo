const todoList = document.getElementById("todo-list"); // ul
const todoForm = document["todo-form"];

// ------------ Current Todo Data----------------------------------------------------------------------
const getData = () => {
  axios
    .get("https://api.vschool.io/sashasims/todo")
    .then((res) => createTodo(res.data))

    .catch((err) => {
      console.log(err);
    });
};
//----------------- Create Elements -----------------------------------------------------------------------------------------------
function createTodo(data) {
  clearList();

  for (let i = 0; i < data.length; i++) {
    const todoDiv = document.createElement("div"); // create a todo div
    todoDiv.classList.add("todo");

    const checkbox = document.createElement("input"); // create checkbox input
    checkbox.classList.add("completed");
    checkbox.type = "checkbox";
    todoDiv.appendChild(checkbox);

    const newTodo = document.createElement("li"); // create li
    newTodo.textContent = data[i].title;
    newTodo.classList.add("todo-item"); // classname for li
    todoDiv.appendChild(newTodo); // append li to todo div

    const info = document.createElement("p");
    info.textContent = data[i].description;
    info.classList.add("description");
    todoDiv.appendChild(info);

    const price = document.createElement("p");
    price.textContent = data[i].price;
    todoDiv.appendChild(price);

    const image = document.createElement("img"); // create checkbox input
    image.classList.add("img");
    image.src = data[i].imgUrl;
    todoDiv.appendChild(image);

    if (!data[i].imgUrl) {
      image.remove();
    }

    // -----------------------------Update---------------------------------------------------------------------------------------------
    checkbox.addEventListener("click", checked);

    function checked(e) {
      if (e.target.checked) {
        const updateTrue = {
          completed: true,
        };

        axios
          .put(
            `https://api.vschool.io/sashasims/todo/${data[i]._id}`,
            updateTrue
          )
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err));
      }
    }

    // ---------------------------------Delete--------------------------------------------------------------------------------------------
    const deleteButton = document.createElement("button"); // create button for
    deleteButton.innerText = "X";
    deleteButton.classList.add("deleteButton");
    todoDiv.appendChild(deleteButton);

    todoList.appendChild(todoDiv);


    deleteButton.addEventListener("click", (e) => {
        const item = e.target;
        if(item.classList[0]=== "deleteButton"){
            const todo = item.parentElement;
            //animation
            todo.classList.add('fall');
            todo.addEventListener("transitionend", function(){
                todo.remove()
            })
         
        }
      axios
        .delete(`https://api.vschool.io/sashasims/todo/${data[i]._id}`)
        .then((res) => getData())
        .catch((err) => console.log(err));
    });
  }
}
// ----------------Clear Data-------------------------------------------------------------------------------------------------------------
function clearList() {
  while (todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  }
}

getData();

//------------------ API Data ---------------------------------------------------------------------------------------------------------
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTodos = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    price: todoForm.price.value,
    imgUrl: todoForm.imgUrl.value,
  };



  //---------------- Reset Input Fields--------------------------------------------------------------------------------------------------------
  todoForm.reset();

  //------------ Post New Todo to API-------------------------------------------------------------------------------------------
  axios
    .post("https://api.vschool.io/sashasims/todo", newTodos)
    .then((res) => getData())

    .catch((err) => console.log(err));
});


