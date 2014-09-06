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
        // Note : we need to make sure the DOM is ready when you call google.load
        // with the callback option [google.load doc](https://developers.google.com/loader/)
        //- google.load is adding the script to the page using a document.write() and wipes out the html.
        // we use a callback for the load to force it use append rather than doc.write
        console.log('init', user_id, discipline);
        $timeout(function(){
            google.load('visualization', '1', {'callback':function(){
              $scope.drawSimpleChart( user_id, discipline );
            }, 'packages':['corechart','controls']});
        }, 1)
    }




    /*********************************/
    /*    Draw Chart Functions   */
    /*********************************/
    /**
     * drawSimpleChart() : called for drawing the chart for a discipline of the specific user
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
            //-------CHART-------
            // parse responce as JSON
            var res = response; //JSON.parse(response);

            //create a 2-dimension chart with y-axis:performance(number) and x-axis:date(date)
            var data = {
                "cols": [{
                    "id": "",
                    "label": "Date",
                    "pattern": "",
                    "type": "date"
                }, {
                    "id": "",
                    "label": "Performance",
                    "pattern": "",
                    "type": "number"
                }, {
                    "id": "",
                    "label": "Average",
                    "pattern": "",
                    "type": "number"
                }],
                "rows": []
            }

            var config = {};
            config.bindto = '#chart';
            config.data = {};
            config.data.json = {};
            config.data.json.discipline_1 = [];
            config.data.json.discipline_2 = [];
            config.data.json.average = [];
            // add rows to chart based on the discipline

            // TIME DISCIPLINE i.e : performance: "00:00:20.09"
            if (disciplines.time.indexOf(discipline) > -1) {
                var average = 0,
                    sum = 0;
                var response_length = res.length;

                for (var i = 0; i < response_length; i++) {
                    sum = sum + parseInt(res[i].performance.split(':')[0] * 360000 + res[i].performance.split(':')[1] * 6000 + res[i].performance.split(':')[2].split('.')[0] * 100 + res[i].performance.split(':')[2].split('.')[1]);
                }
                average = sum / response_length;

                for (var i in res) {
                    //console.log(i, res[i]);
                    var performance = res[i].performance.split(':')[0] * 360000 + res[i].performance.split(':')[1] * 6000 + res[i].performance.split(':')[2].split('.')[0] * 100 + res[i].performance.split(':')[2].split('.')[1];
                    var temp = {
                        "c": [{
                            "v": "Date(" + Date.parse(res[i].date) + ")"
                        }, {
                            "v": performance,
                            "f": res[i].formatted_performance
                        }, {
                            "v": average
                        }]
                    };


                    console.log(sum, average, performance);
                    data.rows.push(temp);
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
                    //console.log(i, res[i]);
                    var temp = {
                        "c": [{
                            "v": "Date(" + Date.parse(res[i].date) + ")"
                        }, {
                            "v": (res[i].performance / 10000),
                            "f": res[i].formatted_performance
                        }, {
                            "v": average / 10000
                        }]
                    };


                    data.rows.push(temp);

                    config.data.json.discipline_1.push(res[i].performance / 10000);
                    config.data.json.discipline_2.push( Math.round( (res[i].performance / (10000 + Math.random()*1000))*100 ) /100 );
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


                for (var i in res) {
                    //console.log(i, res[i]);
                    var temp = {
                        "c": [{
                            "v": "Date(" + Date.parse(res[i].date) + ")"
                        }, {
                            "v": (res[i].performance),
                            "f": res[i].formatted_performance
                        }, {
                            "v": average
                        }]
                    };
                    data.rows.push(temp);
                }

            }
            // ERROR
            else {
                console.log('- error in drawChart(). Unknown discipline:' + discipline);
            }

            //------CONTROL-----
            var control = new google.visualization.ControlWrapper({
                'controlType': 'ChartRangeFilter',
                'containerId': 'control',
                'options': {
                    // Filter by the date axis.
                    'filterColumnIndex': 0,
                    'ui': {
                        'chartType': 'AreaChart',
                        'chartOptions': {
                            'chartArea': {
                                'width': '90%'
                            },
                            'hAxis': {
                                'baselineColor': 'none'
                            }
                        },
                        // Display a single series that shows the closing value of the stock.
                        // Thus, this view has two columns: the date (axis) and the stock value (line series).
                        'chartView': {
                            'columns': [0, 1, 2]
                        },
                        // 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000
                        'minRangeSize': 86400000
                    }
                },
                // Initial range: 2012-02-09 to 2012-03-20.
                'state': {
                    'range': {
                        'start': new Date(2014, 2, 1),
                        'end': new Date()
                    }
                }
            });

            //---CHART
            var chart = new google.visualization.ChartWrapper({
                'chartType': 'LineChart',
                'containerId': 'chart_div',
                'options': {
                    'title': discipline,
                    'dataOpacity': '0.7',
                    //'curveType': 'function',
                    // Use the same chart area width as the control for axis alignment.
                    'chartArea': {
                    },
                    'hAxis': {
                        'slantedText': false
                    }
                    /*',vAxis': {'viewWindow': {'min': 0, 'max': 2000}}*/
                },

                // Convert the first column from 'date' to 'string'.
                'view': {
                    'columns': [{
                            'calc': function(dataTable, rowIndex) {
                                return dataTable.getFormattedValue(rowIndex, 0);
                            },
                            'type': 'string'
                        },
                        1, 2
                    ]
                }
            });

            //We need to reverse the order of the elements in rows for
            //the dashboard.
            data.rows.reverse();

            var dashboard = new google.visualization.Dashboard( document.getElementById('dashboard') );
            dashboard.bind(control, chart);
            dashboard.draw(data);

            //hide loading indicator
            $scope.loading = false;

            console.log(data, config);

            // model for
            // c3 charts
            // var chart = c3.generate({
            //     data: {
            //         x: 'x',
            //         columns: [
            //             ['x', 30, 50, 100, 230, 300, 310],
            //             ['discipline', 30, 200, 100, 400, 150, 250],
            //             ['average', 130, 300, 200, 300, 250, 450]
            //         ]
            //     }
            // });
            var chart = c3.generate(config);

        })//end success
    .error(function(err){
      console.log('drawSimpleChart error');
    });
    }; //end drawSimpleChart

}); //end controller




























