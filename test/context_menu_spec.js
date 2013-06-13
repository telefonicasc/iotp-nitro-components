describeComponent('components/context_menu', function () {  

  // initialize the component and attach it to the DOM
  beforeEach(setupComponent);

  it('component is showed, then is visible', function(){
  	 this.component.$node.trigger('show');
  	 expect(this.component.$node).toBeVisible();
  });

  it('component is hidden, then is NOT visible', function(){
  	 this.component.$node.trigger('hide');
  	 expect(this.component.$node).not.toBeVisible();
  });

  it('component is Back, then popPanel is called', function(){
  	 spyOn(this.component, 'popPanel');
  	 this.component.$node.trigger('back');
  	 expect(this.component.popPanel).toHaveBeenCalled();
  });

  it('when component popPanel, then transitionPanel is called', function(){
  	 spyOn(this.component, 'transitionPanel');
  	 this.component.popPanel();
  	 expect(this.component.transitionPanel).toHaveBeenCalled();
  });



  it('component is selected and items exists, then pushPanel is called', function(){
  	spyOn(this.component, 'pushPanel');
  	var item = { items: [] };
  	this.component.$node.trigger('selected', item);
  	expect(this.component.pushPanel).toHaveBeenCalled();
  });

  it('component is selected and "onSelect" exists, then onSelect is called', function(){
  	setupComponent( { onSelect: function(item){} } )
  	var item = { items: null };
  	this.component.$node.trigger('selected', item);
  	spyOn(this.component.attr, 'onSelect');
  	expect(this.component.attr.onSelect).toBeDefined();

  });

});