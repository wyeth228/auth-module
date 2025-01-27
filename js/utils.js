define(function () {
  var filesStore = {};

  var utils = {
    loadFile: function (src, callback) {
      if (src in filesStore) {
        callback(filesStore[src]);

        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.overrideMimeType("text/plain");
      xhr.open("GET", src, true);
      xhr.onload = function () {
        filesStore[src] = xhr.responseText;

        callback(utils.copy(xhr.responseText));
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

    loadJSON: function (src, callback) {
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

    innerHTML: function (element, text) {
      element.innerHTML = text;
    },

    appendChildren: function (element, children) {
      for (var i = 0; i < children.length; ++i) {
        element.appendChild(children[i]);
      }
    },

    createElement: function (type, classNames) {
      var element = document.createElement(type);

      if (classNames) {
        for (var i = 0; i < classNames.length; ++i) {
          var className = classNames[i];

          element.classList.add(className);
        }
      }

      return element;
    },

    getFileContentFromEvent: function (event, callback) {
      var fileReader = new FileReader();
      fileReader.readAsText(event.dataTransfer.files[0]);

      fileReader.onload = function () {
        callback(fileReader.result);
      };
    },

    contains: function (element1, element2) {
      if (element1.contains(element2)) {
        return true;
      }
    },

    searchIn: function (array, callback) {
      for (var i = 0; i < array.length; ++i) {
        if (callback(array[i])) {
          return {
            find: array[i],
            index: i,
          };
        }
      }

      return null;
    },

    copy: function (object) {
      return JSON.parse(JSON.stringify(object));
    },

    startWaiter: function (callback) {
      return setInterval(callback, 100);
    },

    endWaiter: function (id) {
      clearInterval(id);
    },
  };

  return utils;
});
