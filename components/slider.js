define(
    [
        'components/component_manager',
        'components/mixin/template'
    ],

    function(ComponentManager, Template) {

        return ComponentManager.create('Slider', Template, Slider);

        function Slider() {

            this.defaultAttrs({
                label: 'value',
                value: 0,
                minValue: 0,
                maxValue: 100,
                tpl: '<label class="slider-label">{{label}}</label>' +
                     '<div class="slider-bar">' +
                        '<div class="slider-level"></div>' +                        
                     '</div>' +
                     '<div class="slider-scale">' +
                        '<div class="slider-min">{{minValue}}</div>' +
                        '<div class="slider-max">{{maxValue}}</div>' +
                     '</div>' +
                     '<div class="slider-handler">' +
                        '<div class="slider-arrow"></div>' +
                        '<span></span>' +
                     '</div>'
            });

            this.after('initialize', function() {

                this.$node.addClass('m2m-slider');

                var handler = $('.slider-handler', this.$node),
                    bar = $('.slider-bar', this.$node);

                if (this.attr.value === undefined) {
                    this.attr.value = this.attr.minValue;
                }

                handler.draggable({
                    axis: 'x', containment: this.$node
                });
                

                this.$node.on('dragstart drag dragstop', function(e, ui) {
                    e.stopPropagation();
                });

                handler.on('drag', $.proxy(function(e, ui) {
                    var value = ui.position.left * this.attr.maxValue
                            / bar.width();
                    value = Math.min(Math.max(value, 0), this.attr.maxValue);
                    value = value < 0.1 ? 0 : value;
                    value = value.toPrecision(2);
                    this.trigger('valueChange', { value: value });
                }, this)); 

                this.on('valueChange', function(e, o) {
                    this.setSliderValue(o.value);
                });

                this.setSliderValue(this.attr.value);
            });

            this.setSliderValue = function(value) {
                var level = $('.slider-level', this.$node),
                    bar = $('.slider-bar', this.$node),
                    handler = $('.slider-handler', this.$node),
                    span = $('.slider-handler > span', this.$node);

                span.html(value);
                level.css({
                    right: (96 * (1 - parseFloat(value)/this.attr.maxValue)) + '%' 
                });

                handler.css({
                    left: parseFloat(value)*bar.width()/this.attr.maxValue
                });
            };
        }
    }
);