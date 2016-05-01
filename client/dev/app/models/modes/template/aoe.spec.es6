describe('aoeTemplateMode model', function() {
  beforeEach(inject([
    'aoeTemplateMode',
    function(aoeTemplateModeModel) {
      this.aoeTemplateModeModel = aoeTemplateModeModel;

      this.appStateService = spyOnService('appState');
      this.gameTemplatesModel = spyOnService('gameTemplates');
      this.gameTemplateSelectionModel = spyOnService('gameTemplateSelection');

      this.state = {
        factions: 'factions',
        game: { template_selection: 'selection',
                templates: 'templates',
                models: 'models',
                ruler: 'ruler'
              }
      };
    }
  ]));

  context('when user deviates template selection', function() {
    return this.aoeTemplateModeModel.actions
      .deviate(this.state);
  }, function() {
    beforeEach(function() {
      this.gameTemplateSelectionModel.get
        .and.returnValue(['stamp']);
    });

    it('should get current selection', function() {
      expect(this.gameTemplateSelectionModel.get)
        .toHaveBeenCalledWith('local', 'selection');
    });

    it('should execute rollDeviation command', function() {
      expect(this.appStateService.chainReduce)
        .toHaveBeenCalledWith('Game.command.execute',
                              'rollDeviation', [['stamp']]);
    });
  });

  context('when user set max deviation', function() {
    return this.aoeTemplateModeModel.actions
      .setMaxDeviation(this.state);
  }, function() {
    beforeEach(function() {
      this.gameTemplateSelectionModel.get
        .and.returnValue(['stamp']);
      this.gameTemplatesModel.fromStampsP
        .resolveWith([42]);
      this.promptService.promptP
        .resolveWith(71);
      this.appStateService.current
        .and.returnValue(this.state);
    });

    it('should get current selection max deviation', function() {
      expect(this.gameTemplateSelectionModel.get)
        .toHaveBeenCalledWith('local', 'selection');
      expect(this.gameTemplatesModel.fromStampsP)
        .toHaveBeenCalledWith('maxDeviation', [], ['stamp'], 'templates');
    });

    it('should prompt user for max deviation', function() {
      expect(this.promptService.promptP)
        .toHaveBeenCalledWith('prompt',
                              'Set AoE max deviation :',
                              42);
    });

    context('when user set max deviation', function() {
      this.promptService.promptP
        .resolveWith(42);
    }, function() {
      it('should set max deviation', function() {
        expect(this.gameTemplatesModel.onStampsP)
          .toHaveBeenCalledWith('setMaxDeviation', [42], ['stamp'], 'templates');
      });
    });

    context('when user reset max deviation', function() {
      this.promptService.promptP
        .resolveWith(0);
    }, function() {
      it('should set max deviation', function() {
        expect(this.gameTemplatesModel.onStampsP)
          .toHaveBeenCalledWith('setMaxDeviation', [null], ['stamp'], 'templates');
      });
    });

    context('when user cancels prompt', function() {
      this.promptService.promptP
        .rejectWith('canceled');
    }, function() {
      it('should reset max deviation', function() {
        expect(this.gameTemplatesModel.onStampsP)
          .toHaveBeenCalledWith('setMaxDeviation', [null], ['stamp'], 'templates');
      });
    });
  });

  example(function(e) {
    context('when user set '+e.action+' on template selection', function() {
      return this.aoeTemplateModeModel
        .actions[e.action](this.state);
    }, function() {
      beforeEach(function() {
        this.gameTemplateSelectionModel.get
          .and.returnValue(['stamp']);
      });

      it('should get current selection', function() {
        expect(this.gameTemplateSelectionModel.get)
          .toHaveBeenCalledWith('local', 'selection');
      });

      it('should execute onTemplates/setSize command', function() {
        expect(this.appStateService.chainReduce)
          .toHaveBeenCalledWith('Game.command.execute',
                                'onTemplates',
                                [ 'setSizeP', [e.size], ['stamp'] ]);
      });
    });
  }, [
    [ 'action'   , 'size' ],
    [ 'aoeSize3' , 3      ],
    [ 'aoeSize4' , 4      ],
    [ 'aoeSize5' , 5      ],
  ]);

  context('when user set target model', function() {
    return this.aoeTemplateModeModel.actions
      .setTargetModel(this.state, this.event);
  }, function() {
    beforeEach(function() {
      this.gameTemplateSelectionModel.get
        .and.returnValue(['stamp']);
      this.target = { state: { stamp: 'target' } };
      this.event = { 'click#': { target: this.target } };
    });

    it('should set target for current template selection', function() {
      expect(this.gameTemplateSelectionModel.get)
        .toHaveBeenCalledWith('local', 'selection');
      expect(this.appStateService.chainReduce)
        .toHaveBeenCalledWith('Game.command.execute',
                              'onTemplates',
                              [ 'setTargetP',
                                ['factions', null, this.target],
                                ['stamp']
                              ]);
    });
  });

  context('when user set aoe to ruler target', function() {
    return this.aoeTemplateModeModel.actions
      .setToRulerTarget(this.state);
  }, function() {
    beforeEach(function() {
      this.gameRulerModel = spyOnService('gameRuler');

      this.gameTemplateSelectionModel.get
        .and.returnValue(['stamp']);
    });

    context('when ruler is not displayed', function() {
      this.gameRulerModel.isDisplayed
        .and.returnValue(false);
    }, function() {
      it('should not execute command', function() {
        expect(this.appStateService.chainReduce)
          .not.toHaveBeenCalled();
      });
    });

    context('when ruler is displayed', function() {
      this.gameRulerModel.isDisplayed
        .and.returnValue(true);
    }, function() {
      it('should get current selection', function() {
        expect(this.gameTemplateSelectionModel.get)
          .toHaveBeenCalledWith('local', 'selection');
      });

      it('should get ruler target position', function() {
        expect(this.gameRulerModel.targetAoEPosition)
          .toHaveBeenCalledWith('models', 'ruler');
      });

      it('should execute onTemplates/setToRuler command', function() {
        expect(this.appStateService.chainReduce)
          .toHaveBeenCalledWith('Game.command.execute',
                                'onTemplates',
                                [ 'setToRulerP',
                                  ['gameRuler.targetAoEPosition.returnValue'],
                                  ['stamp']
                                ]);
      });
    });
  });
});
