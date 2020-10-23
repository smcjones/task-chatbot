/**
 * @fileoverview Task API client
 */

/**
 * Task API management library.
 */
export class TaskApp {
  /**
   * Returns the results of listTasks by tasklist.
   */
  listTaskLists(): BucketedTasks {
    const taskListBucket: BucketedTasks = {
      pastDue: [],
      dueSoon: [],
      dueLater: [],
      noDueDate: [],
    };

    const taskLists = Tasks.Tasklists.list();
    if (taskLists.items) {
      for (let i = 0; i < taskLists.items.length; i++) {
        const taskList = taskLists.items[i];
        const localBucket = this.listTasks(taskList.id);
        taskListBucket.pastDue.concat(localBucket.pastDue);
        taskListBucket.dueSoon.concat(localBucket.dueSoon);
        taskListBucket.dueLater.concat(localBucket.dueLater);
        taskListBucket.noDueDate.concat(localBucket.noDueDate);
      }
    }
    return taskListBucket;
  }

  /**
   * Returns a list of tasks split into buckets: pastDue, dueSoon, dueLater and noDueDate
   */
  listTasks(taskListId): BucketedTasks {
    const tasks = Tasks.Tasks.list(taskListId);
    const result: BucketedTasks = {
      pastDue: [],
      dueSoon: [],
      dueLater: [],
      noDueDate: []
    };
    if (tasks.items) {
      for (let i = 0; i < tasks.items.length; i++) {
        const task = tasks.items[i];
        const now: number = new Date().getMilliseconds();
        const taskDueDate: number = task.due ? new Date(task.due).getMilliseconds() : null;
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

  markTaskComplete(taskListId, taskId) {

    const task = Tasks.Tasks.get(taskListId, taskId);
      const request = {
        "status": "completed",
        "completed": new Date().toISOString(),
      };
    Tasks.Tasks.patch(request, taskListId, taskId);
  }

  markTaskDelete(taskListId, taskId) {

    const task = Tasks.Tasks.get(taskListId, taskId);
      const request = {
        "deleted": true,
      };
    Tasks.Tasks.patch(request, taskListId, taskId);
  }

  test() {
    Logger.log(this.listTaskLists());
  }
}

export interface BucketedTasks {
  pastDue: GoogleAppsScript.Tasks.Schema.Task[],
  dueSoon: GoogleAppsScript.Tasks.Schema.Task[],[],
  dueLater: GoogleAppsScript.Tasks.Schema.Task[],
  noDueDate: GoogleAppsScript.Tasks.Schema.Task[],
}