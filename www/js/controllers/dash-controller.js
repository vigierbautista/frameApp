/**
 * Created by Bautista on 25/6/2017.
 */

angular.module('FrameApp.controllers')
    .controller('DashCtrl', function ($scope, PostsService, CategoriesService) {
        var allposts = [];

        $scope.posts = [];

        $scope.categories = [];


        CategoriesService.getCategories().then(
            function(categories) {
                $scope.categories = categories;
                $scope.categories.unshift({
                    id: 0,
                    category: 'Todas'
                });
                $scope.category = $scope.categories[0].id
            }
        );

        PostsService.getPosts().then(
            function(posts) {
                $scope.posts = posts;
                allposts = posts;
            }
        );

        /**
         * Filtra los posts por categoría
         * @param category
         */
        $scope.applyFilter = function (category) {

            if (category == 0) {
                $scope.posts = allposts;
                return;
            }

            var filtered = [];

            for (var i in allposts) {
                console.log(allposts[i]);
                if (allposts[i].id_category == category) filtered.push(allposts[i]);
            }

            $scope.posts = filtered;
        }
    });