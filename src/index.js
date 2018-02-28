var measures = {
	mixerStripWidth: 90,
	mixerRightMargin: 190,
	masterStripWidth: 100,
	masterRightMargin: 90,
	vuWidth: 11,
	db0: .7647058823529421,
	thumbImgHeight: 30,
	editPageSimpleWidth: 90
}

E_MODE = {
	MIX: 0,
	EDIT: 1,
};

E_STRIP_TYPE = {
	IN: 1,
	FX: 2,
	SUB: 3,
	AUX: 4,
	PLAYER: 5,
	MAIN: 6
}

curSetup = {
	input: 16,
	fx: 2,
	aux: 2,
	sub: 1
}

settings = {
	lanes: 2,
	masterLock: !1,
	oneFingerScroll: !0,
	kinetic: !1,
	disableVUs: !1,
	vuquantise: !0,
	disableVUghost: 1,
	disableVUpeak: !1,
	dimVUs: !1,
}

E_COMMANDS = {
  TOGGLE_REC: "RECTOGGLE",
  MTK_PLAY: "MTK_PLAY",
  MTK_STOP: "MTK_STOP",
  MTK_PAUSE: "MTK_PAUSE",
  MTK_JUMP_TO: "MTK_JUMP_TO",
  MTK_SET_SESSION: "MTK_SET_SESSION",
  MTK_GET_SESSIONS: "MTK_GET_SESSIONS",
  MTK_GET_FILES: "MTK_GET_FILES",
  MTK_REC_PLAY: "MTK_REC",
  MTK_REC_STOP: "MTK_REC_STOP",
  MTK_REC_PAUSE: "MTK_REC_PAUSE",
  MTK_REC_JUMP_TO: "MTK_REC_JUMP_TO",
  MTK_REC_SET_SESSION: "MTK_REC_SET_SESSION",
  MEDIA_PLAY: "MEDIA_PLAY",
  MEDIA_JUMP_TO: "MEDIA_JUMP_TO",
  MEDIA_PAUSE: "MEDIA_PAUSE",
  MEDIA_STOP: "MEDIA_STOP",
  MEDIA_PREV: "MEDIA_PREV",
  MEDIA_NEXT: "MEDIA_NEXT",
  MEDIA_SWITCH_PLIST: "MEDIA_SWITCH_PLIST",
  MEDIA_SWITCH_TRACK: "MEDIA_SWITCH_TRACK",
  MEDIA_GET_PLISTS: "MEDIA_GET_PLISTS",
  MEDIA_GET_PLIST_TRACKS: "MEDIA_GET_PLIST_TRACKS",
  SHOW_LIST: "SHOWLIST",
  SHOW_DEL: "DELETESHOW",
  SHOW_LOAD: "LOADSHOW",
  SHOW_CREATE: "CREATESHOW",
  SHOW_RENAME: "RENAMESHOW",
  SNAP_LIST: "SNAPSHOTLIST",
  SNAP_SAVE: "SAVESNAPSHOT",
  SNAP_LOAD: "LOADSNAPSHOT",
  SNAP_DEL: "DELETESNAPSHOT",
  SNAP_RENAME: "RENAMESNAPSHOT",
  PRESET_LIST: "PRESETLIST",
  PRESET_DEL: "DELETEPRESET",
  PRESET_READ: "READPRESET",
  PRESET_WRITE: "WRITEPRESET",
  PRESET_RENAME: "RENAMEPRESET",
  SAVESHOW: "SAVESHOW",
  MIXER_RESET: "MIXER_RESET",
  UPDATE_SHOWS: "UPDATE_SHOWS",
  USB_LIST: "USBMOUNTS",
  EXPORT_SHOW: "EXPORTSHOW",
  IMPORT_SHOW: "IMPORTSHOW",
  IMPORT_LIST: "IMPORTSHOWLIST",
  IMPORT_PRESETS: "IMPORTPRESETS",
  EXPORT_PRESETS: "EXPORTPRESETS",
  IMPORT_CONFIG: "IMPORTCONFIG",
  EXPORT_CONFIG: "EXPORTCONFIG"
};

var widgets = [],
		mWidgets = [],
		dbg = dbgWidgets = !1,
		mouseTargets = [],
		editBox = null,
		HOLD_TIME = 800,
		inStrips = [],
		fxStrips = [],
		subStrips = [],
		auxStrips = [],
		playerStrips = [],
		modeHistory  = [],
		allStrips = [],
		dataValue = {},
		slideOutWidget = null,
		isRetina = !1,
		res = {},
		resReadyNum = 0,
		DBL_CLK_TIME = 350,
		scrollLock = mixerTouches = 0,
		fps = 60,
		selectedChannel = 0;
		selectedStrip = null;
		SCROLL_SCALE = 1.5,
		PEAK_HOLD_TIME = 3E3,
		GLOBAL_VU_FALL_SPEED = .01,
		GLOBAL_VU_FALL_ACC = GLOBAL_VU_FALL_SPEED / fps,
		GLOBAL_PEAK_FALL_SPEED = GLOBAL_VU_FALL_SPEED / 10,
		GLOBAL_PEAK_FALL_ACC = GLOBAL_PEAK_FALL_SPEED / fps * 2,
		zeroDbPos = measures.db0,
		wsBool = false,
		vu = [],
		linkIndex = 0,
		editWidget = null,
		consoleBool = true,
		$WIFIList_data = [],
		$WIFIList = null,
		deviceID = 0,
		EMULATE = !1,
		editContainer = null,
		popTimer = null,
		mixerWidget = null
	;

var mainArr = ['MAIN', 'SUB', 'AUX1', 'AUX2', 'SPDIF', 'FXSend1', 'FXSend2', 'FXSend3', 'FXSend4'];
var mainIndex = [4, 2, 0, 1, 10, 6, 7, 8, 9];
var mainDisIndex = ['AUX1', 'AUX2', 'SUB', 'MAIN', 'FXR-1', 'FXR-2', 'FXR-3', 'FXR-4', 'SPDIF'];
var mainSendIndex = [[4,5], [10, 11], [0], [1], [10], [6,7], [8,9], [8], [9]];

window.onload = function() {
	startLoading = 1;
	init();
}

window.onerror = function(msg) {
	//alert(msg);
	//window.location.reload();
}

function init() {
	window.scrollTo(0, 0);
	canvas = document.querySelector('#canvas');
	ctx = canvas.getContext('2d');

	deviceID = Date.now() + '';

	isIOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
	isAndroid = /(Android)/g.test(navigator.userAgent);

	var host = document.location.host;

	var ws_addr = 'ws://' + "192.168.1.45" + ':1234';
	g_WS = {}; // new WebSocket(ws_addr);

	g_WS.onopen = function(e) {
		wsBool = true;
	
		for(var i = 0; i< 16; i++) {
			send_Data({"msgType":"REQ CH INFO","ch":i});
		}

		send_Data({"msgType":"REQ CH INFO","ch":18});
		send_Data({"msgType":"REQ CH INFO","ch":20});
		//send_Data({"msgType":"REQ CH INFO","ch":21});
		send_Data({"msgType":"REQ CH INFO","ch":22});

		send_Data({"msgType":"REQ OUTPUT INFO","ch":0});
		send_Data({"msgType":"REQ OUTPUT INFO","ch":1});
		send_Data({"msgType":"REQ OUTPUT INFO","ch":10});
		send_Data({"msgType":"REQ OUTPUT INFO","ch":4});

		send_Data({"msgType":"REQ FX SETTING"});
		send_Data({"msgType":"REQ GLOBAL SETTING"});

		send_Data({"msgType":"REQ SCENE LIST"});

		send_Data({"msgType":"REQ LAN SETTING"});
		send_Data({"msgType":"REQ WLAN SETTING"});
	}

	g_WS.onmessage = function(e) {
		var obj = JSON.parse(e.data);

		if(obj.msgType != "VU UPDATE") {
			handle_res_msg(obj);
			consoleBool && console.log('rev...', obj);
		}else {
			vu = obj.vu;
		}
	}

	g_WS.onclose = function(e) {
		wsBool = false;
		//alert('Websocket close \n Check the network please');
		//showPopupMsg(lang.websocketError);
	}

	g_WS.onerror = function(e) {
		wsBool = false;
		//alert("Websocket error");
		//showPopupMsg(lang.websocketError);
	}

	lang = Object.clone(langBase.en);

	initEvents();
	initEditBox2();
	initScreen();
	drawLoadingScreen();
}

function send_Data(obj) {
	var data = JSON.stringify(obj);
	wsBool && g_WS.send(data);
	consoleBool && console.log('send...', data);
}

function sendInfo (index, type, value) {
	var send_data={}, targetIndex=[], targetValue=[];

	sendDouble = !1;
	var indexSingle = !1;

	targetIndex = getC2SIndex(index);

	switch(type) {
		case 'mix':
			send_data.msgType = 'FADER MOVED';
			targetValue = targetIndex.length === 2?[VtoDBSend(value), VtoDBSend(value)]:[VtoDBSend(value)];
			break;
		case 'pan':
			send_data.msgType = 'PAN CHANGED';
			targetValue = targetIndex.length === 2?[parseInt(value * 200),parseInt(value * 200)]:[parseInt(value * 200)];
			break;
		case 'mute':
			send_data.msgType = 'MUTE CHANGED';
			targetValue = targetIndex.length === 2?[!!value, !!value]:[!!value];
			break;
		case 'solo':
			send_data.msgType = 'SOLO CHANGED';
			targetValue = targetIndex.length === 2?[!!value, !!value]:[!!value];
			break;
		case 'name':
			send_data.msgType = "NAME CHANGED";
			targetValue = [value];
			break;
		case 'phantom':
			send_data.msgType = "48V CHANGED";
			targetValue = [!!value];
			break;
		case 'bind':
			send_data.msgType = "BIND CHANGED";
			targetValue = [!!value];
			break;
		case 'color':
			send_data.msgType = "COLOR CHANGED";
			targetValue = [parseInt(value.replace('#', ''), 16)];
			break;
		case 'gain':
			send_data.msgType = "GAIN CHANGED";
			targetValue = [formatGain(value)];
			break;
		case 'pregain':
			send_data.msgType = "PRE GAIN CHANGED";
			targetValue = [formatPregain(value)];
			break;
		case 'MAINgain':
		case 'SUBgain':
		case 'AUX1gain':
		case 'AUX2gain':
		case 'SPDIFgain':
		case 'FXSend1gain':
		case 'FXSend2gain':
		case 'FXSend3gain':
		case 'FXSend4gain':
			var _type = type.replace('gain', '');
			//console.log(allStrips[index].name + _type + '.PF');
			send_data.msgType = "BUSLINE SETTING CHANGED V2";
			var _pf, _on, _gain, _bus, _name;
			send_data.in = targetIndex;

			_name = allStrips[index] ? allStrips[index].name : 'sp.0.';
			_bus = mainSendIndex[mainArr.indexOf(_type)];
			_gain = VtoGAINP(value);
			_pf = !!getValue(_name + _type + '.PF');
			_on = !!getValue(_name + _type + '.ON');

			if(targetIndex.length === 2 || _bus.length === 2) {

				if(_bus.length == 1) {
					_bus = [_bus[0], _bus[0]];
				}

				var _in = [];
				if(targetIndex[0] == 20 || targetIndex[0] == 22 || targetIndex[0] == 18) {
					_in = [targetIndex[0], targetIndex[0] + 1];
				}else {
					_in = [targetIndex[0], targetIndex[0]];
				}

				send_data.in = _in;
				send_data.bus = _bus;
				send_data.gain = [_gain, _gain];
				send_data.PFL = [_pf, _pf];
				send_data.on = [_on, _on];
			}else {
				send_data.bus = _bus;
				send_data.gain = [_gain];
				send_data.PFL = [_pf];
				send_data.on = [_on];
			}

			if(send_data.in.length == 2 && send_data.bus.length == 2) {
				if((send_data.in[0] !== send_data.in[1]) && (send_data.bus[0] !== send_data.bus[1])) {
					var in1 = send_data.in[0],
							in2 = send_data.in[1];
					var bus1 = send_data.bus[0],
							bus2 = send_data.bus[1];

					send_data.in = [in1, in1, in2, in2];
					send_data.bus = [bus1, bus2, bus1, bus2];
					send_data.gain = [_gain, _gain, _gain, _gain];
					send_data.PFL = [_pf, _pf, _pf, _pf];
					send_data.on = [_on, _on, _on, _on];
				}
			}
			break;
		case 'MAINPF':
		case 'SUBPF':
		case 'AUX1PF':
		case 'AUX2PF':
		case 'SPDIFPF':
		case 'FXSend1PF':
		case 'FXSend2PF':
		case 'FXSend3PF':
		case 'FXSend4PF':
			var _type = type.replace('PF', '');

			send_data.msgType = "BUSLINE SETTING CHANGED V2";
			var _pf, _on, _gain, _bus;
			send_data.in = targetIndex;
			
			_name = allStrips[index] ? allStrips[index].name : 'sp.0.';
			_bus = mainSendIndex[mainArr.indexOf(_type)];
			_gain = VtoGAINP(getValue(_name + _type + '.gain'));
			_pf = !!value;
			_on = !!getValue(_name + _type + '.ON');

			if(targetIndex.length === 2 || _bus.length === 2) {

				if(_bus.length == 1) {
					_bus = [_bus[0], _bus[0]];
				}

				var _in = [];
				if(targetIndex[0] == 20 || targetIndex[0] == 22 || targetIndex[0] == 18) {
					_in = [targetIndex[0], targetIndex[0] + 1];
				}else {
					_in = [targetIndex[0], targetIndex[0]];
				}

				send_data.in = _in;
				send_data.bus = _bus;
				send_data.gain = [_gain, _gain];
				send_data.PFL = [_pf, _pf];
				send_data.on = [_on, _on];
			}else {
				send_data.bus = _bus;
				send_data.gain = [_gain];
				send_data.PFL = [_pf];
				send_data.on = [_on];
			}

			if(send_data.in.length == 2 && send_data.bus.length == 2) {
				if((send_data.in[0] !== send_data.in[1]) && (send_data.bus[0] !== send_data.bus[1])) {
					var in1 = send_data.in[0],
							in2 = send_data.in[1];
					var bus1 = send_data.bus[0],
							bus2 = send_data.bus[1];

					send_data.in = [in1, in1, in2, in2];
					send_data.bus = [bus1, bus2, bus1, bus2];
					send_data.gain = [_gain, _gain, _gain, _gain];
					send_data.PFL = [_pf, _pf, _pf, _pf];
					send_data.on = [_on, _on, _on, _on];
				}
			}
			break;
		case 'MAINON':
		case 'SUBON':
		case 'AUX1ON':
		case 'AUX2ON':
		case 'SPDIFON':
		case 'FXSend1ON':
		case 'FXSend2ON':
		case 'FXSend3ON':
		case 'FXSend4ON':
			var _type = type.replace('ON', '');

			send_data.msgType = "BUSLINE SETTING CHANGED V2";
			var _pf, _on, _gain, _bus;
			send_data.in = targetIndex;
			
			_name = allStrips[index] ? allStrips[index].name : 'sp.0.';
			_bus = mainSendIndex[mainArr.indexOf(_type)];
			_gain = VtoGAINP(getValue(_name + _type + '.gain'));
			_pf = !!getValue(_name + _type + '.PF');
			_on = !!value;


			if(targetIndex.length === 2 || _bus.length === 2) {

				if(_bus.length == 1) {
					_bus = [_bus[0], _bus[0]];
				}

				var _in = [];
				if(targetIndex[0] == 20 || targetIndex[0] == 22 || targetIndex[0] == 18) {
					_in = [targetIndex[0], targetIndex[0] + 1];
				}else {
					_in = [targetIndex[0], targetIndex[0]];
				}
 
				send_data.in = _in;
				send_data.bus = _bus;
				send_data.gain = [_gain, _gain];
				send_data.PFL = [_pf, _pf];
				send_data.on = [_on, _on];
			}else {
				send_data.bus = _bus;
				send_data.gain = [_gain];
				send_data.PFL = [_pf];
				send_data.on = [_on];
			}

			if(send_data.in.length == 2 && send_data.bus.length == 2) {
				if((send_data.in[0] !== send_data.in[1]) && (send_data.bus[0] !== send_data.bus[1])) {
					var in1 = send_data.in[0],
							in2 = send_data.in[1];
					var bus1 = send_data.bus[0],
							bus2 = send_data.bus[1];

					send_data.in = [in1, in1, in2, in2];
					send_data.bus = [bus1, bus2, bus1, bus2];
					send_data.gain = [_gain, _gain, _gain, _gain];
					send_data.PFL = [_pf, _pf, _pf, _pf];
					send_data.on = [_on, _on, _on, _on];
				}
			}
			break;
		case 'eqlpffreq':
		case 'eqhpffreq':
		case 'eqb1freq':
		case 'eqb1gain':
		case 'eqb1q':
		case 'eqb2freq':
		case 'eqb2gain':
		case 'eqb2q':
		case 'eqb3freq':
		case 'eqb3gain':
		case 'eqb3q':
		case 'eqb4freq':
		case 'eqb4gain':
		case 'eqb4q':
		case 'eqbypass':
		case 'eqlpf':
		case 'eqhpf':
			send_data.msgType = "EQ CHANGED V2";
			/*send_data.bypass = !1;
			send_data.gain = 0;
			send_data.freq = 100;
			send_data.Q = 0;
			send_data.type = [1, 0, 0, 0, 0, 2]*/
			var eqdata = getEQValue(index);

			indexSingle = !0;

			send_data.EQ = eqdata;
			if([16, 17, 20, 21, 22, 23, 28].indexOf(index) !== -1) {
				sendDouble = !0;
			}
			break;
		/*case "globalSetting1":
			send_data.msgType = "GLOBAL SETTING CHANGED";
			send_data.global = {
				language: 0, 
				mainOutput: getValue("globalmainOutput"),
				phoneOutput: getValue("globalphoneOutput"),
				soloMode: getValue("globalsoloMode"),
				soloType: getValue("globalsoloType")
			};
			break;*/
		case 'par0':
		case 'par1':
		case 'par2':
		case 'par3':
		case 'par4':
		case 'par5':
			//{"msgType":"FX SETTING CHANGED","echo":{"preDelayTime":100,"time":200,"feedback":20,"hDump":30,"lDump":10,"mix":40},"reverb":{"level":0,"directLevel":0,"preDelayTime":0,"time":0,"diffusion":0},"handleCode":"aaaadfdfd"}
			var targetStr0 = 'f.0.';
			var targetStr1 = 'f.1.';
			//console.log(targetIndex);
			send_data.msgType = "FX SETTING CHANGED";
			/*send_data.reverb = {
				'revPreHP': (getValue(targetStr0 + 'par0') || 0) * 1200 | 0,
				'revPreDelay': (getValue(targetStr0 + 'par1') || 0) * 127 | 0,
				'revTime': (getValue(targetStr0 + 'par2') || 0) * 100 | 0,
				'revHDamp': (getValue(targetStr0 + 'par3') || 0) * 100 | 0
			};*/
			send_data.reverb = {
				"level": (getValue(targetStr0 + 'par0') || 0) * 100 | 0,
				"directLevel": (getValue(targetStr0 + 'par1') || 0) * 100 | 0,
				"preDelayTime": (getValue(targetStr0 + 'par2') || 0) * 250 | 0,
				"time": (getValue(targetStr0 + 'par3') || 0) * 100 | 0,
				"diffusion": (getValue(targetStr0 + 'par4') || 0) * 100 | 0
			};

			send_data.delay = {
				"delayPreLP": (getValue(targetStr1 + 'par0') || 0) * 1500 | 0,
				"delayFeedback": (getValue(targetStr1 + 'par1') || 0) * 100 | 0,
				"delayTime": (getValue(targetStr1 + 'par2') || 0) * 1200 | 0
			};
			break;
		case "gatethresh":
		case "dynthreshold":
		case "dynratio":
		case "dynattack":
		case "dynrelease":
		case "dyngain":
			send_data.msgType = "DYN CHANGED";

			indexSingle = !0;

			send_data.DYN = getDYNValue(index);
			break;
	}
	send_data.ch = (indexSingle ? targetIndex[0] : targetIndex);
	send_data.value = targetValue;
	send_data.handleCode = deviceID;

	send_Data(send_data);

	send_data.ch = send_data.ch + 1;
	sendDouble && send_Data(send_data);
}

function getEQValue(ch) {
		var Q = [], gain = [], freq = [];

		var channelInfo = getChannelName(ch);
//i.3  .eq.bypass
		var eqHeader = channelInfo.name + '.' + channelInfo.subid + '.eq.';
		var bypass = toBool(getValue(eqHeader + 'bypass'));

		freq.push(VtoFREQ(getValue(eqHeader + 'hpf.freq')));
		gain.push(0);
		Q.push(0);
		for(var i = 1; i < 5; i++) {
			Q.push(VtoQ(getValue(eqHeader + 'b' + i + '.q')));
			gain.push(VtoEQGAIN20(getValue(eqHeader + 'b' + i + '.gain')));
			freq.push(VtoFREQ(getValue(eqHeader + 'b' + i + '.freq')));
		}
		freq.push(VtoFREQ(getValue(eqHeader + 'lpf.freq')));
		gain.push(0);
		Q.push(0);

		var eqHpf = getValue(eqHeader + 'hpf'),
						eqLpf = getValue(eqHeader + 'lpf');

		type = [2, 1, 1, 1, 1, 3];

		eqHpf == 0 && (type[0] = 0);
		eqLpf == 0 && (type[5] = 0);

		var _EQ = {};
		_EQ.bypass = bypass;
		_EQ.para = [];
		_EQ.kind = 0;

		for(var i = 0; i < 6; i++) {
				_EQ.para.push({
					type: type[i],
					freq: freq[i],
					gain: gain[i],
					q: Q[i]
				})
		}

		//console.log(_EQ)
		return _EQ;
}

function getDYNValue(index) {
	var channelInfo = getChannelName(index);
	var dynHeader = channelInfo.name + '.' + channelInfo.subid + '.dyn.';

		var ratio = precision(VtoRATIO(getValue(dynHeader + 'ratio')), 2);
		ratio < 1 && (ratio = 200);

	return {
		"bypass": false,
		"softnee": true,
		"threshold": VtoTHRESH(getValue(dynHeader + 'threshold')),
		"gate": VtoGATE_THRESH(getValue(channelInfo.name + '.' + channelInfo.subid + '.gate.thresh')),
		"ratio": ratio,
		"attack": VtoATTACK(getValue(dynHeader + 'attack')),
		"release": VtoREL(getValue(dynHeader + 'release')),
		"gain": VtoDYNOUTGAIN(getValue(dynHeader + 'gain'))
	}
}

function sendGlobalSetting() {
	var _data = {
		 "msgType":"GLOBAL SETTING CHANGED",
		 "global":{
		 		"devName":"WIFI-Mixer",
		 		"language":0,
		 		"mainOutput":getValue('globalmainOutput'),
		 		"phoneOutput":getValue('globalphoneOutput'),
		 		"soloMode":getValue('globalsoloMode'),
		 		"soloType": getValue("globalsoloType")
		 	}
	}

	send_Data(_data);
}

function handle_res_msg(msg) {
	var objType = msg.msgType;
	switch(objType) {
		case "REQ HOME ACK":
			handleHomeAck(msg);
			break;
		case "PAN UPDATE":
			deviceID !== msg.handleCode && handlePan(msg);
			break;
		case "MUTE UPDATE":
			handleMute(msg);
			break;
		case "SOLO UPDATE":
			handleSolo(msg);
			break;
		case "COLOR UPDATE":
			handleColor(msg);
			break;
		case "BIND UPDATE":
			deviceID !== msg.handleCode && handleBind(msg);
			break;
		case "NAME UPDATE":
			handleName(msg);
			break;
		case "FADER UPDATE":
			deviceID !== msg.handleCode && handleFader(msg);			
			break;
		case "48V UPDATE":
			handlePhantom(msg);
			break;
		case "PRE GAIN UPDATE":
			deviceID !== msg.handleCode && handlePregain(msg);
			break;
		case "GAIN UPDATE":
			deviceID !== msg.handleCode && handleGain(msg);
			break;
		case "BUSLINE SETTING UPDATE V2":
			deviceID !== msg.handleCode && handleBuslineSet(msg);
			break;
		case "EQ UPDATE V2":
				deviceID !== msg.handleCode && handleEQSet(msg);
				break;
		case "FX SETTING":
			deviceID !== msg.handleCode && handleFx(msg);
			break;
		case "ALL CONFIG UPDATE":
			handleAllConfig(msg);
			break;
		case "GLOBAL SETTING":
			handleGlobalSetting(msg);
			break;
		case "REQ CH INFO ACK V2":
			handleCHInfoAck(msg);
			break;
		case "REQ OUTPUT INFO ACK V2":
			handleBUSInfoAck(msg);
			break;
		case "SCENE LIST UPDATE":
			handleSceneList(msg);
			break;
		case "WLAN SETTING":
			handleWlanSetting(msg);
			break;
		case "LAN SETTING":
			handleLanSetting(msg);
			break;
		case "REQ WLAN LIST ACK":
			handleWlanList(msg);
			break;
		case "PLAYER LIST REFRESH":
			mixerWidget && handlePlayerList(msg);
			break;
		case "PLAY STATES UPDATE":
			mixerWidget && handlePlayStates(msg);
			break;
		case "PLAYER TIME UPDATE":
			mixerWidget && handlePlayerTime(msg);
			break;
		case "PLAYER INDEX CHANGED":
			mixerWidget && handlePlayerIndexChange(msg);
			break;
		case "DYN LIB LIST UPDATE":
		case "EQ LIB LIST UPDATE":
		/*case "OCT LIB LIST UPDATE":*/
			handleDynLibListUpdate(msg);
			/*break;
			handleEqLibListUpdate(msg);
			break;
			handleOctLibListUpdate(msg);*/
			break;
		case "DYN UPDATE":
			deviceID !== msg.handleCode && handleDynUpdate(msg);
	}
}

function handleDynLibListUpdate(msg) {

		var preset = msg.preset,
						user = msg.user;

		if(!cuurentPresetDir){
		 	currentPresetWindow && currentPresetWindow.LIST.setItems(msg.preset)
		}else {
			currentPresetWindow && currentPresetWindow.LIST.setItems(msg.user)
			//console.log(currentPresetWindow.LIST, 'zz')
		}

		currentPresetWindow && regUpdate(currentPresetWindow.LIST);
}

function handleEqLibListUpdate(msg) {
		var preset = msg.preset,
						user = msg.user;

		var msg = {
				"msgType":"EQ LIB LIST UPDATE",
				"preset":["PRESET 1", "PRESET 2"],
				"user":["USER 1", "USER 2"]
		};
}

function handleOctLibListUpdate(msg) {
		var preset = msg.preset,
						user = msg.user;

		var msg = {
				"msgType":"EQ LIB LIST UPDATE",
				"preset":["PRESET 1", "PRESET 2"],
				"user":["USER 1", "USER 2"]
		};
}

function handleHomeAck(obj) {
		var pan = obj.PAN,
			  mute = obj.mute,
			  fader = obj.fader,
			  solo = obj.solo,
			  icon = obj.icon,
			  name = obj.name,
			  color = obj.color,
			  bind = obj.bind;

		for(var i = 0; i < 16; i++){
			setChannelValue('i', i, 'pan', PANtoV(pan[i]));
			setChannelValue('i', i, 'mute', mute[i]?1:0);
			setChannelValue('i', i, 'mix', DBtoV(fader[i]));
			setChannelValue('i', i, 'solo', solo[i]?1:0);
			setChannelValue('i', i, 'icon', icon[i]);
			setChannelValue('i', i, 'name', name[i]);
			setChannelValue('i', i, 'color', color[i] / 100000);
			setChannelValue('i', i, 'bind', bind[i]?1:0);
		}

		setChannelValue('p', 0, 'pan', PANtoV(pan[18]));
		setChannelValue('p', 0, 'mute', mute[18]?1:0);
		setChannelValue('p', 0, 'mix', DBtoV(fader[18]));
		setChannelValue('p', 0, 'solo', solo[18]?1:0);
		setChannelValue('p', 0, 'icon', icon[18]);
		setChannelValue('p', 0, 'name', "PLAYER");
		setChannelValue('p', 0, 'color', color[18] / 100000);
		setChannelValue('p', 0, 'bind', 0);

		setChannelValue('f', 0, 'pan', PANtoV(pan[20]));
		setChannelValue('f', 0, 'mute', mute[20]?1:0);
		setChannelValue('f', 0, 'mix', DBtoV(fader[20]));
		setChannelValue('f', 0, 'solo', solo[20]?1:0);
		setChannelValue('f', 0, 'icon', icon[20]);
		setChannelValue('f', 0, 'name', 'FXR1');
		setChannelValue('f', 0, 'color', color[20]);
		setChannelValue('f', 0, 'bind', 0);

		setChannelValue('f', 1, 'pan', PANtoV(pan[22]));
		setChannelValue('f', 1, 'mute', mute[22]?1:0);
		setChannelValue('f', 1, 'mix', DBtoV(fader[22]));
		setChannelValue('f', 1, 'solo', solo[22]?1:0);
		setChannelValue('f', 1, 'icon', icon[22]);
		setChannelValue('f', 1, 'name', 'FXR2');
		setChannelValue('f', 1, 'color', color[22]);
		setChannelValue('f', 1, 'bind', 0);

		setChannelValue('a', 0, 'pan', PANtoV(pan[24]));
		setChannelValue('a', 0, 'mute', mute[24]?1:0);
		setChannelValue('a', 0, 'mix', DBtoV(fader[24]));
		setChannelValue('a', 0, 'solo', solo[24]?1:0);
		setChannelValue('a', 0, 'icon', 'none');
		setChannelValue('a', 0, 'name', 'AUX1');
		setChannelValue('a', 0, 'color', 'none');
		setChannelValue('a', 0, 'bind', 0);

		setChannelValue('a', 1, 'pan', PANtoV(pan[25]));
		setChannelValue('a', 1, 'mute', mute[25]?1:0);
		setChannelValue('a', 1, 'mix', DBtoV(fader[25]));
		setChannelValue('a', 1, 'solo', solo[25]?1:0);
		setChannelValue('a', 1, 'icon', 'none');
		setChannelValue('a', 1, 'name', 'AUX2');
		setChannelValue('a', 1, 'color', 'none');
		setChannelValue('a', 1, 'bind', 0);

		setChannelValue('s', 0, 'pan', PANtoV(pan[26]));
		setChannelValue('s', 0, 'mute', mute[26]?1:0);
		setChannelValue('s', 0, 'mix', DBtoV(fader[26]));
		setChannelValue('s', 0, 'solo', solo[26]?1:0);
		setChannelValue('s', 0, 'icon', 'none');
		setChannelValue('s', 0, 'name', 'SUB');
		setChannelValue('s', 0, 'color', 'none');
		setChannelValue('s', 0, 'bind', 0);

		setChannelValue('m', 0, 'pan', PANtoV(pan[28]));
		setChannelValue('m', 0, 'mute', mute[28]?1:0);
		setChannelValue('m', 0, 'mix', DBtoV(fader[28]));
		setChannelValue('m', 0, 'solo', solo[28]?1:0);
		setChannelValue('m', 0, 'icon', 'none');
		setChannelValue('m', 0, 'name', 'MAIN');
		setChannelValue('m', 0, 'color', 'none');
		setChannelValue('m', 0, 'bind', 0);
}

function setChannelValue(indexType, index, type, val) {
	setValueX(indexType + '.' +index + '.' + type, val, true);
	if(type === 'bind') {
		if(val === 1) {
			setValueX(indexType + '.' + index + '.stereoIndex', index%2, true)
			linkIndex++;
			if( linkIndex == 2 ) {
				 linkIndex = 0
			}
		}else {
			setValueX(indexType + '.' + index + '.stereoIndex', -1, true)
		}
	}
}

function setChannelEntire(indexType, index, obj) {
	var pan = obj.PAN,
			mute = obj.mute,
			fader = obj.fader,
			solo = obj.solo,
			icon = obj.icon,
			name = obj.name,
			color = obj.color && ('#' + obj.color.toString(16)),
			bind = obj.bind,
			gain = 10//obj.gain,
			pregain = obj.preGain,
			inv = obj.inv,
			v48 = obj['48v'],
			buslinegain = obj["busline gain"],
			buslinePFL = obj["busline PFL"],
			buslineon = obj["busline on"],
			eq = obj["EQ"];
			dyn = obj["DYN"];

	/*if(obj.Q != undefined) {
		eq = {
			Q: obj.Q,
			freq: obj.freq,
			bypass: obj.bypass,
			gain: obj.gain,
			type: obj.type
		}
	}*/

	pan != undefined && setChannelValue(indexType, index, 'pan', PANtoV(pan));
	mute != undefined && setChannelValue(indexType, index, 'mute', mute?1:0);
	fader != undefined && setChannelValue(indexType, index, 'mix', DBtoV(fader));
	solo != undefined && setChannelValue(indexType, index, 'solo', solo?1:0);
	icon != undefined && setChannelValue(indexType, index, 'icon', icon);
	name != undefined && setChannelValue(indexType, index, 'name', name);
	color != undefined && setChannelValue(indexType, index, 'color', color);
	bind != undefined && setChannelValue(indexType, index, 'bind', bind?1:0);
	gain != undefined && setChannelValue(indexType, index, 'gain', formatGaintoV(gain));
	pregain != undefined && setChannelValue(indexType, index, 'pregain', formatPregaintoV(pregain));
	inv != undefined && setChannelValue(indexType, index, 'inv', inv?1:0);
	v48 != undefined && setChannelValue(indexType, index, 'phantom', v48?1:0);
	/*buslinegain != undefined && setChannelValue(indexType, index, 'buslinegain', buslinegain);
	buslinePFL != undefined && setChannelValue(indexType, index, 'buslinePFL', buslinePFL);
	buslineon != undefined && setChannelValue(indexType, index, 'buslineon', buslineon);
	eq != undefined && setChannelValue(indexType, index, 'eq', eq);*/
	if(buslinegain != undefined) {
		for(var i = 0; i < mainArr.length; i++) {
			setChannelValue(indexType, index, mainArr[i] + '.gain', GAINPtoV(buslinegain[mainIndex[i]]))
		}
	}

	if(buslinePFL != undefined) {
		for(var i = 0; i < mainArr.length; i++) {
			setChannelValue(indexType, index, mainArr[i] + '.PF', buslinePFL[mainIndex[i]]?1:0)
		}
	}

	if(buslineon != undefined) {
		for(var i = 0; i < mainArr.length; i++) {
			setChannelValue(indexType, index, mainArr[i] + '.ON', buslineon[mainIndex[i]]?1:0)
		}
	}


	var eqType = ['hpf', 'b1', 'b2', 'b3', 'b4', 'lpf'];
	var para = eq.para;

	if(eq != undefined) {
		
		for(var i = 0; i < eqType.length; i++) {
			setChannelValue(indexType, index, 'eq.' + eqType[i] + '.freq', FREQtoV(para[i].freq));
			setChannelValue(indexType, index, 'eq.' + eqType[i] + '.gain', GaintoV20(para[i].gain));
			setChannelValue(indexType, index, 'eq.' + eqType[i] + '.q', QtoV(para[i].q));
		}
		
		setChannelValue(indexType, index, 'eq.' + 'bypass', eq.bypass?1:0, true);
	
		setValueX(indexType + '.'+ index + '.eq.hpf', toZero(para[0].type), true);
		//para[0].type == 4 && setValueX(indexType + index + 'eq.hpf', 1);

		setValueX(indexType + '.' +index + '.eq.lpf', toZero(para[5].type), true);
		//para[0].type == 4 && setValueX(indexType + index + 'eq.hpf', 1);
	}

	if(isDefined(dyn)) {
		setChannelValue(indexType, index, 'dyn.attack', ATTACKtoV(dyn.attack));
		setChannelValue(indexType, index, 'gate.thresh', DYNGATEtoV(dyn.gate));
		setChannelValue(indexType, index, 'dyn.release', RELtoV(dyn.release));
		setChannelValue(indexType, index, 'dyn.gain', DYNOUTGAINtoV(dyn.gain));
		//setChannelValue(indexType, index, 'dyn.softknee', toZero(dyn.softnee));
		//setChannelValue(indexType, index, 'dyn.bypass', toZero(dyn.bypass));
		setChannelValue(indexType, index, 'dyn.ratio', precision(RATIOtoV(dyn.ratio), 2));
		setChannelValue(indexType, index, 'dyn.threshold', THRESHtoV(dyn.threshold));
	}
	//handleDynUpdate(obj);
}

function getChannelName(index) {
	var name = '';
	var subid = 0;
	//console.log(index);
	switch(index) {
		case 16:
			name = 'p';
			subid = 0;
			break;
		case 17:
		case 18:
			name = 'f';
			subid = (index-17);
			break;
		case 19:
		case 20:
			name = 'a';
			subid = (index-19);
			break;
		case 21:
			name = 's';
			subid = 0;
			break;
		case 22:
			name = 'm';
			subid = 0;
			break;
		default: 
			name = 'i';
			subid = index;
			break;
	}

	return {name: name, subid: subid};
}

function updateRevDate(msg, type, func) {
	 var ch = msg.ch[0];
	 var channelIndex = getS2CIndex(ch);

	 var channelInfo = getChannelName(channelIndex);
	 setChannelValue(channelInfo.name, channelInfo.subid, type, func(msg.value[0]));
	 me_updateByKey(channelIndex, type);
}

function handlePan(msg) {
		updateRevDate(msg, 'pan', PANtoV);
}

function handleMute(msg) {
		updateRevDate(msg, 'mute', toZero);
}

function handleColor(msg) {
		updateRevDate(msg, 'color', colorTransform)
}

function handleBind(msg) {
		updateRevDate(msg, 'bind', toZero);
}

function colorTransform(a) {
	return ('#' + a.toString(16));
}

function handleSolo(msg) {
	if(msg.ch.length > 2) {
		for(var i = 0, len = msg.ch.length; i < len; i++) {
			var ch = msg.ch[i];
			var channelIndex = getS2CIndex(ch);

			var channelInfo = getChannelName(channelIndex);
			setChannelValue(channelInfo.name, channelInfo.subid, 'solo', toZero(msg.value[i]));
			me_updateByKey(channelIndex, 'solo');
		}
	}else {
		updateRevDate(msg,'solo', toZero);
	}
}

function handleFader(msg) {
		updateRevDate(msg, 'mix', DBtoV);
}

function handleName(msg) {
		updateRevDate(msg, 'name', blankFunc);
}

function handlePhantom(msg) {
		updateRevDate(msg, 'phantom', toZero);
}
	
function handlePregain(msg) {
	updateRevDate(msg, 'pregain', formatPregaintoV);
}

function	handleGain(msg) {
	updateRevDate(msg, 'gain', formatGaintoV);
}

function handleBuslineSet(msg) {
		var msg_bus = msg.bus[0];
		var msg_in = msg.in[0];

		var nameHead = '';
		var chnName = '';
		switch (msg_bus) {
			case 0:
			case 1:
			 nameHead = 'AUX' + (msg_bus + 1);
			 break;
			case 2:
				nameHead = 'SUB';
				break;
			case 4:
				nameHead = 'MAIN';
				break;
			case 6:
			case 7:
			case 8:
			case 9:
				nameHead = 'FXSend' + (msg_bus - 5);
				break;
			case 10:
				nameHead = 'SPDIF';
				break;
		}

		switch (msg_in) {
			case 18:
				chnName = 'p.0';
				break;
			case 20:
				chnName = 'f.0';
				break;
			case 22:
				chnName = 'f.1';
				break;
			default: 
				chnName = 'i.' + msg_in;
				break;
		}

		setValueX(chnName + '.' + nameHead + '.' + 'gain', GAINPtoV(msg.gain[0]), true);
		setValueX(chnName + '.' + nameHead + '.' + 'PF', toZero(msg.PFL[0]), true);
		setValueX(chnName + '.' + nameHead + '.' + 'ON', toZero(msg.on[0]), true);
		me_updateByKey(0, 'busline');	
}

function handleEQSet(msg) {
	 var eq = msg.EQ.para;
		var eqType = ['hpf', 'b1', 'b2', 'b3', 'b4', 'lpf'];
		var channelInfo = getChannelName(getS2CIndex(msg.ch));
		var indexType = channelInfo.name;
		var index = channelInfo.subid;

		if(eq != undefined) {
			for(var i = 0; i < eqType.length; i++) {
				setChannelValue(indexType, index, 'eq.' + eqType[i] + '.freq', FREQtoV(eq[i].freq));
				setChannelValue(indexType, index, 'eq.' + eqType[i] + '.gain', GaintoV20(eq[i].gain));
				setChannelValue(indexType, index, 'eq.' + eqType[i] + '.q', QtoV(eq[i].q));
			}
				setChannelValue(indexType, index, 'eq.' + 'bypass', (msg.EQ.bypass?1:0));
		}

		setChannelValue(indexType, index, 'eq.hpf', toZero(eq[0].type));
		setChannelValue(indexType, index, 'eq.lpf', toZero(eq[5].type));

		me_updateByKey(0, 'eq');
}

function handleFx(msg) {
		setValueX('f.0.par0', meRateChange(msg.reverb.level, 0, 100), true);
		setValueX('f.0.par1', meRateChange(msg.reverb.directLevel, 0, 100), true);
		setValueX('f.0.par2', meRateChange(msg.reverb.preDelayTime, 0, 250), true);
		setValueX('f.0.par3', meRateChange(msg.reverb.time, 0, 100), true);
		setValueX('f.0.par4', meRateChange(msg.reverb.diffusion, 0, 100), true);
		//setValueX('f.0.par1', meRateChange(msg.reverb.time, 0, 680), true);

		setValueX('f.1.par0', meRateChange(msg.delay.delayPreLP, 0, 1500), true);
		setValueX('f.1.par1', meRateChange(msg.delay.delayFeedback, 0, 100), true);
		setValueX('f.1.par2', meRateChange(msg.delay.delayTime, 0, 1200), true);
		//setValueX('f.1.par2', meRateChange(msg.reverb.preDelayTime, 0, 250), true);
		//setValueX('f.1.par3', meRateChange(msg.reverb.time, 0, 100), true);

		me_updateByKey(0, 'fx');
}

function handleCHInfoAck(msg) {
	var ch = msg.ch;

	switch(ch) {
		case 18:
			msg.name = "PLAYER";
			setChannelEntire('p', 0, msg);
			break;
		case 20:
			msg.bind = false;
			msg.name = "FXR-1";
			setChannelEntire('f', 0, msg);
			break;
		case 22:
			msg.bind = false;
			msg.name = "FXR-2";
			setChannelEntire('f', 1, msg);
			break;
		case 16:
			msg.name = "SPDIF";
			setChannelEntire('sp', 0, msg);
		default: 
			setChannelEntire('i', ch, msg);
			break;
	}
}

function handleBUSInfoAck(msg) {
	var ch = msg.ch;

	switch(ch) {
		case 0:
			msg.name = "AUX1";
			setChannelEntire('a', 0, msg);
			break;
		case 1:
			msg.name = "AUX2";
			setChannelEntire('a', 1, msg); 
			break;
		case 10:
			msg.name = "SUB";
			setChannelEntire('s', 0, msg);
			break;
		case 4:
			if(msg.EQ.kind == 1) {
				difVersionDiff();
			}

			msg.name = "MAIN";
			setChannelEntire('m', 0, msg);
			break;
	}
}

function handleDynUpdate(msg) {
	var channelInfo = getChannelName(getS2CIndex(msg.ch));
	var indexType = channelInfo.name;
	var index = channelInfo.subid;

	var dyn = msg.DYN;

	setChannelValue(indexType, index, 'dyn.attack', ATTACKtoV(dyn.attack));
	setChannelValue(indexType, index, 'gate.thresh', DYNGATEtoV(dyn.gate));
	setChannelValue(indexType, index, 'dyn.release', RELtoV(dyn.release));
	setChannelValue(indexType, index, 'dyn.gain', DYNOUTGAINtoV(dyn.gain));
	//setChannelValue(indexType, index, 'dyn.softknee', toZero(dyn.softnee))
	setChannelValue(indexType, index, 'dyn.ratio', precision(RATIOtoV(dyn.ratio), 2));
	setChannelValue(indexType, index, 'dyn.threshold', THRESHtoV(dyn.threshold));
	//setChannelValue(indexType, index, 'dyn.bypass', toZero(dyn.bypass))

	me_updateByKey(0, "dyn");
}

function handleGlobalSetting(msg) {
	//globalLanguage
	setValueX('globalLanguage', msg.global.language, true);
	setValueX('globalmainOutput', msg.global.mainOutput, true);
	setValueX('globalphoneOutput', msg.global.phoneOutput, true);
	setValueX('globalsoloMode', msg.global.soloMode, true);
	setValueX('globalsoloType', msg.global.soloType, true);

	me_updateByKey(0, "globalSetting");
}

function handleSceneList(msg) {
	var a = _.clone(msg.list);
	a.push('+');
	setValueX("sceneList", a, true);

	editWidget && editWidget.pages && editWidget.pages[1] &&
		(editWidget.pages[1].initWidgets(),
      editWidget.pages[1].calcGeometry(),
        regUpdate(editWidget.pages[1]))
}

function handleAllConfig(msg) {
	for(var i = 0; i< 16; i++) {
		 send_Data({"msgType":"REQ CH INFO","ch":i});
	}
	send_Data({"msgType":"REQ CH INFO","ch":16})
	send_Data({"msgType":"REQ CH INFO","ch":18})
	send_Data({"msgType":"REQ CH INFO","ch":20})
	send_Data({"msgType":"REQ CH INFO","ch":22})

	send_Data({"msgType":"REQ BUS INFO","ch":0})
	send_Data({"msgType":"REQ BUS INFO","ch":1})
	send_Data({"msgType":"REQ BUS INFO","ch":2})
	send_Data({"msgType":"REQ BUS INFO","ch":4})
}

function handleWlanSetting(msg) {
	setValueX('NETWORK_WIFI_SWITCH', msg.enable ? 0 : 1, true);
	setValueX('NETWORK_WIFI_MODE', msg.mode == 'host' ? 0 : 1, true);
	setValueX('NETWORK_WIFI_HOST_SSID', msg.host.ssid, true);
}

//var fff  = true;
function handleWlanList(msg) {
	$WIFIList_data = [];
	//if(!fff) { return 0;}

	var current = msg.current;

	for(var i = 0, f = ''; i < msg.list.length; i++) {
		f = msg.list[i].ssid;
		f == current && (f += '^ - ^');
		$WIFIList_data.push(f);
	}

	//fff = false;
	$WIFIList && $WIFIList.setItems($WIFIList_data);

	regUpdate($WIFIList);
}

function getWLANValueHOST() {
		/*send_Data({
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
	})*/

	return {
		"msgType":"WLAN SETTING CHANGED",
		"mode":"host",
		"enable":!toBool(getValue('NETWORK_WIFI_SWITCH')),
		"host":{
		  "ssid":getValue("NETWORK_WIFI_HOST_SSID"),
		  "ssid broadcast enabled":true,
		  "channel":6,
		  "security":"WPA2",
		  "psk":"password"
		}
	}
}

function getWLANValueCLIENT() {
	return {
		"msgType":"WLAN SETTING CHANGED",
		"mode":"client",
		"enable":!toBool(getValue('NETWORK_WIFI_SWITCH')),
		"client":{
			"DHCP":false,
			"IP":"192.168.1.115",
			"netmask":"255.255.255.0",
			"gateway":"192.168.1.1"
		}
	}
}


function handleLanSetting(msg) {
	//console.log(msg.IP,msg.netmask, msg.gateway, 'zz')
	setValueX('NETWORK_LAN_SWITCH', msg.enable ? 0 : 1, true);
	setValueX('NETWORK_LAN_MODE', msg.DHCP ? 1 : 0, true);

	setValueX('NETWORK_LAN_HOST_IP', msg.IP, true);
	setValueX('NETWORK_LAN_HOST_MASK', msg.netmask, true);
	setValueX('NETWORK_LAN_HOST_GATE', msg.gateway, true);
}

function handlePlayerList(msg) {
	/*var msg = {
	 	"msgType":"PLAYER LIST REFRESH", 
			"folder index":1, 
			"music index": 0,
			"folder list":["文件夹1","文件夹2"],
			"music list":["两只老虎","义勇军进行曲"]
	}*/

	var targetPage = mixerWidget.pages[2];

	targetPage.PLISTS.setItems(msg["folder list"]);
	targetPage.FLIST.setItems(msg["music list"]);

	targetPage.PLISTS.select(msg["folder index"], false, true);
	targetPage.FLIST.select(msg["music index"], false, true);

	me_updateByKey(0, 'player');

	/*handlePlayStates();
	handlePlayerTime();
	handlePlayerIndexChange();*/
}

function handlePlayStates(msg) {

	/*var msg = {
			"msgType":"PLAY STATES UPDATE",
			"current song":"两只老虎",
			"isPlaying":true
	}*/

	var targetPage = mixerWidget.pages[2];

	targetPage.PLAY.setState(toBool(msg.isPlaying));
}

function handlePlayerTime(msg) {
		/*var msg = {
			"msgType":"PLAYER TIME UPDATE",
			"current":70,
			"total":200
		}*/

	var targetPage = mixerWidget.pages[2];

	dataValue["var.currentLength"] = msg.total;
	dataValue["var.currentTrackPos"] = msg.current / msg.total;

	regUpdate(targetPage.timeDisplay);

	//console.log(dataValue["var.currentTrackPos"])

	regUpdate(targetPage.SEEKBAR);
}

function handlePlayerIndexChange(msg) {
		var targetPage = mixerWidget.pages[2];

		/*var msg = {
				"msgType":"PLAYER INDEX CHANGED",
				"folder index":0,
				"music index":-1
		}*/

	targetPage.PLISTS.select(msg["folder index"], false, true);
	targetPage.FLIST.select(msg["music index"], false, true);
}

function initEvents() {
	canvas.addEventListener("mousedown", hMouse, !1);
  window.addEventListener("mouseup", hMouse, !1);
  window.addEventListener("mousemove", hMouse, !1);
  window.addEventListener("mousewheel", hMouse, !1);
  window.addEventListener("DOMMouseScroll", hMouse, !1);

  /*window.addEventListener("keypress", hKbd, !1);
  window.addEventListener("keydown", hKbd, !1);
  window.addEventListener("keyup", hKbd, !1);*/

  canvas.addEventListener("touchstart", touchStart, !1);
  window.addEventListener("touchmove", touchMove, !1);
  window.addEventListener("touchend", touchEnd, !1);
  window.addEventListener("touchcancel", touchEnd, !1);
  window.addEventListener("touchleave", touchEnd, !1);
}

function initEditBox2() {
	dimBack = document.querySelector("#DIM_CAPTURE");
	dimBack.addEventListener("click", function() {
		hideAllBox();
	}, false);
	editContainer = document.querySelector("#EDIT_CONTAINER");
	editContainer2 = document.querySelector("#EDIT_CONTAINER2");
	editLabel = document.querySelector("#EDIT_LABEL");
	editBox2 = document.querySelector("#eb2");

	editOk = document.querySelector('#EDIT_OK');
	
	editLabel2 = document.querySelector("#EDIT_LABEL2");
	htmlApply = document.querySelector("#APPLY");
	htmlCover = document.querySelector("#COVER");
	htmlDelete = document.querySelector("#DELETE");
	htmlCancel = document.querySelector("#CANCEL");

	editOk.valueFunc = function() {
		log(editBox2.value);
	}
	editOk.value = lang.OK;

	editCancel = document.querySelector('#EDIT_CANCEL');
	editCancel.valueFunc = function() {
		log('cancel');
	}
	editCancel.value = lang.CANCEL;

	htmlApply.valueFunc = function() {
		log(htmlApply.value);
	}
	htmlApply.value = lang.APPLY;

	htmlCover.valueFunc = function() {
		log(htmlCover.value);
	}
	htmlCover.value = lang.COVER;

	htmlDelete.valueFunc = function() {
		log(htmlDelete.value);
	}
	htmlDelete.value = lang.DELETE;

	htmlCancel.valueFunc = function() {
		log(htmlCancel.value);
	}
	htmlCancel.value = lang.CANCEL;
}

function hideAllBox() {
	hideKeyboard();
	dimBack.style.display = 'none';
	editContainer.style.display = "none";
	editContainer2.style.display = "none";
}

function hideKeyboard() {
	document.activeElement.blur();
}

function showEditBox2(a, b) {
	editLabel.innerHTML = a;
	editContainer.style.display = 'block';
	dimBack.style.display = "block";
	//console.log(b)
	isDefined(b) && null != b ? editBox2.value = b : editBox2.value = "";

	editOk_func = function() {
		console.log('editok');
		editOk.valueFunc();
		hideEditBox2();
	}

	editCancel_func = function() {
		console.log('editcancel');
		editCancel.valueFunc();
		hideEditBox2();
	}

	editOk.addEventListener("click", editOk_func, false);

	editCancel.addEventListener("click", editCancel_func, false);

	editBox2.setSelectionRange(0,9999);
	editBox2.focus();
}

function showEditBox3(a, b) {
	editLabel2.innerHTML = a;
	editContainer2.style.display = 'block';
	dimBack.style.display = "block";

	htmlApply_func = function() {
			htmlApply.valueFunc();
			hideEditBox3();
	}

	htmlCover_func = function() {
			htmlCover.valueFunc();
			hideEditBox3();
	}

	htmlDelete_func = function() {
			htmlDelete.valueFunc();
			hideEditBox3();
	}

	htmlCancel_func = function() {
		htmlCancel.valueFunc();
		hideEditBox3();
	}

	htmlApply.addEventListener("click", htmlApply_func, false);
	htmlCover.addEventListener("click", htmlCover_func, false);
	htmlDelete.addEventListener("click", htmlDelete_func, false);
	htmlCancel.addEventListener("click", htmlCancel_func, false);
}

function hideEditBox3() {
	hideKeyboard();
	dimBack.style.display = "none";
	editContainer2.style.display = "none";

	htmlApply.removeEventListener("click", htmlApply_func, false);
	htmlCover.removeEventListener("click", htmlCover_func, false);
	htmlDelete.removeEventListener("click", htmlDelete_func, false);
	htmlCancel.removeEventListener("click", htmlCancel_func, false);
}

function hideEditBox2() {
	hideKeyboard();
	dimBack.style.display = "none";
	editContainer.style.display = "none";

	editOk.removeEventListener("click", editOk_func, false);
	editCancel.removeEventListener("click", editCancel_func, false);
}

mouseID = 123456;
mousePressed = !1;
function hMouse(a) {
	function b() {
    for (var a = 0; a < mWidgets.length; a++) {
        var b = mWidgets[a];
        if (b.contains(e, f))
            return mouseTargets.push(b),
            e -= b.x,
            e += b.offsetX,
            f -= b.y,
            f += b.offsetY,
            c(b.widgets),
            !0;
    }
    return !1
	}
	function c(a) {
	    for (var b = 0, d = a.length; b < d; b++) {
	        var g = a[b];
	        if (g.contains(e, f)) {
	            e -= g.x;
	            e += g.offsetX;
	            f -= g.y;
	            f += g.offsetY;
	            mouseTargets.push(g);
	            c(a[b].widgets);
	            break
	        }
	    }
	}
	function d(a, b, c, e) {
	    e = e || !1;
	    for (var f = a.length - 1; 0 <= f; f--) {
	        var g = a[f];
	        if (g.contains(b, c, e)) {
	            b -= g.x;
	            c -= g.y;
	            b += g.offsetX;
	            c += g.offsetY;
	            dbg && log(" * On widget: " + 
	            g.widgetName + " (" + b + "x" + c + ") BLOCK: " + g.blockEvent);
	            if (d(a[f].widgets, b, c, e))
	                return !0;
	            mouseTargets.push(g);
	            return !1
	        }
	    }
	    return null 
	}
	//dbg && mEvt(a);
	if (!a)
	    return !1;
	var e = a.pageX
	  , f = a.pageY
	  , g = a.pageX
	  , h = a.pageY;
	if (0 == a.which)
	    return !1;
	if (1 != a.which)
	    return !1;
	switch (a.type) {
		case "mousedown":
		    0 < mWidgets.length ? b() || clearModals() : c(widgets);
		    for (var k = 0; k < mouseTargets.length; k++) {
		        var l = mouseTargets[k];
		        l.onDown(g, h, mouseID)
		    }
		    mousePressed = !0;
		    break;
		case "mousemove":
		    if (!mousePressed)
		        return;
		    for (k = 0; k < mouseTargets.length; k++)
		        if (l = mouseTargets[k],l.needMoveEvt)
		          l.onMove(e, f, mouseID);
		    break;
		case "mouseup":
		    mousePressed = !1;
		    for (k = 0; k < mouseTargets.length; k++)
		        mouseTargets[k].onUp(mouseID);
		    for (; mouseTargets.length; )
		        l = mouseTargets.pop();
		    break;
		case "mousewheel":
		case "DOMMouseScroll":
		    for (0 < mWidgets.length ? (d(mWidgets, e, f, !0),
		    0 == mouseTargets.length && clearModals()) : d(widgets, e, f, !0); mouseTargets.length;)
		        l = mouseTargets.pop(),
		        g = a.detail ? -40 * a.detail : a.wheelDelta,
		        l.onWheel && l.onWheel(g)
	}
	if (a.preventDefault)
	    a.preventDefault();
	else
	  return !1
}

tHash = {};
touchCount = 0;
function touchStart(a) {
	dbg && tEvt(a);
	a || (a = event);
	a.preventDefault();
	a = isDefined(a.changedTouches) ? a.changedTouches : [a];
	for(var b = 0; b < a.length; b++) {
		touchCount++;

		var c = a[b],
				d = c.pageX,
				e = c.pageX,
				f = c.pageY,
				g = c.pageY,
				h = isDefined(c.identifier) ? c.identifier : isDefined(c.pointerId) ? c.pointerId : mouseID;

		var c = function() {
			for(var a = 0; a < mWidgets.length; a++) {
				var b = mWidgets[a];
				if (b.contains(d, f))
					return tHash[h].push(b),
					d -= b.x,
					d += b.offsetX,
					f -= b.y,
					f += b.offsetY,
					k(b.widgets),
					!0
			}
			return !1
		},
		k = function(a) {
      for (var b = 0, c = a.length; b < c; b++) {
        var e = a[b];
        if (e.contains(d, f)) {
            d -= e.x;
            d += e.offsetX;
            f -= e.y;
            f += e.offsetY;
            tHash[h].push(e);
            k(a[b].widgets);
            break
        }
      }
    };
    if (!isDefined(tHash[h]))
      for (tHash[h] = [],
      	0 < mWidgets.length ? c() || clearModals() : k(widgets),
      	c = 0; c < tHash[h].length; c++)
      		tHash[h][c].onDown(e, g, h);
	}
}

function touchMove(a) {
	dbg && tEvt(a);
	a || (a = event);
	a.preventDefault();
	a = isDefined(a.changedTouches) ? a.changedTouches : [a];
	for (var b = 0; b < a.length; b++) {
	    var c = a[b]
	      , d = isDefined(c.identifier) ? c.identifier : isDefined(c.pointerId) ? c.pointerId : mouseID
	      , e = c.pageX
	      , c = c.pageY;
	    var f = tHash[d];
	    if (isDefined(f))
        for (var g = 0; g < f.length; g++) {
            var h = f[g];
            if (h.needMoveEvt)
              h.onMove(e, c, d)
        }
	}
}

function touchEnd(a) {
	dbg && tEvt(a);
	a = isDefined(a.changedTouches) ? a.changedTouches : [a];
	for (var b = 0; b < a.length; b++) {
	    var c = a[b]
	      , c = isDefined(c.identifier) ? c.identifier : isDefined(c.pointerId) ? c.pointerId : mouseID;
	    if (isDefined(tHash[c])) {
	        for (var d = 0; d < tHash[c].length; d++)
	            tHash[c][d].onUp(c);
	        for (; tHash[c].length; )
	            tHash[c].pop();
	        delete tHash[c]
	    }
	    touchCount--
	}
}

function initScreen() {
	ctx = canvas.getContext("2d");
	ctx.font = "18pt open_sans_condensedbold";
	
	drawImage = function(a, b, e) {
		ctx.drawImage(a, b, e);
	},
	drawImageCtx = function(a, b, e, f) {
		f.drawImage(a, b, e);
	};

	resize();
}

function drawLoadingScreen() {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, screenWidth, screenHeight);
	img_load = new Image;
	img_load.onload = loaded;
	img_load.src = './image/UI_SPLASH_D.png';
}

function loaded() {
	drawProgress(0);
	startLoadingTime = Date.now();
	CHK_START();
}

function CHK_START() {
	if(1 == startLoading) {
		var a = Date.now() - startLoadingTime;
		console.log("start delay: " + a + "ms");
		loadResources();
	}else {
		console.log('log error');
	}
}

function resize() {
	window.scrollTo(0, 0);
	if (null  != canvas && (isIOS && window.innerHeight != document.body.clientHeight && (document.body.style.height = window.innerHeight + "px"),
	null  == editBox || "block" != editBox.style.display) && (null  == editContainer || "block" != editContainer.style.display)) {
		screenWidth = canvas.width = window.innerWidth;
		screenHeight = canvas.height = window.innerHeight;

		ctx.imageSmoothingEnabled = !1;
 		ctx.mozImageSmoothingEnabled = !1;

 		onResize();
	}
}

function startGUI(a) {
	initGUI();
	updateCacheAll();
	lastUpdateTime = Date.now();
	requestAnimationFrame(updater);
}

function initGUI() {
	initGradients();
	mixerWidget = new MainMixer;
	selectedStrip = allStrips[0];
	
	slideOutWidget = new SlideOut;
	slideOutWidget2 = new SlideOut2;
	masterStrip = new MasterMixer;

	editStripWidget = new EDIT_STRIP;
	editWidget = new EDIT_PAGE;


	mode = E_MODE.MIX;
	setMode(mode);
	setInterval(real, 50);

	send_Data({"msgType":"REQ PLAYER INFO"});
	//setTimeout(function() {handlePlayerList()}, 2000)
}

var dddd = 0;
function emulate() {
	var length = allStrips.length;
	var d = randomOf(length - 1);
	var random = 0.9 * Math.random();
	var e = allStrips[d];

	//dddd++;
	//if(dddd < 4) {
	e.setVU(0, random, 0, random);

	vu[d] = random * -20;
	editWidget.pages[2].tick();
	//}
}

var intervalCount = 0;
function real() {
	wsBool && g_WS.send('{"msgType":"GET VU"}');

	intervalCount++;

	for(var i = 0; i < 15; i++) {
		allStrips[i].setVU(0, VUtoV(vu[i]));
	}

	allStrips[16].setVU(0, VUtoV(vu[18]), 0, VUtoV(vu[19]));//usb
	allStrips[17].setVU(0, VUtoV(vu[20]), 0, VUtoV(vu[21]));//fxr1
	allStrips[18].setVU(0, VUtoV(vu[22]), 0, VUtoV(vu[23]));//fxr2
	allStrips[19].setVU(0, VUtoV(vu[24]));//aux1
	allStrips[20].setVU(0, VUtoV(vu[25]));//aux2
	allStrips[21].setVU(0, VUtoV(vu[34]), 0, VUtoV(vu[35]));//sub
	allStrips[22].setVU(0, VUtoV(vu[28]), 0, VUtoV(vu[29]));//main

	editWidget.pages[2].tick();

	if(!(intervalCount % 99)) {
		wsBool && g_WS.send('{"msgType":"REQ WLAN LIST"}');
	}	

	(intervalCount > 1E11) && (intervalCount = 0);
}

function setVU(index, val) {
	var e = allStrips[index];
	e.setVU(0, val);
}

function sendData(a, b) {
	var strArr = a.split('.');
	var channelIndex = 0;
	var type = '';
	var val = [];
	var subType = '';

	//console.log(a, b)

	switch(strArr[0]) {
		case 'i':
			channelIndex = +strArr[1];
			break;
		case 's':
			channelIndex = 21;
			break;
		case 'p':
			channelIndex = 16;
			break;
		case 'a':
			channelIndex = 19 + parseInt(strArr[1]);
			break;
		case 'm':
			channelIndex = 22;
			break;
		case 'f':
			channelIndex = 17 + parseInt(strArr[1]);
			break;
		case 'sp':
			channelIndex = 30;
			break;
	}

	for(var i = 2; i < strArr.length; i++) {
		type += strArr[i];
	}

	val = b;
	consoleBool && console.log(channelIndex, type, val);
	sendInfo(channelIndex, type, val);
}

function getCurChannel(a) {
	var strArr = a.split('.');
	var channelIndex = 0;

	switch(strArr[0]) {
		case 'i':
			channelIndex = +strArr[1];
			break;
		case 's':
			channelIndex = 21;
			break;
		case 'p':
			channelIndex = 16;
			break;
		case 'a':
			channelIndex = 19 + parseInt(strArr[1]);
			break;
		case 'm':
			channelIndex = 22;
			break;
		case 'f':
			channelIndex = 17 + parseInt(strArr[1]);
			break;
		case 'sp':
			channelIndex = 30;
			break;
	}
	return channelIndex;
}

uframe = 0;
lastUpdateTime = lastTick = 0;
function updater() {
	var a = Util.getTime(), 
			b = (a - lastUpdateTime) / (1E3 / fps);
	lastUpdateTime = a;

	for(a = tickLine.length; a--; )
		tickLine.shift().tick(b);

	if(!(uframe % settings.drawRate)) {
		b = updateLine.length;

		for(a = 0; a < updateLine.length; a++)
			updateLine[a].update();
		updateLine.length = 0;
	}
	uframe++;
	requestAnimationFrame(updater);
}

function onResize() {
	geomAll();
	updateCacheAll();
	drawAll();
}

function updateCacheAll() {
	for(var a = 0; a< allStrips.length; a++)
		allStrips[a].cachePaint();
	slideOutWidget && slideOutWidget.cachePaint && slideOutWidget.cachePaint();
}

updateLine = [];
updateTime = 0;
function regUpdate(a) {
  "undefined" != typeof a && null  != a && (a.redrawParent && null != a.parent && (a = a.parent),
  a.enabled && -1 == fastIndexOf(updateLine, a) && updateLine.push(a))
}

tickLine = [];
function regTick(a) {
  "undefined" != typeof a && -1 == fastIndexOf(tickLine, a) && tickLine.push(a)
}

ticker = null
function setMode(a, b) {

	lastMode = mode;
	modeHistory.push(mode);
	mode = a;
	clearInterval(ticker);

	for(var c = 0; c < widgets.length; c++)
		widgets[c].hide();

	switch (a) {
		case E_MODE.MIX: 
			mixerWidget.show();
			slideOutWidget.show();
			masterStrip.show();
			break;
		case E_MODE.EDIT:
			slideOutWidget2.show();
			editStripWidget.show();
			editWidget.show();
			break;
	}
	
	geomAll();
	drawAll("MODE(" + a + ")");
}

function geomAll() {
	for (var a = 0, b = widgets.length; a < b; a++)
	    widgets[a].updateGeometry();
	a = 0;
	for (b = mWidgets.length; a < b; a++)
	    mWidgets[a].updateGeometry()
}

function drawAll(a) {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, screenWidth, screenHeight);
	for (var b = Date.now(), c = 0, d = widgets.length; c < d; c++)
	    widgets[c].update();
	for (c = 0; c < mWidgets.length; c++)
	    mWidgets[c].update();
	c = Date.now();
	log("DRAW ALL: " + (a || "?") + " IN " + (c - b) + "ms")
}

function resetParEQ(a, b) {
  setValue(a + "eq.bypass", 0);
  setValue(a + "eq.prname", "");
  setValue(a + "eq.prmod", 0);
  isDefined(b) || setValue(a + "eq.easy", 0);
  setValue(a + "eq.hpf.freq", FREQtoV(20));
  setValue(a + "eq.b1.freq", FREQtoV(100));
  setValue(a + "eq.b1.q", QtoV(1));
  setValue(a + "eq.b1.gain", .5);
  setValue(a + "eq.b2.freq", FREQtoV(1E3));
  setValue(a + "eq.b2.q", QtoV(1));
  setValue(a + "eq.b2.gain", .5);
  setValue(a + "eq.b3.freq", FREQtoV(2500));
  setValue(a + "eq.b3.q", QtoV(1));
  setValue(a + "eq.b3.gain", .5);
  setValue(a + "eq.b4.freq", FREQtoV(10E3));
  setValue(a + "eq.b4.q", QtoV(1));
  setValue(a + "eq.b4.gain", .5);
  setValue(a + "eq.lpf.freq", FREQtoV(22E3));
  setValue(a + "deesser.enabled", 0);
  setValue(a + "deesser.freq", .773310034);
  setValue(a + "deesser.threshold", .46875);
  setValue(a + "deesser.ratio", .4)
}

function clearModals() {
	for(var a = !1; mWidgets.length; )
		a = mWidgets.pop(),
		a.enabled = !1,
		a.onDelete && a.onDelete(),
		a.onClose && a.onClose(),
		a = !0;
	mWidgets.length = 0;
	a && drawAll("clearModals");
	return a;
}

function difVersionDiff() {
	/*send_Data({
			"msgType":"EQ CHANGED V2",
			"EQ":{
					"bypass":false,
					"para":[
							{"type":2,"freq":20,"gain":0,"q":0},
							{"type":0,"freq":200,"gain":0,"q":1},
							{"type":0,"freq":1000,"gain":0,"q":1},
							{"type":0,"freq":4000,"gain":0,"q":1},
							{"type":0,"freq":10000,"gain":0,"q":1},
							{"type":1,"freq":22000,"gain":0,"q":0}
					],
					"kind":0
			},
			"ch":104,
	})

	send_Data({
			"msgType":"EQ CHANGED V2",
			"EQ":{
					"bypass":false,
					"para":[
							{"type":2,"freq":20,"gain":0,"q":0},
							{"type":0,"freq":200,"gain":0,"q":1},
							{"type":0,"freq":1000,"gain":0,"q":1},
							{"type":0,"freq":4000,"gain":0,"q":1},
							{"type":0,"freq":10000,"gain":0,"q":1},
							{"type":1,"freq":22000,"gain":0,"q":0}
					],
					"kind":0
			},
			"ch":105,
	})

	send_Data({
			"msgType":"EQ CHANGED V2",
			"EQ":{
					"bypass":false,
					"para":[
							{"type":2,"freq":20,"gain":0,"q":0},
							{"type":0,"freq":200,"gain":0,"q":1},
							{"type":0,"freq":1000,"gain":0,"q":1},
							{"type":0,"freq":4000,"gain":0,"q":1},
							{"type":0,"freq":10000,"gain":0,"q":1},
							{"type":1,"freq":22000,"gain":0,"q":0}
					],
					"kind":0
			},
			"ch":100,
	})

	send_Data({
			"msgType":"EQ CHANGED V2",
			"EQ":{
					"bypass":false,
					"para":[
							{"type":2,"freq":20,"gain":0,"q":0},
							{"type":0,"freq":200,"gain":0,"q":1},
							{"type":0,"freq":1000,"gain":0,"q":1},
							{"type":0,"freq":4000,"gain":0,"q":1},
							{"type":0,"freq":10000,"gain":0,"q":1},
							{"type":1,"freq":22000,"gain":0,"q":0}
					],
					"kind":0
			},
			"ch":101,
	})

	for(var i = 0; i < 20; i++) {
		for(var j = 10; j < 18; j++) {
				send_data({
					"msgType":"BUSLINE SETTING CHANGED V2",
					"in":[i],
					"bus":[j],
					"gain":[50],
					"PFL":[false],
					"on":[false],
					"ch":[0]
				})
		}
	}*/
}