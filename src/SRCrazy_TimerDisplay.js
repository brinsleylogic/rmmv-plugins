//=============================================================================
// SRCrazy_TimerDisplay.js
//=============================================================================
//
// DEPENDENCIES:
// 
// SRCrazy_Core
// SRCrazy_Timer
//
//=============================================================================

/*:
 * @author S_Rank_Crazy
 * @plugindesc v1.0 Provides a component that displays a timer with text, progreess bar, etc...
 * <SRCrazy_TimerDisplay>
 * 
 * ============================================================================
 * 
 * @param debug
 * @desc Enables logging for this plugin to the debug console.
 * @default false
 * 
 * @param 
 * 
 * @param -- SCRIPT CALL --
 * @desc Parameters in this section relate to script calls
 * 
 * @param Global pause function
 * @desc Adds a function for pausing a timer to the global scope with the specified name
 * @default pauseTimer
 * 
 * @param Global unpause function
 * @desc Adds a function for unpausing a timer to the global scope with the specified name
 * @default unpauseTimer
 * 
 * @param Global destroy function
 * @desc Adds a function for destroying a timer to the global scope with the specified name
 * @default destroyTimer
 * 
 * @param Global check function
 * @desc Adds a function for checking the existence of a timer to the global scope with the specified name
 * @default doesTimerExist
 * 
 * @param 
 * 
 * @param Shorthand function
 * @desc Adds a function to the global scope with the specified name
 * @default timedbar
 * 
 * @param Shorthand function parameters
 * @desc These are the parameters that will be passed in to the shorthand function. See the help section for more info.
 * @default x, y, duration, useFrames
 * 
 * @param 
 * 
 * @param -- TIME TRACKING --
 * @desc Parameters in this section relate to how time is tracked by the timers.
 * 
 * @param Duration
 * @desc The default duration of timers
 * @default 1
 * 
 * @param Use frames
 * @desc Indicates whether timers use frame or real time measurements by default
 * @default false
 * 
 * @param 
 * 
 * @param -- DISPLAY: GENERAL --
 * @desc Parameters in this section relate to the default display of timers.
 * 
 * @param Default position
 * @desc The position of the display, formatted as: x y
 * @default 10 10
 * 
 * @param Default size
 * @desc The dimensions of the display, formatted as: width height
 * @default 200 50
 * 
 * @param Show window
 * @desc Indicates whether a window is shown in the display by default
 * @default true
 * 
 * @param 
 * 
 * @param -- DISPLAY: BAR --
 * @desc Parameters in this section relate to the default state of the timer bar in the display.
 * 
 * @param Show bar
 * @desc Indicates whether a bar shown in the display by default
 * @default true
 * 
 * @param Bar position
 * @desc The position of the bar, formatted as: x y
 * @default 10 15
 * 
 * @param Bar size
 * @desc The dimensions of the bar, formatted as: width height
 * @default 180 20
 * 
 * @param Bar background colour
 * @default transparent
 * 
 * @param Bar left colour
 * @default #ff0000
 * 
 * @param Bar right colour
 * @default #ff9900
 * 
 * @param 
 * 
 * @param -- DISPLAY: IMAGES --
 * @desc Parameters in this section relate to images in the display.
 * 
 * @param Show background image
 * @desc Indicates whether an image is shown in the display, behind the bar
 * @default false
 * 
 * @param Background image
 * @desc The path to the image relative to the img folder
 * @default parallaxes/BlueSky
 * 
 * @param Show foreground image
 * @desc Indicates whether an image is shown in the display, in front of the bar
 * @default false
 * 
 * @param Foreground image
 * @desc The path to the image relative to the img folder
 * @default parallaxes/BlueSky
 *
 * @help
 * ============================================================================
 *                   S_Rank_Crazy's Timer Display Plugin
 * ============================================================================
 * This plugin provides a timer display that can be customised either through
 * the Plugin Manager, or when created through a Script Call.
 * 
 * If you're using the MVCommons or PluginManagement plugins then any dependency
 * issues will be output as errors when the game loads.
 * 
 * All SRCrazy plugins are rename safe - you can rename the file and it'll still
 * work. All parameters and commands are case-safe (no need to worry about
 * case-sensitive input) unless specifically stated. This doesn't include
 * Comment Tags or file names/paths; they are still case sensitive.
 * 
 * MVCommons supported but not required for use.
 * 
 * ============================================================================
 * USAGE
 * 
 * The TimerDisplay can be set up in the Plugin Manager to be configured in
 * many different ways, which allows for script calls to be relatively easy to
 * implement in the Event Editor for displays that are consistent in their
 * appearance and/or behaviour. However, if you need to have different "types"
 * of displays you have all of the same configuration settings available to
 * you for the creation of each individual TimerDisplay.
 * 
 * 
 * -----------------
 *  Creating Timers
 * -----------------
 * 
 * The plugin can be accessed through the SRCrazy global namespace at:
 * 
 * SRCrazy.Plugins.TimerDisplay
 * 
 * The plugin has a `construct` method which can be used to create a timer
 * by supplying a descriptor to the function call:
 * 
 * SRCrazy.Plugins.TimerDisplay.construct({ duration: 10 });
 * 
 * The above call will create a TimeDisplay with the default settings that will
 * be removed after 10 seconds. The descriptor can contain a number of different
 * options which will customise how it looks and behaves. If any of the options
 * are omitted, the plugin's defaults (as found in the Plugin Manager) will be
 * used.
 * 
 * Here's a list of all of the options that can be used:
 * 
 * * name - The name of the TimerDisplay, can be used to destroy the timer at a
 *          later point
 * * duration - The amount of time (or number of frames) to run the timer for
 * * useFrames - Indicates whether the timer uses seconds (real time) or frames
 * 
 * * x - The position of the TimerDisplay on the x-axis
 * * y - The position of the TimerDisplay on the y-axis
 * * width - The width of the TimerDisplay
 * * height - The height of the TimerDisplay
 * 
 * * switchId - Triggers the switch when the timer completes. If the switch is
 *              on, switch is turned off and vice versa.
 * * variableId - Sets the current progress of the timer in the specified
 *                variable
 * * commonEventId - Triggers a Common Event when the timer completes
 * 
 * * showWindow - Indicates whether hte display shows a Window
 * * showBar - Indicates whether the display shows a timer bar
 * 
 * * barX - The position of the bar on the x-axis
 * * barY - The position of the bar on the y-axis
 * * barWidth - The width of the bar
 * * barHeight - The height of the bar
 * * barColour1 - The colour used for the left side of the bar
 * * barColour2 - The colour used for the right side of the bar
 * * barColourBg - The colour used for the background of the bar
 * 
 * * showBackgroundImage - Indicates whether an image is to be displayed behind
 *                         the bar
 * * backroundImage - The path to the image to display
 * 
 * * showForegroundImage - Indicates whether an image is to be displayed in front
 *                         of the bar
 * * foregroundImage - The path to the image to display
 * 
 * 
 * ----------------------------
 *  Creation through Shorthand
 * ----------------------------
 * 
 * 1. The Shorthand Function
 * 
 * The plugin provides a customisable function that is made available in the
 * global scope of the window. In short, you can (re)name a function and decide
 * what it's parameters are (from a support list, see below) and then use that
 * function in a Script Call to create TimerDisplays more easily.
 * 
 * By default the Shorthand Function (SHF) is set up to be:
 * timedbar(x, y, duration, useFrames);
 * 
 * `timedbar` is the name of the function, and the function's parameters are
 * set to be `x, y, duration, useFrames`. To use this default set-up, use the
 * following in a Script Call:
 * 
 * timedbar(10, 10, 5, false);
 *
 * The above example will display a window at position [10,10] and will be
 * removed after 5 seconds. Passing true or to the `useFrames` parameter will
 * translate the `duration` value as the number of frames to count. If any
 * parameters are omitted then their values will default to the values
 * specified in the Plugin Manager.
 * 
 * Additional methods can be called once the timedbar function has been called
 * in order to update a variable, switch or trigger an event. These methods are:
 * 
 * assignToVariable(variableId);
 *    This sets the current progress of the bar the specified variable
 * 
 * assignToSwitch(switchId);
 *    This flips a switch when timer is complete. If the switch is on, switch is
 *    turned off and vice versa.
 * 
 * assignToCommonEvent(commonEventId);
 *    This calls a Common Event when the timer is complete.
 *    
 * These methods can be chained in order to use a combination of them.
 * 
 * Eg:
 * timedbar(10, 10, 5).assignToVariable(1).assignToSwitch(1);
 * 
 * This will create the display as before but also update variable with ID 1
 * every frame, and then change switch with ID 1 when complete.
 * 
 * 
 * 
 * 2.Shorthand Function Parameters
 * 
 * The SHF's parameters don't always have to be `x, y, duration, useFrames`,
 * you can customise what properties you want to control and in which order they
 * are passed in to the SHF. For exmaple, if you wanted to only ever set the
 * duration and the colour(s) use for the bar when calling the SHF you can set it
 * up to look like this:
 * 
 * timedbar(duration, barColour1, barColour2);
 * 
 * For a full list of the supported values for the "Shorthand function parameters"
 * parameter in the Plugin Manager, see the above section on "Creating Timers".
 * 
 * 
 * -----------------
 *  Managing Timers
 * -----------------
 * 
 * If the timer is provided with a name upon creation, it can be manually
 * managed through other Script Calls to pause/unpause and destroy it...
 * 
 * SRCrazy.Plugins.TimerDisplay.pause(timerName, hide);
 *     This pauses the named timer (if found), and optionally hides it.
 * 
 * SRCrazy.Plugins.TimerDisplay.unpause(timerName, show);
 *     This unpauses the named timer (if found), and optionally shows it.
 * 
 * SRCrazy.Plugins.TimerDisplay.destroy(timerName);
 *     This destroys the named timer (if found).
 * 
 * Similarly to the Shorthand function (see above), these three methods can
 * also been added to the global scope to make calling them less cumbersome.
 * These are also set up in the SCRIPT CALL section of the Plugin PArameters
 * section of the Plugin Manager.
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
 * Requires SRCrazy_Core and SRCrazy_Timer plugins.
 * 
 * ============================================================================
 */

SRCrazy.Plugins.TimerDisplay = (function() {
	"use strict";

	var $core = SRCrazy.Plugins.Core;
	var plugin = {};

	/**
	 * Indicates whether the current Scene is valid for displaying the TimerDisplay.
	 * 
	 * @return {boolean}
	 */
	function isValidScene() {
		var scene = SceneManager._scene;

		if (scene) {
			return (scene instanceof Scene_Map || scene instanceof Scene_Battle);
		}

		return false;
	}


	//=========================================================================
	// Timer Controller
	//=========================================================================

	var Timer = SRCrazy.Classes.Timer;

	/**
	 * Creates a new TimerDisplay Controller.
	 *
	 * @param {string} [name] Name of the TimerDisplay
	 */
	function Controller(name) {
		this.name = name;

		this._timer;
		this._display;

		this._switchId;
		this._commonEventId;

		_timers.push(this);

		if (name) {
			_lookup[name] = this;
		}
	}

	var _p = $core.createClass(Controller);

	$core.createGetter(_p, "display", function() { return this._display; });

	/**
	 * Starts the Timer.
	 * 
	 * @param {number} duration The duration of the timer
	 * @param {boolean} [useFrames=false] Indicates whether timer tracks frames or in real time
	 * @returns {this}
	 */
	_p.setTime = function(duration, useFrames) {
		this._timer = new Timer(onComplete.bind(this), duration, 0, !useFrames);
		return this;
	};

	/**
	 * Sets whether the timer should be running.
	 * 
	 * @param {boolean} active Is this timer active?
	 * @returns {this}
	 */
	_p.setActive = function(active) {
		if (active) {
			this._timer.start();
		} else {
			this._timer.stop();
		}

		return this;
	};

	/**
	 * Sets the display component for the TimerDisplay.
	 * 
	 * @param {Display} display 
	 * @returns {this}
	 */
	_p.setDisplay = function(display) {
		display.setTimer(this._timer);
		this._display = display;
		return this;
	};

	/**
	 * Updates the specified variable with the Timer's value.
	 * 
	 * @param {number} variableId The ID of the variable to update
	 * @returns {this}
	 */
	_p.assignToVariable = function(variableId) {
		var update = this._timer.update;
		this._timer.update = function() {
			update.call(this);
			$gameVariables.setValue(variableId, this._tracker);
		};
		
		return this;
	};

	/**
	 * Sets a switch to trigger when the Timer completes.
	 * 
	 * @param {number} switchId The ID of the switch to change
	 * @returns {this}
	 */
	_p.triggerSwitch = function(switchId) {
		this._switchId = switchId;
		return this;
	};

	/**
	 * Sets a Common Event to trigger when the Timer completes.
	 * 
	 * @param {number} eventId The ID of the Common Event to change
	 * @returns {this}
	 */
	_p.triggerCommonEvent = function(eventId) {
		this._commonEventId = eventId;
		return this;
	};

	/**
	 * Handles removing the TimerDisplay and cleaning up self for GC.
	 */
	_p.destroy = function() {
		if (this._display) {
			this._display.destroy();
			this._display = undefined;
		}

		this._timer.destroy();
		this._timer = undefined;

		var i = _timers.indexOf(this);
		if (i > -1) {
			_timers.splice(i, 1);
		}

		if (this.name) {
			delete _lookup[this.name];
		}
	};

	function onComplete() {
		if (this._switchId !== undefined) {
			var value = $gameSwitches.value(this._switchId);
			$gameSwitches.setValue(this._switchId, !value);
		}
		
		if (this._commonEventId !== undefined) {
			$gameTemp.reserveCommonEvent(this._commonEventId);
		}

		this.destroy();
	}
	

	//=========================================================================
	// Timer Display
	//=========================================================================

	var superClass = Sprite;

	function createImage(path) {
		var bitmap = new Bitmap(this._dimensions.x, this._dimensions.y);
		var img = new Sprite(bitmap);

		ImageManager.loadNormalBitmap("img/" + path + ".png")
			.addLoadListener(function(bmp) {
				$core.ImageUtil.sampleBitmap(bitmap, bmp, {
					x: 0,
					y: 0,
					width: bitmap.width,
					height: bitmap.height
				});
			});

		return img;
	}

	function Display(width, height) {
		superClass.prototype.initialize.call(this, new Bitmap(width, height));

		this._dimensions = { x: width, y: height };

		this._bar;
		this._text;
		this._window;
		this._background;
		this._foreground;
	}

	var _p = $core.createClass(Display, superClass.prototype);

	$core.createGetter(_p, "bar", function() { return this._bar; });

	/**
	 * Sets the timer that drives the display.
	 * 
	 * @param {Timer} timer Timer instance that this display represents
	 * @returns {this}
	 */
	_p.setTimer = function(timer) {
		this._timer = timer;
		return this;
	};

	/**
	 * Adds a Window in to the display (at the bottom-most layer).
	 * 
	 * @returns {this}
	 */
	_p.addWindow = function() {
		if (!this._window) {
			this._window = new Window_Base(0, 0, this._dimensions.x, this._dimensions.y);
			this.addChildAt(this._window, 0);
		}

		return this;
	};

	/**
	 * Adds a background image (underneath the bar).
	 * 
	 * @param {string} path Image path (relative to the `/img` folder)
	 * @returns {this}
	 */
	_p.addBackgroundImage = function(path) {
		if (!this._background) {
			this._background = createImage.call(this, path);
			this.addChildAt(this._background, (this._window) ? 1 : 0);
		}

		return this;
	};

	/**
	 * Adds a background image (underneath the bar).
	 * 
	 * @param {string} path Image path (relative to the `/img` folder)
	 * @returns {this}
	 */
	_p.addForegroundImage = function(path) {
		if (!this._foreground) {
			this._foreground = createImage.call(this, path);
			this.addChild(this._foreground);
		}

		return this;
	};

	/**
	 * Adds a Bar that scales it's width to match the percenateg of time elapsed.
	 * 
	 * @param {number} x Position of the bar on the x-axis
	 * @param {number} y Position of the bar on the y-axis
	 * @param {number} width The width of the bar
	 * @param {number} height The height of the bar
	 * @returns {this}
	 */
	_p.addBar = function(x, y, width, height) {
		if (!this._bar) {
			this._bar = new Bar(width, height);
			this._bar.x = x;
			this._bar.y = y;

			if (this._foreground) {
				var index = this.getChildIndex(this._foreground);
				this.addChildAt(this._bar, index - 1);
			} else {
				this.addChild(this._bar);
			}
		}

		return this;
	}

	/**
	 * Destroys this dsplay and components.
	 */
	_p.destroy = function() {
		superClass.prototype.destroy.call(this, { children: true });

		this._window = undefined;
		this._bar = undefined;
		this._timer = undefined;
	};

	/**
	 * Updates the display components.
	 */
	_p.update = function() {
		superClass.prototype.update.call(this);
		
		this._bar.setScale(this._timer.currentTime / this._timer.duration);
	};
	

	//=========================================================================
	// Timer Bar
	//=========================================================================

	var superClass = Sprite;

	function Bar(width, height) {
		superClass.prototype.initialize.call(this, new Bitmap(width, height));

		this._dimensions = { x: width, y: height };

		this.setBackground()
			.setLeftColour(0xff0000)
			.setRightColour(0xff9900);
	}

	var _p = $core.createClass(Bar, superClass.prototype);

	/**
	 * Sets the colour to use for the background.
	 * 
	 * @param {string|number} [colour=transparent] 
	 * @returns {this}
	 */
	_p.setBackground = function(colour) {
		this._bgColour = $core.colourString(colour) || "transparent";
		return this;
	};

	/**
	 * Sets the colour to use for the left side of the gradient.
	 * 
	 * @param {string|number} [colour=transparent] 
	 * @returns {this}
	 */
	_p.setLeftColour = function(colour) {
		this._colour1 = $core.colourString(colour) || "transparent";
		return this;
	};

	/**
	 * Sets the colour to use for the right side of the gradient.
	 * 
	 * @param {string|number} [colour=transparent] 
	 * @returns {this}
	 */
	_p.setRightColour = function(colour) {
		this._colour2 = $core.colourString(colour) || "transparent";
		return this;
	};

	/**
	 * Sets the scale of the Bar.
	 * 
	 * @param {number} value Scale value between 0 and 1
	 * @returns {this}
	 */
	_p.setScale = function(value) {
		value = Math.max(0, Math.min(1, value));

		var width = this._dimensions.x;
		var height = this._dimensions.y;

		this.bitmap.fillRect(0, 0, width, height, this._bgColour);
		this.bitmap.gradientFillRect(0, 0, width * value, height, this._colour1, this._colour2);

		return this;
	};


	//=========================================================================
	// Timer Management
	//=========================================================================

	var _paused = false;
	var _timers = [];
	var _lookup = {};

	/**
	 * Tells timers whether or not they should be running.
	 * 
	 * @param {boolean} pause Should we payse the timers?
	 */
	function setPauseState(pause, hide) {
		if (pause === _paused) {
			return;
		}

		_paused = pause;

		var i = _timers.length;
		while (i-- > 0) {
			_timers[i].setActive(!pause);

			if (hide !== undefined) { 
				if (hide) {
					_timers[i].display.hide();
				} else {
					_timers[i].display.show();
				}
			}
		}
	}

	/**
	 * Draws/redraws all timers when Map or Battle scenes are loaded.
	 */
	function drawAllTimers() {
		var i = _timers.length;

		while (i-- > 0) {
			this.addWindow(_timers[i].display);
		}
	}

	/**
	 * Override SceneManager.update so we can pause timer's during scene changes, etc...
	 */
	var SceneManager_update = SceneManager.update;
	SceneManager.update = function() {
		SceneManager_update.call(this);

		if (isValidScene()) {
			var scene = SceneManager._scene;

			var playerBusy = ($gamePlayer && $gamePlayer.isTransferring());
			var sceneReady = (typeof scene.isReady === "Function") ? scene.isReady() : scene.isReady;
			
			if (sceneReady && playerBusy) {
				var sceneBusy = this.isSceneChanging() || this.isCurrentSceneBusy();

				if (_paused) {
					if (!sceneBusy) {
						setPauseState(false);
					}
				} else if (sceneBusy) {
					setPauseState(true);
				}
			}
		}
	};

	var Battle_redraw = Scene_Battle.prototype.createAllWindows;
	Scene_Battle.prototype.createAllWindows = function() {
		Battle_redraw.call(this);
		drawAllTimers.call(this);
	};

	var Map_redraw = Scene_Map.prototype.createAllWindows;
	Scene_Map.prototype.createAllWindows = function() {
		Map_redraw.call(this);
		drawAllTimers.call(this);
	};
	

	//=========================================================================
	// Plugin Setup
	//=========================================================================

	function evalBoolean(value, fallback) {
		if (value) {
			return true;
		}

		if (value === undefined) {
			return !!fallback;
		}

		return false;
	}

	function addGlobalFunction(parameterName, globalFunction) {
		var name = _params[parameterName];
		window[name] = globalFunction;
	}

	$core.registerPlugin(plugin, "SRCrazy_TimerDisplay", "1.0", "2018-08-28", true, ["SRCrazy_Core", "SRCrazy_Timer"]);
	
	var _params = $core.parseParameters(plugin);

	var _duration = _params["Default duration"] || 1;
	var _useFrames = _params["Use frames"] || false;

	var _showWindow = _params["Show window"];
	var _showBar = _params["Show bar"];

	var _barColour1 = _params["Bar left colour"];
	var _barColour2 = _params["Bar right colour"];
	var _barColourBg = _params["Bar background colour"];

	var _bgImage = (_params["Show background image"]) ? _params["Background image"] : undefined;
	var _fgImage = (_params["Show foreground image"]) ? _params["Foreground image"] : undefined;

	var _defaultX = 0;
	var _defaultY = 0;
	var _defaultWidth = 200;
	var _defaultHeight = 50;

	var _barX = 10;
	var _barY = 15;
	var _barWidth = 180;
	var _barHeight = 20;

	var defaultPosition;
	var defaultSize;

	if (defaultPosition = _params["Position"]) {
		if (typeof defaultPosition === "number") {
			_defaultX = _defaultY = defaultPosition;
		} else {
			var pos = defaultPosition.replace(/\s+/g, " ").split(" ");
			_defaultX = pos[0];
			_defaultY = pos[1];
		}
	}

	if (defaultSize = _params["Size"]) {
		if (typeof defaultSize === "number") {
			_defaultWidth = _defaultHeight = defaultSize;
		} else {
			var pos = defaultSize.replace(/\s+/g, " ").split(" ");
			_defaultWidth = pos[0];
			_defaultHeight = pos[1];
		}
	}

	if (defaultPosition = _params["Bar position"]) {
		if (typeof defaultPosition === "number") {
			_barX = _barY = defaultPosition;
		} else {
			var pos = defaultPosition.replace(/\s+/g, " ").split(" ");
			_barX = pos[0];
			_barY = pos[1];
		}
	}

	if (defaultSize = _params["Bar size"]) {
		if (typeof defaultSize === "number") {
			_barWidth = _barHeight = defaultSize;
		} else {
			var pos = defaultSize.replace(/\s+/g, " ").split(" ");
			_barWidth = pos[0];
			_barHeight = pos[1];
		}
	}

	/**
	 * Creates a new TimerDisplay with the configuration supplied.
	 * 
	 * @param {*} data 
	 * @returns {any}
	 */
	plugin.construct = function(data) {
		var width = data.width || _defaultWidth;
		var height = data.height || _defaultHeight;

		// Create the display using the parameters provided
		var display = new Display(width, height);
		display.x = data.x || _defaultX;
		display.y = data.y || _defaultY;
		
		if (isValidScene()) {
			SceneManager._scene.addWindow(display);
		}
		
		if (evalBoolean(data.showWindow, _showWindow)) {
			display.addWindow();
		}

		if (evalBoolean(data.showBackgroundImage, _bgImage)) {
			display.addBackgroundImage(data.backgroundImage || _bgImage);
		}

		if (evalBoolean(data.showBar, _showBar)) {
			display.addBar(
				data.barX || _barX, data.barY || _barY,
				data.barWidth || _barWidth || width,
				data.barHeight || _barHeight || height
			);

			var bar = display.bar;

			bar.setBackground((data.barColourBg) ? data.barColourBg : _barColourBg);
			bar.setLeftColour((data.barColour1) ? data.barColour1 : _barColour1);
			bar.setRightColour((data.barColour2) ? data.barColour2 : _barColour2);
		}

		if (evalBoolean(data.showForegroundImage, _fgImage)) {
			display.addForegroundImage(data.foregroundImage || _fgImage);
		}

		var controller = new Controller(data.name);
		controller.setTime(data.duration || _duration, data.useFrames || _useFrames);
		controller.setDisplay(display);
		controller.setActive(true);

		if (data.switchId) {
			controller.triggerSwitch(data.switchId);
		}

		if (data.variableId) {
			controller.assignToVariable(data.variableId);
		}

		if (data.commonEventId) {
			controller.triggerCommonEvent(data.commonEventId);
		}

		$core.debugLog(plugin, "Created new TimerDisplay:", controller, data);

		return controller;
	};

	/**
	 * Resumes the named timer.
	 * 
	 * @param {string} timerName Name of the timer to resume
	 * @param {boolean} show Indicates whether the timer should be shown
	 */
	plugin.unpause = function(timerName, show) {
		var timer = _lookup[timerName];

		if (timer) {
			timer.setActive(true);

			if (show) {
				timer.show();
			}
		}
	};

	/**
	 * Stops the named timer.
	 * 
	 * @param {string} timerName Name of the timer to stop
	 * @param {boolean} hide Indicates whether the timer should be hidden
	 */
	plugin.pause = function(timerName, hide) {
		var timer = _lookup[timerName];

		if (timer) {
			timer.setActive(false);

			if (hide) {
				timer.hide();
			}
		}
	};

	/**
	 * Destroys (stops and hides) the named timer.
	 * 
	 * @param {string} timerName Name of the timer to destroy
	 */
	plugin.destroy = function(timerName) {
		var timer = _lookup[timerName];

		if (timer) {
			timer.destroy();
		}
	};

	/**
	 * Indicates whether or not a timer exists with the supplied name.
	 * 
	 * @param {string} timerName Name of the timer to check
	 */
	plugin.exists = function(timerName) {
		var timer = _lookup[timerName];
		return !!timer;
	};

	// Set up the SHF for creation.
	if (_params["Shorthand function"] && _params["Shorthand function parameters"]) {
		var paramList = _params["Shorthand function parameters"]
			.replace(/[\s,]+/g, ",")
			.split(",");

		addGlobalFunction("Shorthand function", function(...args) {
			var data = {};
			
			// Make sure we don't iterate to many arguments
			var length = Math.min(args.length, paramList.length);

			for (var i = 0; i < length; i++) {
				var key = paramList[i];
				data[key] = args[i];
			}

			return plugin.construct(data);
		});
	}

	if (_params["Global pause function"]) {
		addGlobalFunction("Global pause function", plugin.pause);
	}

	if (_params["Global unpause function"]) {
		addGlobalFunction("Global unpause function", plugin.unpause);
	}

	if (_params["Global destroy function"]) {
		addGlobalFunction("Global destroy function", plugin.destroy);
	}

	if (_params["Global check function"]) {
		addGlobalFunction("Global check function", plugin.exists);
	}

	return plugin;
})();