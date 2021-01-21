/*:
 * @author brinsleylogic (S_Rank_Crazy)
 * @plugindesc v1.0.0 Provides a simple timer class.
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
 * SRCrazy.Timer
 *
 * To use the class you'll need to first create a new Tween instance, add
 * the desired properties [to be tweened] and manage its state through
 * playback/update methods:
 *
 * var timer = new SRCrazy.Timer(function() {
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
 */