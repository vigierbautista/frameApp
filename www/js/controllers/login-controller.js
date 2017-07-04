
angular.module('FrameApp.controllers')
    .controller('LoginCtrl', [
        '$scope',
        '$ionicPopup',
        '$state',
        'AuthService',
        function($scope, $ionicPopup, $state, AuthService) {
            $scope.user = {
                name: null,
                password: null
            };

            $scope.login = function(userData) {
                if(!userData.name || !userData.password) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: "Complete el formulario con su nombre y password!"
                    });
                    return;
                }
                AuthService.login(userData).then(
                    function(response) {

                        // Resolve
                        var responseData = response.data;
                        if(responseData.status == 1) {
                            var popup = $ionicPopup.alert({
                                title: 'Éxito',
                                template: responseData.msg
                            });

                            // Cuando el usuario cierre  el popup, lo redireccionamos al dashboard.
                            popup.then(
                                function(rta) {
                                    $state.go('tab.dash');
                                }
                            );
                        } else {
                            $ionicPopup.alert({
                                title: 'Error',
                                template: responseData.msg
                            });
                        }
                    },
                    function(response) {
                        // Reject
                    }
                );
            }
        }
    ]);