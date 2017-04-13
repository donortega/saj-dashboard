'use strict';

var app = angular.module('sajDonOrtega', ['ngAnimate', 'ngTouch', 'ui.bootstrap', 'angular.filter']);
//# sourceMappingURL=main.js.map

'use strict';

app.controller('DashboardCtrl', ['$scope', 'database', function ($scope, database) {
  var self = this;
  var PREFIX = 'sajDO-';

  self.sortBy = '+name';
  self.filters = {};
  self.filterFlags = {
    'availability': {}
  };

  self.init = function () {
    database.getList().then(function (data) {
      self.appList = data;

      self.appList.forEach(function (val, index, arr) {
        // in order to hide additional details by default
        val.isCollapsed = true;

        // check localStorage to see if current applicant is flagged
        if (!localStorage.getItem(PREFIX + val.id)) {
          // applicant not yet stored in localStorage, then create it now
          localStorage.setItem(PREFIX + val.id, 'false');
          val.isFlagged = false;
        } else {
          if (localStorage.getItem(PREFIX + val.id) === 'true') {
            val.isFlagged = true;
          } else {
            val.isFlagged = false;
          }
        }

        // convert date string to milliseconds to facilitate sorting
        var dateArray = val.applied.split('/');
        dateArray[0] = Number.parseFloat(dateArray[0]) - 1;
        dateArray[1] = Number.parseInt(dateArray[1]);
        dateArray[2] = Number.parseInt('20' + dateArray[2]);
        val.appliedJS = new Date(dateArray[2], dateArray[0], dateArray[1]).getTime();
      });
    });
  };

  // toggle flag
  self.toggleFlag = function (id) {
    // find id in appList array
    self.appList.forEach(function (val, index, arr) {
      if (val.id === id) {
        val.isFlagged = !val.isFlagged;
        localStorage.setItem(PREFIX + val.id, '' + val.isFlagged);
      }
    });
  };

  // handle filters
  self.toggleFilter = function (filterName) {
    if (typeof self.filters[filterName] === 'undefined') {
      self.filters[filterName] = true;
    } else {
      delete self.filters[filterName];
    }
  };

  // custom filter for Availability checkboxes
  self.availabilityFilter = function (val, index, arr) {
    if (angular.equals(self.filterFlags.availability, {})) {
      // no Availabilty checkboxes are checked
      return true;
    } else {
      var result = [];
      for (var day in self.filterFlags.availability) {
        var resultDay = false;
        if (val.availability[day] > 0) {
          resultDay = true;
        }
        result.push(resultDay);
      }

      // are all checked Availability checkboxes satisfied
      var filterResult = result.find(function (val) {
        return val === false;
      });
      // if any Availability days are not met, filterResult will not be undefined
      return filterResult === undefined;
    }
  };

  // custom filter for Experience checkbox
  self.experienceFilter = function (val, index, arr) {
    if (!self.experienceInput) {
      // Experience checkbox not checked
      return true;
    } else {
      return val.experience >= self.experienceInput;
    }
  };

  // reset filter input when its corresponding checkbox is unchecked
  $scope.$watch(function () {
    return self.filterFlags;
  }, function (newVal, oldVal) {
    for (var prop in newVal) {
      if (!newVal[prop]) {
        delete self.filters[prop];

        if (prop === 'experience') {
          self.experienceInput = '';
        }
      }
    }

    for (var day in newVal.availability) {
      if (!newVal.availability[day]) {
        delete self.filterFlags.availability[day];
      }
    }
  }, true);
}]);
//# sourceMappingURL=dashboard.js.map

'use strict';

app.service('database', ['$http', '$q', function ($http, $q) {
  var service = {};

  service.getList = function () {
    var deferred = $q.defer();

    $http.get('/data/data.json').then(function (response) {
      // success
      deferred.resolve(response.data);
    }, function (response) {
      // error
      console.error('Failed to retrieve JSON:', response);
      deferred.reject(response);
    });

    return deferred.promise;
  };

  return service;
}]);
//# sourceMappingURL=database.js.map
