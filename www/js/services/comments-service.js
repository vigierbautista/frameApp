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