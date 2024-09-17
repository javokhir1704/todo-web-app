// These imports are called modules
import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";

// for now, we just need the "toDoList"
const toDoList = new ToDoList();

//Launch app
document.addEventListener("readystatechange", (event) => {
//In the context of the "readystatechange" event, "event.target" refers to the "document" object. This is the object whose state has changed.
    
    if (event.target.readyState === "complete") { // this means the DOM is fully loaded and ready to interact with
        initApp();
        // console.log(event.target);
    }
});

const initApp = () => {
    // Add listeners
    const itemEntryForm = document.getElementById("itemEntryForm");
    
    itemEntryForm.addEventListener("submit", (event) => {

        event.preventDefault();


        processSubmission();
    });


    const clearItems = document.getElementById("clearItems");
    clearItems.addEventListener("click", (event) => {
        const list = toDoList.getList();
        if (list.length) { // if it is not empty
            const confirmed = confirm("Are you sure you want to clear the entire list?");

            if (confirmed) {
                toDoList.clearList();

                updatePersistentData(toDoList.getList()); // TODO: storing data 

                refreshThePage();
            }
        }
    });


    // Procedural
    loadListObject();
    refreshThePage(); // calling the function
}

const loadListObject = () => {

    const storedList = localStorage.getItem("myToDoList"); // getting our "myToDoList" out of localstorage
// if the stored list is not equal to a string, and it should be string data, that's definitely what we're storing. We're storing "stringifying JSON" and putting it in there!!!
    if (typeof storedList !== "string") return;

    const parsedList = JSON.parse(storedList);

    /*
        this._list = [
            { _id: 1, _item: "Buy groceries",...[Prototype] },
            { _id: 2, _item: "Read a book",... [Prototype]},
            { _id: 3, _item: "Write code",... [Prototype]}
        ];



        [
            { _id: 1, _item: "Buy groceries",...[Prototype] },
            { _id: 2, _item: "Read a book",... [Prototype]},
            { _id: 3, _item: "Write code",... [Prototype]}
        ]

    */

    parsedList.forEach(itemObj => { // itemObj would be each todoitem class instances which are objects
        const newToDoItem = createNewItem(itemObj._id, itemObj._item);

        toDoList.addItemToList(newToDoItem);
    });
}

const refreshThePage = () => {
    clearListDisplay(); //1

    renderList(); //2

    clearItemEntryField(); //3
    setFocusOnItemEntry();//4

}

const clearListDisplay = () => {
    const parentElement = document.getElementById('listItems');

    deleteContents(parentElement); // has been selected the parent "div" of list items
}

const deleteContents = (parentElement) => {
//"lastElementChild" returns the last child element(not text and comment nodes) of an element.
//"removeChild() method removes an element's child"

    let child = parentElement.lastElementChild;

    while (child) { // if there are no other child elements, the return value is "null", which is a falsy value

        parentElement.removeChild(child);
        //If there is another child element, then we reset the child variable to that element and it keeps going on until there are no other child elements
        child = parentElement.lastElementChild;
    }
}

const renderList = () => {
    const list = toDoList.getList(); // toDoList is an instance which is created at the top
    // console.log(toDoList);
    // console.log(toDoList.getList());
    list.forEach((item) => { // each items/elements of list array

        buildListItem(item);
    });
}

const buildListItem = (item) => { //
    const div = document.createElement("div");
    const check = document.createElement("input");
    const label = document.createElement("label");

    div.className = "item";
    check.type = "checkbox";
    check.id = item.getId();
    // Here, the "item" parameter is an object(it's actually "toDoItem" object)

    check.tabIndex = 0; 
    label.htmlFor = item.getId(); // This is for the "for" attribute of the "label" element
    label.textContent = item.getItem();

    div.appendChild(check);
    div.appendChild(label);

    const container = document.getElementById("listItems");
    container.appendChild(div);
    
    addClickListenerToCheckbox(check); // for the input element, when you want to mark as a checked off
}

const addClickListenerToCheckbox = (checkbox) => {

    checkbox.addEventListener('click', (event) => {
        
        toDoList.removeItemFromList(checkbox.id); // "checkbox.id" will return the "id" of specified element, it'll come in a string
        
        updatePersistentData(toDoList.getList());// TODO: stroing data

        const removedText = getLabelText(checkbox.id);
        updateScreenReaderConfirmation(removedText, "removed from list.");

        console.log(typeof checkbox.id); // just checking the value type of the element
        setTimeout(() => {

            refreshThePage();

        }, 1000);
    });
}

const getLabelText = (checkboxId) => {
    return document.getElementById(checkboxId).nextElementSibling.textContent;
}

const updatePersistentData = (listArray) => { // TODO: a basic implementation of updating the persistent data
    localStorage.setItem("myToDoList", JSON.stringify(listArray));
}

const clearItemEntryField = () => {

    document.getElementById("newItem").value = "";
}

const setFocusOnItemEntry = () => {

    document.getElementById("newItem").focus();
}


const processSubmission = () => {
    const newEntryText = getNewEntry(); // returns the value of input element

    if (!newEntryText.length) return; // when it is true(if length is zero), then exit from if-else statement

    const nextItemId = calcNextItemId();
    const toDoItem = createNewItem(nextItemId, newEntryText); // e.g: nextItemId:1, newEntryText:eat, some other methods, like setId(), getId(), setItem(), getItem();

    toDoList.addItemToList(toDoItem);
    console.log(toDoList);
    console.log(toDoItem);

    updatePersistentData(toDoList.getList()); // TODO: storing data
    updateScreenReaderConfirmation(newEntryText, "added");

    refreshThePage();
}

const getNewEntry = () => {

    return document.getElementById("newItem").value.trim(); // it's a input element
}

const calcNextItemId = () => {
    let nextItemId = 1;

    const list = toDoList.getList(); // list = [];

    if (list.length > 0) { // Initially, it's an empty array!!!

        nextItemId = list[list.length - 1].getId() + 1; // 1 is for the next item
    }// list[0].getId() + 1; ==> [{_id:1; _item:"something to do"; getid() {return this._id;}}]. So if you get the length of an array and deduct from it a number one, it'll get you the last element of that array!!!
    
    return nextItemId;
}

const createNewItem = (itemId, itemText) => {
    const toDo = new ToDoItem(); // initializing an object created with a class
    toDo.setId(itemId);
    toDo.setItem(itemText);
    
    return toDo; // Returns the ToDoItem instance
}

const updateScreenReaderConfirmation = (newEntryText, actionVerb) => {
    document.getElementById("confirmation").textContent = `${newEntryText} ${actionVerb}.`;
}

/*
    The "readystatechange" event is triggered when the "readyState" property of the "document" changes. This property reflects the current state of the document's readiness for manipulation. The "readystatechange" event can be triggered multiple times during the loading process as the document progresses through different stages.


    "readyState" Property Values

    The "readyState" property can have the following values, each corresponding to a different phase of the document loading process:

     1" loading:

        *This state indicates that the document is still loading.

        *The browser is still processing the HTML and building the DOM.

    2" interactive:

        *This state indicates that the document has finished loading and the DOM is fully built.

        *However, sub-resources such as images, stylesheets, and frames may still be loading.

    3" complete:

        *This state indicates that the document and all sub-resources have finished loading.

        *All resources, including images, stylesheets, and scripts, are fully loaded and ready for interaction.


    When "readystatechange" is Triggered

    The "readystatechange" event is triggered each time the "readyState" property changes. Therefore, it can be triggered multiple times as the document transitions through the states "loading", "interactive", and "complete".

*/