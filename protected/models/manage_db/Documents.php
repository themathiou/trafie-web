<?php
class Documents extends CFormModel
{	
	/**
	 * Updates a document. The parameter $document
	 * is an array that includes all the data of the document
	 * that needs to be updated, including the document id
	 * 
	 * @param string $collection_name
	 * @param array $data
	 */
	function update($collection_name, $document)
	{
		// select a collection (analogous to a relational database's table)
		$collection = $this->db->$collection_name;
		
		$id = $document['_id'];
		
		unset($document['_id']);
		
		$collection->update(array("_id" => new MongoId($id)), array('$set' => $document));
	}
	
	/**
	* Creates a document.
	*
	* @param string $collection_name
	*/
	function create($collection_name, $elements)
	{
		// select a collection (analogous to a relational database's table)
		$collection = $this->db->$collection_name;
		
		// creates new document
		$collection->insert($elements);
		
	}
	
	/**
	 * Deletes a document with the given id
	 * 
	 * @param string $collection_name
	 * @param string $document_id
	 */
	function delete($collection_name, $document_id)
	{
		// select a collection (analogous to a relational database's table)
		$collection = $this->db->$collection_name;
		
		// find everything in the collection
		$collection->remove(array("_id" => new MongoId($document_id)));
	}
	
	/**
	 * Deletes the given element of a document
	 * 
	 * @param string $collection_name
	 * @param string $document_id
	 * @param string $element
	 * @param string $value
	 */
	function delete_element($collection_name, $document_id, $element)
	{
		// select a collection (analogous to a relational database's table)
		$collection = $this->db->$collection_name;
		
		$collection->update(array("_id" => new MongoId($document_id)), array('$unset' => array($element => "")));
	}
}