<?php
class Member_Table extends Abstract_Table
{
    protected $_name = 'members';
    protected $_primary = 'id'; 
    protected $_rowClass = 'Member_Table_Row';
	protected $_rowsetClass = 'Member_Table_Rowset';
    
    protected $_dependentTables = array('Style_Table');
    
    protected $_referenceMap    = array(
        'role' => array(
            'columns'           => 'role_id',
            'refTableClass'     => 'Role_Table',
            'refColumns'        => 'id',
            'onDelete'          => self::RESTRICT,
            'onUpdate'          => self::CASCADE
        ), 
    );
    
    const CC_DELIMITER = ',';

    public function init()
    {
        $this->_filterMap['name']['alias'] = 'd';
        $this->_filterMap['status']['alias'] = 'd';

        parent::init();
    }

    public function fetchByFilters($arr_filters, $arr_sorters, $page, $limit)
    {
        $select = $this->select()->setIntegritycheck(false);

        return $this->_gridisizeSelect($select, $arr_filters, $arr_sorters, $page, $limit);
    }
}
