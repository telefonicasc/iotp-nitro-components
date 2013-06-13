describeComponent('components/dashboard/cell_barchart_subpanel', function () {
 
// initialize the component and attach it to the DOM
  beforeEach(setupComponent);

  it('Components attributes', function(){
  	 expect(this.component.attr.text).toBeDefined();
  });

  it('Barchart component to be defined', function(){
  	 expect(this.component).toBeDefined();
  });


  it('Panel with bar chart', function () {
  	 var chartAttr = {        //(optional)
	    conf: {
	      maxHeight: 70,
	      width: 45,
	      barPadding: 4
	    },
	    data: [ { gains: 87 }, { losses: 46 } ]    //values from 0 - 100 
     };
  	 setupComponent({ 'chart': chartAttr });
  	 expect(this.component.attr.chart.data).toEqual( [ { gains: 87 }, { losses: 46 } ] );
  });

});  