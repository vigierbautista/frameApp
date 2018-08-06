
angular.module('FrameApp.controllers')
    .controller('RegisterCtrl', [
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
            //TODO REGISTER VALIDATION
            $scope.register = function(userData) {

				var Validator = ValidationService.init(userData, {
					name: ['required', 'min:3', 'max:20'],
					last_name: ['required', 'min:3', 'max:20'],
					email: ['required', 'email'],
					password: ['required', 'password'],
					password2: ['required', 'equal:password']
				}, {
					name: {
						required: "Ingrese su nombre.",
						min: 'Su nombre debe tener un mínimo de 3 letras.',
						max: 'Su nombre debe tener un máximo de 20 letras.'
					},
					last_name: {
						required: "Ingrese su apellido.",
						min: 'Su apellido debe tener un mínimo de 3 letras.',
						max: 'Su apellido debe tener un máximo de 20 letras.'
					},
					email: {
						required: 'Ingrese su email.',
						email: 'El formato del email debe ser ejemplo@dominio.com'
					},
					password: {
						required: "Ingrese su contraseña.",
						password: 'La contraseña debe tener un mínimo de 5 caracteres, una mayúscula y un número.'
					},
					password2: {
						required: 'Repita la contraseña.',
						equal: 'Las contraseñas deben ser iguales.'
					}
				});

				if (Validator.isInvalid()) {
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