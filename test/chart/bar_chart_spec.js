
describeComponent('components/chart/bar_chart', function () {
 	
  var test_data = {'valueField':[ { date:2, value:45 }, { date:3, value:71 } ] };
 	var options = { value: test_data, range: [1, 10], valueRange: []  };	
  // initialize the component and attach it to the DOM
  beforeEach(function(){
  	setupComponent( {model: 'valueField'} );
  });

  it('Barchart component to be defined', function(){
  	 expect(this.component).toBeDefined();
  });

  it('When trigger "valueChange" then updateChart is called', function () {
  	spyOn(this.component, 'updateChart');
    this.component.$node.trigger('valueChange', options); 	
    expect(this.component.updateChart).toHaveBeenCalled();
  });

  it('When trigger "resize" then updateChart is called', function () {
  	setupComponent( { value: test_data  });
  	var chartSize = { width: 1, height: 2 };
  	spyOn(this.component, 'updateChart');
    this.component.$node.trigger('resize', chartSize); 	
    expect(this.component.updateChart).toHaveBeenCalled();
  });

  it('When trigger "valueChange" and data within range', function () {
    this.component.$node.trigger('valueChange', options); 	
    expect(this.component.attr.value).toEqual( test_data['valueField'] );
    expect($('rect.bar').length).toEqual(test_data['valueField'].length);
  });

  it('When trigger "valueChange" and data OUT of range', function () {
  	var options = { value: test_data, range: [5, 10], valueRange: [] };
    this.component.$node.trigger('valueChange', options); 	
    expect(this.component.attr.value).toEqual( [] );
    expect($('rect.bar').length).toEqual(0);
   
  });

  it('When trigger "resize" width and height must be applied', function(){
  	setupComponent( { value: test_data  });
  	var chartSize = { width: 1, height: 2 };
  	this.component.$node.trigger('resize', chartSize);
  	expect(this.component.width).toEqual(1); 	
  	expect(this.component.height).toEqual(2); 
  });

});