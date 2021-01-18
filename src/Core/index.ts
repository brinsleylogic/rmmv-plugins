import BasePlugin from "../BasePlugin";
import IPlugin from "../IPlugin";

/**
 * Plugin that provides some common functionality for other plugins.
 *
 * @export
 * @class Core
 * @extends {BasePlugin}
 * @implements {IPlugin}
 */
export default class Core extends BasePlugin implements IPlugin {
	private _pluginCommands: { [name: string]: IPluginCommand };
	private _saveStateHandlers: ISaveStateHandler[];

	public constructor() {
		super("Core", "2.1.0", "2020-01-18");

		const GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
		Game_Interpreter.prototype.pluginCommand = (command, args) => {
			// Do we have arguements?
			if (args && args.length > 0) {
				const cmd = command.toLowerCase();

				if (this._pluginCommands[cmd]) {
					this._pluginCommands[cmd](cmd, args);
					return;
				}
			}

			// No handlers invoked, we'll just invoke the original method.
			GameInterpreter_pluginCommand.call(Game_Interpreter.prototype, command, args);
		}

		const DataManager_makeSaveContents = DataManager.makeSaveContents;
		DataManager.makeSaveContents = () => {
			const data = DataManager_makeSaveContents.call(this);

			if (!this._saveStateHandlers) {
				return data;
			}

			let i = this._saveStateHandlers.length;

			while (i-- > 0) {
				this._saveStateHandlers[i].writeSavefile(data);
			}

			return data;
		};

		const DataManager_extractSaveContents = DataManager.extractSaveContents;
		DataManager.extractSaveContents = () => {
			const data = DataManager_extractSaveContents.call(this);

			if (!this._saveStateHandlers) {
				return;
			}

			let i = this._saveStateHandlers.length;

			while (i-- > 0) {
				this._saveStateHandlers[i].readSavefile(data);
			}
		};
	}

	/**
	 * Registers a function that allows a plugin to listen for Plugin Commands.
	 *
	 * @param {IPluginCommand} handler The function to call when the command matches a supplied alias
	 * @param {...string[]} names Array of aliases to use for the handler to be invoked.
	 * @returns {this}
	 * @memberof Core
	 */
	public addPluginCommand(handler: IPluginCommand, ...names: string[]): this {
		if (this._pluginCommands == null) {
			this._pluginCommands = {};
		}

		let i = names.length;

		while (i-- > 0) {
			this._pluginCommands[names[i].toLowerCase()] = handler;
		}

		return this;
	}

	/**
	 * Registers a component that reads/writes save data.
	 *
	 * @param {ISaveStateHandler} handler Component for managing save data.
	 * @returns {this}
	 * @memberof Core
	 */
	public addSaveStateHandler(handler: ISaveStateHandler): this {
		if (this._saveStateHandlers) {
			this._saveStateHandlers.push(handler);
		} else {
			this._saveStateHandlers = [handler];
		}

		return this;
	}
}

/**
 * Defines a callback that handles plugin commands.
 *
 * @interface IPluginCommand
 */
interface IPluginCommand {
	(command: string, args: string[]): void;
}

/**
 * Defines a component that reads/writes save data.
 *
 * @interface ISaveStateHandler
 */
interface ISaveStateHandler {
	/**
	 * Reads data from supplied save file.
	 *
	 * @param {Savefile} data The loaded save-data.
	 * @memberof ISaveStateHandler
	 */
	readSavefile(data: Savefile): void;

	/**
	 * Writes data to supplied save file.
	 *
	 * @param {Savefile} data The data to save.
	 * @memberof ISaveStateHandler
	 */
	writeSavefile(data: Savefile): void;
}