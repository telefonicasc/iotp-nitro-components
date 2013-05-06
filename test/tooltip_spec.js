describeComponent('components/tooltip', function () {  

  // initialize the component and attach it to the DOM
  beforeEach(setupComponent);

  it('component is showed, then is visible', function(){
  	 this.component.$node.trigger('show');
  	 expect(this.component.$node).toBeVisible();
  	 
  });

});