
var mainVue = new Vue({
    el: '#vue1',

    // When refreshing the page, make sure our array of task objects, tasksToDo, is the same as the one in the database
    beforeCreate() {

        $.get('/currentTasks', function(dataFromServer) {
            console.log(dataFromServer);
            // dataFromServer is an array of task objects with taskDescription property and isCompleted property
            mainVue.tasksToDo = dataFromServer;
        })
    },
    data: {
        taskToDo: '',
        tasksToDo: []
    },
    methods: {
        addTaskToDo: function(event){
            event.preventDefault();
            console.log("clicked add button");

            // add task to database
            $.post('/newTask', {taskDescription: mainVue.taskToDo}, function(dataFromServer){
                console.log("posted");
                
                // dataFromServer is the task object stored in the 'Tasks' Collection in the database, the same object that I previously passed with more properties added by default from the server
                //console.log(dataFromServer);

                // Add task object to tasksToDo so that it can be shown on the client side
                mainVue.tasksToDo.push(dataFromServer);

            });

            // get request to get an array of every task object, and update our array of every task object in our front-end
            //mainVue.getCurrentTasks();

            // reset the client input variable in the front-end
            mainVue.taskToDo = '';
        },

        removeTask: function(task, index) {

            // task is a task object pulled from front end
            $.post('/removeTask', task, function(data) {
                //mainVue.getCurrentTasks();
                console.log('Removed the task from the database: ', data);
            });

            //mainVue.getCurrentTasks();
            
            // remove task from front end
            mainVue.tasksToDo.splice(index, 1);
            // mainVue.tasksToDo = temp;
            // console.log(mainVue.tasksToDo);

        },

        getCurrentTasks: function() {

            // asking for the array of task objects according to the database, (U)pdate
            $.get('/currentTasks', function(data) {
                
                // data is an array of task objects
                // updating our array of task objects on the front end, with the one found in the database
                mainVue.tasksToDo = data;

                // console logging array of task objects from database
                //console.log('fresh data from the server: ', data);
            });

            // reset client input variable of task
            mainVue.taskToDo = '';
        },

        crossOut: function(task, index, event) {
            task.isCompleted = event.path[0].checked;
            console.log(event);
            // updating the task object to say that it is completed
            //task.isCompleted = !(task.)
            console.log(task.isCompleted);
            console.log(task);


            $.post('/crossOut', task, function(dataFromServer) {
                //mainVue.tasksToDo[index].isCompleted = !(mainVue.tasksToDo[index].isCompleted)
                //mainVue.getCurrentTasks();
                console.log(dataFromServer);
            });

        }
    }
});
