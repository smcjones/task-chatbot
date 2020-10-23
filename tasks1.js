/*
function listTaskLists() {
        var taskListBucket = {
            pastDue: [],
            dueSoon: [],
            dueLater: [],
            noDueDate: []
        };
        var taskLists = Tasks.Tasklists.list();
        if (taskLists.items) {
            for (var i = 0; i < taskLists.items.length; i++) {
                var taskList = taskLists.items[i];
                var localBucket = this.listTasks(taskList.id);
                taskListBucket.pastDue = taskListBucket.pastDue.concat(localBucket.pastDue);
                taskListBucket.dueSoon = taskListBucket.dueSoon.concat(localBucket.dueSoon);
                taskListBucket.dueLater = taskListBucket.dueLater.concat(localBucket.dueLater);
                taskListBucket.noDueDate = taskListBucket.noDueDate.concat(localBucket.noDueDate);
            }
        }
        return taskListBucket;
    }

listTasks = function (taskListId) {
    var tasks = Tasks.Tasks.list(taskListId);
    var result = {
        pastDue: [],
        dueSoon: [],
        dueLater: [],
        noDueDate: []
    };
    if (tasks.items) {
        for (var i = 0; i < tasks.items.length; i++) {
            var task = tasks.items[i];
            var now = new Date().getMilliseconds();
            var taskDueDate = task.due ? new Date(task.due).getMilliseconds() : null;
            if (taskDueDate === null) {
                result["noDueDate"] = result["noDueDate"] || [];
                result["noDueDate"].push(task);
                continue;
            }
            if (taskDueDate - now <= 24 * 60 * 60 * 1000 && taskDueDate - now >= 0) {
                result["dueSoon"] = result["dueSoon"] || [];
                result["dueSoon"].push(task);
                continue;
            }
            if (taskDueDate < now) {
                result["pastDue"] = result["pastDue"] || [];
                result["pastDue"].push(task);
                continue;
            }
            result["dueLater"] = result["dueLater"] || [];
            result["dueLater"].push(task);
        }
    }
    return result;
};*/