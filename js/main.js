(function () {

	"use strict";

	var WIDTH_THRESHOLD = 768;

	var GLOBAL_CLASS_USETOUCH = "touch";

	var LOCATIONS_SPREADSHEET_URL =  "data/locations.csv";
	var VIDEOS_SPREADSHEET_URL = "data/videos.csv";

	var _map;
	var _table;
	var _playPanel;
	var _selectionMachine;

	$(document).ready(function() {


		var jsonVideos;		
		var jsonLocations;

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
			.addControl(L.control.attribution({position: 'bottomright'}))
			.on("click", map_onClick)
			.on("markerActivate", map_onMarkerActivate);
			
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
					jsonLocations = $.grep(
						data.data, 
						function(value){return value.X && value.Y;}
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
					jsonVideos = $.grep(
						data.data, 
						function(value){return value.X && value.Y;}
					);
					finish();
				}
			}
		);

		function finish()
		{

			if (!jsonLocations || !jsonVideos) {
				return;
			}

			_selectionMachine = new SelectionMachine(jsonLocations, jsonVideos);

			_map.loadData(_selectionMachine.getLocations());
				
			_table = $(new Table($("ul#table").eq(0)))
				.on("itemActivate", table_onItemActivate)
				.on("itemPresent", table_onItemPresent)
				.get(0);
				
			_table.load(_selectionMachine.getVideos());

			_playPanel = new PlayPanel($("#video-display").eq(0));
			
			$(new Legend($("#legend").get(0))).on(
				"itemClick", 
				function(event, categories)
				{
					console.log(categories);
				}
			);
			
			$("#legend-container button#legend-retract").click(
				function() {
					$("#legend-container").toggleClass("expanded");
				}
			);

			if ($("#map").width() > 550) {
				$("#legend-container").addClass("expanded");
			}
						
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
		_playPanel.conceal();
	}

	function map_onMarkerActivate(location)
	{
		_table.clearActive();
		_table.clearFilter();
		_playPanel.conceal();
		var videos = _selectionMachine.selectVideosForLocation(location);
		if (videos.length > 1) {
			_table.filter(videos);
		} else {
			_table.activateItem(videos.shift());
		}
	}

	function table_onItemActivate(e, videoID)
	{
		_map.activateMarker(
			_selectionMachine.selectLocationForVideo(
				_selectionMachine.selectVideoByID(videoID)
			)
		);
	}
	
	function table_onItemPresent(e, youTubeID)
	{
		_playPanel.present(youTubeID);
	}

	/***************************************************************************
	******************************** FUNCTIONS *********************************
	***************************************************************************/

	function getExtentPadding()
	{
		var small = $(window).width() < WIDTH_THRESHOLD;
		var top = $("#legend-container").height();
		var right = 0;
		var bottom = small ? $("#container").position().top : 0;
		var left = 0;
		return {paddingTopLeft: [left,top], paddingBottomRight: [right,bottom]};
	}

	function createPopupHTML(location)
	{  
		return $("<div>")
			.append($("<div>").html(location.getName()))
			.append($("<div>").html(
					location.getVideos().length > 1 ?
					"multiple videos" : 
					location.getVideos().shift().getTitle()
				)
			)
			.html();      
	}

})();