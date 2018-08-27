//=============================================================================
// SRCrazy_MVAdditions.js
//=============================================================================

/*:
 * @author S_Rank_Crazy
 * @plugindesc v1.0 Adds additional functionality to base RPG Maker MV classes.
 * <SRCrazy_MVAdditions>
 * 
 * @help
 * ============================================================================
 *                     S_Rank_Crazy's MV Additions Plugin
 * ============================================================================
 * This plugin provides some additional functionality to be used by other
 * plugins or by events (if applicable).
 * 
 * This plugin should be placed above most other SRCrazy plugins in the Plugin
 * Manager, but below SRCrazy_Core. If you're using the MVCommons or
 * PluginManagement plugins then any dependency issues will be output as errors
 * when the game loads.
 * 
 * All SRCrazy plugins are rename safe - you can rename the file and it'll still
 * work. All parameters and commands are case-safe (no need to worry about
 * case-sensitive input) unless specifically stated. This doesn't include
 * Comment Tags or file names/paths; they are still case sensitive.
 * 
 * MVCommons supported but not required for use.
 * 
 *============================================================================
 * TERMS OF USE
 * 
 * Free for commercial and non-commercial use. No credit need be given, but
 * always appreciated.
 * 
 *============================================================================
 * COMPATIBILITY
 * 
 * Requires SRCrazy_Core plugin.
 *
 *============================================================================
 */

(function() {
	var $core = SRCrazy.Plugins.Core;
	var plugin = {};

	$core.registerPlugin(plugin, "SRCrazy_MVAdditions", "1.0", "2018-08-25", false, "SRCrazy_Core");


	//========================================================================
	// Additional Game_Event Input
	//========================================================================


	/**
	 * List of all valid input values
	 */
	var _trackedInputs = [];
	var _lastActiveButton;

	/**
	 * If inputs are supplied then Input class will track only those input names for certain methods,
	 * otherwise, the list of inputs to track is derived from Input.keyMapper and Input.gamepadMapper lookups.
	 * 
	 * @param {string[]} [inputs] Inputs to track for `isAnyTriggered()`
	 */
	Input.trackInputs = function(inputs) {
		if (inputs) {
			_trackedInputs = inputs;
		} else {
			_trackedInputs = [];

			for (var key in this.keyMapper) {
				var input = this.keyMapper[key];
				if (_trackedInputs.indexOf(input) < 0) {
					_trackedInputs.push(input);
				}
			}

			for (var key in this.gamepadMapper) {
				var input = this.gamepadMapper[key];
				if (_trackedInputs.indexOf(input) < 0) {
					_trackedInputs.push(input);
				}
			}
		}
	};
	
	/**
	 * Indicates if any of the tracked input values have been triggered.
	 * 
	 * @param {string[]} [inputs] A list of inputs to check, if not supplied, checks all tracked inputs
	 * @return {boolean}
	 */
	Input.isAnyTriggered = function(inputs) {
		return (this.getAllTriggered(inputs, 1).length > 0);
	};
	
	/**
	 * Retrieves an array of all inputs that have just been triggered.
	 * 
	 * @param {string[]} [inputs] A list of input to check, if not supplied, checks all tracked inputs
	 * @param {number} [stopCount] Stops traversing inputs if the specified number of inputs have been triggered 
	 * @returns {string[]} An array of the inputs that were triggered
	 */
	Input.getAllTriggered = function(inputs, stopCount) {
		inputs = inputs || this.allInputValues;
		
		var list = [];
		
		var i = inputs.length;
		while (i-- > 0) {
			if (this.isTriggered(inputs[i])) {
				var length = list.push(inputs[i]);

				if (stopCount && stopCount <= length) {
					break;
				}
			}
		}
		
		return list;
	};

	/**
	 * Indicates whether all supplied inputs are pressed.
	 * 
	 * @param {string[]} inputs List of inputs to check
	 * @returns {boolean}
	 */
	Input.areAllPressed = function(inputs) {
		var i = inputs.length;
		while (i-- > 0) {
			if (!this.isPressed(inputs[i])) {
				return false;
			}
		}

		return true;
	};

	/**
	 * Indicates whether the supplied input was the last to be triggered.
	 * 
	 * @param {string} lastInput The input to test against the last one triggered
	 * @param {number} [maxInterval] If supplied, checks that the last input didn't happen too long ago
	 * @returns {boolean}
	 */
	Input.isSuccessiveTrigger = function(lastInput, maxInterval) {
		if (maxInterval) {
			var interval = (Date.now() - this._date) / 1000;

			if (maxInterval <= interval) {
				return false;
			}
		}

		return (_lastActiveButton === lastInput);
	};

	var Input_update = Input.update;
	Input.update = function() {
		if (this._latestButton) {
			_lastActiveButton = this._latestButton;
		}

		Input_update.call(this);
	};

	Input.trackInputs();


	//========================================================================
	// Additional Sprite_Base Functionality
	//========================================================================

	
	/**
	 * Removes sprite from parent.
	 */
	Sprite_Base.prototype.removeSelf = function() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
	};
	
	/**
	 * Copies a Sprite's Bitmap contents in to this Sprite.
	 * 
	 * @param {Sprite_Base} target Target sprite to draw contents from
	 */
	Sprite_Base.prototype.copyImageFrom = function(target) {
		var r = target.bitmap.canvas;
		this.bitmap = new Bitmap(r.width, r.height);
		this.bitmap.blt(target.bitmap, 0, 0, r.width, r.height, 0, 0);
	};
	
	/**
	 * Draws an image from a sptiresheet in to this Sprite.
	 * 
	 * @param {number} width The width of the drawing area
	 * @param {number} height The height of the drawing area
	 * @param {number} index Index of image in source
	 * @param {string} filename Name of image file to retrieve
	 * @param {string} [filePath=system] Folder path from inside project's img folder, defaults to 'system'
	 */
	Sprite_Base.prototype.drawImage = function(width, height, index, filepath, filename) {
		this.bitmap = new Bitmap(width, height);
		$core.ImageUtil.blitToBitmap(this.bitmap, index, filename, filepath);
	};
	
	/**
	 * Indicates whether a touch has been triggered on this Sprite.
	 */
	Sprite_Base.prototype.isTouchTriggered = function() {
		if (TouchInput.isTriggered()) {
			var offsetX = this.width * this.anchor.x;
			var offsetY = this.height * this.anchor.y;
			var x = TouchInput.x;
			var y = TouchInput.y;
	
			var node = this;
			while (node)
			{
				x -= node.x;
				y -= node.y;
	
				node = node.parent;
			}
	
			return (-offsetX <= x && x <= this.width - offsetX)
				&& (-offsetY <= y && y <= this.height - offsetY);
		}
		
		return false;
	};
	

	//========================================================================
	// Additional Game_Event Functionality
	//========================================================================


	Game_Event.prototype._cachedCommandLists = [];
	Game_Event.prototype._useCommandCache = SRCrazy.Plugins.Core.useCommandCache;
	
	/**
	 * Clears cached commands from event page.
	 * 
	 * @param {Number} [pageIndex] Index of page to clear cached commands for, if none passed, will clear cache for all pages
	 */
	Game_Event.prototype.clearCachedCommands = function(pageIndex) {
		if (pageIndex || pageIndex === 0) {
			delete this._cachedCommandLists[pageIndex];
		} else {
			this._cachedCommandLists = [];
		}
	};
	
	/**
	 * Retrieves a list of commands on a page matching supplied event codes.
	 * 
	 * @param {number} pageIndex Index of page from which to retrieve commands. Uses current page by default.
	 * @param {number[]} [eventCodes] List of event code ids to retrieve, if not supplied then returns all
	 * @returns {Array} List of event commands
	 */
	Game_Event.prototype.getPageCommands = function(pageIndex, eventCodes) {
		var page = null;
		
		// Use supplied index
		if (pageIndex === 0 || Number(pageIndex) > 0) {
			page = this.event().pages[pageIndex];

		// No index sent in, use current
		} else {
			page = this.page();
		}
		
		// No page? Just exit
		if (!page) {
			return;
		}
		
		// None specified, return all
		if (!eventCodes || eventCodes.length === 0) {
			return page.list;
		}
		
		// Container for all commands we're looking to return
		var commands = [];
		var codesToSearchFor = [];
		
		// Search cached pages
		if (this._useCommandCache) {
			var cache = this._cachedCommandLists[pageIndex] || (this._cachedCommandLists[pageIndex] = []);

			var codeCount = eventCodes.length;

			for (var i = 0; i < codeCount; i++) {
				// Add commands that 
				if (cache.contains(eventCodes[i])) {
					commands = commands.concat(cache[eventCodes[i]]);
					
				// None found for this code, grab them in the next loop
				} else {
					codesToSearchFor.push(eventCodes[i]);
				}
			}

		// Still need a list of event codes to search for
		} else {
			codesToSearchFor = eventCodes;
		}
		
		// Loop list for what we're looking for
		var list = page.list;
		var listCount = list.length;
		for (var i = 0; i < listCount; i++) {
			var cmd = list[i];
			if (codesToSearchFor.contains(cmd.code)) {
				// Cache this command
				if (this._useCommandCache) {
					if (!cache[cmd.code]) {
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
	 * @param {number[]} eventCodes List of event code ids to retrieve
	 * @returns {Array} List of event commands
	 */
	Game_Event.prototype.getAllCommands = function(eventCodes) {
		var commands = [];
		
		// Get commands for each page and index accordingly
		var i = this.event().pages.length;
		while (i-- > 0) {
			commands[i] = this.getPageCommands(i, eventCodes);
		}
		
		return commands;
	};
	
	/**
	 * Retrieves a list of all comments on the passed event's current page
	 * @param {number} [pageIndex] Index of page from which to retrieve commands. Uses current page by default.
	 * @return {Array} List of comments
	 */
	Game_Event.prototype.getCommentsOnPage = function(pageIndex) {
		var parameters = [];
		var comments = this.getPageCommands(pageIndex, [108, 408]);
		
		if (comments) {
			var i = comments.length;
			
			while (i-- > 0) {
				var comment = comments[i].parameters[0];
				parameters.push(comment);
			}
		}
		
		return parameters;
	};
	
	/**
	 * Retrieves comment tag parameters
	 * @param {string} parameter Name of parameter
	 * @param {number} [pageIndex] Index of page to search, by default uses event's current page
	 * @returns {Array} List of parameters
	 */
	Game_Event.prototype.getCommentParameter = function(parameter, pageIndex) {
		var regex = new RegExp('<' + parameter + ': (.*)>', 'i');
		var comments = this.getCommentsOnPage(pageIndex);

		var i = comments.length;
		while (i-- > 0) {
			var parameters = comments[i].match(regex);
			if (parameters) {
				return parameters[1];
			}
		}
	};
	
	/**
	 * Does the passed value exist in a page's comments?
	 * @param {String} value Name of parameter
	 * @param {Number} [pageIndex] Index of page to search, by default uses event's current page
	 * @returns {Array} List of parameters
	 */
	Game_Event.prototype.doesExistInComments = function(value, pageIndex) {
		var comments = this.getCommentsOnPage(pageIndex);

		var i = comments.length;
		while (i-- > 0) {
			var parameters = comments[i].match(value);
			if (parameters) {
				return true;
			}
		}
		
		return false;
	};
})();