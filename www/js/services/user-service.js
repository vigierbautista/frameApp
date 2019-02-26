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
        '$rootScope',
        'StorageService',
        'AuthService',
        '$q',
		/**
		 * Servicio de administración de la autenticación.
		 *
		 * @param $http
		 * @param $rootScope
		 * @param StorageService
		 * @param $q
		 * @param AuthService
		 */
        function($http, $rootScope,  StorageService, AuthService, $q) {


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

                var payload = new FormData();

                payload.append("id", data.id);
                payload.append('name', data.name);
                payload.append('last_name', data.last_name);
                payload.append('email', data.email);

                if (data.image) {
                    payload.append('image', data.image);
                }

                // Acá estamos retornando como venimos haciendo siempre el $http.post para  devolver la promesa.
                // Si embargo, a diferencia de los casos anteriores, en este el mismo método está utilizando ya la promesa.
                // Para que el que llame a este método tenga acceso a los datos de la promesa, los métodos del then deben retornar el resultado que reciben.
                return $http.post($rootScope.API_PATH + 'users/edit', payload, {
                    'headers': {
                        'transformRequest': angular.identity,
                        'Content-Type': undefined,
                        'Process-Data': false,
                        'X-Token': AuthService.getToken()
                    }
                }).then(
                    function(response) {
                        // Resolve
                        var responseData = response.data;

                        if(responseData.status == 1) {
                            // Guardamos los datos del usuario.

                            userData = {
                                id: responseData.data.id,
                                name: responseData.data.name,
                                last_name: responseData.data.last_name,
                                email: responseData.data.email,
                                image: responseData.data.image
                            };

                            // Guardamos los datos en el almacenamiento.
                            AuthService.setUserData(userData);
                            StorageService.set('userData', userData);
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