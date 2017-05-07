interface CommandData
{
	name:string;
	symbol:string;
	enabled:boolean;
	ext:any;
}

interface Rect
{
	x:number;
	y:number;
	width:number;
	height:number;
}

interface TextState
{
	index:number;
	text:string;
	left:number;
	height:number;
	x:number;
	y:number;
}
declare var $plugins:DataPlugin[];

declare var $dataActors:DataActor[];
declare var $dataAnimations:DataAnimation[];
declare var $dataArmors:DataArmor[];
declare var $dataClasses:DataClass[];
declare var $dataCommonEvents:DataCommonEvent[];
declare var $dataEnemies:DataEnemy[];
declare var $dataItems:DataItem[];
declare var $dataMap:DataMap;
declare var $dataMapInfos:DataMapInfo[];
declare var $dataSkills:DataSkill[];
declare var $dataStates:DataState[];
declare var $dataSystem:DataSystem;
declare var $dataTilesets:DataTileset[];
declare var $dataTroops:DataTroop[];
declare var $dataWeapons:DataWeapon[];

declare var $gameActors:Game_Actors;
declare var $gameMap:Game_Map;
declare var $gameMessage:Game_Message;
declare var $gameParty:Game_Party;
declare var $gamePlayer:Game_Player;
declare var $gameScreen:Game_Screen;
declare var $gameSelfSwitches:Game_SelfSwitches;
declare var $gameSwitches:Game_Switches;
declare var $gameSystem:Game_System;
declare var $gameTemp:Game_Temp;
declare var $gameTimer:Game_Timer;
declare var $gameTroop:Game_Troop;
declare var $gameVariables:Game_Variables;

//-----------------------------------------------------------------------------
// Array Extensions
declare interface Array<T>
{
    clone():ArrayConstructor;
    contains(element:any):boolean;
    equals(array:ArrayConstructor):boolean;
}
//-----------------------------------------------------------------------------
// Bitmap
//
//The basic object that represents an image.
declare class Bitmap
{
	public static load(url:string):Bitmap;
	public static snap(stage:Stage):Bitmap;

	public baseTexture:PIXI.BaseTexture;
	public canvas:HTMLCanvasElement;
	public context:CanvasRenderingContext2D;
	public fontFace:string;
	public fontSize:number;
	public fontItalic:boolean;
	public height:number;
	public outlineColor:string;
	public outlineWidth:number;
	public paintOpacity:number;
	public rect:Rectangle;
	public smooth:boolean;
	public textColor:string;
	public url:string;
	public width:number;
	
	protected _canvas:HTMLCanvasElement;
	protected _context:CanvasRenderingContext2D;
	protected _baseTexture:PIXI.BaseTexture;
	protected _image:HTMLImageElement;
	protected _url:string;
	protected _paintOpacity:number;
	protected _smooth:boolean;
	protected _loadListeners:Function[];
	protected _isLoading:boolean;
	protected _hasError:boolean;
	
	public constructor(width?:number, height?:number);

	public isReady():boolean;
	public isError():boolean;
	public resize(width:number, height:number):void;
	public blt(source:Bitmap, sx:number, sy:number, sw:number, sh:number, dx:number, dy:number, dw:number, dh:number):void;
	public getPixel(x:number, y:number):string;
	public getAlphaPixel(x:number, y:number):number;
	public clearRect(x:number, y:number, width:number, height:number):void;
	public clear():void;
	public fillRect(x:number, y:number, width:number, height:number, color:string):void;
	public fillAll(color:string):void;
	public gradientFillRect(x:number, y:number, width:number, height:number, color1:string, color2:string, vertical:boolean):void;
	public drawCircle(x:number, y:number,radius:number, color:string):void;
	public drawText(text:string, x:number, y:number, maxWidth:number, lineHeight:number, align:string):void;
	public measureTextWidth(text:string):number;
	public adjustTone(r:number, g:number, b:number):void;
	public rotateHue(offset:number):void;
	public blur():void;
	public addLoadListener(callback:Function):void;

	protected _makeFontNameText():string;
	protected _drawTextOutline(text:string, tx:number, ty:number, maxWidth:number):void;
	protected _drawtextBody(text:string, tx:number, ty:number, maxWidth:number):void;
	protected _onLoad():void;
	protected _callLoadListeners():void;
	protected _onError():void;
	protected _setDirty():void;
}
//-----------------------------------------------------------------------------
// CacheEntry
//
// The resource class. Allows to be collected as a garbage if not use for some time or ticks
declare class CacheEntry
{
    public cache:CacheMap;
    public key:string;
    public item:any;
    public cached:boolean;
    public touchTicks:number;
    public touchSeconds:number;
    public ttlTicks:number;
    public ttlSeconds:number;
    public freedByTTL:boolean;

	public constructor(cache:CacheMap, key:string, item:any);

	public free(byTTL:boolean):void;
	public allocate():CacheEntry;

	public setTimeToLive(ticks:number, seconds:number):CacheEntry;
	public isStillAlive():boolean;
	public touch():void;
}
//-----------------------------------------------------------------------------
// CacheMap
//
// Cache for images, audio, or any other kind of resource
declare class CacheMap
{
	public manager:any;
    public updateTicks:number;
    public lastCheckTTL:number;
    public delayCheckTTL:number;
    public updateSeconds:number;
	private _inner:{ [s:string]: CacheEntry };
	private _lastRemovedEntries:CacheEntry[];
	
	public constructor(manager:any);

	public checkTTL():void;
	public clear():void;

	public getItem(key:string):any;
	public setItem(key:string, item:any):CacheEntry;

	public update(ticks:number, delta:number):void;
}
//-----------------------------------------------------------------------------
// Decrypter
declare class Decrypter
{
	public static readonly SIGNATURE:string;
	public static readonly VER:string;
	public static readonly REMAIN:string;

	public static hasEncryptedImages:boolean;
	public static hasEncryptedAudio:boolean;

	private static _headerlength:number;
	private static _xhrOk:number;
	private static _encryptionKey:string;
	private static _ignoreList:string[];
	
	public static checkImgIgnore(url:string):boolean;

	public static decryptImg(url:string, bitmap:Bitmap):void;
	public static decryptHTML5Audio(url:string, bgm:BGM, pos:number):void;
	public static decryptArrayBuffer(arrayBuffer:ArrayBuffer):ArrayBuffer

	public static cutArrayHeader(arrayBuffer:ArrayBuffer, length:number):ArrayBuffer;

	public static createBlobUrl(arrayBuffer:ArrayBuffer):string;

	public static extToEncryptExt(url:string):string;

	public static readEncryptionkey():void;
}
// FPSMeter 0.3.1 - 9th May 2013
// https://github.com/Darsain/fpsmeter
declare class FPSMeter
{
	public isPaused:boolean;

	public show():void;
	public hide():void;

	public showFps():void;
	public showDuration():void;

	public tickStart():void;
	public tick():void;
}
//-----------------------------------------------------------------------------
// Graphics
//
// The static class that carries out graphics processing.
declare class Graphics
{
	public static frameCount:number;
	public static BLEND_NORMAL:number;
	public static BLEND_ADD:number;
	public static BLEND_MULTIPLY:number;
	public static BLEND_SCREEN:number;
	public static width:number;
	public static height:number;
	public static boxWidth:number;
	public static boxHeight:number;
	public static scale:number;
	
	protected static _width:number;
	protected static _height:number;
	protected static _rendererType:string;
	protected static _boxWidth:number;
	protected static _boxHeight:number;
	protected static _scale:number;
	protected static _realScale:number;
	protected static _errorPrinter:HTMLParagraphElement;
	protected static _canvas:HTMLCanvasElement;
	protected static _video:HTMLVideoElement;
	protected static _upperCanvas:HTMLCanvasElement;
	protected static _renderer:PIXI.WebGLRenderer;
	protected static _fpsMeter:FPSMeter;
	protected static _modeBox:HTMLDivElement;
	protected static _skipCount:number;
	protected static _maxSkip:number;
	protected static _rendered:boolean;
	protected static _loadingImage:HTMLImageElement;
	protected static _loadingCount:number;
	protected static _fpsMeterToggled:boolean;
	protected static _canUseDifferenceBlend:boolean;
	protected static _canUseSaturationBlend:boolean;
	protected static _stretchEnabled:boolean;
	protected static _hiddenCanvas:HTMLCanvasElement;
	
	public static tickStart():void;
	public static tickEnd():void;
	public static render(stage:Stage):void;
	public static isWebGL():boolean;
	public static hasWebGL():boolean;
	public static canUseDifferenceBlend():boolean;
	public static canUseSaturationBlend():boolean;
	public static setLoadingImage():void;
	public static startLoading():void;
	public static updateLoading():void;
	public static endLoading():void;
	public static printError():void;
	public static showFps():void;
	public static hideFps():void;
	public static loadFont(name:string, url:string):void;
	public static isFontLoaded(name:string):boolean;
	public static playVideo(src:string):void;
	public static isVideoPlaying():boolean;
	public static canPlayVideoType(type:string):boolean;
	public static pageToCanvasX(x:number):number;
	public static pageToCanvasY(y:number):number;
	public static isInsideCanvas(x:number, y:number):boolean;
	
	protected static _createAllElements():void;
	protected static _updateAllElements():void;
	protected static _updareRealScale():void;
	protected static _makeErrorHtml(name:string, message:string):string;
	protected static _defaultStretchMode():boolean;
	protected static _testCanvasBlendMode():void;
	protected static _modifyExistingElements():void;
	protected static _createErrorPrinter():void;
	protected static _updateErrorPrinter():void;
	protected static _createCanvas():void;
	protected static _updateVideo():void;
	protected static _createUpperCanvas():void;
	protected static _updateUpperCanvas():void;
	protected static _clearUpperCanvas():void;
	protected static _paintUpperCanvas():void;
	protected static _createRenderer():void;
	protected static _updateRenderer():void;
	protected static _createFPSMeter():void;
	protected static _createModeBox():void;
	protected static _createGameFontLoader():void;
	protected static _createFontLoader():void;
	protected static _centerElement(element:HTMLElement):void;
	protected static _disableTextSection():void;
	protected static _disableContextMenu():void;
	protected static _applyCanvasFilter():void;
	protected static _onVideoLoad():void;
	protected static _onVideoError():void;
	protected static _onVideoEnd():void;
	protected static _updateVisibility(videoVisible:boolean):void;
	protected static _isVideoVisible():boolean;
	protected static _setupEventhandlers():void;
	protected static _onWindowResize():void;
	protected static _onKeyDown():void;
	protected static _switchFPSMeter():void;
	protected static _switchStretchMode():void;
	protected static _switchFullScreen():void;
	protected static _isFullScreen():boolean;
	protected static _requestFullScreen():void;
	protected static _cancelFullScreen():void;
}
//-----------------------------------------------------------------------------
// Html5Audio
//
//The static class that handles HTML5 Audio.
declare class Html5Audio
{
	public static url:string;
	public static volume:number;
	
	private static _initialized:boolean;
	private static _unlocked:boolean;
	private static _audioElement:HTMLAudioElement;
	private static _gainTweenInterval:number;
	private static _tweenGain:number;
	private static _tweenTargetGain:number;
	private static _tweenGainStep:number;
	private static _staticSePath:string;
	private static _url:string;
	
	public static setup(url:string):void;
	public static initialize():boolean;
	public static clear():void;
	public static setStaticSe(url:string):void;
	public static isReady():void;
	public static isError():void;
	public static isPlaying():void;
	public static play(loop:boolean, offset:number):void;
	public static stop():void;
	public static fadeIn(duration:number):void;
	public static fadeOut(duration:number):void;
	public static seek():number;
	public static addLoadListener(listener:Function):void;
	
	private static _setEventHandlers():void;
	private static _onTouchStart():void;
	private static _onVisibilityChange():void;
	private static _onLoadedData():void;
	private static _onError():void;
	private static _onEnded():void;
	private static _onHide():void;
	private static _onShow():void;
	private static _load(url:string):void;
	private static _startPlaying(loop:boolean, offset:number):void;
	private static _onLoad():void;
	private static _startGainTween(duration:number):void;
	private static _applyTweenPause(volume:number):void;
}
//-----------------------------------------------------------------------------
// Input
//
// The static class that handles input data from the keyboard and gamepads.
declare class Input
{
	public static keyRepeatWait:number;
	public static keyRepeatInterval:number;
	public static keyMapper:{ [key:number]: string };
	public static gamepadMapper:{[key:number]: string };
	
	protected static _currentState:{[key:number]: boolean };
	protected static _previousState:{[key:number]: boolean };
	protected static _gamepadStates:{[key:number]: boolean }[];
	protected static _latestButton:string;
	protected static _pressedTime:number;
	protected static _dir4:number;
	protected static _dir8:number;
	protected static _preferredAxis:string;
	protected static _date:Date;
	
	public static clear():void;
	public static update():void;
	public static isPressed(keyName:string):boolean;
	public static isTriggered(keyName:string):boolean;
	public static isRepeated(keyName:string):boolean;
	public static isLongPressed(keyName:string):boolean;
	
	protected static _wrapNwjsAlert():void;
	protected static _setupEventHandlers():void;
	protected static _onKeyDown(event:Event):void;
	protected static _shouldPreventDefault(keyCode:number):boolean;
	protected static _onKeyUp(event:Event):void;
	protected static _onFocusLost():void;
	protected static _pollGamepads():void;
	protected static _updateGamepadState(gamepad:Gamepad):void;
	protected static _updateDirection():void;
	protected static _signX():number;
	protected static _signY():number;
	protected static _makeNumpadDirection(x:number, y:number):number;
	protected static _isEscapeCompatible(keyName:string):boolean;
}
//-----------------------------------------------------------------------------
// JsonEx
//
// The static class that handles JSON with object information.
declare class JsonEx
{
	public static maxDepth:number;
	
	public static stringify(object:Object):string;
	public static parse(json:string):Object;
	public static makeDeepCopy(object:Object):string;
	
	private static _encode(value:Object, depth?:number):Object;
	private static _decode(value:Object):Object;
	private static _getConstructorName(value:Object):string;
	private static _resetPrototype(value:Object, prototype:Object):Object;
}
// LZ-based compression algorithm, version 1.4.4
// https://github.com/pieroxy/lz-string
declare module LZString
{
	export function compressToBase64(input:string):string;
	export function decompressFromBase64(input:string):string;

	export function compressToUTF16(input:string):string;
	export function decompressFromUTF16(compressed:string):string;

	export function compressToUint8Array(uncompressed:string):Uint8Array;
	export function decompressFromUint8Array(compressed:Uint8Array):string;

	export function compressToEncodedURIComponent(input:string):string;
	export function decompressFromEncodedURIComponent(compressed:string):string;

	export function compress(input:string):string;
	export function decompress(compressed:string):string;
}
//-----------------------------------------------------------------------------
// Math Extensions
declare interface Math
{
    randomInt(max:number):number;
}

//-----------------------------------------------------------------------------
// Number Extensions
declare interface Number
{
    clamp(min:number, max:number):number;
    mod(n:number):number;
    padZero(length:number):string;
}
//-----------------------------------------------------------------------------
// Point
//
// The point class.
declare class Point extends PIXI.Point
{
	public constructor(x: number, y: number);	
}
//-----------------------------------------------------------------------------
// Rectangle
//
// The rectangle class.
declare class Rectangle extends PIXI.Rectangle
{
	public static emptyRectangle():Rectangle;

	public constructor(x:number, y:number, width:number, height:number);
}
//-----------------------------------------------------------------------------
// ScreenSprite
//
// The sprite which covers the entire game screen.
declare class ScreenSprite extends PIXI.Sprite
{
	public opacity:number;
	
	protected _bitmap:Bitmap;
	protected _red:number;
	protected _green:number;
	protected _blue:number;

	public setBlack():void;
	public setWhite():void;
	public setColor(r:number, g:number, b:number):void;
	
	protected _renderCanvas(renderSession:PIXI.SystemRenderer):void;
}
//-----------------------------------------------------------------------------
// ShaderTilemap
//
// The tilemap which displays 2D tile-based game map using shaders
declare class ShaderTilemap extends Tilemap
{
	public roundPixels:boolean;

	public renderCanvas(renderer:PIXI.SystemRenderer):void;
	public renderWebGL(renderer:PIXI.SystemRenderer):void;

	public refresh():void;
	public refreshTileset():void;
	public updateTransform():void;

	protected _hackRenderer(renderer:PIXI.SystemRenderer):PIXI.SystemRenderer

	protected _createLayers():void;
	protected _updateLayerPositions(startX:number, startY:number):void;

	protected _paintTiles(startX:number, startY:number, x:number, y:number):void;
	
	protected _drawTile(layer:Bitmap, tileId:number, dx:number, dy:number):void;
	protected _drawNormalTile(layer:Bitmap, tileId:number, dx:number, dy:number):void;
	protected _drawAutotile(layer:Bitmap, tileId:number, dx:number, dy:number):void;
	protected _drawTableEdge(layer:Bitmap, tileId:number, dx:number, dy:number):void;
	protected _drawShadow(layer:Bitmap, shadowBits:number, dx:number, dy:number):void;
}
//-----------------------------------------------------------------------------
// Sprite
//
// The basic object that is rendered to the game screen.
declare class Sprite extends PIXI.Sprite
{
	protected static _counter:number;
	
	public bitmap:Bitmap;
	public opaque:boolean;
	public spriteId:number;
	public width:number;
	public height:number;
	public opacity:number;
	
	protected _bitmap:Bitmap;
	protected _frame:Rectangle;
	protected _realFrame:Rectangle;
	protected _offset:Point;
	protected _blendColor:number[];
	protected _colorTone:number[];
	protected _canvas:PIXI.SystemRenderer;
	protected _context:CanvasRenderingContext2D;
	protected _tintTexture:PIXI.BaseTexture;

	public update():void;
	public move(x:number, y:number):void;
	public setFrame(x:number, y:number, width:number, height:number):void;
	public getBlendColor():number[];
	public setBlendColor(color:number[]):void;
	public getColorTone():number[];
	public setColorTone(color:number[]):void;
	public updateTransform():void;
	
	protected _onBitmapLoad():void;
	protected _refresh():void;
	protected _isInBitmapRect(x:number, y:number, w:number, h:number):boolean;
	protected _needsTint():boolean;
	protected _createTinter(w:number, h:number):void;
	protected _executeTint(x:number, y:number, w:number, h:number):void;
	protected _renderWebGL():void;
}
//-----------------------------------------------------------------------------
// Stage
//
// The root object of the display tree.
declare class Stage extends PIXI.Container
{
}
//-----------------------------------------------------------------------------
// String Extensions
declare interface String
{
	contains(string:string):boolean;
	format():string;
	padZero(length:number):string;
}
//-----------------------------------------------------------------------------
// Tilemap
//
// The tilemap which displays 2D tile-based game map.
declare class Tilemap extends PIXI.Container
{
	public static TILE_ID_B:number;
	public static TILE_ID_C:number;
	public static TILE_ID_D:number;
	public static TILE_ID_E:number;
	public static TILE_ID_A5:number;
	public static TILE_ID_A1:number;
	public static TILE_ID_A2:number;
	public static TILE_ID_A3:number;
	public static TILE_ID_A4:number;
	public static TILE_ID_MAX:number;
	public static FLOOR_AUTOTILE_TABLE:number[][][];
	public static WALL_ATUOTILE_TABLE:number[][][];
	public static WATERFALL_AUTOTILE_TABLE:number[][][];
	
	public static isVisibleTile(tileId:number):boolean;
	public static isAutotile(tileId:number):number;
	public static getAutotileKind(tileId:number):number;
	public static getAutotileShape(tileId:number):number;
	public static makeAutotileId(kind:number, shape:number):number;
	public static isSameKindTile(tileId1:number, tileId2:number):boolean;
	public static isTileA1(tileId:number):boolean;
	public static isTileA2(tileId:number):boolean;
	public static isTileA3(tileId:number):boolean;
	public static isTileA4(tileId:number):boolean;
	public static isTileA5(tileId:number):boolean;
	public static isWaterTile(tileId:number):boolean;
	public static isWaterfallTile(tileId:number):boolean;
	public static isGroundTile(tileId:number):boolean;
	public static isShadowingTile(tileId:number):boolean;
	public static isRoofTile(tileId:number):boolean;
	public static isWallTopTile(tileId:number):boolean;
	public static isWallSideTile(tileId:number):boolean;
	public static isWallTile(tileId:number):boolean;
	public static isFloorTypeAutotile(tileId:number):boolean;
	public static isWallTypeAutotile(tileId:number):boolean;
	public static isWaterfallTypeAutotile(tileId:number):boolean;
	
	public bitmaps:Bitmap[];
	public origin:Point;
	public flags:number[];
	public animationCount:number;
	public horizontalWrap:boolean;
	public verticalWrap:boolean;
	public width:number;
	public height:number;
	public tileWidth:number;
	public tileHeight:number;
	
	protected _margin:number;
	protected _width:number;
	protected _height:number;
	protected _tileWidth:number;
	protected _tileHeight:number;
	protected _mapWidth:number;
	protected _mapHeight:number;
	protected _mapData:number[];
	protected _layerWidth:number;
	protected _layerHeight:number;
	protected _lastTiles:number[][][][];
	
	public constructor(bitmap:Bitmap);

	public setData(width:number, height:number, data:number[]):void;
	public isReady():boolean;
	public update():void;
	public refresh():void;
	public updateTransform():void;
	
	protected _createLayers():void;
	protected _updateLayerPositions(startX:number, startY:number):void;
	protected _paintAllTiles(startX:number, startY:number):void;
	protected _paintTiles(startX:number, startY:number, x:number, y:number):void;
	protected _readLastTiles(i:number, x:number, t:number):number[];
	protected _writeLastTiles(i:number, x:number, y:number, tiles:number[]):void;
	protected _drawTile(bitmap:Bitmap, tileId:number, dx:number, dy:number):void;
	protected _drawNormalTile(bitmap:Bitmap, tileId:number, dx:number, dy:number):void;
	protected _drawAutotile(bitmap:Bitmap, tileId:number, dx:number, dy:number):void;
	protected _drawTableEdge(bitmap:Bitmap, tileId:number, dx:number, dy:number):void;
	protected _drawShadow(bitmap:Bitmap, shadowBits:number, dx:number, dy:number):void;
	protected _readMapData(x:number, y:number, z:number):number;
	protected _isHigherTile(tileId:number):boolean;
	protected _isTableTile(tileId:number):boolean;
	protected _isOverpassPosition(mx:number, my:number):boolean;
	protected _sortChildren():void;
	protected _compareChildOrder(a:PIXI.DisplayObject, b:PIXI.DisplayObject):number;
}
//-----------------------------------------------------------------------------
// TilingSprite
//
//  The sprite object for a tiling image.
declare class TilingSprite extends PIXI.Container
{
	public origin:Point;
	public bitmap:Bitmap;
	public opacity:number;
		
	protected _bitmap:Bitmap;
	protected _width:number;
	protected _height:number;
	protected _frame:Rectangle;
	
	public constructor(bitmap:Bitmap);

	public move(x:number, y:number, width:number, height:number):void;
	public setFrame(x:number, y:number, width:number, height:number):void;
	public updateTransform():void;
	
	protected _onBitmapLoad():void;
	protected _refresh():void;
}
//-----------------------------------------------------------------------------
// ToneFilter
//
// The color matrix filter for WebGL.
declare class ToneFilter extends PIXI.filters.ColorMatrixFilter
{
	public reset():void;
	public adjustHue(value:number):void;
	public adjustSaturation(value:number):void;
	public adjustTone(r:number, g:number, b:number):void;
	
	protected _multiplyMatrix(matrix:number[]):void;
}
//-----------------------------------------------------------------------------
// ToneSprite
//
// The sprite which changes the screen color in 2D canvas mode.
declare class ToneSprite extends PIXI.DisplayObject
{
	public clear():void;
	public setTone(r:number, g:number, b:number, gray:number):void;
	
	protected _renderCanvas(renderSession:HTMLCanvasElement):void;
	protected _renderWebGL(renderSession:HTMLCanvasElement):void;
}
//-----------------------------------------------------------------------------
// TouchInput
//
//  The static class that handles input data from the mouse and touchscreen.
declare class TouchInput
{
	public static wheelX:number;
	public static wheelY:number;
	public static x:number;
	public static y:number;
	public static date:Date;
	
	protected static _mousePressed:boolean;
	protected static _screenPressed:boolean;
	protected static _pressedTime:number;
	protected static _triggered:boolean;
	protected static _cancelled:boolean;
	protected static _moved:boolean;
	protected static _released:boolean;
	protected static _wheelX:number;
	protected static _wheelY:number;
	protected static _x:number;
	protected static _y:number;
	protected static _date:Date;
	protected static _events:{
		triggered:boolean; cancelled:boolean; moved:boolean;
		released:boolean; wheelX:number; wheelY:number;
	};
	
	public static update():void;
	public static isPressed():boolean;
	public static isTriggered():boolean;
	public static isRepeated():boolean;
	public static isLongPressed():boolean;
	public static isCancelled():boolean;
	public static isMoved():boolean;
	public static isReleased():boolean;
	
	protected static _setupEventHandlers():void;
	protected static _onMouseDown(event:Event):void;
	protected static _onLeftButtonDown(event:Event):void;
	protected static _onMiddleButtonDown(event:Event):void;
	protected static _onMouseMove(event:Event):void;
	protected static _onMouseUp(event:Event):void;
	protected static _onWheel(event:Event):void;
	protected static _onTouchStart(event:Event):void;
	protected static _onTouchMove(event:Event):void;
	protected static _onTouchEnd(event:Event):void;
	protected static _onTouchCancel(event:Event):void;
	protected static _onPointerDown(event:Event):void;
	protected static _onTrigger(x:number, y:number):void;
	protected static _oncancel(x:number, y:number):void;
	protected static _onMove(x:number, y:number):void;
	protected static _onRelease(x:number, y:number):void;
}
//-----------------------------------------------------------------------------
// Utils
//
// The public static class that defines utility methods.
declare class Utils
{
	public static readonly RPGMAKER_NAME:string;
	public static readonly RPGMAKER_VERSION:string;
	
	public static isOptionValid(name:string):boolean;
	public static isMobileDevice():boolean;
	public static isMobileSafari():boolean;
	public static isAndroidChrome():boolean;
	public static isNwjs():boolean;

	public static canReadGameFiles():boolean;
	public static rgbToCssColor(r:number, g:number, b:number):string;
}
//-----------------------------------------------------------------------------
// Weather
//
// The weather effect which displays rain, storm, or snow.
declare class Weather extends PIXI.Container
{
	public type:string;
	public power:number;
	public origin:Point;
	
	protected _width:number;
	protected _height:number;
	protected _sprites:Sprite[];
	
	public update():void;
	
	protected _createBitmaps():void;
	protected _createDimmer():void;
	protected _updateDimmer():void;
	protected _updateAllSprites():void;
	protected _addSprite():void;
	protected _removeSprite():void;
	protected _updateRainSprite(sprite:Sprite):void;
	protected _updateStormSprite(sprite:Sprite):void;
	protected _updateSnowSprite(sprite:Sprite):void;
	protected _rebornSprite(sprite:Sprite):void;
}
//-----------------------------------------------------------------------------
// WebAudio
//
// The audio object of Web Audio API.
declare class WebAudio
{
	protected static _createContext():void;
	protected static _detectCodecs():void;
	protected static _createMasterGainNode():void;
	protected static _setupEventHandlers():void;
	protected static _onTouchStart():void;
	protected static _onVisibilityChange():void;
	protected static _onHide():void;
	protected static _onShow():void;
	protected static _fadeIn(duration:number):void;
	protected static _fadeOut(duration:number):void;
	
	public static initialize(noAudio:boolean):void;
	public static canPlayOgg():boolean;
	public static canPlayM4a():boolean;
	
	public url:string;
	public volume:number;
	public pitch:number;
	public pan:number;
	
	protected _context:AudioContext;
	protected _masterGainNode:GainNode;
	protected _initialized:boolean;
	protected _unlocked:boolean;
	protected _buffer:AudioBuffer;
	protected _sourceNode:AudioBufferSourceNode;
	protected _gainNode:GainNode;
	protected _pannerNode:PannerNode;
	protected _totalTime:number;
	protected _sampleRate:number;
	protected _loopStart:number;
	protected _loopLength:number;
	protected _startTime:number;
	protected _volume:number;
	protected _pitch:number;
	protected _pan:number;
	protected _endTimer:number;
	protected _loadListeners:Function[];
	protected _stopListeners:Function[];
	protected _hasError:boolean;
	protected _autoPlay:boolean;
	
	public constructor(url:string);
	
	public clear():void;
	public isReady():boolean;
	public isError():boolean;
	public isPlaying():boolean;
	public stop():void;
	public fadeIn(duration:number):void;
	public fadeOut(duration:number):void;
	public seek():number;
	public addLoadListener(listener:Function):void;
	public addStopListener(listener:Function):void;
	
	protected _load(url:string):void;
	protected _onXhrLoad(xhr:XMLHttpRequest):void;
	protected _startPlaying(loop:boolean, offset:number):void;
	protected _createNodes():void;
	protected _connectNodes():void;
	protected _removeNodes():void;
	protected _createEndTimer():void;
	protected _removeEndTimer():void;
	protected _updatePanner():void;
	protected _onLoad():void;
	protected _readLoopComments(array:string[]):void;
	protected _readOgg(array:string[]):void;
	protected _readMp4(array:string[]):void;
	protected _readMetaData(array:string[], index:number, size:number):void;
	protected _readLittleEndian(array:string[], index:number):number;
	protected _readBigEndian(array:string[], index:number):number;
	protected _readFourCharacters(array:string[], index:number):string;
}
//-----------------------------------------------------------------------------
// Window
//
// The window in the game.
declare class Window extends PIXI.Container
{
	public origin:Point;
	public active:boolean;
	public downArrowVisible:boolean;
	public pause:boolean;
	public windowskin:{};
	public contents:Bitmap;
	public width:number;
	public height:number;
	public padding:number;
	public margin:number;
	public opacity:number;
	public backOpacity:number;
	public contentsOpacity:number;
	public openness:number;
	
	protected _isWindow:boolean;
	protected _windowskin:Bitmap;
	protected _width:number;
	protected _height:number;
	protected _cursorRect:Rectangle;
	protected _opennes:number;
	protected _animationCount:number;
	protected _padding:number;
	protected _margin:number;
	protected _colorTone:number[];
	protected _windowSpriteContainer:Sprite;
	protected _windowBackSprite:Sprite;
	protected _windowCursorSprite:Sprite;
	protected _windowFrameSprite:Sprite;
	protected _windowContentsSprite:Sprite;
	protected _windowArrowSprites:Sprite[];
	
	public update():void;
	public move(x?:number, y?:number, width?:number, height?:number):void;
	public isOpen():boolean;
	public isClosed():boolean;
	public setCursorRect(x?:number, y?:number, width?:number, height?:number):void;
	public setTone(r:number, g:number, b:number):void;
	public addChildToBack(child:PIXI.DisplayObject):PIXI.DisplayObject;
	public updateTransform():void;
	
	protected _createAllParts():void;
	protected _onWindowskinLoad():void;
	protected _refreshAllParts():void;
	protected _refreshBack():void;
	protected _refreshFrame():void;
	protected _refreshCursor():void;
	protected _refreshContents():void;
	protected _refreshArrows():void;
	protected _refreshPauseSign():void;
	protected _updateCursor():void;
	protected _updateContents():void;
	protected _updateArrows():void;
	protected _updatePauseSign():void;
}
//-----------------------------------------------------------------------------
// WindowLayer
//
// The layer which contains game windows.
declare class WindowLayer extends PIXI.Container
{ 
	public width:number;
	public height:number;
	
	protected _width:number;
	protected _height:number;
	protected _tempCanvas:PIXI.SystemRenderer;
	protected _vertexBuffer:{};
	protected _translationMatrix:number[];
	protected _dummySprite:Sprite;
	
	public move(x:number, y:number, width:number, height:number):void;
	public update():void;
	
	protected _renderCanvas(renderSession:PIXI.SystemRenderer):void;
	protected _canvasClearWindowRect(renderSession:PIXI.SystemRenderer, window:Window):void;
	protected _renderWebGL(renderSession:PIXI.SystemRenderer):void;
	protected _webglMaskOutside(renderSession:PIXI.SystemRenderer):void;
	protected _webglMaskWindow(renderSession:PIXI.SystemRenderer, window:Window):void;
	protected _webglMaskRect(renderSession:PIXI.SystemRenderer,x:number, y:number, w:number, h:number):void;
}
interface DataActor
{
	battlerName:string;
	characterIndex:number;
	characterName:string;
	classId:number;
	equips:number[];
	faceIndex:number;
	faceName:string;
	initialLevel:number;
	maxLevel:number;
	name:string;
	nickname:string;
	note:string;
	profile:string;
	traits:Trait[];
}

interface DataClass
{
	expParams:number[];
	id:number;
	learnings:ClassSkill[];
	name:string;
	note:string;
	params:number[][];
	traits:Trait[];
}

interface ClassSkill
{
	level:number;
	skillId:number;
	note:string;
}
interface RPG_Audio
{
	name:string;
    pan:number;
    pitch:number;
    volume:number;
}

interface RPG_CachedAudio extends RPG_Audio
{
	pos:number;
}

interface BGM extends RPG_Audio {}

interface BGS extends RPG_Audio {}

interface ME extends RPG_Audio {}

interface SE extends RPG_Audio {}

interface BGM_Cached extends RPG_CachedAudio {}

interface BGS_Cached extends RPG_CachedAudio {}

interface ME_Cached extends RPG_CachedAudio {}

interface SE_Cached extends RPG_CachedAudio {}
interface DataAnimation
{
	animation1Hue:number;
	animation1Name:string;
	animation2Hue:number;
	animation2Name:string;
	frames:number[][];
	id:number;
	name:string;
	position:number;
	timings:number[];
	
}

interface DataState
{
	autoRemovalTiming:number;
	chanceByDamage:number;
	iconIndex:number;
	id:number;
	maxTurns:number;
	message1:string;
	message2:string;
	message3:string;
	message4:string;
	minTurns:number;
	motion:number;
	name:string;
	note:string;
	overlay:number;
	priority:number;
	releaseByDamage:boolean;
	removeAtBattleEnd:boolean;
	removeByDamage:boolean;
	removeByRestriction:boolean;
	removeByWalking:boolean;
	restriction:number;
	stepsToRemove:number;
	traits:Trait[];
	
}

interface DataTileset
{
	flags:number[];
	id:number;
	mode:number;
	name:string;
	note:string;
	tilesetNames:string[];
	
}

interface DataPlugin
{
	name:string;
	description:string;
	parameters:{ [s:string]: string };
	status:boolean;
}

interface Trait
{
    code:number;
    dataId:number;
    value:number;
}

interface Damage
{
    critical:boolean;
    elementId:number;
    formula:string;
    type:number;
    variance:number
}

declare enum HorizontalAlign
{
	LEFT,
	MIDDLE,
	RIGHT
}

declare enum VeritcalAlign
{
	TOP,
	MIDDLE,
	BOTTOM
}

declare enum Direction
{
	UP_LEFT = 1,
	UP = 2,
	UP_RIGHT = 3,
	LEFT = 4,
	RIGHT = 6,
	DOWN_LEFT = 7,
	DOWN = 8,
	DOWN_RIGHT = 9
}
interface DataEnemy
{
    actions:EnemyAction[];
	battlerHue:number;
	battlerName:string;
    dropItems:DropItem[];
	exp:number;
	gold:number;
	id:number;
	name:string;
	note:string;
	params:number[];
	traits:Trait[];
}

interface DropItem
{
    dataId:number;
    denominator:number;
    kind:number;
}

interface EnemyAction
{
    conditionParam1:number;
    conditionParam2:number;
    conditionType:number;
    rating:number;
    skillId:number;
}

interface DataTroop
{
	id:number;
	members:TroopMember[];
	name:string;
	pages:TroopEventPage[];
}

interface TroopCondition
{
	actorHp:number;
	actorId:number;
	actorValid:boolean;
	enemyHp:number;
	enemyIndex:number;
	enemyValid:boolean;
	switchId:number;
	turnA:number;
	turnB:number;
	turnEnding:boolean;
	turnValid:boolean;
}

interface TroopEventPage
{
	conditions:TroopCondition;
	list:EventItem[];
	span:number;
}

interface TroopMember
{
	enemyId:number;
	x:number;
	y:number;
	hidden:boolean;
}
interface DataCommonEvent
{
	id:number;
	list:EventItem[];
	name:string;
	switchId:number;
	trigger:number;
}

interface EventItem
{
    code:number;
    indent:number;
    parameters:number[];
}
interface RPG_ItemBase
{
	description:string;
	iconIndex:number;
	id:number;
	name:string;
	note:string;
}

interface RPG_EquipBase extends RPG_ItemBase
{
	etypeId:number;
	params:number[];
	price:number;
	traits:Trait[];
}

interface RPG_UsableBase extends RPG_ItemBase
{
	animationId:number;
	damage:Damage;
	effects:Effect[];
	hitType:number;
	occasion:number;
	repeats:number;
	scope:UsageScope;
	successRate:number;
	tpGain:number;
}

declare enum UsageScope
{
	NONE,
	SINGLE_ENEMY,
	ALL_ENEMIES,
	ONE_RANDOM_ENEMIES,
	TWO_RANDOM_ENEMIES,
	THREE_RANDOM_ENEMIES,
	FOUR_RANDOM_ENEMIES,
	SINGLE_ALLY,
	ALL_ALLIES,
	SINGLE_DEAD_ALLY,
	ALL_DEAD_ALLIES,
	USER
}

interface Effect
{
    code:number;
    dataId:number;
    value1:number;
    value2:number;
}

interface DataArmor extends RPG_EquipBase
{
	atypeId:number;
}

interface DataItem extends RPG_UsableBase
{
	consumable:boolean;
	description:string;
	itypeId:number;
	meta:{};
	price:number;
	speed:number;
}

interface DataSkill extends RPG_UsableBase
{
	message1:string;
	message2:string;
	mpCost:number;
	requiredWtypeId1:number;
	requiredWtypeId2:number;
	stypeId:number;
	tpCost:number;
}

interface DataWeapon extends RPG_EquipBase
{
	animationId:number;
	wtypeId:number;
}
interface DataMap
{
	autoplayBgm:boolean;
	autoplayBgs:boolean;
	battleback1Name:string;
	battleback2Name:string;
	bgm:BGM;
	bgs:BGS;
	data:number[];
	disableDashing:boolean;
	displayName:string;
	encounterList:number[];
	encounterStep:number;
	events:MapEvent[];
	height:number;
	meta:{};
	note:string;
	parallaxLoopX:boolean;
	parallaxLoopY:boolean;
	parallaxName:string;
	parallaxShow:boolean;
	parallaxSx:number;
	parallaxSy:number;
	scrollType:number;
	specifyBattleback:boolean;
	tilesetId:number;
	width:number;
}

interface DataMapInfo
{
	expanded:boolean;
	id:number;
	name:string;
	order:number;
	parentId:number;
	scrollX:number;
	scrollY:number;
}

interface MapEvent
{
	id:string,
	name:string,
	note:string,
	pages:MapEventPage[];
	x:number;
	y:number;
}

interface MapEventConditions
{
	actorId:number;
	actorValid:boolean;
	itemId:number;
	itemValid:boolean;
	selfSwitchCh:string;
	selfSwitchValid:boolean;
	switch1Id:number;
	switch1Valid:boolean;
	switch2Id:number;
	switch2Valid:boolean;
	variableId:number;
	variableValid:boolean;
	variableValue:number
}

interface MapEventImage
{
	characterIndex:number;
	characterName:string;
	direction:number;
	pattern:number;
	tileId:number
}

interface MapEventPage
{
	conditions:MapEventConditions;
	directionFix:boolean;
	image:MapEventImage;
	list:EventItem[]
	moveFrequency:number;
	moveRoute:MoveRoute;
	moveSpeed:number;
	moveType:number;
	priorityType:number;
	stepAnime:boolean;
	through:boolean;
	trigger:number;
	walkAnime:boolean;
}

interface MoveRoute
{
	list:EventItem[];
	repeat:boolean;
	skippable:boolean;
	wait:boolean;
}
declare enum MessageBackgroundStyle
{
	WINDOW,
	DIM,
	TRANSPARENT
}

declare enum ChoiceDefaultType
{
	NONE,
	CHOICE_1,
	CHOICE_2,
	CHOICE_3,
	CHOICE_4,
	CHOICE_5,
	CHOICE_6
}

declare enum ChoiceCancelType
{
	BRANCH,
	DISALLOW,
	CHOICE_1,
	CHOICE_2,
	CHOICE_3,
	CHOICE_4,
	CHOICE_5,
	CHOICE_6
}
interface DataSystem
{
	airship:DataVehicle;
	armorTypes:string[];
	attackMotions:AttackMotion[];
	battleBgm:BGM;
	battleback1Name:string;
	battleback2Name:string;
	battlerHue: 0;
	battlerName:string;
	boat:DataVehicle;
	currencyUnit:string,
	defeatMe:ME;
	editMapId:number;
	elements:string[];
	equipTypes:string[];
	gameTitle:string;
	gameoverMe:ME;
	locale:string;
	magicSkills:number[];
	menuCommands:boolean[]
	optDisplayTp:boolean;
	optDrawTitle:boolean;
	optExtraExp:boolean;
	optFloorDeath:boolean;
	optFollowers:boolean;
	optSideView:boolean;
	optSlipDeath:boolean;
	optTransparent:boolean;
	partyMembers:number[]
	ship:DataVehicle;
	skillTypes:string[];
	sounds:SE[];
	startMapId: 1,
	startX:number;
	startY:number;
	switches:string[];
	terms:LangLookup;
	testBattlers:DataActor[];
	testTroopId:number;
	title1Name:string;
	title2Name:string,
	titleBgm:BGM
	variables:string[]
	versionId:number,
	victoryMe:ME;
	weaponTypes:string[];
	windowTone:number[];
}

interface DataVehicle
{
	bgm:BGM;
	characterIndex:number;
	characterName:string,
	startMapId:number;
	startX:number;
	startY:number;
}

interface AttackMotion
{
	type:number;
	weaponImageId:number
}

interface LangLookup
{
	basic:string[];
	commands:string[];
	params:string[];
	messages: { [s:string]: string }
}
//-----------------------------------------------------------------------------
// AudioManager
//
// The static class that handles BGM, BGS, ME and SE.
declare class AudioManager
{
	public static bgmVolume:number;
	public static bgsVolume:number;
	public static meVolume:number;
	public static seVolume:number;
	
	protected static _bgmVolume:number;
	protected static _bgsVolume:number;
	protected static _meVolume:number;
	protected static _seVolume:number;
	protected static _currentBgm:BGM;
	protected static _currentBgs:BGS;
	protected static _bgmBuffer:number;
	protected static _bgsBuffer:number;
	protected static _meBuffer:number;
	protected static _seBuffers:number[];
	protected static _protectedStaticBuffers:number[];
	protected static _replayFadeTime:number;
	protected static _path:string;
	
	public static playBgm(bgm:BGM, pos:number):void;
	public static replayBgm(bgm:BGM):void;
	public static isCurrentBgm(bgm:BGM):boolean;
	public static updateBgmParameters(bgm:BGM):void;
	public static updateCurrentBgm(bgm:BGM, pos:number):void;
	public static fadeOutBgm(duration:number):void;
	public static fadeInBgm(duration:number):void;
	public static stopBgm():void;
	
	public static playBgs(bgs:BGS, pos:number):void;
	public static replayBgs(bgs:BGS):void;
	public static isCurrentBgs(bgs:BGS):boolean;
	public static updateBgsParameters(bgs:BGS):void;
	public static updateCurrentBgs(bgs:BGS, pos:number):void;
	public static fadeOutBgs(duration:number):void;
	public static fadeInBgs(duration:number):void;
	public static stopBgs():void;

	public static playMe(me:{name:string}):void;
	public static updateMeParameters(me:{name:string}):void;
	public static fadeOutMe(duration:number):void;
	public static stopMe():void;

	public static playSe(se:{name:string}):void;
	public static updateSeParameters(buffer:Html5Audio, se:{name:string}):void;
	public static updateSeParameters(buffer:WebAudio, se:{name:string}):void;
	public static stopSe():void;

	public static playStaticSe(se:{name:string}):void;
	public static loadStaticSe(se:{name:string}):void;
	public static isStaticSe(se:{name:string}):boolean;

	public static stopAll():void;

	public static saveBgm():BGM_Cached;
	public static saveBgs():BGS_Cached;
	public static makeEmptyAudioObject():RPG_Audio;

	public static createBuffer(folder:string, name:string):Html5Audio;
	public static createBuffer(folder:string, name:string):WebAudio;
	public static updateBufferParameters(buffer:Html5Audio, configVolume:number, audio:{volume:number;pitch:number;pan:number}):void;
	public static updateBufferParameters(buffer:WebAudio, configVolume:number, audio:{volume:number;pitch:number;pan:number}):void;
	
	public static audioFileExt():string;
	public static shouldUseHtml5Audio():boolean;
	public static checkErrors():void;
	public static checkWebAudioErrors(webAudio:WebAudio):void;
	
}
//-----------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.
declare class BattleManager
{
	private static _phase:string;
	private static _canEscape:boolean;
	private static _canLose:boolean;
	private static _battleTest:boolean;
	private static _eventCallback:(n:number) => void;
	private static _preemtpive:boolean;
	private static _surprise:boolean;
	private static _actorIndex:number;
	private static _actionForcedBattler:Game_Battler;
	private static _mapBgm:BGM_Cached;
	private static _mapBgs:BGS_Cached;
	private static _actionBattlers:Game_Battler[];
	private static _subject:Game_Battler;
	private static _action:Game_Action;
	private static _targets:Game_Battler[];
	private static _logWindow:Window_BattleLog;
	private static _statusWindow:Window_BattleStatus;
	private static _spriteset:Spriteset_Battle;
	private static _escapeRatio:number;
	private static _escaped:boolean;
	private static _rewards:BattleRewards;
	
	public static isBattletest():boolean;
	public static setBattleTest(battleTest:boolean):void;

	public static setEventCallback(callback:(n:number) => void):void;
	public static setLogWindow(logWindow:Window_BattleLog):void;
	public static setStatusWindow(statusWindow:Window_BattleStatus):soid;
	public static setSpriteset(spriteset:Spriteset_Battle):void;

	public static onEncounter():void;

	public static ratePreemptive():number;
	public static rateSurprise():number;
	public static saveBgmAndBgs():void;
	public static makeEscapeRatio():void;

	public static update():void;
	public static updateEvent():boolean;
	public static updateEventMain():boolean;

	public static isBusy():boolean;
	public static isInputting():boolean;
	public static isInTurn():boolean;
	public static isTurnEnd():boolean;
	public static isAborting():boolean;
	public static isBattleEnd():boolean;
	public static canEscape():boolean;
	public static canLose():boolean;
	public static isEscaped():boolean;

	public static actor():Game_Actor;
	public static clearActor():void;
	public static changeActor(newActorIndex:number, lastActorActionState:string):void;

	public static startbattle():void;
	public static displayStartMessages():void;

	public static startInput():void;
	public static inputtingAction():boolean;
	public static selectNextCommand():void;
	public static selectPreviousCommand():void;
	public static refreshStatus():void;

	public static startTurn():void;
	public static updateTurn():void;
	public static processTurn():void;
	public static endTurn():void;
	public static updateTurnEnd():void;

	public static getNextSubject():Game_Battler;
	public static allBattleMembers():Game_Battler[];

	public static makeActionOrders():void;
	public static startAction():void;
	public static updateAction():void;
	public static endAction():void;

	public static invokeAction(subject:Game_Battler, target:Game_Battler):void;
	public static invokeNormalAction(subject:Game_Battler, target:Game_Battler):void;
	public static invokeCounterAttack(subject:Game_Battler, target:Game_Battler):void;
	public static invokeMagicReflection(subject:Game_Battler, target:Game_Battler):void;

	public static applySubstitute(target:Game_Battler):Game_Battler;
	public static checkSubstitute(target:Game_Battler):boolean;

	public static isActionForced():boolean;
	public static forceAction(battler:Game_Battler):void;
	public static processForcedAction():void;

	public static abort():void;
	public static checkBattleEnd():boolean;
	public static checkAbort():boolean;

	public static processVictory():void;
	public static processEscape():void;
	public static processAbort():void;
	public static processDefeat():void;

	public static endBattle(result:number):void;
	public static updateBattleEnd():void;
	public static makeRewards():void;

	public static displayVictoryMessage():void;
	public static displayDefeatMessage():void;
	public static displayEscapeSuccessMessage():void;
	public static displayEscapeFailureMessage():void;
	public static displayRewards():void;
	public static displayExp():void;
	public static displayGold():void;
	public static displayDropItems():void;

	public static gainRewards():void;
	public static gainExp():void;
	public static gainGold():void;
	public static gainDropItems():void;
	
}

interface BattleRewards
{
	gold:number;
	exp:number;
	items:RPG_ItemBase[];
}
//-----------------------------------------------------------------------------
// ConfigManager
//
// The public static class that manages the configuration data.
declare class ConfigManager
{
	public static alwaysDash:boolean;
	public static commandRemember:boolean;
	public static bgmVolume:number;
	public static bgsVolume:number;
	public static meVolume:number;
	public static seVolume:number;
	
	public static load():void;
	public static save():void;

	public static makeData():Config;
	public static applyData(config:Config):void;

	public static readFlag(config:Config, name: string):boolean;
	public static readVolume(config:Config, name: string):number;
}

interface Config
{
	alwaysDash:boolean;
	commandRemember:boolean;
	bgmVolume:number;
	bgsVolume:number;
	meVolume:number;
	seVolume:number;
}
//-----------------------------------------------------------------------------
// DataManager
//
// The static class that manages the database and game objects.
declare class DataManager
{
	private static _globalId:string;
	private static _lastAccessedId:number;
	private static _errorUrl:string;
	private static _databaseFiles:DatabaseFile[];
	
	public static loadDatabase():void;
	public static loadDataFile(name:string, src:string):void;
	public static isDatabaseLoaded():boolean;

	public static loadMapData(mapId:number):void;
	public static makeEmptyMap():void;
	public static isMapLoaded():boolean;

	public static onLoad(object:any):void;
	public static extractMetadata(data:any):void;
	public static checkError():void;

	public static isBattleTest():boolean;
	public static isEventTest():boolean;

	public static isSkill(item:RPG_ItemBase):boolean;
	public static isItem(item:RPG_ItemBase):boolean;
	public static isWeapon(item:RPG_ItemBase):boolean;
	public static isArmor(item:RPG_ItemBase):boolean;

	public static createGameObjects():void;
	public static setupNewGame():void;
	public static setupBattleTest():void;
	public static setupEventTest():void;

	public static loadGlobalInfo():SavefileInfo[];
	public static saveGlobalInfo(info:SavefileInfo[]):void;

	public static isThisGameFile(savefileId:number):boolean;
	public static isAnySavefileExists():boolean;
	public static loadAllSavefileImages():void;
	public static loadSavefileImages(info:SavefileInfo):void;
	public static maxSavefiles():number;

	public static lastAccessedSavefileId():number;
	public static latestSavefileId():number;
	public static selectSavefileForNewGame():void;

	public static loadGame(savefileId:number):boolean;
	public static loadGameWithoutRescue(savefileId:number):boolean;
	public static loadSavefileInfo(savefileId:number):Savefile;
	public static extractSavefileContents(contens:Savefile):void;

	public static saveGame(savefileId:number):boolean;
	public static saveGameWithoutRescue(savefileId:number):boolean;
	public static makeSavefileInfo():SavefileInfo;
	public static makeSavefileContents():Savefile;

}

interface DatabaseFile
{
	name:string;
	src:string;
}

interface SavefileInfo
{
	globalId:number;
	title:string;
	characters:any[];
	faces:any[];
	playtime:number;
	timestamp:number;
}

interface Savefile
{
	system:Game_System;
    screen:Game_Screen;
    timer:Game_Temp;
    switches:Game_Switches;
    variables:Game_Variables;
    selfSwitches:Game_SelfSwitches;
    actors:Game_Actors;
    party:Game_Party;
    map:Game_Map;
    player:Game_Player;
}
//-----------------------------------------------------------------------------
// ImageManager
//
// The public static class that loads images, creates bitmap objects and retains them.
declare class ImageManager
{
	private static _cache:CacheMap;
	
	public static loadAnimation(filename:string, hue:number):Bitmap;
	public static loadBattleback1(filename:string, hue:number):Bitmap;
	public static loadBattleback2(filename:string, hue:number):Bitmap;
	public static loadEnemy(filename:string, hue:number):Bitmap;
	public static loadCharacter(filename:string, hue:number):Bitmap;
	public static loadFace(filename:string, hue:number):Bitmap;
	public static loadParallax(filename:string, hue:number):Bitmap;
	public static loadPicture(filename:string, hue:number):Bitmap;
	public static loadSvActor(filename:string, hue:number):Bitmap;
	public static loadSvEnemy(filename:string, hue:number):Bitmap;
	public static loadSystem(filename:string, hue:number):Bitmap;
	public static loadTileset(filename:string, hue:number):Bitmap;
	public static loadTitle1(filename:string, hue:number):Bitmap;
	public static loadTitle2(filename:string, hue:number):Bitmap;

	public static loadBitmap(folder:string, filename:string, hue:number, smooth:boolean):Bitmap;
	public static loadEmptyBitmap():Bitmap;
	public static loadNormalBitmap(path:string, hue:number):Bitmap;

	public static clear():void;

	public static isReady():boolean;
	public static isCharacterObject(filename:string):boolean;
	public static isBigCharacter(filename:string):boolean;
	public static isZeroParallax(filename:string):boolean;
}
//-----------------------------------------------------------------------------
// PluginManager
//
// The static class that manages the plugins.
declare class PluginManager
{
	private static _path:string;
	private static _scripts:string[];
	private static _errorUrls:string[];
	private static _parameters:{ [s:string]: string };
	
	public static setup(plugins:DataPlugin[]):void;
	public static checkErrors():void;
	public static parameters(pluginName:string):{ [s:string]: string };
	public static setParameters(name:string, parameters:{ [s:string]: string }):void;
	public static loadScript(name:string):void;
	public static onError(e:Event):void;
}
//-----------------------------------------------------------------------------
// SceneManager
//
// The public static class that manages scene transitions.
declare class SceneManager
{
	private static _scene:Scene_Base;
	private static _nextScene:Scene_Base;
	private static _stack:(new() => Scene_Base)[];
	private static _stopped:boolean;
	private static _sceneStarted:boolean;
	private static _exiting:boolean;
	private static _previousClass:(new() => Scene_Base);
	private static _backgroundBitmap:Bitmap;
	private static _screenWidth:number;
	private static _screenHeight:number;
	private static _boxWidth:number;
	private static _boxHeight:number;
	
	public static run(sceneClass:new() => Scene_Base):void;
	public static goto(sceneClass:new() => Scene_Base):void;
	public static push(sceneClass:new() => Scene_Base):void;

	public static initialize():void;
	public static initGraphics():void;
	public static initAudio():void;
	public static initInput():void;
	public static initNwjs():void;

	public static preferableRendererType():string;
	public static shouldUseCanvasRenderer():boolean;

	public static checkWebGL():void;
	public static checkFileAccess():void;
	
	public static setupErrorHandlers():void;
	public static checkPluginErrors():void;
	public static catchException(e:ExceptionInformation):void;

	public static onError(e:Event):void;
	public static onKeyDown(event:KeyboardEvent):void;

	public static tickStart():void;
	public static tickEnd():void;
	public static update():void;
	public static updateInputData():void;
	public static updateMain():void;
	public static requestUpdate():void;

	public static changeScene():void;
	public static updateScene():void;
	public static renderScene():void;

	public static onSceneCreate():void;
	public static onSceneStart():void;
	public static onSceneLoading():void;
	
	public static isSceneChanging():boolean;
	public static isCurrentSceneBusy():boolean;
	public static isCurrentSceneStarted():boolean;
	public static isNextScene():boolean;
	public static isPreviousScene():boolean;

	public static pop():void;
	public static stop():void;
	public static exit():void;
	public static terminate():void;

	public static clearStack():void;
	public static prepareNextScene():void;

	public static snap():Bitmap;
	public static snapForBackground():void;
	public static backgroundBitmap():Bitmap;
}
//-----------------------------------------------------------------------------
// SoundManager
//
// The public static class that plays sound effects defined in the database.
declare class SoundManager
{
	public static preloadImportantSounds():void;
	public static loadSystemSound(n:number):void;
	public static playSystemSound(n:number):void;
	public static playCursor():void;
	public static playOk():void;
	public static playCancel():void;
	public static playBuzzer():void;
	public static playEquip():void;
	public static playSave():void;
	public static playLoad():void;
	public static playBattleSart():void;
	public static playEscape():void;
	public static playEnemyAttack():void;
	public static playEnemyDamage():void;
	public static playEnemyCollapse():void;
	public static playBossCollapse1():void;
	public static playBossCollapse2():void;
	public static playActorDamage():void;
	public static playActorCollapse():void;
	public static playRecovery():void;
	public static playMiss():void;
	public static playEvasion():void;
	public static playMagicEvasion():void;
	public static playReflection():void;
	public static playShop():void;
	public static playUseItem():void;
	public static playUseSkill():void;
}
//-----------------------------------------------------------------------------
// StorageManager
//
// The public static class that manages storage for saving game data.
declare class StorageManager
{
	public static save(savefileId:number, json:string):void;
	public static load(savefileId:number):string;

	public static exists(savefileId:number):boolean;
	public static remove(savefileId:number):void;

	public static isLocalMode():boolean;
	public static loadlFileDirectoryPath():string;
	public static localFilePath(savefileId:number):string;
	public static webStorageKey(savefileId:number):string;

	public static saveToLocalFile(savefileId:number, json:string):void;
	public static loadFromLocalFile(savefileId:number):string;
	public static localFileExists(savefileId:number):boolean;
	public static removeLocalFile(savefileId:number):void;

	public static saveToWebStorage(savefileId:number, json:string):void;
	public static loadFromWebStorage(savefileId:number):string;
	public static webStorageExists(savefileId:number):boolean;
	public static removeWebStorage(savefileId:number):void;
}
//-----------------------------------------------------------------------------
// TextManager
//
// The public static class that handles terms and messages.
declare class TextManager
{
	public static currencyUnit:string;
	public static level:string;
	public static levelA:string;
	public static hp:string;
	public static hpA:string;
	public static mp:string;
	public static mpA:string;
	public static tp:string;
	public static tpA:string;
	public static exp:string;
	public static expA:string;
	public static fight:string;
	public static escape:string;
	public static attack:string;
	public static guard:string;
	public static item:string;
	public static skill:string;
	public static equip:string;
	public static status:string;
	public static formation:string;
	public static save:string;
	public static gameEnd:string;
	public static options:string;
	public static weapon:string;
	public static armor:string;
	public static keyItem:string;
	public static equip2:string;
	public static optimize:string;
	public static clear:string;
	public static newGame:string;
	public static continue_:string;
	public static toTitle:string;
	public static cancel:string;
	public static buy:string;
	public static sell:string;
	public static alwaysDash:string;
	public static commandRemember:string;
	public static bgmVolume:string;
	public static bgsVolume:string;
	public static meVolume:string;
	public static seVolume:string;
	public static possession:string;
	public static expTotal:string;
	public static expNext:string;
	public static saveMessage:string;
	public static loadMessage:string;
	public static file:string;
	public static partyName:string;
	public static emerge:string;
	public static preemptive:string;
	public static surprise:string;
	public static escapeStart:string;
	public static escapeFailure:string;
	public static victory:string;
	public static defeat:string;
	public static obtainExp:string;
	public static obtainGold:string;
	public static obtainItem:string;
	public static levelUp:string;
	public static obtainSkill:string;
	public static useItem:string;
	public static criticalToEnemy:string;
	public static criticalToActor:string;
	public static actorDamage:string;
	public static actorRecovery:string;
	public static actorGain:string;
	public static actorLoss:string;
	public static actor:string;
	public static Drain:string;
	public static actorNoDamage:string;
	public static actorNoHit:string;
	public static enemyDamage:string;
	public static enemyRecovery:string;
	public static enemyGain:string;
	public static enemyLoss:string;
	public static enemyDrain:string;
	public static enemyNoDamage:string;
	public static enemyNoHit:string;
	public static evasion:string;
	public static magicEvasion:string;
	public static magicReflection:string;
	public static counterAttack:string;
	public static substitute:string;
	public static buffAdd:string;
	public static debuffAdd:string;
	public static buffRemove:string;
	public static actionFailure:string;
	
	public static basic(basicId:number):string;
	public static param(paramId:number):string;
	public static command(commandId:number):string;
	public static message(messageId:string):string;
	public static getter(method:string, param:string|number):string;
	
}
//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

declare class Game_Action
{
	public static readonly EFFECT_RECOVER_HP:number;
	public static readonly EFFECT_RECOVER_MP:number;
	public static readonly EFFECT_GAIN_TP:number;
	public static readonly EFFECT_ADD_STATE:number;
	public static readonly EFFECT_REMOVE_STATE:number;
	public static readonly EFFECT_ADD_BUFF:number;
	public static readonly EFFECT_ADD_DEBUFF:number;
	public static readonly EFFECT_REMOVE_BUFF:number;
	public static readonly EFFECT_REMOVE_DEBUFF:number;
	public static readonly EFFECT_SPECIAL:number;
	public static readonly EFFECT_GROW:number;
	public static readonly EFFECT_LEARN_SKILL:number;
	public static readonly EFFECT_COMMON_EVENT:number;
	public static readonly SPECIAL_EFFECT_ESCAPE:number;
	public static readonly HITTYPE_CERTAIN:number;
	public static readonly HITTYPE_PHYSICAL:number;
	public static readonly HITTYPE_MAGICAL:number;

	protected _subjectActorId:number;
	protected _subjectEnemyIndex:number;
	protected _forcing:boolean;
	protected _item:Game_Item;
	protected _targetIndex:number;

	public constructor(subject:Game_Battler, forcing:boolean);

	public clear():void;

	public setSubject(subject:Game_Battler):void;
	public subject():Game_Battler;

	public friendsUnit():Game_Unit;
	public opponentsUnit():Game_Unit;

	public setEnemyAction(action:EnemyAction):void;
	public setTarget(targetIndex:number):void;

	public setAttack():void;
	public setGuard():void;
	public setSkill(skillId:number):void;

	public setItem(itemId:number):void;
	public setItemObject(object:RPG_ItemBase):void;

	public item():Game_Item;

	public isSkill():boolean;
	public isItem():boolean;

	public numRepeats():number;

	public checkItemScope(list:number[]):boolean;
	public isForOpponent():boolean;
	public isForFriend():boolean;
	public isForDeadFriend():boolean;
	public isForUser():boolean;
	public isForOne():boolean;
	public isForRandom():boolean;
	public isForAll():boolean;

	public needsSelection():boolean;

	public numTargets():number;

	public checkDamageType(list:number[]):boolean;
	public isHpEffect():boolean;
	public isMpEffect():boolean;
	public isDamage():boolean;
	public isRecover():boolean;
	public isDrain():boolean;
	public isHpRecover():boolean;
	public isMpRecover():boolean;

	public isCertainHit():boolean;
	public isPhysical():boolean;
	public isMagical():boolean;
	public isAttack():boolean;
	public isGuard():boolean;
	public isMagicSkill():boolean;

	public decideRandomTarget():void;
	public setConfusion():void;

	public prepare():void;

	public isValid():boolean;

	public speed():number;

	public makeTargets():Game_Battler[];
	public repeatTargets(targets:Game_Battler[]):Game_Battler[];

	public confusionTarget():Game_Battler;
	public itemTargetCandidates():Game_Battler[];
	public targetsForOpponents():Game_Battler[];
	public targetsForFriends():Game_Battler[];

	public evaluate():number;
	public evaluateWithTarget(target:Game_Battler):number;

	public testApply(target:Game_Battler):boolean;

	public hasItemAnyValidEffects(target:Game_Battler):boolean;

	public testItemEffect(target:Game_Battler, effect:number):boolean;

	public itemCnt(target:Game_Battler):number;
	public itemMrf(target:Game_Battler):number;
	public itemHit(target:Game_Battler):number;
	public itemEva(target:Game_Battler):number;
	public itemCri(target:Game_Battler):number;

	public apply(target:Game_Battler):void;
	public makeDamageValue(target:Game_Battler, critical:boolean):void;
	public evalDamageFormula(target:Game_Battler):number;

	public calcElementRate(target:Game_Battler):number;
	public elementsMaxRate(target:Game_Battler, elements:number[]):void;

	public applyCritical(damag:number):number;
	public applyVariance(damage:number, variance:number):number;
	public applyGuard(damage:number, target:number):number;

	public executeDamage(target:number, value:number):void;
	public executeHpDamage(target:Game_Battler, value:number):void;
	public executeMpDamage(target:Game_Battler, value:number):void;

	public gainDrainedHp(value:number):void;
	public gainDrainedMp(value:number):void;

	public applyItemEffect(target:Game_Battler, effect:Effect):void;
	public itemEffectRecoverHp(target:Game_Battler, effect:Effect):void;
	public itemEffectRecoverMp(target:Game_Battler, effect:Effect):void;
	public itemEffectGainTp(target:Game_Battler, effect:Effect):void;
	public itemEffectAddState(target:Game_Battler, effect:Effect):void;
	public itemEffectAddAttackState(target:Game_Battler, effect:Effect):void;
	public itemEffectAddNormalState(target:Game_Battler, effect:Effect):void;
	public itemEffectRemoveState(target:Game_Battler, effect:Effect):void;
	public itemEffectAddBuff(target:Game_Battler, effect:Effect):void;
	public itemEffectAddDebuff(target:Game_Battler, effect:Effect):void;
	public itemEffectRemoveBuff(target:Game_Battler, effect:Effect):void;
	public itemEffectRemoveDebuff(target:Game_Battler, effect:Effect):void;
	public itemEffectSpecial(target:Game_Battler, effect:Effect):void;
	public itemEffectGrow(target:Game_Battler, effect:Effect):void;
	public itemEffectLearnSkill(target:Game_Battler, effect:Effect):void;
	public itemEffectCommonEvent(target:Game_Battler, effect:Effect):void;

	public makeSuccess(target:Game_Battler):void;

	public applyItemUserEffect(target:Game_Battler):void;

	public lukEffectRate(target:Game_Battler):number;

	public applyGlobal():void;
}
//-----------------------------------------------------------------------------
// Game_ActionResult
//
// The game object class for a result of a battle action. For convinience, all
// member variables in this class are public.

declare class Game_ActionResult
{
	public used:boolean;
    public missed:boolean;
    public evaded:boolean;
    public physical:boolean;
    public drain:boolean;
    public critical:boolean;
    public success:boolean;
    public hpAffected:boolean;
    public hpDamage:number;
    public mpDamage:number;
    public tpDamage:number;
    public addedStates:number[];
    public removedStates:number[];
    public addedBuffs:number[];
    public addedDebuffs:number[];
    public removedBuffs:number[];

	public constructor();

	public clear():void;

	public addedStateObjects():DataState[];
	public removedStateObjects():DataState[];
	public isStatusAffected():boolean;

	public isHit():boolean;

	public isStateAdded(stateId:number):boolean;
	public pushAddedState(stateId:number):void;

	public isStateRemoved(stateId:number):boolean;
	public pushRemovedState(stateId:number):void;

	public isBuffAdded(paramId:number):boolean;
	public pushAddedBuff(paramId:number):void;

	public isDebuffAdded(paramId:number):boolean;
	public pushAddedDebuff(paramId:number):void;

	public isBuffRemoved(paramId:number):boolean;
	public pushRemovedBuff(paramId:number):void;
}
//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

declare class Game_Actor extends Game_Battler
{
	protected _actorId:number;
    protected _name:string;
    protected _nickname:string;
    protected _classId:number;
    protected _level:number;
    protected _characterName:string;
    protected _characterIndex:number;
    protected _faceName:string;
    protected _faceIndex:number;
    protected _battlerName:string;
    protected _exp:{ [classId:number]: number};
	protected _skills:number[];
	protected _equips:Game_Item[];
	protected _actionInputIndex:number;
	protected _lastMenuSkill:Game_Item;
	protected _lastBattleSkill:Game_Item;
	protected _lastCommandSymbol:string; 

	public readonly level:number;

	public constructor(actorId:number);

	public setup(actorId:number):void;

	public actorId():number;
	public actor():DataActor;

	public name():string;
	public setName(name:string):void;

	public nickname():string;
	public setNickname(nickname:string):void;

	public profile():string;
	public setProfile(profile:string):void;

	public characterName():string;
	public characterIndex():number;

	public faceName():string;
	public faceIndex():number;

	public battlerName():string;

	public eraseState(stateId:number):void;

	public initImages():void;

	public expForLevel(level:number):number;

	public initExp():void;

	public currentExp():number;
	public currentLevelExp():number;
	public nextLevelExp():number;
	public nextRequiredExp():number;

	public maxLevel():number;
	public isMaxLevel():number;

	public initSkills():void;

	public initEquips(equips:number[]):void;
	public equipSlots():number[];
	public equips():RPG_EquipBase[];
	public weapons():DataWeapon[];
	public armors():DataArmor[];
	public hasWeapon(weapon:number):boolean;
	public hasArmor(armor:number):boolean;

	public isEquipChangeOk(slotId:number):boolean;
	public changeEquip(slotId:number, item:RPG_EquipBase):void;
	public forceChangeEquip(slotId:number, item:RPG_EquipBase):void;
	public tradeItemWithParty(newItem:RPG_EquipBase, oldItem:RPG_EquipBase):boolean;
	public changeEquipById(etypeId:number, itemId:number):void;

	public isEquipped(item:RPG_EquipBase):boolean;
	public discardEquip(item:RPG_EquipBase):void;
	public releaseUnequippableItems(forcing:boolean):void;
	public clearEquipments():void;
	public optimizeEquipments():void;
	public bestEquipItem(slotId:number):number;
	public calcEquipItemPerformance(item:RPG_EquipBase):number;
	public isWtypeEquipped(wtypeId:number):boolean;

	public friendsUnit():Game_Party;
	public opponentsUnit():Game_Troop;

	public isFormationChangeOk():boolean;

	public currentClass():DataClass;
	public isClass(gameClass:DataClass):boolean;

	public skills():DataSkill[];
	public usableSkills():DataSkill[];

	public hasNoWeapons():boolean;
	public bareHandsElementId():number;
	public attackAnimationId1():number;
	public attackAnimationId2():number;
	public bareHandsAnimationId():number;

	public changeExp(exp:number, show:boolean):void;
	public levelUp():void;
	public levelDown():void;

	public findNewSkills(lastSkills:DataSkill[]):DataSkill[];

	public displayLevelUp(newSkills:DataSkill):void;
	public gainExp(exp:number):void;
	public finalExpRate():number;
	public benchMembersExpRate():number;
	public shouldDisplayLevelUp():boolean;

	public changeLevel(level:number, show:boolean):void;
	public learnSkill(skillId:number):void;
	public forgetSkill(skillId:number):void;
	public isLearnedSkill(skillId:number):boolean;
	public hasSkill(skillId:number):boolean;

	public changeClass(classId:number, keepExp:boolean):void;

	public setCharacterImage(characterName:string, characterIndex:number):void;
	public setFaceImage(faceName:string, faceIndex:number):void;
	public setBattlerImage(battlerName:string):void;

	public performAttack():void;
	public performVictory():void;
	public performEscape():void;

	public makeActionList():Game_Action[];
	public makeAutoBattleActions():void;
	public makeConfusionActions():void;

	public onPlayerWalk():void;

	public updateStateSteps(state:DataState):void;
	public showAddedStates():void;
	public showRemovedStates():void;

	public stepsForTurn():number;
	public turnEndOnMap():void;

	public checkFloorEffect():void;
	public executeFloorDamage():void;
	public basicFloorDamage():number;
	public maxFloorDamage():number;

	public performMapDamage():void;

	public inputtingAction():boolean;

	public selectNextCommand():boolean;
	public selectPreviousCommand():boolean;

	public lastMenuSkill():DataSkill;
	public setLastMenuSkill(skill:number):void;
	public lastBattleSkill():DataSkill;
	public setLastBattleSkill(skill:number):void;
	public lastCommandSymbol():string;
	public setLastCommandSymbol(symbol:string):void;

	public testEscape(item:RPG_ItemBase):boolean;
	public meetsUsableItemConditions(item:RPG_ItemBase):boolean;
}
//-----------------------------------------------------------------------------
// Game_Actors
//
// The wrapper class for an actor array.

declare class Game_Actors
{
	protected _data:Game_Actor[];
	
	public constructor();

	public actor(actorId:number):Game_Actor;
}
//-----------------------------------------------------------------------------
// Game_Battler
//
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.

declare class Game_Battler extends Game_BattlerBase
{
    protected _actions:Game_Action[];
    protected _speed:number;
    protected _result:Game_ActionResult;
    protected _actionState:string;
    protected _lastTargetIndex:number;
    protected _animations:BattlerAnimation[];
    protected _damagePopup:boolean;
    protected _effectType:string;
    protected _motionType:string;
    protected _weaponImageId:number;
    protected _motionRefresh:boolean;
    protected _selected:boolean;

	public constructor();

	public clearAnimations():void;
	public clearDamagePopup():void;
	public clearWeaponAnimation():void;
	public clearEffect():void;
	public clearMotion():void;

	public requestEffect(effectType:string):void;
	public requestMotion(motionType:string):void;
	public requestMotionRefresh():void;

	public select():void;
	public deselect():void;

	public isAnimationRequested():boolean;
	public isDamagePopupRequested():boolean;
	public isEffectRequested():boolean;
	public isMotionRequested():boolean;
	public isWeaponAnimationRequested():boolean;
	public isMotionRefreshRequested():boolean;
	public isSelected():boolean;

	public effectType():string;
	public motionType():string;
	public weaponImageId():number;

	public shiftAnimation():BattlerAnimation;

	public startAnimation(animationId:number, mirror:boolean, delay:number):void;
	public startDamagePopup():void;
	public startWeaponAnimation(weaponImageId:number):void;

	public action(index:number):Game_Action;
	public setAction(index:number, action:Game_Action):void;
	public numActions():number;
	public clearActions():void;

	public result():Game_ActionResult;
	public clearResult():void;

	public refresh():void;

	public addState(stateId:number):void;
	public isStateAddable(stateId:number):boolean;
	public isStateRestrict(stateId:number):void;
	public onRestrict():void;
	public removeState(stateId:number):void;

	public escape():void;

	public addBuff(paramId:number, turns:number):void;
	public addDebuff(paramId:number, turns:number):void;
	public removeBuff(paramId:number):void;
	public removeBattleStates():void;
	public removeAllBuffs():void;
	public removeStatesAuto(timing:number):void;
	public removeBuffsAuto():void;
	public removeStatesByDamage():void;

	public makeActionTimes():number;
	public makeActions():void;

	public speed():number;

	public makeSpeed():number;

	public currentAction():Game_Action;

	public removeCurrentAction():void;

	public setLastTarget(target:Game_Battler):void;

	public forceAction(skillId:number, targetIndex:number):void;

	public useItem(item:Game_Item):void;
	public consumeItem(ite:Game_Item):void;

	public gainHp(value:number):void;
	public gainMp(value:number):void;

	public gainTp(value:number):void;
	public gainSilentTp(value:number):void;
	public initTp():void;
	public clearTp():void;
	public chargeTpByDamage(damageRate:number):void;

	public regenerateHp():void;

	public maxSlipDamage():number;

	public regenerateMp():void;
	public regenerateTp():void;
	public regenerateAll():void;

	public onBattleStart():void;
	public onAllActionsEnd():void;
	public onTurnEnd():void;
	public onBattleEnd():void;
	public onDamage(value:number):void;

	public setActionState(actionState:string):void;

	public isUndecided():boolean;
	public isInputting():boolean;
	public isWaiting():boolean;
	public isActing():boolean;
	public isChanting():boolean;
	public isGuardWaiting():boolean;

	public performActionStart(action:Game_Action):void;
	public performAction(action:Game_Action):void;
	public performActionEnd():void;
	public performDamage():void;
	public performMiss():void;
	public performRecovery():void;
	public performEvasion():void;
	public performMagicEvasion():void;
	public performCounter():void;
	public performReflection():void;
	public performSubstitute(target:Game_Battler):void;
	public performCollapse():void;
}

interface BattlerAnimation
{
	animationId:number;
	mirror:boolean;
	delay:number;
}
//-----------------------------------------------------------------------------
// Game_BattlerBase
//
// The superclass of Game_Battler. It mainly contains parameters calculation.

declare class Game_BattlerBase
{
	public static readonly TRAIT_ELEMENT_RATE:number;
	public static readonly TRAIT_DEBUFF_RATE:number;
	public static readonly TRAIT_STATE_RATE:number;
	public static readonly TRAIT_STATE_RESIST:number
	public static readonly TRAIT_PARAM:number;
	public static readonly TRAIT_XPARAM:number;
	public static readonly TRAIT_SPARAM:number;
	public static readonly TRAIT_ATTACK_ELEMENT:number;
	public static readonly TRAIT_ATTACK_STATE:number;
	public static readonly TRAIT_ATTACK_SPEED:number;
	public static readonly TRAIT_ATTACK_TIMES:number;
	public static readonly TRAIT_STYPE_ADD:number;
	public static readonly TRAIT_STYPE_SEAL:number;
	public static readonly TRAIT_SKILL_ADD:number;
	public static readonly TRAIT_SKILL_SEAL:number;
	public static readonly TRAIT_EQUIP_WTYPE:number;
	public static readonly TRAIT_EQUIP_ATYPE:number;
	public static readonly TRAIT_EQUIP_LOCK:number;
	public static readonly TRAIT_EQUIP_SEAL:number;
	public static readonly TRAIT_SLOT_TYPE:number;
	public static readonly TRAIT_ACTION_PLUS:number;
	public static readonly TRAIT_SPECIAL_FLAG:number;
	public static readonly TRAIT_COLLAPSE_TYPE:number;
	public static readonly TRAIT_PARTY_ABILITY:number;
	public static readonly FLAG_ID_AUTO_BATTLE:number;
	public static readonly FLAG_ID_GUARD:number;
	public static readonly FLAG_ID_SUBSTITUTE:number;
	public static readonly FLAG_ID_PRESERVE_TP:number;
	public static readonly ICON_BUFF_START:number;
	public static readonly ICON_DEBUFF_START:number;

	/** Hit points */
	public hp:number;
	/** Magic points */
	public mp:number;
	/** Tactical points */
	public tp:number;
	/** Max hit points */
	public mhp:number;
	/** Max magic points */
	public mmp:number;
	/** Attack power */
	public atk:number;
	/** Defense Power */
	public def:number;
	/** Magic attackpower */
	public mat:number;
	/** Magic defense power */
	public mdf:number;
	/** Agility */
	public agi:number;
	/** Luck */
	public luk:number;
	/** Hit rate */
	public hit:number;
	/** Evasion rate */
	public eva:number;
	/** Critical rate */
	public cri:number;
	/** Hit points */
	public cev:number;
	/** Magic evasion rate */
	public mev:number;
	/** Magic reflection rate */
	public mrf:number;
	/** Counter-attack rate */
	public cnt:number;
	/** HP regeneration rate */
	public hrg:number;
	/** MP regeneration rate */
	public mrg:number;
	/** TP regeneration rate */
	public trg:number;
	/** Target rate */
	public tgr:number;
	/** Guard effect rate */
	public grd:number;
	/** Recovery effect rate */
	public rec:number;
	/** Pharmacology */
	public pha:number;
	/** MP cost rate */
	public mcr:number;
	/** TP charge rate */
	public tcr:number;
	/** Physical damage rate */
	public pdr:number;
	/** Floor-damage rate */
	public mdr:number;
	/** Floor-damage rate */
	public fdr:number;
	/** Experience rate */
	public exr:number;
	
	protected _hp:number;
	protected _mp:number;
	protected _tp:number;
	protected _hidden:boolean;
	protected _paramPlus:[number,number,number,number,number,number,number,number];
	protected _states:number[];
	protected _stateTurns:{ [n:number]:number };
	protected _buffs:[number,number,number,number,number,number,number,number];
	protected _buffTurns:[number,number,number,number,number,number,number,number];

	public constructor();

	public initMembers():void;
	public clearParamPlus():void;
	public clearStates():void;
	
	public eraseState(stateId:number):void;
	public isStateAffected(stateId:number):boolean;
	public isDeathStateAffected():boolean;

	public deathStateId():number;
	public resetStateCounts(stateId:number):void;
	public isStateExpired(stateId:number):boolean;

	public updateStateTurns():void;

	public clearBuffs():void;
	public eraseBuff(paramId:number):void;
	public buffLength():number;
	public buff(paramId:number):number;
	public isBuffAffected(paramId:number):boolean;
	public isDebuffAffected(paramId:number):boolean;
	public isBuffOrDebuffAffected(paramId:number):boolean;
	public isMaxBuffAffected(paramId:number):boolean;
	public isMaxDebuffAffected(paramId:number):boolean;
	public increaseBuff(paramId:number):void;
	public decreaseBuff(paramId:number):void;
	public overwriteBuffTurns(paramId:number, turns:number):void;
	public isBuffExpired(paramId:number):boolean;
	public updateBuffTurns():void;

	public die():void;
	public revive():void;

	public states():number[];
	public stateIcons():number[];
	public buffIcons():number[];
	public buffIconIndex(buffLevel:number, paramId:number):number;
	public allIcons():number[];

	public traitObjects():number[];
	public allTraits():number[];
	public traits(code:number):number[];
	public traitsWithId(code:number, id:number):number;
	public traitsPi(code:number, id:number):number;
	public traitsSum(code:number, id:number):number;
	public traitsSumAll(code:number):number;
	public traitsSet(code:number):number[];

	public paramBase(paramId:number):number;
	public paramPlus(paramId:number):void;
	public paramMin(paramId:number):void;
	public paramMax(param:number):void;
	public paramRate(param:number):void;
	public paramBuffRate(param:number):void;
	public param(param:number):void;
	public xparam(xparam:number):void;
	public sparam(sparam:number):void;

	public elementRate(elementId:number):void;
	public debuffRate(param:number):void;
	public stateRate(stateId:number):void;

	public stateResistSet():number[];
	public isStateResist(stateId:number):boolean;

	public attackElements():number[];
	public attackStates():number[];
	public attackStatesRate(stateId:number):number;
	public attackSpeed():number;
	public attackTimesAdd():number;

	public addedSkillTypes():number[];
	public isSkillTypeSealed(stypeId:number):boolean;

	public addedSkills():number[];
	public isSkillSealed(skillId:number):boolean;

	public isEquipWtypeOk(wtypeId:number):boolean;
	public isEquipAtypeOk(atypeId:number):boolean;
	public isEquipTypeLocked(etypeId:number):boolean;
	public isEquipTypeSealed(etypeId:number):boolean;

	public slotType():number;

	public isDualWield():boolean;

	public actionPlusSet():number[];

	public specialFlag(flagId:number):boolean;

	public collapseType():number;

	public partyAbility(abilityId:number):boolean;

	public isAutoBattle():boolean;

	public isGuard():boolean;
	public isSubstitute():boolean;
	public isPreserveTp():boolean;

	public addParam(paramId:number, value:number):void;

	public setHp(hp:number):void;
	public setMp(mp:number):void;
	public setTp(tp:number):void;
	public maxTp():number;

	public refresh():void;

	public recoverAll():void;

	public hpRate():number;
	public mpRate():number;
	public tpRate():number;

	public hide():void;
	public appear():void;
	public isHidden():boolean;
	public isAppeared():boolean;

	public isDead():boolean;
	public isAlive():boolean;
	public isDying():boolean;
	public isRestricted():boolean;

	public canInput():boolean;
	public canMove():boolean;

	public isConfused():boolean;
	public confusionLevel():number;

	public isActor():boolean;
	public isEnemy():boolean;

	public index():number;
	public isBattleMember():boolean;
	public isSpriteVisible():boolean;

	public sortStates():void;

	public restriction():number;

	public addNewState(stateId:number):void;

	public onRestrict():void;

	public mostImportantStateText():string;

	public stateMotionIndex():number;
	public stateOverlayIndex():number;

	public isSkillWtypeOk(skill:DataSkill):boolean;
	public skillMpCost(skill:DataSkill):number;
	public skillTpCost(skill:DataSkill):number;
	public canPaySkillCost(skill:DataSkill):boolean;
	public paySkillCost(skill:number):void;

	public isOccasionOk(item:RPG_ItemBase):boolean;

	public meetsUsableItemConditions(item:DataItem):boolean;
	public meetsSkillConditions(skill:DataSkill):boolean;
	public meetsItemConditions(item:RPG_ItemBase):boolean;

	public canUse(item:RPG_ItemBase):boolean;
	public canEquip(item:RPG_ItemBase):boolean;
	public canEquipWeapon(item:RPG_ItemBase):boolean;
	public canEquipArmor(item:RPG_ItemBase):boolean;

	public attackSkillId():number;
	public guardSkillId():number;

	public canAttack():boolean;
	public canGuard():boolean;
}
//-----------------------------------------------------------------------------
// Game_Character
//
// The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.

declare class Game_Character extends Game_CharacterBase
{
	public static readonly ROUTE_END:number;
	public static readonly ROUTE_MOVE_DOWN:number;
	public static readonly ROUTE_MOVE_LEFT:number;
	public static readonly ROUTE_MOVE_RIGHT:number;
	public static readonly ROUTE_MOVE_UP:number;
	public static readonly ROUTE_MOVE_LOWER_L:number;
	public static readonly ROUTE_MOVE_LOWER_R:number;
	public static readonly ROUTE_MOVE_UPPER_L:number;
	public static readonly ROUTE_MOVE_UPPER_R:number;
	public static readonly ROUTE_MOVE_RANDOM:number;
	public static readonly ROUTE_MOVE_TOWARD:number;
	public static readonly ROUTE_MOVE_AWAY:number;
	public static readonly ROUTE_MOVE_FORWARD:number;
	public static readonly ROUTE_MOVE_BACKWARD:number;
	public static readonly ROUTE_JUMP:number;
	public static readonly ROUTE_WAIT:number;
	public static readonly ROUTE_TURN_DOWN:number;
	public static readonly ROUTE_TURN_LEFT:number;
	public static readonly ROUTE_TURN_RIGHT:number;
	public static readonly ROUTE_TURN_UP:number;
	public static readonly ROUTE_TURN_90D_R:number;
	public static readonly ROUTE_TURN_90D_L:number;
	public static readonly ROUTE_TURN_180D:number;
	public static readonly ROUTE_TURN_90D_R_L:number;
	public static readonly ROUTE_TURN_RANDOM:number;
	public static readonly ROUTE_TURN_TOWARD:number;
	public static readonly ROUTE_TURN_AWAY:number;
	public static readonly ROUTE_SWITCH_ON:number;
	public static readonly ROUTE_SWITCH_OFF:number;
	public static readonly ROUTE_CHANGE_SPEED:number;
	public static readonly ROUTE_CHANGE_FREQ:number;
	public static readonly ROUTE_WALK_ANIME_ON:number;
	public static readonly ROUTE_WALK_ANIME_OFF:number;
	public static readonly ROUTE_STEP_ANIME_ON:number;
	public static readonly ROUTE_STEP_ANIME_OFF:number;
	public static readonly ROUTE_DIR_FIX_ON:number;
	public static readonly ROUTE_DIR_FIX_OFF:number;
	public static readonly ROUTE_THROUGH_ON:number;
	public static readonly ROUTE_THROUGH_OFF:number;
	public static readonly ROUTE_TRANSPARENT_ON:number;
	public static readonly ROUTE_TRANSPARENT_OFF:number;
	public static readonly ROUTE_CHANGE_IMAGE:number;
	public static readonly ROUTE_CHANGE_OPACITY:number;
	public static readonly ROUTE_CHANGE_BLEND_MODE:number;
	public static readonly ROUTE_PLAY_SE:number;
	public static readonly ROUTE_SCRIPT:number;

	protected  _moveRouteForcing:boolean;
	protected  _moveRoute:MoveRoute;
	protected  _moveRouteIndex:number;
	protected  _originalMoveRout:MoveRoute;
	protected  _originalMoveRouteIndex:number;
	protected  _waitCount:number;

	public constructor();

	public memorizeMoveRoute():void;
	public restoreMoveRoute():void;
	public isMoveRouteForcing():boolean;
	public setMoveRoute(moveRoute:MoveRoute):void;
	public forceMoveRoute(moveRoute:MoveRoute):void;
	public updateRoutineMove():void;

	public processMoveCommand(command:EventItem):void;

	public deltaXFrom(x:number):number;
	public deltaYFrom(y:number):number;

	public moveRandom():void;
	public moveTowardCharacter(character:Game_Character):void;
	public moveAwayFromCharacter(character:Game_Character):void;

	public turnTowardCharacter(character:Game_Character):void;
	public turnAwayFromCharacter(character:Game_Character):void;
	public turnTowardPlayer():void;
	public turnAwayFromPlayer():void;

	public moveTowardPlayer():void;
	public moveAwayFromPlayer():void;
	public moveForward():void;
	public moveBackward():void;

	public processRouteEnd():void;
	public advanceMoveRouteIndex():void;

	public turnRight90():void;
	public turnLeft90():void;
	public turn180():void;
	public turnRightOrLeft90():void;
	public turnRandom():void;
	public swap(character:Game_Character):void;

	public findDirectionTo(goalX:number, goalY:number):number;
	public searchLimit():number
}
//-----------------------------------------------------------------------------
// Game_CharacterBase
//
// The superclass of Game_Character. It handles basic information, such as
// coordinates and images, shared by all characters.

declare class Game_CharacterBase
{
	protected _x:number;
    protected _y:number;
    protected _realX:number;
    protected _realY:number;
    protected _moveSpeed:number;
    protected _moveFrequency:number;
    protected _opacity:number;
    protected _blendMode:number;
    protected _direction:number;
    protected _pattern:number;
    protected _priorityType:number;
    protected _tileId:number;
    protected _characterName:string;
    protected _characterIndex:number;
    protected _isObjectCharacter:boolean;
    protected _walkAnime:boolean;
    protected _stepAnime:boolean;
    protected _directionFix:boolean;
    protected _through:boolean;
    protected _transparent:boolean;
    protected _bushDepth:number;
    protected _animationId:number;
    protected _balloonId:number;
    protected _animationPlaying:boolean;
    protected _balloonPlaying:boolean;
    protected _animationCount:number;
    protected _stopCount:number;
    protected _jumpCount:number;
    protected _jumpPeak:number;
    protected _movementSuccess:boolean;

	public readonly x:number;
	public readonly y:number;

	public constructor();

	public initMembers():void;

	public pos(x:number, y:number):boolean;
	public posNt(x:number, y:number):boolean;

	public moveSpeed():number;
	public setMoveSpeed(moveSpeed:number):void;

	public moveFrequency():number;
	public setMoveFrequency(moveFrequency:number):void;

	public opacity():number;
	public setOpacity(opacity:number):void;

	public blendMode():number;
	public setBlendMode(blendMode:number):void;

	public isNormalPriority():boolean;
	public setPriorityType(priorityType:number):void;

	public isMoving():boolean;
	public isJumping():boolean;
	public jumpHeight():number;

	public isStopping():boolean;
	public checkStop(threshold:number):boolean;
	public resetStopCount():void;

	public realMoveSpeed():number;

	public distancePerFrame():number;

	public isDashing():boolean;
	public isDebugThrough():boolean;

	public straighten():void;
	public reverseDir(d:Direction):number;

	public canPass(x:number, y:number, d:Direction):boolean;
	public canPassDiagonally(x:number, y:number, horz:Direction, vert:Direction):boolean;
	public isMapPassable(x:number, y:number, d:Direction):boolean;

	public isCollidedWithCharacters(x:number, y:number):boolean;
	public isCollidedWithEvents(x:number, y:number):boolean;
	public isCollidedWithVehicles(x:number, y:number):boolean;

	public setPosition(x:number, y:number):void;
	public copyPosition(character:Game_CharacterBase):void;

	public locate(x:number, y:number):void;

	public direction():Direction;
	public setDirection(d:Direction):void;

	public isTile():boolean;
	public isObjectCharacter():boolean;

	public shiftY():number;
	public scrolledX():number;
	public scrolledY():number;

	public screenX():number;
	public screenY():number;
	public screenZ():number;

	public isNearTheScreen():boolean;

	public update(sceneActive?:boolean):void;
	public updateStop():void;
	public updateJump():void;
	public updateMove():void;
	public updateAnimation():void;

	public animationWait():number;
	public updateAnimationCount():void;
	public updatePattern():void;

	public maxPattern():number;
	public pattern():number;
	public setPattern(pattern:number):void;
	public isOriginalPattern():boolean;
	public resetPattern():void;

	public refreshBushDepth():void;

	public isOnLadder():boolean;
	public isOnBush():boolean;

	public terrainTag():number;
	public regionId():number;

	public increaseSteps():void;
	public tileId():number;

	public characterName():string;
	public characterIndex():number;

	public setImage(characterName:string, characterIndex:number):void;
	public setTileImage(tileId:number):void;

	public checkEventTriggerTouchFront(d:Direction):void;

	public checkEventTriggerTouch(x:number, y:number):boolean;
	public isMovementSucceeded(x:number, y:number):boolean;
	public setMovementSuccess(success:boolean):void;

	public moveStraight(d:Direction):void;
	public moveDiagonally(horz:Direction, vert:Direction):void;

	public jump(xPlus:number, yPlus:number):void;

	public hasWalkAnime():boolean
	public setWalkAnime(walkAnime:boolean):void;
	public hasStepAnime():boolean;
	public setStepAnime(stepAnime:boolean):void;

	public isDirectionFixed():boolean;
	public setDirectionFix(directionFix:boolean):void;

	public isThrough():boolean;
	public setThrough(through:boolean):void;
	public isTransparent():boolean;
	
	public bushDepth():number;

	public setTransparent(transparent:boolean):void;

	public requestAnimation(animationId:number):void;
	public requestBalloon(balloonId:number):void;

	public animationId():number;
	public balloonId():number;

	public startAnimation():void;
	public startBalloon():void;

	public isAnimationPlaying():boolean;
	public isBalloonPlaying():boolean;

	public endAnimation():void;
	public endBalloon():void;
}
//-----------------------------------------------------------------------------
// Game_CommonEvent
//
// The game object class for a common event. It contains functionality for
// running parallel process events.
declare class Game_CommonEvent
{
	protected _commonEventId:number;
	
	public constructor(commonEventId:number);

	public event():DataCommonEvent;
	public list():EventItem[];

	public isActive():boolean;
	public update():void;
	public refresh():void;
}
//-----------------------------------------------------------------------------
// Game_Enemy
//
// The game object class for an enemy.

declare class Game_Enemy extends Game_Battler
{
	protected _enemyId:number;
    protected _letter:string;
    protected _plural:boolean;
    protected _screenX:number;
    protected _screenY:number;

	public constructor(enemyId:number, x:number, y:number);

	public setup(enemyId:number, x:number, y:number):void;

	public friendsUnit():Game_Troop;
	public opponentsUnit():Game_Party;

	public enemyId():number;
	public enemy():DataEnemy;

	public exp():number;
	public gold():number;

	public makeDropItems():RPG_ItemBase[];
	public dropItemRate():number;

	public itemObject(kind:number, dataId:number):RPG_ItemBase;

	public screenX():number;
	public screenY():number;

	public battlerName():string;
	public battlerHue():number;

	public originalName():string;
	public name():string;

	public isLetterEmpty():boolean;
	public setLetter(letter:string):void;
	public setPlural(plural:boolean):void;

	public transform(enemyId:number):void;

	public meetsCondition(action:EnemyAction):boolean;
	public meetsTurnCondition(param1:number, param2:number):boolean;
	public meetsHpCondition(param1:number, param2:number):void;
	public meetsMpCondition(param1:number, param2:number):void;
	public meetsStateCondition(param:number):void;
	public meetsPartyLevelCondition(param:number):void;
	public meetsSwitchCondition(param:number):void;

	public isActionValid(action:EnemyAction):boolean;
	public selectAction(actionList:EnemyAction[], ratingZero:number):EnemyAction;
	public selectAllActions(actionList:EnemyAction[]):void;
}
//-----------------------------------------------------------------------------
// Game_Event
//
// The game object class for an event. It contains functionality for event page
// switching and running parallel process events.

declare class Game_Event extends Game_Character
{
	protected _moveType:number;
	protected _trigger:number;
	protected _starting:boolean;
	protected _erased:boolean;
	protected _pageIndex:number;
	protected _originalPattern:number;
	protected _originalDirection:number;
	protected _prelockDirection:number;
	protected _locked:boolean;
	protected _mapId:number;
	protected _eventId:number;
	
	public constructor(mapId:number, eventId:number);

	public eventId():number;
	public event():MapEvent;

	public page():MapEventPage;
	public list():EventItem[];

	public isCollidedWithCharacters(x:number, y:number):boolean;
	public isCollidedWithEvents(x:number, y:number):boolean;
	public isCollidedWithPlayerCharacters(x:number, y:number):boolean;

	public lock():void;
	public unlock():void;

	public updateStop():void;
	public updateSelfMovement():void;

	public stopCountThreshold():number;

	public moveTypeRandom():void;
	public moveTypeTowardPlayer():void;
	public isNearThePlayer():boolean;

	public moveTypeCustom():void;

	public isStarting():boolean;
	public clearStartingFlag():void;

	public isTriggerIn(triggers:number[]):boolean;

	public start():void;
	public erase():void;
	public refresh():void;

	public findProperPageIndex():number;

	public meetsConditions(page:MapEventPage):boolean;

	public setupPage():void;
	public clearPageSettings():void;
	public setupPageSettings():void;

	public checkEventTriggerAuto():void;

	public updateParallel():void;
}
//-----------------------------------------------------------------------------
// Game_Follower
//
// The game object class for a follower. A follower is an allied character,
// other than the front character, displayed in the party.

declare class Game_Follower extends Game_Character
{
	protected _memberIndex:number;

	public constructor(memberIndex:number);

	public refresh():void;

	public actor():Game_Actor;

	public isVisible():boolean;

	public chaseCharacter(character:Game_Character):void;
}
//-----------------------------------------------------------------------------
// Game_Followers
//
// The wrapper class for a follower array.

declare class Game_Followers
{
	protected _visible:boolean;
	protected _gathering:boolean;
	protected _data:Game_Follower[];

	public constructor();

	public isVisible():boolean;

	public show():void;
	public hide():void;

	public follower(index:number):Game_Follower;

	public forEach(callback:Function, thisObject:Object):void;
	public reverseEach(callback:Function, thisObject:Object):void;

	public refresh():void;
	public update():void;
	public updateMove():void;

	public jumpAll():void;

	public synchronize(x:number, y:number, d:Direction):void;

	public gather():void;
	public areGathering():boolean;

	public visibleFollowers():Game_Follower[];

	public areMoving():boolean;
	public areGathered():boolean;
	public isSomeoneCollided(x:number, y:number):boolean;
}
//-----------------------------------------------------------------------------
// Game_Interpreter
//
// The interpreter for running event commands.

declare class Game_Interpreter
{
	protected _depth:number;
    protected _branch:{ [indent:number]: number};
    protected _params:number[];
    protected _indent:number;
    protected _frameCount:number;
    protected _freezeChecker:number;
	protected _mapId:number;
	protected _eventId:number;
	protected _list:EventItem[];
	protected _index:number;
	protected _waitCount:number;
	protected _waitMode:string;
	protected _comments:string;
	protected _character:Game_Character;
	protected _childInterpreter:Game_Interpreter;
	
	public constructor(depth:number);

	public checkOverflow():void;
	public setup(list:EventItem[], eventId:number):void;

	public eventId():number;
	public isOnCurrentMap():boolean;

	public setupReservedCommonEvent():boolean;

	public isRunning():boolean;
	public update():void;
	public updateChild():boolean;
	public updateWait():boolean;
	public updateWaitCount():boolean;
	public updateWaitMode():boolean;

	public setWaitMode(waitMode:string):void;
	public wait(duration:number):void;

	public fadeSpeed():number;

	public executeCommand():boolean;

	public checkFreeze():boolean;

	public terminate():void;

	public skipBranch():void;

	public currentCommand():EventItem;

	public nextEventCode():number;

	public iterateActorId(actorId:number, callback:(actor:Game_Actor) => void):void;
	public iterateActorEx(fromVariable:number, actorId:number, callback:(actor:Game_Actor) => void):void;
	public iterateActorIndex(index:number, callback:(actor:Game_Actor) => void):void;
	public iterateEnemyIndex(index:number, callback:(actor:Game_Enemy) => void):void;
	public iterateBattler(isActor:number, param2:number, callback:(actor:Game_Battler) => void):void;

	public character(id:number):Game_Character;

	public operateValue(operation:number, operandType:number, operand:number):number;

	public changeHp(target:Game_BattlerBase, value:number, allowDeath:boolean):void;

	// Show Text
	public command101():boolean;

	// Show Choices
	public command102():boolean;
	public setupChoices(params:number[]):void;

	// When [**]
	public command402():boolean;

	// When Cancel
	public command403():boolean;

	// Input Number
	public command103():boolean;
	public setupNumInput(params:[number, number]):void;

	// Select Item
	public command104():boolean;
	public setupItemChoice(params:[number, number]):void;

	// Show Scrolling Text
	public command105():boolean;

	// Comment
	public command108():boolean;

	// Conditional Branch
	public command111():boolean;

	// Else
	public command411():boolean;

	// Loop
	public command112():boolean;

	// Repeat Above
	public command413():boolean;

	// Break Loop
	public command113():boolean;

	// Exit Event Processing
	public command115():boolean;

	// Common Event
	public command117():boolean;
	public setupChild(list:EventItem[], eventId:number):void;

	// Label
	public command118():boolean;

	// Jump to Label
	public command119():boolean;
	public jumpTo(index:number):void;

	// Control Switches
	public command121():boolean;

	// Control Variables
	public command122():boolean;
	public gameDataOperand(type:number, id:number, param?:number):number;
	public operateVariable(variableId:number, operationType:number, value:number):void;

	// Control Self Switch
	public command123():boolean;

	// Control Timer
	public command124():boolean;

	// Change Gold
	public command125():boolean;

	// Change Items
	public command126():boolean;

	// Change Weapons
	public command127():boolean;

	// Change Armors
	public command128():boolean;

	// Change Party Member
	public command129():boolean;

	// Change Battle BGM
	public command132():boolean;

	// Change Victory ME
	public command133():boolean;

	// Change Save Access
	public command134():boolean;

	// Change Menu Access
	public command135():boolean;

	// Change Encounter Disable
	public command136():boolean;

	// Change Formation Access
	public command137():boolean;

	// Change Window Color
	public command138():boolean;

	// Change Defeat ME
	public command139():boolean;

	// Change Vehicle BGM
	public command140():boolean;

	// Transfer Player
	public command201():boolean;

	// Set Vehicle Location
	public command202():boolean;

	// Set Event Location
	public command203():boolean;

	// Scroll Map
	public command204():boolean;

	// Set Movement Route
	public command205():boolean;

	// Getting On and Off Vehicles
	public command206():boolean;

	// Change Transparency
	public command211():boolean;

	// Show Animation
	public command212():boolean;

	// Show Balloon Icon
	public command213():boolean;

	// Erase Event
	public command214():boolean;

	// Change Player Followers
	public command216():boolean;

	// Gather Followers
	public command217():boolean;

	// Fadeout Screen
	public command221():boolean;

	// Fadein Screen
	public command222():boolean;

	// Tint Screen
	public command223():boolean;

	// Flash Screen
	public command224():boolean;

	// Shake Screen
	public command225():boolean;

	// Wait
	public command230():boolean;

	// Show Picture
	public command231():boolean;

	// Move Picture
	public command232():boolean;

	// Rotate Picture
	public command233():boolean;

	// Tint Picture
	public command234():boolean;

	// Erase Picture
	public command235():boolean;

	// Set Weather Effect
	public command236():boolean;

	// Play BGM
	public command241():boolean;

	// Fadeout BGM
	public command242():boolean;

	// Save BGM
	public command243():boolean;

	// Resume BGM
	public command244():boolean;

	// Play BGS
	public command245():boolean;

	// Fadeout BGS
	public command246():boolean;

	// Play ME
	public command249():boolean;

	// Play SE
	public command250():boolean;

	// Stop SE
	public command251():boolean;

	// Play Movie
	public command261():boolean;
	public videoFileExt():string;

	// Change Map Name Display
	public command281():boolean;

	// Change Tileset
	public command282():boolean;

	// Change Battle Back
	public command283():boolean;

	// Change Parallax
	public command284():boolean;

	// Get Location Info
	public command285():boolean;

	// Battle Processing
	public command301():boolean;

	// If Win
	public command601():boolean;

	// If Escape
	public command602():boolean;

	// If Lose
	public command603():boolean;

	// Shop Processing
	public command302():boolean;

	// Name Input Processing
	public command303():boolean;

	// Change HP
	public command311():boolean;

	// Change MP
	public command312():boolean;

	// Change TP
	public command326():boolean;

	// Change State
	public command313():boolean;

	// Recover All
	public command314():boolean;

	// Change EXP
	public command315():boolean;

	// Change Level
	public command316():boolean;

	// Change Parameter
	public command317():boolean;

	// Change Skill
	public command318():boolean;

	// Change Equipment
	public command319():boolean;

	// Change Name
	public command320():boolean;

	// Change Class
	public command321():boolean;

	// Change Actor Images
	public command322():boolean;

	// Change Vehicle Image
	public command323():boolean;

	// Change Nickname
	public command324():boolean;

	// Change Profile
	public command325():boolean;

	// Change Enemy HP
	public command331():boolean;

	// Change Enemy MP
	public command332():boolean;

	// Change Enemy TP
	public command342():boolean;

	// Change Enemy State
	public command333():boolean;

	// Enemy Recover All
	public command334():boolean;

	// Enemy Appear
	public command335():boolean;

	// Enemy Transform
	public command336():boolean;

	// Show Battle Animation
	public command337():boolean;

	// Force Action
	public command339():boolean;

	// Abort Battle
	public command340():boolean;

	// Open Menu Screen
	public command351():boolean;

	// Open Save Screen
	public command352():boolean;

	// Game Over
	public command353():boolean;

	// Return to Title Screen
	public command354():boolean;

	// Script
	public command355():boolean;

	// Plugin Command
	public command356():boolean;
	public pluginCommand(command:string, args:string[]):void;
}
//-----------------------------------------------------------------------------
// Game_Item
//
// The game object class for handling skills, items, weapons, and armor. It is
// required because save data should not include the database object itself.

declare class Game_Item
{
	protected _dataClass:String;
	protected _itemId:number;

	public constructor(item?:RPG_ItemBase);

	public isSkill():boolean;
	public isItem():boolean;
	public isUsableItem():boolean;
	public isWeapon():boolean;
	public isArmor():boolean;
	public isEquipItem():boolean;
	public isNull():boolean;
	
	public itemId():number;
	
	public object():RPG_ItemBase;
	public setObject(item:RPG_ItemBase):void;

	public setEquip(isWeapon:boolean, itemId:number):void;
}
//-----------------------------------------------------------------------------
// Game_Map
//
// The game object class for a map. It contains scrolling and passage
// determination functions.

declare class Game_Map
{
	protected _interpreter:Game_Interpreter;
	protected _mapId:number;
	protected _tilesetId:number;
	protected _events:Game_Event[];
	protected _commonEvents:Game_CommonEvent[];
	protected _vehicles:Game_Vehicle[];
	protected _needsRefresh:boolean;
	protected _displayX:number;
	protected _displayY:number;
	protected _nameDisplay:boolean;
	protected _scrollDirection:number;
	protected _scrollRest:number;
	protected _scrollSpeed:number;
	protected _parallaxName:string;
	protected _parallaxZero:boolean;
	protected _parallaxLoopX:boolean;
	protected _parallaxLoopY:boolean;
	protected _parallaxSx:number;
	protected _parallaxSy:number;
	protected _parallaxX:number;
	protected _parallaxY:number;
	protected _battleback1Name:string;
	protected _battleback2Name:string;

	public constructor();

	public setup(mapId:number):void;

	public isEventRunning():boolean;

	public tileWidth():number;
	public tileHeight():number;

	public mapId():number;
	public tilesetId():number;

	public displayX():number;
	public displayY():number;

	public parallaxName():string;
	public battleback1Name():string;
	public battleback2Name():string;

	public requestRefresh(mapId:number):void;

	public isNameDisplayEnabled():boolean;
	public disableNameDisplay():void;
	public enableNameDisplay():void;

	public createVehicles():void;
	public refereshVehicles():void;
	public vehicles():Game_Vehicle[];
	public vehicle(type:string|number):Game_Vehicle;
	public boat():Game_Vehicle;
	public ship():Game_Vehicle;
	public airship():Game_Vehicle;

	public setupEvents():void;
	public events():Game_Event[];
	public event(eventId:number):Game_Event;
	public eraseEvent(eventId:number):void;
	public parallelCommonEvents():Game_CommonEvent[];

	public setupScroll():void;
	public setupParallax():void;
	public setupBattleback():void;
	public setDisplayPos(x:number, y:number):void;

	public parallaxOx():number;
	public parallaxOy():number;

	public tileset():DataTileset;
	public tilesetFlags():number[];

	public displayName():string;

	public width():number;
	public height():number;

	public data():number[];

	public isLoopHorizontal():boolean;
	public isLoopVertical():boolean;
	public isDashDisabled():boolean;

	public encounterList():number[];
	public encounterStep():number;

	public isOverworld():boolean;

	public screenTileX():number;
	public screenTileY():number;

	public adjustX(x:number):number;
	public adjustY(y:number):number;
	public roundX(x:number):number;
	public roundY(y:number):number;

	public xWithDirection(x:number, d:Direction):number;
	public yWithDirection(y:number, d:Direction):number;
	public roundXWithDirection(x:number, d:Direction):number;
	public roundYWithDirection(y:number, d:Direction):number;

	public deltaX(x1:number, x2:number):number;
	public deltaY(y1:number, y2:number):number;
	public distance(x1:number, y1:number, x2:number, y2:number):number;

	public canvasToMapX(x:number):number;
	public canvasToMapY(y:number):number;

	public autoplay():void;

	public refreshIfNeeded():void;
	public refresh():void;
	public refreshTileEvents():void;

	public eventsXy(x:number, y:number):Game_Event[];
	public eventsXyNt(x:number, y:number):Game_Event[];
	public tileEventsXy(x:number, y:number):Game_Event[];
	public eventIdXy(x:number, y:number):number;

	public scrollDown(distanc:number):void;
	public scrollLeft(distance:number):void;
	public scrollRight(distance:number):void;
	public scrollUp(distance:number):void;

	public isValid(x:number, y:number):boolean;
	public checkPassage(x:number, y:number, bit:number):boolean;

	public tileId(x:number, y:number, z:number):number;
	public layeredTiles(x, y):number[];
	public allTiles(x:number, y:number):number[];

	public autotileType(x:number, y:number, z:number):number;

	public isPassable(x:number, y:number, d:Direction):void;
	public isBoatPassable(x:number, y:number):void;
	public isShipPassable(x:number, y:number):void;
	public isAirshipLandOk(x:number, y:number):void;

	public checkLayeredTilesFlags(x:number, y:number, bit:number):boolean;

	public isLadder(x:number, y:number):boolean;
	public isBush(x:number, y:number):boolean;
	public isCounter(x:number, y:number):boolean;
	public isDamageFloor(x:number, y:number):boolean;

	public terrainTag(x:number, y:number):number;
	public regionId(x:number, y:number):number;

	public update(sceneActive:boolean):void;

	public isScrolling():boolean;
	public startScroll(direction:Direction, distance:number, speed:number):void;
	public updateScroll():void;
	public scrollDistance():number;
	public doScroll(direction:Direction, distance:number):void;

	public updateEvents():void;
	public updateVehicles():void;
	public updateParallax():void;

	public changeTileset(tilesetId:number):void;
	public changeBattleback(battleback1Name:string, battleback2Name:string):void;
	public changeParallax(name:string, loopX:number, loopY:number, sx:number, sy:number):void;

	public updateInterpreter():void;

	public unlockEvent(eventId:number):void;
	public setupStartingEvent():boolean;
	public setupTestEvent():boolean;
	public setupStartingMapEvent():boolean;
	public setupAutorunCommonEvent():boolean;
	public isAnyEventStarting():boolean;
}
//-----------------------------------------------------------------------------
// Game_Message
//
// The game object class for the state of the message window that displays text
// or selections, etc.

declare class Game_Message
{
	protected _texts:string[];
	protected _choices:string[];
	protected _faceName:string;
	protected _faceIndex:number;
	protected _background:MessageBackgroundStyle;
	protected _positionType:VeritcalAlign;
	protected _choiceDefaultType:ChoiceDefaultType;
	protected _choiceCancelType:ChoiceCancelType;
	protected _choiceBackground:MessageBackgroundStyle;
	protected _choicePositionType:HorizontalAlign;
	protected _numInputVariableId:number;
	protected _numInputMaxDigits:number;
	protected _itemChoiceVariableId:number;
	protected _itemChoiceItypeId:number;
	protected _scrollMode:boolean;
	protected _scrollSpeed:number;
	protected _scrollNoFast:boolean;
	protected _choiceCallback:(n:number) => void;

	public constructor();

	public clear():void;

	public choices():string[];

	public faceName():string;
	public faceIndex():number;

	public background():MessageBackgroundStyle;
	public positionType():VeritcalAlign;

	public choiceDefaultType():ChoiceDefaultType;
	public choiceCancelType():ChoiceCancelType;
	public choiceBackground():MessageBackgroundStyle;
	public choicePositionType():HorizontalAlign;

	public numInputVariableId():number;
	public numInputMaxDigits():number;
	public itemChoiceVariableId():number;
	public itemChoiceItypeId():number;

	public scrollMode():boolean;
	public scrollSpeed():number;
	public scrollNoFast():boolean;
	
	public add(text:string):void;
	public hasText():boolean;

	public setFaceImage(faceName:string, faceIndex:number):void;
	public setBackground(background:MessageBackgroundStyle):void;
	public setPositionType(positionType:VeritcalAlign):void;
	public setScroll(speed:number, noFast:boolean):void;

	public isNumberInput():boolean;
	public setNumberInput(variableId:number, maxDigits:number):void;

	public isChoice():boolean;
	public setChoices(choices:string[], defaultType:ChoiceDefaultType, cancelType:ChoiceCancelType):void;
	public setChoiceBackground(background:MessageBackgroundStyle):void;
	public setChoicePositionType(positionType:HorizontalAlign):void;

	public setItemChoice(variableId:number, itemType:number):void;
	public setChoiceCallback(callback:(n:number) => void):void;
	public onChoice(n:number):void;

	public isItemChoice():boolean;

	public isBusy():boolean;

	public newPage():void;

	public allText():string;
}
//-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.

declare class Game_Party extends Game_Unit
{
	public readonly ABILITY_ENCOUNTER_HALF:number;
	public readonly ABILITY_ENCOUNTER_NONE:number;
	public readonly ABILITY_CANCEL_SURPRISE:number;
	public readonly ABILITY_RAISE_PREEMPTIVE:number;
	public readonly ABILITY_GOLD_DOUBLE:number;
	public readonly ABILITY_DROP_ITEM_DOUBLE:number;

	protected _gold:number;
	protected _steps:number;
	protected _lastItem:Game_Item;
	protected _menuActorId:number;
	protected _targetActorId:number;
	protected _actors:Game_Actor[];
	protected _items:{ [n:number]: number };
	protected _weapons:{ [n:number]: number };
	protected _armors:{ [n:number]: number };

	public constructor();

	public initAllItems():void;

	public exists():boolean;
	public size():number;

	public isEmpty():boolean;

	public members():Game_Actor[];
	public allMembers():Game_Actor[];
	public battleMembers():Game_Actor[];

	public maxBattleMembers():number;

	public leader():Game_Actor;

	public reviveBattleMembers():void;

	public items():DataItem[];
	public weapons():DataWeapon[];
	public armors():DataArmor[];

	public equipItems():RPG_EquipBase[];
	public allItems():RPG_ItemBase[];

	public itemContainer(item:RPG_ItemBase):{ [n:number]: number };

	public name():string;

	public setupStartingMembers():void;
	public setupBattleTest():void;
	public setupBattleTestMembers():void;
	public setupBattleTestItems():void;

	public highestLevel():number;

	public addActor(actorId:number):void;
	public removeActor(actorId:number):void;

	public gold():number;
	public gainGold(amount:number):void;
	public loseGold(amount:number):void;
	public maxGold():number;

	public steps():number;
	public increaseSteps():void;

	public numItems(item:RPG_ItemBase):number;
	public maxItems(item:RPG_ItemBase):number;
	public hasMaxItems(item:RPG_ItemBase):boolean;

	public hasItem(item:RPG_ItemBase, includeEquip:boolean):boolean;

	public isAnyMemberEquipped(item:RPG_EquipBase):boolean;

	public gainItem(item:RPG_ItemBase, amount:number, includeEquip:boolean):void;

	public discardMembersEquip(item:RPG_EquipBase, amount:number):void;

	public loseItem(item:RPG_ItemBase, amount:number, includeEquip:boolean):void;
	public consumeItem(item:RPG_ItemBase):void;

	public canUse(item:RPG_ItemBase):boolean;
	public canInput():boolean;
	public isAllDead():boolean;

	public onPlayerWalk():void;

	public menuActor():Game_Actor;
	public setMenuActor(actor:Game_Actor):void;
	public makeMenuActorNext():void;
	public makeMenuActorPrevious():void;

	public targetActor():Game_Actor;
	public setTargetActor(actor:Game_Actor):void;

	public lastItem():RPG_ItemBase;
	public setLastItem(item:RPG_ItemBase):void;

	public swapOrder(index1:number, index2:number):void;

	public charactersForSavefile():[string, number][];
	public facesForSavefile():[string, number][];

	public partyAbility(abilityId:number):boolean;
	public hasEncounterHalf():boolean;
	public hasEncounterNone():boolean;
	public hasCancelSurprise():boolean;
	public hasRaisePreemptive():boolean;
	public hasGoldDouble():boolean;
	public hasDropItemDouble():boolean;

	public ratePreemptive(troopAgi:number):number;
	public rateSurprise(troopAgi:number):number;

	public performVictory():void;
	public performEscape():void;

	public removeBattleStates():void;

	public requestMotionRefresh():void;
}
//-----------------------------------------------------------------------------
// Game_Picture
//
// The game object class for a picture.

declare class Game_Picture
{
	protected _name:string;
	protected _origin:number;
	protected _x:number;
	protected _y:number;
	protected _scaleX:number;
	protected _scaleY:number;
	protected _opacity:number;
	protected _blendMode:number;
	protected _targetX:number;
	protected _targetY:number;
	protected _targetScaleX:number;
	protected _targetScaleY:number;
	protected _targetOpacity:number;
	protected _duration:number;
	protected _tone:number[];
	protected _toneTarget:number[];
	protected _toneDuration:number;
	protected _angle:number;
	protected _rotationSpeed:number;

	public constructor();

	public name():string;
	public origin():number;
	public x():number;
	public y():number;
	public scaleX():number;
	public scaleY():number;
	public opacity():number;
	public blendMode():number;
	public tone():number[];
	public angle():number;

	public initBasic():void;
	public initTarget():void;
	public initTone():void;
	public initRotation():void;

	public show(name:string, origin:number, x:number, y:number, scaleX:number, scaleY:number, opacity:number, blendMode:number):void;
	public move(origin:number, x:number, y:number, scaleX:number, scaleY:number, opacity:number, blendMode:number, duration:number):void;
	public rotate(speed:number):void;
	public tint(tone:number[], duration:number):void;

	public erase():void;

	public update():void;
	public updateMove():void;
	public updateTone():void;
	public updateRotation():void;
}
//-----------------------------------------------------------------------------
// Game_Player
//
// The game object class for the player. It contains event starting
// determinants and map scrolling functions.

declare class Game_Player extends Game_Character
{
	protected _vehicleType:string;
	protected _vehicleGettingOn:boolean;
	protected _vehicleGettingOff:boolean;
	protected _dashing:boolean;
	protected _needsMapReload:boolean;
	protected _transferring:boolean;
	protected _newMapId:number;
	protected _newX:number;
	protected _newY:number;
	protected _newDirection:number;
	protected _fadeType:number;
	protected _followers:Game_Followers;
	protected _encounterCount:number;

	public constructor();

	public clearTransferInfo():void;

	public followers():Game_Followers;

	public refresh():void;

	public reserveTransfer(mapId:number, x:number, y:number, d:Direction, fadeType:number):void;
	public requestMapReload():void;
	public isTransferring():boolean;
	public newMapId():number;
	public fadeType():number;
	public performTransfer():void;

	public vehicle():Game_Vehicle;
	public isInBoat():boolean;
	public isInShip():boolean;
	public isInAirship():boolean;
	public isInVehicle():boolean;
	public isNormal():boolean;

	public centerX():number;
	public centerY():number;
	public center(x:number, y:number):boolean;

	public makeEncounterCount():void;
	public makeEncounterTroopId():number;
	public meetsEncounterConditions(encounter:number):boolean;
	public executeEncounter():boolean;

	public startMapEvent(x:number, y:number, triggers:number[], normal:boolean):void;

	public moveByInput():void;
	public canMove():boolean;
	public getInputDirection():number;
	public executeMove(direction:Direction):void;

	public updateDashing():void;
	public isDashButtonPressed():boolean;

	public updateScroll(lastScrolledX:number, lastScrolledY:number):void;
	public updateVehicle():void;
	public updateVehicleGetOn():void;
	public updateVehicleGetOff():void;
	public updateNonmoving(wasMoving:boolean):void;

	public triggerAction():boolean;
	public triggerButtonAction():boolean;
	public triggerTouchAction():boolean;
	public triggerTouchActionD1(x1:number, y1:number):boolean;
	public triggerTouchActionD2(x2:number, y2:number):boolean;
	public triggerTouchActionD3(x2:number, y2:number):boolean;

	public updateEncounterCount():void;
	public canEncounter():boolean;
	public encounterProgressValue():number;

	public checkEventTriggerHere(triggers:number[]):void;
	public checkEventTriggerThere(triggers:number[]):void;
	public canStartLocalEvents():boolean;

	public getOnOffVehicle():boolean;
	public getOnVehicle():boolean;
	public getOffVehicle():boolean;

	public forceMoveForward():void;

	public isOnDamageFloor():boolean;

	public showFollowers():void;
	public hideFollowers():void;
	public gatherFollowers():void;
	public areFollowersGathering():boolean;
	public areFollowersGathered():boolean;
}
//-----------------------------------------------------------------------------
// Game_Screen
//
// The game object class for screen effect data, such as changes in color tone
// and flashes.

declare class Game_Screen
{
	protected _brightness:number;
	protected _fadeOutDuration:number;
	protected _fadeInDuration:number;
	protected _tone:number[];
	protected _toneTarget:number[];
	protected _toneDuration:number;
	protected _flashColor:number[];
	protected _flashDuration:number;
	protected _shakePower:number;
	protected _shakeSpeed:number;
	protected _shakeDuration:number;
	protected _shakeDirection:number;
	protected _shake:number;
	protected _zoomX:number;
	protected _zoomY:number;
	protected _zoomScale:number;
	protected _zoomScaleTarget:number;
	protected _zoomDuration:number;
	protected _weatherType:string;
	protected _weatherPower:number;
	protected _weatherPowerTarget:number;
	protected _weatherDuration:number;
	protected _pictures:{ [ n:number ]:Game_Picture };

	public constructor();
	public clear():void;

	public onBattleStart():void;

	public brightness():number;
	public tone():number[];

	public flashColor():number[];
	public shake():number;

	public zoomX():number;
	public zoomY():number;
	public zoomScale():number;

	public weatherType():string;
	public weatherPower():number;

	public picture(pictureId:number):Game_Picture;
	public realPictureId(pictureId:number):number;

	public clearFade():void;
	public clearTone():void;
	public clearFlash():void;
	public clearShake():void;
	public clearZoom():void;
	public clearWeather():void;
	public clearPictures():void;
	public eraseBattlePictures():void;

	public maxPictures():number;

	public startFadeOut(duration:number):void;
	public startFadeIn(duration:number):void;
	public startTint(tone:number[], duration:number):void;
	public startFlash(color:number[], duration:number):void;
	public startShake(power:number, speed:number, duration:number):void;

	public startZoom(x:number, y:number, scale:number, duration:number):void;
	public setZoom(x:number, y:number, scale:number):void;

	public changeWeather(type:string, power:number, duration:number):void;

	public update():void;
	public updateFadeOut():void;
	public updateFadeIn():void;
	public updateTone():void;
	public updateFlash():void;
	public updateShake():void;
	public updateZoom():void;
	public updateWeather():void;
	public updatePictures():void;

	public startFlashForDamage():void;

	public showPicture(pictureId:number, name:string, origin:number, x:number, y:number, scaleX:number, scaleY:number, opacity:number, blendMode:number):void;
	public movePicture(pictureId:number, origin:number, x:number, y:number, scaleX:number, scaleY:number, opacity:number, blendMode:number, duration:number):void;
	public rotatePicture(pictureId:number, speed:number):void;
	public tintPicture(pictureId:number, tone:number[], duration:number):void;
	public erasePicture(pictureId:number):void;
}
//-----------------------------------------------------------------------------
// Game_SelfSwitches
//
// The game object class for self switches.

declare class Game_SelfSwitches
{
	protected _data:{ [s:string]:boolean };

	public constructor();

	public clear():void;
	public onChange():void;

	public value(switchId:string):boolean;
	public setValue(switchId:string, value:boolean):void;
}
//-----------------------------------------------------------------------------
// Game_Switches
//
// The game object class for switches.

declare class Game_Switches
{
	protected _data:{ [n:number]:boolean };

	public constructor();

	public clear():void;
	public onChange():void;

	public value(switchId:number):boolean;
	public setValue(switchId:number, value:boolean):void;
}
//-----------------------------------------------------------------------------
// Game_System
//
// The game object class for the system data.

declare class Game_System
{
	protected _saveEnabled:boolean;
	protected _menuEnabled:boolean;
	protected _encounterEnabled:boolean;
	protected _formationEnabled:boolean;
	protected _battleCount:number;
	protected _winCount:number;
	protected _escapeCount:number;
	protected _saveCount:number;
	protected _versionId:number;
	protected _framesOnSave:number;
	protected _bgmOnSave:BGM;
	protected _bgsOnSave:BGS;
	protected _windowTone:number[];
	protected _battleBgm:BGM;
	protected _victoryMe:ME;
	protected _defeatMe:ME;
	protected _savedBgm:BGM;
	protected _walkingBgm:BGM;

	public constructor();

	public isJapanese():boolean;
	public isChinese():boolean;
	public isKorean():boolean;
	public isCJK():boolean;
	public isRussian():boolean;

	public isSideView():boolean;

	public isSaveEnabled():boolean;
	public disableSave():void;
	public enableSave():void;

	public isMenuEnabled():boolean;
	public disableMenu():void;
	public enableMenu():void;

	public isEncounterEnabled():boolean;
	public disableEncounter():void;
	public enableEncounter():void;

	public isFormationEnabled():boolean;
	public disableFormation():void;
	public enableFormation():void;

	public battleCount():number;
	public winCount():number;
	public escapeCount():number;
	public saveCount():number;

	public versionId():number;

	public windowTone():number[];
	public setWindowTone(value:number[]):void;

	public battleBgm():BGM;
	public setBattleBgm(value:BGM):void;

	public victoryMe():ME;
	public setVictoryMe(value:ME):void;

	public defeatMe():ME;
	public setDefeatMe(value:ME):void;

	public onBattleStart():void;
	public onBattleWin():void;
	public onBattleEscape():void;
	public onBeforeSave():void;
	public onAfterLoad():void;

	public playtime():number;
	public playtimeText():string;

	public saveBgm():void;
	public replayBgm():void;

	public saveWalkingBgm():void;
	public replayWalkingBgm():void;
}
//-----------------------------------------------------------------------------
// Game_Temp
//
// The game object class for temporary data that is not included in save data.
declare class Game_Temp
{
	protected _isPlayTest:boolean;
	protected _commonEventId:number;
	protected _destinationX:number;
	protected _destinationY:number;
	protected _isMapTouch:boolean;

	public constructor();

	public isPlaytest():boolean;

	public reserveCommonEvent(commonEventId:number):void;
	public clearCommonEvent():void;
	public isCommonEventReserved():boolean;
	public reservedCommonEvent():DataCommonEvent;

	public setDestination(x:number, y:number):void;
	public clearDestination():void;
	public isDestinationValid():boolean;
	public destinationX():number;
	public destinationY():number;
}
//-----------------------------------------------------------------------------
// Game_Timer
//
// The game object class for the timer.

declare class Game_Timer
{
	protected _frames:number;
	protected _working:boolean;

	public constructor();

	public update(sceneActive:boolean):void;

	public start(count:number):void;
	public stop():void;

	public isWorking():boolean;

	public seconds():number;

	public onExpire():void;
}
//-----------------------------------------------------------------------------
// Game_Troop
//
// The game object class for a troop and the battle-related data.

declare class Game_Troop extends Game_Unit
{
	public readonly LETTER_TABLE_HALF:string[];
	public readonly LETTER_TABLE_FULL:string[];

	protected _interpreter:Game_Interpreter;
	protected _troopId:number;
	protected _eventFlags = {};
	protected _enemies:Game_Enemy[];
	protected _turnCount:number;
	protected _namesCount:{ [s:string]: number };

	public constructor();

	public isEventRunning():boolean;
	public updateInterpreter():void;

	public turnCount():number;

	public clear():void;

	public troop():DataTroop;

	public setup(troopId:number):void;
	public makeUniqueNames():void;
	public letterTable():string[];
	public enemyNames():string[];

	public meetsConditions(page:TroopEventPage):boolean;
	public setupBattleEvent():void;

	public increaseTurn():void;

	public expTotal():number;
	public goldTotal():number;
	public goldRate():number;

	public makeDropItems():DropItem[];
}
//-----------------------------------------------------------------------------
// Game_Unit
//
// The superclass of Game_Party and Game_Troop.

declare class Game_Unit
{
	protected _inBattle:boolean;

	constructor();

	public inBattle():boolean;

	public members():Game_Battler[];

	public aliveMembers():Game_Battler[];
	public deadMembers():Game_Battler[];
	public movableMembers():Game_Battler[];

	public clearActions():void;

	public agility():number;
	public tgrSum():number;

	public randomTarget():Game_Battler;
	public randomDeadTarget():Game_Battler;
	public smoothTarget(index:number):Game_Battler;
	public smoothDeadTarget(index:number):Game_Battler;

	public clearResults():void;

	public onBattleStart():void;
	public onBattleEnd():void;

	public makeActions():void;

	public select(activeMember:Game_Battler):void;

	public isAllDead():boolean;

	public substituteBattler():Game_Battler;
}
//-----------------------------------------------------------------------------
// Game_Variables
//
// The game object class for variables.

declare class Game_Variables
{
	protected _data:{ [n:number]:number };

	public constructor();

	public clear():void;
	public onChange():void;

	public value(variableId:number):number;
	public setValue(variableId:number, value:number):void;
}
//-----------------------------------------------------------------------------
// Game_Vehicle
//
// The game object class for a vehicle.

declare class Game_Vehicle extends Game_Character
{
    protected _type:string;
    protected _mapId:number;
    protected _altitude:number;
    protected _driving:boolean;
    protected _bgm:BGM;

	public constructor(type:string);

	public isBoat():boolean;
	public isShip():boolean;
	public isAirship():boolean;

	public resetDirection():void;
	public initMoveSpeed():void;

	public vehicle():DataVehicle;

	public loadSystemSettings():void;
	public refresh():void;

	public setLocation(mapId:number, x:number, y:number):void;

	public getOn():void;
	public getOff():void;

	public setBgm(bgm:BGM):void;
	public playBgm():void;

	public syncWithPlayer():void;

	public shadowX():number;
	public shadowY():number;
	public shadowOpacity():number;

	public canMove():boolean;

	public updateAirship():void;
	public updateAirshipAltitude():void;
	public maxAltitude():number;

	public isLowest():boolean;
	public isHighest():boolean;
	public isTakeoffOk():boolean;
	public isLandOk(x:number, y:number, d:Direction):void;
}
//-----------------------------------------------------------------------------
// Scene_Base
//
// The superclass of all scenes within the game.
declare class Scene_Base extends Stage
{
	protected _active:boolean;
	protected _fadeSign:number;
	protected _fadeDuration:number;
	protected _fadeSprite:Sprite;
	
	public create():void;
	public isActive():boolean;
	public isReady():boolean;
	public start():void;
	public update():void;
	public stop():void;
	public isBusy():boolean;
	public terminate():void;
	public createWindowLayer():void;
	public addWindow(window:Window):void;
	public startFadeIn(duration:number, white:boolean):void;
	public startFadeOut(duration:number, white:boolean):void;
	public createFadeSprite(white:boolean):void;
	public updateFade():void;
	public updateChildren():void;
	public popScene():void;
	public checkGameover():void;
	public fadeOutAll():void;
	public fadeSpeed():number;
	public slowFadeSpeed():number;
}
//-----------------------------------------------------------------------------
// Scene_Battle
//
// The scene class of the battle screen.
declare class Scene_Battle extends Scene_Base
{
	protected _statusWindow:Window_BattleStatus;
	protected _partyCommandWindow:Window_BattlePartyCommand;
	protected _actorCommandWindow:Window_BattleActorCommand;
	protected _logWindow:Window_BattleLog;
	protected _helpWindow:Window_Help;
	protected _skillWindow:Window_BattleSkill;
	protected _itemWindow:Window_BattleItem;
	protected _actorWindow:Window_BattleActor;
	protected _enemyWindow:Window_BattleEnemy;
	protected _messageWindow:Window_Message;
	protected _scrollTextWindow:Window_ScrollText;
	
	protected _spriteset:Spriteset_Battle;
	
	public item():RPG_ItemBase;
	public updateBattleProcess():void;
	public isAnyInputWindowActive():boolean;
	public changeInputWindow():void;
	public needsSlowFadeOut():boolean;
	public updateStatusWindow():void;
	public updateWindowPositions():void;
	public createDisplayObjects():void;
	public createSpriteset():void;
	public createAllWindows():void;
	public createLogWindow():void;
	public createStatusWindow():void;
	public createPartyCommandWindow():void;
	public createActorCommandWindow():void;
	public createHelpWindow():void;
	public createSkillWindow():void;
	public createItemWindow():void;
	public createActorWindow():void;
	public createEnemyWindow():void;
	public createMessageWindow():void;
	public createScrolltextWindow():void;
	public refreshStatus():void;
	public startPartyCommandSelection():void;
	public commandFight():void;
	public commandEscape():void;
	public commandGuard():void;
	public startActorCommandSelection():void;
	public commandAttack():void;
	public commandSkill():void;
	public commandGuard():void;
	public commandItem():void;
	public selectNextCommand():void;
	public selectPreviousCommand():void;
	public selectActorSelection():void;
	public onActorOk():void;
	public onActorCancel():void;
	public selectEnemySelection():void;
	public onEnemyOk():void;
	public onEnemyCancel():void;
	public onSkillOk():void;
	public onSkillCancel():void;
	public onItemOk():void;
	public onItemCancel():void;
	public onSelectAction():void;
	public endCommandSelection():void;
}
//-----------------------------------------------------------------------------
// Scene_Boot
//
// The scene class for initializing the entire game.
declare class Scene_Boot extends Scene_Base
{
	protected _startDate:Date;
	
	public loadSystemImages():void;
	public isGameFontLoaded():boolean;
	public updateDocumentTitle():void;
	public checkPlayerLocation():void;
}

declare class Scene_Debug extends Scene_MenuBase
{
	protected _rangeWindow:Window_DebugRange;
	protected _editWindow:Window_DebugEdit;
	protected _debugHelpWindow:Window_Base;
	
	public createRangeWindow():void;
	public createEditWindow():void;
	public createDebugHelpWindow():void;
	public onRangeOk():void;
	public onEditCancel():void;
	public refreshHelpWindow():void;
	public helpText():string;
}
//-----------------------------------------------------------------------------
// Scene_Equip
//
// The scene class of the equipment screen.
declare class Scene_Equip extends Scene_MenuBase
{
	protected _statusWindow:Window_EquipStatus;
	protected _commandWindow:Window_EquipCommand;
	protected _slotWindow:Window_EquipSlot;
	protected _itemWindow:Window_EquipItem;
	
	public createStatusWindow():void;
	public createCommandWindow():void;
	public createSlotWindow():void;
	public createItemWindow():void;
	public refreshActor():void;
	public commandEquip():void;
	public commandOptimize():void;
	public commandClear():void;
	public item():RPG_ItemBase;
	public onSlotOk():void;
	public onSlotCancel():void;
	public onItemOk():void;
	public onItemCancel():void;
}
//-----------------------------------------------------------------------------
// Scene_File
//
// The superclass of Scene_Save and Scene_Load.
declare class Scene_File extends Scene_MenuBase
{
	protected _helpWindow:Window_Help;
	protected _listWindow:Window_SavefileList;
	
	public savefileId():number;
	public createHelpWindow():void;
	public createListWindow():void;
	public mode():string;
	public activateListWindow():void;
	public helpWindowText():string;
	public firstSavefileIndex():number;
	public onSavefileOk():void;
}
//-----------------------------------------------------------------------------
// Scene_GameEnd
//
// The scene class of the game end screen.
declare class Scene_GameEnd extends Scene_MenuBase
{
	protected _commandWindow:Window_GameEnd;
	
	public createBackground():void;
	public createCommandWindow():void;
	public commandToTitle():void;
}
//-----------------------------------------------------------------------------
// Scene_Gameover
//
// The scene class of the game over screen.
declare class Scene_Gameover extends Scene_Base
{
	protected _backSprite:Sprite;
	
	public playGameoverMusic():void;
	public createBackground():void;
	public isTriggered():boolean;
	public gotoTitle():void;
}
//-----------------------------------------------------------------------------
// Scene_Item
//
// The scene class of the item screen.
declare class Scene_Item extends Scene_ItemBase
{
	protected _categoryWindow:Window_ItemCategory;
	protected _itemWindow:Window_ItemList;
	
	public createCategoryWindow():void;
	public createItemWindow():void;
	public onCategoryOk():void;
	public onItemOk():void;
	public onItemCancel():void;
	public playSeForItem():void;
}
//-----------------------------------------------------------------------------
// Scene_ItemBase
//
// The superclass of Scene_Item and Scene_Skill.
declare class Scene_ItemBase extends Scene_MenuBase
{
	protected _actorWindow:Window_MenuActor;
	
	public user():Game_Actor;
	public isCursorLeft():boolean;
	public showSubWindow(window:Window):void;
	public hideSubWindow(window:Window):void;
	public onActorOk():void;
	public onActorCancel():void;
	public determineItem():void;
	public useItem():void;
	public activateItemWindow():void;
	public itemTargetActors():number[];
	public canUse():boolean;
	public isItemEffectsValid():boolean;
	public applyItem():void;
	public checkCommonEvent():void;
}
//-----------------------------------------------------------------------------
// Scene_Load
//
// The scene class of the load screen.
declare class Scene_Load extends Scene_File
{
	protected _loadSuccess: boolean;
	
	public onLoadSuccess(): void;
	public onLoadFailure(): void;
	public reloadMapIfUpdated(): void;
}
//-----------------------------------------------------------------------------
// Scene_Map
//
// The scene class of the map screen.
declare class Scene_Map extends Scene_Base
{
	protected _waitCount:number;
	protected _encounterEffectDuration:number;
	protected _mapLoaded:boolean;
	protected _touchCount:number;
	protected _transfer:boolean;
	
	public onMapLoaded():void;
	public updateMainMultiply():void;
	public updateMain():void;
	public needFadeIn():boolean;
	public needsSlowFadeOut():boolean;
	public updateWaitCount():boolean;
	public updateDestination():void;
	public isMapTouchOk():boolean;
	public processMapTouch():void;
	public isSceneChangeOk():boolean;
	public updateScene():void;
	public createDisplayObjects():void;
	public createSpriteset():void;
	public createAllWindows():void;
	public createMapNameWindow():void;
	public createMessageWindow():void;
	public createScrollTextWindow():void;
	public updateTransferPlayer():void;
	public updateEncounter():void;
	public updateCallMenu():void;
	public isMenuEnabled():boolean;
	public isMenuCalled():boolean;
	public callMenu():void;
	public updateCallDebug():void;
	public isDebugCalled():boolean;
	public fadeInForTransfer():void;
	public fadeOutForTransfer():void;
	public launchBattle():void;
	public stopAudioOnBattleStart():void;
	public startEncounterEffect():void;
	public updateEncounterEffect():void;
	public snapForBattleBackground():void;
	public startFlashForEncounter():void;
	public encounterEffectSpeed():number;
}
//-----------------------------------------------------------------------------
// Scene_Menu
//
// The scene class of the menu screen.
declare class Scene_Menu extends Scene_MenuBase
{
	protected _commandWindow:Window_MenuCommand;
	protected _goldWindow:Window_Gold;
	protected _statusWindow:Window_MenuStatus;
	
	public createCommandWindow():void;
	public createGoldWindow():void;
	public createStatusWindow():void;
	public commandItem():void;
	public commandPersonal():void;
	public commandFormation():void;
	public commandOptions():void;
	public commandSave():void;
	public commandEndGame():void;
	public onPersonalOk():void;
	public onPersonalCancel():void;
	public onFormationOk():void;
	public onFormationCancel():void;
}
//-----------------------------------------------------------------------------
// Scene_MenuBase
//
// The superclass of all the menu-type scenes.
declare class Scene_MenuBase extends Scene_Base
{
	protected _actor:Game_Actor;
	
	public actor():Game_Actor;
	public updateActor():void;
	public createBackground():void;
	public setBackgroundOpacity():void;
	public createHelpWindow():void;
	public nextActor():void;
	public previousActor():void;
	public onActorChange():void;
}
//-----------------------------------------------------------------------------
// Scene_Name
//
// The scene class of the name input screen.
declare class Scene_Name extends Scene_MenuBase
{
	protected _actorId:number;
	protected _actor:Game_Actor;
	protected _maxLength:number;
	protected _editWindow:Window_NameEdit;
	protected _inputWindow:Window_NameInput;
	
	public prepare():void;
	public createEditWindow():void;
	public createInputWindow():void;
	public onInputOk():void;
}
//-----------------------------------------------------------------------------
// Scene_Options
//
// The scene class of the options screen.
declare class Scene_Options extends Scene_MenuBase
{
	protected _optionsWindow:Window_Options;
	
	public createOptionsWindow():void;
}
//-----------------------------------------------------------------------------
// Scene_Save
//
// The scene class of the save screen.
declare class Scene_Save extends Scene_File
{
	public onSaveSuccess():void;
	public onSaveFailure():void;
}
//-----------------------------------------------------------------------------
// Scene_Shop
//
// The scene class of the shop screen.
declare class Scene_Shop extends Scene_MenuBase
{
	protected _goods:[number, number][];
	protected _purchaseOnly:boolean;
	protected _item:RPG_ItemBase;
	protected _goldWindow:Window_Gold;
	protected _dummyWindow:Window_Base;
	protected _commandWindow:Window_ShopCommand;
	protected _numberWindow:Window_ShopNumber;
	protected _statusWindow:Window_ShopStatus;
	protected _buyWindow:Window_ShopBuy;
	protected _sellWindow:Window_ShopSell;
	protected _categoryWindow:Window_ItemCategory;
	
	public prepare(goods:[number, number][], purchaseOnly:boolean):void;
	public createGoldWindow():void;
	public createCommandWindow():void;
	public createDummyWindow():void;
	public createNumberWindow():void;
	public createStatusWindow():void;
	public createBuyWindow():void;
	public createSellWindow():void;
	public createCategoryWindow():void;
	public activateBuyWindow():void;
	public activateSellWindow():void;
	public commandBuy():void;
	public commandSell():void;
	public onBuyOk():void;
	public onBuyCancel():void;
	public onCategoryOk():void;
	public onCategoryCancel():void;
	public onSellOk():void;
	public onSellCancel():void;
	public onNumberOk():void;
	public onNumberCancel():void;
	public doBuy():void;
	public doSell():void;
	public endNumberInput():void;
	public maxBuy():number;
	public maxSell():number;
	public money():number;
	public currencyUnit():string;
	public buyingPrice():number;
	public sellingPrice():number;
}
//-----------------------------------------------------------------------------
// Scene_Skill
//
// The scene class of the skill screen.
declare class Scene_Skill extends Scene_ItemBase
{
	protected _statusWindow:Window_SkillStatus;
	protected _itemWindow:Window_SkillList;
	protected _skillTypeWindow:Window_SkillType;
	
	public createSkillTypeWindow():void;
	public createStatusWindow():void;
	public createItemWindow():void;
	public refreshActor():void;
	public commandSkill():void;
	public item():RPG_ItemBase;
	public onItemOk():void;
	public onItemCancel():void;
	public playSeForItem():void;
}
//-----------------------------------------------------------------------------
// Scene_Status
//
// The scene class of the status screen.
declare class Scene_Status extends Scene_MenuBase
{
	private _statusWindow:Window_Status;
	
	public refreshActor():void;
	public onActorChange():void;
}
//-----------------------------------------------------------------------------
// Scene_Title
//
// The scene class of the title screen.
declare class Scene_Title extends Scene_Base
{
	protected _commandWindow:Window_TitleCommand;

	public createBackground():void;
	public createForeground():void;
	public drawGameTitle():void;
	public centerSprite():void;
	public createCommandWindow():void;
	public commandNewGame():void;
	public commandContinue():void;
	public commandOptions():void;
	public playTitleMusic():void;
}
//-----------------------------------------------------------------------------
// Spriteset_Base
//
// The superclass of Spriteset_Map and Spriteset_Battle.

declare class Spriteset_Base extends Sprite
{
	public createLowerLayer():void;
	public createUpperLayer():void;
	public createBaseSprite():void;
	public createToneChanger():void;
	public createWebGLToneChanger():void;
	public createCanvasToneChanger():void;
	public createPictures():void;
	public createTimer():void;
	public createScreenSprites():void;

	public updateScreenSprites():void;
	public updateToneChanger():void;
	public updateWebGLToneChanger():void;
	public updateCanvasToneChanger():void;
	public updatePosition():void;
}
//-----------------------------------------------------------------------------
// Spriteset_Battle
//
// The set of sprites on the battle screen.

declare class Spriteset_Battle extends Spriteset_Base
{
	protected _battlebackLocated:boolean;
	
	public createBackground():void;
	public createBattleField():void;

	public createBattleback():void;

	public updateBattleback():void;

	public locateBattleback():void;

	public battleback1Bitmap():Bitmap;
	public battleback2Bitmap():Bitmap;

	public battleback1Name():string;
	public battleback2Name():string;
	public overworldBattleback1Name():string;
	public overworldBattleback2Name():string;
	public normalBattleback1Name():string;
	public normalBattleback2Name():string;
	public terrainBattleback1Name(type:number):string;
	public terrainBattleback2Name(type:number):string;

	public defaultBattleback1Name():string;
	public defaultBattleback2Name():string;
	public shipBattleback1Name():string;
	public shipBattleback2Name():string;

	public autotileType(z:number):number;

	public createEnemies():void;
	public compareEnemySprite(a:number, b:number):number;

	public createActors():void;
	public updateActors():void;

	public battlerSprites():Sprite_Battler[];

	public isAnimationPlaying():boolean;
	public isEffecting():boolean;
	public isAnyoneMoving():boolean;
	public isBusy():boolean;
}
//-----------------------------------------------------------------------------
// Spriteset_Map
//
// The set of sprites on the map screen.

declare class Spriteset_Map extends Spriteset_Base
{
	public hideCharacters():void;

	public loadTileset():void;

	public createParallax():void;
	public createTilemap():void;
	public createCharacters():void;
	public createShadow():void;
	public createDestination():void;
	public createWeather():void;

	public updateTileset():void;
	public updateParallax():void;
	public updateTilemap():void;
	public updateShadow():void;
	public updateWeather():void;

	/*
	* Simple fix for canvas parallax issue, destroy old parallax and readd to  the tree.
	*/
	protected _canvasReAddParallax():void;
}
//-----------------------------------------------------------------------------
// Sprite_Actor
//
// The sprite for displaying an actor.
declare class Sprite_Actor extends Sprite_Battler
{
	public static readonly MOTIONS:{ [state:string]: ActorMotion }

    protected _motion:ActorMotion;
    protected _motionCount:number;
    protected _pattern:number;	
    protected _effectTarget:Sprite_Base;	
    protected _mainSprite:Sprite_Base;	
    protected _shadowSprite:Sprite;	
    protected _weaponSprite:Sprite_Weapon;	
    protected _stateSprite:Sprite_StateOverlay;

	public moveToStartPosition():void;
	public setActorHome(index:number):void;

	public updateShadow():void;
	public updateTargetPosition():void;

	public setupMotion():void;
	public startMotion():void;
	public updateMotion():void;
	public updateMotionCount():void;
	public motionSpeed():number;
	public refreshMotion():void;
	public startEntryMotion():void;

	public stepForward():void;
	public stepBack():void;
	public retreat():void;
	public setupWeaponAnimation():void;
}

declare class ActorMotion
{
	index:number;
	loop:boolean;
}
//-----------------------------------------------------------------------------
// Sprite_Animation
//
// The sprite for displaying an animation.
declare class Sprite_Animation extends Sprite
{
	/**
	 * { DataAnimation: boolean }
	 */
	protected static _checker1:{};
	protected static _checker2:{};

	protected _target:Sprite_Base;
	protected _reduceArtifacts:boolean;
    protected _animation:DataAnimation;
    protected _mirror:boolean;
    protected _delay:number;
    protected _rate:number;
    protected _duration:number;
    protected _flashColor:[number, number, number, number];
    protected _flashDuration:number;
    protected _screenFlashDuration:number;
    protected _hidingDuration:number;
    protected _bitmap1:Bitmap;
    protected _bitmap2:Bitmap;
    protected _cellSprites:Sprite[];
    protected _screenFlashSprite:ScreenSprite;
    protected _duplicated:boolean;

	public remove():void;

	public setupRate():void;
	public setupDuration():void;

	public updateMain():void;
	public updateFlash():void;
	public updateScreenFlash():void;
	public updateHiding():void;
	public updatePosition():void;
	public updateFrame():void;
	public updateAllCellSprites():void;
	public updateCellSprite():void;

	public absoluteX():number;
	public absoluteY():number;

	public isPlaying():boolean;
	public isReady():boolean;
	public currentFrameIndex():number;
	public loadBitmaps():void;

	public createSprites():void;
	public createCellSprites():void;
	public createScreenFlashSprite():void;

	public processTimingData():void;
	
	public startFlash(color:[number, number, number, number], duration:number):void;
	public startScreenFlash(color:[number, number, number, number], duration:number):void;
	public startHiding(duration:number):void;
}

//-----------------------------------------------------------------------------
// Sprite_Balloon
//
// The sprite for displaying a balloon icon.

declare class Sprite_Balloon extends Sprite_Base
{
    protected _balloonId:number;
    protected _duration:number;

	public loadBitmap():void;

	public setup(balloonId:number):void;

	public updateFrame():void;

	public speed():number;
	public waitTime():number;

	public frameIndex():number;

	public isPlaying():boolean;
}
//-----------------------------------------------------------------------------
// Sprite_Base
//
// The sprite class with a feature which displays animations.
declare class Sprite_Base extends Sprite
{
	protected _animationSprites:Sprite_Animation[];
    protected _effectTarget:Sprite_Base;
    protected _hiding:boolean;

	public show():void;
	public show():void;
	public updateVisibility():void;

	public updateAnimationSprites():void;
	public startAnimation():void;
	public isAnimationPlaying():boolean;
}

//-----------------------------------------------------------------------------
// Sprite_Battler
//
// The superclass of Sprite_Actor and Sprite_Enemy.
declare class Sprite_Battler extends Sprite_Base
{
	protected _battler:Game_Battler;
	protected _battlerName:string;
    protected _damages:Sprite_Damage[];
    protected _homeX:number;
    protected _homeY:number;
    protected _offsetX:number;
    protected _offsetY:number;
    protected _targetOffsetX:number;
    protected _targetOffsetY:number;
    protected _movementDuration:number;
    protected _selectionEffectCount:number;

	public setBattler<T extends Game_Battler>(battler:T):void;
	public setHome(x:number, y:number):void;

	public updateMain():void;
	public updateBitmap():void;
	public updateFrame():void;
	public updateMove():void;
	public updatePosition():void;
	public updateDamagePopup():void;
	public updateSelectionEffect():void;

	public setupDamagePopup():void;
	public damageOffsetX():number;
	public damageOffsetY():number;

	public startMove():void;
	public onMoveEnd():void;
	public isEffecting():boolean;
	public isMoving():boolean;
	public inHomePosition():boolean;
}

//-----------------------------------------------------------------------------
// Sprite_Button
//
// The sprite for displaying a button.
declare class Sprite_Button extends Sprite
{
	protected _touching:boolean;
    protected _coldFrame:Rectangle;
    protected _hotFrame:Rectangle;
    protected _clickHandler:() => void;

	public updateFrame():void;
	public setColdFrame(x:number, y:number, width:number, hieght:number):void;
	public setHotFrame(x:number, y:number, width:number, hieght:number):void;

	public setClickHandler(callback:() => void):void;
	public callClickHandler():void;
	public processTouch():void;

	public isActive():boolean;
	public isButtonTouched():boolean;

	public canvasToLocalX(x:number):number;
	public canvasToLocalY(y:number):number;
}

//-----------------------------------------------------------------------------
// Sprite_Character
//
// The sprite for displaying a character.
declare class Sprite_Character extends Sprite_Base
{
    protected _character:Game_Character;
    protected _balloonDuration:number;
    protected _tilesetId:number;
    protected _upperBody:Sprite;
    protected _lowerBody:Sprite;

	public setCharacter(character:Game_Character):void;

	public isTile():boolean;
	public tilesetBitmap(tileId:number):Bitmap;
	public updateBitmap():void;

	public isImageChanged():boolean;
	public setTileBitmap():void;
	public setCharacterBitmap():void;

	public updateFrame():void;
	public updateTileFrame():void;
	public updateCharacterFrame():void;

	public characterBlockX():number;
	public characterBlockY():number;
	public characterPatternX():number;
	public characterPatternY():number;
	public patternWidth():number;
	public patternHeight():number;

	public updateHalfBodySprites():void;
	public createHalfBodySprites():void;

	public updatePosition():void;
	public updateAnimation():void;
	public updateOther():void;

	public setupAnimation():void;

	public setupBalloon():void;
	public updateBalloon():void;
	public endBalloon():void;
	public isBalloonPlaying():boolean;
}

//-----------------------------------------------------------------------------
// Sprite_Damage
//
// The sprite for displaying a popup damage.
declare class Sprite_Damage extends Sprite
{
	protected _duration:number;
    protected _flashColor:[number, number, number, number];
    protected _flashDuration:number;
    protected _damageBitmap:Bitmap;

	public setup(target:Game_Battler):void;
	public setupCriticalEffect():void;

	public digitWidth():number;
	public digitHeight():number;

	public createMiss():void;
	public createDigits(baseRow:number, value:number):void;
	public createChildSprite():Sprite;

	public updateChild():void;
	public updateFlash():void;
	public updateOpacity():void;

	public isPlaying():boolean;
}
//-----------------------------------------------------------------------------
// Sprite_Destination
//
// The sprite for displaying the destination place of the touch input.

declare class Sprite_Destination extends Sprite
{
    protected _frameCount:number;

	public update():void;

	public createBitmap():void;

	public updatePosition():void;
	public updateAnimation():void;
}
//-----------------------------------------------------------------------------
// Sprite_Enemy
//
// The sprite for displaying an enemy.
declare class Sprite_Enemy extends Sprite_Battler
{
	protected _enemy:Game_Enemy;
    protected _appeared:boolean;
    protected _battlerHue:number;
    protected _effectType:string;
    protected _effectDuration:number;
    protected _shake:number;
    protected _stateIconSprite:Sprite_StateIcon;

	public setBattler(battler:Game_Enemy):void;
	public loadBitmap():void;
	public initVisibility():void;

	public setupEffect():void;
	public startEffect(effectType:string):void;
	public updateEffect():void;
	public revertToNormal():void;

	public startAppear():void;
	public startDisappear():void;
	public startWhiten():void;
	public startBlink():void;
	public startCollapse():void;
	public startBossCollapse():void;
	public startInstantCollapse():void;

	public updateWhiten():void;
	public updateBlink():void;
	public updateAppear():void;
	public updateDisappear():void;
	public updateCollapse():void;
	public updateBossCollapse():void;
	public updateInstantCollapse():void;
}

//-----------------------------------------------------------------------------
// Sprite_Picture
//
// The sprite for displaying a picture.

declare class Sprite_Picture extends Sprite
{
    protected _pictureId:number;
    protected _pictureName:string;
    protected _isPicture:boolean;

	public constructor(pictureId:number);

	public picture():Game_Picture;

	public update():void;
	public updateBitmap():void;
	public updateOrigin():void;
	public updatePosition():void;
	public updateScale():void;
	public updateTone():void;
	public updateOther():void;

	public loadBitmap():void;
}
//-----------------------------------------------------------------------------
// Sprite_StateIcon
//
// The sprite for displaying state icons.
declare class Sprite_StateIcon extends Sprite
{
	protected static _iconWidth:number;
	protected static _iconHeight:number;

	protected _battler:Game_Battler;
    protected _iconIndex:number;
    protected _animationCount:number;
    protected _animationIndex:number;

	public initMembers():void;
	public loadBitmap():void;

	public setup(battler:Game_Battler):void;

	public animationWait():number;

	public updateIcon():void;
	public updateFrame():void;
}
//-----------------------------------------------------------------------------
// Sprite_StateOverlay
//
// The sprite for displaying an overlay image for a state.
declare class Sprite_StateOverlay extends Sprite_Base
{

	protected _battler:Game_Battler;
    protected _overlayIndex:number;
    protected _animationCount:number;
    protected _pattern:number;

	public initMembers():void;
	public loadBitmap():void;

	public setup(battler:Game_Battler):void;

	public animationWait():number;

	public updatePattern():void;
	public updateFrame():void;
}
//-----------------------------------------------------------------------------
// Sprite_Timer
//
// The sprite for displaying the timer.

declare class Sprite_Timer extends Sprite
{
	protected _seconds:number;

	public createBitmap():void;

	public update():void;
	public updateBitmap():void;

	public redraw():void;

	public timerText():string;

	public updatePosition():void;
	public updateVisibility():void;
}
//-----------------------------------------------------------------------------
// Sprite_Weapon
//
// The sprite for displaying a weapon image for attacking.
declare class Sprite_Weapon extends Sprite_Base
{
    protected _weaponImageId:number;
    protected _animationCount:number;
    protected _pattern:number;

	public initMembers():void;
	public loadBitmap():void;

	public setup(weaponImageId:number):void;

	public animationWait():number;
	public isPlaying():boolean;

	public updatePattern():void;
	public updateFrame():void;
}
//-----------------------------------------------------------------------------
// Window_ActorCommand
//
// The window for selecting an actor's action on the battle screen.

declare class Window_ActorCommand extends Window_Command
{
	public openness:number;

	protected _actor:Game_Actor;
	
	public constructor();

	public addAttackCommand():void;
	public addSkillCommands():void;
	public addGuardCommand():void;
	public addItemCommand():void;

	public setup(actor:Game_Actor):void;

	public selectLast():void;
}
//-----------------------------------------------------------------------------
// Window_Base
//
// The superclass of all windows within the game.

declare class Window_Base extends Window
{
	protected static readonly _iconWidth:number;
	protected static readonly _iconHeight:number;
	protected static readonly _faceWidth:number;
	protected static readonly _faceHeight:number;

    protected _opening:boolean;
    protected _closing:boolean;
    protected _dimmerSprite:Sprite;

	public constructor(x:number, y:number, width:number, height:number);

	public lineHeight():number;

	public standardFontFace():string;
	public standardFontSize():number;

	public standardPadding():number;
	public textPadding():number;

	public standardBackOpacity():number;
	public loadWindowskin():void;

	public updatePadding():void;
	public updateBackOpacity():void;

	public contentsWidth():number;
	public contentsHeight():number;
	public fittingHeight(numLines:number):number;

	public updateTone():void;

	public createContents():void;

	public resetFontSettings():void;

	public resetTextColor():void;

	public updateOpen():void;
	public updateClose():void;

	public open():void;
	public close():void;

	public isOpening():boolean;
	public isClosing():boolean;

	public show():void;
	public hide():void;

	public activate():void;
	public deactivate():void;

	public textColor(n:number):string;
	public normalColor():string;
	public systemColor():string;
	public crisisColor():string;
	public deathColor():string;
	public gaugeBackColor():string;
	public hpGaugeColor1():string;
	public hpGaugeColor2():string;
	public mpGaugeColor1():string;
	public mpGaugeColor2():string;
	public mpCostColor():string;
	public powerUpColor():string;
	public powerDownColor():string;
	public tpGaugeColor1():string;
	public tpGaugeColor2():string;
	public tpCostColor():string;
	public pendingColor():string;

	public translucentOpacity():number;

	public changeTextColor(color:string):void;
	public changePaintOpacity(enabled:boolean):void;

	public drawText(text:string, x:number, y:number, maxWidth:number, align:string):void;
	public textWidth(text:string):number;
	public drawTextEx(text:string, x:number, y:number):number;
	public convertEscapeCharacters(text:string):string;

	public actorName(n:number):string;
	public partyMemberName(n:number):string;

	public processCharacter(textState:TextState):void;
	public processNormalCharacter(textState:TextState):void;
	public processNewLine(textState:TextState):void;
	public processNewPage(textState:TextState):void;

	public obtainEscapeCode(textState:TextState):string;
	public obtainEscapeParam(textState:TextState):string;
	public processEscapeCharacter(code:string, textState:TextState):void;

	public processDrawIcon(iconIndex:number, textState:TextState):void;

	public makeFontBigger():void;
	public makeFontSmaller():void;

	public calcTextHeight(textState:TextState, all:boolean):number;

	public drawIcon(iconIndex:number, x:number, y:number):void;
	public drawFace(faceName:string, faceIndex:number, x:number, y:number, width:number, height:number):void;
	public drawCharacter(characterName:string, characterIndex:number, x:number, y:number):void;
	public drawGauge(x:number, y:number, width:number, rate:number, color1:string, color2:string):void;

	public hpColor(actor:Game_Actor):string;
	public mpColor(actor:Game_Actor):string;
	public tpColor(actor:Game_Actor):string;

	public drawActorCharacter(actor:Game_Actor, x:number, y:number):void;
	public drawActorFace(actor:Game_Actor, x:number, y:number, width:number, height:number):void;
	public drawActorName(actor:Game_Actor, x:number, y:number, width:number):void;
	public drawActorClass(actor:Game_Actor, x:number, y:number, width:number):void;
	public drawActorNickname(actor:Game_Actor, x:number, y:number, width:number):void;
	public drawActorLevel(actor:Game_Actor, x:number, y:number):void;
	public drawActorIcons(actor:Game_Actor, x:number, y:number, width:number):void;
	public drawCurrentAndMax(current:number, max:number, x:number, y:number, width:number, color1:string, color2:string):void;
	public drawActorHp(actor:Game_Actor, x:number, y:number, width:number):void;
	public drawActorMp(actor:Game_Actor, x:number, y:number, width:number):void;
	public drawActorTp(actor:Game_Actor, x:number, y:number, width:number):void;
	public drawActorSimpleStatus(actor:Game_Actor, x:number, y:number, width:number):void;
	public drawItemName(item:RPG_ItemBase, x:number, y:number, width:number):void;
	public drawCurrencyValue(value:number, unit:string, x:number, y:number, width:number):void;

	public paramchangeTextColor(change:number):string;

	public setBackgroundType(type:MessageBackgroundStyle):void;

	public showBackgroundDimmer():void;
	public hideBackgroundDimmer():void;
	public updateBackgroundDimmer():void;
	public refreshDimmerBitmap():void;

	public dimColor1():string;
	public dimColor2():string;

	public canvasToLocalX(x:number):number;
	public canvasToLocalY(y:number):number;
}
//-----------------------------------------------------------------------------
// Window_BattleActor
//
// The window for selecting a target actor on the battle screen.

declare class Window_BattleActor extends Window_BattleStatus
{
	public constructor(x:number, y:number);
	
	public actor():Game_Actor;
}
//-----------------------------------------------------------------------------
// Window_BattleEnemy
//
// The window for selecting a target enemy on the battle screen.

declare class Window_BattleEnemy extends Window_Selectable
{
	protected _enemies:Game_Enemy[];
	
	public constructor(x: number, y: number);
	
	public windowWidth():number;
	public windowHeight():number;
	
	public enemy():Game_Enemy;
	public enemyIndex():number;
}
//-----------------------------------------------------------------------------
// Window_BattleItem
//
// The window for selecting an item to use on the battle screen.

declare class Window_BattleItem extends Window_ItemList
{
}
//-----------------------------------------------------------------------------
// Window_Selectable
//
// The window class with cursor movement and scroll functions.

declare class Window_Selectable extends Window_Base
{
	protected _index:number;
	protected _cursorFixed:boolean;
	protected _cursorAll:boolean;
	protected _stayCount:number;
	protected _helpWindow:Window_Help;
	protected _handlers:{ [symbol:string]: Function };
	protected _touching:boolean;
	protected _scrollX:number;
	protected _scrollY:number;
	
	public constructor(x:number, y:number, width:number, height:number);

	public index():number;
	public cursorFixed():boolean;
	public setCursorFixed():void;
	public cursorAll():boolean;
	public setCursorAll():void;
	public maxCols():number;
	public maxItems():number;
	public spacing():number;
	public itemWidth():number;
	public itemHeight():number;
	public maxRows():number;
	
	public select(index:number):void;
	public deselect():void;
	public reselect():void;

	public row():number;
	public topRow():number;
	public maxTopRow():number;
	public setTopRow(row:number):void;

	public resetScroll():void;
	public maxPageRows():number;
	public maxPageItems():number;

	public setBottomRow(row:number):void;

	public topIndex():number;

	public itemRect(index:number):Rectangle;
	public itemRectForText(index:number):Rectangle;

	public setHelpWindow(helpWindow:Window_Help):void;
	public showHelpWindow():void;
	public hideHelpWindow():void;

	public setHandler(symbol:string, method:Function):void;
	public isHandled(symbol:string):boolean;
	public callHandler(symbol:string):void;

	public isOpenAndActive():boolean;
	public isCursorMovable():boolean;

	public cursorDown(wrap:boolean):void;
	public cursorUp(wrap:boolean):void;
	public cursorRight(wrap:boolean):void;
	public cursorLeft(wrap:boolean):void;
	public cursorPagedown():void;
	public cursorPageup():void;

	public scrollDown():void;
	public scrollUp():void;
	
	public updateArrows():void;
	public processCursorMove():void;
	public processHandling():void;
	public processWheel():void;
	public processTouch():void;

	public isTouchedInsideFrame():boolean;
	public onTouch():void;

	public hitTest(x:number, y:number):number;

	public isContentsArea(x:number, y:number):boolean;
	public isTouchOkEnabled():boolean;
	public isOkEnabled():boolean;
	public isCancelEnabled():boolean;
	public isOkTriggered():boolean;
	public isCancelTriggered():boolean;
	
	public processOk():void;

	public playOkSound():void;
	public playBuzzerSound():void;

	public callOkHandler():void;
	public processCancel():void;
	public callCancelHandler():void;

	public processPageup():void;
	public processPagedown():void;

	public updateInputData():void;
	public updateCursor():void;

	public isCursorVisible():boolean;
	public ensureCursorVisible():void;

	public callUpdateHelp():void;
	public updateHelp():void;
	public setHelpWindowItem(item:any):void;

	public isCurrentItemEnabled():boolean;

	public drawAllItems():void;
	public drawItem(index:number):void;
	public clearItem(index:number):void;
	public redrawItem(index:number):void;
	public redrawCurrentItem():void;

	public refresh():void;
}