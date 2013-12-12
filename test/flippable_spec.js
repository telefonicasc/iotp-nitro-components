describeComponent('components/flippable', function () {
  
  // initialize the component and attach it to the DOM
  beforeEach(setupComponent);

  it('component has clicked, flip class is set', function(){
  	 expect(this.component.$node.hasClass('flippable')).toBeTruthy();
  });

  it('component has clicked, flip class is set', function(){
  	 this.component.$node.trigger('click');
  	 expect(this.component.$node.hasClass('flip')).toBeTruthy();
  });

  it('component has clicked TWICE, flip class is removed', function(){
  	 this.component.$node.trigger('click');
  	 this.component.$node.trigger('click');
  	 expect(this.component.$node.hasClass('flip')).toBeFalsy();
  });

});