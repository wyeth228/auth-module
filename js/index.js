window.APP_VERSION = "0.1.5";

var main = function (renderer, localizator, eventBus) {
  localizator.init();

  renderer.onPageRender(localizator.localizeHandler);

  renderer.init(eventBus, "app", ["/authorization", "/authentication"]);

  eventBus.onEventHappens("navigate", function (path) {
    renderer.navigate(path);
  });

  eventBus.onEventHappens("getTranslationText", function (data, callback) {
    var localizations = localizator.getLocalizations();

    if ("authorization_messages" in localizations) {
      callback(
        localizations.authorization_messages[data.translationName][
          localizator.getLanguage()
        ]
      );
    }
  });
};

requirejs.config({
  waitSeconds: 200,
  urlArgs: function (id, url) {
    var args = "v=" + window.APP_VERSION;

    if (url.indexOf("?") === -1) {
      return "?" + args;
    } else {
      return "&" + args;
    }
  },
});

requirejs(["renderer", "localizator", "eventBus"], main);
