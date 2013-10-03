describeComponent('components/chart/area_chart', function () {
  var test_data = { 'modelField':[
                   { date: 2, value:  1 },
                   { date: 3, value: 10 }
                  ]};
  var options = { value: test_data,  range: [ new Date(1), new Date(10) ],  valueRange: [] };
	// initialize the component and attach it to the DOM
  beforeEach(function(){
  	setupComponent( {model: 'modelField'} );
  });

  it('component to be defined', function(){
  	 expect(this.component).toBeDefined();
  	 expect($('path')).toHaveClass('area');
  	 expect($('path')).toHaveClass('line');
  });

  it('component on "valueChange", component has value data', function(){
  	 this.component.trigger('valueChange', options);
  	 expect(this.component.value).toEqual(test_data['modelField']);
  });

  it('component on "valueChange" and tooltip attribute exists', function(){
  	 setupComponent( {model: 'modelField', tooltip: true} );
  	 this.component.trigger('valueChange', options);
  	 expect($('circle')).toHaveClass('hoverCircle');
  });

  it('component on "resize", size changes', function(){
  	 setupComponent( {model: 'modelField', tooltip: true} );
  	 var size = {width: 300, height: 200};
  	 this.component.trigger('resize', size);
  	 expect(this.component.width).toEqual(size.width);
  	 expect(this.component.height).toEqual(size.height);
  });

  it('show tooltip on mouseover', function(){
    setupComponent( {model: 'modelField', tooltip: true} );
    this.component.trigger('valueChange', options);
    this.component.showTooltip($('.hoverCircle'), 8);
    expect(this.component.tooltip.css('display')).toEqual('block');
  });

  it('hide tooltip on mouseout', function(){
    setupComponent( {model: 'modelField', tooltip: true} );
    this.component.hideTooltip();
    expect(this.component.tooltip.css('display')).toEqual('none');
  });

});


