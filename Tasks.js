/**
 * @fileoverview Task API client
 */

/**
 * Returns the results of listTasks by tasklist.
 */
function listTaskLists() {
  const taskLists = Tasks.Tasklists.list();
  const taskListBuckets = {};
  if (taskLists.items) {
    for (let i = 0; i < taskLists.items.length; i++) {
      const taskList = taskLists.items[i];
      taskListBuckets[taskList.title] = listTasks(taskList.id);
    }
  }
  return taskListBuckets;
}

/**
 * Returns a list of tasks split into buckets: pastDue, dueSoon, dueLater and noDueDate
 */
function listTasks(taskListId) {
  const tasks = Tasks.Tasks.list(taskListId);
  const result = {};
  if (tasks.items) {
    for (let i = 0; i < tasks.items.length; i++) {
      const task = tasks.items[i];
      const now = new Date();
      const taskDueDate = task.due ? new Date(task.due) : null;
      if (taskDueDate === null) {
        result["noDueDate"] = result["noDueDate"] || [];
        result["noDueDate"].push(task);
        continue;
      }
      if (taskDueDate - now <= 24*60*60*1000 && taskDueDate - now >= 0) {
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
}

function markTaskComplete(taskListId, taskId) {

  const task = Tasks.Tasks.get(taskListId, taskId);
    const request = {
      "status": "completed",
      "completed": new Date().toISOString(),
    };
  Tasks.Tasks.patch(request, taskListId, taskId);
}

function markTaskDelete(taskListId, taskId) {

  const task = Tasks.Tasks.get(taskListId, taskId);
    const request = {
      "deleted": true,
    };
  Tasks.Tasks.patch(request, taskListId, taskId);
}

function test() {
  Logger.log(listTaskLists());
}
