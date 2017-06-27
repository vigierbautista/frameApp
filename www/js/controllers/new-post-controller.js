/**
 * Created by Bautista on 27/6/2017.
 */

angular.module('FrameApp.controllers')
    .controller('NewPostCtrl', function ($scope, $ionicPopup, PostsService) {
        $scope.save = function(data) {
           PostsService.create(data).then(
               function(response) {

                   console.log(response.data);
                   // Sí, existe este operador todavía.
                   var title = response.data.status === 1 ? 'Éxito!' : 'Error...';
                   var popup = $ionicPopup.alert({
                       title: title,
                       template: '<p>' + response.data.msg + '</p>',
                       okText: 'Aceptar'
                   });

                   // Si está todo bien, lo enviamos al listado.
                   if(response.data.status === 1) {
                       popup.then(
                           function(gatito) {
                               $state.go('tab.productos');
                           }
                       )
                   }
               }
           );
        };
    });