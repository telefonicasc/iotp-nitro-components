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

        var minimap = {
            component: 'minimap',
            mapId: 'keithtid.map-z1eeg2ge',        
            zoomValue: 16,
            movable: true,
            markerModel: {
                geometry: { coordinates: [ 8.61, 50.111 ] },
                properties: {
                    'marker-color': '#FF0000',
                    'marker-symbol': 'circle',
                    'title': 'Empty'
                }
            }
        };

        var compList = [
            {
                component: 'OverviewSubpanel',
                className: 'detail-element-header',
                iconClass: 'marker-red',
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
            {
                component: 'detailPanel',
                header: 'Battery Level',
                id: 'battery-level',
                items: [
                    {
                        component: 'batteryWidget',
                        className: 'battery-widget'
                    }    
                ]
            },
            {
                component: 'detailPanel',
                header: 'Last Location',
                id: 'last-location',
                items: [minimap]
            }

        ];

        // LOADER ==========================================

        requirejs(['components/jquery_plugins'], function() {
            
            var warning_subpanel_html = '<div class="warning-item overview-subpanel" data-bind="" style="">'
                + '<div class="icon marker-red"></div>'
                + '<div class="overview-subpanel-body">'
		+ '<div class="text"></div>'
		+ '<div class="caption"></div>'
                + '</div></div>';
        
            var pollInterval = 5000;
            var markerColorWarn = '#CB3337';
            var markerColorOk = '#5E91A0';
        
            /* Testing URL */
            var assetsURL = 'http://localhost:8080/MockApi/mock/assets';
            /* Deploy URL */
            //var assetsURL = 'http://nitroic:8080/secure/m2m/v2/services/TrafficLightsDE/assets';

            $('.dashboard').m2mdashboard({
                mainContent: [
                    {
                        component: 'map',
                        zoomInitial: 13,
                        zoomMin: 5,
                        zoomMax: 20,
                        markerClickEventTarget: '.mapbox-mini',
                        markerClickEvent: 'asset-selected',
                        features: []
                    }
                ],
                overviewPanel: {
                    title: 'Lights with warnings',
                    count: 0,
                    items: [
                        {
                            component: 'pagedPanel',
                            className: 'panel-list',
                            insertionPoint: '.panel-content-list',
                            header: '',
                            ID: 'panel-list',
                            items: []
                        },
                        {
                            component: 'pagedPanel',
                            className: 'panel-detail',
                            insertionPoint: '.panel-content-details',
                            ID: 'panel-detail',
                            allwaysVisible: [0],
                            items: compList
                        }
                    ]
                },
                data: function() {

                }
            });

            // Initial events ==================================================

            // Hide details on load
            $('.panel-detail').hide();

            // Update paged panel, to adjust components on load
            $('.paged-panel').trigger('update-view');
            
            // On resize, update panel views
            $(window).bind('resize', function () {
                $('.panel-list').trigger('update-view');    
                $('.panel-detail').trigger('update-view');    
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
            $('.battery-widget').trigger('drawBattery');

            var swapPanels = function (locator) {
                console.log("Swap locator is: " + locator);
                $('.panel-list').slideToggle();
                $('.panel-detail').slideToggle();
            };
            
            // Add navigation buttons to map
            var template_offscreen = 
                '<div class="offscreen-indicator nwmarkers">0</div>' +
                '<div class="offscreen-indicator nmarkers">0</div>' +
                '<div class="offscreen-indicator nemarkers">0</div>' +
                '<div class="offscreen-indicator emarkers">0</div>' +
                '<div class="offscreen-indicator semarkers">0</div>' +
                '<div class="offscreen-indicator smarkers">0</div>' +
                '<div class="offscreen-indicator swmarkers">0</div>' +
                '<div class="offscreen-indicator wmarkers">0</div>';
        
            $('.fit').append(template_offscreen);
            
            $('.offscreen-indicator').on('click', function (event) {
                var data = {
                    properties: {
                        title: $(event.target).attr('last'),
                        caption: ''
                    }
                };
                $('.dashboard').trigger('asset-selected', data);
            });
            
            var updateOffscreenIndicators = function () {
                $('.mapbox').trigger('announce-markers', ['.dashboard','updateOffscreenMarkers']);
            };
            
            var createNewMarker = function (name, lat, lon, color) {
                color = (typeof color === 'undefined') ? markerColorOk : color;
                console.log('Creating marker for ' + name);
                // Add marker to map
                var marker = {
                    geometry : {
                        coordinates : [ parseFloat(lon), parseFloat(lat) ]
                    },
                    properties : {
                        'marker-color': color,
                        'marker-symbol': 'circle',
                        'title': name
                    }
                };

                $('.mapbox').trigger('add-marker-feature', marker);
                $('.mapbox-mini').trigger('updateMinimap', marker);

                updateOffscreenIndicators();
            };
            
            var generateErrorText = function (sensorData) {
                var errors = '';
                $.each(sensorData, function (index, value) {
                    if ('ms' in value) {
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
                return errors;
            };
            
            var updateWarningPanelTrigger = function () {
                $('.overview-subpanel .text').on('click',function () {
                    console.log("Element: " + $(this).attr('class'));
                    var data = {
                        properties: {
                            title: $(this).html(),
                            caption: $(this.parentNode.childNodes[1]).html()
                        }
                    };
                    $('.dashboard').trigger('asset-selected', data);
                });
            };
           
            var updateWarningList = function (assetName, warnings) {
                var matches = $('.panel-content-list .overview-subpanel .text:contains(\"' + assetName + '\")');
                
                if (matches.length === 0 && warnings !== '') {
                    // append another subpanel
                    $('.panel-content-list').append(warning_subpanel_html);
                    
                    $('.panel-content-list .overview-subpanel .text').last().html(assetName);
                    $('.panel-content-list .overview-subpanel .caption').last().html(warnings);
                    
                    updateWarningPanelTrigger();
                }
                else {
                    if (warnings === '') {
                        $(matches[0]).remove();
                    }
                    else {
                        $(matches[0]).parent().children('.caption').html(warnings);
                    }
                }
                
                // update warning counter
                var count = $('.panel-content-list .overview-subpanel').length;
                $('.overview-count').html(count);
            };
            
            var centerMap = function (lat,lon) {
                $('.mapbox').trigger('center-map', [lat,lon]);
            };
            
            var updateAssets = function () {
                $.ajax({
                    url: assetsURL,
                    type: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        // get every asset name
                        $.each(response.data, function (index, value) {
                            var assetInfoURL = assetsURL + '/' + value.asset.name;
                            // Get asset info
                            $.ajax({
                                url: assetInfoURL,
                                type: 'GET',
                                dataType: 'json',
                                success: function(response) {
                                    // Get asset lat/lon
                                    var lat = response.data.asset.location.latitude;
                                    var lon = response.data.asset.location.longitude;
                                    var errors = generateErrorText(response.data.sensorData);
                                    updateWarningList(value.asset.name, errors);
                                    var markerColor = (errors === '') ? markerColorOk : markerColorWarn;
                                    createNewMarker(value.asset.name,lat,lon,markerColor);
                                    centerMap(lat,lon);
                                },
                                error: function(request, error, errorThrown) {
                                    console.error('Error accessing URL: ' + assetInfoURL + ". " + error + ":" + errorThrown);
                                }
                            });
                        });
                    },
                    error: function(request, error, errorThrown) {
                        console.error('Error accessing URL: ' + assetsURL + ". " + error + ":" + errorThrown);
                    }
                });
            };
                        
            /* When an element is clicked, update sidebar info with the latest */
            var updateAssetInfo = function (assetName) {
                var assetInfoURL = assetsURL + "/" + assetName;
                console.log('Updating asset info: ' + assetInfoURL);
                $.ajax({
                    url: assetInfoURL,
                    type: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        var lat = response.data.asset.location.latitude;
                        var lon = response.data.asset.location.longitude;
                        console.log("Asset: " + response.data.asset.name + " [" + lat + ":" + lon + "]");
                        $('.mapbox').trigger('center-map', [lat, lon]);
                        // Update selected element name
                        $('.panel-content-details .text').html(assetName);

                        // Get asset errors, if any
                        if (parseInt($('.warning-item .text:contains("'+assetName+'")').length) !== 0) {
                            $('.panel-content-details .icon').removeClass('marker-blue');
                            $('.panel-content-details .icon').addClass('marker-red');
                            
                        }
                        else {
                            $('.panel-content-details .icon').removeClass('marker-red');
                            $('.panel-content-details .icon').addClass('marker-blue');
                        }
                        var last_update = 'Last update: ';
                        if (response.data.sensorData.length > 0)
                            last_update += response.data.sensorData[0].st;
                        else
                            last_update += 'unknown';
                        $('.panel-content-details .caption').html(last_update);
                        
                        // Get asset data
                        $.each(response.data.sensorData, function (index, value) {
                            if ('ms' in value) {
                                if (value.ms.p === 'temperature') {
                                    $('.temperature-widget').trigger('drawTemperature',parseFloat(value.ms.v));
                                }
                                else if (value.ms.p === 'pitch') {
                                    $('.pitch-widget').trigger('drawPitch', parseInt(value.ms.v));
                                }
                                else if (value.ms.p === 'voltage') {
                                    $('.battery-widget').trigger('drawBattery-voltage', parseFloat(value.ms.v));
                                }
                                else if (value.ms.p === 'batteryStatus') {
                                    $('.battery-widget').trigger('drawBattery-level', value.ms.v);
                                }
                            }
                            else console.log("Element without measure info");                            
                        });
                        updateOffscreenIndicators();
                    },
                    error: function() {
                        console.error('Cant find asset info. (Requesting mock)');
                    }
                });
            };
            
            $('.dashboard').on('asset-selected', function (event, data) {
                // Make sure correct panel is displayed
                $('.panel-list').slideUp();
                $('.panel-detail').slideDown();
                $('.paged-panel').trigger('update-view');
                console.log('Selected asset: ' + data.properties.title);
                updateAssetInfo(data.properties.title);
            });
            
            $('.dashboard').on('mapbox-zoomed', function () {
                updateOffscreenIndicators();
            });
            $('.dashboard').on('mapbox-panned', function () {
                updateOffscreenIndicators();
            });
            
            $('.dashboard').on('updateOffscreenMarkers', function (event, data, extent, center) {
                // Receives in data an array of mapbox features

                // reset marker status
                $.each ($('.offscreen-indicator'), function (key,value) {
                    $(value).hide();
                    $(value).html('0');
                    $(value).attr('title');
                });
                
                for (x in data) {
                    
                    var el = data[x];
                    var lat = el.geometry.coordinates[1];
                    var lon = el.geometry.coordinates[0];
                    var locator = '.';
                    
                    if (lat > extent.north) locator += 'n';
                    else if (lat < extent.south) locator += 's';
                    
                    if (lon > extent.east) locator += 'e';
                    else if (lon < extent.west) locator += 'w';
                    
                    locator += 'markers';
                    
                    if (locator !== '.markers') {
                        var count = parseInt($(locator).html()) + 1;
                        $(locator).html(count);
                        $(locator).show();
                        $(locator).attr('last', el.properties.title);
                    }
                };
            });
            
            // Load first data
            updateAssets();
            
            /* Uncomment this line for device data polling */
            // window.setInterval(function () { updateAssets(); }, pollInterval);
           
        }); // requirejs
    }
);
