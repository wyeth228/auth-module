define(["configs/app", "utils/requests"], function (appConfig, utils) {
  var config = {
    FORM_ID: "authentication__form",
    USERNAME_ID: "authentication__username",
    PASSWORD_ID: "authentication__password",
    BUTTON_ID: "authentication__button",

    SUCCESS_REDIRECT_URI: "/",
    SUCCESS_REDIRECT_DELAY: 1000,
  };

  var eventBus = undefined;

  function displayMessageWithTranslation(errorName, messageType) {
    eventBus.sendEvent(
      "getTranslationText",
      { pageName: "authorization", translationName: errorName },
      function (translationText) {
        if (translationText) {
          eventBus.sendEvent("displayMessage", {
            text: translationText,
            type: messageType,
          });
        }
      }
    );
  }

  function disableButton() {
    document.getElementById(config.BUTTON_ID).disabled = true;
  }

  function enableButton() {
    document.getElementById(config.BUTTON_ID).disabled = false;
  }

  function onRequestSuccess(status, response) {
    switch (status) {
      case 200:
        displayMessageWithTranslation("success", "success");

        setTimeout(function () {
          eventBus.sendEvent("navigate", config.SUCCESS_REDIRECT_URI);
        }, config.SUCCESS_REDIRECT_DELAY);
        break;
      case 401:
        var parsedObject = JSON.parse(response);

        if ("error_description" in parsedObject) {
          eventBus.sendEvent("displayMessage", {
            text: parsedObject.error_description,
            type: "error",
          });
        } else {
          displayUnexpectedError();
        }

        enableButton();
        break;
    }
  }

  function onRequestError() {
    displayUnexpectedError();

    enableButton();
  }

  function sendAuthenticationRequest(username, password) {
    try {
      eventBus.sendEvent("getLanguage", function (language) {
        utils.doRequest(
          appConfig.API_ADDRESS + appConfig.API_AUTHENTICATION_PATH,
          {
            method: "POST",
            body: "username=" + username + "&password=" + password,
          },
          onRequestSuccess,
          onRequestError,
          language
        );
      });
    } catch (error) {
      console.error(error);

      enableButton();

      displayUnexpectedError();
    }
  }

  function onSubmit(event) {
    event.preventDefault();

    var usernameInput = document.getElementById(config.USERNAME_ID);
    var passwordInput = document.getElementById(config.PASSWORD_ID);

    displayMessageWithTranslation("processing", "information");

    disableButton();

    sendAuthenticationRequest(usernameInput.value, passwordInput.value);
  }

  function hideMessage() {
    eventBus.sendEvent("hideMessage");
  }

  function displayUnexpectedError() {
    displayMessageWithTranslation("unexpected_error", "error");
  }

  function initEvents() {
    var formElement = document.getElementById(config.FORM_ID);

    if (formElement) {
      formElement.addEventListener("submit", onSubmit);
    }

    formElement.addEventListener("input", hideMessage);
  }

  return {
    init: function (eventBusDependency) {
      eventBus = eventBusDependency;

      initEvents();
    },
  };
});
