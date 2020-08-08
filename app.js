var express = require('express');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: 'var.env' });
const TodoTask = require("./models/TodoTask");

var app = express();

app.use(express.urlencoded({ extended: true }));

//static files 
app.use(express.static('./public'));

mongoose.set("useFindAndModify",false);

mongoose.connect(process.env.db_connect, { useNewUrlParser: true }, () => {
    console.log("Connected to db");
    app.listen(3000,() => console.log("listening at port 3000"))
});

//set up template engine

app.set('view engine', 'ejs');

//get method
app.get('/',(req,res) => {
    TodoTask.find({},(err,data) =>{
        if(err) throw err;
        res.render('todo.ejs', {task: data});
    });
});

//post method
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    // console.log(req.body.content);
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        // console.log(err);
        res.redirect("/");
    }
});
 
//update method
app
.route("/edit/:id")
.get((req,res) =>{
    const id = req.params.id;
    TodoTask.find({}, (err,tasks) =>{
        res.render('todo-edit.ejs', {todoTasks: tasks, idTask: id});
    });
})
.post((req,res) =>{
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id,{content: req.body.content}, err =>{
        if(err) return res.send(500,err);
        res.redirect('/');
    });
});

// delete request
app.get('/remove/:id',(req,res) =>{
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id,err =>{
        if(err) return res.send(500,err);
        res.redirect('/');
    });
});