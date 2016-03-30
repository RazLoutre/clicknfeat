'use strict';

(function () {
  angular.module('clickApp.services').factory('gameConnection', gameConnectionModelFactory);

  gameConnectionModelFactory.$inject = ['websocket'];
  function gameConnectionModelFactory(websocketModel) {
    var gameConnectionModel = {
      create: gameConnectionCreate,
      openP: gameConnectionOpenP,
      close: gameConnectionClose,
      cleanup: gameConnectionCleanup,
      active: gameConnectionActive,
      sendReplayCommandP: gameConnectionSendReplayCommandP,
      sendUndoCommandP: gameConnectionSendUndoCommandP,
      sendEventP: gameConnectionSendEventP
    };
    var replayCmdHandler$ = R.curry(replayCmdHandler);
    var undoCmdHandler$ = R.curry(undoCmdHandler);
    var cmdBatchHandler$ = R.curry(cmdBatchHandler);
    var chatHandler$ = R.curry(chatHandler);
    var setCmdsHandler$ = R.curry(setCmdsHandler);
    var playersHandler$ = R.curry(playersHandler);

    R.curryService(gameConnectionModel);
    return gameConnectionModel;

    function gameConnectionCreate(game) {
      var connection = {
        state: { socket: null }
      };
      return R.assoc('connection', connection, game);
    }
    function gameConnectionOpenP(user_name, state, game) {
      if (gameConnectionModel.active(game)) {
        return R.resolveP(game);
      }
      user_name = s.trim(user_name);
      var handlers = {
        close: closeHandler$(state),
        chat: chatHandler$(state),
        replayCmd: replayCmdHandler$(state),
        undoCmd: undoCmdHandler$(state),
        cmdBatch: cmdBatchHandler$(state),
        setCmds: setCmdsHandler$(state),
        players: playersHandler$(state)
      };

      game = R.assocPath(['connection', 'state', 'socket'], null, game);
      var url = ['/api/games', R.prop('private_stamp', game) ? 'private' : 'public', R.prop('private_stamp', game) ? R.prop('private_stamp', game) : R.prop('public_stamp', game)].join('/');
      url += '?name=' + user_name;

      return R.threadP()(function () {
        return websocketModel.createP(url, 'game', handlers);
      }, function (socket) {
        return R.assocPath(['connection', 'state', 'socket'], socket, game);
      });
    }
    function gameConnectionClose(game) {
      if (gameConnectionModel.active(game)) {
        websocketModel.close(game.connection.state.socket);
      }
      return gameConnectionModel.cleanup(game);
    }
    function gameConnectionCleanup(game) {
      return R.assocPath(['connection', 'state', 'socket'], null, game);
    }
    function gameConnectionActive(game) {
      return R.thread(game)(R.path(['connection', 'state', 'socket']), R.exists);
    }
    function gameConnectionSendReplayCommandP(command, game) {
      return R.threadP(game)(gameConnectionModel.sendEventP$({
        type: 'replayCmd',
        cmd: command
      }), R.over(R.lensProp('commands_log'), R.compose(R.append(command), R.defaultTo([]))));
    }
    function gameConnectionSendUndoCommandP(command, game) {
      return R.threadP(game)(gameConnectionModel.sendEventP$({
        type: 'undoCmd',
        cmd: command
      }), R.over(R.lensProp('undo_log'), R.compose(R.append(command), R.defaultTo([]))));
    }
    function gameConnectionSendEventP(event, game) {
      return R.threadP(game)(R.rejectIfP(R.complement(gameConnectionModel.active), 'Not active'), function () {
        return websocketModel.send(event, game.connection.state.socket);
      }, R.always(game));
    }
    function closeHandler$(state) {
      return function () {
        console.error('Game connection: close');
        state.queueEventP('Game.connection.close');
      };
    }
    function replayCmdHandler(state, msg) {
      console.log('Game connection: replayCmd', msg);
      state.queueEventP('Game.command.replay', msg.cmd);
    }
    function undoCmdHandler(state, msg) {
      console.log('Game connection: undoCmd', msg);
      state.queueEventP('Game.command.undo', msg.cmd);
    }
    function cmdBatchHandler(state, msg) {
      console.log('Game connection: cmdBatch', msg);
      state.queueEventP('Game.command.replayBatch', msg.cmds);
    }
    function chatHandler(state, msg) {
      console.log('Game connection: chat msg', msg);
      state.queueEventP('Game.newChatMsg', msg);
    }
    function setCmdsHandler(state, msg) {
      console.log('Game connection: setCmds', msg);
      state.queueEventP('Game.setCmds', msg);
    }
    function playersHandler(state, msg) {
      console.log('Game connection: players', msg);
      state.queueEventP('Game.setPlayers', msg.players);
    }
  }
})();
//# sourceMappingURL=connection.js.map
