(function() {
  angular.module('clickApp.services')
    .factory('commonMode', commonModeModelFactory);

  commonModeModelFactory.$inject = [
    'settings',
  ];
  function commonModeModelFactory(settingsModel) {
    const DEFAULT_SETTINGS = {
      DragEpsilon: 3,
      ScrollStep: 30,
      ZoomFactor: 2
    };
    const SETTINGS = R.clone(DEFAULT_SETTINGS);
    const common_actions = {
      modeBackToDefault: modeBackToDefault,
      commandUndoLast: commandUndoLast,
      commandReplayNext: commandReplayNext,
      viewScrollLeft: viewScrollLeft,
      viewScrollRight: viewScrollRight,
      viewScrollUp: viewScrollUp,
      viewScrollDown: viewScrollDown,
      viewZoomIn: viewZoomIn,
      viewZoomOut: viewZoomOut,
      viewZoomReset: viewZoomReset,
      flipMap: flipMap,
      toggleMenu: toggleMenu,
      // roll1D6: roll1D6,
      // roll2D6: roll2D6,
      // roll3D6: roll3D6,
      // roll4D6: roll4D6,
      // roll5D6: roll5D6
    };
    const common_bindings = {
      modeBackToDefault: 'esc',
      commandUndoLast: 'ctrl+z',
      commandReplayNext: 'ctrl+y',
      viewScrollLeft: 'alt+left',
      viewScrollRight: 'alt+right',
      viewScrollUp: 'alt+up',
      viewScrollDown: 'alt+down',
      viewZoomIn: 'alt++',
      viewZoomOut: 'alt+-',
      viewZoomReset: 'alt+z',
      flipMap: 'ctrl+shift+f',
      toggleMenu: 'ctrl+shift+m'
    };
    const common_mode = {
      name: 'Common',
      actions: common_actions,
      buttons: [],
      bindings: R.clone(common_bindings),
      settings: () => SETTINGS
    };
    settingsModel.register('Misc',
                           common_mode.name,
                           DEFAULT_SETTINGS,
                           (settings) => {
                             R.extend(SETTINGS, settings);
                           });
    settingsModel.register('Bindings',
                           common_mode.name,
                           common_bindings,
                           (bs) => {
                             R.extend(common_mode.bindings, bs);
                           });
    return common_mode;

    function modeBackToDefault(state) {
      return state.eventP('Modes.switchTo', 'Default');
    }
    function commandUndoLast(state) {
      return state.eventP('Game.command.undoLast');
    }
    function commandReplayNext(state) {
      return state.eventP('Game.command.replayNext');
    }
    function viewScrollLeft(state) {
      state.queueChangeEventP('Game.view.scrollLeft');
    }
    function viewScrollRight(state) {
      state.queueChangeEventP('Game.view.scrollRight');
    }
    function viewScrollUp(state) {
      state.queueChangeEventP('Game.view.scrollUp');
    }
    function viewScrollDown(state) {
      state.queueChangeEventP('Game.view.scrollDown');
    }
    function viewZoomIn(state) {
      state.queueChangeEventP('Game.view.zoomIn');
    }
    function viewZoomOut(state) {
      state.queueChangeEventP('Game.view.zoomOut');
    }
    function viewZoomReset(state) {
      state.queueChangeEventP('Game.view.zoomReset');
    }
    function flipMap(state) {
      state.queueChangeEventP('Game.view.flipMap');
    }
    function toggleMenu(state) {
      state.queueChangeEventP('Game.toggleMenu');
    }
    // function roll1D6(state) {
    //   return state.event('Game.command.execute',
    //                      'rollDice', [6, 1]);
    // }
    // function roll2D6(state) {
    //   return state.event('Game.command.execute',
    //                      'rollDice', [6, 2]);
    // }
    // function roll3D6(state) {
    //   return state.event('Game.command.execute',
    //                      'rollDice', [6, 3]);
    // }
    // function roll4D6(state) {
    //   return state.event('Game.command.execute',
    //                      'rollDice', [6, 4]);
    // }
    // function roll5D6(state) {
    //   return state.event('Game.command.execute',
    //                      'rollDice', [6, 5]);
    // }
  }
})();
