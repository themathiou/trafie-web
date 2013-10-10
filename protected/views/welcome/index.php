<?php $this->pageTitle=Yii::app()->name; ?>
	<div class="forms">
		<form id="login" class="welcome_form" method="post">
			<h3>Login</h3>
			<input type="text" id="email" name="email" value="<?php echo isset($_POST['email'])&&isset($_POST['login'])? $_POST['email']: ""; ?>" placeholder="email">
			<input type="password" id="password" name="password" placeholder="password">
			<input type="submit" name="login" value="Login"> <span class="forgot_password"><?php echo CHtml::link('Forgot password?',array('/welcome/forgot_password')); ?></span>
			<div>
				<span class="sign_up"><a href=""><b>Sign up</b> for a new account</a></span>
			</div>
		</form>
	
		<form id="register" class="welcome_form" method="post">
			<h3>Sign Up</h3>
			<input type="text" id="first_name" name="first_name" value="<?php echo isset($_POST['first_name'])? $_POST['first_name']: ""; ?>" placeholder="First Name">
			<input type="text" id="last_name" name="last_name" value="<?php echo isset($_POST['last_name'])? $_POST['last_name']: ""; ?>" placeholder="Last Name">
			<input type="text" id="email" name="email" value="<?php echo isset($_POST['email'])&&isset($_POST['sign_up'])? $_POST['email']: ""; ?>" placeholder="email">
			<input type="password" id="password" name="password" placeholder="Password">
			<input type="password" id="repeat_password" name="repeat_password" placeholder="Repeat Password">
			<div class="row">
				<label for="male">Male</label>
				<input type="radio" id="male" name="gender" value="male" checked>
				<label for="female">Female</label>
				<input type="radio" id="female" name="gender" value="female">
			</div>
			<input type="submit" name="sign_up" value="Sign Up">
			<div>
				<span class="sign_up"><a href=""><b>Login</b></a></span>
			</div>
		</form>
	</div>