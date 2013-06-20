// =============================================================================
// Telefonica I+D
// -----------------------------------------------------------------------------
// Notes:
//  * Change assetsURL if necessary to be able to access device data
//  * When moved to kermit,
// =============================================================================

requirejs.config({
    baseUrl: '../../'
});

define(
        [
            'components/dashboard/dashboard',
            'components/minimap',
            'components/dashboard/overview_subpanel',
            'components/dashboard/overview_subpanel_list',
            'components/paged_container',
            'components/detail_panel',
            'components/map',
            'components/mapViewer',
            'components/widget_temperature',
            'components/widget_pitch',
            'components/widget_lights',
            'components/widget_battery'
        ],
        function() {

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
                var centerOnLoad = false;
                var centerOnClick = false;

                /* Testing URL */
                var assetsURL;
                var assetsDetailedURL;
                if (!useKermit) {
                    assetsURL = '/m2m/v2/services/TrafficLightsDE/assets';
                    assetsDetailedURL = assetsURL + '?detailed=1';
                }
                else {
                    var service = Kermit.$injector.get('$user').credential.serviceName;
                    assetsURL = '/secure/m2m/v2/services/' + service + '/assets';
                    assetsDetailedURL = assetsURL + '?detailed=1';
                }

                /* Gallus, germany */
                // var initialCenter = {lat: 50.103749, lon: 8.641774};

                // =============================================================
                // Functions
                // =============================================================

                var initialCenter = {lat: 50.456729, lon: 7.485};

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

                    $('.mapbox').trigger('add-feature', marker);
                    $('.mapbox-mini').trigger('updateMinimap', marker);
                };

                //@TODO exportar a m2m-dashboard
                var getErrors = function(sensorData){
                    var errors = [];
                    $.each(sensorData, function(index, value) {
                        if ('ms' in value) {
                            // Evaluate error conditions
                            if (value.ms.p === 'voltage' && window.parseInt(value.ms.v) < 10) {
                                errors.push('Voltage < 10V');
                            }
                            else if (value.ms.p === 'pitch') {
                                var pitch = parseInt(value.ms.v);
                                if (pitch < 80 || pitch > 100) {
                                    errors.push('Inclination change +10');
                                }
                            }
                            else if (value.ms.p === 'greenLight' && value.ms.v === 'error') {
                                errors.push('Green light error');
                            }
                            else if (value.ms.p === 'yellowLight' && value.ms.v === 'error') {
                                errors.push('Yellow light error');
                            }
                            else if (value.ms.p === 'redLight' && value.ms.v === 'error') {
                                errors.push('Red light error');
                            }
                        }
                        var a = null;
                    });
                    return errors;
                };

                //@TODO exportar a m2m-dashboard
                var generateErrorText = function(sensorData) {
                    var errors = getErrors(sensorData).join(' <br/> ');
                    return errors;
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
                        var lat = v.asset.location.latitude;
                        var lon = v.asset.location.longitude;
                        var errors = generateErrorText(v.sensorData);
                        updateWarningList(v.asset.name, errors);
                        var markerColor = (errors === '') ? markerColorOk : markerColorWarn;
                        createNewMarker(v.asset.name, lat, lon, markerColor);
                    });
                    if (centerOnLoad) updateCenter();
                };

                var updateAssets = function () {
                    requestApiData(assetsDetailedURL, updateAssetsFn);
                };

                //@TODO export to m2m-dashboard
                var updateAssetInfoFn = function (response) {
                    var assetName = response.data.asset.name;
                    var erromsg;

                    // Update selected element name
                    $('.panel-detail .detail-element-header .text').html(assetName);
                    if(response.data.errors.length){
                        erromsg = generateErrorText(response.data.sensorData);
                        $('.panel-detail .detail-errors').html(erromsg);
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

                };

                var updateAssetInfo = function (assetName) {
                    var url = assetsURL + '/' + assetName;
                    requestApiData(url, updateAssetInfoFn);
                };

                //@TODO mover al m2m-dashboard
                var showDetails = function(event, data) {
                    var item = data.item;
                    $('.panel-detail').show();
                    $('.panel-list').hide();
                    $('.panel-detail').trigger('update-view');
                    updateAssetInfo(item.asset.name);
                };

                var hideDetails = function() {
                    $('.panel-list').show();
                    $('.panel-detail').hide();
                };

                var updateCenter = function () {
                    var url = assetsURL + '?detailed=1';
                    var fn = function (response) {
                        if (response.count != 0) {
                            var lat = response.data[0].asset.location.latitude;
                            var lon = response.data[0].asset.location.longitude;
                            $('.mapbox').trigger('center-map', [lat,lon]);
                        }
                        else {
                            console.log('No data found!');
                        }
                    };

                    requestApiData(url,fn);

                    updateOffscreenIndicators();
                };

                var createTooltip = function (feature, isSelected) {
                    if (typeof feature.properties.submarkers !== 'undefined') {
                        if (feature.properties.submarkers.length === 0) {
                            return '<h2>' + feature.properties.title + '</h2>';
                        }
                        else {
                            var submarkers = feature.properties.submarkers;
                            // cool things go here
                            if (!isSelected) {
                                var warns = 0;
                                $.each(submarkers, function (k,v) {
                                    if (v.properties['marker-color'] === markerColorWarn) warns += 1;
                                });
                                var ok = $('<h2>')
                                    .addClass('tooltip-unselected')
                                    .addClass('tooltip-unselected-ok')
                                    .html(submarkers.length - warns);
                                var errors = $('<h2>')
                                    .addClass('tooltip-unselected')
                                    .addClass('tooltip-unselected-errors')
                                    .html(warns);

                                var content = $('<div>').append(errors).append(ok);
                                return content.html();
                            }
                            else {
                                var html = '<h2>';
                                $.each(submarkers, function (k,v) {
                                    var selClass;
                                    if (v.properties['marker-color'] === markerColorWarn) {
                                        selClass += ' tooltip-selected-error';
                                    }
                                    else {
                                        selClass += ' tooltip-selected-ok';
                                    }
                                    var elem = $('<h3>')
                                            .addClass('tooltip-selector')
                                            .addClass(selClass)
                                            .html(v.properties.title);
                                    html = $(html).append(elem);
                                });
                                return '<h2>'+html.html()+'</h2>';
                            }
                        }
                    }
                    else return '<h2>' + feature.properties.title + "</h2>";
                };

                var markerClicked = function (f, previous, dom) {
                    // Change marker size
                    if (f !== previous) {
                        $('.mapbox-mini').trigger('itemselected',f);
                        f.properties['marker-size'] = 'large';
                        if (previous !== null) {
                            previous.properties['marker-size'] = 'medium';
                        }
                    }
                };

                var updateWarningPanelTrigger = function() {
                    $('.overview-subpanel .text').on('click', function() {
                        var data = {
                            properties: {
                                title: $(this).html(),
                                caption: $(this.parentNode.childNodes[1]).html()
                            }
                        };
                        var fn = function (sel, prev) {
                            if (sel !== prev) {
                                $('.mapbox-mini').trigger('asset-selected',sel);
                                sel.properties['marker-size'] = 'large';
                                if (prev !== null) {
                                    prev.properties['marker-size'] = 'medium';
                                }
                            }
                        };
                        $('.mapbox').trigger('select-feature', [$(this).html(), fn]);
                        $('.dashboard').trigger('asset-selected', data);
                    });
                };

                // =============================================================
                // Prepare dashboard
                // =============================================================

                //<editor-fold defaultstate="collapsed" desc="Component list">
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
                        items: [
                            {
                                component: 'minimap',
                                mapId: 'keithtid.map-z1eeg2ge',
                                zoomValue: 16,
                                movable: true,
                                listenTo: 'asset-selected'
                            }
                        ]
                    }
                ];
                //</editor-fold>

                // For kermit install.js
                //dashboard.m2mdashboard({
                $('.dashboard').m2mdashboard({
                    mainContent: [
                        {
                            component: 'mapViewer',
                            map: {
                                id: 'keithtid.map-w594ylml',
                                center: initialCenter,
                                maxZoom: 20,
                                minZoom: 5,
                                initialZoom: 13,
                                zoomButtons: true,
                                showTooltip: true,
                                groupMarkers: true
                            },
                            markerClicked: {
                                center: centerOnClick,
                                onClickFn: markerClicked
                            },
                            customTooltip: createTooltip,
                            createOffscreenIndicators: true,
                            whenZoomed: function (f) {
                                $('.mapbox').trigger('set-features', f);
                                updateOffscreenIndicators();
                            },
                            whenPanned: function (f) {
                                updateOffscreenIndicators();
                            },
                            model: function(features) {
                                /* return {
                                    'format':'asset',
                                    'features':features
                                };
                                */
                                var markerColorWarn = '#CB3337';
                                var markerColorOk = '#5E91A0';
                                return $.map(features, function(f) {
                                    var markerColor = (f.errors.length) ? markerColorOk : markerColorWarn;
                                    var location = f.asset && f.asset.location;
                                    var marker;
                                    if (location) {
                                        marker = {
                                            geometry: {
                                                coordinates: [location.longitude, location.latitude]
                                            },
                                            properties: {
                                                'marker-color': markerColor,
                                                'marker-symbol': 'circle',
                                                'title': f.asset.name
                                            }
                                        };
                                    };
                                    return marker;
                                });

                            },
//                            featuresPreprocessor: processFeatures,
                            features: []
                        }
                    ],
                    overviewPanel: {
                        title: 'Lights with warnings',
                        count: 10,//@TODO esto no funciona porque hay que overviewPanel no lo lee
                        items: [{
                                component: 'OverviewSubpanelList',
                                iconClass: 'marker-red',
                                className: 'panel-list',
                                ID: 'panel-list',
                                text: function(data) {
                                    var value = '';
                                    if(data && data.asset){
                                        value = data.asset.name;
                                    }
                                    return value;
                                },
                                caption: function(data) {
                                    var value = '';
                                    if(data && data.sensorData){
                                        value = generateErrorText(data.sensorData);
                                    }
                                    return value;
                                },
                                filter : function(item){
                                    return (item.errors.length>0);
                                }
                            },
                            {
                                component: 'pagedContainer',
                                className: 'panel-detail',
                                extraHeaderGap: 50,
                                alwaysVisible: [0, 1],
                                items: compList
                            }]
                        },
                        data: function(cb) {
                            requestApiData('data/assets.json', function(assets){
                                $.each(assets.data, function(i, item){
                                    item.errors = getErrors(item.sensorData);
                                });
                                cb(assets.data);
                                if (centerOnLoad) updateCenter();
                            });
                        },
                        itemData: function(item, cb) {
                            var results = [];
                            var paintLights = function(response) {
                                results.push(response);
                                if(results.length === 3){
                                    $('.lights-widget').trigger('paintLights', [results[0], results[1], results[2]]);
                                }
                            };

                            requestApiData('data/AssetSemaphore.json', function(data){
                                data.data.errors = getErrors(data.data.sensorData);
                                $('.panel-detail').show();
                                $('.panel-list').hide();
                                $('.panel-detail').trigger('update-view');
                                updateAssetInfoFn(data);
                            });
                            requestApiData('data/redLight.json', paintLights);
                            requestApiData('data/greenLight.json', paintLights);
                            requestApiData('data/yellowLight.json', paintLights);

                        }
                    }
                );

                // =============================================================
                // Complete DOM
                // =============================================================

                // Add error panel to details
                var template_error_details = '<div class="detail-errors"></div>';
                $('.detail-element-header').after(template_error_details);

                // =============================================================
                // Set up
                // =============================================================

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

                // =============================================================
                // Trigger listeners
                // =============================================================

                $('.fit-minimap').parent().siblings('.detail-panel-header').click(
                    function () {
                        $('.mapbox-mini').trigger('center');
                    }
                );

                //$('.dashboard').on('itemselected', showDetails);

                $('.overview-header').on('click', hideDetails);

                // Event when a tooltip element is clicked
                /*
                $(document).on('click', '.tooltip-selector', function() {
                    var sel = { properties: {
                            title: $(this).html()
                        }
                    };
                    showDetails(null, sel);
                });
                */

                // Load initial data
                //updateAssets();

                /* Uncomment this line for device data polling */
                // window.setInterval(function () { updateAssets(); }, pollInterval);

            }); // requirejs
        }
);
