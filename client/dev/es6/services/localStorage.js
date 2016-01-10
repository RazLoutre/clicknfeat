angular.module('clickApp.services')
  .factory('localStorage', [
    'jsonParser',
    'jsonStringifier',
    function(jsonParserService,
             jsonStringifierService) {
      var localStorageService = {
        keys: function localStorageKeys() {
          return R.pipe(
            R.always(self.localStorage.length),
            R.range(0),
            R.map(R.bind(self.localStorage.key,
                         self.localStorage))
          )();
        },
        getItem: function localStorageGetItem(key) {
          return new self.Promise((resolve) => {
            resolve(self.localStorage.getItem(key));
          });
        },
        load: function localStorageLoad(key) {
          return localStorageService.getItem(key)
            .then(jsonParserService.parse);
        },
        setItem: function localStoragesetItem(key, value) {
          return new self.Promise((resolve) => {
            self.localStorage.setItem(key, value);
            resolve(value);
          });
        },
        save: function localStorageSave(key, value) {
          return jsonStringifierService.stringify(value)
            .then(localStorageService.setItem$(key))
            .then(R.always(value));
        },
        removeItem: function localStorageRemoveItem(key) {
          return new self.Promise((resolve) => {
            resolve(self.localStorage.removeItem(key));
          });
        }
      };
      R.curryService(localStorageService);
      return localStorageService;
    }
  ]);
