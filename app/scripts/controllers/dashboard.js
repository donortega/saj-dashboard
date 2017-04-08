app.controller('DashboardCtrl', ['database', function(database) {
  var self = this;
  const PREFIX = 'sajDO-';

  self.sortBy = 'name';

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
}]);
