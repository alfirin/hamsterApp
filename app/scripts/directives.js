'use strict';

/* Directives */

var hamsterDirectives = angular.module('hamsterDirectives', []);

hamsterDirectives.directive('hamsterDir', function (socket) {
  var linker = function (scope, element) {
    element.draggable({
      drag: function (event, ui) {
        var left = ui.position.left;
        var top = ui.position.top;
        socket.emit('moveHamster', {
          id: scope.hamster.id,
          x: left,
          y: top
        });
      }
    });

    socket.on('onHamsterMoved', function (data) {
      // Update if the same hamster
      if (data.id === scope.hamster.id) {
        element.animate({
          left: data.x,
          top: data.y
        }, 0);
      }
    });

    // Some DOM initiation to make it nice
    element.css('left', '10px');
    element.css('top', '50px');
    element.hide().fadeIn();
  };

  var controller = function ($scope) {
    // Incoming
    socket.on('onHamsterUpdated', function (data) {
      // Update if the same hamster
      if (data.id === $scope.hamster.id) {
        $scope.hamster.title = data.title;
        $scope.hamster.body = data.body;
      }
    });

    // Outgoing
    $scope.updateHamster = function (hamster) {
      socket.emit('updateHamster', hamster);
    };

    $scope.deleteHamster = function (id) {
      $scope.ondelete({
        id: id
      });
    };
  };

  return {
    restrict: 'A',
    link: linker,
    controller: controller,
    scope: {
      hamster: '=',
      ondelete: '&'
    }
  };
});
