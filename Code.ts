/**
 * Development ID: AKfycby63MCjL7fELUmapeVKLUoQ4Dbqp1GYraOQFnmjuq44\
 * Responds to a MESSAGE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
import {listTaskLists, BucketedTasks} from "./Tasks";

function onMessage(event: any) {
  var taskListBuckets: BucketedTasks = listTaskLists();
  let card = buildCard(taskListBuckets);
  // console.log(card);
  return card;
}

function buildCard(taskListBuckets: BucketedTasks) {
  const card = {
    "cards": [
      {
        "header": buildCardHeader(),
        "sections": buildCardSections(taskListBuckets)
      }
    ]
  }
  return card;
}

function buildCardHeader(): Header {
  let header = {
    'title': 'Tasks List',
    'subtitle': 'The following tasks are due soon.',
    'imageUrl': 'https://goo.gl/aeDtrS'
  };
  return header;
}

/**
 * Builds the sections of a card
*/
function buildCardSections(taskListBuckets: BucketedTasks) {
  let sections = buildSectionTaskListWidgets(taskListBuckets);
  //let scheduleAllButton = buildButtonWidget("Schedule All", "test", []);
  //sections.push(scheduleAllButton)
  return sections;
}

function buildButtonWidget(text, action, parameters) {
  var widgetButton = {
    "widgets": [
      {
        "buttons": []
      }
    ]
  };
  widgetButton["widgets"][0].buttons.push(buildButton(text, action, parameters))
  return widgetButton;
}

function buildButton(text, action, parameters) {
  var button = {
    "textButton": {
      "text": text,
      "onClick": {
        "action": {
          "actionMethodName": action,
          "parameters": parameters
        }
      }
    }
  }
  return button;
}

function buildSectionTaskListWidgets(taskListBuckets: BucketedTasks) {
    var widgets = [];
    var allTasks = [];
    var noDueDate = taskListBuckets.noDueDate || [];
    var dueLater = taskListBuckets.dueLater || [];
    var dueSoon = taskListBuckets.dueSoon || [];
    var pastDue = taskListBuckets.pastDue || [];
    var dueSoonTasks = buildTaskRows(dueSoon);
    var pastDueTasks = buildTaskRows(pastDue);
    var noDueDateTasks = buildTaskRows(noDueDate);
    allTasks = allTasks.concat(dueSoonTasks, pastDueTasks, noDueDateTasks);
    var widgetsContainer = {
        "header": "Tasks",
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
function buildTaskRows(tasks) {
  const tasksList = tasks.map(function (t) {
    const messages = [
      t.getNotes() ? "Description: " + t.getNotes() : "",
      "Due Date: " + (t.due || "No Due Date"),
    ];
    const taskElement = {
      "keyValue": {
        "icon": "DESCRIPTION",
        "topLabel": `${t.title}`,
        "content":  messages.filter(v => v).join('<BR>'),
        "button": buildButton("Schedule", "test2", [{
          key: "title",
          value: t.title,
        },
        {
          key: "date",
          value: t.due,  
        }])
      }
    };
    return taskElement;
  });
  return tasksList;;
}

function onCardClick(event: any) {
  console.log(event);
}


/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 *
 * @param {Message} event the event object from Hangouts Chat
 */
function onAddToSpace(event: any): Message {
  var message = '';

  if (event.space.singleUserBotDm) {
    message =
        'Thank you for adding me to a DM, ' + event.user.displayName + '!';
  } else {
    message = 'Thank you for adding me to ' +
        (event.space.displayName ? event.space.displayName : 'this chat');
  }

  if (event.message) {
    // Bot added through @mention.
    message = message + ' and you said: "' + event.message.text + '"';
  }

  return {'text': message};
}

/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onRemoveFromSpace(event: any): void {
  console.info(
      'Bot removed from ', (event.space.name ? event.space.name : 'this chat'));
}

interface Header {
  title: string, subtitle: string, imageUrl: string
}

interface Section {
  widgets: TaskElement[],
}
interface TaskElement {
  keyValue?: {
    icon: string,
    topLabel: string,
    content: string,
  },
      buttons?: Button[],
}

interface Message {
  text: string,
}

interface Button {
  textButton: {
    text: string,
    onClick: {
      openLink?: {url: string}
      action?: {actionMethodName: string, parameters: Parameter[]}
    }
  }
}

interface Parameter {
  key: string, value: string,
}
