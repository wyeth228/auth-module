/**
 * route change -> page render -> localize content (e.g. in "after" hook of router)
 */
var main = function (renderer, localizator, eventBus) {
  localizator.init();

  renderer.onPageRender(localizator.localizeHandler);

  renderer.init(eventBus, "app", ["/authorization", "/authentication"]);

  eventBus.onEventHappens("navigate", function (path) {
    renderer.navigate(path);
  });

  eventBus.onEventHappens("getTranslationText", function (data, callback) {
    callback(
      localizator.getDynamicTranslationText(data.pageName, data.translationName)
    );
  });
};

/**
 * test
 */
requirejs.config({
  urlArgs: function (id, url) {
    var args = "v=1";
    // if (url.indexOf("view.html") !== -1) {
    //   args = "v=2";
    // }

    return (url.indexOf("?") === -1 ? "?" : "&") + args;
  },
});

requirejs(["renderer", "localizator", "eventBus"], main);
