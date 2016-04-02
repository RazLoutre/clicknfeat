'use strict';

(function () {
  angular.module('clickApp.controllers').controller('gameSetupCtrl', gameSetupCtrl);

  gameSetupCtrl.$inject = ['$scope', 'gameScenario'];
  function gameSetupCtrl($scope, gameScenarioService) {
    var vm = this;
    console.log('init gameSetupCtrl');

    vm.doSetBoard = doSetBoard;
    vm.doSetRandomBoard = doSetRandomBoard;
    vm.doSetScenario = doSetScenario;
    vm.doSetRandomScenario = doSetRandomScenario;
    // vm.doGenerateObjectives = doGenerateObjectives;
    vm.doToggleLayer = doToggleLayer;
    // vm.onAmbianceChange = onAmbianceChange;
    // vm.onCategoryChange = onCategoryChange;
    // vm.onEntryChange = onEntryChange;
    // vm.getTerrain = getTerrain;
    // vm.doCreateTerrain = doCreateTerrain;
    // vm.doResetTerrain = doResetTerrain;
    // vm.doImportBoardFile = doImportBoardFile;

    activate();

    function activate() {
      $scope.state.data_ready.then(onDataReady);

      $scope.onStateChangeEvent('Game.board.change', updateBoardName, $scope);
      self.requestAnimationFrame(updateBoardName);

      $scope.onStateChangeEvent('Game.scenario.change', updateScenario, $scope);
      self.requestAnimationFrame(updateScenario);

      $scope.onStateChangeEvent('Game.layers.change', updateLayers, $scope);
      self.requestAnimationFrame(updateLayers);

      // $scope.$on('$destroy', () => {
      //   $scope.stateEvent('Game.scenario.refresh');
      // });
      // $scope.stateEvent('Game.scenario.refresh');
    }

    function onDataReady() {
      vm.boards = $scope.state.boards;
      vm.terrains = $scope.state.terrains;
      // vm.ambiance = R.head(R.keys(vm.terrains));
      // vm.onAmbianceChange();
      vm.scenarios = $scope.state.scenarios;
      $scope.$digest();
    }

    function updateBoardName() {
      vm.board_name = R.path(['game', 'board', 'name'], $scope.state);
      $scope.$digest();
    }
    function doSetBoard() {
      $scope.stateEvent('Game.board.set', vm.board_name);
    }
    function doSetRandomBoard() {
      $scope.stateEvent('Game.board.setRandom');
    }

    function updateScenario() {
      vm.scenario_name = R.path(['state', 'game', 'scenario', 'name'], $scope);
      vm.scenario_group = gameScenarioService.groupForName(vm.scenario_name, vm.scenarios);
      $scope.$digest();
    }
    function doSetScenario() {
      if (R.isNil(vm.scenario_name)) return;

      $scope.stateEvent('Game.scenario.set', vm.scenario_name, vm.scenario_group);
    }
    function doSetRandomScenario() {
      $scope.stateEvent('Game.scenario.setRandom');
    }
    // function doGenerateObjectives() {
    //   $scope.stateEvent('Game.scenario.generateObjectives');
    // }

    function updateLayers() {
      vm.layers = R.path(['state', 'game', 'layers'], $scope);
      $scope.$digest();
    }
    function doToggleLayer(l) {
      $scope.stateEvent('Game.command.execute', 'setLayers', ['toggle', l]);
    }

    // function onAmbianceChange() {
    //   vm.category = R.head(R.keys(vm.terrains[vm.ambiance]));
    //   vm.onCategoryChange();
    // }
    // function onCategoryChange() {
    //   vm.entry = R.head(R.keys(vm.terrains[vm.ambiance][vm.category]));
    //   vm.onEntryChange();
    // }
    // function onEntryChange() {
    // }
    // function getTerrainPath() {
    //   return [ vm.ambiance,
    //            vm.category,
    //            vm.entry
    //          ];
    // }
    // function getTerrain() {
    //   return R.path([
    //     vm.ambiance,
    //     vm.category,
    //     vm.entry
    //   ], vm.terrains);
    // }
    // function doCreateTerrain() {
    //   const terrain_path = getTerrainPath();
    //   $scope.stateEvent('Game.terrain.create', terrain_path);
    // }
    // function doResetTerrain() {
    //   $scope.stateEvent('Game.terrain.reset');
    // }

    // function doImportBoardFile(files) {
    //   $scope.stateEvent('Game.board.importFile', files[0]);
    // }
  }
})();
//# sourceMappingURL=gameSetupCtrl.js.map
