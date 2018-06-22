/******************************************************************************
 *
 * WX Mini Game Adapter
 *
******************************************************************************/
var WX_GAME_ENV = typeof wx !== 'undefined';
var WX_GAME_DEVTOOLS = false;
var SystemInfo = null;
var MainCanvas = null;

// if (WX_GAME_ENV) {
//   SystemInfo = wx.getSystemInfoSync();
//   if (SystemInfo.platform == "devtools")
//     WX_GAME_DEVTOOLS = true;

//   // console.log("Game run in wx mini game env, devtools:" +  WX_GAME_DEVTOOLS
//   //   + ", window:" + SystemInfo.windowWidth + "x" + SystemInfo.windowHeight
//   //   + ", pixelRatio:" + SystemInfo.pixelRatio
//   //   + ", screen:" + SystemInfo.screenWidth + "x" + SystemInfo.screenHeight
//   //   + ", window " + typeof window + ", GameGlobal " + typeof GameGlobal);
// } else {
//   // console.log("Game run in browser env, window:"
//   //   + window.outerWidth + "x" + window.outerHeight
//   //   + ", dpr:" + window.devicePixelRatio
//   //   + ", screen:" + window.screen.width + "x" + window.screen.height);
// }

function IsWxGameEnv() { return WX_GAME_ENV; }
function IsWxGameDevTools() { return WX_GAME_DEVTOOLS; }

// Fxxk, wx performance.now return microsecond in device,
// return millisecond in devtools, we return millisecond in here!
function Now() {
  if (WX_GAME_ENV) {
    if (WX_GAME_DEVTOOLS)
      return wx.getPerformance().now();
    else
      return wx.getPerformance().now() / 1000;
  } else {
    return performance.now();
  }
}

function CreateImage() {
  if (WX_GAME_ENV) {
    return wx.createImage();
  } else {
    return new Image();
  }
}

function GetMainCanvas(domId) {
  function GetMainCanvasImpl(domId) {
    if (WX_GAME_ENV) {
      if (window != null && window.canvas != null)
        return window.canvas;
      else
        return wx.createCanvas();
    } else {
      return document.getElementById(domId);
    }
  }

  if (MainCanvas != null)
    return MainCanvas;

  MainCanvas = GetMainCanvasImpl(domId);
  return MainCanvas;
}

function GetWindowSize() {
  var windowWidth = 0;
  var windowHeight = 0;
  if (WX_GAME_ENV) {
    // windowWidth = SystemInfo.windowWidth;
    // windowHeight = SystemInfo.windowHeight;
  } else {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  }
  return {"width":windowWidth, "height":windowHeight}
}

function GetWindowSizeInPx() {
  var windowWidth = 0;
  var windowHeight = 0;
  var dpr = 1;

  if (WX_GAME_ENV) {
    // windowWidth = SystemInfo.windowWidth;
    // windowHeight = SystemInfo.windowHeight;
    // dpr = SystemInfo.pixelRatio;
  } else {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    // dpr = window.devicePixelRatio;
  }

  var windowWidthPx = windowWidth * dpr;
  var windowHeightPx = windowHeight * dpr;

  // if (Math.abs(windowWidthPx - 1080) < dpr) {
  //   windowWidthPx = 1080;
  // } else if (Math.abs(windowWidthPx - 1440) < dpr) {
  //   windowWidthPx = 1440;
  // }

  // if (Math.abs(windowHeightPx - 1920) < dpr) {
  //   windowHeightPx = 1920;
  // } else if (Math.abs(windowHeightPx - 2560) < dpr) {
  //   windowHeightPx = 2560;
  // }

  return {"width":windowWidthPx, "height":windowHeightPx}
}

function GetCanvasSizeUseWindowRatio(width) {
  var windowSize = GetWindowSizeInPx();
  var height = Math.round(width * windowSize.height / windowSize.width);
  return {"width":width, "height":height}
}

var TimeUtil = {
  startTime: Now(),
  getTimer: function() { return Now() - TimeUtil.startTime; }
}

function FPSMeter() {
  var lastFrameTime = TimeUtil.getTimer();
  var lastSampledTime = TimeUtil.getTimer();
  var sampleFrames = 0;

  var last60SampledTime = TimeUtil.getTimer();
  var sample60Frames = 0;

  var framerate = 0;
  var timeDeltaS = 0.1;

  this.formatNumber = function (val) {
    //format as XX.XX
    return Math.floor(val*100)/100;
  }

  this.update = function() {
    timeDeltaS = (TimeUtil.getTimer() - lastFrameTime) / 1000;
    lastFrameTime = TimeUtil.getTimer();

    if (++sample60Frames >= 60) {
      sampleFrames =sample60Frames;
      lastSampledTime=last60SampledTime;

      sample60Frames=0;
      last60SampledTime= TimeUtil.getTimer();

      framerate = this.getFramerate();
      var frames = sampleFrames;
      return {"framerate": framerate, "frames": frames};
    }else {
      ++sampleFrames;
      // return {"framerate": framerate, "frames": frames};
    }
    return {"framerate": 0};
  }

  this.getFramerate = function() {
    var diff = TimeUtil.getTimer() - lastSampledTime;
    var rawFPS = sampleFrames*1000/diff;
    var sampleFPS = this.formatNumber(rawFPS);
    return sampleFPS;
  }

  this.getTimeDelta = function() {
    return timeDeltaS;
  }
}

var wxhelper = {
  IsWxGameEnv,
  IsWxGameDevTools,
  Now,
  CreateImage,
  GetMainCanvas,
  GetWindowSize,
  GetWindowSizeInPx,
  GetCanvasSizeUseWindowRatio,
  TimeUtil,
  FPSMeter,
};

if (typeof window !== 'undefined') {
  window.wxhelper = wxhelper;
} else if (typeof GameGlobal !== 'undefined') {
  GameGlobal.wxhelper = wxhelper;
  GameGlobal.window = GameGlobal;
  window.top = GameGlobal.parent = window;
} else {
  console.log("Cannot find any global object!");
}


