<?php
class Member_Service extends Abstract_Service
{
    const MEMBERS_PER_PAGE = 15;

    public function fetchByFilters($arr_filters, $arr_sorters, $namespace)
    {
        $MemberTable = $this->_getComponentModel('table');

        $this->saveLastSearch($namespace, $arr_filters, $arr_sorters);

        $page = $arr_filters['page'];
        unset($arr_filters['page']);

        return new Qyom_Response(true, $MemberTable->fetchByFilters($arr_filters, $arr_sorters, $page, self::MEMBERS_PER_PAGE));
    }
}
