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
            btndiv: $('<div class="box-message-buttons"><button name="close" class="m2m-btn accept"></button></div>'),
            btnsdiv: $('<div class="box-message-buttons"><button name="cancel" class="m2m-btn"></button><button name="ok" class="m2m-btn accept"></button></div>')
        };

        var btnClose;
        var btnOk;
        var btnCancel;
        var defaultOption = {
            title:'',
            message:'',
            confirmModal:false,
            okCallback:false,
            //buttonTextOk:null, //@deprecate
            //buttonTextCancel:null, //@deprecate
            //buttonText:null, //@deprecate
            button:{
                'accept':{label:'Accept', callback:function(){}},
                'cancel':{label:'Cancel', callback:function(){}},
                'close':{label:'Accept', callback:function(){}}
            }
        };

        var BoxMessage = {
            close: function() {
                el.box.hide();
                el.bg.hide();
                el.title.hide();
            },
            open: function(opt) {
                var option = $.extend(true, {}, defaultOption, opt);
                var focusEl = null;
                if (option.confirmModal) {
                    btnOk.text(option.buttonTextOk || option.button.accept.label);
                    btnCancel.text(option.buttonTextCancel || option.button.cancel.label);
                    el.btnsdiv.show();
                    el.btndiv.hide();
                    btnOk.on('click', option.okCallback || option.button.accept.callback);
                    btnCancel.on('click', option.button.close.callback);
                    focusEl = btnOk;
                } else {
                    btnClose.on('click', option.button.close.callback);
                    btnClose.text(option.buttonText || option.button.close.label);
                    el.btnsdiv.hide();
                    el.btndiv.show();
                    focusEl = btnClose;
                }

                if (option.title) {
                    el.title.html(option.title);
                    el.title.show();
                }

                if (option.message) {
                    el.message.html(option.message);
                    el.box.show();
                    el.bg.show();
                    focusEl.focus();
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
