define(
    [
        'components/component_manager',
        'components/container'
    ],

    function(ComponentManager, Container) {

        function CardSide() {

            this.defaultAttrs({
                header: 'Card',
                editableHeader: false
            });

            this.after('initialize', function() {

                if (this.attr.header) {
                    this.$header = $('<div>').addClass('header').appendTo(this.$node);
                    if (this.attr.editableHeader) {
                        $('<div>').addClass('card-title-label')
                                .html('Card title').appendTo(this.$header);
                        this.$headerText = $('<textarea>').appendTo(this.$header);
                        this.$headerText.val(this.attr.header);
                    } else {
                        if (typeof this.attr.header === 'string') {
                            $('<h1>').html(this.attr.header).appendTo(this.$header);
                        } else {
                            $('<span>').addClass('card-header-label')
                              .html(this.attr.header.label)
                              .appendTo(this.$header);
                            $('<h1>').html(this.attr.header.value)
                              .appendTo(this.$header);

                        }
                    }
                }
                this.$body = $('<div>').addClass('body').appendTo(this.$node);
                Container.attachTo(this.$body, this.attr);
            });
        }

        return ComponentManager.create('CardSide', CardSide);
    }
);
