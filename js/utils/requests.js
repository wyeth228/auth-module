define(["utils/extra"], function (utilsExtra) {
  var config = {
    CALLBACK_TYPES: {
      LOAD_IMAGE: "loadImage",
      LOAD_FILE: "loadFile",
    },
  };

  var fileStore = {};

  var callbackStore = {};

  function addVersion(src) {
    if (window.APP_VERSION) {
      var args = "v=" + window.APP_VERSION;

      if (src.indexOf("?") === -1) {
        return src + "?" + args;
      } else {
        return src + "&" + args;
      }
    }
  }

  return {
    loadFile: function (src, callback) {
      src = addVersion(src);

      /**
       * if we have already downloaded such file we will pass the file
       */
      if (src in fileStore) {
        if (fileStore[src] !== null) {
          callback(utilsExtra.copy(fileStore[src]));

          return;
        }
      }

      /**
       * store callback in callback storage
       */
      if (src in callbackStore) {
        callbackStore[src].callbacks.push(callback);
      } else {
        callbackStore[src] = {
          type: "loadFile",
          callbacks: [callback],
        };
      }

      /**
       * if the file is loading we will not do request
       */
      if (fileStore[src] === null) {
        return;
      } else {
        /**
         * if the file not started a try to be downloaded, we will mark this file as currently downloading
         */
        fileStore[src] = null;
      }

      var xhr = new XMLHttpRequest();
      xhr.overrideMimeType("text/plain");
      xhr.open("GET", src, true);
      xhr.onload = function () {
        fileStore[src] = xhr.responseText;

        var callbackSendData = utilsExtra.copy(xhr.responseText);

        if (src in callbackStore) {
          if (callbackStore[src].type === config.CALLBACK_TYPES.LOAD_FILE) {
            for (var i = 0; i < callbackStore[src].callbacks.length; ++i) {
              var cb = callbackStore[src].callbacks[i];

              cb(callbackSendData);
            }

            delete callbackStore[src];
          }
        }
      };

      xhr.send(null);
    },

    loadJSON: function (src, callback) {
      src = addVersion(src);

      var stored = localStorage.getItem(src);

      if (stored) {
        callback(JSON.parse(stored));

        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.overrideMimeType("application/json");
      xhr.open("GET", src, true);
      xhr.onload = function () {
        localStorage.setItem(src, xhr.responseText);

        callback(JSON.parse(xhr.responseText));
      };

      xhr.send(null);
    },

    loadImage: function (src, callback) {
      src = addVersion(src);

      /**
       * if we have already downloaded such file we will pass the file
       */
      if (src in fileStore) {
        if (fileStore[src] !== null) {
          callback(fileStore[src]);

          return;
        }
      }

      /**
       * store callback in callback storage
       */
      if (src in callbackStore) {
        callbackStore[src].callbacks.push(callback);
      } else {
        callbackStore[src] = {
          type: "loadImage",
          callbacks: [callback],
        };
      }

      /**
       * if the file is loading we will not do request
       */
      if (fileStore[src] === null) {
        return;
      } else {
        /**
         * if the file not started a try to be downloaded, we will mark this file as currently downloading
         */
        fileStore[src] = null;
      }

      var xhr = new XMLHttpRequest();
      xhr.responseType = "arraybuffer";
      xhr.overrideMimeType("image/*");
      xhr.open("GET", src, true);
      xhr.onload = function () {
        var blob = new Blob([xhr.response]);

        var callbackSendData = URL.createObjectURL(blob);

        fileStore[src] = callbackSendData;

        if (src in callbackStore) {
          if (callbackStore[src].type === config.CALLBACK_TYPES.LOAD_IMAGE) {
            for (var i = 0; i < callbackStore[src].callbacks.length; ++i) {
              var cb = callbackStore[src].callbacks[i];

              cb(callbackSendData);
            }

            delete callbackStore[src];
          }
        }
      };

      xhr.send(null);
    },

    doRequest: function (url, settings, successCallback, errorCallback) {
      if (!settings) {
        return;
      }

      if (!("method" in settings)) {
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open(settings.method, url, true);
      xhr.onload = function () {
        successCallback(xhr.status, xhr.response);
      };
      xhr.onerror = errorCallback;

      if ("body" in settings) {
        xhr.send(settings.body);
      } else {
        xhr.send(null);
      }
    },
  };
});
