describeComponent('components/chart/area_stacked_chart', function () {
	var test_data = {
	   "range":[
	      new Date(1356994800000),
	      new Date(1357167600000)
	   ],
	   "valueRange":[
	      null
	   ],
	   "value":{
    		"modelDATA": [{date: 1356994800000, value: 3}, {date: 1357081200000, value: 6}, {date: 1357167600000, value: 2}],
    		"modelTIME": [{date: 1356994800000, value: 3}, {date: 1357081200000, value: 6}, {date: 1357167600000, value: 2}]
    	}
	   
	};

	beforeEach(function(){
		setupComponent({
			model:'model',
          	subModelsSufix: ['DATA', 'TIME'],
          	cssClass: ['green','yellow'],
          	colorLine: ['#aec4bc', '#b5a86a']
        });
	});

	it('AreaStackedChart component to be defined', function(){
		expect(this.component).toBeDefined();
		expect(this.component.attr.cssClass).toBeDefined();
		expect(this.component.attr.model).toBeDefined();
		expect(this.component.attr.colorLine).toBeDefined();
	});

	it('When trigger "valueChange" then createChart and updateChart is called', function () {
	  	spyOn(this.component, 'updateChart');
	    spyOn(this.component, 'createChart');
	    this.component.$node.trigger('valueChange', test_data); 	
	    expect(this.component.createChart).toHaveBeenCalled();
	    expect(this.component.updateChart).toHaveBeenCalled();
	});

	it('Created as many layers as subModel', function () {
	    this.component.$node.trigger('valueChange', test_data); 	
	    expect($('.layer').length).toBe(2);
	});

	it('component on "resize", size changes', function(){
		var size = {width: 300, height: 200};
		this.component.trigger('resize', size);
	 	expect(this.component.width).toEqual(size.width);
	 	expect(this.component.height).toEqual(size.height);
	});

	it('Show tooltips', function(){

		setupComponent({
			model:'model',
          	subModelsSufix: ['DATA', 'TIME'],
          	cssClass: ['green','yellow'],
          	colorLine: ['#aec4bc', '#b5a86a'],
          	tooltip: true
        });
		this.component.$node.trigger('valueChange', test_data); 
		this.component.showTooltip($('.hoverCircle')[0],10);
     	expect($('.tooltip').css('display')).toEqual('block');
	});
});
