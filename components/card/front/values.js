/**
 * @component CardFrontValues
 *
 * @event {in} valueChange. Update values
 *
 */

define(
    [
        'components/component_manager'
    ],

    function(ComponentManager) {


        function CardFrontValues() {

            this.defaultAttrs({
                tpl:'<dl></dl>',
                value:[]
            });

            this.after('initialize', function() {
                this.$dl = $( this.attr.tpl );
                this.$dl.appendTo(this.$node);
                this.$node.addClass('m2m-card-front-values');
                this.on('valueChange', $.proxy(this.onValueChange,this));

                $.each(this.attr.value, $.proxy(this._draw, this));
            });

            this.onValueChange = function(event, data){
                $.each(data.value, $.proxy(this._setValues, this));
            };

            this._draw = function(index, data){
                var name = data.name || data.label || 'value'+index;
                var value = data.value;
                $('<dt/>').text(name).appendTo(this.$dl);
                $('<dd/>').text(value).attr('name', name).appendTo(this.$dl);
            };

            this._setValues = function(name, value){
                var $ele = $('dd[name='+name+']', this.$node);
                if($ele.length){
                    $ele.text( value );
                }
            };
        }

        return ComponentManager.create('CardFrontValues', CardFrontValues);
    }
);