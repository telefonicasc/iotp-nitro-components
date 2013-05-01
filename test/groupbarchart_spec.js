describeComponent('components/chart/group_bar_chart', function () {
  
  var test_data = {'valueField':[ { date:2, value: {'group1': 1, 'group2': 2 } } ] };

  // initialize the component and attach it to the DOM
  beforeEach(function(){
  	setupComponent( {model: 'valueField'} );
  });

  it('component has attributes defined', function(){
  	 expect(this.component).toBeDefined();
  });

  it('When trigger "valueChange" then updateChart is called', function () {
  	var options = { 
  		value: test_data, 
  		range: [1, 10], 
  		valueRange: [] 
  	};
  	spyOn(this.component, 'updateChart');
    this.component.$node.trigger('valueChange', options); 	
    expect(this.component.updateChart).toHaveBeenCalled();
  });

  it('When trigger "valueChange" data changes and is processed', function () {
  	var options = { 
  		value: test_data, 
  		range: [1, 10], 
  		valueRange: [] 
  	};
    this.component.$node.trigger('valueChange', options); 	
    expect(this.component.value).toEqual( { group1 : [ 1, 0 ], group2 : [ 2, 0 ] } );
  });

});  