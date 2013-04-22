/*
 * Trigger sample: $('.detail-panel').trigger('update-header','test');
 *
 */

define (
    [ 
        'components/component_manager',
        'components/mixin/container'
    ],  

    function (ComponentManager, ContainerMixin) {

        return ComponentManager.create('detailPanel', DetailPanel, ContainerMixin);

        var self;

        function DetailPanel () {
            var self = this;

            this.defaultAttrs({
                insertionPoint: '.detail-panel-content',
                headerClass: '.detail-panel-header',
                contentClass: 'detail-panel-content',
                id: '',
                header: '',
                items: []
            });

            this.after('initialize', function () {

                self = this;

                this.$node.addClass('detail-panel');
                this.$nodeMap = $('<div>').addClass('detail-panel-header').appendTo(this.$node);
                this.$nodeMap = $('<div>').addClass('detail-panel-content').appendTo(this.$node);
                
                // Adds Header & ID
                this.$node.find(self.attr.headerClass).html(self.attr.header);
                this.$node.find(self.attr.headerClass).attr('id',self.attr.id);

                // Update header trigger
                this.on('update-header', function (event, header) {
                    console.log('ID:' + self.attr.id + ' New header: ' + header);
                    self.$node.find(self.attr.headerClass).html(header);
                    debugger;
                });
                
                
                // TEST
                /*
                $(window).bind('click', function () {
                    console.log('click');
                    $('.detail-panel').trigger('update-header','test');
                });
                */
            });


        }
    }
);
