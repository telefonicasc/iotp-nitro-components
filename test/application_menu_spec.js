describeComponent('components/application_menu', function() {

    beforeEach(function() {

        this.applicationContent = $('<div>');

        setupComponent({
            expandDuration: 200,
            collapseDuration: 200,
            expandedWidth: 400,
            collapsedWidth: 200,
            tooltipSelector: '',
            applicationContent: this.applicationContent
        });

        this.$node.append('<li>');

        this.expandEvent = function() {};
        spyOn(this, 'expandEvent');
        this.$node.on('expand', this.expandEvent);

        this.collapseEvent = function() {};
        spyOn(this, 'collapseEvent');
        this.$node.on('collapse', this.collapseEvent);
    });

    it('expands when you click on it', function() {
        this.$node.trigger('click');
        expect(this.expandEvent).toHaveBeenCalled();
    });

    it('collapses when you click on the application content', function() {
        this.applicationContent.trigger('click');
        expect(this.collapseEvent).toHaveBeenCalled();
    });

    it('doesnt expand when you click on an item inside it', function() {
        this.$node.find('li').trigger('click');
        expect(this.expandEvent).not.toHaveBeenCalled();
    });

    it('doesnt display tooltip if tooltipSelector is not defined', function() {
        expect($('.application-menu-tooltip').length).toBe(0);
    });

    describe('with tooltip', function() {

        beforeEach(function() {
            setupComponent({
                expandDuration: 200,
                collapseDuration: 200,
                expandedWidth: 400,
                collapsedWidth: 200,
                tooltipSelector: 'li',
                applicationContent: this.applicationContent
            });

            this.$node.append('<li>');
        });

        it('shows the tooltip when you mouseover an element', function() {
            this.$node.find('li').trigger('mouseover');
            expect($('.application-menu-tooltip').css('display')).toBe('block');
        });

        it('doesnt show the tooltip if it is expanded', function() {
            this.$node.trigger('expand');
            this.$node.find('li').trigger('mouseover');
            expect($('.application-menu-tooltip').css('display')).toBe('none');
        });

        it('hides when you mouseout the element', function() {
            this.$node.find('li').trigger('mouseover');
            this.$node.find('li').trigger('mouseout');
            expect($('.application-menu-tooltip').css('display')).toBe('none');
        });

    });
});
