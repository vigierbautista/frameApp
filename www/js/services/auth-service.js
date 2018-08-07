// Definimos el servicio de autenticación.
// Este servicio debe poder:
// 1. Loguear a un usuario
// 2. Desloguear a un usuario
// 3. Verificar si el usuario está o no logueado
// 4. Llevar un registro de los datos del usuario
//      logueado.
angular.module('FrameApp.services')
    .service('AuthService', [
        '$http',
        '$rootScope',
        'StorageService',
        /**
         * Servicio de administración de la autenticación.
         *
         * @param $http
         * @param $rootScope
         * @param StorageService
         */
        function($http, $rootScope, StorageService) {

            // Definimos algunas variables internas
            var token = null;
            var userData = null;

            // Verificamos si hay valores almacenados de autenticación.

            loadAuthDataFromStorage();

            /**
             * Intenta loguear al usuario.
             * Retorna una promesa.
             *
             * @param data
             * @returns {Promise}
             */
            this.login = function(data) {
                // Acá estamos retornando como venimos haciendo siempre el $http.post para  devolver la promesa.
                // Si embargo, a diferencia de los casos anteriores, en este el mismo método está utilizando ya la promesa.
                // Para que el que llame a este método tenga acceso a los datos de la promesa, los métodos del then deben retornar el resultado que reciben.
                return $http.post($rootScope.API_PATH + 'login', data).then(
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
                            token = responseData.token;

                            // Guardamos los datos en el almacenamiento.
                            StorageService.set('token', token);
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


            /**
             * Registra un nuevo usuario
             * @param data
             * @returns {*}
             */
            this.register = function (data) {
                return $http.post($rootScope.API_PATH + 'register', data).then(
                    function(response) {
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
                            token = responseData.token;

                            // Guardamos los datos en el almacenamiento.
                            StorageService.set('token', token);
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

            /**
             * Cierra la sesión del usuario.
             */
            this.logout = function() {
                token = null;
                userData = null;

                // Borramos las variables del almacenaje.
                StorageService.delete('token');
                StorageService.delete('userData');
            };

            /**
             * Retorna el token si existe. Null si no
             * existe.
             *
             * @returns {string|null}
             */
            this.getToken = function() {
                return token;
            };
            /**
             * Retorna lso datos del usuario si existe. Null si no
             * existe.
             *
             * @returns {string|null}
             */
            this.getUserData = function() {
                return userData;
            };

            /**
             * Indica si el usuario está logueado
             * en la aplicación.
             *
             * @returns {boolean}
             */
            this.isLogged = function() {
                return userData !== null || typeof token == 'undefined';
            };

            /**
             * Verifica si hay datos de autenticación
             * almacenados previamente en localStorage.
             * De haberlos, autentica al usuario.
             */
            function loadAuthDataFromStorage() {
                if(StorageService.has('token')) {
                    token = StorageService.get('token');
                    userData = StorageService.get('userData');
                }
            }
        }
    ]);