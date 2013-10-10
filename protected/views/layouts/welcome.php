<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />

	<!-- CSS -->
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,600,700,300' rel='stylesheet' type='text/css'>
	<link rel="stylesheet/less" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/login.less" />
	
	<!-- JavaScript -->
	<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/less-1.3.3.min.js" type="text/javascript"></script>
	<script src="<?php echo Yii::app()->request->baseUrl; ?>/assets/264f1255/jquery.js" type="text/javascript"></script>
	
	<!-- Timezone js -->
	<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/jstz.min.js" type="text/javascript"></script>

	<!-- Main welcome javascript -->
	<script src="<?php echo Yii::app()->request->baseUrl; ?>/js/welcome_script.js" type="text/javascript"></script>

	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body>

<div id="welcome_container">

	<div id="header">
		<div id="welcome_logo"><?php echo CHtml::encode(Yii::app()->name); ?></div>
	</div><!-- header -->

	<?php echo $content; ?>

</div><!-- page -->

</body>
</html>
