<?php
/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Master extends Controller
{
	/**
	 * @var string the default layout for the controller view. Defaults to '//layouts/column1',
	 * meaning using a single column layout. See 'protected/views/layouts/column1.php'.
	 */
	public $layout='//layouts/column1';
	
	public $language = NULL;

	
	public function init(){
		//Setting the default time zone for the user
		if(isset(Yii::app()->session['time_zone']))
		{
			date_default_timezone_set(Yii::app()->session['time_zone']);
		}
		else
		{
			date_default_timezone_set('UTC');
		}
		
		// If there is no session, redirect to the login screen
	    if(!isset(Yii::app()->session['_id'])){
	        $this->redirect("/welcome/index");
	    }
	    else
	    {
		    require_once(dirname(__FILE__).'/../config/languages/'.Yii::app()->session['language'].'.php');
		    $this->language = $language;
	    }
	}
	
}