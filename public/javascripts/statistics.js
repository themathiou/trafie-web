google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

function drawChart( user_id, discipline ) {
	console.log(user_id, discipline);
	var req_data = { discipline: discipline };
	ajax_get( req_data, '/user/' + user_id + '/activities', function( res_status, res_data ){
		console.log(res_data, data);

		var data = google.visualization.DataTable(res_data);

		var options = {
		  title: 'My Performance',
		  hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
		  vAxis: {minValue: 0}
		};

		var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
		chart.draw(data, options);
	});

}