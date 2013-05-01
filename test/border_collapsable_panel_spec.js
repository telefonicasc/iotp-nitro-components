describeComponent('components/panel/border_collapsable_panel', function () {  

  // initialize the component and attach it to the DOM
  beforeEach(setupComponent);


  it('component has been initialized', function(){
  	expect(this.component.$node).toHaveClass('border-panel');
  	expect(this.component.expanded).toBeTruthy();
  });


  it('component expands', function(){
  	this.component.$node.trigger('expand');
  	expect(this.component.expanded).toBeTruthy();
  });

  it('component collapses', function(){
  	this.component.$node.trigger('collapse');
  	expect(this.component.expanded).toBeFalsy();
  });

  it('component is expanded and click toggle', function(){
  	this.component.expanded = true;
  	var collapse = spyOnEvent(document, 'collapse');
  	this.component.$toggle.trigger('click');
  	expect(collapse).toHaveBeenTriggeredOn(document);
  });

  it('component is NOT expanded and click toggle', function(){
  	this.component.expanded = false;
  	var expand = spyOnEvent(document, 'expand');
  	this.component.$toggle.trigger('click');
  	expect(expand).toHaveBeenTriggeredOn(document);
  });


});  