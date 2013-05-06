describeComponent('components/context_menu_panel', function () {  

  // initialize the component and attach it to the DOM
  beforeEach(function(){
  	setupComponent();
  });

  it('component has text attribute', function(){
  	var text = "test_text";
  	setupComponent( {text: text} );
  	expect(this.component.$node).toContainHtml('<li class="context-menu-title">'+text+'</li>');
  });

  it('component has attribute ITEMS attribute', function(){
  	var items = [ {text:'item1'}, {text:'item2'} ];
  	setupComponent( {items: items} );
  	expect(this.component.$node).toContainHtml('<li>'+items[0].text+'</li><li>'+items[1].text+'</li>');
  });

  it('component hasBack attribute', function(){
  	var text = "test_text";
  	setupComponent( { hasBack: true, text: text } );
  	expect(this.component.$node).toContainHtml('<li class="context-menu-title back-link">'+text+'</li>');
  });

  it('component has attribute ITEM separator', function(){
  	var items = [ {text:'--'} ];
  	setupComponent( {items: items} );
  	expect(this.component.$node).toContainHtml('<li class="separator"></li>');
  });

  it('component has attribute ITEM with sub-items', function(){
  	var items = [{ items: [{text: 'sub-item'}] }];
  	setupComponent( {items: items} );
  	expect(this.component.$node).toContainHtml('<li class="submenu"></li>');
  });

  it('component has attribute ITEM with className', function(){
  	var items = [{ className: 'class-name'  }];
  	setupComponent( {items: items} );
  	expect(this.component.$node).toContainHtml('<li class="'+items[0].className+'"></li>');
  });

});  