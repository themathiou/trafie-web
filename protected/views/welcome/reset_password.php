<?php $this->pageTitle=Yii::app()->name; ?>

<h1>Forgot Password</h1>

<form method="post">
	<label for="password">Password: </label>
	<input type="password" id="password" name="password" value="<?php echo isset($_POST['password'])? $_POST['password']: ""; ?>">
	<br>
	<label for="repeat_password">Repeat password: </label>
	<input type="password" id="repeat_password" name="repeat_password" value="<?php echo isset($_POST['repeat_password'])? $_POST['repeat_password']: ""; ?>">
	<br>
	<input type="submit" name="submit" value="Reset password">
</form>