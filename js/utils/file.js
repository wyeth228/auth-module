define(function () {
  return {
    getFileContentFromEvent: function (event, callback) {
      var fileReader = new FileReader();
      fileReader.readAsText(event.dataTransfer.files[0]);

      fileReader.onload = function () {
        callback(fileReader.result);
      };
    },
  };
});
