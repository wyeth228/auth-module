define(["configs/app", "utils/requests"], function (appConfig, utils) {
  var config = {
    FORM_ID: "authorization__form",
    USERNAME_ID: "authorization__username",
    PASSWORD_ID: "authorization__password",
    REPEATED_PASSWORD_ID: "authorization__repeated-password",
    BUTTON_ID: "authorization__button",

    SUCCESS_REDIRECT_URI: "/",
    SUCCESS_REDIRECT_DELAY: 1000,

    // checks username for including at least two letters, and not to including any special character
    USERNAME_VALID_REGEXP: /^(?=.*[A-Za-zа-яА-Я]{2,})[A-Za-zа-яА-Я\d]{2,18}$/,

    // checks password for including at least one letter, one special character and length is more than eight
    PASSWORD_VALID_REGEXP:
      /^(?=.*[A-Za-zа-яА-Я])(?=.*[@$!%*#?&])[A-Za-zа-яА-Я\d@$!%*#?&]{8,}$/,
  };

  var eventBus = undefined;

  /**
   * checks username for including at least two letters, and not to including any special character
   * @param {string} username
   * @returns
   */
  function usernameIsValid(username) {
    return username.match(config.USERNAME_VALID_REGEXP);
  }

  /**
   * checks password for including at least one letter, one special character and length is more than eight
   * @param {string} password
   * @returns {boolean}
   */
  function passwordIsValid(password) {
    return password.match(config.PASSWORD_VALID_REGEXP);
  }

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

  function displayUnexpectedError() {
    displayMessageWithTranslation("unexpected_error", "error");
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

  function sendAuthorizationRequest(username, password) {
    try {
      eventBus.sendEvent("getLanguage", function (language) {
        utils.doRequest(
          appConfig.API_ADDRESS + appConfig.API_AUTHORIZATION_PATH,
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

  function disableButton() {
    document.getElementById(config.BUTTON_ID).disabled = true;
  }

  function enableButton() {
    document.getElementById(config.BUTTON_ID).disabled = false;
  }

  function hideMessage() {
    eventBus.sendEvent("hideMessage");
  }

  function onSubmit(event) {
    event.preventDefault();

    var usernameInput = document.getElementById(config.USERNAME_ID);
    var passwordInput = document.getElementById(config.PASSWORD_ID);
    var repeatedPasswordInput = document.getElementById(
      config.REPEATED_PASSWORD_ID
    );

    if (!usernameIsValid(usernameInput.value)) {
      displayMessageWithTranslation("username_not_valid", "error");
    } else if (!passwordIsValid(passwordInput.value)) {
      displayMessageWithTranslation("password_not_valid", "error");
    } else if (passwordInput.value !== repeatedPasswordInput.value) {
      displayMessageWithTranslation("passwords_not_same", "error");
    } else {
      displayMessageWithTranslation("processing", "information");

      disableButton();

      sendAuthorizationRequest(usernameInput.value, passwordInput.value);
    }
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
