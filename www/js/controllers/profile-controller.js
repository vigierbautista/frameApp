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
                    console.log(user);
                    $scope.user = {
                        name: user.usuario,
                        last_name: user.lastName,
                        email: user.email,
                        image: (user.image == null)? 'default.png' : user.image
                    };
                }
            );

        }
    ]);