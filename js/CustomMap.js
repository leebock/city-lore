L.CustomMap = L.Map.extend({

  initialize: function(div, options, /*providers, ingredients, */paddingQueryFunction)
  {

    L.Map.prototype.initialize.call(this, div, options);
    
    /*
    this._ICONS = {
      "Fruit/Vegetable": L.AwesomeMarkers.icon({markerColor: 'green'}),
      "Dairy": L.AwesomeMarkers.icon({markerColor: 'orange'}),
      "Other": L.AwesomeMarkers.icon({markerColor: 'darkred'})
    };

    this._layerLines = L.featureGroup().addTo(this);

    this._layerMarkers = L.featureGroup()
      .addTo(this)
      .on("click", onMarkerClick);
    */
      
    this._paddingQueryFunction = paddingQueryFunction;
    
    /*
    this.loadData(providers, ingredients);
    this.zoomToMarkers();

    var self = this;

    function onMarkerClick(e)
    {

        var provider = $.grep(
          self._providers, 
          function(value){return value.getID() === e.layer.key;}
        ).shift();

        self.fire("providerSelect", provider);

      $(".leaflet-tooltip").remove();

      var ingredients = self._ingredients;

      L.popup({closeButton: false, offset: L.point(0, -25)})
        .setLatLng(provider.getLatLng())
        .setContent(self._createContentHTML(provider, ingredients))
        .openOn(self);
        
        self.panTo(provider.getLatLng());
                    
    }
    */
    
  },

    /*************************************************/
    /******************* METHODS *********************/
    /*************************************************/

    fitBounds: function(bnds)
    {
        L.Map.prototype.fitBounds.call(
            this, 
            bnds, 
            this._paddingQueryFunction()
        );
    },

    flyToBounds: function(bnds)
    {
        L.Map.prototype.flyToBounds.call(
            this, 
            bnds,
            this._paddingQueryFunction()
        );
    },

    panTo: function(latLng)
    {
        // override panTo to accomodate padding
        var paddingOptions = this._paddingQueryFunction();
        latLng = this.containerPointToLatLng(
            this.latLngToContainerPoint(latLng)
                .add([
                    paddingOptions.paddingBottomRight[0]/2, 
                    paddingOptions.paddingBottomRight[1]/2
                ])
                .subtract([
                    paddingOptions.paddingTopLeft[0]/2, 
                    paddingOptions.paddingTopLeft[1]/2
                ])
        );

        L.Map.prototype.panTo.call(this, latLng, {animate: true, duration: 1});

    },

  
    zoomIn: function(zoomDelta, options)
    {
        this.setView(
            this._calcNewCenter(
                this.getCenter(), 
                this.getZoom()+zoomDelta, 
                this._paddingQueryFunction()
            ),
            this.getZoom()+zoomDelta,
            options
        );
    }, 

    zoomOut: function(zoomDelta, options)
    {
        this.setView(
            this._calcNewCenter(
                this.getCenter(), 
                this.getZoom()-zoomDelta, 
                this._paddingQueryFunction()
            ),
            this.getZoom()-zoomDelta,
            options
        );
    },

  
  /*

  zoomIn: function(zoomDelta, options)
  {
      this._zoomHandler(this.getZoom()+zoomDelta);
  }, 

  zoomOut: function(zoomDelta, options)
  {
    this._zoomHandler(this.getZoom()-zoomDelta);
  },

  loadData: function(providers, ingredients)
  {
    this.closePopup();
    this._providers = providers;
    this._ingredients = ingredients;
    this._loadMarkers(this._providers);
    this._loadLines(this._providers);
    this.zoomToMarkers();
  },

  setPaddingBottomRight: function(paddingBottomRight)
  {
      this._paddingBottomRight = paddingBottomRight;
  },

  zoomToMarkers: function()
  {
    this.fitBounds(
      this._layerMarkers.getBounds().pad(0.1),
      this._paddingBottomRight ? {paddingBottomRight: this._paddingBottomRight} : null
    );    
  },
  
  selectProvider: function(provider)
  {
      var ingredients = this._ingredients;
      L.popup({closeButton: false, offset: L.point(0, -25)})
      .setLatLng(provider.getLatLng())
      .setContent(this._createContentHTML(provider, ingredients))
      .openOn(this);      
      this.panTo(provider.getLatLng());
  },
  */

    /*************************************************/
    /************* "PRIVATE" FUNCTIONS ***************/
    /*************************************************/
  
    _calcNewCenter: function(center, targetZoom, paddingOptions)
    {
        console.log("pass auf", targetZoom, this.getZoom());
        console.log(paddingOptions);
        var targetPoint = this.project(center, targetZoom);
        if (targetZoom < this.getZoom()) {
            targetPoint = targetPoint.subtract([
                (paddingOptions.paddingTopLeft[0] - paddingOptions.paddingBottomRight[0])/4,
                (paddingOptions.paddingTopLeft[1] - paddingOptions.paddingBottomRight[1])/4
            ]);
        } else {                
            targetPoint = targetPoint.add([
                (paddingOptions.paddingTopLeft[0] - paddingOptions.paddingBottomRight[0])/2,
                (paddingOptions.paddingTopLeft[1] - paddingOptions.paddingBottomRight[1])/2
            ]);
        }
        return this.unproject(targetPoint, targetZoom);
    },


  /*
  _zoomHandler: function(targetZoom)
  {
      var targetPoint = this.project(this.getCenter(), targetZoom);
      var offset;
      if (targetZoom < this.getZoom()) {
          offset = [this._paddingBottomRight[0]/4, this._paddingBottomRight[1]/4];
          targetPoint = targetPoint.add(offset);			
      } else {
          offset = [this._paddingBottomRight[0]/2, this._paddingBottomRight[1]/2];
          targetPoint = targetPoint.subtract(offset);
      }
      var targetLatLng = this.unproject(targetPoint, targetZoom);
      this.setView(targetLatLng, targetZoom);      
  },

  _createContentHTML: function(provider, ingredients)
  {  
      return $("<div>")
      .append($("<span>").html("<b>"+provider.getName()+"</b>"))
      .append($("<br>"))
      .append($("<span>").html(provider.getCity()+", "+provider.getState()))
      .append($("<br>"))
      .append(
          $("<span>").html(
              $.map(
                $.grep(
                  ingredients, 
                  function(ingredient) {
                    return $.inArray(provider.getName(), ingredient.getProviders()) > -1;
                  }
                ),
                function(value){return value.getName();}
            ).join(",")
          )
      )
      .html();      
  },

  _loadMarkers: function(providers)
  {

    this._layerMarkers.clearLayers();
    var self = this;
    $.each(
      providers, 
      function(index, record) {

        L.marker(
          record.getLatLng(), 
          {
            icon: self._ICONS[record.getCategory()],
            riseOnHover: true
          }
        )
          .bindTooltip(record.getName()+", "+record.getCity()+", "+record.getState())
          .addTo(self._layerMarkers)
          .key = record.getID();

      }
    );

  },

  _loadLines: function(providers)
  {
    var self = this;
    self._layerLines.clearLayers();
    $.each(
      providers, 
      function(index, record) {
        L.polyline(
            [record.getLatLng(), [38.896319, -77.071094]], 
            {color: "gray", weight: 1}
        ).addTo(self._layerLines);
      }
    );
  }
  */

});
