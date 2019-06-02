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
 * @plugindesc v2.0.0 Provides a means to display/manage icons above events.
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
 * @desc The offset used to displaying marker above the event
 * default: 0
 * @default 0
 * 
 * @param Y Offset
 * @desc The offset used to displaying marker above the event
 * default: -38
 * @default -38
 * 
 * @param Scale
 * @desc Controls the scale of marker
 * default: 1
 * @default 1
 * 
 * @param Opacity
 * @desc Sets the alpha of the marker
 * default: 255
 * @default 255
 * 
 * @param Hue
 * @desc Applies a hue shift to the marker
 * default: 0
 * @default 0
 * 
 * @param Layer Order
 * @desc Controls whether indicator appears over/under map objects
 * default: 5
 * @default 5
 * 
 * @param
 * 
 * @param -- Tween Settings --
 * @desc Parameters in this section relate to tween properties
 * 
 * @param Enable Default Tween
 * @desc Is the default tween (set up here) enabled for Event Markers?
 * default: false
 * @default false
 * 
 * @param Tween Time
 * @desc The time it takes for the tween to complete
 * (see help for more information)
 * @default 0
 * 
 * @param Tween X Offset
 * @desc Properties for tweening marker's x position
 * (see help for more information)
 * @default 0
 * 
 * @param Tween Y Offset
 * @desc Properties for tweening marker's y position
 * (see help for more information)
 * @default -48
 * 
 * @param Tween Scale
 * @desc Properties for tweening marker's scale on x-axis
 * (see help for more information)
 * @default 1
 * 
 * @param Tween Opacity
 * @desc Properties for tweening marker's ocpacity
 * (see help for more information)
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
	 * Creates new marker and sprite (if enabled).
	 *
	 * @param {Game_Event} event
	 * @param {MarkerData} data
	 */
	function MarkerController(event, data) {
		this._active;

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

			// Don't update enabled if we have a trigger.
			if (key !== "enabled" || !a.trigger) {
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

		console.warn("EventMarker :: DEBUG" + message, marker._event.event().name, marker, marker._data, marker._sprite);
	}

	/**
	 * Sets the enabled state based on the data's trigger.
	 *
	 * @param {MarkerData} data
	 * @returns {boolean} Indicates whether the trigger changed the state
	 */
	function checkTrigger(data) {
		if (!data.trigger) {
			return;
		}

		var enabled;
		var targetValue;

		if (data.trigger.type === "switch") {
			targetValue = $gameSwitches.value(data.trigger.triggerId);
		} else if (data.trigger.type === "variable") {
			targetValue = $gameVariables.value(data.trigger.triggerId);
		} else {
			return;
		}

		enabled = (targetValue === data.trigger.value);

		if (data.enabled !== enabled) {
			data.enabled = enabled;
			data.trigger.changed = true;
			return true;
		}
	}

	/**
	 * Adds/updates/removes trigger and checks state.
	 *
	 * @param {MarkerController} marker
	 * @param {boolean} kill
	 */
	function manageTrigger(marker, kill) {
		if (marker._data.trigger) {
			checkTrigger(marker._data);

			var trigger = marker._data.trigger;
			
			if (trigger.type === "switch") {
				var list = _switchTriggers[trigger.triggerId];
				if (!list) {
					_switchTriggers[trigger.triggerId] = list = []
				}
			} else if (trigger.type === "variable") {
				var list = _variableTriggers[trigger.triggerId];
				if (!list) {
					_variableTriggers[trigger.triggerId] = list = []
				}
			}

			// Remove the trigger.
			if (kill) {
				delete marker._data["trigger"];
			
				var i = list.length;
				while (i-- > 0) {
					if (list[i].markerId === trigger.markerId) {
						list.splice(i, 1);
						break;
					}
				}
			
			// Register the trigger.
			} else {
				var addTrigger = true;
				var i = list.length;

				while (i-- > 0) {
					// Check for updating the trigger.
					if (list[i].markerId === trigger.markerId) {
						addTrigger = false;
						list[i].trigger = trigger;
						break;
					}
				}

				// Add it if not found.
				if (addTrigger) {
					list.push(trigger);
				}
			}
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

		var killTrigger = (data && data.enabled != null && data.trigger == null);

		if (data) {
			if (this._data) {
				updateData(this._data, data);
			} else {
				this._data = data;
				fillMissing(data, _defaultValues);
			}
		}

		// Handle triggers.
		manageTrigger(this, killTrigger);

		if (this._data.enabled && !this.sprite) {
			var sprite = new Sprite_Marker(event, this._data);
			this._sprite = sprite;				
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
		if (this._active) {
			return;
		}

		this._active = true;

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
		if (!this._active) {
			return;
		}

		this._active = false;

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
	var _hasTween;

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

		this.name = event.event().name;
		
		this.anchor.set(0.5, 1);
		
		this._tweens = [];
		this._tweenCount = 0;
		
		/** @typedef {{ [name: string]: Tween }} */
		this._tweenLookup = {};
	};
	
	/**
	 * Updates the position of the marker.
	 * 
	 * @param {Sprite_Marker} sprite
	 */
	function updatePosition(sprite) {
		sprite.x = sprite._event.screenX() + sprite._offsetX;
		sprite.y = sprite._event.screenY() + sprite._offsetY;
	}
	
	/**
	 * Sets up tweens for the marker ugint he supplied data.
	 * 
	 * @param {Sprite_Marker} sprite
	 * @param {MarkerData} data
	 */
	function processTweenData(sprite, data) {
		if (_hasTween == null) {
			if (!checkTweenDependency()) {
				return;
			}
		} else if (!_hasTween) {
			return;
		}

		var lookup = sprite._tweenLookup;
		var tweens = sprite._tweens;

		console.log(data);

		// Remove old tweens that either no longer exist or need to be updated.


		// Add new/updated tweens.
		var keys = Object.keys(data);

	}


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
		
		Sprite_Base.prototype.jode.call(this);
		
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
		
		this.scale.x = data.scale.x;
		this.scale.y = data.scale.y;
		
		if (this._offsetX !== data.offset.x || this._offsetY !== data.offset.y) {
			this._offsetX = data.offset.x;
			this._offsetY = data.offset.y;

			updatePosition(this);
		}
		
		if (data.tween != null) {
			processTweenData(this, data.tween);
		}
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
		
		updatePosition(this);
		
		var i = this._tweenCount;
		while (i-- > 0) {
			this._tweens[i].update();
		}
	};

	// Tweens
	
	/**
	 * Checks dependency on Tween class. If found, initialises `SpriteTween`.
	 *
	 * @returns {boolean}
	 */
	function checkTweenDependency() {
		if (!$core.checkDependency("SRCrazy_Tween", "SRCrazy_EventMarkers")) {
			_hasTween = false;
			return false;
		}

		_hasTween = true;
		

		$core.createClass(SpriteTween, SRCrazy.Classes.Tween.prototype);

		return true;
	}


	function TweenData() {
		/** @typedef {number} */
		this.time;

		/** @typedef {boolean} */
		this.enabled;

		/** @typedef {number} */
		this.opacity;
		/** @typedef {number} */
		this.layer;
		/** @typedef {number} */
		this.hue;

		/** @typedef {{ x: number, y: number }} */
		this.offset = {};

		/** @typedef {{ x: number, y: number }} */
		this.scale = {};
	}

	/**
	 * Creates a new `SpriteTween` instance.
	 *
	 * @param {*} target The object whose properties the Tween will update
	 * @param {TweenData} data Data used to create the tween
	 */
	function SpriteTween(target, data) {
		/** @typedef {Tween} */
		this._tween;

		/**
		 * @typedef {MarkerData}
		 */	
		this._propertyNames = [];
	}


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
	 * Used for enabling/disabling markers based on Switches.
	 * 
	 * @typedef {{ [switchId: number]: MarkerTrigger[] }}
	 */
	var _switchTriggers = {};

	/**
	 * Used for enabling/disabling markers based on Variables.
	 * 
	 * @typedef {{ [variableId: number]: MarkerTrigger[] }}
	 */
	var _variableTriggers = {};

	/**
	 * Class structure for the data used to detail a variable trigger.
	 *
	 * @param {string} markerId
	 * @param {number} triggerId
	 * @param {boolean | number} value
	 */
	function MarkerTrigger(markerId, triggerId, value) {
		this.markerId = markerId;
		this.triggerId = triggerId;
		this.value = value;

		if (typeof value === "boolean") {
			this.type = "switch";
		} else {
			this.type = "variable";
		}
	}

	$core.createClass(MarkerTrigger);


	/**
	 * Class structure for the data used to define markers.
	 */
	function MarkerData() {
		/** @typedef {MarkerTrigger} */
		this.trigger,

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

		/** @typedef {TweenData} */
		this.tween;
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
			data.name = getMarkerName(event);

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

		processEnableState(data, values[0]);
		
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

		processEnableState(data, params.enabled);

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

		// Update tween value.
		if (params.tween) {
			data.tween = {};

			var keys = Object.keys(params.tween);
			var i = keys.length;
			
			while (i-- > 0) {
				var key = keys[i];
				data.tween[key] = params.tween[key];
			}

			fillMissing(data, _defaultTweenVars);
		} else if (params.tween === false) {
			data.tween = false;
		}
	}

	/**
	 * Processes the condition for enabling the marker.
	 *
	 * @param {MarkerData} data
	 * @param {bollean | string} value
	 */
	function processEnableState(data, value) {
		if (value == null) {
			return;
		}

		if (value === "true") {
			data.enabled = true;
			return;
		}

		if (value === "false") {
			data.enabled = false;
			return;
		}

		if (typeof value === "boolean") {
			data.enabled = value;
			return;
		}

		value = value.replace(/\s+/gi, "");

		// $switchId
		if (value.indexOf("$") === 0) {
			var switchId = value.replace(/[$!]/gi, "");
			value = !(value.indexOf("!") === 1);

			data.trigger = new MarkerTrigger(data.name, switchId, value);
			
		// #variableId=value
		} else if (value.indexOf("#") === 0) {
			var variableId = value.replace(/#|(=\d+)/gi, "");
			value = value.replace(/#\d+=]/gi, "");

			data.trigger = new MarkerTrigger(data.name, variableId, $core.typeValue(value));
		}
	}

	/**
	 * Adds a marker to the map for supplied event.
	 * 
	 * @param {Game_Event} event Event to add marker for
	 * @param {MarkerData} data Marker options
	 * @returns {MarkerController}
	 */
	function addMarker(event, data) {
		if (data) {
			var marker = new MarkerController(event, data);

			_lookup[marker.name] = marker;

			if (_markers) {
				_markers.push(marker);
			} else {
				_markers = [marker];
				_markersPerMap[marker.mapId] = _markers;
			}

			return marker;
		}
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


	var GameSwitches_setValue = Game_Switches.prototype.setValue;
	Game_Switches.prototype.setValue = function(switchId, value) {
		GameSwitches_setValue.call(this, switchId, value);

		var triggers = _switchTriggers[switchId];
		if (triggers) {
			var i = triggers.length;
			
			while (i-- > 0) {
				var trigger = triggers[i];
				var marker = _lookup[trigger.markerId];
				checkTrigger(marker._data);
			}
		}
	};

	var GameVariables_setValue = Game_Variables.prototype.setValue;
	Game_Variables.prototype.setValue = function(switchId, value) {
		GameVariables_setValue.call(this, switchId, value);

		var triggers = _variableTriggers[switchId];
		if (triggers) {
			var i = triggers.length;
			
			while (i-- > 0) {
				var trigger = triggers[i];
				var marker = _lookup[trigger.markerId];
				checkTrigger(marker._data);
			}
		}
	};

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
	 * Checks if `setupPage` should be called, accounting for triggers.
	 */
	var GameEvent_refresh = Game_Event.prototype.refresh;
	Game_Event.prototype.refresh = function() {
		var newPageIndex = this._erased ? -1 : this.findProperPageIndex();
		
		if (this._pageIndex !== newPageIndex) {
			GameEvent_refresh.call(this);
			return;
		}

		// We're on the same page, check for triggers.
		var marker = getMarker(this);
		if (marker && marker._data.trigger && marker._data.trigger.changed) {
			this.setupPage();
		}
	};
	
	/**
	 * Ensures markers are assigned their new Game_Event instances to track.
	 */
	var GameEvent_setupPage = Game_Event.prototype.setupPage;
	Game_Event.prototype.setupPage = function() {
		GameEvent_setupPage.call(this);

		// Funcitonality disabled, hide marker if we have one.
		var data = getDataFromEvent(this);
		var marker = getMarker(this);

		if (marker) {
			marker.refresh(this, data);

			if (_isDisabled) {
				marker.deactivate();
				
				if (marker._data.trigger) {
					marker._data.trigger.changed = false;
				}
			}
		} else if (data) {
			addMarker(this, data);
		}
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

	$core.registerPlugin(plugin, "SRCrazy_EventMarkers", "2.0.0", "2019-06-01", true, "SRCrazy_Core");
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

	var _defaultTweenVars = {};
	if (!!_params["Enable Default Tween"]) {

	}

	return plugin;
})();