'use strict';

/* Controllers */

var hamsterControllers = angular.module('hamsterControllers', []);

hamsterControllers.controller('MainCtrl', ['$scope', 'socket',
  function ($scope, socket) {
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
        if (hamster.id !== id) {
          newHamsters.push(hamster);
        }
      });

      $scope.hamsters = newHamsters;
    };
  }]
);