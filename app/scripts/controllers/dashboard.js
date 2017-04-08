app.controller('DashboardCtrl', ['$scope', 'database', function($scope, database) {
  var self = this;
  const PREFIX = 'sajDO-';

  self.sortBy = 'name';
  self.filters = {
    'availability' : {}
  };
  self.filterFlags = {};

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
    },
    true
  );
}]);
