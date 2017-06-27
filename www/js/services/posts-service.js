/**
 * Created by Bautista on 25/6/2017.
 */
angular.module('FrameApp.services')
    .service('PostsService', function ($http, $q) {
        /**
         * Variable que contendría los posts
         * @type {null}
         */
        var posts = null;

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

            if(posts === null) {
                // Si no hay posts los traemos a todos.
                this.getAll().then(
                    function(response) {
                        // En caso de exito guardamos los posts en el resolve de la promesa.
                        posts = response.data;
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
         * Crea un nuevo post.
         * Hace la llamada para agregarlo a la base y luego lo agrega al array posts
         * @param newPost
         * @returns {response} Devuelve la respuesta de la Api.
         */
        this.create = function (newPost) {
            return $http.post('../../frameApi/public/posts/save', newPost, {
                'headers': {
                   /* 'X-Token': AuthService.getToken()*/
                }
            }).then(function(response) {
                    var responseData = response.data;
                    console.log(responseData);
                    // Verificamos si grabó bien.
                    if(responseData.status == 1) {
                        // Le agregamos el id a los datos del post.
                        newPost.id = responseData.data.id;
                        // Agregamos el nuevo post.
                        addPost(posts);
                    }

                    return response;
                },
                function(response) {
                    return response;
                }
            );
        };

        /**
         * Agrega un post al array posts.
         * @param newPost
         */
        function addPost(newPost) {
            posts.push(newPost);
        }
    });