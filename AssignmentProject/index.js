var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var todo_db = require("./seed");
console.log(todo_db);

app.use("/",express.static(__dirname+"/public"));
app.use("/",bodyParser.urlencoded({extended : false}));

app.use("/",function (req,res,next) {
    next();
})

//getAllTODOS
app.get("/api/todos",function (req,res) {
   res.json(todo_db.todos);
});

//delete TODO
app.delete("/api/todos/:id",function (req,res) {
   var id = req.params.id;
   var todo = todo_db.todos[id];
   if(!todo){
     res.status(400).json({error : "TODO doesn't Exist"});
   }
   else{
       todo.status = todo_db.StatusENUMS.DELETED;
       res.json(todo_db.todos);
   }
});

//create todo
app.post("/api/todos",function (req,res) {
    var todo = req.body.todo_title;
    if(!todo || todo == "" || todo.trim() == ""){
        res.status(400).json({error : "TODO Title Can't be Empty"});
    }
    else{
        var new_todo = {
            title : req.body.todo_title,
            status : todo_db.StatusENUMS.ACTIVE
        }
        todo_db.todos[todo_db.next_todo_id++] = new_todo;
        res.json(todo_db.todos);
    }
});

//update todo
app.put("/api/todos/:id",function (req,res) {
    var id = req.params.id;
    var todo = todo_db.todos[id];

    if(!todo){
        res.status(400).json({error : "TODO doesn't Exist"});
    }
    else{
        var todo_title = req.body.todo_title;
        if(todo_title && todo_title!="" && todo_title.trim()!=""){
            todo.title = todo_title;
        }
        var todo_status = req.body.todo_status;
        if(todo_status && todo_status == todo_db.StatusENUMS.ACTIVE ||
            todo_status == todo_db.StatusENUMS.COMPLETE){
            todo.status = todo_status;
        }

        todo_db.todos[id] = todo;
        res.json(todo_db.todos);
    }


});


//markActive
app.put("/api/todos/:id",function (req,res) {
    var id = res.params.id;
    var todo = todo_db.todos[id];
    if(!todo){
        res.status(404).json({error : "Todo doesn't exist"});
    }else{
        todo.status = todo_db.statusENUMS.ACTIVE;
    }
    res.json(todo_db.todos);
});

//markComplete
app.put("/api/todos/:id",function (req,res) {
    var id = res.params.id;
    var todo = todo_db.todos[id];
    if(!todo){
        res.status(404).json({error : "Todo doesn't exist"});
    }else{
        todo.status = todo_db.statusENUMS.COMPLETE;
    }
    res.json(todo_db.todos);
});


//getAllActiveTODOD
app.get("/api/todos/active",function (req,res) {
    var count = todo_db.next_todo_id-1;
    var activeTodos = {};
    var x = 1;
    for(var i = 1; i <= count ; i++){
        if(todo_db.todos[i].status == todo_db.statusENUMS.ACTIVE){
            activeTodos[x++] = todo_db.todos[i];
        }
    }
    res.json(activeTodos);
});

//getAllCompleteTODOD
app.get("/api/todos/complete",function (req,res) {
    var count = todo_db.next_todo_id-1;
    var completeTodos = {};
    var x = 1;
    for(var i = 1; i <= count ; i++){
        if(todo_db.todos[i].status == todo_db.statusENUMS.COMPLETE){
            completeTodos[x++] = todo_db.todos[i];
        }
    }
    res.json(completeTodos);
});

//getAllDeletedTODOD
app.get("/api/todos/delete",function (req,res) {
    var count = todo_db.next_todo_id-1;
    var deleteToqdos = {};
    var x = 1;
    for(var i = 1; i <= count ; i++){
        if(todo_db.todos[i].status == todo_db.statusENUMS.DELETED){
            deleteTodos[x++] = todo_db.todos[i];
        }
    }
    res.json(deleteTodos);
});

app.listen(4000);