
angular.module('FrameApp.controllers')
    .controller('LoginCtrl', [
        '$scope',
        '$ionicPopup',
        '$state',
        'AuthService',
        'ValidationService',
        function($scope, $ionicPopup, $state, AuthService, ValidationService) {
            $scope.user = {
                name: null,
                password: null
            };

            $scope.loading = false;

            $scope.login = function(userData) {

            	$scope.loading = true;

            	var Validator = ValidationService.init(userData, {
					email: ['required', 'email'],
					password: ['required']
				}, {
					email: {
						required: 'Ingrese su email.',
						email: 'El formato del email debe ser ejemplo@dominio.com'
					},
            		password: {required: "Ingrese su constraseña."}
				});


                if(Validator.isInvalid()) {

                	var error_msg = '';
					var errors = Validator.getErrors();
                	for (var i in errors) {
                		error_msg += errors[i] + '<br>';
					}

                    $ionicPopup.alert({
                        title: 'Datos incorrectos',
                        template: error_msg
                    });
					$scope.loading = false;
                    return;
                }


                AuthService.login(userData).then(
                    function(response) {
                        // Resolve
						$scope.loading = false;
                        var responseData = response.data;

                        if(responseData.status == 1) {

                            var popup = $ionicPopup.alert({
                                title: 'Éxito',
                                template: responseData.msg
                            });

                            // Reseteamos el form.
							$scope.user = {
								name: null,
								password: null
							};

                            // Cuando el usuario cierre  el popup, lo redireccionamos al dashboard.
                            popup.then(
                                function(rta) {
                                    $state.go('tab.dash');
                                }
                            );

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
                    },
                    function(response) {
                        // Reject
						$scope.loading = false;
						$ionicPopup.alert({
							title: 'Error',
							template: "No pudimos conectarnos. Intente de nuevo más tarde."
						});
                    }
                );
            };
        }
    ]);