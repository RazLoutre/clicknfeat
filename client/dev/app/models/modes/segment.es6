(function() {
  angular.module('clickApp.services')
    .factory('segmentMode', segmentModeModelFactory);

  segmentModeModelFactory.$inject = [
    'modes',
    'settings',
    'commonMode',
    'gameModels',
    'gameModelSelection',
  ];
  function segmentModeModelFactory(modesModel,
                                   settingsModel,
                                   commonModeModel,
                                   gameModelsModel,
                                   gameModelSelectionModel) {
    return function buildSegmentModeModel(type, gameSegmentModel, default_bindings) {
      const segment_actions = Object.create(commonModeModel.actions);
      segment_actions[`exit${s.capitalize(type)}Mode`] =
        commonModeModel.actions.modeBackToDefault;
      segment_actions.dragStartMap = segmentDragStartMap;
      segment_actions.dragMap = segmentDragMap;
      segment_actions.dragEndMap = segmentDragEndMap;
      segment_actions.dragStartTemplate = segment_actions.dragStartMap;
      segment_actions.dragTemplate = segment_actions.dragMap;
      segment_actions.dragEndTemplate = segment_actions.dragEndMap;
      segment_actions.dragStartModel = segment_actions.dragStartMap;
      segment_actions.dragModel = segment_actions.dragMap;
      segment_actions.dragEndModel = segment_actions.dragEndMap;

      const segment_bindings = R.extend(Object.create(commonModeModel.bindings),
                                        default_bindings);
      const segment_buttons = [];
      const segment_mode = {
        onEnter: segmentOnEnter,
        onLeave: segmentOnLeave,
        name: s.capitalize(type),
        actions: segment_actions,
        buttons: segment_buttons,
        bindings: segment_bindings
      };
      modesModel.registerMode(segment_mode);
      settingsModel.register('Bindings',
                             segment_mode.name,
                             default_bindings,
                             (bs) => {
                               R.extend(segment_mode.bindings, bs);
                             });
      return segment_mode;

      function segmentDragStartMap(state, drag) {
        return state.eventP('Game.update', R.lensProp(type),
                            gameSegmentModel.setLocal$(drag.start, drag.now,
                                                       state, state.game));
      }
      function segmentDragMap(state, drag) {
        return state.eventP('Game.update', R.lensProp(type),
                            gameSegmentModel.setLocal$(drag.start, drag.now,
                                                       state, state.game));
      }
      function segmentDragEndMap(state, drag) {
        return state.eventP('Game.command.execute',
                            `set${s.capitalize(type)}`, [
                              'setRemote',
                              [drag.start, drag.now]
                            ]);
      }
      function segmentOnEnter(state) {
        return R.threadP(state)(
          R.path(['game','model_selection']),
          gameModelSelectionModel.get$('local'),
          (stamps) => {
            if(R.length(stamps) !== 1) return null;

            return gameModelsModel
              .findStampP(stamps[0], state.game.models)
              .catch(R.always(null));
          },
          (model) => {
            if(R.isNil(model)) return null;

            return state
              .eventP('Game.command.execute',
                      `set${s.capitalize(type)}`, [
                        'setOriginResetTarget',
                        [model]
                      ]);
          }
        );
      }
      function segmentOnLeave(state) {
        state.queueChangeEventP(`Game.${type}.remote.change`);
      }
    };
  }
})();
