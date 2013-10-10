<?php

class Debug
{
	/**
	 * Displays the contents of the given value as preformated code
	 * 
	 * @param mixed $value
	 * @param boolean $die
	 */
	public static function damn($value, $die = TRUE)
	{
		echo("<pre style='padding:5px;background-color:#fbfbfb;border:1px solid #eeeeee;color:#111111;'>" . print_r($value, TRUE) . "</pre>");
		if($die)
		{
			die();
		}
	}
	
	/**
	 * Displays the contents of a cursor from mongodb
	 * 
	 * @param cursor $value
	 * @param boolean $die
	 */
	public static function cursor_damn($value, $die = TRUE)
	{
		foreach($value as $key => $val)
		{
			$cursor[$key] = $val;
		}
		echo("<pre style='padding:5px;background-color:#fbfbfb;border:1px solid #eeeeee;color:#111111;'>" . (isset($cursor)? print_r($cursor, TRUE): "") . "</pre>");
		if($die)
		{
			die();
		}
	}
	
}