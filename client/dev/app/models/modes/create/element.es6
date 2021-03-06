(function() {
  angular.module('clickApp.services')
    .factory('createElementMode', createElementModeModelFactory);

  createElementModeModelFactory.$inject = [
    'appAction',
    'appState',
    'commonMode',
  ];
  function createElementModeModelFactory(appActionService,
                                         appStateService,
                                         commonModeModel) {
    const CREATE_LENS = R.lensProp('create');
    const BASE_LENS = R.lensProp('base');
    return function createElementModeModel(type) {
      const createElement_actions = Object.create(commonModeModel.actions);
      createElement_actions.modeBackToDefault = modeBackToDefault;
      createElement_actions.moveMap = moveMap;
      createElement_actions.clickMap = create;
      createElement_actions.clickModel = create;
      createElement_actions.clickTemplate = create;
      createElement_actions.clickTerrain = create;

      const createElement_default_bindings = {
        'clickMap': 'clickMap',
        'clickModel': 'clickModel',
        'clickTemplate': 'clickTemplate',
        'clickTerrain': 'clickTerrain',
      };
      const createElement_bindings = R.extend(Object.create(commonModeModel.bindings),
                                              createElement_default_bindings);
      const createElement_buttons = [];

      const createElement_mode = {
        onEnter: onEnter,
        onLeave: onLeave,
        name: `Create${s.capitalize(type)}`,
        actions: createElement_actions,
        buttons: createElement_buttons,
        bindings: createElement_bindings
      };
      const updateCreateBase$ = R.curry(updateCreateBase);
      return createElement_mode;

      function onEnter() {
        appActionService.defer('Game.view.moveMap', true);
      }
      function onLeave() {
        appActionService.defer('Game.view.moveMap', false);
      }
      function modeBackToDefault(state) {
        return R.thread(state)(
          R.set(CREATE_LENS, null),
          commonModeModel.actions.modeBackToDefault
        );
      }
      function moveMap(state, coord) {
        return R.over(
          CREATE_LENS,
          updateCreateBase$(coord),
          state
        );
      }
      function create(state, event) {
        const is_flipped = R.pathOr(false, ['view','flip_map'], state);
        const create = R.thread(state)(
          R.view(CREATE_LENS),
          updateCreateBase$(event['click#']),
          R.assoc('factions', state.factions)
        );
        return R.thread(state)(
          appStateService.onAction$(R.__, [ 'Game.command.execute',
                                            `create${s.capitalize(type)}`,
                                            [ create, is_flipped ] ]),
          R.defaultTo(state),
          appStateService.onAction$(R.__, [ 'Modes.switchTo', 'Default' ]),
          R.set(CREATE_LENS, null)
        );
      }
      function updateCreateBase(coord, create) {
        return R.over(
          BASE_LENS,
          R.pipe(
            R.assoc('x', coord.x),
            R.assoc('y', coord.y)
          ),
          create
        );
      }
    };
  }
})();
