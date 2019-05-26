///////////////////////////////////////////////////////////////////////////////
/* S_Rank_Crazy's Core Plugin
 * ============================================================================
 * RPG Maker MV
 * SRCrazy_Core.js
 * 
 * ============================================================================
 * No personal credit required, but always appreciated.
 * Free for personal and commercial use.
 * 
 * ============================================================================
 * 
 * 2016-09-23
 * - Version 1.2
 * - Added support for restoring from save-state
 * 
 * 2016-09-21
 * - Version 1.1.3
 * - Added function to retrieve system timestamp (in seconds)
 * 
 * 2016-03-17
 * - Version 1.1.2
 * - Added more easing functions: quad, cubic, sine, elastic
 * 
 * 2016-01-29
 * - Version 1.1.1
 * - Added function to check if a string exists in any comments on a page
 * - Added additional functions for Input.isTriggered querying
 * - Added Bitmap drawing methods to Sprite_Base
 * 
 * 2016-01-04
 * - Version 1.1.0
 * - Added support for drawing images with hue shift
 * - Added Tween class
 *   - A single tween can have multiple properties
 *   - Added per property easing
 *   - Added some built in completion handlers
 *     - oscillate (constantly runs from start to end and back to start)
 *     - repeat (constantly runs from start to end)
 *     - remove (removes the tween from the target)
 *       - Requires removeTween method to exist on target
 *
 * 2016-01-04
 * - Version 1.0.0
 * - Exit game function
 * - Centralised event-page comment querying
 * 
 * ============================================================================
 */

///////////////////////////////////////////////////////////////////////////////
/* ============================================================================
 *                         Class Navigation
 * ============================================================================
 * Search file for indexer on left side to navigate.
 * E.g. "[LKUP]" to navigate here.
 * 
 * ============================================================================
 * [LKUP]	Here
 * 
 * [CODE]	Start of code, plugin management happens here
 * 
 * [INIT]	Plugin initialisation, where plugin's core code starts
 * 
 * [SAVE]	Save-state Additions
 * 
 * [PLGN]	Plugin Commands
 * 
 * [INPT]	Input modifications
 * 
 * [SPRT]	Sprite_Base modifications
 * 
 * [EVNT]	Game_Event modifications
 * 
 * [TWEN]	Tween Class
 * 
 * ============================================================================
 */ 

///////////////////////////////////////////////////////////////////////////////
/*:
 * @author S_Rank_Crazy
 * @plugindesc v1.2 Required for most SRCrazy scripts. Provides some additional functions to standard classes.
 * <SRCrazy_Core>
 * 
 * @param Cache Event Commands
 * @desc Caches event commands when queried, speeds up repeated retrieval processes
 * @default true
 * 
 * @help============================================================================
 *                       S_Rank_Crazy's Core Plugin
 * ============================================================================
 * This plugin provides some useful functions to be used by other plugins or by
 * events (if applicable).
 * 
 * This plugin should be placed above most other SRCrazy plugins in the Plugin
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
 *============================================================================
 * FEATURES
 * 
 * Generic
 * * Exit game function with optional fade
 * * Easily add data to save state using a method override
 * 
 * Game_Event [Changes]
 * * Retrieve all comments on an event's page
 * * Multiline comment support for comment tags
 * * Easily query a parameter's value from a list of comments
 * * Cache event commands to speed up queries
 * 
 * Tweens
 * * Delegate functions for onUpdate and onComplete of tween progress
 * * Support for custom easing functions
 *   - Easing functions can be applied on a per tween or per property basis
 *   - A single tween can have multiple properties controlled by it
 * 
 * 
 * ============================================================================
 * PLUGIN COMMANDS
 * 
 * If this plugin is active you can use the following commands:
 * 
 * Game exit
 *     Exits (closes) the game.
 * 
 * ============================================================================
 */


///////////////////////////////////////////////////////////////////////////////
//                         Plugin Management
// [CODE]	Here
// [LKUP	Top

var Imported = Imported || {};

// Set up namespace and plugin vars
var SRCrazy = SRCrazy || {};
SRCrazy.Classes = SRCrazy.Classes || {};
SRCrazy.Core = SRCrazy.Core || {};

// Function to get the current time in seconds
function timeNowInSeconds()
{
	return new Date().getTime() / 1000;
}

// Function to register the plugin, extract paramaters and other generic initialisation tasks
SRCrazy.Core.registerPlugin = function($, alias, version, versionDate, requireParameters, dependencies)
{
	// search for plugin by alias, this way renaming files isn't problematic
	var pluginList = $plugins.filter(function(plugin)
	{
		return (plugin.description.indexOf('<' + alias + '>') >= 0);
	});
	
	// This is our plugin
	var plugin = pluginList[0];
	
	if (!plugin)
	{
		throw new Error("Trying to regist plugin " + alias + " but not found in plugin list.");
	}
	
	// If we need parameters, make sure we have them
	if (requireParameters && plugin.parameters.length === 0)
	{
		throw new Error("Couldn't find " + alias + " parameters.");
	}
	
	// Set plugin variables
	$._ALIAS = alias;
	$._VERSION = version;
	$._VERSION_DATE = versionDate;
	$.Params = plugin.parameters;
	
	// Register plugin
	if(Imported["MVCommons"] || Imported["PluginManagement"])
	{
		var author = [
		{
			email: "bahamutsblade@hotmail.com",
			name: "Brinsley Blackwood (S_Rank_Crazy)",
			website: ""
		}];
		
		var success = PluginManager.register(alias, version, plugin.description, author, versionDate, dependencies);
		
		if(success === undefined)
		{
			throw new Error("Unable to load " + alias + " due to mising dependencies!");
		}
		else if (success === false)
		{
			PluginManager.printPlugin(alias)
			throw new Error("Unable to load " + alias + " due to registration failure! Is there another version running?");
		}
	}
	// Can't register so manually import
	else
	{
		Imported[alias] = $._VERSION;
	}
	
};


///////////////////////////////////////////////////////////////////////////////
//							Plugin Initialisation
// [INIT]	Here
// LKUP		Top

(function($)
{
	"use strict";
	
	$.registerPlugin($, "SRCrazy_Core", "1.2", "2016-09-23", true);
	
	$.useCommandCache = !($.Params["Cache Event Commands"].toLowerCase() === "false");
	
	/**
	 * Converts an angle from degrees to radians
	 * @param {type} angle Angle in dgrees
	 * @returns {Number} Angle in radians
	 */
	$.getRadians = function(angle)
	{
		return angle * (Math.PI / 180);
	};
	
	/**
	 * Closes the game window with optional fade beforehand
	 * @param {Boolean} fade
	 */
	$.exitGame = function(fade)
	{
		if (!!fade && SceneManager._scene)
        {
			SceneManager._scene.fadeOutAll();
		}
		
        SceneManager.exit();
	};
		
	/**
	 * Retrieves Bitmap from source folder
	 * @param {String} filename Name of image file to retrieve
	 * @param {String} path Folder path from inside project's img folder, defaults to 'system'
	 * @param {Number} hue Hue value for the image
	 * @returns {Bitmap}
	 */
	$.getImage = function(filename, path, hue)
	{
		path = path || "system";
		
		// No filename passed, return null
		if (!filename)
		{
			return null;
		}
		
		// Use the correct icon set
		return ImageManager.loadBitmap("img/" + path + "/", filename, hue, true);
	};
	
	/**
	 * Loads source image from folder in to Bitmap object
	 * @param {Bitmap} bitmap Bitmap to draw image in to
	 * @param {Rect} sampleRect Rect that defines what area of the source image to draw
	 * @param {String} filename Name of image file to retrieve
	 * @param {String} filePath (optional) Folder path from inside project's img folder, defaults to 'system'
	 * @param {Number} hue Hue value for the image
	 */
	$.drawImageToBitmap = function(bitmap, sampleRect, filename, filePath, hue)
	{
		// Ensure we have a target Bitmap
		bitmap = bitmap || new Bitmap(sampleRect.width, sampleRect.height);
		
		// Retrieve source image
		var sourceImage = this.getImage(filename, filePath, hue);
		
		var doDrawToBitmap = function()
		{
			bitmap.blt(sourceImage, sampleRect.x, sampleRect.y, sampleRect.width, sampleRect.height, 0, 0);
		};
		
		if (sourceImage._isLoading)
		{
			sourceImage.addLoadListener(doDrawToBitmap);
		}
		else
		{
			doDrawToBitmap();
		}	
	};
	
	/**
	 * Draws section of source image to Bitmap object based on a uniform spacing index
	 * @param {Bitmap} bitmap Bitmap to draw image in to
	 * @param {Number} index Index of image in source
	 * @param {String} filename Name of image file to retrieve
	 * @param {String} filePath (optional) Folder path from inside project's img folder, defaults to 'system'
	 * @param {Number} hue Hue value for the image
	 */
	$.blitToBitmap = function(bitmap, index, filename, filePath, hue)
	{
		var w = bitmap.canvas.width;
		var h = bitmap.canvas.height;
		
		// Get position of target in source image
		var drawRect = {};
		drawRect.x = (index % 16) * w;
		drawRect.y = Math.floor(index / 16) * h;
		drawRect.width = w;
		drawRect.height = h;
		
		$.drawImageToBitmap(bitmap, drawRect, filename, filePath, hue);
	};
	
	///////////////////////////////////////////////////////////////////////////
	//						  Save-state Additions
	// [SAVE]	Here
	// LKUP		Top
	
	var Override_DataManager_makeSaveContents = DataManager.makeSaveContents;
	DataManager.makeSaveContents = function()
	{
		var data = Override_DataManager_makeSaveContents.call(this);
		$.onSaveData(data);
		return data;
	};
	
	var Override_DataManager_extractSaveContents = DataManager.extractSaveContents;
	DataManager.extractSaveContents = function(data)
	{
		Override_DataManager_extractSaveContents.call(this, data);
		$.onLoadData(data);
	};
	
	/**
	 * Enables plugins to easily hook in to the save data event
	 * @param {Object} data Data object being saved
	 */
	$.onSaveData = function(data){ };
	
	/**
	 * Enables plugins to easily hook in to the load data event
	 * @param {Object} data Data object being loaded
	 */
	$.onLoadData = function(data){ };
	
	
	///////////////////////////////////////////////////////////////////////////
	//							Plugin Commands
	// [PLGN]	Here
	// LKUP		Top
	
	var Override_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args)
	{
		// do we have arguements?
		if (args && args.length > 0)
		{
			var cmdLow = command.toLowerCase();

			switch (cmdLow)
			{
				// Is it a command for this plugin?
				case $._ALIAS.toLowerCase():
					var cmd = args.shift().toLowerCase();
					switch (cmd)
					{
						default:
							break;
					}
					break;

				// Commands we added to game
				case "game":
					var cmd = args.shift().toLowerCase();
					switch (cmd)
					{
						case "exit":
							$.exitGame();
							break;
						
						default:
							break;
					}
					break;

				// Call overridden method
				default:
					Override_pluginCommand.call(this, command, args);
					break;
			}
		}
		// No arguyments passed, we'll just invoke the original method
		else
		{
			Override_pluginCommand.call(this, command, args);
		}
	};
	
})(SRCrazy.Core);


///////////////////////////////////////////////////////////////////////////////
//						Additional Input Functionality
// [INPT]	Here
// LKUP		Top

(function($)
{
	/**
	 * List of all valid input values
	 */
	$.allInputValues = [
		"ok", "cancel", "shift", "menu"
		, "up", "down", "left", "right"
		, "pageup", "pagedown"
		, "escape", "control", "tab", "debug"
	];
	
	/**
	 * Indicates if any of the valid input values have been triggered
	 * @param {Array} inputs (optional) A list of input to check, if not supplied, checks all valid inputs
	 * @return {Boolean}
	 */
	$.isAnyTriggered = function(inputs)
	{
		return (this.getAllTriggered(inputs).length > 0);
	};
	
	/**
	 * Retrieves an array of all triggered inputs
	 * @param {Array} inputs (optional) A list of input to check, if not supplied, checks all valid inputs
	 * @returns {Array}
	 */
	$.getAllTriggered = function(inputs)
	{
		inputs = inputs || this.allInputValues;
		
		var list = [];
		
		var i = inputs.length;
		while (i-- > 0)
		{
			if (this.isTriggered(inputs[i]))
			{
				list.push(inputs[i]);
			}
		}
		
		return list;
	};
	
})(Input);


///////////////////////////////////////////////////////////////////////////////
//						Additional Sprite_Base Functionality
// [SPRT]	Here
// LKUP		Top

(function($, $core)
{
	/**
	 * Removes sprite from parent
	 */
	$.removeSelf = function()
	{
		if (this.parent)
		{
			this.parent.removeChild(this);
		}
	};
	
	/**
	 * Copies a Sprite's Bitmap contents in to this Sprite
	 * @param {type} sprite Target sprite to draw contents from
	 */
	$.copyImage = function(sprite)
	{
		var r = sprite.bitmap.canvas;
		this.bitmap = new Bitmap(r.width, r.height);
		this.bitmap.blt(sprite.bitmap, 0, 0, r.width, r.height, 0, 0);
	};
	
	$.drawImage = function(width, height, index, filepath, filename)
	{
		this.bitmap = new Bitmap(width, height);
		$core.blitToBitmap(this.bitmap, index, filename, filepath);
	};
	
	$.isTouchTriggered = function()
	{
		if (TouchInput.isTriggered())
		{
			return isTouchOverSprite(this);
		}
		
		return false;
	};
	
	function isTouchOverSprite(sprite)
	{
		var offsetX = sprite.width * sprite.anchor.x;
		var offsetY = sprite.height * sprite.anchor.y;
		var x = TouchInput.x;
		var y = TouchInput.y;

		var node = sprite;
		while (node)
		{
			x -= node.x;
			y -= node.y;

			node = node.parent;
		}

		return (-offsetX <= x && x <= sprite.width - offsetX)
			&& (-offsetY <= y && y <= sprite.height - offsetY);
	}
	
})(Sprite_Base.prototype, SRCrazy.Core);


///////////////////////////////////////////////////////////////////////////////
//						Additional Game_Event Functionality
// [EVNT]	Here
// LKUP		Top

/**
 * Add functions to Game_Event class
 * @param {Game_Event} $
 */
(function($)
{
	$._cachedCommandLists = [];
	$._useCommandCache = SRCrazy.Core.useCommandCache;
	
	/**
	 * Clears cached commands from event page
	 * @param {Number} pageIndex Index of page to clear cached commands for, if none passed, will clear cache for all pages
	 */
	$.clearCachedCommands = function(pageIndex)
	{
		if (pageIndex || pageIndex === 0)
		{
			delete $._cachedCommandLists[pageIndex];
		}
		else
		{
			$._cachedCommandLists = [];
		}
	};
	
	/**
	 * Retrieves a list of commands on a page matching supplied event codes
	 * @param {type} pageIndex Index of page from which to retrieve commands. Uses current page by default.
	 * @param {Array} eventCodes List of event code ids to retrieve
	 * @returns {Array} List of event commands
	 */
	$.getPageCommands = function(pageIndex, eventCodes)
	{
		var page = null;
		
		// Use supplied index
		if (pageIndex === 0 || Number(pageIndex) > 0)
		{
			page = this.event().pages[pageIndex];
		}
		// No index sent in, used current
		else
		{
			page = this.page();
		}
		
		// No page? Just exit
		if (!page)
		{
			return;
		}
		
		// None specified, return all
		if (!eventCodes || eventCodes.length === 0)
		{
			return page.list;
		}
		
		// Container for all commands we're looking to return
		var commands = [];
		var codesToSearchFor = [];
		
		// Search cached pages
		if ($._useCommandCache)
		{
			var cache = $._cachedCommandLists[pageIndex] || ($._cachedCommandLists[pageIndex] = []);

			var codeCount = eventCodes.length;

			for (var i = 0; i < codeCount; i++)
			{
				// Add commands that 
				if (cache.contains(eventCodes[i]))
				{
					commands = commands.concat(cache[eventCodes[i]]);
				}
				// None found for this code, grab them in the next loop
				else
				{
					codesToSearchFor.push(eventCodes[i]);
				}
			}
		}
		// Still need a list of event codes to search for
		else
		{
			codesToSearchFor = eventCodes;
		}
		
		// Loop list for what we're looking for
		var list = page.list;
		var listCount = list.length;
		for (var i = 0; i < listCount; i++)
		{
			var cmd = list[i];
			if (codesToSearchFor.contains(cmd.code))
			{
				// Cache this command
				if ($._useCommandCache)
				{
					if (!cache[cmd.code])
					{
						cache[cmd.code] = [];
					}

					cache[cmd.code].push(cmd);
				}
				
				commands.push(cmd);
			}
		}
		
		return commands;
	};
	
	/**
	 * Retrieves a list of commands on all pages matching the supplied event codes
	 * @param {Array} eventCodes List of event code ids to retrieve
	 * @returns {Array} List of event commands
	 */
	$.getAllCommands = function(eventCodes)
	{
		var commands = [];
		
		// Get commands for each page and index accordingly
		var i = this.event().pages.length;
		while (i-- > 0)
		{
			commands[i] = this.getPageCommands(i, eventCodes);
		}
		
		return commands;
	};
	
	/**
	 * Retrieves a list of all comments on the passed event's current page
	 * @param {type} pageIndex Index of page from which to retrieve commands. Uses current page by default.
	 * @return {Array} List of comments
	 */
	$.getCommentsOnPage = function(pageIndex)
	{
		var parameters = [];
		
		var comments = this.getPageCommands(pageIndex, [108, 408]);
		
		if (comments)
		{
			var i = comments.length;
			
			while (i-- > 0)
			{
				var comment = comments[i].parameters[0];
				parameters.push(comment);
			}
		}
		
		return parameters;
	};
	
	/**
	 * Retrieves comment tag parameters
	 * @param {String} parameter Name of parameter
	 * @param {Number} pageIndex Index of page to search, by default uses event's current page
	 * @returns {Array} List of parameters
	 */
	$.getCommentParameter = function(parameter, pageIndex)
	{
		var regex = new RegExp('<' + parameter + ': (.*)>', 'i');
		
		var comments = this.getCommentsOnPage(pageIndex);
		var i = comments.length;
		while (i-- > 0)
		{
			var parameters = comments[i].match(regex);
			if (parameters)
			{
				return parameters[1];
			};
		}
	};
	
	/**
	 * Does the passed value exist in a page's comments?
	 * @param {String} value Name of parameter
	 * @param {Number} pageIndex Index of page to search, by default uses event's current page
	 * @returns {Array} List of parameters
	 */
	$.doesExistInComments = function(value, pageIndex)
	{
		var comments = this.getCommentsOnPage(pageIndex);
		var i = comments.length;
		while (i-- > 0)
		{
			var parameters = comments[i].match(value);
			if (parameters)
			{
				return true;
			};
		}
		
		return false;
	};
	
})(Game_Event.prototype);


///////////////////////////////////////////////////////////////////////////////
//							SRCrazy_Core Classes

(function($)
{
	///////////////////////////////////////////////////////////////////////////
	//							Tween Class
	// [TWEN]	Here
	// LKUP		Top
	
	/**
	 * Commonly used tween completion behaviours
	 */
	$.TweenCompleteBehaviour = {
		oscillate: function(target)
		{
			this.start(!this.isBackwards());
		},
		repeat: function(target)
		{
			this.start();
		},
		remove: function(target)
		{
			var realTarget = target.tweenContainer || target;
			try
			{
				realTarget.removeTween(this);
				this.destroy();
			}
			catch (e)
			{
				console.log("SRCrazy_Core.TweenCompleteBehaviour.remove FAILED\nTween target has no function such function 'removeTween'");
				console.log(realTarget);
			}
		}
	};
	
	/**
	 * Commonly used tween easing methods
	 */
	$.TweenEasing = {
		linear: function(t) { return t; },
		
		quadIn:	function(t) { return Math.pow(t, 2); },
		quadOut:	function(t) { return 1 - $.TweenEasing.quadIn(1 - t); },
		quadInOut:	function(t) { return (t < 0.5) ? $.TweenEasing.quadIn(t) : $.TweenEasing.quadOut(t); },
		
		cubicIn:	function(t) { return Math.pow(t, 3); },
		cubicOut:	function(t) { return 1 - $.TweenEasing.cubicIn(1 - t); },
		cubicInOut:	function(t) { return (t < 0.5) ? $.TweenEasing.cubicIn(t) : $.TweenEasing.cubicOut(t); },
		
		sineIn:		function (t) { return Math.sin( (Math.PI / 2) * t); },
		sineOut:	function (t) { return 1 - $.TweenEasing.sineIn(1 - t); },
		sineInOut:	function(t) { return (t < 0.5) ? $.TweenEasing.sineIn(t) : $.TweenEasing.sineOut(t); },
		
		elasticIn:	function (t)
		{
			var p = 0.3;
			return Math.pow(2, -10 * t) * Math.sin((t-p / 4) * (2 * Math.PI ) / p) + 1;
		},
		elasticOut:		function (t) { return 1 - $.TweenEasing.elasticIn(1 - t); },
		elasticInOut:	function(t) { return (t < 0.5) ? $.TweenEasing.elasticIn(t) : $.TweenEasing.elasticOut(t); }
	};
	
	
	/**
	 * Tween constructor
	 * @param {Object} target The object whose properties the Tween will update
	 * @param {Number} duration The length (sin seconds) of the tween
	 * @param {Function} easeFunc Funciton to use for easing, if none passed a linear ease function is used
	 */
	function Tween(target, duration, easeFunc)
	{
		this._target = target;
		this._duration = Number(duration);
		this._easing = easeFunc;
		
		this._properties = {};
		
		this._progress = 0;
		this._isRunning = false;
		this._runBackwards = false;
	}
	
	Tween.prototype = {};
	Tween.prototype.constructor = Tween;
	
	/**
	 * Strips internal references to make sure it's garbage collected properly
	 */
	Tween.prototype.destroy = function()
	{
		for (var n in this._properties)
		{
			this._properties[n].destroy();
		}
		
		this._properties = null;
		this._target = null;
		this._easing = null;
	};
	
	/**
	 * Is the tween running?
	 * @returns {Boolean}
	 */
	Tween.prototype.isRunning = function()
	{
		return this._isRunning;
	};
	
	/**
	 * Is the Tween set to run backwards?
	 * @returns {Boolean}
	 */
	Tween.prototype.isBackwards = function()
	{
		return this._runBackwards;
	};
	
	/**
	 * Retrieves the Tween's target
	 * @returns {Number}
	 */
	Tween.prototype.progress = function()
	{
		return this._progress;
	};
	
	/**
	 * Retrieves the Tween's target
	 * @returns {Object}
	 */
	Tween.prototype.target = function()
	{
		return this._target;
	};
	
	/**
	 * Adds a property to the Tween
	 * @param {String} name Name of the property on the target object
	 * @param {Number} startValue The starting value
	 * @param {Number} endValue The final value
	 * @param {Function} easeFunc Funciton to use for easing, if none passed a linear ease function is used
	 * @param {Function} onUpdateCallback Funciton to call when tween is updated
	 */
	Tween.prototype.addProperty = function(name, startValue, endValue, easeFunc, onUpdateCallback)
	{
		var prop = new TweenProperty(this._target, name, startValue, endValue, easeFunc || this._easing, onUpdateCallback);
		this._properties[name] = prop;
	};
	
	/**
	 * Starts running Tween, sets properties to initial values
	 * @param {Boolean} backwards Should the Tween run backwards?
	 */
	Tween.prototype.start = function(backwards)
	{
		if (this._isRunning || !this._target)
		{
			return;
		}
		
		backwards = !!backwards;
		
		this._progress = 0;
		this._durationTracker = 0;
		this._isRunning = true;
		this._runBackwards = backwards;
		
		for (var prop in this._properties)
		{
			this._properties[prop].reset(backwards);
		}
		
		this._lastUpdateTime = new Date().getTime();
	};
	
	/**
	 * Resumes running from last state (used in conjunction with stop())
	 */
	Tween.prototype.resume = function()
	{
		this._isRunning = false;
	};

	/**
	 * Stops update method from running (pauses internal time tracking)
	 */
	Tween.prototype.stop = function()
	{
		this._isRunning = false;
	};
	
	/**
	 * Updates all the properties in the Tween
	 * @param {Number} timePassed Time passed since last update
	 */
	Tween.prototype.update = function(timePassed)
	{
		var now = new Date().getTime();
		
		// Not active, do nothing
		if (!this._isRunning)
		{
			this._lastUpdateTime = now;
			return;
		}
		
		// No time passed by caller, use last update time to figure out how ong it's been
		if (!timePassed)
		{
			timePassed = (now - this._lastUpdateTime) / 1000;
		}
		
		// Progress Tween by the amount of time passed since last update
		this._durationTracker = Math.min(this._durationTracker + timePassed, this._duration);
		this._progress = this._durationTracker / this._duration;
		
		// Update TweenProperties
		var scaledTime;
		var finishedValue;
		if (this._runBackwards)
		{
			scaledTime = (this._duration - this._durationTracker) / this._duration;
			finishedValue = 0;
		}
		else
		{
			scaledTime = this._progress;
			finishedValue = 1;
		}
		
		for (var prop in this._properties)
		{
			this._properties[prop].update(scaledTime);
		}
		
		// Invoke update callback
		this._lastUpdateTime = now;
		this.onUpdateCallback(this._target);
		
		// We're finished
		if (scaledTime === finishedValue)
		{
			this._isRunning = false;
		
			// Invoke complete callback
			this.onCompleteCallback(this._target);
		}
	};
	
	/**
	 * Invoked when Tween updates. To be overridden by users.
	 */
	Tween.prototype.onUpdateCallback = function(target) {};
	
	/**
	 * Invoked when Tween completes. To be overridden by users.
	 */
	Tween.prototype.onCompleteCallback = function(target) {};
	
	/**
	 * Tween helper class. private.
	 * @returns {TweenProperty}
	 */
	function TweenProperty()
	{
		this.initialize.apply(this, arguments);
	}
	
	TweenProperty.prototype = {};
	TweenProperty.prototype.constructor = TweenProperty;
	
	TweenProperty.prototype.initialize = function(target, propertyName, start, end, easeFunc, onUpdateCallback)
	{
		this._target = target;
		this._propertyName = propertyName;
		this._start = Number(start);
		this._end = Number(end);
		this._diff = this._end - this._start;
		
		this._ease = easeFunc || $.TweenEasing.linear;
		this._onUpdateCallback = onUpdateCallback;
	};
	
	/**
	 * Strips internal references to make sure it's garbage collected properly
	 */
	TweenProperty.prototype.destroy = function()
	{
		this._target = null;
		this._ease = null;
	};
	
	/**
	 * Reset the property to initial state, ready for the Tween to run
	 * @param {Boolean} backwards Will the tween be running backwards?
	 */
	TweenProperty.prototype.reset = function(backwards)
	{
		this.update( (backwards) ? 1 : 0 );
	};
	
	/**
	 * Update the property to the correct value
	 * @param {Number} progress Progress percentage between 0 and 1
	 */
	TweenProperty.prototype.update = function(progress)
	{
		var value = this.ease(progress);
		this._target[this._propertyName] = value;
		
		if (this._onUpdateCallback)
		{
			this._onUpdateCallback(value);
		}
	};
	
	TweenProperty.prototype.ease = function(progress)
	{
		if (progress === 0)
		{
			return this._start;
		}

		if (progress === 1)
		{
			return this._end;
		}
		
		var t = this._ease(progress);
		return this._start + (this._diff * t);
	};
	
	// Add global classes
	SRCrazy.Classes.Tween = Tween;
	
})(SRCrazy.Core);