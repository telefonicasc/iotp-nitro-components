describeComponent('components/chart/group_bar_chart', function () {
  
  var test_data = { 'categoryValueField':{
    '35': {
      'values':{
        '1356566400000': { 'group1': [10, 30], 'group2': [5, 8] },
        '1356652800000': {'group1': [3, 29], 'group2': [2, 11] }
      },
      'totalCount': {
        '1356566400000': {'group1': 50, 'group2': 46},
        '1356652800000': {'group1': 6, 'group2': 7}
      },
      'maxValue': 7,
      'caption1': 'text',
      'caption2': 'text'
    } 
  },
  fixRange: 35};
  
  var options = { value: test_data, range: [1356566400000, 1358985600000], valueRange: [] };

  // initialize the component and attach it to the DOM
  beforeEach(function(){
  	setupComponent( {grid: false, model: 'ValueField', incremental: true, aggregation: 'category'} );
  });

  it('component has attributes defined', function(){
  	 expect(this.component).toBeDefined();
  });

  it('When trigger "valueChange" then updateChart is called', function () {
  	spyOn(this.component, 'updateChart');
    this.component.$node.trigger('valueChange', options); 	
    expect(this.component.updateChart).toHaveBeenCalled();
  });
  
  /*it('component values are incremental then trigger "valueChange", groups and bars are painted', function () {
    this.component.$node.trigger('valueChange', options); 	
    expect($('.group').length).toEqual(2); // 2 groups
    //expect($('rect.chartbar').length).toEqual(4); //4 bars in total
  });*/

  it('When trigger "resize" then updateChart is called', function () {
    spyOn(this.component, 'updateChart');
    var test_size = {width: 200, height: 145};
    this.component.$node.trigger('resize', test_size);
    expect(this.component.width).toEqual(test_size.width);
    expect(this.component.height).toEqual(test_size.height);
    expect(this.component.updateChart).toHaveBeenCalled();
  });

});  
