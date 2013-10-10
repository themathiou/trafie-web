<?php

class Manage_dbController extends Controller
{
	public $layout='//layouts/column2';
	/**
	 * Displays a list of the collections as links and lets you create
	 * new collections
	 */
	public function actionIndex()
	{
		$collection = new Collections();
		
		$message = '';
		
		// Handles collection creation
		if(isset($_POST['collection_name']) && trim($_POST['collection_name']))
		{
			if(!$collection->create(trim($_POST['collection_name'])))
			{
				$message = 'This collection already exists.';
			}
		}
		
		// Handles collection deletion
		if(isset($_POST['delete']))
		{
			$collection->delete(key($_POST['delete']));
		}
		
		$data = array(
				'collection_names'	=> $collection->get_all(),
				'message'		=> $message
		);
		
		$this->render('index', $data);
	}
	
	/**
	 * Displays all the documents of a collection and offers total editing
	 * on the data of each document.
	 * 
	 * @param string $collection_name
	 * @param int $page
	 */
	public function actionManage_collection($collection_name, $page=0)
	{
		$document = new Documents();
		$collection = new Collections();
		
		// Handles the deletion of a document
		if(isset($_POST['delete']))
		{
			$id = key($_POST['delete']);
			
			$document->delete($collection_name, $id);
		}
		
		// Handles the deletion of an element in a document
		if(isset($_POST['delete_element']))
		{
			$element = key($_POST['delete_element']);
			$document_id = $_POST['values']['_id'];
			
			$document->delete_element($collection_name, $document_id, $element);
		}
		
		// Handles the update of a document
		if(isset($_POST['update']))
		{
			foreach($_POST['values'] as $key => $value)
			{
				$values[$key] = !is_numeric($value) && json_decode($value)? (array)json_decode($value): $value;
			}
			$document->update($collection_name, $values);
		}
		
		// Adds an element in a single document of the collection
		if(isset($_POST['add_element']))
		{
			$values = $_POST['values'];
			$new_element = trim($_POST['new_element']);
			if($new_element && !array_key_exists($new_element, $values)){
				$values[$new_element] = $_POST['new_value'];
				$document->update($collection_name, $values);
			}
		}
		
		// Creates a new document
		if(isset($_POST['create_document']))
		{
			if(trim($_POST['new_element']) && $_POST['new_value'])
			{
				$new_value = !is_numeric($_POST['new_value']) && json_decode($_POST['new_value'])? (array)json_decode($_POST['new_value']): $_POST['new_value'];
				$elements = array($_POST['new_element'] => $new_value);
				$document->create($collection_name, $elements);
			}
		}
		
		// Adds elements to every document of the collection
		if(isset($_POST['create_elements']))
		{
			if(trim($_POST['new_element']))
			{
				$new_element = trim($_POST['new_element']);
				foreach($collection->get($collection_name) as $current_document)
				{
					if(!array_key_exists($new_element, $current_document))
					{
						$values[$new_element] = NULL;
						$values['_id'] = $current_document['_id'];
						$document->update($collection_name, $values);
					}
				}
			}
		}
		
		// Deletes an element from every document of the collection
		if(isset($_POST['delete_elements']))
		{
			if(trim($_POST['element_to_delete']))
			{
				$selected_element = trim($_POST['element_to_delete']);
				foreach($collection->get($collection_name) as $current_document)
				{
					if(array_key_exists($selected_element, $current_document))
					{
						$document->delete_element($collection_name, $current_document['_id'], $selected_element);
					}
				}
			}
		}

		// Number of documents per page
		$results_per_page = 100;
		// Number of documents before the current page
		$offset = $results_per_page*$page;
		// Number of documents in current page
		$page_documents = $collection->get($collection_name,$results_per_page,$offset);
		// The total number of documents of the collection
		$collection_size = $page_documents->count();
		// The number of pages is at least one
		$number_of_pages=1;
		if($results_per_page)
		{
			$number_of_pages = ceil($collection_size/$results_per_page);
		}
		
		$pagination = array();
		if($number_of_pages <= 7)
		{
			for($i=0; $i<$number_of_pages; $i++)
			{
				$pagination[$i] = CHtml::link($i,array('/manage_db/manage_collection/','collection_name'=>$collection_name,'page'=>$i));
			}
		}
		else 
		{
			$pagination[0] = CHtml::link(0,array('/manage_db/manage_collection/','collection_name'=>$collection_name,'page'=>0));
			for($i=$page-2; $i<=$page+2; $i++)
			{
				$pagination[$i] = CHtml::link($i,array('/manage_db/manage_collection/','collection_name'=>$collection_name,'page'=>$i));
			}
			$pagination[$number_of_pages] = CHtml::link($number_of_pages,array('/manage_db/manage_collection/','collection_name'=>$collection_name,'page'=>$number_of_pages));
			
			// Removing all the links that link to non-existing pages
			foreach($pagination as $page_number => $page)
			{
				if($page_number < 0 || $page_number > $number_of_pages)
				{
					unset($pagination[$page_number]);
				}
			}
		}
		
		$data = array(
			'pagination'		=> $pagination,
			'number_of_pages'	=> $number_of_pages,
			'page_documents'	=> $page_documents,
			'collection_name'	=> $collection_name
		);
		$this->render('manage_collection', $data);
	}
	
}