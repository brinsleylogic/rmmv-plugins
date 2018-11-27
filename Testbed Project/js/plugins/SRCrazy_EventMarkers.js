//=============================================================================
// SRCrazy_EventMarkers.js
//=============================================================================
//
// DEPENDENCIES:
// 
// SRCrazy_Core
//
//=============================================================================

/*:
 * @author S_Rank_Crazy
 * @plugindesc v1.0 Provides a means to display/manage icons above events.
 * <SRCrazy_EventMarkers>
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
 * Requires SRCrazy_Core plugins.
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

	function Controller(eventId, mapId) {
		this._mapId = mapId;
		this._eventId = eventId;
		this._name;
	}

	var _p = $core.createClass(Controller);

	/**
	 * Tracks the target event.
	 * 
	 * @param {Game_Event} event The target event to track
	 * @returns {this}
	 */
	_p.setEvent = function(event) {
		this._event = event;
		this._mapId = event.mapId();
	};
	

	//=========================================================================
	// Marker Management
	//=========================================================================

	var _markers = [];
	var _lookup = {};

	/**
	 * Creates a unique name for an event based on it's map and id.
	 * 
	 * @param {number} mapId ID for the map the event belongs to
	 * @param {number} eventId ID for the event
	 */
	function getMarkerName(mapId, eventId) {
		return mapId + "|" + eventId;
	}

	/**
	 * Ensures markers are assigned their new Game_Event instances to track.
	 */
	var GameMap_setupEvents = Game_Map.prototype.setupEvents;
	Game_Map.prototype.setupEvents = function() {
		GameMap_setupEvents.call(this);

		for (var i = 0, l = this._events.length; i < l; i++) {
			var event = this._events[i];
			var makerName = getMarkerName(this._mapId, event.eventId());
			var marker = _lookup[makerName];

			if (marker && marker.mapId === this._mapId) {
				marker.setEvent(event);
			}
		}
	};
	

	//=========================================================================
	// Plugin Setup
	//=========================================================================

	$core.registerPlugin(plugin, "SRCrazy_EventMarkers", "1.0", "2018-08-28", false, "SRCrazy_Core");
	
	$core.parseParameters(plugin);

	return plugin;
})();