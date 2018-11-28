///////////////////////////////////////////////////////////////////////////////
/* Title Scene Addons
 * ============================================================================
 * RPG Maker MV
 * SRCrazy_TitleAddons.js
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
 * 2016-01-03
 * - Version 1.0.0
 * - Release
 * 
 * ============================================================================
 */

///////////////////////////////////////////////////////////////////////////////
/* ============================================================================
 * Search file for indexer on left side to navigate.
 * E.g. "[LKUP]" to navigate here.
 * 
 * ============================================================================
 * [LKUP]	Here
 * 
 * [CODE]	Start of code, plugin management happens here
 * 
 * [INIT]	Plugin initialisation, invoked by main.js, override Scene_Boot
 *			
 * [SKIP]	Setups up intercepting access to title scene
 *			
 * [EXIT]	Exiting (closing) the game
 * 
 * ============================================================================
 */ 

///////////////////////////////////////////////////////////////////////////////
/*:
 * @author S_Rank_Crazy
 * @plugindesc v1.0.0 Adds some functionality to the title scene loading process.
 * <SRCrazy_TitleAddons>
 * 
 * @param -- Skip Title Settings --
 * @desc Parameters in this section relate to skipping the title scene on boot
 *
 * @param SkipTitle
 * @desc Skips the title scene and loads a map on boot
 * NO - false     YES - true
 * @default false
 *
 * @param SkipMapId
 * @desc ID of map to skip to if SkipTitle is true. If not set uses default starting map
 * @default 1
 * 
 * @param -- Intercept Settings --
 * @desc Paramaters in this section relate to intercepting the title scene
 * 
 * @param InterceptTitle
 * @desc Intercepts all access to title scene and redirects elsewhere
 * NO - false     YES - true
 * @default false
 * 
 * @param InterceptRedirect
 * @desc Dictates where user is redirected to when intercepting title scene
 * none (default), map, scene
 * @default map
 * 
 * @param InterceptDestination
 * @desc The ID of the map, name of the scene, etc...
 * @defaul 1
 * 
 * @param -- Exit Settings --
 * @desc Paramaters in this section relate to exiting the game
 * 
 * @param EnableExit
 * @desc Adds exit option to title scene command window
 * NO - false     YES - true
 * @default false
 * 
 * @param ExitText
 * @desc Text to display for command option
 * @default Quit
 * 
 * @help============================================================================
 *      S_Rank_Crazy's plugin to modify the title scene and boot process
 * ============================================================================
 * This plugin adds some customisability to what happens when the game boots
 * and some functionality to the title scene.
 * 
 * * Requires SRCrazy_Core plugin to use the Exit settings.
 * 
 * All SRCrazy plugins are rename safe - you can rename the file and it'll still
 * work. All parameters and commands are case-safe (no need to worry
 * about case-sensitive input) unless specifically stated. This doesn't include
 * Comment Tags; they are still case sensitive.
 * 
 * MVCommons supported but not required for use.
 * 
 *============================================================================
 * FEATURES
 * 
 * * Bypass the Title scene and load a map instead
 * * Override all access of the Title scene to rediect to:
 *   - another scene
 *   - a map (useful if you're using a map as a Title replacement)
 * * Add an 'Exit' command to the Title scene command window
 * 
 * ============================================================================
 */


///////////////////////////////////////////////////////////////////////////////
//							Plugin Initialisation
// [CODE]	Here
// [LKUP	Top

var Imported = Imported || {};

// Set up namespace and plugin vars
var SRCrazy = SRCrazy || {};
SRCrazy.TitleAddons = SRCrazy.TitleAddons || {};


(function($)
{
	"use strict";
	
	var $core = SRCrazy.Core;
	$core.registerPlugin($, "SRCrazy_TitleAddons", "1.0.0", "2016-01-03", true, ["SRCrazy_Core"]);

	// Setup plugin variables
	$.skipTitle = ($.Params['SkipTitle'].toLowerCase() === "true");
	$.skipMapId = Number($.Params['SkipMapId'] || $dataSystem.startMapId);
	$.interceptTitle = ($.Params['InterceptTitle'].toLowerCase() === "true");
	$.interceptType = String($.Params['InterceptRedirect'].toLowerCase());
	$.showExit = ($.Params['EnableExit'].toLowerCase() === "true");
	$.exitText = String($.Params['ExitText']);
	
	///////////////////////////////////////////////////////////////////////////
	//							Initialisation
	// [INIT]	Here
	// [LKUP	Top
	
	// Intercept boot process
	Scene_Boot.prototype.start = function()
	{
		Scene_Base.prototype.start.call(this);
		SoundManager.preloadImportantSounds();
		
		if (DataManager.isBattleTest())
		{
			DataManager.setupBattleTest();
			SceneManager.goto(Scene_Battle);
		}
		else if (DataManager.isEventTest())
		{
			DataManager.setupEventTest();
			SceneManager.goto(Scene_Map);
		}
		else
		{
			this.checkPlayerLocation();
			DataManager.setupNewGame();
			
			if ($.skipTitle)
			{
				$.skipToMapOnBoot();
			}
			else if ($.interceptTitle)
			{
				$.onTitleIntercept();
			}
			else
			{
				SceneManager.goto(Scene_Title);
			}
		}
		
		this.updateDocumentTitle();
	};
	
	///////////////////////////////////////////////////////////////////////////
	//							Title Screen Intercepting
	// [SKIP]	Here
	// [LKUP	Top
	
	/**
	 * Invoked on game boot to skip the title scene
	 */
	$.skipToMapOnBoot = function()
	{
		$gamePlayer.reserveTransfer($.skipMapId, $dataSystem.startX, $dataSystem.startY);
		SceneManager.goto(Scene_Map);
	};
	
	/**
	 * Get the correct delegate for redirecting the title scene access
	 */
	if ($.interceptType === 'map')
	{
		var mapId = Number($.Params['InterceptDestination']);
		
		$.onTitleIntercept = function(caller, fade)
		{
			if (fade)
			{
				caller.fadeOutAll();
			}
			
			$gamePlayer.reserveTransfer(mapId, $dataSystem.startX, $dataSystem.startY);
			SceneManager.goto(Scene_Map);
		};
	}
	else if ($.interceptType === 'scene')
	{
		var sceneName = String($.Params['InterceptDestination']);
		
		$.onTitleIntercept = function(caller, fade)
		{
			if (fade)
			{
				caller.fadeOutAll();
			}
			
			SceneManager.goto(window[sceneName]);
		}
	}
	
	// If we have the delegate, override all access
	if ($.onTitleIntercept)
	{
		// From Menu
		var Override_commandToTitle = Scene_GameEnd.prototype.commandToTitle;
		Scene_GameEnd.prototype.commandToTitle = function()
		{
			if ($.interceptTitle)
			{
				$.onTitleIntercept(this, true);
			}
			else
			{
				Override_commandToTitle.call(this);
			}
		};
		
		// From Gameover
		var Override_goToTitle = Scene_Gameover.prototype.gotoTitle;
		Scene_Gameover.prototype.gotoTitle = function()
		{
			if ($.interceptTitle)
			{
				$.onTitleIntercept(this);
			}
			else
			{
				Override_goToTitle.call(this);
			}
		};
		
		// From Event command
		var Override_command354 = Game_Interpreter.prototype.command354;
		Game_Interpreter.prototype.command354 = function()
		{
			if ($.interceptTitle)
			{
				$.onTitleIntercept(this, true);
			}
			else
			{
				Override_command354.call(this);
			}
			
			return true;
		};
	}
	
	
	///////////////////////////////////////////////////////////////////////////
	//							Exit Game Command
	// [EXIT]	Here
	// [LKUP	Top
	
	// Add exit option to command window
	if ($.showExit)
	{
		/**
		 * Set up function to exit game
		 */
		Scene_Title.prototype.commandExitGame = function()
		{
			this._commandWindow.close();
			$core.exitGame(true);
		};
		
		/**
		 * Override command list creation to insert item
		 */
		var Override_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
		Window_TitleCommand.prototype.makeCommandList = function()
		{
			Override_makeCommandList.call(this);
			this.addCommand($.exitText, 'exitGame');
		};

		/**
		 * Override command window creation to insert handler
		 */
		var Override_createCommandWindow = Scene_Title.prototype.createCommandWindow;
		Scene_Title.prototype.createCommandWindow = function()
		{
			Override_createCommandWindow.call(this);
			this._commandWindow.setHandler('exitGame', this.commandExitGame.bind(this));
		};
	}

	
})(SRCrazy.TitleAddons);