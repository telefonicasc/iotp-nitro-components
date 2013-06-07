define(
    [
        'components/component_manager',
        'components/mixin/data_binding'
    ],

    function(ComponentManager, DataBinding, Template) {
        var dataType = {
            'TEXT':'Text',
            'QUANTITY':'Quantity'
        };
        var REGEXP_QANTITY = /^\d+(\.\d*)*?$/;
        var isIE8 = (function() {
            return !!( (/msie 8./i).test(navigator.appVersion) && !(/opera/i).test(navigator.userAgent) && window.ActiveXObject && XDomainRequest && !window.msPerformance );
        })();

        return ComponentManager.create('CardBackText', DataBinding,
            CardBackText);

        function CardBackText() {

            this.defaultAttrs({
                'dataType': dataType.TEXT
            });

            this.after('initialize', function() {

                this.$node.addClass('m2m-card-text');

                if (this.attr.label) {
                    $('<label>')
                        .html(this.attr.label)
                        .appendTo(this.$node);
                }

                this.$input = this.makeInput(this.attr.dataType).appendTo(this.$node);


                this.$input.on('keyup', $.proxy(function(e) {
                    var value = this.$input.val();
                    if(isIE8){
                        if(this.isValid(this.attr.dataType, value)){
                            this.trigger('valueChange', { value: value });
                        }else{
                            this.$input.val('');
                            this.trigger('valueChange', { value: '' });
                        }
                    }else{
                        this.trigger('valueChange', { value: value });
                    }

                }, this));

                this.on('valueChange', function(e,o) {
                    this.$input.val(o.value);
                });
            });

            this.makeInput = function(type){
                var ele = $('<input type="text" />');
                if(!isIE8 && type === dataType.QUANTITY){
                    ele.attr('type', 'number');
                }
                return ele;
            };
            this.isValid = function(type, value){
                var isValid;
                if(value !== '' && type === dataType.QUANTITY){
                    isValid = REGEXP_QANTITY.test(value);
                }else{
                    isValid = true;
                }
                return isValid;
            };
        }

    }
);
