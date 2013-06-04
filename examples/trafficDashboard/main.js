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
                listenTo: 'asset-selected',
                markerModel: {
                    geometry: {coordinates: [8.61, 50.111]},
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
                            // Only when moved to install.js
//                            ,
//                            arrowURL: 'url(/packages/dashboard/dashboards/traffic/res/images/arrow.png)',
//                            greyLightURL: 'url(/packages/dashboard/dashboards/traffic/res/images/greyLight.png)'
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
                var useKermit = false;

                /* Testing URL */
                var assetsURL = 'http://localhost:8080/MockApi/mock/assets';
                var assetsDetailedURL = 'http://localhost:8080/MockApi/mock/assets?detailed=1';
                /* Deploy URL */
//                var assetsURL = '/secure/m2m/v2/services/TrafficLightsDE/assets';
//                var service = Kermit.$injector.get('$user').credential.serviceName;
//                var assetsURL = '/secure/m2m/v2/services/' + service + '/assets';
//                var assetsDetailedURL = assetsURL + '?detailed=1';

                /* Gallus, germany */
                var initialCenter = {lat: 50.103749, lon: 8.641774};
//                var initialCenter = {lat: 50.456729, lon: 7.485};
                
                var requestApiData = function (url, callback) {
                    if (useKermit) {
                        API.http.request({method:'GET', url:url})
                            .success(function (data,status,headers,config) {
                                callback(data);
                            })
                            .error(function (data,status,headers,config) {
                                console.error("Can't access to API REST.");
                            });
                    }
                    else {
                        $.ajax({
                            url: url,
                            type: 'GET',
                            dataType: 'json',
                            success: function(response) {
                                callback(response);
                            },
                            error: function (request, errorText, errorThrown) {
                                console.log('error: ' + errorThrown);
                            }
                        });
                    }
                };
                
                /* // Sample use 
                var print = function (jsondata) {
                    console.log(JSON.stringify(jsondata));
                };
                
                requestApiData(assetsDetailedURL, print);
                
                */

                $('.dashboard').m2mdashboard({
                    mainContent: [
                        {
                            component: 'map',
                            zoomInitial: 13,
                            zoomMin: 5,
                            center: initialCenter,
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
                                header: '',
                                ID: 'panel-list',
                                items: []
                            },
                            {
                                component: 'pagedPanel',
                                className: 'panel-detail',
                                extraHeaderGap: 50,
                                alwaysVisible: [0, 1],
                                items: compList
                            }
                        ]
                    },
                    data: function() {

                    }
                });
                
                var updateCenter = function () {
                    var url = assetsURL + '?detailed=1';
                    var fn = function (response) {debugger
                        if (response.count != 0) {
                            var lat = response.data[0].asset.location.latitude;
                            var lon = response.data[0].asset.location.longitude;
                            $('.mapbox').trigger('center-map', [lat,lon]);
                        }
                        else {
                            console.log('No data found!');
                        }
                    };
                    
                    if (useKermit) {
                        API.http.request({method:'GET', url:url})
                            .success(function (data,status,headers,config) {
                                fn(data);
                            })
                            .error(function (data,status,headers,config) {
                                console.error("Can't access to API REST.");
                            });
                    }
                    else {
                        $.ajax({
                            url: url,
                            type: 'GET',
                            dataType: 'json',
                            success: function(response) {
                                fn(response);
                            },
                            error: function (request, errorText, errorThrown) {
                                console.log('error: ' + errorThrown);
                            }
                        });
                    }
                };

                // =================================================================
                // Complete DOM with indicators
                // =================================================================

                // Add offscreen navigation buttons to map
                var template_offscreen =
                        '<div class="offscreen-indicator nwmarkers">0</div>' +
                        '<div class="offscreen-indicator nmarkers">0</div>' +
                        '<div class="offscreen-indicator nemarkers">0</div>' +
                        '<div class="offscreen-indicator emarkers">0</div>' +
                        '<div class="offscreen-indicator semarkers">0</div>' +
                        '<div class="offscreen-indicator smarkers">0</div>' +
                        '<div class="offscreen-indicator swmarkers">0</div>' +
                        '<div class="offscreen-indicator wmarkers">0</div>';

                $('.fit .mapbox').append(template_offscreen);

                // Add error panel to details
                var template_error_details = '<div class="detail-errors"></div>';
                $('.detail-element-header').after(template_error_details);

                // =================================================================
                // Set up
                // =================================================================

                // Hide details on load
                $('.panel-detail').hide();

                // Update paged panel, to adjust components on load
                $('.paged-panel').trigger('update-view');

                // On resize, update panel views
                $(window).bind('resize', function() {
                    $('.panel-list').trigger('update-view');
                    $('.panel-detail').trigger('update-view');
                });

                // Update widgets
                $('.temperature-widget').trigger('drawTemperature');
                $('.pitch-widget').trigger('drawPitch');
                $('.lights-widget').trigger('drawLights');
                $('.battery-widget').trigger('drawBattery');

                // =================================================================
                // Functions
                // =================================================================

                var updateOffscreenIndicators = function() {
                    $('.mapbox').trigger('announce-markers', ['.dashboard', 'updateOffscreenMarkers']);
                };

                var createNewMarker = function(name, lat, lon, color) {
                    color = (typeof color === 'undefined') ? markerColorOk : color;
                    // Add marker to map
                    var marker = {
                        geometry: {
                            coordinates: [parseFloat(lon), parseFloat(lat)]
                        },
                        properties: {
                            'marker-color': color,
                            'marker-symbol': 'circle',
                            'title': name
                        }
                    };

                    $('.mapbox').trigger('add-marker-feature', marker);
                    $('.mapbox-mini').trigger('updateMinimap', marker);

                    updateOffscreenIndicators();
                };

                var generateErrorText = function(sensorData) {
                    var errors = '';
                    $.each(sensorData, function(index, value) {
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

                var updateWarningPanelTrigger = function() {
                    $('.overview-subpanel .text').on('click', function() {
                        var data = {
                            properties: {
                                title: $(this).html(),
                                caption: $(this.parentNode.childNodes[1]).html()
                            }
                        };
                        $('.dashboard').trigger('asset-selected', data);
                    });
                };

                var updateWarningList = function(assetName, warnings) {
                    var matches = $('.panel-list .overview-subpanel .text:contains(\"' + assetName + '\")');

                    if (matches.length === 0 && warnings !== '') {
                        // append another subpanel
                        $('.panel-list').append(warning_subpanel_html);

                        $('.panel-list .overview-subpanel .text').last().html(assetName);
                        $('.panel-list .overview-subpanel .caption').last().html(warnings);

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
                    var count = $('.panel-list .overview-subpanel').length;
                    $('.overview-count').html(count);
                };

                var centerMap = function(lat, lon) {
                    $('.mapbox').trigger('center-map', [lat, lon]);
                };
                
                var updateAssetsFn = function (response) {
                    $.each(response.data, function (k,v) {
                        console.error('Updating asset ' + v.asset.name);
                        var lat = v.asset.location.latitude;
                        var lon = v.asset.location.longitude;
                        var errors = generateErrorText(v.sensorData);
                        updateWarningList(v.asset.name, errors);
                        var markerColor = (errors === '') ? markerColorOk : markerColorWarn;
                        createNewMarker(v.asset.name, lat, lon, markerColor);
                    });
                };
                
                var updateAssets = function () {
                    requestApiData(assetsDetailedURL, updateAssetsFn);
                };

                var updateAssetInfoFn = function (response) {
                    var assetName = response.data.asset.name;
                    var lat = response.data.asset.location.latitude;
                    var lon = response.data.asset.location.longitude;
                    console.log("Asset: " + response.data.asset.name + " [" + lat + ":" + lon + "]");
                    $('.mapbox').trigger('center-map', [lat, lon]);
                    // Update selected element name
                    $('.panel-detail .detail-element-header .text').html(assetName);
                    // Get asset errors, if any
                    if (parseInt($('.warning-item .text:contains("' + assetName + '")').length) !== 0) {
                        $('.panel-detail .detail-element-header .icon').removeClass('marker-blue');
                        $('.panel-detail .detail-element-header .icon').addClass('marker-red');
                        var errors = $('.warning-item .text:contains("' + assetName + '")').siblings('.caption').html();
                        $('.panel-detail .detail-errors').html(errors);
                    }
                    else {
                        $('.panel-detail .detail-element-header .icon').removeClass('marker-red');
                        $('.panel-detail .detail-element-header .icon').addClass('marker-blue');
                        $('.panel-detail .detail-errors').html('No problems detected');
                    }
                    var last_update = 'Last update: ';
                    if (response.data.sensorData.length > 0)
                        last_update += response.data.sensorData[0].st;
                    else
                        last_update += 'unknown';
                    $('.panel-detail .detail-element-header .caption').html(last_update);
                    // Get asset data
                    $.each(response.data.sensorData, function(index, value) {
                        if ('ms' in value) {
                            if (value.ms.p === 'temperature') {
                                $('.temperature-widget').trigger('drawTemperature', parseFloat(value.ms.v));
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
                    });
                    updateOffscreenIndicators();
                };
                
                var updateAssetInfo = function (assetName) {
                    var url = assetsURL + '/' + assetName;
                    requestApiData(url, updateAssetInfoFn);
                };

                var showDetails = function(event, data) {
//                $('.panel-detail').slideDown();
//                $('.panel-list').slideUp();
                    $('.panel-detail').show();
                    $('.panel-list').hide();
                    $('.panel-detail').trigger('update-view');
                    updateAssetInfo(data.properties.title);
                };

                var hideDetails = function() {
//                $('.panel-list').slideDown();
//                $('.panel-detail').slideUp();
                    $('.panel-list').show();
                    $('.panel-detail').hide();
                };

                // =================================================================
                // Trigger listeners
                // =================================================================

                $('.dashboard').on('asset-selected', showDetails);

                $('.overview-header').on('click', hideDetails);

                $('.dashboard').on('mapbox-zoomed', updateOffscreenIndicators);

                $('.dashboard').on('mapbox-panned', updateOffscreenIndicators);

                $('.dashboard').on('updateOffscreenMarkers', function(event, data, extent, center) {
                    // Receives data as an array of mapbox features
                    // reset marker status
                    $.each($('.offscreen-indicator'), function(key, value) {
                        $(value).hide();
                        $(value).html('0');
                        $(value).attr('title');
                    });

                    for (x in data) {

                        var el = data[x];
                        var lat = el.geometry.coordinates[1];
                        var lon = el.geometry.coordinates[0];
                        var locator = '.';

                        if (lat > extent.north)
                            locator += 'n';
                        else if (lat < extent.south)
                            locator += 's';

                        if (lon > extent.east)
                            locator += 'e';
                        else if (lon < extent.west)
                            locator += 'w';

                        locator += 'markers';

                        if (locator !== '.markers') {
                            var count = parseInt($(locator).html()) + 1;
                            $(locator).html(count);
                            $(locator).show();
                            $(locator).attr('last', el.properties.title);
                        }
                    }                    
                });

                $('.offscreen-indicator').on('click', function(event) {
                    var data = {
                        properties: {
                            title: $(event.target).attr('last'),
                            caption: ''
                        }
                    };
                    $('.dashboard').trigger('asset-selected', data);
                });

                // Load initial data
                
                updateAssets();
                updateCenter();
                /* Uncomment this line for device data polling */
                // window.setInterval(function () { updateAssets(); }, pollInterval);

            }); // requirejs
        }
);
