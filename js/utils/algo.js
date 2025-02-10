define(function () {
  function sortAsc(array, key) {
    array.sort(function (a, b) {
      if (a[key] < b[key]) {
        return -1;
      } else if (a[key] > b[key]) {
        return 1;
      }

      return 0;
    });
  }

  function sortDesc(array, key) {
    array.sort(function (a, b) {
      if (a[key] < b[key]) {
        return 1;
      } else if (a[key] > b[key]) {
        return -1;
      }

      return 0;
    });
  }

  return {
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

    sortAsc: sortAsc,

    sortDesc: sortDesc,

    sortByKey: function (array, key, order) {
      switch (order) {
        case "asc":
          sortAsc(array, key);
          break;
        case "desc":
          sortDesc(array, key);
          break;
        default:
          sortAsc(array, key);
      }
    },
  };
});
