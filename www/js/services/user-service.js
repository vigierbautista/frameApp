// Definimos el servicio de autenticación.
// Este servicio debe poder:
// 1. Loguear a un usuario
// 2. Desloguear a un usuario
// 3. Verificar si el usuario está o no logueado
// 4. Llevar un registro de los datos del usuario
//      logueado.
angular.module('FrameApp.services')
    .service('UserService', [
        '$http',
        'StorageService',
        'AuthService',
        '$q',
        /**
         * Servicio de administración de la autenticación.
         *
         * @param $http
         * @param StorageService
         * @param $q
         * @param AuthService
         */
        function($http, StorageService, AuthService, $q) {


            var userData = null;


            /**
             * Retorna una promesa que devuelve los posts.
             * @returns {Promise}
             */
            this.getUser = function () {
                // Creamos nuestra promesa.
                var deferred = $q.defer();

                if(userData === null) {
                    userData = AuthService.getUserData();
                    deferred.resolve(userData);
                } else {
                    // Si ya hay posts los guardamos en el resolve.
                    deferred.resolve(userData);
                }
                // Devolvemos la promesa.
                return deferred.promise;
            };




            /**
             * Edita los datos del usuario
             * Retorna una promesa.
             *
             * @param data
             * @returns {Promise}
             */
            this.edit = function(data) {
                // Acá estamos retornando como venimos haciendo siempre el $http.post para  devolver la promesa.
                // Si embargo, a diferencia de los casos anteriores, en este el mismo método está utilizando ya la promesa.
                // Para que el que llame a este método tenga acceso a los datos de la promesa, los métodos del then deben retornar el resultado que reciben.
                return $http.put('../../frameApi/public/users/edit', data, {
                    'headers': {
                        'X-Token': AuthService.getToken()
                    }
                }).then(
                    function(response) {
                        // Resolve
                        var responseData = response.data;

                        if(responseData.status == 1) {
                            // Guardamos los datos del usuario.

                            userData = {
                                usuario: responseData.data.name,
                                lastName: responseData.data.last_name,
                                id: responseData.data.id,
                                email: responseData.data.email,
                                image: responseData.data.image
                            };

                            // Guardamos los datos en el almacenamiento.
                            StorageService.set('userData', userData);
                            console.log(userData);
                        }
                        // Retornamos la respuesta, para que esté disponible para los lugares que llamen a este método.
                        return response;
                    },
                    function(response) {
                        // Reject
                        // Idem arriba.
                        return response;
                    }
                );
            };

        }
    ]);