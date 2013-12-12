describeComponent('components/toggle', function () {
  
  // initialize the component and attach it to the DOM
  beforeEach(setupComponent);

  it('component is clicked, toggle value changes', function(){
  	 expect(this.component.value).toBeFalsy();	
  	 this.component.$node.trigger('click');
  	 expect(this.component.value).toBeTruthy();
  });

  it('component is clicked, valueChange is called', function(){
  	var valueChange = spyOnEvent(document, 'valueChange');
    this.component.$node.trigger('click');
    expect(valueChange).toHaveBeenTriggeredOn(document);
  });
		
});