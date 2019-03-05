// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'FrameApp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'FrameApp.services' is found in services.js
// 'FrameApp.controllers' is found in controllers.js
angular.module('FrameApp', ['ionic', 'FrameApp.controllers', 'FrameApp.services', 'FrameApp.directives'])
    /**
     * APP RUN CONFIG
     */
	.run(function($ionicPlatform, $rootScope, $ionicPopup, $state, AuthService, CommentsService, UserService) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            if(!AuthService.isLogged()) {

                $state.go('login');

            } else if (AuthService.isLogged()) {

                $state.go('tab.dash');

            }
        });
        $rootScope.$on('$stateChangeStart', function(ev, toState) {
            // ev contiene los datos del evento. toState contiene los datos del state al que estamos tratando de ingresar.
            if(toState.data !== undefined) {
                // Verificamos si el state requiere que el usuario esté autenticado.
                if(toState.data.requireAuth === true) {
                    if (!AuthService.isLogged()) {
                        $ionicPopup.alert({
                            title: 'Error de autenticación',
                            template: 'Para acceder a esta sección, debe primero estar autenticado.'
                        });

                        // Cancelamos la transición al state.
                        ev.preventDefault();
                    }
                } else if(toState.data.redirectToIfLogged !== undefined) {
                    // Verificamos si el usuario está autenticado
                    if (AuthService.isLogged()) {
                        // Redireccionamos al usuario a donde nos indica el atribto del data.
                        ev.preventDefault();
                        $state.go(toState.data.redirectToIfLogged);
                    }
                }
            }

            CommentsService.clear();

        });


		var DEV = false;
		/**
		 * Definimos la variable global con la ruta a la API.
		 * @type {string}
		 */
		//$rootScope.API_PATH = DEV? '../../frameApi/public_html/' : 'http://u388058213.hostingerapp.com/';
		$rootScope.API_PATH = DEV? '../../frameApi/public_html/' : 'http://web-frame.site/';
    })

	/**
     * APP GLOBAL CONFIG
	 */
	.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })

            // Each tab has its own nav history stack:

            .state('login', {
                url: '/login',
                data : {
                    redirectToIfLogged: 'tab.dash'
                },
                templateUrl: 'templates/login-form.html',
                controller: 'LoginCtrl'
            })

            .state('send-recover-pass', {
                url: '/recover',
                cache: false,
                templateUrl: 'templates/login-recover-pass.html',
                controller: 'RecoverPassCtrl',
                data : {
                    redirectToIfLogged: 'tab.dash'
                }

            })

            .state('change-pass', {
                url: '/change-pass',
                templateUrl: 'templates/change-pass.html',
                controller: 'ChangePassCtrl',
                cache: false,
                params: {
                    user: null
                },
                data: {
                    requireAuth: false,
                    redirectToIfLogged: 'tab.dash'
                }
            })

            .state('register', {
                url: '/register',
                data : {
                    redirectToIfLogged: 'tab.dash'
                },
                cache: false,
                templateUrl: 'templates/login-register.html',
                controller: 'RegisterCtrl'
            })

            .state('tab.dash', {
                url: '/dash',
                data: {
                    requireAuth: true
                },
                cache: false,
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })
            .state('tab.dash-new', {
                data: {
                    requireAuth: true
                },
                cache: false,
                url: '/dash/new',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-new-post.html',
                        controller: 'NewPostCtrl'
                    }
                }
            })
            .state('tab.dash-detail', {
                data: {
                    requireAuth: true
                },
                url: '/dash/:postId',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-detail-post.html',
                        controller: 'DetailPostCtrl'
                    }
                }
            })

            /*
            .state('tab.chats', {
                url: '/chats',
                data: {
                    requireAuth: true
                },
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })

            .state('tab.chat-detail', {
                url: '/chats/:chatId',
                data: {
                    requireAuth: true
                },
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                }
            })
            */
            .state('tab.profile', {
                url: '/profile',
                data: {
                    requireAuth: true,
                    refresh: true
                },
                cache: false,
                views: {
                    'tab-profile': {
                        templateUrl: 'templates/tab-profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })
            .state('tab.profile-options', {
                data: {
                    requireAuth: true
                },
                url: '/profile/options',
                cache: false,
                views: {
                    'tab-profile': {
                        templateUrl: 'templates/tab-profile-options.html',
                        controller: 'ProfileOptionsCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/dash');

        // Custom back button. Removes text.
		$ionicConfigProvider.backButton.previousTitleText(false).text('');
    });

angular.module('FrameApp.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('ProfileCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

angular.module('FrameApp.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

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
angular.module('FrameApp.controllers')
    .controller('DashCtrl', function ($scope, $timeout, PostsService, CategoriesService, AuthService) {

        /**
         * Referencia de todos los posts existentes para usarlos como base para los filtros
         * @type {Array}
         */
        var allposts = [];

        $scope.User = AuthService.getUserData();

        $scope.loading = true;

        $scope.posts = [];

        $scope.categories = [];

        $scope.likedByUser = false;


        CategoriesService.getCategories().then(
            function(categories) {

                var scope_cat = [];

                for (var i in categories) {
                    scope_cat.push(categories[i]);
                }
                scope_cat.unshift({
                    id: 0,
                    category: 'Todas'
                });

                $scope.categories = scope_cat;
                $scope.category = $scope.categories[0].id
            }
        );

        PostsService.getPosts().then(
            function(posts) {

                // Definimos los posts que están likeados por el usuario
                for (var i in posts) {
                    for(var j in posts[i].likes){
                        if (posts[i].likes[j].id_user == $scope.User.id) {
                            posts[i].likedByUser = true;
                        } else {
                            posts[i].likedByUser = false;
                        }
                    }
                }

                $scope.posts = posts;
                allposts = posts;
                $scope.loading = false;
            }
        );

        /**
         * Filtra los posts por categoría
         * @param category
         */
        $scope.applyFilter = function (category) {
            $scope.loading = true;

            $timeout(function () {
                if (category == 0) {
                    $scope.posts = allposts;
                    $scope.loading = false;
                    return;
                }

                var filtered = [];

                for (var i in allposts) {
                    if (allposts[i].id_category == category) filtered.push(allposts[i]);
                }

                $scope.posts = filtered;

                $scope.loading = false;
            }, 500);
        };
        
        $scope.submitLike = function (post_id) {

            var post;

            for (var i in $scope.posts) {
                if ($scope.posts[i].id == post_id) {
                    $scope.posts[i].likedByUser = !$scope.posts[i].likedByUser;
                    post = $scope.posts[i];

                }
            }

            PostsService.likePost({
                'post_id': post_id,
                'user_id': $scope.User.id,
                'liked': post.likedByUser
            }).then(
                function (response) {
                    var responseData = response.data;

                    for (var i in $scope.posts) {
                        if ($scope.posts[i].id == responseData.post_id) {

                            if (responseData.liked) {
                                $scope.posts[i].likes.push({
                                    'id_user': $scope.User.id,
                                    'id_post': responseData.post_id,
                                    'image': $scope.User.image,
                                    'name': $scope.User.name,
                                    'last_name': $scope.User.last_name
                                });

                            } else {
                                
                                for (var j in $scope.posts[i].likes) {
                                    if ($scope.posts[i].likes[j].id_post == responseData.post_id && $scope.posts[i].likes[j].id_user == responseData.user_id) {
                                        $scope.posts[i].likes.splice(j)
                                    }
                                }
                                
                            }

                        }
                    }

                }
            );
        };
    });

angular.module('FrameApp.controllers')
    .controller('DetailPostCtrl', [
        '$scope',
        '$ionicPopup',
        '$state',
        '$stateParams',
        'PostsService',
        'CommentsService',
        'AuthService',
        function($scope, $ionicPopup, $state, $stateParams, PostsService, CommentsService, AuthService) {

            // Caputramos el id del post de los parametros de la ruta.
            var postId = $stateParams.postId;

            // Buscamos la informacion del user.
            var user = AuthService.getUserData();

            $scope.likedByUser = false;

            $scope.loading = false;

            // Pasamos los datos útiles al $scope.
            $scope.comment = {
                comment: '',
                date_added: null,
                id_user: user.id,
                id_post: postId
            };
            /**
             * Traemos la información del post
             */
            PostsService.get(postId).then(
                function(data) {
                    $scope.post = data.post;
                }
            );

            /**
             * Traemos los comentarios del post
             */
            $scope.comments = [];
            CommentsService.getFromPosts(postId).then(
                function(data) {
                    $scope.comments = data;
                }
            );


            $scope.save = function(data) {
                if(!data.comment) {
                    return;
                }
                $scope.loading = true;

                CommentsService.save(data).then(
                    function(response) {
                        $scope.loading = false;

                        var responseData = response.data;

                        // Verificamos si tuvimos éxito  o no.
                        if(responseData.status == 0) {
							var error_msg = '';
							for (var i in responseData.errors) {
								error_msg += responseData.errors[i] + '<br>';
							}

							$ionicPopup.alert({
								title: responseData.msg,
								template: error_msg
							});

                        } else {
                            $scope.comments = CommentsService.getComments();
                            $scope.comment.comment = '';
                        }

                    }
                );
            };


            $scope.submitLike = function () {

                $scope.post.likedByUser = !$scope.post.likedByUser;

                PostsService.likePost({
                    'post_id': $scope.post.id,
                    'user_id': user.id,
                    'liked': $scope.post.likedByUser
                }).then(
                    function (response) {
                        var responseData = response.data;

                        if (responseData.liked) {
                            $scope.post.likes.push({
                                'id_user': user.id,
                                'id_post': responseData.post_id,
                                'image': user.image,
                                'name': user.name,
                                'last_name': user.last_name
                            });

                        } else {

                            for (var i in $scope.post.likes) {
                                if ($scope.post.likes[i].id_post == responseData.post_id && $scope.post.likes[i].id_user == responseData.user_id) {
                                    $scope.post.likes.splice(i)
                                }
                            }

                        }

                    }
                );
            };

        }
    ]);

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
/**
 * Created by Bautista on 27/6/2017.
 */

angular.module('FrameApp.controllers')
    .controller('NewPostCtrl', function ($scope, $state, $ionicPopup, PostsService, CategoriesService, AuthService, ValidationService) {

        var user = AuthService.getUserData();

		$scope.date = new Date();

		$scope.categories = [];

		$scope.loading = false;

		CategoriesService.getCategories().then(
			function(categories) {
				$scope.categories = categories;
				$scope.post = {
					title: '',
					content: '',
					image: '',
					date_added: null,
					id_category: $scope.categories[0].id,
					id_user: user.id
				};
			}
		);


        $scope.save = function(data) {
			$scope.loading = true;

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

				$scope.loading = false;
				return;
            }

            PostsService.create(data).then(
                function(response) {
					$scope.loading = false;

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
					$scope.loading = false;

					$ionicPopup.alert({
						title: 'Error',
						template: "No pudimos conectarnos. Intente de nuevo más tarde."
					});
				}
            );
        };
    });
// Abrimos el módulo de controllers, definido en
// controllers.js
angular.module('FrameApp.controllers')
    .controller('ProfileCtrl', [
        '$scope',
        '$ionicPopup',
        '$state',
        'AuthService',
        'UserService',
        function($scope, $ionicPopup, $state, AuthService, UserService) {
            $scope.user = null;
            UserService.getUser().then(
                function(user) {
                    $scope.user = {
                        name: user.name,
                        last_name: user.last_name,
                        email: user.email,
                        image: user.image
                    };
                }
            );

        }
    ]);
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

            $scope.loading = false;


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
                        $scope.loading = true;
                        // Si confirma enviamos los datos
                        UserService.edit(editData).then(
                            function(response) {
                                $scope.loading = false;
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
angular.module('FrameApp.directives', [])
	.directive('fileModel', function($parse) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;

				element.bind('change', function(){
					scope.$apply(function(){
						modelSetter(scope, element[0].files[0]);
					});
				});
			}
		};
	});
// Definimos el servicio de autenticación.
// Este servicio debe poder:
// 1. Loguear a un usuario
// 2. Desloguear a un usuario
// 3. Verificar si el usuario está o no logueado
// 4. Llevar un registro de los datos del usuario
//      logueado.
angular.module('FrameApp.services')
    .service('AuthService', [
        '$http',
        '$rootScope',
        'StorageService',
        /**
         * Servicio de administración de la autenticación.
         *
         * @param $http
         * @param $rootScope
         * @param StorageService
         */
        function($http, $rootScope, StorageService) {

            // Definimos algunas variables internas
            var token = null;
            var userData = null;

            // Verificamos si hay valores almacenados de autenticación.

            loadAuthDataFromStorage();

            /**
             * Intenta loguear al usuario.
             * Retorna una promesa.
             *
             * @param data
             * @returns {Promise}
             */
            this.login = function(data) {
                // Acá estamos retornando como venimos haciendo siempre el $http.post para  devolver la promesa.
                // Si embargo, a diferencia de los casos anteriores, en este el mismo método está utilizando ya la promesa.
                // Para que el que llame a este método tenga acceso a los datos de la promesa, los métodos del then deben retornar el resultado que reciben.
                return $http.post($rootScope.API_PATH + 'login', data, {
                    'headers': {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function(response) {
                        // Resolve
                        var responseData = response.data;
                        if(responseData.status == 1) {
                            // Guardamos los datos del usuario.
                            userData = {
                                name: responseData.data.name,
                                last_name: responseData.data.last_name,
                                id: responseData.data.id,
                                email: responseData.data.email,
                                image: responseData.data.image
                            };
                            token = responseData.token;

                            // Guardamos los datos en el almacenamiento.
                            StorageService.set('token', token);
                            StorageService.set('userData', userData);
                        }
                        // Retornamos la respuesta, para que esté disponible para los lugares que llamen a este método.
                        return response;
                    },
                    function(response) {
                        // Reject
                        // Idem arriba.
                        return response;

                    }
                )
            };


            /**
             * Registra un nuevo usuario
             * @param data
             * @returns {*}
             */
            this.register = function (data) {
                return $http.post($rootScope.API_PATH + 'register', data).then(
                    function(response) {
                        var responseData = response.data;
                        if(responseData.status == 1) {
                            // Guardamos los datos del usuario.
                            userData = {
                                name: responseData.data.name,
                                last_name: responseData.data.last_name,
                                id: responseData.data.id,
                                email: responseData.data.email,
                                image: responseData.data.image
                            };
                            token = responseData.token;

                            // Guardamos los datos en el almacenamiento.
                            StorageService.set('token', token);
                            StorageService.set('userData', userData);
                        }

                        // Retornamos la respuesta, para que esté disponible para los lugares que llamen a este método.
                        return response;
                    },
                    function(response) {
                        // Reject
                        // Idem arriba.
                        return response;
                    }
                );
            };

            /**
             * Cierra la sesión del usuario.
             */
            this.logout = function() {
                token = null;
                userData = null;

                // Borramos las variables del almacenaje.
                StorageService.delete('token');
                StorageService.delete('userData');
            };

            /**
             * Retorna el token si existe. Null si no
             * existe.
             *
             * @returns {string|null}
             */
            this.getToken = function() {
                return token;
            };

            this.setToken = function (string) {
                token = string;
            };

            /**
             * Retorna lso datos del usuario si existe. Null si no
             * existe.
             *
             * @returns {string|null}
             */
            this.getUserData = function() {
                return userData;
            };

            this.setUserData = function(object) {
                userData = object;
            };

            /**
             * Indica si el usuario está logueado
             * en la aplicación.
             *
             * @returns {boolean}
             */
            this.isLogged = function() {
                return userData !== null || typeof token == 'undefined';
            };

            /**
             * Verifica si hay datos de autenticación
             * almacenados previamente en localStorage.
             * De haberlos, autentica al usuario.
             */
            function loadAuthDataFromStorage() {
                if(StorageService.has('token')) {
                    token = StorageService.get('token');
                    userData = StorageService.get('userData');
                }
            }
        }
    ]);
angular.module('FrameApp.services')
    .service('CategoriesService', function ($http, $q, $rootScope) {

        var categories = [];

        /**
         * Trae todas las categorias.
         * @returns {Promise}
         */
        this.getAll = function() {
            return $http.get($rootScope.API_PATH + 'categories')
        };


        /**
         * Retorna una promesa que devuelve las categorias.
         * @returns {Promise}
         */
        this.getCategories = function () {
            var deferred = $q.defer();

            if(categories.length === 0) {
                this.getAll().then(
                    function(response) {
                        var responseData = response.data;
                        categories = responseData.data;

                        deferred.resolve(categories);
                    },
                    function () {
                        deferred.reject('Error trayendo las categorias');
                    })
            } else {
                deferred.resolve(categories);
            }
            return deferred.promise;
        };

    });
/**
 * Created by Bautista on 3/7/2017.
 */
angular.module('FrameApp.services')
    .service('CommentsService', function($http, $q, $rootScope, AuthService) {
        /**
         * Array con todos los comentarios.
         * @type {Array}
         */
        var comments = [];


        /**
         * Trae todos los comentarios.
         * @returns {Promise}
         */
        this.getAll = function(id) {
            return $http.get($rootScope.API_PATH + 'comments/' + id);
        };


        /**
         * Busca todos los commentarios de un post.
         * @param postId
         * @returns {*}
         */
        this.getFromPosts = function (postId) {

            // Creamos nuestra promesa.
            var deferred = $q.defer();

            if(comments.length === 0) {
                // Si no hay comments los traemos a todos.
                this.getAll(postId).then(
                    function(response) {
                        var responseData = response.data;
                        // En caso de exito guardamos los comments en el resolve de la promesa.
                        comments = responseData.post;
                        deferred.resolve(comments);
                    },
                    function () {
                        // En caso de error guardamos un mensaje en el reject de la promesa.
                        deferred.reject('Error trayendo los comentarios');
                    })
            } else {
                // Si ya hay comments los guardamos en el resolve.
                deferred.resolve(comments);
            }
            // Devolvemos la promesa.
            return deferred.promise;
        };

        /**
         * Crea un nuevo comentario.
         * Hace la llamada para agregarlo a la base y luego lo agrega al array de comentarios.
         * @param newComment
         * @returns {response} Devuelve la respuesta de la Api.
         */
        this.save = function (newComment) {
            return $http.post($rootScope.API_PATH + 'comments/save', newComment, {
                'headers': {
                    'X-Token': AuthService.getToken()
                }
            }).then(function(response) {
                    var responseData = response.data;
                    // Verificamos si grabó bien.
                    if(responseData.status == 1) {
                        comments.unshift(responseData.data);
                    }

                    return response;
                },
                function(response) {
                    return response;
                }
            );
        };

        this.getComments = function () {
            return comments;
        };

        this.clear = function() {
            comments = [];
        }

    });
/**
 * Created by Bautista on 25/6/2017.
 */
angular.module('FrameApp.services')
    .service('PostsService', function ($http, $q, $rootScope, AuthService) {
        /**
         * Variable que contendría los posts
         * @type Array
         */
        var posts = [];

        /**
         * Trae todos los posts.
         * @returns {Promise}
         */
        this.getAll = function() {
            return $http.get($rootScope.API_PATH + 'posts')
        };

        /**
         * Retorna una promesa que devuelve los posts.
         * @returns {Promise}
         */
        this.getPosts = function () {
            // Creamos nuestra promesa.
            var deferred = $q.defer();

            if(posts.length === 0) {
                // Si no hay posts los traemos a todos.
                this.getAll().then(
                    function(response) {
                        var responseData = response.data;
                        // En caso de exito guardamos los posts en el resolve de la promesa.
                        posts = responseData.data;

                        deferred.resolve(posts);
                    },
                    function () {
                        // En caso de error guardamos un mensaje en el reject de la promesa.
                        deferred.reject('Error trayendo los posts');
                    })
            } else {
                // Si ya hay posts los guardamos en el resolve.
                deferred.resolve(posts);
            }
            // Devolvemos la promesa.
            return deferred.promise;
        };

        /**
         * Trae un post especifico.
         * @param id
         * @returns {response} Devuelve la respuesta de la Api.
         */
        this.get = function (id) {

            if (posts.length === 0) {
                return $http.get($rootScope.API_PATH + 'posts/' + id, {
                    'headers': {
                        'X-Token': AuthService.getToken()
                    }
                }).then(function(response) {

                        return response.data;
                    },
                    function(response) {
                        return response;
                    }
                );
            } else {
                var deferred = $q.defer();

                for (var i in posts) {
                    if (posts[i].id == id) deferred.resolve({ 'status': 1, 'post': posts[i] });
                }

                return deferred.promise;
            }

        };

        /**
         * Crea un nuevo post.
         * Hace la llamada para agregarlo a la base y luego lo agrega al array posts
         * @param newPost
         * @returns {response} Devuelve la respuesta de la Api.
         */
        this.create = function (newPost) {

			var payload = new FormData();

			payload.append("title", newPost.title);
			payload.append('content', newPost.content);
			payload.append('image', newPost.image);
			payload.append('id_user', newPost.id_user);
			payload.append('id_category', newPost.id_category);
			payload.append('date_added', newPost.date_added);

            return $http.post($rootScope.API_PATH + 'posts/save', payload, {
                'headers': {
                    'transformRequest': angular.identity,
                    'Content-Type': undefined,
                    'Process-Data': false,
                    'X-Token': AuthService.getToken()
                }
            }).then(function(response) {
                    var responseData = response.data;
                    // Verificamos si grabó bien.
                    if(responseData.status == 1) {
                        posts.unshift(responseData.data);
                    }
                    return response;
                },
                function(response) {
                    return response;
                }
            );
        };


        this.likePost = function (data) {
            return $http.post($rootScope.API_PATH + 'posts/like', data, {
                'headers': {
                    'X-Token': AuthService.getToken()
                }
            }).then(function (response) {
                return response;
            })
        }

    });
// Definimos el servicio de Categoria.
// Este servicio se va a encargar de lo relacionado al manejo de localStorage.
angular.module('FrameApp.services')
    .service('StorageService', [
        function() {
            /**
             * Guarda el valor en el almacenamiento.
             *
             * @param {string} name
             * @param {*} value
             */
            this.set = function(name, value) {
                localStorage.setItem(name, JSON.stringify(value));
            };

            /**
             * Obtiene el valor del almacenamiento.
             *
             * @param {string} name
             * @returns {*}
             */
            this.get = function(name) {
                return JSON.parse(localStorage.getItem(name));
            };

            /**
             * Verifica si name existe en el almacenamiento.
             *
             * @param {string} name
             * @returns {boolean}
             */
            this.has = function(name) {

                return localStorage.getItem(name) !== null;
            };

            /**
             * Elimina name del almacenamiento.
             *
             * @param {string} name
             */
            this.delete = function(name) {
                localStorage.removeItem(name);
            };
        }
    ]);
// Definimos el servicio de autenticación.
// Este servicio debe poder:
// 1. Loguear a un usuario
// 2. Desloguear a un usuario
// 3. Verificar si el usuario está o no logueado
// 4. Llevar un registro de los datos del usuario
//      logueado.
angular.module('FrameApp.services')
    .service('UserService', [
        '$http',
        '$rootScope',
        'StorageService',
        'AuthService',
        '$q',
		/**
		 * Servicio de administración de la autenticación.
		 *
		 * @param $http
		 * @param $rootScope
		 * @param StorageService
		 * @param $q
		 * @param AuthService
		 */
        function($http, $rootScope,  StorageService, AuthService, $q) {


            var userData = null;


            /**
             * Retorna una promesa que devuelve los posts.
             * @returns {Promise}
             */
            this.getUser = function () {
                // Creamos nuestra promesa.
                var deferred = $q.defer();

                if(userData === null) {
                    userData = AuthService.getUserData();
                    deferred.resolve(userData);
                } else {
                    // Si ya hay posts los guardamos en el resolve.
                    deferred.resolve(userData);
                }
                // Devolvemos la promesa.
                return deferred.promise;
            };




            /**
             * Edita los datos del usuario
             * Retorna una promesa.
             *
             * @param data
             * @returns {Promise}
             */
            this.edit = function(data) {

                var payload = new FormData();

                payload.append("id", data.id);
                payload.append('name', data.name);
                payload.append('last_name', data.last_name);
                payload.append('email', data.email);

                if (data.image) {
                    payload.append('image', data.image);
                }

                // Acá estamos retornando como venimos haciendo siempre el $http.post para  devolver la promesa.
                // Si embargo, a diferencia de los casos anteriores, en este el mismo método está utilizando ya la promesa.
                // Para que el que llame a este método tenga acceso a los datos de la promesa, los métodos del then deben retornar el resultado que reciben.
                return $http.post($rootScope.API_PATH + 'users/edit', payload, {
                    'headers': {
                        'transformRequest': angular.identity,
                        'Content-Type': undefined,
                        'Process-Data': false,
                        'X-Token': AuthService.getToken()
                    }
                }).then(
                    function(response) {
                        // Resolve
                        var responseData = response.data;

                        if(responseData.status == 1) {
                            // Guardamos los datos del usuario.

                            userData = {
                                id: responseData.data.id,
                                name: responseData.data.name,
                                last_name: responseData.data.last_name,
                                email: responseData.data.email,
                                image: responseData.data.image
                            };

                            // Guardamos los datos en el almacenamiento.
                            AuthService.setUserData(userData);
                            StorageService.set('userData', userData);
                        }
                        // Retornamos la respuesta, para que esté disponible para los lugares que llamen a este método.
                        return response;
                    },
                    function(response) {
                        // Reject
                        // Idem arriba.
                        return response;
                    }
                );
            };


            this.sendRecoverCode = function (email) {
                return $http.post($rootScope.API_PATH + 'users/send-recover-code',{
                    'email': email
                }).then(
                    function (response) {
                        if (response.status != 200) {
                            return {
                                'status': 0,
                                'msg': 'Error al conectarse'
                            }
                        }

                        return response.data;
                    },
                    function (response) {
                        return {
                            'status': 0,
                            'msg': 'Error al conectarse'
                        }
                    }
                );
            };
            
            
            this.validateRecoverCode = function (user) {
                return $http.post($rootScope.API_PATH + 'users/validate-recover-code', {
                   'id': user.id,
                   'code': user.code,
                   'email': user.email
                }).then(
                    function (response) {
                        if (response.status != 200) {
                            return {
                                'status': 0,
                                'msg': 'Error al conectarse'
                            }
                        }

                        return response.data;
                    },
                    function (response) {
                        return {
                            'status': 0,
                            'msg': 'Error al conectarse'
                        }
                    }
                );
            };


            this.changePass = function (user) {
                return $http.post($rootScope.API_PATH + 'users/change-pass', user).then(
                    function (response) {
                        if (response.status != 200) {
                            return {
                                'status': 0,
                                'msg': 'Error al conectarse'
                            }
                        }

                        return response.data;
                    },
                    function (response) {
                        return {
                            'status': 0,
                            'msg': 'Error al conectarse'
                        }
                    }
                );
            }

        }
    ]);
/**
 * Definimos el servicio de Validación de datos.
 * Este servicio se va a encargar de validar los datos que ingrese el usuario.
 */
angular.module('FrameApp.services')
	.service('ValidationService', [
		function() {
			var self = this,
				_data,
				_rules,
				_msgs,
				_errors = {};

			/**
			 * Validator Constructor
			 * @param data
			 * @param rules
			 * @param msgs
			 */
			this.init = function (data, rules, msgs) {
				_data = data;
				_rules = rules;
				_msgs = msgs;
				_errors = {};
				validate();
				return self;
			};

			/**
			 * LLama a la validación de cada regla.
			 */
			 var validate = function () {
				for (var field in _rules) {
					if(_rules.hasOwnProperty(field)) {

						for (var rule in _rules[field]) {
							if(_rules[field].hasOwnProperty(rule)) {

								var rule_value = _rules[field][rule];
								if (!callValidation(rule_value, field)) break;

							}
						}

					}
				}
			};

			/**
			 * LLama define los parametros que tiene que recibir el metodo de validación.
			 * @param rule
			 * @param field
			 * @return {*}
			 */
			var callValidation = function (rule, field) {

				var ruleData = rule.split(':');
				var method = '_' + ruleData[0];

				if (self.hasOwnProperty(method)) {

					if (typeof self[method] == 'function') {

						switch (ruleData.length) {
							case 1:
								return self[method](field);
							case 2:
								return self[method](field, ruleData[1]);
							case 3:
								return self[method](field, ruleData[1], ruleData[2]);
						}

					} else {
						console.error('Undefined validation method: ' + rule + ', for field: ' + field);
						return false;
					}

				}

			};



			//////////////////////////////////////////
			////////    VALIDATIONS     ///////////
			////////////////////////////////////

			/**
			 * Valida que el campo no esté vacío
			 * @param field
			 * @return {boolean}
			 * @private
			 */
			this._required = function (field) {
				if (_data[field] == '' ||  typeof _data[field] == 'undefined' ||  _data[field] == null) {
					self.addError(field, _msgs[field]['required']);
					return false;
				}

				return true;
			};


			/**
			 * Valida si el campo es más grande que lo indicado.
			 * @param field
			 * @param than
			 * @return {boolean}
			 * @private
			 */
			this._greater = function (field, than) {
				switch (typeof _data[field]) {
					case 'string':
						if (Date.parse(_data[field]) < Date.parse(than)) {
							self.addError(field, _msgs[field]['greater']);
							return false;
						}
						break;

					case 'number':
						if (_data[field] < than) {
							self.addError(field, _msgs[field]['greater']);
							return false;
						}
						break;
				}

				return true;
			};

			/**
			 * Valida si el campo es más chico que lo indicado.
			 * @param field
			 * @param than
			 * @return {boolean}
			 * @private
			 */
			this._smaller = function (field, than) {
				switch (typeof _data[field]) {
					case 'string':
						if (Date.parse(_data[field]) > Date.parse(than)) {
							self.addError(field, _msgs[field]['smaller']);
							return false;
						}
						break;

					case 'number':
						if (_data[field] > than) {
							self.addError(field, _msgs[field]['smaller']);
							return false;
						}
						break;
				}

				return true;
			};

			/**
			 * Valida si el campo es más corto que lo indicado.
			 * @param field
			 * @param than
			 * @return {boolean}
			 * @private
			 */
			this._min = function (field, than) {
				if (_data[field].length < than) {
					self.addError(field, _msgs[field]['min']);
					return false;
				}

				return true;
			};


			/**
			 * Valida si el campo es más largo que lo indicado.
			 * @param field
			 * @param than
			 * @return {boolean}
			 * @private
			 */
			this._max = function (field, than) {
				if (_data[field].length > than) {
					self.addError(field, _msgs[field]['max']);
					return false;
				}

				return true;
			};


			/**
			 * Valida si el campo tiene formato de email.
			 * @param field
			 * @return {boolean}
			 * @private
			 */
			this._email = function (field) {
				var regex = /^([\w-\.]+)@((?:[\w]+\.)+)([a-z]{2,4})/;
				if(!regex.test(_data[field])) {
					self.addError(field, _msgs[field]['email']);
					return false;
				}

				return true;
			};


			/**
			 * Valida que el campo sea numérico.
			 * @param field
			 * @return {boolean}
			 * @private
			 */
			this._numeric = function (field) {
				if(isNaN(_data[field])) {
					self.addError(field, _msgs[field]['numeric']);
					return false;
				}

				return true;
			};


			/**
			 * Valida que el campo tenga al menos 5 caracteres, 1 número y 1 mayúscula.
			 * @param field
			 * @returns {boolean}
			 * @private
			 */
			this._password = function (field) {
				if (
					_data[field].length < 5
					|| !/[0-9]/.test(_data[field])
					|| !/[A-Z]/.test(_data[field])
				) {
					self.addError(field, _msgs[field]['password']);
					return false;
				}

				return true;

			};


			/**
			 * Valida que el campo sea igual al campo indicado.
			 * @param field
			 * @param otherField
			 * @return {boolean}
			 * @private
			 */
			this._equal = function (field, otherField) {
				if (_data[field] !== _data[otherField]) {
					self.addError(field, _msgs[field]['equal']);
					return false;
				}

				return true;
			};


			/**
			 * Valido que el campo tenga el formato de fecha.
			 * @param field
			 * @return {boolean}
			 * @private
			 */
			this._dateformat = function (field) {
				var regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
				if (!regex.test(_data[field])) {
					self.addError(field, _msgs[field]['dateformat']);
					return false;
				}

				return true;
			};


			///////////////////////////////////////
			////////    HANDLERS     ///////////
			/////////////////////////////////

			/**
			 * Agrega un error.
			 * @param field
			 * @param msg
			 */
			this.addError = function (field, msg) {
				_errors[field] = msg;
			};


			/**
			 * Retorna los errores.
			 * @return {{}}
			 */
			this.getErrors = function () {
				return _errors;
			};


			/**
			 * Retorna si es válido.
			 * @return {boolean}
			 */
			this.isValid = function () {
				if (_errors.length > 0) return false;

				var length = 0;

				for (var i in _errors) {
					if (_errors.hasOwnProperty(i)) length++;
				}

				return length <= 0;

			};


			/**
			 * Retorna si es inválido.
			 * @return {boolean}
			 */
			this.isInvalid = function () {
				return !self.isValid();
			}
		}
	]);