'use strict';

(function () {
  angular.module('clickApp.services').factory('stateGames', stateGamesModelFactory);

  stateGamesModelFactory.$inject = ['game', 'games', 'fileImport'];
  function stateGamesModelFactory(gameModel, gamesModel, fileImportService) {
    var stateGamesService = {
      create: stateGamesCreate,
      save: stateGamesSave,
      onStateInit: stateGamesOnInit,
      onGamesLocalCreate: stateGamesOnLocalCreate,
      onGamesLocalLoad: stateOnGamesLocalLoad,
      onGamesLocalLoadFile: stateOnGamesLocalLoadFile,
      onGamesLocalDelete: stateOnGamesLocalDelete,
      loadNewLocalGame: loadNewLocalGame
    };
    var setLocalGames$ = R.curry(setLocalGames);
    var loadNewLocalGame$ = R.curry(loadNewLocalGame);

    R.curryService(stateGamesService);
    return stateGamesService;

    function stateGamesCreate(state) {
      state.local_games = {};
      state.games_ready = new self.Promise(function (resolve) {
        state.onEvent('State.init', stateGamesService.onStateInit$(state, resolve));
      });

      state.onEvent('Games.local.create', stateGamesService.onGamesLocalCreate$(state));
      state.onEvent('Games.local.load', stateGamesService.onGamesLocalLoad$(state));
      state.onEvent('Games.local.loadFile', stateGamesService.onGamesLocalLoadFile$(state));
      state.onEvent('Games.local.delete', stateGamesService.onGamesLocalDelete$(state));

      return state;
    }
    function stateGamesSave(state) {
      return state;
    }
    function stateGamesOnInit(state, ready, _event_) {
      return R.threadP()(gamesModel.loadLocalGamesP, setLocalGames$(state), ready);
    }
    function stateGamesOnLocalCreate(state, _event_) {
      return R.thread(state.user.state)(gameModel.create, loadNewLocalGame$(state));
    }
    function stateOnGamesLocalLoad(state, _event_, index) {
      state.queueChangeEventP('Games.local.load', index);
    }
    function stateOnGamesLocalLoadFile(state, _event_, file) {
      return R.threadP(file)(fileImportService.readP$('json'), stateGamesService.loadNewLocalGame$(state));
    }
    function stateOnGamesLocalDelete(state, _event_, id) {
      return R.thread(state.local_games)(gamesModel.removeLocalGame$(id), setLocalGames$(state));
    }
    function setLocalGames(state, games) {
      state.local_games = games;
      console.log('stateSetLocalGames', state.local_games);
      state.queueChangeEventP('Games.local.change');
    }
    function loadNewLocalGame(state, game) {
      return R.thread(state.local_games)(gamesModel.newLocalGame$(game), setLocalGames$(state), function () {
        state.queueChangeEventP('Games.local.load', R.prop('local_stamp', R.last(state.local_games)));
      });
    }
  }
})();
//# sourceMappingURL=games.js.map
