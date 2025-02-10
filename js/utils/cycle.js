define(function () {
  return {
    startWaiter: function (callback) {
      return setInterval(callback, 100);
    },

    endWaiter: function (id) {
      clearInterval(id);
    },
  };
});
