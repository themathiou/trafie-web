google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

function drawChart( user_id, discipline ) {
	var data = '{"discipline":"' + discipline + '"}';
	ajax_get( data, '/user/' + user_id + '/activities', function( res_status, res_data ){
		console.log(res_data);
	});

	var data = google.visualization.arrayToDataTable([
	  ['Year', 'Sales', 'Expenses'],
	  ['2013',  1000,      400],
	  ['2014',  1170,      460],
	  ['2015',  660,       1120],
	  ['2016',  1030,      540]
	]);

	var options = {
	  title: 'My Performance',
	  hAxis: {title: 'Year',  titleTextStyle: {color: '#333'}},
	  vAxis: {minValue: 0}
	};

	var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
	chart.draw(data, options);
}