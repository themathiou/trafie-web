trafie.controller("statisticsController", function(
    $rootScope,
    $scope,
    $http,
    $timeout,
    $routeParams ) {

    $scope.loading = true;

    //object with disciplines grouped in categories
    var disciplines = {
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

    // Load the Visualization API and the piechart package.
    $scope.statisticsInit = function() {
        $scope.page_not_found = false;

        //C3 data model
        $scope.config = {};
        $scope.config.bindto = '#chart';
        $scope.config.data = {};
        $scope.config.data.json = {};
        $scope.config.data.json.discipline = [];
        $scope.config.data.json.average = [];
        $scope.config.axis = {
            y : {
                tick: {}
            }
        }
        $scope.config.subchart = {
            show: true
        }

        if ($routeParams.userID) {
            $routeParams.userID === $rootScope.localUser._id || $routeParams.userID === $rootScope.localUser.username ? $scope.self = true : $scope.self = false;
            $scope.drawSimpleChart( $routeParams.userID, $rootScope.current_user.discipline )
        }
        else {
            $rootScope.current_user = $rootScope.localUser;
            $scope.drawSimpleChart( $rootScope.localUser._id, $rootScope.localUser.discipline );
        }
    }




    /*********************************/
    /*    Chart Functions   */
    /*********************************/
    /**
     * drawSimpleChart() : drawing the chart for a discipline of the specific user
     * @param user_id : the user id
     * @param discipline : the discipline we want to show
     */
    $scope.drawSimpleChart = function( user_id, discipline ){
      //start loading indicator
      $scope.loading = true;
        console.log('draw', user_id, discipline);
        //call ajax_get (defined in script.js) in order to fetch the specific performances
        $http.get('/users/' + user_id + '/activities?discipline=' + discipline)
        .success(function(response){
            // parse response as JSON
            var res = response;

            //reset data
            $scope.config.data.json.discipline = [];
            $scope.config.data.json.average = [];

            // add rows to chart based on the discipline

            // TIME DISCIPLINE i.e : performance: "00:00:20.09"
            if (disciplines.time.indexOf(discipline) > -1) {
                var average = 0,
                    sum = 0;
                var response_length = res.length;

                for (var i = 0; i < response_length; i++) {
                    sum = sum + parseInt(res[i].performance.split(':')[0] + res[i].performance.split(':')[1] + res[i].performance.split(':')[2].split('.')[0] + res[i].performance.split(':')[2].split('.')[1]);
                }

                average = sum / response_length;

                for (var i in res) {
                    var performance = res[i].performance.split(':')[0] + res[i].performance.split(':')[1] + res[i].performance.split(':')[2].split('.')[0] + res[i].performance.split(':')[2].split('.')[1];
                    $scope.config.data.json.discipline.push(performance);
                    $scope.config.data.json.average.push(average);
                }

                //Format Y Axis
                $scope.config.axis.y.tick = {
                   format: function(d){
                        return $scope.formatChartTicks( d , 'time');
                   }
                }

            }

            // DISTANCE DISCIPLINE
            else if (disciplines.distance.indexOf(discipline) > -1) {
                var average = 0,
                    sum = 0;
                var response_length = res.length;

                for (var i = 0; i < response_length; i++) {
                    sum = sum + parseInt(res[i].performance);
                }
                average = sum / response_length;

                for (var i in res) {
                    $scope.config.data.json.discipline.push(res[i].performance / 10000);
                    $scope.config.data.json.average.push( average / 10000 );
                }

                //Format Y Axis
                $scope.config.axis.y.tick = {
                   format: function(d){
                        return $scope.formatChartTicks( d , 'distance');
                   }
                }

            }

            // POINTS DISCIPLINE
            else if (disciplines.points.indexOf(discipline) > -1) {
                var average = 0,
                    sum = 0;
                var response_length = res.length;

                for (var i = 0; i < response_length; i++) {
                    sum = sum + parseInt(res[i].performance);
                }
                average = sum / response_length;

                var ctr = res.length;
                for(i in res) {
                    $scope.config.data.json.discipline.push(res[i].performance);
                    $scope.config.data.json.average.push(average);
                }

                //Format Y Axis
                $scope.config.axis.y.tick = {
                   format: function(d){
                        return $scope.formatChartTicks( d , 'points');
                   }
                }

            }
            // ERROR
            else {
                console.log('- error in drawChart(). Unknown discipline:' + discipline);
            }

            //hide loading indicator
            $scope.loading = false;

            console.log($scope.config);

            // model for
            // inject config for C3 charts
            var chart = c3.generate($scope.config);
        })//end success
        .error(function(err){
          console.log('drawSimpleChart error');
        });
    }; //end drawSimpleChart


    /**
     * formatChartTicks() : makes the tick human readable
     * @param data : the data we need to format
     * @param discipline_type : the discipline type. Accepted values 'time', 'distance', 'points'
     */
     $scope.formatChartTicks = function( data, discipline_type ) {
        switch(discipline_type) {
        case 'time':
            //convert number to string
            data = data + '';
            var _result = data.slice(-4,-2) + '.' + data.slice(-2);
            if(data.slice(-6,-4)) { _result = data.slice(-6,-4) + ':' + _result };
            if(data.slice(-8,-6)) { _result = data.slice(-8,-6) + ':' + _result }
            return _result;
            break;
        case 'distance':
            return data.toFixed(2);
            break;
        case 'points':
            return data;
            break;
        default:
             return data;
        }
     }

}); //end controller




























