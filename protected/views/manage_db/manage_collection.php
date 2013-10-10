<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
?>

<h1>Manage Collection: <?php echo $collection_name; ?></h1>

<div>
<?php foreach($pagination as $page_number => $link){echo $link . "&nbsp;";} ?>
</div>

<!-- New document form-->
<form method="post">
	<label>Name:</label>
	<input type="text" class="short" value="" name="new_element">
	<label>Value:</label>
	<input type="text" class="short" value="" name="new_value">
	<input type="submit" name="create_document" value="Create new document">
</form>

<hr>

<!-- New element in all documents -->
<form method="post">
	<label>Name:</label>
	<input type="text" class="short" value="" name="new_element">
	<input type="submit" name="create_elements" value="Create new element">
</form>

<hr>

<!-- Delete element in all documents -->
<form method="post">
	<label>Name:</label>
	<input type="text" class="short" value="" name="element_to_delete">
	<input type="submit" name="delete_elements" value="Delete element">
</form>


<!-- Collection's documents -->
<div>
	<?php foreach($page_documents as $document): ?>
		<form method="post" action="">
			<div class="row">
			
				<div class="inner_row">
					<div class="cell">
						<pre class="id"><?php echo $document['_id']; ?></pre>
						<input type="hidden" name="values[_id]" value="<?php echo $document['_id']; ?>" >
					</div>
					<div class="cell">
						<input type="button" class="add_element" value="Add element">
						<div class="new_element_container">
							<label>Name:</label>
							<input type="text" class="short" value="" name="new_element">
							<label>Value:</label>
							<input type="text" class="short" value="" name="new_value">
							<input type="submit" name="add_element" value="Add"> &nbsp;|
						</div>
					</div>
					<div class="cell">
						<input type="submit" name="update" value="Update">
					</div>
					<div class="cell">
						<input type="submit" name="delete[<?php echo $document['_id']; ?>]" value="X"> |
					</div>
				</div>
				
				<div class="inner_row">
					<?php foreach($document as $key => $value): ?>
						<?php if ($key != '_id'):?>
							<div class="cell">
								<label for="<?php echo $key; ?>"><?php echo $key; ?>:</label>
								<input class="short" id="<?php echo $key; ?>" type="text" name="values[<?php echo $key; ?>]" value="<?php echo is_array($value)? htmlentities(json_encode($value)): htmlentities($value); ?>">
								<input type="submit" name="delete_element[<?php echo $key; ?>]" value="x"> |
							</div>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
				
			</div>
		</form>
	<?php endforeach; ?>
</div>

