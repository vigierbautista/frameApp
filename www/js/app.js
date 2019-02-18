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


		var DEV = true;
		/**
		 * Definimos la variable global con la ruta a la API.
		 * @type {string}
		 */
		$rootScope.API_PATH = DEV? '../../frameApi/public_html/' : 'https://frameapi.000webhostapp.com/';
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
                    redirectToIfLogged: 'tab.cuenta'
                },
                templateUrl: 'templates/login-form.html',
                controller: 'LoginCtrl'
            })

            .state('recover-pass', {
                url: '/recover',
                templateUrl: 'templates/login-recover-pass.html',
                controller: 'LoginCtrl'

            })

            .state('register', {
                url: '/register',
                templateUrl: 'templates/login-register.html',
                controller: 'RegisterCtrl'
            })

            .state('tab.dash', {
                url: '/dash',
                data: {
                    requireAuth: true
                },
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
