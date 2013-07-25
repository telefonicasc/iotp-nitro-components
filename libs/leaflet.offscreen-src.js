(function(L){
    L.Control.Offscreen = L.Control.extend({
        options:{
            markers : []
        },
        _bound:{},
        onAdd: function (map) {
            var $mapContainer = map.getContainer();
            var dumyContainer = L.DomUtil.create('div', 'offscreen-indicator');
            var keyMarkers = ['e', 'w', 'n', 'ne', 'nw', 's', 'se', 'sw'];
            var key;
            while(key = keyMarkers.shift()){
                this['$'+key] = L.DomUtil.create('div', 'offscreen-indicator offscreen-'+key, $mapContainer);
                this['$'+key].setAttribute('keyBound', key);
                L.DomEvent.addListener(this['$'+key], 'click', this._show, this);

            }
            map.on('zoomend drag resize', function(){
                this.update();
            }, this);

            return dumyContainer;
        },
        update: function(markers){
            this.options.markers = markers || this.options.markers;
            var values = this._getValues(this.options.markers);
            this._bind(values);
        },
        _show : function(domEvent){
            var key = domEvent.toElement.getAttribute('keyBound');
            var bound = this._bound[key];
            if(bound && bound.isValid()){
                this._map.fitBounds(bound);
            }
            this.update();
            domEvent.preventDefault();
        },
        _getValues: function(markers){
            var values = {
                'e':[],
                'w':[],
                'n':[],
                'ne':[],
                'nw':[],
                's':[],
                'se':[],
                'sw':[]
            };
            var mapBounds = this._map.getBounds();
            var keyValue = '';
            var n = markers.length;
            var marker;

            while(n--){
                marker = markers[n];
                if(marker._latlng.lat > mapBounds.getNorth()){ keyValue +='n'; }//sale por el norte
                else if(marker._latlng.lat < mapBounds.getSouth()){ keyValue +='s'; }//sale por el sur

                if(marker._latlng.lng < mapBounds.getWest()){ keyValue +='w'; }//sale por el oeste
                else if(marker._latlng.lng > mapBounds.getEast()){ keyValue +='e'; }//sale por el este

                if(keyValue){
                    values[keyValue].push(marker._latlng);
                    keyValue='';
                }
            }
            return values;
        },
        _bind : function(values){
            var n, key;
            for(key in values){
                n = values[key].length;
                this._bound[key] = this._toBounds(values[key]);
                this['$'+key].innerHTML = n;
                this['$'+key].style.display = n ? 'block':'none';

            }
        },
        _toBounds : function(arr){
            var bounds = new L.LatLngBounds();
            var n = arr.length;
            while(n--){
                bounds.extend( arr[n] );
            }
            return bounds;
        }

    });
})(L);