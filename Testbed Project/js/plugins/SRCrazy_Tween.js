//=============================================================================
// SRCrazy_Tween.js
//=============================================================================

/*:
 * @author S_Rank_Crazy
 * @plugindesc v1.0 Required for some SRCrazy plugins. Provides tweening functionality.
 * <SRCrazy_Tween>
 * 
 * ============================================================================
 * 
 * @help
 * ============================================================================
 *                      S_Rank_Crazy's Tweening Plugin
 * ============================================================================
 * This plugin provides tweening functionality for other plugins.
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
 * USAGE
 * 
 * This plugin provides a Tween class used to animate/tween values of an
 * object from their current value to a target value over time. The class is
 * found in the SRCrazy global namespace at:
 * 
 * SRCrazy.Classes.Tween
 * 
 * To use the class you'll need to first create a new Tween instance, add
 * the desired properties [to be tweened] and manage its state through
 * playback/update methods:
 * 
 * var targetObject = { x: 0, y: 0 };
 * var tween = new SRCrazy.Classes.Tween(targetObject, 5);
 * tween.addProperty("x", targetObject.x, 120);
 * tween.onCompleteCallback = function() {
 *     console.log("My tween completed");
 * };
 * 
 * setInterval(1000, function() {
 *     tween.update();
 * });
 * 
 * In the above exmaple, we create a tween to animate the value of property
 * `x` of `targetObject` from 0 to 120, over a duration of 5 seconds. We then
 * call the tween's `update` method on a 1000 millisecond (1 second) interval.
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

SRCrazy.Classes.Tween = (function() {
	"use strict";

	var $core = SRCrazy.Plugins.Core;
	var plugin = {};

	$core.registerPlugin(plugin, "SRCrazy_Tween", "1.0", "2018-08-25", false, "SRCrazy_Core");
	
	/**
	 * Tween constructor
	 * 
	 * @param {*} target The object whose properties the Tween will update
	 * @param {number} duration The length (sin seconds) of the tween
	 * @param {Function} [easeFunc] Function to use for easing, if none passed a linear ease function is used
	 */
	function Tween(target, duration, easeFunc) {
		this._target = target;
		this._duration = number(duration);
		this._easing = easeFunc;
		
		this._properties = {};
		
		this._progress = 0;
		this._isRunning = false;
		this._runBackwards = false;
	}
	
	var _p = $core.createClass(Tween);
	
	/**
	 * Commonly used tween completion behaviours
	 */
	Tween.CompleteBehaviour = {
		oscillate: function(target) {
			this.start(!this.isBackwards);
		},
		repeat: function(target) {
			this.start();
		},
		remove: function(target) {
			var realTarget = target.tweenContainer || target;
			try {
				realTarget.removeTween(this);
				this.destroy();
			} catch (e) {
				console.error("SRCrazy_Tween.TweenCompleteBehaviour.remove FAILED\nTween target has no function such function 'removeTween'", realTarget);
			}
		}
	};
	
	/**
	 * Commonly used tween easing methods
	 */
	Tween.Easing = {
		linear: function(t) { return t; },
		
		quadIn:	function(t) { return Math.pow(t, 2); },
		quadOut:	function(t) { return 1 - Tween.TweenEasing.quadIn(1 - t); },
		quadInOut:	function(t) { return (t < 0.5) ? Tween.TweenEasing.quadIn(t) : Tween.TweenEasing.quadOut(t); },
		
		cubicIn:	function(t) { return Math.pow(t, 3); },
		cubicOut:	function(t) { return 1 - Tween.TweenEasing.cubicIn(1 - t); },
		cubicInOut:	function(t) { return (t < 0.5) ? Tween.TweenEasing.cubicIn(t) : Tween.TweenEasing.cubicOut(t); },
		
		sineIn:		function (t) { return Math.sin( (Math.PI / 2) * t); },
		sineOut:	function (t) { return 1 - Tween.TweenEasing.sineIn(1 - t); },
		sineInOut:	function(t) { return (t < 0.5) ? Tween.TweenEasing.sineIn(t) : Tween.TweenEasing.sineOut(t); },
		
		elasticIn:	function (t) {
			var p = 0.3;
			return Math.pow(2, -10 * t) * Math.sin((t-p / 4) * (2 * Math.PI ) / p) + 1;
		},
		elasticOut:		function (t) { return 1 - Tween.TweenEasing.elasticIn(1 - t); },
		elasticInOut:	function(t) { return (t < 0.5) ? Tween.TweenEasing.elasticIn(t) : Tween.TweenEasing.elasticOut(t); }
	};

	/**
	 * Is the tween running?
	 * 
	 * @returns {boolean}
	 */
	$core.createGetter(_p, "isRunning", function() { return this._isRunning; });
	
	/**
	 * Is the Tween set to run backwards?
	 * 
	 * @returns {boolean}
	 */
	$core.createGetter(_p, "isBackwards", function() { return this._isBackwards; });
	
	/**
	 * Retrieves the Tween's progress (between 0-1).
	 * 
	 * @returns {number}
	 */
	$core.createGetter(_p, "progress", function() { return this._progress; });
	
	/**
	 * Retrieves the Tween's target.
	 * 
	 * @returns {*}
	 */
	$core.createGetter(_p, "target", function() { return this._target; });
	
	/**
	 * Strips internal references to make sure it's garbage collected properly
	 */
	_p.destroy = function() {
		for (var n in this._properties) {
			this._properties[n].destroy();
		}
		
		this._properties = null;
		this._target = null;
		this._easing = null;
	};
	
	/**
	 * Adds a property to the Tween.
	 * 
	 * @param {string} name Name of the property on the target object
	 * @param {number} startValue The starting value
	 * @param {number} endValue The final value
	 * @param {Function} [easeFunc] Function to use for easing, if none passed a linear ease function is used
	 * @param {Function} [onUpdateCallback] Function to call when tween is updated
	 */
	_p.addProperty = function(name, startValue, endValue, easeFunc, onUpdateCallback) {
		var prop = new TweenProperty(this._target, name, startValue, endValue, easeFunc || this._easing, onUpdateCallback);
		this._properties[name] = prop;
	};
	
	/**
	 * Starts running Tween, sets properties to initial values.
	 * 
	 * @param {boolean} backwards Should the Tween run backwards?
	 */
	_p.start = function(backwards) {
		if (this._isRunning || !this._target) {
			return;
		}
		
		backwards = !!backwards;
		
		this._progress = 0;
		this._durationTracker = 0;
		this._isRunning = true;
		this._runBackwards = backwards;
		
		for (var prop in this._properties) {
			this._properties[prop].reset(backwards);
		}
		
		this._lastUpdateTime = new Date().getTime();
	};
	
	/**
	 * Resumes running from last state (used in conjunction with stop())
	 */
	_p.resume = function() {
		this._isRunning = true;
	};

	/**
	 * Stops update method from running (pauses internal time tracking)
	 */
	_p.stop = function() {
		this._isRunning = false;
	};
	
	/**
	 * Updates all the properties in the Tween
	 * @param {Number} timePassed Time passed since last update
	 */
	_p.update = function(timePassed) {
		var now = new Date().getTime();
		
		// Not active, do nothing
		if (!this._isRunning) {
			this._lastUpdateTime = now;
			return;
		}
		
		// No time passed by caller, use last update time to figure out how ong it's been
		if (!timePassed) {
			timePassed = (now - this._lastUpdateTime) / 1000;
		}
		
		// Progress Tween by the amount of time passed since last update
		this._durationTracker = Math.min(this._durationTracker + timePassed, this._duration);
		this._progress = this._durationTracker / this._duration;
		
		// Update TweenProperties
		var scaledTime;
		var finishedValue;
		if (this._runBackwards) {
			scaledTime = (this._duration - this._durationTracker) / this._duration;
			finishedValue = 0;
		} else {
			scaledTime = this._progress;
			finishedValue = 1;
		}
		
		for (var prop in this._properties) {
			this._properties[prop].update(scaledTime);
		}
		
		// Invoke update callback
		this._lastUpdateTime = now;
		this.onUpdateCallback(this._target);
		
		// We're finished
		if (scaledTime === finishedValue) {
			this._isRunning = false;
		
			// Invoke complete callback
			this.onCompleteCallback(this._target);
		}
	};
	
	/**
	 * Invoked when Tween updates. To be overridden by users.
	 */
	_p.onUpdateCallback = function(target) {};
	
	/**
	 * Invoked when Tween completes. To be overridden by users.
	 */
	_p.onCompleteCallback = function(target) {};


	
	/**
	 * Tween helper class. private.
	 * @returns {TweenProperty}
	 */
	function TweenProperty() {
		this.initialize.apply(this, arguments);
	}
	
	var _p = $core.createClass(TweenProperty);
	
	_p.initialize = function(target, propertyName, start, end, easeFunc, onUpdateCallback) {
		this._target = target;
		this._propertyName = propertyName;
		this._start = Number(start);
		this._end = Number(end);
		this._diff = this._end - this._start;
		
		this._ease = easeFunc || Tween.TweenEasing.linear;
		this._onUpdateCallback = onUpdateCallback;
	};
	
	/**
	 * Strips internal references to make sure it's garbage collected properly
	 */
	_p.destroy = function() {
		this._target = null;
		this._ease = null;
	};
	
	/**
	 * Reset the property to initial state, ready for the Tween to run
	 * @param {Boolean} backwards Will the tween be running backwards?
	 */
	_p.reset = function(backwards) {
		this.update( (backwards) ? 1 : 0 );
	};
	
	/**
	 * Update the property to the correct value
	 * @param {Number} progress Progress percentage between 0 and 1
	 */
	_p.update = function(progress) {
		var value = this.ease(progress);
		this._target[this._propertyName] = value;
		
		if (this._onUpdateCallback) {
			this._onUpdateCallback(value);
		}
	};
	
	_p.ease = function(progress) {
		if (progress === 0) {
			return this._start;
		}

		if (progress === 1) {
			return this._end;
		}
		
		var t = this._ease(progress);
		return this._start + (this._diff * t);
	};
	
	return Tween;
})();