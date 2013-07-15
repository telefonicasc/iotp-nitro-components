/**
 * @component CardFrontValues
 *
 * @event {in} valueChange. Update values
 *
 * @mixin Template
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
                updateOnValueChange:false,
                value:{}
            });

            this.after('initialize', function() {
                this.$dl = $( this.attr.tpl );
                this.$dl.appendTo(this.$node);
                this.$node.addClass('m2m-card-front-values');
                this.on('valueChange', $.proxy(this.onValueChange,this));

                $.each(this.attr.value, $.proxy(this._draw, this));
            });

            this.onValueChange = function(event, data){
                this.$dl.empty();
                $.each(data.value, $.proxy(this._draw, this));
            };

            this._draw = function(name, value){
                $('<dt/>').text(name).appendTo(this.$dl);
                $('<dd/>').text(value).appendTo(this.$dl);
            };
        }

        return ComponentManager.create('CardFrontValues', CardFrontValues);
    }
);