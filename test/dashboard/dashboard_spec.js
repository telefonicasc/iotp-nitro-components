describeComponent('components/dashboard/dashboard', function() {

    beforeEach(function() {

        this.dataFunction = function(cb) {
            cb({});
        };

        setupComponent({
            data: this.dataFunction,
            detailsPanel: {
                items: [{
                    tpl: '<div class="test">{{value.content}}</div>'
                }]
            }
        });
    });

    it('should have a main content panel', function() {
        expect(this.$node.find('.main-content').length).toBe(1);
    });

    it('should have an overview panel', function() {
        expect(this.$node.find('.dashboard-overview-panel').length).toBe(1);
    });

    it('should reload data when updateData is triggered', function() {
        spyOn(this.component, 'updateData');
        this.$node.trigger('updateData');
        expect(this.component.updateData).toHaveBeenCalled();
    });

    it('when an item is selected details panel updates', function() {
        this.component.$overviewPanel.trigger('itemselected', {
                item: { content: 'blabla' }});
        expect(this.$node.find('.test').html()).toBe('blabla');
    });

});
