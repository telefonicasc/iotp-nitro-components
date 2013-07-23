describeComponent('components/widget_battery.js', function () {

    var MOCK_DATA = {
        value:{
            voltage:5,
            charge:'low'
        }
    };
    beforeEach(function(){
        setupComponent({});
    });
    describe('Extend Raphael', function(){
        it('drawGrid', function(){
            expect(Raphael.fn.drawGrid).toBeDefined();
        });

        it('drawYLabels', function(){
            expect(Raphael.fn.drawYLabels).toBeDefined();
        });

        it('drawXLabels', function(){
            expect(Raphael.fn.drawXLabels).toBeDefined();
        });
    });

    describe('Install component', function(){
        it('install', function(){
            expect(this.$node).toBeDefined();
            expect(this.component.attr.widgetGraph).toBeDefined();
            expect(this.component.attr.widgetChart).toBeDefined();
        });
    });

    describe('Event "refresh"', function(){
        it('redraw BatteryGraph', function(){
            var $elementA;
            var $elementB = $('.battery-graph', this.$node);

            expect($elementB.length).toEqual(1);
            this.$node.trigger('refresh');

            $elementA = $('.battery-graph', this.$node);
            expect($elementA.length).toEqual(1);
            expect($elementA[0]).not.toEqual($elementB[0]);
        });

        it('redraw battery-label', function(){
            var $elementA;
            var $elementB = $('.battery-label', this.$node);

            expect($elementB.length).toEqual(1);
            this.$node.trigger('refresh');

            $elementA = $('.battery-label', this.$node);
            expect($elementA.length).toEqual(1);
            expect($elementA[0]).not.toEqual($elementB[0]);
        });
    });

});
