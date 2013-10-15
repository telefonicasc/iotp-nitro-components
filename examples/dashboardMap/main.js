
requirejs.config({
    baseUrl: '../../'
});

define(
[
    'components/dashboard/dashboard',
    'components/dashboard/map'
],

function() {

        requirejs(['components/jquery_plugins'], function() {

        $('.dashboard').m2mdashboard({
            mainContent: [{
                component: 'DashboardMap',
                model: 'markers'
            }],
            overviewPanel: {},
            data: function(cb) {
                cb({ markers: [
                    {
                        latitude: 40,
                        longitude: -3
                    },
                    {
                        latitude: 40.5,
                        longitude: -3.4
                    }
                ]});
            }
        });

        $('.dashboard').trigger('updateData');
    });
}
);
