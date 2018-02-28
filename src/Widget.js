Widget = Class.create({
  initialize: function(a) {
    this.parent = null ;
    this.isModal = !1;
    "undefined" == typeof a || null  == a ? widgets.push(this) : -1 == a ? (this.isModal = !0,
    mWidgets.push(this)) : (this.parent = a,a.widgets.push(this));
    this.widgetName = "Widget";
    this.visible = this.enabled = !0;
    this.dsbld = !1;
    this.widgets = [];
    this.h = this.w = this.y = this.x = 0;
    this.opaque = !0;
    this.ignoreClip = this.needClip = this.needMoveEvt = this.redrawParent = !1;
    this.needEvt = !0;
    this.captured = !1;
    this.blockEvent = !0;
    this.offsetY = this.offsetXold = this.offsetX = 0;
    this.pressPoint = [-1, -1];
    this.isCached = this.needRedraw = !1;
    this.keyPart = this.key = this.bgImage = this.cachedImage = null;
    this.regKeys = [];
    this.updCount = 0;
    this.lastClickTime = -1;
    this.anchors = {
      left: null,
      right: null,
      top: null,
      bottom: null
    }
  },
  close: function() {
      this.isModal && (this.hide(),clearModals())
  },
  getVal: function() {
      return null  == this.key ? (log("getVal: " + this.name + " no PARAM-KEY!"),
      0) : getValue(this.key)
  },
  setVal: function(a) {
    null  != this.key ? setValue(this.key, a) : log("setVal: " + this.name + " no PARAM-KEY!")
  },
  setKey: function(a) {
      this.key = a;
      regUpdate(this)
  },
  setKeyPrefix: function(a) {
      null  != this.keyPart && (this.key = a + this.keyPart)
  },
  regKey: function(a) {
      this.regKeys.push(a);
      var b = keyWidgetHash.get(a);
      isDefined(b) ? b.push(this) : keyWidgetHash.set(a, [this])
  },
  unRegKey: function(a) {
      a = keyWidgetHash.get(a);
      if (isDefined(a)) {
          var b = a.indexOf(this);
          0 <= b && a.splice(b, 1)
      }
  },
  unRegAllKeys: function() {
    for (var a = 0; a < this.regKeys.length; a++) {
      var b = keyWidgetHash.get(this.regKeys[a]);
      if (isDefined(b)) {
        var c = b.indexOf(this);
        0 <= c && b.splice(c, 1)
      }
    }
  },
  setGeometry: function(a, b, c, d) {
      var e = this.w != c || this.h != d;
      this.x = a;
      this.y = b;
      this.w = 0 > c ? 0 : c;
      this.h = 0 > d ? 0 : d;
      if (e)
          this.onResize()
  },
  setPos: function(a, b) {
      this.setGeometry(a, b, this.w, this.h)
  },
  setSize: function(a, b) {
      this.setGeometry(this.x, this.y, a, b)
  },
  onResize: function() {},
  setAnchors: function(a, b, c, d) {
      this.anchors.left = isDefined(a) ? a : null ;
      this.anchors.right = isDefined(c) ? c : null ;
      this.anchors.top = isDefined(b) ? b : null ;
      this.anchors.bottom = isDefined(d) ? d : null 
  },
  contains: function(a, b) {
      return this.enabled && this.visible ? this.x <= a && this.x + 
      this.w > a && this.y <= b && this.y + this.h > b : !1
  },
  updateGeometry: function() {
      var a = this.x
        , b = this.y
        , c = this.w
        , d = this.h;
      this.calcGeometry();
      if (null  == this.parent) {
          var e = this, f = this.anchors;
          null  != f.left && null  != f.right && (e.w = canvasWidth - f.left - f.right);
          null  != f.top && null  != f.bottom && (e.h = canvasHeight - f.top - f.bottom);
          null  != f.left && (e.x = f.left);
          null  != f.right && (e.x = canvasWidth - e.w - f.right);
          null  != f.top && (e.y = f.top);
          null  != f.bottom && (e.y = canvasHeight - e.h - f.bottom)
      }
      for (var g = 0, h = this.widgets.length; g < h; g++)
          if (e = this.widgets[g],
          f = e.anchors,
          null  != f.left && null  != f.right && (e.w = this.w - f.left - f.right),
          null  != f.top && null  != f.bottom && (e.h = this.h - f.top - f.bottom),
          null  != f.left && (e.x = f.left),
          null  != f.right && (e.x = this.w - e.w - f.right),
          null  != f.top && (e.y = f.top),
          null  != f.bottom && (e.y = this.h - e.h - f.bottom),
          null  != f.left && null  != f.right || null  != f.top && null  != f.bottom)
              e.onResize();
      if (a != this.x || b != this.y || c != this.w || d != this.h)
          this.onResize();
      g = 0;
      for (h = this.widgets.length; g < h; g++)
          this.widgets[g].updateGeometry()
  },
  calcGeometry: function() {},
  globalX: function() {
      return null  == this.parent ? this.x : this.x - this.parent.offsetX + this.parent.globalX()
  },
  globalY: function() {
      return null  == this.parent ? this.y : this.y - this.parent.offsetY + this.parent.globalY()
  },
  globalVisible: function() {
      return this.visible ? null  == this.parent ? this.visible : this.parent.globalVisible() : !1
  },
  globalEnabled: function() {
      return this.enabled ? null  == this.parent ? this.enabled : this.parent.globalEnabled() : !1
  },
  globalWidgetName: function() {
      return null  == this.parent ? this.widgetName : this.parent.globalWidgetName() + "." + this.widgetName
  },
  click: function() {
      this.getState && this.getState();
      this.onDown(0, 0, 0);
      this.onUp(0)
  },
  onDown: function(a, b) {
      dbg && log(this.name + ".onDown " + a + "x" + b)
  },
  onMove: function(a, b) {
      dbg && log(this.name + ".onMove " + a + "x" + b)
  },
  onUp: function() {
      !dbg && log(this.name + ".onUp");
      this.pressPoint = [-1, -1]
  },
  onDbClick: function() {
      dbg && log(this.name + ".onDbClick")
  },
  onWheel: function(a) {
      dbg && log(this.globalWidgetName() + " " + a)
  },
  tick: function() {},
  show: function() {
      //console.log(this.widgetName, this.enabled);
      this.enabled || (this.enabled = !0,this.onShow());
  },
  hide: function() {
      this.enabled && (this.enabled = !1,this.onHide())
  },
  onShow: function() {},
  onHide: function() {},
  update: function(a) {
      var b = 0, c = 0;
      dbgWidgets && (b = window.performance ? window.performance.now() : Date.now());
      if (!(0 >= this.h || 0 >= this.w) && this.globalEnabled()) {
          var c = this.globalX(), d = this.globalY();/*console.log(this.widgetName, c, d)*/
          if (!(c > screenWidth || d > screenHeight || 0 > c + this.w || 0 > d + this.h)) {
              var e = 0, f = 0;
              a = a || !1;
              ctx.save();
              ctx.globalAlpha = 1;
              ctx.shadowColor = "transparent";
              ctx.shadowBlur = 0;
              ctx.lineWidth = 1;
              ctx.textBaseline = "alphabetic";
              ctx.font = "24px arial";
          
              a ? (ctx.translate(this.x - this.offsetX | 0, this.y - this.offsetY | 0),
              this.needClip && (ctx.beginPath(),/*console.log('1',this.x, this.offsetX, this.widgetName),*/
              ctx.rect(this.offsetX, this.offsetY, this.w, this.h),
              ctx.clip())) : (function h(a) {
                  null  != a && (h(a.parent),
                  e += a.x - a.offsetX,
                  f += a.y - a.offsetY,
                  a.needClip && (ctx.beginPath(),/*console.log('2', e + a.offsetX, f + a.offsetY, a.widgetName),*/
                  ctx.rect(e + a.offsetX, f + a.offsetY, a.w, a.h),
                  ctx.clip()))
              }(this),
              ctx.translate(c - this.offsetX | 0, d - this.offsetY | 0)/*,console.log('3', c - this.offsetX, this.widgetName)*/);
              this.dsbld && (ctx.globalAlpha = .4);
              !this.opaque && this.parent && this.parent.paintRect(this.x, this.y, this.w, this.h);
              //console.log('paint', this);
              this.paint();
              a = 0;
              for (c = this.widgets.length; a < c; a++)
                  this.widgets[a].update(!0)/*, console.log(this.widgets[a].widgetName)*/;
              dbgWidgets && (c = window.performance ? window.performance.now() : Date.now(),
              b = precision(c - b, 2),
              a = this.offsetX + 1,
              c = this.offsetY + this.h - 6,
              0 < b && (ctx.fillStyle = "#000",
              ctx.fillText(b, a + 1, c + 1),
              ctx.fillStyle = "#FF0",
              ctx.fillText(b, a, c)));
              ctx.restore()
          }
      }
  },
  paintRect: function(a, b, c, d) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, c, d);
      ctx.clip();
      ctx.translate(-a, -b);
      this.paint();
      ctx.restore()
  },
  paint: function() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, this.w, this.h)
  }
});

MainMixer = Class.create(Widget, {
		initialize: function($super, b) {
			$super(b);
			this.widgetName = "MainMixer";
			this.y = 0;
			this.needClip = !0;
			this.mode = -1;
			this.pages = [];

			this.E_MODE = {
				ch1_8: 0,
				ch9_16: 1,
				player: 2,
				fx: 3,
				out: 4
			};

			this.initWidgets();
			this.setMode(0);
		},
		initWidgets: function() {
      ch1_8 = new CH1_8(this),
      ch9_16 = new CH9_16(this),
      player = new PLAYER(this),
      fx = new FX(this),
      out = new OUT(this);
			this.pages.push(ch1_8);
			this.pages.push(ch9_16);
			this.pages.push(player);
			this.pages.push(fx);
			this.pages.push(out);
		},
		setMode: function(a) {
			if (this.mode != a) {
				if (-1 == a) {
					for(var b = 0; b< this.pages.length; b++)
						this.pages[b].hide();
					regUpdate(this);
				}else {
					this.mode = a;
					for(b = 0; b < this.pages.length; b++)
						this.pages[b].enabled && this.pages[b].hide();
					this.pages[a].show();
					regUpdate(this);
				}
			}
		},
		calcGeometry: function() {
			this.w = screenWidth - measures.mixerRightMargin;
			this.h = screenHeight - this.y;
		},
		paint: function() {
			ctx.fillStyle = color.bg;
			ctx.fillRect(this.offsetX, 0, this.w, this.h);
		}
});

CH1_8 = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "CH1_8";
    this.x = 0;
    this.y = 0;
    this.strips = [];
    this.needClip = !0;
    this.moveX = this.moveTID = -1;
    this.vis = this.realWidth = 0;
    this.showLimit = !1;
    this.isShowLimit = !1;
    this.showLimitValue = 0;
    this.createStrips();
  },
  createStrips: function() {
    for(var a = 0, f = 0; a<8; a++) {
      var h = new Strip(this, a, E_STRIP_TYPE.IN, a);
      h.text = 'CH ' + (a + 1);
      this.strips.push(h);
      allStrips.push(h);
      inStrips.push(h);
    }
    this.arrangeStrips("createStrips");
  },
  arrangeStrips: function(a) {
    for(var a = 0; a < this.strips.length; a++){
      var b = this.strips[a];
      b.x = b.subId * measures.mixerStripWidth;
    }
  },
  calcGeometry: function() {
    this.w = this.parent.w;
    this.h = this.parent.h;

    this.maxOffset = measures.mixerStripWidth * 8 - this.w;
    0 > this.maxOffset && (this.maxOffset = 0);
  },
  velStart:function() {
    var that = this
    velocity = amplitude = 0;
    timestamp = Date.now();
    clearInterval(ticker);
    frame = this.offsetX;
    ticker = setInterval(that.velTrack, 1E3 / fps)
  },
  velRelease: function() {
    clearInterval(ticker);
    Date.now() - timestamp < 1E3 / fps && this.velTrack();
    5 < Math.abs(velocity) && this.mScroll(velocity);
  },
  velTrack: function() {
    var a, b;
    a = Date.now();
    b = a - timestamp;
    timestamp = a;
    a = ch1_8.offsetX - frame;
    frame = ch1_8.offsetX;
    b = 1E3 * a / (1+b);
    velocity = 0 == velocity ? b : .3 * b + .7 * velocity;
  },
  mScroll: function(a) {
    if(!settings.kinetic) {
      var b = 1E3 / fps;
      position = this.offsetX;
      amplitude = .2 * a;
      step = 0;
      var c = this;
      clearInterval(ticker);
      ticker = setInterval(function() {
        var a = amplitude / b * 2;
        position += a;
        amplitude -= a;
        step += 1;
        .5 > Math.abs(a) && clearInterval(ticker);
        step > 3 * fps && clearInterval(ticker);
        (0 >= position || position > c.maxOffset) && clearInterval(ticker);
        c.offsetX != (position | 0) && c.setOffset(position | 0)
      }, b);
    }
  },
  setOffset: function(a) {
    this.offsetX != a && (this.offsetXold = this.offsetX = bound(a|0, 0, this.strips.length * measures.mixerStripWidth - this.w),
      regUpdate(this))
  },
  startScroll: function (a, b) {
    scrollLock || mixerTouches != (settings.oneFingerScroll ? 1 : 2) && b != mouseID || this.move || (this.touchID = b,
      this.scrollX = a,
      this.move = !0,
      this.velStart())
  },
  endScroll: function(a) {
    this.touchID == a && (this.touchID = this.scrollX = -1,
      this.move = !1,
      this.offsetXold = this.offsetX,
      this.velRelease(),
      regUpdate(this))
  },
  setScroll: function(a, b) {
    var c = 0;
    scrollLock || mixerTouches != (settings.oneFingerScroll ? 1 : 2) && b != mouseID || this.touchID != b ||
      (c = this.offsetXold - (a - this.scrollX) * SCROLL_SCALE | 0,this.offsetX = bound(c, 0, this.maxOffset),
        this.syncOffset(),
        regUpdate(this),
        this.velTrack(),

        (c > this.maxOffset || c < 0)?(this.showLimit = !0, this.showLimitValue = c - this.maxOffset):(this.showLimit = !1, this.showLimitValue = 0)
      )
  },
  showLimitfunc: function(a) {
    ctx.beginPath();
    ctx.moveTo(20,20);
    ctx.quadraticCurveTo(110,80,200,20);
    ctx.stroke();
    ctx.fillStyle = "yellow"
    ctx.fill();
  },
  syncOffset: function() {

  },
  paint: function() {
    ctx.fillStyle = color.mesliderbg;
    ctx.fillRect(0, 0, this.w, this.h);
  }
});

CH9_16 = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "CH9_16";
    this.x = 0;
    this.y = 0;
    this.needClip = !0;
    this.strips = [];
    this.moveX = this.moveTID = -1;
    this.vis = this.realWidth = 0;
    this.showLimit = !1;
    this.isShowLimit = !1;
    this.showLimitValue = 0;
    this.createStrips();
  },
  createStrips: function() {
    for(var a = 8, f = 0; a<16; a++) {
      var h = new Strip(this, a, E_STRIP_TYPE.IN, a);
      h.text = 'CH ' + (a + 1);
      this.strips.push(h);
      allStrips.push(h);
      inStrips.push(h);
    }
    this.arrangeStrips("createStrips");
  },
  arrangeStrips: function(a) {
    for(var a = 0; a < this.strips.length; a++){
      var b = this.strips[a];
      b.x = (b.subId - 8) * measures.mixerStripWidth;
    }
  },
  calcGeometry: function() {
    this.w = this.parent.w;
    this.h = this.parent.h;

    this.maxOffset = measures.mixerStripWidth * 8 - this.w;
    0 > this.maxOffset && (this.maxOffset = 0);
  },
  velStart:function() {
    var that = this
    velocity = amplitude = 0;
    timestamp = Date.now();
    clearInterval(ticker);
    frame = this.offsetX;
    ticker = setInterval(that.velTrack, 1E3 / fps)
  },
  velRelease: function() {
    clearInterval(ticker);
    Date.now() - timestamp < 1E3 / fps && this.velTrack();
    5 < Math.abs(velocity) && this.mScroll(velocity);
  },
  velTrack: function() {
    var a, b;
    a = Date.now();
    b = a - timestamp;
    timestamp = a;
    a = ch9_16.offsetX - frame;
    frame = ch9_16.offsetX;
    b = 1E3 * a / (1+b);
    velocity = 0 == velocity ? b : .3 * b + .7 * velocity;
  },
  mScroll: function(a) {
    if(!settings.kinetic) {
      var b = 1E3 / fps;
      position = this.offsetX;
      amplitude = .2 * a;
      step = 0;
      var c = this;
      clearInterval(ticker);
      ticker = setInterval(function() {
        var a = amplitude / b * 2;
        position += a;
        amplitude -= a;
        step += 1;
        .5 > Math.abs(a) && clearInterval(ticker);
        step > 3 * fps && clearInterval(ticker);
        (0 >= position || position > c.maxOffset) && clearInterval(ticker);
        c.offsetX != (position | 0) && c.setOffset(position | 0)
      }, b);
    }
  },
  setOffset: function(a) {
    this.offsetX != a && (this.offsetXold = this.offsetX = bound(a|0, 0, this.strips.length * measures.mixerStripWidth - this.w),
      regUpdate(this))
  },
  startScroll: function (a, b) {
    scrollLock || mixerTouches != (settings.oneFingerScroll ? 1 : 2) && b != mouseID || this.move || (this.touchID = b,
      this.scrollX = a,
      this.move = !0,
      this.velStart())
  },
  endScroll: function(a) {
    this.touchID == a && (this.touchID = this.scrollX = -1,
      this.move = !1,
      this.offsetXold = this.offsetX,
      this.velRelease(),
      regUpdate(this))
  },
  setScroll: function(a, b) {
    var c = 0;
    scrollLock || mixerTouches != (settings.oneFingerScroll ? 1 : 2) && b != mouseID || this.touchID != b || 
      (c = this.offsetXold - (a - this.scrollX) * SCROLL_SCALE | 0,this.offsetX = bound(c, 0, this.maxOffset),
        this.syncOffset(),
        regUpdate(this),
        this.velTrack(),

        (c > this.maxOffset || c < 0)?(this.showLimit = !0, this.showLimitValue = c - this.maxOffset):(this.showLimit = !1, this.showLimitValue = 0)

      )
  },
  syncOffset: function() {

  },
  paint: function() {
    ctx.fillStyle = color.mesliderbg;
    ctx.fillRect(0, 0, this.w, this.h);
  }
});

PLAYER = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "PLAYER";
    this.x = 0;
    this.y = 0;
    this.needClip = !0;
    this.strips = [];
    this.createStrips();
    this.initWidgets();
  },
  createStrips: function() {
    var h = new Strip(this, 16, E_STRIP_TYPE.PLAYER, 0);
    h.text = "PLAYER";
    h.sl.canScroll = !1;
    this.strips.push(h);
    allStrips.push(h);
    playerStrips.push(h);
    this.arrangeStrips("createStrips");
  },
  initWidgets: function() {

    var a = this;

    this.PLISTS = new PLISTS(this);
    this.PLISTS.setPos(measures.mixerStripWidth + 10, 10);
    this.PLISTS.setSize(200, 400);
    this.PLISTS.onSelect = function() {
      //var b = this.selItem();
      sendMessage('PLAYERFILE', this.selectedIdx);
    }

    this.FLIST = new FLIST(this);
    this.FLIST.setPos(410, 10);
    this.FLIST.setSize(400, 400);
    this.FLIST.plistName = "";
    this.FLIST.onSelect = function() {
      sendMessage('PLAYERSONG', this.selectedIdx);
    }
    this.FLIST.onDClick = function() {
      if(0 && isBlocked("player")){
        //showPopupMsg
      }
      else {
        var b = this.selItem();
        if(null != b && 0 != b.length) {
          var c = a.PLISTS.selItem();
          if(null == c || 0 == c.length)
            c = getValue("var.currentPlaylist");
          null != c && 0 != c.length && sendMessage(E_COMMANDS.MEDIA_SWITCH_TRACK + "^" + c + "^" + b);
        }
      }
    };

    this.FLIST.getActiveItem = function() {
      var a = getValue("var.currentPlaylist");
      this.plistName != a ? this.activeItemIdx = -1 : (a = getValue("var.currentTrack"),
      this.activeItemIdx = this.items.indexOf(a))
    };

    //this.PLISTS.setItems(['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15', '16']);
    //this.FLIST.setItems(['1','2','3','4','5','6','7','8','9','10','11','12','13','14']);

    this.SEEKBAR = new SEEKBAR(this);
    this.SEEKBAR.ondown = function() {
      //a.TIME.setMode(1)
    };
    this.SEEKBAR.onup = function() {
      //a.TIME.setMode(0)
      //sendMessage('PLAYERSEEKBAR', this.pos); 
    };
    this.SEEKBAR.onmove = function(b) {
      //a.TIME.setValue2(b);
      regUpdate(a.TIME);
    };
    this.SEEKBAR.onValue = function(a) {
      /*isBlocked("player") ? showPopupMsg(lang.LOCKED, 800) : */sendMessage(E_COMMANDS.MEDIA_JUMP_TO + "^" + a)
    };

    this.PREV = new Button(this);
    this.PREV.setImages(res.player_prev_off, res.player_prev_on);
    this.PREV.valueFunc = function() {
      sendMessage('PLAYERBUT', 1);
    }

    this.PLAY = new CheckBox(this);
    this.PLAY.setImages(res.player_play, res.player_pause);
    this.PLAY.getState = function() {
      //this.state = 2 == getValue("var.currentState") ? 1: 0;
      this.state = (this.state == 0 ? 0 : 1);
    };
    this.PLAY.onToggleUp = function() {
      var b = a.FLIST.selItem()
        , c = a.PLISTS.selItem()
        , d = getValue("var.currentTrack")
        , e = getValue("var.currentPlaylist");
      if (null  != b && b != d) {
          if (null  == c || 0 == c.length)
              c = e;
          null  != c && 0 != c.length && null  != b && 0 != b.length && sendMessage(E_COMMANDS.MEDIA_SWITCH_TRACK + "^" + c + "^" + b)
      } else
          getValue("settings.cue") && sendMessage(E_COMMANDS.MEDIA_NEXT);
      sendMessage('PLAYERBUT', 0);
    };
    this.PLAY.onToggleDown = function() {
      sendMessage('PLAYERBUT', 0);
    }

    this.NEXT = new Button(this);
    this.NEXT.setImages(res.player_next_off,res.player_next_on);
    this.NEXT.onPress = function() {
      sendMessage('PLAYERBUT', 2);
    }

    /*this.STOP = new Button(this);
    this.STOP.setImages(res.player_stop_off, res.player_stop_on);
    this.STOP.onPress = function() {
      sendMessage('PLAYER', 1);
    }*/

    this.timeDisplay = new TIME_LABEL(this);
  },
  arrangeStrips: function() {
    this.strips[0].x = 0;
  },
  calcGeometry: function() {
    this.w = this.parent.w;
    this.h = this.parent.h;

    var a = this.h - this.PLISTS.y - 10 - 80;

    var _width = (screenWidth - measures.mixerRightMargin - measures.mixerStripWidth) / 3;

    this.PLISTS.setSize(_width, a);
    this.FLIST.x = this.PLISTS.x + this.PLISTS.w + 5;
    this.FLIST.setSize(this.w - this.FLIST.x - 10, a);

    this.SEEKBAR.setPos(100, 10 + a + 10);
    this.SEEKBAR.w = this.w - this.SEEKBAR.x - 60;

    var middle = 100 + (this.SEEKBAR.w + 30) / 2;
    var pic_w = this.PLAY.w;
    this.PREV.setPos( middle - pic_w * 1.5 - 20, a + 20 + 30);
    this.PLAY.setPos( middle - pic_w * 0.5, a + 20 + 30);
    //this.STOP.setPos( middle + 10, a + 20 + 30);
    this.NEXT.setPos( middle + pic_w * 0.5 + 20, a + 20 + 30);

    this.timeDisplay.setSize(50, 40);
    this.timeDisplay.setPos(this.w - 50, this.SEEKBAR.y-10);
  },
  paint: function() {
    ctx.fillStyle = color.mesliderbg;
    ctx.fillRect(0, 0, this.w, this.h);
  }
});

FX = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "FX";
    this.x = 0;
    this.y = 0;
    this.needClip = !1;
    this.mode = -1;
    this.strips = [];
    this.pages = [];

    this.E_MODE = {
      fx1: 0,
      fx2: 1
    }

    this.initWidgets();
    this.setMode(0);
  },
  initWidgets: function() {
    var fx1 = new Fx_page(this, 0),
        fx2 = new Fx_page(this, 1);

    var a = this;

    this.pages.push(fx1);
    this.pages.push(fx2);
  },
  setMode: function(a) {
    if (this.mode != a) {
      if (-1 == a) {
        for(var b = 0; b< this.pages.length; b++)
          this.pages[b].hide();
        regUpdate(this);
      }else {
        this.mode = a;
        for(b = 0; b < this.pages.length; b++)
          this.pages[b].enabled && this.pages[b].hide();
        this.pages[a].show();
        regUpdate(this);
      }
    }
  },
  calcGeometry: function() {
    this.w = this.parent.w;
    this.h = this.parent.h;
  },
  paint: function() {
    ctx.fillStyle = color.mesliderbg;
    ctx.fillRect(0, 0, this.w, this.h);
  }
});

Fx_page = Class.create(Widget, {
  initialize: function($super, b, c) {
    $super(b);
    this.widgetName = "FX_PAGE";
    this.x = 0;
    this.y = 0;
    this.type = c;
    this.strips = [];
    this.plain = [];
    this.fxStrips = [];
    this.initWidgets();
  },
  initWidgets: function() {
    var that = this;

    var h = new Strip(this, 17+this.type, E_STRIP_TYPE.FX, this.type);
    h.text = "FXR-" + (this.type + 1);
    h.sl.canScroll = !1;
    this.strips.push(h);
    allStrips.push(h);
    fxStrips.push(h);
    this.arrangeStrips("createStrips");

    this.goto_global_0 = new CheckBox(this);
    //this.goto_global_0.setPos(122, 10);
    //this.goto_global_0.setSize(100, 30);
    this.goto_global_0.setText(lang.FX_REVERB);
    this.goto_global_0.getState = function() {
      this.state = fx.mode == 0 ? 1: 0
    };
    this.goto_global_0.onToggle = function() {
      0 != fx.mode && fx.setMode(0);
      console.log('fx1')
    }

    this.goto_global_1 = new CheckBox(this);
    //this.goto_global_1.setPos(280, 10);
    //this.goto_global_1.setSize(100, 30);
    this.goto_global_1.setText(lang.FX_DELAY);
    this.goto_global_1.getState = function() {
      this.state = fx.mode == 1 ? 1: 0
    };
    this.goto_global_1.onToggle = function() {
      1 != fx.mode && fx.setMode(1);
      console.log('fx2')
    }

    var d = [], e = [], f = [];
    //res.fxFader_b
    switch(this.type) {
      case 0:
        /*d = ["Hz", "ms", "%", "%"];
        e = ["RevPreHP", "RevPreDelayTime", "RevTime", "RevHDamp"];
        break;*/
        d = ["%", "%", "ms", "%", "%"];
        e = ["Level", "DirectLevel", "PreDelayTime", "Time", "Diffusion"];
        f = [percentFormula, percentFormula, generatePercentX(250), percentFormula, percentFormula];
        break;
      case 1:
        d = ["Hz", "%", "ms"];
        e = ["DelayPreLP", "DelayFeedback", "DelayTime"];
        f = [generatePercentX(1500), percentFormula, generatePercentX(1200)];
        break;
    }

    //var f = [generatePercentX(1200), generatePercentX(127), percentFormula, percentFormula, generatePercentX(1500), percentFormula, generatePercentX(1200)]

    for(var i = 0,len = d.length; i<len; i++) {
      var plain = new FXLEDPlain(this);
      plain.label = e[i];
      plain.sign = d[i];
      plain.setKey('f.' + that.type + '.par' + i);
      this.plain.push(plain);

      var _strip = new EQSlider(this);
      _strip.setFader(res.fxFader_b, 10);
      //console.log('zzz', res.fxFader_b.width)
      _strip.dbMarks = !1;
      _strip.aclr = color.AUX;
      //console.log('f.' + that.type + '.par' + i)
      _strip.setKey('f.' + that.type + '.par' + i);
      _strip.getState = function() {
        //regUpdate(this.parent);
        //console.log(that.type)
      }
      this.fxStrips.push(_strip);

      plain.formatValue = f[i];
    }

    var a = this;
    this.bPRESET = new Button(this);
    this.bPRESET.setSize(70, 30);
    this.bPRESET.opaque = !1;
    this.bPRESET.setImages(res.bPRESET_ON, res.bPRESET_OFF);
    this.bPRESET.valueFunc = function() {
      var _b = new PRESET_MENU2(null, "fxch", a, '#000');
      _b.onshow();
      regUpdate(_b);
      //console.log('dd')
    }
  },
  arrangeStrips: function() {
    this.strips[0].x = 0;
  },
  onShow: function() {
    console.log(this.type, 'fxmode')
    if(this.type === 0) {
      for(var i = 0; i < 5; i++) {
        this.fxStrips[i].setKey('f.0' + '.par' + i)
      }
    }else {
      for(var i = 0; i < 3; i++) {
        this.fxStrips[i].setKey('f.1' + '.par' + i)
      }
    }
  },
  calcGeometry: function() {
    this.w = this.parent.w;
    this.h = this.parent.h;

    var _width = this.w - measures.mixerStripWidth;
    this.goto_global_0.setSize(_width * 0.4 | 0, 30);
    this.goto_global_0.setPos(measures.mixerStripWidth + _width * 0.1 | 0, 10);


    this.goto_global_1.setSize(_width * 0.4 | 0, 30);
    this.goto_global_1.setPos(measures.mixerStripWidth + _width * 0.5 | 0, 10);

    var c = this.plain.length;
    var b = this.w;

    b = (b - 80 - 40) / (c - .5) | 0;

    for(var i = 0; i < c; i++) {
      this.plain[i].x = measures.mixerStripWidth + b * i | 0;
      this.fxStrips[i].x = measures.mixerStripWidth + b * i | 0;
      this.plain[i].y = 60;
      this.fxStrips[i].y = 110;
      this.plain[i].w = this.fxStrips[i].w = b;
      this.fxStrips[i].h = this.h - this.fxStrips[i].y - 50;
      this.fxStrips[i].faderX = (b - res.fxFader_b.w()) / 2;
    }

    this.bPRESET.setPos(this.w - 90, this.h - 40)
  },
  paint: function() {
    ctx.fillStyle = "white";
    ctx.fillText('fx' + this.type, 100, 100);
  }
});

OUT = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "OUT";
    this.x = 0;
    this.y = 0;
    this.needClip = !1;
    this.strips = [];
    this.createStrips();
  },
  createStrips: function() {
    
    var h = new Strip(this, 19, E_STRIP_TYPE.AUX, 0);
    h.text = "AUX1";
    h.sl.canScroll = !1;
    this.strips.push(h);
    allStrips.push(h);
    auxStrips.push(h);

    h = new Strip(this, 20, E_STRIP_TYPE.AUX, 1);
    h.text = "AUX2";
    h.sl.canScroll = !1;
    this.strips.push(h);
    allStrips.push(h);
    auxStrips.push(h);

    h = new Strip(this, 21, E_STRIP_TYPE.SUB, 0);
    h.text = "SUB";
    h.sl.canScroll = !1;
    this.strips.push(h);
    allStrips.push(h);
    subStrips.push(h);
    
    this.arrangeStrips("createStrips");
  },
  arrangeStrips: function() {
    for(var a = 0; a < this.strips.length; a++) {
      this.strips[a].x = a * measures.mixerStripWidth;
    }
  },
  calcGeometry: function() {
    this.w = this.parent.w;
    this.h = this.parent.h;
  },
  paint: function() {
    ctx.fillStyle = color.mesliderbg;
    ctx.fillRect(0, 0, this.w, this.h);
  }
});

MasterMixer = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "MasterMixer";
    this.y = 0;
    this.needClip = !1;
    this.strips = [];
    this.createStrips();
  },
  createStrips: function() {
    var h = new Strip(this, 22, E_STRIP_TYPE.MAIN, 0);
    h.text = "MASTER";
    h.sl.canScroll = !1;
    h.x = 0;
    this.strips.push(h);
    allStrips.push(h);
  },
  calcGeometry: function() {
    this.w = measures.mixerStripWidth;
    this.h = screenHeight;
    this.x = screenWidth - measures.mixerRightMargin;
  },
  paint: function() {
    
  }
});

SlideOut = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "SlideOut";
    this.y = 0;
    this.w = measures.masterStripWidth;

    this.cachedStrip = null;
    this.cachedStripHeight = 0;

    this.enabled = !1;
    this.initWidgets();
  },
  calcGeometry: function() {
    this.x = screenWidth - this.w;
    this.h = screenHeight;
  },
  setMode: function(a) {
    this.mode = a;
  },
  initWidgets: function() {
    var a = this, b = 12, interval = 50;

    var _width = measures.masterStripWidth - 20;

    this.gotoSet = new Button(this);
    this.gotoSet.setPos(10, b);
    this.gotoSet.setSize(_width, 40);
    this.gotoSet.textClr0 = "#e6b450";
    this.gotoSet.textClr1 = "#e6b450";
    this.gotoSet.clr0 = "black";
    this.gotoSet.clr1 = "black";
    this.gotoSet.setText(lang.EDIT);
    this.gotoSet.valueFunc = function() {
      console.log('gotoSet');
      //changeMode
      setMode(E_MODE.EDIT)
      regUpdate(this);
    }

    this.CH18 = new CheckBox(this);
    this.CH18.setPos(10, b+=interval);
    //this.CH18.clr0 = "#172C3D";
    //this.CH18.clr1 = "#172C3D";
    this.CH18.setSize(_width, 40);
    this.CH18.setText('CH1-8');
    this.CH18.getState = function() {
      this.state = mixerWidget.mode == 0 ? 1: 0
    };

    this.CH18.onToggle = function() {
      0 != mixerWidget.mode && mixerWidget.setMode(0);
      console.log('ch1-8')
    }

    this.CH916 = new CheckBox(this);
    this.CH916.setPos(10, b+=interval);
    this.CH916.setSize(_width, 40);
    this.CH916.setText('CH9-16');
    this.CH916.getState = function() {
      this.state = mixerWidget.mode == 1 ? 1: 0
    };

    this.CH916.onToggle = function() {
      1 != mixerWidget.mode && mixerWidget.setMode(1);
      console.log('ch9-16')
    }

    this.player = new CheckBox(this);
    this.player.setPos(10, b+=interval);
    this.player.setSize(_width, 40);
    this.player.setText('PLAYER');
    this.player.getState = function() {
      this.state = mixerWidget.mode == 2 ? 1: 0
    };

    this.player.onToggle = function() {
      2 != mixerWidget.mode && mixerWidget.setMode(2);
      console.log('player')
    }

    this.fx = new CheckBox(this);
    this.fx.setPos(10, b+=interval);
    this.fx.setSize(_width, 40);
    this.fx.setText('FX');
    this.fx.getState = function() {
      this.state = mixerWidget.mode == 3 ? 1: 0
    };

    this.fx.onToggle = function() {
      3 != mixerWidget.mode && mixerWidget.setMode(3);
      console.log('fx')
    }

    this.out = new CheckBox(this);
    this.out.setPos(10, b+=interval);
    this.out.setSize(_width, 40);
    this.out.setText('OUT');
    this.out.getState = function() {
      this.state = mixerWidget.mode == 4 ? 1: 0
    };

    this.out.onToggle = function() {
      4 != mixerWidget.mode && mixerWidget.setMode(4);
      //console.log('out')
    };
  },
  paint: function() {
    ctx.fillStyle = "#172C3D";
    ctx.fillRect(0, 0, this.w, this.h);
  }
});

SlideOut2 = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "SlideOut2";
    this.y = 0;
    this.w = measures.masterStripWidth;

    this.cachedStrip = null;
    this.cachedStripHeight = 0;

    this.enabled = !1;
    this.initWidgets();
  },
  calcGeometry: function() {
    this.x = screenWidth - this.w;
    this.h = screenHeight;
  },
  setMode: function(a) {
    this.mode = a;
  },
  initWidgets: function() {
    var a = this, b = 12, interval = 40;

    var _width = measures.masterStripWidth - 20;
    var _height = 35;

    this.gotoSet = new Button(this);
    this.gotoSet.setPos(12, b);
    this.gotoSet.setSize(_width, _height);
    this.gotoSet.textClr0 = "#e6b450";
    this.gotoSet.clr0 = "black";
    this.gotoSet.valueFunc = function() {
      console.log('gotoHome');
      //changeMode
      setMode(E_MODE.MIX)
      regUpdate(this);
    }

    this.ChannelSet = new CheckBox(this);
    this.ChannelSet.setPos(12, b+=interval);
    this.ChannelSet.setSize(_width, _height);
    this.ChannelSet.getState = function() {
      this.state = editWidget.mode == 0 ? 1: 0
    };

    this.ChannelSet.onToggle = function() {
      0 != editWidget.mode && editWidget.setMode(0);
      //console.log('ch1-8')
    }

    this.SceneShot = new CheckBox(this);
    this.SceneShot.setPos(12, b+=interval);
    this.SceneShot.setSize(_width, _height);
    this.SceneShot.getState = function() {
      this.state = editWidget.mode == 1 ? 1: 0
    };

    this.SceneShot.onToggle = function() {
      1 != editWidget.mode && editWidget.setMode(1);
      //console.log('ch9-16')
    }

    this.VUDis = new CheckBox(this);
    this.VUDis.setPos(12, b+=interval);
    this.VUDis.setSize(_width, _height);
    this.VUDis.getState = function() {
      this.state = editWidget.mode == 2 ? 1: 0
    };

    this.VUDis.onToggle = function() {
      2 != editWidget.mode && editWidget.setMode(2);
      //console.log('player')
    }

    this.USBREC = new CheckBox(this);
    this.USBREC.setPos(12, b+=interval);
    this.USBREC.setSize(_width, _height);
    this.USBREC.getState = function() {
      this.state = editWidget.mode == 3 ? 1: 0
    };

    this.USBREC.onToggle = function() {
      3 != editWidget.mode && editWidget.setMode(3);
      //console.log('fx')
    }

    this.MainSend = new CheckBox(this);
    this.MainSend.setPos(12, b+=interval);
    this.MainSend.setSize(_width, _height);
    this.MainSend.getState = function() {
      this.state = editWidget.mode == 4 ? 1: 0
    };

    this.MainSend.onToggle = function() {
      4 != editWidget.mode && editWidget.setMode(4);
      //console.log('out')
    }

    this.FXSend = new CheckBox(this);
    this.FXSend.setPos(12, b+=interval);
    this.FXSend.setSize(_width, _height);
    this.FXSend.getState = function() {
      this.state = editWidget.mode == 5 ? 1: 0
    };

    this.FXSend.onToggle = function() {
      5 != editWidget.mode && editWidget.setMode(5);
      //console.log('out')
    }

    this.Setting = new CheckBox(this);
    this.Setting.setPos(12, b+=interval);
    this.Setting.setSize(_width, _height);
    this.Setting.getState = function() {
      this.state = editWidget.mode == 6 ? 1: 0
    };

    this.Setting.onToggle = function() {
      6 != editWidget.mode && editWidget.setMode(6);
      //console.log('out')
    }
  },
  paint: function() {
    ctx.fillStyle = "#172C3D";
    ctx.fillRect(0, 0, this.w, this.h);
    this.gotoSet.setText(lang.HOME);
    this.ChannelSet.setText(lang.ChannelSet);
    this.SceneShot.setText(lang.SceneShot);
    this.VUDis.setText(lang.VUDis);
    this.USBREC.setText(lang.USBREC);
    this.MainSend.setText(lang.MainSend);
    this.FXSend.setText(lang.FXSend);
    this.Setting.setText(lang.SETTINGS);

    /*ctx.strokeStyle = 'black';
    ctx.moveTo(0, 0);
    ctx.lineTo(0, this.h);
    ctx.stroke();*/
  }
});

Button = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = 'Button';
    this.pressed = !1;
    this.timer = null;
    this.longClickMark = this.longOk = !1;
    this.opaque = !0;
    this.disabled = !1;
    this.text = '';
  },
  setImages: function(a, b) {
    this.img1 = a;
    this.img2 = b;
    this.w = this.img1.w();
    this.h = this.img2.h();
  },
  onDown: function() {
    if(!this.disabled) {
      this.longOk = !1;
      this.pressed = !0;
      this.valueFunc();
      var a = this;
      clearTimeout(this.timer);
      this.longClickMark && (this.timer = setTimeout(function() {
        a.onHold();
        a.longOk = !0;
      }, HOLD_TIME));

      
      this.opaque ? regUpdate(this.parent) : regUpdate(this);
      
    }
  },
  onUp: function() {
    if(!this.disabled && (clearTimeout(this.timer),
      this.pressed = !1,
      this.opaque ? regUpdate(this.parent) : regUpdate(this),
      !this.longOk))
        this.onPress()
  },
  setText: function(a) {
    this.text = a;
  },
  onHold: function() {},
  valueFunc: function() {},
  onValue: function() {},
  onPress: function() {},
  getState: function() {},
  paint: function() {
    this.getState();
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "18px Arial";
    this.disabled && (ctx.globalAlpha = 0);
    this.pressed ? null != this.img2 ? drawImage(this.img2, 0, 0) :
      (ctx.fillStyle = 'red', ctx.fillRect(0, 0, this.w, this.h), this.text != '' && (ctx.fillStyle = 'white', ctx.fillText(this.text, this.w/2, this.h/2))) : 
        null != this.img1 ? drawImage(this.img1, 0, 0) : (ctx.fillStyle = this.clr0 || "#666",
          ctx.fillRect(0, 0, this.w, this.h), this.text != '' && (ctx.fillStyle = this.textClr0||'white', ctx.fillText(this.text, this.w/2, this.h/2)));

    if(this.longClickMark) {
      ctx.fillStyle = color.longClickMark;
      var a = 4;
      this.state && (a+=1);
      ctx.fillRect(this.w - 9, a, 4, 4)
    }
    this.disabled && (ctx.globalAlpha = 1);
  }
});

TabButton = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "TabButton";
    this.mode = this.state = 0;
    this.text = 'null';
    this.img0 = null;
    this.font = font.tabText;
    this.textColor = color.tabText;
    this.it = this.cosmetic = !1;
    this.w = 111;
    this.h = 30;
  },
  onDown: function() {
    this.cosmetic ? this.valueFunc() : this.parent.setMode(this.mode)
  },
  setImage: function(a, b, c) {
    this.img0 = a;
    this.ix = b;
    this.iy = c
  },
  valueFunc: function() {
    this.parent.setMode(this.mode);
  },
  getState: function(){
    this.cosmetic || (this.state = this.parent.mode == this.mode ? 1 : 0)
  },
  paint: function() {
    this.getState();
    0 == this.state ? (ctx.fillStyle = color.eqBg,ctx.fillRect(0, 0, this.w, this.h),
      ctx.strokeStyle = color.tabStroke,ctx.strokeStyle = color.tabStroke,
      ctx.strokeRect(.5, .5, this.w - 1, this.h - 2),
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)",
      ctx.fillRect(1, this.h, this.w - 2, -10),
      null != this.img0 ? (this.it && (ctx.globalAlpha = .4),
        drawImage(this.img0, this.ix, this.iy),
        this.it && (ctx.globalAlpha = 1)) : (ctx.font = this.font,
        ctx.textAlign = "center",
        ctx.fillStyle = color.black,
        ctx.fillText(this.text, this.w/2 + 1 | 0, 23, this.w - 4), 
        ctx.fillStyle = this.textColor,
        ctx.fillText(this.text, this.w / 2 | 0, 22, this.w - 4))) : (
    isDefined(this.color) ? ctx.fillStyle = this.color : ctx.fillStyle = this.parent.color,
    ctx.fillRect(0, 0, this.w, this.h),
    null != this.img0 ? (this.it && (ctx.globalAlpha = .4),
      drawImage(this.img0, this.ix, this.iy),
      this.it && (ctx.globalAlpha = 1)) : (ctx.font = font.tabTextSel,
      ctx.textAlign = "center", 
      ctx.fillStyle = color.black,
      ctx.fillText(this.text, this.w / 2 + 1 | 0, 23, this.w - 4),
      ctx.fillStyle = color.tabTextSel,
      ctx.fillText(this.text, this.w /2 | 0, 22, this.w - 4),
      ctx.shadowColor = "transparent"))
  }
});

CheckBox = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = 'CheckBox';
    this.state = 0;
    this.clr0 = "#222";
    this.clr1 = "#DDD";
    this.textClr0 = "white";
    this.textClr1 = "black";
    this.linked = this.disabled = this.invertedValue = !1;
    this.holdTimer = null;
    this.stopClick = this.clickOnUp  = this.needBG = this.longClickMark = !1;
    this.lmColor = color.longClickMark;
    this.text = '';
  },
  calcGeometry: function() {
    this.grd = ctx.createLinearGradient(0, 0, 0, this.h);
    this.grd.addColorStop(0, "rgba(255, 255, 255, 0)");
    this.grd.addColorStop(0.5, "rgba(255, 255, 255, 0.12)");
    this.grd.addColorStop(1, "rgba(255, 255, 255, 0)");
  },
  onDown: function() {
    this.stopClick = !1;
    if (!this.disabled) {
      //this.clickOnUp || (this.confirm && this.doClick());
      if(!this.clickOnUp) {
        //var _res = this.confirm ? this.confirm() : true;
        //if( _res ) {
          this.doClick();
        //} 
      }
      var a = this;
      clearTimeout(this.holdTimer);
      this.longClickMark && (this.holdTimer = setTimeout(function() {
        a.onHokd();
        a.stopClick = !0;
      }, HOLD_TIME))
    }
  },
  setImages: function(a, b) {
    this.img1 = a;
    this.img2 = b;
    this.w = this.img1.w();
    this.h = this.img2.h();
  },
  setText: function(a, b) {
    this.text = a;
    this.text2 = b;
  },
  onUp: function() {
    clearTimeout(this.holdTimer);
    this.clickOnUp && !this.stopClick && this.doClick();
  },
  doClick: function() {
    switch (this.state) {
      case 0:
      case !1:
        this.state = 1;
        this.onToggleUp();
        break;
      case 1:
      case !0:
        this.state = 0;
        this.onToggleDown();
    }
    null != this.key && this.setVal(this.state);
    this.linked && null != this.parent.linkTarget && this.parent.linkTarget.setNameValue(this.param, this.state);
    this.onToggle();
    this.valueFunc();
    regUpdate(this.parent);
  },
  setState: function(a) {
    this.state = a;
    regUpdate(this.parent)
  },
  onToggle: function() {},
  onToggleUp: function() {},
  onToggleDown: function() {},
  valueFunc: function() {},
  onHold: function() {},
  getState: function() {},
  paint: function() {
    null != this.key && (this.state = this.getVal());
    this.getState();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    this.text.length > 7 ? ctx.font = "16px Arial" : ctx.font = "18px Arial";
    isDefined(this.state) && null != this.state || (this.state = 0);
    this.disabled && (ctx.globalAlpha = .2);
    this.needBG && (ctx.fillStyle = color.eqBg,
      ctx.fillRect(0, 0, this.w, this.h));
    switch (this.state) {
      case 0:
        this.invertedValue ? this.drawDOWNState() : this.drawUPState();
        break;
      case 1:
        this.invertedValue ? this.drawUPState() : this.drawDOWNState();
    }
    this.disabled && (ctx.globalAlpha = 1);
    if(this.longClickMark) {
      ctx.fillStyle = this.lmColor;
      var a = 4;
      if(this.invertedValue && !this.state || !this.invertedValue
          && this.state)
        a += 1;
      ctx.fillRect(this.w - 9, a, 4, 4);
    }
  },
  drawUPState: function() {
    null != this.img1 ? drawImage(this.img1, 0, 0) : (ctx.fillStyle = this.clr0,
      ctx.fillRoundRect(0, 0, this.w, this.h, 7), this.text != '' && (ctx.fillStyle = this.textClr0, ctx.fillText(this.text, this.w/2, this.h/2, this.w)))
  },
  drawDOWNState: function() {
    null != this.img2 ? drawImage(this.img2, 0, 0) : (ctx.fillStyle = this.clr1,
      ctx.fillRoundRect(0, 0, this.w, this.h, 7), this.text != '' && (ctx.fillStyle = this.textClr1, ctx.fillText(this.text2 || this.text, this.w/2, this.h/2, this.w)));
  }
});

Strip = Class.create(Widget, {
  initialize: function($super, b, c, d, e) {
    $super(b);
    this.widgetName = "Strip";
    this.id = c;
    this.subId = e;
    this.type = d;
    this.icon = false;
    this.w = measures.mixerStripWidth;
    this.text = "CH X";
    this.color = "#FFFFFF";
    this.stereo = !1;
    this.cacheH = 0;

    switch (this.type) {
      case E_STRIP_TYPE.IN:
        this.name = "i." + e + '.';
        this.color = color.INPUT;
        this.icon = true;
        break;
      case E_STRIP_TYPE.FX:
        this.name = "f." + e + '.';
        this.color = color.blue;
        this.stereo = !0;
        break;
      case E_STRIP_TYPE.AUX:
        this.name = "a." + e + '.';
        this.color = color.AUX;
        break;
      case E_STRIP_TYPE.PLAYER:
        this.name = "p." + e + '.';
        this.color = color.media;
        this.stereo = !0;
        break;
      case E_STRIP_TYPE.SUB:
        this.name = 's.' + e + '.';
        this.color = color.sub;
        this.stereo = !0;
        break;
      case E_STRIP_TYPE.MAIN:
        this.name = 'm.' + e + '.';
        this.color = color.red;
        this.stereo = !0;
        break;
      default:
        alert('unknow strip type')
    }
    this.widgetName += "(" + this.name + ")";
    this.initWidgets();
  },
  initWidgets: function() {
    //balance mute slide solo detail
    //pan checkbox slide checkbox detail
    var a = this;
    this._width = measures.mixerStripWidth - 10;
    this._height = 25;

    this.pan = new PanSlider(this);
    this.pan.key = this.name + 'pan';
    this.pan.setPos(5, 4);
    this.pan.setSize(this._width, this._height);

    this.mute = new CheckBox(this);
    this.mute.setPos(5, 34);
    this.mute.setSize(this._width, this._height);
    this.mute.textClr0 = 'black';
    this.mute.textClr1 = 'white';
    this.mute.param = 'mute';
    this.mute.setText("Mute");
    this.mute.clr0 = "#576069";
    this.mute.clr1 = "#DC7092";
    this.mute.getState = function() {
      this.state = a.getNameValue("mute");
    };
    this.mute.onToggleUp = function() {
      a.setNameValue("mute", 1);
    };
    this.mute.onToggleDown = function() {
      a.setNameValue("mute", 0);
    };

    var _y = screenHeight - measures.thumbImgHeight;
    this.detail = new Detail(this);
    this.detail.setPos(5, _y);
    this.detail.icon = this.icon;
    this.detail.param = 'name';
    this.detail.setSize(102, measures.thumbImgHeight);
    //console.log(this.detail.x, this.detail.y, this.detail.w, this.detail.h);

    _y -= (30 + 4)
    this.solo = new CheckBox(this);
    this.solo.setPos(5,_y - 4);
    this.solo.setSize(this._width, this._height);
    this.solo.setText("Solo");
    this.solo.param = 'solo';
    this.solo.textClr0 = 'black';
    this.solo.textClr1 = 'white';
    this.solo.clr0 = "#576069";
    this.solo.clr1 = "#89BFB2";
    this.solo.getState = function() {
      this.state = a.getNameValue("solo");
    };
    this.solo.onToggleUp = function() {
      a.setNameValue("solo", 1);
    };
    this.solo.onToggleDown = function() {
      a.setNameValue("solo", 0);
    };

    this.sl = new Slider(this,this.type);
    this.sl.setPos(0, this.mute.y + this._height + 15);
    this.sl.color = this.color;
    this.sl.param = "mix";
    this.sl.key = this.name + 'mix';
    this.sl.w = this.w;
    this.sl.laneOffset = this.w * 0.5;
    this.sl.faderX = this.w * 0.5;
    this.sl.bottomMargin = 24;
    this.sl.lane = this.type != E_STRIP_TYPE.IN;
    this.sl.onDouble = function() {
      console.log('double click channel');
    }
    this.sl.onDoubleKnob = function() {
      a.sl.setValue(measures.db0);
    }

    if(this.stereo){
      this.vu = new VUMeter(this);
      this.vu.setAnchors(63, 149, null, 101);

      this.vu2 = new VUMeter(this);
      this.vu2.setAnchors(76, 149, null, 101);
    }else {
      this.vu = new VUMeter(this);
      this.vu.setAnchors(70, 149, null, 101);
    }
  },
  getNameValue: function(a) {
    return getValue(this.name + a)
  },
  setNameValue: function(a, b) {
    setValue(this.name + a, b);
    regUpdate(this);
  },
  calcGeometry: function() {
    this.h = this.parent.h;
  },
  setVU: function(a, b, c, d, e, f, g, h) {
    this.vu.setValueExt(a, b);
    //this.name == 'a.0.' && console.log(a, b);

    this.stereo && this.vu2.setValueExt(c, d);
  },
  getName: function() {
    return getValue(this.name + "name");
  },
  setName: function(a) {
    setValue(this.name + "name", a);
  },
  setLinked: function(a) {
    if(this.type = E_STRIP_TYPE.IN) {
      if(a) {
        this.linkTarget = inStrips[this.id + (this.id % 2 ? -1 : 1)];
        this.copySettings(!0);
        this.linkTarget.pasteSettings();

        if(this.name[2] > this.linkTarget.name[2]) {
          setValue(this.name + 'stereoIndex', 1);
          setValue(this.linkTarget.name + 'stereoIndex', 0);
        }else {
          setValue(this.name + 'stereoIndex', 0);
          setValue(this.linkTarget.name + 'stereoIndex', 1);
        }
        

        if(this.id < this.linkTarget.id) {
          setValue(this.name + "pan", 0);
          setValue(this.linkTarget.name + "pan", 1);
        }else {
          setValue(this.name + "pan", 1);
          setValue(this.linkTarget.name + "pan", 0);
        }
      }else {
        this.linkTarget = inStrips[this.id + (this.id % 2 ? -1 : 1)];
        setValue(this.linkTarget.name + 'bind', 0);

        setValue(this.name + 'stereoIndex', -1);
        setValue(this.linkTarget.name + 'stereoIndex', -1);

        setValue(this.name + 'pan', 0.5);
        setValue(this.linkTarget.name + 'pan', 0.5);
      }
      regUpdate(this);
      regUpdate(this.linkTarget);
      mode == E_MODE.EDIT && (editWidget.upd(),
        regUpdate(editWidget));
    }
  },
  copySettings: function(a) {
    settingsBuffer = {};
    a = isDefined(a);
    for (var b in dataValue)
        !dataValue.hasOwnProperty(b) || 
        !b.contains(this.name) || b.contains(".name") || b.contains(".defname") || b.contains(".stereoIndex") || b.contains(".slave") || b.contains(".stereo") || !a && b.contains(".mgmask") || !a && b.contains(".subgroup") || b.contains(".gain") && !b.contains(".eq.") || b.contains(".phantom") || b.contains(".invert") || b.contains(".hiz") || b.contains(".digitech") || b.contains(".safe") || !a && b.contains(".mute") && !b.contains(".aux.") && !b.contains(".fx.") || !a && b.contains(".solo") || !a && b.contains(".forceunmute") || 
        (settingsBuffer[b.replace(this.name, "")] = dataValue[b]);
    settingsBufferType = this.type
  },
  pasteSettings: function() {
    if (settingsBufferType != this.type)
        console.log(lang.INCOMPATIBLE_CHANNEL_TYPE);//showPopupMsg(lang.INCOMPATIBLE_CHANNEL_TYPE, 1E3);
    else
        for (var a in settingsBuffer)
            settingsBuffer.hasOwnProperty(a) && isDefined(dataValue[this.name + a]) && (setValue(this.name + a, settingsBuffer[a])/*,
            updateByKey(this.name + a)*/)
  },
  paint: function() {
    this.cacheH != this.h && this.cachePaint();
    drawImage(this.cache, 0, 0);
  },
  cachePaint: function() {
    this.cache = document.createElement('canvas');
    var a = this.cache.getContext('2d');
    this.cache.width = this.w;
    this.cache.height = this.h;
    
    a.fillStyle = color.mesliderbg;
    a.fillRect(0, 0, this.w, this.h);

    a.fillStyle = '#576069';
    a.fillRoundRect(5, 4, this._width, this._height, 5);

    a.strokeStyle = '#01ecef';
    a.beginPath();
    a.moveTo(45, 4);
    a.lineTo(45, this._height + 4);
    a.stroke();
    //a.strokeRect(15, 14, 72, 10);

    a.strokeStyle = color.meslidermiddle;
    a.beginPath();
    a.moveTo(this.w / 2, 110);
    a.lineTo(this.w / 2, 144 + (this.sl.h - 98));
    a.lineWidth = 4;
    a.stroke();

    a.strokeStyle = color.black;
    a.beginPath();
    a.moveTo(this.w, 0);
    a.lineTo(this.w, this.h);

    a.moveTo(0, 0);
    a.lineTo(0, this.h);

    a.lineWidth = 2;
    a.stroke();

    if(1/*this.type != E_STRIP_TYPE.IN*/) {
      switch(this.type) {
        case E_STRIP_TYPE.FX:
          a.globalAlpha = .08;
          break;
        case E_STRIP_TYPE.PLAYER:
          a.globalAlpha = .05;
          break;
        case E_STRIP_TYPE.AUX:
          a.globalAlpha = .07;
          break;
        case E_STRIP_TYPE.SUB:
          a.globalAlpha = .07;
          break;
        default:
          a.globalAlpha = .07;
      }
      a.fillStyle = getValue(this.name + 'color') || this.color;
      a.fillRect(0, 0, this.w, this.h);
      a.globalAlpha = 1;
    }
    drawMarksDB(this.sl.h + 20, this.sl.y - 8, 35, a);
    this.cacheH = this.h;
  }
});

SimpleStrip = Class.create(Widget, {
  initialize: function($super, b, c, d, e) {
    $super(b);
    this.widgetName = "SimpleStrip";
    this.w = measures.editPageSimpleWidth;
    this.text = d;
    this.name = c + d + '.';
    this.real_text = e;
    this.initWidgets();
  },
  initWidgets: function() {
    var a = this;
    
    this.PF = new CheckBox(this);
    this.PF.setPos(5, 5);
    this.PF.setSize(80, 20);
    this.PF.param = 'PF';
    this.PF.setText("PF", "PF");
    this.PF.clr0 = "#576069";
    this.PF.clr1 = "#DC7092";
    this.PF.getState = function() {
      this.state = a.getNameValue("PF");
    };
    this.PF.onToggleUp = function() {
      a.setNameValue("PF", 1);
    };
    this.PF.onToggleDown = function() {
      a.setNameValue("PF", 0);
    };

    this.ON = new CheckBox(this);
    this.ON.setPos(5, 5);
    this.ON.setSize(80, 20);
    this.ON.param = 'ON';
    this.ON.setText("ON", "ON");
    this.ON.clr0 = "#576069";
    this.ON.clr1 = "#DC7092";
    this.ON.getState = function() {
      this.state = a.getNameValue("ON");
    };
    this.ON.onToggleUp = function() {
      a.setNameValue("ON", 1);
    };
    this.ON.onToggleDown = function() {
      a.setNameValue("ON", 0);
    };

    this.GAIN = new EQSlider(this);
    this.GAIN.fader = res.eqVFaderGray;
    this.GAIN.dbMarks = !0;
    this.GAIN.aclr = color.AUX;
    this.GAIN.getState = function() {
      a.GAIN.setKey(a.name + "gain");
      regUpdate(a.parent.parent.allDisplay);
    }
  },
  syncComponent: function() {
    this.GAIN.setKey(this.name + "gain");
  },
  getNameValue: function(a) {
    return getValue(this.name + a);
  },
  setNameValue: function(a, b) {
    setValue(this.name + a, b);
    regUpdate(this);
  },
  getState: function() {
    this.GAIN.setKey(this.name + 'gain');
  },
  calcGeometry: function() {
    this.ON.y = this.h - 45;

    this.GAIN.setPos((this.w - this.GAIN.w) /2, this.PF.y + 20 + 30);
    this.GAIN.h = this.h - this.ON.h - this.PF.h - 100;
  },
  paint: function() {
    this.getState();
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.fillStyle = this.color || color.white;
    ctx.textAlign = "center";
    ctx.font = "16pt Arial";
    //console.log(this.GAIN.key);
    ctx.fillText(this.real_text || this.text, this.w / 2, this.ON.y - 15)
    ctx.fillText(VtoGain2(this.GAIN.getVal()), this.w / 2, this.GAIN.y - 5);
  }
});

EQSlider = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "EQ_SLIDER";
    this.needMoveEvt = !0;
    this.lastClickTime = 0;
    this.background = color.eqBg;
    this.w = 50;
    this.h = 260;
    this.minValue = 0;
    this.maxValue = 1;
    this.oldValue = this.value = 0;
    this.defaultValue = -1;
    this.fader = res.eqVFaderGray;
    this.faderCenterY = 14;
    this.faderH = this.fader.h() - this.faderCenterY;
    this.faderW = this.fader.w();
    this.faderX = 13;
    this.fadd = 20;
    this.meOffsetX = 0;
    this.textBot = this.textUp = "";
    this.bigMark = -1;
    this.keyPart = null;
    this.dbMarks = this.slide = !1;
    this.mV = [1, .9, .8, .7, .6, .5, .4, .3, .2, .1, 0];
    this.smV = [];
    this.moved = !1;
    this.aclr = "#fff";
    this.disabled = this.rightArrow = this.leftArrow = !1
  },
  contains: function(a, b, c) {
    if(!this.enabled || !this.visible)
      return !1;
    if (c) {
      return this.x <= a && this.x + this.w > a && this.y <= b && this.y + this.h > b;
    }
    c = this.x;
    var d = this.y + (this.h - this.faderH) * (1 - this.getVal()),d = d | 0;
    return c <= a && c + this.w > a && d - 10 <= b && d + this.faderH + 10 > b;
  },
  setFader: function(a, b) {
    this.fader = a;
    this.faderCenterY = b;
    this.faderH = this.fader.h() - this.faderCenterY;
    this.faderW = this.fader.w();
  },
  setDefaultValue: function(a) {
    this.bigMark = 0 <= a ? this.defaultValue = bound(a, 0, 1) : this.defaultValue = -1;
  },
  setValue: function() {
    a = bound(a, 0, 1);
    this.setVal(a);
    this.valueFunc(a);
    regUpdate(this);
  },
  onDown: function(a, b) {
    if (!this.disabled) {
      
      this.pressPoint = [a, b];
      this.moved = !1;
      var c = this.globalX() + 10 + this.faderX,
          d = this.globalY() + (this.h - this.faderH) * (1 - this.getVal()),
          d = d | 0;
      if(this.slide = c - 10 <= a && c + this.faderW + 10 >= a && d - 10 <= b && d + this.faderH + 10 >= b)
        this.oldValue = this.getVal(),console.log(a, b, 'sliderDown'),
        this.onFocus();
    }
  },
  onMove: function(a, b) {
    if(this.slide) {
      var c = b - this.pressPoint[1];
      5 < Math.abs(c) && (this.moved = !0);
      c = bound(this.oldValue - c / (this.h - this.faderH),
        this.minValue, this.maxValue);
      this.setVal(c);
      this.value = c;
      this.onValueChange();
      this.valueFunc(c);
      regUpdate(this);
      regUpdate(this.parent);
    }
  },
  onUp: function() {
    this.oldValue = 0;
    this.pressPoint = [-1, -1];
    this.slide = !1;
    var a = Date.now();
    if (a - this.lastClickTime < DBL_CLK_TIME)
      this.onDouble();
    this.moved || (this.lastClickTime = a);
  },
  onWheel: function(a) {
    if (!this.disabled) {
      var b = this.getVal(), b = bound(b + a / 120 / 30, 0, 1);
      this.setVal(b);
      this.onValueChange();
      this.valueFunc(b);
      regUpdate(this.parent)
    }
  },
  drawMarks: function() {

  },
  onDouble: function() {

  },
  onValueChange: function() {},
  onFocus: function() {},
  valueFunc: function(a) {},
  getState: function() {},
  paint: function() {

    /*ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.w, this.h)*/

    this.getState();
    ctx.fillStyle = this.background;
    ctx.fillRect(0, 0, this.w, this.h + 10);
    this.disabled && (ctx.globalAlpha = .15);
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    var a = this.w / 2 | 0 + this.meOffsetX;
    this.disabled || (ctx.strokeStyle = "#AAA",
    ctx.beginPath(),
    ctx.moveTo(a + .5, 4.5),
    ctx.lineTo(a + .5, this.h - 8 + .5),
    ctx.stroke());
    ctx.strokeStyle = color.black;
    ctx.beginPath();
    ctx.moveTo(a, 4);
    ctx.lineTo(a, this.h - 8);
    ctx.stroke();
    this.drawMarks();
    a = (this.h - this.faderH) * (1 - this.getVal());
    drawImage(this.fader, this.faderX, a | 0);
  }
});

PanSlider = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "PanSlider";
    this.param = "pan";
    this.sliderW = res.panSlider.w();
    this.needMoveEvt = !0;
    this.oldValue = this.value = this.lastClickTime = 0;
    this.defaultValue = .5;
    this.grad = this.parent.stereo ? color.mPanGrad : color.panGrad;
    this.timer = null;
    this.disabled = this.moved = this.lastP = this.slide = !1;
    this.drawTextBool = false;
  },
  onDown: function(a, b) {
    clearTimeout(this.timer);
    this.drawTextBool = true;
    if(this.disabled) {
      this.onDisabledClick();
    }else {
      /*var c = this.globalX() + (this.w - this.sliderW) * this.getVal(),d = this.globalY(),c = c | 0;
      this.slide = c - 8 <= a && c + this.sliderW + 8 >= a && d <= b && d + this.h >=b;*/
      this.slide = !0;
      this.moved = !1;
      this.slide && (this.oldValue = this.getVal(), this.pressPoint = [a, b]);
      regUpdate(this.parent);
    }
  },
  onMove: function(a, b) {
    if(this.slide && !this.disabled) {
      var c = a - this.pressPoint[0];
      3 < Math.abs(c) && (this.moved = !0);
      c = bound(this.oldValue + c / (this.w - this.sliderW), 0, 1);
      this.setVal(c);
      this.onValue();
      regUpdate(this.parent);
    }
  },
  onUp: function() {
    this.drawTextBool = false;
    if( !this.disabled ) {
      var a= Date.now();
      a - this.lastClickTime < DBL_CLK_TIME && !this.moved && !this.lastP && (this.setVal(this.defaultValue), 
        this.lastClickTime = 0,regUpdate(this.parent));
      this.lastP = this.moved;
      this.lastClickTime = a;
      this.slide = this.moved = !1;
      this.oldValue = 0;
      this.pressPoint = [-1, -1];
      this.onValue();
    }
    regUpdate(this.parent);
  },
  onWheel: function (a) {
    var b = this.getVal(),b = bound(b + a / 120 / 30, 0, 1);
    this.setVal(b);
    regUpdate(this.parent);
  },
  onDisabledClick: function() {},
  onValue: function() {},
  getState: function() {
    /*if(this.defaultValue == 0.5) {
      this.setVal(0.5);
      this.defaultValue = 0;
    }*/
  },
  paint: function() {
    this.getState();
    this.grad = color.panGrad;

    var a = this.w - this.sliderW,
        b = a * this.getVal() + .5 | 0,
        c = this.w /2;
    this.disabled &&  (ctx.globalAlpha = .5, b = .5 * a + .5 | 0);
    ctx.fillStyle = this.grad;
    ctx.fillRect(c, this.h / 2 - 8, b - c + (this.sliderW / 2 | 0), 16);
    // draw slider
    //drawImage(res.panSlider, b, 0);
    var d = VtoPAN(this.getVal());
    
    if(this.drawTextBool) {
      var text = 0 < d ? "R " + d : 0 > d ? "L " + -d : lang.CENTER;
      ctx.textAlign = 'center';
      ctx.textBaseline = "middle";
      ctx.font = "14px Arial";
      ctx.fillStyle = color.INPUT;
      ctx.fillText(text, this.w/2, this.h/2);
    }
    this.disabled && (ctx.globalAlpha = 1);
  }
});

Detail = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "Detail";
  },
  onDown: function() {
    selectedChannel = this.parent.id;
    selectedStrip = this.parent;
    setMode(E_MODE.EDIT)
    regUpdate(this);
  },
  calcGeometry: function() {},
  paint: function() {
    ctx.fillStyle = '#576069';
    ctx.fillRect(0, 0, this.w - 20, this.h);

    ctx.fillStyle = color.black;
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";

    var _name = this.parent.getNameValue('name');
    this.icon ? (ctx.font = "16px Arial", ctx.fillText(_name, measures.mixerStripWidth / 2 - 5, 
      measures.thumbImgHeight / 2)/*, drawImageScale(res.me1, 10, 15, 90, 50)*/) : 
        ctx.font = "18px Arial", ctx.fillText(_name, measures.mixerStripWidth / 2 - 5, measures.thumbImgHeight / 2);
  }
});

Slider = Class.create(Widget, {
  initialize: function($super, b, c) {
    $super(b);
    this.widgetName = "Slider";
    this.id = this.parent.id;
    this.key = null;
    this.type = c;
    this.param = null;
    switch(c) {
      case E_STRIP_TYPE.IN:
        this.fader = res.fader;
        this.color = color.INPUT;
        break;
      case E_STRIP_TYPE.AUX:
        this.fader = res.fader;
        this.color = color.AUX;
        break;
      case E_STRIP_TYPE.FX:
        this.fader = res.fader;
        this.color = color.blue;
        break;
      case E_STRIP_TYPE.SUB:
        this.fader = res.fader;
        this.color = color.sub;
        break;
      case E_STRIP_TYPE.PLAYER:
        this.fader = res.fader;
        this.color = color.media;
        break;
      case E_STRIP_TYPE.MAIN:
        this.fader = res.redFader;
        this.color = "transparent";
        break;
      default:
        this.fader = res.fader,
        this.color = "#ffffff"
    };
    this.w = this.x = 0;
    this.y = 90;
    this.laneOffset = this.faderX = this.bottomMargin = 0;
    this.needMoveEvt = this.redrawParent = !0;
    this.oldValue = this.value = this.lastClickTime = 0;
    this.faderH = this.fader.h() - 12;
    this.faderW = this.fader.w();
    this.slide = this.pressed = !1;
    this.touchID = -1;
    this.linked = !1;
    this.canScroll = !0;
    this.dy = 0;
    this.lastPressPoint = [-1, -1];
    this.locked = settings.masterLock;
    this.hist = [0, 0];
    this.master = !1;
    this.lane = !0;
    this.noUp = !1;
    this.noUpValue = 1;
    this.disabled = !1;
    this.simple = !1;
    this.step = 1;
  },
  calcGeometry: function() {
    var soloh = this.parent.solo ? this.parent.solo.h : 0;
    var detailh = this.parent.detail ? this.parent.detail.h : 0;
    this.h = this.parent.h - this.bottomMargin - this.y - soloh - detailh;
  },
  onDown: function(a, b, c) {
    if(!this.disabled) {
      mixerTouches++;
      var d = this;
      clearTimeout(this.holdTimer);
      this.currentPoint = [a, b];
      if(!this.pressed) {
        this.pressed = !0;
        this.touchID = c;
        var e = this.globalX() + this.faderX,
            f = this.globalY() + (this.h - this.faderH) * (1 - this.getVal()),
            f = f | 0;
        this.slide = e - 10 <= a && e + this.faderW + 10 + 5 >= a && f - 10 <= b && f + this.faderH + 10 >= b;
        this.lastPressPoint = this.pressPoint;
        this.pressPoint = [a, b];
        if(this.slide && (scrollLock++, this.oldValue = this.getVal(), 1 == scrollLock))
          this.onFocus();
        this.master && settings.masterLock ? (this.locked = !0, this.slide = !1) : this.locked = !1;
        regUpdate(this);
      }
      this.canScroll && this.parent.parent.startScroll(a, c);
    }
  },
  onMove: function(a, b, c) {
    if( !this.disabled && (this.currentPoint = [a, b], !this.locked)) {
      if( this.touchID == c && this.slide) {
        b -= this.pressPoint[1];
        this.dy = Math.abs(b);
        var d = bound(this.oldValue - b / (this.h - this.faderH), 0, 1);

        if(this.step !== 1) {
          d !== 1 && (d -= (d % this.step));
        }

        if(this.noUp && d > this.noUpValue && 0 > b) {
          return;
        }
          
        this.setVal(d);
        this.linked && null != this.parent.linkTarget && this.parent.linkTarget.setNameValue("mix", d);
        this.onValue();
        regUpdate(this);
      }
      this.canScroll && this.parent.parent.setScroll(a, c);
    }
  },
  onUp: function(a) {
    if(!this.disabled && (mixerTouches--, this.canScroll && this.parent.parent.endScroll(a), this.touchID == a)) {
      clearTimeout(this.holdTimer);
      if(this.locked){
        0 < scrollLock && scrollLock--;
        this.press = !1;
        this.touchID = -1;
        this.slide = !1;
      }else {
        this.slide && (this.oldValue = 0, scrollLock--);
        a = Date.now();
        var b = Math.abs(this.lastPressPoint[0] - this.pressPoint[0]),
            c = Math.abs(this.lastPressPoint[1] - this.pressPoint[1]);
        if(15 > b && 15 > c && a - this.lastClickTime < DBL_CLK_TIME) {
          if(this.slide)
            this.onDoubleKnob();
          else
            this.onDouble();
          this.lastClickTime = a - DBL_CLK_TIME
        }else
          this.lastClickTime = a;
        this.pressed = !1;
        this.touchID = -1;
        this.slide = !1;
        this.master && settings.masterLock && (this.locked = !0)
      }

      this.parent.parent.showLimit = !1;
      regUpdate(this);
    }
  },
  onhold: function() {},
  onWheel: function(a) {
    if(!(this.disabled || this.master && settings.masterLock)) {
      var b = this.getVal(), b= bound(b + a / 120 / 30, 0, 1);

      if(this.step !== 1) {
        d !== 1 && (d -= (d % this.step));
      }

      this.noUp && b > this.noUpValue || (this.setVal(b), regUpdate(this))
    }
  },
  setValue: function(a) {
    this.setVal(a);
    this.onValue();
    regUpdate(this);
  },
  showLimitfunc: function(a) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.moveTo(this.w, 0);
    ctx.quadraticCurveTo(80-a*3,this.h * 0.5,this.w,this.h);
    //ctx.stroke();
    ctx.fill();
  },
  onDouble: function() {},
  onDoubleKnob: function() {},
  onFocus: function() {
    //set which channel is selected
  },
  onValue: function() {},
  getState: function() {},
  paint: function() {
    this.getState();
    this.value = this.getVal();
    var a = (this.h - this.faderH) * (1 - this.value), a = a | 0;
    this.disabled && (ctx.globalAlpha = 0.5);
    if(this.lane && 0 != settings.lanes) {
      ctx.strokeStyle = this.color;
      var b = a + this.faderH - 20,
          c = this.h - 27,
          d = this.w - this.laneOffset;
      0 < c - b && (ctx.beginPath(),
      ctx.moveTo(d, b),
      ctx.lineTo(d, c),
      ctx.lineCap = "round",
      ctx.lineWidth = 1 == settings.lanes? 2: 4,
      ctx.stroke());
    }

    var _middle = (this.w - this.faderW) * 0.5;
    var _textMiddle = _middle + this.faderW * 0.5;
    drawImage(this.fader, _middle + 0.5, a);
    ctx.textAlign = "center";
    ctx.fillStyle = this.color;
    ctx.font = "16px Arial";
    !this.simple && ctx.fillText(this.parent.text, _textMiddle, this.h + 10);
    !this.simple && ctx.fillText(VtoDB(this.value), _textMiddle, 0);
    b = this.faderX;
    a += 34;
    if(isDefined(this.parent.getNameValue) && this.type !== E_STRIP_TYPE.PLAYER)
      switch (this.parent.getNameValue("stereoIndex")) {
        case 0:
          ctx.fillStyle = this.color;
          ctx.fillTriangle2(_middle + 35, a - 10, _middle - 8 + 35, a, _middle + 35, a + 10);
          break;
        case 1:
          ctx.fillStyle = this.color;
          ctx.fillTriangle2(b - 23, a - 10, b - 15, a, b - 23, a + 10)
      }
    this.master && settings.masterLock && this.locked && (ctx.setShadow(color.black, 4, 2, 2),
      drawImage(res.lock, this.faderX + 5.5, this.h - 25));

    if((this.id === 7 || this.id === 15) && this.parent.parent.showLimit) {
      var _c = bound(this.parent.parent.showLimitValue, -20, 20);
      this.showLimitfunc(_c);
    }
  }
});

vuPattern = null;
VUMeter = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "VUMeter";
    this.w = measures.vuWidth;
    this.bottomMargin = 0;
    this.needEvt = !1;
    this.bh = 12;
    this.ghostFallVelocity = this.ghostValueBg = this.ghostValue = this.pFallVelocity = this.pValue = this.fallVelocity = this.valueBg = this.value = 0;
    this.clipping = !1;
    this.gridImg = null;
    this.cachedHeight = -1;
    this.gain = !1;
    null == vuPattern && (vuPattern = createPattern(res.vuTexture, "repeat-y"));
    this.fillTexture = vuPattern;
    this.ignoreGrad = !1;
    this.ptimer = null;
    this.curpPos = this.curgPos = this.curPos = 0;
    this.quant = this.isTicking = !1;
    this.vuGradH = 0;
    this.vuGradGain = this.vuGrad4 = this.vuGrad3 = this.vuGrad2 = this.vuGrad = null;
    this.disabled = !1;
  },
  reset: function() {
    this.pValue = this.ghostValue = this.ghostValueBg = this.value = this.valueBg = 0;
    regUpdate(this)
  },
  setPos: function($super, b, c, d) {
    $super(b, c);
    this.bottomMargin = d
  },
  calcGeometry: function(){
    this.y = 110 + (this.parent.sl.h - 78) * (1 - zeroDbPos);
    this.h = (this.parent.sl.h - 78) * (zeroDbPos);
  },
  onResize: function() {
    this.createGradient();
  },
  createGradient: function() {
    this.vuGradH == this.h || this.ignoreGrad || 1 > this.h || (this.vuGrad = ctx.createLinearGradient(0, this.h, 0, 0),
    this.vuGrad.addColorStop(0, "green"),
    this.vuGrad.addColorStop(.5, "yellow"),
    this.vuGrad.addColorStop(1, "red"),
    this.vuGrad2 = ctx.createLinearGradient(0, this.h, 0, 0),
    this.vuGrad2.addColorStop(0, "#494"),
    this.vuGrad2.addColorStop(.5, "#aa3"),
    this.vuGrad2.addColorStop(1, "#d44"),
    this.vuGrad3 = ctx.createLinearGradient(0, this.h, 0, 0),
    this.vuGrad3.addColorStop(0, "#345C7F"),
    this.vuGrad3.addColorStop(1, "#698CAF"),
    this.vuGrad4 = ctx.createLinearGradient(0, this.h, 0, 0),
    this.vuGrad4.addColorStop(0, "#296BA0"),
    this.vuGrad4.addColorStop(1, "#60A5EA"),
    this.vuGradGain = ctx.createLinearGradient(0, this.h, 0, 0),
    this.vuGradGain.addColorStop(0, "#FF9900"),
    this.vuGradGain.addColorStop(1, "#FF0000"),
    this.vuGradH = this.h)
  },
  setValueExt: function(a, b) {
    //console.log(this.parent.name, 'setValueExt', a, b),console.log(this.parent.name, 'dd');
    //if(this.parent.name == 'a.0.') {console.log(b - this.valueBg, a - this.ghostValueBg)}
    if(!settings.disableVUs) {
      //console.log(this.parent.name, '11')
      if(!this.globalEnabled()) {
        /*console.log(this.parent.name, '22')
        if(this.value = this.valueBg = bound(b, 0, 4),this.ghostValue = this.ghostValueBg = bound(a, 0, 4),this.valueBg > this.pValue) {
           console.log(this.parent.name, 'here'),
            this.pValue = this.valueBg,
            this.pFallVelocity = 0,
            clearTimeout(this.ptimer),
            this.ptimer = null;
        }else {
          var c = this;
          console.log(this.parent.name, 'there')
          null == this.ptimer && (this.ptimer = setTimeout(function() {
            c.pFallVelocity = GLOBAL_VU_FALL_SPEED / 2;
            c.isTicking || (c.isTicking = !0,
              regTick(), console.log(c.parent.name, 1));
              c.ptimer = null
          }, PEAK_HOLD_TIME))
        }*/
      }else if (!(.0005 > Math.abs(b - this.valueBg) && .005 > Math.abs(a - this.ghostValueBg))) {
        this.valueBg = bound(b, 0, 4);
        this.ghostValueBg = bound(a, 0, 4);

        //console.log(this.parent.name, '33')

        //f: set vu high 
        var d = !1, e = !1, f = this.h * this.valueBg | 0;
        f > this.h % 12 && (f = f - f % 12 + this.h % 12);
        this.curPos != f && (this.value < this.valueBg ? (this.value = this.valueBg,
        e = !0) : (this.fallVelocity = GLOBAL_VU_FALL_SPEED,d = !0));

        //peak
        /*settings.disableVUpeak || (this.pValue < this.valueBg ? (this.pValue = this.valueBg,
        this.pFallVelocity = 0,clearTimeout(this.ptimer),this.ptimer = null ) : (c = this,
        null  == this.ptimer && (this.ptimer = setTimeout(function() {
            c.pFallVelocity = GLOBAL_PEAK_FALL_SPEED;
            c.isTicking || (c.isTicking = !0,
            regTick(c), console.log(this.parent.name, 2));
            c.ptimer = null 
        }, PEAK_HOLD_TIME))));*/

        /*this.disableVUghost || (f = this.h * this.ghostValueBg | 0,
        f > this.h % 12 && (f = f - f % 12 + this.h % 12),
        this.curgPos != f && (this.ghostValue < this.ghostValueBg ? (this.ghostValue = this.ghostValueBg,
        e = !0) : (this.ghostFallVelocity = GLOBAL_VU_FALL_SPEED,
        d = !0)));*/

        d && !this.isTicking && (this.isTicking = !0,
        regTick(this));
        e && regUpdate(this)
      }
    }
  },
  tick: function() {
    //console.log(this.parent.name, 'tick')
    var a = !1, b = !1;
    if(this.value <= this.valueBg)
        this.value = this.valueBg;
    else {
      this.value -= this.fallVelocity;
      this.fallVelocity += GLOBAL_VU_FALL_ACC;
      this.value < this.valueBg ? this.value = this.valueBg : a = !0;//not end
      var c = this.h * this.value | 0;
      settings.vuquantise && c > this.h % 12 && (c = c - c % 12 + this.h % 12);
      this.curPos != c && (b = !0);
    }
    //disableVUghost

    //disableVUpeak
    /*settings.disableVUpeak || (this.pValue <= this.valueBg ? this.pValue = this.valueBg : 0 < this.pValue && 0 < this.pFallVelocity && (this.pValue -= this.pFallVelocity,
      this.pFallVelocity += GLOBAL_PEAK_FALL_ACC,this.pValue < this.valueBg ? this.pValue = this.valueBg : a = !0,
      c = this.h * this.pValue | 0,
      settings.vuquantise && c > this.h % 12 && (c = c - c % 12 + this.h % 12),
      this.curpPos != c && (b = !0)));*/
    a ? regTick(this) : this.isTicking = !1;
    b && regUpdate(this);
  },
  paint: function() {
    //console.log(this.parent.name, 'paint')
    ctx.fillStyle = this.disabled ? "#000" : color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);
    this.disabled && (ctx.globalAlpha = .3);
    if(!settings.disableVUs) {
      var a = this.h * this.value | 0;
      settings.vuquantise && a > this.h % 12 && (a = a - a % 12 + this.h % 12);
      this.curPos = a;
      a = bound(a, 0, this.h);
      ctx.fillStyle = this.gain ? this.vuGradGain : settings.dimVUs ? this.vuGrad2 : this.vuGrad;
      ctx.fillRect(2, this.h - a, this.w - 4, a);
      if(!settings.disableVUghost) {
        var b = this.h * this.ghostValue | 0;
        settings.vuquantise && b > this.h % 12 && (b = b - b % 12 + this.h % 12);
        this.curgPos = b;
        b = bound(b, 0, this.h);
        b > a && (ctx.fillStyle = 1 > a ? this.vuGrad4 : this.vuGrad3, ctx.fillRect(2, this.h - b, this.w - 4, b - a))
      }
      settings.disableVUpeak || (a = this.h * this.pValue | 0, settings.vuquantise && a > this.h % 12 && (a = a - a % 12 + this.h % 12),
        this.curpPos = a,
        12 < a && a < this.h && (ctx.fillStyle = this.gain ? this.vuGradGain : settings.dimVUs ? ths.vuGrad2 : this.vuGrad,
          ctx.fillRect(2, this.h - a, this.w - 4, settings.vuquantise ? 0 : 0)))
    }
    ctx.fillStyle = this.fillTexture;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#090B0F";
    ctx.fillRect(0, this.h - 2, this.w, 2);
    ctx.fillRect(0, 0, this.w, 2);
    ctx.fillStyle = '#22303c';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(1, 1, this.w-2, this.h-1);
  }
});

velocity = 0;
PLISTS = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "PLAYER_LIST";
    this.label = lang.FILES;
    this.bg = "#00182b";
    this.needMoveEvt = !0;
    this.lastClickTime = 0;
    this.items = [];
    this.selectedIdx = this.selected = -1;
    this.selectedItem = null;
    this.hoverIdx = this.activeItemIdx = -1;
    this.font = "12px";
    this.itemH = 50;
    this.vOffsetOld = this.vOffset = 0;
    this.vScrollEnabled = !0;
    this.vScrollWidth = 8;
    this.selTextColor = this.textColor = color.white;
    this.selItemColor = "#eee";
    this.activeTextColor = "#e33";
    this.selectCanceled = !1;
    this.OY = 29;
    this.linkSelectedWith = this.linkOffsetsWith = null;
  },
  setItems: function(a, b) {
    Array.isArray(a) && (isDefined(b) || (b = !0),
    this.items = a,
    this.maxVOffset = this.items.length * this.itemH - this.h + this.OY,
    0 > this.maxVOffset && (this.maxVOffset = 0),
    b && this.setOffset(0),
    regUpdate(this));
  },
  clear: function() {
    this.items.clear();
    this.clearSelection()
  },
  getActiveItem: function() {},
  selItem: function() {
    return 0 <= this.selectedIdx && this.selectedIdx < this.items.length ? this.items[this.selectedIdx] : null
  },
  select: function(a, b, c) {
    a >= this.items.length || (isDefined(b) ||(b = !1), 
      0 > a ? (this.selectedIdx = this.selected = -1,
      this.selectedItem = null) : (this.selectedIdx = this.selected = a,
      this.selectedItem = this.items[a]),
      !b && this.linkSelectedWith && this.linkSelectedWith.select(a, !0),
      !c && this.onSelect(), regUpdate(this));
  },
  selectByName: function(a) {
    a = this.items.indexOf(a);
    0 <= a && this.select(a);
    regUpdate(this);
  },
  selectLast: function() {
    0 != this.items.length && this.select(this.items.length - 1);
  },
  clearSelection: function() {
    this.select(-1);
  },
  setOffset: function(a) {
    this.vOffsetOld = this.vOffset = bound(a, 0, this.maxVOffset);
    regUpdate(this);
    this.linkOffsetsWith && (this.linkOffsetsWith.vOffsetOld = this.linkOffsetsWith.vOffset = bound(a, 0, this.linkOffsetWith.maxVOffset),
      regUpdate(this.linkOffsetsWith));
  },
  onDown: function(a, b) {
    var c = b - this.globalY(),
        d = a - this.globalX();

    c < this.OY || (this.pressPoint = [d, c],
      this.selectCanceled = !1,
      this.vScrollEnabled && d > this.w - this.vScrollWidth ? this.selectCanceled = !0 : 
      this.hoverIdx = Math.floor((this.pressPoint[1] + this.vOffset - this.OY) / this.itemH),
      0 < this.maxVOffset && this.velStart(),regUpdate(this));
  },
  onMove: function(a, b) {
    var c = b - this.globalY();
    this.globalX();
    c -= this.pressPoint[1];
    this.vOffset = this.vOffsetOld - c;
    this.vOffset = bound(this.vOffset, 0, this.maxVOffset);
    this.linkOffsetsWith && (this.linkOffsetsWith.vOffsetOld = this.linkOffsetsWith.vOffset = bound(this.vOffset, 0, this.linkOffsetsWith.maxVOffset),
        regUpdate(this.linkOffsetsWith));
    regUpdate(this);
    5 < Math.abs(c) && (this.selectCanceled = !0)
  },
  onUp: function() {
    if (!this.selectCanceled) {
        var a = Math.floor((this.pressPoint[1] + this.vOffset - this.OY) / this.itemH);
        this.selected != a && this.select(a)
    }
    this.onPress();
    a = Date.now();
    if (250 > a - this.lastClickTime)
        this.onDClick();
    this.lastClickTime = a;
    this.hoverIdx = -1;
    this.vOffsetOld = this.vOffset;
    this.pressPoint = [-1, -1];
    0 < this.maxVOffset && this.velRelease();
    regUpdate(this)
  },
  onWheel: function(a) {
      clearInterval(ticker);
      this.setOffset(this.vOffset - Math.round(a / 6))
  },
  velStart: function() {
      velocity = amplitude = 0;
      timestamp = Date.now();
      clearInterval(ticker);
      frame = this.vOffset;
      scrollingWidget = this;
      ticker = setInterval(this.velTrack, 20)
  },
  velTrack: function() {
      var a, 
      b;
      a = Date.now();
      b = a - timestamp;
      timestamp = a;
      a = scrollingWidget.vOffset - frame;
      frame = scrollingWidget.vOffset;
      velocity = 1E3 * a / (1 + b) * .8 + .2 * velocity
  },
  velRelease: function() {
      clearInterval(ticker);
      10 < Math.abs(velocity) && this.mScroll(velocity)
  },
  mScroll: function(a) {
      settings.kinetic || (position = this.vOffset,
      amplitude = .3 * a,
      step = 0,
      clearInterval(ticker),
      ticker = setInterval(function() {
        var a = amplitude / 20;
        position += a;
        amplitude -= a;
        step += 1;
        80 < step && clearInterval(ticker);
        scrollingWidget.vOffset != (position | 0) && scrollingWidget.setOffset(position | 0)
      }, 20))
  },
  calcGeometry: function() {
      this.maxVOffset = this.items.length * this.itemH - this.h + this.OY;
      0 > this.maxVOffset && (this.maxVOffset = 0);
      this.vOffset > this.maxVOffset && this.setOffset(this.maxVOffset)
  },
  onDClick: function() {},
  onSelect: function() {},
  onPress: function() {},
  valueFunc: function() {},
  getState: function() {},
  paint: function() {
    this.getState();
    ctx.fillStyle = this.bg;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.fillStyle = "#264863";
    ctx.fillRect(0, 0, this.w, this.OY - 1);
    ctx.fillStyle = color.white;
    ctx.font = "16px open_sans_condensedbold";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(this.label, 8, this.OY/2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#3D3E41";
    ctx.strokeRect(.5, .5, this.w - 1, this.h - 1);
    ctx.strokeRect(.5, .5, this.w - 1, 28);
    this.getActiveItem();
    var a = this.items.length * this.itemH;
    this.vScrollEnabled = a > this.h - this.OY;
    ctx.beginPath();
    ctx.rect(0, this.OY, this.w, this.h - this.OY);
    ctx.clip();
    ctx.font = this.font;
    ctx.textAlign = "left";
    ctx.shadowColor = "transparent";
    ctx.textBaseline = "middle";
    for (var b = this.w - 2, c = 0; c < this.items.length; c++) {
      var d = c * this.itemH - this.vOffset + 
      this.OY;
      d < -this.itemH || d > this.h || (this.selected == c && (ctx.fillStyle = this.selItemColor,
      ctx.fillRect(0, d, b, this.itemH)),
      this.hoverIdx == c && (ctx.fillStyle = "rgba(255,255,255,0.03)",
      ctx.fillRect(0, d, b, this.itemH)),
      ctx.fillStyle = this.selected == c ? this.selTextColor : this.textColor,
      this.selected == c && (ctx.fillStyle = color.black),
      this.activeItemIdx == c && (ctx.fillStyle = this.activeTextColor),
      ctx.fillText(this.items[c], 8, d + this.itemH / 2 | 0, b - 9),
      ctx.fillStyle = "rgba(255,255,255,0.1)",
      ctx.fillRect(0, d + this.itemH, b, -1))
    }
    this.vScrollEnabled && 
    (c = this.h - this.OY,
    a < c && (a = c),
    b = c / a * c,
    a = this.OY + 1 + this.vOffset / (a - c) * (c - 2 - b),
    ctx.fillStyle = "rgba(255,255,255,0.2)",
    ctx.fillRoundRect(this.w - this.vScrollWidth - 2, a | 0, this.vScrollWidth, b | 0, 7))
  }
});

FLIST = Class.create(PLISTS, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "PLAYER_LIST";
    this.items2 = [10, 1E3, 2E4, 300];
    this.col2 = 65;
    this.activeItemIdx = -1;
    this.label = lang.PLAYLISTS
  }
});

SEEKBAR = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.name = "SEEKBAR";
    this.color = "white";
    this.w = 100;
    this.h = 26;
    this.position = .4;
    this.hw = 0;
    this.needMoveEvt = !0;
    this.pos = .3;
    this.step = 1E3;
    this.timer = null ;
    this.curTime = 0;
    this.trackLength = 30;
    this.move = !1;
  },
  setTrackTime: function(a) {
    this.curTime = 0;
    this.trackLength = a
  },
  onDown: function(a, b) {
    /*isBlocked("player") ? showPopupMsg(lang.LOCKED, 800) : */(this.move = !0,
    this.ondown(),
    this.onMove(a, b))
  },
  onMove: function(a, b) {
    var c = bound(a - this.globalX(), 0, this.w);
    this.pos = c = bound(c / this.w, 0, 1);
    this.onmove(c);
    regUpdate(this)
  },
  onUp: function() {
    this.move = !1;
    this.onChange(this.pos);
    this.onup();
    regUpdate(this);
  },
  ondown: function() {},
  onmove: function(a) {},
  onup: function() {},
  onChange: function(a) {
    sendMessage(E_COMMANDS.MEDIA_JUMP_TO + "^" + a)
  },
  paint: function() {
    //this.position = this.move ? this.pos : bound(getValue("var.currentTrackPos"), 0, 1);
    this.position = bound(getValue("var.currentTrackPos"), 0, 1);//this.pos
    var a = (this.w - this.hw - 6) * this.position | 0;
    ctx.fillStyle = "#131415";
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.fillStyle = "#108ee9";
    ctx.fillRect(3, 3, a, this.h - 6);
    ctx.fillStyle = this.grd;
    ctx.fillRect(3, 3, a, this.h - 6);
    ctx.fillStyle = "#eee";
    ctx.fillRect(3 + a - 1, 3, 2, this.h - 6);
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.strokeRect(.5, .5, this.w - 1, this.h - 1)
  }
});

EDIT_STRIP = Class.create(Widget, {
  initialize: function($super, b){
    $super(b);
    this.widgetName = "EDIT_STRIP";
    this.strip = this.buff = null;
    this.lastClickTime = -1;
    this.onLabel = !1;
  },
  onShow: function() {
    this.setStrip();
  },
  onHide: function() {
    this.unStrip();
  },
  setStrip: function() {
    null != this.strip && this.unStrip();

    -1 != selectedChannel && (this.strip = allStrips[selectedChannel],this.strip.sl.canScroll = !1,
      this.strip_old_parent = this.strip.parent,this.strip.parent = this,
      this.buff = [this.strip.x, this.strip.enabled, this.strip.lastInGroup,
        this.strip.firstInGroup], this.strip.x = 0, this.strip.enabled = !0, this.strip.lastInGroup = !0,
        this.strip.firstInGroup = !0,this.strip.updateGeometry(), this.widgets.push(this.strip));
  },
  unStrip: function() {
    this.strip != null && (this.widgets.pop(),
      this.strip.parent = this.strip_old_parent,
      this.buff && (this.strip.x = this.buff[0],
        //if this.strip == master canscroll = !1
        this.strip.sl.canScroll = this.strip.text == 'MASTER' ? !1 : !0,
        this.strip.enabled = this.buff[1],
        this.strip.lastInGroup = this.buff[2],
        this.strip.firstInGroup = this.buff[3]),
      this.buff = this.strip = this.strip_old_parent = null);
  },
  calcGeometry: function() {
    this.x = 0;
    this.y = 0;
    this.w = measures.mixerStripWidth;
    this.h = screenHeight;
  },
  paint: function() {
  }
});

EDIT_PAGE = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "EDIT_PAGE";
    this.buttons = [];
    this.pages = [];
    this.mode = -1;
    this.color = color.white;
    this.lineOverGrad = null;
    this.arr=[];
    this.E_MODE = {
      channelSet: 0,
      scene: 1,
      vudis: 2,
      rec: 3,
      mainsend: 4,
      fxsend: 5,
      setting: 6
    },
    this.initWidgets();
    this.setMode(0);
  },
  initWidgets: function() {
    this.page_channelset = new CHANNELSET(this);
    this.pages.push(this.page_channelset);
    this.pages.push(new SCENE(this));
    this.pages.push(new VUDIS(this));
    this.pages.push(new REC(this));
    this.pages.push(new MAINSEND(this));
    this.pages.push(new FXSEND(this));
    this.pages.push(new SETTING(this));
  },
  setMode: function (a) {
    if(this.mode != a) {
      if(-1 == a){
        for(var b = 0; b < this.pages.length; b++)
          this.pages[b].hide();
        regUpdate(this)
      }else {
        if(a == 3) {
          showPopupMsg(lang.alertWaiting);
          return;
        }

        this.mode = a;
        for(b = 0; b < this.pages.length; b++)
          this.pages[b].enabled && this.pages[b].hide();
        this.pages[a].show();
        regUpdate(this);
        
        if(a == 0) {
          editStripWidget.show();
        }else {
          editStripWidget.hide();
        }
        geomAll();
        drawAll("MODE(" + a + ")");
      }
    }
  },
  upd: function() {
    this.page_channelset.upd();
    this.setMode(0);
  },
  onShow: function() {
    this.upd();
  },
  calcGeometry: function() {
    this.x = editStripWidget.enabled ? editStripWidget.w : 0;
    this.y = 0;
    this.w = screenWidth - this.x - measures.masterStripWidth;
    this.h = screenHeight - this.y;
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);
  }
});

CHANNELSET = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "CHANNELSET";
    this.buttons = [];
    this.pages = [];
    this.mode = -1;
    this.color = color.white;
    this.lineOverGrad = null;
    this.arr=[];
    this.E_MODE = {
      baseSet: 0,
      mainAllo: 1,
      eqch: 2,
      dynch: 3
    },
    this.initWidgets();
    this.setMode(0);
  },
  initWidgets: function() {

    var that = this;

    this.pages.push(new BASESET(this));
    mainallo = new MAINALLO(this);
    this.pages.push(mainallo);
    this.pages.push(new EQChannel(this));
    this.pages.push(new DYNChannel(this));

    var c = [lang.BASESET, lang.MAINALLO, lang.EQ, lang.DYN];
    var d = ["#264863", "#264863", "#264863", "#264863"];
    var e = [color.black, color.black, color.black, color.black];

    for(var f = 0; f < c.length; f++) {
      var b = new TabButton(this);
      b.color = d[f];
      b.textColor = e[f];
      b.mode = f;
      b.font = "13pt Arial";
      b.text = c[f];
      this.buttons.push(b);
    }

    this.channelChange = new Button(this);
    this.channelChange.setText(lang.changeChannel);
    this.channelChange.setSize(112, 30);
    this.channelChange.clr0 = color.black;
    this.channelChange.textClr0 = "#e6b450";
    this.channelChange.valueFunc = function() {
      var a = new ChannelSet(null, that.channelChange);
      a.x = 0;
      a.y = 0;
      mWidgets.push(widgets.pop());
      a.calcGeometry()
      regUpdate(a);
    }
  },
  onShow: function() {
    //this.upd();
  },
  upd: function() {
    var selectedStrip = allStrips[selectedChannel];
    if(null != selectedStrip) {
      for(var b = 0; b < this.buttons.length; b++)
        this.buttons[b].enabled = !1;
      var c = [];
      switch (selectedStrip.type) {
        case E_STRIP_TYPE.IN:
        case E_STRIP_TYPE.PLAYER:
          c = [this.E_MODE.baseSet, this.E_MODE.mainAllo, this.E_MODE.eqch, this.E_MODE.dynch];
          break;
        case E_STRIP_TYPE.FX:
          c = [this.E_MODE.mainAllo];
          break;
        case E_STRIP_TYPE.AUX:
        case E_STRIP_TYPE.SUB:
        case E_STRIP_TYPE.MAIN:
          c = [this.E_MODE.eqch, this.E_MODE.dynch];
          break;
        }

        for(b = 0; b < c.length; b++) {
          this.buttons[c[b]].enabled = !0
        }

        0 == c.length ? this.setMode(-1) : (-1 === c.indexOf(this.mode) && this.setMode(c[0]),
          this.arr = c,
          this.calcGeometry(),
          this.pages[this.mode].enabled || this.pages[this.mode].show(),
          this.pages[this.mode].onShow(),
          regUpdate(this));
    }
  },
  setMode: function (a) {
    if(this.mode != a) {
      if(-1 == a){
        for(var b = 0; b < this.pages.length; b++)
          this.pages[b].hide();
        regUpdate(this)
      }else if ("undefined" != typeof this.buttons && "undefined" != typeof this.buttons[a] && this.buttons[a].enabled) {
        this.mode = a;
        for(b = 0; b < this.pages.length; b++)
          this.pages[b].enabled && this.pages[b].hide();
        this.pages[a].show();
        this.color = this.buttons[a].color;
        regUpdate(this);
      }
    }
  },
  calcGeometry: function() {
    this.x = 0;
    this.y = 0;
    this.w = this.parent.w;
    this.h = this.parent.h;

    var a = 0, b = 0;
    this.needClip = 700 > this.w;
    for(var c = 0; c < this.buttons.length; c++)
      this.buttons[c].enabled && b++;

    var buttonW = this.w / 5.5 | 0;
    b = 17;
    for(c = 0; c < this.buttons.length; c++)
      this.buttons[c].enabled && (this.buttons[c].setPos(b, 5),this.buttons[c].setSize(buttonW, 30),b += this.buttons[c].w + 5,a++);
    this.channelChange.setPos(b, 5);
    this.channelChange.w = this.w - b;
  },
  paint: function() {//lang.BASESET, lang.MAINALLO, lang.EQ
    this.buttons[0].text = lang.BASESET;
    this.buttons[1].text = lang.MAINALLO;
    this.buttons[2].text = lang.EQ;
    this.buttons[3].text = lang.DYN;

    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.fillStyle = this.color;
    ctx.fillRect(0, this.h - 3, this.w, 3);
    ctx.fillRect(0, 35, this.w, 4);
  }
});

ColorPicker = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.name = 'ColorPicker';
    this.color = 'white';
    this.w = 160;
    this.h = 26;
    this.position = .4;
    this.hw = 0;
    this.needMoveEvt = !0;
    this.pos = 0;
    this.step = 1E3;
    this.timer = null;
    this.curTime = 0;
    this.trackLength = 30;
    this.move = !1;
    this.cache = null;
    this.pickedColor = '';
    //this.getImgData();
  },
  setTrackTime: function(a) {
    this.curTime = 0;
    this.trackLength = a;
  },
  onDown: function(a, b) {
    this.move = !0;

    this.ondown();
    this.onMove(a, b);
  },
  onMove: function(a, b){
    var localPo = a - this.globalX();
    var d = parseInt(bound(localPo, 0, this.w));
    this.pos = c = bound(d / this.w, 0, 1);
    this.onmove(c);

    var x = d;

    var red = this.idata[x * 4].toString(16);
    var green = this.idata[x * 4 + 1].toString(16);
    var blue = this.idata[x * 4 + 2].toString(16);
    //var _color = 'rgb(' + red + ',' + green + ',' + blue + ')';
    if(blue.length == 1) {
      blue = '0' + blue;
    }

    if(green.length == 1) {
      green = '0' + green;
    }

    if(red.length == 1) {
      red = '0' + red;
    }

    var _color = '#' + red + green + blue;
    regUpdate(this);

    if(_color == "#a83b3b") {
      this.pickedColor = color.INPUT;
    }else {
      this.pickedColor = _color;
    }
  },
  getColor: function() {
    return this.pickedColor;
  },
  onUp: function() {
    this.move = !1;
    this.onChange(this.pos);
    this.onup();
    regUpdate(this);
  },
  getImgData: function() {
    var globalx = this.globalX();
    var globaly = this.globalY();

    this.imageData = ctx.getImageData(globalx, globaly, this.w, this.h);
    this.idata = this.imageData.data;
  },
  ondown: function() {},
  onmove: function(a) {},
  onup: function() {},
  onChange: function(a) {
    sendMessage('colorPicker' + '^' + a);
  },
  paint: function() {
    var grad1 = ctx.createLinearGradient(0, 0, this.w*0.8, this.h);
    grad1.addColorStop(0, 'rgba(0, 167, 109, 1)');
    grad1.addColorStop(0.5, 'rgba(190, 216, 49, 1)');
    grad1.addColorStop(1, 'rgba(216, 95, 0, 1)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, this.w*0.8, this.h);
    ctx.fillStyle = "#a83b3b";
    ctx.fillRect(this.w*0.8, 0, this.w*0.2, this.h);

    if(this.cache == null) {
      this.cache = this.getImgData();
    }
    //ctx.fillStyle = '#eee';
    //ctx.textBaseline = 'middle';
    //ctx.fillText('none', this.w, this.h/3);

    this.position = this.pos;
    var a = (this.w - this.hw - 6) * this.getVal()/* || (this.w - 6)*/;
    ctx.fillStyle = "#eee";
    ctx.fillRect(a + 2, 3, 2, this.h - 6);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
    ctx.strokeRect(.5, .5, this.w - 1, this.h - 1);
  }
});

FXLEDPlain = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "FX-LED2";
    this.bgColor = color.eqBg;
    this.bg = res.fxLEDb;
    this.w = this.bg.w();
    this.h = this.bg.h();
    this.label = "PAR";
    this.sign = "%";
    this.v1 = "0";
    this.oneLine = this.clickMark = !1
  },
  setValue: function(a, b) {
    switch (a) {
    case 1:
      this.v1 = precision(b, 1) + ""
    }
    regUpdate(this)
  },
  formatValue: function(a) {
    return 100 * a | 0
  },
  standartFormat: function(a) {
    return 100 * a | 0
  },
  getState: function() {
    return getValue(this.key)
  },
  paint: function() {
    this.paintedMe = !0;
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0, 0, this.w, this.h);
    this.clickMark && (ctx.fillStyle = color.white,
    ctx.fillTriangle(this.w - 12, 5, 3, 4));
    var a = this.w / 2 | 0;
    ctx.setShadow("#0a0a0a", 0, 2, 2);
    this.oneLine || (ctx.fillStyle = "#999",
    ctx.textAlign = "center",
    ctx.font = "15px open_sansbold",this.locked && (ctx.font = this.font),
    ctx.fillText(this.label, a, 17, this.w));
    ctx.fillStyle = "#EEE";
    ctx.fillText(this.formatValue(this.getState()) + "" + this.sign, a, this.oneLine ? 17 : 36, this.w - 10);
    /*ctx.textAlign = "start";
    var a = this.getState()
      , b = this.formatValue(a) + "";
    ctx.font = "17px open_sansbold";
    var c = ctx.measureText(b).width;
    ctx.font = "14px open_sans_condensedbold";
    var d = ctx.measureText(this.sign).width
      , a = (this.w - c - d - 1) / 2 | 0;
    ctx.fillStyle = "#EEE";
    ctx.font = "17px open_sansbold";
    this.locked && (ctx.font = this.font);
    ctx.fillText(b + this.sign, a, this.oneLine ? 17 : 36, this.w - 10);*/
    /*this.w - (a + c + 1) > d && (ctx.fillStyle = "#777",
    ctx.font = "14px open_sans_condensedbold",
    ctx.textAlign = "end",
    ctx.fillText(this.sign, a + c + 1 + d, this.oneLine ? 17 : 36, this.w - 10))*/
  }
});

SWITCHBOX = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "SWITCHBOX";
    this.w = 100;
    this.h = 30;
    this.bg = color.eqBg;
    this.border = color.tabText;
    this.color = color.red;
    this.colors = null;
    this.borderColor = "#535457";
    this.textColor = "black";
    this.labelColor = color.tabText;
    this.label = "";
    this.font = font.settings;
    this.state = 0;
    this.disabled = !1;
    this.items = [lang.ON, lang.OFF];
    this.itemW = 50;
    this.readOnly = !1;
    this.disableOnNegative = !0;
  },
  setState: function(a) {
    this.state = bound(a, 0, this.items.length - 1);
    this.key && setValue(this.key, this.state);
    this.valueFunc();
    regUpdate(this);
  },
  setItems: function(a) {
    this.w = a.length * this.itemW;
    this.items = a;
  },
  setItemWidth: function(a) {
    this.itemW = a;
    this.w = this.items.length * this.itemW;
  },
  onDown: function(a, b) {
    if(!(this.disableOnNegative && 0 > this.state || this.readOnly || this.disabled)) {
      var c = (a - this.globalX()) / this.itemW | 0, c = bound(c, 0, this.items.length - 1);

      if(this.state == c && 2 == this.items.length)
        switch ( this.state ) {
          case 0:
            this.state = 1;
            break;
          case 1: 
            this.state = 0;
            break;
        }
      else
        this.state = c;
      this.key && setValue(this.key, this.state);
      this.valueFunc();
      regUpdate(this);
    }
  },
  valueFunc: function() {},
  calcGeometry: function() {
    this.grd = ctx.createLinearGradient(0, 0, 0, this.h);
    this.grd.addColorStop(0, "rgba(0,0,0,0)");
    this.grd.addColorStop(.5, "rgba(0,0,0,0.3)");
    this.grd.addColorStop(1, "rgba(0,0,0,0)")
  },
  getState: function() {},
  paint: function() {
    this.key && (this.state = getValue(this.key));
    this.getState();
    -1 == this.state && (ctx.globalAlpha = .3);
    this.disabled && (ctx.globalAlpha = .3);
    ctx.fillStyle = this.bg;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.font = this.font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (var a = 0; a < this.items.length; a++)
      a === this.state ? (ctx.beginPath(),
      ctx.fillStyle = "#2db7f5",
      this.colors && (ctx.fillStyle = this.colors[a]),
      ctx.rect(a * this.itemW + 1, 1, this.itemW - 1, this.h - 2),
      ctx.fill(),
      ctx.fillStyle = this.grd,
      ctx.fill(),
      ctx.strokeStyle = this.borderColor,
      ctx.strokeRect(.5 + a * this.itemW, .5, this.itemW, this.h - 1)) : (ctx.strokeStyle = this.borderColor,
      ctx.strokeRect(.5 + a * this.itemW, .5, this.itemW, this.h - 1),
      ctx.fillStyle = "rgba(255,255,255,0.1)",
      ctx.fillRect(1 + a * this.itemW, this.h, this.itemW - 1, -10)),
      ctx.fillStyle = color.black,
      ctx.fillText(this.items[a], (a + .5) * this.itemW + 1 | 0, this.h / 2 | 0, this.itemW - 4),
      ctx.fillStyle = color.white,
      this.colors && a !== this.state && (ctx.fillStyle = this.colors[a]),
      ctx.fillText(this.items[a], (a + .5) * this.itemW | 0, this.h / 2 | 0, this.itemW - 4);
    this.label && this.label.length && (ctx.fillStyle = color.eqBg,
    ctx.fillRect(0, 0, -(ctx.measureText(this.label).width + 28), this.h),
    ctx.fillStyle = this.labelColor,
    ctx.textAlign = "right",
    ctx.fillText(this.label, -26, this.h / 2 | 0, 220))
  }
});

BASESET = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "BASESET";
    this.y = 40;
    this.enabled = !1;
    this.buttons = [];
    this.mode = 1;
    this.initWidgets();
  },
  calcGeometry: function() {
    this.w = this.parent.w - this.x;
    this.h = this.parent.h - this.y - 5;

    //this.slGain.x = this.w - measures.mixerStripWidth;
    this.slGain.x = 0;
    this.led_gain.setPos(this.slGain.x + 15, 13);
    this.slGain.y = 53;
    this.slGain.laneOffset = 45;

    //this.slPregain.x = this.w - measures.mixerStripWidth * 2;
    this.slPregain.x = measures.mixerStripWidth - 20; 
    this.led_pregain.setPos(this.slPregain.x + 18, 13);
    this.slPregain.y = 53;
    this.slPregain.laneOffset = 45;
    this.slPregain.step = 0.05;

    var _width = this.w / 5;

    this.buName.setSize(_width, 30);
    this.phantom.setSize(_width, 30);
    this.link.setSize(_width, 30);

    var _wrap = this.h - 20 - 20;
    var narrow = _wrap / 4 | 0;

    var _x = measures.mixerStripWidth + 150;

    this.buName.setPos(_x, 20);
    this.phantom.setPos(_x, 20 + narrow);
    this.link.setPos(_x, 20 + narrow * 2);
    this.colorPick.setPos(_x, 20 + narrow * 3);
  },
  initWidgets: function() {
    var b = this;


    this.led_gain = new FXLEDPlain(this);
    this.led_gain.label = lang.GAIN;
    this.led_gain.sign = "dB";
    this.led_gain.getState = function() {
      return getValue(this.name + 'gain');
    }
    this.led_gain.formatValue = function(b) {
      var _val = formatGain(b) + '';
      return _val + (_val.indexOf('.') == -1 ? '.0' : '');
    }

    this.slGain = new Slider(this);
    this.slGain.fader = res.gainFader;
    this.slGain.param = "gain";
    this.slGain.keyPart = "gain";
    this.slGain.simple = !0;
    this.slGain.canScroll = !1;
    this.slGain.lane = !1;
    this.slGain.w = measures.mixerStripWidth;
    this.slGain.faderX = 40;
    this.slGain.bottomMargin = 25;
    this.slGain.getState = function() {
      this.disabled = this.disabled || getValue(selectedStrip.name + "disablegain")
    };

    this.led_pregain = new FXLEDPlain(this);
    this.led_pregain.label = lang.PREGAIN;
    this.led_pregain.sign = "dB";
    this.led_pregain.getState = function() {
      return getValue(this.name + "pregain") * 3;
    }
    this.led_pregain.formatValue = function(b) {
      var _val = formatPregain(b) + '';
      return _val + (_val.indexOf('.') == -1 ? '.0' : '');
    }

    this.slPregain = new Slider(this);
    this.slPregain.fader = res.gainFader;
    this.slPregain.param = "pregain";
    this.slPregain.keyPart = "pregain";
    this.slPregain.simple = !0;
    this.slPregain.canScroll = !1;
    this.slPregain.lane = !1;
    this.slPregain.w = measures.mixerStripWidth;
    this.slPregain.faderX = 40;
    this.slPregain.bottomMargin = 25;
    this.slPregain.getState = function() {
      this.disabled = this.disabled || getValue(selectedStrip.name + "disablegain");
    };

    this.buName = new Button(this);
    this.buName.setText(lang.RENAME);
    this.buName.valueFunc = function() {
      editOk.valueFunc = function() {
        var a = editBox2.value.toUpperCase();
        selectedStrip.setName(a);
        b.syncComponent();
        drawAll('RENAMEING');
      }
      showEditBox2(lang.RENAME_CHANNEL.format(selectedStrip.text), selectedStrip.getName());
    };

    this.phantom = new CheckBox(this);
    this.phantom.keyPart = 'phantom';
    this.phantom.clr0 = "#e8e8e8";
    this.phantom.clr1 = "#f20000";
    this.phantom.textClr0 = "black";
    this.phantom.textClr1 = "white";
    this.phantom.setText(lang.PHANTOM);
    this.phantom.onToggleUp = function() {
      console.log("open 48V");
    };
    this.phantom.onToggleDown = function() {
      console.log("close 48V");
    };
    this.phantom.getState = function() {
      this.state = this.getVal();
    };
    this.phantom.confirm = function() {
      var r = confirm(lang.confirm);
      return r;
    };

    this.link = new CheckBox(this);
    this.link.keyPart = 'bind';
    this.link.clr0 = "#e8e8e8";
    this.link.clr1 = "#108ee9";
    this.link.textClr0 = "black";
    this.link.textClr1 = "white";
    this.link.setText(lang.LINK);
    this.link.onToggleUp = function() {
      console.log('open link');
      selectedStrip.setLinked(!0);
    };
    this.link.onToggleDown = function() {
      console.log('close link');
      selectedStrip.setLinked(!1);
    };
    this.link.getState = function() {
      this.state = this.getVal();
    };
    this.link.confirm = function() {
      var r = confirm(lang.confirm);
      return r;
    };

    this.colorPick = new ColorPicker(this);
    this.colorPick.keyPart = 'color';
    this.colorPick.ondown = function() {

    }
    this.colorPick.onup = function(){

    }
    this.colorPick.onmove = function(c) {
      this.setVal(this.getColor());
      selectedStrip.color = this.getColor();
      //console.log(this.getColor())
      selectedStrip.cachePaint();
      regUpdate(selectedStrip);
    }
  }, 
  onShow: function() {
    //this.eq.isClipping = !1;
    //this.syncSliders();
    this.syncComponent();
  },
  syncComponent: function() {
    var a = selectedStrip.name;

    this.slPregain.disabled = !0;
    if(["i.0.", "i.1.", "i.2.", "i.3.", "i.4.", "i.5.", "i.6.", "i.7."].indexOf(a) !== -1) {
      this.slPregain.disabled = !1;
    }

    this.led_gain.name = a;
    this.slGain.setKeyPrefix(a);

    this.led_pregain.name = a;
    this.slPregain.setKeyPrefix(a);
    
    this.buName.name = selectedStrip.getName();
    
    this.phantom.setKeyPrefix(a);

    this.link.setKeyPrefix(a);

    this.colorPick.setKeyPrefix(a);
  },
  syncSliders: function() {
    //this.enabled && this.connectKeys();
  },
  connectKeys: function() {
    var selectedStrip = allStrips[selectedChannel];
    if(null != selectedStrip) {
      var a = selectedStrip.name + ''
    }
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.font = font.editbox;
    ctx.textAlign = "right";
    ctx.fillStyle = color.tabText;

    ctx.strokeStyle = color.meslidermiddle;
    ctx.beginPath();
    ctx.moveTo(this.slGain.x+this.slGain.faderX+5, this.slGain.y + 30);
    ctx.lineTo(this.slGain.x+this.slGain.faderX+5, 144 + (this.slGain.h - 110));

    ctx.moveTo(this.slPregain.x+this.slPregain.faderX+5, this.slPregain.y + 30);
    ctx.lineTo(this.slPregain.x+this.slPregain.faderX+5, 144 + (this.slPregain.h - 110));

    ctx.lineWidth = 4;
    ctx.stroke();

    var _wrap = this.h - 20 - 20;
    var narrow = _wrap / 4 | 0;

    var a = this.buName.y + 26, b = this.buName.x - 20, c = narrow - 4;
    ctx.fillText(lang.NAME, b, a);

    a += c;
    ctx.fillText(lang.PHANTOM, b, a);

    a += c;
    ctx.fillText(lang.LINK, b, a);

    a += c;
    ctx.fillText(lang.COLOR, b, a);
  }
});

MAINALLO = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "MAINALLO";
    this.y = 40;
    this.enabled = !1;
    this.buttons = [];
    this.mode = 1;
    this.needClip = this.needMoveEvt = !0;
    this.hOffsetOld = 0;
    this.strips = [];
    this.maxX = 720;
    this.text = ["MAIN", "SUB", "AUX1", "AUX2", "SPDIF", "FXSend1", "FXSend2", "FXSend3", "FXSend4"];
    this.initWidgets();
    this.onShow();
  },
  initWidgets: function() {
    var a = this;
    var len = 9;

    for(var i = 0; i < len; i++) {
      var simpleStrip = new SimpleStrip(this, selectedStrip.name, this.text[i]);
      this.strips.push(simpleStrip);
    }
  },
  onDown: function(a, b) {
    /*this.lastPressPoint = this.pressPoint;
    this.pressPoint = [a, b];
    this.ppx = this.offsetX + a;*/

    var c = b - this.globalY(),
        d = a - this.globalX();

    this.pressPoint = [d, c];
    0 < this.maxX && this.velStart();
  },
  onMove: function(a, b, c) {
    //4 < mouseTargets.length || isDefined(tHash[c]) && 4 < tHash[c].length || this.setOffset(this.ppx - a)
    
    var d = a - this.globalX();
    d -= this.pressPoint[0];

    4 < mouseTargets.length || isDefined(tHash[c]) && 4 < tHash[c].length || (this.offsetX = this.hOffsetOld - d,
    this.offsetX = bound(this.offsetX, 0, this.maxX), regUpdate(this));
  },
  onUp: function(a) {
    /*var b = Date.now(),
        c = Math.abs(this.lastPressPoint[0] - this.pressPoint[0]),
        d = Math.abs(this.lastPressPoint[1] - this.pressPoint[1]);
    2 < mouseTargets.length || isDefined(tHash[a]) && 2 < tHash[a].length || (30 > c
      && 30 > d && b - this.lastClickTime < DBL_CLK_TIME ? (this.onDouble(),
        this.lastClickTime = b - DBL_CLK_TIME) : this.lastClickTime = b)*/

    this.hOffsetOld = this.offsetX;
    0 < this.maxX && this.velRelease();
    regUpdate(this);
  },
  setOffset: function(a) {
    this.hOffsetOld = this.offsetX = bound(a | 0, 0, this.maxX);
    regUpdate(this);
  },
  onShow: function() {
    this.syncSliders();
  },
  onDouble: function() {

  },
  velStart: function() {
    var that = this;
    velocity = amplitude = 0;
    timestamp = Date.now();
    clearInterval(ticker);
    frame = this.offsetX;
    ticker = setInterval(that.velTrack, 1E3 / fps);
  },
  velRelease: function() {
    clearInterval(ticker);
    Date.now() - timestamp < 1E3 / fps && this.velTrack();
    5 < Math.abs(velocity) && this.mScroll(velocity);
  },
  velTrack: function() {
    var a, b;
    a = Date.now();
    b = a - timestamp;
    timestamp = a;
    a = mainallo.offsetX - frame;
    frame = mainallo.offsetX;
    b = 1E3 * a / (1 + b);
    velocity = 0 == velocity ? b : .3 * b + .7 * velocity;
  },
  mScroll: function(a) {
    if(!settings.kinetic) {
      var b = 1E3 / fps;
      position = this.offsetX;
      amplitude = .2 * a;
      step = 0;
      var c = this;
      clearInterval(ticker);
      ticker = setInterval(function() {
        var a = amplitude / b * 2;
        position += a;
        amplitude -= a;
        step += 1;
        .5 > Math.abs(a) && clearInterval(ticker);
        step > 3 * fps && clearInterval(ticker);
        (0 >= position || position > c.maxX) && clearInterval(ticker);
        c.offsetX != (position | 0) && c.setOffset(position | 0)
      }, b);
    }
  },
  syncSliders: function() {
    var len = 9;
    for(var i = 0; i < len; i++) {
      this.strips[i].name = selectedStrip.name + this.text[i] + '.';
      //console.log(selectedStrip.name + this.text[i] + '.');
    }
  },
  calcGeometry: function() {
    this.w = this.parent.w - this.x;
    this.h = this.parent.h - this.y - 5;
    var b = false,
        z = 100;

    var a = (this.w - 90 * this.strips.length + this.strips[0].w) / 2 | 0;
    a = bound(a, 0, 30);
    for(var c = 0, d = 0; d < this.strips.length; d++) {
      c = a + z * d;
      this.strips[d].setPos(c + (b ? 10 : 0), 10);
      this.strips[d].h = this.h - this.strips[d].y;
    }
    this.maxX = c + z - this.w;
    0 > this.maxX && (this.maxX = 0);
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(this.offsetX, 0, this.w, this.h);
    /*ctx.fillStyle = "white";
    ctx.fillText('mainallo', 0, 20);*/
  }
});

EQChannel = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "EQChannel";
    this.x = 0;
    this.y = 40;
    this.enabled = !1;
    this.buttons = [];
    this.mode = 1;
    this.bypass = !1;
    this.lpf = !1;
    this.hpf = !1;
    this.keyPrefix = null;
    this.defaultVal = !0;
    this.initWidgets();
  },
  setMode: function(a) {
    this.mode = a;

    var b = selectedStrip.name + 'eq.';
    if(77 != a) {
      switch(this.mode) {
        case 0:
          b += "hpf.";
          break;
        case 1:
          b += "b1.";
          break;
        case 2:
          b += "b2.";
          break;
        case 3:
          b += "b3.";
          break;
        case 4:
          b += "b4.";
          break;
        case 5:
          b += "lpf.";
          break;
      }
      this.led_kp = b;
      regUpdate(this);
    } 
  },
  onShow: function() {
    /*if(this.defaultVal) {
      resetParEQ(selectedStrip.name);
      //this.defaultVal = !1;
    }*/
    this.eq.isClipping = !1;
    this.syncSliders();
  },
  connectKeys: function() {
    if(null != selectedStrip) {
      var a = selectedStrip.name + "eq.";
      this.keyPrefix2 = this.keyPrefix = a;
      this.bBYPASS.setKeyPrefix(this.keyPrefix);
      this.bHPF.setKeyPrefix(this.keyPrefix);
      this.bLPF.setKeyPrefix(this.keyPrefix);

      switch(this.mode) {
        case 0:
          a += "hpf.";
          break;
        case 1:
          a += "b1.";
          break;
        case 2:
          a += "b2.";
          break;
        case 3:
          a += "b3.";
          break;
        case 4:
          a += "b4.";
          break;
        case 5:
          a += "lpf.";
          break;
      }
      this.led_kp = a;
      this.eq.rta = null;
      this.bypass = toBool(getValue(this.keyPrefix + 'bypass'));
      this.hpf = toBool(getValue(this.keyPrefix + 'lpf'));
      this.lpf = toBool(getValue(this.keyPrefix + 'hpf'));
    }
  },
  syncSliders: function() {
    this.enabled && this.connectKeys();
  },
  calcGeometry: function() {
    this.w = this.parent.w - this.x;
    this.h = this.parent.h - this.y - 5;

    if(isDefined(this.eq)) {
      this.eq.setSize(this.w - this.eq.x - 20, this.h - this.eq.y - 60);
      var a = -208;

      for(var b = this.h - 35, a = this.eq.x, c = [], d = 0; d < this.btns.length; d++)
        this.btns[d].enabled && c.push(this.btns[d]);
      for(var e = (this.eq.w - this.btns[0].w) / (c.length - 1), d = 0; d < c.length; d++)
        c[d].setPos(a + d * e | 0, b);
    }
  },
  initWidgets: function() {
    var a = this;

    this.eq = new EQParamWidget(this);
    this.eq.setPos(30, 32);
    var b = this.eq;

    this.bRESET = new Button(this);
    this.bRESET.setSize(70, 30);
    this.bRESET.opaque = !1;
    this.bRESET.setImages(res.bRESET_OFF, res.bRESET_ON);
    this.bRESET.valueFunc = function() {
      resetParEQ(selectedStrip.name);
      a.checkState();
      regUpdate(a);
    }

    this.bBYPASS = new CheckBox(this);
    this.bBYPASS.keyPart = "bypass";
    this.bBYPASS.setSize(70, 30);
    this.bBYPASS.setImages(res.bBYPASS_OFF, res.bBYPASS_ON);
    this.bBYPASS.onToggleUp = function() {
      a.bypass = !0;
      regUpdate(a);
    };
    this.bBYPASS.onToggleDown = function() {
      a.bypass = !1;
      regUpdate(a);
    };

    this.bHPF = new CheckBox(this);
    this.bHPF.keyPart = "hpf";
    this.bHPF.setSize(70, 30);
    this.bHPF.setImages(res.HPF_OFF, res.HPF_ON);
    this.bHPF.onToggleUp = function() {
      a.bhpf = !0;
      regUpdate(a);
    };

    this.bHPF.onToggleDown = function() {
      a.bhpf = !1;
      regUpdate(a);
    };

    this.bLPF = new CheckBox(this);
    this.bLPF.keyPart = "lpf";
    this.bLPF.setSize(70, 30);
    this.bLPF.setImages(res.LPF_OFF, res.LPF_ON);
    this.bLPF.onToggleUp = function(){
      a.blpf = !0;
      regUpdate(a);
    };
    this.bLPF.onToggleDown = function() {
      a.blpf = !1;
      regUpdate(a);
    };

    this.bPRESET = new Button(this);
    this.bPRESET.setSize(70, 30);
    this.bPRESET.opaque = !1;
    this.bPRESET.setImages(res.bPRESET_ON, res.bPRESET_OFF);
    this.bPRESET.valueFunc = function() {
      var _b = new PRESET_MENU2(null, "eqch", a, '#000');
      _b.onshow();
      regUpdate(_b);
      //console.log('dd')
    }

    this.btns = [this.bRESET, this.bBYPASS, this.bHPF, this.bLPF, this.bPRESET];
  },
  checkState: function() {},
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);
    this.paintMarks();
    /*ctx.fillStyle = "white";
    ctx.fillText('eqchannel', 0, 20);*/
    //console.log('eq')
  },
  paintMarks: function() {
    ctx.font = font.eqMarks;
    ctx.textAlign = "center";
    var a = this.eq.h
      , b = this.eq.w
      , c = a / 4
      , d = a / 2 | 0
      , e = [50, 100, 200, 500, 1E3, 2E3, 5E3, 1E4]
      , f = "50 100 200 500 1k 2k 5k 10k".split(" ");
    ctx.fillStyle = "#101115";
    ctx.fillRect(8, this.eq.y - 20, this.w - 16, this.eq.h + 42);
    ctx.translate(8, 10);
    ctx.fillStyle = color.grad1;
    ctx.fillRect(1, 0, this.w - 16 - 2, 7);
    ctx.translate(-8, -10);
    ctx.save();
    ctx.translate(this.eq.x, this.eq.y);
    ctx.fillStyle = color.graphMarks;
    ctx.textAlign = "right";
    ctx.fillText("+20", -4, 9);
    ctx.fillText("+10", -4, c + 4);
    ctx.fillText("0", -4, d + 3);
    ctx.fillText("-10", -4, 3 * c + 4);
    ctx.fillText("-20", -4, a - 1);
    ctx.textAlign = "left";
    ctx.fillText("20", 0, a + 15);
    ctx.fillText("22k", b - 18, a + 15);
    ctx.textAlign = "center";
    for (c = 0; c < e.length; c++)
        ctx.fillText(f[c], FREQtoX(e[c], b), a + 15);
    ctx.restore()
  }
});

DYNChannel = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "DYNChannel";
    this.x = 0;
    this.y = 40;
    this.enabled = !1;
    this.buttons = [];
    this.bypass = !1;
    this.keyPrefix = null;
    this.initWidgets();
  },
  onShow: function() {
    var a = this.keyPrefix = selectedStrip.name + 'dyn.';

    dataValue[a.replace('dyn.', '') + "gate.enabled"] = !0;
    dataValue[a.replace('dyn.', '') + "gate.bypass"] = !1;

    this.slGate.setKey(a.replace('dyn.', '') + 'gate.thresh');
    this.slAttack.setKey(a + "attack");
    this.slRelease.setKey(a + "release");
    this.slGain.setKey(a + "gain");

    this.led_slGate.key = a.replace('dyn.', '') + "gate.thresh";
    this.led_slAttack.key = a + "attack";
    this.led_slRelease.key = a + "release";
    this.led_slGain.key = a + "gain";

    this.dyn.onShow();
  },
  initWidgets: function() {
    var a = this;

    this.dyn = new DYN_GRAPH(this);
    this.dyn.setPos(30, 30);

    var b = this.dyn;

    this.slGate = new EQSlider(this);
    //this.slGate.keyPart = "gate";
    //this.slGate.setKey('gate');
    this.slGate.setFader(res.fader, 12);
    //this.slGate.defaultValue = -1;
    this.slGate.faderX = 7;
    this.slGate.setPos(390, 70);
    this.slGate.valueFunc = function() {
      regUpdate(a.dyn);
    }

    this.led_slGate = new FXLEDPlain(this);
    //this.led_slGate.keyPart = "gate";
    this.led_slGate.label = lang.GATE;
    this.led_slGate.sign = "dB";
    this.led_slGate.locked = !0;
    this.led_slGate.font = "12px Arial";
    this.led_slGate.formatValue = function(a) {
      a = VtoDYNGATE(a); - 89 > a && (a = "-inf");
      return a + "" 
    }

    this.slAttack = new EQSlider(this);
    //this.slAttack.keyPart = "attack";
    //this.slAttack.setKey("attack");
    this.slAttack.setFader(res.fader, 12);
    //this.slAttack.defaultValue = -1;
    this.slAttack.faderX = 7;
    this.slAttack.setPos(430, 70);
    this.slAttack.valueFunc = function() {
      console.log('attack');
    }

    this.led_slAttack = new FXLEDPlain(this);
    //this.led_slAttack.keyPart = "attack";
    this.led_slAttack.label = lang.ATTACK;
    this.led_slAttack.sign = "ms";
    this.led_slAttack.locked = !0;
    this.led_slAttack.font = "12px Arial";
    this.led_slAttack.formatValue = VtoATTACK

    this.slRelease = new EQSlider(this);
    //this.slRelease.keyPart = "release";
    //this.slRelease.setKey("release");
    this.slRelease.setFader(res.fader, 12);
    //this.slRelease.defaultValue = -1;
    this.slRelease.faderX = 7;
    this.slRelease.setPos(470, 70);
    this.slRelease.valueFunc = function() {
      console.log('release');
    }

    this.led_slRelease = new FXLEDPlain(this);
    //this.led_slRelease.keyPart = "release";
    this.led_slRelease.label = lang.RELEASE.replace('EASE', '');
    this.led_slRelease.sign = "ms";
    this.led_slRelease.locked = !0;
    this.led_slRelease.font = "12px Arial";
    this.led_slRelease.formatValue = VtoREL;


    this.slGain = new EQSlider(this);
    //this.slGain.keyPart = "gain";
    //this.slGain.setKey("gain");
    this.slGain.setFader(res.fader, 12);
    //this.slGain.defaultValue = -1;
    this.slGain.faderX = 7;
    this.slGain.setPos(510, 70);
    this.slGain.valueFunc = function() {
      console.log('gain');
    }

    this.led_slGain = new FXLEDPlain(this);
    //this.led_slGain.keyPart = "gain";
    this.led_slGain.label = lang.GAIN;
    this.led_slGain.sign = "dB";
    this.led_slGain.locked = !0;
    this.led_slGain.font = "12px Arial";
    this.led_slGain.formatValue = function(a) {
      return precision(VtoDYNOUTGAIN(a), 1)
    };

    this.bPRESET = new Button(this);
    this.bPRESET.setSize(70, 30);
    this.bPRESET.opaque = !1;
    this.bPRESET.setImages(res.bPRESET_ON, res.bPRESET_OFF);
    this.bPRESET.valueFunc = function() {
      var _b = new PRESET_MENU2(null, "dynch", a, '#000');
      _b.onshow();
      regUpdate(_b);
      //console.log('dd')
    }
  },
  calcGeometry: function() {
    this.w = this.parent.w - this.x;
    this.h = this.parent.h - this.y - 5;

    this.dyn.setSize((this.w - this.dyn.x - 20) / 1.5, this.h - this.dyn.y - 60);

    var d = this.dyn.x + this.dyn.w + 10;

    var hh = this.dyn.h - 40;

    var slider_w = (this.w - d) / 4;

    this.slGate.w = this.slAttack.w = this.slRelease.w = this.slGain.w = slider_w;

    this.slGate.setPos(d, 70);
    this.led_slGate.setPos(d, 30);
    this.led_slGate.w = this.slGate.w;
    this.slGate.h = hh;
    this.slGate.faderX = (slider_w - res.fader.w()) / 2 | 0;
    d += 45;
    this.slAttack.setPos(d, 70);
    this.led_slAttack.setPos(d, 30);
    this.led_slAttack.w = this.slAttack.w;
    this.slAttack.h = hh;
    this.slAttack.faderX = (slider_w - res.fader.w()) / 2 | 0;

    d += 45;
    this.slRelease.setPos(d, 70);
    this.led_slRelease.setPos(d, 30);
    this.led_slRelease.w = this.slRelease.w;
    this.slRelease.h = hh;
    this.slRelease.faderX = (slider_w - res.fader.w()) / 2 | 0;

    d += 45;
    this.slGain.setPos(d, 70);
    this.led_slGain.setPos(d, 30); 
    this.led_slGain.w = this.slGain.w;
    this.slGain.h = hh;
    this.slGain.faderX = (slider_w - res.fader.w()) / 2 | 0;

    this.bPRESET.setPos(this.w - 90, this.h - 40);
  },
  paint: function() {
    //ctx.fillStyle = "black";
    //ctx.fillRect(0, 0, this.w, this.h);
    this.paintMarks();
  },
  paintMarks: function() {
    ctx.font = font.eqMarks;
    ctx.textAlign = "left";
    var a = this.dyn.h,
      b = this.dyn.w,
      c = b / 96,
      d = a / 96;

    ctx.fillStyle = "#101115";
    ctx.fillRect(8, this.dyn.y - 20, b + this.dyn.x, this.dyn.h + 42);

    ctx.fillStyle = color.graphMarks;
    var e = "-90 -80 -70 -60 -50 -40 -30 -20 -10 0 +6".split(" ");
    ctx.save();
    ctx.translate(this.dyn.x, this.dyn.y);
    ctx.fillText("-90", 0, a + 9);
    ctx.fillText("+6", b - 8, a + 9);
    ctx.textAlign = "center";
    for(var b = 1, f = 10; 90 >= f; f += 10) {
      ctx.fillText(e[b++], c * f, a + 9);
    }
    b = 1;
    ctx.textAlign = "right";
    ctx.fillText("-90", -2, a - 2);
    ctx.fillText("+6", -2, 2);
    for(f = 10; 90 >= f; f+=10)
      ctx.fillText(e[b++], -2, a - d * f);
    ctx.restore();
  }
});

EQHSlider2 = Class.create(Widget, {
    initialize: function($super, b) {
        $super(b);
        this.widgetName = "EQHSlider2";
        this.needMoveEvt = !0;
        this.lastClickTime = 0;
        this.w = 300;
        this.h = 56;
        this.laneY = 25;
        this.faderY = 9;
        this.defaultValue = this.oldValue = this.value = 0;
        this.fader = res.fader;
        this.faderW = this.fader.w();
        this.faderH = this.fader.h();
        this.keyPart = null ;
        this.bg = color.eqBg
    },
    setDefaultValue: function(a) {
        this.defaultValue = bound(a, 0, 1)
    },
    setValue: function(a) {
        this.setVal(bound(a, 0, 1));
        regUpdate(this)
    },
    onDown: function(a, b) {
        this.pressPoint = 
        [a, b];
        var c = this.globalX() + (this.w - this.faderW) * this.getVal()
          , d = this.globalY() + 9
          , c = c | 0;
        if (this.slide = c - 10 <= a && c + this.faderW + 10 >= a && d - 10 <= b && d + this.faderH + 10 >= b)
            this.oldValue = this.getVal(),
            this.onFocus()
    },
    onMove: function(a, b) {
        if (this.slide) {
            var c = bound(this.oldValue + (a - this.pressPoint[0]) / (this.w - this.faderW), 0, 1);
            this.setVal(c);
            this.onValueChange();
            this.valueFunc();
            regUpdate(this)
        }
    },
    onUp: function() {
        this.oldValue = this.value;
        this.pressPoint = [-1, -1];
        this.slide = !1;
        if (!(0 > this.defaultValue)) {
            var a = Date.now();
            a - this.lastClickTime < DBL_CLK_TIME && (this.setVal(this.defaultValue),
            this.onValueChange(),
            this.valueFunc(),
            regUpdate(this.parent));
            this.lastClickTime = a
        }
    },
    onWheel: function(a) {
        var b = this.getVal()
          , b = bound(b + a / 120 / 30, 0, 1);
        this.setVal(b);
        this.onValueChange();
        this.valueFunc(b);
        regUpdate(this.parent)
    },
    onValueChange: function() {},
    onFocus: function() {},
    valueFunc: function() {},
    getState: function() {
        this.value = this.getVal()
    },
    paint: function() {
        ctx.fillStyle = this.bg;
        ctx.fillRect(0, 0, this.w, this.h);
        this.getState();
        ctx.lineWidth = 
        5;
        ctx.lineCap = "round";
        var a = this.w - 4;
        this.disabled || (ctx.strokeStyle = "#AAA",
        ctx.beginPath(),
        ctx.moveTo(4.5, this.laneY + .5),
        ctx.lineTo(a + .5, this.laneY + .5),
        ctx.stroke());
        ctx.strokeStyle = color.black;
        ctx.beginPath();
        ctx.moveTo(4, this.laneY);
        ctx.lineTo(a, this.laneY);
        ctx.stroke();
        ctx.shadowColor = "transparent";
        drawImage(this.fader, (this.w - this.faderW) * this.value | 0, this.faderY)
    }
})

DYN_GRAPH = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "DYN_GRAPH";
    this.needMoveEvt = this.needClip = !0;
    this.pressed = this.master = !1;
    this.idx = 1;
    this.touchID = -1;
    this.left = !0;
    this.touchRadius = 32;
    this.grad = null ;
    this.gradW = 0;
    this.grad3 = this.grad2 = null ;
    this.points = {
        G: [0, 0],
        T: [0, 0],
        R: [0, 0]
    };
    this.bypass = !1;
    this.colors = ["#b23535", "#c27a2a", "#c7ab35", "#2c8f29"];
    this.cachedBgBypass = this.cachedBg = null ;
    this.cachedBgW = this.cachedBgH = 0;
    this.lastP = !1;
    this.delta = [0, 0];
    this.showPreset = !0;
    //this.defaultVal = !0;
  },
  onShow: function() {
    /*if(this.defaultVal) {
      setValue(this.parent.keyPrefix + 'ratio', 1);
      setValue(this.parent.keyPrefix + 'threshold', 0.7);
    }*/
  },
  calcGeometry: function() {
    var a = this.w
      , b = this.h;
    this.grad = ctx.createRadialGradient(a / 2, -10, a / 10, a / 2, -10, a / 2 + 10);
    this.grad.addColorStop(0, "rgba(255,255,255,0.2)");
    this.grad.addColorStop(1, "rgba(255,255,255,0)");
    this.grad2 = ctx.createLinearGradient(0, b, a / 2, 0);
    this.grad2.addColorStop(0, "rgba(0,160,255,0.4)");
    this.grad2.addColorStop(.5, "rgba(0,160,255,0.33)");
    this.grad2.addColorStop(1, "rgba(0,80,176,0.26)");
    this.grad3 = ctx.createLinearGradient(0, b, a / 2, 0);
    this.grad3.addColorStop(0, "rgba(160,160,160,0.4)");
    this.grad3.addColorStop(.5, "rgba(160,160,160,0.33)");
    this.grad3.addColorStop(1, "rgba(80,80,80,0.26)")
  },
  onDown: function(a, b, c) {
    this.pressed || (a -= this.globalX(),
    b -= this.globalY(),
    this.idx = 0,
    this.touchID = c,
    this.pressed = !0,
    this.delta = [0, 0],
    this.calcPoints(),
    isInCircle(this.points.R[0], this.points.R[1], 2 * this.touchRadius, a, b) && (this.idx = 2,
    this.delta = [this.points.R[0] - a, this.points.R[1] - b]),
    isInCircle(this.points.T[0], 
    this.points.T[1], 2 * this.touchRadius, a, b) && (this.idx = 1,
    this.delta = [this.points.T[0] - a, this.points.T[1] - b]),
    0 != this.idx && regUpdate(this))
  },
  onMove: function(a, b, c) {
    if (this.pressed && this.touchID == c && 0 != this.idx) {
      a += this.delta[0];
      b += this.delta[1];
      a = bound(a - this.globalX(), 0, this.w);
      b = bound(b - this.globalY(), 0, this.h);
      switch (this.idx) {
      case 1:
          b = bound(a / this.w, 0, 1);
          //this.parent.slTRE.setValue(b);
          setValueX(this.parent.keyPrefix + "threshold", b);
          regUpdate(this.parent.vuIN);
          regUpdate(this.parent.led_tre);
          selectedStrip.setNameValue("dyn.prmod", 1);
          break;
      case 2:
          if (1 > this.points.T[1])
              return;
          b = bound(b, 0, this.points.T[1]);
          b = bound(1 - b / this.points.T[1], 0, 1);
          //this.parent.slRATIO.setValue(b);
          setValueX(this.parent.keyPrefix + "ratio", b);
          regUpdate(this.parent.led_ratio)
      }
      regUpdate(this)
    }
  },
  onUp: function(a) {
    this.touchID == a && (this.delta = [0, 0],
    a = Date.now(),
    a - this.lastClickTime < DBL_CLK_TIME && this.lastP == this.idx && (0 == this.idx && setMode(E_MODE.MIX),
    regUpdate(this)),
    this.lastP = this.idx,
    this.lastClickTime = a,
    this.pressed = !1,
    this.touchID = -1)
  },
  calcPoints: function() {
    var a = this.w
      , b = this.h
      , c = getValue(this.parent.keyPrefix + "threshold")
      , d = getValue(this.parent.keyPrefix + "ratio")
      , e = 0 * b;
    this.points.G[0] = 0;
    this.points.G[1] = bound(b - e, 0, b);
    e = b * (1 - c) - e;
    this.points.T[0] = bound(a * c, 0, a);
    this.points.T[1] = bound(e, 0, b);
    this.points.R[0] = a;
    this.points.R[1] = bound(e - b * (1 - c) * d, 0, b)
  },
  paint: function() {
    ctx.shadowColor = "transparent";
    this.bypass = this.master ? toBool(getValue("m.dyn.bypass")) : toBool(getValue(this.parent.keyPrefix + "bypass"));
    this.cachedBgW == this.w && this.cachedBgH == this.h || this.cachePaint();
    ctx.drawImage(this.cachedBg, 0, 0, this.w, this.h);
    //console.log('paint', this.parent.keyPrefix + "threshold", getValue(this.parent.keyPrefix + "threshold"));
    var a = this.w
      , b = this.h
      , c = this.h / 96
      , d = getValue(this.parent.keyPrefix + "threshold")
      , e = getValue(this.parent.keyPrefix + "ratio")
      , f = getValue(this.parent.keyPrefix + "softknee")
      , g = a * d;
    1 > g && (g = 1);
    var h = b * (1 - d) - 0;
    h > b - 2 && (h = b - 2);
    var k = b - b * (0 + d + (1 - d) * e);
    k > b - 2 && (k = b - 2);
    ctx.strokeStyle = "rgba(255,255,250,0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(a * d, b);
    ctx.lineTo(a * d, 0);
    ctx.stroke();
    ctx.strokeStyle = "rgba(117,206,210,1.0)";
    this.bypass && (ctx.strokeStyle = "white");
    ctx.lineWidth = 2;
    if (f) {
        var f = a * d * 1
          , d = b * (1 - 1 * d) - 0
          , l = g + .01 * (a - g)
          , e = h - (b - h - 0) * e * .01;
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, b);
        ctx.lineTo(g, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(g, h);
        ctx.lineTo(a, k);
        ctx.stroke();
        ctx.strokeStyle = "rgba(117,206,210,1.0)";
        ctx.lineWidth = 2;
        this.bypass && (ctx.strokeStyle = "white");
        ctx.beginPath();
        ctx.moveTo(0, b);
        ctx.bezierCurveTo(f, d, l, e, a, k)
    } else
        ctx.beginPath(),
        ctx.moveTo(0, b),
        ctx.lineTo(g, h),
        ctx.stroke(),
        ctx.beginPath(),
        ctx.moveTo(g, h),
        ctx.lineTo(a, k);
    ctx.stroke();
    ctx.lineTo(a, b);
    ctx.lineTo(0, b);
    ctx.fillStyle = "white";//this.bypass ? this.grad3 : this.grad2;
    ctx.globalAlpha = 0.2;
    ctx.fill();
    this.drawCircle(g, bound(h, 0, this.h), 1 == this.idx, 1, !1);
    this.drawCircle(a - 6, bound(k, 0, this.h - 0), 2 == this.idx, 2, !1);
    ctx.textAlign = "center";
    ctx.font = "bold 14px open_sans_condensedbold";
    ctx.fillStyle = "#060606";
    ctx.fillText("T", g + 1, bound(h, 0, this.h) + 5 + 1);
    ctx.fillText("R", a - 8 + 1, bound(k, 0, this.h - 0) + 5 + 1);
    ctx.fillStyle = "#f0f0f0";
    ctx.fillText("T", g, bound(h, 0, this.h) + 5);
    ctx.fillText("R", a - 8, bound(k, 0, this.h - 0) + 5);
    //console.log(selectedStrip.getNameValue("gate.enabled"), !selectedStrip.getNameValue("gate.bypass"), a = selectedStrip.getNameValue("gate.thresh"));
    selectedStrip.getNameValue("gate.enabled") && 
    !selectedStrip.getNameValue("gate.bypass") && (a = selectedStrip.getNameValue("gate.thresh"),
    b = selectedStrip.getNameValue("gate.depth"),
    a = VtoGATE_THRESH(a),
    b = VtoGATE_DEPTH(b),
    g = c * (90 + a),
    ctx.fillStyle = "rgba(10,58,36,0.3)",
    ctx.fillRect(0, this.h, this.w, -g),
    h = bound(c * -b, 0, g),
    -59.9999 >= b && (h = g),
    ctx.fillStyle = "rgba(10,58,36,0.5)",
    ctx.fillRect(0, this.h, this.w, -h),
    ctx.fillStyle = "rgba(90,218,114,0.4)",
    ctx.fillRect(0, this.h - c * (90 + a), this.w, 2));
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#222";
    ctx.strokeRect(.5, .5, this.w - 1, this.h - 1);

    ctx.font = "12px open_sans_condensedbold";
    ctx.textAlign = "left";
    ctx.setShadow("#111", 0, 2, 2);
    ctx.fillStyle = color.yellow;
    ctx.fillText(lang.THRESHOLD + ": " + VtoTHRESH(d) + " dB", 4, 20);
    ctx.fillText(lang.RATIO + ": " + precision(VtoRATIO(e), 2), 4, 35);

    this.showPreset && (ctx.textAlign = "left",
    ctx.fillStyle = 1 == selectedStrip.getNameValue("dyn.prmod") ? "#444" : color.green
    /*ctx.font = "18px open_sans_condensedbold",
    ctx.fillText(selectedStrip.getNameValue("dyn.prname"), 4, 18, this.w - 10)*/)
  },
  drawCircle: function(a, b, c, d, e) {
    c ? (ctx.fillStyle = "rgba(255,80,80,0.95)",
    ctx.strokeStyle = "rgba(200,0,0,0.6)",
    ctx.lineWidth = 3) : (ctx.fillStyle = "rgba(80,255,80,0.95)",
    ctx.strokeStyle = "rgba(255,255,255,0.5)",
    ctx.lineWidth = 2);
    ctx.fillStyle = this.colors[d];
    ctx.strokeStyle = this.colors[d];
    this.bypass && (ctx.fillStyle = "rgba(255,255,255,0.4)",
    ctx.strokeStyle = "rgba(255,255,255,0.3)");
    ctx.beginPath();
    ctx.arc(a, b, 13 + (e ? 10 : 0), 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(a, b, this.touchRadius + (e ? 12 : 0), 0, 2 * Math.PI);
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.globalAlpha = 1;
    c && ctx.stroke();
  },
  cachePaint: function() {
    null  != this.cachedBg && delete this.cachedBg;
    this.cachedBg = document.createElement("canvas");
    var a = this.cachedBg.getContext("2d");
    isRetina ? (this.cachedBg.width = 2 * this.w,
    this.cachedBg.height = 
    2 * this.h,
    a.scale(2, 2)) : (this.cachedBg.width = this.w,
    this.cachedBg.height = this.h);
    var b = this.w
      , c = this.h
      , d = this.w / 96
      , e = this.h / 96;
    a.fillStyle = "#0A0B0C";
    a.fillRect(0, 0, b, c);
    /*false || (a.fillStyle = this.grad,
    a.fillRect(0, 0, b, c));*/
    a.strokeStyle = "rgba(255,255,255,0.04)";
    a.lineWidth = 1;
    a.beginPath();
    for (var f = 0; 90 >= f; f += 10)
      a.moveTo((d * f | 0) + .5, 0),
      a.lineTo((d * f | 0) + .5, c),
      a.moveTo(0, (c - e * f | 0) + .5),
      a.lineTo(b, (c - e * f | 0) + .5);
    a.stroke();
    this.cachedBgW = this.w;
    this.cachedBgH = this.h
    
  }
});

SCENE = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "SCENE";
    this.scenes = [];
    this.items = [];
    this.buttons = [];
    this.needClip = this.needMoveEvt = !0;
    this.buttonw = 160;
    this.buttonh = 40;
    this.maxX = 720;
    this.itemH = 50;
    this.offsetY = 0;
    this.initWidgets();
  },
  initWidgets: function() {
    var that = this;
    this.buttons = [];
    this.widgets = [];
    this.setItems(_.clone(getValue("sceneList")));
    for(var i = 0; i < this.items.length; i++) {
      var button = new Button(this);
      //console.log(this);
      button.clr0 = "#0a151d";
      button.setSize(160, 40);
      button.valueFunc = function() {
        var text = this.text;
        //console.log(this);
        if(text !== '+') {
          htmlApply.valueFunc = function() {
            send_Data({"msgType":"LOAD SCENE","name":text});
          };

          htmlCover.valueFunc = function() {
            send_Data({"msgType":"RECOVER SCENE","name":text});
          };

          htmlDelete.valueFunc = function() {
            send_Data({"msgType":"REMOVE SCENE","name":text});
          };

          showEditBox3(lang.SCENEHANDLE.format(text));
        }else {
          editOk.valueFunc = function() {
            var a = editBox2.value;
            send_Data({"msgType":"ADD SCENE","name":a});
          }
          showEditBox2(lang.SCENENAME.format(text), text);
        }
      }
      this.buttons.push(button);
    }
  },
  calcGeometry: function() {
    this.x = 0;
    this.y = 20;
    this.w = screenWidth - measures.masterStripWidth;
    this.h = this.parent.h - 40;

    var rows = parseInt(this.w / (this.buttonw + 40));
    var offset = (this.w - (this.buttonw + 40) * rows) / 2;
    var lines = Math.ceil(this.items.length / rows)
    for(var i = 0; i < lines; i++) {
      for(var j = 0; j < rows; j++) {
        var no = i * rows + j;
        if(no < this.items.length) {
          this.buttons[no].setPos(j * (this.buttonw + 40) + offset, 10 + i * (this.buttonh + 10));
          this.buttons[no].setText(this.items[no]);
        }
      }
    }

    /*this.maxX = this.buttons[this.buttons.length - 1].y + this.buttonh - this.h;*/

    this.maxX = this.items.length * this.itemH - this.h;
    0 > this.maxX && (this.maxX = 0);
    this.offsetY > this.maxX && this.setOffset(this.maxX);
  },
  setItems: function(a, b) {
    Array.isArray(a) ? (isDefined(b) || (b = !0),
    this.items = a,
    this.maxX = this.items.length * this.itemH - this.h,
    0 > this.maxX && (this.maxX = 0),
    b && this.setOffset(0),
    regUpdate(this)) : this.items = ['+'];
  },
  onDown: function(a, b) {
    this.lastPressPoint = this.pressPoint;
    this.pressPoint = [a, b];
    this.ppy = this.offsetY + b;
  },
  onMove: function(a, b, c) {
    4 < mouseTargets.length || isDefined(tHash[c]) && 4 < tHash[c].length || this.setOffset(this.ppy - b);
  },
  onUp: function(a) {

  },
  setOffset: function(a) {
    this.offsetY = bound(a | 0, 0, this.maxX);
    regUpdate(this);
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, this.offsetY, this.w, this.h);
    /*ctx.fillStyle = "white";
    ctx.fillText('SCENE', 0, 50);*/
    /*this._lines = Math.ceil(this.items.length / this._rows)
    for(var i = 0; i < this._lines; i++) {
      for(var j = 0; j < this._rows; j++) {
        var no = i * this._rows + j;
        if(no < this.items.length) {
          //this.items[no].setPos(j * (this.buttonw + 40) + this._offset, 10 + i * (this.buttonh + 10));
          var __x = j * (this.buttonw + 40) + this._offset;
          var __y = 10 + i * (this.buttonh + 10);
          ctx.textAlign = 'center';
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#0a151d";
          ctx.fillRect( __x, __y, this.buttonw, this.buttonh);
          ctx.fillStyle = 'white';
          ctx.fillText(this.items[no], __x + this.buttonw * 0.5, __y + this.buttonh * 0.5);
        }
      }
    }*/
  }
});

VUDIS = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "VUDIS";
    this.x = 0;
    this.y = 0;
    this.vus = [];
    this.arr = [["CH1", !1, 0], ["CH2", !1, 1],["CH3", !1, 2], ["CH4", !1, 3],["CH5", !1, 4], 
                ["CH6", !1, 5],["CH7", !1, 6], ["CH8", !1, 7],["CH9", !1, 8], ["CH10", !1, 9],
                ["CH11", !1, 10], ["CH12", !1, 11],["CH13", !1, 12], ["CH14", !1, 13],["CH15", !1, 14], 
                ["CH16", !1, 15],["SPDIF", !0, 16], ["USB", !0, 18],["FXR-1", !0, 20], ["FXR-2", !0, 22],
                /*["FXR-3", !0, 20], ["FXR-4", !0, 22],*/["AUX1", !1, 24], ["AUX2", !1, 25], ["SUB", !0, 34],
                ["MAIN", !0, 28], ["FX1", !1, 30], ["FX2", !1, 31], ["FX3", !1, 32], ["FX4", !1, 33], ["Monitor", !0, 42]];
    this.blank = [16, 19, 24, 29, 34];
    this.initWidgets();
  },
  setValueExt: function() {
    regTick(this);
    regUpdate(this);
  },
  tick: function() {
    regUpdate(this);
  },
  calcGeometry: function() {
    this.w = screenWidth - measures.masterStripWidth;
    this.h = screenHeight;

    this.x = 0;
    this.y = 0;

    var rowNum = 16;
    var itemW = this.w / 16 - 1;
    var itemH = (this.h - this.y * 2) / 2;
    var n = 0;
    for(var i = 0; i < this.vus.length; i++) {
      this.vus[i].setSize(itemW, itemH);
      /*function fastIndex(a, b){
        if(a.indexOf(i+n-b) !== -1) {
          n++;
          fastIndex(a, b);
        }else {
          return;
        }
      }*/

      if(i < rowNum) {
        //fastIndex(this.blank, 0);
        this.vus[i].setPos(itemW * (i + n), 0);
      }else{
        //fastIndex(this.blank, 0);
        this.vus[i].setPos(itemW * (i + n - rowNum), itemH);
      }
    }
  },
  initWidgets: function() {
    for(var i = 0; i < this.arr.length; i++) {
      var vu = new VU(this);
      vu.text = this.arr[i][0];
      vu.stero = this.arr[i][1];
      vu.index = this.arr[i][2];
      this.vus.push(vu);
    }
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);
    /*ctx.fillStyle = "white";
    ctx.fillText('VUDIS', 0, 50);*/
  }
});

VU = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "VU";
    this.val0 = 0;
    this.val1 = 0;
    this.stero = !1;
  },
  calcGeometry: function() {
    this.vuH = this.h * 5 / 6;
    this.vuy = this.h / 12; 
    
    if(!this.stero) {
      this.vuW = this.w / 3;

      this.vux = this.w / 2 - this.vuW / 2;
    }else {
      this.vuW = this.w / 4;
      
      this.vux1 = this.w / 2 - this.vuW - 1;
      this.vux2 = this.w / 2 + 1;
    }

    this.createGradient();
  },
  createGradient: function() {
    this.vuGradH == this.h || (this.vuGrad = ctx.createLinearGradient(0, this.h, 0, 0),
    this.vuGrad.addColorStop(0, "green"),
    this.vuGrad.addColorStop(.5, "yellow"),
    this.vuGrad.addColorStop(1, "red"), this.vuGradH = this.h)
  },
  paint: function() {
    this.val0 = VUtoV(vu[this.index]) || 0;
    this.stero && (this.val1 = VUtoV(vu[this.index + 1]) || 0);
    ctx.fillStyle = '#00182b';
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.fillStyle = ctx.strokeStyle = "#eee";
    ctx.font = "12px arial";
    ctx.lineWidth = 1;
    ctx.textAlign = 'center';
    ctx.fillText(this.text, this.w / 2, this.h - 10);
    ctx.strokeRect(0, 0, this.w, this.h)

    //this.val0 = this.val1 = 1
    ctx.fillStyle = this.vuGrad;
    if(this.stero) {
      var H1 = this.vuH * (1 - this.val0);
      ctx.fillRect(this.vux1, this.vuy + H1 - 5, this.vuW, this.vuH * this.val0);
      var H2 = this.vuH * (1 - this.val1);
      ctx.fillRect(this.vux2, this.vuy + H2 - 5, this.vuW, this.vuH * this.val1);
    }else {
      var H1 = this.vuH * (1 - this.val0);
      ctx.fillRect(this.vux, this.vuy + H1 - 5, this.vuW, this.vuH * this.val0);
    }
  }
});

REC = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "REC";
  },
  onShow: function() {
    showPopupMsg(lang.alertWaiting);
  },
  calcGeometry: function() {
    this.x = 0;
    this.y = 20;
    this.w = this.parent.w;
    this.h = this.parent.h;
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.fillStyle = "white";
    //ctx.fillText('REC', 0, 50);
  }
});

MAINSEND = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "MAINSEND";
    this.buttons = [];
    this.pages = [];
    this.mode = -1;
    this.color = color.white;
    this.arr = [];
    this.w = screenWidth - measures.masterStripWidth;
    this.initWidgets();
  },
  initWidgets: function() {
    var a = this;
    this.SWITCH = new SWITCHBOX(this);
    this.SWITCH.setItems(['AUX1', 'AUX2', 'SUB', 'MAIN']);
    this.SWITCH.setItemWidth(this.w / 4);
    this.SWITCH.color = color.media;
    this.SWITCH.h = 40;
    this.SWITCH.valueFunc = function() {
      a.all.changeType(this.items[this.state]);
      a.allDisplay.changeType(this.items[this.state]);
    };

    this.all = new AllMainStripss(this, "AUX1");

    this.allDisplay = new AllMainStripsPrev(this, "AUX1");
  },
  calcGeometry: function() {
    this.x = 0;
    this.y = 0;
    this.w = this.parent.w;
    this.h = this.parent.h;

    this.SWITCH.setPos(0, 0);
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);
    /*ctx.fillStyle = "white";
    ctx.fillText('MAINSEND', 0, 50);*/
  }
});

FXSEND = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "FXSEND";
    this.buttons = [];
    this.pages = [];
    this.mode = -1;
    this.color = color.white;
    this.arr = [];
    this.w = screenWidth - measures.masterStripWidth;
    this.initWidgets();
  },
  initWidgets: function() {
    var a = this;
    this.SWITCH = new SWITCHBOX(this);
    this.SWITCH.setItems(['FXSend1', 'FXSend2']);
    this.SWITCH.setItemWidth(this.w / 2);
    this.SWITCH.color = color.media;
    this.SWITCH.h = 40;
    this.SWITCH.valueFunc = function() {
      a.all.changeType(this.items[this.state]);
      a.allDisplay.changeType(this.items[this.state]);
    };

    this.all = new AllMainStripss(this, "FXSend1");

    this.allDisplay = new AllMainStripsPrev(this, "FXSend1");
  },
  calcGeometry: function() {
    this.x = 0;
    this.y = 0;
    this.w = this.parent.w;
    this.h = this.parent.h;

    this.SWITCH.setPos(0, 0);
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);
    /*ctx.fillStyle = "white";
    ctx.fillText('FXSEND', 0, 50);*/
  }
});

SETTING = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "SETTING";
    this.w = screenWidth - measures.masterStripWidth;
    this.buttons = [];
    this.pages = [];
    this.mode = -1;
    this.E_MODE = {
      globalSet: 0,
      network: 1
    };
    this.initWidgets();
    this.setMode(0);
  },
  initWidgets: function() {
    var a = this;

    var c = [lang.GLOBALSET, lang.NETWORK];
    var d = ["#264863", "#264863"];
    var e = ["#FFF", "#FFF"];

    for(var f = 0; f < c.length; f++) {
      var b = new TabButton(this);
      b.color = d[f];
      b.textColor = e[f];
      b.mode = f;
      b.font = "13pt Arial";
      b.text = c[f];
      b.setSize(this.w / 2, 30);
      this.buttons.push(b);
    }

    this.pages.push(new SETTING_GLOBALSET(this));
    this.pages.push(new SETTING_NETWORK(this));
  },
  calcGeometry: function() {
    this.x = 0;
    this.y = 0;
    this.w = this.parent.w;
    this.h = this.parent.h;

    var b = 0;
    var a = 0;
    for(var c = 0; c < this.buttons.length; c++) {
      this.buttons[c].enabled && (this.buttons[c].setPos(b, 5), 
        b += this.buttons[c].w,
        a++);
    }
  },
  setMode: function (a) {
    if(this.mode !== a) {
      if(a == -1){
        for(var b = 0; b < this.pages.length; b++) {
          this.pages[b].hide();
          regUpdate(this);
        }
      }else if ("undefined" !== typeof this.buttons && "undefined" !== typeof this.buttons[a] && this.buttons[a].enabled) {
        this.mode = a;
        for(b = 0; b < this.pages.length; b++) {
          this.pages[b].enabled && this.pages[b].hide();
        }
        this.pages[a].show();
        this.color = this.buttons[a].color;
        regUpdate(this);
      }
    }
  },
  paint: function() {
    this.buttons[0].text = lang.GLOBALSET;
    this.buttons[1].text = lang.NETWORK;

    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);
  }
});

EQParamWidget = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "EQParamWidget";
    this.needMoveEvt = this.needClip = !0;
    this.touchRadius = 26;
    this.radius = 23
    this.RATE = 48E3;
    this.pressed = !1;
    this.touchID = -1;
    this.peaks = this.grd = null;
    this.bypass = !1;
    this.bands = 6;
    this.colors = ["#2D5EAA", "#2c8f29", "#b23535", "#752E99", "#C7AB35", "#2D5EAA"];
    this.isClipping = !1;
    this.timer = null ;
    this.point1 = [-1, -1];
    this.point1id = -1;
    this.point2 = [-1, -1];
    this.point2id = -2;
    this.p1 = [-1, -1];
    this.p2 = [-1, -1];
    this.tn = 0;
    this.dist = -1;
    this.moved = this.easy = !1;
    this.stY = -1;
    this.cachedBgBypass = this.cachedBg = null ;
    this.cachedBgW = this.cachedBgH = 0;
    this.lastP = !1;
    this.arr = ["hpf", "b1", "b2", "b3", "b4", "lpf"];
    this.rtaTimer = this.rta = this.egrad = null ;
    this.delta = [0, 0];
    this.ds = !1;
    this.ds_thr = this.ds_ratio = this.ds_freq = 0;
    this.showCurrentCurve = this.showPreset = this.showAllCurve = !0;
  },
  calcGeometry: function() {
    var a = this.w;
    this.grd = ctx.createRadialGradient(a / 2, -10, a / 10, a / 2, -10, a / 2 + 10);
    this.grd.addColorStop(0, "rgba(255,255,255,0.2)");
    this.grd.addColorStop(1, "rgba(255,255,255,0)");
  },
  getValues: function() {
    this.peaks = [];

    var a = this.parent.keyPrefix;
    this.bypass = toBool(getValue(a + "bypass"));
    this.lpf = toBool(getValue(a + 'lpf'));
    this.hpf = toBool(getValue(a + 'hpf'));

    if(selectedStrip.type == E_STRIP_TYPE.IN || selectedStrip.type == E_STRIP_TYPE.PLAYER) {
      this.easyChannel = !1;
      this.parent.bHPF.disabled = !1;
      this.parent.bLPF.disabled = !1;
    }else {
      this.easyChannel = !0;
      this.parent.bLPF.disabled = !0;
      this.parent.bHPF.disabled = !0;
    }

    for(var c = 0; c < this.arr.length; c++) {
      var z = this.arr[c],
          d = a + z,
          e = VtoFREQ(getValue(d + ".freq"));
      if("hpf" == z || "lpf" == z){
        this.peaks.push([e, 1, 0]);
      }else {
        var f = VtoQ(getValue(d + '.q')),
            d = VtoEQGAIN20(getValue(d + ".gain"));
        this.peaks.push([e, f, d]);
      }
    }
  },
  onDown: function(a, b, c) {
    a -= this.globalX();
    var d = b - this.globalY();
    this.stY = b;
    this.moved = !1;
    switch (this.tn) {
      case 0:
        this.point1id = c;
        this.point1 = [a, d];
        break;
      case 1:
        this.point2id = c,
        this.point2 = [a, d];
        break;
    }
    this.tn++;
    if(!this.pressed) {
      b = .5 * this.h / 20;
      var e = this.h / 2 | 0;
      this.getValues();
      for(var f = 0; f < this.bands; f++) {
        var g = this.freqToX(this.peaks[f][0]),
            h = e - this.peaks[f][2] * b;

        var k = this.touchRadius;
        if(20 > g || g > this.w - 20 || 20 > h || h > this.h - 20)
          k += this.touchRadius;
        if(isInCircle(g, h, k, a, d)) {
          if(this.easyChannel && (f == 0 || f == 5)) {
            continue;
          }
          this.parent.setMode(f);
          this.pressed = !0;
          this.touchID = c;
          this.delta = [g - a, h - d];
        }
      }
    }
  },
  onMove: function(a, b, c) {
    var d = this.parent;
    5 < Math.abs(b - this.stY) && (this.moved = !0);
    this.pressed && this.touchID == c && (a += this.delta[0],
      b += this.delta[1]);
    a = bound(a - this.globalX(), 0, this.w);
    b = bound(b - this.globalY(), 0, this.h);

    switch(c) {
      case this.point1id:
        this.point1 = [a, b];
        break;
      case this.point2id:
        this.point2 = [a, b];
        break;
    }

    if(2 == this.tn) {
      c = Math.sqrt(Math.pow(this.point1[0] - this.point2[0], 2) + Math.pow(this.point1[1] - this.point2[1], 2));
      b = bound(c - this.dist, -20, 20) / this.w * .6;
      if(0 < this.dist) {
        switch(d.mode) {
          case 1:
          case 2:
          case 3:
          case 4:
            /*a = this.parent.slQ.getVal();
            a = bound(a - b, 0, 1);
            regUpdate(this);*/
            var e = "eq." + this.arr[d.mode] + '.q',
            _a = selectedStrip.getNameValue(e),
            f = bound(_a - b, 0, 1);
        
          selectedStrip.setNameValue(e, f);
          regUpdate(this);
          break;
        }
      }
      this.dist = c;
    }else if (this.pressed && this.touchID == c) {
      switch (d.mode) {
        case 0:
          setValue(d.led_kp + 'freq', bound(a / this.w, 0, 1));
          regUpdate(this);
          break;
        case 1:
        case 2:
        case 3:
        case 4:
          setValue(d.led_kp + 'freq', a / this.w),
          setValue(d.led_kp + 'gain', 1 - b / this.h);
          regUpdate(this);
          break;
        case 5:
          setValue(d.led_kp + 'freq', bound(a / this.w, 0, 1));
          regUpdate(this);
          break;
      }
      regUpdate(this);
    }
  },
  onUp: function(a) {
    this.dist = -1;
    switch (this.tn) {
      case 1:
        this.point1 = [-1, -1];
        break;
      case 2: 
        this.point2 = [-1, -1],
        this.lastClickTime = 0;
    }
    this.tn--;
    a = this.parent;
    var b = Date.now();
    
    this.lastP = this.pressed;
    this.pressed = !1;
    this.moved || 0 != this.tn || (this.lastClickTime = b);
    this.lastClickIdx = a.mode;
    this.touchID = -1;
  },
  onWheel: function(a) {
    var b = this.parent;

    switch (b.mode) {
      case 1:
      case 2:
      case 3:
      case 4:
        var c = "eq." + this.arr[b.mode] + '.q',
            d = selectedStrip.getNameValue(c),
            d = bound(d + a / 120 / 30, 0, 1);
        
        selectedStrip.setNameValue(c, d);
        regUpdate(this);
        break;
    }
  },
  freqToX: function(a) {
      return (this.w - 1) * Math.log(a / 20) / Math.log(1102.5)
  },
  designPeak: function(a, b, c, d) {
      if (-.001 <= d && .001 >= d)
          return [1, 0, 0, 1, 0, 0];
      d = Math.pow(10, d / 40);
      b = 2 * Math.PI * b / a;
      a = Math.cos(b);
      c = b * (2 * Math.PI - b) / (c * (4 * Math.PI - b));
      var e = 1 + c / d;
      b = -(2 * a) / e;
      var f = (1 - c / d) / e
        , e = Math.pow(10, 0) / e;
      return [(1 + c * d) * e, -(2 * a) * e, (1 - c * d) * e, 1, b, f]
  },
  designHP: function(a, b, c) {
      if (20.1 > b)
          return [1, 0, 0, 1, 0, 0];
      a = 2 * Math.PI * b / a;
      b = Math.sin(a);
      a = Math.cos(a);
      var d = b / (2 * c);
      b = 1 + d;
      c = -(2 * a) / b;
      d = (1 - d) / b;
      b = Math.pow(10, 0) / b;
      return [.5 * (1 + a) * b, -(1 + a) * b, .5 * (1 + a) * b, 1, c, d]
  },
  designLP: function(a, b, c) {
      if (22049.9 < b)
          return [1, 0, 0, 1, 0, 0];
      a = 2 * Math.PI * b / a;
      b = Math.sin(a);
      a = Math.cos(a);
      var d = b / (2 * c);
      b = 1 + d;
      c = -(2 * a) / b;
      d = (1 - d) / b;
      b = Math.pow(10, 0) / b;
      return [.5 * (1 - a) * b, (1 - a) * b, .5 * (1 - a) * b, 1, c, d]
  },
  paint: function() {
    this.getValues();
    this.cachedBgW == this.w && this.cachedBgH == this.h || this.cachePaint();
    
    ctx.drawImage(this.cachedBg, 0, 0, this.w, this.h);
    this.bypass && (ctx.fillStyle = "rgba(255,255,255,0.04)",ctx.fillRect(0, 0, this.w, this.h));

    var a = this.w,
        b = this.h,
        c = this.peaks,
        d = .5 * b /20,
        e = b / 2 | 0;
    if(null == this.freqPlot || this.freqPlot.length != a) {
      this.freqPlot = Array(a);
      this.freqPlot2 = Array(a);
      this.freqPlot0 = Array(a);
      this.freqPlot1 = Array(a);
      this.freqPlot3 = Array(a);
      this.freqPlot4 = Array(a);
      this.freqPlot5 = Array(a);
      this.xToFreq =Array(a);
      this.xToAngular = Array(a);
      this.xCos1 = Array(a);
      this.xCos2 = Array(a);
      for (var f = 0; f < a; f++) {
        var b = 20 * Math.pow(1102.5, 1 * f / a)
          , g = 2 * b * Math.PI / this.RATE
          , h = Math.cos(g)
          , k = Math.cos(2 * g);
        this.xToFreq[f] = b;
        this.xToAngular[f] = g;
        this.xCos1[f] = h;
        this.xCos2[f] = k;
      }
    }
    for(b = 0; b < a; b++)
      this.freqPlot[b] = 0,
      this.freqPlot0[b] = 0,
      this.freqPlot1[b] = 0,
      this.freqPlot2[b] = 0,
      this.freqPlot3[b] = 0,
      this.freqPlot4[b] = 0,
      this.freqPlot5[b] = 0;

    for(b = 0; b < this.bands; b++) 
        for (var g = null , g = 'hpf' == this.arr[b] ? this.designHP(this.RATE, bound(c[b][0], 20, 22000), Math.sqrt(2) / 2) 
          : ( 'lpf' == this.arr[b] ? this.designLP(this.RATE, bound(c[b][0], 20, 22000), Math.sqrt(2) / 2) : this.designPeak(this.RATE, c[b][0], c[b][1], c[b][2])), f = g[3], l = g[0], n = g[1], m = g[2], p = g[4], h = g[5], 
        g = l * l + n * n + m * m, n = 2 * n * (l + m), l = 2 * l * m, m = f * f + p * p + h * h, p = 2 * p * (f + h), q = 2 * f * h, f = 0; f < a; f++)
            h = this.xCos1[f],
            k = this.xCos2[f],
            h = 4.3429448190325175 * Math.log((g + n * h + l * k) / (m + p * h + q * k)),
            (!(this.easyChannel && ((b == 0) || (b == 5)))) && !(!this.hpf && 0 === b) && !(!this.lpf && 5 === b) && (this.freqPlot[f] += h),

            0 == b && !this.easyChannel && this.hpf &&(this.freqPlot0[f] += h),
            1 == b && (this.freqPlot1[f] += h),
            2 == b && (this.freqPlot2[f] += h),
            3 == b && (this.freqPlot3[f] += h),
            4 == b && (this.freqPlot4[f] += h),
            5 == b && !this.easyChannel && this.lpf && (this.freqPlot5[f] += h);

      ctx.lineWidth = 2;
      ctx.lineJoin = "round";

      var allCurve = [this.freqPlot0, this.freqPlot1, this.freqPlot2, this.freqPlot3, this.freqPlot4, this.freqPlot5];
      if (this.showAllCurve) {
        for(var i = 0; i < this.arr.length; i++) {
          ctx.beginPath();
          for(f = 0; f < a; f++)
              if (!(1 == (f & 1) && f < a - 1) || allCurve[i][f] > allCurve[i][f - 1] && allCurve[i][f] > allCurve[i][f + 1] || allCurve[i][f] < allCurve[i][f - 1] && allCurve[i][f] < allCurve[i][f + 1])
                  g = e - d * allCurve[i][f],
                  0 == f && ctx.moveTo(f, g),
                  ctx.lineTo(f, g);
          ctx.lineWidth = 1;
          ctx.strokeStyle = this.colors[i];
          this.parent.mode == i ? ctx.fillStyle = hexToRGBA(this.colors[i], .8) : ctx.fillStyle = hexToRGBA(this.colors[i], .1);
          //ctx.stroke();
          ctx.lineTo(a, e);
          ctx.lineTo(0, e);
          ctx.closePath();
          ctx.fill()
        }
      }
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.strokeStyle = "#e6b450";
      ctx.lineWidth = 2;
      for (f = 0; f < a; f++)
          if (!(1 == (f & 1) && f < a - 1) || this.freqPlot[f] > this.freqPlot[f - 1] && this.freqPlot[f] > this.freqPlot[f + 1] || this.freqPlot[f] < this.freqPlot[f - 1] && this.freqPlot[f] < this.freqPlot[f + 1])
              g = e - d * this.freqPlot[f],
              0 == f && ctx.moveTo(f, g),
              ctx.lineTo(f, g);
      ctx.stroke();
      ctx.lineTo(a, e);
      ctx.lineTo(0, e);
      ctx.closePath();
      ctx.fill();
      ctx.textAlign = "center";
      if (this.easyChannel)
          for (ctx.strokeStyle = "rgba(255,255,255,0.5)",
            ctx.font = "bold 14px open_sans_condensedbold",
            l = ["H", "1", "2", "3", "4", "L"],
            b = 1; b < this.bands - 1; b++)
              f = this.freqToX(c[b][0]),
              g = e - c[b][2] * d,
              ctx.lineWidth = "3",
              this.bypass && 0 != b ? (ctx.fillStyle = "rgba(255,255,255,0.4)",
              ctx.strokeStyle = "rgba(255,255,255,0.3)") : (ctx.fillStyle = this.colors[b],
              ctx.strokeStyle = this.colors[b]),
              ctx.globalAlpha = .9,
              ctx.beginPath(),
              ctx.arc(f, g, this.radius, 0, 2 * Math.PI),
              ctx.fill(),
              ctx.globalAlpha = 1,
              ctx.beginPath(),
              ctx.arc(f, g, this.touchRadius, 0, 2 * Math.PI),
              ctx.globalAlpha = .38,
              ctx.fill(),
              ctx.globalAlpha = 1,
              this.parent.mode == b && ctx.stroke(),
              ctx.fillStyle = "#060606",
              ctx.fillText(l[b], f + 1, g + 6),
              ctx.fillStyle = "#F0F0F0",
              ctx.fillText(l[b], f, g + 5);
      else
          for (ctx.strokeStyle = "rgba(255,255,255,0.5)",
            ctx.font = "bold 14px open_sans_condensedbold",
            l = ["H", "1", "2", "3", "4", "L"],
            b = 0; b < this.bands; b++)
              f = this.freqToX(c[b][0]),
              g = e - c[b][2] * d,
              ctx.lineWidth = "3",
              this.bypass && true ? (ctx.fillStyle = "rgba(255,255,255,0.4)",
              ctx.strokeStyle = "rgba(255,255,255,0.3)") : (ctx.fillStyle = this.colors[b],
              ctx.strokeStyle = this.colors[b]),
              ctx.globalAlpha = .9,
              ctx.beginPath(),
              ctx.arc(f, g, this.radius, 0, 2 * Math.PI),
              ctx.fill(),
              ctx.globalAlpha = 1,
              ctx.beginPath(),
              ctx.arc(f, g, this.touchRadius, 0, 2 * Math.PI),
              ctx.globalAlpha = .38,
              ctx.fill(),
              ctx.globalAlpha = 1,
              this.parent.mode == b && (ctx.strokeStyle = "rgba(255,255,255,0.8)", ctx.stroke()),
              ctx.fillStyle = "#060606",
              ctx.fillText(l[b], f + 1, g + 6),
              ctx.fillStyle = "#F0F0F0",
              ctx.fillText(l[b], f, g + 5);
      
      //display value
      ctx.font = "16px open_sans_condensedbold";
      ctx.fillStyle = color.orange;
      ctx.textAlign = 'left';
      switch (this.parent.mode) {
        case 0:
        case 5:
          ctx.fillText('freq: ' + VtoFREQ(getValue(this.parent.led_kp + 'freq')).toFixed(0) + ' dB', 5, 15);
          break;
        default:
          ctx.fillText('freq: ' + VtoFREQ(getValue(this.parent.led_kp + 'freq')).toFixed(0) + ' dB', 5, 15);
          ctx.fillText('gain: ' + VtoEQGAIN20(getValue(this.parent.led_kp + 'gain')).toFixed(1) + ' dB', 5, 33);
          ctx.fillText('q: ' + VtoQ(getValue(this.parent.led_kp + 'q')).toFixed(2), 5, 51);
          break;
      }

      this.easy && (ctx.font = "21px open_sans_condensedbold",
      ctx.fillStyle = color.white,
      ctx.textAlign = "center",
      ctx.fillText("BASS", this.freqToX(50) | 0, this.h - 20),
      ctx.fillText("MID", this.freqToX(1E3) | 0, this.h - 20),
      ctx.fillText("TREBLE", this.freqToX(8E3) | 0, this.h - 20));

      this.ds && (ctx.strokeStyle = "rgba(0,250,0,0.2)",
      ctx.lineWidth = 2,
      c = this.freqToX(DeesserVtoFREQ(this.ds_freq)) | 0,
      d = 3 + (1 - this.ds_thr) * (this.h - 6) | 0,
      ctx.beginPath(),
      ctx.dashedLine(c, 0, c, this.h, 10),
      ctx.stroke(),
      e = this.freqToX(5E3) - this.freqToX(2E3),
      ctx.beginPath(),
      ctx.moveTo(c - e, this.h),
      ctx.quadraticCurveTo(c, d, c + e, this.h),
      ctx.closePath(),
      d = precision(.07 * this.ds_ratio, 4),
      ctx.fillStyle = "rgba(0,255,0," + d + ")",
      ctx.fill(),
      ctx.stroke(),
      f = c,
      g = 3 + (1 - this.ds_thr / 2) * (this.h - 6) | 0,
      ctx.lineWidth = 3,
      this.bypass ? (ctx.fillStyle = "rgba(255,255,255,0.4)",
      ctx.strokeStyle = "rgba(255,255,255,0.3)") : (ctx.strokeStyle = "rgba(100,255,100,0.3)",
      ctx.fillStyle = "rgba(100,255,100,0.4)"),
      ctx.globalAlpha = 1,
      ctx.beginPath(),
      ctx.arc(f, g, this.touchRadius, 0, 2 * Math.PI),
      ctx.globalAlpha = .38,
      ctx.fill(),
      ctx.globalAlpha = 1,
      77 == this.parent.mode && ctx.stroke(),
      ctx.fillStyle = "rgba(0,0,0,0.4)",
      ctx.globalAlpha = .9,
      ctx.beginPath(),
      ctx.arc(f, g, 13, 0, 2 * Math.PI),
      ctx.fill(),
      ctx.fillStyle = "#F0F0F0",
      ctx.font = "bold 15px open_sans_condensedbold",
      ctx.fillText("DS", f - (0 == b ? 1 : 0), g + 5),
      ctx.shadowColor = "transparent");

      ctx.lineWidth = 1;
      ctx.strokeStyle = "#222";
      ctx.strokeRect(.5, .5, this.w - 1, this.h - 1);
      this.showPreset && (ctx.textAlign = "left",
      ctx.fillStyle = 1 == selectedStrip.getNameValue("eq.prmod") ? "#444" : color.red,
      ctx.setShadow(color.black, 0, 2, 2),
      ctx.font = "18px open_sans_condensedbold");
      //ctx.fillText(selectedStrip.getNameValue("eq.prname"), 4, 18);
  },
  cachePaint: function() {
    null != this.cachedBg && delete this.cachedBg;
    this.cachedBg = document.createElement("canvas");
    var a = this.cachedBg.getContext("2d");
    this.cachedBg.width = this.w;
    this.cachedBg.height = this.h;
    var b = this.w,
        c = this.h,
        d = .5 * c /20,
        e = c / 2 | 0;
    a.fillStyle = "#0a0b0c";
    a.fillRect(0, 0, this.w, this.h);

    a.fillStyle = "black";//this.grd;
    a.fillRect(0, 0, b, c);

    a.font = font.eqMarks;
    a.textAlign = "center";
    a.lineWidth = 1;
    a.fillStyle = "rgba(255,255,255,0.3)";
    a.fillRect(0, e - 1, b, 2);
    a.fillStyle = "rgba(255,255,255,0.1)";
    a.fillRect(0, e - 10 * d | 0, b, .5);
    a.fillRect(0, e + 10 * d | 0, b, .5);
    a.strokeStyle = "rgba(255,255,255,0.15)";
    a.lineWidth = .5;

    a.beginPath();
    a.moveTo(0, e - 1);
    a.lineTo(b, e - 1);
    a.fillStyle = color.labelText;
    for(b = 30; 100 >= b; b +=10)
      d = (this.freqToX(b) | 0) + .5,
      a.moveTo(d, 0),
      a.lineTo(d, c - 1);
    for(b = 100; 1E3 >= b; b +=100)
      d = (this.freqToX(b) | 0) + .5,
      a.moveTo(d, 0),
      a.lineTo(d, c - 1);
    for(b = 1E3; 1E4 >= b; b +=1E3)
      d = (this.freqToX(b) | 0) + .5,
      a.moveTo(d, 0),
      a.lineTo(d, c - 1);
    a.stroke();
  }
});

AllMainStripsPrev = Class.create(Widget, {
  initialize: function($super, b, c) {
    $super(b);
    this.widgetName = "AllMainStripsPrev";
    this.x = 0;
    this.y = 40;
    this.type = c;
    this.enabled = !0;
    this.text = ["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12","C13","C14","C15","C16","Spd", "USB", "FR1","FR2"];
    this.name = ["i.0.", "i.1.", "i.2.", "i.3.", "i.4.", "i.5.", "i.6.", "i.7.", "i.8.", "i.9.", "i.10.", "i.11.", "i.12.", "i.13.", "i.14.", "i.15.", "sp.0.", "p.0.", "f.0.","f.1."];
  },
  calcGeometry: function() {
    this.w = measures.mixerStripWidth;
    this.h = this.parent.h;
  },
  changeType: function(a) {
    this.type = a;
    regUpdate(this);
  },
  paint: function() {
    this.cacheH != this.h && this.cachePaint();
    drawImage(this.cache, 0, 0);

    for(var i = 0, len = this.text.length; i < len; i++) {
      //console.log(this.name[i] + this.type + '.gain', 'zz');
      //ctx.fillText(getValue(this.name[i] + this.type + '.gain'), 30, 20 + 15 * i)

      ctx.fillStyle = color.blue;
      var width = 45 * getValue(this.name[i] + this.type + '.gain');
      ctx.fillRect(35, 10 + 15 * i, width, 10);
      
      //"#576069";
      //"#DC7092";

      ctx.fillStyle = getValue(this.name[i] + this.type + '.PF') ? "#DC7092" : "#576069";
      ctx.fillRect(30, 10 + 15 * i, 5, 10);
      ctx.fillStyle = getValue(this.name[i] + this.type + '.ON') ? "#DC7092" : "#576069";
      ctx.fillRect(35 + width + 1, 10 + 15 * i, 5, 10);
    }
  },
  cachePaint: function() {
    this.cache = document.createElement('canvas');
    var a = this.cache.getContext('2d');

    this.cache.width = this.w;
    this.cache.height = this.h;

    a.fillStyle = "#00182b";
    a.fillRect(0, 0, this.w, this.h);

    a.fillStyle = color.gray;
    a.font = "12px Arial";
    var voffset = 20,
        space = 15;
    for(var i = 0, len = this.text.length; i < len; i++) {
      a.fillText(this.text[i], 5, voffset + space * i);
      a.fillRect(35, 10 + 15 * i, 1, 10);
    }

    this.cacheH = this.h;
  }
});

AllMainStripss = Class.create(Widget, {
  initialize: function($super, b, c) {
    $super(b);
    this.widgetName = "AllMainStrips";
    this.x = measures.mixerStripWidth;
    this.y = 40;
    this.needClip = this.needMoveEvt = !0;
    this.hOffsetOld = 0;
    this.type = c;
    this.enabled = !0;
    this.strips = [];
    this.maxX = 720;
    this.text = ["CH1","CH2","CH3","CH4","CH5","CH6","CH7","CH8","CH9","CH10","CH11","CH12","CH13","CH14","CH15","CH16","Spdif", "USB", "FXR1","FXR2"];
    this.name = ["i.0.", "i.1.", "i.2.", "i.3.", "i.4.", "i.5.", "i.6.", "i.7.", "i.8.", "i.9.", "i.10.", "i.11.", "i.12.", "i.13.", "i.14.", "i.15.", "sp.0.", "p.0.", "f.0.","f.1."];
    this.initWidgets();
    this.onShow();
  },
  initWidgets: function() {
    var len = this.name.length;

    for(var i = 0; i < len; i++) {
      var simpleStrip = new SimpleStrip(this, this.name[i], this.type + '.', this.text[i]);
      this.strips.push(simpleStrip);
    }
  },
  onDown: function(a, b) {
    /*this.lastPressPoint = this.pressPoint;
    this.pressPoint = [a, b];
    this.ppx = this.offsetX + a;*/

    var c = b - this.globalY(),
        d = a - this.globalX();

    this.pressPoint = [d, c];
    0 < this.maxX && this.velStart();
  },
  onMove: function(a, b, c) {
    //4 < mouseTargets.length || isDefined(tHash[c]) && 4 < tHash[c].length || this.setOffset(this.ppx - a)
    var d = a - this.globalX();
    d -= this.pressPoint[0];

    4 < mouseTargets.length || isDefined(tHash[c]) && 4 < tHash[c].length || (this.offsetX = this.hOffsetOld - d,
    this.offsetX = bound(this.offsetX, 0, this.maxX), regUpdate(this));
  },
  onUp: function(a) {
    /*var b = Date.now(),
        c = Math.abs(this.lastPressPoint[0] - this.pressPoint[0]),
        d = Math.abs(this.lastPressPoint[1] - this.pressPoint[1]);

    2 < mouseTargets.length || isDefined(tHash[a]) && 2 < tHash[a].length || (30 > c
      && 30 > d && b - this.lastClickTime < DBL_CLK_TIME ? (this.onDouble(),
        this.lastClickTime = b - DBL_CLK_TIME) : this.lastClickTime = b)*/

    this.hOffsetOld = this.offsetX;
    0 < this.maxX && this.velRelease();
    regUpdate(this);    
  },
  setOffset: function(a) {
    this.hOffsetOld = this.offsetX = bound(a | 0, 0, this.maxX);
    regUpdate(this);
  },
  onShow: function() {
    this.syncSlider();
  },
  onDouble: function() {

  },
  changeType: function(a) {
    this.type = a;
    this.syncSlider();
    regUpdate(this);
  },
  syncSlider: function() {
    var len = this.name.length;
    for(var i = 0; i < len; i++) {
      this.strips[i].name = this.name[i] + this.type + '.';
      this.strips[i].syncComponent();
    }
  },
  velStart: function() {
    var that = this;
    velocity = amplitude = 0;
    timestamp = Date.now();
    clearInterval(ticker);
    frame = this.offsetX;
    ticker = setInterval(that.velTrack.bind(that), 1E3 / fps);
  },
  velRelease: function() {
    clearInterval(ticker);
    Date.now() - timestamp < 1E3 / fps && this.velTrack();
    5 < Math.abs(velocity) && this.mScroll(velocity);
  },
  velTrack: function() {
    var a, b;
    a = Date.now();
    b = a - timestamp;
    timestamp = a;
    a = this.offsetX - frame;
    frame = this.offsetX;
    b = 1E3 * a / (1 + b);
    velocity = 0 == velocity ? b : .3 * b + .7 * velocity;
  },
  mScroll: function(a) {
    if(!settings.kinetic) {
      var b = 1E3 / fps;
      position = this.offsetX;
      amplitude = .2 * a;
      step = 0;
      var c = this;
      clearInterval(ticker);
      ticker = setInterval(function() {
        var a = amplitude / b * 2;
        position += a;
        amplitude -= a;
        step += 1;
        .5 > Math.abs(a) && clearInterval(ticker);
        step > 3 * fps && clearInterval(ticker);
        (0 >= position || position > c.maxX) && clearInterval(ticker);
        c.offsetX != (position | 0) && c.setOffset(position | 0)
      }, b);
    }
  },
  calcGeometry: function() {
    this.w = this.parent.w - this.x;
    this.h = this.parent.h - this.y;
    var b = false,z = 100;

    var a = (this.w - 90 * this.strips.length + this.strips[0].w) / 2 | 0;
    a = bound(a, 0, 30);
    for(var c = 0, d = 0; d < this.strips.length; d++) {
      c = a + z * d;
      this.strips[d].setPos(c + (b ? 10 : 0), 10);
      this.strips[d].h = this.h - this.strips[d].y;
    }
    this.maxX = c + z - this.w;
    0 > this.maxX && (this.maxX = 0);
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(this.offsetX, 0, this.w, this.h);
  }
});

SETTING_GLOBALSET = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "SETTING_GLOBALSET";
    this.w = screenWidth - measures.masterStripWidth;
    this.initWidgets();
  },
  initWidgets: function() {

    var itemWidth = 4;

    this.langSwitch = new SWITCHBOX(this);
    this.langSwitch.setItems(["ENGLISH", "简体中文"]);
    this.langSwitch.setItemWidth(this.w / itemWidth);
    this.langSwitch.setKey('globalLanguage');
    this.langSwitch.color = color.media;
    this.langSwitch.valueFunc = function() {
      //console.log(this.items[this.state]);
      if(this.state == 0) {
        lang = Object.clone(langBase.en);
      }else {
        lang = Object.clone(langBase.cn);
      }
      drawAll("change LANG");
    };
    this.langSwitch.getState = function() {
      this.state = this.getVal();
    }


    this.HEADPHONES_OUT = new SWITCHBOX(this);
    this.HEADPHONES_OUT.setItems(["SOLO", "MASTER"]);
    this.HEADPHONES_OUT.setKey("globalphoneOutput");
    this.HEADPHONES_OUT.setItemWidth(this.w / itemWidth);
    this.HEADPHONES_OUT.color = color.media;
    this.HEADPHONES_OUT.valueFunc = function() {
      sendGlobalSetting();
    };
    this.HEADPHONES_OUT.getState = function() {
      this.state = this.getVal();
    }

    this.MAIN_OUT = new SWITCHBOX(this);
    this.MAIN_OUT.setItems(["SOLO", "MASTER"]);
    this.MAIN_OUT.setKey("globalmainOutput")
    this.MAIN_OUT.setItemWidth(this.w / itemWidth);
    this.MAIN_OUT.color = color.media;
    this.MAIN_OUT.valueFunc = function() {
      sendGlobalSetting();
    };
    this.MAIN_OUT.getState = function() {
      this.state = this.getVal();
    }

    this.SOLO = new SWITCHBOX(this);
    this.SOLO.setItems([lang.SOLO, lang.REVERB]);
    this.SOLO.setKey("globalsoloMode");
    this.SOLO.setItemWidth(this.w / itemWidth);
    this.SOLO.color = color.media;
    this.SOLO.valueFunc = function() {
      sendGlobalSetting();
    };
    this.SOLO.getState = function() {
      this.state = this.getVal();
    }

    this.SOLOType = new SWITCHBOX(this);
    this.SOLOType.setItems(["AFL", "PFL"]);
    this.SOLOType.setKey("globalsoloType");
    this.SOLOType.setItemWidth(this.w / itemWidth);
    this.SOLOType.color = color.media;
    this.SOLOType.valueFunc = function() {
      sendGlobalSetting();
    };
    this.SOLOType.getState = function() {
      this.state = this.getVal();
    }
  },
  calcGeometry: function() {
    this.x = 0;
    this.y = 45;

    this.w = this.parent.w;
    this.h = this.parent.h - this.y;

    this.gap = 50;

    this.switchBoxX = this.w / 14;
    this.langSwitch.setPos(this.switchBoxX + 170, 30);
    this.HEADPHONES_OUT.setPos(this.switchBoxX + 170, 30 + this.gap);
    this.MAIN_OUT.setPos(this.switchBoxX + 170, 30 + this.gap * 2);
    this.SOLO.setPos(this.switchBoxX + 170, 30 + this.gap * 3);
    this.SOLOType.setPos(this.switchBoxX + 170, 30 + this.gap * 4);
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.fillStyle = color.white;
    ctx.font = "16px Arial";
    ctx.fillText(lang.LANGUAGE + ' :', this.switchBoxX, 50);
    ctx.fillText(lang.HEADPHONES_OUT + ' :', this.switchBoxX, 50 + this.gap);
    ctx.fillText(lang.MAIN_OUT + ' :', this.switchBoxX, 50 + this.gap * 2);
    ctx.fillText(lang.SOLO + " MODE" + ' :', this.switchBoxX, 50 + this.gap * 3);
    ctx.fillText(lang.SOLO + " TYPE" + ' :', this.switchBoxX, 50 + this.gap * 4);
  }
});

SETTING_NETWORK = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.pages = [];
    this.buttons = [];
    this.mode = -1;
    this.w = screenWidth - measures.masterStripWidth;
    this.E_MOED = {
      WIFI: 0,
      LAN: 1
    };
    this.initWidgets();
    this.setMode(0);
  },
  initWidgets: function() {
    this.pages.push(new NETWORK_WIFI(this));
    this.pages.push(new NETWORK_LAN(this));

    var c = ["WIFI", "LAN"];
    var d = ["#264863", "#264863"];
    var e = ["#FFF", "#FFF"];

    for(var f = 0; f < c.length; f++) {
      var b = new TabButton(this);
      b.color = d[f];
      b.textColor = e[f];
      b.mode = f;
      b.font = "13pt Arial";
      b.text = c[f];
      b.setSize((this.w - 20)/ 2, 30);
      this.buttons.push(b);
    }

  },
  setMode: function(a) {
    if(this.mode != a) {
      if(-1 == a){
        for(var b = 0; b < this.pages.length; b++)
          this.pages[b].hide();
        regUpdate(this)
      }else if ("undefined" != typeof this.buttons && "undefined" != typeof this.buttons[a] && this.buttons[a].enabled) {
        this.mode = a;
        for(b = 0; b < this.pages.length; b++)
          this.pages[b].enabled && this.pages[b].hide();
        this.pages[a].show();
        this.color = this.buttons[a].color;
        regUpdate(this);
      }
    }
  },
  calcGeometry: function() {
    this.x = 0;
    this.y = 45;

    this.w = this.parent.w;
    this.h = this.parent.h - this.y;

    var b = 10;
    var a = 0;
    for(var c = 0; c < this.buttons.length; c++) {
      this.buttons[c].enabled && (this.buttons[c].setPos(b, 5), 
        b += this.buttons[c].w,
        a++);
    }
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);
  }
});

NETWORK_WIFI = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "NETWORK_WIFI";
    this.mode = -1;
    this.pages = [];
    this.E_MODE = {
      host: 0,
      client: 1
    }
    this.initWidgets();
    this.setMode(0);
  },
  initWidgets: function() {

    var that = this;

    this.NETWORK_WIFI_SWITCH = new SWITCHBOX(this);
    this.NETWORK_WIFI_SWITCH.setItems(["open", "close"]);
    this.NETWORK_WIFI_SWITCH.setItemWidth(80);
    this.NETWORK_WIFI_SWITCH.setKey('NETWORK_WIFI_SWITCH');
    this.NETWORK_WIFI_SWITCH.color = color.media;
    this.NETWORK_WIFI_SWITCH.valueFunc = function() {
      //console.log(this.items[this.state]);
      if(this.state == 0) {
        //console.log('aa')
      }else {
        //lang = Object.clone(langBase.cn);
      }
      //drawAll("change LANG");
    };
    this.NETWORK_WIFI_SWITCH.getState = function() {
      this.state = this.getVal();
    }

    this.NETWORK_WIFI_MODE = new SWITCHBOX(this);
    this.NETWORK_WIFI_MODE.setItems(["host", "client"]);
    this.NETWORK_WIFI_MODE.setItemWidth(80);
    this.NETWORK_WIFI_MODE.setKey('NETWORK_WIFI_MODE');
    this.NETWORK_WIFI_MODE.color = color.media;
    this.NETWORK_WIFI_MODE.valueFunc = function() {
      //console.log(this.items[this.state]);
      if(this.state == 0) {
        that.setMode(0);

        send_Data(getWLANValueHOST());
      }else { 
        //lang = Object.clone(langBase.cn);
        that.setMode(1);

        send_Data(getWLANValueCLIENT());
      }
      //drawAll("change LANG");
    };
    this.NETWORK_WIFI_MODE.getState = function() {
      this.state = this.getVal();
      that.setMode(this.state);
    }

    this.pages.push(new NETWORK_WIFI_host(this));
    this.pages.push(new NETWORK_WIFI_client(this));
    //this.pages[0].hide()
    //this.pages[1].hide()
  },
  setMode: function(a) {
    if(this.mode != a) {
      if(-1 == a){
        for(var b = 0; b < this.pages.length; b++)
          this.pages[b].hide();
        regUpdate(this)
      }else if (true) {
        this.mode = a;
        for(b = 0; b < this.pages.length; b++)
          this.pages[b].enabled && this.pages[b].hide();
        this.pages[a].show();
        //this.color = this.buttons[a].color;
        regUpdate(this);
      }
    }
  },
  calcGeometry: function() {
    this.x = 0;
    this.y = 45;

    this.w = this.parent.w;
    this.h = this.parent.h - this.y;

    this.NETWORK_WIFI_SWITCH.setPos(15, 5);
    this.NETWORK_WIFI_MODE.setPos(15, 46);
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);

    //"IP":"192.168.1.115","netmask":"255.255.255.0","gateway":"192.168.1.1"
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    this.mode == 1 && (
      ctx.fillText('IP: 192.168.1.115', 20, 120),
      ctx.fillText('NETMASK: 255.255.255.0', 20, 150),
      ctx.fillText('GATE: 192.168.1.1', 20, 180)
    )
  }
});

NETWORK_WIFI_host = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "NETWORK_WIFI_host";
    this.initWidgets();
  },
  initWidgets: function() {
    this.setBu = new Button(this);
    this.setBu.setSize(80, 30);
    this.setBu.setText(lang.SETUP);
    this.setBu.setPos(20, 35);

    this.setBu.valueFunc = function() {
      var ssid = prompt(lang.promptssid, "");

      var pass  = ssid &&prompt(lang.promptpassword, "");

      pass && send_Data({
        "msgType":"WLAN SETTING CHANGED",
        "mode":getValue('NETWORK_WIFI_SWITCH_MODE') ? "client" : "host",
        "enable":!toBool(getValue('NETWORK_WIFI_SWITCH')),
        "host":{
          "ssid":ssid,
          "ssid broadcast enabled":true,
          "channel":6,
          "security":"WPA2",
          "psk":pass
        }
      });
    }
  },
  calcGeometry: function() {
    this.x = (screenWidth - measures.masterStripWidth) / 2;
    this.y = 10;

    this.w = this.parent.w / 2;
    this.h = this.parent.h;
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.fillStyle = color.white;

    ctx.font = "16px Arial";
    ctx.fillText('SSID:', 20, 10);
    ctx.fillText(getValue("NETWORK_WIFI_HOST_SSID"), 80, 10);
  }
});

NETWORK_WIFI_client = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "NETWORK_WIFI_client";
    this.initWidgets();
  },
  initWidgets: function() {
    this.WIFIList = $WIFIList = new PLISTS(this);
    this.WIFIList.label = "WIFI LIST";
    this.WIFIList.getActiveItem = function() {
      //console.log('a');
    }
    this.WIFIList.onSelect = function() {
      //{"msgType":"CONN TO WLAN","ssid":"fitcan","psk":"fitcan123456"}

      var pass  = prompt(lang.promptpassword, "");

      pass && send_Data({
        "msgType":"CONN TO WLAN",
        "ssid":this.selectedItem,
        "psk":pass
      })
    }
    this.WIFIList.setItems($WIFIList_data);
  },
  calcGeometry: function() {
    this.x = (screenWidth - measures.masterStripWidth) / 2;
    this.y = 10;

    this.w = this.parent.w / 2;
    this.h = this.parent.h;

    this.WIFIList.setPos(0, 0);
    this.WIFIList.setSize(this.w, this.h);
  },
  paint: function() {
    ctx.fillStyle = "white"//color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);
  }
})


NETWORK_LAN = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "NETWORK_LAN";
    this.initWidgets();
  },
  initWidgets: function() {
    this.NETWORK_LAN_SWITCH = new SWITCHBOX(this);
    this.NETWORK_LAN_SWITCH.setItems(["open", "close"]);
    this.NETWORK_LAN_SWITCH.setItemWidth(80);
    this.NETWORK_LAN_SWITCH.setKey('NETWORK_LAN_SWITCH');
    this.NETWORK_LAN_SWITCH.color = color.media;
    this.NETWORK_LAN_SWITCH.valueFunc = function() {
      //console.log(this.items[this.state]);
      if(this.state == 0) {
        //lang = Object.clone(langBase.en);
      }else {
        //lang = Object.clone(langBase.cn);
      }
      //drawAll("change LANG");
    };
    this.NETWORK_LAN_SWITCH.getState = function() {
      this.state = this.getVal();
    }

    this.NETWORK_LAN_MODE = new SWITCHBOX(this);
    this.NETWORK_LAN_MODE.setItems(["Static", "DHCP"]);
    this.NETWORK_LAN_MODE.setItemWidth(80);
    this.NETWORK_LAN_MODE.setKey('NETWORK_LAN_MODE');
    this.NETWORK_LAN_MODE.color = color.media;
    this.NETWORK_LAN_MODE.valueFunc = function() {
      //console.log(this.items[this.state]);
      if(this.state == 0) {
        //lang = Object.clone(langBase.en);
        //that.setMode(0);
      }else { 
        //lang = Object.clone(langBase.cn);
        //that.setMode(1);
      }
      //drawAll("change LANG");
    };
    this.NETWORK_LAN_MODE.getState = function() {
      this.state = this.getVal();
    }

    this.setBu = new Button(this);
    this.setBu.setSize(80, 30);
    this.setBu.setText(lang.SETUP);
    this.setBu.setPos(165, 180);

    this.setBu.valueFunc = function() {
      var ip = prompt(lang.LAN_IP_ADDRESS, "");
      var mask  = ip && prompt(lang.SUBNET_MASK, "");
      var gate  = gate && prompt(lang.websitegate, "");

      gate && send_Data({
        "msgType":"LAN SETTING CHANGED",
        "enable": !toBool(getValue('NETWORK_LAN_SWITCH')),
        "DHCP": !toBool(getValue('NETWORK_LAN_MODE')),
        "IP": ip,
        "netmask": mask,
        "gateway": gate
      });
    }
  },
  calcGeometry: function() {
    this.x = 0;
    this.y = 45;

    this.w = this.parent.w;
    this.h = this.parent.h - this.y;

    this.NETWORK_LAN_SWITCH.setPos(15, 5);
    this.NETWORK_LAN_MODE.setPos(15, 46);
  },
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.fillStyle = color.white;

    ctx.font = "18px Arial";
    ctx.fillText(lang.LAN_IP_ADDRESS + ':', 20, 110);
    ctx.fillText(getValue("NETWORK_LAN_HOST_IP"), 210, 110);

    ctx.fillText(lang.SUBNET_MASK + ':', 20, 135);
    ctx.fillText(getValue("NETWORK_LAN_HOST_MASK"), 210, 135);

    ctx.fillText(lang.websitegate + ':', 20, 160);
    ctx.fillText(getValue("NETWORK_LAN_HOST_GATE"), 210, 160);
  }
});

ChannelSet = Class.create(Widget, {
  initialize: function($super, b, c) {
    $super(b);
    this.widgetName = "ChannelSet";
    this.w = measures.masterStripWidth;
    this.needMoveEvt = !0;
    this.items = ["CH1","CH2","CH3","CH4","CH5","CH6","CH7","CH8","CH9","CH10","CH11","CH12","CH13","CH14","CH15","CH16", "PLAYER", "FXR1", "FXR2", "AUX1", "AUX2", "SUB", "MAIN"];
    this.titleColor = color.black;
    this.rh = 30;
    this.h = screenHeight;
    this.mstart = 50;
    this.target = c;
    this.selected = -1;
    this.startPoint = [-1, -1];
    this.lastPoint = [-1, -1];
    this.poplineX = 50;
    this.initWidgets();
  },
  initWidgets: function() {
    var that = this;

    this.list = new PLISTS(this);
    this.list.label = "Channels";
    this.list.getActiveItem = function() {
      this.selected = selectedStrip.id;
    }
    this.list.onSelect = function() {
      selectedChannel = this.selected;
      if(selectedChannel < 0) {
        return;
      }
      //console.log(selectedChannel);
      selectedStrip = allStrips[selectedChannel];
      setMode(E_MODE.EDIT);
      regUpdate(this);
    }
    this.list.setItems(this.items);
  }, 
  onshow: function() {},
  onDown: function(a, b) {
    this.startPoint = this.lastPoint = [a, b];
    var c = Math.floor((b - this.globalY() - this.mstart) / this.rh);
    c >= this.items.length || 0 > c || (this.selected = c, regUpdate(this))
  },
  onMove: function(a, b) {
    this.lastPoint = [a, b];
    if (40 < Math.abs(this.lastPoint[0] - this.startPoint[0]) || 40 < Math.abs(this.lastPoint[1] - this.startPoint[1]))
        this.selected = -1;
    regUpdate(this)
  },
  onUp: function() {
    if (20 < Math.abs(this.lastPoint[0] - this.startPoint[0]) || 20 < Math.abs(this.lastPoint[1] - this.startPoint[1]))
        this.selected = -1;
    -1 != this.selected && this.doFunc()
  },
  doFunc: function() {
    //empty mWidgets
    clearModals();
  },
  onDelete: function() {},
  calcGeometry: function() {
    this.x = screenWidth - this.w;

    0 > this.x && (this.x = 0);
    this.y = 0;

    this.list.setPos(0, 0);
    this.list.setSize(this.w, this.h);
    this.list.calcGeometry();
  },
  paint: function() {
    var a = this.w,
        b = this.h,
        c = b - 20;
    ctx.fillStyle = "#111";
    ctx.strokeStyle = "#BBB";
    ctx.fillRect(0, 0, this.w, this.h);
  }
})

currentPresetWindow = null ;
cuurentPresetDir = 0;
PRESET_MENU2 = Class.create(Widget, {
    initialize: function($super, b, c, d, e) {
        $super(b);
        this.widgetName = "PRESET_MENU";
        //this.h = this.w = 500;
        this.w = 400;
        this.h = 280;
        this.sy = 58;
        this.title = "PRESETS";
        this.color = "#eee";
        this.bg = "#262728";
        this.borderColor = "#676869";
        this.type = c;
        this.t = null ;
        this.target = d;
        this.center = !1;
        this.user = 0;
  
        /*isDefined(e) ? this.color = e : this.type.contains("chm") ? this.color = color.red : this.type.contains("afs") ? this.color = "#888" : this.type.contains("ch") ? this.color = color.yellow : this.type.contains("eq") ? this.color = color.purple : this.type.contains("dyn") ? this.color = color.orange : this.type.contains("fx") ? this.color = color.blue : this.type.contains("gate") ? this.color = color.GATE : (this.type.contains("ux"),
        this.color = 
        color.red);*/
        this.initWidgets();
        this.refreshList();
        this.calcGeometry();
        mWidgets.push(widgets.pop());
        currentPresetWindow = this;

        this.sendInfo();
    },
    onshow: function() {
      
      //send_Data({"msgType":"REQ EQ LIST"});
      //send_Data({"msgType":"REQ OCT LIST"});
    },
    sendInfo: function() {
      var type

      switch(this.type) {
        case 'fxch':
          type = 'FX';
          break;
        case 'eqch':
          type = 'EQ';
          break;
        case 'dynch':
          type = "DYN";
          break;
      }

      send_Data({"msgType":"REQ "+ type + " LIST"});
    },
    refreshList: function() {
        if (EMULATE) {
            var a = $A($R("f:FACTORY PRESET A", "f:FACTORY PRESET Z"))
              , a = a.concat($A($R("u:USER PRESET A", "u:USER PRESET Z")));
            this.LIST.setItems(a)
        } else
            widgetReqList = this.LIST,
            sendMessage(E_COMMANDS.PRESET_LIST + "^" + this.type)
    },
    checkDir: function() {
        0 == cuurentPresetDir ? (this.RENAME.hide(),
        this.DEL.hide()) : (this.RENAME.show(),
        this.DEL.show())

        regUpdate(this);
    },
    initWidgets: function() {
        var a = this;
        this.LIST = new LIST(this);
        //this.LIST.filter = !1;
        this.LIST.filterValue = 1 == cuurentPresetDir ? "u:" : "f:";
        this.LIST.setPos(10, this.sy);
        this.LIST.setSize(100, 100);
        this.LOAD = new MENUBUTTON(this);
        this.LOAD.text = lang.LOAD;
        this.LOAD.bg = this.bg;
        this.LOAD.setPos(200, 20);
        this.LOAD.onPress = function() {
            if (EMULATE)
                showPopupMsg(lang.DEMO_VERSION),
                a.close();
            else {
                var b = a.LIST.selItem();
                null  != b && (widgetReqPreset = a.target,
                sendMessage2("LOAD", a.type , b),
                a.close())
            }
        }
        ;
        var b = this.LOAD;
        this.LIST.onDClick = function() {
            b.click()
        }
        ;
        this.SAVE = new MENUBUTTON(this);
        this.SAVE.text = lang.SAVE;
        this.SAVE.bg = this.bg;
        this.SAVE.setPos(200, 50);
        this.SAVE.onPress = function() {
          /*if (EMULATE)
            showPopupMsg(lang.DEMO_VERSION),
            a.close();
          else {*/
            editOk.valueFunc = function() {
              var b = editBox2.value;
              //if (null  != b && 0 != b.length) {
                //var b = b.replace(/\^/g, "_")
                  //, c = JSON.stringify(a.target.savePreset(b));
                -1 == a.LIST.items.indexOf(b) ? (//confOk.valueFunc = function() {
                    sendMessage2("SAVE", a.type, b),
                    a.close(),
                    showPopupMsg(lang.SAVED, 800)
                //},
                //confCancel.valueFunc = function() {},
                /*showConfBox(lang.REPLACE_PRESET.format(b))*/) : (showPopupMsg("USED", 800))
                //a.close(),
                //showPopupMsg(lang.SAVED, 800))
              //}
            };
            var b = a.LIST.selItem();
            b = null  != b ? b.substr(2) : "";
            showEditBox2(lang.SAVE_PRESET_WITH_NAME, b)
        }
        ;
        this.RENAME = new MENUBUTTON(this);
        this.RENAME.text = lang.RENAME;
        this.RENAME.bg = this.bg;
        this.RENAME.setPos(200, 110);
        this.RENAME.onPress = function() {
            if (EMULATE)
                showPopupMsg(lang.DEMO_VERSION),
                a.close();
            else {
                var b = a.LIST.selItem();
                null  == b || b.startsWith("f:") || (editOk.valueFunc = function() {
                    var d = editBox2.value;
                    null  != d && 0 != d.length && (d = d.replace(/\^/g, "_"),
                    d != b && a.LIST.items.indexOf(d) == -1 && (sendMessage2("RENAME", a.type, b, d),
                    a.refreshList()))
                }
                ,
                showEditBox2(lang.RENAME_PRESET, b.substr(2)))
            }
        }
        ;
        this.DEL = new MENUBUTTON(this);
        this.DEL.text = lang.DELETE;
        this.DEL.bg = this.bg;
        this.DEL.setPos(200, 80);
        this.DEL.onPress = function() {
            if (EMULATE)
                showPopupMsg(lang.DEMO_VERSION),
                a.close();
            else {
                var b = a.LIST.selItem();
                null  == b || b.startsWith("f:") || (/*confOk.valueFunc = 
                function() {
                    sendMessage2("DEL", a.type, b);
                    a.refreshList()
                }
                ,
                confCancel.valueFunc = function() {}
                ,
                showConfBox(lang.DELETE_PRESET.format(b.substr(2)))*/
                  confirm("DELETE?") && sendMessage2("DEL", a.type, b)
                )
            }
        }
        ;
        this.FACUSER = new SWITCHBOX(this);
        this.FACUSER.setItems([lang.FACTORY, lang.USER]);
        this.FACUSER.setItemWidth(80);
        this.FACUSER.state = cuurentPresetDir;
        this.FACUSER.bg = this.bg;
        this.FACUSER.setPos(10, 15);
        this.FACUSER.color = this.color;
        this.FACUSER.borderColor = this.borderColor;
        this.FACUSER.valueFunc = function() {
            cuurentPresetDir = a.user = this.state;
            a.LIST.setFilter(0 == this.state ? "f:" : "u:");
            a.checkDir()
            a.sendInfo()
        }
        ;
        "ux" == this.type && this.FACUSER.hide();
        this.checkDir()
    },
    close: function() {
        currentPresetWindow = null ;
        this.enabled = !1;
        clearModals();
        regUpdate(this.target)
    },
    onDelete: function() {
        currentPresetWindow = null 
    },
    calcPos: function() {},
    calcGeometry: function() {
        if (!this.center && null  != this.target && isDefined(this.target.x)) {
            var a = this.target;
            this.setPos(116 + Math.round((a.w - 116 - this.w) / 2), a.globalY() + Math.round((a.h - this.h) / 4))
        }
        this.center && this.setPos(Math.round((screenWidth - this.w) / 2) | 0, (screenHeight - this.h) / 2 | 0);
        var a = this.sy
          , b = 0;
        this.LIST.setSize(this.w - this.LIST.x - this.DEL.w - 20, this.h - this.LIST.y - 15);
        var c = this.DEL.w + 10;
        this.DEL.setPos(this.w - c, this.h - this.DEL.h - 15 - 50);
        this.LOAD.setPos(this.w - c, a + 45 * b++);
        this.SAVE.setPos(this.w - c, a + 45 * b++);
        this.RENAME.setPos(this.w - c, a + 45 * b++);
        /*this.grd = ctx.createLinearGradient(0, 0, 0, 40);
        this.grd.addColorStop(0, "rgba(255,255,255,0.2)");
        this.grd.addColorStop(1, "rgba(255,255,255,0.0)")*/
    },
    paint: function() {
        ctx.fillStyle = color.eqBg;//this.bg;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 1;
        ctx.roundRect(0, 0, this.w, this.h, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = color.eqBg;//this.grd;
        ctx.fillTopRoundRect(0, 0, this.w, 40, 8);
        ctx.fillStyle = color.white;
        ctx.font = "16pt open_sans_condensedbold";
        ctx.setShadow(color.black, 3, 1, 1);
        "ux" != this.type ? (ctx.textAlign = "right",
        ctx.fillText(this.title, this.LIST.x + this.LIST.w, 38)) : (ctx.textAlign = "center",
        ctx.fillText(this.title, this.w / 2, 38));
        ctx.setShadow(null );
        ctx.fillStyle = color.eqBg;//this.bg;//this.color;
        ctx.fillBotRoundRect(10, this.h - 59, this.w - 20, 50, 10);
    }
})

LIST = Class.create(Widget, {
    initialize: function($super, b) {
        $super(b);
        this.widgetName = "MENU_LIST";
        this.h = this.w = 300;
        this.needMoveEvt = this.needClip = !0;
        this.lastClickTime = 0;
        this.items = ["  Loading..."];
        this.items2 = [];
        this.selectedIdx = this.selected = -1;
        this.selectedItem = null ;
        this.prevSelected = this.hoverIdx = this.activeItemIdx = -1;
        this.filterValue = "f:";
        this.filter = !1;
        this.font = "16pt open_sans_condensedbold";
        this.itemH = 40;
        this.maxVOffset = this.vOffsetOld = this.vOffset = 0;
        this.vScrollEnabled = !0;
        this.vScrollWidth = 
        8;
        this.borderColor = "#666";
        this.bgColor = color.presetBg;
        this.textColor = color.white;
        this.selTextColor = "#111";
        this.selItemColor = "#eee";
        this.activeTextColor = "#e33";
        this.selectCanceled = this.snapList = this.showList = !1;
        this.listsOffsets = {};
        this.scrollByScroller = !1
    },
    setFilter: function(a) {
        clearInterval(ticker);
        null  != this.filterValue && (this.listsOffsets[this.filterValue] = this.vOffset);
        this.filterValue = a;
        this.setItems(this.items2);
        this.filterValue in this.listsOffsets ? this.setOffset(this.listsOffsets[this.filterValue]) : 
        this.setOffset(0);
        regUpdate(this)
    },
    onSetItems: function() {},
    setItems: function(a) {
        if (Array.isArray(a)) {
            if (this.filter) {
                this.items2 = a;
                var b = this.filterValue;
                this.items = a.filter(function(a) {
                    return a.startsWith(b)
                })
            } else
                this.items = a;
            this.maxVOffset = this.items.length * this.itemH - this.h;
            0 > this.maxVOffset && (this.maxVOffset = 0);
            this.vOffset > this.maxVOffset && this.setOffset(this.maxVOffset);
            this.onSetItems();
            this.onSetItems = function() {}
            ;
            regUpdate(this)
        }
    },
    addItem: function(a) {
        this.items.push(a);
        regUpdate(this)
    },
    clear: function() {
        this.items.clear();
        this.clearSelection()
    },
    getActiveItem: function() {},
    selItem: function() {
        return 0 > this.selected || this.selected >= this.items.length ? null  : this.items[this.selected]
    },
    select: function(a, b) {
        if (!(a >= this.items.length)) {
            0 > a ? (this.selectedIdx = this.selected = -1,
            this.selectedItem = null ) : (this.selectedIdx = this.selected = a,
            this.selectedItem = this.items[a]);
            if (!isDefined(b))
                this.onSelect();
            regUpdate(this)
        }
    },
    selectByName: function(a) {
        a = this.items.indexOf(a);
        0 <= a && this.select(a);
        regUpdate(this)
    },
    selectLast: function() {
        0 != this.items.length && this.select(this.items.length - 1)
    },
    clearSelection: function() {
        this.select(-1)
    },
    setOffset: function(a) {
        this.vOffsetOld = this.vOffset = bound(a | 0, 0, this.maxVOffset);
        regUpdate(this)
    },
    onResize: function() {
        this.maxVOffset = this.items.length * this.itemH - this.h;
        0 > this.maxVOffset && (this.maxVOffset = 0);
        this.vOffset > this.maxVOffset && this.setOffset(this.maxVOffset)
    },
    onDown: function(a, b) {
        var c = b - this.globalY()
          , d = a - this.globalX();
        this.pressPoint = [d, c];
        this.selectCanceled = !1;
        this.vScrollEnabled && 
        d > this.w - this.vScrollWidth - 2 ? this.selectCanceled = this.scrollByScroller = !0 : (this.scrollByScroller = !1,
        this.hoverIdx = Math.floor((this.pressPoint[1] + this.vOffset) / this.itemH));
        !this.scrollByScroller && 0 < this.maxVOffset && this.velStart();
        regUpdate(this);
        this.onMove(a, b)
    },
    onMove: function(a, b) {
        var c = b - this.globalY();
        this.globalX();
        var d = c - this.pressPoint[1];
        this.vOffset = this.scrollByScroller ? bound(c / this.h * this.maxVOffset, 0, this.maxVOffset) : bound(this.vOffsetOld - d, 0, this.maxVOffset);
        regUpdate(this);
        !this.selectCanceled && 
        5 < Math.abs(d) && (this.selectCanceled = !0)
    },
    onUp: function() {
        if (!this.selectCanceled) {
            var a = Math.floor((this.pressPoint[1] + this.vOffset) / this.itemH);
            this.selected != a && this.select(a)
        }
        this.onPress();
        var a = Date.now()
          , b = this.items.length * this.itemH;
        if (!this.selectCanceled && this.pressPoint[1] + this.vOffset <= b && this.prevSelected == this.selectedIdx && a - this.lastClickTime < DBL_CLK_TIME)
            this.onDClick();
        this.lastClickTime = a;
        this.prevSelected = this.selectedIdx;
        this.hoverIdx = -1;
        this.vOffsetOld = this.vOffset;
        this.pressPoint = 
        [-1, -1];
        !this.scrollByScroller && 0 < this.maxVOffset && this.velRelease();
        regUpdate(this)
    },
    onWheel: function(a) {
        clearInterval(ticker);
        this.setOffset(this.vOffset - Math.round(a / 6))
    },
    velStart: function() {
        velocity = amplitude = 0;
        timestamp = Date.now();
        clearInterval(ticker);
        frame = this.vOffset;
        scrollingWidget = this;
        ticker = setInterval(this.velTrack, 20)
    },
    velTrack: function() {
        var a, b;
        a = Date.now();
        b = a - timestamp;
        timestamp = a;
        a = scrollingWidget.vOffset - frame;
        frame = scrollingWidget.vOffset;
        velocity = 1E3 * a / (1 + b) * .8 + .2 * velocity
    },
    velRelease: function() {
        clearInterval(ticker);
        10 < Math.abs(velocity) && this.mScroll(velocity)
    },
    mScroll: function(a) {
        if (!settings.kinetic) {
            position = this.vOffset;
            amplitude = .3 * a;
            step = 0;
            var b = this;
            clearInterval(ticker);
            ticker = setInterval(function() {
                var a = amplitude / 20;
                position += a;
                amplitude -= a;
                step += 1;
                80 < step && clearInterval(ticker);
                (0 >= position || position > b.maxVOffset) && clearInterval(ticker);
                scrollingWidget.vOffset != (position | 0) && scrollingWidget.setOffset(position | 0)
            }, 20)
        }
    },
    gotoSelected: function() {
        0 > this.selected || 
        this.selected >= this.items.length || this.setOffset(this.selected * this.itemH - this.h / 2)
    },
    onDClick: function() {},
    onSelect: function() {},
    onPress: function() {},
    valueFunc: function() {},
    calcGeometry: function() {
        this.maxVOffset = this.items.length * this.itemH - this.h;
        0 > this.maxVOffset && (this.maxVOffset = 0);
        this.vOffset > this.maxVOffset && this.setOffset(this.maxVOffset)
    },
    calcSize: function() {
        this.h = this.items.length * this.itemH;
        this.parent && regUpdate(this.parent)
    },
    paint: function() {
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 
        0, this.w, this.h);
        this.getActiveItem();
        var a = this.items.length * this.itemH;
        this.vScrollEnabled = a > this.h ? !0 : !1;
        var b = this.w - 1;
        ctx.font = this.font;
        ctx.textAlign = "left";
        ctx.shadowColor = "transparent";
        ctx.textBaseline = "middle";
        var c = this.itemH / 2 | 0;
        ctx.setShadow(color.black, 0, 1, 1);
        for (var d = 0; d < this.items.length; d++) {
            var e = d * this.itemH - this.vOffset;
            if (!(e < -this.itemH || e > this.h)) {
                this.selected == d && (ctx.fillStyle = this.selItemColor,
                ctx.fillRect(0, e, b, this.itemH));
                this.hoverIdx == d && (ctx.fillStyle = "rgba(255,255,255,0.05)",
                ctx.fillRect(0, e, b, this.itemH));
                ctx.fillStyle = this.selected == d ? this.selTextColor : this.textColor;
                this.activeItemIdx == d && (ctx.fillStyle = this.activeTextColor);
                var f = this.items[d];
                this.filter && (f = f.substr(2));
                ctx.fillText(f, 8, e + c, b);
                ctx.shadowColor = "transparent";
                ctx.fillStyle = "#666";
                ctx.fillRect(0, e + this.itemH, b, -1)
            }
        }
        this.vScrollEnabled && (a < this.h && (a = this.h),
        b = this.h / a * this.h,
        a = 1 + this.vOffset / (a - this.h) * (this.h - 2 - b),
        ctx.fillStyle = "rgba(255,255,255,0.4)",
        ctx.setShadow("#222", 2, -1, 0),
        ctx.fillRoundRect(this.w - 
        this.vScrollWidth - 2, a | 0, this.vScrollWidth, b | 0, 7),
        ctx.setShadow(null ));
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.borderColor;
        ctx.strokeRect(.5, .5, this.w - 1, this.h - 1);
        ctx.textBaseline = "alphabetic"
    }
})

MENUBUTTON = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.widgetName = "MENU_BUTTON";
    this.w = 70;
    this.h = 30;
    this.state = 0;
    this.color = null ;
    this.bg = color.eqBg;
    this.text = "TEXT";
    this.textColor = color.tabText;
    this.needBG = !0;
    this.disabled = !1
  },
  onDown: function() {
    this.disabled || (this.state = 1,
    regUpdate(this.parent))
  },
  onUp: function() {
    this.disabled || (this.state = 0,
    regUpdate(this.parent),
    this.onPress())
  },
  onPress: function() {},
  valueFunc: function() {},
  getState: function() {},
  paint: function() {
    this.getState();
    this.disabled || (ctx.fillStyle = this.bg,
    ctx.fillRect(0, 0, this.w, this.h),
    0 == this.state ? (ctx.fillStyle = "rgba(255,255,255,0.1)",
    /*ctx.fillRect(1, this.h, this.w - 2, -10),*/
    ctx.lineWidth = 1,
    ctx.strokeStyle = color.tabStroke,
    ctx.strokeRect(.5, .5, this.w - 1, this.h - 2),
    ctx.font = font.tabText,
    ctx.fillStyle = this.textColor,
    ctx.textAlign = "center",
    ctx.setShadow(color.black, 3, 1, 1),
    ctx.fillText(this.text, this.w / 2 | 0, (this.h / 2 | 0) + 6, this.w - 4),
    ctx.shadowColor = "transparent") : (ctx.globalAlpha = .5,
    ctx.fillStyle = this.color ? this.color : this.parent.color,
    ctx.fillRect(0, 0, this.w, this.h),
    ctx.globalAlpha = 1,
    ctx.lineWidth = 1,
    ctx.strokeStyle = this.color ? this.color : this.parent.color,
    ctx.strokeRect(.5, .5, this.w - 1, this.h - 2),
    ctx.fillStyle = "rgba(255,255,255,0.1)",
    ctx.fillRect(1, this.h, this.w - 2, -10),
    ctx.font = font.tabText,
    ctx.textAlign = "center",
    ctx.fillStyle = color.black,
    ctx.fillText(this.text, this.w / 2 + 1 | 0, this.h / 2 + 7 | 0, this.w - 4),
    ctx.fillStyle = color.tabTextSel,
    ctx.fillText(this.text, this.w / 2 | 0, (this.h / 2 | 0) + 6, this.w - 4)))
  }
})

TIME_LABEL = Class.create(Widget, {
  initialize: function($super, b) {
    $super(b);
    this.w = 100;
    this.h = 52;
    this.name = "LABEL";
    this.color = color.white;
    this.max = this.text = "";
    this.mode = 0;
    this.text2 = "";
    this.timer = null ;
    this.v2 = 0
  },
  setMax: function(a) {
    this.max = 
    secToTime(a | 0);
    regUpdate(this)
  },
  setTime: function(a) {
    this.text = secToTime(a | 0);
    regUpdate(this)
  },
  setMode: function(a) {
    this.mode = a;
    regUpdate(this)
  },
  setValue2: function(a) {
    this.v2 = bound(a, 0, 1)
  },
  calcGeometry: function() {},
  paint: function() {
    ctx.fillStyle = color.eqBg;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.font = "13pt open_sans_condensedbold, monospace";
    ctx.textAlign = "right";
    ctx.shadowBlur = 0;
    ctx.shadowColor = color.black;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    var a = getValue("var.currentLength");
    if (!(0 > a)) {
      var b = getValue("var.currentTrackPos");
      1 == this.mode && (b = this.v2);
      b *= a;
      this.max = secToTime(a | 0);
      this.text = secToTime(b | 0);
      ctx.fillStyle = this.color;
      1 == this.mode && (ctx.fillStyle = "#ccc");
      ctx.fillText(this.text, this.w - 2, 20);
      ctx.fillStyle = "#FFC777";
      ctx.fillText(this.max, this.w - 2, 40);
      ctx.shadowColor = "transparent"
    }
  }
})