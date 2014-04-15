/*********************************/
/* 		GENERAL VARIABLES		 */
/*********************************/

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

//initialize the object for the vizualization
// corechart : needed for basic graphs.
// controls : needed for dashboard
google.load("visualization", "1", {packages:["corechart","controls"]});



/*********************************/
/* 		Draw Chart Functions	 */
/*********************************/

/**
 * drawSimpleChart() : called for drawing the chart for a discipline of the specific user
 * @param user_id : the user id
 * @param discipline : the discipline we want to show
 */
function drawSimpleChart( user_id, discipline ) {

	//call ajax_get (defined in script.js) in order to fetch the specific performances
	ajax_get( '/user/' + user_id + '/activities?discipline='+discipline, function( response ){

		//-------CHART-------
		//parse responce as JSON
		var res = JSON.parse(response);

		//create a 2-dimension chart with y-axis:performance(number) and x-axis:date(date)
		//
		var data = {
		  "cols": [
		        {"id":"","label":"Date","pattern":"","type":"date"},
		        {"id":"","label":"Performance","pattern":"","type":"number"}
		      ],
		  "rows": []
		}

		// add rows to chart based on the discipline

		// TIME DISCIPLINE i.e : performance: "00:00:20.09"
		if( disciplines.time.indexOf(discipline) > -1 ) {
			for( var i in res ) {
				//console.log(i, res[i]);
				var performance = res[i].performance.split(':')[0]*360000 + res[i].performance.split(':')[1]*6000
					+ res[i].performance.split(':')[2].split('.')[0]*100 + res[i].performance.split(':')[2].split('.')[1];
				var temp = {"c":[{"v":"Date("+Date.parse(res[i].date)+")"},{"v":performance, "f":res[i].formatted_performance}]};
				data.rows.push(temp);
			}
		}
		// DISTANCE DISCIPLINE
		else if( disciplines.distance.indexOf(discipline) > -1 ) {
			for( var i in res ) {
				//console.log(i, res[i]);
				var temp = {"c":[{"v":"Date("+Date.parse(res[i].date)+")"},{"v":(res[i].performance / 10000), "f":res[i].formatted_performance}]};
				data.rows.push(temp);
			}

		}
		// POINTS DISCIPLINE
		else if( disciplines.points.indexOf(discipline) > -1 ) {
			for( var i in res ) {
				//console.log(i, res[i]);
				var temp = {"c":[{"v":"Date("+Date.parse(res[i].date)+")"},{"v":(res[i].performance), "f":res[i].formatted_performance}]};
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
		           'chartArea': {'width': '90%'},
		           'hAxis': {'baselineColor': 'none'}
		         },
		         // Display a single series that shows the closing value of the stock.
		         // Thus, this view has two columns: the date (axis) and the stock value (line series).
		         'chartView': {
		           'columns': [0, 1]
		         },
		         // 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000
		         'minRangeSize': 86400000
		       }
		     },
		     // Initial range: 2012-02-09 to 2012-03-20.
		     'state': {'range': {'start': new Date(2014, 1, 1), 'end': new Date()}}
		   });

		//---CHART
		var chart = new google.visualization.ChartWrapper({
           'chartType': 'LineChart',
           'containerId': 'chart_div',
           'options': {
       		'title': discipline,
       		'dataOpacity':'0.7',
             // Use the same chart area width as the control for axis alignment.
             'chartArea': {'height': '80%', 'width': '90%'}
			 ,'hAxis': {'slantedText': false}
				 /*',vAxis': {'viewWindow': {'min': 0, 'max': 2000}}*/
           },
           // Convert the first column from 'date' to 'string'.
           'view': {
             'columns': [
               {
                 'calc': function(dataTable, rowIndex) {
                   return dataTable.getFormattedValue(rowIndex, 0);
                 },
                 'type': 'string'
               }, 1 ]
           }
         });

		//We need to reverse the order of the elements in rows for
		//the dashboard.
 		data.rows.reverse();


		var dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));
		dashboard.bind(control, chart);
		dashboard.draw(data);
/* 		chart.draw(data_table, options); */
	});

}



/*********************************/
/* 			Handlers			 */
/*********************************/

/**
 * setDisciplineButtonHandler() : add handlers in the buttons with the disciplines in order to show specific chart
 * @param user_id : the user id
 * @param main_discipline : user's main discipline in order to show
 * @param main_discipline_exists :
 */
function setDisciplineButtonHandler( user_id , main_discipline ) {

	var discipline_buttons = document.getElementsByClassName('discipline_button');
	for (var i = 0, length = discipline_buttons.length; i < length; i++) {
		var discipline = discipline_buttons[i].getAttribute('data-discipline');

		(function(user_id, discipline) {
			document.getElementById(discipline+'_button').onclick  = function() {
				drawSimpleChart( user_id, discipline );
				}
		})( user_id, discipline );
	}

	if( main_discipline != 'undefined' ){
		google.setOnLoadCallback(drawSimpleChart( user_id, main_discipline ));
	}

}









