describeComponent('components/chart/radar_chart', function () {
 	
  var test_data = {'valueField':[ { date:2, value:45 } ] };
	var options = { value: test_data, range: [1, 10], valueRange: [] }; 		
  // initialize the component and attach it to the DOM
  beforeEach(function(){
  	setupComponent();
  });

  it('RadarChart component to be defined', function(){
  	 expect(this.component).toBeDefined();
  });

 
  it('When trigger "valueChange" updateChart is called', function () {
  	spyOn(this.component, 'updateChart');
    this.component.$node.trigger('valueChange', options); 	
    expect(this.component.updateChart).toHaveBeenCalled();
  });

  it('When trigger "valueChange" data is updated', function () {
    this.component.$node.trigger('valueChange', options); 	
    expect(this.component.value).toBeDefined();
    expect(this.component.value).toEqual( test_data );
  });

});