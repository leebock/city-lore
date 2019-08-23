(function () {

	"use strict";

	//var WIDTH_THRESHOLD = 768;

	var GLOBAL_CLASS_USETOUCH = "touch";

	var LOCATIONS_SPREADSHEET_URL =  "data/locations.csv";
	var VIDEOS_SPREADSHEET_URL = "data/videos.csv";

	var _map;
	var _table;

	var _locations;
	var _videos;	

	$(document).ready(function() {

		new SocialButtonBar();
		
		_map = new L.CLMap(
			"map", 
			{
				zoomControl: false, 
				attributionControl: false, 
				maxZoom: 16, minZoom: 8, 
				worldCopyJump: true
			},
			getExtentPadding,
			createPopupHTML
		)
			.addLayer(L.esri.basemapLayer("NationalGeographic"))
			.addControl(L.control.attribution({position: 'bottomleft'}))
			.on("click", map_onClick)
			.on("markerSelect", map_onMarkerSelect);
			
		if (!L.Browser.mobile) {
			_map.addControl(L.control.zoom({position: "topright"}));
		}

		if (!L.Browser.mobile) {
			L.easyButton({
				states:[
					{
						icon: "fa fa-home",
						onClick: function(btn, map) {_map.zoomToMarkers();},
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

			_map.loadData(_locations);
				
			_table = $(new Table($("ul#table").eq(0)))
				.on("itemActivate", table_onItemActivate)
				.get(0);
				
			_table.load(_videos);
			

			// one time check to see if touch is being used

			$(document).one(
				"touchstart", 
				function(){$("html body").addClass(GLOBAL_CLASS_USETOUCH);}
			);

		}

	});

	/***************************************************************************
	********************************** EVENTS  *********************************
	***************************************************************************/

	function map_onClick()
	{
		_table.clearFilter();
		_table.clearActive();
	}

	function map_onMarkerSelect(location)
	{
		_table.clearActive();
		_table.clearFilter();
		var videos = SelectionMachine.selectVideosForLocation(_videos, location);
		if (videos.length > 1) {
			_table.filter(videos);
		} else {
			_table.activateItem(videos.shift());
		}
	}

	function table_onItemActivate(e, videoID)
	{
		_map.selectMarker(
			SelectionMachine.selectLocationForVideo(
				_locations, SelectionMachine.selectVideoByID(_videos, videoID)
			)
		);
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

	function createPopupHTML(location)
	{  
		return $("<div>")
			.append($("<span>").html("<b>"+location.getName()+"</b>"))
			.append($("<br>"))
			.append($("<span>").html(location.getAddress()))
			.html();      
	}

})();