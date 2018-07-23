// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'FrameApp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'FrameApp.services' is found in services.js
// 'FrameApp.controllers' is found in controllers.js
angular.module('FrameApp', ['ionic', 'FrameApp.controllers', 'FrameApp.services'])

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




    })

    .config(function($stateProvider, $urlRouterProvider) {

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

/**
 * Created by Bautista on 25/6/2017.
 */

angular.module('FrameApp.controllers')
    .controller('DashCtrl', function ($scope, PostsService) {
        $scope.posts = [];

        PostsService.getPosts().then(
            function(posts) {
                $scope.posts = posts;
            }
        );
    });
// Abrimos el módulo de controllers, definido en
// controllers.js
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

            // Pasamos los datos útiles al $scope.
            $scope.comment = {
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
                    console.log(data);
                    $scope.comments = data;
                }
            );


            $scope.save = function(data) {
                if(!data.comment) {
                    return;
                }
                CommentsService.save(data).then(
                    function(response) {

                        var responseData = response.data;

                        // Verificamos si tuvimos éxito  o no.
                        if(responseData.status == 0) {
                            $ionicPopup.alert({
                                title: 'Error...',
                                // TODO: Agregar los errores de validación.
                                template: responseData.msg
                            });

                        }
                    }
                );
            }

        }
    ]);

angular.module('FrameApp.controllers')
    .controller('LoginCtrl', [
        '$scope',
        '$ionicPopup',
        '$state',
        'AuthService',
        function($scope, $ionicPopup, $state, AuthService) {
            $scope.user = {
                name: null,
                password: null
            };

            $scope.login = function(userData) {
                if(!userData.name || !userData.password) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: "Complete el formulario con su nombre y password!"
                    });
                    return;
                }
                AuthService.login(userData).then(
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
                    }
                );
            }
        }
    ]);
/**
 * Created by Bautista on 27/6/2017.
 */

angular.module('FrameApp.controllers')
    .controller('NewPostCtrl', function ($scope, $state, $ionicPopup, PostsService, AuthService) {

        var user = AuthService.getUserData();

        $scope.post = {
            title: null,
            content: null,
            image: null,
            date_added: null,
            id_user: user.id
        };
        $scope.save = function(data) {
            if(!data.title) {
                $ionicPopup.alert({
                    title: 'Error',
                    template: "Para postear se necesita un título al menos."
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
                        $ionicPopup.alert({
                            title: 'Error...',
                            // TODO: Agregar los errores de validación.
                            template: 'Hubo un error al tratar de crear el producto. Por favor, verifique los datos.'
                        });
                    }
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
                    console.log(user);
                    $scope.user = {
                        name: user.usuario,
                        last_name: user.lastName,
                        email: user.email,
                        image: (user.image == null)? 'default.png' : user.image
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
        'StorageService',
        function($scope, $ionicPopup, $state, AuthService, UserService, StorageService) {

            function getUser() {
                userData = StorageService.get('userData');
            }

            // Buscamos la informacion del user.
            var user = AuthService.getUserData();

            $scope.user = {
                id: user.id,
                name: user.usuario,
                last_name: user.lastName,
                email: user.email,
                image: (user.image == null)? 'default.png' : user.image
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

                                    var popup = $ionicPopup.alert({
                                        title: 'Éxito',
                                        template: 'Su información fue modificada exitosamente!'
                                    });
                                    // Redireccionamos al usuario cuando cierre el popup.
                                    popup.then(function(rta) {
                                        $state.go('tab.profile');
                                    });
                                } else {
                                    $ionicPopup.alert({
                                        title: 'Error...',
                                        // TODO: Agregar los errores de validación.
                                        template: responseData.msg
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
                                $state.go('login');
                            }
                        )
                    } else {

                    }
                });


            };
        }
    ]);

angular.module('FrameApp.controllers')
    .controller('RegisterCtrl', [
        '$scope',
        '$ionicPopup',
        '$state',
        'AuthService',
        function($scope, $ionicPopup, $state, AuthService) {
            $scope.user = {
                name: null,
                password: null
            };

            $scope.register = function(userData) {
                console.log(!userData.name && !userData.password && !userData.email && !userData.last_name);

                if(!userData.name) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: "Complete su nombre"
                    });
                    return;
                }
                if(!userData.password) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: "Complete su password"
                    });
                    return;
                }
                if(!userData.email) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: "Complete su email"
                    });
                    return;
                }
                if(!userData.last_name) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: "Complete su apellido"
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
        'StorageService',
        /**
         * Servicio de administración de la autenticación.
         *
         * @param $http
         * @param StorageService
         */
        function($http, StorageService) {

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
                return $http.post('../../frameApi/public/login', data).then(
                    function(response) {
                        // Resolve
                        var responseData = response.data;
                        if(responseData.status == 1) {
                            // Guardamos los datos del usuario.
                            console.log(responseData.data);
                            userData = {
                                usuario: responseData.data.name,
                                lastName: responseData.data.last_name,
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
             * Registra un nuevo usuario
             * @param data
             * @returns {*}
             */
            this.register = function (data) {
                return $http.post('../../frameApi/public/register', data).then(
                    function(response) {
                        var responseData = response.data;
                        if(responseData.status == 1) {
                            console.log(response);
                            // Guardamos los datos del usuario.
                            userData = {
                                usuario: responseData.data.name,
                                lastName: responseData.data.last_name,
                                id: responseData.data.id,
                                email: responseData.data.email,
                                image: responseData.data.image
                            };
                            token = responseData.data.token;

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
            /**
             * Retorna lso datos del usuario si existe. Null si no
             * existe.
             *
             * @returns {string|null}
             */
            this.getUserData = function() {
                return userData;
            };

            /**
             * Indica si el usuario está logueado
             * en la aplicación.
             *
             * @returns {boolean}
             */
            this.isLogged = function() {
                return userData !== null;
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
/**
 * Created by Bautista on 3/7/2017.
 */
angular.module('FrameApp.services')
    .service('CommentsService', function($http, $q, AuthService) {
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
            return $http.get('../../frameApi/public/comments/' + id)
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
                        console.log(comments);
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
         * @param newComments
         * @returns {response} Devuelve la respuesta de la Api.
         */
        this.save = function (newComment) {
            return $http.post('../../frameApi/public/comments/save', newComment, {
                'headers': {
                    'X-Token': AuthService.getToken()
                }
            }).then(function(response) {
                    var responseData = response.data;
                    console.log(responseData);
                    // Verificamos si grabó bien.
                    if(responseData.status == 1) {
                        comments.push(responseData.data);
                    }

                    return response;
                },
                function(response) {
                    return response;
                }
            );
        };



        this.clear = function() {
            comments = [];
        }

    });
/**
 * Created by Bautista on 25/6/2017.
 */
angular.module('FrameApp.services')
    .service('PostsService', function ($http, $q, AuthService) {
        /**
         * Variable que contendría los posts
         * @type Array
         */
        var posts = [];

        /**
         * Trae todos los posts.
         * @returns {HttpPromise}
         */
        this.getAll = function() {
            return $http.get('../../frameApi/public/posts')
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
            return $http.get('../../frameApi/public/posts/' + id, {
                'headers': {
                    'X-Token': AuthService.getToken()
                }
            }).then(function(response) {
                    var responseData = response.data;

                    return responseData;
                },
                function(response) {
                    return response;
                }
            );
        };

        /**
         * Crea un nuevo post.
         * Hace la llamada para agregarlo a la base y luego lo agrega al array posts
         * @param newPost
         * @returns {response} Devuelve la respuesta de la Api.
         */
        this.create = function (newPost) {
            console.log(newPost);
            return $http.post('../../frameApi/public/posts/save', newPost, {
                'headers': {
                    'X-Token': AuthService.getToken()
                }
            }).then(function(response) {
                    var responseData = response.data;
                    console.log(responseData);
                    // Verificamos si grabó bien.
                    if(responseData.status == 1) {
                        posts.push(responseData.data);
                    }

                    return response;
                },
                function(response) {
                    return response;
                }
            );
        };

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
        'StorageService',
        'AuthService',
        '$q',
        /**
         * Servicio de administración de la autenticación.
         *
         * @param $http
         * @param StorageService
         * @param $q
         * @param AuthService
         */
        function($http, StorageService, AuthService, $q) {


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
                // Acá estamos retornando como venimos haciendo siempre el $http.post para  devolver la promesa.
                // Si embargo, a diferencia de los casos anteriores, en este el mismo método está utilizando ya la promesa.
                // Para que el que llame a este método tenga acceso a los datos de la promesa, los métodos del then deben retornar el resultado que reciben.
                return $http.put('../../frameApi/public/users/edit', data, {
                    'headers': {
                        'X-Token': AuthService.getToken()
                    }
                }).then(
                    function(response) {
                        // Resolve
                        var responseData = response.data;

                        if(responseData.status == 1) {
                            // Guardamos los datos del usuario.

                            userData = {
                                usuario: responseData.data.name,
                                lastName: responseData.data.last_name,
                                id: responseData.data.id,
                                email: responseData.data.email,
                                image: responseData.data.image
                            };

                            // Guardamos los datos en el almacenamiento.
                            StorageService.set('userData', userData);
                            console.log(userData);
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

        }
    ]);