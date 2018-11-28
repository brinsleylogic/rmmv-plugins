///////////////////////////////////////////////////////////////////////////////
/* FFX Style Language Learning
 * ============================================================================
 * RPG Maker MV
 * SRCrazy_LanguagePrimers.js
 * 
 * ============================================================================
 * No personal credit required, but always appreciated.
 * Free for personal and commercial use.
 * 
 * ============================================================================
 * 
 * 2016-01-16
 * - v1.1.0
 * - Rewrote formatting to be user configurable to allow ultimate freedom and compatability with other message plugins
 * - Added SRCrazy_Core plugin registration (not required)
 * 
 * 
 * 2016-01-11
 * - v1.0.1
 * - Added Default Colour to tell translator what the default meesage colour should be
 *   - Renamed old varaible to Untraslated Colour
 * - Plugin commands "addPrimer" and "removePrimer" now add/remove items to/from inventory
 *
 * 2016-01-10
 * - Version v1.0.0
 * - Release
 * 
 * ============================================================================
 */

///////////////////////////////////////////////////////////////////////////////
/*:
 * @author S_Rank_Crazy
 * @plugindesc v1.1.0 Provides a system for learning lanuages like the Al Bhed Primers in Final Fantazy X
 * <SRCrazy_LanguagePrimers>
 *
 * @param Default Format
 * @desc The escape-code formatting for the default text
 * default: \c[0]
 * @default \c[0]
 *
 * @param Untranslated Format
 * @desc The escape-code formatting for displaying the untranslated letters
 * default: \c[1]
 * @default \c[1]
 *
 * @param Translated Format
 * @desc The escape-code formatting for displaying the translated letters
 * default: \c[0]
 * @default \c[0]
 * 
 * @help============================================================================
 *       S_Rank_Crazy's Language Primers
 * ============================================================================
 * By using notetags and/or plugin commands you can add simple substitution-based
 * language learning (like the Al Bhed language in Final Fantasy X).
 * 
 * 
 * All SRCrazy plugins are rename safe - you can rename the file and it'll still
 * work. All parameters and commands are case-safe (no need to worry about
 * case-sensitive input) unless specifically stated.
 * 
 * MVCommons supported but not required for use.
 * 
 * ============================================================================
 * FEATURES
 * 
 * * Give a language its own format for when untranslated
 * * Set up multiple languages
 * * Use notetags to control which items translates which set of letters for which
 *   language
 * 
 * ============================================================================
 * NOTE TAGS
 * 
 * The following tags can be used to manage the state of the language "primers".
 * A primer is an item that unlocks a single letter for a language. When text for
 * that language appears, known letters will be displayed. The tag can be used
 * multiple times for an item in order to have in unlock more than one letter.
 * 
 * <LanguagePrimer: translated untranslated language>
 *     LanguagePrimer is the tag that denotes what letter an item unlocks for a
 *     language. The structure of the parameter is as follows:
 * 
 * translated
 *     The letter that should appear when translated
 * 
 * untranslated
 *     The letter that should appear when not translated
 * 
 * language (optional)
 *     If specified, denotes the language to which the primer belongs
 * 
 * ============================================================================
 * PLUGIN COMMANDS
 * 
 * If this plugin is active you can use the following commands:
 * 
 * LanguagePrimers addlanguage language format
 *     Adds support for a new language, if language already exists, can be used
 *     to update the colour it uses. The value used for 'format' an escape-code
 *     string. E.g. \c[0] colours the letter using colour at index 0.
 * 
 * LanguagePrimers add itemId translated untranslated language
 *     This acts the same way as the item not tags; sets up the letter associations
 * 
 * LanguagePrimers addPrimer translated language
 *     Adds the Primer item to the inventory
 * 
 * LanguagePrimers removePrimer translated language
 *     Removes the Primer item from the inventory
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
SRCrazy.LanguagePrimers = SRCrazy.LanguagePrimers || {};

(function($)
{
	"use strict";

	$.DEFAULT_LOOKUP = "_default_";
	$.ITEM_LOOKUP = "_item_";
	
	$._lookup = {};
	$._formats = {};
	
	$.stripSlashes = function(text)
	{
		return text.replace(/\\/g, '\x1b');
	};
	
	$.addLanguage = function(name, format)
	{
		if (!$._lookup[name])
		{
			$._lookup[name] = {};
			$._formats[name] = format || $.untranslatedFormat;
		}
		else if (format)
		{
			$._formats[name] = format || $._formats[name];
		}
	};
	
	$.addToLangLookup = function(itemId, normal, foreign, lang)
	{
		lang = (lang || $.DEFAULT_LOOKUP).toLowerCase();
		
		// ensure we have the lookup created
		$.addLanguage(lang);
		
		// get lookup object
		var lookup = $._lookup[lang];
		
		// add to lookup
		var data = { item: itemId, value: normal };
		lookup[foreign] = data;
		lookup[$.ITEM_LOOKUP + normal] = itemId;
	};
	
	$.translateFromRegex = function()
	{
		// check for having language and text
		var foreignText;
		var lang;

		if (arguments[2] && typeof arguments[2] === 'string')
		{
			lang = arguments[1];
			foreignText = arguments[2];
		}
		else
		{
			foreignText = arguments[1];
		}

		var s = foreignText.split('');
		var str = '';
		for (var i = 0; i < s.length; i++)
		{
			str += $.getForeignLookup(s[i], lang);
		}

		return str + $.defaultFormat;
	};
	
	$.getForeignLookup = function(foreign, lang)
	{
		lang = (lang || $.DEFAULT_LOOKUP).toLowerCase();
		var data;
		
		if ($._lookup[lang])
		{
			data = $._lookup[lang][foreign];
		}
		
		var formatData = {};
		if ($.isPrimerAvailable(lang, data))
		{
			formatData.format = $.translatedFormat;
			formatData.letter = data.value;
		}
		else
		{
			formatData.format = $._formats[lang];
			formatData.letter = foreign;
		}
		
		return formatData.format + formatData.letter;
	};
	
	$.isPrimerAvailable = function(lang, data)
	{
		// No data, not available
		if (!data)
		{
			return false;
		}
		
		// Need the item
		if ($gameParty.hasItem($dataItems[data.item]))
		{
			return true;
		}
		
		return false;
	};
	
})(SRCrazy.LanguagePrimers);

(function($)
{
	// Setup plugin variables
	if (SRCrazy.Core)
	{
		SRCrazy.Core.registerPlugin($, "SRCrazy_LanguagePrimers", "1.1.0", "2016-01-16", true);
	}
	else
	{
		var plugin = $plugins.filter(function(plugin)
		{
			return (plugin.description.indexOf('<SRCrazy_LanguagePrimers>') >= 0);
		})[0];

		$.Params = plugin.parameters;
	}
	
	$.defaultFormat = $.stripSlashes($.Params["Default Format"]);
	$.untranslatedFormat = $.stripSlashes($.Params["Untranslated Format"]);
	$.translatedFormat = $.stripSlashes($.Params["Translated Format"]);
	
	$.addLanguage($.DEFAULT_LOOKUP, $.untranslatedFormat);
	
	///////////////////////////////////////////////////////////////////////////
	//							Initialisation
	// [INIT]	Here
	// [LKUP	Top
	
	var Override_isDatabaseLoaded = DataManager.isDatabaseLoaded;
	DataManager.isDatabaseLoaded = function() {
		if (!Override_isDatabaseLoaded.call(this))
		{
			return false;
		}
		
		var i = $dataItems.length;
		var notes;
		var values;
		while (i-- > 1)
		{
			notes = $dataItems[i].note;
			if (!notes)
			{
				continue;
			}
			
			notes.replace(/<LanguagePrimer:[ ](.*?)>/gi, function()
			{
				values = arguments[1].toLowerCase().split(' ');
				$.addToLangLookup(i, values[0], values[1], values[2]);
			});
		}
		
		return true;
	};
	
	var Override_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
	Window_Base.prototype.convertEscapeCharacters = function(text)
	{
		text = Override_convertEscapeCharacters.call(this, text);
		
		// with specified language
		text = text.replace(/\x1bLanguagePrimer\[(\w+):[ ](.*?)\]/gi, $.translateFromRegex.bind(this));
		
		/// no language specified
		text = text.replace(/\x1bLanguagePrimer\[(.*?)\]/gi, $.translateFromRegex.bind(this));
		
		return text;
	};
	
	
	
	///////////////////////////////////////////////////////////////////////////
	//							Plugin Commands
	// [PLGN]	Here
	// [LKUP	Top
	
	/**
	 * Set up plugin commands
	 */
	var Override_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args)
	{
		// Is it a command for this plugin?
		if (command.toLowerCase() === "languageprimer")
		{
			// check for arguments being passed
			if (args && args.length > 0)
			{
				// check command
				var cmd = args.shift().toLowerCase();
				switch (cmd)
				{
					case "add":
						var itemId = Number(args[0]);
						var normal = String(args[1]).toLowerCase();
						var foreign = String(args[2]).toLowerCase();
						var lang = String(args[3] || $.DEFAULT_LOOKUP).toLowerCase();
						
						$.addToLangLookup(itemId, normal, foreign, lang);
						break;
						
					case "addprimer":
						var normal = String(args[0]).toLowerCase();
						var lang = String(args[1] || $.DEFAULT_LOOKUP).toLowerCase();
						
						if ($._lookup[lang])
						{
							var itemId = $._lookup[lang][$.ITEM_LOOKUP + normal];
							$gameParty.gainItem($dataItems[itemId], 1, false);
						}
						break;
						
					case "removeprimer":
						var normal = String(args[0]).toLowerCase();
						var lang = String(args[1] || $.DEFAULT_LOOKUP).toLowerCase();
						
						if ($._lookup[lang])
						{
							var itemId = $._lookup[lang][$.ITEM_LOOKUP + normal];
							$gameParty.loseItem($dataItems[itemId], 1, false);
						}
						break;
						
					case "addlanguage":
						var lang = String(args[0]).toLowerCase();
						var format = args[1];
						
						$.addLanguage(lang, $.stripSlashes(format));
						break;
				}
			}
		}
		// Call overridden method
		else
		{
			Override_pluginCommand.call(this, command, args);
		}
	};
	
})(SRCrazy.LanguagePrimers);