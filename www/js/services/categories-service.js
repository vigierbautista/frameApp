angular.module('FrameApp.services')
    .service('CategoriesService', function ($http, $q, $rootScope) {

        var categories = [];

        /**
         * Trae todas las categorias.
         * @returns {Promise}
         */
        this.getAll = function() {
            return $http.get($rootScope.API_PATH + 'categories')
        };


        /**
         * Retorna una promesa que devuelve las categorias.
         * @returns {Promise}
         */
        this.getCategories = function () {
            var deferred = $q.defer();

            if(categories.length === 0) {
                this.getAll().then(
                    function(response) {
                        var responseData = response.data;
                        categories = responseData.data;

                        deferred.resolve(categories);
                    },
                    function () {
                        deferred.reject('Error trayendo las categorias');
                    })
            } else {
                deferred.resolve(categories);
            }
            return deferred.promise;
        };

    });