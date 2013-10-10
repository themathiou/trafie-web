<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
?>

<h1>Manage mongodb</h1>

<br>
<form method="post">
	<?php foreach ($collection_names as $collection_name): ?>
		<?php echo CHtml::link($collection_name,array('/manage_db/manage_collection/','collection_name'=>$collection_name)); ?>
		<input type="submit" name="delete[<?php echo $collection_name; ?>]" value="X">
		<br>
	
	<?php endforeach; ?>
</form>

<br>

<?php if($message): ?>
	<p><?php echo $message; ?></p>
<?php endif; ?>

<form method="post">
	<label for="collection_name">Add new collection: </label>
	<input id="collection_name" type="text" name="collection_name">
	<input type="submit" value="Create">
</form>