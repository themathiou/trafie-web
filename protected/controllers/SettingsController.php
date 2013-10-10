<?php

class SettingsController extends Master
{
	/**
	 * Declares class-based actions.
	 */
	public function actions()
	{
		
	}
	
	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public function actionIndex($identifier = NULL)
	{	
		$user = new Users();
		$profile = new Profiles();
		if(isset($_POST['profile_settings']) &&	isset($_POST['first_name']) && isset($_POST['last_name']) && isset($_POST['nickname']) && isset($_POST['country']) && isset($_POST['major_accomplishments']) && isset($_POST['primary_discipline']) && isset($_POST['secondary_discipline']))
		{
			if(!$_POST['primary_discipline'] && $_POST['secondary_discipline'])
			{
				$_POST['primary_discipline'] = $_POST['secondary_discipline'];
				$_POST['secondary_discipline'] = NULL;
			}
			$settings = array('_id' => Yii::app()->session['_id'], 
					'first_name' 			=> $_POST['first_name'],
					'last_name'				=> $_POST['last_name'],
					'nickname'				=> $_POST['nickname'],
					'country'				=> $_POST['country'],
					'major_accomplishments'	=> $_POST['major_accomplishments'],
					'disciplines'			=> array(1 => $_POST['primary_discipline'], 2 => $_POST['secondary_discipline'])
			);
			$profile->update($settings);
		}
		
		if(isset($_POST['general_settings']) && isset($_POST['select_language']) && isset($_POST['select_unit_system']) && isset($_POST['select_date_format']))
		{
			$settings = array('_id' => Yii::app()->session['_id'],
					'settings.language' 	=> $_POST['select_language'],
					'settings.unit_system' 	=> $_POST['select_unit_system'],
					'settings.date_format'	=> $_POST['select_date_format']
			);
			if($user->update($settings))
			{
				Yii::app()->session['language'] = $_POST['select_language'];
				Yii::app()->session['unit_system'] = $_POST['select_unit_system'];
				Yii::app()->session['date_format'] = $_POST['select_date_format'];
				$this->refresh();
			}
		}
		
		if(isset($_POST['password_change']) && isset($_POST['old_password']) && isset($_POST['password']) && isset($_POST['repeat_password']))
		{
			$settings = array('_id' => Yii::app()->session['_id'],
					'old_password' 		=> $_POST['old_password'],
					'password'			=> $_POST['password'],
					'repeat_password'	=> $_POST['repeat_password']
			);
			$user->update($settings);
		}
				
		$data = array(
				'user'		=> $user->get(Yii::app()->session['_id']),
				'profile'	=> $profile->get(Yii::app()->session['_id']),
				'language'	=> $this->language,
				'errors'	=> $user->errors
		);
		$this->render('settings', $data);
	}
	
}