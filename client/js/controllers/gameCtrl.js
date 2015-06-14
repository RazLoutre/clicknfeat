'use strict';

angular.module('clickApp.controllers')
  .controller('gameCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$window',
    'game',
    'games',
    'modes',
    'pubSub',
    'allModes',
    'allCommands',
    'allTemplates',
    function($scope,
             $state,
             $stateParams,
             $window,
             gameService,
             gamesService,
             modesService,
             pubSubService) {
      console.log('init gameCtrl', $stateParams, $state.current.name);
      var onLoad;
      if($stateParams.where === 'offline') {
        onLoad = gamesService.loadLocalGames()
            .then(function(local_games) {
              $scope.local_games = local_games;
              $scope.game_index = $stateParams.id >> 0;
              $scope.game = R.nth($scope.game_index,
                                  $scope.local_games);
              console.log('load game', $scope.game);
            });
      }

      var game_event_channel = pubSubService.init();
      pubSubService.subscribe('#watch#', function() {
        console.log('gameEvent', arguments);
      }, game_event_channel);
      $scope.gameEvent = function gameEvent() {
        var args = Array.prototype.slice.apply(arguments);
        pubSubService.publish.apply(null, R.append(game_event_channel, args));
      };
      $scope.onGameEvent = function onGameEvent(event, listener, scope) {
        // console.log('subscribe onGameEvent', arguments);
        var unsubscribe = pubSubService.subscribe(event, listener, game_event_channel);
        scope.$on('$destroy', function unsubscribeOnGameEvent() {
          // console.log('unsubscribe onGameEvent', event, game_event_channel);
          unsubscribe();
        });
      };
      $scope.digestOnGameEvent = function digestOnGameEvent(event, scope) {
        // console.log('subscribe digestOnGameEvent', arguments);
        var unsubscribe = pubSubService.subscribe(event, function _digestOnGameEvent() {
          // console.log('digestOnGameEvent', event);
          $scope.deferDigest(scope);
        }, game_event_channel);
        scope.$on('$destroy', function unsubscribeDigestOnGameEvent() {
          // console.log('unsubscribe digestOnGameEvent', event, game_event_channel);
          unsubscribe();
        });
      };

      $scope.saveGame = function saveGame(game) {
        $scope.game = game;
        console.log('save game', $scope.game);
        $scope.local_games[$scope.game_index] = $scope.game;
        gamesService.storeLocalGames($scope.local_games);
        $scope.gameEvent('saveGame');
      };

      $scope.currentModeName = function currentModeName(mode) {
        if(!R.exists($scope.modes)) return '';
        return modesService.currentModeName($scope.modes);
      };
      $scope.currentModeIs = function currentModeIs(mode) {
        if(!R.exists($scope.modes)) return false;
        return modesService.currentModeName($scope.modes) === mode;
      };
      $scope.doModeAction = function doModeAction(action) {
        var ok = modesService.currentModeAction(action, $scope, $scope.modes);
        if(!ok) $scope.gameEvent('modeUnknownAction', action);
      };
      $scope.show_action_group = null;
      $scope.doActionButton = function doActionButton(action) {
        if(action[1] === 'toggle') {
          $scope.show_action_group = ($scope.show_action_group === action[2]) ? null : action[2];
          return;
        }
        $scope.doModeAction(action[1]);
      };

      var forward_events = [
        'clickModel',
        'rightClickModel',
        'dragStartModel',
        'dragModel',
        'dragEndModel',
        'clickTemplate',
        'rightClickTemplate',
        'dragStartTemplate',
        'dragTemplate',
        'dragEndTemplate',
        'clickMap',
        'rightClickMap',
        'moveMap',
        'dragStartMap',
        'dragMap',
        'dragEndMap',
      ];
      R.forEach(function(fwd) {
        $scope.$on(fwd, function onForwardEvent(e, target, event) {
          console.log('$on '+fwd, arguments);
          $scope.gameEvent('closeSelectionDetail');
          var ok = modesService.currentModeAction(fwd, $scope, target, event, $scope.modes);
          if(!ok) $scope.gameEvent('modeUnknownAction', fwd);
        });
      }, forward_events);
      $scope.$on('$destroy', function onGameCtrlDestroy() {
        console.log('on gameCtrl $destroy');
        Mousetrap.reset();
      });

      $scope.ui_state = {};
      onLoad.then(function() {
        if(R.isNil($scope.game)) {
          $scope.goToState('lounge');
          return;
        }
        $scope.modes = modesService.init($scope);
        if($state.current.name === 'game') {
          $scope.goToState('.main');
        } 
        $scope.create = {};
        $scope.data_ready
          .then(function() {
            $scope.game = gameService.load($scope, $scope.game);
          });
      });
    }
  ]);
