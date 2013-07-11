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

                if( $.isArray(this.attr.imputs) ){
                    $.each(this.attr.imputs, $.proxy(this.addInput, this) );
                }else{
                    this.addInput(null, this.attr);
                }
                


                this.$node.on('keyup change', 'input', $.proxy(function(e) {
                    var $ele = $(e.currentTarget);
                    var value = $ele.val();
                    var dataType = $ele.data('dataType');
                    if(isIE8){
                        if(!this.isValid(dataType, value)){
                            $ele.val(value);
                        }
                    }

                    this.trigger('valueChange', { value: this.getData() });

                }, this));

                this.on('valueChange', function(e,o) {
                    if( $.isPlainObject(o.value) ){
                        for(name in o.value){
                            $('input[name='+name+']', this.$node).val(o.value[name]);
                        }
                    }else{
                        $('input', this.$node).val(o.value);
                    }

                });
            });
            
            this.getData = function(){
                var $inputs = $('input', this.$node);
                var out;
                if($inputs.length===1){
                    out = $inputs.val();
                }else{
                    out = {};
                    $.each($inputs, function(e){
                        var name = $(this).attr('name');
                        var val = $(this).val();
                        out[name] = val;
                    });
                }
                console.log(out);
                return out;
            }
            
            this.addInput = function(index, data){
                if (data.label) {
                    this.makeLabel(data).appendTo(this.$node);;
                }
                this.makeInput(data).appendTo(this.$node);
            }

            this.makeLabel = function(data){
                var ele = $('<label>')
                    .html(data.label);
                return ele;
            };

            this.makeInput = function(data){
                var ele = $('<input type="text" />');
                if(!isIE8 && data.dataType === dataType.QUANTITY){
                    ele.attr('type', 'number');
                }
                ele.data('dataType', data.dataType);
                ele.attr('name', data.name || data.label);
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
