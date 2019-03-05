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