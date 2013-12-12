describeComponent('components/chart/chart_container', function () {
	var charts_conf = [
          {
            type: 'areaChart',
            tooltip: true,
            area: false,
            model: 'consumers',
            rangeField: 'selectedRange',
            cssClass: 'olive'
          },
          {
            type: 'areaChart',
            tooltip: true,
            area: false,
            model: 'visitors',
            rangeField: 'selectedRange',
            cssClass: 'purple'
    }];
    var mock_data = {
    	'value': {
    		'visitors': [{date: 1356994800000, value: 3}, {date: 1357081200000, value: 6}, {date: 1357167600000, value: 2}],
    		'consumers': [{date: 1356994800000, value: 3}, {date: 1357081200000, value: 6}, {date: 1357167600000, value: 2}]
    	},
    	'silent': true
    };

	beforeEach(function(){
		setupComponent();
	});

	it('chartContainer component to be defined', function(){
  	 	expect(this.component).toBeDefined();
  	 	expect($('.y.axis')).toBeDefined();
  	 	expect($('.x.axis')).toBeDefined();
  	});

  	it('charts attached to component', function(){
        setupComponent({charts:charts_conf});
        expect($('.chart').length).toBe(2);
  	});

  	it('When trigger "valueChange" then setValueRange is called', function () {
  		setupComponent({valueField: 'visitors', charts:charts_conf});
    	this.component.$node.trigger('valueChange', mock_data);
    	expect(this.component.options).toEqual(mock_data);
  	});
});