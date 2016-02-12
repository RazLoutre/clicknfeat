(function() {
  angular.module('clickApp.services')
    .factory('commands', commandsModelFactory)
    .factory('allCommands', [
      // 'createModelCommand',
      // 'deconsteModelCommand',
      // 'setModelSelectionCommand',
      // 'lockModelsCommand',
      // 'onModelsCommand',
      // 'createTemplateCommand',
      // 'deconsteTemplatesCommand',
      // 'lockTemplatesCommand',
      // 'onTemplatesCommand',
      // 'createTerrainCommand',
      // 'deconsteTerrainCommand',
      // 'lockTerrainsCommand',
      // 'onTerrainsCommand',
      // 'rollDiceCommand',
      // 'rollDeviationCommand',
      // 'setBoardCommand',
      'setLayersCommand',
      // 'setLosCommand',
      // 'setRulerCommand',
      // 'setScenarioCommand',
      () => ({ })
    ]);

  commandsModelFactory.$inject = [];
  function commandsModelFactory() {
    const CMDS_REG = {};
    const commandsModel = {
      registerCommand: commandsRegister,
      executeP: commandsExecuteP,
      // undoP: commandsUndoP,
      replayP: commandsReplayP,
      replayBatchP: commandsReplayBatchP
    };
    R.curryService(commandsModel);
    return commandsModel;

    function commandsRegister(name, command) {
      console.log('register command', name, command);
      CMDS_REG[name] = command;
    }
    function commandsExecuteP(name, args, state, game) {
      return R.threadP(CMDS_REG)(
        R.prop(name),
        R.rejectIf(R.isNil, `Game: execute unknown command "${name}"`),
        (cmd) => {
          return cmd.executeP
            .apply(null, [...args, state, game]);
        },
        updateCommandType
      );

      function updateCommandType([ctxt, game]) {
        return [ R.assoc('type', name, ctxt),
                 game
               ];
      }
    }
    // function commandsUndoP(ctxt, state, game) {
    //   return R.pipePromise(
    //     R.prop(ctxt.type),
    //     R.rejectIf(R.isNil, `undo unknown command "${ctxt.type}"`),
    //     (cmd) => {
    //       return cmd.undo(ctxt, state, game);
    //     }
    //   )(CMD_REGS);
    // }
    function commandsReplayP(ctxt, state, game) {
      return R.threadP(findCmdType())(
        R.rejectIf(R.isNil, `Game: replay unknown command "${ctxt.type}"`),
        (cmd) => {
          return cmd.replayP(ctxt, state, game);
        }
      );

      function findCmdType() {
        return R.prop(ctxt.type, CMDS_REG);
      }
    }
    function commandsReplayBatchP(commands, state, game) {
      if(R.isEmpty(commands)) {
        return self.Promise.resolve(game);
      }
      return R.threadP(game)(
        replayNextCommand,
        recurP
      );

      function replayNextCommand(game) {
        return commandsModel.replayP(commands[0], state, game)
          .catch(R.always(game));
      }
      function recurP(game) {
        return commandsReplayBatchP(R.tail(commands), state, game);
      }
    }
  }
})();
