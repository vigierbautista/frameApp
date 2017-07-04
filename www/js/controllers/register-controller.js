
angular.module('FrameApp.controllers')
    .controller('RegisterCtrl', [
        '$scope',
        '$ionicPopup',
        '$state',
        'AuthService',
        function($scope, $ionicPopup, $state, AuthService) {
            $scope.user = {
                name: null,
                password: null
            };

            $scope.register = function(userData) {
                console.log(!userData.name && !userData.password && !userData.email && !userData.last_name);

                if(!userData.name) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: "Complete su nombre"
                    });
                    return;
                }
                if(!userData.password) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: "Complete su password"
                    });
                    return;
                }
                if(!userData.email) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: "Complete su email"
                    });
                    return;
                }
                if(!userData.last_name) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: "Complete su apellido"
                    });
                    return;
                }
                AuthService.register(userData).then(
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
                        console.log("REGISTER REJECT:" + response);
                    }
                );
            }
        }
    ]);