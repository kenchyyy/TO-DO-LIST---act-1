import './style.css'

const input = document.getElementById("input") as HTMLInputElement
const list = document.getElementById("list") as HTMLUListElement
const form = document.getElementById("submit") as HTMLFormElement

form.addEventListener("submit", e => {      //waits for the submit action and then adds the task, either user presses the enter button or presses the add button
  e.preventDefault();        // prevents the page from refreshing when submit action is done
  addTask();
})


function addTask(): void {
  const task = input.value.trim()
  if (task === '' || task === null) return  //to handle cases where an empty input is submitted

  const item = document.createElement("li");
  const del = document.createElement("span");
  item.innerHTML = input.value;
  del.innerHTML = "\u00d7";
  list.appendChild(item);            //puts the li element into the list
  item.appendChild(del);             //attaches the delete icon to the LI element created
  input.value = "";
}

//handles the completion and deletion functions
list.addEventListener("click",(e) => {
  const clicked = e.target;
  if (clicked instanceof HTMLLIElement) {             //checks to see if the one clicked is the list element
    clicked.classList.toggle("done");                  //toggles the class of the item to done when clicked and vice versa
  }
  else if(clicked instanceof HTMLSpanElement) {       //checks to see if the clicked event is a span or in this case 'x'
    clicked.parentElement!.remove();                   //removes the LI element it was attached to
  }
})




