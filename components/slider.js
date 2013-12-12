define(
    [
        'components/component_manager',
        'components/mixin/template',
        'libs/jqueryui/jquery.ui.core',
        'libs/jqueryui/jquery.ui.widget',
        'libs/jqueryui/jquery.ui.mouse',  
        'libs/jqueryui/jquery.ui.draggable',
        'libs/jqueryui/jquery.ui.droppable'
    ],

    function(ComponentManager, Template) {

        return ComponentManager.create('Slider', Template, Slider);

        function Slider() {

            this.defaultAttrs({
                label: 'value',
                value: 0,
                minValue: 0,
                maxValue: 100,
                showSliderLabel: true,
                showSliderValue: true,
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

                this.attr.updateOnValueChange = false;

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

                this.$valueSpan = $('.slider-handler > span', this.$node);

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

                if (!this.attr.showSliderLabel) {
                    this.$node.find('.slider-label').hide();
                }

                if (this.attr.sliderMinLabel) {
                    $('.slider-min', this.$node).html(this.attr.sliderMinLabel); 
                }

                if (this.attr.sliderMaxLabel) {
                    $('.slider-max', this.$node).html(this.attr.sliderMaxLabel);            
                }

                this.setSliderValue(this.attr.value);
            });

            this.setSliderValue = function(value) {
                var level = $('.slider-level', this.$node),
                    bar = $('.slider-bar', this.$node),
                    handler = $('.slider-handler', this.$node);

                if (this.attr.showSliderValue) {
                    this.$valueSpan.html(value);
                }

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
