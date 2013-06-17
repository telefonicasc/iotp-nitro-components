
describeComponent('components/window/window', function() {

    describe('When created with default options', function() {

        beforeEach(function() {
            setupComponent();
        });

        it('Should be have m2m-window class', function() {
            expect(this.component.$node.hasClass('m2m-window')).toBe(true);
        });

        it('Should be appended to the body', function() {
            expect(this.component.$node.parent().is($('body'))).toBe(true);
        });

        it('Should create a m2m-window-content container', function() {
            expect($('.m2m-window-content').length).toEqual(1);
        });

        it('Should be hidden by default', function() {
            expect(this.component.$node.is(':visible')).toBe(false);
        });

        describe('When you trigger show', function() {

            beforeEach(function() {
                this.component.trigger('show');
            });

            afterEach(function() {
                this.component.trigger('hide');
            });

            it('It should be shown', function() {
                expect(this.component.$node.is(':visible')).toBe(true);
            });

            it('Should be hidden when you click on the mask', function() {
                this.component.$node.trigger('click');
                expect(this.component.$node.is(':visible')).toBe(false);
            });

            it('Should not hide when you click on the content', function() {
                this.component.$node
                    .find('.m2m-window-content').trigger('click');
                expect(this.component.$node.is(':visible')).toBe(true);
            });

            it('Should be hidden when you trigger hide', function() {
                this.component.trigger('hide');
                expect(this.component.$node.is(':visible')).toBe(false);
            });
        });

    });

    describe('When created with showOnInit: true', function() {

        beforeEach(function() {
            setupComponent({ showOnInit: true });
        });

        it('Should be shown by default', function() {
            expect(this.component.$node.is(':visible')).toBe(true);
        });
    });

    describe('When mask is set to false', function() {

        beforeEach(function() {
            setupComponent({ mask: false });
        });

        it('mask class should not be added to the component', function() {
            expect(this.component.$node.hasClass('mask')).toBe(false);
        });

    });

    describe('When items are set', function() {

        beforeEach(function() {
            setupComponent({ items: [{ tpl: '<div class="jojojo"></div>' }] });
        });

        it('should add items to the content', function() {
            expect($('.jojojo').length).toBe(1);
        });

    });

    describe('When a different container is set', function() {

        beforeEach(function() {
            $('<div id="jojojo">').appendTo($('body'));
            setupComponent({ container: '#jojojo' });
        });

        afterEach(function() {
            $('#jojojo').remove();
        });

        it('should be added to that container', function() {
            expect($('#jojojo .m2m-window').length).toBe(1);
        });
    });
});
