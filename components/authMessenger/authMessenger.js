define(function () {
  var config = {
    MESSENGER_ID: "auth-messenger",
    MESSENGER_HIDDEN_CLASSNAME: "auth-messenger_hidden",
    MESSENGER_TYPE_ERROR_CLASSNAME: "auth-messenger_error-type",
    MESSENGER_TYPE_INFORMATION_CLASSNAME: "auth-messenger_information-type",
    MESSENGER_TYPE_SUCCESS_CLASSNAME: "auth-messenger_success-type",
  };

  var eventBus = undefined;

  function cleanMessengerPreviousTypes(messengerElement) {
    var classListValues = messengerElement.classList;

    for (var i = 0; i < classListValues.length; ++i) {
      var className = classListValues[i];

      if (className.includes("type")) {
        messengerElement.classList.remove(className);
      }
    }
  }

  function displayMessage(text, type) {
    var messengerElement = document.getElementById(config.MESSENGER_ID);

    cleanMessengerPreviousTypes(messengerElement);

    switch (type) {
      case "error":
        messengerElement.classList.add(config.MESSENGER_TYPE_ERROR_CLASSNAME);
        break;
      case "information":
        messengerElement.classList.add(
          config.MESSENGER_TYPE_INFORMATION_CLASSNAME
        );
        break;
      case "success":
        messengerElement.classList.add(config.MESSENGER_TYPE_SUCCESS_CLASSNAME);
        break;
    }

    messengerElement.classList.remove(config.MESSENGER_HIDDEN_CLASSNAME);
    messengerElement.innerHTML = text;
  }

  function hideMessage() {
    var messengerElement = document.getElementById(config.MESSENGER_ID);

    messengerElement.classList.add(config.MESSENGER_HIDDEN_CLASSNAME);
  }

  return {
    subscribeToEvents: function () {
      eventBus.onEventHappens("displayMessage", function (data) {
        displayMessage(data.text, data.type);
      });

      eventBus.onEventHappens("hideMessage", function () {
        hideMessage();
      });
    },

    init: function (eventBusDependency) {
      eventBus = eventBusDependency;

      this.subscribeToEvents();
    },
  };
});
