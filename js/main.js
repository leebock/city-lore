(function () {

	"use strict";

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
			
			_locationFilterBadge = $(
					new LocationFilterBadge($("#locationFilterBadge").get(0))
				)
				.on("cancelLocationFilter", locationFilterBadge_onCancelLocationFilter)
				.get(0);

		}

	});

	/***************************************************************************
	***************************** SELECTION EVENTS  ****************************
	***************************************************************************/

	function locationFilterBadge_onCancelLocationFilter(event)
	{
		_locationFilterBadge.hide();
		_map.closePopup();
		_table.clearActive();
		_table.filter(_selectionMachine.getVideos());
	}

	function map_onClick()
	{
		if (_locationFilterBadge.isVisible()) {
			_locationFilterBadge.hide();
			_table.filter(_selectionMachine.getVideos());
		}
		_table.clearActive();
		_playPanel.conceal();
	}

	function map_onMarkerActivate(location)
	{
		_table.clearActive();
		_playPanel.conceal();
		var videos = location.getVideos();
		if (videos.length > 1) {
			_table.filter(videos);
			_locationFilterBadge.show(location.getName());
		} else {
			if (_locationFilterBadge.isVisible()) {
				_table.filter(_selectionMachine.getVideos());
				_locationFilterBadge.hide();
			}
			_table.activateItem(videos.shift());
		}
	}
	
	function categorySelect_onCategoryChange(event)
	{
		_locationFilterBadge.hide();
		_table.clearActive();
		_selectionMachine.setCategories(_categorySelect.getActiveCategories());
		var videos = _selectionMachine.getVideos();
		_table.filter(videos);
		_map.loadData(_selectionMachine.summarizeLocations(videos));
	}
	
	function boroughSelect_onBoroughChange(event)
	{
		_locationFilterBadge.hide();
		_table.clearActive();
		_selectionMachine.setBorough(_boroughSelect.getActiveBorough());
		var videos = _selectionMachine.getVideos();
		_table.filter(videos);
		_map.loadData(_selectionMachine.summarizeLocations(videos));
		_map.flyToBounds(
			_boroughSelect.getActiveBorough() ? 
			BOUNDS_LOOKUP[_boroughSelect.getActiveBorough()] :
			BOUNDS_NYC
		);
	}
			
	/***************************************************************************
	****************************** OTHER EVENTS  *******************************
	***************************************************************************/

	function map_onVideoPlay(obj)
	{
		_playPanel.present(obj.youTubeID);
	}

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
		var top = 45;
		var right = 60;
		var bottom = $("#container").css("position") === "absolute" ? 
					$("#container").outerHeight() : 
					0;
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
							.val(location.getVideos().shift().getYouTubeID())
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