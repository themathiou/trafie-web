<?php
class Users extends CFormModel
{	
	public $data = array();
	public $errors = array();
	private $user = array();
	
	/**
	 * Get user
	 * 
	 * @param string id
	 * @param string $email
	 * @param array $where
	 */
	function get($id = NULL, $email = NULL, $where = array())
	{
		// select a collection (analogous to a relational database's table)
		$collection = $this->db->users;
		
		if($id)
		{
			return array_shift(iterator_to_array($collection->find(array("_id" => new MongoId($id)))));
		}
		else if($email)
		{
			return array_shift(iterator_to_array($collection->find(array("email" => $email))));
		}
		else if($where && is_array($where))
		{
			return iterator_to_array($collection->find($where));
		}
		else
		{
			return NULL;
		}
	}

	/**
	 * Creates a new user
	 * 
	 * @param array $user
	 * @return array
	 */
	function create($user)
	{
		// select a collection
		$collection = $this->db->users;
		$this->user = $user;
		
		$this->validate_input();
		// If everything is set
		if(!$this->errors)
		{
			$this->user['settings']['language'] = 'eng';
			$this->user['settings']['unit_system'] = 'metric';
			$this->user['settings']['date_format'] = 'dd/mm/yyyy';

			$this->user['valid'] = TRUE;
			
			// creates a new user
			$collection->insert($this->user);
			$this->data['_id'] = $this->user['_id']->{'$id'};
			return TRUE;
		}
		return FALSE;
	}
	
	/**
	 * Updates the user. It accepts an array that has the fields of the user
	 * collection as array keys.
	 * 
	 * @param array $user
	 * @return array
	 */
	function update($user)
	{
		// select a collection (analogous to a relational database's table)
		$collection = $this->db->users;
		$this->user = $user;
		
		$this->validate_input();
		// If there are no errors, update the user
		if(!$this->errors && $this->user['_id'])
		{
			// Unsetting the id so that it will not be updated in the database
			$id = $this->user['_id'];
			unset($this->user['_id']);
			$collection->update(array("_id" => new MongoId($id)), array('$set' => $this->user));
			return TRUE;
		}
		else
		{
			return FALSE;
		}
	}
	
	/**
	 * Deletes a user
	 *
	 * @param string $id
	 * @param string $email
	 */
	function delete($id = NULL)
	{
		// select a collection (analogous to a relational database's table)
		$collection = $this->db->users;
	
		// delete collection
		$collection->remove(array("_id" => new MongoId($id)));
	}
	
	/**
	 * Checks if the credentials of the user are correct
	 * 
	 * Error codes
	 * 0: Success
	 * 1: Email doesn't exist
	 * 2: Password is incorrect
	 * 3: Not validated email
	 *
	 * @param string $email
	 * @param string $password
	 * @return int
	 */
	function login($email, $password)
	{
		$collection = $this->db->users;
	
		// Get the user that corresponds to the given email address
		$user = array_shift(iterator_to_array($collection->find(array("email" => $email))->limit(1)));
		// If the exists, check if the user is valid
		if($user)
		{
			// If the user has validated their email
			if($user['valid'])
			{
				// If the password is correct
				if($user['password'] === $this->encrypt_password($password))
				{
					// Log in the user
					return 0;
				}
				// The password is incorrect
				else 
				{
					return 2;
				}
			}
			// User has not validated their email
			else 
			{
				return 3;
			}
		}
		// Email doesn't exist
		else 
		{
			return 1;
		}
	}
	
	/**
	 * Validates the user before creation
	 * 
	 * @param array $user
	 */
	public function validate_creation($user)
	{
		$this->user = $user;
		$this->validate_input();
	}
	
	/**
	 * Error codes
	 * 
	 * 1:   No email
	 * 1.1: Duplicate email
	 * 1.2: Invalid email
	 * 2:   No password
	 * 2.1: Invalid password
	 * 2.2: No repeat password
	 * 2.3: Repeat password and password do not match
	 * 2.4: No old password
	 * 2.5: Wrong old password
	 * 3:   Invalid language settings
	 * 3.1: Invalid unit system settings
	 * 3.2: Invalid time format
	 */
	private function validate_input()
	{
		$this->clear_errors();

		// If there is not an email
		if(isset($this->user['email']))
		{
			$this->user['email'] = trim($this->user['email']);
			if(!$this->user['email'])
			{
				$this->errors[] = 1;
			}
			else 
			{
				// If the given email is not valid
				$validator = new CEmailValidator;
				// If there is another user in the db with the same email
				if($this->get(NULL, $this->user['email']))
				{
					$this->errors[] = 1.1;
				}
				else if(!$validator->validateValue($this->user['email']))
				{
					$this->errors[] = 1.2;
				}
			}
		}
		// If there is not a password
		if(isset($this->user['password']))
		{
			// If there is not a password
			if(!$this->user['password'])
			{
				$this->errors[] = 2;
			}
			// If the password is very short or very long
			if((strlen($this->user['password']) < 6 && strlen($this->user['password']) != 0) || strlen($this->user['password']) > 64)
			{
				$this->errors[] = 2.1;
			}
			if(isset($this->user['repeat_password']))
			{
				// If there is not a password
				if(!$this->user['repeat_password'])
				{
					$this->errors[] = 2.2;
				}
				// If the passwords do not match
				else if($this->user['repeat_password'] != $this->user['password'] && $this->user['password'])
				{
					$this->errors[] = 2.3;
				}
			}
			if(isset($this->user['old_password']))
			{
				// If there is not a password
				if(!$this->user['old_password'])
				{
					$this->errors[] = 2.4;
				}
				// If the passwords is wrong
				else 
				{
					$user_data = $this->get($this->user['_id']);
					if($user_data['password'] != $this->encrypt_password($this->user['old_password']))
					{
						$this->errors[] = 2.5;
					}
				}
			}
			$this->encrypt_password();
		}
		if(isset($this->user['settings.language']))
		{
			$valid_languages = array('eng','gre','rus');
			if(!in_array($this->user['settings.language'], $valid_languages))
			{
				$this->errors[] = 3;
			}
		}
		if(isset($this->user['settings.unit_system']))
		{
			if($this->user['settings.unit_system'] !== 'metric' && $this->user['settings.unit_system'] !== 'imperial')
			{
				$this->errors[] = 3.1;
			}
		}
		if(isset($this->user['settings.date_format']))
		{
			if($this->user['settings.date_format'] !== 'd/m/Y' && $this->user['settings.date_format'] !== 'm/d/Y')
			{
				$this->errors[] = 3.2;
			}
		}
		if(isset($this->user['settings.time_zone']))
		{
			// CHECK IF THE TIMEZONE IS VALID
		}
		
		// Removing the values that are not valid fields in the database
		$valid_fields = array('_id', 'password', 'email', 'valid', 'settings.language', 'settings.unit_system', 'settings.date_format', 'settings.time_zone');
		foreach($this->user as $key => $user_data)
		{
			if(!in_array($key, $valid_fields))
			{
				unset($this->user[$key]);
			}
		}
	}
	
	/**
	 * Encrypts the password
	 * 
	 * @param string $password
	 * @return string
	 */
	private function encrypt_password($password = NULL)
	{
		if($password)
		{
			return hash('sha256','trafie_d8c894baabca8d1070063288b4283651' . $password);
		}
		else 
		{
			$this->user['password'] = hash('sha256','trafie_d8c894baabca8d1070063288b4283651' . $this->user['password']);
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