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