L.CLMap = L.CustomMap.extend({

  initialize: function(div, options, paddingQueryFunction)
  {

    L.CustomMap.prototype.initialize.call(this, div, options, paddingQueryFunction);
    
    /*
    this._ICONS = {
      "Fruit/Vegetable": L.AwesomeMarkers.icon({markerColor: 'green'}),
      "Dairy": L.AwesomeMarkers.icon({markerColor: 'orange'}),
      "Other": L.AwesomeMarkers.icon({markerColor: 'darkred'})
    };
    */

    this._layerMarkers = L.featureGroup()
      .addTo(this)
      .on("click", onMarkerClick);

    var self = this;

    function onMarkerClick(e)
    {

        var record = e.layer.key;
        self.fire("markerSelect", record);
        $(".leaflet-tooltip").remove();

        L.popup({closeButton: false, offset: L.point(0, -25)})
            .setLatLng(record.getLatLng())
            .setContent(record.getName())
            .openOn(self);

        self.panTo(record.getLatLng());
                    
    }
    
  },

    /*************************************************/
    /******************* METHODS *********************/
    /*************************************************/

    loadData: function(records)
    {
        this.closePopup();
        this._records = records;
        this._loadMarkers(this._records);
        this.zoomToMarkers();
    },

    zoomToMarkers: function()
    {
        this.fitBounds(this._layerMarkers.getBounds().pad(0.1));    
    },
    
    selectMarker: function(record)
    {
        L.popup({closeButton: false, offset: L.point(0, -25)})
            .setLatLng(record.getLatLng())
            .setContent(record.getName())
            .openOn(this);      
        this.panTo(record.getLatLng());
    },

    /*************************************************/
    /************* "PRIVATE" FUNCTIONS ***************/
    /*************************************************/

  _loadMarkers: function(records)
  {

    this._layerMarkers.clearLayers();
    var self = this;
    $.each(
      records, 
      function(index, record) {

        L.marker(
          record.getLatLng(), 
          {
            /*icon: self._ICONS[record.getCategory()],*/
            riseOnHover: true
          }
        )
          .bindTooltip(record.getName())
          .addTo(self._layerMarkers)
          .key = record;
      }
    );

  }

});