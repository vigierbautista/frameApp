// Abrimos el módulo de controllers, definido en
// controllers.js
angular.module('FrameApp.controllers')
    .controller('ProfileOptionsCtrl', [
        '$scope',
        '$ionicPopup',
        '$state',
        'AuthService',
        'UserService',
        function($scope, $ionicPopup, $state, AuthService, UserService) {


            // Buscamos la información del user.
            var user = AuthService.getUserData();
            $scope.user = {
                id: user.id,
                name: user.name,
                last_name: user.last_name,
                email: user.email,
                image: user.image
            };



            $scope.edit = function(editData) {

                // Pedimos confirmación del usuario.
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Editar Perfil',
                    template: 'Está seguro de cambiar su información?',
                    buttons: [
                        { text: 'No' },
                        {
                            text: 'Si',
                            type: 'button-positive',
                            onTap: function(e) {
                                return true;
                            }
                        }
                    ]
                });

                confirmPopup.then(function(res) {
                    if(res) {

                        // Si confirma enviamos los datos
                        UserService.edit(editData).then(
                            function(response) {

                                var responseData = response.data;
                                // Verificamos si tuvimos éxito  o no.
                                if(responseData.status == 1) {

                                    var edited = responseData.data;

                                    $scope.user = {
                                        id: edited.id,
                                        name: edited.name,
                                        last_name: edited.last_name,
                                        email: edited.email,
                                        image: edited.image
                                    };

                                    var popup = $ionicPopup.alert({
                                        title: 'Éxito',
                                        template: 'Su información fue modificada exitosamente!'
                                    });

                                    // Redireccionamos al usuario cuando cierre el popup.
                                    popup.then(function(rta) {
                                        $state.go('tab.profile');
                                    });
                                } else {
									var error_msg = '';
									for (var i in responseData.errors) {
										error_msg += responseData.errors[i] + '<br>';
									}

									$ionicPopup.alert({
										title: responseData.msg,
										template: error_msg
									});
                                }
                            }
                        );

                    } else {
                        // Si no confirma no hacemos nada.
                    }
                });
            };



            /**
             * Logout
             */
            $scope.logout = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Cerrar Sesión',
                    template: 'Está seguro de cerrar la sesión actual?',
                    buttons: [
                        { text: 'No' },
                        {
                            text: 'Si',
                            type: 'button-positive',
                            onTap: function(e) {
                                return true;
                            }
                        }
                    ]
                });

                confirmPopup.then(function(res) {
                    if(res) {
                        AuthService.logout();
                        var msg = $ionicPopup.alert({
                            title: 'Sesión Cerrada',
                            template: 'Gracias por utilizar la app. Lo esperamos nuevamente!'
                        });

                        msg.then(
                            function() {
                                $state.go('login', {reload:true});
                            }
                        )
                    }
                });


            };
        }
    ]);