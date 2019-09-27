L.CLMap = L.PaddingAwareMap.extend({

  initialize: function(
      div, 
      options, 
      paddingQueryFunction, 
      popupHTMLCreator, 
      tooltipHTMLCreator
  )
  {

    L.PaddingAwareMap.prototype.initialize.call(this, div, options, paddingQueryFunction);
    
    this._popupHTMLCreator = popupHTMLCreator;
    this._tooltipHTMLCreator = tooltipHTMLCreator;

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
        if (this._layerMarkers.getLayers().length) {
            this.fitBounds(this._layerMarkers.getBounds().pad(0.1));    
        }
    },
    
    activateMarker: function(record)
    {
        L.popup({autoPan: false, closeButton: false, offset: L.point(30, -35)})
            .setLatLng(record.getLatLng())
            .setContent(this._popupHTMLCreator(record))
            .openOn(this);

        var self = this;

        $(".leaflet-popup-content button").click(function(){self.fire("videoPlay");});
            
        var bounds = record.getLatLng().toBounds(5000);
        if (!this.getUsableBounds().contains(record.getLatLng())) {
            this.flyToBounds(bounds);
        } else {
            if (this.getBoundsZoom(bounds) > this.getZoom())
            {
                this.flyToBounds(bounds);
            } else {
                this.panTo(record.getLatLng());
            }
        }
        var padding = this._paddingQueryFunction();
        //{paddingTopLeft: [left,top], paddingBottomRight: [right,bottom]};
        this.once(
            "moveend", 
            function()
            {
                var mapSpaceHeight = $("#map").height() -
                    padding.paddingTopLeft[1] -
                    padding.paddingBottomRight[1];
                var popupHeight = $("div.leaflet-popup").height();
                if (mapSpaceHeight / 2 < popupHeight) {
                    setTimeout(
                        function()
                        {
                            self.panTo(
                                self.layerPointToLatLng(
                                    self.latLngToLayerPoint(record.getLatLng()).subtract([0,100])
                                )
                            );
                        }, 
                        400
                    );
                }
            }
        );
                        
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
            options.icon = L.icon(
                {
                    iconUrl: "resources/Pushpin2.png",
                    iconSize: [42, 45],
                    iconAnchor: [-2, 45]
                }
            );
            options.zIndexOffset = 1000;            
        } else {
            options.icon = L.icon(
                {
                    iconUrl: "resources/Pushpin1.png",
                    iconSize: [42, 45],
                    iconAnchor: [-2, 45]
                }
            );
        }

        L.marker(record.getLatLng(), options)
          .bindTooltip(
              self._tooltipHTMLCreator(record), 
              {offset: [20, -20], className: "tooltip-map"}
          )
          .addTo(self._layerMarkers)
          .key = record;
      }
    );

  }

});
