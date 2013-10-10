<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="language" content="en" />

		<!-- LESS, CSS -->
		<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,600,700,300' rel='stylesheet' type='text/css'>
		<link rel="stylesheet/less" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/style.less" />
		<link rel="stylesheet/less" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/datetime.less" />

		<!-- JavaScript -->
		<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/less-1.3.3.min.js" type="text/javascript"></script>
		<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery-2.0.3.min.js" type="text/javascript"></script>
		
		<!-- Main javascript -->
		<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/script.js" type="text/javascript"></script>
		
		<!-- scripts for historical banner -->
		<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery.carouFredSel-6.0.4-packed.js" type="text/javascript"></script>
				<script type="text/javascript">
				$(function() {
					var _scroll = {
						delay: 1000,
						easing: 'linear',
						items: 1,
						duration: 0.07,
						timeoutDuration: 0,
						pauseOnHover: 'immediate'
					};
					$('#ticker-1').carouFredSel({
						width: 1000,
						align: false,
						items: {
							width: 'variable',
							height: 35,
							visible: 1
						},
						scroll: _scroll
					});

					//	set carousels to be 100% wide
					$('.caroufredsel_wrapper').css('width', '100%');

				});
			</script>
	<!-- 	end historical scripts -->



		<title><?php echo CHtml::encode($this->pageTitle); ?></title>
	</head>

	<body>
		<div id="mainmenu_container">
			<div id="mainmenu">
				<div><a class="logo" href="/home"></a></div>
				<ul class="dropdown">
					<li><a href="/home">Home</a></li>
					<li><a href="/statistics">Statistics</a></li>
					<li><a href="/calendar">Calendar</a></li>
					<li><a href="/feed">News Feed</a></li>
					<li><a class="settings" href="#"></a>
		        		<ul class="settings_dropdown">
		        			 <li><a href="/settings">Settings</a></li>
		        			 <li><a href="/home/logout">Logout</a></li>
		        		</ul>
					</li>
				</ul>
			</div><!-- mainmenu -->
		</div>

		<div class="container" id="page">

			<?php echo $content; ?>

			<div class="clear"></div>

			<div id="footer">
				trafie 2013
			</div><!-- footer -->

		</div><!-- page -->

		<!-- datetimepicker scripts -->
		<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/datetimepicker/legacy.js" type="text/javascript"></script>
		<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/datetimepicker/picker.js" type="text/javascript"></script>
		<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/datetimepicker/picker.date.js" type="text/javascript"></script>
		<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/datetimepicker/picker.time.js" type="text/javascript"></script>
		<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/datetimepicker/main.js" type="text/javascript"></script>
		<!-- end datetimepicker scripts -->

	</body>
</html>
