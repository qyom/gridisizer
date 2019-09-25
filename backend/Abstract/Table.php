<?php
abstract class Abstract_Table extends Zend_Db_Table_Abstract
{	
	protected $_rowClass = 'Abstract_Table_Row';
	protected $_rowsetClass = 'Abstract_Table_Rowset';    

    protected $_filterMap=array();
    protected $_sorterMap = array();
    
    public function init()
    {
        $this->_filterMap += array(
            "pos" => array('isAggr' => true, 'sanitizer'=>intval),
            "retailersTotal" => array('isAggr' => true, 'sanitizer'=>intval),
            "stylesTotal" => array('isAggr' => true, 'sanitizer'=>intval),
        );

		return parent::init();
	}
 
		
	/**
	 * Returns the first row of the find query
	 *
	 * @param Integer|Array $primary
	 * @return Zend_Db_Table_Row
	 */
	public function get($pk){
		
		// If the Primary Key is an Array
		if(is_array($pk)){
			// Call the parent's find method with dynamic amount of parameters
			return call_user_func_array(array($this,'find'), $pk)->current();
		}
		// The primary Key Is a single column
		return parent::find($pk)->current();
	}
	
	
	/**
	 * Update by PK, Filtering the data and using the Row class
	 *
	 * @param Arary $arr_data
	 * @param String $where
	 */
	public function updateByPk($arr_data, $pk)
	{
		return $this->get($pk)->setFromArray($arr_data)->save();		
	}
	
	/**
    * Delete By PK using the Row class
    *
    * @param $id - Integer OR Array
    * @return void
    */
    public function deleteByPk($pk){   	
    	if($row = $this->get($pk)){
    		$row -> delete();
    		return true;
    	}
    	return false;
    }


    /**
     * Filter, sort and polish the select statement data to serve in a data grid
     *
     * @param Zend_Db_Select $selectResult
     * @param array $arr_filters
     * @param array $arr_sorters
     * @param int $page
     * @param int $limit
     * @return array: The gridisized data that contains: resultset, totalRecords, totalPages
     */
    protected function _gridisizeSelect($selectResult, $arr_filters, $arr_sorters, $page, $limit)
    {
        $this->applyFilters($selectResult, $arr_filters)->applySorters($selectResult, $arr_sorters);
           //echo $selectResult;exit;

        $sqlCount = "SELECT COUNT(id) AS totalRecords FROM (" . $selectResult->__toString() . ") AS resultset";
        $selectResult -> limitPage(intval($page), intval($limit));

        //$selectResult->reset('columns')->reset('limit')->columns;
        //$selectResult -> group('r.id');
        $totalRecords = $this->getAdapter()->fetchOne($sqlCount);
        $totalPages = intval(($totalRecords-1)/$limit)+1;
        //echo $totalRecords;
        $resultset = $this->fetchAll($selectResult, self::DATA_TYPE_ASSOC);

        return array("resultset" => $resultset, "totalRecords" => $totalRecords, "totalPages" => $totalPages);
    }

    public function applySorters($selectResult, $arr_sorters)
    {
        //var_dump($arr_filters);
        $order = "";
        foreach ($arr_sorters as $sortColumn => $sortOrder) {
            if($this->_sorterMap[$sortColumn]['isComplex']) {
                continue;
            }
            if(isset($this->_sorterMap[$sortColumn]['alias'])) {
                $sortColumn = $this->_sorterMap[$sortColumn]['alias'].".".$sortColumn;
            }
            $order .= ($order ? ', ' : '') . "{$sortColumn} {$sortOrder}";
        }
        $selectResult -> order($order);

        return $this;
    }

    public function applyFilters($selectResult, $arr_filters)
    {
        //var_dump($this->_filterMap);exit;
        foreach ($arr_filters as $filterColumn => $arr_filter) {
            if($this->_filterMap[$filterColumn]['isComplex'] || !isset($arr_filter['value'])) {
                continue;
            }
            $method = "where";

            if(isset($this->_filterMap[$filterColumn])) {
                // If it's an aggregated column/filter then use having instead where
                if($this->_filterMap[$filterColumn]['isAggr']) {
                    $method = "having";
                }
                // Apply the sanitizer if specified
                if($this->_filterMap[$filterColumn]['sanitizer']) {
                    $arr_filter['value'] = $this->_filterMap[$filterColumn]['sanitizer']($arr_filter['value']);
                }
                if(isset($this->_filterMap[$filterColumn]['alias'])) {
                    $filterColumn = $this->_filterMap[$filterColumn]['alias']."`.`".$filterColumn;
                }
            }

            $selectResult -> $method($this->buildFilterClause("`{$filterColumn}`", $arr_filter));
        }
        return $this;
    }
    public function buildFilterClause($column, $arr_filter) {
        switch($arr_filter['operation']) {
            case 'eq':
                return $column . ' = ' . $arr_filter['value'];
            case 'matchStart':
                return $column . " LIKE  '" . $arr_filter['value'] . "%'";
            case 'matchEnd':
                return $column . " LIKE  '%" . $arr_filter['value'] . "'";
            case 'match':
            default:
                return $column . " LIKE  '%" . $arr_filter['value'] . "%'";
        }
    }
}
