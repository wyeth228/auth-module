define(["utils", "configs/localizator"], function (utils, config) {
  var localizations = undefined;

  var language = undefined;

  function isAllLocalizationsDownloaded() {
    if (localizations) {
      return true;
    }

    return false;
  }

  function localizePage(pageName) {
    if (!localizations[pageName]) {
      return;
    }

    for (var dataId of Object.keys(localizations[pageName].static)) {
      var element = document.querySelector(
        '[data-localizator-id="' + dataId + '"]'
      );

      if (!element) {
        return;
      }

      var elementTranslationData = localizations[pageName].static[dataId];

      if (!(language in elementTranslationData)) {
        return;
      }

      switch (elementTranslationData.type) {
        case config.INNER_HTML:
          element.innerHTML = elementTranslationData[language];
          break;
        case config.PLACEHOLDER:
          element.placeholder = elementTranslationData[language];
      }
    }
  }

  function determineLanguage() {
    if (!navigator.language) {
      language = config.LANGUAGES.EN;

      return;
    }

    var navigatorLanguage = navigator.language.split("-")[0];

    if (
      navigatorLanguage === config.LANGUAGES.EN ||
      navigatorLanguage === config.LANGUAGES.RU
    ) {
      language = navigatorLanguage;
    } else {
      language = config.LANGUAGES.EN;
    }
  }

  return {
    localizeHandler: function (pageName) {
      if (isAllLocalizationsDownloaded()) {
        localizePage(pageName);
      } else {
        var waiterId = utils.startWaiter(function () {
          if (isAllLocalizationsDownloaded()) {
            localizePage(pageName);

            utils.endWaiter(waiterId);
          }
        });
      }
    },

    getDynamicTranslationText: function (pageName, translationName) {
      if (!(pageName in localizations)) {
        return "";
      }

      var translations = localizations[pageName].dynamic[translationName];

      if (!(language in translations)) {
        return "";
      }

      return translations[language];
    },

    init: function () {
      determineLanguage();

      utils.loadJSON(config.LOCALIZATIONS_PATH, function (result) {
        localizations = result;
      });
    },
  };
});
