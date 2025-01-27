define(function () {
  var events = {};

  return {
    onEventHappens: function (eventName, callback) {
      if (eventName in events) {
        if (Array.isArray(events[eventName])) {
          events[eventName].push(callback);

          return;
        }
      }

      events[eventName] = [callback];
    },

    sendEvent: function (eventName, arguments, callback) {
      if (!(eventName in events)) {
        return;
      }

      var event = events[eventName];

      if (callback) {
        for (var eventCallback of event) {
          eventCallback(arguments, callback);
        }
      } else {
        for (var eventCallback of event) {
          eventCallback(arguments);
        }
      }
    },
  };
});
