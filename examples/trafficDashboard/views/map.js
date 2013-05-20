DV.Traffic = DV.Traffic || {};
DV.Traffic.Views = DV.Traffic.Views || {};


DV.Traffic.Views.Map = Backbone.Marionette.ItemView.extend({

  template: DV.Traffic.Templates.map,

  className: 'mapcontainer',

  ui: {
    map: '.mapbox',
    number: '.warning-number',
    tooltip: '.hover-tooltip',
    groupTooltip: '.group-tooltip'
  },

  events: {

  },

  initialize: function() {
    this.bindTo(DV.Traffic.Collections.trafficLights, "reset", this.displayLocations, this);
    this.bindTo(DV.Traffic.Collections.trafficLights, "change:selected", this.changeSelected, this);
  },

  changeSelected: function(model) {
    var marker = model.get('marker')
      , submarker, jsp, tooltipPos;

    if (marker) {
      if (model.get('selected')) {
        if (marker.data('subMarkers')) {
          this.ui.groupTooltip.show();
          jsp = $('.scroll-container', this.ui.groupTooltip).data('jsp');
          tooltipPos = jsp && jsp.getContentPositionY();
          this.showGroupTooltip(marker.data('subMarkers'), marker);
          if (tooltipPos) {
            $('.scroll-container', this.ui.groupTooltip).data('jsp').scrollTo(0, tooltipPos);
          }
        }
        marker.addClass(marker.data('markerStatus') + '-selected');
        marker.data('selected', true);
      } else {
        if (this.ui.groupTooltip.data('marker') === marker) {
          this.ui.groupTooltip.hide();
          this.ui.groupTooltip.data('marker', null);
        }
        marker.removeClass(marker.data('markerStatus') + '-selected');
        marker.data('selected', false);
      }
    }
    
    submarker = model.get('submarker');

    if (submarker) {
      if (model.get('selected')) {
        submarker.addClass(submarker.data('submarkerStatus') + '-selected');
      } else {
        submarker.removeClass(submarker.data('submarkerStatus') + '-selected');
      }
    }
  },

  onRender: function() {
    var self = this;
    this.map = mapbox.map(this.ui.map.get(0))
      .center(DV.Traffic.Models.mapModel.get("centre"))
      .setZoomRange(DV.Traffic.Models.mapModel.get("zoomMin"), 
          DV.Traffic.Models.mapModel.get("zoomMax"));

    this.markerLayer = mapbox.markers.layer();
    this.map.addLayer(mapbox.layer().id(DV.Config.map.mapboxID));    
    this.map.addLayer(this.markerLayer);
    this.map.zoom(DV.Traffic.Models.mapModel.get("zoomInitial"));
    this.map.ui.zoomer.add();

    this.markerLayer.factory(function(marker) {
      var markerEl = $('<div>').addClass('marker')
        , warningCount = 0
        , normalCount = 0
        , status;
     
      if (marker.isGroup) {
        markerEl.data('subMarkers', marker.subMarkers);
        $.each(marker.subMarkers, function(i, submarker) {
          if (submarker.model.get('status') === 'warning') {
            warningCount++;
          } else {
            normalCount++;
          }
          submarker.model.set('marker', markerEl);
        });

        status = warningCount > 0 ? 'warning-group' : 'normal-group';

        markerEl.html('<span>' + marker.subMarkers.length + '</span>');
        markerEl.mouseenter(function() {
          if (!$(this).data('selected')) {
            var position = $(this).position()
              , tooltipContent = $('.tooltip-content', self.ui.tooltip);
            tooltipContent.empty();
            if (warningCount > 0) {
              $('<span>')
                .addClass('warning-count')
                .html(warningCount)
                .appendTo(tooltipContent);
            }
            if (normalCount > 0) {              
              $('<span>')
                .addClass('normal-count')
                .html(normalCount)
                .appendTo(tooltipContent);
            }

            self.ui.tooltip.css({
              left: position.left - self.ui.tooltip.width() / 2 - 12,
              top: position.top
            });
            self.ui.tooltip.show(); 
          }
        });

        markerEl.click(function() {
          self.selectLight(marker.subMarkers[0].model);
          self.ui.tooltip.hide();
        });
      } else {
        status = marker.model.get('status');
        markerEl.click(function() {
          self.selectLight(marker.model);
        });
        markerEl.mouseenter(function() {
          var position = $(this).position();    
          $('.tooltip-content', self.ui.tooltip).html(marker.model.get('asset').name);
          self.ui.tooltip.css({
            left: position.left - self.ui.tooltip.width() / 2 - 12,
            top: position.top
          });
          self.ui.tooltip.show();
        });
        marker.model.set('marker', markerEl);
      }

      markerEl.css({ pointerEvents: 'all' });
      markerEl.data('markerStatus', status);
      markerEl.addClass(status);

      markerEl.mouseleave(function() {
        self.ui.tooltip.hide();
      });

      return markerEl[0];
    });

    this.map.addCallback('panned', function() {
      self.updateOffscreenIndicators();
      self.updateGroupTooltipPosition();
    });
    this.map.addCallback('zoomed', function() {
      self.updateOffscreenIndicators();
      self.displayLocations();
      self.ui.groupTooltip.hide();
      self.ui.groupTooltip.data('marker', null);
    });

    this.$el.mouseover(function(e) {
      var pos = $(this).offset()
        , height = $(this).height()
        , width = $(this).width()
        , x = e.pageX-pos.left
        , y = e.pageY-pos.top
        , over = null; 

      if (y < height*0.25) {
        if (x < width*0.25) {
          over = 'nw';
        } else if (x > width*0.75) {
          over = 'ne';
        } else {
          over = 'n';
        }
      } else if (y > height*0.75) {
        if (x < width*0.25) {
          over = 'sw';
        } else if (x > width*0.75) {
          over = 'se';
        } else {
          over = 's';
        }
      } 

      if (!over) {
        if (x < width*0.25) {
          over = 'w';
        } else if (x > width*0.75) {
          over = 'e';
        }
      }

      $('.offscreen-indicator', this).removeClass('offscreen-indicator-hover');
      if (over) {
        $('.' + over + 'markers', this).addClass('offscreen-indicator-hover');
      }
    });

    $('.offscreen-indicator', this.$el).click(function() {
      var closest = $(this).data('closest');
      if (closest) {
        self.centerMap(closest.lat, closest.lon);
        self.updateOffscreenIndicators();
      }
    });

    $(window).resize(function() {
      self.updateGroupTooltipPosition();
    });
  },

  showGroupTooltip: function(subMarkers, markerEl) {
    var self = this
      , position = markerEl.position()
      , tooltipContent = $('.tooltip-content', self.ui.groupTooltip)
      , assetList = $('<ul>');

    tooltipContent.empty();
    assetList.appendTo(tooltipContent);

    $.each(subMarkers, function(i, submarker) {
      var submarkerStatus = submarker.model.get('status') + '-submarker'
        , submarkerEl = $('<li>')
            .html(submarker.model.get('asset').name)
            .addClass(submarkerStatus)
            .data('submarkerStatus', submarkerStatus)
            .click(function() {
              self.selectLight(submarker.model);
            })
            .appendTo(assetList);

      submarker.model.set('submarker', submarkerEl);
    });
    
    self.ui.groupTooltip.css({
      left: position.left - self.ui.groupTooltip.width() / 2 - 12,
      top: position.top
    });
    self.ui.groupTooltip.show(); 
    self.ui.groupTooltip.data('marker', markerEl);
    assetList.wrap('<div class="scroll-container">'); 
    assetList.parent().jScrollPane();
  },

  updateOffscreenIndicators: function() {
    var self = this
      , collection = DV.Traffic.Collections.trafficLights
      , extent = this.map.getExtent()
      , center = this.map.getCenter()  
      , count = { nw: 0, n:0, ne:0, e:0, se: 0, s:0, sw: 0, w: 0}
      , closest = {};

    collection.each(function(model) {
      var lat = model.getLatitude()
        , lon = model.getLongitude()
        , x = lon-center.lon
        , y = lat-center.lat
        , dist
        , direction;

      if (lat > extent.north || lat < extent.south ||
        lon > extent.east || lon < extent.west) {
        direction = self.getPointDirection(x, y);
        count[direction]++;

        dist = x*x+y*y;
        if (!closest[direction] || dist < closest[direction].dist) {
          closest[direction] = { lat: lat, lon: lon, dist:dist };
        }
      }
    });

    $.each(count, function(key, val) {
      var el = $('.' + key + 'markers', this.$el);
      el.data('closest', closest[key]);
      if (val === 0) {
        el.hide();
      }else{
        el.html(val);
        el.show();
      }
    });
  },

  getPointDirection: function(x, y) {
    var absx = Math.abs(x)
      , absy = Math.abs(y)
      , diagProj = 0.7071*absx + 0.7071*absy;

    if (absx > diagProj) {
      return x > 0 ? 'e' : 'w';
    } else if (absy > diagProj) {
      return y > 0 ? 'n' : 's';
    } else {
      if (x > 0) {
        return y > 0 ? 'ne' : 'se';        
      }else{
        return y > 0 ? 'nw' : 'sw';
      }
    }
  },

  selectLight: function(model) {
    this.deselectAll();
    model.set('selected', true);
  },

  deselectAll: function() {
    DV.Traffic.Collections.trafficLights.each(function(m) {
      if (m.get('selected')) {
        m.set('selected', false);
      }
    });
  },

  updateGroupTooltipPosition: function() {
    var tooltip = this.ui.groupTooltip
      , marker, position;
  
    if (tooltip.data('marker')) {
      marker = tooltip.data('marker'); 
      position = marker.position();

      if (position.left < 0 || position.top < 0 ||
        position.left > this.$el.width() || position.top > this.$el.height()) {
        tooltip.hide();
      } else {
        tooltip.show();
      }

      tooltip.css({ 
        left: position.left - tooltip.width() / 2 - 12,
        top: position.top
      });
    }
  },

  centerMap: function(lat, lon) {
    var self = this;
    this.map.center({lat:lat, lon:lon});
    setTimeout(function() { 
      self.updateGroupTooltipPosition(); 
    }, 50);
  },

  getGroupCenter: function(markers) {
    var x = 0, y = 0;
    $.each(markers, function(i, marker) {
      x += marker.x;
      y += marker.y;
    });

    x = x / markers.length;
    y = y / markers.length;

    return { x: x, y: y };
  },

  displayLocations: function() {
    var self = this
      , markers = [];
    this.markerLayer.features([]);   //remove all markers

    DV.Traffic.Collections.trafficLights.each(function(light) {
      var lat = light.getLatitude()
        , lon = light.getLongitude()
        , point = self.map.locationPoint({ lat: lat, lon: lon })
        , x = point.x
        , y = point.y
        , group = null;

      // Check if it is close to another marker      
      $.each(markers, function(i, marker) {
        var diffX = marker.x - x
          , diffY = marker.y - y
          , groupCenter, groupLocation;
        if (!group && diffX*diffX + diffY*diffY < 300) {
          if (!marker.isGroup) {
            marker.subMarkers = [{ 
              lat: marker.lat, lon: marker.lon,
              x: marker.x, y: marker.y, model: marker.model
            }];
            marker.isGroup = true;
            delete marker.model;
          }

          marker.subMarkers.push({ lat: lat, lon: lon, model: light, x:x, y:y });
          groupCenter = self.getGroupCenter(marker.subMarkers); 
          marker.x = groupCenter.x;
          marker.y = groupCenter.y;
          groupLocation = self.map.pointLocation(groupCenter);
          marker.lat = groupLocation.lat;
          marker.lon = groupLocation.lon;

          group = marker;
        }
      });

      if (!group) {
        markers.push({
          lat: lat, lon: lon, model: light, x: x, y: y
        });
      }
    });

    $.each(markers, function(i, marker) {
      self.markerLayer.add_feature({
        "model": marker.model,
        "isGroup": marker.isGroup,
        "subMarkers": marker.subMarkers,
        "geometry": {
          "coordinates": [marker.lon, marker.lat]
        },
        properties: {
          'title': 'Semaphore',
          'description': 'Semaphore'
        }
      });
    });

    this.updateOffscreenIndicators();
  }
});

