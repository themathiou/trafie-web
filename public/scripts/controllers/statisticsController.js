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
    $scope.statisticsInit = function( user_id, discipline ) {
        $scope.page_not_found = false;
        // console.log('init', user_id, discipline);
        $scope.drawSimpleChart( user_id, discipline );
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
        $http.get('/user/' + user_id + '/activities?discipline=' + discipline)
        .success(function(response){
            // parse responce as JSON
            var res = response;

            //C3 data model
            var config = {};
            config.bindto = '#chart';
            config.data = {};
            config.data.json = {};
            config.data.json.discipline = [];
            config.data.json.average = [];
            config.axis = {
                y : {
                    tick: {}
                }
            }

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

                    console.log(sum, average, res[i].performance, performance, typeof(performance));
                    // data.rows.push(temp);

                    config.data.json.discipline.push(performance);
                    config.data.json.average.push(average);
                }

                //Format Y Axis
                config.axis.y.tick = {
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
                    config.data.json.discipline.push(res[i].performance / 10000);
                    config.data.json.average.push(average / 10000);
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
                while(ctr) {
                    //console.log(i, res[i]);
                    ctr--;
                    config.data.json.discipline.push(res[ctr].performance);
                    config.data.json.average.push(average);
                }

            }
            // ERROR
            else {
                console.log('- error in drawChart(). Unknown discipline:' + discipline);
            }

            //hide loading indicator
            $scope.loading = false;

            console.log(config);

            // model for
            // inject config for C3 charts
            var chart = c3.generate(config);
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
            // code block
            break;
        case 'points':
            // code block
            break;
        // default:
        //     default code block
        }
     }

}); //end controller




























