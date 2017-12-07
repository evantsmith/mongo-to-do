var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var assert = require('assert');

var mongoSaving = require('./test/mongo-test-saving.js');

// ES6 Promises
// mongoose.Promise = global.Promise;

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static('./public'));

mongoose.connect('mongodb://localhost/toDo', {useMongoClient: true});

    mongoose.connection.once('open', function(){
        console.log("Connnection has been made!");
        // done();
    }).on('error', function(error){
        console.log("Connection error ", error);
    });

// new schema for model for the collection 'Tasks' (array) of task objects in database
var TaskSchema = new mongoose.Schema({

    taskDescription: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },

});

var TaskModel = mongoose.model('Task', TaskSchema);

// homepage
app.get('/', function(request,response){
    console.log('made it to home page');
    response.sendFile('./public/html/mongo-to-do-index.html',{root: './'});
});

// Sending array of task objects back to the front-end
app.get('/currentTasks', function(req, res){
    TaskModel.find({}, function(error, tasks){
        // Sending 'tasks', an array of every task object in the array 'Tasks' Collection in the database
        res.send(tasks);
    });
});


// add new task to the 'Tasks' Collection in the database
app.post('/newTask', function(req,res){
    // req.body is an object with the property 'taskDescription'
    // get object ready to be added to 'Tasks' collection in database
    console.log("made it here");
    var newTask = new TaskModel(req.body);

    // save task to the database
    newTask.save(function(error, createdTask){
        if(error){
            console.log("Error occured: ", error);
            res.status(500).send(error);
        } else {
            console.log("Saved the task to database");
            // send back the newly created task object with _id property and other properties, like isCompleted property
            res.send(createdTask);
        };
    });

}); // End add new task

// remove task from the 'Tasks' Collection in the database
app.post('/removeTask', function(req,res){
    // req.body is task object pulled from html that the user wants to remove
    //remove task object from database
    console.log("made it here!!");
    TaskModel.findOneAndRemove(req.body, function(err, deletedTask){
        if(err){
            res.status(500).send(err);
        };
        res.send(deletedTask);
    });
});

app.post('/crossOut', function(req,res){
    //req.body is task object, need to update it's isCompleted property in database
    console.log(req.body);
    TaskModel.findOne({taskDescription: req.body.taskDescription}, function(error, task){
        if (error) {
            res.status(500).send(error);
        } else {
            task.isCompleted = req.body.isCompleted;
            task.save(function(error, task){
                if(error){
                    console.log("Error occured: ", error);
                    res.status(500).send(error);
                } else {
                    console.log("Saved the task to database");
                    // send back the newly created task object with _id property and other properties, like isCompleted property
                    res.send(task);
                };
            });
            //res.send(task);
        };
    });

    //req.body.isCompleted
});




app.listen(8080, function(){
    console.log("The server is listening on port 8080");
});
