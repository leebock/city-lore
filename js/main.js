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
			getExtentPadding
		)
			.addLayer(L.esri.basemapLayer("NationalGeographic"))
			.addControl(L.control.attribution({position: 'bottomleft'}))
			.on("markerSelect", function(location){console.log(location.getName());});
			
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
	********************************** EVENTS  *********************************
	***************************************************************************/

	function onTableItemSelect(e, videoID)
	{
		var vid = SelectionMachine.selectVideoByID(_videos, videoID);
		_map.panTo(vid.getLatLng());
		L.popup({closeButton: false, offset: L.point(0, -25)})
          .setLatLng(vid.getLatLng())
          .setContent(vid.getTitle())
          .openOn(_map);
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

	
	  /*
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
	  */
	


})();