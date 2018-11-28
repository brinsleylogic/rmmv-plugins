///////////////////////////////////////////////////////////////////////////////
/* S_Rank_Crazy's Event Indicators
 * ============================================================================
 * RPG Maker MV
 * SRCrazy_EventIndicators.js
 * 
 * DEPENDENCIES: 
 * SRCrazy_Core
 * 
 * ============================================================================
 * No personal credit required, but always appreciated.
 * Free for personal and commercial use.
 * 
 * ============================================================================
 * 
 * 2016-09-16
 * - Version 0.3.2
 * - Fixed issue with setVisible not working. Seemingly a compatibility issue
 *   caused by Sprite_base now calling updateVisibility in every update?
 * 
 * 2016-03-17
 * - Version 0.3.1
 * - Fixed issue with <eventIndicator: false> tag not working
 * 
 * 2016-01-19
 * - Version 0.3
 * - Fixed issue with icons not being destroyed when moving to new map
 * 
 * 2016-01-05
 * - Version 0.2
 * 
 * - Added parameter for changing scale of icon
 * - Added parameter for changing hue of icon
 * - Added debug mode on per event basis
 * - Added tweens:
 *   - Positional: x, y, z
 *   - Scale: x, y
 *   - Opacity
 *   - Hue
 * 
 * - Fixed bug where opening menu removed icons
 * - Fixed bug where icons wouldn't display if only created on non-primary page
 *
 * 2016-01-04
 * - Version 0.1
 * - Working
 * 
 * ============================================================================
 */

///////////////////////////////////////////////////////////////////////////////
/* ============================================================================
 *                             Class Navigation
 * ============================================================================
 * Search file for indexer on left side to navigate.
 * E.g. "[LKUP]" to navigate here.
 * 
 * ============================================================================
 * [LKUP]	Here
 * 
 * [CODE]	Start of code
 * 
 * [MNGT]	Indicator management - handles adding, removing, updating indicators
 * 
 * [SPRT]	Indicator sprite class
 * 
 * [INIT]	Indicator creation/initialisation, invoked by event page changes
 * 
 * [PLGN]	Plugin Commands
 * 
 * ============================================================================
 */ 

///////////////////////////////////////////////////////////////////////////////
/*:
 * @author S_Rank_Crazy
 * @plugindesc v0.3.2 Displays indicators above events
 * <SRCrazy_EventIndicators>
 * 
 * @param Disabled At Start
 * @desc Disables event indicators when the game starts, can be enabled through plugin command
 * @default false
 * 
 * @param -- Icon Settings --
 * @desc Parameters in this section relate to the graphic displayed
 *
 * @param Icon Filename
 * @desc The filename of the icon set to use
 * default: IconSet
 * @default IconSet
 * 
 * @param Icon File Path
 * @desc The path of the containing folder of the IconSet to use
 * default: system
 * @default system
 * 
 * @param Icon Width
 * @desc The width of the icons being used
 * default: 32
 * @default 32
 * 
 * @param Icon Height
 * @desc The height of the icons being used
 * default: 32
 * @default 32
 * 
 * @param -- Display Settings --
 * @desc Parameters in this section relate to the general appearance
 * 
 * @param Y Offset
 * @desc The offset used to displaying icon above the event
 * @default -38
 * 
 * @param Opacity
 * @desc Sets the alpha of the indicators
 * @default 255
 * 
 * @param Layer Order
 * @desc Controls whether indicator appears over/under map objects
 * @default 5
 * 
 * @param Scale
 * @desc Controls the scale of indicators
 * default: 1
 * @default 1
 * 
 * @param Hue
 * @desc Applys a hue shift to the icon
 * default: 0
 * @default 0
 * 
 * @param -- Tween Settings --
 * @desc Parameters in this section relate to tweenable properties
 * 
 * @param Tween Position X
 * @desc Properties for tweening indicator's x position
 * (see help for more information)
 * @default false 0 0 1
 * 
 * @param Tween Position Y
 * @desc Properties for tweening indicator's y position
 * (see help for more information)
 * @default false 0 0 1
 * 
 * @param Tween Scale X
 * @desc Properties for tweening indicator's scale on x-axis
 * (see help for more information)
 * @default false 0 0 1
 * 
 * @param Tween Scale Y
 * @desc Properties for tweening indicator's scale on y-axis
 * (see help for more information)
 * @default false 0 0 1
 * 
 * @param Tween Opacity
 * @desc Properties for tweening indicator's ocpacity
 * (see help for more information)
 * @default false 0 0 1
 * 
 * @param Tween Layer Order
 * @desc Properties for tweening indicator's z position
 * (see help for more information)
 * @default false 0 0 1
 * 
 * @param Tween Hue
 * @desc Properties for tweening indicator's hue
 * (see help for more information)
 * @default false 0 0 1
 * 
 * @help============================================================================
 *                     S_Rank_Crazy's Event Indicators
 * ============================================================================
 * This plugin adds functionality to display indicators above events, could be a
 * useful addition for a quest system to display an icon above the quest-giver,
 * etc...
 * 
 * * Requires SRCrazy_Core plugin.
 * 
 * All SRCrazy plugins are rename safe - you can rename the file and it'll still
 * work. All parameters and commands are case-safe (no need to worry
 * about case-sensitive input) unless specifically stated. This doesn't include
 * Comment Tags or file names/paths; they are still case sensitive.
 * 
 * ============================================================================
 * FEATURES
 * 
 * * Show icons above events using comments
 * * Supports multiple icons per map
 * * Supports using any image file in the Project as a source for icons
 * * Indicators customisable on a per event basis using comment tags
 * * Indicators are managed/updated based on the event's current page
 * 
 * * [NEW] Set hue of icons
 * * [NEW] Tween options for position, scale, opacity and more!
 * 
 * ============================================================================
 * PLUGIN COMMANDS
 * 
 * If this plugin is active you can use the following commands:
 * 
 * SRCrazy_EventIndicators enable true/false [eventId]
 *     Sets the visibility of all indicators directly. If eventId is set then
 *     only that event is enabled/disabled.
 *     
 *     NOTE: Using eventId overrides the global setting, i.e. enabling an event's
 *     indicator will display it even if the global setting is set to disabled.
 * 
 * SRCrazy_EventIndicators toggle [eventId]
 *     Toggles the visibility of all indicators. If eventId is set then
 *     only that event is toggled.
 *     
 *     NOTE: Using mass toggle uses the global enable flag used by the "enable"
 *     command.
 * 
 * 
 * ============================================================================
 * COMMENT TAGS
 * 
 * The following tags can be used to customise an even's indicator icon. To use
 * add to a COMMENT in an event's page where you want those settings to be
 * applied, multiline comments are supported.
 * 
 * REQUIRED:
 * 
 * <eventIndicator: true/false>
 *    Indicates whether an indicator should be added or removed for this event.
 * 
 * <eventIndicatorIcon: Number>
 *    Sets the icon to use for the indicator.
 * 
 * 
 * PROPERTIES:
 * 
 * <eventIndicatorOpacity: 0-255>
 *    Overrides the plugin opacity value for this event's indicator.
 * 
 * <eventIndicatorLayerOrder: Number>
 *    Overrides the plugin z ordering value for this event's indicator.
 * 
 * <eventIndicatorOffsetX: Number>
 *    Overrides the plugin offset options and uses the specified value to
 *    offset the indicator from the event position.
 * 
 * <eventIndicatorOffsetY: Number>
 *    Overrides the plugin offset options and uses the specified value to
 *    offset the indicator from the event position.
 * 
 * <eventIndicatorFile: String>
 *    Overrides the plugin icon set and uses the specified file instead.
 * 
 * <eventIndicatorPath: String>
 *    Overrides the plugin path to the icon set and uses the specified path
 *    instead. Must be within the project's img folder.
 * 
 * <eventIndicatorWidth: Number>
 *    Overrides the plugin setting and uses the specified width for event's
 *    indicator.
 * 
 * <eventIndicatorHeight: Number>
 *    Overrides the plugin setting and uses the specified height for event's
 *    indicator.
 * 
 * <eventIndicatorHue: 0-360>
 *    Overrides the plugin setting and uses the specified height for event's
 *    indicator.
 * 
 * 
 * TWEENING:
 * 
 * Tween parameters are ordered as follows:
 * 
 * <propertyName: enabled startValue finalValue duration easing onComplete>
 * 
 * * propertyName - Indicates which property of the Event Indicator is
 *   being targeted by the tween.
 *   
 * * enabled - Indicates if the tween is enabled on for this indicator.
 * 
 * * startValue - The value the tween starts at.
 * 
 * * finalValue - The value the tween will end on.
 * 
 * * duration - The mount of time (in seconds) it takes to go from start to end.
 * 
 * * easing - [optional] Name of easing function to use from
 *   SRCrazy.Core.TweenEasing object. Uses linear function by default.
 *   
 *   linear
 *   quadIn
 *   quadOut
 *   quadInOut
 *   cubicIn
 *   cubicOut
 *   cubicInOut
 *   sineIn
 *   sineOut
 *   sineInOut
 *   elasticIn
 *   elasticOut
 *   elasticInOut
 * 
 * * onComplete - [optional] Name of easing function to use from
 *   SRCrazy.Core.TweenCompleteHandler object. Uses remove function by default.
 * 
 * 
 * <eventIndicatorTweenPosX: true/false Number Number Number String String>
 * 
 * <eventIndicatorTweenPosY: true/false Number Number Number String String>
 * 
 * <eventIndicatorTweenScaleX: true/false Number Number Number String String>
 * 
 * <eventIndicatorTweenScaleY: true/false Number Number Number String String>
 * 
 * <eventIndicatorTweenOpacity: true/false Number Number Number String String>
 * 
 * <eventIndicatorTweenLayer: true/false Number Number Number String String>
 * 
 * <eventIndicatorTweenHue: true/false Number Number Number String String>
 *    
 * 
 * ============================================================================
 */


///////////////////////////////////////////////////////////////////////////////
//                        Plugin Initialisation
// [CODE]	Here
// [LKUP	Top

var Imported = Imported || {};

// Set up namespace and plugin vars
SRCrazy.EventIndicators = SRCrazy.EventIndicators || {};


(function($, $core)
{
	"use strict";
	
	$core.registerPlugin($, "SRCrazy_EventIndicators", "0.3.2", "2016-09-16", true, ["SRCrazy_Core"]);

	// Setup plugin variables
	$.disabled = ($.Params['Disabled At Start'].toLowerCase() === "true");
	
	$.defaultIconFile = String($.Params['Icon Filename'] || "IconSet");
	$.defaultIconPath = String($.Params['Icon File Path'] || "system");
	$.defaultIconWidth = Number($.Params['Icon Width'] || 32);
	$.defaultIconHeight = Number($.Params['Icon Height'] || 32);
	$.defaultOffsetY = Number($.Params['Y Offset'] || -38);
	$.defaultLayerOrder = Number($.Params['Layer Order'] || 5);
	$.defaultOpacity = Number($.Params['Opacity']);
	$.defaultHue = Number($.Params['Hue']);
	
	$.defaultOffsetX = 0;
	
	$.getScaleParameters = function(str)
	{
		if (str)
		{
			var spl = str.split(" ");
			if (spl.length === 1)
			{
				var s = Number(spl[0]);
				return { x: s, y: s };
			}
			else
			{
				return { x: Number(spl[0]), y: Number(spl[1]) };
			}
		}
	};
	
	$.defaultScale = $.getScaleParameters($.Params['Scale']);
	
	// Tweens
	$.getTweenParameters = function(str)
	{
		if (!str)
		{
			return null;
		}
		
		var params = str.split(' ');
		return {
			enabled: ((params[0] || '').toLowerCase() === "true"),
			start: Number(params[1]),
			end: Number(params[2]),
			duration: Number(params[3]),
			easing: String(params[4]),
			onComplete: String(params[5])
		};
	};
	
	$.defaultTweenPosX = $.getTweenParameters($.Params['Tween Position X']) || {};
	$.defaultTweenPosY = $.getTweenParameters($.Params['Tween Position Y']) || {};
	$.defaultTweenScaleX = $.getTweenParameters($.Params['Tween Scale X']) || {};
	$.defaultTweenScaleY = $.getTweenParameters($.Params['Tween Scale Y']) || {};
	$.defaultTweenOpacity = $.getTweenParameters($.Params['Tween Opacity']) || {};
	$.defaultTweenLayerOrder = $.getTweenParameters($.Params['Tween Layer Order']) || {};
	
	var hue = $.getTweenParameters($.Params['Tween Hue']) || {};
	$.defaultTweenHue = hue;
	
	
	///////////////////////////////////////////////////////////////////////////
	//                        Indicator Management
	// [MNGT]	Here
	// [LKUP	Top
	
	$._tileMap = null;
	$._activeIndicators = {};
	
	/**
	 * Constructs and returns indicator settings from and event
	 * @param {Game_Event} event Target event
	 */
	$.getIndicatorData = function(event)
	{
		var data = {};
		
		data.debug = (event.getCommentParameter("eventIndicatorDebug") === "true");
		data.icon = event.getCommentParameter("eventIndicatorIcon");
		data.iconFile = String(event.getCommentParameter("eventIndicatorFile") || $.defaultIconFile);
		data.iconPath = String(event.getCommentParameter("eventIndicatorPath") || $.defaultIconPath);
		
		data.width = Number(event.getCommentParameter("eventIndicatorWidth") || $.defaultIconWidth);
		data.height = Number(event.getCommentParameter("eventIndicatorHeight") || $.defaultIconHeight);
		data.offsetX = Number(event.getCommentParameter("eventIndicatorOffsetX") || $.defaultOffsetX);
		data.offsetY = Number(event.getCommentParameter("eventIndicatorOffsetY") || $.defaultOffsetY);
		
		var scale = event.getCommentParameter("eventIndicatorScale");
		data.scale = (scale) ? $.getScaleParameters(scale) : $.defaultScale;
		
		data.layerOrder = Number(event.getCommentParameter("eventIndicatorLayerOrder") || $.defaultLayerOrder);
		data.opacity = Number(event.getCommentParameter("eventIndicatorOpacity") || $.defaultOpacity);
		data.hue = Number(event.getCommentParameter("eventIndicatorHue") || $.defaultHue);
		
		var tweenParams;
		
		tweenParams = event.getCommentParameter("eventIndicatorTweenPosX");
		data.tweenPosX = $.getTweenParameters(tweenParams) || $.defaultTweenPosX;
		tweenParams = event.getCommentParameter("eventIndicatorTweenPosY");
		data.tweenPosY = $.getTweenParameters(tweenParams) || $.defaultTweenPosY;
		tweenParams = event.getCommentParameter("eventIndicatorTweenScaleX");
		data.tweenScaleX = $.getTweenParameters(tweenParams) || $.defaultTweenScaleX;
		tweenParams = event.getCommentParameter("eventIndicatorTweenScaleY");
		data.tweenScaleY = $.getTweenParameters(tweenParams) || $.defaultTweenScaleY;
		
		tweenParams = event.getCommentParameter("eventIndicatorTweenLayer");
		data.tweenLayerOrder = $.getTweenParameters(tweenParams) || $.defaultTweenLayerOrder;
		tweenParams = event.getCommentParameter("eventIndicatorTweenOpacity");
		data.tweenOpacity = $.getTweenParameters(tweenParams) || $.defaultTweenOpacity;
		tweenParams = event.getCommentParameter("eventIndicatorTweenHue");
		var hue = $.getTweenParameters(tweenParams) || $.defaultTweenHue;
		hue.start = (hue.start || 0) / 30;
		hue.end = (hue.end || 0) / 30;
		data.tweenHue = hue;
		
		return data;
	};
	
	$.getIndicatorKey = function(eventId, mapId)
	{
		mapId = mapId || $gameMap.mapId();
		return mapId + "::" + eventId;
	}
	
	$.hasIndicator = function(event)
	{
		var key = $.getIndicatorKey(event.eventId(), event._mapId);
		return Boolean($._activeIndicators[key]);
	}
	
	/**
	 * Adds an indicator to the map
	 * @param {Game_event} event Event to add indicator for
	 * @param {Object} data Data object containing indicator parameters
	 */
	$.addIndicator = function(event, data)
	{
		var indicator;
		var key = $.getIndicatorKey(event.eventId(), event._mapId);
		
		// Update existing indicator
		if ($._activeIndicators[key])
		{
			indicator = $._activeIndicators[key];
			indicator.updateState(data);
		}
		// Create new indicator
		else
		{
			indicator = new SRCrazy.Classes.Sprite_EventIndicator(event, data);
			$._activeIndicators[key] = indicator;
			
			if ($.disabled)
			{
				indicator.hide();
			}
			
			if ($._tileMap)
			{
				indicator.validateTileMap($._tileMap);
			}
		}
	};
	
	/**
	 * Removes an indicator from the map
	 * @param {Number} eventId ID of event to remove indicator for
	 * @param {Number} eventMapId Map ID where event is a located
	 */
	$.removeIndicator = function(eventId, eventMapId)
	{
		var eventKey = $.getIndicatorKey(eventId, eventMapId);
		var indicator = $._activeIndicators[eventKey];
		
		if (indicator)
		{
			// Remove indicator
			delete $._activeIndicators[eventKey];
			
			indicator.remove();
		}
	};
	
	/**
	 * Toggle visibility of indicators
	 * @param {Boolean} show Should indicators be visible?
	 */
	$.updateVisibility = function(show)
	{
		show = eval(show);
		
		if ($.disabled === !show)
		{
			return;
		}
		
		$.disabled = !show;
		
		for (var eventId in $._activeIndicators)
		{
			$._activeIndicators[eventId].setVisible(show);
		}
	};
	
	/**
	 * Validates TileMap reference for indicators, ensures only relevant indicators are active
	 * @param {TileMap} tileMap TileMap object being loaded
	 */
	$.setTileMap = function(tileMap)
	{
		$._tileMap = tileMap;
		for (var eventId in $._activeIndicators)
		{
			$._activeIndicators[eventId].validateTileMap(tileMap);
		}
	};
	
	
	///////////////////////////////////////////////////////////////////////////
	//                        Initialisation
	// [INIT]	Here
	// [LKUP	Top
	
	/**
	 * When event's page changes, detect display state
	 */
	var Override_setupPage = Game_Event.prototype.setupPage;
	Game_Event.prototype.setupPage = function()
	{
		Override_setupPage.call(this);
		
		// Do we need to display an indicator for this event?
		var displayIndicator = this.getCommentParameter("eventIndicator");
		
		//Display it
		if (displayIndicator === "true")
		{
			var inData = $.getIndicatorData(this);
			$.addIndicator(this, inData);
		}
		// Remove it if it exists
		else if (displayIndicator === "false" && $.hasIndicator(this))
		{
			$.removeIndicator(this._eventId, this._mapId);
		}
	};
	
	// Get reference for parent TileMap
	var Override_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
	Spriteset_Map.prototype.createLowerLayer = function()
	{
		Override_createLowerLayer.call(this);
		$.setTileMap(this._tilemap);
	};
	
	
	///////////////////////////////////////////////////////////////////////////
	//                          Plugin Commands
	// [PLGN]	Here
	// [LKUP	Top
	
	/**
	 * Set up plugin commands
	 */
	var Override_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args)
	{
		// Is it a command for this plugin?
		if (command.toLowerCase() === $._ALIAS.toLowerCase())
		{
			// Check for arguments being passed
			if (args && args.length > 0)
			{
				// Check command
				var cmd = args.shift().toLowerCase();
				switch (cmd)
				{
					case "enable":
						var show = String(args[0] || "true");
						var eventId = Number(args[1]);
						
						// Specific event
						if (eventId)
						{
							var key = $.getIndicatorKey(eventId);
							if ($._activeIndicators[key])
							{
								$._activeIndicators[key].setVisible(show.toLowerCase());
							}
						}
						// All indicators
						else
						{
							$.updateVisibility(show.toLowerCase());
						}
						break;
						
					case "toggle":
						var eventId = Number(args[0]);
						
						// Specific event
						if (eventId)
						{
							var key = $.getIndicatorKey(eventId);
							if ($._activeIndicators[key])
							{
								$._activeIndicators[key].toggleVisible();
							}
						}
						// All indicators
						else
						{
							$.updateVisibility($.disabled);
						}
						break;
				}
			}
		}
		// Call overridden method
		else
		{
			Override_pluginCommand.call(this, command, args);
		}
	};
	
	
})(SRCrazy.EventIndicators, SRCrazy.Core);
	
	
///////////////////////////////////////////////////////////////////////////////
//                           Indicator Sprite
// [SPRT]	Here
// [LKUP	Top
	
(function($, $core)
{
	// Add custom complete handler to remove the indicator
	$core.TweenCompleteBehaviour.removeEventIndicator = function(target)
	{
		$.removeIndicator(target.eventId(), target.mapId());
	};
	

	// Constructor
	function Sprite_EventIndicator()
	{
		this.initialize.apply(this, arguments);
	}

	Sprite_EventIndicator.prototype = Object.create(Sprite_Base.prototype);
	Sprite_EventIndicator.prototype.constructor = Sprite_EventIndicator;

	/**
	 * Initialise the state of the indicator
	 * @param {Game_Event} event Parent event
	 * @param {Object} data Data container for indicator properties
	 */
	Sprite_EventIndicator.prototype.initialize = function(event, data)
	{
		Sprite_Base.prototype.initialize.call(this);
		
		this._mapId = event._mapId;
		
		this._event = event;
		this._tileMap = null;
		
		this.anchor.x = 0.5;
		this.anchor.y = 1;
		
		this._tweens = [];
		this._tweenCount = 0;
		
		// Used for built in tweens
		this._tweenLookup = {};
		
		this.updateState(data);
	};
	
	Sprite_EventIndicator.prototype.mapId = function()
	{
		return this._mapId;
	};
	
	Sprite_EventIndicator.prototype.eventId = function()
	{
		return this._event.eventId();
	};
	
	Sprite_EventIndicator.prototype.show = function()
	{
		var doUpdate = this._hiding;
		
		Sprite_Base.prototype.show.call(this);
		
		if (doUpdate)
		{
			var i = this._tweenCount;
			while (i-- > 0)
			{
				this._tweens[i].start();
			}
		}
	};
	
	Sprite_EventIndicator.prototype.hide = function()
	{
		var doUpdate = !this._hiding;
		
		Sprite_Base.prototype.show.call(this);
		
		if (doUpdate)
		{
			var i = this._tweenCount;
			while (i-- > 0)
			{
				this._tweens[i].stop();
			}
		}
	};
	
	/**
	 * Sets the visibility of the indicator
	 * @param {type} show Should the indicator be visible?
	 */
	Sprite_EventIndicator.prototype.setVisible = function(show)
	{
		this.visible = show;
		this._hiding = !show;
	};
	
	/**
	 * Inverts the visibility of the indicator
	 */
	Sprite_EventIndicator.prototype.toggleVisible = function()
	{
		this.setVisible(!this.visible);
	};
	
	/**
	 * Applies data to indicator, updating the image, opacity, etc...
	 * @param {Object} data
	 */
	Sprite_EventIndicator.prototype.updateState = function(data)
	{
		this.bitmap = new Bitmap(data.width, data.height);
		$core.blitToBitmap(this.bitmap, data.icon, data.iconFile, data.iconPath, data.hue);
		
		this.opacity = data.opacity;
		
		this._offsetX = data.offsetX;
		this._offsetY = data.offsetY;
		this.z = data.layerOrder;
		
		this.scale.x = data.scale.x;
		this.scale.y = data.scale.y;
		
		this.updatePosition();
		this.createTweens(data);
		
		if (data.debug)
		{
			console.log("Sprite_EventIndicator :: DEBUG :: " + this.eventId());
			console.log("Sprite_EventIndicator: ", this);
			console.log("Sprite_EventIndicator parameters: ", data);
		}
	};
	
	/**
	 * Compares passed TileMap to indicator's display container, if container doesn't match, indicator is destroyed
	 * @param {TileMap} tileMap
	 */
	Sprite_EventIndicator.prototype.validateTileMap = function(tileMap)
	{
		// Add to TileMap
		if (this._mapId === $gameMap.mapId())
		{
			tileMap.addChild(this);
		}
		// Remove from active list, destroy
		else
		{
			$.removeIndicator(this._event.eventId(), this._mapId);
		}
	};
	
	/**
	 * Removes indicator from display container
	 */
	Sprite_EventIndicator.prototype.remove = function()
	{
		this._event = null;
		
		if (this.parent)
		{
			this.parent.removeChild(this);
		}
	};
	
	/**
	 * On frame handler, updates position, runs tweens
	 */
	Sprite_EventIndicator.prototype.update = function()
	{
		Sprite_Base.prototype.update.call(this);

		// No need to update if not visible
		if (!this.visible)
		{
			return;
		}
		
		this.updatePosition();
		this.updateTweens();
	};
	
	/**
	 * Updates the position of the indicator
	 */
	Sprite_EventIndicator.prototype.updatePosition = function()
	{
		this.x = this._event.screenX() + this._offsetX;
		this.y = this._event.screenY() + this._offsetY;
	};
	
	/**
	 * Updates indicator's tweens
	 */
	Sprite_EventIndicator.prototype.updateTweens = function()
	{
		var i = this._tweenCount;
		while (i-- > 0)
		{
			this._tweens[i].update();
		}
	};
	
	/**
	 * Adds a Tween to the indicator, will update when indicator's update method is called
	 * @param {Tween} tween Tween to add
	 */
	Sprite_EventIndicator.prototype.addTween = function(tween)
	{
		this._tweenCount++;
		this._tweens.push(tween);
	};
	
	/**
	 * Removes a Tween from the indicator
	 * @param {Tween} tween Tween to remove
	 */
	Sprite_EventIndicator.prototype.removeTween = function(tween)
	{
		var i = this._tweens.indexOf(tween);
		if (i > -1)
		{
			this.removeTweenAt(i);
		}
	};
	
	/**
	 * Removes the tween at the specified index
	 * @param {Number} index
	 */
	Sprite_EventIndicator.prototype.removeTweenAt = function(index)
	{
		if (index < this._tweenCount)
		{
			this._tweenCount--;
			this._tweens.splice(index, 1);
		}
	};
	
	var Tween = SRCrazy.Classes.Tween;
	
	/**
	 * Creates default tweens hwere applicable, clears down those that are not
	 * @param {Object} data
	 */
	Sprite_EventIndicator.prototype.createTweens = function(data)
	{
		var destroyTween = function(spr, name)
		{
			// Reset the state beforehand?
			var t = spr._tweenLookup[name];
			t.start();
			
			t.destroy();
			spr.removeTween(t);
			delete spr._tweenLookup[name];
		};
		
		var createTween = function(spr, name, params)
		{
			// Remove old tween
			if (spr._tweenLookup[name])
			{
				destroyTween(spr, name);
			}

			// Add new one?
			if (params.enabled)
			{
				var t;
				
				switch (name)
				{
					case "hue":
						t = spr.createHueTween(params);
						break;
					
					case "scale.x":
					case "scale.y":
						var spl = name.split('.')[1];
						t = spr.createTargetTween(spr.scale, spl, params);
						break;
					
					default:
						t = spr.createStandardTween(name, params);
						break;
				}
				
				// We've got one, add it to the list
				if (t)
				{
					t.start();
					spr.addTween(t);
					spr._tweenLookup[name] = t;
				}
			}
		};
		
		createTween(this, "_offsetX", data.tweenPosX);
		createTween(this, "_offsetY", data.tweenPosY);
		createTween(this, "scale.x", data.tweenScaleX);
		createTween(this, "scale.y", data.tweenScaleY);
		createTween(this, "z", data.tweenLayerOrder);
		createTween(this, "opacity", data.tweenOpacity);
		createTween(this, "hue", data.tweenHue, data);
	};
	
	Sprite_EventIndicator.prototype.createStandardTween = function(property, params)
	{
		return this.createTargetTween(this, property, params);
	};
	
	Sprite_EventIndicator.prototype.createTargetTween = function(target, property, params)
	{
		var t = new Tween(target, params.duration, $core.TweenEasing[params.easing]);
		t.addProperty(property, params.start, params.end);
		t.onCompleteCallback = $core.TweenCompleteBehaviour[params.onComplete] || $core.TweenCompleteBehaviour.remove || t.onCompleteCallback;
		
		return t;
	};
	
	Sprite_EventIndicator.prototype.createHueTween = function(params)
	{
		var bmp = this.bitmap;
		var hueUpdate = function(hue)
		{
			bmp.rotateHue(hue);
		};

		var t = new Tween({ tweenContainer: this }, params.duration, $core.TweenEasing[params.easing]);
		t.addProperty("hue", params.start, params.end, null, hueUpdate);
		t.onCompleteCallback = $core.TweenCompleteBehaviour[params.onComplete] || $core.TweenCompleteBehaviour.remove || t.onCompleteCallback;
		
		return t;
	};
	
	
	// Add to global namespace
	SRCrazy.Classes.Sprite_EventIndicator = Sprite_EventIndicator;
	
})(SRCrazy.EventIndicators, SRCrazy.Core);