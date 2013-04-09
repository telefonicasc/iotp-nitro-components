define(
    [],

    function() {

        return AndInteraction;

        function AndInteraction() {
            
            this.defaultAttrs({

            });

            this.interactionAreas = [];

            this.after('initialize', function() {
                console.log('asdadsad');
                this.$cardToolbox.on('dragstart', '.card', $.proxy(function(e) {
                    var card = this.getAllCards();
                    this.interactionAreas = [];
                
                    card.each($.proxy(function(i, el) {
                        var area = $(el).position();
                        area.card = $(el);
                        this.interactionAreas.push(area);
                    }, this));
                        
                }, this));            

                this.$graphEditor.on('drag', '.node-container > *', $.proxy(function(e) {
                    var componentOffset = this.$node.offset()
                        , helperOffset = $(e.target).offset()
                        , left = helperOffset.left - componentOffset.left
                        , top = helperOffset.top - componentOffset.top;
                }, this));

                this.$cardToolbox.on('drag', '.card', $.proxy(function(e, ui) {
                    var componentOffset = this.$node.offset()
                        , helperOffset = $(ui.helper).offset()
                        , left = helperOffset.left - componentOffset.left
                        , top = helperOffset.top - componentOffset.top;

                    $.each(this.interactionAreas, $.proxy(function(i, area) {
                        if (left > area.left + 100 &&
                            left < area.left + 300 &&
                            top > area.top &&
                            top < area.top + 200) {
                            this.$graphEditor.trigger('addConnection', {
                                start: area.card, end: $(ui.helper)
                            });
                        }
                    }, this));
    //                console.log(left, top);
                }, this));
            });
        }
    }
);
