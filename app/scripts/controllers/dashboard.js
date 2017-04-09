app.controller('DashboardCtrl', ['$scope', 'database', function($scope, database) {
  var self = this;
  const PREFIX = 'sajDO-';

  self.sortBy = 'name';
  self.filters = {};
  self.filterFlags = {
    'availability' : {}
  };

  self.init = () => {
    database.getList().then((data) => {
      self.appList = data;

      self.appList.forEach((val, index, arr) => {
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
      });

      console.log('qqq APPLIST:', self.appList);
    });
  };

  // toggle flag
  self.toggleFlag = (id) => {
    console.log('qqq toggleFlag:', id);
    // find id in appList array
    self.appList.forEach((val, index, arr) => {
      if (val.id === id) {
        val.isFlagged = !val.isFlagged;
        localStorage.setItem(PREFIX + val.id, ''+ val.isFlagged);
      }
    });
  };

  // handle filters
  self.toggleFilter = (filterName, filterSubName) => {
    if (!filterSubName) {
      if (typeof self.filters[filterName] === 'undefined') {
        self.filters[filterName] = true;
      } else {
        delete self.filters[filterName];
      }
    } else {
      if (typeof self.filters[filterName][filterSubName] === 'undefined') {
        self.filters[filterName][filterSubName] = true;
      } else {
        delete self.filters[filterName][filterSubName];
      }
    }
  };

  // custom filter for Availability checkboxes
  self.availabilityFilter = (val, index, arr) => {
    if (angular.equals(self.filterFlags.availability, {})) {
      // no availabilty checkboxes are checked
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
      var filterResult = result.find((val) => {
        return val === false;
      });
      // if any Availability days are not met, filterResult will not be undefined
      return filterResult === undefined;
    }
  };

  // reset filter dropdown when its corresponding checkbox is unchecked
  $scope.$watch(
    () => {
      return self.filterFlags;
    },
    (newVal, oldVal) => {
      for (var prop in newVal) {
        if (!newVal[prop]) {
          delete self.filters[prop];
        }
      }

      for (var day in newVal.availability) {
        if (!newVal.availability[day]) {
          delete self.filterFlags.availability[day];
        }
      }
    },
    true
  );
}]);
