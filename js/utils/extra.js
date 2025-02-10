define(function () {
  return {
    copy: function (object) {
      return JSON.parse(JSON.stringify(object));
    },
  };
});
