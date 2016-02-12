'use strict';

(function () {
  angular.module('clickApp.services').factory('stateGame', stateGameModelFactory);

  stateGameModelFactory.$inject = [
  // '$window',
  'games', 'game'];

  // 'gameBoard',
  // 'gameConnection',
  // 'gameFactions',
  // 'gameModels',
  // 'gameModelSelection',
  // 'gameScenario',
  // 'gameTerrains',
  // 'fileImport',
  // 'stateExports',
  // 'allCommands',
  // 'allTemplates',
  function stateGameModelFactory( // $window,
  gamesService, gameService) {
    // gameBoardService,
    // gameConnectionService,
    // gameFactionsService,
    // gameModelsService,
    // gameModelSelectionService,
    // gameScenarioService,
    // gameTerrainsService,
    // fileImportService,
    // stateExportsService
    // ) {
    var stateGameModel = {
      create: stateGamesCreate,
      save: stateGameSave,
      onGameLoad: stateGameOnLoad
    };
    // onGameConnectionClose: stateGameOnConnectionClose,
    // onGameCommandExecute: stateGameOnCommandExecute,
    // onGameCommandUndo: stateGameOnCommandUndo,
    // onGameCommandUndoLast: stateGameOnCommandUndoLast,
    // onGameCommandReplay: stateGameOnCommandReplay,
    // onGameCommandReplayBatch: stateGameOnCommandReplayBatch,
    // onGameSetCmds: stateGameOnSetCmds,
    // onGameSetPlayers: stateGameOnSetPlayers,
    // onGameNewChatMsg: stateGameOnNewChatMsg,
    // onGameUpdate: stateGameOnUpdate,
    // onGameInvitePlayer: stateGameOnInvitePlayer,
    // onGameModelCreate: stateGameOnModelCreate,
    // onGameModelImportList: stateGameOnModelImportList,
    // onGameModelImportFile: stateGameOnModelImportFile,
    // onGameTemplateCreate: stateGameOnModelCreate,
    // onGameTerrainCreate: stateGameOnTerrainCreate,
    // onGameTerrainReset: stateGameOnTerrainReset,
    // onGameBoardSet: stateGameOnBoardSet,
    // onGameBoardSetRandom: stateGameOnBoardSetRandom,
    // onGameBoardImportFile: stateGameOnBoardImportFile,
    // onGameScenarioSet: stateGameOnScenarioSet,
    // onGameScenarioSetRandom: stateGameOnScenarioSetRandom,
    // onGameScenarioGenerateObjectives: stateGameOnScenarioGenerateObjectives,
    var setGame$ = R.curry(setGame);
    // var gameActionError$ = R.curry(gameActionError);
    // var exportCurrentGame = stateExportsService
    //       .export$('game', R.prop('game'));
    // var exportCurrentBoard = stateExportsService
    //       .export$('board', exportBoardData);
    R.curryService(stateGameModel);
    return stateGameModel;

    function stateGamesCreate(state) {
      state.game = null;

      state.onEvent('Game.load', stateGameModel.onGameLoad$(state));
      // state.onEvent('Game.connection.close',
      //               stateGameModel.onGameConnectionClose$(state));
      // state.onEvent('Game.command.execute',
      //               stateGameModel.onGameCommandExecute$(state));
      // state.onEvent('Game.command.undo',
      //               stateGameModel.onGameCommandUndo$(state));
      // state.onEvent('Game.command.replay',
      //               stateGameModel.onGameCommandReplay$(state));
      // state.onEvent('Game.command.replayBatch',
      //               stateGameModel.onGameCommandReplayBatch$(state));
      // state.onEvent('Game.command.undoLast',
      //               stateGameModel.onGameCommandUndoLast$(state));
      // state.onEvent('Game.command.replayNext',
      //               stateGameModel.onGameCommandReplayNext$(state));
      // state.onEvent('Game.setCmds',
      //               stateGameModel.onGameSetCmds$(state));
      // state.onEvent('Game.setPlayers',
      //               stateGameModel.onGameSetPlayers$(state));
      // state.onEvent('Game.newChatMsg',
      //               stateGameModel.onGameNewChatMsg$(state));
      // state.onEvent('Game.update',
      //               stateGameModel.onGameUpdate$(state));
      // state.onEvent('Game.invitePlayer',
      //               stateGameModel.onGameInvitePlayer$(state));
      // state.onEvent('Game.model.create',
      //               stateGameModel.onGameModelCreate$(state));
      // state.onEvent('Game.model.copy',
      //               stateGameModel.onGameModelCopy$(state));
      // state.onEvent('Game.model.importList',
      //               stateGameModel.onGameModelImportList$(state));
      // state.onEvent('Game.model.importFile',
      //               stateGameModel.onGameModelImportFile$(state));
      // state.onEvent('Game.template.create',
      //               stateGameModel.onGameTemplateCreate$(state));
      // state.onEvent('Game.terrain.create',
      //               stateGameModel.onGameTerrainCreate$(state));
      // state.onEvent('Game.terrain.reset',
      //               stateGameModel.onGameTerrainReset$(state));
      // state.onEvent('Game.board.set',
      //               stateGameModel.onGameBoardSet$(state));
      // state.onEvent('Game.board.setRandom',
      //               stateGameModel.onGameBoardSetRandom$(state));
      // state.onEvent('Game.board.importFile',
      //               stateGameModel.onGameBoardImportFile$(state));
      // state.onEvent('Game.scenario.set',
      //               stateGameModel.onGameScenarioSet$(state));
      // state.onEvent('Game.scenario.setRandom',
      //               stateGameModel.onGameScenarioSetRandom$(state));
      // state.onEvent('Game.scenario.generateObjectives',
      //               stateGameModel.onGameScenarioGenerateObjectives$(state));

      return state;
    }
    function stateGameSave(state) {
      return R.thread()(R.always(saveCurrentGame(state))
      //   R.always(exportCurrentGame(state)),
      //   R.always(exportCurrentModelSelection(state)),
      //   R.always(exportCurrentBoard(state))
      );
    }
    function stateGameOnLoad(state, event, is_online, is_private, id) {
      return R.threadP(waitForDataReady())(loadStoredGameData, broadcast('Game.loading'), setGame$(state), resetModes, gameService.loadP$(state),
      // (game) => {
      //   return new self.Promise((resolve, reject) => {
      //     setTimeout(resolve, 3000);
      //   });
      // },
      broadcast('Game.loaded'),
      // connectOnlineGame,
      setGame$(state), broadcast('Game.load.success')).catch(onError);

      function waitForDataReady() {
        return self.Promise.all([state.data_ready, state.user_ready, state.games_ready]);
      }
      function loadStoredGameData() {
        return is_online ? gamesService.loadOnlineGame(is_private, id) : gamesService.loadLocalGameP(id, state.local_games);
      }
      function broadcast(event) {
        return function (game) {
          state.changeEventP(event);
          return game;
        };
      }
      function resetModes(game) {
        return state.eventP('Modes.reset').then(R.always(game));
      }
      // function connectOnlineGame(game) {
      //   if(!is_online) return game;

      //   return gameConnectionService
      //     .open$(R.path(['user','state','name'], state), state, game);
      // }
      function onError(error) {
        state.changeEventP('Game.load.error', error);
      }
    }
    // function stateGameOnConnectionClose(state, event) {
    //   event = event;
    //   return R.pipe(
    //     gameConnectionService.cleanup,
    //     setGame$(state)
    //   )(state.game);
    // }
    // function stateGameOnCommandExecute(state, event, cmd, args) {
    //   return R.pipeP(
    //     gameService.executeCommand$(cmd, args, state),
    //     setGame$(state)
    //   )(state.game).catch(gameActionError$(state));
    // }
    // function stateGameOnCommandUndo(state, event, cmd) {
    //   return R.pipeP(
    //     gameService.undoCommand$(cmd, state),
    //     setGame$(state)
    //   )(state.game);
    // }
    // function stateGameOnCommandUndoLast(state, event) {
    //   event = event;
    //   return R.pipeP(
    //     gameService.undoLastCommand$(state),
    //     setGame$(state)
    //   )(state.game).catch(gameActionError$(state));
    // }
    // function stateGameOnCommandReplay(state, event, cmd) {
    //   return R.pipeP(
    //     gameService.replayCommand$(cmd, state),
    //     setGame$(state)
    //   )(state.game);
    // }
    // function stateGameOnCommandReplayBatch(state, event, cmds) {
    //   return R.pipeP(
    //     gameService.replayCommandsBatch$(cmds, state),
    //     setGame$(state)
    //   )(state.game);
    // }
    // function stateGameOnCommandReplayNext(state, event) {
    //   event = event;
    //   return R.pipeP(
    //     gameService.replayNextCommand$(state),
    //     setGame$(state)
    //   )(state.game).catch(gameActionError$(state));
    // }
    // function stateGameOnSetCmds(state, event, set) {
    //   return R.pipe(
    //     R.assoc(set.where, set.cmds),
    //     setGame$(state)
    //   )(state.game);
    // }
    // function stateGameOnSetPlayers(state, event, players) {
    //   return R.pipe(
    //     R.assoc('players', players),
    //     setGame$(state)
    //   )(state.game);
    // }
    // function stateGameOnNewChatMsg(state, event, msg) {
    //   return R.pipe(
    //     R.over(R.lensProp('chat'),
    //            R.compose(R.append(msg.chat), R.defaultTo([]))),
    //     setGame$(state),
    //     () => { state.changeEvent('Game.chat'); }
    //   )(state.game);
    // }
    // function stateGameOnUpdate(state, event, lens, update) {
    //   return R.pipe(
    //     R.over(lens, update),
    //     setGame$(state)
    //   )(state.game);
    // }
    // function stateGameOnInvitePlayer(state, event, to) {
    //   var msg = [
    //     s.capitalize(R.pathOr('Unknown', ['user','state','name'], state)),
    //     'has invited you to join a game'
    //   ].join(' ');
    //   var link = $window.location.hash;
    //   console.log('Invite player', to, msg, link);

    //   return state.event('User.sendChatMsg',
    //                      { to: to, msg: msg, link: link });
    // }
    // function stateGameOnModelCreate(state, event, model_path, repeat = 1) {
    //   state.create = R.assoc('model', {
    //     base: { x: 240, y: 240, r: 0 },
    //     models: R.times((i) => {
    //       return {
    //         info: model_path,
    //         x: 20*i, y: 0, r: 0
    //       };
    //     }, repeat)
    //   }, R.defaultTo({}, state.create));
    //   return state.event('Modes.switchTo', 'CreateModel');
    // }
    // function stateGameOnModelCopy(state, event, create) {
    //   state.create = R.assoc('model', create, state.create);
    //   return state.event('Modes.switchTo', 'CreateModel');
    // }
    // function stateGameOnModelImportList(state, event, list) {
    //   let user = R.pathOr('Unknown', ['user','state','name'], state);
    //   state.create = R.assoc(
    //     'model',
    //     gameFactionsService
    //       .buildModelsList(list, user, state.factions.references),
    //     state.create
    //   );
    //   console.info('doImportList', list, state.create.model);
    //   return state.event('Modes.switchTo', 'CreateModel');
    // }
    // function stateGameOnModelImportFile(state, event, file) {
    //   return R.pipeP(
    //     fileImportService.read$('json'),
    //     (create) => {
    //       state.create = R.assoc('model', create, state.create);
    //       return state.event('Modes.switchTo', 'CreateModel');
    //     }
    //   )(file).catch(gameActionError$(state));
    // }
    // function stateGameOnModelCreate(state, event, type) {
    //   state.create = R.assoc('template', {
    //     base: { x: 240, y: 240, r: 0 },
    //     templates: [ { type: type, x: 0, y: 0, r: 0 } ]
    //   }, R.defaultTo({}, state.create));
    //   return state.event('Modes.switchTo', 'CreateTemplate');
    // }
    // function stateGameOnTerrainCreate(state, event, path) {
    //   state.create = R.assoc('terrain', {
    //     base: { x: 240, y: 240, r: 0 },
    //     terrains: [ {
    //       info: path,
    //       x: 0, y: 0, r: 0
    //     } ]
    //   }, R.defaultTo({}, state.create));
    //   return state.event('Modes.switchTo', 'CreateTerrain');
    // }
    // function stateGameOnTerrainReset(state, event) {
    //   event = event;
    //   return R.pipePromise(
    //     () => {
    //       return gameTerrainsService.all(state.game.terrains);
    //     },
    //     R.pluck('state'),
    //     R.pluck('stamp'),
    //     (stamps) => {
    //       return state.event('Game.command.execute',
    //                          'deleteTerrain', [stamps]);
    //     }
    //   )().catch(gameActionError$(state));
    // }
    // function stateGameOnBoardSet(state, event, name) {
    //   let board = gameBoardService.forName(name, state.boards);
    //   return state.event('Game.command.execute',
    //                      'setBoard', [board]);
    // }
    // function stateGameOnBoardSetRandom(state, event) {
    //   event = event;
    //   let board, name = gameBoardService.name(state.game.board);
    //   while(name === gameBoardService.name(state.game.board)) {
    //     board = state.boards[R.randomRange(0, state.boards.length-1)];
    //     name = gameBoardService.name(board);
    //   }
    //   return state.event('Game.command.execute',
    //                      'setBoard', [board]);
    // }
    // function stateGameOnBoardImportFile(state, event, file) {
    //   return R.pipeP(
    //     fileImportService.read$('json'),
    //     (board_info) => {
    //       return R.pipePromise(
    //         () => {
    //           if(!board_info.board) return self.Promise.reject();

    //           return state.event('Game.command.execute',
    //                              'setBoard', [board_info.board]);
    //         },
    //         () => {
    //           if(R.isEmpty(R.pathOr([], ['terrain','terrains'], board_info))) {
    //             return self.Promise.reject();
    //           }

    //           return state.event('Game.terrain.reset');
    //         },
    //         () => {
    //           return state.event('Game.command.execute',
    //                              'createTerrain', [board_info.terrain, false]);
    //         }
    //       )();
    //     }
    //   )(file).catch(R.always(null));
    // }
    // function stateGameOnScenarioSet(state, event, name, group) {
    //   let scenario = gameScenarioService.forName(name, group);
    //   return state.event('Game.command.execute',
    //                      'setScenario', [scenario]);
    // }
    // function stateGameOnScenarioSetRandom(state, event) {
    //   event = event;
    //   var group = gameScenarioService.group('SR15', state.scenarios);
    //   var scenario, name = gameScenarioService.name(state.game.scenario);
    //   while(name === gameScenarioService.name(state.game.scenario)) {
    //     scenario = group[1][R.randomRange(0, group[1].length-1)];
    //     name = gameScenarioService.name(scenario);
    //   }
    //   return state.event('Game.command.execute',
    //                      'setScenario', [scenario]);
    // }
    // function stateGameOnScenarioGenerateObjectives(state, event) {
    //   event = event;
    //   return R.pipePromise(
    //     () => {
    //       return gameModelsService.all(state.game.models);
    //     },
    //     R.filter(R.pipe(
    //       R.path(['state','info']),
    //       R.head,
    //       R.equals('scenario')
    //     )),
    //     R.map(R.path(['state','stamp'])),
    //     (stamps) => {
    //       return state.event('Game.command.execute',
    //                          'deleteModel', [stamps]);
    //     },
    //     () => {
    //       return gameScenarioService
    //         .createObjectives(state.game.scenario);
    //     },
    //     (objectives) => {
    //       var is_flipped = R.path(['ui_state','flip_map'], state);
    //       return state.event('Game.command.execute',
    //                          'createModel', [objectives, is_flipped]);
    //     }
    //   )();
    // }
    function setGame(state, game) {
      state.game = game;
      console.log('stateGame', state.game);
      state.queueChangeEventP('Game.change');
      return game;
    }
    // function gameActionError(state, error) {
    //   state.changeEvent('Game.action.error', error);
    //   return null;
    //   // return self.Promise.reject(error);
    // }
    // function saveCurrentGame(state) {
    //   if(state._game === state.game) return null;
    //   state._game = state.game;

    //   if(R.isNil(R.path(['game','local_stamp'], state))) return null;
    //   return R.pipePromise(
    //     R.always(state.local_games),
    //     gamesService.updateLocalGame$(state.game),
    //     (games) => {
    //       state.local_games = games;
    //       console.log('stateSetLocalGames', state.local_games);
    //       state.changeEvent('Games.local.change');
    //     }
    //   )();
    // }
    // function exportCurrentModelSelection(state) {
    //   return stateExportsService
    //     .export('models', R.pipePromise(
    //       R.path(['game','model_selection']),
    //       stateExportsService.rejectIf$(R.isNil),
    //       gameModelSelectionService.get$('local'),
    //       stateExportsService.rejectIf$(R.isEmpty),
    //       (stamps) => {
    //         return gameModelsService
    //           .copyStamps(stamps, R.path(['game', 'models'], state));
    //       },
    //       stateExportsService.rejectIf$(R.isEmpty)
    //     ), state);
    // }
    // function exportBoardData(state) {
    //   return R.threadP(state)(
    //     R.prop('game'),
    //     stateExportsService.rejectIf$(R.isNil),
    //     (game) => {
    //       return {
    //         board: game.board,
    //         terrain: {
    //           base: { x: 0, y: 0, r: 0 },
    //           terrains: R.pipe(
    //             gameTerrainsService.all,
    //             R.pluck('state'),
    //             R.map(R.pick(['x','y','r','info','lk']))
    //           )(game.terrains)
    //         }
    //       };
    //     }
    //   );
    // }
  }
})();
//# sourceMappingURL=game.js.map