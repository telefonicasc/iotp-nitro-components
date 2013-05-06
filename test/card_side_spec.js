describeComponent('components/card/card_side.js', function () {
  

  // initialize the component and attach it to the DOM
  beforeEach(function(){
  	setupComponent();
  });

  it('component has header', function(){
  	setupComponent( {header: 'HELLO'} );
  	expect(this.component.$header).toContainHtml('<h1>HELLO</h1>');
  	expect(this.component.$header).toHaveClass('header');
  });
  
  it('component has a div in its body', function(){
  	expect(this.component.$body).toHaveClass('body');
  });

});