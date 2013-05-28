define(
    [
        'components/component_manager',
        'components/mixin/data_binding',
        'components/card/card',
        'components/flippable'
    ],

    function(ComponentManager, DataBinding, Card, Flippable) {

        var defaultAttrs = {
            subject:'',
            emailAddress:'',
            message:'',
            tokens: []
        };
        var BACK_TPL = ['<div class="card-header">',
                '<label class="email-subject-label">Subject</label>',
                '<input class="email-subject">',
                '<label class="email-address-label">To</label>',
                '<input class="email-address">',
            '</div>',
            '<div class="card-body">',
                '<textarea class="email-message"></textarea>',
            '</div>',
            '<div class="token-selector"></div>'].join('');
        var FRONT_TPL = ['<i class="email-address"></i>',
            '<h3 class="email-subject"></h3>',
            '<p class="email-message"></p>'].join('') ;
        var TOKEN_TPL = '<div class="token"></div>';
        var TOKEN_SYMBOL = '+';
        var TOKEN_VALUE_TPL_START = '${';
        var TOKEN_VALUE_TPL_END = '}';

        function SendEmail() {
            // this == scope of component
            this.defaultAttrs(defaultAttrs);
            this.after('initialize', _install);
        }

        function _install(){
            var frontTpl = $(FRONT_TPL);
            var backTpl = $(BACK_TPL);
            // this == scope of element in component
            this.$front.find('.body').append(frontTpl);
            this.$back.find('.body').append(backTpl);
            var element = {
                back : {
                    subject : $(backTpl).find('input.email-subject'),
                    emailAddress : $(backTpl).find('input.email-address'),
                    message : $(backTpl).find('.email-message'),
                    token : $(backTpl[2])
                },
                front : {
                    emailAddress : $(frontTpl[0]),
                    subject : $(frontTpl[1]),
                    message : $(frontTpl[2])
                }
            };

            this.$element = element;

            this.$back.on('click', _stopPropagation);

            //@TODO
            //hay que ver porque dublica también los elementos creados inicialmente
            //el siguiente método de borrado no debería ser necsario
            element.back.token.html('');
            $.each(this.attr.tokens, _addToken(element));

            element.back.subject.on('change', _updateElementOnChange(element.front.subject) );
            element.back.message.on('change', _updateElementOnChange(element.front.message) );

            element.back.emailAddress.on('change', _triggerUpdateOnChange(element, this) );
            element.back.subject.on('change', _triggerUpdateOnChange(element, this) );
            element.back.message.on('change', _triggerUpdateOnChange(element, this) );

            //set values
            element.back.subject.val(this.attr.subject);
            element.back.emailAddress.val(this.attr.emailAddress);
            element.back.message.val(this.attr.message);

            element.front.subject.text(this.attr.subject);
            element.front.message.text(this.attr.message);

            var node = this.$node;
            $(node.parent() ).on('click', function(){
                node.removeClass('flip');
            });

            $(element.back.token).find('.token').on('click', function(){
                var token = $(this).text().replace(TOKEN_SYMBOL,'');
                var value = TOKEN_VALUE_TPL_START+token+TOKEN_VALUE_TPL_END;
                _insertAt(element.back.message[0], value);
                element.back.message.change();
            });
        }
        function _stopPropagation(e){
            e.stopPropagation();
        }

        function _addToken(element){
            return function(index, name){
                var ele = _makeSymbolElement(name);
                element.back.token.append( ele );
            };
        }

        function _makeSymbolElement(name){
            var ele = $(TOKEN_TPL).text(TOKEN_SYMBOL+name);
            return ele;
        }

        function _updateElementOnChange(elementTo){
            var callbackToEvent = function(){
                var value = $(this).val();
                elementTo.text( value );
            };
            return callbackToEvent;
        }

        function _triggerUpdateOnChange(element, ele){
            return function(){
                var value = {
                    'emailAddress' : element.back.emailAddress.val(),
                    'subject' : element.back.subject.val(),
                    'message' : element.back.message.val()
                };
                var data = {
                    'value': value
                };
                ele.trigger('valueChange', data);
            };
        }

        function _insertAt(element, value) {
            var sel, startPos, endPos, newPos;
            //IE support
            if (document.selection) {
                element.focus();
                sel = document.selection.createRange();
                sel.text = value;
            }
            //MOZILLA and others
            else if (element.selectionStart || element.selectionStart === '0') {
                startPos = element.selectionStart;
                endPos = element.selectionEnd;
                newPos = (startPos + value.length);
                element.value = [element.value.slice(0, startPos), value, element.value.slice(endPos)].join('');
                element.selectionStart = element.selectionEnd = newPos;
            } else {
                element.value += value;
            }
        }

        return ComponentManager.extend(Card, 'SendEmail', SendEmail, DataBinding);
    }
);
