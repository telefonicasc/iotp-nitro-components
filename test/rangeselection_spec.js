describeComponent('components/chart/range_selection', function () {
  
  var test_data = {'valueField':[ { date:2, value:45 } ] };	 
  var test_selection = { text: 'text', action: 'action', range: 7 };		

  // initialize the component and attach it to the DOM
  beforeEach(function(){
  	setupComponent();
  });

  it('component has attributes defined', function(){
  	 expect(this.component.attr.fixRange).toBeDefined();
  	 expect(this.component.attr.x).toBeDefined();
  	 expect(this.component.attr.y).toBeDefined();
  });

  it('When trigger "valueChange" data is updated', function () {
  	var options = { 
  		value: test_data, 
  		range: [1, 10], 
  		valueRange: [] 
  	};
    this.component.$node.trigger('valueChange', options); 	
    expect(this.component.value).toEqual(test_data);
  });

  it('When trigger "rangeSelected" a range is set', function () {
  	this.component.value = test_data;
    this.component.$node.trigger('rangeSelected', test_selection); 	
    expect(this.component.attr.fixRange).toEqual(test_selection.range);
  });

  it('When trigger "resize" range changes and chart is resized', function () {
  	setupComponent( { x: d3.time.scale().range([0, 3]), y: d3.scale.linear().range([5, 0]) } );
  	this.component.value = test_data;
    this.component.$node.trigger('resize'); 	
    expect(d3.select(this.component.node).select('rect').attr('height')).toEqual(''+5);
    expect(d3.select(this.component.node).select('rect').attr('width')).toEqual(''+3);
  });


});  