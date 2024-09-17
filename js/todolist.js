export default class ToDoList {
//properties starting with underscore are called "private properties".
    constructor() {
        this._list = [];

/*
        Classes are a template for creating objects. 

    this._list = [
        { _id: 1, _item: "Buy groceries",...[Prototype]==> methods },
        { _id: 2, _item: "Read a book",... [Prototype]==> methods},
        { _id: 3, _item: "Write code",... [Prototype]==> methods}
    ];

*/
    }

// I prefer to use methods named like below, rather than using "get" and "set" keywords. It just reads better to me throughout the code.
    getList() {
        return this._list; // returns an empty array
    }

    clearList() {
        this._list = [];
    }

    addItemToList(itemObj) 
    {
        this._list.push(itemObj);
    }

    removeItemFromList(id) {
        const list = this._list; // [] just a single array 
        for (let i = 0; i < list.length; i++) {

//This line checks if the "_id" property of the "i"-th element in the list array is equal to the "id" passed as an argument to the "removeItemFromList" method.

            if (list[i]._id == id) {
//The reason for not using "strict equality comparison" ("===") in the line "if (list[i]._id == id)" is likely due to the fact that the "id" attribute value retrieved from the DOM is a string, whereas the "_id" property in the "ToDoItem" class might be a number.
                list.splice(i, 1);
                break;
            }
        }
    }
}

/*
    In JavaScript, a "default export" is a way to share a single value, function, or class as the main thing from a file with other parts of your code.

    When you have a file that needs to be used in other parts of your application, you can mark one item in that file as the "default export" using the export default syntax.

    This means that when you import from that file in another part of your code, you don't need to use curly braces {} around the import statement. Instead, you can give it any name you want during the import, making it more convenient to use.


    // 📂 math.js
    const add = (a, b) => a + b;

    export default add;

    // 📂 main.js
    import myAddFunction from './math.js';
    
    const result = myAddFunction(5, 10); // This will call the add function from math.js and store the result in the 'result' variable.
*/
