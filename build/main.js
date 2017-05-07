///////////////////////////////////////////////////////////////////////////////
/* S_Rank_Crazy's main Plugin
 * ============================================================================
 * RPG Maker MV
 * SRCrazy_Main.js
 * 
 * ============================================================================
 * No personal credit required, but always appreciated.
 * Free for personal and commercial use.
 * 
 * ============================================================================
 * CHANGELOG
 * 
 * 1.0.0 | 2017-03-11

 * 
 * ============================================================================
 */
///////////////////////////////////////////////////////////////////////////////
/*:
 * @author S_Rank_Crazy
 * @plugindesc 1.0.0 main desc
 * <SRCrazy_Main>
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
class Main {
    constructor() {
        this.foo = 0;
    }
}
