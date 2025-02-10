define(function () {
  return {
    /**
     * creates div element
     * @param {Array<string>} classNames
     * @param {string} text
     * @returns {HTMLImageElement}
     */
    createDivElement: function (classNames, text) {
      var div = document.createElement("div");

      for (var i = 0; i < classNames.length; ++i) {
        var className = classNames[i];

        div.classList.add(className);
      }

      if (text) {
        div.innerHTML = text;
      }

      return div;
    },

    /**
     * creates p element
     * @param {Array<string>} classNames
     * @param {string} text
     * @returns {HTMLImageElement}
     */
    createParagraphElement: function (classNames, text) {
      var p = document.createElement("p");

      for (var i = 0; i < classNames.length; ++i) {
        var className = classNames[i];

        p.classList.add(className);
      }

      if (text) {
        p.innerHTML = text;
      }

      return p;
    },

    /**
     * creates image element
     * @param {string} src
     * @param {Array<string>} classNames
     * @returns {HTMLImageElement}
     */
    createImageElement: function (src, classNames) {
      var img = document.createElement("img");
      img.src = src;

      for (var i = 0; i < classNames.length; ++i) {
        var className = classNames[i];

        img.classList.add(className);
      }

      return img;
    },

    contains: function (element1, element2) {
      /**
       * checking instance for ie 9-11
       */
      if (element1 instanceof HTMLElement) {
        if (element1.contains(element2)) {
          return true;
        }
      }

      return false;
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
  };
});
