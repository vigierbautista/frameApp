angular.module('FrameApp.controllers')
	.controller('RecoverPassCtrl', [
		'$scope',
		'$ionicPopup',
		'$state',
		'$stateParams',
		'ValidationService',
		'UserService',
		function($scope, $ionicPopup, $state, $stateParams, ValidationService, UserService) {

			$scope.user = {
				id: null,
				email: null
			};

			$scope.loading = false;

			$scope.sendCode = function (user) {
				$scope.loading = true;
				var Validator = ValidationService.init(user, {
					email: ['required', 'email']
				}, {
					email: {
						required: 'Ingrese su email.',
						email: 'El formato del email debe ser ejemplo@dominio.com'
					}
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


				UserService.sendRecoverCode(user.email).then(
					function (response) {
						$scope.loading = false;
						if (response.status == 0) {
							$ionicPopup.alert({
								title: 'Error',
								template: response.msg
							});
						}

						if (response.status == 1) {

							$scope.user.id = response.user.id;
							$scope.user.email = response.user.email;

							$ionicPopup.alert({
								title: 'Listo!',
								template: response.msg
							});
						}
					}
				);

			};


			$scope.validateRecoverCode = function (user) {
				$scope.loading = true;
				var Validator = ValidationService.init(user, {
					code: ['required', 'min:6', 'max:6']
				}, {
					code: {
						required: 'Ingrese el código.',
						min: 'El código debe tener exactamante 6 caracteres.',
						max: 'El código debe tener exactamante 6 caracteres.'
					}
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


				UserService.validateRecoverCode(user).then(
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
								title: response.msg,
								template: 'Ya podés cambiar tu contraseña.'
							}).then(
								function(rta) {
									$state.go('change-pass', { 'user': {id: response.user.id, email: response.user.email} });
								}
							);
						}
					}
				)

			};

		}
	]);