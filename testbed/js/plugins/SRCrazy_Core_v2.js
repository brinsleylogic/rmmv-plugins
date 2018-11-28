//=============================================================================
// SRCrazy_Core.js
//=============================================================================

PIXI.utils.skipHello();

// Set up namespace and plugin vars
var Imported = Imported || {};

var SRCrazy = SRCrazy || { Plugins: {},  Classes: {} };

/*:
 * @author S_Rank_Crazy
 * @plugindesc v2.0 Required for most SRCrazy scripts. Provides some additional functions to standard classes.
 * <SRCrazy_Core>
 * 
 * ============================================================================
 * 
 * @param Debug Plugins
 * @desc Logs plugins registered via this plugin, MVCommons or similar convention to the javascrit console
 * @default false
 * 
 * @param Cache Event Commands
 * @desc Caches event commands when queried, speeds up repeated retrieval processes
 * @default true
 * 
 * @help
 * ============================================================================
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
 * ============================================================================
 * TERMS OF USE
 * 
 * Free for commercial and non-commercial use. No credit need be given, but
 * always appreciated.
 * 
 * ============================================================================
 */

/**
 * Plugin that contains helper methods for other plugins, handles common logic.
 */
SRCrazy.Plugins.Core = (function() {
	"use strict";

	var _p = {};
	var _registeredPlugins = {};
	
	/**
	 * Override the SceneMAnager's onError method to allow printing contextual data to the console.
	 */
	var SceneManager_onError = SceneManager.onError;
	SceneManager.onError = function(e, data) {
		SceneManager_onError.call(this, e);
		
		if (data !== undefined) {
			console.error(data);
		}
	};

	/**
	 * Throws a game-breaking error and displays the message on screen.
	 * 
	 * @param {string} pluginName Name of the plugin throwing the error
	 * @param {string} message Message to display
	 * @param {*} data Additional data to log to the console
	 */
	_p.throwError = function(pluginName, message, data) {
		var errorMessage = pluginName + " :: " + message;

		var error = new Error(errorMessage);
		error.filename = pluginName;
		SceneManager.onError(error, data);
	};

	/**
	 * Returns the time in seconds.
	 *
	 * @param {number} [milliseconds] If not supplied, uses the time now (on the local machine)
	 * @returns {number}
	 */
	_p.timeInSeconds = function(milliseconds) {
		if (milliseconds === undefined) {
			milliseconds = Date.now();
		}
	
		return milliseconds / 1000;
	};
	
	/**
	 * Converts an angle from degrees to radians.
	 *
	 * @param {number} angleInDegrees
	 * @returns
	 */
	_p.toRadians = function(angleInDegrees) {
		return (Math.PI / 180) * angleInDegrees;
	};

	/**
	 * Ensures the colour value supplied is a string PIXI can read.
	 * 
	 * @param {number | string} colour 
	 * @returns {string}
	 */
	_p.colourString = function(colour) {
		if (typeof colour === "number") {
			return PIXI.utils.hex2string(colour);
		}

		return colour;
	};
	
	/**
	 * Creates a class definition with supplied constructor and base prototype.
	 * 
	 * @param {Function} func Function to use as a constructor
	 * @param {*} [basePrototype] Prototype to use as a base
	 * @return {any} Prototype of class
	 */
	_p.createClass = function(func, basePrototype) {
		var ctor = func || function() {};
		var prototype = (basePrototype) ? Object.create(basePrototype) : {};

		ctor.prototype = prototype;
		ctor.prototype.constructor = ctor;

		return prototype;
	};

	/**
	 * Adds a read-only property to the target object.
	 * 
	 * @param {*} target Object to add property to
	 * @param {string} name Name of the property
	 * @param {() => any} func Function that retrieves the value
	 * @returns {this}
	 */
	_p.createGetter = function(target, name, func) {
		var descriptor = {
			enumerable: true,
			get: func
		};

		Object.defineProperty(target, name, descriptor);

		return this;
	}

	/**
	 * Adds an assignable property to the target object.
	 * 
	 * @param {*} target Object to add property to
	 * @param {string} name Name of the property
	 * @param {(any) => void} func Function that assigns the value
	 * @returns {this}
	 */
	_p.createSetter = function(target, name, func) {
		var descriptor = {
			configurable: true,
			set: func
		};

		Object.defineProperty(target, name, descriptor);

		return this;
	}

	/**
	 * Adds a property to the target object.
	 * 
	 * @param {*} target Object to add property to
	 * @param {string} name Name of the property
	 * @param {() => any} getter Function that retrieves the value
	 * @param {(any) => void} setter Function that assigns the value
	 * @returns {this}
	 */
	_p.createGetterSetter = function(target, name, getter, setter) {
		var descriptor = {
			enumerable: true,
			configurable: true,
			get: getter,
			set: setter
		};

		Object.defineProperty(target, name, descriptor);

		return this;
	}

	/**
	 * Registers the plugin, extracts paramaters and other generic initialisation tasks.
	 * 
	 * @param {*} plugin Plugin to register
	 * @param {string} alias Alias used to register plugin
	 * @param {string} version Version number of the plugin
	 * @param {string} versionDate The publish date of the plugin 
	 * @param {boolean} [requireParameters] Indicates whether plugin requires parameters be set in the PluginManager
	 * @param {string | string[]} [dependencies] List of plugin aliases that this plugin requires
	 * @returns {this}
	 */
	_p.registerPlugin = function(plugin, alias, version, versionDate, requireParameters, dependencies) {
		var $ = plugin;

		// search for plugin by alias, this way renaming files isn't problematic
		var pluginList = $plugins.filter(function(plugin) {
			return (plugin.description.indexOf('<' + alias + '>') >= 0);
		});
		
		// This is our plugin
		var plugin = pluginList[0];
		
		if (!plugin) {
			this.throwError("SRCrazy_Core", "Trying to register plugin " + alias + " but not found in plugin list.", $plugins);
			return;
		}
		
		// If we need parameters, make sure we have them
		if (requireParameters && plugin.parameters.length === 0) {
			this.throwError("SRCrazy_Core", "Couldn't find parameters for plugin:" + alias);
			return;
		}
	
		// Check dependencies
		if (typeof dependencies === "string") {
			dependencies = [dependencies];
		}

		if (dependencies) {
			for (var i = 0, l = dependencies.length; i < l; i++) {
				if (!dependencies[i].indexOf("SRCrazy") === 0 && !this.checkDependency(dependencies[i], alias)) {
					return;
				}
			}
		}
		
		// Set plugin variables
		$.META_DATA = {
			get alias() { return alias; },
			get version() { return version; },
			get versionDate() { return versionDate; },
			get parameters() { return plugin.parameters || {}; }
		};
		
		// Register plugin
		var registered = false;

		if (Imported["MVCommons"] || Imported["PluginManagement"]) {
			var author = [ {
				email: "bahamutsblade@hotmail.com",
				name: "Brinsley Blackwood (S_Rank_Crazy)",
				website: ""
			}];

			if (typeof dependencies === "string") {
				dependencies = [dependencies];
			}
			
			var success = PluginManager.register(alias, version, plugin.description, author, versionDate, dependencies);
			
			if (success === undefined) {
				this.throwError("SRCrazy_Core", "Unable to load plugin due to mising dependencies: " + alias, dependencies);
			} else if (success === false) {
				PluginManager.printPlugin(alias)
				this.throwError("SRCrazy_Core", "Unable to load " + alias + " due to registration failure! Is there another version running?");
			} else {
				registered = true;
			}
		// Can't register so manually import
		} else {
			Imported[alias] = version;
			registered = true;
		}

		if (registered) {
			_registeredPlugins[alias] = $;
		}

		return this;
	};

	/**
	 * Indicates whether the supplied plugin has been registered.
	 * 
	 * @param {string | any} plugin 
	 * @returns {boolean}
	 */
	_p.isRegistered = function(plugin) {
		if (typeof plugin === "string") {
			return !!_registeredPlugins[plugin];
		}

		return !!plugin.META_DATA;
	};

	/**
	 * Indicates whether dependent plugin has been registered, throws error if not.
	 * 
	 * @param {string} dependency Plugin alias
	 * @param {string} requestee Plugin alias
	 * @returns {boolean}
	 */
	_p.checkDependency = function(dependency, requestee) {
		if (this.isRegistered(dependency)) {
			return true;
		}

		this.throwError(requestee, "Dependency not registered:", dependency);

		return false;
	};

	/**
	 * Parses plugin parameters to be correctly typed.
	 * 
	 * @param {*} plugin Plugin whose parameters are to be processed
	 * @param {boolean} [logIfDebug=false] If the supplied plugin is in debug mode, then log the parameters object
	 * @returns {*} Parsed parameters
	 */
	_p.parseParameters = function(plugin, logIfDebug) {
		var params = plugin.META_DATA.parameters;

		for (var key in params) {
			if (!key || key.match(/--[\w\s]+--/)) {
				delete params[key];
				continue;
			}

			var value = params[key].toLowerCase();

			switch (value) {
				case "no":
				case "off":
				case "false":
					params[key] = false;
					break;

				case "yes":
				case "on":
				case "true":
					params[key] = true;

					if (key.toLowerCase() == "debug") {
						plugin.debugMode = true;
						this.debugLog(plugin, plugin);
					}
					break;
				
				default:
					var nonNumeric = value.match(/[^\d.-x]/);
					if (!nonNumeric) {
						var radix = (value[1] === "x" || value[0] === "#") ? 16 : 10;
						var number = parseInt(value, radix);

						if (!isNaN(number) && isFinite(number)) {
							params[key] = number;
						}
					}

					break;
			}
		}

		if (logIfDebug && plugin.debugMode) {
			this.debugLog(plugin, "Parameters:", params);
		}

		return params;
	};

	/**
	 * Retrieves a parameter from the supplied plugin.
	 * 
	 * @param {*} plugin Plugin to retrieve parameter from
	 * @param {string} name Parameter name
	 * @param {*} [defaultValue] If value sin't set, this value is returned
	 */
	_p.getPluginParameter = function(plugin, name, defaultValue) {
		var value = plugin.META_DATA.parameters[name];

		return (value === undefined || value === "") ? defaultValue : value;
	};

	/**
	 * If the supplied plugin is in debug mode, then output a log to the debug console.
	 * 
	 * @param {*} plugin Plugin requesting the log
	 * @param  {...any} args Data to log
	 */
	_p.debugLog = function(plugin, ...args) {
		if (plugin.debugMode) {
			args.unshift("DEBUG :: " + plugin.META_DATA.alias + " ::");
			console.warn.apply(console, args);
		}
	};

	/**
	 * Allows a plugin to listen for Plugin Commands.
	 * 
	 * @param {(string[]) => void} handler The function to call when the command matches a supplied alias
	 * @param {string[]} aliases Array of aliases to use for the handler to be invoked
	 * @returns {this}
	 */
	_p.addPluginCommands = function(handler, aliases) {
		var Override_pluginCommand = Game_Interpreter.prototype.pluginCommand;

		Game_Interpreter.prototype.pluginCommand = function(command, args) {
			// do we have arguements?
			if (args && args.length > 0) {
				var cmd = command.toLowercase();

				var i = aliases.length;
				while (i-- > 0) {
					var alias = aliases[i].toLowercase();
					if (alias === cmd) {
						handler(args);
						return;
					}
				}
			}

			// No arguements passed, we'll just invoke the original method
			Override_pluginCommand(this, command, args);
		}

		return this;
	};

	/**
	 * Allows plugins to add data to a save file.
	 * 
	 * @param {(any) => void} onSave Function to call with save data object
	 * @returns {this}
	 */
	_p.addSaveData = function(onSave) {
		var Override_DataManager_makeSaveContents = DataManager.makeSaveContents;
		DataManager.makeSaveContents = function() {
			var data = Override_DataManager_makeSaveContents.call(this);
			onSave(data);
			return data;
		};

		return this;
	};


	/**
	 * Allows plugins to read data in a save file that's being loaded.
	 * 
	 * @param {(any) => void} onLoad Function to call with save data object
	 * @returns {this}
	 */
	_p.readSaveData = function(onLoad) {
		var Override_DataManager_extractSaveContents = DataManager.extractSaveContents;
		DataManager.makeSaveContents = function() {
			var data = Override_DataManager_extractSaveContents.call(this);
			onLoad(data);
			return data;
		};

		return this;
	};
	
	_p.registerPlugin(_p, "SRCrazy_Core", "2.0", "2018-11-27", true);
	_p.parseParameters(_p);

	_p.useCommandCache = _p.getPluginParameter(_p, "Cache Event Commands", true);

	if (_p.getPluginParameter(_p, "Debug Plugins") === true) {
		console.log("SRCrazy_Core :: DEBUG :: Plugins regsitered via SRCrazy:", _registeredPlugins);
		console.log("SRCrazy_Core :: DEBUG :: General convention plugins:", Imported);
	}

	return _p;
})();

/**
 * Utility class with methods for retrieving image data.
 */
SRCrazy.Plugins.Core.ImageUtil = (function() {
	return {
		/**
		 * Retrieves Bitmap from source folder.
		 * 
		 * @param {string} filename Name of image file to retrieve
		 * @param {string} [path=system] Folder path from inside project's img folder, defaults to 'system'
		 * @param {number} [hue] Hue value for the image
		 * @returns {Bitmap}
		 */
		getImage: function(filename, path, hue) {
			path = path || "system";

			// No filename passed, return null
			if (!filename) {
				return null;
			}

			// Use the correct icon set
			return ImageManager.loadBitmap("img/" + path + "/", filename, hue, true);
		},
	   
		/**
		 * Loads source image from folder in to Bitmap object.
		 * 
		 * @param {Bitmap} bitmap Bitmap to draw image in to
		 * @param {Rect} sampleRect Rect that defines what area of the source image to draw
		 * @param {string} filename Name of image file to retrieve
		 * @param {string} [filePath=system] Folder path from inside project's img folder, defaults to 'system'
		 * @param {number} [hue] Hue value for the image
		 * @returns {Bitmap}
		 */
		drawImageToBitmap: function(bitmap, sampleRect, filename, filePath, hue) {
			// Ensure we have a target Bitmap
			bitmap = bitmap || new Bitmap(sampleRect.width, sampleRect.height);
			
			// Retrieve source image
			var sourceImage = this.getImage(filename, filePath, hue);
			
			return this.sampleBitmap(bitmap, sourceImage, sampleRect);
		},
	   
		/**
		 * Draws section of source image to Bitmap object based on a uniform spacing index
		 * @param {Bitmap} bitmap Bitmap to draw image in to
		 * @param {number} index Index of image in source
		 * @param {string} filename Name of image file to retrieve
		 * @param {string} [filePath=system] Folder path from inside project's img folder, defaults to 'system'
		 * @param {number} [hue] Hue value for the image
		 */
		blitToBitmap: function(bitmap, index, filename, filePath, hue) {
			var w = bitmap.canvas.width;
			var h = bitmap.canvas.height;
			
			// Get position of target in source image
			var drawRect = {};
			drawRect.x = (index % 16) * w;
			drawRect.y = Math.floor(index / 16) * h;
			drawRect.width = w;
			drawRect.height = h;
			
			drawImageToBitmap(bitmap, drawRect, filename, filePath, hue);
		},

		/**
		 * Samples the specified section of the source Bitmap and draws it in to the target Bitmap.
		 * 
		 * @param {Bitmap} target Bitmap object to draw sample to
		 * @param {Bitmap} source Bitmap object to sample from
		 * @param {Rect} sampleRect Rect that defines what area of the source image to draw
		 * @returns {Bitmap}
		 */
		sampleBitmap: function(target, source, sampleRect) {
			source.addLoadListener(function() {
				console.log("Blit this shiz");
				target.blt(source, sampleRect.x, sampleRect.y, sampleRect.width, sampleRect.height, 0, 0);
			});

			return target;
		}
	};
})();