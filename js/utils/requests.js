define(["utils/extra"], function (utilsExtra) {
  var config = {
    CALLBACK_TYPES: {
      LOAD_IMAGE: "loadImage",
      LOAD_FILE: "loadFile",
    },
  };

  var fileStore = {};

  var callbackStore = {};

  function deletePreviousVersionsFromLocalStorage(src, versionedSrc) {
    for (var i = 0; i < localStorage.length; ++i) {
      (function (index) {
        var keyFromLocalStorage = localStorage.key(index);

        if (keyFromLocalStorage === versionedSrc) {
          return;
        }

        if (keyFromLocalStorage.indexOf(src) === -1) {
          return;
        }

        /**
         * setTimeout is used for because removing items from localStorage will change its length that this cycle depends of.
         * removing from localStorage will be happpend after the iteration is accomplished
         */
        setTimeout(function () {
          localStorage.removeItem(keyFromLocalStorage);
        });
      })(i);
    }
  }

  function addVersionTo(src) {
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
      src = addVersionTo(src);

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
          type: config.CALLBACK_TYPES.LOAD_FILE,
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

        if (!(src in callbackStore)) {
          return;
        }

        if (callbackStore[src].type !== config.CALLBACK_TYPES.LOAD_FILE) {
          return;
        }

        for (var i = 0; i < callbackStore[src].callbacks.length; ++i) {
          var cb = callbackStore[src].callbacks[i];

          cb(callbackSendData);
        }

        delete callbackStore[src];
      };

      xhr.send(null);
    },

    loadJSON: function (src, callback) {
      var versionedSrc = addVersionTo(src);

      deletePreviousVersionsFromLocalStorage(src, versionedSrc);

      var stored = localStorage.getItem(versionedSrc);

      if (stored) {
        callback(JSON.parse(stored));

        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.overrideMimeType("application/json");
      xhr.open("GET", versionedSrc, true);
      xhr.onload = function () {
        localStorage.setItem(versionedSrc, xhr.responseText);

        callback(JSON.parse(xhr.responseText));
      };

      xhr.send(null);
    },

    loadImage: function (src, callback) {
      src = addVersionTo(src);

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
          type: config.CALLBACK_TYPES.LOAD_IMAGE,
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

      var image = new Image();
      image.src = src;
      image.onload = function () {
        fileStore[src] = src;

        if (!(src in callbackStore)) {
          return;
        }

        if (callbackStore[src].type !== config.CALLBACK_TYPES.LOAD_IMAGE) {
          return;
        }

        for (var i = 0; i < callbackStore[src].callbacks.length; ++i) {
          var cb = callbackStore[src].callbacks[i];

          cb(src);
        }

        delete callbackStore[src];
      };
    },

    doRequest: function (
      url,
      settings,
      successCallback,
      errorCallback,
      language
    ) {
      if (!settings) {
        return;
      }

      if (!("method" in settings)) {
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open(settings.method, url, true);
      xhr.setRequestHeader("Accept-Language", language);
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
