<?php $this->pageTitle=Yii::app()->name; ?>

<h1>Forgot Password</h1>

<form method="post">
	<label for="email">Email: </label>
	<input type="text" id="email" name="email" value="<?php echo isset($_POST['email'])? $_POST['email']: ""; ?>">
	<br>
	<input type="submit" name="submit" value="Reset password">
</form>