describeComponent('components/chart/group_bar_chart', function () {
  
  var test_data = { 'valueField':[ 
                   { date: 2, value: {'group1': 1, 'group2': 2 } },
                   { date: 3, value: {'group1': 10, 'group2': 70 } }     
                  ]};
  var options = { value: test_data,  range: [1, 10],  valueRange: [] };                

  // initialize the component and attach it to the DOM
  beforeEach(function(){
  	setupComponent( {grid: false, model: 'valueField'} );
  });

  it('When trigger "valueChange" then updateChart is called', function () {
  	spyOn(this.component, 'updateChart');
    this.component.$node.trigger('valueChange', options); 	
    expect(this.component.updateChart).toHaveBeenCalled();
  });
  
  it('with attr "incremental", trigger "valueChange", so data is processed and painted', function () {
  	setupComponent( {grid: false, model: 'valueField', incremental: true} ); 
    this.component.$node.trigger('valueChange', options); 	
    expect(this.component.value).toEqual( { group1 : [ 1, 11 ], group2 : [ 2, 72 ] } );
    expect($('.group').length).toEqual(2); //2 groups
  });


  it('with attr "NOT incremental", trigger "valueChange", so data is processed and painted', function () {
    setupComponent( {grid: false, model: 'valueField', incremental: false} ); 
    this.component.$node.trigger('valueChange', options);   
    expect(this.component.value).toEqual( { group1 : [ 1, 10 ], group2 : [ 2, 70 ] } );
    expect($('.group').length).toEqual(2); //2 groups
  });

  it('component is resized', function () {
    spyOn(this.component, 'updateChart');
    this.component.$node.trigger('resize', options);   
    expect(this.component.updateChart).toHaveBeenCalled();
  });

});  