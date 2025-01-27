define(function () {
  return {
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
});
