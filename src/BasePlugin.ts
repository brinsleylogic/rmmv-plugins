import getTypedValue from "./utils/data/getTypedValue";
import throwError from "./utils/throwError";

/// <reference path="rmmv.d.ts" />

declare var SRCrazy: IGlobal;
SRCrazy = SRCrazy ?? {
	plugins: {}
};

/**
 * Contains utility methods that should be accessible to all Plugins.
 *
 * @export
 * @abstract
 * @class BasePlugin
 */
export default abstract class BasePlugin {
	protected _params: any;

	/**
	 * Creates an instance of BasePlugin.
	 *
	 * @param {string} name Alias used to register plugin.
	 * @param {string} version Version number of the plugin.
	 * @param {string} versionDate The publish date of the plugin.
	 * @param {string | string[]} [dependencies] List of plugin aliases that this plugin requires.
	 * @memberof BasePlugin
	 */
	public constructor(name: string, version: string, date: string, dependencies?: string | string[]) {
		// Search for plugin by name, this way renaming files isn't problematic.
		const meta = $plugins.filter(function(plugin) {
			return (plugin.description.indexOf(`<${name}>`) >= 0);
		})[0];

		if (!meta) {
			throwError(name, "Couldn't find pluginto register.", $plugins);
			return;
		}

		// Check dependencies
		if (typeof dependencies === "string") {
			dependencies = [dependencies];
		}

		if (dependencies) {
			const failures = [];

			for (var i = 0, l = dependencies.length; i < l; i++) {
				if (!SRCrazy.plugins[dependencies[i]]) {
					failures.push(dependencies[i]);
				}
			}

			if (failures.length) {
				throwError(name, `Dependencies not registered: ${failures.join(", ")}`);
				return;
			}
		}

		this._params = this.getParameters(meta.parameters);

		SRCrazy.plugins[name] = {
			version: version,
			date: date
		}
	}

	/**
	 * Registers a class with the global namespace.
	 *
	 * @protected
	 * @param {string} alias Alias for the class.
	 * @param {IFunction} ctor The class constructor.
	 * @memberof BasePlugin
	 */
	protected registerClass(alias: string, ctor: any): void {
		SRCrazy[alias] = ctor;
	}

	/**
	 * Retrieves a class from the global namespace.
	 *
	 * @protected
	 * @template T
	 * @param {string} name Name of the class.
	 * @returns {IFunction<T>}
	 * @memberof BasePlugin
	 */
	protected getClass<T = any>(name: string): T {
		return SRCrazy[name];
	}

	/**
	 * Parses plugin parameters to be correctly typed.
	 *
	 * @param {*} meta Plugin whose parameters are to be processed.
	 */
	private getParameters(meta: any): any {
		const keys = Object.keys(meta);
		const params = {};

		let i = keys.length;

		while (i-- > 0) {
			const key = keys[i];

			if (!key || key.match(/--[\w\s]+--/)) {
				continue;
			}

			params[key] = getTypedValue(params[key]);
		}

		return params;
	};
}

/**
 * Defines the global namespace.
 *
 * @interface IGlobal
 */
interface IGlobal {
	/**
	 * A list of registered plugins.
	 *
	 * @type {{ [name: string]: IPluginData }}
	 * @memberof IGlobal
	 */
	plugins: { [name: string]: IPluginData };
}

/**
 * Meta data for plugins registered.
 *
 * @interface IPluginData
 */
interface IPluginData {
	/**
	 * The version number of the plugin.
	 *
	 * @type {string}
	 * @memberof IPluginData
	 */
	version: string;

	/**
	 * The version date of the plugin.
	 *
	 * @type {string}
	 * @memberof IPluginData
	 */
	date: string;
}

/**
 * Generic function signature.
 *
 * @interface IFunction
 * @template T
 */
interface IFunction<T = any> {
	(...args: any[]): T;
}