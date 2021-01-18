import BasePlugin from "src/BasePlugin";
import IPlugin from "src/IPlugin";

/**
 * Plugin used to configure global Timer values.
 *
 * @export
 * @class TimerPlugin
 * @extends {BasePlugin}
 * @implements {IPlugin}
 */
export default class TimerPlugin extends BasePlugin implements IPlugin {
	public constructor() {
		super("SRCrazy_Timer", "1.0.0", "2020-01-18");

		Timer.setFrameRate(Number(this._params["Frame Rate"] || 60));

		this.registerClass("Timer", Timer);
	}
}

/**
 * A simple timer class.
 *
 * @export
 * @class Timer
 */
class Timer {
	private static _timers: Timer[];

	private static _interval: number;
	private static _lastTime: number;
	private static _paused: boolean;
	private static _frameRate: number;

	/**
	 * Sets the rate at which Timer instances update.
	 *
	 * @static
	 * @param {number} fps Frames per second.
	 * @memberof Timer
	 */
	public static setFrameRate(fps: number): void {
		if (this._interval) {
			clearInterval(this._interval);
		}

		this._frameRate = 1000 / fps;
		this._interval = setInterval(this.update, this._frameRate);
	}

	/**
	 * Creates a Timer instance for delaying a function call.
	 *
	 * @static
	 * @param {() => void} callback Function to call when duration elapses.
	 * @param {number} delay The delay (in seconds) between the callback being invoked.
	 * @param {boolean} [trackFrames=false] Indicates whether timer uses real time updates or frame-counting.
	 * @returns {Timer}
	 * @memberof Timer
	 */
	public static create(callback: () => void, delay: number, trackFrames?: boolean): Timer {
		const timer = new Timer(callback, delay, 0, trackFrames);
		timer.start();

		return timer;
	}

	/**
	 * Stops timers from being processed/updated.
	 *
	 * @static
	 * @memberof Timer
	 */
	public static pause(): void {
		this._paused = true;
	}

	/**
	 * Resumes timer processing/updating.
	 *
	 * @static
	 * @memberof Timer
	 */
	public static resume(): void {
		this._paused = false;
	}

	/**
	 * Updates all active Timer instances.
	 *
	 * @private
	 * @static
	 * @memberof Timer
	 */
	private static update(): void {
		const timeNow = Date.now();

		if (!this._paused) {
			let i = this._timers.length;

			while (i-- > 0) {
				const timer = this._timers[i];
				timer.update(timeNow - this._lastTime);

				if (timer._isDestroyed) {
					this._timers.splice(i, 1);
				}
			}
		}

		this._lastTime = timeNow;
	}

	private _callback: () => void;
	private _duration: number;
	private _count: number;
	private _trackFrames: boolean;

	private _tracker: number;
	private _currentCount: number;
	private _isRunning: boolean;
	private _isDestroyed: boolean;

	/**
	 * Creates a new Timer.
	 *
	 * @param {() => void} callback Function to call when duration elapses.
	 * @param {number} duration The delay (in seconds) between the callback being invoked.
	 * @param {number} [repeatCount=0] The number of times to repeat this timer.
	 * @param {boolean} [trackFrames=false] Indicates whether timer uses real time updates or frame-counting.
	 * @memberof Timer
	 */
	public constructor(callback: () => void, duration: number, repeatCount?: number, trackFrames?: boolean) {
		this._callback = callback;
		this._duration = duration;
		this._count = repeatCount;
		this._trackFrames = !!trackFrames;

		this._tracker = 0;
		this._currentCount = 0;

		if (Timer._lastTime == null) {
			Timer._lastTime = Date.now();
		}

		if (Timer._timers) {
			Timer._timers.push(this);
		} else {
			Timer._timers = [this];
		}
	}

	/**
	 * Starts the timer.
	 *
	 * @memberof Timer
	 */
	public start(): void {
		this._isRunning = true;
	}

	/**
	 * Stops the timer.
	 *
	 * @memberof Timer
	 */
	public stop(): void {
		this._isRunning = false;
	}

	/**
	 * Stops the timer and resets it's internal tracking state.
	 *
	 * @memberof Timer
	 */
	public reset(): void {
		this._isRunning = false;
		this._currentCount = 0;
		this._tracker = 0;
	}

	/**
	 * Marks this timer as destroyed and updates internals.
	 *
	 * @memberof Timer
	 */
	public destroy(): void {
		this._isDestroyed = true;
		this._isRunning = false;
		this._callback = undefined;
	}

	/**
	 * Updates the internal state of the timer.
	 *
	 * @param {number} timeSinceLastUpdate Milliseconds since the last update.
	 * @memberof Timer
	 */
	public update(timeSinceLastUpdate: number): void {
		if (this._isRunning) {
			// Calculacte timinigs based on real time elapsing
			if (this._trackFrames) {
				this._tracker++;

			// Otherwise use frame-based calculations
			} else {
				this._tracker += timeSinceLastUpdate;
			}

			// Check for completion
			if (this._tracker >= this._duration) {
				this._callback();

				// Start the next cycle if we have a count
				if (this._currentCount++ < this._count) {
					this._tracker -= this._duration;

				// If count is 0, remove this timer
				} else if (this._count === 0) {
					this.destroy();
				}
			}
		}
	}
}