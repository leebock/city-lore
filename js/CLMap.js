L.CLMap = L.PaddingAwareMap.extend({

  initialize: function(div, options, paddingQueryFunction, popupHTMLCreator)
  {

    L.PaddingAwareMap.prototype.initialize.call(this, div, options, paddingQueryFunction);
    
    this._popupHTMLCreator = popupHTMLCreator;

    this._layerMarkers = L.featureGroup()
      .addTo(this)
      .on("click", onMarkerClick);

    var self = this;

    function onMarkerClick(e)
    {

        var record = e.layer.key;
        self.fire("markerActivate", record);
        $(".leaflet-tooltip").remove();
        self.activateMarker(record);                    
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
    },

    zoomToMarkers: function()
    {
        this.fitBounds(this._layerMarkers.getBounds().pad(0.1));    
    },
    
    activateMarker: function(record)
    {
        L.popup({closeButton: false, offset: L.point(0, -25)})
            .setLatLng(record.getLatLng())
            .setContent(this._popupHTMLCreator(record))
            .openOn(this);      
        this.flyToBounds(record.getLatLng().toBounds(5000));
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

        var options = {riseOnHover: true};
        if (record.getVideos().length > 1) {
            options.icon = L.AwesomeMarkers.icon(
                {icon: 'star', markerColor: 'darkpurple', prefix: "fa"}
            );
            options.zIndexOffset = 1000;            
        } else {
            options.icon = L.AwesomeMarkers.icon({markerColor: 'purple'});
        }

        L.marker(record.getLatLng(), options)
          .bindTooltip(self._popupHTMLCreator(record), {className: "tooltip-map"})
          .addTo(self._layerMarkers)
          .key = record;
      }
    );

  }

});
