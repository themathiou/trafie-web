<?php

class WelcomeController extends Controller
{
	/**
	 * Declares class-based actions.
	 */
	public $layout='//layouts/column3';
	
	public function actions()
	{
		
	}

	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public function actionIndex()
	{	
		if(isset(Yii::app()->session['_id']))
		{
			$this->redirect('../home');
		}

		$user = new Users();
		$error_messages = array();
		
		if(isset($_POST['login']))
		{
			if(isset($_POST['email']) && isset($_POST['password']))
			{
				$email = trim($_POST['email']);
				$password = trim($_POST['password']);
				// If there is not an email in the form
				if(!$email)
				{
					$error_messages[] = TRUE;
				}
				// If there is not a password in the form
				if(!$password)
				{
					$error_messages[] = TRUE;
				}
				// If everything is set
				if(!$error_messages)
				{
					$errors = $user->login($email, $password);
					// Login the user
					if(!$errors)
					{
						$user->data = $user->get(NULL, $email);
						$session = new CHttpSession;
						$session->open();
						Yii::app()->session['_id'] = $user->data['_id']->{'$id'};
						Yii::app()->session['language'] = $user->data['settings']['language'];
						Yii::app()->session['unit_system'] = $user->data['settings']['unit_system'];

						if(isset($_COOKIE['time_zone']))
						{
							Yii::app()->session['time_zone'] = $_COOKIE['time_zone'];
							$user_data = array(
									'_id' => $user->data['_id']->{'$id'},
									'settings.time_zone' => $_COOKIE['time_zone']
								);
							$user->update($user_data);
						}
												
						$this->redirect('../home');
					}
					// Password or email is wrong
					else if($errors === 1)
					{
						$error_messages[] = TRUE;
					}
					// Email is not validated
					else if($errors === 2)
					{
						$error_messages[] = TRUE;
					}
				}
			}
		}
		
		// If the user tries to sign up
		if(isset($_POST['sign_up']))
		{
			// Checking if all the fields were submitted, even if they were left blank
			if(isset($_POST['first_name']) && isset($_POST['last_name']) && isset($_POST['email']) && isset($_POST['password']) && isset($_POST['repeat_password']))
			{
				$profile = new Profiles();
				// Try to create the user
				$user_data = array(
					'email'				=>	$_POST['email'],
					'password'			=>	$_POST['password'],
					'repeat_password'	=>	$_POST['repeat_password'],
					'settings' 			=>	array('timezone' => $_COOKIE['timezone'])
				);
				$profile_data = array(
					'first_name' 		=>	$_POST['first_name'],
					'last_name'			=>	$_POST['last_name'],
					'gender'			=>	$_POST['gender']
				);
				$user->validate_creation($user_data);
				$profile->validate_creation($profile_data);
				if(!$user->errors && !$profile->errors)
				{
					$user->create($user_data);
					$profile_data['_id'] = new MongoId($user->data['_id']);
					$profile->create($profile_data);
					// Generate a unique hash for them to validate their email and send the email
					$app_core = new App_core();
					$hash = $app_core->generate_unique_validation_hash($user->data['_id']);
					$this->_send_validation_email(trim($_POST['email']), $hash);
				}
			}
		}
		
		$data = array(
			'errors' => $error_messages	
		);
		$this->render('index', $data);
	}
	
	/**
	 * Validates the email of the user that corresponds to the given hash.
	 * If the has was not valid, the user gets redirected to the login screen.
	 * 
	 * @param string $hash
	 */
	function actionValidate_email($hash)
	{
		if(isset(Yii::app()->session['_id']))
		{
			$this->redirect('../home');
		}
		
		$user = new Users();
		
		// Get the user id that corresponds to the given hash
		$user_id = $app_core->get_user_id_of_unique_email_validation_hash($hash);
		
		// If there is a user that tries to validate their email
		if($user_id)
		{
			$app_core = new App_core();
			
			// Validate them
			$user_data = array(
				'_id' 	=> $user_id,
				'valid'	=> 1
			);
			$user->update($user_data);
			
			// Delete the document with their hash, which is no longer needed
			$app_core->delete_document_of_unique_email_validation_hash($hash);
		}
		$this->redirect('../welcome');
	}
	
	/**
	 * Sends the email with the email validation link
	 * 
	 * @param string $email
	 * @param string $hash
	 */
	function _send_validation_email($email, $hash)
	{
		if(isset(Yii::app()->session['_id']))
		{
			$this->redirect('../home');
		}
		
		return;
	}
	
	/**
	 * Displays a form that lets the user submit their email and it sends
	 * an email with a unique url that will let the user reset their password
	 */
	function actionForgot_password()
	{
		if(isset(Yii::app()->session['_id']))
		{
			$this->redirect('../home');
		}
		
		if(isset($_POST['email']))
		{
			$user = new Users();
			
			$user->data = $user->get(NULL, trim($_POST['email']));
			// If the email submitted belongs to a user
			if($user->data)
			{
				// If the user is valid
				if($user->data['valid'])
				{
					// Generate a unique url and send it to the user by email
					$app_core = new App_core();
					$hash = $app_core->generate_unique_reset_password_hash($user->data['_id']->{'$id'});
					$this->_send_reset_password_email($user->data, $hash);
					$this->redirect('../welcome');
				}
				else 
				{
					// Validate your account first re anthrwpe
				}
			}
			else 
			{
				// The email doesn't exist
			}
		}
		$this->render('forgot_password');
	}
	
	/**
	 * Sends the email that includes the unique url
	 * 
	 * @param array $user_data
	 * @param string $hash
	 */
	function _send_reset_password_email($user_data, $hash)
	{
		if(isset(Yii::app()->session['_id']))
		{
			$this->redirect('../home');
		}
		
		return;
	}
	
	/**
	 * Form for resetting a user's password
	 * 
	 * @param string $hash
	 */
	function actionReset_password($hash)
	{
		if(isset(Yii::app()->session['_id']))
		{
			$this->redirect('../home');
		}
		
		$app_core = new App_core();
		$user_id = $app_core->get_user_id_of_unique_reset_password_hash($hash);
		
		// If there is no user linked to the given hash, redirect the user to the login screen
		if(!$user_id)
		{
			$this->redirect('../welcome');
		}
		
		$errors = array();
		if(isset($_POST['password']) && isset($_POST['repeat_password']))
		{
			$password = trim($_POST['password']);
			$repeat_password = trim($_POST['repeat_password']);
			
			$user = new Users();
			
			$user_data = array(
				'_id' 				=> $user_id,
				'password'			=> $password,
				'repeat_password'	=> $repeat_password
			);
			
			// If the data were successfully updated
			if($user->update($user_data))
			{
				// Delete the document with the reset password hash
				$app_core->delete_document_of_unique_reset_password_hash($hash);
				$this->redirect('../welcome');
			}
		}
		
		$data['errors'] = $user->errors;
		$this->render('reset_password', $data);
	}

}