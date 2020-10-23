/**
 * Development ID: AKfycby63MCjL7fELUmapeVKLUoQ4Dbqp1GYraOQFnmjuq44\
 * Responds to a MESSAGE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onMessage(event: any) {
  let tasks = [{
    "id" : "12345",
    "name" : "Task 1",
    "description" : "This is my task 1",
    "date": "2020-10-23"
  },{
    "id" : "4567",
    "name" : "Task 2",
    "description" : "This is my task 2",
    "date": "2020-10-24"
  },{
    "id" : "891011", 
    "name" : "Task 3",
    "description" : "This is my task 3",
    "date": "2020-10-25"
  }]
  let card = buildCard(tasks);
  return card;
}

function buildCard(tasks: GoogleAppsScript.Tasks.Schema.Task[]) {
  const card = {
    "cards": [
      {
        "header": buildCardHeader(),
        "sections": buildCardSections(tasks)
      }
    ]
  }
  return card;
}

function buildCardHeader(): Header {
  let header = {
    "title": "Tasks List",
    "subtitle": "The following tasks are due soon.",
    "imageUrl": "https://goo.gl/aeDtrS"
  };
  return header;
}

/**
 * Builds the sections of a card
 *
 * @param {Section[]} tasks a list of tasks from the Tasks API
 */
function buildCardSections(tasks: GoogleAppsScript.Tasks.Schema.Task[]): Section[] {
  const taskList = buildTaskListForCard(tasks);
  let sections: Section[] = [
    {
      "widgets": taskList
    },
    {
      "widgets": [
        {
          "buttons": [
            {
              "textButton": {
                "text": "Schedule All",
                "onClick": {
                  "openLink": {
                    "url": "https://example.com/orders/..."
                  }
                }
              }
            }
          ]
        }
      ]
    }
  ]
  return sections;
}

/**
 * Builds a list of tasks to show to the user
 *
 * @param {List} tasks a list of tasks from the Tasks API
 */
function buildTaskListForCard(tasks: GoogleAppsScript.Tasks.Schema.Task[]): TaskElement[] {
  const tasksList = tasks.map(function(t){
    let taskElement = {
      "keyValue": {
        "icon": "DESCRIPTION",
        "topLabel": `${t.title} - ${t.id}`,
        "content": `<b>Description:</b> ${t.notes} <br> Date: ${t.due}`
      }
    }
    return taskElement
  });
  return tasksList;
}

/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 *
 * @param {Message} event the event object from Hangouts Chat
 */
function onAddToSpace(event: any): Message {
  var message = "";

  if (event.space.singleUserBotDm) {
    message = "Thank you for adding me to a DM, " + event.user.displayName + "!";
  } else {
    message = "Thank you for adding me to " +
        (event.space.displayName ? event.space.displayName : "this chat");
  }

  if (event.message) {
    // Bot added through @mention.
    message = message + " and you said: \"" + event.message.text + "\"";
  }

  return { "text": message };
}

/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onRemoveFromSpace(event: any): void {
  console.info("Bot removed from ",
      (event.space.name ? event.space.name : "this chat"));
}

interface Header {
 title: string, 
 subtitle: string, 
 imageUrl: string 
}

interface Section {
  widgets: TaskElement[],
}
interface TaskElement {
  keyValue?: { 
    icon:  string,
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
      openLink?: {
        url: string
      }
      action?: {
        actionMethodName: string,
        parameters: Parameter[]
      }
    }
  }
}

interface Parameter {
  key: string,
  value: string,
}