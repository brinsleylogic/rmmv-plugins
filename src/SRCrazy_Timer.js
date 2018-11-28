//=============================================================================
// SRCrazy_Timer.js
//=============================================================================
//
// DEPENDENCIES:
// 
// SRCrazy_Core
//
//=============================================================================

/*:
 * @author S_Rank_Crazy
 * @plugindesc v1.0 Required for some SRCrazy plugins. Provides a simple timer class.
 * <SRCrazy_Timer>
 * 
 * ============================================================================
 * 
 * @help
 * ============================================================================
 *                        S_Rank_Crazy's Timer Plugin
 * ============================================================================
 * This plugin provides a simple timer for other plugins.
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
 * ============================================================================
 * USAGE
 * 
 * This plugin provides a Timer class used to delay the execution of function
 * calls, and optionally repeat them a set number of times (or indefinitely).
 * The class is found in the SRCrazy global namespace at:
 * 
 * SRCrazy.Classes.Timer
 * 
 * To use the class you'll need to first create a new Tween instance, add
 * the desired properties [to be tweened] and manage its state through
 * playback/update methods:
 * 
 * var timer = new SRCrazy.Classes.Timer(function() {
 *     console.log("Hello");
 * }, 1, 5);
 * timer.start();
 * 
 * In the above exmaple, we create a timer that logs "Hello" 5 times, with
 * an interval of 1 second between each function call.
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
 * Requires SRCrazy_Core plugin.
 * 
 * ============================================================================
 */

SRCrazy.Classes.Timer = (function() {
	"use strict";

	var $core = SRCrazy.Plugins.Core;
	var plugin = {};

	$core.registerPlugin(plugin, "SRCrazy_Timer", "1.0", "2018-11-27", false, "SRCrazy_Core");

	/**
	 * Creates a new Timer.
	 * 
	 * @param {() => void} callback Function to call when delay elapses
	 * @param {number} duration The delay (in seconds) between the callback being invoked
	 * @param {number} [repeatCount=0] The number of times to repeat this timer
	 * @param {boolean} [isRealTime=true] Indicates whether timer uses real time updates or frame-counting.
	 */
	function Timer(callback, duration, repeatCount, isRealTime) {
		this._callback = callback;
		this._count = repeatCount || 0;
		this._isRealTime = (isRealTime || isRealTime === undefined);
		this._duration = (this._isRealTime) ? (duration || 0) * 1000 : (duration || 0);

		this._lastUpdateTime = 0;

		this._tracker = 0;
		this._currentCount = 0;
		this._isRunning = false;

		_timers.push(this);
	}

	var _p = $core.createClass(Timer);
	$core.createGetter(Timer, "frameRate", function() { return _frameRate; });

	var _interval;
	var _lastTime = Date.now();
	var _timers = [];
	var _paused = false;
	var _frameRate;

	/**
	 * Updates all active Timer instances.
	 */
	function update() {
		var timeNow = Date.now();
		
		if (!_paused) {
			var i = _timers.length;
			while (i-- > 0) {
				var timer = _timers[i];
				timer.update(timeNow - _lastTime);

				if (timer.isDestroyed) {
					_timers.splice(i, 1);
				}
			}
		}

		_lastTime = timeNow;
	}

	/**
	 * Sets the rate at which Timer instances update.
	 * 
	 * @static
	 * @param {number} fps Frames per second
	 */
	Timer.setFrameRate = function(fps) {
		if (_interval) {
			clearInterval(_interval);
		}

		_frameRate = 1000 / fps;
		_interval = setInterval(update, _frameRate);
	};

	/**
	 * Creates a Timer instance for delaying a function call.
	 * 
	 * @static
	 * @param {() => void} callback Function to call when delay elapses
	 * @param {number} delay The delay between the callback being invoked
	 * @param {boolean} [isRealTime=true] Indicates whether timer uses real time updates or frame-counting.
	 * @returns {Timer}
	 */
	Timer.create = function(callback, delay, isRealTime) {
		var timer = new Timer(callback, delay, isRealTime);
		timer.start();
		return timer;
	};

	/**
	 * Stops timers from being processed/updated.
	 * 
	 * @static
	 */
	Timer.pause = function() {
		_paused = true;
	};

	/**
	 * Resumes timer processing/updating.
	 * 
	 * @static
	 */
	Timer.resume = function() {
		_paused = false;
	};

	$core.createGetter(_p, "isRunning", function() { return this._isRunning; });

	$core.createGetter(_p, "isDestroyed", function() { return this._isDestroyed; });

	$core.createGetter(_p, "duration", function() { return (this._count > 0) ? this._duration * this._count : this._duration; });

	$core.createGetter(_p, "currentTime", function() { return (this._count > 0) ? (this._currentCount * this._duration) + this._tracker : this._tracker; });

	/**
	 * Starts the timer.
	 */
	_p.start = function() {
		this._isRunning = true;
	};

	/**
	 * Stops the timer.
	 */
	_p.stop = function() {
		this._isRunning = false;
	};

	/**
	 * Stops the timer and resets it's internal tracking state.
	 */
	_p.reset = function() {
		this._isRunning = false;
		this._currentCount = 0;
		this._tracker = 0;
	};

	/**
	 * Marks this timer as destroyed and updates internals.
	 */
	_p.destroy = function() {
		this._isDestroyed = true;
		this._isRunning = false;
		this._callback = undefined;
	};

	/**
	 * Updates the internal state of the timer.
	 * 
	 * @param {number} timeNow Current time in milliseconds
	 */
	_p.update = function(timeSinceLastUpdate) {
		if (this._isRunning) {
			// Calculacte timinigs based on real time elapsing
			if (this._isRealTime) {
				this._tracker += timeSinceLastUpdate;

			// Otherwise use frame-based calculations
			} else {
				this._tracker++;
			}

			// Check for completion
			if (this._tracker >= this._duration) {
				this._callback();

				// Start the next cycle if we have a count
				if (this._currentCount++ < this._count) {
					this._tracker -= this._duration;

				// If count is 0, remove this timer
				} else if (this._count === 0) {
					this.destroy();
				}
			}
		}
	};

	Timer.setFrameRate(60);

	return Timer;
})();