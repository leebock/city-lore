(function () {

	"use strict";

	//var WIDTH_THRESHOLD = 768;

	var GLOBAL_CLASS_USETOUCH = "touch";

	var LOCATIONS_SPREADSHEET_URL =  "data/locations.csv";
	var VIDEOS_SPREADSHEET_URL = "data/videos.csv";

	var _map;
	var _layerMarkers;
	var _table;

	var _locations;
	var _videos;	
	var _selected;

	$(document).ready(function() {

		new SocialButtonBar();
		
		_map = new L.CustomMap(
			"map", 
			{
				zoomControl: false, 
				attributionControl: false, 
				maxZoom: 12, minZoom: 2, 
				worldCopyJump: true
			},
			getExtentPadding
		)
			.addLayer(L.esri.basemapLayer("NationalGeographic"))
			.addControl(L.control.attribution({position: 'bottomleft'}))
			.on("click", onMapClick)
			.on("moveend", onExtentChange);

		_layerMarkers = L.featureGroup()
			.addTo(_map)
			.on("click", onMarkerClick);
			
		if (!L.Browser.mobile) {
			_map.addControl(L.control.zoom({position: "topright"}));
		}

		if (!L.Browser.mobile) {
			L.easyButton({
				states:[
					{
						icon: "fa fa-home",
						onClick: function(btn, map) {
							_map.fitBounds(_layerMarkers.getBounds().pad(0.5));
						},
						title: "Full extent"
					}
				],
				position: "topright"
			}).addTo(_map);			
		}

		Papa.parse(
			LOCATIONS_SPREADSHEET_URL, 
			{
				header: true,
				download: true,
				complete: function(data) {
					_locations = $.grep(
						data.data, 
						function(value){return value.X && value.Y;}
					);
					_locations = $.map(
						_locations, 
						function(value, index){return new Location(value);}
					);
					finish();
				}
			}
		);
		
		Papa.parse(
			VIDEOS_SPREADSHEET_URL,
			{
				header: true,
				download: true,
				complete: function(data) {
					_videos = $.grep(
						data.data, 
						function(value){return value.X && value.Y;}
					);
					_videos = $.map(
						_videos, 
						function(value, index){return new Video(value);}
					);
					finish();
				}
			}
		);

		function finish()
		{

			if (!_locations || !_videos) {
				return;
			}

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

			_map.fitBounds(_layerMarkers.getBounds().pad(0.1));
						
			_table = $(new Table($("ul#table").eq(0)))
				.on("itemSelect", onTableItemSelect)
				.get(0)
				.load(_videos);
			

			// one time check to see if touch is being used

			$(document).one(
				"touchstart", 
				function(){$("html body").addClass(GLOBAL_CLASS_USETOUCH);}
			);

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
	
	function onTableItemSelect(e, videoID)
	{
		var vid = $.grep(
			_videos, 
			function(value, index){return value.getID() === videoID;}
		).shift();
		_map.panTo(vid.getLatLng());
		L.popup({closeButton: false, offset: L.point(0, -25)})
          .setLatLng(vid.getLatLng())
          .setContent(vid.getTitle())
          .openOn(_map);
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

	function getExtentPadding()
	{
		return {
			paddingTopLeft: [$("#container").offset().left+$("#container").outerWidth(),0],
			paddingBottomRight: [0,0]
		};
	}

})();