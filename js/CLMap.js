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

    loadData: function(records, selectionMachine)
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
      
    var ICONS = {
        "Urban Folklore": L.AwesomeMarkers.icon({markerColor: 'cadetblue'}),
        "Treasured Places": L.AwesomeMarkers.icon({markerColor: 'orange'}),
        "Grassroots Poetry": L.AwesomeMarkers.icon({markerColor: 'red'}),
        "Education": L.AwesomeMarkers.icon({markerColor: 'yellow'}),
        "Neighborhood Tours": L.AwesomeMarkers.icon({markerColor: 'purple'})
    };

    this._layerMarkers.clearLayers();
    var self = this;
    $.each(
      records, 
      function(index, record) {

        var options = {riseOnHover: true};
        if (record.getVideos().length > 1) {
            options.icon = L.divIcon({
                className: "div-icon", 
                html: record.getVideos().length,
                iconSize: [25,30],
                iconAnchor: [12,35]
            });
            options.zIndexOffset = 1000;            
        } else {
            var video = record.getVideos().shift();
            options.icon = ICONS[video.getCategories().shift()];
        }

        L.marker(record.getLatLng(), options)
          .bindTooltip(self._popupHTMLCreator(record), {className: "tooltip-map"})
          .addTo(self._layerMarkers)
          .key = record;
      }
    );

  }

});
