describeComponent('components/dashboard/map', function() {

    describe('with default options', function() {

        beforeEach(function() { 
            setupComponent();

            this.testData = [{
                latitude: 40.5,
                longitude: -3,
                cssClass: 'red',
                title: 'Marker 1'
            }, {
                latitude: 40.2,
                longitude: -3.1,
                title: 'Marker 2'
            }];

        });

        it('has m2m-dashboardmap class', function() {
            expect(this.$node.hasClass('m2m-dashboardmap')).toBe(true);
        });



        it('items get added on valueChange', function() {
            var markers = [];
            this.$node.trigger('valueChange', { value: this.testData });
            this.component.markersLayer.eachLayer(function(marker) { 
                markers.push(marker);
            });
            expect(markers.length).toBe(2);
        });

    });

});
