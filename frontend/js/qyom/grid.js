function QyomGrid(options){
	this.options = options;
	if(!this.options) {
		throw "Options are not specified";
	}	
	if(!this.options.dataContainer || !(this.options.dataContainer instanceof jQuery)) {
		throw "dataContainer is invalid.";
	}
	var grid = this;
	var fltersDom = $('#filters');
	var sortersDom = $('#sorters');
	var paginatorDom = $('.paginator');
	var selectedDom = $('.selected-records');
	var selectorsDom = $('.selectors');
	var selection = {"all": 0, "picked":{}};
	
	this.getSelection = function(){
		
		ids = '';		
		var totalPicked = 0;	
		for(i in selection.picked) {
			ids += (ids ? ',':'') + i;	
			totalPicked++;			
		}
		selection.totalPicked = totalPicked;
		selection.totalSelected = selection.all ? grid.totalRecords-totalPicked : totalPicked;
		selection.pickedIds = ids;
		   
		return selection;
	}
	
	this.addSelectionToForm = function(form) {
		selection = grid.getSelection();
		if(selection.totalSelected <=0 ) {
			return false;
		}
		form.prepend('<input type="hidden" name="all" value="'+selection.all+'" />');
		form.prepend('<input type="hidden" name="ids" value="'+selection.pickedIds+'" />');
		return selection;
	}
	
	this.bindSelectors = function(){ 
		$('.selector-toggler').click(function(){
			isActive = $(this).hasClass('active');
			if(isActive){
				$('.selectors').hide();
				$('.select-item input').hide();	
				$('.selector-target').hide();
				$(this).removeClass('active');
			}else {
				$('.selectors').show();				
				$('.select-item input').show();
				$(".selector-toggler.active").removeClass('active');
				$(this).addClass('active');
				
				$('.selector-target:visible').hide();
				if($(this).hasClass('send-email')) {
					$(".email-form").show();
				} else if($(this).hasClass('delete-in-bulk')) {
					$(".bulk-delete-form").show();
				}
			}
		});
		$('.select-item input').live('click', function(){
			//console.log("is Checked:", $(this).is(":checked"));			
			if($(this).is(":checked")) {	
				if(!selection.all) {
					selection.picked[$(this).val()] = $(this).attr('email');
				} else {
					delete selection.picked[$(this).val()];	
				}
				
				shift = 1;
			} else {		
				if(!selection.all) {
					delete selection.picked[$(this).val()];	
				} else {
					selection.picked[$(this).val()] = $(this).attr('email');
				}				
				shift = -1;
			}
			selectedDom.text(parseInt(selectedDom.text())+shift);			
		});
		
		selectorsDom.find('.select-all,.unselect-all').click(function(){
			all = +$(this).hasClass('select-all');
			selection.all = all;
			selection.picked = [];
			//console.log("all", all);
			$(".select-item input").attr("checked", !!all);
			
			selectedDom.text(all ? parseInt(grid.totalRecords) : 0);
			
		}); 
		selectorsDom.find('.select-visible,.unselect-visible').click(function(){
			add = !!$(this).hasClass('select-visible');
			//console.log("all", selection.all, "add", add);
			$(".select-item input").each(function(){				
				 
				if((!!$(this).attr("checked"))!=add) {
					clickEvent = new $.Event('click');
					clickEvent.preventDefault();
					$(this).attr("checked", add).trigger(clickEvent);
				}
			});			
		});
	}

    function runSearch()
    {
        paginatorDom.find('.current-page').val(1);
        grid.renderData();
        return false;
    }
	fltersDom.find('input.filter').keyup(function(evt){		
		if(evt.keyCode != 13) {
			return false;
		}
        runSearch();
        return false;
	});
    fltersDom.find('select.filter').change(runSearch);
    $(".search-icon").click(runSearch);

	sortersDom.find('.sorter').click(function(evt){				
		toggleOrder = $(this).attr("order")=='asc' ? 'desc' : 'asc';
		sortersDom.find('.sorter.active').removeClass('active').removeAttr('order').nextAll('span:visible').hide();
		$(this).addClass('active').attr('order', toggleOrder).nextAll('span.'+toggleOrder).show();
		paginatorDom.find('.current-page').val(1);
		grid.renderData();
		return false;
	}).hover(function(){
		toggleOrder = $(this).attr("order")=='asc' ? 'desc' : 'asc';
		$(this).nextAll('div').hide().filter('div.'+toggleOrder).show();
	}, function(){
		order = $(this).attr('order');
		$(this).nextAll('div').hide().filter('div.'+order).show();
	});	
	paginatorDom.find('input.current-page').keyup(function(evt){		
		if(evt.keyCode != 13) {
			return false;
		}
		paginatorDom.find('input.current-page').val($(this).val());
		grid.renderData();
		return false;
	});
	
	paginatorDom.find('span.pointer').click(function(){	
		if($(this).hasClass('deactive')) {
			return false;
		}
		newPage = parseInt(paginatorDom.find('input.current-page').val());		
		if($(this).hasClass('prev')) {
			newPage--;
		} else {
			newPage++;
		}
		if(newPage<=0) {
			return false;
		}
		paginatorDom.find('input.current-page').val(newPage);
		grid.renderData();
		return false;
	});
	this.bindSelectors();	
	
	this.renderData = function(){		
		var dataContainer = this.options.dataContainer;
		$(".data-loading").show();
		$.getJSON(this.options.serverUrl, this.constructParams(), function(json){
			if(!json.success) {
				alert("Something went wrong, please report this incident to our tech team");
				return false;
			}
			$(".data-loading").hide();
			dataContainer.html(json.data.resultset);
			paginatorDom.find('.total-pages').text(json.data.totalPages);
			curPage = parseInt(paginatorDom.find('.current-page').val());
			// Edge case
			if(curPage > json.data.totalPages) {
				paginatorDom.find('.current-page').val(curPage = json.data.totalPages);
			}
			if(curPage < json.data.totalPages) {
				paginatorDom.find('.next').removeClass('deactive');
			} else {
				paginatorDom.find('.next').addClass('deactive');
			}
			if(curPage > 1) { 
				paginatorDom.find('.prev').removeClass('deactive');
			} else {
				paginatorDom.find('.prev').addClass('deactive');
			}
			$(".total-records").text(json.data.totalRecords);
			grid.totalRecords = json.data.totalRecords;
			
			$(".select-item input").each(function(){
				//alert($(this).val() + ' = ' + selection.picked[$(this).val()]);
				if((!selection.all && selection.picked[$(this).val()] != undefined) ||
				   ( selection.all && selection.picked[$(this).val()] == undefined)){
						
					$(this).attr('checked', true);				
				}
			});
			
			if(typeof start_popout == "function") {
				start_popout();
			}
			
			if(grid.options.afterLoad != undefined) {
				grid.options.afterLoad();
			}
		});
		
		return this;
	}
	
	this.constructParams = function(){
		params =  this.options.baseParams;
		filters = {};
		$('.filter').each(function(){
			if($(this).val()) {
                // Page filter should be treated differently
                if($(this).attr("name") == 'page') {
                    filters[$(this).attr('name')] = $(this).val();
                }   else {
                    operation = $(this).attr("operation") ? $(this).attr("operation") : "like";
                    filters[$(this).attr('name')] = {"value": $(this).val(), "operation": operation};
                }
			}
		});
		params.filters = $.stringify(filters);
		params.selectorsActive = parseInt($('.selectors:visible').length);		
		
		sortObj = sortersDom.find('.sorter.active');
		sorters = {};
		if(sortObj.length > 0) {
			sorters[sortObj.attr("name")] = sortObj.attr('order');
		}
		params.sorters = $.stringify(sorters);		
		return params;
	}
	
}
