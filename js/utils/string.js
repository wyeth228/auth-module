define(function () {
  return {
    /**
     * @param {number} dateInSeconds
     * @param {string} language
     * @param {object} months
     * @returns {string} like: january 01, 2024
     */
    formatDate: function (dateInSeconds, language, months) {
      if (typeof dateInSeconds !== "number") {
        console.error("formatDateInSeconds error: we need a number");

        return;
      }

      if (typeof language !== "string") {
        console.error("formatDate error: we need a correct language code");

        return;
      }

      if (typeof months !== "object" || !("1" in months)) {
        console.error("formatDate error: we need a correct months data");

        return;
      }

      var date = new Date(dateInSeconds);
      var day = undefined;

      if (date.getDate() < 10) {
        day = "0" + date.getDate();
      } else {
        day = date.getDate();
      }

      return (
        months[date.getMonth() + 1][language] +
        " " +
        day +
        ", " +
        date.getFullYear()
      );
    },

    unescapeHTML: function (html) {
      return html
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");
    },
  };
});
