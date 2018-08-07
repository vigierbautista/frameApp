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
         * @returns {Promise}
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

                    return response.data;
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

    });