//=============================================================================
// SRCrazy_EventMarkers.js
//=============================================================================
//
// DEPENDENCIES:
// 
// SRCrazy_Core
// SRCrazy_MVAdditions
//
//=============================================================================

/*:
 * @author S_Rank_Crazy
 * @plugindesc v1.0 Provides a means to display/manage icons above events.
 * <SRCrazy_EventMarkers>
 * 
 * @param Disabled At Start
 * @desc Disables event indicators when the game starts, can be enabled through plugin command
 * default: false
 * @default false
 * 
 * @param
 * 
 * @param -- Icon Settings --
 * @desc Parameters in this section relate to the graphic displayed
 *
 * @param Filename
 * @desc The filename of the icon set to use
 * default: IconSet
 * @default IconSet
 * 
 * @param Filepath
 * @desc The path of the containing folder of the IconSet to use
 * default: system
 * @default system
 * 
 * @param Width
 * @desc The width of the icons being used
 * default: 32
 * @default 32
 * 
 * @param Height
 * @desc The height of the icons being used
 * default: 32
 * @default 32
 * 
 * @param
 * 
 * @param -- Display Settings --
 * @desc Parameters in this section relate to the general appearance
 * 
 * @param X Offset
 * @desc The offset used to displaying icon above the event
 * default: 0
 * @default 0
 * 
 * @param Y Offset
 * @desc The offset used to displaying icon above the event
 * default: -38
 * @default -38
 * 
 * @param Opacity
 * @desc Sets the alpha of the indicators
 * default: 255
 * @default 255
 * 
 * @param Layer Order
 * @desc Controls whether indicator appears over/under map objects
 * default: 5
 * @default 5
 * 
 * @param Scale
 * @desc Controls the scale of indicators
 * default: 1
 * @default 1
 * 
 * @param Hue
 * @desc Applies a hue shift to the icon
 * default: 0
 * @default 0
 * 
 * ============================================================================
 * TERMS OF USE
 * 
 * Free for commercial and non-commercial use. No credit need be given, but
 * always appreciated.
 * 
 * ============================================================================
 * COMPATIBILITY
 * 
 * Requires SRCrazy_Core, SRCrazy_MVAdditions plugins.
 * 
 * ============================================================================
 */

SRCrazy.Plugins.EventMarkers = (function() {
	"use strict";

	var $core = SRCrazy.Plugins.Core;
	var plugin = {};
	

	//=========================================================================
	// Marker Controller
	//=========================================================================

	/**
	 * Updates object `a` with the values from object `b`.
	 *
	 * @param {MarkerData} a
	 * @param {MarkerData} b
	 */
	function updateData(a, b) {
		var keys = Object.keys(a);
		var i = keys.length;

		while (i-- > 0) {
			var key = keys[i];

			if (b[key] != null) {
				if (typeof a[key] === "object") {
					updateData(a[key], b[key]);
				} else {
					a[key] = b[key];
				}
			}
		}
	}

	/**
	 * Fills in missing value in object `a` from object `b`.
	 *
	 * @param {MarkerData} a
	 * @param {MarkerData} b
	 */
	function fillMissing(a, b) {
		var keys = Object.keys(b);
		var i = keys.length;

		while (i-- > 0) {
			var key = keys[i];

			// Fill in missing values.
			if (a[key] == null) {
				if (typeof b[key] === "object") {
					fillMissing(a[key], b[key], true);
				} else {
					a[key] = b[key];
				}
			
			// Search for sub values if this is an object.
			} else if (typeof a[key] === "object") {
				fillMissing(a[key], b[key]);
			}
		}
	}

	/**
	 * Logs a message to the console with some properties.
	 *
	 * @param {MarkerController} marker
	 * @param {string} message
	 */
	function debug(marker, message) {
		if (message) {
			message =  " :: " + message;
		} else {
			message = "";
		}

		console.log("EventMarker :: DEBUG" + message, marker._event.event().name, marker, marker._data, marker._sprite);
	}

	/**
	 * Creates new marker and sprite (if enabled).
	 *
	 * @param {Game_Event} event
	 * @param {MarkerData} data
	 */
	function MarkerController(event, data) {
		/**
		 * @typedef {Game_Event} Event being tracked by this marker.
		 */
		this._event;

		/**
		 * @typedef {MarkerData} Data used for sprite component.
		 */
		this._data;

		/**
		 * @typedef {Sprite_Marker} The sprite for this marker.
		 */
		this._sprite;

		/**
		 * @typedef {number} ID where this marker exists.
		 */
		this.mapId = event._mapId;
		
		/**
		 * @typedef {string} Name of marker.
		 */
		this.name = getMarkerName(event);

		// Upadted internal state.
		this.refresh(event, data);
		
		if (data.debug) {
			debug(this);
		}
	}

	var _p = $core.createClass(MarkerController);

	/**
	 * Recreates the sprite component for the supplied event.
	 * 
	 * @param {Game_Event} event The target event
	 * @param {MarkerData} [data] Display options
	 * @returns {this}
	 * 
	 * @memberof MarkerController
	 */
	_p.refresh = function(event, data) {
		this._event = event;

		if (this._data) {
			updateData(this._data, data);
		} else {
			this._data = data;
			fillMissing(data, _defaultValues);
		}

		if (this._data.enabled) {
			if (!this.sprite) {
				var sprite = new Sprite_Marker(event, this._data);
				this._sprite = sprite;				
			}
		}

		if (this._validated) {
			this.validate();
		}

		return this;
	};

	/**
	 * Updates the display list based on the current mapId.
	 * 
	 * @memberof MarkerController
	 */
	_p.validate = function() {
		this._validated = true;

		if (
			// All markers are disabled.
			_isDisabled
			// This marker is disabled.
			|| !this._data.enabled
			// This marker is for a different map.
			|| this.mapId !== $gameMap.mapId()
		) {
			this.deactivate();	

		} else {
			this.activate();
		}
	};
	
	/**
	 * Adds to the `_active` list.
	 * 
	 * @memberof MarkerController
	 */
	_p.activate = function() {
		if (this._data.debug) {
			debug(this, "Activated");
		}

		this._sprite.updateState(this._data);
		_tileMap.addChild(this._sprite);

		var i = _active.indexOf(this);
		if (i < 0) {
			_active.push(this);
		}
	};
	
	/**
	 * Removes from the `_active` list.
	 * 
	 * @memberof MarkerController
	 */
	_p.deactivate = function() {
		if (this._data.debug) {
			debug(this, "Deactivated");
		}

		if (this._sprite && this._sprite.parent) {
			this._sprite.parent.removeChild(this._sprite);
		}

		var i = _active.indexOf(this);
		if (i >= 0) {
			_active.splice(i, 1);
		}
	};

	/**
	 * Called when `Scene_Map` is stopped.
	 * 
	 * @memberof MarkerController
	 */
	_p.remove = function() {
		this._validated = false;
		this.deactivate();
	};
	

	//=========================================================================
	// Marker Sprite
	//=========================================================================

	var _tileMap;
	
	/**
	 * Get reference for parent TileMap.
	 */
	var SpritesetMap_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
	Spriteset_Map.prototype.createLowerLayer = function() {
		SpritesetMap_createLowerLayer.call(this);
		
		_tileMap = this._tilemap;

		var i = _markers.length;
		while (i-- > 0) {
			_markers[i].validate();
		}
	};


	/**
	 * Creates new sprite usingg supplied data.
	 *
	 * @param {Game_Event} event
	 * @param {MarkerData} data
	 * @memberof Sprite_Marker
	 */
	function Sprite_Marker(event, data) {
		Sprite_Base.prototype.initialize.call(this);
		
		this._mapId = event._mapId;
		this._event = event;
		
		this.anchor.set(0.5, 1);
		
		this._tweens = [];
		this._tweenCount = 0;
		
		// Used for built-in tweens
		this._tweenLookup = {};
		
		this.updateState(data);
	};

	var _p = $core.createClass(Sprite_Marker, Sprite_Base.prototype);

	/**
	 * Starts tweens (if applicable).
	 * 
	 * @memberof Sprite_Marker
	 */
	_p.show = function() {
		var doUpdate = this._hiding;
		
		Sprite_Base.prototype.show.call(this);
		
		if (doUpdate) {
			var i = this._tweenCount;
			while (i-- > 0) {
				this._tweens[i].start();
			}
		}
	};
	
	/**
	 * Stops tweens (if applicable).
	 * 
	 * @memberof Sprite_Marker
	 */
	_p.hide = function() {
		var doUpdate = !this._hiding;
		
		Sprite_Base.prototype.show.call(this);
		
		if (doUpdate) {
			var i = this._tweenCount;
			while (i-- > 0) {
				this._tweens[i].stop();
			}
		}
	};
	
	/**
	 * Applies data to indicator, updating the image, opacity, etc...
	 * 
	 * @param {MarkerData} data
	 * 
	 * @memberof Sprite_Marker
	 */
	_p.updateState = function(data) {
		this.bitmap = new Bitmap(data.width, data.height);
		$core.ImageUtil.blitToBitmap(this.bitmap, data.icon.index, data.icon.filename, data.icon.filepath, data.hue);
		
		this.opacity = data.opacity;
		this.z = data.layer;
		
		this._offsetX = data.offset.x;
		this._offsetY = data.offset.y;
		
		this.scale.x = data.scale.x;
		this.scale.y = data.scale.y;
		
		this.updatePosition();

		// TODO Implement tweening.
		// this.createTweens(data);
	};
	
	/**
	 * On frame handler, updates position, runs tweens...
	 * 
	 * @memberof Sprite_Marker
	 */
	_p.update = function() {
		Sprite_Base.prototype.update.call(this);

		// No need to update if not visible
		if (!this.visible) {
			return;
		}
		
		this.updatePosition();
		// this.updateTweens();
	};
	
	/**
	 * Updates the position of the marker.
	 * 
	 * @memberof Sprite_Marker
	 */
	_p.updatePosition = function() {
		this.x = this._event.screenX() + this._offsetX;
		this.y = this._event.screenY() + this._offsetY;
	};


	//=========================================================================
	// Marker Management
	//=========================================================================

	/**
	 * @typedef {[name: string]: MarkerController}
	 */
	var _lookup = {};
	/**
	 * @typedef {{[mapId: number]: MarkerController[]}}
	 */
	var _markersPerMap = {};
	/**
	 * @typedef {MarkerController[]}
	 */
	var _markers;
	/**
	 * @typedef {Sprite_Marker[]}
	 */
	var _active = [];

	/**
	 * @typedef {boolean}
	 */
	var _isDisabled;
	/**
	 * Key used in comment tags for marker values.
	 * 
	 * @default "marker"
	 * @typedef {string}
	 */
	var _commentTag = "marker";

	/**
	 * Class structure for the data used to define markers.
	 */
	function MarkerData() {
		/** @typedef {boolean} Is the marker enabled? */
		this.enabled,
		/** @typedef {boolean} Are we debugging the marker? */
		this.debug,
		/** @typedef {boolean} Should the marker be destroyed? */
		this.destroy,
		
		this.width,
		this.height,

		this.layer,
		this.opacity,
		this.hue,

		this.icon = {},

		this.scale = {},
		this.offset = {},

		this.tween = {};
	}

	$core.createClass(MarkerData);

	/**
	 * Creates a unique name for an event based on it's map and id.
	 * 
	 * @param {Game_Event} event event to get name for
	 */

	/**
	 * Creates a unique name for an event based on it's map and id.
	 * 
	 * @param {number} eventId ID for the event
	 * @param {number} mapId ID for the map the event belongs to
	 */

	function getMarkerName(event, mapId) {
		if (event instanceof Game_Event) {
			mapId = event._mapId;
			event = event.eventId();
		}

		return mapId + "|" + event;
	}

	/**
	 * Gets marker, if it exists, with supplied name.
	 * 
	 * @param {string} name Name of the marker to retrieve
	 * @returns {MarkerController}
	 *//**

	/**
	 * Gets marker, if it exists, for supplied event.
	 * 
	 * @param {Game_Event} event
	 * @returns {MarkerController}
	 *//**

	/**
	 * Gets marker, if it exists, for supplied event-map pairing.
	 * 
	 * @param {number} eventId ID of the event
	 * @param {number} mapId ID of the map where the event lives
	 * @returns {MarkerController}
	 */

	function getMarker(event, mapId) {
		var key;

		if (typeof event === "string") {
			key = event;
		} else {
			if (event instanceof Game_Event) {
				key = getMarkerName(event);
			} else {
				key = getMarkerName(event, mapId);
			}

		}

		return _lookup[key];
	}

	/**
	 * Parses the current event page and returns the marker data.
	 *
	 * @param {Game_Event} event
	 * @returns {MarkerData}
	 */
	function getDataFromEvent(event) {
		var eventData = event.getCommentParameter(_commentTag);

		
		if (eventData) {
			var data = new MarkerData();

			if (typeof eventData === "string") {
				getDataFromString(data, eventData);
			} else {
				getDataFromParameters(data, eventData);
			}

			return data;
		}
	}

	/**
	 * Applies values from 
	 *
	 * @param {MarkerData} data
	 * @param {string} string
	 */
	function getDataFromString(data, string) {
		/**
		 * @typedef [
		 * 	enabled: boolean,
		 *  icon: number,
		 *  filename: string,
		 *  filepath: string
		 * ]
		 */	
		var values = string.split(" ");

		data.enabled = (values[0] === "true");
		
		if (values[1] != null) {
			data.icon.index = values[1];
		} else {
			return;
		}
		
		if (values[2] != null) {
			data.icon.filename = values[2];
		} else {
			return;
		}
		
		if (values[3] != null) {
			data.icon.filepath = values[3];
		}
	}

	/**
	 * Applies values from marker parameters to supplied MarkerData.
	 *
	 * @param {MarkerData} data
	 * @param {*} params
	 */
	function getDataFromParameters(data, params) {
		data.debug = params.debug;

		// TODO add support to read this from a switch for variable
		// ?variableId=value
		// !switchId
		data.enabled = params.enabled;

		// Update icon values.
		if (typeof params.icon === "number") {
			data.icon.index = params.icon;
		} else if (typeof params.icon === "object") {
			if (params.icon.index != null) {
				data.icon.index = params.icon.index;
			}
			
			if (params.icon.filepath) {
				data.icon.filepath = params.icon.filepath;
			}

			if (params.icon.filename) {
				data.icon.filename = params.icon.filename;
			}
		}

		// Update size values.
		if (params.width != null) {
			data.width = params.width;
		}

		if (params.height != null) {
			data.height = params.height;
		}

		if (typeof params.scale === "number") {
			data.scale.x = data.scale.y = params.scale;
		} else if (typeof params.scale === "object") {
			data.scale.x = params.scale.y;
			data.scale.y = params.scale.y;
		}

		if (typeof params.offset === "number") {
			data.offset.x = data.offset.y = params.offset;
		} else if (typeof params.offset === "object") {
			data.offset.x = params.offset.y;
			data.offset.y = params.offset.y;
		}
		
		// Update other display values.
		if (params.layer != null) {
			data.layer = params.layer;
		}

		if (params.opacity != null) {
			data.opacity = params.opacity;
		}

		if (params.hue != null) {
			data.hue = params.hue;
		}

		// TODO Add tween
	}

	/**
	 * Adds a marker to the map for supplied event.
	 * 
	 * @param {Game_Event} event Event to add marker for
	 * @param {MarkerData} data Marker options
	 * @returns {MarkerController}
	 */
	function addMarker(event, data) {
		var marker = getMarker(event);

		// Update existing marker
		if (marker) {
			marker.refresh(event, data);
			
		// Create a new marker
		} else {
			marker = new MarkerController(event, data);

			_lookup[marker.name] = marker;

			if (_markers) {
				_markers.push(marker);
			} else {
				_markers = [marker];
				_markersPerMap[marker.mapId] = _markers;
			}
		}

		return marker;
	}

	/**
	 * Enables/disables the markers.
	 *
	 * @param {boolean} value
	 */
	function disable(value) {
		if (_isDisabled === value) {
			return;
		}

		_isDisabled = !!value;

		var i = _markers.length;
		while (i-- > 0) {
			if (_markers[i]._validated) {
				_markers[i].validate();
			}
		}
	}

	/**
	 * Stop processing old map events.
	 */
	var SceneMap_stop = Scene_Map.prototype.stop;
	Scene_Map.prototype.stop = function() {
		SceneMap_stop.call(this);

		var i = _active.length;
		while (i-- > 0) {
			_active[i].remove();
		}
	};

	/**
	 * Sets the correct list of markers to update.
	 */
	var GameMap_setupEvents = Game_Map.prototype.setupEvents;
	Game_Map.prototype.setupEvents = function() {
		// Set the current list of markers being used.
		_markers = _markersPerMap[this.mapId()];
		if (!_markers) {
			_markersPerMap[this.mapId()] = _markers = [];
		}

		_active = [];

		GameMap_setupEvents.call(this);
	};
	
	/**
	 * Ensures markers are assigned their new Game_Event instances to track.
	 */
	var GameEvent_setupPage = Game_Event.prototype.setupPage;
	Game_Event.prototype.setupPage = function() {
		GameEvent_setupPage.call(this);

		// Funcitonality disabled, hide marker if we have one.
		if (_isDisabled) {
			var marker = getMarker(this);
			if (marker) {
				marker.refresh(this, data);
				marker.deactivate();
			}

			return;
		}

		// No data in this event, no marker processing required.
		var data = getDataFromEvent(this);
		if (!data) {
			return;
		}

		addMarker(this, data);
	};
	

	//=========================================================================
	// Plugin Setup
	//=========================================================================

	/**
	 * Handles plugin commands.
	 *
	 * @param {string} command
	 * @param {string[]} args
	 */
	function pluginCommander(command, args) {
		command = args.splice(0, 1)[0];

		switch (command) {
			case "enable":	disable(false);	break;
			case "disable":	disable(true);	break;
		}
	}

	/**
	 * Applies default value from plugin parameters.
	 *
	 * @param {*} defaults
	 * @param {*} params
	 * @param {*} map
	 * @returns
	 */
	function getDefaultsFromParameters(defaults, params, map) {
		var keys = Object.keys(map);
		var i = keys.length;

		while (i-- > 0) {
			var keyInParams = keys[i];
			var keyInDefault = map[keyInParams];

			defaults[keyInDefault] = params[keyInParams];
		}

		_isDisabled = !!params["Disabled At Start"];

		defaults.icon = { index: 0, filename: params["Filename"], filepath: params["Filepath"] };

		defaults.offset = { x: Number(params["X Offset"]), y: Number(params["Y Offset"]) };

		var scale = params["Scale"];
		if (typeof scale === "number") {
			defaults.scale = { x: scale, y: scale };
		} else {
			defaults.scale = $core.parseProperties(scale);
		}

		return defaults;
	}

	$core.registerPlugin(plugin, "SRCrazy_EventMarkers", "1.0.0", "2019-05-26", true, "SRCrazy_Core");
	$core.addPluginCommands(pluginCommander, ["EventMarkers"]);
	
	var _params = $core.parseParameters(plugin);
	var _defaultValues = getDefaultsFromParameters({ enabled: true }, _params, {
		"Filename": "filename",
		"Filepath": "filepath",
		"Width": "width",
		"Height": "height",
		"Layer Order": "layer",
		"Opacity": "opacity",
		"Hue": "hue"
	});

	return plugin;
})();