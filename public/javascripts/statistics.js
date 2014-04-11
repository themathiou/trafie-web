/*********************************/
/* 		GENERAL VARIABLES		 */
/*********************************/
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

google.load("visualization", "1", {packages:["corechart"]});



/*********************************/
/* 		Draw Chart Functions	 */
/*********************************/

function drawSimpleChart( user_id, discipline ) {

	ajax_get( '/user/' + user_id + '/activities?discipline='+discipline, function( response ){

		var res = JSON.parse(response);

		var data = {
		  "cols": [
		        {"id":"","label":"Date","pattern":"","type":"date"},
		        {"id":"","label":"performance","pattern":"","type":"number"}
		      ],
		  "rows": []
		}


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

		var data_table = new google.visualization.DataTable(data);

		// Set chart options
	    var options = { 'title': discipline ,
	    			   /* 'curveType': 'function', */
					   /*'backgroundColor': 'black', */
	    			   'dataOpacity':'0.3',
	                   /* 'width':1200, */
	                   'height':400};

		var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
		chart.draw(data_table, options);
	});

}



/*********************************/
/* 			Handlers			 */
/*********************************/

function setDisciplineButtonHandler( user_id , main_discipline, main_discipline_exists ) {

	var discipline_buttons = document.getElementsByClassName('discipline_button');
	for (var i = 0, length = discipline_buttons.length; i < length; i++) {
		var discipline = discipline_buttons[i].getAttribute('data-discipline');

		(function(user_id, discipline) {
			document.getElementById(discipline+'_button').onclick  = function() {
				drawSimpleChart( user_id, discipline );
				}
		})( user_id, discipline );
	}

	if(main_discipline_exists){
		google.setOnLoadCallback(drawSimpleChart( user_id, main_discipline ));
	}

}









