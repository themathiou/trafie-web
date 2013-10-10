<?php
class Activities extends CFormModel
{	
	public $data = array();
	public $errors = array();
	private $activity = array();
	
	/**
	 * Get activity
	 * 
	 * @param string id
	 * @param string $email
	 * @param array $where
	 */
	function get($where = array())
	{
		// select a collection (analogous to a relational database's table)
		$collection = $this->db->activities;
		
		if($where && is_array($where))
		{
			$cursor = $collection->find($where);
			$cursor->sort(array('date_time' => -1));
			return iterator_to_array($cursor);
		}
		else
		{
			return NULL;
		}
	}

	/**
	 * Creates a new activity
	 * 
	 * @param array $activity
	 * @return array
	 */
	function create($activity)
	{
		// select a collection
		$collection = $this->db->activities;

		$collection->ensureIndex(array('y' => 1));
		
		$this->activity = $activity;
		
		$this->validate_input();
	
		// If everything is set
		if(!$this->errors)
		{	
			$this->activity['user_id'] = Yii::app()->session['_id'];
			// creates a new activity
			$collection->insert($this->activity);
			$this->data['_id'] = $this->activity['_id']->{'$id'};
			return TRUE;
		}
		return FALSE;
	}
	
	/**
	 * Updates the activity. It accepts an array that has the fields of the activity
	 * collection as array keys.
	 * 
	 * @param array $activity
	 * @return array
	 */
	function update($activity)
	{
		// select a collection (analogous to a relational database's table)
		$collection = $this->db->activities;
		$this->activity = $activity;
		$this->validate_input();
		
		// If there are no errors, update the activity
		if(!$this->errors && $this->activity['_id'])
		{
			// Unsetting the id so that it will not be updated in the database
			$id = $this->activity['_id'];
			unset($this->activity['_id']);
			
			$collection->update(array("_id" => new MongoId($id)), array('$set' => $this->activity));
			return TRUE;
		}
		else
		{
			return FALSE;
		}
	}
	
	/**
	 * Deletes an activity
	 *
	 * @param string $id
	 * @param string $email
	 */
	function delete($id = NULL)
	{
		// select a collection (analogous to a relational database's table)
		$collection = $this->db->activities;
	
		// delete collection
		$collection->remove(array("_id" => new MongoId($id)));
	}
	
	/**
	 * Error codes
	 * 
	 * 1:   Invalid activity type
	 * 2:   Invalid public value
	 * 3:   Invalid discipline
	 * 4:	There is a performance without a discipline
	 * 4.1:	Invalid performance
	 * 5:	Invalid location
	 * 5.1:	Too many characters in location
	 * 6:	There is a competition name but the activity type is not a competition
	 * 6.1: Invalid competition value
	 * 6.2: Too many characters in competition name
	 * 7:	Invalid date time (The valid date time format is d/m/Y H:m:s)
	 * 8:	Invalid place value
	 * 9:	Invalid notes
	 * 9.1:Too many characters in notes
	 */
	private function validate_input()
	{
		$this->clear_errors();
		
		// If there is not an email
		if(isset($this->activity['type']))
		{
			$valid_types = array('competition', 'training');
			if(!in_array($this->activity['type'], $valid_types))
			{
				$this->errors[] = 1;
			}
		}
		// If there is not a password
		if(isset($this->activity['public']))
		{
			$valid_public_values = array(TRUE, FALSE);
			if(!in_array($this->activity['public'], $valid_public_values))
			{
				$this->errors[] = 2;
			}
		}
		// If there is a discipline
		if(isset($this->activity['discipline']))
		{
			$valid_disciplines = array('100m', '200m', '400m', '800m', '1500m', '3000m', '60m_hurdles', '100m_hurdles', '110m_hurdles', '400m_hurdles', '3000m_steeple', '4x100m_relay', '4x400m_relay', 'marathon', 'high_jump','long_jump','triple_jump', 'pole_vault', 'shot_put', 'discus', 'hammer', 'javelin', 'pentathlon', 'heptathlon', 'decathlon', '');
			if(!in_array($this->activity['discipline'], $valid_disciplines))
			{
				$this->errors[] = 3;
			}
		}

		// If there is a performance
		if(isset($this->activity['performance']))
		{
			if(isset($this->activity['discipline']) && $this->activity['discipline'])
			{
				$error = FALSE;
				$this->activity['performance'] = trim($this->activity['performance']);

				// Getting the valid groups of disciplines
				$time_activities = array('100m', '200m', '400m', '800m', '1500m', '3000m', '60m_hurdles', '100m_hurdles', '110m_hurdles', '400m_hurdles', '3000m_steeple', '4x100m_relay', '4x400m_relay', 'marathon');
				$distance_activities = array('high_jump','long_jump','triple_jump', 'pole_vault', 'shot_put', 'discus', 'hammer', 'javelin');
				$point_activities = array('pentathlon', 'heptathlon', 'decathlon');

				// If the discipline has a performance measured in time
				if(in_array($this->activity['discipline'], $time_activities))
				{
					// Splitting the time in parts between ":" and "."
					$time_parts = preg_split('/[:\.]/', $this->activity['performance']);
					// Checking if there are exactly 4 parts in the time
					if(sizeof($time_parts) === 4)
					{
						// Checking each part of the time if it's a valid integer and it has less than two digits and is positive
						foreach ($time_parts as $key => $time_part) 
						{
							if(strlen($time_part) == 1)
							{
								$time_parts[$key] = '0' . $time_part;
							}
							if((int)$time_part != $time_part || strlen($time_part) > 2 || (int)$time_part < 0)
							{
								$error = TRUE;
								break;
							}
						}
						// If the time has invalid integers
						if($time_parts[0] > 99 || $time_parts[1] >= 60 || $time_parts[2] >= 60 || $time_parts[3] >99)
						{
							$error = TRUE;
						}
						$this->activity['performance'] = $time_parts[0] . ':' . $time_parts[1] . ':' . $time_parts[2] . '.' . $time_parts[3];
					}
					else
					{
						$error = TRUE;
					}
				}
				else if(in_array($this->activity['discipline'], $distance_activities) || in_array($this->activity['discipline'], $point_activities))
				{
					if(!$this->activity['performance'] || (int)$this->activity['performance'] != $this->activity['performance'] || (int)$this->activity['performance'] < 0)
					{
						$error = TRUE;
					}
				}
				// It's a discipline that does not fall in any of the categories
				else
				{
					$error = TRUE;
				}

				// If there is an error somewhere, add it to the errors array
				if($error)
				{
					$this->errors[] = 4.1;
				}
			}
			// Performance without discipline
			else
			{
				$this->errors[] = 4;
			}
		}

		// If the location of the activity is set
		if(isset($this->activity['location']))
		{
			if(!is_string($this->activity['location']))
			{
				$this->errors[] = 5;
			}
			if(is_string($this->activity['location']) && strlen($this->activity['location']) > 100)
			{
				$this->errors[] = 5.1;
			}
		}

		// If the competition of the activity is set
		if(isset($this->activity['competition']))
		{
			// Check if the type of the activity is competition
			if(isset($this->activity['type']) && $this->activity['type'] === 'competition')
			{
				if(!is_string($this->activity['competition']))
				{
					$this->errors[] = 6.1;
				}
				if(is_string($this->activity['competition']) && strlen($this->activity['competition']) > 100)
				{
					$this->errors[] = 6.2;
				}
			}
			else
			{
				$this->errors[] = 6;
			}
		}

		// If there is a date_time.value
		if(isset($this->activity['date_time']['value']))
		{
			$date_time_parts = explode(' ', $this->activity['date_time']['value']);
			$date_time_parts[0] = implode('-', array_reverse(explode('/', reset($date_time_parts))));
			if(isset($date_time_parts[1]))
			{
				$this->activity['date_time']['value'] = strtotime(implode(" ", $date_time_parts));
				$this->activity['date_time']['has_time'] = 1;
			}
			else
			{
				$this->activity['date_time']['value'] = strtotime($date_time_parts[0]);	
				$this->activity['date_time']['has_time'] = 0;
			}
			if(!$this->activity['date_time']['value'])
			{
				$this->errors[] = 7;
			}
		}

		// If there is a date_time.value
		if(isset($this->activity['place']))
		{
			$this->activity['place'] = filter_var($this->activity['place'], FILTER_SANITIZE_NUMBER_INT);
			if($this->activity['place'] < 0)
			{
				$this->errors[] = 8;
			}
		}

		// If there is a date_time.value
		if(isset($this->activity['notes']))
		{
			if(!is_string($this->activity['notes']))
			{
				$this->errors[] = 9;
			}
			if(is_string($this->activity['notes']) && strlen($this->activity['notes']) > 500)
			{
				$this->errors[] = 9.1;
			}
		}

		// Removing the values that are not valid fields in the database
		$valid_fields = array('_id', 'user_id', 'type', 'public', 'discipline', 'location', 'competition', 'date_time', 'performance', 'place', 'notes');
		foreach($this->activity as $key => $activity_data)
		{
			if(!in_array($key, $valid_fields))
			{
				unset($this->activity[$key]);
			}
		}
	}
	
	/**
	 * Clears the errors
	 */
	public function clear_errors()
	{
		$this->errors = array();
	}
}