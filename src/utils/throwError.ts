/**
 * Throws a game-breaking error and displays the message on screen.
 *
 * @param {string} pluginName Name of the plugin throwing the error
 * @param {string} message Message to display
 * @param {*} [data] Additional data to log to the console
 */
export default function throwError(pluginName: string, message: string, data?: any): void {
	const error: any = new Error(pluginName + " :: " + message);
	error.filename = pluginName;

	SceneManager.onError(error);

	if (data) {
		console.error(data);
	}
};