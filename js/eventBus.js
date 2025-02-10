/**
 * v0.1.1
 */

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
        for (var i = 0; i < event.length; ++i) {
          event[i](arguments, callback);
        }
      } else {
        for (var i = 0; i < event.length; ++i) {
          event[i](arguments);
        }
      }
    },
  };
});
