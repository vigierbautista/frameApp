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