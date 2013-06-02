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
            tokens: [],
            actionCard: true,
            actionData: {
                name:'',
                description:'',
                userParams:[]
            }
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
            this.defaultAttrs( $.extend({},defaultAttrs) );
            this.after('initialize', _install);

            this._userParamsObject = {};

            this.validate = function(){
                var isValid = _isValid(this._userParamsObject);
                this.$node.data('isValid', isValid);
            };
        }

        function _install(){
            var frontTpl = $(FRONT_TPL);
            var backTpl = $(BACK_TPL);
            // this == scope of element in component
            this.$front.find('.body').append(frontTpl);
            this.$back.find('.body').append(backTpl);
            var element = this.$element = {
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

            var userParamsObject = this._userParamsObject = _userParamsToObject(this.attr.actionData.userParams);

            this.$back.on('click', _stopPropagation);

            //@TODO
            //hay que ver porque dublica también los elementos creados inicialmente
            //el siguiente método de borrado no debería ser necsario
            element.back.token.html('');
            $.each(this.attr.tokens, _addToken(element));

            element.back.subject.on('change', _updateElementOnChange(element.front.subject) );
            element.back.message.on('change', _updateElementOnChange(element.front.message) );

            var triggerUpdateOnChange = _triggerUpdateOnChange(element, userParamsObject, this);
            element.back.emailAddress.on('change',  triggerUpdateOnChange).keyup(triggerUpdateOnChange);
            element.back.subject.on('change', triggerUpdateOnChange ).keyup(triggerUpdateOnChange);
            element.back.message.on('change', triggerUpdateOnChange ).keyup(triggerUpdateOnChange);

            //set values
            element.back.subject.val(userParamsObject['mail.subject']);
            element.back.emailAddress.val(userParamsObject['mail.to']);
            element.back.message.val(userParamsObject['mail.message']);

            element.front.subject.text(userParamsObject['mail.subject']);
            element.front.message.text(userParamsObject['mail.message']);

            var node = this.$node;
            $(node.parent() ).on('click', function(){
                node.removeClass('flip');
            });

            $(element.back.token).on('click', '.token', function(){
                var token = $(this).text().replace(TOKEN_SYMBOL,'');
                var value = TOKEN_VALUE_TPL_START+token+TOKEN_VALUE_TPL_END;
                _insertAt(element.back.message[0], value);
                element.back.message.change();
            });

            this.validate();
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

        function _triggerUpdateOnChange(element, userParamsObject, card){
            return function(){
                userParamsObject['mail.subject'] = element.back.subject.val();
                userParamsObject['mail.to'] = element.back.emailAddress.val();
                userParamsObject['mail.message'] = element.back.message.val();
                var value = {
                    'userParams' : _userParamsObjectToArray(userParamsObject)
                };
                var data = {
                    'value': value
                };
                card.validate();
                card.trigger('valueChange', data);
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

        function _userParamsToObject(params){
            var obj = {};
            $.each(params, function(i,o){
                obj[o.name] = o.value;
            });
            return obj;
        }

        function _userParamsObjectToArray(obj){
            var name, arr=[];
            for(name in obj){
                arr.push({
                    'name': name,
                    'value':obj[name]
                });
            }
            return arr;
        }

        function _isValid(userParam){
            var a = (userParam['mail.subject'] && userParam['mail.subject'].length > 0 );
            var b = (userParam['mail.to'] && userParam['mail.to'].length > 0 );
            var c = (userParam['mail.message'] && userParam['mail.message'].length > 0 );

            return (a && b && c);
        }



        return ComponentManager.extend(Card, 'SendEmail', SendEmail, DataBinding);
    }
);
