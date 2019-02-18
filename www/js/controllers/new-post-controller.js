/**
 * Created by Bautista on 27/6/2017.
 */

angular.module('FrameApp.controllers')
    .controller('NewPostCtrl', function ($scope, $state, $ionicPopup, PostsService, CategoriesService, AuthService, ValidationService) {

        var user = AuthService.getUserData();

		$scope.categories = [];

		CategoriesService.getCategories().then(
			function(categories) {
				$scope.categories = categories;

				$scope.post = {
					title: null,
					content: null,
					image: null,
					date_added: null,
					id_category: $scope.categories[0].id,
					id_user: user.id
				};
			}
		);


        $scope.save = function(data) {
			var Validator = ValidationService.init(data, {
				title: ['required', 'min:3', 'max:30']
			}, {
				title: {
				    required: 'Ingrese un título.',
                    min: 'El título debe tener al menos 3 caracteres.',
                    max: 'El título no debe tener más de 30 caracteres.'
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
				return;
            }

            PostsService.create(data).then(
                function(response) {

                    var responseData = response.data;

                    // Verificamos si tuvimos éxito  o no.
                    if(responseData.status == 1) {
                        var popup = $ionicPopup.alert({
                            title: 'Éxito',
                            template: responseData.msg
                        });
                        // Redireccionamos al usuario cuando cierre el popup.
                        popup.then(function(rta) {
                            $state.go('tab.dash');
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
                },
				function() {
					// Reject
					$ionicPopup.alert({
						title: 'Error',
						template: "No pudimos conectarnos. Intente de nuevo más tarde."
					});
				}
            );
        };
    });