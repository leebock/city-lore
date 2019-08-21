(function () {

	"use strict";

	//var WIDTH_THRESHOLD = 768;

	var GLOBAL_CLASS_USETOUCH = "touch";

	var LOCATIONS_SPREADSHEET_URL =  "data/locations.csv";

	var _map;
	var _layerMarkers;

	var _locations;	
	var _selected;

	$(document).ready(function() {

		new SocialButtonBar();
		
		_map = new L.Map(
			"map", 
			{zoomControl: !L.Browser.mobile, attributionControl: false, maxZoom: 12, minZoom: 2, worldCopyJump: true}
		)
			.addLayer(L.esri.basemapLayer("NationalGeographic"))
			.addControl(L.control.attribution({position: 'bottomleft'}))
			.on("click", onMapClick)
			.on("moveend", onExtentChange);

		_layerMarkers = L.featureGroup()
			.addTo(_map)
			.on("click", onMarkerClick);

		if (!L.Browser.mobile) {
			L.easyButton({
				states:[
					{
						icon: "fa fa-home",
						onClick: function(btn, map){_map.fitBounds(_layerMarkers.getBounds().pad(0.5));},
						title: "Full extent"
					}
				]
			}).addTo(_map);			
		}

		Papa.parse(
			LOCATIONS_SPREADSHEET_URL, 
			{
				header: true,
				download: true,
				complete: function(data) {
					_locations = $.grep(data.data, function(value){return value.X && value.Y;});
					_locations = $.map(
						_locations, 
						function(value, index){return new Location(value);}
					);
					finish();
				}
			}
		);

		function finish()
		{

			$.each(
				_locations, 
				function(index, location) {

					L.marker(
						location.getLatLng(), 
						{
							riseOnHover: true
						}
					)
						.bindPopup(location.getName(), {closeButton: false})
						.bindTooltip(location.getName())
						.addTo(_layerMarkers)
						.key = location.getName();

				}
			);

			_map.fitBounds(_layerMarkers.getBounds().pad(0.5));

			// one time check to see if touch is being used

			$(document).one("touchstart", function(){$("html body").addClass(GLOBAL_CLASS_USETOUCH);});

		}

	});

	/***************************************************************************
	********************** EVENTS that affect selection ************************
	***************************************************************************/

	function onMapClick(e)
	{
		_selected = null;
	}

	function onMarkerClick(e)
	{
		$(".leaflet-tooltip").remove();
		_selected = $.grep(
			_locations, 
			function(value){return value.getName() === e.layer.key;}
		).shift();
	}

	/***************************************************************************
	**************************** EVENTS (other) ********************************
	***************************************************************************/

	function onExtentChange()
	{
	}

	/***************************************************************************
	******************************** FUNCTIONS *********************************
	***************************************************************************/

})();