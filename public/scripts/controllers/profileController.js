trafie.controller("profileController", function(
  $rootScope,
  $scope,
  $http,
  $timeout,
  $window,
  $q,
  $routeParams ){

  //GENERAL VARIABLES
  $scope.disciplines = {
      'time': [
        '100m',
        '200m',
        '400m',
        '800m',
        '1500m',
        '3000m',
        '60m_hurdles',
        '100m_hurdles',
        '110m_hurdles',
        '400m_hurdles',
        '3000m_steeple',
        '4x100m_relay',
        '4x400m_relay',
        'marathon'
      ],
      'distance': [
        'high_jump',
        'long_jump',
        'triple_jump',
        'pole_vault',
        'shot_put',
        'discus',
        'hammer',
        'javelin'
      ],
      'points': [
        'pentathlon',
        'heptathlon',
        'decathlon'
      ]
    };

    //variable for Open/Close accordions
    $scope.accordions = {
      addActivity : false
    }

    //time form
    $scope.newActivityForm = {};

    $scope.initProfile = function () {
      //true if this is the profile of the logged-in user
      $scope.page_not_found = false;
      $scope.self = false;

      if( $routeParams.userID ) {
        $routeParams.userID === $rootScope.user._id || $routeParams.userID === $rootScope.user.username ? $scope.self = true : $scope.self = false;
        $scope.getProfile( $routeParams.userID );
      }
      else {
        $scope.getProfile( $rootScope.user._id );
        $scope.self = true;
        // $scope.getDisciplinesOfUser( $rootScope.user._id, $scope.self );
      }
  }

  //get user profile based on user id
  $scope.getProfile = function (user_id) {
    $http.get('/users/'+ user_id)
    .success(function(res){
      $rootScope.current_user = res;
      $rootScope.disciplines_options = [];
      for( i in res.disciplines ) {
        var temp = { name: res.disciplines[i] , id: i };
        $rootScope.disciplines_options.push(temp);
      }
      //get user's activities
      $scope.getActivities( $rootScope.current_user._id , $rootScope.current_user.discipline);
      $scope.getDisciplinesOfUser( $rootScope.current_user._id );

    })
    .error( function (res) {
      $scope.page_not_found = true;
      console.err( 'info :: User not found. Maybe he doesn\'t have a trafie profile or the profile is private.');
    });
  }

  //get disciplines of user based on user id
  $scope.getDisciplinesOfUser = function (user_id) {
    console.log( user_id );
    $http.get('/users/'+ user_id+'/disciplines')
    .success( function (res) {
      $rootScope.current_user.disciplines_of_user = res;
    })
    .error( function (res) {
      console.err( 'info :: can\'t get disciplines of current user' );
    });
  }

  //get user activities based on user id
  $scope.getActivities = function (user_id, discipline) {
    var url =  '';
    discipline != '' ? url = '/users/' + user_id + '/activities?discipline=' + discipline : url = '/users/' + user_id + '/activities';
    $http.get(url)
    .success(function(res){
      $scope.activities = res;
    })
  }

  /*
  submitNewActivity function : creates the object for new activity submission and makes the ajax call (POST)
  @param type : the type of the discipline ( accepted values : time, distance, points )
   */
  $scope.submitNewActivity = function(){
    var data = $scope.newActivityForm;
    data.discipline = data.selected_discipline.id;
    var splitDate = data.date.toString().split(' ');
    data.date = splitDate[0] + ' ' + splitDate[1] + ' ' +splitDate[2] + ' ' +splitDate[3];

    $http.post('/users/' + $rootScope.user._id + '/activities', data)
    .success(function(res){
      $scope.accordions.addActivity = false;
      $scope.activities.unshift(res);
    })
    .error(function(e){});
  }

  /*
    deleteActivity function : calls the modal for delete activitiy confirmation
    @param activity_id: the id of the specific activity
   */
  $scope.deleteActivity = function (activity_id) {
    $rootScope.confirm_delete_modal( activity_id, 'lg')
    .then(function(result){
      if (result) {
        for( var i in $scope.activities ) {
          if( $scope.activities[i]._id == activity_id ){
            $scope.activities.splice(i,1);
            break;
          }
        }
        $rootScope.addAlert('success', 'You fucking destroy that!');
      }
      else {
        $rootScope.addAlert('warning', 'Something went so fucking wrong and this fucking activity couldn\'t be deleted' );
      }
    });

  }


  /*
    initEditableActivity function : initializes variables for editing an existing activity
   */
  $scope.initEditableActivity = function (activity) {

    activity.show_editable_form = !activity.show_editable_form;

    $scope.updateActivityForm = {};
    if( $scope.disciplines.time.indexOf( activity.discipline ) > -1) {
      var splitted_performance = activity.performance.split(':');
      //we get the existed performance in hh:mm:ss.cc format.
        //We split it and add each part to the specific element
      $scope.updateActivityForm.hours = splitted_performance[0].toString();
      $scope.updateActivityForm.minutes = splitted_performance[1].toString();
      $scope.updateActivityForm.seconds = splitted_performance[2].split('.')[0].toString();
      $scope.updateActivityForm.centiseconds = splitted_performance[2].split('.')[1].toString();

    }
    else if( $scope.disciplines.distance.indexOf( activity.discipline ) > -1 ) {
      $scope.updateActivityForm.distance_1 = (parseInt( activity.performance/10000 )).toString();
      $scope.updateActivityForm.distance_2 = (parseInt( ( (activity.performance/10000) % $scope.updateActivityForm.distance_1 ) * 100 )).toString();
    }
    else if( $scope.disciplines.points.indexOf( activity.discipline ) > -1 ){
      $scope.updateActivityForm.points = activity.performance;
    }
    else{
      console.err('activity belongs to undefined type');
    }

    $scope.updateActivityForm.date = activity.date;
    $scope.updateActivityForm.place = activity.place;
    $scope.updateActivityForm.location = activity.location;
    $scope.updateActivityForm.competition = activity.competition;
    $scope.updateActivityForm.notes = activity.notes;
    $scope.updateActivityForm.private = activity.private;
  }


  /*
    updateActivity function : edit a specific activity
   */
  $scope.updateActivity = function (activity) {
    var data = $scope.updateActivityForm;

    data.date = new Date(data.date.toString().split('T')[0]);
    var splitDate = data.date.toString().split(' ');
    data.date = splitDate[0] + ' ' + splitDate[1] + ' ' +splitDate[2] + ' ' +splitDate[3];
    data.discipline = activity.discipline;

    $http.put( "/users/" + $rootScope.user._id + "/activities/" + activity._id, data)
    .success( function(res){
      activity.formatted_performance = res.formatted_performance;
      activity.formatted_date = res.formatted_date;
      activity.place = res.place;
      activity.location = res.location;
      activity.competition = res.competition;
      activity.notes = res.notes;
      activity.private = res.private;
      activity.show_editable_form = !activity.show_editable_form;
    })
  }

  /*
    changePrivacy function : changes privacy of the activity
   */
  $scope.changePrivacy = function (activity) {
    var _activity = !activity.private;
    $http.put( "/users/" + $rootScope.user._id + "/activities/" + activity._id, { private: _activity })
    .success( function(res){
      activity.private = res.private;
    })
  }

});
