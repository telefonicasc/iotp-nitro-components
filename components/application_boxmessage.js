define(
    [
        'components/component_manager'
    ],

    function() {
        var el = {
            bg: $('<div class="box-message-bg"></div>'),
            box: $('<div class="box-message-msg"></div>'),
            title: $('<p class="box-message-title" data-m2mid="modal-header"></p>'),
            message: $('<p class="box-message-content" data-m2mid="modal-message"></p>'),
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
            okHandler: null,
            cancelHandler: null,
            close: function() {
                btnOk.off('click', BoxMessage.okHandler);
                btnCancel.off('click', BoxMessage.cancelHandler);
                BoxMessage.okHandler = null;
                BoxMessage.cancelHandler = null;
                el.box.removeAttr('data-m2mid');
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
                    BoxMessage.okHandler = option.okCallback || option.button.accept.callback;
                    btnOk.one('click', BoxMessage.okHandler);
                    BoxMessage.cancelHandler = option.button.close.callback;
                    btnCancel.one('click', BoxMessage.cancelHandler);
                    if (option.button.accept.cls) {
                        btnOk.addClass(option.button.accept.cls);
                    }
                    if (option.button.close.cls) {
                        btnCancel.addClass(option.button.close.cls);
                    }
                    focusEl = btnOk;
                } else {
                    btnClose.one('click', option.button.close.callback);
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
                    el.box.css('margin-left', (-0.5 * el.box.width()));
                    el.box.css('margin-top', (-0.5 * el.box.height()));
                    el.bg.show();
                    focusEl.focus();
                }
                el.box.attr('data-m2mid', 'modal');
            }
        };

        function init() {
            btnClose = el.btndiv.find('[name="close"]');
            btnOk = el.btnsdiv.find('[name="ok"]');
            btnCancel = el.btnsdiv.find('[name="cancel"]');

            btnClose.attr('data-m2mid', 'modal-btn-close');
            btnOk.attr('data-m2mid', 'modal-btn-ok');
            btnCancel.attr('data-m2mid', 'modal-btn-cancel');

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
