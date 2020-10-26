// Compiled using ts2gas 3.6.3 (TypeScript 3.9.7)
var exports = exports || {};
var module = module || { exports: exports };
// Compiled using ts2gas 3.6.3 (TypeScript 3.9.7)
var exports = exports || {};
var module = module || { exports: exports };
//import {listTaskLists, BucketedTasks} from "./Tasks";
/**
 * Responds to a ON_MESSAGE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
*/
function onMessage(event) {
    var taskListBuckets = listTaskLists();
    var card = buildCard(taskListBuckets);
    return card;
}
/**
 * Builds the tasks card displayed in Hangouts Chat.
*/
function buildCard(taskListBuckets) {
    var card = {
        "cards": [
            {
                "header": buildCardHeader(),
                "sections": buildCardSections(taskListBuckets)
            }
        ]
    };
    return card;
}
/**
 * Builds the header for the tasks card displayed in Hangouts Chat.
*/
function buildCardHeader() {
    var header = {
        'title': 'Task Scheduler Bot',
        'subtitle': 'Hi there! Would you like to schedule a task?',
        'imageUrl': 'https://goo.gl/aeDtrS'
    };
    return header;
}
/**
 * Builds the sections for the tasks card displayed in Hangouts Chat.
*/
function buildCardSections(taskListBuckets) {
    var sections = buildSectionTaskListWidgets(taskListBuckets);
    var footerButtonWidget = buildFooterButtonWidget(taskListBuckets);
    sections.push(footerButtonWidget);
    return sections;
}
/**
 * Builds the footer for the widgets
*/
function buildFooterButtonWidget() {
    var footerButtonWidget = {
        "widgets": [
            {
                "buttons": buildFooterButtons()
            }
        ]
    };
    return footerButtonWidget;
}
/**
 * Builds the footer buttons for the widgets.
*/
function buildFooterButtons() {
    var scheduleButton = {
        "textButton": {
            "text": "Schedule All",
            "onClick": {
                action: {
                    "actionMethodName": "SCHEDULE_ALL",
                    "parameters": []
                }
            }
        }
    };
    var openButton = {
        "textButton": {
            "text": "Open Tasks in UI",
            "onClick": {
                "openLink": { "url": "https://tasks.google.com/embed/list" }
            }
        }
    };
    return [scheduleButton, openButton];
}
/**
 * Builds the button to execute a specific action.
*/
function buildButtonForAction(text, action, parameters) {
    var button = {
        "imageButton": {
            "text": text,
            "icon": "INVITE",
            "onClick": {
                "action": {
                    "actionMethodName": action,
                    "parameters": parameters
                }
            }
        }
    };
    return button;
}
/**
 * Builds the section task list widgets for the tasks card displayed in Hangouts Chat.
*/
function buildSectionTaskListWidgets(taskListBuckets) {
    var widgets = [];
    var noDueDate = taskListBuckets.noDueDate || [];
    var noDueDateTasks = buildTaskRows(noDueDate, "No Due Date");
    var dueLater = taskListBuckets.dueLater || [];
    var dueLaterTasks = buildTaskRows(dueLater, "Due Later");
    var dueSoon = taskListBuckets.dueSoon || [];
    var dueSoonTasks = buildTaskRows(dueSoon, "Due Soon");
    var pastDue = taskListBuckets.pastDue || [];
    var pastDueTasks = buildTaskRows(pastDue, "Past Due");
    var allTasks = [];
    allTasks = allTasks.concat(dueSoonTasks, pastDueTasks, noDueDateTasks, dueLaterTasks);
    var widgetsContainer = {
        "header": "My Tasks",
        "widgets": allTasks
    };
    widgets.push(widgetsContainer);
    return widgets;
}
/**
 * Builds a list of tasks to show to the user
 *
 * @param {List} tasks a list of tasks from the Tasks API
 */
function buildTaskRows(tasks, status) {
    var tasksList = tasks.map(function (t) {
        if (!t.title)
            return;
        var taskDate = null;
        if (t.due) {
            taskDate = new Date(t.due);
        }
        console.log(t.title);
        console.log(t.due);
        console.log(t.getParent());
        var messages = [
            t.getNotes() ? "<b>Description:</b> " + t.getNotes() : "",
            "<b>Due Date: </b>" + (taskDate ? taskDate.toLocaleString() : "No Due Date"),
            "<b>Status: </b>" + status
        ];
        var taskElement = {
            "keyValue": {
                "icon": "DESCRIPTION",
                "topLabel": t.title,
                "content": messages.filter(function (v) { return v; }).join('<BR>'),
                "contentMultiline": "true",
                "bottomLabel": "------------------------------------------------------------",
                "button": buildButtonForAction("Schedule", "SCHEDULE_SINGLE", [{
                        key: "title",
                        value: t.title
                    },
                    {
                        key: "date",
                        value: t.due
                    }])
            }
        };
        return taskElement;
    });
    return tasksList;
}
/**
 * Builds the task row buttons for the tasks card displayed in Hangouts Chat.
*/
function buildTaskRowButtons(taskId, taskTitle, taskDue) {
    var buttons = [];
    var params = [{
            key: "id",
            value: taskId
        }, {
            key: "title",
            value: taskTitle
        },
        {
            key: "date",
            value: taskDue
        }];
    var buttonObjs = {
        "SCHEDULE_SINGLE": {
            "buttonLabel": "Schedule",
            "params": params
        }
    };
    for (var buttonAction in buttonObjs) {
        var obj = buttonObjs[buttonAction];
        var button = buildButtonForAction(obj.buttonLabel, buttonAction, params);
        buttons.push(button);
    }
    return buttons;
}
/**
 * Responds to an ON_CARD_CLICK event in Hangouts Chat.
 *
 * @param {Message} event the event object from Hangouts Chat
*/
function onCardClick(event) {
    console.log(event);
    var user = event.user.email;
    var parameters = event.action.parameters;
    if (event.action.actionMethodName && event.action.actionMethodName === "SCHEDULE_SINGLE") {
        return scheduleSingleTask(parameters, user);
    }
    else {
        return scheduleAllTasks(user);
    }
}
/**
 * Schedules a single task using the task due date.
*/
function scheduleSingleTask(parameters, user) {
    var task = {
        "user": user
    };
    for (var i = 0; i < parameters.length; i++) {
        var param = parameters[i];
        switch (param.key) {
            case "id":
                task["id"] = param.value;
                break;
            case "title":
                task["title"] = param.value;
                break;
            case "date":
                task["date"] = param.value;
                break;
            default:
                break;
        }
    }
    console.log(task);
    var taskDateStr = "the next day";
    if(task.date) {
      var taskDate = new Date(task.date);
      taskDateStr = taskDate.toLocaleString()
    }
    // scheduleTasksOnCalendar([task]);
    return { "text": "Your task " + task.title + " was scheduled on " + taskDateStr + " successfully!" };
}
/**
 * Schedules all tasks using the tasks due date.
*/
function scheduleAllTasks(user) {
    var taskListBuckets = listTaskLists();
    var taskList = [];
    for (var taskBucket in taskListBuckets) {
        var tasks = taskListBuckets[taskBucket];
        for (var i = 0; i < tasks.length; i++) {
            var t = tasks[i];
            if (!t.title)
                continue;
            var taskToSchedule = {
                "user": user
            };
            taskToSchedule["id"] = t.id;
            taskToSchedule["title"] = t.title;
            taskToSchedule["date"] = t.due;
            taskToSchedule["user"] = user;
            console.log(taskToSchedule);
            taskList.push(taskToSchedule);
        }
    }
    // scheduleTasksOnCalendar(taskList);
    return { "text": "All your tasks were scheduled successfully!" };
}

/**
 * Schedules tasks on the calendar.
*/
function scheduleTasksOnCalendar(tasks) {
/*
{ user: 'anaesqueda@google.com',
  id: 'TDBBQ0ZMVmZBVEllRmNQQQ',
  title: 'Task test 1',
  date: '2020-10-20T00:00:00.000Z' }
 */
  var task1 = {
    "user": "anaesqueda@google.com",
    "id" : "1234",
    "title": "Test task on Calendar!!!!!!",
    "date": "2020-10-20T00:00:00.000Z"
  }
  tasks = [task1];
  for(var i = 0; i< tasks.length; i++) {
    var task = tasks[i];
    var startDateStr = "";
    var endDateStr = "";
    if(task.date) {
      var startDate = new Date(task.date);
      var endDate = new Date(task.date);
      console.log(endDate.getHours());
      endDate.setHours(endDate.getHours() + 1);
      console.log(endDate.getHours());
      // -- 
      startDateStr = startDate.toISOString();
      endDateStr = endDate.toISOString();
      console.log(startDateStr);
      console.log(endDateStr);
    }
    var calendarService = new CalendarService(task.user, 'https://www.googleapis.com/calendar/v3');
    calendarService.createEvent(task.title, startDateStr, endDateStr, 'This is the task description');
  }
}

/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat..
 *
 * @param {Message} event the event object from Hangouts Chat
 */
function onAddToSpace(event) {
    var message = '';
    if (event.space.singleUserBotDm) {
        message =
            'Thank you for adding me to a DM, ' + event.user.displayName + '!';
    }
    else {
        message = 'Thank you for adding me to ' +
            (event.space.displayName ? event.space.displayName : 'this chat');
    }
    if (event.message) {
        // Bot added through @mention.
        message = message + ' and you said: "' + event.message.text + '"';
    }
    return { 'text': message };
}
/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onRemoveFromSpace(event) {
    console.info('Bot removed from ', (event.space.name ? event.space.name : 'this chat'));
}