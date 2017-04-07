app.service('database', ['$http', '$q', ($http, $q) => {
  var service = {};

  service.getList = () => {
    var deferred = $q.defer();

    $http.get('/data/data.json').then(
      (response) => {
        // success
        console.log('qqq SUCCESS data:', response.data);
        deferred.resolve(response.data);
      },
      (response) => {
        // error
        console.error('Failed to retrieve JSON:', response);
        deferred.reject(response);
      }
    );

    return deferred.promise;
  };

  return service;
}]);
