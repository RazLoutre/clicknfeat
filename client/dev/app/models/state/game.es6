(function() {
  angular.module('clickApp.services')
    .factory('stateGame', stateGameModelFactory);

  stateGameModelFactory.$inject = [
    'games',
    'game',
    'gameBoard',
    'gameConnection',
    'gameFactions',
    'gameModels',
    'gameModelSelection',
    'gameScenario',
    'gameTerrains',
    'gameTemplates',
    'gameTemplateSelection',
    'fileImport',
    'stateExports',
    'allCommands',
    'allTemplates',
  ];
  function stateGameModelFactory(gamesModel,
                                 gameModel,
                                 gameBoardModel,
                                 gameConnectionModel,
                                 gameFactionsModel,
                                 gameModelsModel,
                                 gameModelSelectionModel,
                                 gameScenarioModel,
                                 gameTerrainsModel,
                                 gameTemplatesModel,
                                 gameTemplateSelectionModel,
                                 fileImportService,
                                 stateExportsModel) {
    const stateGameModel = {
      create: stateGamesCreate,
      save: stateGameSave,
      onGameLoad: stateGameOnLoad,
      onGameConnectionClose: stateGameOnConnectionClose,
      onGameCommandExecute: stateGameOnCommandExecute,
      onGameCommandUndo: stateGameOnCommandUndo,
      onGameCommandUndoLast: stateGameOnCommandUndoLast,
      onGameCommandReplay: stateGameOnCommandReplay,
      onGameCommandReplayNext: stateGameOnCommandReplayNext,
      onGameCommandReplayBatch: stateGameOnCommandReplayBatch,
      onGameSetCmds: stateGameOnSetCmds,
      onGameSetPlayers: stateGameOnSetPlayers,
      onGameNewChatMsg: stateGameOnNewChatMsg,
      onGameUpdate: stateGameOnUpdate,
      onGameInvitePlayer: stateGameOnInvitePlayer,
      onGameModelCreate: stateGameOnModelCreate,
      onGameModelCopy: stateGameOnModelCopy,
      onGameModelImportList: stateGameOnModelImportList,
      onGameModelImportFile: stateGameOnModelImportFile,
      onGameModelSelectionLocalChange: stateGameOnModelSelectionLocalChange,
      onGameTemplateCreate: stateGameOnTemplateCreate,
      onGameTemplateSelectionLocalChange: stateGameOnTemplateSelectionLocalChange,
      onGameTerrainCreate: stateGameOnTerrainCreate,
      onGameTerrainReset: stateGameOnTerrainReset,
      onGameBoardSet: stateGameOnBoardSet,
      onGameBoardSetRandom: stateGameOnBoardSetRandom,
      onGameBoardImportFile: stateGameOnBoardImportFile,
      onGameScenarioSet: stateGameOnScenarioSet,
      onGameScenarioSetRandom: stateGameOnScenarioSetRandom,
      onGameScenarioRefresh: stateGameOnScenarioRefresh,
      // onGameScenarioGenerateObjectives: stateGameOnScenarioGenerateObjectives,
    };

    const setGame$ = R.curry(setGame);
    const exportCurrentGame = stateExportsModel
            .exportP$('game', R.prop('game'));
    const exportCurrentBoard = stateExportsModel
            .exportP$('board', exportBoardData);

    R.curryService(stateGameModel);
    return stateGameModel;

    function stateGamesCreate(state) {
      state.game = null;

      state.onEvent('Game.load',
                    stateGameModel.onGameLoad$(state));
      state.onEvent('Game.connection.close',
                    stateGameModel.onGameConnectionClose$(state));
      state.onEvent('Game.command.execute',
                    stateGameModel.onGameCommandExecute$(state));
      state.onEvent('Game.command.undo',
                    stateGameModel.onGameCommandUndo$(state));
      state.onEvent('Game.command.replay',
                    stateGameModel.onGameCommandReplay$(state));
      state.onEvent('Game.command.replayBatch',
                    stateGameModel.onGameCommandReplayBatch$(state));
      state.onEvent('Game.command.undoLast',
                    stateGameModel.onGameCommandUndoLast$(state));
      state.onEvent('Game.command.replayNext',
                    stateGameModel.onGameCommandReplayNext$(state));
      state.onEvent('Game.setCmds',
                    stateGameModel.onGameSetCmds$(state));
      state.onEvent('Game.setPlayers',
                    stateGameModel.onGameSetPlayers$(state));
      state.onEvent('Game.newChatMsg',
                    stateGameModel.onGameNewChatMsg$(state));
      state.onEvent('Game.update',
                    stateGameModel.onGameUpdate$(state));
      state.onEvent('Game.invitePlayer',
                    stateGameModel.onGameInvitePlayer$(state));
      state.onEvent('Game.model.create',
                    stateGameModel.onGameModelCreate$(state));
      state.onEvent('Game.model.copy',
                    stateGameModel.onGameModelCopy$(state));
      state.onEvent('Game.model.importList',
                    stateGameModel.onGameModelImportList$(state));
      state.onEvent('Game.model.importFile',
                    stateGameModel.onGameModelImportFile$(state));
      state.onChangeEvent('Game.model.selection.local.change',
                          stateGameModel.onGameModelSelectionLocalChange$(state));
      state.onEvent('Game.template.create',
                    stateGameModel.onGameTemplateCreate$(state));
      state.onChangeEvent('Game.template.selection.local.change',
                          stateGameModel.onGameTemplateSelectionLocalChange$(state));
      state.onEvent('Game.terrain.create',
                    stateGameModel.onGameTerrainCreate$(state));
      state.onEvent('Game.terrain.reset',
                    stateGameModel.onGameTerrainReset$(state));
      state.onEvent('Game.board.set',
                    stateGameModel.onGameBoardSet$(state));
      state.onEvent('Game.board.setRandom',
                    stateGameModel.onGameBoardSetRandom$(state));
      state.onEvent('Game.board.importFile',
                    stateGameModel.onGameBoardImportFile$(state));
      state.onEvent('Game.scenario.set',
                    stateGameModel.onGameScenarioSet$(state));
      state.onEvent('Game.scenario.setRandom',
                    stateGameModel.onGameScenarioSetRandom$(state));
      state.onEvent('Game.scenario.refresh',
                    stateGameModel.onGameScenarioRefresh$(state));
      // state.onEvent('Game.scenario.generateObjectives',
      //               stateGameModel.onGameScenarioGenerateObjectives$(state));

      return state;
    }
    function stateGameSave(state) {
      return R.thread()(
        () => saveCurrentGame(state),
        () => exportCurrentGame(state),
        () => exportCurrentModelSelectionP(state),
        () => exportCurrentBoard(state)
      );
    }
    function stateGameOnLoad(state, _event_, is_online, is_private, id) {
      return R.threadP(waitForDataReady())(
        loadStoredGameDataP,
        broadcast('Game.loading'),
        setGame$(state),
        resetModes,
        gameModel.loadP$(state),
        // (game) => {
        //   return new self.Promise((resolve, reject) => {
        //     setTimeout(resolve, 3000);
        //   });
        // },
        R.tap(() => { state.queueChangeEventP('Game.loaded'); }),
        connectOnlineGame,
        setGame$(state),
        broadcast('Game.load.success')
      ).catch(onError);

      function waitForDataReady() {
        return R.promiseAll([
          state.data_ready,
          state.user_ready,
          state.games_ready
        ]);
      }
      function loadStoredGameDataP() {
        return ( is_online
                 ? gamesModel.loadOnlineGameP(is_private, id)
                 : gamesModel.loadLocalGameP(id, state.local_games)
               );
      }
      function broadcast(event) {
        return R.tap(() => {
          state.changeEventP(event);
        });
      }
      function resetModes(game) {
        return state.eventP('Modes.reset')
          .then(R.always(game));
      }
      function connectOnlineGame(game) {
        return R.when(
          () => is_online,
          gameConnectionModel
            .openP$(R.path(['user','state','name'], state), state),
          game
        );
      }
      function onError(error) {
        state.changeEventP('Game.load.error', error);
      }
    }
    function stateGameOnConnectionClose(state, _event_) {
      return R.thread(state.game)(
        gameConnectionModel.cleanup,
        setGame$(state)
      );
    }
    function stateGameOnCommandExecute(state, _event_, cmd, args) {
      return R.threadP(state.game)(
        gameModel.executeCommandP$(cmd, args, state),
        setGame$(state)
      ).catch(gameModel.actionError$(state));
    }
    function stateGameOnCommandUndo(state, _event_, cmd) {
      return R.threadP(state.game)(
        gameModel.undoCommandP$(cmd, state),
        setGame$(state)
      ).catch(gameModel.actionError$(state));
    }
    function stateGameOnCommandUndoLast(state, _event_) {
      return R.threadP(state.game)(
        gameModel.undoLastCommandP$(state),
        setGame$(state)
      ).catch(gameModel.actionError$(state));
    }
    function stateGameOnCommandReplay(state, _event_, cmd) {
      return R.threadP(state.game)(
        gameModel.replayCommandP$(cmd, state),
        setGame$(state)
      ).catch(gameModel.actionError$(state));
    }
    function stateGameOnCommandReplayBatch(state, _event_, cmds) {
      return R.threadP(state.game)(
        gameModel.replayCommandsBatchP$(cmds, state),
        setGame$(state)
      ).catch(gameModel.actionError$(state));
    }
    function stateGameOnCommandReplayNext(state, _event_) {
      return R.threadP(state.game)(
        gameModel.replayNextCommandP$(state),
        setGame$(state)
      ).catch(gameModel.actionError$(state));
    }
    function stateGameOnSetCmds(state, _event_, set) {
      return R.thread(state.game)(
        R.assoc(set.where, set.cmds),
        R.when(
          () => (set.where = 'chat'),
          R.tap(() => { state.queueChangeEventP('Game.chat'); })
        ),
        setGame$(state)
      );
    }
    function stateGameOnSetPlayers(state, _event_, players) {
      return R.thread(state.game)(
        R.assoc('players', players),
        R.tap(() => { state.queueChangeEventP('Game.players.change'); }),
        setGame$(state)
      );
    }
    function stateGameOnNewChatMsg(state, _event_, msg) {
      return R.thread(state.game)(
        R.over(R.lensProp('chat'),
               R.compose(R.append(msg.chat), R.defaultTo([]))),
        setGame$(state),
        () => { state.queueChangeEventP('Game.chat', msg.chat); }
      );
    }
    function stateGameOnUpdate(state, _event_, lens, update) {
      return R.thread(state.game)(
        R.over(lens, update),
        setGame$(state)
      );
    }
    function stateGameOnInvitePlayer(state, _event_, to) {
      const msg = [
        s.capitalize(R.pathOr('Unknown', ['user','state','name'], state)),
        'has invited you to join a game'
      ].join(' ');
      const link = self.window.location.hash;
      console.log('Invite player', to, msg, link);

      return state.eventP('User.sendChatMsg',
                          { to: [to], msg: msg, link: link });
    }
    function stateGameOnModelCreate(state, _event_, model_path, repeat = 1) {
      state.create = {
        base: { x: 240, y: 240, r: 0 },
        models: R.times((i) => ({
          info: model_path,
          x: 20*i, y: 0, r: 0
        }), repeat)
      };
      return state.eventP('Modes.switchTo', 'CreateModel');
    }
    function stateGameOnModelCopy(state, _event_, create) {
      state.create = create;
      return state.eventP('Modes.switchTo', 'CreateModel');
    }
    function stateGameOnModelImportList(state, _event_, list) {
      const user = R.pathOr('Unknown', ['user','state','name'], state);
      state.create = gameFactionsModel
        .buildModelsList(list, user, state.factions.references);
      console.info('doImportList', list, state.create);
      return state.eventP('Modes.switchTo', 'CreateModel');
    }
    function stateGameOnModelImportFile(state, _event_, file) {
      return R.threadP(file)(
        fileImportService.readP$('json'),
        (create) => {
          state.create = create;
          return state.eventP('Modes.switchTo', 'CreateModel');
        }
      ).catch(gameModel.actionError$(state));
    }
    function stateGameOnModelSelectionLocalChange(state, _event_) {
      // console.warn('onModelSelectionLocalChange', arguments);
      const local_model_selection = gameModelSelectionModel
              .get('local', state.game.model_selection);
      const length = R.length(local_model_selection);
      const previous_selection = R.path(['_model_selection_listener','stamp'], state);
      if(length === 1 &&
         local_model_selection[0] === previous_selection) {
        return;
      }
      cleanupModelSelectionListener(state);
      if(length === 1) {
        setupModelSelectionListener(local_model_selection[0], state);
      }
      else {
        state.queueChangeEventP('Game.model.selection.local.updateSingle',
                                null, null);
      }
    }
    function setupModelSelectionListener(stamp, state) {
      // console.warn('setupModelSelectionListener', arguments);
      state._model_selection_listener = {
        stamp: stamp,
        unsubscribe: state
          .onChangeEvent(`Game.model.change.${stamp}`,
                         onModelSelectionChange(stamp, state))
      };
    }
    function onModelSelectionChange(stamp, state) {
      return () => {
        // console.warn('onModelSelectionChange', arguments);
        return R.threadP(state.game)(
          R.prop('models'),
          gameModelsModel.findStampP$(stamp),
          (model) => {
            state.queueChangeEventP('Game.model.selection.local.updateSingle',
                                    stamp, model);
          }
        );
      };
    }
    function cleanupModelSelectionListener(state) {
      // console.warn('cleanupModelSelectionListener', arguments);
      const unsubscribe = R.thread(state)(
        R.path(['_model_selection_listener','unsubscribe']),
        R.defaultTo(() => {})
      );
      unsubscribe();
      state._model_selection_listener = {};
    }
    function stateGameOnTemplateCreate(state, _event_, type) {
      state.create = {
        base: { x: 240, y: 240, r: 0 },
        templates: [ { type: type, x: 0, y: 0, r: 0 } ]
      };
      return state.eventP('Modes.switchTo', 'CreateTemplate');
    }
    function stateGameOnTemplateSelectionLocalChange(state, _event_) {
      console.warn('onTemplateSelectionLocalChange', arguments);
      const local_template_selection = gameTemplateSelectionModel
              .get('local', state.game.template_selection);
      const length = R.length(local_template_selection);
      const previous_selection =
              R.path(['_template_selection_listener','stamp'], state);
      if(length === 1 &&
         local_template_selection[0] === previous_selection) {
        return;
      }
      cleanupTemplateSelectionListener(state);
      if(length === 1) {
        setupTemplateSelectionListener(local_template_selection[0], state);
      }
      else {
        state.queueChangeEventP('Game.template.selection.local.updateSingle',
                                null, null);
      }
    }
    function setupTemplateSelectionListener(stamp, state) {
      console.warn('setupTemplateSelectionListener', arguments);
      state._template_selection_listener = {
        stamp: stamp,
        unsubscribe: state
          .onChangeEvent(`Game.template.change.${stamp}`,
                         onTemplateSelectionChange(stamp, state))
      };
    }
    function onTemplateSelectionChange(stamp, state) {
      return () => {
        console.warn('onTemplateSelectionChange', arguments);
        return R.threadP(state.game)(
          R.prop('templates'),
          gameTemplatesModel.findStampP$(stamp),
          (template) => {
            state.queueChangeEventP('Game.template.selection.local.updateSingle',
                                    stamp, template);
          }
        );
      };
    }
    function cleanupTemplateSelectionListener(state) {
      console.warn('cleanupTemplateSelectionListener', arguments);
      const unsubscribe = R.thread(state)(
        R.path(['_template_selection_listener','unsubscribe']),
        R.defaultTo(() => {})
      );
      unsubscribe();
      state._template_selection_listener = {};
    }
    function stateGameOnTerrainCreate(state, _event_, path) {
      state.create = {
        base: { x: 240, y: 240, r: 0 },
        terrains: [ {
          info: path,
          x: 0, y: 0, r: 0
        } ]
      };
      return state.eventP('Modes.switchTo', 'CreateTerrain');
    }
    function stateGameOnTerrainReset(state, _event_) {
      return R.threadP(state.game)(
        R.prop('terrains'),
        gameTerrainsModel.all,
        R.pluck('state'),
        R.pluck('stamp'),
        (stamps) => state.eventP('Game.command.execute',
                                 'deleteTerrain', [stamps])
      ).catch(gameModel.actionError$(state));
    }
    function stateGameOnBoardSet(state, _event_, name) {
      let board = gameBoardModel.forName(name, state.boards);
      return state.eventP('Game.command.execute',
                          'setBoard', [board]);
    }
    function stateGameOnBoardSetRandom(state, _event_) {
      let board, name = gameBoardModel.name(state.game.board);
      while(name === gameBoardModel.name(state.game.board)) {
        board = state.boards[R.randomRange(0, state.boards.length-1)];
        name = gameBoardModel.name(board);
      }
      return state.eventP('Game.command.execute',
                          'setBoard', [board]);
    }
    function stateGameOnBoardImportFile(state, _event_, file) {
      return R.threadP(file)(
        fileImportService.readP$('json'),
        (data) => R.threadP(data)(
          R.prop('board'),
          R.rejectIf(R.isNil, 'No board'),
          () => state.eventP('Game.command.execute',
                             'setBoard', [data.board]),
          R.always(data),
          R.path(['terrain', 'terrains']),
          R.rejectIf(R.isEmpty, 'No terrain'),
          () => state.eventP('Game.terrain.reset'),
          () => state.eventP('Game.command.execute',
                             'createTerrain', [data.terrain, false])
        )
      ).catch(R.spyAndDiscardError('Import board file'));
    }
    function stateGameOnScenarioSet(state, _event_, name, group) {
      const scenario = gameScenarioModel.forName(name, group);
      return state.eventP('Game.command.execute',
                          'setScenario', [scenario]);
    }
    function stateGameOnScenarioSetRandom(state, _event_) {
      const group = gameScenarioModel.group('SR15', state.scenarios);
      let scenario, name = gameScenarioModel.name(state.game.scenario);
      while(name === gameScenarioModel.name(state.game.scenario)) {
        scenario = group[1][R.randomRange(0, group[1].length-1)];
        name = gameScenarioModel.name(scenario);
      }
      return state.eventP('Game.command.execute',
                          'setScenario', [scenario]);
    }
    function stateGameOnScenarioRefresh(state, _event_) {
      state.queueChangeEventP('Game.scenario.refresh');
    }
    // function stateGameOnScenarioGenerateObjectives(state, _event_) {
    //   event = event;
    //   return R.pipePromise(
    //     () => {
    //       return gameModelsModel.all(state.game.models);
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
    //       return gameScenarioModel
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
    function saveCurrentGame(state) {
      if(state._game === state.game) return null;
      state._game = state.game;

      if(R.isNil(R.path(['game','local_stamp'], state))) {
        return null;
      }
      return R.thread(state.local_games)(
        gamesModel.updateLocalGame$(state.game),
        (games) => {
          state.local_games = games;
          console.log('stateSetLocalGames', state.local_games);
          state.queueChangeEventP('Games.local.change');
        }
      );
    }
    function exportCurrentModelSelectionP(state) {
      return stateExportsModel
        .exportP('models', (state) => R.threadP(state)(
          R.path(['game','model_selection']),
          R.rejectIf(R.isNil, 'selection is nil'),
          gameModelSelectionModel.get$('local'),
          R.rejectIf(R.isEmpty, 'selection is empty'),
          (stamps) => gameModelsModel
            .copyStampsP(stamps, R.path(['game', 'models'], state)),
          R.rejectIf(R.isEmpty, 'selection models not found')
        ), state);
    }
    function exportBoardData(state) {
      return R.thread(state)(
        R.prop('game'),
        (game) => ({
          board: game.board,
          terrain: {
            base: { x: 0, y: 0, r: 0 },
            terrains: R.thread(game.terrains)(
              gameTerrainsModel.all,
              R.pluck('state'),
              R.map(R.pick(['x','y','r','info','lk']))
            )
          }
        })
      );
    }
  }
})();
