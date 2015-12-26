'use strict';

angular.module('clickApp.services')
  .factory('gameMap', [
    'gameModels',
    'gameTemplates',
    'gameTerrains',
    function gameMapServiceFactory(gameModelsService,
                                   gameTemplatesService,
                                   gameTerrainsService) {
      var gameMapService = {
        isFlipped: function mapIsFlipped(map) {
          return map.classList.contains('flipped');
        },
        zoomFactor: function mapZoomFactor(map) {
          var map_rect = map.getBoundingClientRect();
          return map_rect.width / 480;
        },
        eventToMapCoordinates: function gameMapEventToMapCoordinates(map, event) {
          var map_flipped = gameMapService.isFlipped(map);
          var rect = map.getBoundingClientRect();
          var map_x = (event.clientX - rect.left) * 480 / rect.width;
          var map_y = (event.clientY - rect.top) * 480 / rect.height;
          map_x = ( map_flipped ? 480 - map_x : map_x );
          map_y = ( map_flipped ? 480 - map_y : map_y );
          return { x: map_x, y: map_y };
        },
        mapToScreenCoordinates: function gameMapMapToScreenCoordinates(map, coord) {
          var map_flipped = gameMapService.isFlipped(map);
          var rect = map.getBoundingClientRect();
          var x = (coord.x * rect.width / 480);
          var y = (coord.y * rect.height / 480);
          if(map_flipped) {
            x = rect.width - x;
            y = rect.height - y;
          }
          x = x + rect.left;
          y = y + rect.top;
          return { x: x, y: y };
        },
        findEventTarget: function gameMapFindEventTarget(game, event) {
          var stamp;
          var not_found = {
            type: 'Map',
            target: null
          };
          if(event.target.classList.contains('template') &&
             event.target.hasAttribute('data-stamp')) {
            stamp = event.target.getAttribute('data-stamp');
            return R.pipeP(
              () => {
                return gameTemplatesService.findStamp(stamp, game.templates);
              },
              (template) => {
                return { type: 'Template',
                         target: template
                       };
              }
            )().catch(R.always(not_found));
          }
          if(event.target.classList.contains('model-base') &&
             event.target.hasAttribute('data-stamp')) {
            stamp = event.target.getAttribute('data-stamp');
            return R.pipeP(
              () => {
                return gameModelsService.findStamp(stamp, game.models);
              },
              (model) => {
                return { type: 'Model',
                         target: model
                       };
              }
            )().catch(R.always(not_found));
          }
          if(event.target.classList.contains('terrain-image') &&
             event.target.hasAttribute('data-stamp')) {
            stamp = event.target.getAttribute('data-stamp');
            return R.pipeP(
              () => {
                return gameTerrainsService.findStamp(stamp, game.terrains);
              },
              (terrain) => {
                return { type: 'Terrain',
                         target: terrain
                       };
              }
            )().catch(R.always(not_found));
          }
          return self.Promise.resolve(not_found);
        },
      };
      R.curryService(gameMapService);
      return gameMapService;
    }
  ]);
