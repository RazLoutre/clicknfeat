'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

(function () {
  angular.module('clickApp.services').factory('sprayTemplateMode', sprayTemplateModeModelFactory);

  sprayTemplateModeModelFactory.$inject = ['modes', 'settings', 'templateMode', 'sprayTemplate', 'game', 'gameTemplates', 'gameTemplateSelection'];

  // 'gameModels',
  function sprayTemplateModeModelFactory(modesModel, settingsModel, templateModeModel, sprayTemplateModel, gameModel, gameTemplatesModel, gameTemplateSelectionModel) {
    // gameModelsModel) {
    var template_actions = Object.create(templateModeModel.actions);
    template_actions.spraySize6 = spraySize6;
    template_actions.spraySize8 = spraySize8;
    template_actions.spraySize10 = spraySize10;
    template_actions.setOriginModel = setOriginModel;
    template_actions.setTargetModel = setTargetModel;
    var moves = [['rotateLeft', 'left'], ['rotateRight', 'right']];
    var buildTemplateMove$ = R.curry(buildTemplateMove);
    R.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1);

      var move = _ref2[0];

      template_actions[move] = buildTemplateMove$(move, false);
      template_actions[move + 'Small'] = buildTemplateMove$(move, true);
    }, moves);

    var template_default_bindings = {
      setOriginModel: 'ctrl+clickModel',
      setTargetModel: 'shift+clickModel',
      spraySize6: '6',
      spraySize8: '8',
      spraySize10: '0'
    };
    var template_bindings = R.extend(Object.create(templateModeModel.bindings), template_default_bindings);

    var template_buttons = R.concat([['Size', 'toggle', 'size'], ['Spray6', 'spraySize6', 'size'], ['Spray8', 'spraySize8', 'size'], ['Spray10', 'spraySize10', 'size']], templateModeModel.buttons);

    var template_mode = {
      onEnter: function onEnter() {},
      onLeave: function onLeave() {},
      name: 'spray' + templateModeModel.name,
      actions: template_actions,
      buttons: template_buttons,
      bindings: template_bindings
    };
    modesModel.registerMode(template_mode);
    settingsModel.register('Bindings', template_mode.name, template_default_bindings, function (bs) {
      R.extend(template_mode.bindings, bs);
    });
    return template_mode;

    function spraySize6(state) {
      var stamps = gameTemplateSelectionModel.get('local', state.game.template_selection);
      return state.eventP('Game.command.execute', 'onTemplates', ['setSizeP', [6], stamps]);
    }
    function spraySize8(state) {
      var stamps = gameTemplateSelectionModel.get('local', state.game.template_selection);
      return state.eventP('Game.command.execute', 'onTemplates', ['setSizeP', [8], stamps]);
    }
    function spraySize10(state) {
      var stamps = gameTemplateSelectionModel.get('local', state.game.template_selection);
      return state.eventP('Game.command.execute', 'onTemplates', ['setSizeP', [10], stamps]);
    }
    function setOriginModel(state, event) {
      var stamps = gameTemplateSelectionModel.get('local', state.game.template_selection);
      return state.eventP('Game.command.execute', 'onTemplates', ['setOrigin', [state.factions, event['click#'].target], stamps]);
    }
    function setTargetModel(state, event) {
      var stamps = gameTemplateSelectionModel.get('local', state.game.template_selection);
      return R.threadP(state.game)(R.prop('templates'), gameTemplatesModel.findStampP$(stamps[0]), sprayTemplateModel.origin,
      // findOriginModel,
      function (origin_model) {
        if (R.isNil(origin_model)) return null;

        return state.eventP('Game.command.execute', 'onTemplates', ['setTarget', [state.factions, origin_model, event['click#'].target], stamps]);
      });
    }
    function buildTemplateMove(move, small, state) {
      var stamps = gameTemplateSelectionModel.get('local', state.game.template_selection);
      return R.threadP(state.game)(R.prop('templates'), function () {
        return gameTemplatesModel.findStampP$(stamps[0]);
      }, sprayTemplateModel.origin,
      // findOriginModel,
      function (origin_model) {
        return state.eventP('Game.command.execute', 'onTemplates', [move, [state.factions, origin_model, small], stamps]);
      });
    }
    // function findOriginModel(stamp) {
    //   if(R.isNil(stamp)) return null;

    //   return gameModelsModel
    //       .findStampP(stamp, state.game.models);
    // }
  }
})();
//# sourceMappingURL=spray.js.map