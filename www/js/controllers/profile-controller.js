// Abrimos el módulo de controllers, definido en
// controllers.js
angular.module('FrameApp.controllers')
    .controller('ProfileCtrl', [
        '$scope',
        '$ionicPopup',
        '$state',
        'AuthService',
        'UserService',
        function($scope, $ionicPopup, $state, AuthService, UserService) {
            $scope.user = null;
            UserService.getUser().then(
                function(user) {
                    $scope.user = {
                        name: user.name,
                        last_name: user.last_name,
                        email: user.email,
                        image: user.image
                    };
                }
            );

        }
    ]);