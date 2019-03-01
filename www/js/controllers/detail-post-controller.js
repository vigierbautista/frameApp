
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
                CommentsService.save(data).then(
                    function(response) {

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