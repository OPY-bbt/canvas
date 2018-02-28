function log(a) {
	console.log(a);
}

var Util = {
  getTime: function() {
    return Date.now();
  }
}

function isDefined(a) {
	return 'undefined' != typeof a 
}

function mEvt(e) {
	e || (e = event);
	var x = e.pageX,
			y = e.pageY;

	ctx.clearRect(0, 0, 100, 26);
	ctx.fillStyle = "#880000";
	ctx.font = "24px Arial";
	ctx.fillText(e.type + ': ' + x + 'x' + y + ' ' + (1 << e.button), 0, 22);
}

function bound(a, b, c) {
	return a<b?b:a>c?c:a;
}

function isObject(a) {
  return "object" === typeof a
}

Element.prototype.w = function() {
	return isRetina ? this.width / 2 | 0 : this.width
};

Element.prototype.h = function() {
  return isRetina ? this.height / 2 | 0 : this.height
};

CanvasRenderingContext2D.prototype.triangle2 = function(a, b, c, d, e, f) {
  this.moveTo(a, b);
  this.lineTo(c, d);
  this.lineTo(e, f);
  this.lineTo(a, b)
};

CanvasRenderingContext2D.prototype.setShadow = function(a, b, c, d) {
	this.shadowColor = "transparent";
}

CanvasRenderingContext2D.prototype.fillTriangle = function(a, b, c, d) {
  this.beginPath();
  this.moveTo(a, b);
  this.lineTo(a + 2 * c, b);
  this.lineTo(a + c, b + d);
  this.closePath();
  this.fill()
};

CanvasRenderingContext2D.prototype.roundRect = function(a, b, c, d, e) {
  0 > c && (a += c,c *= -1);
  0 > d && (b += d,d *= -1);
  c < 2 * e && (e = c / 2);
  d < 2 * e && (e = d / 2);
  this.beginPath();
  this.moveTo(a + e, b);
  this.arcTo(a + c, b,     a + c, b + d, e);
  this.arcTo(a + c, b + d, a,     b + d, e);
  this.arcTo(a, b + d, a,     b, e);
  this.arcTo(a, b,     a + c, b, e);
  this.closePath()
};

CanvasRenderingContext2D.prototype.fillTopRoundRect = function(a, b, c, d, e) {
  0 > c && (a += c,
  c *= -1);
  0 > d && (b += d,
  d *= -1);
  c < 2 * e && (e = c / 2);
  d < 2 * e && (e = d / 2);
  this.beginPath();
  this.moveTo(a + e, b);
  this.arcTo(a + c, b, a + c, b + d, e);
  this.lineTo(a + c, b + d);
  this.lineTo(a, b + d);
  this.arcTo(a, b, a + c, b, e);
  this.closePath();
  this.fill()
};

CanvasRenderingContext2D.prototype.fillBotRoundRect = function(a, b, c, d, e) {
    0 > c && (a += c,
    c *= -1);
    0 > d && (b += d,
    d *= -1);
    c < 2 * e && (e = c / 2);
    d < 2 * e && (e = d / 2);
    this.beginPath();
    this.moveTo(a, b);
    this.lineTo(a + c, b);
    this.arcTo(a + c, b + d, a, b + d, e);
    this.arcTo(a, b + d, a, b, e);
    this.closePath();
    this.fill()
};

CanvasRenderingContext2D.prototype.fillRoundRect = function(a, b, c, d, e) {
  0 > c && (a += c,c *= -1);
  0 > d && (b += d,d *= -1);
  c < 2 * e && (e = c / 2);
  d < 2 * e && (e = d / 2);
  this.beginPath();
  this.moveTo(a + e, b);
  this.arcTo(a + c, b, a + c, b + d, e);
  this.arcTo(a + c, b + d, a, b + d, e);
  this.arcTo(a, b + d, a, b, e);
  this.arcTo(a, b, a + c, b, e);
  this.closePath();
  this.fill()
};

CanvasRenderingContext2D.prototype.fillTriangle2 = function(a, b, c, d, e, f) {
  this.beginPath();
  this.moveTo(a, b);
  this.lineTo(c, d);
  this.lineTo(e, f);
  this.closePath();
  this.fill()
};

CanvasRenderingContext2D.prototype.drawText = function(a, b, c, d, e) {
    if (a) {
        a = "" + a;
        var f = 999999
          , g = 20
          , h = null 
          , k = 0
          , l = 0;
        e = e || "\n";
        isDefined(d) && (isObject(d) ? (d.color && (this.fillStyle = d.color),
        d.font && (this.font = d.font),
        d.align && (this.textAlign = d.align),
        d.textBaseline && (this.textBaseline = d.textBaseline),
        d.valign && (this.textBaseline = d.valign),
        settings.disableShadows ? (isDefined(d.sColor) && (h = d.sColor),
        isDefined(d.sX) && (k = d.sX),
        isDefined(d.sY) && (l = d.sY)) : (isDefined(d.sColor) && (this.shadowColor = d.sColor),
        isDefined(d.sBlur) && 
        (this.shadowBlur = d.sBlur),
        isDefined(d.sX) && (this.shadowOffsetX = d.sX),
        isDefined(d.sY) && (this.shadowOffsetY = d.sY)),
        d.shadow && (h = d.shadow[0],
        k = d.shadow[2],
        l = d.shadow[3]),
        isDefined(d.max) && (f = d.max),
        isDefined(d.dy) && (g = d.dy)) : f = d);
        if (a.contains(e))
            for (a = a.split(e),
            b |= 0,
            c |= 0,
            "middle" == this.textBaseline && (c -= .5 * (a.length - 1) * g),
            e = 0; e < a.length; e++) {
                var n = a[e];
                n.startsWith("#") && (this.fillStyle = n.slice(0, 7),
                n = n.slice(7));
                h && (d = ctx.fillStyle,
                ctx.fillStyle = h,
                this.fillText(n, b + k, c + l, f),
                ctx.fillStyle = d);
                this.fillText(n, 
                b, c, f);
                c += g
            }
        else
            h && (d = ctx.fillStyle,
            ctx.fillStyle = h,
            this.fillText(a, b + k, c + l, f),
            ctx.fillStyle = d),
            this.fillText(a, b, c, f)
    }
}

Array.prototype.contains = function(a) {
  return -1 != this.indexOf(a)
};

Array.prototype.deleteItem = function(a) {
  a = this.indexOf(a);
  -1 != a && this.splice(a, 1)
};

Array.prototype.sum = function() {
  for (var a = 0, b = 0, c = this.length; b < c; b++)
    a += this[b];
  return a
};

Array.prototype.avg = function() {
  for (var a = 0, b = 0, c = this.length; b < c; b++)
      a += this[b];
  return a / this.length
};

String.prototype.contains = function(a) {
    return -1 != this.indexOf(a)
};

String.prototype.containsOR = function() {
  for (var a = 0; a < arguments.length; a++)
      if (-1 != this.indexOf(arguments[a]))
          return !0;
  return !1
};

String.prototype.format = function() {
  for (var a = this, b = 0; b < arguments.length; b++)
    a = a.replace(new RegExp("\\{" + b + "\\}","gi"), arguments[b]);
  return a
};

function objSize(a) {
	var b = 0;
	for(var c in a) {
		a.hasOwnProperty(c) && b++;
	}
	return b
}

function findV(a, b) {
  for (var c = 0, d = 1, e = 0; 128 > e; e++) {
    var f = .5 * (c + d)
      , g = a(f);
    if (1E-10 > Math.abs(g - b))
        return f;
    g > b ? d = f : c = f
  }
  return .5 * (c + d)
}

function VtoFREQ(a) {
  return Math.round(20 * Math.pow(1102.5, a))
}

function VtoQ(a) {
  return .05 * Math.pow(300, a)
}

function VtoEQGAIN20(a) {
  return 40 * a - 20
}

function formatGain(a) {
  return precision(a * 30 - 15, 1);
}

function formatGaintoV(a) {
  return (a + 15) / 30;
}

function formatPregaintoV(a) {
  return a / 20;
}

function formatPregain(a) {
  return precision(a * 20, 0);
}

function VtoTHRESH(a) {
  return precision(-90 + 96 * a, 1)
}

function VtoDS_RATIO(a) {
  1E-5 > a && (a = 1E-5);
  a = VtoRATIO_DE(a);
  return a = 60 < a ? "∞" : 2 > a ? precision(a, 2) + "" : precision(a, 1) + ""
}

function VtoEQGAIN15(a) {
  return precision(30 * a - 15, 1)
}

function toBool(a) {
  return .5 <= a;
}

function toZero(a) {
  return a ? 1 : 0;
}

function THRESHtoV(a) {
  return precision((a + 90) / 96, 1)
}

function RATIOtoV(a) {
  return 1 / a;
}

function DYNGATEtoV(a) {
  return precision((a + 90) / 96, 1)
}



function loadResources() {
  res.me1 = loadImg("1.png");
  res.me2 = loadImg("2.png");
  res.me3 = loadImg("3.png");
  res.me4 = loadImg("4.png");
  res.me5 = loadImg("5.png");
  res.me6 = loadImg("6.png");
  res.me7 = loadImg("7.png");
  res.me8 = loadImg("8.png");
  res.me9 = loadImg("9.png");
  res.me10 = loadImg("10.png");
  res.me11 = loadImg("11.png");
  res.bPRESET_ON = loadImg('PRESETS.png');
  res.bPRESET_OFF = loadImg('PRESETS-ON.png');
  res.LPF_ON = loadImg('LPF-ON.png');
  res.LPF_OFF = loadImg('LPF-OFF.png');
  res.HPF_ON = loadImg('HPF-ON.png');
  res.HPF_OFF = loadImg('HPF-OFF.png');
  /*res.violin = loadImg("Strings_Violin.png");
	res.topBarLeft = loadImg("TOPNAV-L.png");
  res.topBarTile = loadImg("TOPNAV-T3.png");
  res.topBarRight = loadImg("TOPNAV-R.png");
  res.topBarLED = loadImg("TOPNAV-LED.png");
  res.topBarLogo = loadImg("UMIX-OFF.png");
  res.topBarLogo2 = loadImg("UMIX-ON3.png");
  res.stripTop = loadImg("C-TOP.png");
  res.stripAuxTop2 = loadImg("C-AUX-TOP.png");
  res.stripAuxTop = loadImg("C-AUX-TOP-UPD.png");*/
  res.stripTile = loadImg("C-TILE.png");
  /*res.stripBottom = loadImg("C-BOT.png");
  res.stripLabel = loadImg("C-LABEL.png");
  res.auxStripTop = loadImg("AUX-SC-TOP.png");
  res.auxStripTile = loadImg("AUX-SC-TILE.png");
  res.auxStripBottom = loadImg("AUX-SC-BOTTOM.png");
  res.blStripTop = loadImg("BLANK-SC-TOP2.png");
  res.blStripTile = loadImg("BLANK-SC-TILE.png");
  res.blStripBottom = loadImg("BLANK-SC-BOTTOM.png");
  res.blStripLabel = loadImg("BLANK-SC-LABEL.png");
  res.mAUXStripTop = loadImg("AUX-M-TOP2.png");
  res.mStripTopNCS = loadImg("M-TOP-NCS.png");
  res.mStripTile = loadImg("M-TILE.png");
  res.mStripBottom = loadImg("M-BOTTOM.png");
  res.mStripBottomLabel = loadImg("M-LABEL.png");
  res.mStripMute_OFF = loadImg("M-MUTE-OFF.png");
  res.mStripMute_OFF_F = loadImg("M-MUTE-OFF_F.png");
  res.mStripMute_ON = loadImg("M-MUTE-ON.png");
  res.mStripSolo_OFF = loadImg("M-SOLO-OFF.png");
  res.mStripSolo_ON = loadImg("M-SOLO-ON.png");*/
  res.fader = loadImg("FADER-SILVER2.png", !0);
  res.redFader = loadImg("FADER-RED2.png", !0);
  res.blueFader = loadImg("FADER_BLUE.png", !0);
  //res.greenFader = loadImg("SLIDER_GREEN.png", !0);
  res.subFader = loadImg("FADER_PINK.png", !0);
  res.auxFader = loadImg("FADER_YELLOW.png", !0);
  //res.mtxFader = loadImg("FADER-ORANGE.png", !0);
  res.gainFader = loadImg("FADER_UI_B2.png", !0);
  /*res.fxFader = loadImg("FADER-FX3.png", !0);
  res.fxFader_p = loadImg("FADERP-FX2.png", !0);
  res.fxFader_o = loadImg("FADERO-FX2.png", !0);
  res.fxFader_g = loadImg("FADERG-FX2.png", !0);*/
  res.fxFader_b = loadImg("FADERB-FX2.png", !0);
  res.panSlider = loadImg("PAN-SLIDER.png", !0);
  /*res.presetLED = loadImg("LED-PRESET.png");
  res.peakOFF = loadImg("PEAK-OFF.png", !0);
  res.peakON = loadImg("PEAK-ON.png", !0);*/
  res.vuTexture = loadImg("M VU TILE5.png", !0);
  /*res.bMixGainOff = loadImg("MIXG-OFF.png", !0);
  res.bMixGainOn = loadImg("MIX_B100.png", !0);
  res.bMixGain2 = loadImg("MIXG-GAIN.png", !0);
  res.bTVOff = loadImg("TV-OFF.png", !0);
  res.bTVOn = loadImg("TV-ON.png", !0);
  res.bFXOff = loadImg("FXS-OFF.png", !0);
  res.bFXOn = loadImg("FXS-ON.png", !0);
  res.bAUXOff = loadImg("AUXS-OFF.png", !0);
  res.bAUXOn = loadImg("AUX-BTN_Y1.png", !0);
  res.bEDITOff = loadImg("EDT-OFF.png", !0);
  res.bEDIT_T = loadImg("EDT-ON_T.png", !0);
  res.bSettingsOff = loadImg("SETTINGS-OFF.png", !0);
  res.bSettingsOn = loadImg("SETTINGS-ON.png", !0);
  res.bPlayerOff = loadImg("AUD-BTN-OFF.png", !0);
  res.bPlayerOn = loadImg("AUD-BTN-ON.png", !0);
  res.bMuteOff = loadImg("MUTE-SC-OFF.png", !0);
  res.bMuteOff_F = loadImg("MUTE-SC-OFF_F.png", !0);
  res.bMuteOn = loadImg("MUTE-SC-ON.png", !0);
  res.bPre = loadImg("PRE-OFF_y.png", !0);
  res.bPost = loadImg("POST-ON_g.png", !0);
  res.bSoloOff = loadImg("SOLO-SC-OFF.png", !0);
  res.bSoloOn = loadImg("SOLO-SC-ON.png", !0);
  res.bF1Off = loadImg("F1-OFF.png");
  res.bF1On = loadImg("F1-ON.png");
  res.bF2Off = loadImg("F2-OFF.png");
  res.bF2On = loadImg("F2-ON.png");
  res.SSUPD_ON = loadImg("SAVE-ON.png");
  res.SSUPD_OFF = loadImg("SAVE-OFF.png");
  res.SS_ON = loadImg("SAVEAS-ON.png");
  res.SS_OFF = loadImg("SAVEAS-OFF.png");
  res.RECS_STOP = loadImg("RECS-STOP.png");
  res.RECS_OFF = loadImg("RECS-OFF.png");
  res.PLAYS_STOP = loadImg("PLAYS-STOP.png");
  res.PLAYS_OFF = loadImg("PLAYS-OFF.png");
  res.bPhantomOff = loadImg("PHANTOM-OFF.png", !0);
  res.bPhantomOn = loadImg("PHANTOM-ON.png", !0);
  res.b48Off = loadImg("48V-OFF.png", !0);
  res.b48On = loadImg("48V-ON.png", !0);
  res.hiz_off = loadImg("HIZ-OFF2.png", !0);
  res.hiz_on = loadImg("HIZ-ON2.png", !0);
  res.bPIOff = loadImg("PI-OFF.png", !0);
  res.bPIOn = loadImg("PI-ON.png", !0);
  res.bBMuteOff = loadImg("MUTE-L-BTN-OFF.png", !0);
  res.bBMuteOn = loadImg("MUTE-L-BTN-ON.png", !0);
  res.soTop = loadImg("SC-TOP.png");
  res.soTile = loadImg("SC-TILE.png");
  res.soBottom = loadImg("SC-BOTTOM.png");
  res.bINPUTS_OFF = loadImg("INPUTS-OFF.png");
  res.bINPUTS_ON = loadImg("INPUTS-ON.png");
  res.bFXRet_OFF = loadImg("FXRET-BTN-OFF.png");
  res.bFXRet_ON = loadImg("FXRET-BTN-ON.png");
  res.bMuteAll_OFF = loadImg("MUTE-ALL-OFF.png");
  res.bMuteAll_ON = loadImg("MUTE-ALL-ON.png");
  res.bMuteFX_OFF = loadImg("MUTE-FX-OFF.png");
  res.bMuteFX_ON = loadImg("MUTE-FX-ON.png");
  res.bMTA_OFF = loadImg("CMIX-OFF.png");
  res.bMTA_ON = loadImg("CMIX-ON.png");
  res.bMuteGr_OFF = loadImg("MUTEGR-BTN-OFF.png");
  res.bMuteGr_ON = loadImg("MUTEGR-BTN-ON.png");
  res.bAUXMast_OFF = loadImg("AUXM-BTN-OFF.png");
  res.bAUXMast_ON = loadImg("AUXM-BTN-ON2.png");
  res.bSUBGr_OFF = loadImg("SUBGR-BTN-OFF.png");
  res.bSUBGr_ON = loadImg("SUBGR-BTN-ON.png");
  res.bVIEWGr_OFF = loadImg("VIEWGR-BTN-OFF.png");
  res.bVIEWGr_ON = loadImg("VIEWGR-BTN-ON.png");*/
  res.bBYPASS_ON = loadImg("BYPASS-ON.png");
  res.bBYPASS_OFF = loadImg("BYPASS-OFF.png");
  res.bRESET_ON = loadImg("RESET-ON.png");
  res.bRESET_OFF = loadImg("RESET-OFF.png");
  /*res.bREVERB_OFF = loadImg("REVERB-OFF.png");
  res.bREVERB_ON = loadImg("REVERB-ON.png");
  res.bCHORUS_OFF = loadImg("CHORUS-OFF.png");
  res.bCHORUS_ON = loadImg("CHORUS-ON.png");
  res.bDELAY_OFF = loadImg("DELAY-OFF.png");
  res.bDELAY_ON = loadImg("DELAY-GR-ON.png");
  res.bDELAY_ON2 = loadImg("DELAY-OR-ON.png");
  res.bROOM_OFF = loadImg("ROOM-OFF.png");
  res.bROOM_ON = loadImg("ROOM-GR-ON.png");
  res.bHARDKNEE_OFF = loadImg("HARD-KNEE-OFF.png");
  res.bSOFTKNEE_ON = loadImg("SOFT-KNEE-ON.png");
  res.bEZEQ_ON = loadImg("EZ-ON.png");
  res.bEZEQ_OFF = loadImg("EZ-BTN-OFF.png");
  res.eqHFaderGray = loadImg("SLIDER_SILVER_H.png", !0);*/
  res.eqVFaderGray = loadImg("FADER_UI_B2.png", !0);
  /*res.eqVFaderRed = loadImg("SLIDER_RED.png", !0);
  res.eqVFaderGreen = loadImg("SLIDER_GREEN.png", !0);
  res.eqVFaderOrange = loadImg("SLIDER_PEW.png", !0);
  res.eqVFaderBlue = loadImg("SLIDER_BLUE.png", !0);
  res.eqVFaderPurple = loadImg("SLIDER_PURPLE.png", !0);
  res.eqVFaderYellow = loadImg("SLIDER_YELLOW.png", !0);
  res.fxLEDs = loadImg("FX-S-LED.png", !0);*/
  res.fxLEDb = loadImg("FX-B-LED.png", !0);
  /*res.auxsLED = loadImg("AUXS-LED.png", !0);
  res.b1 = loadImg("NR1-OFF.png");
  res.b2 = loadImg("NR2-OFF.png");
  res.b3 = loadImg("NR3-OFF.png");
  res.b4 = loadImg("NR4-OFF.png");
  res.b5 = loadImg("NR5-OFF.png");
  res.b6 = loadImg("NR6-OFF.png");
  res.b1R = loadImg("NR1-RED-ON.png");
  res.b2R = loadImg("NR2-RED-ON.png");
  res.b3R = loadImg("NR3-RED-ON.png");
  res.b4R = loadImg("NR4-RED-ON.png");
  res.b5R = loadImg("NR5-RED-ON.png");
  res.b6R = loadImg("NR6-RED-ON.png");
  res.b1B = loadImg("NR1-BLUE-ON.png");
  res.b2B = loadImg("NR2-BLUE-ON.png");
  res.b3B = loadImg("NR3-BLUE-ON.png");
  res.b4B = loadImg("NR4-BLUE-ON.png");
  res.b5B = loadImg("NR5-BLUE-ON.png");
  res.b6B = loadImg("NR6-BLUE-ON.png");
  res.bTAP = loadImg("TAP-BLA-OFF.png", !0);
  res.bTAP_Pressed = loadImg("TAP-BLA-ON.png", !0);
  res.bTAPT_OFF = loadImg("TAPT-BTN_DLY-OFF.png", !0);
  res.bTAPT_ON = loadImg("TAPT-BTN_DLY-ON.png", !0);
  res.bPDF_OFF = loadImg("ADOBE-OFF.png");
  res.bPDF_ON = loadImg("ADOBE-ON.png");
  res.bFAQ_OFF = loadImg("FAQ-OFF.png");
  res.bFAQ_ON = loadImg("FAQ-ON.png");
  res.bYOUTUBE_OFF = loadImg("YOUTUBE-OFF.png");
  res.bYOUTUBE_ON = loadImg("YOUTUBE-ON.png");*/
  res.player_prev_on = loadImg("MEDIA-PREV-ON.png");
  res.player_prev_off = loadImg("MEDIA-PREV-OFF.png");
  res.player_next_on = loadImg("MEDIA-NEXT-ON.png");
  res.player_next_off = loadImg("MEDIA-NEXT-OFF.png");
  res.player_play = loadImg("MEDIA-PLAY.png");
  res.player_pause = loadImg("MEDIA-PAUSE.png");
  res.player_stop_on = loadImg("MEDIA-STOP-ON.png");
  res.player_stop_off = loadImg("MEDIA-STOP-OFF.png");
  /*res.player_rec_on = loadImg("MEDIA-REC-ON2.png");
  res.player_rec_off = loadImg("MEDIA-REC-OFF.png");
  res.bAFS_OFF = loadImg("AFS-OFF-B.png");
  res.bAFS_ON = loadImg("AFS-ON.png");
  res.lex_delay_a = loadImg("LEX-DA.png");
  res.lex_delay_b = loadImg("LEX-DB.png");
  res.lex_reverb = loadImg("LEX-REV.png");
  res.lex_chorus = loadImg("LEX-CH.png");
  res.lex_room = loadImg("LEX-RM.png");
  res.lex_tap_off = loadImg("LEX_TAP_OFF.png");
  res.lex_tap_on = loadImg("LEX_TAP_ON.png");
  res.lock = loadImg("lock_3.png", !0);
  res.RTA_OFF = loadImg("RTA_OFF.png");
  res.RTA_ON = loadImg("RTA_ON.png");
  res.DESS_OFF = loadImg("DES-OFF.png");
  res.DESS_ON = loadImg("DES-ON.png");
  res.lex = loadImg("lex.png");
  res.dbx = loadImg("dbx.png");
  res.dbx_logo = loadImg("dbx_logo.png");
  res.lex_rev = loadImg("lex_logo.png");
  res.lex_cho = loadImg("lex_cho.png");
  res.lex_dly = loadImg("lex_dly.png");
  res.lex_rmlogo = loadImg("lex_rmlogo.png");
  res.DIGI_PRE = loadImg("DIGI_AM.png");
  res.digitech_logo = loadImg("DIGITECH_LOGO.png");
  res.AFS2LOGO = loadImg("AFS2LOGO.png");
  res.OFF_OFF = loadImg("OFF-OFF.png");
  res.OFF_ON = loadImg("OFF-ON.png");
  res.ON_ON = loadImg("ON-ON.png");
  res.LIVE_OFF = loadImg("LIVE-OFF.png");
  res.LIVE_ON = loadImg("LIVE-ON.png");
  res.FIXED_OFF = loadImg("FIXED-OFF.png");
  res.FIXED_ON = loadImg("FIXED-ON.png");
  res.SETUP_OFF = loadImg("SETUP-OFF.png");
  res.SETUP_ON = loadImg("SETUP-ON.png");
  res.AFSON_ON = loadImg("AFSON-ON2.png");
  res.AFSON_OFF = loadImg("AFSON-OFF2.png");
  res.MOME_OFF = loadImg("MOME-OFF.png");
  res.MOME_ON = loadImg("MOME-ON.png");
  res.AMP_D = loadImg("DIGIAMP_A.png");
  res.AMP_G = loadImg("AMP-GREY.png");
  res.CAB_D = loadImg("DIGICAB_A2.png");
  res.CAB_G = loadImg("SPKR-GREY.png");
  res.inv_pic = loadImg("picto_gr2.png", !0);
  res.about = loadImg("SCLOGO_B.png");
  res.pedal_grey = loadImg("PEDAL-GREY.png");
  res.pedal_light = loadImg("PEDAL-LIGHT-ON.png");
  res.bg = loadImg("PATTERN_DNS.png");
  res.bolt_icon = loadImg("BOLT_ICON.png");
  res.cl_s_btn_off = loadImg("CL_BTN_OFF.png");
  res.cl_s_btn_on = loadImg("CL_BTN_ON.png");
  res.postproc = loadImg("PP-OFF.png");
  res.preproc = loadImg("PP-ONO.png");
  res.FX_BTN_OFF = loadImg("FX_BTN_OFF.png");
  res.FX_BTN_PUR = loadImg("FX_BTN_PUR.png");
  res.FX_BTN_OR = loadImg("FX_BTN_OR.png");
  res.FX_BTN_GR = loadImg("FX_BTN_GR.png");
  res.FX_BTN_BLU = loadImg("FX_BTN_BLU.png");
  res.UIX = loadImg("uix.png");*/
  res._font = "hello";
  checkFonts();
}

function loadImg(a) {
	var img = new Image;
	img.onload = resLoaded;
	img.onerror = function(a) {
		log("ERROR LOADING IMG: " + this.src + " " + a.message);
	}
	img.src = './image/' + a;
	return img;
}

function checkFonts() {
  var a = [];
  ctx.font = "20pt You_want_a_pig";
  var b = ctx.measureText("xyz789").width;
  a.push(b);
  ctx.font = "20pt open_sansbold";
  b = ctx.measureText("xyz789").width;
  a.push(b);
  /*ctx.font = "20pt umixled";
  b = ctx.measureText("xyz789").width;
  a.push(b);*/
  ctx.font = "20pt open_sans_condensedbold";
  b = ctx.measureText("xyz789").width;
  a.push(b);
  a.sort();
  for(var b = !0, c = 0; c < a.length - 1; c++) {
    //console.log(a);
    a[c] == a[c + 1] && (b = !1);
  }
  b ? (log("font OK"),
  resLoaded()) : setTimeout(function() {
    checkFonts()
  }, 100);
}

function resLoaded() {
	resReadyNum++;
	var a = objSize(res);
	drawProgress(resReadyNum / a);

	a == resReadyNum && (a = Date.now() - startLoadingTime,
	1200 > a? setTimeout(function() {
		startGUI(wsBool? "real" : "fake");
	}, 1200-a) : startGUI(wsBool? "real" : "fake"));
}

function drawProgress(a) {
	var b = screenWidth,
		c = screenHeight,
		e = b / 2;
		f = (b - img_load.w()),
		g = (c - img_load.h());

		var h = g + 40,
			e = ctx.createRadialGradient(e, c/2, 0, e, c/2, 500);
		e.addColorStop(0, "#1C2A34");
		e.addColorStop(1, "#000");
		ctx.fillStyle = e;
		ctx.fillRect(0, 0, b, c);

		//drawImage(img_load, f, g);
		c = 1 + (b - 338) /2;
		d = g + img_load.h()-40;

		0>a
			?(ctx.font = "bold 48pt open_sans_condensedbold",
				ctx.fillStyle = "#e33",
				ctx.textAlign = "center",
				ctx.fillText(lang.OFFLINE, e, d+28))
			:(ctx.fillStyle = "#004040",
				ctx.shadowColor = "#004040",
				ctx.shadowBlur = 6,
				ctx.fillRect(c, d, 338, 5),
				ctx.shadowColor = "#00BFBF",
				ctx.shadowBlur = 20,
				ctx.shadowOffsetX = -1,
				ctx.fillStyle = "#00BFBF",
				ctx.fillRect(c, d, bound(Math.round(338*a), 2, 338), 5));
				
		ctx.setShadow(null);
}

/*function drawProgress(a) {
  var b = screenWidth,
    c = screenHeight,
    e = b / 2;
    f = (b - img_load.w()),
    g = (c - img_load.h());

    var h = g + 40,
      e = ctx.createRadialGradient(e, c/2, 0, e, c/2, 500);
    e.addColorStop(0, "#1C2A34");
    e.addColorStop(1, "#000");
    ctx.fillStyle = e;
    ctx.fillRect(0, 0, b, c);
    
    //drawImage(img_load, f, g);
    c = 1 + (b - 338) /2;
    d = g + img_load.h()-40;

    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.stroke()

    0>a
      ?(ctx.font = "bold 48pt open_sans_condensedbold",
        ctx.fillStyle = "#e33",
        ctx.textAlign = "center",
        ctx.fillText(lang.OFFLINE, e, d+28))
      :(ctx.fillStyle = "#004040",
        ctx.shadowColor = "#004040",
        ctx.shadowBlur = 6,
        ctx.fillRect(c, d, 338, 5),
        ctx.arc(c + 338 * 0.5, d - 50, 30, 0, Math.PI * 2),
        ctx.lineWidth = 5,
        ctx.stroke(),
        ctx.restore(),
        ctx.beginPath(),
        ctx.shadowColor = "#00BFBF",
        ctx.shadowBlur = 20,
        ctx.shadowOffsetX = -1,
        ctx.fillStyle = "#00BFBF",console.log(a),
        ctx.fillRect(c, d, bound(Math.round(338*a), 2, 338), 5)
        ctx.arc(c + 338 * 0.5, d - 50, 30, Math.PI * 3 / 2 , Math.PI * 3 / 2 + Math.PI * 2 * a),
        ctx.lineWidth = 5,
        ctx.stroke());
        
    ctx.setShadow(null);
}*/


function initGradients() {
  color.grad1 = ctx.createLinearGradient(0, 0, 0, 7);
  color.grad1.addColorStop(0, "rgba(255,255,255,0.1)");
  color.grad1.addColorStop(1, "rgba(255,255,255,0)");
  color.grad2 = ctx.createLinearGradient(0, 7, 0, 0);
  color.grad2.addColorStop(0, "rgba(255,255,255,0.1)");
  color.grad2.addColorStop(1, "rgba(255,255,255,0)");
  color.grad3 = ctx.createLinearGradient(0, 0, 0, 5);
  color.grad3.addColorStop(0, "rgba(255,255,255,0.7)");
  color.grad3.addColorStop(.15, "rgba(255,255,255,0.2)");
  color.grad3.addColorStop(1, "rgba(255,255,255,0)");
  color.grad4 = ctx.createLinearGradient(0, 5, 0, 0);
  color.grad4.addColorStop(0, "rgba(255,255,255,0.7)");
  color.grad4.addColorStop(.2, "rgba(255,255,255,0.2)");
  color.grad4.addColorStop(1, "rgba(255,255,255,0)");
  color.grad5 = ctx.createLinearGradient(0, 0, 0, 20);
  color.grad5.addColorStop(0, "rgba(255,255,255,0.0)");
  color.grad5.addColorStop(1, "rgba(255,255,255,0.15)");
  color.grad6 = ctx.createLinearGradient(0, 0, 0, 20);
  color.grad6.addColorStop(0, "rgba(255,255,255,0.15)");
  color.grad6.addColorStop(.6, "rgba(255,255,255,0.0)");
  color.gradMBL = ctx.createLinearGradient(0, 0, 123, 0);
  color.gradMBL.addColorStop(0, "rgba(255,255,255,0)");
  color.gradMBL.addColorStop(.5, "rgba(255,255,255,0.2)");
  color.gradMBL.addColorStop(1, "rgba(255,255,255,0)");
  color.panGrad = ctx.createLinearGradient(0, 13, 0, 19);
  color.panGrad.addColorStop(0, "#00ffff");
  color.panGrad.addColorStop(1, "#0D6666");
  color.mPanGrad = ctx.createLinearGradient(0, 13, 0, 19);
  color.mPanGrad.addColorStop(0, "#ffff00");
  color.mPanGrad.addColorStop(1, "#666600");
  color.tvvuGrad = ctx.createLinearGradient(0, 82, 0, 0);
  color.tvvuGrad.addColorStop(0, "green");
  color.tvvuGrad.addColorStop(.5, "yellow");
  color.tvvuGrad.addColorStop(1, "red");
  color.tvvuGrad2 = ctx.createLinearGradient(0, 82, 0, 0);
  color.tvvuGrad2.addColorStop(0, "#494");
  color.tvvuGrad2.addColorStop(.5, "#aa3");
  color.tvvuGrad2.addColorStop(1, "#d44");
  color.stripGrad = ctx.createLinearGradient(0, 0, measures.mixerStripWidth, 0);
  color.stripGrad.addColorStop(0, "rgba(255,255,255,0)");
  color.stripGrad.addColorStop(.5, "rgba(255,255,255,0.2)");
  color.stripGrad.addColorStop(1, "rgba(255,255,255,0)");
  color.grpeak = ctx.createLinearGradient(0, 6, 0, 0);
  color.grpeak.addColorStop(1, "#700");
  color.grpeak.addColorStop(.3, "#f00");
  color.grpeak.addColorStop(0, "#f00")
}

function $A(a) {
  if (!a)
      return [];
  if ("toArray" in Object(a))
      return a.toArray();
  for (var b = a.length || 0, c = Array(b); b--; )
      c[b] = a[b];
  return c;
}

function fillVertPattern(a, b, c) {
  for (var d = 0, e = a.h(); d < b; )
    drawImage(a, isDefined(c) ? c : 0, d),
    d += e
}

function precision(a, b) {
  if (0 == b)
      return a | 0;
  if (1 == b)
      return (10 * a | 0) / 10;
  if (2 == b)
      return (100 * a | 0) / 100;
  var c = Math.pow(10, b);
  return (a * c | 0) / c
}

function createPattern(a, b) {
  var c = document.createElement("canvas")
    , d = c.getContext("2d")
    , e = (a.w() | 0) + 1
    , f = a.h() | 0;
  c.width = e;
  c.height = f;
  d.drawImage(a, 0, 0, e, f);
  return ctx.createPattern(c, b)
}

function fastIndexOf(a, b) {
  for (var c = 0, d = a.length; c < d; c++)
    if (b === a[c])
        return c;
  return -1
}

function fillVertPatternCtx(a, b, c) {
  for (var d = 0, e = a.h(); d < b; )
    drawImageCtx(a, 0, d, c),
    d += e
}

function randomOf(a) {
  return bound(Math.floor(Math.random() * (a + 1)), 0, a);
}

function drawMarksDB(a, b, c, d) {
  d = isDefined(d) ? d : ctx;
  b = isDefined(b) ? b : 134;
  a = a - 80 + 2;
  if (!(0 > a)) {
    d.fillStyle = "rgba(255,255,255,0.35)";
    d.textAlign = "right";
    d.textBaseline = "middle";
    d.setShadow(color.black, 0, 2, 1);
    d.font = font.stripMarks;
    for (var e = [1, zeroDbPos, .5276, .1834, .0572, 0], f = 0; f < e.length; f++) {
      Math.round(a * (1 - e[f]) + 35 - 1);
      0 == e[f] && (d.font = "bold 11px sans serif");
    }  
    d.shadowColor = "transparent";
    var e = [1, .8932, .6327, .5276, .3746, .1834, .0572, 0]
      , z = ['+10', '+5', -5, -10, -20, -40, -60, 'OFF']
      , g = d.createLinearGradient(c - 8, 0, c - 8 + 8, 0);
    g.addColorStop(1, "rgba(255,255,255,0.13)");
    g.addColorStop(.5, "rgba(255,255,255,0.22)");
    g.addColorStop(0, "rgba(255,255,255,0.3)");
    var h = d.createLinearGradient(c - 8, 0, c - 8 + 12, 0);
    h.addColorStop(1, "rgba(255,255,255,0.16)");
    h.addColorStop(.5, "rgba(255,255,255,0.22)");
    h.addColorStop(0, "rgba(255,255,255,0.3)");
    for (f = 0; f < e.length; f++) {
        if(f == 6) { continue;}
        var k = Math.round(a * (1 - e[f]) + 35 - 1);
        d.fillStyle = g;
        d.fillRect(c - 8, b + k + 1, 10, 1);
        d.fillText(z[f], c - 15, b + k + 1);
    }
    k = a * (1 - zeroDbPos) + 35 - 2;
    d.fillStyle = h;
    d.fillRect(c - 10, b + k, 12, 3);
    d.font = "bold 11px sans serif";
    d.fillText(0, c - 15, b + k);
  }
}

function drawVUMarks(a, b, c) {
  c = isDefined(c) ? c : ctx;
  c.fillStyle = "rgba(255,255,255,0.35)";
  c.textAlign = "left";
  c.textBaseline = "middle";
  c.setShadow(color.black, 0, 2, 1);
  c.font = font.stripMarks;
  var d = a.x + a.w + 2
    , e = [-96, -90, -80, -70, -60, -50, -40, -24, -12, -6, 0]
    , f = a.y + 5
    , g = a.h - 9;
  if (70 < g)
      for (a = 0; a < e.length; a++)
          if (!(e[a] < -VU_RANGE)) {
              var h = f + vuPosMark(e[a], g);
              c.fillText(e[a], d, h)
          }
  if (isDefined(b) && null  != b)
      for (e = ["1", "5", "10", "20"],
      h = b.y + 5,
      dy = (b.h - 9) / (e.length - 1),
      d = b.x + b.w + 2,
      a = 0; a < e.length; a++)
          c.fillText(e[a], d, h | 0),
          h += dy
}

function vuPosMark(a, b) {
  return -a * b / VU_RANGE + .45 | 0
}

function VtoGAINP(a) {
    return 90 * a - 40
}

function GAINPtoV(a) {
    return bound((a + 40) / 90, 0, 1)
}

function getValue(a) {
    return a in dataValue ? dataValue[a] : null 
}

function setValue(a, b) {
  if (dataValue[a] != b) {
      if (dataValue["settings.block.pass"] && dataValue["settings.block.pass"] != settings.master_pass) {
          var c = !0, d = a.split(".");
          if (dataValue["settings.block.mixlvl"] && ("mgmask" == d.last() && (c = !1),"." == a[1]))
              switch (a[0]) {
                case "i":
                case "f":
                case "s":
                case "l":
                case "p":
                    if (!a.contains(".aux."))
                        switch (d.last()) {
                        case "mix":
                        case "mute":
                        case "pan":
                        case "forceunmute":
                          c = !1
                        }
              }
          if (dataValue["settings.block.mixproc"] && "." == a[1])
              switch (a[0]) {
              case "i":
              case "f":
              case "s":
              case "l":
              case "p":
                  if (!a.contains(".aux."))
                      switch (d.last()) {
                      case "mix":
                      case "mute":
                      case "forceunmute":
                      case "pan":
                      case "safe":
                      case "mgmask":
                          break;
                      default:
                          c = !1
                      }
              }
          dataValue["settings.block.player"] && a.startsWith("p.") && (c = !1);
          !dataValue["settings.block.mlvl"] || "m.mix" != a && "m.pan" != a || (c = !1);
          dataValue["settings.block.mproc"] && a.startsWith("m.") && "m.mix" != a && "m.pan" != a && (c = !1);
          dataValue["settings.block.shows"] && a.endsWith(".safe") && (c = !1);
          dataValue["settings.block.auxlvl"] && (a.startsWith("a.") && (a.endsWith(".mix") || a.endsWith(".mute") || a.endsWith(".stereoIndex")) || a.contains(".aux.")) && (c = !1);
          dataValue["settings.block.auxproc"] && a.startsWith("a.") && 
          !a.endsWith(".mix") && !a.endsWith(".mute") && (c = !1);
          c || (settings.perm_aux1 || !a.startsWith("a.0.") && !a.contains(".aux.0.") || (c = !0),
          settings.perm_aux2 || !a.startsWith("a.1.") && !a.contains(".aux.1.") || (c = !0),
          settings.perm_aux3 || !a.startsWith("a.2.") && !a.contains(".aux.2.") || (c = !0),
          settings.perm_aux4 || !a.startsWith("a.3.") && !a.contains(".aux.3.") || (c = !0),
          settings.perm_aux5 || !a.startsWith("a.4.") && !a.contains(".aux.4.") || (c = !0),
          settings.perm_aux6 || !a.startsWith("a.5.") && !a.contains(".aux.5.") || (c = !0),
          settings.perm_aux7 || 
          !a.startsWith("a.6.") && !a.contains(".aux.6.") || (c = !0),
          settings.perm_aux8 || !a.startsWith("a.7.") && !a.contains(".aux.7.") || (c = !0));
          if (a.startsWith("var.") || a.startsWith("settings."))
              c = !1;
          switch (d.last()) {
            case "solo":
                c = !0;
                break;
            case "gain":
                a.contains(".eq.") || (c = dataValue["settings.block.mixgain"] && "i" == a[0] && "." == a[1] ? !1 : !0);
                break;
            case "hiz":
            case "phantom":
            case "invert":
                c = dataValue["settings.block.mixgain"] && "i" == a[0] && "." == a[1] ? !1 : !0
          }
          if (c) {
              showPopupMsg(lang.LOCKED, 1E3);
              return
          }
      }
      console.log('1')
      setValueX(a, b);
      if ("." == a[1])
          switch (a[0]) {
          case "m":
              d = a.split(".");
              c = "";
              if ("mtx" == d[1]) {
                  var e = parseInt(d[2], 10);
                  0 == getValue("a." + e + ".stereoIndex") ? c = ".mtx." + (e + 1) + "." : 1 == getValue("a." + e + ".stereoIndex") && (c = ".mtx." + (e - 1) + ".");
                  c.length && (c = a.replace(".mtx." + e + ".", c),console.log('2'),
                  setValueX(c, b),
                  updateByKey(c))
              }
              if (a.endsWith(".pan"))
                  break;
              break;
          case "i":
          case "a":
          case "f":
          case "p":
          case "s":
          case "l":
              d = a.split(".");
              switch (d[2]) {
                case "gain":
                case "phantom":
                case "stereo":
                case "invert":
                case "srctype":
                case "src":
                case "sctype":
                case "scslot":
                case "desttype":
                case "dest":
                case "r":
                case "name":
                case "stereoIndex":
                    return
              }
              c = "";
              "aux" == d[2] && (e = parseInt(d[3], 10),
              0 == getValue("a." + e + ".stereoIndex") ? c = ".aux." + (e + 1) + "." : 1 == getValue("a." + e + ".stereoIndex") && (c = ".aux." + (e - 1) + "."),
              c.length && (c = a.replace(".aux." + e + ".", c),console.log('3'),
              setValueX(c, b),
              updateByKey(c)));
              "mtx" == d[2] && (e = parseInt(d[3], 10),
              0 == getValue("a." + e + ".stereoIndex") ? c = ".mtx." + (e + 1) + "." : 1 == getValue("a." + e + ".stereoIndex") && (c = ".mtx." + (e - 1) + "."),
              c.length && (c = a.replace(".mtx." + e + ".", c),console.log('4'),
              setValueX(c, b),
              updateByKey(c)));
              if (a.endsWith(".pan"))
                break;
              if (a.endsWith(".src"))
                break;
              if (a.endsWith(".srctype"))
                break;
              if (a.endsWith('.gain'))
                break;
              if (a.endsWith('.color'))
                break;
              var e = d[0] + "." + d[1] + ".", f = "", g = parseInt(d[1], 10);
              0 == getValue(e + "stereoIndex") ? f = d[0] + "." + (g % 2 ? (g - 1) : (g + 1)) + "." : 1 == getValue(e + "stereoIndex") && (f = d[0] + "." + (g % 2 ? (g - 1) : (g + 1)) + ".");
              f.length && (d = a.replace(e, f),console.log('5'),setValueX(d, b),
              c.length && (c = c.replace(e, f),console.log('6'),setValueX(c, b)), regUpdate(inStrips[(g % 2 ? (g - 1) : (g + 1))])/*,
              updateByKey(d)*/)
          }
  }
}

function updateByKey(a, b) {
    var c = keyWidgetHash.get(a);
    isDefined(c) && c.forEach(regUpdate);
    a.contains(".subgroup") && (modalsWidget.enabled && regUpdate(modalsWidget.pages[3]),
    -1 != activeSubGroup && mixerWidget.showSG(activeSubGroup));
    if (a.contains(".iosyscmd") && getValue("settings.demo")) {
        if (b) {
            var c = a.split(".")
              , d = c[1];
            if (isDefined(d)) {
                var e = parseInt(d);
                if (isNaN(e))
                    log("!2 " + a);
                else {
                    var f = "i." + e;
                    widgetReqPreset = {
                      loadPreset: function(b, c) {
                        applyPreset(f, b);
                        isDefined(c) && (setValue(f + ".eq.prname", c),
                        setValue(f + ".dyn.prname", c),
                        setValue(f + ".gate.prname", c),
                        setValue(f + ".name", c));
                        setValue(a, "");
                        mode == E_MODE.EDIT && drawAll("iosys")
                      }
                    };
                    sendMessage(E_COMMANDS.PRESET_READ + "^ch^u:" + b)
                }
            } else
                log("!1 " + a)
        }
    } else if (mode == E_MODE.EDIT && a.contains(".stereoIndex") && (editWidget.upd(),
    regUpdate(editWidget)),"mgmask" == a)
        handle_mgmask();
    else if (a.startsWith("afs.") || a.startsWith("afseq.") || (a.startsWith("m.") || a.startsWith("a.")) && a.contains(".afs."))
        regUpdate(editWidget);
    else if (a.startsWith("digitech."))
        regUpdate(editWidget.pages[editWidget.E_MODE.digi]);
    else if (a.startsWith("var.")) {
        "var.currentShow" == a && drawAll("curShow");
        "var.currentSnapshot" == a && drawAll("curSnap");
        "var.unsaved.chsafes" == a && regUpdate(chSafesPage);
        "var.unsaved.mutegroups" == a && regUpdate(modalsWidget);
        "var.currentState" == a && (regUpdate(player2track),
        regUpdate(masterWidget));
        "var.currentTrackPos" == a && regUpdate(player2track);
        "var.currentPlaylist" == a && regUpdate(player2track);
        mode == E_MODE.EDIT && "var.rta" == a && regUpdate(editWidget);
        "var.hpaux" == a && syncHPAUX();
        "var.currentTrack" == a && (c = dataValue["var.currentTrack"],
        d = c.length,
        15 < d && (c = "..." + c.substr(d - 15, 15)),
        topWidget.led.setMsg(c, "#ff0"),
        dataValue["var.currentPlaylist"] == player2track.FLIST.plistName && player2track.FLIST.selectByName(dataValue["var.currentTrack"]));
        if ("var.isRecording" == a || "var.recBusy" == a)
            regUpdate(masterWidget),
            regUpdate(player2track);
        "var.recBusy" == a && regUpdate(topWidget)
    } else if (a.startsWith("iso."))
        regUpdate(chSafesPage);
    else if (a.startsWith("settings."))
        "settings.playMode" == a || "settings.cue" == a ? regUpdate(player2track) : mode == E_MODE.SETTINGS && 
        regUpdate(settingsWidget);
    else if (a.contains(".name") || a.endsWith(".fxtype"))
        regUpdate(bottomWidget),
        "a" === a[0] && mode == E_MODE.AUX && (regUpdate(auxWidget),
        regUpdate(auxoutWidget)),
        "f" === a[0] && mode == E_MODE.FXSENDS && (regUpdate(fxSendsWidget),
        regUpdate(fxoutWidget)),
        mode == E_MODE.EDIT && a.contains(selectedStrip.name) && (regUpdate(editStripWidget),
        regUpdate(editWidget));
    else if (mode == E_MODE.MOREME && -1 != settings.meout && a.contains(".aux." + settings.meout) && regUpdate(moremeWidget),
    mode == E_MODE.MODALS && a.contains(".mgmask"))
        regUpdate(modalsWidget.pages[1]);
    else {
        if (mode == E_MODE.EDIT && a.contains(selectedStrip.name)) {
            regUpdate(editStripWidget);
            (a.contains(".afs.enabled") || a.contains(".deesser.")) && regUpdate(editWidget);
            switch (editWidget.mode) {
              case editWidget.E_MODE.eqch:
              case editWidget.E_MODE.eqaux:
              case editWidget.E_MODE.eqm:
                  if (!a.contains(".eq."))
                      return;
                  a.contains(".eq.easy") && editWidget.pages[editWidget.mode].checkState();
                  break;
              case editWidget.E_MODE.dyn:
                  if (!a.contains(".dyn.") && !a.contains(".gate."))
                      return;
                  break;
              case editWidget.E_MODE.gate:
                  if (!a.contains(".gate."))
                      return;
                  break;
              case editWidget.E_MODE.aux:
                  if (!a.contains(".aux."))
                      return
            }
            regUpdate(editWidget)
        }
        mode == E_MODE.MODALS && (a.contains(".mute") || a.contains(".solo") || a.contains(".phantom") || a.contains(".invert")) && regUpdate(modalsWidget.pages[0]);
        
        if (mode == E_MODE.AUX || a.contains(".aux."))
            c = a.split("."),
            d = parseInt(c[1], 10),
            "l" == c[0] && (d += curSetup.input),
            "p" == c[0] && (d += curSetup.input + curSetup.linein),
            "f" == c[0] && (d += curSetup.input + curSetup.linein + 2),
            regUpdate(auxWidget.page.strips[d]);
        else if (mode == E_MODE.AUX && a.contains(".mtx."))
            c = 
            a.split("."),
            d = parseInt(c[1], 10),
            "s" == c[0] && (d += curSetup.aux),
            "m" == c[0] && (regUpdate(auxWidget.page2.strips[auxWidget.page2.strips.length - 1]),
            regUpdate(auxWidget.page2.strips[auxWidget.page2.strips.length - 2])),
            regUpdate(auxWidget.page2.strips[d]);
        else if (mode == E_MODE.FXSENDS && a.contains(".fx."))
            c = a.split("."),
            d = parseInt(c[1], 10),
            e = parseInt(c[3], 10),
            "l" == c[0] && (d += curSetup.input),
            "p" == c[0] && (d += curSetup.input + curSetup.linein),
            "s" == c[0] && (d += curSetup.input + curSetup.linein + 2),
            fxSendsWidget.mode == e && regUpdate(fxSendsWidget.page.strips[d]);
        else if (mode == E_MODE.SETTINGS && a.contains(".safe"))
            regUpdate(chSafesPage);
        else if (c = a.split("."), !(2 > c.length) && "dyn" != c[1] && "eq" != c[1])
            if (a.contains(".solo") && checkSolos(),
            a.contains(".mute") && checkMutes(),
            mode == E_MODE.SETTINGS && a.contains(".src") && regUpdate(settingsWidget),
            a.contains(".forceunmute") && regUpdate(tvWidget),
            "m" == c[0])
                regUpdate(masterWidget),
                "m.eq.linked" == a && regUpdate(editWidget);
            else if (d = c[1],isDefined(d))
                if (e = parseInt(d), isNaN(e))
                    log("!2 " + a);
                else
                    switch (mode == E_MODE.AUX && (a.contains(".mute") || 
                    a.contains(".subgroup") || a.contains(".forceunmute")) && (d = e,
                    "l" == c[0] && (d += curSetup.input),
                    "p" == c[0] && (d += curSetup.input + curSetup.linein),
                    "f" == c[0] && (d += curSetup.input + curSetup.linein + 2),
                    regUpdate(auxWidget.page2.strips[d])),c[0]) {
                    case "i":
                        0 <= e && e < inStrips.length && (regUpdate(inStrips[e]),
                        "phantom" == c[2] && (1 == dataValue[a] ? blockStrip(e, PHANTOM_ON_DELAY) : blockStrip(e, PHANTOM_OFF_DELAY)));
                        break;
                    case "l":
                        0 <= e && e < lineinStrips.length && regUpdate(lineinStrips[e]);
                        break;
                    case "f":
                        0 <= e && e < fxStrips.length && (regUpdate(fxStrips[e]),
                        mode == E_MODE.FXSENDS && regUpdate(fxoutWidget),
                        mode == E_MODE.EDIT && editWidget.mode == editWidget.E_MODE.fx && regUpdate(editWidget.pages[editWidget.E_MODE.fx]));
                        break;
                    case "a":
                        0 <= e && e < auxStrips.length && (regUpdate(auxStrips[e]),
                        mode != E_MODE.AUX && mode != E_MODE.MOREME || regUpdate(auxoutWidget),
                        mode == E_MODE.EDIT && editWidget.mode == editWidget.E_MODE.aux && regUpdate(editWidget.pages[editWidget.E_MODE.aux]));
                        break;
                    case "s":
                        0 <= e && e < subStrips.length && regUpdate(subStrips[e]);
                        break;
                    case "p":
                        0 <= e && e < mediaStrips.length && 
                        regUpdate(mediaStrips[e])
                    }
            else
                log("!1 " + a)
    }
}

function me_updateByKey(id, type) {
  switch(type) {
    case 'pan':
    case 'mix':
    case 'name':
    case 'mute':
    case 'solo':
    case 'color':
      regUpdate(allStrips[id]);
      break;
    case 'phantom':
    case 'gain':
    case 'pregain':
    case 'eq':
    case 'dyn':
      editWidget && regUpdate(editWidget.pages[0]);
      break;
    case 'bind':
      //console.log(id)
      regUpdate(allStrips[id]);
      editWidget && regUpdate(editWidget.pages[0]);
      break;
    case 'editpage4':
      regUpdate(editWidget.pages[4]);
      break;
    case 'editpage5':
      regUpdate(editWidget.pages[5]);
      break;
    case 'editpage6':
      regUpdate(editWidget.pages[6]);
      break;
    case 'busline':
      regUpdate(editWidget.pages[0]);
      regUpdate(editWidget.pages[4]);
      regUpdate(editWidget.pages[5]);
      break;
    case 'fx':
      mixerWidget && regUpdate(mixerWidget.pages[3]);
      break;
    case 'player':
      mixerWidget && regUpdate(mixerWidget.pages[2]);
      break;
    case 'globalSetting':
      editWidget && regUpdate(editWidget.pages[6].pages[1])
      break;
  }
}

function blankFunc(a) {
  return a;
}

function setValueX(a, b, c) {
  //console.log(a, b, c, 'fx')
  dataValue[a] = b;
  "string" == typeof b ? sendMessage("SETS^" + a + "^" + b) : sendMessage("SETD^" + a + "^" + b)

  !c && wsBool && sendData(a, b);
}

function sendMessage(a, b) {
  consoleBool && console.log(a);

  //console.log(getValue('f.0.par0'), getValue('f.1.par0'));

  if(!isDefined(b)) {
    return true
  }

  var _send = {};
  switch(a) {
    case "PLAYERBUT":
      _send = {
        "msgType":"PLAYER BTN CLICKED",
        "button":b
      }
      break;
    case "PLAYERSEEKBAR":
      _send = {
        "msgType": "PLAYER GO TO SEC",
        "second": (getValue("var.currentLength") * b) | 0
      }
      break;
    case "PLAYERFILE":
      _send = {
        "msgType":"FOLDER ITEM CLICKED",
        "index":b
      }
      break;
    case "PLAYERSONG":
      _send = {
        "msgType":"MUSIC ITEM CLICKED",
        "index":b
      }
      break;
    case "RENAME":
      _send = {
        "msgType":"RENAME DYN LIB",
        "old":oldName,
        "now":nowName
      }
      break;
  }
  
  wsBool && _send.msgType && (send_Data(_send), console.log(_send));

  return !1;
}

function sendMessage2(a, b, c, d) {

  var _send = {}
  console.log(a, b, c)
  b == 'eqch' && (b = 'EQ');
  b == 'eqm' && (b = 'OCT');
  b == 'dynch' && (b = "DYN");

  switch(a) {
    case "RENAME":
      _send = {
        "msgType":"RENAME " + b + " LIB",
        "old": c,
        "now": d
      }
      break;
    case "DEL":
      _send = {
        "msgType": b + " DELETE LIB",
        "name": c
      }
      break;
    case "LOAD":
      _send = {
        "msgType": b + " LOAD LIB",
        "name": c,
        "preset": cuurentPresetDir == 0 ? true : false,
        "ch": getCurChannel(selectedStrip.name)
      }
      break;
    case "SAVE":
      var stripIndex = getCurChannel(selectedStrip.name);
      var eq = null;
      //if(stripIndex > 23 && stripIndex < 30) {
        //eq = getEQValue31para(stripIndex);
      //}else{
      //eq = getEQValue(stripIndex);
      //}
      _send = {
        "msgType": b + " SAVE TO LIB",
        "name": c,
        //"DYN": getDYNValue(stripIndex),
        //"EQ": eq
      }
      b == 'DYN' && (_send.DYN = getDYNValue(stripIndex));
      b == 'EQ' && (_send.EQ = getEQValue(stripIndex));
      break;
  }

  wsBool && _send.msgType && (send_Data(_send), console.log(_send));
}

function FREQtoV(a) {
  return bound(Math.log(a / 20) / Math.log(1102.5), 0, 1)
}

function QtoV(a) {
  return bound(Math.log(a / .05) / Math.log(300), 0, 1)
}

function GaintoV20(x) {
  return bound((x+20) / 40, 0, 1)
}

function VtoDB(a) {
  var b = VtoLIN(a), c = "";
  .001 > a ? c = "OFF" : (a = (20 * Math.log(b) / Math.log(10) * 10 + .45 | 0) / 10,
  -20 >= a ? a = "" + (a | 0) : -1 == ("" + a).indexOf(".") && (a += ".0"),
  c = a + " dB",
  -120 > a && (this.text = "- ∞ "));
  return c
}

function VtoDBSend(a) {
  var b = VtoLIN(a), c = "";
  .001 > a ? c = -1200 : (a = (20 * Math.log(b) / Math.log(10) * 10 + .45 | 0) / 10, c = a);
  return c
}

function VtoGain(a) {
  var b = (-40 + 90 * a).toFixed(1);
  return b.indexOf(".") === -1 ? b += '.0' : b;
}

function VtoGain2(a) {
  var b = (-70 + 80 * a).toFixed(1);
  //-68 > b && (return "- ∞ ");
  if(-68 > b) {
    return "- ∞ "
  }

  return b.indexOf(".") === -1 ? b += '.0' : b;
}

function VtoLIN(a) {
    return 2.676529517952372E-4 * Math.exp(a * (23.90844819639692 + a * (-26.23877598214595 + (12.195249692570245 - .4878099877028098 * a) * a))) * (.055 > a ? Math.sin(28.559933214452666 * a) : 1)
}

function VtoPAN(a) {
  return 200 * a - 100 | 0;
}

function PANtoV(a) {
  return a / 200;
}

function DBtoV(a) {
  var res = 0;
  var b = [1, 0.8910525, 0.76470, 0.630581, 0.526938, 0.3684279, 0.1855316, 0.057506, 0];

  if (a <= 10 && a > 5) {
    res = b[0] + (a - 10) / 5 * (b[0] - b[1]);
  }else if(a <=5 && a > 0) {
    res = b[1] + (a - 5) / 5 * (b[1] - b[2]);  
  }else if(a <= 0 && a > -5) {
    res = b[2] + (a) / -5 * (b[3] - b[2]); 
  }else if(a <= -5 && a > -10) {
    res = b[3] + (a + 5) / -5 * (b[4] - b[3]); 
  }else  if(a <= -10 && a > -20) {
    res = b[4] + (a + 10) / -10 * (b[5] - b[4]); 
  }else if(a <= -20 && a > -40) {
    res = b[5] + (a + 20) / -20 * (b[6] - b[5]); 
  }else if(a <= -40 && a > -60) {
    res = b[6] + (a + 40) / -20 * (b[7] - b[6]); 
  }else if(a <= -60 && a >= -100) {
    res = b[7] + (a + 60) / -40 * (b[8] - b[7]); 
  }

  return res;
}

function VUtoV(a) {
  if(a == undefined) return 0;

  return DBtoV(a);
}

function checkBit(a, b) {
  return 0 > b || 31 < b ? null  : 0 != (a & 1 << b)
}

function FREQtoX(a, b) {
  return (b - 1) * Math.log(a / 20) / Math.log(1102.5)
}

function hexToRGBA(a, b) {
  if (!a || "r" == a[0])
      return a;
  a = a.replace("#", "");
  var c = bound(parseInt(a.substring(0, 2), 16), 0, 255)
    , d = bound(parseInt(a.substring(2, 4), 16), 0, 255)
    , e = bound(parseInt(a.substring(4, 6), 16), 0, 255)
    , f = bound(b, 0, 1);
  return "rgba(" + c + "," + d + "," + e + "," + f + ")"
}

function addDotZero1(a) {
    a += "";
    return -1 == a.indexOf(".") ? a + ".0" : a
}

function addDotZero2(a) {
    return parseInt(a) + "." + parseInt(10 * a) % 10 + "" + parseInt(100 * a) % 10
}

function formatFreq(a) {
    return 1E3 > a ? a | 0 : 1E4 > a ? addDotZero2(a / 1E3) + "k" : addDotZero1(precision(a / 1E3, 1)) + "k"
}

function isInCircle(a, b, c, d, e) {
    return Math.sqrt((a - d) * (a - d) + (b - e) * (b - e)) < c
}

function $ (string) {
  return document.querySelector(string);
}

function initEditBox2() {
  dimBack = $("#DIM_CAPTURE");
  dimBack.onclick = hideAllBox;
  editContainer = $("#EDIT_CONTAINER");
  editLabel = $("#EDIT_LABEL");
  editBox2 = $("#eb2");
  editOk = $("#EDIT_OK");
  editOk.valueFunc = function() {
    log(editBox2.value);
  }
  editOk.value = lang.OK;
  editCancel = $("#EDIT_CANCEL");
  editCancel.valueFunc = function() {
    log("cancel");
  }

  editCancel.value = lang.CANCEL;
}

function hideAllBox() {
  hideKeyboard();
  dimBack.style.display = "none";
  editContainer.style.display = "none";
  confContainer.style.display = "none";
}

function hideKeyboard() {
  document.activeElement.blur();
}

function showEditBox2(a, b) {
  //$("DELAY_TIME").hide();
  document.querySelector("#DELAY_TIME").style.visiblity = 'hidden';
  editLabel.innerHTML = a;
  editContainer.style.display = "block";
  dimBack.style.display = "block";
  isDefined(b) && null  != b ? editBox2.value = b : editBox2.value = "";
  editOk.onclick = function() {
      editOk.valueFunc();
      hideEditBox2()
  };

  editCancel.onclick = function() {
    editCancel.valueFunc();
    hideEditBox2()
  };
  
  editBox2.setSelectionRange(0, 9999);
  editBox2.focus()
}

function hideEditBox2() {
  hideKeyboard();
  "block" != confContainer.style.display && (dimBack.style.display = "none");
  editContainer.style.display = "none"
}

function initConfBox() {
  confContainer = $("#CONF_CONTAINER");
  confLabel = $("#CONF_LABEL");
  confOk = $("#CONF_OK");
  confOk.valueFunc = function() {
      log("OK")
  };
  confOk.value = lang.OK;
  confCancel = $("#CONF_CANCEL");
  confCancel.valueFunc = function() {
      log("CANCEL")
  };
  confCancel.value = lang.CANCEL;
}

function showConfBox(a) {
  dimBack.style.display = "block";
  confLabel.innerHTML = a;
  confContainer.style.display = "block";
  confOk.onclick = function() {
    confOk.valueFunc();
    hideConfBox()
  }
  ;
  confCancel.onclick = function() {
    confCancel.valueFunc();
    hideConfBox()
  }
}

function hideConfBox() {
  "block" != editContainer.style.display && (dimBack.style.display = "none");
  confContainer.style.display = "none"
}

function getAllLv() {
  return [['CH1',1,0], ['CH2',1,1], ['CH3',1,2], ['CH4',1,3], ['CH5',1,4], 
          ['CH6',1,5], ['CH7',1,6], ['CH8',1,7], ['CH9',1,8], ['CH10',1,9], 
          ['CH11',1,10], ['CH12',1,11], ['CH13',1,12], ['CH14',1,13], ['CH15',1,14],
          ['CH16',1,15],['SPDIF',2,16], ['USB',2,18], ['FXR-1',2,20], ['FXR-2',2,22],
          ['FXR-3',2,20], ['FXR-4',2,22], ['AUX1',1,24], ['AUX2',1,25], ['SUB',2,26],
          ['Main',2,28], ['FX1',1,30], ['FX2',1,31], ['FX3',1,32], ['FX4',1,33], ['Monitor',2,34]];
}

var c2sIndex = {
  16: [18,19],//play
  17: [20,21],//fxr1
  18: [22,23],//fxr2
  19: [100],//aux1
  20: [101],//aux2
  21: [110, 111],//sub
  22: [104, 105],//main
  30: [16,17]
};

function getC2SIndex(index) {
  return (index<16)?[index]:c2sIndex[index];
}

function drawImageScale(img, x, y, w, h) {
  ctx.drawImage(img, x, y, w, h);
}

var s2cIndex = {
  18: 16,
  19: 16,
  20: 17,
  21: 17,
  22: 18,
  23: 18,
  101: 20,
  110: 21,
  100: 19,
  104: 22,
  105: 22
};

function VtoGATE_THRESH(a) {
  return 96 * a - 90
}

function VtoGATE_DEPTH(a) {
  return 60 * a - 60
}

function getS2CIndex(index) {
  return (index<16)?index:s2cIndex[index];
}

function lenFormula(a) {
  return 300 * Math.pow(8 / .3, a) | 0
};

function lenFormulaRoom(a) {
  return 100 * Math.pow(10, a) | 0
};

function percentFormula(a) {
  return 100 * a | 0;
}

function hpfFormula(a) {
  return formatFreq(20 * Math.pow(250, a))
};

function lpfFormula(a) {
  return formatFreq(400 * Math.pow(55.125, a))
};

function formatFreq(a) {
  return 1E3 > a ? a | 0 : precision(a / 1E3, 1) + "k"
}

function meRateChange(val, begin, end) {
  return val/(end - begin);
}

function generatePercentX(a) {
  return function(x) {
    return x * a | 0
  }
}

function VtoRATIO(a) {
  return 1 / a
}

function secToTime(a) {
  var b = parseInt(a / 3600) % 24
    , c = parseInt(a / 60) % 60;
  a %= 60;

  return (0 < b ? b + ":" : "") + (10 > c ? "0" + c : c) + ":" + (10 > a ? "0" + a : a)
}

function showPopupMsg(a, b, c) {
  var d = $('#MSG_BODY');
  d.style.fontSize = isDefined(c) ? "{0}px".format(c) : "7mm";
  d.innerHTML = a;

  a = $("#MSG_CONTAINER");
  a.style.top = "60%";
  a.style.opacity = "1";
  clearTimeout(popTimer);

  if(d.innerHTML != lang.websocketError) {
    popTimer = setTimeout(hidePopupMsg, b || 2400);
  }
}

function hidePopupMsg() {
  var a = $("#MSG_CONTAINER");
  a.style.opacity = "0";
}

function VtoATTACK(a) {
  return 1 * Math.pow(400, desqr(a)) | 0
}

function VtoREL(a) {
  return 10 * Math.pow(200, desqr(a)) | 0
}

function VtoDYNGAIN(a) {
  return 96 * a - 72 | 0
}
function VtoDYNGATE(a) {
  return precision(-90 + 96 * a, 1)
}

function desqr(a) {
  return 1 - (1 - a) * (1 - a)
}

function VtoDYNOUTGAIN(a) {
  return 72 * a - 24
}

function ATTACKtoV(a) {
  a = bound(a, 1, 400);
  return reDesqr(Math.log(a) / Math.log(400))
}

function reDesqr(a) {
  return 1 - Math.sqrt(1 - a)
}

function RELtoV(a) {
  a = bound(a, 10, 2000);
  return 1 - Math.sqrt(1 - Math.log(a / 10) / Math.log(200))
}

function DYNOUTGAINtoV(a) {
  return (a + 24) / 72;
}
