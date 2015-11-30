'use strict';

angular.module('clickApp.controllers')
  .controller('mainCtrl', [
    '$scope',
    '$state',
    '$window',
    'settings',
    'user',
    'gameBoard',
    'gameFactions',
    'gameScenario',
    'allModes',
    function($scope,
             $state,
             $window,
             settingsService,
             userService,
             gameBoardService,
             gameFactionsService,
             gameScenarioService) {
      console.log('init mainCtrl');
      
      $scope.boards_ready = gameBoardService.init()
        .then(function(boards) {
          $scope.boards = boards;
          console.log('boards', boards);
        });
      $scope.factions_ready = gameFactionsService.init()
        .then(function(factions) {
          $scope.factions = factions;
          console.log('factions', factions);
        });
      $scope.scenario_ready = gameScenarioService.init()
        .then(function(scenarios) {
          $scope.scenarios = scenarios;
          console.log('scenarios', scenarios);
        });
      $scope.settings_ready = settingsService.init()
        .then(function(settings) {
          $scope.settings = settings;
          console.log('settings', settings);
        });
      $scope.data_ready = self.Promise.all([
        $scope.boards_ready,
        $scope.factions_ready,
        $scope.scenario_ready,
        $scope.settings_ready,
      ]).then(function() {
        console.log('data ready');
      });
      $scope.doResetSettings = function doResetSettings(data) {
        R.pipeP(
          R.bind(self.Promise.resolve, self.Promise),
          settingsService.bind,
          settingsService.update,
          function(settings) {
            $scope.settings = settings;
            $scope.$digest();
          }
        )(data);
      };
      $scope.reloadFactions = function reloadFactions() {
        return gameFactionsService.init()
          .then(function(factions) {
            $scope.factions = factions;
            console.log('factions', factions);
          });
      };

      $scope.userIsValid = function() {
        return R.exists(R.path(['user','name'], $scope));
      };
      $scope.checkUser = function() {
        if(!$scope.userIsValid()) {
          $state.go('user');
        }
      };
      $scope.user_ready = userService.load()
        .then(function onLoadUser(user) {
          $scope.user = user;
          console.log('loaded user', $scope.user);
          $scope.checkUser();
        });
      $scope.setUser = function(new_user) {
        return userService.save(new_user)
          .then(function onSaveUser(user) {
            $scope.user = user;
            console.log('set user', $scope.user);
          });
      };

      $scope.goToState = function() {
        var args = Array.prototype.slice.call(arguments);
        $state.go.apply($state, args);
      };
      $scope.stateIs = function(name) {
        return $state.is(name);
      };
      $scope.stateMatches = function(match) {
        return 0 <= $state.current.name.indexOf(match);
      };
      $scope.currentState = function() {
        return $state.current;
      };

      // $scope.deferDigest = function deferDigest(scope) {
      //   // console.log('deferDigest');
      //   $window.requestAnimationFrame(function _deferDigest() {
      //     // console.log('_deferDigest');
      //     scope.$digest();
      //   });
      // };
    }
  ]);
