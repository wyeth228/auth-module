define(function () {
  return {
    PAGES_DIRECTORY: "./pages",
    COMPONENTS_DIRECTORY: "./components",

    COMPONENTS_REGEXP: /<= component\(["].*?["]\) =>/gm,
    COMPONENT_NAME_REGEXP: /["'].*?["']/gm,
    QUOTATION_MARKS_REGEXP: /["']/gm,
  };
});
