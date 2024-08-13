#!/usr/bin/env node
const dotenv = require("dotenv");
const path = require('path');
const csv=require('json2csv').parse;
const fs = require('fs');
dotenv.config();

const [,,command, ...args] = process.argv;

const url = path.join(__dirname, "expenses.json");

const readTasks = () => {
    if (!fs.existsSync(url)) {
        fs.writeFileSync(url, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(url, 'utf-8'));
}

const writeTask = (list) => {
    fs.writeFileSync(url, JSON.stringify(list, null, 2));
    console.log("Successfully written all tasks.");
}

const AddExpense = (description, amount, category) => {
    let Tasks = readTasks();
    const id = Tasks.length + 1;
    const newTask = {
        id,
        description,
        amount,
        category,
        month: new Date().getMonth() + 1 
    };
    Tasks.push(newTask);
    writeTask(Tasks);
    console.log("Added new expense:", newTask);
};

const DelExpense = (id) => {
    let Tasks = readTasks();
    Tasks = Tasks.filter(task => id !== task.id);
    writeTask(Tasks);
    console.log("Deleted task with ID:", id);
}

const listExpense = () => {
    let Tasks = readTasks();
    Tasks.forEach(element => {
        console.log(`${element.id} ,${element.description} ,${element.amount}`);
    });
};

const summaryExpense = (month) => {
    let tasks = readTasks();
    let totalAmount = 0;

    if (month > 0 && month < 13) {
        tasks = tasks.filter(task => task.month === month);
    }

    tasks.forEach(element => {
        totalAmount += element.amount;
    });

    console.log(`Total expenses${month ? ` for month ${month}` : ''}: ${totalAmount}`);
}

const CategorySearch = (category) => {
    console.log(1);
    let tasks = readTasks();
    tasks = tasks.filter(task => task.category === category);
    console.log(tasks);

    tasks.forEach(element => {
        console.log(`${element.category}, ${element.description}`);
    });
};

const writecsv=()=>{
 const fields=["id","description","month","amount","category"];
 const tasks=readTasks();
const csvfile=csv(tasks,{fields},);
fs.writeFileSync("data.csv",csvfile,function(err){
    
    if(err){
        throw err;
    }
        console.log("success");
    
    
        

});
};
switch(command) {
    case 'add':
        const description = args[0];
        const amount = parseFloat(args[1]);
        const category = args[2] || "Uncategorized"; // Default category if not provided
        AddExpense(description, amount, category);
        break;
    case 'summary':
        const month = parseInt(args[0]);
        summaryExpense(month);
        break;
    case 'list':
        listExpense();
        break;
    case 'delete':
        const idToDelete = parseInt(args[0]);
        DelExpense(idToDelete);
        break;
    case 'category':
        const categoryArg = args[0];
        CategorySearch(categoryArg);
        break;
    case 'savetocsv':
               writecsv();
               break;
    default:
        console.log("Unknown command");
}
