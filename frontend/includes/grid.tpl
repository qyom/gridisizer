{headScript method='appendFile' args='src=>/js/qyom/grid.js'}
{headLink method='appendStylesheet' args='href=>/css/qyom/grid.css'}
<div class="table">

    <div class="selectors">
        <span class="selector select-all">Select all</span> |
        <span class="selector unselect-all">Unselect all</span> |
        <span class="selector select-visible">Select visible</span> |
        <span class="selector unselect-visible">Unselect visible</span> |
        <b>Selected Records: <span class="selected-records">0</span></b>

    </div>

    <div class="paginator" style="border-bottom: 1px solid #333; padding-bottom: 5px;">
        <span class="pointer prev">&lt;&lt;Prev</span> &nbsp; | &nbsp;
        Page <input type="text" class="filter current-page" name="page" value="{if $populate.filters.page}{$populate.filters.page}{else}1{/if}" /> of <span class="total-pages">1</span> &nbsp; | &nbsp;
        <span class="pointer next">Next&gt;&gt;</span> &nbsp; | &nbsp;
        Total Records: <span class="total-records"></span>
        <span class="message just-updated hidden">Record Updated Successfully!</span>
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="fixed">
        <thead width="100%">
        <tr id="sorters">
            <th class="select-item" width="{if isset($grid.selectionWidth)}{$grid.selectionWidth}{else}15{/if}"></th>
            {foreach from=$grid.columns item=column}
                {assign var='columnCode' value=$column.code}
                <th width="{$column.width}">
                    {if !$column.isSorter}
                    {$column.name}
                    {else}
                    <span class="sorter
                    {if (empty($populate.sorters) && $column.sorter.active) || !empty($populate.sorters.$columnCode)} active{/if}
                    " id="{$column.code}-sorter"
                          {if empty($populate.sorters) && $column.sorter.active} order="{$column.sorter.active}"
                          {elseif !empty($populate.sorters.$columnCode)} order="{$populate.sorters.$columnCode}"{/if}
                    name="{$column.code}" title="Sort By {$column.name}">{$column.name}</span> <div class="asc">&uarr;</div><div class="desc">&darr;</div>
                    {/if}
                </th>
            {/foreach}
            <th width="{$grid.actionsWidth}"></th>
        </tr>
        <tr id="filters">
            <th class="select-item"></th>

            {foreach from=$grid.columns item=column}
                {assign var='columnCode' value=$column.code}
                {if !$column.isFilter}
                <th></th>
                {else}
                <th class="filter-{$column.code}">
                    {if $column.filter.type=='dropdown'}
                        <select class="filter" name="{$column.code}" title="Search By {$column.name}" {if $column.filter.operation}operation="{$column.filter.operation}"{/if}>
                        {foreach from=$column.filter.options item=optionVal key=optionKey}
                            <option value="{$optionKey}" {if $populate.filters.$columnCode.value == $optionKey}selected{/if}>{$optionVal}</option>
                        {/foreach}
                        </select>
                    {else}
                    <input type="text" class="filter" name="{$column.code}" title="Search By {$column.name}" {if $column.filter.operation}operation="{$column.filter.operation}"{/if} value="{$populate.filters.$columnCode.value}" />
                    {/if}
                </th>
                {/if}

            {/foreach}
            <th align="right"><a class="button search-icon" title="filter the resultset">GO</a>Actions</th>
        </tr>
        </thead>
        <tbody id="data-container">
        </tbody>
    </table>

    <div class="paginator" style="border-top: 1px solid #333; padding-top: 5px;">
        <span class="pointer prev">&lt;&lt;Prev</span> &nbsp; | &nbsp;
        Page <input type="text" class="filter current-page" name="page" value="{if $populate.filters.page}{$populate.filters.page}{else}1{/if}" /> of <span class="total-pages">1</span> &nbsp; | &nbsp;
        <span class="pointer next">Next&gt;&gt;</span> &nbsp; | &nbsp;
        Total Records: <span class="total-records"></span>
    </div>
    <div class="data-loading">Loading...</div>
</div>