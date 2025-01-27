define(["utils", "configs/renderer"], function (utils, config) {
  var appRoot = undefined;

  var router = undefined;

  var onPageRenderHappen = undefined;

  var eventBus = undefined;

  function loadAndInitJSModule(type, name, onModuleLoad) {
    var pathStart = "pages/";

    if (type === "component") {
      pathStart = "components/";
    }

    requirejs([pathStart + name + "/" + name + ".js"], function (module) {
      if (module) {
        if ("init" in module) {
          module.init(eventBus);
        }
      }

      if (onModuleLoad) {
        onModuleLoad();
      }
    });
  }

  function isPageContainsComponents(pageContent) {
    /**
     * search in html content substrings like <= component("componentName") =>
     */
    var components = pageContent.match(config.COMPONENTS_REGEXP);

    if (components.length) {
      return true;
    }

    return false;
  }

  function getAllComponentsData(pageContent) {
    /**
     * search in html contents substrings like <= component("componentName") =>
     */
    var componentMatches = pageContent.match(config.COMPONENTS_REGEXP);

    /**
     * result object which we will return
     */
    var resultComponentData = [];

    for (var componentMatch of componentMatches) {
      /**
       * extract from string <= component("componentName") => the "componentName" substring
       */
      var componentName = componentMatch.match(config.COMPONENT_NAME_REGEXP);

      if (!componentName) {
        return;
      }

      var alreadyExists = utils.searchIn(
        resultComponentData,
        function (componentData) {
          if (componentData.componentName === componentName) {
            return true;
          }
        }
      );

      /**
       * if component already exists in the list we will
       */
      if (alreadyExists) {
        return;
      }

      /**
       * remove "' symbols from "componentName" string
       */
      componentName = componentName[0].replace(
        config.QUOTATION_MARKS_REGEXP,
        ""
      );

      resultComponentData.push({
        componentName: componentName,
        componentReplaceName: componentMatch,
      });
    }

    return resultComponentData;
  }

  function insertComponentHTMLToContent(
    componentContent,
    componentReplaceName,
    pageContent
  ) {
    while (pageContent.indexOf(componentReplaceName) > 0) {
      pageContent = pageContent.replace(componentReplaceName, componentContent);
    }

    return pageContent;
  }

  /**
   * init component, load html and init its js after
   * @param {string} componentName
   * @param {string} componentReplaceName
   * @param {string} pageContent
   * @param {Function} onComponentLoad
   */
  function initComponent(
    componentName,
    componentReplaceName,
    pageContent,
    onComponentLoad
  ) {
    utils.loadFile(
      getPathToComponent(componentName),
      function (componentContent) {
        /**
         * get page content with inserted component
         */
        var changedPageContent = insertComponentHTMLToContent(
          componentContent,
          componentReplaceName,
          pageContent
        );

        /**
         * load component js and init, after all, we will call component load callback and pass to it html page with inserted component
         */
        loadAndInitJSModule("component", componentName, function () {
          onComponentLoad(changedPageContent);
        });
      }
    );
  }

  function initializeAllComponents(pageName, pageContent) {
    var componentsData = getAllComponentsData(pageContent);

    var initalizedComponents = 0;

    for (var componentData of componentsData) {
      /**
       * init component (load html and insert to page, and init js)
       */
      initComponent(
        componentData.componentName,
        componentData.componentReplaceName,
        pageContent,
        function (changedPageContent) {
          initalizedComponents++;

          if (initalizedComponents === Object.keys(componentsData).length) {
            onAllComponentsInitialized(pageName, changedPageContent);
          }
        }
      );
    }
  }

  function onAllComponentsInitialized(pageName, pageContent) {
    insertHTMLToAppRoot(pageName, pageContent);
  }

  function insertHTMLToAppRoot(pageName, pageContent) {
    appRoot.innerHTML = pageContent;

    if (onPageRenderHappen) {
      onPageRenderHappen(pageName);
    }

    loadAndInitJSModule("page", pageName);

    router.updatePageLinks();
  }

  function getPathToPage(pageName) {
    /**
     * returns something like: ./pagesDirectory/pageName/pageName.html
     */
    return config.PAGES_DIRECTORY + "/" + pageName + "/" + pageName + ".html";
  }

  function getPathToComponent(componentName) {
    /**
     * returns something like: ./componentsDirectory/componentName/componentName.html
     */
    return (
      config.COMPONENTS_DIRECTORY +
      "/" +
      componentName +
      "/" +
      componentName +
      ".html"
    );
  }

  function loadPage(pageName) {
    utils.loadFile(getPathToPage(pageName), function (pageContent) {
      renderPage(pageName, pageContent);
    });
  }

  function renderPage(pageName, pageContent) {
    if (isPageContainsComponents(pageContent)) {
      initializeAllComponents(pageName, pageContent);
    } else {
      insertHTMLToAppRoot(pageName, pageContent);
    }
  }

  return {
    navigate: function (path) {
      router.navigate(path);
    },

    onPageRender: function (callback) {
      onPageRenderHappen = callback;
    },

    init: function (eventBusDependency, rootId, routes) {
      eventBus = eventBusDependency;

      appRoot = document.getElementById(rootId);

      router = new Navigo();

      for (var route of routes) {
        router.on(route, function (route) {
          loadPage(route.url);
        });
      }

      router.resolve();
    },
  };
});
