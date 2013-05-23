requirejs.config({
    baseUrl: '/m2m-nitro-components'
});

define(
    [
        'components/dashboard/dashboard',
        'components/minimap',
        'components/dashboard/overview_subpanel',
        'components/paged_panel',
        'components/paged_detail',
        'components/detail_panel',
        'components/map',
        'components/widget_temperature',
        'components/widget_pitch',
        'components/widget_lights',
        'components/widget_battery'
    ],
  
    function() {

        /*
        var swapPanels = function (locator) {
            console.log("Swap locator: " + locator);
        };
        */
        // CONFIG: This config should override the one provided by default below (for testing)
        //
        // Config germany 
        var features_germany = [
            {
                'geometry': { coordinates: [ 8.645, 50.113 ] },
                'properties': {
                    'marker-color': '#088A85',
                    'marker-symbol': 'circle',
                    'title': 'AssetSemaphore1'
                }
            },
            {
                'geometry': { coordinates: [ 8.63, 50.09 ] },
                'properties': {
                    'marker-color': '#DF0101',
                    'marker-symbol': 'circle',
                    'title': 'AssetSemaphore2',
                    'description': 'Semaphore'
                }
            },
            {
                'geometry': { coordinates: [ 8.61, 50.111 ] },
                'properties': {
                    'marker-color': '#DF0101',
                    'marker-symbol': 'circle',
                    'title': 'AssetSemaphore3'
                }
            },
            
            {
                'geometry': { coordinates: [ 8.691902, 50.088759 ] },
                'properties': {
                    'marker-color': '#DF0101',
                    'marker-symbol': 'circle',
                    'title': 'AssetSemaphore4'
                }
            },
            {
                'geometry': { coordinates: [ 8.467712, 50.125861 ] },
//                'geometry': { coordinates: [ 8.467712, 50.0 ] },
                'properties': {
                    'marker-color': '#088A85',
                    'marker-symbol': 'circle',
                    'title': 'AssetSemaphore5'
                }
            }
        ];

        var warnings_germany = [
            {
                component: 'OverviewSubpanel',
                iconClass: 'dot red',
                text: 'AssetSemaphore2',
                caption: 'Inclination change: +10'
            },
            {
                component: 'OverviewSubpanel',
                iconClass: 'dot red',
                text: 'AssetSemaphore3',
                caption: 'Voltage < 10V'
            },
            {
                component: 'OverviewSubpanel',
                iconClass: 'dot red',
                text: 'AssetSemaphore4',
                caption: 'No red light for +5 min'
            }
        ];
        
        var center_germany = { lat: 50.1, lon: 8.625 };
        var zoom_germany = 13;

        var minimap = {
            component: 'minimap',
            zoomValue: 16,
            movable: true,
            markerModel: {
                geometry: { coordinates: [ 8.61, 50.111 ] },
                properties: {
                    'marker-color': '#FF0000',
                    'marker-symbol': 'circle',
                    'title': 'AssetSemaphore3'
                }
            }
        };

        var compList = [
            {
                component: 'OverviewSubpanel',
                className: 'detail-element-header',
                iconClass: 'dot red',
                text: 'AssetSemaphore2',
                caption: 'Inclination change +10'
            },
            {
                component: 'detailPanel',
                header: 'Physical conditions',
                id: 'physical-conditions',
                items: [
                    {
                        component: 'temperatureWidget',
                        className: 'temperature-widget' 
                    },
                    {
                        component: 'pitchWidget',
                        className: 'pitch-widget'
                    }
                ]
            },
            {
                component: 'detailPanel',
                header: 'Light color',
                id: 'light-color',
                items: [
                    {
                        component: 'lightsWidget',
                        className: 'lights-widget'
                    }    
                ]
            },
            /*{
                component: 'detailPanel',
                header: 'Battery Level',
                id: 'battery-level',
                items: [
                    {
                        component: 'batteryWidget',
                        className: 'battery-widget'
                    }    
                ]
            },*/
            {
                component: 'detailPanel',
                header: 'Last Location',
                id: 'last-location',
                items: [minimap]
            }

        ];

        // LOADER ==========================================

        requirejs(['components/jquery_plugins'], function() {

            $('.dashboard').m2mdashboard({
                mainContent: [
                    {
                        component: 'map',
                        showZoomButtons: true,
                        hoveringTooltip: true,
                        debug: false,
                        center: center_germany,
                        zoomInitial: zoom_germany,
                        zoomMin: 5,
                        zoomMax: 20,
                        centerOnClick: true,
                        markerClickEventTarget: '.mapbox-mini',
                        markerClickEvent: 'updateMinimap',
                        features: features_germany
                    }
                ],
                overviewPanel: {
                    title: 'Lights with warnings',
                    count: 3,
                    items: [
                        {
                            component: 'pagedPanel',
                            className: 'panel-list',
                            insertionPoint: '.panel-content-list',
                            header: '',
                            ID: 'panel-list',
                            items: warnings_germany
                        },
                        {
                            component: 'pagedPanel',
                            className: 'panel-detail',
                            insertionPoint: '.panel-content-details',
//                            header: 'Asset details',
                            ID: 'panel-detail',
                            allwaysVisible: [0],
                            items: compList
                        }
                    ]
                },
                data: function() {

                }
            });

            // Initial events ======================================================

            // Process feature updates
            $(this).on('update-dashboard', function (event, features, center, zoom) {
                // Update map
                $('.mapbox').trigger('update-marker-features', [features, center, zoom]);
                
                // Update sidebar
                var details = new Array();
                for (var i = 0; i < features.length; i++) {
                    var newItem = {
                        component: 'OverviewSubpanel',
                        iconClass: 'dot red',
                        text: features[i].properties['title'],
                        caption: 'TODO'
                    };
                    details.push(newItem);
                }
                $('.panel-list').trigger('load-items', [details]);
            });

            // (DEBUG) Send the initial trigger
            //$(this).trigger('update-dashboard', [features_germany, center_germany, zoom_germany]);

            // Hide details on load
            $('.panel-detail').hide();

            // Update paged panel, to adjust components on load
            $('.paged-panel').trigger('update-view');
            
            // On resize, update panel views
            $(window).bind('resize', function () {
                $('.panel-list').trigger('update-view');    
                $('.panel-detail').trigger('update-view');    
            }); 
            
            // Click on subpanel element 
            $('.overview-subpanel .text').on('click',function () {
                console.log("Element: " + $(this).attr('class'));
                var data = {
                    properties: {
//                        title: $(event.target).html(),
                        title: $(this).html(),
                        caption: $(this.parentNode.childNodes[1]).html()
                    }
                };
                $('.dashboard').trigger('updateMinimap', data);
            });
       
            // Click on sidebar title 
            $('.overview-header').on('click', function () {
                $('.panel-list').slideDown();
                $('.panel-detail').slideUp();
            });
            
            // Update widgets
            $('.temperature-widget').trigger('drawTemperature');
            $('.pitch-widget').trigger('drawPitch');
            $('.lights-widget').trigger('drawLights');
            //$('.battery-widget').trigger('drawBattery');

            var swapPanels = function (locator) {
                console.log("Swap locator is: " + locator);
                $('.panel-list').slideToggle();
                $('.panel-detail').slideToggle();
            };

            // MOCK ============================================================
            
            // Fix count 
            $('.overview-count').html('3');
            
            // JSON service data read
//            var url = 'http://nitroic:5371/m2m/v2/services/TrafficLightsDE/assets';
//            var secureURL = 'http://nitroic:5371/secure/m2m/v2/services/TrafficLightsDE/assets';

            var assetsURL = 'http://localhost:8080/MockApi/mock/assets';
            
            /* Updates sidebar asset list */
            var updateAssets = function () {
                $.ajax({
                    url: assetsURL,
                    type: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        // get every asset name
                        $.each(response.data, function (index, value) {                            
                            var assetInfoURL = assetsURL + "/" + value.asset.name;
                            // Get asset info
                            $.ajax({
                                url: assetInfoURL,
                                type: 'GET',
                                dataType: 'json',
                                success: function(response) {
                                    // Get asset lat/lon
                                    var assetName = value.asset.name;
                                    var lat = response.data.asset.location.latitude;
                                    var lon = response.data.asset.location.longitude;
                                    // Get asset data (error check)
                                    var sensorData = response.data.sensorData;
                                    var errors = '';
                                    
                                    // Add sidebar element
                                    $.each(sensorData, function (index, value) {
                                        console.log ('INDEX::'+index);
                                        if ('ms' in value) {
//                                            console.log ("PH : " + value.ms.p + " ::= " + value.ms.v);
                                            // Evaluate error conditions
                                            if (value.ms.p === 'voltage' && parseInt(value.ms.v) < 10) {
                                                errors += 'Voltage < 10V</br>';
                                            }
                                            else if (value.ms.p === 'pitch') {
                                                var pitch = parseInt(value.ms.v);
                                                if (pitch < 80 || pitch > 100) {
                                                    errors += 'Inclination change error</br>'; 
                                                }
                                            }
                                            else if (value.ms.p === 'greenLight' && value.ms.v === 'error') {
                                                errors += 'Green light error</br>';
                                            }
                                            else if (value.ms.p === 'yellowLight' && value.ms.v === 'error') {
                                                errors += 'Yellow light error</br>';
                                            }
                                            else if (value.ms.p === 'redLight' && value.ms.v === 'error') {
                                                errors += 'Red light error</br>';
                                            }
                                        }
                                    });
                                    
                                    // Create new subpanel if required (cloning)
                                    // Asset search
                                    $('.panel-content-list').attr('search',assetName);
                                    $('.panel-content-list .overview-subpanel .text').each(function (index, value) {
                                        if ($(value).html() === $(this).attr('search')) {
                                            $(this).attr('search','');
                                        }
                                    });

                                    // Create element if not there
                                    var clone;
                                    if ($('.panel-content-list').attr('search') !== '') {
                                        console.log('I need to add ' + $('.panel-content-list').attr('search'));
//                                        clone = $($('.panel-content-list .overview-subpanel')[0]).clone(true);
//                                        clone.appendTo('.panel-content-list');
                                        $($('.panel-content-list .overview-subpanel')[0]).clone(true).appendTo('.panel-content-list');
                                        $('.panel-content-list .overview-subpanel .text').last().html(assetName);
                                        $('.panel-content-list .overview-subpanel .caption').last().html(errors);
                                    }
                                    $('.panel-content-list').removeAttr('search');
                                    
                                    // Add marker to map
                                    var marker = {
                                        geometry : {
                                            coordinates : [ parseFloat(lon), parseFloat(lat) ]
                                        },
                                        properties : {
                                            'marker-color': '#DF0101',
                                            'marker-symbol': 'circle',
                                            'title': value.asset.name
                                        }
                                    };
                                    
                                    $('.mapbox').trigger('add-marker-feature', marker);
                                    
                                   
                                    // Add marker to map
                                    var marker = {
                                        geometry : {
                                            coordinates : [ parseFloat(lon), parseFloat(lat) ]
                                        },
                                        properties : {
                                            'marker-color': '#DF0101',
                                            'marker-symbol': 'circle',
                                            'title': value.asset.name
                                        }
                                    };
                                    
                                    $('.mapbox').trigger('add-marker-feature', marker);
                                    
                                },
                                error: function() {
                                    alert('boo!');
                                },
                                beforeSend: function(xhr) {
                                    xhr.setRequestHeader('Authorization', 'M2MUser test2%3Atest2');
                                }
                            });
                        });
                    },
                    error: function() {
                        alert('boo!');
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', 'M2MUser test2%3Atest2');
                    }
                });
                
            };
            
            var mockDeviceInfo = function (callingElement) {
                console.log("Mocking data for : " + callingElement);
                if (callingElement === 'AssetSemaphore1') {
                    $('.temperature-widget').trigger('drawTemperature',15.3);
                    $('.pitch-widget').trigger('drawPitch',90);                    
                    $('.detail-element-header .text').html(callingElement);
                    $('.detail-element-header .caption').html('No problems detected');
                }
                else if (callingElement === 'AssetSemaphore2') {
                    $('.temperature-widget').trigger('drawTemperature',15.1);
                    $('.pitch-widget').trigger('drawPitch',75);
                    $('.detail-element-header .text').html(callingElement);
                    $('.detail-element-header .caption').html('Inclination change +10');
                }
                else if (callingElement === 'AssetSemaphore3') {
                    $('.temperature-widget').trigger('drawTemperature',15.7);
                    $('.pitch-widget').trigger('drawPitch', 23);
                    $('.detail-element-header .text').html(callingElement);
                    $('.detail-element-header .caption').html('Voltage < 10V<br/>Inclination change +10');
                }
                else if (callingElement === 'AssetSemaphore4') {
                    $('.temperature-widget').trigger('drawTemperature',14.8 );
                    $('.pitch-widget').trigger('drawPitch', 90);
                    $('.detail-element-header .text').html(callingElement);
                    $('.detail-element-header .caption').html('No red light for +5m');
                }
                else if (callingElement === 'AssetSemaphore5') {
                    $('.temperature-widget').trigger('drawTemperature',14.8);
                    $('.pitch-widget').trigger('drawPitch', 90);
                    $('.detail-element-header .text').html(callingElement);
                    $('.detail-element-header .caption').html('No problems detected');
                }
                else {
                    console.log('Received unexpected asset id');
                }
            };
            
            /* When an element is clicked, update sidebar info with the latest */
            var updateAssetInfo = function (assetName) {
                var assetInfoURL = assetsURL + "/" + assetName;
                console.log('Updating asset info: ' + assetInfoURL);
                
                // get asset info
                $.ajax({
                    url: assetInfoURL,
                    type: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        var assetName = response.data.asset.name;
                        // Get asset lat/lon
                        var lat = response.data.asset.location.latitude;
                        var lon = response.data.asset.location.longitude;
                        console.log("Asset: " + assetName + " [" + lat + ":" + lon + "]");
                        // center map on asset
                        $('.mapbox').trigger('center-map', [lat, lon]);
                        // Get asset data
                        var sensorData = response.data.sensorData;

                        $.each(sensorData, function (index, value) {
                            if ('ms' in value) {
                                if (value.ms.p === 'temperature') {
                                    $('.temperature-widget').trigger('drawTemperature',parseFloat(value.ms.v));
                                }
                                else if (value.ms.p === 'pitch') {
                                    $('.pitch-widget').trigger('drawPitch', parseInt(value.ms.v));
                                }
                            }
                            else console.log("Element without measure info");
                        });
                    },
                    error: function() {
                        console.error('Cant find asset info. (Requesting mock)');
                        mockDeviceInfo(assetName);
                    },
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'M2MUser test2%3Atest2');
                    }
                });
            };
            
            
            
            $('.dashboard').on('updateMinimap', function (event, data) {
                // Make sure correct panel is displayed
                $('.panel-list').slideUp();
                $('.panel-detail').slideDown();
                $('.paged-panel').trigger('update-view');
                
                var callingElement = data.properties.title;
                var callingElementCaption = data.properties.caption;
                console.log('Received element name: ' + callingElement);
                $('.detail-element-header .text').html(callingElement);
                $('.detail-element-header .caption').html(callingElementCaption);
                updateAssetInfo(callingElement);
            });
            
            updateAssets();
            
            /* Uncomment this line for device data polling */
            // window.setInterval(function () { updateAssets(); }, 5000);
            
           
        }); // requirejs
    }
);
