<?php 
abstract class Abstract_Service
{
	public function __construct()
	{
		$this->init();
	}	
	
	public function init(){}

    public function saveLastSearch($sarchFor, $arr_filters, $arr_sorters, $arr_extra=null) {
        $search = new Zend_Session_Namespace('search');
        $search -> $sarchFor = array($arr_filters, $arr_sorters, $arr_extra);
    }

    /**
     * Based on the current service, returns other model of the same component
     * @param $model: e.g. table, validator, mapper, email
     */
    protected function _getComponentModel($class) {
        $class = $this->_getComponentPrefix() . "_" . ucwords($class);
        return new $class;
    }

    protected function _getComponentPrefix() {
        return substr(($x=get_class($this)), 0, strlen($x)-8);// 8 = strlen("_Service")
    }
}