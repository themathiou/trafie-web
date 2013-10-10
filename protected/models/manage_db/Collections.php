<?php
class Collections extends CFormModel
{
	/**
	 * Returns the collection with the given name
	 * 
	 * @param string $collection_name
	 * @param int $limit, default=0 shows everything 
	 * @param int $offset, default=0 starts from the beginning
	 */
	function get($collection_name, $limit=0, $offset=0)
	{	
		return $this->db->$collection_name->find()->limit($limit)->skip($offset);
	}
	
	/**
	 * Creates a collection with the given name
	 * 
	 * @param string $collection_name
	 * @return boolean
	 */
	function create($collection_name)
	{		
		// select a collection (analogous to a relational database's table)
		$collections = $this->db->getCollectionNames();
		
		if(in_array($collection_name, $collections))
		{
			return FALSE;
		}
		
		$this->db->createCollection($collection_name);
		
		return TRUE;
	}
	
	/**
	 * Deletes the collection with the given name
	 * 
	 * @param string $collection_name
	 */
	function delete($collection_name)
	{		
		// select a collection (analogous to a relational database's table)
		$collection = $this->db->$collection_name;
		$collection->drop();
	}
	
	/**
	 * Returns all the collection names
	 */
	function get_all()
	{
		return $this->db->getCollectionNames();
	}
}