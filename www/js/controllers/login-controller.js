
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

            $scope.login = function(userData) {


            	var Validator = ValidationService.init(userData, {
            		name: {'required': true},
					password: {'required': true}
				}, {
            		name: {required: "Ingrese su nombre."},
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
                    return;
                }


                AuthService.login(userData).then(
                    function(response) {
						console.log(response);
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

							var error_msg = '';
							for (var i in response.errors) {
								error_msg += response.errors[i] + '<br>';
							}

                            $ionicPopup.alert({
                                title: 'Error',
                                template: error_msg
                            });
                        }
                    },
                    function(response) {
                        // Reject
						console.log(response);
						$ionicPopup.alert({
							title: 'Error',
							template: "No pudimos conectarnos. Intente de nuevo más tarde."
						});
                    }
                );
            }
        }
    ]);