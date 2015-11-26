'use strict';

angular.module('clickApp.directives')
  .factory('clickGameModelBase', [
    function() {
      return {
        create: function clickGameModelBaseCreate(svgNS, info, model, parent) {
          var base = document.createElementNS(svgNS, 'circle');
          base.classList.add('model-base');
          base.setAttribute('cx', (info.img[0].width/2)+'');
          base.setAttribute('cy', (info.img[0].height/2)+'');
          base.setAttribute('r', info.base_radius);
          base.setAttribute('style', [
            'fill:', info.base_color, ';',
          ].join(''));
          base.setAttribute('data-stamp', model.state.stamp);
          parent.appendChild(base);

          var direction = document.createElementNS(svgNS, 'line');
          direction.classList.add('model-los');
          direction.setAttribute('x1', (info.img[0].width/2)+'');
          direction.setAttribute('y1', (info.img[0].height/2)+'');
          direction.setAttribute('x2', (info.img[0].width/2)+'');
          direction.setAttribute('y2', (info.img[0].height/2-info.base_radius)+'');
          parent.appendChild(direction);

          var front_arc = document.createElementNS(svgNS, 'line');
          front_arc.classList.add('model-los');
          front_arc.setAttribute('x1', (info.img[0].width/2-info.base_radius)+'');
          front_arc.setAttribute('y1', (info.img[0].height/2)+'');
          front_arc.setAttribute('x2', (info.img[0].width/2+info.base_radius)+'');
          front_arc.setAttribute('y2', (info.img[0].height/2)+'');
          parent.appendChild(front_arc);

          var image = document.createElementNS(svgNS, 'image');
          image.classList.add('model-image');
          image.setAttribute('x', '0');
          image.setAttribute('y', '0');
          parent.appendChild(image);
          
          var edge = document.createElementNS(svgNS, 'circle');
          edge.classList.add('model-edge');
          edge.setAttribute('cx', (info.img[0].width/2)+'');
          edge.setAttribute('cy', (info.img[0].height/2)+'');
          edge.setAttribute('r', info.base_radius);
          parent.appendChild(edge);

          return [ base, direction, front_arc, image, edge ];
        },
        update: function clickGameModelBaseUpdate(info, model, img, el) {
          var image = el[3];
          image.setAttribute('width', img.width+'');
          image.setAttribute('height', img.height+'');
          if(R.exists(img.link)) {
            image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', img.link);
            image.style.visibility = 'visible';
          }
          else {
            image.style.visibility = 'hidden';
          }
        },
      };
    }
  ]);