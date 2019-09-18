(function () {

	"use strict";

	var WIDTH_THRESHOLD = 768;

	var GLOBAL_CLASS_USETOUCH = "touch";
	var VIDEOS_SPREADSHEET_URL = "data/videos.csv";

	var _map;
	var _table;
	var _categorySelect;
	var _playPanel;
	var _selectionMachine;
	var _activeLocation;

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
			VIDEOS_SPREADSHEET_URL,
			{
				header: true,
				download: true,
				complete: function(data) {
					finish(
						$.grep(
							data.data, 
							function(value){return value.X && value.Y;}
						)
					);
				}
			}
		);

		function finish(data)
		{

			_selectionMachine = new SelectionMachine(data);
			_map.loadData(
				_selectionMachine.summarizeLocations(_selectionMachine.getVideos())
			);
			_map.zoomToMarkers();
				
			_table = $(new Table($("ul#table").eq(0)))
				.on("itemActivate", table_onItemActivate)
				.on("itemPresent", table_onItemPresent)
				.get(0);
				
			_table.load(_selectionMachine.getVideos());

			_playPanel = new PlayPanel($("#video-display").eq(0));
			
			_categorySelect = $(new CategorySelect($("select#categories").get(0)))
				.on("categoryChange", categorySelect_onCategoryChange)
				.get(0);

			$("div#filterByMap input").change(checkbox_onChange);
			
			_map.on("moveend", map_onExtentChange);

			// one time check to see if touch is being used

			$(document).one(
				"touchstart", 
				function(){$("html body").addClass(GLOBAL_CLASS_USETOUCH);}
			);

		}

	});

	/***************************************************************************
	***************************** SELECTION EVENTS  ****************************
	***************************************************************************/

	function checkbox_onChange(event)
	{
		_table.filter(extentFilter(_selectionMachine.getVideos()));
	}

	function map_onClick()
	{
		_activeLocation = null;
		_table.clearFilter();
		_table.clearActive();
		_playPanel.conceal();
		_table.filter(extentFilter(_selectionMachine.getVideos()));
	}
	
	function map_onExtentChange()
	{
		_table.filter(extentFilter(_selectionMachine.getVideos()));
	}

	function map_onMarkerActivate(location)
	{
		_activeLocation = location;
		_table.clearActive();
		_playPanel.conceal();
		var videos = location.getVideos();
		if (videos.length > 1) {
			_table.filter(videos);
		} else {
			_table.activateItem(videos.shift());
		}
	}
	
	function categorySelect_onCategoryChange(event)
	{
		_activeLocation = null;
		_selectionMachine.setCategories(_categorySelect.getActiveCategories());
		var videos = _selectionMachine.getVideos();
		_table.filter(extentFilter(videos));
		_map.loadData(_selectionMachine.summarizeLocations(videos));
	}
	
	function extentFilter(videos)
	{
		if (_activeLocation && _activeLocation.getVideos().length > 1) {
			return _activeLocation.getVideos();
		}
		if ($("div#filterByMap input").prop("checked")) {
			videos = $.grep(
				videos,
				function(video){return _map.getUsableBounds().contains(video.getLatLng());}
			);
		}
		return videos;
	}

	
	/***************************************************************************
	****************************** OTHER EVENTS  *******************************
	***************************************************************************/

	function table_onItemActivate(e, videoID)
	{
		_map.activateMarker(
			_selectionMachine.summarizeLocations(
				[_selectionMachine.selectVideoByID(videoID)]
			).shift()
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
		var small = $(window).width() <= WIDTH_THRESHOLD;
		var top = 0;
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