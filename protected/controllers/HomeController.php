<?php

class HomeController extends Master
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
	public function actionLogout()
	{
		session_destroy();
		$this->redirect('../welcome');
	}
	
	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public function actionIndex($profile_owners_id = NULL)
	{	
		$profile = new Profiles();
		$activity = new Activities();

		$profile_owners_id = $profile_owners_id? $profile_owners_id: Yii::app()->session['_id'];

		$profile_data = $profile->get($profile_owners_id);
		$errors = array();

		if(isset($_POST['new_competition']))
		{
			// Getting the data from the form if everything is set
			if(isset($_POST['discipline']) && isset($_POST['place']) && isset($_POST['date']) && isset($_POST['location']) && isset($_POST['competition']) && isset($_POST['notes']))
			{
				$activity_data = array(
					'type'					=> 'competition',
					'discipline'			=> $_POST['discipline'],
					'place'					=> $_POST['place'],
					'date_time'				=> array('value' => $_POST['date'], 'has_time' => 0),
					'location'				=> $_POST['location'],
					'competition'			=> $_POST['competition'],
					'notes'					=> $_POST['notes']
				);
				// If there is a post value of seconds, it means that the performance is measured in time
				if(isset($_POST['seconds']))
				{
					// Saving each value if it exists, otherwise, saving 00
					$time['hours'] = isset($_POST['hours']) && $_POST['hours'] && (int)($_POST['hours']) == $_POST['hours']? $_POST['hours']: '00';
					$time['minutes'] = isset($_POST['minutes']) && $_POST['minutes'] && (int)($_POST['minutes']) == $_POST['minutes']? $_POST['minutes']: '00';
					$time['seconds'] = isset($_POST['seconds']) && $_POST['seconds'] && (int)($_POST['seconds']) == $_POST['seconds']? $_POST['seconds']: '00';
					$centiseconds = isset($_POST['centiseconds']) && $_POST['centiseconds'] && (int)($_POST['centiseconds']) == $_POST['centiseconds']? $_POST['centiseconds']: '00';
					$activity_data['performance'] = implode(':', $time) . '.' . $centiseconds;
 				}
 				// If there are posts of distance
 				else if(isset($_POST['distance_1']) && isset($_POST['distance_2']))
 				{
 					if((int)$_POST['distance_1'] == $_POST['distance_1'] && (int)$_POST['distance_2'] == $_POST['distance_2'])
 					{
 						// If the user input is in feet-inches, convert them to 0.0001 of meters
	 					if(Yii::app()->session['unit_system'] == 'imperial')
	 					{	
		 					$activity_data['performance'] = $_POST['distance_1'] * 3048 + $_POST['distance_2'] * 254;
	 					}
	 					else if(Yii::app()->session['unit_system'] == 'metric')
	 					{
	 						$activity_data['performance'] = $_POST['distance_1'] * 10000 + $_POST['distance_2'] * 100;	
	 					}
 					}
 					else
 					{
 						// Invalid distance (not an int)
 					}
 				}
 				// If the performance is measured in points
 				else if(isset($_POST['points']))
 				{
 					$activity_data['performance'] = $_POST['points'];
 				}
 				if(isset($activity_data['performance']))
 				{
 					$activity->create($activity_data);
 					if($activity->errors)
 					{
 						Debug::damn($activity->errors);
 					}
 					// Get errors with $activity->errors;
 				}
 				else
 				{
 					// No performance set
 				}
			}
		}
		//Debug::damn($activity->get(NULL, $profile_owners_id));

		$data = array(
				'profile' 		=> $profile_data,
				'activities'	=> $activity->get(array('user_id' => $profile_owners_id)),
				'language'		=> $this->language,
		);
		//Debug::damn($data['activities']);
		$this->render('home', $data);
	}
	
}