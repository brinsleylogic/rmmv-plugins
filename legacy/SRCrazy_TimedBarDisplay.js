///////////////////////////////////////////////////////////////////////////////
/* S_Rank_Crazy's Timerd Bar Display
 * ============================================================================
 * RPG Maker MV
 * SRCrazy_TimedBarDisplay.js
 * 
 * ============================================================================
 * No personal credit required, but always appreciated.
 * Free for personal and commercial use.
 * 
 * ============================================================================
 *
 * 2016-09-25
 * - Version 1.1.0
 * - Added functions for updating a variable, changing a switch and triggering a
 *   common event on completion
 *
 * 2016-09-19
 * - Version 1.0.0
 * - Rewritten to allow customisation of:
 *   - Window display
 *   - Text position and colour
 *   - Bar width
 * - Added support for displaying image instead of the window
 *
 * 2016-09-16
 * - Version 0.1
 * - Release
 * 
 * ============================================================================
 */

///////////////////////////////////////////////////////////////////////////////
/* ============================================================================
 *							Class Navigation
 * ============================================================================
 * Search file for indexer on left side to navigate.
 * E.g. "[LKUP]" to navigate here.
 * 
 * ============================================================================
 * [LKUP]	Here
 * 
 * [CODE]	Start of code
 * 
 * [WNDW]	Timed window class
 * 
 * ============================================================================
 */

///////////////////////////////////////////////////////////////////////////////
/*:
 * @author S_Rank_Crazy
 * @plugindesc v1.0.0 Adds simple window displaying some text and a timer bar
 * <SRCrazy_TimedBarDisplay>
 * 
 * @param -- WINDOW --
 * @desc Parameters in this section relate to the window display
 *
 * @param Show Window
 * @desc Toggles display of the window graphic
 * default: true
 * @default true
 *
 * @param Window Width
 * @desc Width of the window
 * default: 400
 * @default 400
 *
 * @param Window Height
 * @desc Height of the window
 * default: 80
 * @default 80
 * 
 * @param -- BAR --
 * @desc Parameters in this section relate to the bar display
 *
 * @param Bar X Pos
 * @desc The x-offset of the bar
 * default: 25
 * @default 25
 *
 * @param Bar Y Pos
 * @desc The y-offset of the bar
 * default: 38
 * @default 38
 *
 * @param Bar Width
 * @desc Width of the bar
 * default: 350
 * @default 350
 *
 * @param Bar Height
 * @desc Height of the bar
 * default: 6
 * @default 6
 * 
 * @param -- TEXT --
 *
 * @param Text X Pos
 * @desc The x-offset of the text
 * default: 10
 * @default 10
 *
 * @param Text Y Pos
 * @desc The y-offset of the text
 * default: 10
 * @default 10
 * 
 * @param -- COLOURS --
 * @desc Parameters in this section relate to the bar colours used
 *
 * @param Bar Colour 1
 * @desc The colour for the left side of the gradient (hex format)
 * default: #0099ff
 * @default #0099ff
 *
 * @param Bar Colour 2
 * @desc The colour for the right side of the gradient (hex format)
 * default: #0099ff
 * @default #0099ff
 *
 * @param Bar Bg Colour
 * @desc The colour for the abckground of the bar (hex format)
 * default: #000000
 * @default #000000
 * 
 * @param Text Colour
 * @desc Colour of the text to be displayed
 * @default #ffffff
 * 
 * @param -- IMAGE --
 * @desc Parameters in this section relate to the image display
 *
 * @param Show Background Image
 * @desc Toggles display of the image
 * default: false
 * @default false
 * 
 * @param Background Image
 * @desc The file to use for the background image
 * @require 1
 * @dir img/pictures/
 * @type file
 * 
 * @help============================================================================
 *       S_Rank_Crazy's Timed Bar Display
 * ============================================================================
 * Adds a window that displays a message and a progress bar for a period of
 * time. Time can be tracked using a frame count or in real-time.
 * 
 * All SRCrazy plugins are rename safe - you can rename the file and it'll still
 * work. All parameters and commands are case-safe (no need to worry about
 * case-sensitive input) unless specifically stated. This doesn't include
 * Comment Tags or file names/paths; they are still case sensitive.
 * 
 * MVCommons supported but not required for use.
 * 
 * ============================================================================
 * SCRIPT CALL
 *
 * timedbar(x, y, message, time, isRealTime);
 * 
 * Eg:
 * timedbar(10, 10, "Hello", 10, true);
 *
 * The above example will display a window at position [10,10] and will be
 * removed after 10 seconds. Passing false or omitting the 'isRealTime'
 * parameter will translate the 'time' value as the number of frames to count.
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
 * timedbar(10, 10, "Hello", 10, true).assignToVariable(1).assignToSwitch(1);
 * 
 * This will create the display as before but also update variable with ID 1
 * every frame, and then change switch with ID 1 when complete.
 * 
 *
 * ============================================================================
 */

///////////////////////////////////////////////////////////////////////////////
//							Plugin Management
// [CODE]	Here
// LKUP		Top

var Imported = Imported || {};

// Set up namespace and plugin vars
var SRCrazy = SRCrazy || {};
SRCrazy.TimedBarDisplay = SRCrazy.TimedBarDisplay || {};

///////////////////////////////////////////////////////////////////////////////
//							Plugin Initialisation

(function($, $core)
{
	"use strict";
	
	// Setup plugin variables
	if ($core)
	{
		$core.registerPlugin($, "SRCrazy_TimedBarDisplay", "1.0.0", "2016-09-19", true);
	}
	else
	{
		var plugin = $plugins.filter(function(plugin)
		{
			return (plugin.description.indexOf('<SRCrazy_TimedBarDisplay>') >= 0);
		})[0];

		$.Params = plugin.parameters;
	}
	
	$.showWindow = ($.Params["Show Window"].toLowerCase() === "true");
	$.windowWidth = Number($.Params["Window Width"] || 400);
	$.windowHeight = Number($.Params["Window Height"] || 80);
	
	$.showBgImage = ($.Params["Show Background Image"].toLowerCase() === "true");
	$.bgImage = $.Params["Background Image"];
	
	$.textX = Number($.Params["Text X Pos"] || 0);
	$.textY = Number($.Params["Text Y Pos"] || 0);
	
	$.barX = Number($.Params["Bar X Pos"] || 0);
	$.barY = Number($.Params["Bar Y Pos"] || 0);
	$.barWidth = Number($.Params["Bar Width"] || 350);
	$.barHeight = Number($.Params["Bar Height"] || 6);
	
	$.colour1 = $.Params["Bar Colour 1"];
	$.colour2 = $.Params["Bar Colour 2"];
	$.bgColour = $.Params["Bar Bg Colour"];
	$.textColour = $.Params["Text Colour"] || "#ffffff";
	
	if (!$.colour1)
	{
		$.colour1 = "transparent";
	}
	if (!$.colour2)
	{
		$.colour2 = "transparent";
	}
	if (!$.bgColour)
	{
		$.bgColour = "transparent";
	}

	///////////////////////////////////////////////////////////////////////////////
	
	function Container_TimedDisplay()
	{
		this.initialize.apply(this, arguments);
	}
	
	Container_TimedDisplay.prototype = Object.create(Sprite.prototype);
	Container_TimedDisplay.prototype.constructor = Container_TimedDisplay;

	Container_TimedDisplay.prototype.initialize = function(x, y, text, time, isRealTime)
	{
		Sprite.prototype.initialize.call(this, new Bitmap(Graphics.width, Graphics.height));
		
		this._absoluteX = x;
		this._absoluteY = y;
		
		this._text = text;
		
		this._isRealTime = isRealTime;
		if (isRealTime)
		{
			this._startTime = timeNowInSeconds();
			this._targetTime = this._startTime + time;
		}
		else
		{
			this._frameCount = 0;
			this._totalFrames = time;
		}
		
		// draw objects
		if ($.showWindow)
		{
			this.drawWindow(x, y);
		}
		else if ($.showBgImage)
		{
			this.drawBgImage(x, y);
		}
		
		
		// draw bar display
		var content = new Sprite(new Bitmap(Graphics.width, Graphics.height));
		this.addChild(content);
		this.contents = content.bitmap;
		this.contents.clear();
		
		this.drawMessage();
		this.drawBar();
	};
	
	Container_TimedDisplay.prototype.destroy = function()
	{
		if (this.parent)
		{
			this.parent.removeChild(this);
			this._image = null;
			this._window = null;
		}
	};
	
	/**
	 * Draws the window at position
	 * @param x Positionon x-axis
	 * @param y Positionon y-axis
	 */
	Container_TimedDisplay.prototype.drawWindow = function(x, y)
	{
		this._window = new Window_Base(x, y, $.windowWidth, $.windowHeight);
		this.addChild(this._window);
	};
	
	/**
	 * Draws the background image at position
	 * @param x Positionon x-axis
	 * @param y Positionon y-axis
	 */
	Container_TimedDisplay.prototype.drawBgImage = function(x, y)
	{
		var path = 'img/pictures/' + $.bgImage + '.png';
		var bmp = ImageManager.loadNormalBitmap(path);
		var $this = this;
		bmp.addLoadListener(function()
		{
			$this._image = new Sprite(bmp);
			$this._image.x = x;
			$this._image.y = y;
			$this.addChildAt($this._image, 0);
		});
	};

	/**
	 * Draws the message
	 */
	Container_TimedDisplay.prototype.drawMessage = function()
	{
		this.contents.textColor = $.textColour;
		this.contents.drawText(this._text, this._absoluteX + $.textX, this._absoluteY + $.textY, Graphics.width, 36);
	};

	/**
	 * Draws the progress bar
	 */
	Container_TimedDisplay.prototype.drawBar = function(scale)
	{
		scale = scale || 0;
		var fillW = $.barWidth * scale;
		var x = this._absoluteX + $.barX;
		var y = this._absoluteY + $.barY;
		
		this.contents.fillRect(x, y, $.barWidth, $.barHeight, $.bgColour);
		this.contents.gradientFillRect(x, y, fillW, $.barHeight, $.colour1, $.colour2);
	};
	
	Container_TimedDisplay.prototype.update = function()
	{
		Sprite.prototype.update.call(this);
		
		var scale = 0;
		
		// if we're updating in real-time
		if (this._isRealTime)
		{
			// scale over our start and end times
			var now = timeNowInSeconds();
			scale = (now - this._startTime) / (this._targetTime - this._startTime);
			this.updateVariable(now - this._startTime);
		}
		// if we're updating by frames
		else
		{
			// scale over the frame count
			scale = ++this._frameCount / this._totalFrames;
			this.updateVariable(this._frameCount);
		}
		
		// hide if we've finished
		if (1 <= scale)
		{
			this.complete();
		}
		// otherwise update the bar
		else
		{
			this.drawBar(scale);
		}
	};
	
	Container_TimedDisplay.prototype.assignToVariable = function(variableId)
	{
		this._variableId = variableId;
		this._hasVariable = true;
		
		return this;
	};
	
	Container_TimedDisplay.prototype.assignToSwitch = function(switchId)
	{
		this._switchId = switchId;
		this._hasSwitch = true;
		
		return this;
	};
	
	Container_TimedDisplay.prototype.assignToCommonEvent = function(commonEventId)
	{
		this._commonEventId = commonEventId;
		this._hasCommonEvent = true;
		
		return this;
	};
	
	Container_TimedDisplay.prototype.updateVariable = function(value)
	{
		if (this._hasVariable)
		{
			$gameVariables.setValue(this._variableId, value);
		}
	};
	
	Container_TimedDisplay.prototype.complete = function()
	{
		this.updateVariable((this._isRealTime) ? this._targetTime : this._totalFrames);
		
		if (this._hasSwitch)
		{
			var value = $gameSwitches.value(this._switchId);
			$gameSwitches.setValue(this._switchId, !value);
		}
		
		if (this._hasCommonEvent)
		{
			$gameTemp.reserveCommonEvent(_commonEventId);
		}
		
		this.destroy();
	};
	
	// Send to global namespace
	SRCrazy.Container_TimedDisplay = Container_TimedDisplay;
	
})(SRCrazy.TimedBarDisplay, SRCrazy.Core);

// Function to get the current time in seconds
function timeNowInSeconds() { return new Date().getTime() / 1000; }

// Function to create/display window
timedbar = function(x, y, text, time, isRealTime)
{
	var window = new SRCrazy.Container_TimedDisplay(x, y, text, time, isRealTime);
	SceneManager._scene.addChild(window);
	return window;
};