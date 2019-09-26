(function () {

	"use strict";

	var WIDTH_THRESHOLD = 768;

	var GLOBAL_CLASS_USETOUCH = "touch";
	var VIDEOS_SPREADSHEET_URL = "data/videos.csv";
	
	var BOUNDS_LOOKUP = {
		"Manhattan": L.latLngBounds(
			L.latLng(40.700916, -74.022634), 
			L.latLng(40.878994, -73.901843)
		),
		"Brooklyn": L.latLngBounds(
			L.latLng(40.568647, -74.039938), 
			L.latLng(40.741717, -73.859058)
		),
		"Bronx": L.latLngBounds(
			L.latLng(40.784114, -73.936697), 
			L.latLng(40.904799, -73.773865)
		),
		"Queens": L.latLngBounds(
			L.latLng(40.540710, -73.947643), 
			L.latLng(40.798580, -73.698802)
		),
		"Staten Island": L.latLngBounds(
			L.latLng(40.492531, -74.256720), 
			L.latLng(40.649321, -74.053802)
		)				
	};
	
	var BOUNDS_NYC = L.latLngBounds(
		L.latLng(40.616643, -74.146981), 
		L.latLng(40.882684, -73.771086)
	);

	var _map;
	var _table;
	var _categorySelect;
	var _boroughSelect;
	var _locationFilterBadge;
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
			createPopupHTML,
			createToolTipHTML
		)
			.addLayer(L.esri.basemapLayer("NationalGeographic"))
			.addControl(L.control.attribution({position: 'bottomright'}))
			.on("click", map_onClick)
			.on("markerActivate", map_onMarkerActivate)
			.on("videoPlay", map_onVideoPlay);
			
		if (!L.Browser.mobile) {
			_map.addControl(L.control.zoom({position: "topright"}));
		}

		if (!L.Browser.mobile) {
			L.easyButton({
				states:[
					{
						icon: "fa fa-home",
						onClick: function(btn, map) {_map.flyToBounds(BOUNDS_NYC);},
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
			_map.fitBounds(BOUNDS_NYC);
				
			_table = $(new Table($("ul#table").eq(0)))
				.on("itemActivate", table_onItemActivate)
				.on("itemPresent", table_onItemPresent)
				.get(0);
				
			_table.load(_selectionMachine.getVideos());

			_playPanel = new PlayPanel($("#video-display").eq(0));
			
			_categorySelect = $(new CategorySelect($("select#categories").get(0)))
				.on("categoryChange", categorySelect_onCategoryChange)
				.get(0);
				
			_boroughSelect = $(new BoroughSelect($("select#boroughs").get(0)))
				.on("boroughChange", boroughSelect_onBoroughChange)
				.get(0);

			$("div#filterByMap input").change(checkbox_onChange);
			
			_locationFilterBadge = $(
					new LocationFilterBadge($("#locationFilterBadge").get(0))
				)
				.on("cancelLocationFilter", locationFilterBadge_onCancelLocationFilter)
				.get(0);
			
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

	function locationFilterBadge_onCancelLocationFilter(event)
	{
		_activeLocation = null;
		_locationFilterBadge.hide();
		$("div#filterByMap").show();
		_map.closePopup();
		_table.clearActive();
		_table.filter(extentFilter(_selectionMachine.getVideos()));
	}

	function map_onClick()
	{
		_activeLocation = null;
		_locationFilterBadge.hide();
		$("div#filterByMap").show();		
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
			_locationFilterBadge.show(location.getName());
			$("div#filterByMap").hide();
		} else {
			_table.filter(extentFilter(_selectionMachine.getVideos()));
			_table.activateItem(videos.shift());
			_locationFilterBadge.hide();
			$("div#filterByMap").show();
		}
	}
	
	function categorySelect_onCategoryChange(event)
	{
		_activeLocation = null;
		_locationFilterBadge.hide();
		$("div#filterByMap").show();		
		_selectionMachine.setCategories(_categorySelect.getActiveCategories());
		var videos = _selectionMachine.getVideos();
		_table.filter(extentFilter(videos));
		_map.loadData(_selectionMachine.summarizeLocations(videos));
	}
	
	function boroughSelect_onBoroughChange(event)
	{
		_activeLocation = null;
		_locationFilterBadge.hide();
		$("div#filterByMap").show();		
		_selectionMachine.setBorough(_boroughSelect.getActiveBorough());
		var videos = _selectionMachine.getVideos();
		_table.filter(extentFilter(videos));
		_map.loadData(_selectionMachine.summarizeLocations(videos));
		_map.flyToBounds(
			_boroughSelect.getActiveBorough() ? 
			BOUNDS_LOOKUP[_boroughSelect.getActiveBorough()] :
			BOUNDS_NYC
		);
	}
	
	/* this function doesn't impact table filter, but it DOES affect _activeLocation */
	function table_onItemActivate(e, videoID)
	{
		_activeLocation = _selectionMachine.summarizeLocations(
			[_selectionMachine.selectVideoByID(videoID)]
		).shift();
		_map.activateMarker(_activeLocation);
	}
		
	/***************************************************************************
	****************************** OTHER EVENTS  *******************************
	***************************************************************************/

	function map_onVideoPlay(event)
	{
		_playPanel.present(_activeLocation.getVideos().shift().getYouTubeID());
	}
	
	function table_onItemPresent(e, youTubeID)
	{
		_playPanel.present(youTubeID);
	}

	/***************************************************************************
	******************************** FUNCTIONS *********************************
	***************************************************************************/

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

	function getExtentPadding()
	{
		var small = $(window).width() <= WIDTH_THRESHOLD;
		var top = 45;
		var right = 60;
		var bottom = small ? $("#container").outerHeight() : 0;
		var left = 0;
		return {paddingTopLeft: [left,top], paddingBottomRight: [right,bottom]};
	}

	function createPopupHTML(location)
	{  
		return $("<div>")
			.append(
				$("<div>").html(location.getName())
			)
			.append(
				$("<div>").html(
					location.getVideos().length > 1 ?
					"multiple videos" : 
					location.getVideos().shift().getTitle()
				)
			)
			.append(
				$("<div>")
					.css(
						"background-image", 
						"url('https://img.youtube.com/vi/"+location.getVideos().shift().getYouTubeID()+"/0.jpg')"
					).
					append(
						$("<button>")
					)
			)
			.html();		
	}
	
	function createToolTipHTML(location)
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