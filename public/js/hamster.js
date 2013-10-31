var app = angular.module('app', []);

app.directive('hamsterApp', function (socket) {
  var linker = function (scope, element, attrs) {
    element.draggable({
      drag: function (event, ui) {
        var left = ui.position.left;
        var top = ui.position.top;
        socket.emit('moveHamster', {
          id: scope.hamster.id,
          x: ui.position.left,
          y: ui.position.top
        });
      }
    });

    socket.on('onHamsterMoved', function (data) {
      // Update if the same hamster
      if (data.id == scope.hamster.id) {
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
      if (data.id == $scope.hamster.id) {
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

app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});

app.controller('MainCtrl', function ($scope, socket) {
  $scope.hamsters = [];

  // Incoming
  socket.on('onHamsterCreated', function (data) {
    $scope.hamsters.push(data);
  });

  socket.on('onHamsterDeleted', function (data) {
    $scope.handleDeletedHamsterd(data.id);
  });

  // Outgoing
  $scope.createHamster = function () {
    var hamster = {
      id: new Date().getTime(),
      title: 'New Hamster',
      body: 'Pending'
    };

    $scope.hamsters.push(hamster);
    socket.emit('createHamster', hamster);
  };

  $scope.deleteHamster = function (id) {
    $scope.handleDeletedHamsterd(id);

    socket.emit('deleteHamster', {id: id});
  };

  $scope.handleDeletedHamsterd = function (id) {
    var oldHamsters = $scope.hamsters,
      newHamsters = [];

    angular.forEach(oldHamsters, function (hamster) {
      if (hamster.id !== id) newHamsters.push(hamster);
    });

    $scope.hamsters = newHamsters;
  }
});