{php}
    $this->assign("grid", array('columns'=>array(
    array("name"=>"Status","code"=>"status", "width"=>65, isSorter=>false, isFilter=>true,  filter=>array('operation'=>'eq', 'type'=>'dropdown', 'options'=>array('' => 'All', '100' => 'Actives', '50' => 'Inactives'))),
    array(name=>"",code=>"", width => 61),
    array(name=>"Email",code=>"email", width=>95, isSorter=>true, isFilter=>true),
    array(name=>"Name",code=>"name", width=>100, isSorter=>true, isFilter=>true),
    array(name=>"Styles",code=>"stylesTotal", width => 40, isSorter=>true, isFilter=>true, filter=>array(operation=>'eq')),
    array(name=>"Retailers",code=>"retailersTotal", width => 55, isSorter=>true, isFilter=>true, filter=>array(operation=>'eq')),
    array("name"=>"Joined","code"=>"dateJoin", width => 60, isSorter=>true, sorter=>array('active'=>'asc')),
    ),
    actionsWidth => 270,
    ));
{/php}
{include file="includes/grid.tpl"}