<?php
class App_core extends CFormModel
{	
	/**
	 * Generates a unique hash for the email validation
	 * 
	 * @param string $user_id
	 * @return string
	 */
	function generate_unique_validation_hash($user_id)
	{
		$collection = $this->db->link_hashes;
		
		$hash = hash('md5', time() . $user_id);
		
		// Get the document that corresponds to the given user_id
		$document = array_shift(iterator_to_array($collection->find(array("user_id" => $user_id))->limit(1)));
		
		// If there is already a document in the collection, update it
		if($document)
		{
			$data['email_validation_hash'] = $hash;
			$collection->update(array("user_id" => $user_id), array('$set' => $data));
		}
		// Else insert the new data
		else 
		{
			$data = array(
					'user_id'				=> $user_id,
					'email_validation_hash'	=> $hash
			);
			$collection->insert($data);
		}
		
		return $hash;
	}
	
	/**
	 * Returns the user_id that corresponds to the given unique hash
	 * 
	 * @param string $hash
	 * @return string
	 */
	function get_user_id_of_unique_email_validation_hash($hash)
	{
		$collection = $this->db->link_hashes;
		$data = array_shift(iterator_to_array($collection->find(array("email_validation_hash" => $hash))));
		if($data)
		{
			return $data['user_id'];
		}
		else 
		{
			return NULL;
		}
	}
	
	function delete_document_of_unique_email_validation_hash($hash)
	{
		$collection = $this->db->link_hashes;
		$collection->remove(array("email_validation_hash" => $hash));
	}
	
	function generate_unique_reset_password_hash($user_id)
	{
		$collection = $this->db->link_hashes;
		
		$hash = hash('md5', time() . $user_id);

		// Get the document that corresponds to the given user_id
		$document = array_shift(iterator_to_array($collection->find(array("user_id" => $user_id))->limit(1)));
		
		if($document)
		{
			$data['reset_password_hash'] = $hash;
			$collection->update(array("user_id" => $user_id), array('$set' => $data));
		}
		// Else insert the new data
		else
		{
			$data = array(
					'user_id'				=> $user_id,
					'reset_password_hash'	=> $hash
			);
			$collection->insert($data);
		}
		
		return $hash;
	}
	
	/**
	 * Returns the user_id that corresponds to the given unique hash
	 *
	 * @param string $hash
	 * @return string
	 */
	function get_user_id_of_unique_reset_password_hash($hash)
	{
		$collection = $this->db->link_hashes;
		$data = array_shift(iterator_to_array($collection->find(array("reset_password_hash" => $hash))));
		if($data)
		{
			return $data['user_id'];
		}
		else
		{
			return NULL;
		}
	}
	
	function delete_document_of_unique_reset_password_hash($hash)
	{
		$collection = $this->db->link_hashes;
		$collection->remove(array("reset_password_hash" => $hash));
	}
	
}