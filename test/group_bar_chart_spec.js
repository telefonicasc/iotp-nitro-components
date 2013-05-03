describeComponent('components/chart/group_bar_chart', function () {
  
  var test_data = {
    'valueField':[ 
                   { date: 2, value: {'group1': 1, 'group2': 2 } },
                   { date: 3, value: {'group1': 6, 'group2': 7 } }     
                  ]};
  var options = { value: test_data, range: [1, 10], valueRange: [] };

  // initialize the component and attach it to the DOM
  beforeEach(function(){
  	setupComponent( {grid: false, model: 'valueField', incremental: true} );
  });

  it('component has attributes defined', function(){
  	 expect(this.component).toBeDefined();
  });

  it('When trigger "valueChange" then updateChart is called', function () {
  	spyOn(this.component, 'updateChart');
    this.component.$node.trigger('valueChange', options); 	
    expect(this.component.updateChart).toHaveBeenCalled();
  });
  
  it('component values are incremental then trigger "valueChange", groups and bars are painted', function () {
    this.component.$node.trigger('valueChange', options); 	
    expect($('.group').length).toEqual(2); // 2 groups
    expect($('rect.chartbar').length).toEqual(4); //4 bars in total
  });


  it('component preprocess data (incremental)', function () {
    setupComponent( {grid: false, model: 'valueField', incremental: true} );
    var out = this.component.prepareChartData(test_data['valueField'], 11);
    expect(out.data).toEqual({ group1 : [ 1, 7 ], group2 : [ 2, 9 ] });
  });

  it('component preprocess data (NOT incremental)', function () {
    setupComponent( {grid: false, model: 'valueField', incremental: false} );
    var out = this.component.prepareChartData(test_data['valueField'], 11);
    expect(out.data).toEqual({ group1 : [ 1, 6 ], group2 : [ 2, 7 ] });
  });

  it('When trigger "resize" then updateChart is called', function () {
    spyOn(this.component, 'updateChart');
    var test_size = {width: 200, height: 145};
    this.component.$node.trigger('resize', test_size);
    expect(this.component.width).toEqual(test_size.width);
    expect(this.component.height).toEqual(test_size.height);
    expect(this.component.updateChart).toHaveBeenCalled();
  });

});  