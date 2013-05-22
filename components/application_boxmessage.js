define(
  [
    'components/component_manager'
  ],

  function() {
    var el = {
        bg: $('<div class="box-message-bg"></div>'),
        box: $('<div class="box-message-msg"></div>'),
        title: $('<p class="box-message-title"></p>'),
        message: $('<p class="box-message-content"></p>'),
        btndiv: $('<div><button name="close"></button></div>'),
        btnsdiv: $('<div class="box-message-buttons"><button name="cancel" class="m2m-btn"></button><button name="ok" class="m2m-btn accept"></button></div>')
    };

    var BUTTON_TEXT_CLOSE = 'Accept';
    var BUTTON_TEXT_OK = 'Accept';
    var BUTTON_TEXT_CANCEL = 'Cancel';
    var btnClose;
    var btnOk;
    var btnCancel;

    var BoxMessage = {

      close: function() {
        el.box.hide();
        el.bg.hide();
        el.title.hide();
      },

      open: function(opt) {
         if(opt.confirmModal){
            btnOk.text(opt.buttonTextOk || BUTTON_TEXT_OK);
            btnCancel.text(opt.buttonTextCancel || BUTTON_TEXT_CANCEL);
            el.btnsdiv.show();
            el.btndiv.hide();
            btnOk.on('click', opt.okCallback);
        }else{
            btnClose.text(opt.buttonText || BUTTON_TEXT_CLOSE);
            el.btnsdiv.hide();
            el.btndiv.show();
        }

        if (opt.title) {
          el.title.html(opt.title);
          el.title.show();
        }

        if (opt.message) {
          el.message.html(opt.message);
          el.box.show();
          el.bg.show();
        }

      }
    };

    function init() {

      btnClose = el.btndiv.find('[name="close"]');
      btnOk = el.btnsdiv.find('[name="ok"]');
      btnCancel = el.btnsdiv.find('[name="cancel"]');

      el.bg.hide();
      el.box.hide();
      el.title.hide();

      $('body').append(el.bg, el.box);
      el.box.append(el.title, el.message, el.btndiv, el.btnsdiv);

      btnClose.on('click', BoxMessage.close);
      btnCancel.on('click', BoxMessage.close);
    }

    init();
    window.BoxMessage = BoxMessage;
  }
);
