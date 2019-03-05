
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
                last_name: null,
                email: null,
                password: null,
                password2: null
            };

            $scope.loading = false;

            $scope.register = function(userData) {

				$scope.loading = true;

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

					$scope.loading = false;
					return;
				}

				AuthService.register(userData).then(
					function(response) {
						// Resolve

						$scope.loading = false;
						var responseData = response.data;
						if(responseData.status == 1) {
							var popup = $ionicPopup.alert({
								title: '¡Cuenta creada con éxito!'
							});

							// reseteamos el form.
							$scope.user = {
								name: null,
								last_name: null,
								email: null,
								password: null,
								password2: null
							};

							// Cuando el usuario cierre  el popup, lo redireccionamos al dashboard.
							popup.then(
								function(rta) {
									$state.go('tab.dash');
								}
							);
						} else {
							var error_msg = '';
							var errors = responseData.errors;
							for (var i in errors) {
								error_msg += errors[i] + '<br>';
							}

							$ionicPopup.alert({
								title: 'Datos incorrectos',
								template: error_msg
							});
						}
					},
					function(response) {
						// Reject

						$scope.loading = false;
						console.error("REGISTER REJECT:" + response);
					}
				);
            }
        }
    ]);