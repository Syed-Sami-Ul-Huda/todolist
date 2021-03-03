//dependencies required for the app
const express = require("express");
const session = require("express-session");
const flash = require('connect-flash');

const app = express();

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//render css files
app.use(express.static("public"));
// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));
  
  
// Express Messages Middleware
app.use(flash());
app.use(function(req, res, next){
    res.locals.add = req.flash('add');
    res.locals.remove = req.flash('remove');
    res.locals.delete = req.flash('delete');
    next();
});


const port = process.env.PORT || 3000;

//placeholders for added task
const task = ["SQL Advance Course"];

//placeholders for removed task
const complete = ["Node JS Course Completed",
                "MongoDb Course Completed",
                "Git Course Completed"];

//post route for adding new task 
app.post("/addtask", (req, res) => {  
    //add the new task from the post route
   
    const newTask = req.body.newtask;
       if(newTask == ''){
        req.flash('add', "Sorry! You can't enter an empty task in list");
        res.redirect("/");
    }
    else{
    task.push(newTask);
    res.redirect("/");}
   
});

app.post("/removetask", (req, res) => {
    const completeTask = req.body.check;
    //check for the "typeof" the different completed task, then add into the complete task
    if(!completeTask){
        req.flash('remove', "Sorry! You can't remove an empty task from list");
    }
    if (typeof completeTask === "string") {
        complete.push(completeTask);
        //check if the completed task already exits in the task when checked, then remove it
        task.splice(task.indexOf(completeTask), 1);
    } 
    res.redirect("/");
});

app.post("/deletetask", (req, res) => {
    const completedTask = req.body.check2;
    //check for the "typeof" the different completed task, then add into the complete task
    
    if (typeof completedTask === "string") {
    
        //check if the completed task already exits in the task when checked, then remove it
        complete.splice(complete.indexOf(completedTask), 1);
    } 
    else if(!completedTask){
        req.flash('delete', "Sorry! You can't delete an empty task from list");
      
    }
    res.redirect("/");
});

//render the ejs and display added task, completed task
app.get("/", (req, res) =>{
    res.render("index", { task: task, complete: complete });
});

//set app to listen on port 3000
app.listen(port, (err) => { 
    if (err) console.log(err);
    console.log(`server is running on port ${port}`);
});