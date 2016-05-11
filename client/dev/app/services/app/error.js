'use strict';

(function () {
  angular.module('clickApp.services').factory('appError', appErrorServiceFactory);

  appErrorServiceFactory.$inject = ['pubSub'];
  function appErrorServiceFactory(pubSubService) {
    var errorService = {
      emit: errorEmit,
      addListener: errorAddListener,
      removeListener: errorRemoveListener
    };
    R.curryService(errorService);

    var event = R.thread()(function () {
      return pubSubService.create();
    }, pubSubService.addListener$('error', defaultErrorListener));

    return errorService;

    function errorEmit(message) {
      pubSubService.emit('error', message, event);
    }

    function errorAddListener(listener) {
      event = pubSubService.addListener('error', listener, event);
    }

    function errorRemoveListener(listener) {
      event = pubSubService.removeListener('error', listener, event);
    }

    function defaultErrorListener(_event_) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      console.error('APP ERROR ***', args);
    }
  }
})();
//# sourceMappingURL=error.js.map
