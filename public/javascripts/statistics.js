google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

function drawChart( user_id, discipline ) {
	console.log(user_id, discipline);

	ajax_get( '/user/' + user_id + '/activities?discipline='+discipline, function( response ){
		console.log( response );

		var test = {
		  "cols": [
		        {"id":"","label":"Date","pattern":"","type":"date"},
		        {"id":"","label":"performance","pattern":"","type":"number"}
		      ],
		  "rows": []
		}

		var res = JSON.parse(response)

		for( var i in res ) {
			console.log(i, res[i]);
			var temp = {"c":[{"v":"Date("+Date.parse(res[i].date)+")"},{"v":(res[i].performance / 10000)}]};
			test.rows.push(temp);
		}

		console.log(test);
		var data = new google.visualization.DataTable(test);

		// Set chart options
	    var options = {'title':'High Jump',
	    			   /* 'curveType': 'function', */
	    			   /* 'backgroundColor': 'black', */
	    			   'dataOpacity':'0.8',
	                   /* 'width':1200, */
	                   'height':400};



		var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
		chart.draw(data, options);
	});

}