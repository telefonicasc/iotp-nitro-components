define(
  [
    'components/component_manager'
  ],

  function(ComponentManager) {

    var el = {
      bg : $('<div class="box-message-bg"></div>'),
      box : $('<div class="box-message-msg"></div>'),
      title: $('<p class="box-message-title"></p>'),
      message: $('<p></p>'),
      btn : $('<button class="clean-gray">close</button>')
    };

    var BoxMessage = {
      close:function(){
        el.box.hide();
        el.bg.hide();
        el.title.hide();
      },
      open:function(opt){
        if(opt.title){
          el.title.html(opt.title);
          el.title.show();
        }
        if(opt.message){
          el.message.html(opt.message);
          el.box.show();
          el.bg.show();
        }
      }
    };

    function init(){
      el.bg.hide();
      el.box.hide();
      el.title.hide();

      $('body').append(el.bg, el.box);
      el.box.append(el.title, el.message, el.btn);
      el.box.append(  );
      el.btn.on('click', BoxMessage.close );

      el.btn.wrap('<div />');
    }

    init();
    window.BoxMessage = BoxMessage;
  }
);