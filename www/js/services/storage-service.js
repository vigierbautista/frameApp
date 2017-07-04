// Definimos el servicio de Categoria.
// Este servicio se va a encargar de lo relacionado al manejo de localStorage.
angular.module('FrameApp.services')
    .service('StorageService', [
        function() {
            /**
             * Guarda el valor en el almacenamiento.
             *
             * @param {string} name
             * @param {*} value
             */
            this.set = function(name, value) {
                localStorage.setItem(name, JSON.stringify(value));
            };

            /**
             * Obtiene el valor del almacenamiento.
             *
             * @param {string} name
             * @returns {*}
             */
            this.get = function(name) {
                return JSON.parse(localStorage.getItem(name));
            };

            /**
             * Verifica si name existe en el almacenamiento.
             *
             * @param {string} name
             * @returns {boolean}
             */
            this.has = function(name) {

                return localStorage.getItem(name) !== null;
            };

            /**
             * Elimina name del almacenamiento.
             *
             * @param {string} name
             */
            this.delete = function(name) {
                localStorage.removeItem(name);
            };
        }
    ]);