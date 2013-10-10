<?php

class FeedController extends Master
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
		$this->render('feed');
	}
	
}