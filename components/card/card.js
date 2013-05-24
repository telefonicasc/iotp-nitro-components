define(
    [
        'components/component_manager',
        'components/mixin/template',
        'components/flippable',
        'components/card/card_side',
        'components/mixin/data_binding'
    ],
    function(ComponentManager, Template, Flippable, CardSide, DataBinding, CardData) {
        var ELEMENT_ID_PREFIX = 'card_';
        var id=0;
        var _getNexId = function(){
            return ELEMENT_ID_PREFIX + (id++);
        };

        return ComponentManager.create('Card', Template, Card, DataBinding);

        function Card() {

            this.defaultAttrs({
                flippable: true,
                tpl: '<div class="front"></div>' +
                         '<div class="back"></div>',
                nodes: {
                    front: '.front',
                    back: '.back'
                },
                front: {
                },
                back: {
                },
                cssClass:'m2m-card-condition'
            });

            this.after('initialize', function() {

                var elementId = this.attr.id || _getNexId(),
                    dragCheck = false, clickCheck = false;

                this.attr.updateOnValueChange = false;

                this.$node.on('click',_stopPropagation);
                this.$node.addClass('card');
                this.$node.addClass(this.attr.cssClass);
                this.$node.attr('id', elementId );

                if (this.attr.header) {
                    this.attr.front.header = this.attr.header;
                    this.attr.back.header = this.attr.header;
                    this.attr.back.editableHeader = true;
                }

                CardSide.attachTo(this.$front, this.attr.front);
                CardSide.attachTo(this.$back, this.attr.back);

                if (this.attr.flippable) {
                    //Flippable.attachTo(this.node);
                    this.$node.addClass('flippable');

                    this.$front.on('mousedown', function() {
                        clickCheck = true;
                    });

                    this.$front.on('mouseup', $.proxy(function() {
                        if (!dragCheck && clickCheck) {
                            this.$node.addClass('flip');
                            this.$node.trigger('flipped');
                        }
                        clickCheck = false;
                    }, this));

                    this.on('drag', function() {
                        dragCheck = true;
                    });

                    this.on('dragstop', function() {
                        dragCheck = false;
                    });

                }else {
                    this.$back.hide();
                }

                this.on('valueChange', function(e, o) {
                    this.$node.data('cardValue', o.value);
                });

            });

            function _stopPropagation(e){
                e.stopPropagation();
            }
        }
    }
);
