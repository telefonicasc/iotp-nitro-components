describeComponent('components/repeat_container', function() {

    beforeEach(function() {
        setupComponent({
            emptyContent: 'empty'
        });
    });

    it('has repeat-container class', function() {
        expect(this.$node.hasClass('repeat-container')).toBe(true);
    });

    it('adds a repeat-container-item for each item passed', function() {
        this.$node.trigger('valueChange', { value: [1,2,3] });
        expect(this.$node.find('.repeat-container-item').length).toBe(3);
    });

    it('displays emptyContent when no values passed', function() {
        this.$node.trigger('valueChange', { });
        expect(this.$node.find('.repeat-container-empty').html()).toBe('empty');
    });

    describe('if filter is set', function() {
        beforeEach(function() {
            setupComponent({
                filter: function(element, index) { return index % 2 === 0 }
            });
        });

        it('filters items not matching', function() {
            this.$node.trigger('valueChange', { value: [1,2,3,4] }); 
            expect(this.$node.find('.repeat-container-item').length).toBe(2);
        });
    });

});
