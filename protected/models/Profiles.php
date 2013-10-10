<?php
class Profiles extends CFormModel
{	
	public $data = array();
	public $errors = array();
	private $profile = array();
	
	/**
	 * Get profile
	 * 
	 * @param string $id
	 * @param array $where
	 */
	function get($id = NULL, $where = array())
	{
		// select a collection (analogous to a relational database's table)
		$collection = $this->db->profiles;
		
		if($id)
		{
			return array_shift(iterator_to_array($collection->find(array("_id" => new MongoId($id)))));
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
	 * Creates a new profile
	 *
	 * @param array $profile
	 * @return array
	 */
	function create($profile)
	{
		// select a collection
		$collection = $this->db->profiles;
		$this->profile = $profile;
	
		$this->validate_input();
	
		// If everything is set
		if(!$this->errors)
		{
			$this->profile['disciplines'] = array(
					1 => NULL,
					2 => NULL
			);
			$this->profile['major_accomplishments'] = '';
			$this->profile['nickname'] = "";
			$this->profile['country'] = "";
				
			// creates a new profile
			
			$collection->insert($this->profile);
			return TRUE;
		}
		return FALSE;
	}
	
	/**
	 * Updates the profile. It accepts an array that has the fields of the profile
	 * collection as array keys.
	 * 
	 * @param array $profile
	 * @return array
	 */
	function update($profile)
	{
		// select a collection (analogous to a relational database's table)
		$collection = $this->db->profiles;
		$this->profile = $profile;
		$this->validate_input();

		// If there are no errors, update the profile
		if(!$this->errors && $this->profile['_id'])
		{
			// Unsetting the id so that it will not be updated in the database
			$id = $this->profile['_id'];
			unset($this->profile['_id']);
			
			$collection->update(array("_id" => new MongoId($id)), array('$set' => $this->profile));
			return TRUE;
		}
		else
		{
			return FALSE;
		}
	}
	
	/**
	 * Validates the profile before creation
	 *
	 * @param array $profile
	 */
	public function validate_creation($profile)
	{
		$this->profile = $profile;
		$this->validate_input();
	}
	
	/**
	 * Error codes
	 * 
	 * 1:   No first name
	 * 1.1: Invalid length of first name
	 * 2:   No last name
	 * 2.1: Invalid characters in last name
	 * 3:	Nickname length > 20
	 * 3.1: Nickname already exists
	 * 3.2: Invalid characters in nickname
	 * 4: 	Invalid country
	 * 5:	Invalid first descipline
	 * 5.1:	Invalid second descipline
	 * 6:	Invalid gender
	 * 7:	Invalid major accomplishments
	 */
	private function validate_input()
	{
		$this->clear_errors();
		
		// If there is not a first name
		if(isset($this->profile['first_name']))
		{
			$this->profile['first_name'] = trim($this->profile['first_name']);
			if(!$this->profile['first_name'])
			{
				$this->errors[] = 1;
			}
			else if($this->profile['first_name'] > 25)
			{
				$this->errors[] = 1.1;
			}
			// If there are no errors, convert the special characters in the name
			else
			{
				$this->profile['first_name'] = htmlspecialchars($this->profile['first_name']);
			}
		}
		// If there is not a last name
		if(isset($this->profile['last_name']))
		{
			$this->profile['last_name'] = trim($this->profile['last_name']);
			if(!$this->profile['last_name'])
			{
				$this->errors[] = 2;
			}
			else if($this->profile['last_name'] > 25)
			{
				$this->errors[] = 2.1;
			}
			// If there are no errors, convert the special characters in the last name
			else
			{
				$this->profile['last_name'] = htmlspecialchars($this->profile['last_name']);
			}
		}
		// If there is a nickname
		if(isset($this->profile['nickname']))
		{
			// If the length of the nickname is greater than 20
			$this->profile['nickname'] = trim($this->profile['nickname']);
			if(strlen($this->profile['nickname']) > 20)
			{
				$this->errors[] = 3;
			}
			else if($this->profile['nickname'] != '')
			{
				// If there is another profile with the same nickname
				$duplicates = array_shift($this->get(NULL, array('nickname' => $this->profile['nickname'])));
				if(count($duplicates) != 0 && $duplicates['_id']->{'$id'} != $this->profile['_id'])
				{
					$this->errors[] = 3.1;
				}
				else if(!preg_match("/^[a-zA-Z0-9_.-]+$/", $this->profile['nickname']))
				{
					$this->errors[] = 3.2;
				}
			}
		}
		// If there is a country
		if(isset($this->profile['country']))
		{
			$valid_countries = array('af','ax','al','dz','as','ad','ao','ai','aq','ag','ar','am','aw','au','at','az','bs','bh','bd','bb','by','be','bz','bj','bm','bt','bo','bq','ba','bw','bv','br','io','bn','bg','bf','bi','kh','cm','ca','cv','ky','cf','td','cl','cn','cx','cc','co','km','cg','cd','ck','cr','ci','hr','cu','cw','cy','cz','dk','dj','dm','do','ec','eg','sv','gq','er','ee','et','fk','fo','fj','fi','fr','gf','pf','tf','ga','gm','ge','de','gh','gi','gr','gl','gd','gp','gu','gt','gg','gn','gw','gy','ht','hm','va','hn','hk','hu','is','in','id','ir','iq','ie','im','il','it','jm','jp','je','jo','kz','ke','ki','kp','kr','kw','kg','la','lv','lb','ls','lr','ly','li','lt','lu','mo','mk','mg','mw','my','mv','ml','mt','mh','mq','mr','mu','yt','mx','fm','md','mc','mn','me','ms','ma','mz','mm','na','nr','np','nl','nc','nz','ni','ne','ng','nu','nf','mp','no','om','pk','pw','ps','pa','pg','py','pe','ph','pn','pl','pt','pr','qa','re','ro','ru','rw','bl','sh','kn','lc','mf','pm','vc','ws','sm','st','sa','sn','rs','sc','sl','sg','sx','sk','si','sb','so','za','gs','ss','es','lk','sd','sr','sj','sz','se','ch','sy','tw','tj','tz','th','tl','tg','tk','to','tt','tn','tr','tm','tc','tv','ug','ua','ae','gb','us','um','uy','uz','vu','ve','vn','vg','vi','wf','eh','zm','zw');
			if(!in_array($this->profile['country'], $valid_countries) && $this->profile['country'] != '')
			{
				$this->errors[] = 4;
			}
		}
		// If there is a discipline
		$valid_disciplines = array('100m', '200m', '400m', '800m', '1500m', '3000m', '60m_hurdles', '100m_hurdles', '110m_hurdles', '400m_hurdles', '3000m_steeple', '4x100m_relay', '4x400m_relay', 'high_jump','long_jump','triple_jump', 'pole_vault', 'shot_put', 'discus', 'hammer', 'javelin', 'pentathlon', 'heptathlon', 'decathlon', '');
		if(isset($this->profile['disciplines'][1]))
		{
			if(!in_array($this->profile['disciplines'][1], $valid_disciplines) && $this->profile['disciplines'][1] != NULL)
			{
				$this->errors[] = 5;
			}
		}
		// If there is a discipline
		if(isset($this->profile['disciplines'][2]))
		{
			if(!in_array($this->profile['disciplines'][2], $valid_disciplines) && $this->profile['disciplines'][2] != NULL)
			{
				$this->errors[] = 5.1;
			}
		}
		// If there is a gender
		if(isset($this->profile['gender']))
		{
			if($this->profile['gender'] != 'male' && $this->profile['gender'] != 'female')
			{
				$this->errors[] = 6;
			}
		}
		// If there are major accomplishments
		if(isset($this->profile['major_accomplishments']))
		{
			$this->profile['major_accomplishments'] = trim($this->profile['major_accomplishments']);
			if(strlen($this->profile['major_accomplishments']) > 100)
			{
				$this->errors[] = 7;
			}
			// If there are no errors, convert the special characters in the accomplishments
			else
			{
				$this->profile['major_accomplishments'] = htmlspecialchars($this->profile['major_accomplishments']);
			}
		}
		
		// Removing the values that are not valid fields in the database
		$valid_fields = array('_id', 'first_name', 'last_name', 'nickname', 'disciplines', 'country', 'major_accomplishments', 'gender');
		foreach($this->profile as $key => $profile_data)
		{
			if(!in_array($key, $valid_fields))
			{
				unset($this->profile[$key]);
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