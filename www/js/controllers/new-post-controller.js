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