/**
 * Development ID: AKfycby63MCjL7fELUmapeVKLUoQ4Dbqp1GYraOQFnmjuq44\
 * Responds to a MESSAGE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onMessage(event) {
  var name = "";

  if (event.space.type == "DM") {
    name = "You";
  } else {
    name = event.user.displayName;
  }
  var message = name + " said \"" + event.message.text + "\"";

  var card = {
    "cards": [
      {
        "header": {
          "title": "Chatbot",
          "subtitle": "task-chatbot@google.com",
          "imageUrl": "https://fonts.gstatic.com/s/i/productlogos/tasks/v5/web-24dp/logo_tasks_color_1x_web_24dp.png"
        },
        "sections": [
          {
            "widgets": [
                {
                  "keyValue": {
                    "topLabel": "Order No.",
                    "content": "12345"
                    }
                },
                {
                  "keyValue": {
                    "topLabel": "Status",
                    "content": "In Delivery"
                  }
                }
            ]
          },
          {
            "header": "Location",
            "widgets": [
              {
                "image": {
                  "imageUrl": "https://maps.googleapis.com/..."
                }
              }
            ]
          },
          {
            "widgets": [
                {
                    "buttons": [
                      {
                        "textButton": {
                          "text": "OPEN ORDER",
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
      }
    ]
  }

  var text = { "text": 'THIS IS A' }

  return card;
}

/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onAddToSpace(event) {
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
function onRemoveFromSpace(event) {
  console.info("Bot removed from ",
      (event.space.name ? event.space.name : "this chat"));
}
