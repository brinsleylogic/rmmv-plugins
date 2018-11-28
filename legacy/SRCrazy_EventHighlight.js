///////////////////////////////////////////////////////////////////////////////
/* S_Rank_Crazy's Event Highlighting
 * ============================================================================
 * RPG Maker MV
 * SRCrazy_EventHighlight.js
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
 * 2016-11-23
 * - Version 1.3
 * - Deprecated plugin command "SRCrazy_EventHighlight highlight"
 *   - Officially deprecated but still supported, may be removed in the future
 *   - Should now use "SRCrazy_EventHighlight event" instead, or other shorthand
 * - Updated documentation
 * - Groups can now be defined with their own duration overrides
 *
 * 2016-09-23
 * - Version 1.2
 * - Added support for defining group colours
 *
 * 2016-09-23
 * - Version 1.1
 * - Added support for restoring from save-state
 *
 * 2016-09-21
 * - Version 1.0
 * - Release
 * 
 * ============================================================================
 */

///////////////////////////////////////////////////////////////////////////////
/*:
 * @author S_Rank_Crazy
 * @plugindesc v1.3 Highlights events using their defined properties
 * <SRCrazy_EventHighlight>
 * 
 * @param Duration
 * @desc How long it takes for the highlight to fade away
 * default: 60
 * @default 60
 * 
 * @param Use Seconds
 * @desc Tells plugin to use seconds (instead of frames) for Duration
 * default: false
 * @default false
 * 
 * @help============================================================================
 *                       S_Rank_Crazy's Event Highlighting
 * ============================================================================
 * This plugin provides functionality to highlight events (or groups of them)
 * using event-specific colour/grouping values.
 * 
 * * Requires SRCrazy_Core plugin.
 * 
 * This plugin should be placed below the SRCrazy Core plugin in the Plugin
 * Manager. If you're using the MVCommons or PluginManagement plugins then
 * any dependency issues will be output as errors when the game loads.
 * 
 * All SRCrazy plugins are rename safe - you can rename the file and it'll still
 * work. All parameters and commands are case-safe (no need to worry about
 * case-sensitive input) unless specifically stated. This doesn't include
 * Comment Tags or file names/paths; they are still case sensitive.
 * 
 * MVCommons supported but not required for use.
 * 
 * 
 * ============================================================================
 * FEATURES
 * 
 * * Show a fading colour over an event sprite to make it stand out!
 * * Specify colours for the highlight of an event
 * * Group events in order to highlight related events
 * * Give groups their own overriding colour and/or duration
 * * Use frames or seconds to manage the duration
 * 
 * 
 * ============================================================================
 * PLUGIN COMMANDS
 * 
 * If this plugin is active you can use the following commands:
 * 
 * SRCrazy_EventHighlight event [group]
 *     Highlights all valid events (or specified group)
 * 
 * eventhighlight [group]
 *     Shorthand of above plugin command
 * 
 * SRCrazy_EventHighlight group red,green,blue,grey [duration]
 *     Creates/updates a highlight group's definition
 * 
 * grouphighlight group red,green,blue,grey [duration]
 *     Shorthand of above plugin command
 * 
 * SRCrazy_EventHighlight setgroup eventId group
 *     Assigns the specified event to the supplied group (removes from previous
 *     group
 * 
 * sethighlightgroup eventId group
 *     Shorthand of above plugin command
 * 
 * 
 * ============================================================================
 * COMMENT TAGS
 * 
 * The following tags can be used to customise an event's highlight colour and
 * group name. To use, add to a COMMENT in an event's page where you want those
 * settings to be applied.
 * 
 * <eventHighlight: [group] [red,green,blue,grey]>
 *    Sets the colour of the highlight for the event.
 *    
 * * group - Optional. The highlighting group this event belongs to.
 * 
 * * Highlight colour (optional if using group highlight)
 *    * red - The red value to use for the tint (-255 - 255)
 *    * green - The red value to use for the tint (-255 - 255)
 *    * blue - The red value to use for the tint (-255 - 255)
 *    * grey - The red value to use for the tint (0 - 255)
 * 
 * Eg:
 *    <eventHighlight: 255,0,0,0>
 *    Sets the events highlight colour to red
 *    
 *    <eventHighlight: item>
 *    Sets the events group to "item", relies on a group definition being set
 *    using the grouphighlight Plugin Command
 *    
 *    <eventHighlight: item 255,0,0,0>
 *    Sets the events highlight colour to red and adds to the group "item"
 * 
 * 
 * ============================================================================
 */

///////////////////////////////////////////////////////////////////////////////
//							Plugin Management
// [CODE]	Here
// LKUP		Top

//
var Imported = Imported || {};

// Set up namespace and plugin vars
var SRCrazy = SRCrazy || {};
SRCrazy.EventHighlight = SRCrazy.EventHighlight || {};

(function($, $core)
{
	"use strict";
	
	$core.registerPlugin($, "SRCrazy_EventHighlight", "1.3", "2016-11-23", true, ["SRCrazy_Core"]);
	
	// Setup plugin variables
	$._duration = Number($.Params["Duration"] || 60);
	$._isRealTime = ($.Params["Use Seconds"].toLowerCase() === "true");
	
	
	///////////////////////////////////////////////////////////////////////////
	//                           Data Storage
	// [INIT]	Here
	// [LKUP	Top
	
	$._highlightData = null;
	$._highlightSprites = null;
	
	/**
	 * Resets highlight reference lookups
	 */
	$.newHighlightLookup = function()
	{
		$._highlightData = { groups: {} };
		$._highlightSprites = {};
	};
	
	/**
	 * Retrieves the stored reference data for the supplied event
	 * @param {type} eventId ID of the event
	 * @returns {Object} { tone, sprite, flaggedForRemoval }
	 */
	$.getEventData = function(eventId)
	{
		// check we have the event reference
		if ($._highlightData[eventId])
		{
			return $._highlightData[eventId];
		}
		
		return null;
	};
	
	/**
	 * Adds an event reference for highlighting
	 * @param {type} eventId ID of the event to track
	 * @param {Array} tone Tone values used for applying and updating the highlight effect
	 * @param {String} group (optional) Highlighting group this event belongs to
	 */
	$.addEvent = function(eventId, tone, group)
	{
		group = group || '';
		
		$._highlightData[eventId] = {
			eventId: eventId
			, group: group
			, tone: tone
		};
		
		$.addToGroup(group, eventId);
	};
	
	/**
	 * Removes the event reference for highlighting
	 * @param {type} eventId ID of the event to stop tracking
	 */
	$.removeEvent = function(eventId)
	{
		// check we have the event reference
		if ($._highlightData[eventId])
		{
			// remove group reference
			var data = $._highlightData[eventId];
			$.removeFromGroup(data.group, eventId);
			
			// remove sprite stuff
			$.removeSprite(eventId);
			
			// remove from stored events
			delete $._highlightData[eventId];
		}
	};
	
	/**
	 * Flags the supplied event for removal, removes now if possible
	 * @param {type} eventId ID of the event to stop tracking
	 * @param {Boolean} force (optional) Indicates if this should be removed regardless
	 */
	$.flagForRemoval = function(eventId, force)
	{
		if ($._highlightData[eventId])
		{
			var data = $._highlightData[eventId];
			var sprite = $.getSprite(eventId);
			
			// just remove it now
			if (force === true || !sprite || !sprite._highlightActive)
			{
				$.removeEvent(eventId);
			}
			// mark is for removal later
			else
			{
				data.flaggedForRemoval = true;
			}
		}
	};
	
	/**
	 * Retrieves the stored sprite reference to the supplied eventId
	 * @param {type} eventId ID of eventwe need the sprite for
	 * @returns {Sprite_Base}
	 */
	$.getSprite = function(eventId)
	{
		if ($._highlightSprites[eventId])
		{
			return $._highlightSprites[eventId];
		}
		
		return null;
	};
	
	/**
	 * Adds a sprite to lookup linked to supplied event
	 * @param {Object} data Data of the event to add sprite for
	 * @param {Sprite_Base} sprite Sprite object to add reference for
	 */
	$.addSprite = function(data, sprite)
	{
		if (data && sprite)
		{
			$._highlightSprites[data.eventId] = sprite;
		}
	};
	
	/**
	 * Removes highlight properties from sprite and removes reference
	 * @param {type} eventId ID of event to remove sprite for
	 */
	$.removeSprite = function(eventId)
	{
		var sprite = $.getSprite(eventId);
		if (sprite)
		{
			delete sprite._highlightOriginal;
			delete sprite._highlightStartTime;
			delete sprite._highlightFrameCount;
			delete sprite._highlightDuration;
			delete sprite._highlightActive;
			delete sprite._highlightTarget;
			delete sprite._highlightProgress;

			delete $._highlightSprites[eventId];
		}
	};
	
	/**
	 * Retrieves group definition
	 * @param {type} group Name of the group to get data for
	 * @returns {Object}
	 */
	$.getGroup = function(group)
	{
		if ($._highlightData.groups[group])
		{
			return $._highlightData.groups[group];
		}
		
		return null;
	};
	
	/**
	 * Adds a group definition for highlighting
	 * @param {String} group Highlighting group to add
	 * @param {Array} tone Tone values used for applying and updating the highlight effect
	 * @param {int} duration Time (or frames) it takes for effect to play out over
	 * @return {Object} New group definition
	 */
	$.addGroup = function(group, tone, duration)
	{
		tone = parseTone(tone);
		
		var grp = $.getGroup(group);
		if (grp)
		{
			grp.tone = tone;
		}
		else
		{
			grp = { name: group, tone: tone, ids: [] };
			$._highlightData.groups[group] = grp;
		}
		
		if (duration)
		{
			grp.duration = Number(duration);
		}
		else
		{
			delete grp.duration;
		}
		
		return grp;
	};
	
	/**
	 * Adds an event to specified highlighting group
	 * @param {String} group Highlighting group this event belongs to
	 * @param {type} eventId ID of the event to track
	 */
	$.addToGroup = function(group, eventId)
	{
		var grp = $.getGroup(group);
		
		// add group if doesn;t exist
		if (!grp)
		{
			grp = $.addGroup(group);
		}
		
		// add the event
		grp.ids.push(eventId);
	};
	
	$.removeFromGroup = function(group, eventId)
	{
		var grp = $.getGroup(group);
		
		if (grp)
		{
			var i = grp.ids.indexOf(eventId);
			if (i > -1)
			{
				grp.ids.splice(i, 1);
			}
		}
	};
	
	$.getHighlightColour = function(group, defaultColour)
	{
		if (group && group.tone)
		{
			return group.tone;
		}
		
		return (defaultColour) ? defaultColour : null;
	};
	
	$.getHighlightDuration = function(group)
	{
		if (group && group.duration)
		{
			return group.duration;
		}
		
		return $._duration;
	};
	
	function parseTone(settings)
	{
		if (settings)
		{
			settings = settings.split(',');

			var r = Number(settings[0] || 0);
			var g = Number(settings[1] || 0);
			var b = Number(settings[2] || 0);
			var c = Number(settings[3] || 0);

			return [r, g, b, c];
		}
		
		return null;
	}
	
	
	///////////////////////////////////////////////////////////////////////////
	//                      Effect Activation
	// [INIT]	Here
	// [LKUP	Top
	
	$.highlightGroup = function(group)
	{
		var grp = $.getGroup(group);
		
		// process group if we have it
		if (grp)
		{
			var list = grp.ids;
			var i = list.length;
			
			var id;
			var data;
			var sprite;
			var tone;
			var duration = $.getHighlightDuration(grp);
			
			while (i-- > 0)
			{
				id = list[i];
				data = $.getEventData(id);
				
				// start the effect
				if (data && !data.flaggedForRemoval)
				{
					sprite = $.getSprite(id);
					
					if (sprite)
					{
						tone = $.getHighlightColour(grp, data.tone);
						sprite.startHighlight(tone, duration);
					}
				}
				// this shouldn't be here, remove it
				else
				{
					$.flagForRemoval(id);
				}
			}
		}
		// group not found
		else
		{
			console.warn($._ALIAS + " :: group not found: " + group);
		}
	};
	
	$.highlightAll = function()
	{
		var list = $._highlightData.groups;
		for (var group in list)
		{
			if (list.hasOwnProperty(group))
			{
				$.highlightGroup(group);
			}
		}
	};
	
	function highlight(group)
	{
		if (group === undefined || group === null)
		{
			$.highlightAll();
		}
		else
		{
			$.highlightGroup(group);
		}
	}
	
	
	///////////////////////////////////////////////////////////////////////////
	//                        Initialisation
	// [INIT]	Here
	// [LKUP	Top
	
	/**
	 * When map loads
	 */
	var Override_setupEvents = Game_Map.prototype.setupEvents;
	Game_Map.prototype.setupEvents = function()
	{
		$.newHighlightLookup();
		Override_setupEvents.call(this);
	};
	
	/**
	 * When event's page changes, detect display state
	 */
	var Override_setupPage = Game_Event.prototype.setupPage;
	Game_Event.prototype.setupPage = function()
	{
		Override_setupPage.call(this);
		
		var id = this.eventId();
		var highlightSettings = this.getCommentParameter("eventHighlight");
		
		// no highlighting tags, remove from the list
		if (!highlightSettings)
		{
			$.flagForRemoval(id);
			return;
		}
		
		var group;
		highlightSettings = highlightSettings.split(' ');
		
		// get group and highlight values
		if (highlightSettings.length === 2)
		{
			group = highlightSettings[0];
			highlightSettings = highlightSettings[1];
		}
		else
		{
			var s = highlightSettings[0];
			
			// assume it's the group name if no commas present
			if (s.indexOf(',') < 0)
			{
				group = s;
				highlightSettings = null;
			}
			else
			{
				highlightSettings = s;
				group = null;
			}
		}
		
		// get colour vars
		var tone = parseTone(highlightSettings);
		
		// add to list of highlightable objects
		$.addEvent(id, tone, group);
	};
	
	
	///////////////////////////////////////////////////////////////////////////
	//                   Sprite_Character Changes
	// [SPRT]	Here
	// [LKUP	Top
	
	var Override_SpriteCharacter_setCharacter = Sprite_Character.prototype.setCharacter;
	Sprite_Character.prototype.setCharacter = function(character)
	{
		Override_SpriteCharacter_setCharacter.call(this, character);
		
		// check this is an event sprite
		if (character._eventId)
		{
			// grab the relevant highlight data
			var id = character._eventId;
			var data = $.getEventData(id);
			
			// make sure we actually have it
			if (data)
			{
				this._highlightOriginal = this._colorTone;
				$.addSprite(data, this);
			}
		}
	};
	
	/**
	 * Sets up starting to play the highlight effect
	 * @param {Array} tone Event's effect tone
	 * @param {int} duration Event's effect duration
	 */
	Sprite_Character.prototype.startHighlight = function(tone, duration)
	{
		if (this._highlightActive || !this._highlightOriginal)
		{
			return;
		}
		
		if ($._isRealTime)
		{
			this._highlightStartTime = timeNowInSeconds();
		}
		else
		{
			this._highlightFrameCount = 0;
		}
		
		this._highlightActive = true;
		this._highlightDuration = duration;
		this._highlightTarget = tone;
		this._highlightProgress = tone.clone();
		
		this.setColorTone(tone);
	};
	
	var Override_SpriteCharacter_updateOther = Sprite_Character.prototype.updateOther;
	Sprite_Character.prototype.updateOther = function()
	{
		Override_SpriteCharacter_updateOther.call(this);
		
		// update the highlight and apply if active
		if (this._highlightActive)
		{
			var active = this.updateHighlight();
			this.setColorTone(this._highlightProgress);
			
			this._highlightActive = active;
			
			if (!active)
			{
				var id = this._character._eventId;
				var data = $.getEventData(id);
				if (data && data.flaggedForRemoval)
				{
					$.removeEvent(id);
				}
			}
		}
	};
	
	/**
	 * Manages progress of the highlight effect
	 */
	Sprite_Character.prototype.updateHighlight = function()
	{
		var progress = 0;
		
		// if we're updating in real-time
		if ($._isRealTime)
		{
			// scale over our start and end times
			var now = timeNowInSeconds();
			progress = (now - this._highlightStartTime) / this._highlightDuration;
		}
		// if we're updating by frames
		else
		{
			// scale over the frame count
			progress = ++this._highlightFrameCount / this._highlightDuration;
		}
		
		// update the _highlightProgress values
		if (progress < 1)
		{
			var a = this._highlightProgress;
			var i = a.length;
			
			var diff;
			var target;
			while (i-- > 0)
			{
				target = this._highlightTarget[i];
				diff = this._highlightOriginal[i] - target;
								
				a[i] = target + (diff * progress);
			}
			
			return true;
		}
		
		// set to final value
		this._highlightProgress = this._highlightOriginal;
		
		return false;
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
		var cmd = command.toLowerCase();
		if (cmd === $._ALIAS.toLowerCase())
		{
			// Check for arguments being passed
			if (args && args.length > 0)
			{
				// Check command
				cmd = args.shift().toLowerCase();
				switch (cmd)
				{
					case "highlight":
					case "event":
						cmd = "eventhighlight";
						break;
						
					case "group":
						cmd = "grouphighlight";
						break;
						
					case "setgroup":
						cmd = "sethighlightgroup";
						break;
				}
			}
		}
		
		// Is it the basic highlight command?
		if (cmd === "eventhighlight")
		{
			highlight(args[0]);
		}
		// Is it the add group command?
		else if (cmd === "grouphighlight")
		{
			$.addGroup(args[0], args[1], args[2]);
		}
		// Is it the set group command?
		else if (cmd === "sethighlightgroup")
		{
			var data = $.getEventData(args[0]);
			var group = $.getGroup(args[1]);
			if (data && group)
			{
				$.removeFromGroup(data.group, data.eventId);
				
				data.group = group.name;
				$.addToGroup(data.group, data.eventId);
			}
		}
		// Call overridden method
		else
		{
			Override_pluginCommand.call(this, command, args);
		}
	};
	
	
	///////////////////////////////////////////////////////////////////////////
	//						  Save-state Additions
	// [SAVE]	Here
	// LKUP		Top
	
	var Override_onSave = $core.onSaveData;
	$core.onSaveData = function(data)
	{
		Override_onSave();
		
		data[$._ALIAS] = $._highlightData;
	};
	
	var Override_onLoad = $core.onLoadData;
	$core.onLoadData = function(data)
	{
		Override_onLoad(data);
		
		$._highlightData = data[$._ALIAS];
		$._highlightSprites = {};
	};
	
})(SRCrazy.EventHighlight, SRCrazy.Core);
