angular.module('FrameApp.controllers')
	.controller('ChangePassCtrl', [
		'$scope',
		'$ionicPopup',
		'$state',
		'$stateParams',
		'ValidationService',
		'UserService',
		function($scope, $ionicPopup, $state, $stateParams, ValidationService, UserService) {

			$scope.user = {
				id: $stateParams.user.id,
				email: $stateParams.user.email
			};

			$scope.loading = false;


			$scope.changePass = function (user) {
				$scope.loading = true;

				var Validator = ValidationService.init(user,{
					password: ['required', 'password'],
					password2: ['required', 'equal:password']
				}, {
					password: {
						required: "Ingrese su nueva contraseña.",
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

				UserService.changePass(user).then(
					function (response) {
						$scope.loading = false;

						if (response.status == 0) {
							$ionicPopup.alert({
								title: 'Error',
								template: response.msg
							});
						}

						if (response.status == 1) {
							$ionicPopup.alert({
								title: 'Contraseña cambiada.',
								template: 'Ya podés ingresar con tu nueva contraseña'
							}).then(
								function(rta) {
									$state.go('login');
								}
							);
						}
					}
				)
			}
		}
	]);