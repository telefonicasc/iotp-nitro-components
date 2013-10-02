describeComponent('components/chart/group_bar_chart', function () {

var test_data = {
   "range":[
      new Date("2012-12-25T23:00:00.000Z"),
      new Date("2012-12-27T00:00:00.000Z")
   ],
   "valueRange":[
      null
   ],
   "value":{
      "selectedRange":[
         "2012-12-25T23:00:00.000Z",
         "2012-12-27T00:00:00.000Z"
      ],
      "productSales":{
         "1":{
            "values":{
               "1356476400000":{
                  "Expresso":[
                     64,30
                  ],
                  "Capucchino":[
                     108,65
                  ],
                  "Decaf":[
                     64,78
                  ],
                  "Chocolate":[
                     86,43
                  ]
               }
            },
            "totalCount":{
               "1356476400000":322
            },
            "caption2":"Units sold",
            "panelData":{
               "1356476400000":[
                  {
                     "bottomValue":64,
                     "topValue":"20%"
                  },
                  {
                     "bottomValue":108,
                     "topValue":"34%"
                  },
                  {
                     "bottomValue":64,
                     "topValue":"20%"
                  },
                  {
                     "bottomValue":86,
                     "topValue":"27%"
                  }
               ]
            }
         }
      },
      "fixRange":"1"
   },
   "silent":true
};

  // initialize the component and attach it to the DOM
  beforeEach(function(){
  	setupComponent( {grid: true, model: 'Sales', incremental: true, aggregation: 'product'} );
  });

  it('component has attributes defined', function(){
  	 expect(this.component).toBeDefined();
  });

  it('When trigger "valueChange" then createChart and updateChart is called', function () {
  	spyOn(this.component, 'updateChart');
    spyOn(this.component, 'createChart');
    this.component.$node.trigger('valueChange', test_data);
    expect(this.component.createChart).toHaveBeenCalled();
    expect(this.component.updateChart).toHaveBeenCalled();
  });

  it('trigger "valueChange", groups and bars are painted', function () {
    this.component.$node.trigger('valueChange', test_data);
    expect($('.group').length).toEqual(4); // 2 groups
    expect($('.bg_group').length).toEqual(4); // 2 groups
    expect($('rect.chartbar').length).toEqual(8); //4 bars in total
  });

  it('component on "resize", size changes', function(){
     var size = {width: 300, height: 200};
     this.component.trigger('resize', size);
     expect(this.component.width).toEqual(size.width);
     expect(this.component.height).toEqual(size.height);
  });

  it('tooltip visilble when showTooltip', function(){
     setupComponent( {grid: true, model: 'Sales', incremental: true, aggregation: 'product', tooltip: true} );
     this.component.$node.trigger('valueChange', test_data);
     this.component.showTooltip($('.chartbar:first-child'),10,1);
     expect($('.tooltip').css('display')).toEqual('block');
  });

  it('Chart with labels', function(){
    setupComponent( {label: true, grid: true, model: 'Sales', incremental: true, aggregation: 'product'} );
    expect($('.chart-labels')).toBeDefined();
  });




});
