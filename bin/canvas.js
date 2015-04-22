(function (console) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Canvas = function() { };
Canvas.__name__ = ["Canvas"];
Canvas.main = function() {
	var flock = new boidz_Flock();
	var canvas = Canvas.getCanvas();
	var render = new boidz_render_canvas_CanvasRender(canvas);
	var display = new boidz_Display(render);
	var avoidCollisions = new boidz_rules_AvoidCollisions(flock,3,thx_unit_angle__$Degree_Degree_$Impl_$._new(25));
	var respectBoundaries = new boidz_rules_RespectBoundaries(0,Canvas.width,0,Canvas.height,50,thx_unit_angle__$Degree_Degree_$Impl_$._new(25));
	var waypoints = new boidz_rules_IndividualWaypoints(flock,10);
	var velocity = 3.0;
	flock.addRule(waypoints);
	flock.addRule(avoidCollisions);
	flock.addRule(respectBoundaries);
	Canvas.addBoids(flock,1000,velocity,respectBoundaries.offset);
	var canvasBoundaries = new boidz_render_canvas_CanvasBoundaries(respectBoundaries);
	var canvasWaypoints = new boidz_render_canvas_CanvasIndividualWaypoints(waypoints);
	var canvasFlock = new boidz_render_canvas_CanvasFlock(flock);
	display.addRenderable(canvasBoundaries);
	display.addRenderable(canvasWaypoints);
	display.addRenderable(canvasFlock);
	var benchmarks = [];
	var frames = [];
	var renderings = [];
	var residue = 0.0;
	var step = flock.step * 1000;
	var execution = null;
	var rendering = null;
	var frameRate = null;
	var start = performance.now();
	thx_Timer.frame(function(delta) {
		delta += residue;
		while(delta - step >= 0) {
			var time = performance.now();
			flock.update();
			benchmarks.splice(1,10);
			benchmarks.push(performance.now() - time);
			delta -= step;
		}
		residue = delta;
		var before = performance.now();
		display.render();
		renderings.splice(1,10);
		renderings.push(performance.now() - before);
		var n = performance.now();
		frames.splice(1,10);
		frames.push(n - start);
		start = n;
	});
	thx_Timer.repeat(function() {
		var average = thx_Floats.roundTo(thx_ArrayFloats.average(benchmarks),2);
		var min = thx_Floats.roundTo(thx_ArrayFloats.min(benchmarks),2);
		var max = thx_Floats.roundTo(thx_ArrayFloats.max(benchmarks),2);
		execution.set("" + average + " (" + min + " -> " + max + ")");
		average = thx_Floats.roundTo(thx_ArrayFloats.average(renderings),1);
		min = thx_Floats.roundTo(thx_ArrayFloats.min(renderings),1);
		max = thx_Floats.roundTo(thx_ArrayFloats.max(renderings),1);
		rendering.set("" + average + " (" + min + " -> " + max + ")");
		average = thx_Floats.roundTo(1000 / thx_ArrayFloats.average(frames),1);
		min = thx_Floats.roundTo(1000 / thx_ArrayFloats.min(frames),1);
		max = thx_Floats.roundTo(1000 / thx_ArrayFloats.max(frames),1);
		frameRate.set("" + average + "/s (" + min + " -> " + max + ")");
	},2000);
	canvas.addEventListener("click",function(e) {
		waypoints.addGoal(e.clientX,e.clientY);
	},false);
	var sui1 = new sui_Sui();
	var ui = sui1.folder("flock");
	ui["int"]("boids",flock.boids.length,{ min : 1, max : 3000},function(v) {
		if(v > flock.boids.length) Canvas.addBoids(flock,v - flock.boids.length,velocity,respectBoundaries.offset); else flock.boids.splice(v,flock.boids.length - v);
	});
	var randomVelocity = false;
	var updateVelocity = function() {
		var _g = 0;
		var _g1 = flock.boids;
		while(_g < _g1.length) {
			var boid = _g1[_g];
			++_g;
			boid.v = velocity * (randomVelocity?Math.random():1);
		}
	};
	ui["float"]("velocity",velocity,{ min : 0, max : 20},function(v1) {
		velocity = v1;
		updateVelocity();
	});
	ui.bool("random velocity",randomVelocity,null,function(v2) {
		randomVelocity = v2;
		updateVelocity();
	});
	ui = ui.folder("render",{ collapsible : false});
	ui.bool("render centroid",canvasFlock.renderCentroid,null,function(v3) {
		canvasFlock.renderCentroid = v3;
	});
	ui.bool("render trail",canvasFlock.renderTrail,null,function(v4) {
		canvasFlock.renderTrail = v4;
	});
	ui["int"]("trail length",canvasFlock.trailLength,{ min : 1, max : 400},function(v5) {
		canvasFlock.trailLength = v5;
	});
	ui = sui1.folder("collisions");
	ui.bool("enabled",avoidCollisions.enabled,null,function(v6) {
		avoidCollisions.enabled = v6;
	});
	ui.bool("proportional",avoidCollisions.proportional,null,function(v7) {
		avoidCollisions.proportional = v7;
	});
	ui["float"]("radius",avoidCollisions.get_radius(),{ min : 0, max : 100},function(v8) {
		avoidCollisions.set_radius(v8);
	});
	ui["float"]("max steer",avoidCollisions.maxSteer,{ min : 1, max : 90},function(v9) {
		avoidCollisions.maxSteer = v9;
	});
	ui = sui1.folder("boundaries");
	ui.bool("enabled",respectBoundaries.enabled,null,function(v10) {
		respectBoundaries.enabled = v10;
	});
	ui["float"]("offset",respectBoundaries.offset,{ min : 0, max : Math.min(Canvas.width,Canvas.height) / 2.1},function(v11) {
		respectBoundaries.offset = v11;
	});
	ui["float"]("max steer",respectBoundaries.maxSteer,{ min : 1, max : 90},function(v12) {
		respectBoundaries.maxSteer = v12;
	});
	ui = ui.folder("render",{ collapsible : false});
	ui.bool("enabled",canvasBoundaries.enabled,null,function(v13) {
		canvasBoundaries.enabled = v13;
	});
	ui = sui1.folder("waypoints");
	ui.bool("enabled",waypoints.enabled,null,function(v14) {
		waypoints.enabled = v14;
	});
	ui["float"]("radius",waypoints.radius,{ min : 1, max : 100},function(v15) {
		waypoints.radius = v15;
	});
	ui["float"]("max steer",waypoints.get_maxSteer(),{ min : 1, max : 90},function(v16) {
		waypoints.set_maxSteer(v16);
	});
	ui = ui.folder("render",{ collapsible : false});
	ui.bool("enabled",canvasWaypoints.enabled,null,function(v17) {
		canvasWaypoints.enabled = v17;
	});
	execution = sui1.label("...","execution time");
	rendering = sui1.label("...","rendering time");
	frameRate = sui1.label("...","frame rate");
	sui1.attach();
};
Canvas.getCanvas = function() {
	var canvas;
	var _this = window.document;
	canvas = _this.createElement("canvas");
	canvas.width = Canvas.width;
	canvas.height = Canvas.height;
	window.document.body.appendChild(canvas);
	return canvas;
};
Canvas.addBoids = function(flock,howMany,velocity,offset) {
	var w = Math.min(Canvas.width,Canvas.height);
	var _g = 0;
	while(_g < howMany) {
		var i = _g++;
		var b = new boidz_Boid(offset + (Canvas.width - offset * 2) * Math.random(),offset + (Canvas.height - offset * 2) * Math.random(),velocity,(function($this) {
			var $r;
			var value = Math.random() * 360;
			$r = thx_unit_angle__$Degree_Degree_$Impl_$._new(value);
			return $r;
		}(this)));
		flock.boids.push(b);
	}
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,matchedPos: function() {
		if(this.r.m == null) throw new js__$Boot_HaxeError("No string matched");
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) len = -1;
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0?s:HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) this.r.s = s;
			return b;
		} else {
			var b1 = this.match(len < 0?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len));
			if(b1) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b1;
		}
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf = new StringBuf();
		do {
			if(offset >= s.length) break; else if(!this.matchSub(s,offset)) {
				buf.add(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf.add(HxOverrides.substr(s,offset,p.pos - offset));
			buf.add(f(this));
			if(p.len == 0) {
				buf.add(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else offset = p.pos + p.len;
		} while(this.r.global);
		if(!this.r.global && offset > 0 && offset < s.length) buf.add(HxOverrides.substr(s,offset,null));
		return buf.b;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
Math.__name__ = ["Math"];
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
};
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && v.__enum__ == null || t == "function" && (v.__name__ || v.__ename__) != null;
};
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.random = function(x) {
	if(x <= 0) return 0; else return Math.floor(Math.random() * x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	b: null
	,add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
};
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
var ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null; else return js_Boot.getClass(o);
};
Type.getSuperClass = function(c) {
	return c.__super__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js_Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var boidz_Boid = function(x,y,v,d) {
	if(v == null) v = 0.0;
	if(null == d) d = thx_unit_angle__$Degree_Degree_$Impl_$._new(0.0);
	this.x = x;
	this.y = y;
	this.v = v;
	this.d = d;
};
boidz_Boid.__name__ = ["boidz","Boid"];
boidz_Boid.prototype = {
	x: null
	,y: null
	,v: null
	,d: null
	,__class__: boidz_Boid
};
var boidz_Display = function(render) {
	this.renderEngine = render;
	this.renderables = new haxe_ds_ObjectMap();
};
boidz_Display.__name__ = ["boidz","Display"];
boidz_Display.prototype = {
	renderables: null
	,renderEngine: null
	,addRenderable: function(renderable) {
		this.renderables.set(renderable,true);
	}
	,removeRenderable: function(renderable) {
		this.renderables.remove(renderable);
	}
	,render: function() {
		this.renderEngine.clear();
		var $it0 = this.renderables.keys();
		while( $it0.hasNext() ) {
			var renderable = $it0.next();
			if(renderable.enabled) {
				this.renderEngine.beforeEach();
				renderable.render(this.renderEngine);
				this.renderEngine.afterEach();
			}
		}
	}
	,__class__: boidz_Display
};
var boidz_Flock = function() {
	this.step = 0.05;
	this.x = this.y = 0;
	this.v = 0;
	this.d = thx_unit_angle__$Degree_Degree_$Impl_$._new(0);
	this.boids = [];
	this.rules = [];
};
boidz_Flock.__name__ = ["boidz","Flock"];
boidz_Flock.prototype = {
	boids: null
	,rules: null
	,x: null
	,y: null
	,v: null
	,d: null
	,step: null
	,addRule: function(rule) {
		this.rules.push(rule);
	}
	,update: function() {
		this.setFlockAverages();
		var _g = 0;
		var _g1 = this.rules;
		while(_g < _g1.length) {
			var rule = _g1[_g];
			++_g;
			if(!rule.enabled) continue;
			if(!rule.before()) continue;
			var _g2 = 0;
			var _g3 = this.boids;
			while(_g2 < _g3.length) {
				var boid = _g3[_g2];
				++_g2;
				rule.modify(boid);
			}
		}
		var _g4 = 0;
		var _g11 = this.boids;
		while(_g4 < _g11.length) {
			var boid1 = _g11[_g4];
			++_g4;
			boid1.x += boid1.v * (function($this) {
				var $r;
				var this1 = thx_unit_angle__$Radian_Radian_$Impl_$._new(boid1.d * 0.0174532925199433);
				$r = Math.cos(this1);
				return $r;
			}(this));
			boid1.y += boid1.v * (function($this) {
				var $r;
				var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(boid1.d * 0.0174532925199433);
				$r = Math.sin(this2);
				return $r;
			}(this));
		}
	}
	,setFlockAverages: function() {
		this.x = this.y = 0;
		this.v = 0;
		this.d = thx_unit_angle__$Degree_Degree_$Impl_$._new(0);
		var _g = 0;
		var _g1 = this.boids;
		while(_g < _g1.length) {
			var boid = _g1[_g];
			++_g;
			this.x += boid.x;
			this.y += boid.y;
			this.v += boid.v;
			this.d = thx_unit_angle__$Degree_Degree_$Impl_$._new(this.d + boid.d);
		}
		var l = this.boids.length;
		this.x = this.x / l;
		this.y = this.y / l;
		this.v = this.v / l;
		this.d = thx_unit_angle__$Degree_Degree_$Impl_$._new(this.d / l);
	}
	,__class__: boidz_Flock
};
var boidz_IFlockRule = function() { };
boidz_IFlockRule.__name__ = ["boidz","IFlockRule"];
boidz_IFlockRule.prototype = {
	enabled: null
	,before: null
	,modify: null
	,__class__: boidz_IFlockRule
};
var boidz_IRender = function() { };
boidz_IRender.__name__ = ["boidz","IRender"];
boidz_IRender.prototype = {
	clear: null
	,beforeEach: null
	,afterEach: null
	,__class__: boidz_IRender
};
var boidz_IRenderable = function() { };
boidz_IRenderable.__name__ = ["boidz","IRenderable"];
boidz_IRenderable.prototype = {
	enabled: null
	,render: null
	,__class__: boidz_IRenderable
};
var boidz_render_canvas_CanvasBoundaries = function(boundaries) {
	this.color = "#BBBBBB";
	this.enabled = true;
	this.boundaries = boundaries;
};
boidz_render_canvas_CanvasBoundaries.__name__ = ["boidz","render","canvas","CanvasBoundaries"];
boidz_render_canvas_CanvasBoundaries.__interfaces__ = [boidz_IRenderable];
boidz_render_canvas_CanvasBoundaries.prototype = {
	boundaries: null
	,enabled: null
	,color: null
	,render: function(render) {
		var ctx = render.ctx;
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.setLineDash([2,2]);
		ctx.moveTo(Math.round(this.boundaries.minx + this.boundaries.offset) + 0.5,Math.round(this.boundaries.miny + this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.maxx - this.boundaries.offset) + 0.5,Math.round(this.boundaries.miny + this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.maxx - this.boundaries.offset) + 0.5,Math.round(this.boundaries.maxy - this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.minx + this.boundaries.offset) + 0.5,Math.round(this.boundaries.maxy - this.boundaries.offset) + 0.5);
		ctx.lineTo(Math.round(this.boundaries.minx + this.boundaries.offset) + 0.5,Math.round(this.boundaries.miny + this.boundaries.offset) + 0.5);
		ctx.stroke();
	}
	,__class__: boidz_render_canvas_CanvasBoundaries
};
var boidz_render_canvas_CanvasFlock = function(flock,boidColor,crownColor,trailColor) {
	this.pos = 0;
	this.trailLength = 20;
	this.renderTrail = true;
	this.renderCentroid = true;
	this.enabled = true;
	if(null == boidColor) this.boidColor = "#000000"; else this.boidColor = thx_color__$RGBA_RGBA_$Impl_$.toString(boidColor);
	if(null == crownColor) this.crownColor = "rgba(255,255,255,100)"; else this.crownColor = thx_color__$RGBA_RGBA_$Impl_$.toString(crownColor);
	if(null == trailColor) this.trailColor = thx_color__$RGBA_RGBA_$Impl_$.toString(thx_color__$RGB_RGB_$Impl_$.withAlpha(thx_color__$RGB_RGB_$Impl_$.fromString(this.boidColor),20)); else this.trailColor = thx_color__$RGBA_RGBA_$Impl_$.toString(trailColor);
	this.flock = flock;
	this.map = new haxe_ds_ObjectMap();
};
boidz_render_canvas_CanvasFlock.__name__ = ["boidz","render","canvas","CanvasFlock"];
boidz_render_canvas_CanvasFlock.__interfaces__ = [boidz_IRenderable];
boidz_render_canvas_CanvasFlock.prototype = {
	flock: null
	,enabled: null
	,renderCentroid: null
	,renderTrail: null
	,trailLength: null
	,boidColor: null
	,crownColor: null
	,trailColor: null
	,map: null
	,getTrail: function(b) {
		var c = this.map.h[b.__id__];
		if(c == null) {
			var _g = [];
			var _g2 = 0;
			var _g1 = this.trailLength;
			while(_g2 < _g1) {
				var i = _g2++;
				_g.push({ x : b.x, y : b.y});
			}
			c = _g;
			this.map.set(b,c);
		}
		while(c.length < this.trailLength) c.push({ x : b.x, y : b.y});
		if(c.length > this.trailLength) c.splice(this.trailLength,c.length - this.trailLength);
		c[this.pos].x = b.x;
		c[this.pos].y = b.y;
		return c;
	}
	,pos: null
	,render: function(render) {
		var ctx = render.ctx;
		if(this.renderTrail) {
			this.pos++;
			if(this.pos >= this.trailLength) this.pos = 0;
			ctx.beginPath();
			ctx.strokeStyle = this.trailColor;
			var c;
			var s = this.pos + 1;
			if(s == this.trailLength) s = 0;
			var _g = 0;
			var _g1 = this.flock.boids;
			while(_g < _g1.length) {
				var b = _g1[_g];
				++_g;
				c = this.getTrail(b);
				if(c.length < 2) continue;
				ctx.moveTo(c[s].x,c[s].y);
				var _g3 = s;
				var _g2 = this.trailLength;
				while(_g3 < _g2) {
					var i = _g3++;
					ctx.lineTo(c[i].x,c[i].y);
				}
				if(s != 0) {
					var _g31 = 0;
					var _g21 = this.pos;
					while(_g31 < _g21) {
						var i1 = _g31++;
						ctx.lineTo(c[i1].x,c[i1].y);
					}
				}
			}
			ctx.stroke();
		}
		var _g4 = 0;
		var _g11 = this.flock.boids;
		while(_g4 < _g11.length) {
			var b1 = _g11[_g4];
			++_g4;
			ctx.beginPath();
			ctx.fillStyle = this.crownColor;
			ctx.arc(b1.x,b1.y,1.5,0,2 * Math.PI,false);
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = this.boidColor;
			ctx.arc(b1.x,b1.y,1,0,2 * Math.PI,false);
			ctx.fill();
		}
		if(this.renderCentroid) {
			ctx.beginPath();
			ctx.fillStyle = "#cc3300";
			ctx.arc(this.flock.x,this.flock.y,4,0,2 * Math.PI,false);
			ctx.fill();
		}
	}
	,__class__: boidz_render_canvas_CanvasFlock
};
var boidz_render_canvas_CanvasIndividualWaypoints = function(waypoints) {
	this.enabled = true;
	this.waypoints = waypoints;
};
boidz_render_canvas_CanvasIndividualWaypoints.__name__ = ["boidz","render","canvas","CanvasIndividualWaypoints"];
boidz_render_canvas_CanvasIndividualWaypoints.__interfaces__ = [boidz_IRenderable];
boidz_render_canvas_CanvasIndividualWaypoints.prototype = {
	waypoints: null
	,enabled: null
	,render: function(render) {
		var ctx = render.ctx;
		ctx.lineWidth = 1;
		ctx.setLineDash([2]);
		ctx.fillStyle = "rgba(0,0,0,0.2)";
		var _g1 = this.waypoints.current;
		var _g = this.waypoints.goals.length;
		while(_g1 < _g) {
			var i = _g1++;
			var goal = this.waypoints.goals[i];
			ctx.strokeStyle = "#CCCCCC";
			if(i > this.waypoints.current) {
				ctx.lineTo(goal.x,goal.y);
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.strokeStyle = "";
			ctx.arc(goal.x,goal.y,this.waypoints.radius,0,2 * Math.PI,false);
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(goal.x,goal.y);
		}
	}
	,__class__: boidz_render_canvas_CanvasIndividualWaypoints
};
var boidz_render_canvas_CanvasRender = function(canvas) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d",null);
	this.ctx.save();
};
boidz_render_canvas_CanvasRender.__name__ = ["boidz","render","canvas","CanvasRender"];
boidz_render_canvas_CanvasRender.__interfaces__ = [boidz_IRender];
boidz_render_canvas_CanvasRender.prototype = {
	canvas: null
	,ctx: null
	,clear: function() {
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	}
	,beforeEach: function() {
		this.ctx.save();
	}
	,afterEach: function() {
		this.ctx.restore();
	}
	,__class__: boidz_render_canvas_CanvasRender
};
var boidz_rules_AvoidCollisions = function(flock,radius,maxSteer) {
	if(radius == null) radius = 5;
	this.proportional = false;
	this.enabled = true;
	if(null == maxSteer) maxSteer = thx_unit_angle__$Degree_Degree_$Impl_$._new(10.0);
	this.flock = flock;
	this.set_radius(radius);
	this.maxSteer = maxSteer;
	this.a = { x : 0.0, y : 0.0};
};
boidz_rules_AvoidCollisions.__name__ = ["boidz","rules","AvoidCollisions"];
boidz_rules_AvoidCollisions.__interfaces__ = [boidz_IFlockRule];
boidz_rules_AvoidCollisions.prototype = {
	radius: null
	,flock: null
	,enabled: null
	,proportional: null
	,maxSteer: null
	,squareRadius: null
	,a: null
	,before: function() {
		return true;
	}
	,modify: function(b) {
		var dx = 0.0;
		var dy = 0.0;
		var count = 0;
		this.a.x = this.a.y = 0.0;
		var _g = 0;
		var _g1 = this.flock.boids;
		while(_g < _g1.length) {
			var n = _g1[_g];
			++_g;
			if(n == b) continue;
			dx = b.x - n.x;
			dy = b.y - n.y;
			if(dx * dx + dy * dy > this.squareRadius) continue;
			this.a.x += n.x;
			this.a.y += n.y;
			count++;
		}
		if(count == 0) return;
		this.a.x /= count;
		this.a.y /= count;
		if(this.proportional) {
			var dist = Math.sqrt((this.a.x - b.x) * (this.a.x - b.x) + (this.a.y - b.y) * (this.a.y - b.y));
			var other;
			var this1;
			var this2 = boidz_util_Steer.away(b,this.a,thx_unit_angle__$Degree_Degree_$Impl_$._new(this.maxSteer));
			var other2 = this.get_radius() - dist;
			this1 = thx_unit_angle__$Degree_Degree_$Impl_$._new(this2 * other2);
			var other1 = this.get_radius();
			other = thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 / other1);
			b.d = thx_unit_angle__$Degree_Degree_$Impl_$._new(b.d + other);
		} else {
			var other3 = boidz_util_Steer.away(b,this.a,thx_unit_angle__$Degree_Degree_$Impl_$._new(this.maxSteer));
			b.d = thx_unit_angle__$Degree_Degree_$Impl_$._new(b.d + other3);
		}
	}
	,get_radius: function() {
		return this.radius;
	}
	,set_radius: function(r) {
		this.radius = r;
		this.squareRadius = r * r;
		return r;
	}
	,__class__: boidz_rules_AvoidCollisions
};
var boidz_rules_IndividualWaypoints = function(flock,radius,maxSteer) {
	if(radius == null) radius = 10;
	this.current = 0;
	this.enabled = true;
	if(null == maxSteer) maxSteer = thx_unit_angle__$Degree_Degree_$Impl_$._new(15.0);
	this.flock = flock;
	this.radius = radius;
	this.goals = [];
	this.onStep = function(coords) {
	};
	this.onBoidStep = function(b,coords1) {
	};
	this.set_maxSteer(maxSteer);
	this.goalRule = new boidz_rules_SteerTowardGoal(0,0,maxSteer);
	this.map = new haxe_ds_ObjectMap();
};
boidz_rules_IndividualWaypoints.__name__ = ["boidz","rules","IndividualWaypoints"];
boidz_rules_IndividualWaypoints.__interfaces__ = [boidz_IFlockRule];
boidz_rules_IndividualWaypoints.prototype = {
	goals: null
	,enabled: null
	,radius: null
	,onStep: null
	,onBoidStep: null
	,flock: null
	,maxSteer: null
	,goalRule: null
	,map: null
	,current: null
	,addGoal: function(x,y) {
		this.goals.push({ x : x, y : y});
	}
	,before: function() {
		if(this.goals.length == 0) return false;
		var counter = 0;
		var _g = 0;
		var _g1 = this.flock.boids;
		while(_g < _g1.length) {
			var boid = _g1[_g];
			++_g;
			var pos = this.map.h[boid.__id__];
			if(null == pos) {
				pos = this.current;
				this.map.set(boid,pos);
				counter++;
			} else if(pos == this.current) counter++;
			var p = this.goals[pos];
			if(null == p) continue;
			var dx = p.x - boid.x;
			var dy = p.y - boid.y;
			if(dx * dx + dy * dy <= this.radius * this.radius) {
				this.onBoidStep(boid,p);
				if(pos == this.current) counter--;
				pos += 1;
				this.map.set(boid,pos);
			}
		}
		if(counter == 0) this.current++;
		return this.goals.length > 0;
	}
	,modify: function(b) {
		var pos = this.map.h[b.__id__];
		if(pos < this.goals.length) {
			var p = this.goals[pos];
			this.goalRule.x = p.x;
			this.goalRule.y = p.y;
			this.goalRule.modify(b);
		}
	}
	,updateGoalRuleForBoid: function(b) {
		this.goalRule.x = 100;
		this.goalRule.y = 200;
	}
	,get_maxSteer: function() {
		return this.maxSteer;
	}
	,set_maxSteer: function(v) {
		if(null != this.goalRule) this.goalRule.maxSteer = v;
		return this.maxSteer = v;
	}
	,__class__: boidz_rules_IndividualWaypoints
};
var boidz_rules_RespectBoundaries = function(minx,maxx,miny,maxy,offset,maxSteer) {
	if(offset == null) offset = 0.0;
	this.enabled = true;
	if(null == maxSteer) maxSteer = thx_unit_angle__$Degree_Degree_$Impl_$._new(10);
	this.minx = minx;
	this.maxx = maxx;
	this.miny = miny;
	this.maxy = maxy;
	this.offset = offset;
	this.maxSteer = maxSteer;
};
boidz_rules_RespectBoundaries.__name__ = ["boidz","rules","RespectBoundaries"];
boidz_rules_RespectBoundaries.__interfaces__ = [boidz_IFlockRule];
boidz_rules_RespectBoundaries.prototype = {
	minx: null
	,maxx: null
	,miny: null
	,maxy: null
	,offset: null
	,enabled: null
	,maxSteer: null
	,before: function() {
		return true;
	}
	,modify: function(b) {
		if(b.x < this.minx + this.offset && boidz_util_Steer.facingLeft(b.d) || b.x > this.maxx - this.offset && boidz_util_Steer.facingRight(b.d)) {
			var other = thx_unit_angle__$Degree_Degree_$Impl_$._new(this.maxSteer * (b.d < 0?-1:1));
			b.d = thx_unit_angle__$Degree_Degree_$Impl_$._new(b.d + other);
		}
		if(b.y < this.miny + this.offset && boidz_util_Steer.facingUp(b.d) || b.y > this.maxy - this.offset && boidz_util_Steer.facingDown(b.d)) {
			var other1 = thx_unit_angle__$Degree_Degree_$Impl_$._new(this.maxSteer * (b.d < 0?-1:1));
			b.d = thx_unit_angle__$Degree_Degree_$Impl_$._new(b.d + other1);
		}
	}
	,__class__: boidz_rules_RespectBoundaries
};
var boidz_rules_SteerTowardGoal = function(x,y,maxSteer) {
	this.enabled = true;
	if(null == maxSteer) maxSteer = thx_unit_angle__$Degree_Degree_$Impl_$._new(5.0);
	this.x = x;
	this.y = y;
	this.maxSteer = maxSteer;
};
boidz_rules_SteerTowardGoal.__name__ = ["boidz","rules","SteerTowardGoal"];
boidz_rules_SteerTowardGoal.__interfaces__ = [boidz_IFlockRule];
boidz_rules_SteerTowardGoal.prototype = {
	x: null
	,y: null
	,maxSteer: null
	,enabled: null
	,before: function() {
		return true;
	}
	,modify: function(b) {
		var other = boidz_util_Steer.toward(b,this,thx_unit_angle__$Degree_Degree_$Impl_$._new(this.maxSteer));
		b.d = thx_unit_angle__$Degree_Degree_$Impl_$._new(b.d + other);
	}
	,__class__: boidz_rules_SteerTowardGoal
};
var boidz_util_Steer = function() { };
boidz_util_Steer.__name__ = ["boidz","util","Steer"];
boidz_util_Steer.away = function(a,b,max) {
	var px = a.x - b.x;
	var py = a.y - b.y;
	var d = thx_unit_angle__$Degree_Degree_$Impl_$.normalizeDirection((function($this) {
		var $r;
		var this1;
		{
			var this2;
			{
				var value = Math.atan2(py,px);
				this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
			}
			this1 = thx_unit_angle__$Degree_Degree_$Impl_$._new(this2 * 57.2957795130823);
		}
		$r = thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 - a.d);
		return $r;
	}(this)));
	if(null != max) {
		var this3;
		var this4;
		{
			var value1 = Math.abs(d);
			this4 = thx_unit_angle__$Degree_Degree_$Impl_$._new(value1);
		}
		{
			var value2 = Math.min(this4,max);
			this3 = thx_unit_angle__$Degree_Degree_$Impl_$._new(value2);
		}
		d = thx_unit_angle__$Degree_Degree_$Impl_$._new(this3 * (d < 0?-1:1));
	}
	return d;
};
boidz_util_Steer.toward = function(a,b,max) {
	var px = b.x - a.x;
	var py = b.y - a.y;
	var d = thx_unit_angle__$Degree_Degree_$Impl_$.normalizeDirection((function($this) {
		var $r;
		var this1;
		{
			var this2;
			{
				var value = Math.atan2(py,px);
				this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
			}
			this1 = thx_unit_angle__$Degree_Degree_$Impl_$._new(this2 * 57.2957795130823);
		}
		$r = thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 - a.d);
		return $r;
	}(this)));
	if(null != max) {
		var this3;
		var this4;
		{
			var value1 = Math.abs(d);
			this4 = thx_unit_angle__$Degree_Degree_$Impl_$._new(value1);
		}
		{
			var value2 = Math.min(this4,max);
			this3 = thx_unit_angle__$Degree_Degree_$Impl_$._new(value2);
		}
		d = thx_unit_angle__$Degree_Degree_$Impl_$._new(this3 * (d < 0?-1:1));
	}
	return d;
};
boidz_util_Steer.converge = function(src,dst,max) {
	var delta = dst - src;
	if(Math.abs(delta) > max) return (delta < 0?-1:1) * max; else return delta;
};
boidz_util_Steer.facingRight = function(d) {
	d = thx_unit_angle__$Degree_Degree_$Impl_$.normalize(d);
	return (function($this) {
		var $r;
		var other = thx_unit_angle__$Degree_Degree_$Impl_$._new(270);
		$r = d > other;
		return $r;
	}(this)) || (function($this) {
		var $r;
		var other1 = thx_unit_angle__$Degree_Degree_$Impl_$._new(90);
		$r = d < other1;
		return $r;
	}(this));
};
boidz_util_Steer.facingLeft = function(d) {
	d = thx_unit_angle__$Degree_Degree_$Impl_$.normalize(d);
	return (function($this) {
		var $r;
		var other = thx_unit_angle__$Degree_Degree_$Impl_$._new(270);
		$r = d < other;
		return $r;
	}(this)) && (function($this) {
		var $r;
		var other1 = thx_unit_angle__$Degree_Degree_$Impl_$._new(90);
		$r = d > other1;
		return $r;
	}(this));
};
boidz_util_Steer.facingUp = function(d) {
	d = thx_unit_angle__$Degree_Degree_$Impl_$.normalize(d);
	var other = thx_unit_angle__$Degree_Degree_$Impl_$._new(180);
	return d > other;
};
boidz_util_Steer.facingDown = function(d) {
	d = thx_unit_angle__$Degree_Degree_$Impl_$.normalize(d);
	var other = thx_unit_angle__$Degree_Degree_$Impl_$._new(180);
	return d < other;
};
var dots_Detect = function() { };
dots_Detect.__name__ = ["dots","Detect"];
dots_Detect.supportsInput = function(type) {
	var i;
	var _this = window.document;
	i = _this.createElement("input");
	i.setAttribute("type",type);
	return i.type == type;
};
dots_Detect.supportsInputPlaceholder = function() {
	var i;
	var _this = window.document;
	i = _this.createElement("input");
	return Object.prototype.hasOwnProperty.call(i,"placeholder");
};
dots_Detect.supportsInputAutofocus = function() {
	var i;
	var _this = window.document;
	i = _this.createElement("input");
	return Object.prototype.hasOwnProperty.call(i,"autofocus");
};
dots_Detect.supportsCanvas = function() {
	return null != ($_=((function($this) {
		var $r;
		var _this = window.document;
		$r = _this.createElement("canvas");
		return $r;
	}(this))),$bind($_,$_.getContext));
};
dots_Detect.supportsVideo = function() {
	return null != ($_=((function($this) {
		var $r;
		var _this = window.document;
		$r = _this.createElement("video");
		return $r;
	}(this))),$bind($_,$_.canPlayType));
};
dots_Detect.supportsLocalStorage = function() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return false;
	}
};
dots_Detect.supportsWebWorkers = function() {
	return !(!window.Worker);
};
dots_Detect.supportsOffline = function() {
	return null != window.applicationCache;
};
dots_Detect.supportsGeolocation = function() {
	return Reflect.hasField(window.navigator,"geolocation");
};
dots_Detect.supportsMicrodata = function() {
	return Reflect.hasField(window.document,"getItems");
};
dots_Detect.supportsHistory = function() {
	return !!(window.history && history.pushState);
};
var dots_Dom = function() { };
dots_Dom.__name__ = ["dots","Dom"];
dots_Dom.addCss = function(css,container) {
	if(null == container) container = window.document.head;
	var style;
	var _this = window.document;
	style = _this.createElement("style");
	style.type = "text/css";
	style.appendChild(window.document.createTextNode(css));
	container.appendChild(style);
};
var dots_Html = function() { };
dots_Html.__name__ = ["dots","Html"];
dots_Html.parseNodes = function(html) {
	if(!dots_Html.pattern.match(html)) throw new js__$Boot_HaxeError("Invalid pattern \"" + html + "\"");
	var el;
	var _g = dots_Html.pattern.matched(1).toLowerCase();
	switch(_g) {
	case "tbody":case "thead":
		el = window.document.createElement("table");
		break;
	case "td":case "th":
		el = window.document.createElement("tr");
		break;
	case "tr":
		el = window.document.createElement("tbody");
		break;
	default:
		el = window.document.createElement("div");
	}
	el.innerHTML = html;
	return el.childNodes;
};
dots_Html.parseArray = function(html) {
	return dots_Html.nodeListToArray(dots_Html.parseNodes(html));
};
dots_Html.parse = function(html) {
	return dots_Html.parseNodes(html)[0];
};
dots_Html.nodeListToArray = function(list) {
	return Array.prototype.slice.call(list,0);
};
var dots_Query = function() { };
dots_Query.__name__ = ["dots","Query"];
dots_Query.first = function(selector,ctx) {
	return (ctx != null?ctx:dots_Query.doc).querySelector(selector);
};
dots_Query.list = function(selector,ctx) {
	return (ctx != null?ctx:dots_Query.doc).querySelectorAll(selector);
};
dots_Query.all = function(selector,ctx) {
	return dots_Html.nodeListToArray(dots_Query.list(selector,ctx));
};
dots_Query.getElementIndex = function(el) {
	var index = 0;
	while(null != (el = el.previousElementSibling)) index++;
	return index;
};
dots_Query.childrenOf = function(children,parent) {
	return children.filter(function(child) {
		return child.parentElement == parent;
	});
};
var haxe_StackItem = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe_StackItem.CFunction = ["CFunction",0];
haxe_StackItem.CFunction.toString = $estr;
haxe_StackItem.CFunction.__enum__ = haxe_StackItem;
haxe_StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
var haxe_CallStack = function() { };
haxe_CallStack.__name__ = ["haxe","CallStack"];
haxe_CallStack.getStack = function(e) {
	if(e == null) return [];
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			if(haxe_CallStack.wrapCallSite != null) site = haxe_CallStack.wrapCallSite(site);
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe_StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe_StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe_CallStack.makeStack(e.stack);
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe_CallStack.callStack = function() {
	try {
		throw new Error();
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		var a = haxe_CallStack.getStack(e);
		a.shift();
		return a;
	}
};
haxe_CallStack.exceptionStack = function() {
	return haxe_CallStack.getStack(haxe_CallStack.lastException);
};
haxe_CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe_CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe_CallStack.itemToString = function(b,s) {
	switch(s[1]) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = s[2];
		b.b += "module ";
		if(m == null) b.b += "null"; else b.b += "" + m;
		break;
	case 2:
		var line = s[4];
		var file = s[3];
		var s1 = s[2];
		if(s1 != null) {
			haxe_CallStack.itemToString(b,s1);
			b.b += " (";
		}
		if(file == null) b.b += "null"; else b.b += "" + file;
		b.b += " line ";
		if(line == null) b.b += "null"; else b.b += "" + line;
		if(s1 != null) b.b += ")";
		break;
	case 3:
		var meth = s[3];
		var cname = s[2];
		if(cname == null) b.b += "null"; else b.b += "" + cname;
		b.b += ".";
		if(meth == null) b.b += "null"; else b.b += "" + meth;
		break;
	case 4:
		var n = s[2];
		b.b += "local function #";
		if(n == null) b.b += "null"; else b.b += "" + n;
		break;
	}
};
haxe_CallStack.makeStack = function(s) {
	if(s == null) return []; else if(typeof(s) == "string") {
		var stack = s.split("\n");
		if(stack[0] == "Error") stack.shift();
		var m = [];
		var rie10 = new EReg("^   at ([A-Za-z0-9_. ]+) \\(([^)]+):([0-9]+):([0-9]+)\\)$","");
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			if(rie10.match(line)) {
				var path = rie10.matched(1).split(".");
				var meth = path.pop();
				var file = rie10.matched(2);
				var line1 = Std.parseInt(rie10.matched(3));
				m.push(haxe_StackItem.FilePos(meth == "Anonymous function"?haxe_StackItem.LocalFunction():meth == "Global code"?null:haxe_StackItem.Method(path.join("."),meth),file,line1));
			} else m.push(haxe_StackItem.Module(StringTools.trim(line)));
		}
		return m;
	} else return s;
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	get: null
	,set: null
	,exists: null
	,keys: null
	,__class__: haxe_IMap
};
var haxe_Log = function() { };
haxe_Log.__name__ = ["haxe","Log"];
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
haxe_ds_IntMap.__name__ = ["haxe","ds","IntMap"];
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	h: null
	,set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe_ds_ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.prototype = {
	h: null
	,set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe_ds_ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,get: function(key) {
		return this.h[key.__id__];
	}
	,exists: function(key) {
		return this.h.__keys__[key.__id__] != null;
	}
	,remove: function(key) {
		var id = key.__id__;
		if(this.h.__keys__[id] == null) return false;
		delete(this.h[id]);
		delete(this.h.__keys__[id]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds_Option = { __ename__ : ["haxe","ds","Option"], __constructs__ : ["Some","None"] };
haxe_ds_Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe_ds_Option; $x.toString = $estr; return $x; };
haxe_ds_Option.None = ["None",1];
haxe_ds_Option.None.toString = $estr;
haxe_ds_Option.None.__enum__ = haxe_ds_Option;
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	h: null
	,rh: null
	,set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,__class__: haxe_ds_StringMap
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	val: null
	,__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = ["js","Boot"];
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js_Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	if(typeof window != "undefined") return window[name]; else return global[name];
};
var sui_Sui = function() {
	this.grid = new sui_components_Grid();
	this.el = this.grid.el;
};
sui_Sui.__name__ = ["sui","Sui"];
sui_Sui.createArray = function(defaultValue,defaultElementValue,createControl,options) {
	return new sui_controls_ArrayControl((function($this) {
		var $r;
		var t;
		{
			var _0 = defaultValue;
			if(null == _0) t = null; else t = _0;
		}
		$r = t != null?t:[];
		return $r;
	}(this)),defaultElementValue,createControl,options);
};
sui_Sui.createBool = function(defaultValue,options) {
	if(defaultValue == null) defaultValue = false;
	return new sui_controls_BoolControl(defaultValue,options);
};
sui_Sui.createColor = function(defaultValue,options) {
	if(defaultValue == null) defaultValue = "#AA0000";
	return new sui_controls_ColorControl(defaultValue,options);
};
sui_Sui.createDate = function(defaultValue,options) {
	if(null == defaultValue) defaultValue = new Date();
	{
		var _g;
		var t;
		var _0 = options;
		var _1;
		if(null == _0) t = null; else if(null == (_1 = _0.listonly)) t = null; else t = _1;
		if(t != null) _g = t; else _g = false;
		var _g1;
		var t1;
		var _01 = options;
		var _11;
		if(null == _01) t1 = null; else if(null == (_11 = _01.kind)) t1 = null; else t1 = _11;
		if(t1 != null) _g1 = t1; else _g1 = sui_controls_DateKind.DateOnly;
		if(_g != null) switch(_g) {
		case true:
			return new sui_controls_DateSelectControl(defaultValue,options);
		default:
			switch(_g1[1]) {
			case 1:
				return new sui_controls_DateTimeControl(defaultValue,options);
			default:
				return new sui_controls_DateControl(defaultValue,options);
			}
		} else switch(_g1[1]) {
		case 1:
			return new sui_controls_DateTimeControl(defaultValue,options);
		default:
			return new sui_controls_DateControl(defaultValue,options);
		}
	}
};
sui_Sui.collapsible = function(label,collapsed,attachTo,position) {
	if(collapsed == null) collapsed = false;
	var sui1 = new sui_Sui();
	var folder = sui1.folder((function($this) {
		var $r;
		var t;
		{
			var _0 = label;
			if(null == _0) t = null; else t = _0;
		}
		$r = t != null?t:"";
		return $r;
	}(this)),{ collapsible : true, collapsed : collapsed});
	sui1.attach(attachTo,position);
	return folder;
};
sui_Sui.createFloat = function(defaultValue,options) {
	if(defaultValue == null) defaultValue = 0.0;
	{
		var _g;
		var t;
		var _0 = options;
		var _1;
		if(null == _0) t = null; else if(null == (_1 = _0.listonly)) t = null; else t = _1;
		if(t != null) _g = t; else _g = false;
		var _g1;
		var t1;
		var _01 = options;
		var _11;
		if(null == _01) t1 = null; else if(null == (_11 = _01.kind)) t1 = null; else t1 = _11;
		if(t1 != null) _g1 = t1; else _g1 = sui_controls_FloatKind.FloatNumber;
		if(_g != null) switch(_g) {
		case true:
			return new sui_controls_NumberSelectControl(defaultValue,options);
		default:
			switch(_g1[1]) {
			case 1:
				return new sui_controls_TimeControl(defaultValue,options);
			default:
				if(null != options && options.min != null && options.max != null) return new sui_controls_FloatRangeControl(defaultValue,options); else return new sui_controls_FloatControl(defaultValue,options);
			}
		} else switch(_g1[1]) {
		case 1:
			return new sui_controls_TimeControl(defaultValue,options);
		default:
			if(null != options && options.min != null && options.max != null) return new sui_controls_FloatRangeControl(defaultValue,options); else return new sui_controls_FloatControl(defaultValue,options);
		}
	}
};
sui_Sui.createInt = function(defaultValue,options) {
	if(defaultValue == null) defaultValue = 0;
	if((function($this) {
		var $r;
		var t;
		{
			var _0 = options;
			var _1;
			if(null == _0) t = null; else if(null == (_1 = _0.listonly)) t = null; else t = _1;
		}
		$r = t != null?t:false;
		return $r;
	}(this))) return new sui_controls_NumberSelectControl(defaultValue,options); else if(null != options && options.min != null && options.max != null) return new sui_controls_IntRangeControl(defaultValue,options); else return new sui_controls_IntControl(defaultValue,options);
};
sui_Sui.createIntMap = function(defaultValue,createKeyControl,createValueControl,options) {
	return new sui_controls_MapControl(defaultValue,function() {
		return new haxe_ds_IntMap();
	},createKeyControl,createValueControl,options);
};
sui_Sui.createLabel = function(defaultValue,label,callback) {
	if(defaultValue == null) defaultValue = "";
	return new sui_controls_LabelControl(defaultValue);
};
sui_Sui.createObjectMap = function(defaultValue,createKeyControl,createValueControl,options) {
	return new sui_controls_MapControl(defaultValue,function() {
		return new haxe_ds_ObjectMap();
	},createKeyControl,createValueControl,options);
};
sui_Sui.createStringMap = function(defaultValue,createKeyControl,createValueControl,options) {
	return new sui_controls_MapControl(defaultValue,function() {
		return new haxe_ds_StringMap();
	},createKeyControl,createValueControl,options);
};
sui_Sui.createText = function(defaultValue,options) {
	if(defaultValue == null) defaultValue = "";
	{
		var _g;
		var t;
		var _0 = options;
		var _1;
		if(null == _0) t = null; else if(null == (_1 = _0.listonly)) t = null; else t = _1;
		if(t != null) _g = t; else _g = false;
		var _g1;
		var t1;
		var _01 = options;
		var _11;
		if(null == _01) t1 = null; else if(null == (_11 = _01.kind)) t1 = null; else t1 = _11;
		if(t1 != null) _g1 = t1; else _g1 = sui_controls_TextKind.PlainText;
		if(_g != null) switch(_g) {
		case true:
			return new sui_controls_TextSelectControl(defaultValue,options);
		default:
			switch(_g1[1]) {
			case 0:
				return new sui_controls_EmailControl(defaultValue,options);
			case 1:
				return new sui_controls_PasswordControl(defaultValue,options);
			case 3:
				return new sui_controls_TelControl(defaultValue,options);
			case 2:
				return new sui_controls_SearchControl(defaultValue,options);
			case 5:
				return new sui_controls_UrlControl(defaultValue,options);
			default:
				return new sui_controls_TextControl(defaultValue,options);
			}
		} else switch(_g1[1]) {
		case 0:
			return new sui_controls_EmailControl(defaultValue,options);
		case 1:
			return new sui_controls_PasswordControl(defaultValue,options);
		case 3:
			return new sui_controls_TelControl(defaultValue,options);
		case 2:
			return new sui_controls_SearchControl(defaultValue,options);
		case 5:
			return new sui_controls_UrlControl(defaultValue,options);
		default:
			return new sui_controls_TextControl(defaultValue,options);
		}
	}
};
sui_Sui.createTrigger = function(actionLabel,options) {
	return new sui_controls_TriggerControl(actionLabel,options);
};
sui_Sui.prototype = {
	el: null
	,grid: null
	,array: function(label,defaultValue,defaultElementValue,createControl,options,callback) {
		return this.control(label,sui_Sui.createArray(defaultValue,defaultElementValue,createControl,options),callback);
	}
	,bool: function(label,defaultValue,options,callback) {
		if(defaultValue == null) defaultValue = false;
		return this.control(label,sui_Sui.createBool(defaultValue,options),callback);
	}
	,color: function(label,defaultValue,options,callback) {
		if(defaultValue == null) defaultValue = "#AA0000";
		return this.control(label,sui_Sui.createColor(defaultValue,options),callback);
	}
	,date: function(label,defaultValue,options,callback) {
		return this.control(label,sui_Sui.createDate(defaultValue,options),callback);
	}
	,'float': function(label,defaultValue,options,callback) {
		if(defaultValue == null) defaultValue = 0.0;
		return this.control(label,sui_Sui.createFloat(defaultValue,options),callback);
	}
	,folder: function(label,options) {
		var collapsible;
		var t;
		var _0 = options;
		var _1;
		if(null == _0) t = null; else if(null == (_1 = _0.collapsible)) t = null; else t = _1;
		if(t != null) collapsible = t; else collapsible = true;
		var collapsed;
		var t1;
		var _01 = options;
		var _11;
		if(null == _01) t1 = null; else if(null == (_11 = _01.collapsed)) t1 = null; else t1 = _11;
		if(t1 != null) collapsed = t1; else collapsed = false;
		var sui1 = new sui_Sui();
		var header = { el : dots_Html.parseNodes("<header class=\"sui-folder\">\n<i class=\"sui-trigger-toggle sui-icon sui-icon-collapse\"></i>\n" + label + "</header>")[0]};
		var trigger = dots_Query.first(".sui-trigger-toggle",header.el);
		if(collapsible) {
			header.el.classList.add("sui-collapsible");
			if(collapsed) sui1.grid.el.style.display = "none";
			var collapse = thx_stream_EmitterBools.negate(thx_stream_dom_Dom.streamEvent(header.el,"click",false).map(function(_) {
				return collapsed = !collapsed;
			}));
			collapse.subscribe(thx_Functions1.join(thx_stream_dom_Dom.subscribeToggleVisibility(sui1.grid.el),thx_stream_dom_Dom.subscribeSwapClass(trigger,"sui-icon-collapse","sui-icon-expand")));
		} else trigger.style.display = "none";
		sui1.grid.el.classList.add("sui-grid-inner");
		this.grid.add(sui_components_CellContent.VerticalPair(header,sui1.grid));
		return sui1;
	}
	,'int': function(label,defaultValue,options,callback) {
		if(defaultValue == null) defaultValue = 0;
		return this.control(label,sui_Sui.createInt(defaultValue,options),callback);
	}
	,intMap: function(label,defaultValue,createValueControl,options,callback) {
		return this.control(label,sui_Sui.createIntMap(defaultValue,function(v) {
			return sui_Sui.createInt(v);
		},createValueControl,options),callback);
	}
	,label: function(defaultValue,label,callback) {
		if(defaultValue == null) defaultValue = "";
		return this.control(label,sui_Sui.createLabel(defaultValue),callback);
	}
	,objectMap: function(label,defaultValue,createKeyControl,createValueControl,options,callback) {
		return this.control(label,sui_Sui.createObjectMap(defaultValue,createKeyControl,createValueControl,options),callback);
	}
	,stringMap: function(label,defaultValue,createValueControl,options,callback) {
		return this.control(label,sui_Sui.createStringMap(defaultValue,function(v) {
			return sui_Sui.createText(v);
		},createValueControl,options),callback);
	}
	,text: function(label,defaultValue,options,callback) {
		if(defaultValue == null) defaultValue = "";
		return this.control(label,sui_Sui.createText(defaultValue,options),callback);
	}
	,trigger: function(actionLabel,label,options,callback) {
		return this.control(label,new sui_controls_TriggerControl(actionLabel,options),function(_) {
			callback();
		});
	}
	,control: function(label,control,callback) {
		this.grid.add(null == label?sui_components_CellContent.Single(control):sui_components_CellContent.HorizontalPair(new sui_controls_LabelControl(label),control));
		control.streams.value.subscribe(callback);
		return control;
	}
	,attach: function(el,anchor) {
		if(null == el) el = window.document.body;
		this.el.classList.add((function($this) {
			var $r;
			var t;
			{
				var _0 = anchor;
				if(null == _0) t = null; else t = _0;
			}
			$r = t != null?t:el == window.document.body?"sui-top-right":"sui-append";
			return $r;
		}(this)));
		el.appendChild(this.el);
	}
	,__class__: sui_Sui
};
var sui_components_Grid = function() {
	this.el = dots_Html.parseNodes("<table class=\"sui-grid\"></table>")[0];
};
sui_components_Grid.__name__ = ["sui","components","Grid"];
sui_components_Grid.prototype = {
	el: null
	,add: function(cell) {
		var _g = this;
		switch(cell[1]) {
		case 0:
			var control = cell[2];
			var container = dots_Html.parseNodes("<tr class=\"sui-single\"><td colspan=\"2\"></td></tr>")[0];
			dots_Query.first("td",container).appendChild(control.el);
			this.el.appendChild(container);
			break;
		case 2:
			var right = cell[3];
			var left = cell[2];
			var container1 = dots_Html.parseNodes("<tr class=\"sui-horizontal\"><td class=\"sui-left\"></td><td class=\"sui-right\"></td></tr>")[0];
			dots_Query.first(".sui-left",container1).appendChild(left.el);
			dots_Query.first(".sui-right",container1).appendChild(right.el);
			this.el.appendChild(container1);
			break;
		case 1:
			var bottom = cell[3];
			var top = cell[2];
			var containers = dots_Html.nodeListToArray(dots_Html.parseNodes("<tr class=\"sui-vertical sui-top\"><td colspan=\"2\"></td></tr><tr class=\"sui-vertical sui-bottom\"><td colspan=\"2\"></td></tr>"));
			dots_Query.first("td",containers[0]).appendChild(top.el);
			dots_Query.first("td",containers[1]).appendChild(bottom.el);
			containers.map(function(_) {
				return _g.el.appendChild(_);
			});
			break;
		}
	}
	,__class__: sui_components_Grid
};
var sui_components_CellContent = { __ename__ : ["sui","components","CellContent"], __constructs__ : ["Single","VerticalPair","HorizontalPair"] };
sui_components_CellContent.Single = function(control) { var $x = ["Single",0,control]; $x.__enum__ = sui_components_CellContent; $x.toString = $estr; return $x; };
sui_components_CellContent.VerticalPair = function(top,bottom) { var $x = ["VerticalPair",1,top,bottom]; $x.__enum__ = sui_components_CellContent; $x.toString = $estr; return $x; };
sui_components_CellContent.HorizontalPair = function(left,right) { var $x = ["HorizontalPair",2,left,right]; $x.__enum__ = sui_components_CellContent; $x.toString = $estr; return $x; };
var sui_controls_IControl = function() { };
sui_controls_IControl.__name__ = ["sui","controls","IControl"];
sui_controls_IControl.prototype = {
	el: null
	,defaultValue: null
	,streams: null
	,set: null
	,get: null
	,isEnabled: null
	,isFocused: null
	,disable: null
	,enable: null
	,focus: null
	,blur: null
	,reset: null
	,__class__: sui_controls_IControl
};
var sui_controls_ArrayControl = function(defaultValue,defaultElementValue,createElementControl,options) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-array\">\n<ul class=\"sui-array\"></ul>\n<div class=\"sui-array-add\"><i class=\"sui-icon sui-icon-add\"></i></div>\n</div>";
	var t;
	var _0 = options;
	if(null == _0) t = null; else t = _0;
	if(t != null) options = t; else options = { };
	this.defaultValue = defaultValue;
	this.defaultElementValue = defaultElementValue;
	this.createElementControl = createElementControl;
	this.elements = [];
	this.length = 0;
	this.values = new sui_controls_ControlValues(defaultValue);
	this.streams = new sui_controls_ControlStreams(this.values.value,this.values.focused.debounce(0),this.values.enabled);
	this.el = dots_Html.parseNodes(template)[0];
	this.ul = dots_Query.first("ul",this.el);
	this.addButton = dots_Query.first(".sui-icon-add",this.el);
	thx_stream_dom_Dom.streamEvent(this.addButton,"click",false).subscribe(function(_) {
		_g.addControl(defaultElementValue);
	});
	this.values.enabled.subscribe(function(v) {
		if(v) _g.el.classList.add("sui-disabled"); else _g.el.classList.remove("sui-disabled");
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	thx_stream_EmitterBools.negate(this.values.enabled).subscribe(thx_stream_dom_Dom.subscribeToggleClass(this.el,"sui-disabled"));
	this.values.enabled.subscribe(function(v2) {
		_g.elements.map(function(_1) {
			if(v2) _1.control.enable(); else _1.control.disable();
			return;
		});
	});
	this.setValue(defaultValue);
	this.reset();
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
};
sui_controls_ArrayControl.__name__ = ["sui","controls","ArrayControl"];
sui_controls_ArrayControl.__interfaces__ = [sui_controls_IControl];
sui_controls_ArrayControl.prototype = {
	el: null
	,ul: null
	,addButton: null
	,defaultValue: null
	,defaultElementValue: null
	,streams: null
	,createElementControl: null
	,length: null
	,values: null
	,elements: null
	,addControl: function(value) {
		var _g = this;
		var o = { control : this.createElementControl(value), el : dots_Html.parseNodes("<li class=\"sui-array-item\">\n    <div class=\"sui-move\"><i class=\"sui-icon-mini sui-icon-up\"></i><i class=\"sui-icon-mini sui-icon-down\"></i></div>\n    <div class=\"sui-control-container\"></div>\n    <div class=\"sui-remove\"><i class=\"sui-icon sui-icon-remove\"></i></div>\n</li>")[0], index : this.length++};
		this.ul.appendChild(o.el);
		var removeElement = dots_Query.first(".sui-icon-remove",o.el);
		var upElement = dots_Query.first(".sui-icon-up",o.el);
		var downElement = dots_Query.first(".sui-icon-down",o.el);
		var controlContainer = dots_Query.first(".sui-control-container",o.el);
		controlContainer.appendChild(o.control.el);
		thx_stream_dom_Dom.streamEvent(removeElement,"click",false).subscribe(function(_) {
			_g.ul.removeChild(o.el);
			_g.elements.splice(o.index,1);
			var _g2 = o.index;
			var _g1 = _g.elements.length;
			while(_g2 < _g1) {
				var i = _g2++;
				_g.elements[i].index--;
			}
			_g.length--;
			_g.updateValue();
		});
		this.elements.push(o);
		o.control.streams.value.subscribe(function(_1) {
			_g.updateValue();
		});
		o.control.streams.focused.subscribe(thx_stream_dom_Dom.subscribeToggleClass(o.el,"sui-focus"));
		o.control.streams.focused.feed(this.values.focused);
		thx_stream_dom_Dom.streamEvent(upElement,"click",false).subscribe(function(_2) {
			var pos = o.index;
			var prev = _g.elements[pos - 1];
			_g.elements[pos] = prev;
			_g.elements[pos - 1] = o;
			prev.index = pos;
			o.index = pos - 1;
			_g.ul.insertBefore(o.el,prev.el);
			_g.updateValue();
		});
		thx_stream_dom_Dom.streamEvent(downElement,"click",false).subscribe(function(_3) {
			var pos1 = o.index;
			var next = _g.elements[pos1 + 1];
			_g.elements[pos1] = next;
			_g.elements[pos1 + 1] = o;
			next.index = pos1;
			o.index = pos1 + 1;
			_g.ul.insertBefore(next.el,o.el);
			_g.updateValue();
		});
	}
	,setValue: function(v) {
		var _g = this;
		v.map(function(_) {
			_g.addControl(_);
			return;
		});
	}
	,getValue: function() {
		return this.elements.map(function(_) {
			return _.control.get();
		});
	}
	,updateValue: function() {
		this.values.value.set(this.getValue());
	}
	,set: function(v) {
		this.clear();
		this.setValue(v);
		this.values.value.set(v);
	}
	,get: function() {
		return this.values.value.get();
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
		if(this.elements.length > 0) thx_Arrays.last(this.elements).control.focus();
	}
	,blur: function() {
		var el = window.document.activeElement;
		(function(_) {
			if(null == _) null; else el.blur();
			return;
		})(thx_Arrays.first(this.elements.filter(function(_1) {
			return _1.control.el == el;
		})));
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,clear: function() {
		var _g = this;
		this.length = 0;
		this.elements.map(function(item) {
			_g.ul.removeChild(item.el);
		});
		this.elements = [];
	}
	,__class__: sui_controls_ArrayControl
};
var sui_controls_SingleInputControl = function(defaultValue,event,name,type,options) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-" + name + "\"><input type=\"" + type + "\"/></div>";
	if(null == options) options = { };
	if(null == options.allownull) options.allownull = true;
	this.defaultValue = defaultValue;
	this.values = new sui_controls_ControlValues(defaultValue);
	this.streams = new sui_controls_ControlStreams(this.values.value,this.values.focused,this.values.enabled);
	this.el = dots_Html.parseNodes(template)[0];
	this.input = dots_Query.first("input",this.el);
	this.values.enabled.subscribe(function(v) {
		if(v) {
			_g.el.classList.add("sui-disabled");
			_g.input.removeAttribute("disabled");
		} else {
			_g.el.classList.remove("sui-disabled");
			_g.input.setAttribute("disabled","disabled");
		}
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	this.setInput(defaultValue);
	thx_stream_dom_Dom.streamFocus(this.input).feed(this.values.focused);
	thx_stream_dom_Dom.streamEvent(this.input,event).map(function(_) {
		return _g.getInput();
	}).feed(this.values.value);
	if(!options.allownull) this.input.setAttribute("required","required");
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
};
sui_controls_SingleInputControl.__name__ = ["sui","controls","SingleInputControl"];
sui_controls_SingleInputControl.__interfaces__ = [sui_controls_IControl];
sui_controls_SingleInputControl.prototype = {
	el: null
	,input: null
	,defaultValue: null
	,streams: null
	,values: null
	,setInput: function(v) {
		throw new thx_error_AbstractMethod({ fileName : "SingleInputControl.hx", lineNumber : 64, className : "sui.controls.SingleInputControl", methodName : "setInput"});
	}
	,getInput: function() {
		throw new thx_error_AbstractMethod({ fileName : "SingleInputControl.hx", lineNumber : 67, className : "sui.controls.SingleInputControl", methodName : "getInput"});
	}
	,set: function(v) {
		this.setInput(v);
		this.values.value.set(v);
	}
	,get: function() {
		return this.values.value.get();
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
		this.input.focus();
	}
	,blur: function() {
		this.input.blur();
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,__class__: sui_controls_SingleInputControl
};
var sui_controls_BaseDateControl = function(value,name,type,dateToString,options) {
	if(null == options) options = { };
	this.dateToString = dateToString;
	sui_controls_SingleInputControl.call(this,value,"input",name,type,options);
	if(null != options.autocomplete) this.input.setAttribute("autocomplete",options.autocomplete?"on":"off");
	if(null != options.min) this.input.setAttribute("min",dateToString(options.min));
	if(null != options.max) this.input.setAttribute("max",dateToString(options.max));
	if(null != options.list) new sui_controls_DataList(this.el,options.list.map(function(o) {
		return { label : o.label, value : dateToString(o.value)};
	})).applyTo(this.input); else if(null != options.values) new sui_controls_DataList(this.el,options.values.map(function(o1) {
		return { label : HxOverrides.dateStr(o1), value : dateToString(o1)};
	})).applyTo(this.input);
};
sui_controls_BaseDateControl.__name__ = ["sui","controls","BaseDateControl"];
sui_controls_BaseDateControl.toRFCDate = function(date) {
	var y = date.getFullYear();
	var m = StringTools.lpad("" + (date.getMonth() + 1),"0",2);
	var d = StringTools.lpad("" + date.getDate(),"0",2);
	return "" + y + "-" + m + "-" + d;
};
sui_controls_BaseDateControl.toRFCDateTime = function(date) {
	var d = sui_controls_BaseDateControl.toRFCDate(date);
	var hh = StringTools.lpad("" + date.getHours(),"0",2);
	var mm = StringTools.lpad("" + date.getMinutes(),"0",2);
	var ss = StringTools.lpad("" + date.getSeconds(),"0",2);
	return "" + d + "T" + hh + ":" + mm + ":" + ss;
};
sui_controls_BaseDateControl.toRFCDateTimeNoSeconds = function(date) {
	var d = sui_controls_BaseDateControl.toRFCDate(date);
	var hh = StringTools.lpad("" + date.getHours(),"0",2);
	var mm = StringTools.lpad("" + date.getMinutes(),"0",2);
	return "" + d + "T" + hh + ":" + mm + ":00";
};
sui_controls_BaseDateControl.fromRFC = function(date) {
	var dp = date.split("T")[0];
	var dt;
	var t1;
	var _0 = date;
	var _1;
	var _2;
	if(null == _0) t1 = null; else if(null == (_1 = _0.split("T"))) t1 = null; else if(null == (_2 = _1[1])) t1 = null; else t1 = _2;
	if(t1 != null) dt = t1; else dt = "00:00:00";
	var p = dp.split("-");
	var y = Std.parseInt(p[0]);
	var m = Std.parseInt(p[1]) - 1;
	var d = Std.parseInt(p[2]);
	var t = dt.split(":");
	var hh = Std.parseInt(t[0]);
	var mm = Std.parseInt(t[1]);
	var ss = Std.parseInt(t[2]);
	return new Date(y,m,d,hh,mm,ss);
};
sui_controls_BaseDateControl.__super__ = sui_controls_SingleInputControl;
sui_controls_BaseDateControl.prototype = $extend(sui_controls_SingleInputControl.prototype,{
	dateToString: null
	,setInput: function(v) {
		this.input.value = this.dateToString(v);
	}
	,getInput: function() {
		if(thx_Strings.isEmpty(this.input.value)) return null; else return sui_controls_BaseDateControl.fromRFC(this.input.value);
	}
	,__class__: sui_controls_BaseDateControl
});
var sui_controls_BaseTextControl = function(value,name,type,options) {
	if(null == options) options = { };
	sui_controls_SingleInputControl.call(this,value,"input",name,type,options);
	if(null != options.maxlength) this.input.setAttribute("maxlength","" + options.maxlength);
	if(null != options.autocomplete) this.input.setAttribute("autocomplete",options.autocomplete?"on":"off");
	if(null != options.pattern) this.input.setAttribute("pattern","" + options.pattern);
	if(null != options.placeholder) this.input.setAttribute("placeholder","" + options.placeholder);
	if(null != options.list) new sui_controls_DataList(this.el,options.list).applyTo(this.input); else if(null != options.values) sui_controls_DataList.fromArray(this.el,options.values).applyTo(this.input);
};
sui_controls_BaseTextControl.__name__ = ["sui","controls","BaseTextControl"];
sui_controls_BaseTextControl.__super__ = sui_controls_SingleInputControl;
sui_controls_BaseTextControl.prototype = $extend(sui_controls_SingleInputControl.prototype,{
	setInput: function(v) {
		this.input.value = v;
	}
	,getInput: function() {
		return this.input.value;
	}
	,__class__: sui_controls_BaseTextControl
});
var sui_controls_BoolControl = function(value,options) {
	sui_controls_SingleInputControl.call(this,value,"change","bool","checkbox",options);
};
sui_controls_BoolControl.__name__ = ["sui","controls","BoolControl"];
sui_controls_BoolControl.__super__ = sui_controls_SingleInputControl;
sui_controls_BoolControl.prototype = $extend(sui_controls_SingleInputControl.prototype,{
	setInput: function(v) {
		this.input.checked = v;
	}
	,getInput: function() {
		return this.input.checked;
	}
	,__class__: sui_controls_BoolControl
});
var sui_controls_DoubleInputControl = function(defaultValue,name,event1,type1,event2,type2,filter,options) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-double sui-type-" + name + "\"><input class=\"input1\" type=\"" + type1 + "\"/><input class=\"input2\" type=\"" + type2 + "\"/></div>";
	if(null == options) options = { };
	if(null == options.allownull) options.allownull = true;
	this.defaultValue = defaultValue;
	this.values = new sui_controls_ControlValues(defaultValue);
	this.streams = new sui_controls_ControlStreams(this.values.value,this.values.focused,this.values.enabled);
	this.el = dots_Html.parseNodes(template)[0];
	this.input1 = dots_Query.first(".input1",this.el);
	this.input2 = dots_Query.first(".input2",this.el);
	this.values.enabled.subscribe(function(v) {
		if(v) {
			_g.el.classList.add("sui-disabled");
			_g.input1.removeAttribute("disabled");
			_g.input2.removeAttribute("disabled");
		} else {
			_g.el.classList.remove("sui-disabled");
			_g.input1.setAttribute("disabled","disabled");
			_g.input2.setAttribute("disabled","disabled");
		}
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	thx_stream_dom_Dom.streamFocus(this.input1).merge(thx_stream_dom_Dom.streamFocus(this.input2)).feed(this.values.focused);
	thx_stream_dom_Dom.streamEvent(this.input1,event1).map(function(_) {
		return _g.getInput1();
	}).subscribe(function(v2) {
		_g.setInput2(v2);
		_g.values.value.set(v2);
	});
	thx_stream_dom_Dom.streamEvent(this.input2,event2).map(function(_1) {
		return _g.getInput2();
	}).filter(filter).subscribe(function(v3) {
		_g.setInput1(v3);
		_g.values.value.set(v3);
	});
	if(!options.allownull) {
		this.input1.setAttribute("required","required");
		this.input2.setAttribute("required","required");
	}
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
	if(!dots_Detect.supportsInput(type1)) this.input1.style.display = "none";
};
sui_controls_DoubleInputControl.__name__ = ["sui","controls","DoubleInputControl"];
sui_controls_DoubleInputControl.__interfaces__ = [sui_controls_IControl];
sui_controls_DoubleInputControl.prototype = {
	el: null
	,input1: null
	,input2: null
	,defaultValue: null
	,streams: null
	,values: null
	,setInputs: function(v) {
		this.setInput1(v);
		this.setInput2(v);
	}
	,setInput1: function(v) {
		throw new thx_error_AbstractMethod({ fileName : "DoubleInputControl.hx", lineNumber : 89, className : "sui.controls.DoubleInputControl", methodName : "setInput1"});
	}
	,setInput2: function(v) {
		throw new thx_error_AbstractMethod({ fileName : "DoubleInputControl.hx", lineNumber : 92, className : "sui.controls.DoubleInputControl", methodName : "setInput2"});
	}
	,getInput1: function() {
		throw new thx_error_AbstractMethod({ fileName : "DoubleInputControl.hx", lineNumber : 95, className : "sui.controls.DoubleInputControl", methodName : "getInput1"});
	}
	,getInput2: function() {
		throw new thx_error_AbstractMethod({ fileName : "DoubleInputControl.hx", lineNumber : 98, className : "sui.controls.DoubleInputControl", methodName : "getInput2"});
	}
	,set: function(v) {
		this.setInputs(v);
		this.values.value.set(v);
	}
	,get: function() {
		return this.values.value.get();
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
		this.input2.focus();
	}
	,blur: function() {
		var el = window.document.activeElement;
		if(el == this.input1 || el == this.input2) el.blur();
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,__class__: sui_controls_DoubleInputControl
};
var sui_controls_ColorControl = function(value,options) {
	if(null == options) options = { };
	sui_controls_DoubleInputControl.call(this,value,"color","input","color","input","text",($_=sui_controls_ColorControl.PATTERN,$bind($_,$_.match)),options);
	if(null != options.autocomplete) this.input2.setAttribute("autocomplete",options.autocomplete?"on":"off");
	if(null != options.list) new sui_controls_DataList(this.el,options.list).applyTo(this.input1).applyTo(this.input2); else if(null != options.values) sui_controls_DataList.fromArray(this.el,options.values).applyTo(this.input1).applyTo(this.input2);
	this.setInputs(value);
};
sui_controls_ColorControl.__name__ = ["sui","controls","ColorControl"];
sui_controls_ColorControl.__super__ = sui_controls_DoubleInputControl;
sui_controls_ColorControl.prototype = $extend(sui_controls_DoubleInputControl.prototype,{
	setInput1: function(v) {
		this.input1.value = v;
	}
	,setInput2: function(v) {
		this.input2.value = v;
	}
	,getInput1: function() {
		return this.input1.value;
	}
	,getInput2: function() {
		return this.input2.value;
	}
	,__class__: sui_controls_ColorControl
});
var sui_controls_ControlStreams = function(value,focused,enabled) {
	this.value = value;
	this.focused = focused;
	this.enabled = enabled;
};
sui_controls_ControlStreams.__name__ = ["sui","controls","ControlStreams"];
sui_controls_ControlStreams.prototype = {
	value: null
	,focused: null
	,enabled: null
	,__class__: sui_controls_ControlStreams
};
var sui_controls_ControlValues = function(defaultValue) {
	this.value = new thx_stream_Value(defaultValue);
	this.focused = new thx_stream_Value(false);
	this.enabled = new thx_stream_Value(true);
};
sui_controls_ControlValues.__name__ = ["sui","controls","ControlValues"];
sui_controls_ControlValues.prototype = {
	value: null
	,focused: null
	,enabled: null
	,__class__: sui_controls_ControlValues
};
var sui_controls_DataList = function(container,values) {
	this.id = "sui-dl-" + ++sui_controls_DataList.nid;
	var datalist = dots_Html.parse("<datalist id=\"" + this.id + "\" style=\"display:none\">" + values.map(sui_controls_DataList.toOption).join("") + "</datalist>");
	container.appendChild(datalist);
};
sui_controls_DataList.__name__ = ["sui","controls","DataList"];
sui_controls_DataList.fromArray = function(container,values) {
	return new sui_controls_DataList(container,values.map(function(v) {
		return { value : v, label : v};
	}));
};
sui_controls_DataList.toOption = function(o) {
	return "<option value=\"" + StringTools.htmlEscape(o.value) + "\">" + o.label + "</option>";
};
sui_controls_DataList.prototype = {
	id: null
	,applyTo: function(el) {
		el.setAttribute("list",this.id);
		return this;
	}
	,__class__: sui_controls_DataList
};
var sui_controls_DateControl = function(value,options) {
	sui_controls_BaseDateControl.call(this,value,"date","date",sui_controls_BaseDateControl.toRFCDate,options);
};
sui_controls_DateControl.__name__ = ["sui","controls","DateControl"];
sui_controls_DateControl.__super__ = sui_controls_BaseDateControl;
sui_controls_DateControl.prototype = $extend(sui_controls_BaseDateControl.prototype,{
	__class__: sui_controls_DateControl
});
var sui_controls_SelectControl = function(defaultValue,name,options) {
	this.count = 0;
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-" + name + "\"><select></select></div>";
	if(null == options) throw new js__$Boot_HaxeError(" A select control requires an option object with values or list set");
	if(null == options.values && null == options.list) throw new js__$Boot_HaxeError(" A select control requires either the values or list option");
	if(null == options.allownull) options.allownull = false;
	this.defaultValue = defaultValue;
	this.values = new sui_controls_ControlValues(defaultValue);
	this.streams = new sui_controls_ControlStreams(this.values.value,this.values.focused,this.values.enabled);
	this.el = dots_Html.parseNodes(template)[0];
	this.select = dots_Query.first("select",this.el);
	this.values.enabled.subscribe(function(v) {
		if(v) {
			_g.el.classList.add("sui-disabled");
			_g.select.removeAttribute("disabled");
		} else {
			_g.el.classList.remove("sui-disabled");
			_g.select.setAttribute("disabled","disabled");
		}
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	this.options = [];
	(options.allownull?[{ label : (function($this) {
		var $r;
		var t;
		{
			var _0 = options;
			var _1;
			if(null == _0) t = null; else if(null == (_1 = _0.labelfornull)) t = null; else t = _1;
		}
		$r = t != null?t:"- none -";
		return $r;
	}(this)), value : null}]:[]).concat((function($this) {
		var $r;
		var t1;
		{
			var _01 = options;
			var _11;
			if(null == _01) t1 = null; else if(null == (_11 = _01.list)) t1 = null; else t1 = _11;
		}
		$r = t1 != null?t1:options.values.map(function(_) {
			return { value : _, label : Std.string(_)};
		});
		return $r;
	}(this))).map(function(_2) {
		return _g.addOption(_2.label,_2.value);
	});
	this.setInput(defaultValue);
	thx_stream_dom_Dom.streamFocus(this.select).feed(this.values.focused);
	thx_stream_dom_Dom.streamEvent(this.select,"change").map(function(_3) {
		return _g.getInput();
	}).feed(this.values.value);
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
};
sui_controls_SelectControl.__name__ = ["sui","controls","SelectControl"];
sui_controls_SelectControl.__interfaces__ = [sui_controls_IControl];
sui_controls_SelectControl.prototype = {
	el: null
	,select: null
	,defaultValue: null
	,streams: null
	,options: null
	,values: null
	,count: null
	,addOption: function(label,value) {
		var index = this.count++;
		var option = dots_Html.parseNodes("<option>" + label + "</option>")[0];
		this.options[index] = value;
		this.select.appendChild(option);
		return option;
	}
	,setInput: function(v) {
		var index = HxOverrides.indexOf(this.options,v,0);
		if(index < 0) throw new js__$Boot_HaxeError("value \"" + Std.string(v) + "\" is not included in this select control");
		this.select.selectedIndex = index;
	}
	,getInput: function() {
		return this.options[this.select.selectedIndex];
	}
	,set: function(v) {
		this.setInput(v);
		this.values.value.set(v);
	}
	,get: function() {
		return this.values.value.get();
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
		this.select.focus();
	}
	,blur: function() {
		this.select.blur();
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,__class__: sui_controls_SelectControl
};
var sui_controls_DateSelectControl = function(defaultValue,options) {
	sui_controls_SelectControl.call(this,defaultValue,"select-date",options);
};
sui_controls_DateSelectControl.__name__ = ["sui","controls","DateSelectControl"];
sui_controls_DateSelectControl.__super__ = sui_controls_SelectControl;
sui_controls_DateSelectControl.prototype = $extend(sui_controls_SelectControl.prototype,{
	__class__: sui_controls_DateSelectControl
});
var sui_controls_DateTimeControl = function(value,options) {
	sui_controls_BaseDateControl.call(this,value,"date-time","datetime-local",sui_controls_BaseDateControl.toRFCDateTimeNoSeconds,options);
};
sui_controls_DateTimeControl.__name__ = ["sui","controls","DateTimeControl"];
sui_controls_DateTimeControl.__super__ = sui_controls_BaseDateControl;
sui_controls_DateTimeControl.prototype = $extend(sui_controls_BaseDateControl.prototype,{
	__class__: sui_controls_DateTimeControl
});
var sui_controls_EmailControl = function(value,options) {
	if(null == options) options = { };
	if(null == options.placeholder) options.placeholder = "name@example.com";
	sui_controls_BaseTextControl.call(this,value,"email","email",options);
};
sui_controls_EmailControl.__name__ = ["sui","controls","EmailControl"];
sui_controls_EmailControl.__super__ = sui_controls_BaseTextControl;
sui_controls_EmailControl.prototype = $extend(sui_controls_BaseTextControl.prototype,{
	__class__: sui_controls_EmailControl
});
var sui_controls_NumberControl = function(value,name,options) {
	if(null == options) options = { };
	sui_controls_SingleInputControl.call(this,value,"input",name,"number",options);
	if(null != options.autocomplete) this.input.setAttribute("autocomplete",options.autocomplete?"on":"off");
	if(null != options.min) this.input.setAttribute("min","" + Std.string(options.min));
	if(null != options.max) this.input.setAttribute("max","" + Std.string(options.max));
	if(null != options.step) this.input.setAttribute("step","" + Std.string(options.step));
	if(null != options.placeholder) this.input.setAttribute("placeholder","" + options.placeholder);
	if(null != options.list) new sui_controls_DataList(this.el,options.list.map(function(o) {
		return { label : o.label, value : "" + Std.string(o.value)};
	})).applyTo(this.input); else if(null != options.values) new sui_controls_DataList(this.el,options.values.map(function(o1) {
		return { label : "" + Std.string(o1), value : "" + Std.string(o1)};
	})).applyTo(this.input);
};
sui_controls_NumberControl.__name__ = ["sui","controls","NumberControl"];
sui_controls_NumberControl.__super__ = sui_controls_SingleInputControl;
sui_controls_NumberControl.prototype = $extend(sui_controls_SingleInputControl.prototype,{
	__class__: sui_controls_NumberControl
});
var sui_controls_FloatControl = function(value,options) {
	sui_controls_NumberControl.call(this,value,"float",options);
};
sui_controls_FloatControl.__name__ = ["sui","controls","FloatControl"];
sui_controls_FloatControl.__super__ = sui_controls_NumberControl;
sui_controls_FloatControl.prototype = $extend(sui_controls_NumberControl.prototype,{
	setInput: function(v) {
		this.input.value = "" + v;
	}
	,getInput: function() {
		return parseFloat(this.input.value);
	}
	,__class__: sui_controls_FloatControl
});
var sui_controls_NumberRangeControl = function(value,options) {
	sui_controls_DoubleInputControl.call(this,value,"float-range","input","range","input","number",function(v) {
		return v != null;
	},options);
	if(null != options.autocomplete) {
		this.input1.setAttribute("autocomplete",options.autocomplete?"on":"off");
		this.input2.setAttribute("autocomplete",options.autocomplete?"on":"off");
	}
	if(null != options.min) {
		this.input1.setAttribute("min","" + Std.string(options.min));
		this.input2.setAttribute("min","" + Std.string(options.min));
	}
	if(null != options.max) {
		this.input1.setAttribute("max","" + Std.string(options.max));
		this.input2.setAttribute("max","" + Std.string(options.max));
	}
	if(null != options.step) {
		this.input1.setAttribute("step","" + Std.string(options.step));
		this.input2.setAttribute("step","" + Std.string(options.step));
	}
	if(null != options.placeholder) this.input2.setAttribute("placeholder","" + options.placeholder);
	if(null != options.list) new sui_controls_DataList(this.el,options.list.map(function(o) {
		return { label : o.label, value : "" + Std.string(o.value)};
	})).applyTo(this.input1).applyTo(this.input2); else if(null != options.values) new sui_controls_DataList(this.el,options.values.map(function(o1) {
		return { label : "" + Std.string(o1), value : "" + Std.string(o1)};
	})).applyTo(this.input1).applyTo(this.input2);
	this.setInputs(value);
};
sui_controls_NumberRangeControl.__name__ = ["sui","controls","NumberRangeControl"];
sui_controls_NumberRangeControl.__super__ = sui_controls_DoubleInputControl;
sui_controls_NumberRangeControl.prototype = $extend(sui_controls_DoubleInputControl.prototype,{
	setInput1: function(v) {
		this.input1.value = "" + Std.string(v);
	}
	,setInput2: function(v) {
		this.input2.value = "" + Std.string(v);
	}
	,__class__: sui_controls_NumberRangeControl
});
var sui_controls_FloatRangeControl = function(value,options) {
	if(null == options) options = { };
	if(null == options.min) options.min = Math.min(value,0);
	if(null == options.min) {
		var s;
		if(null != options.step) s = options.step; else s = 1;
		options.max = Math.max(value,s);
	}
	sui_controls_NumberRangeControl.call(this,value,options);
};
sui_controls_FloatRangeControl.__name__ = ["sui","controls","FloatRangeControl"];
sui_controls_FloatRangeControl.__super__ = sui_controls_NumberRangeControl;
sui_controls_FloatRangeControl.prototype = $extend(sui_controls_NumberRangeControl.prototype,{
	getInput1: function() {
		if(thx_Floats.canParse(this.input1.value)) return thx_Floats.parse(this.input1.value); else return null;
	}
	,getInput2: function() {
		if(thx_Floats.canParse(this.input2.value)) return thx_Floats.parse(this.input2.value); else return null;
	}
	,__class__: sui_controls_FloatRangeControl
});
var sui_controls_IntControl = function(value,options) {
	sui_controls_NumberControl.call(this,value,"int",options);
};
sui_controls_IntControl.__name__ = ["sui","controls","IntControl"];
sui_controls_IntControl.__super__ = sui_controls_NumberControl;
sui_controls_IntControl.prototype = $extend(sui_controls_NumberControl.prototype,{
	setInput: function(v) {
		this.input.value = "" + v;
	}
	,getInput: function() {
		return Std.parseInt(this.input.value);
	}
	,__class__: sui_controls_IntControl
});
var sui_controls_IntRangeControl = function(value,options) {
	if(null == options) options = { };
	if(null == options.min) if(value < 0) options.min = value; else options.min = 0;
	if(null == options.min) {
		var s;
		if(null != options.step) s = options.step; else s = 100;
		if(value > s) options.max = value; else options.max = s;
	}
	sui_controls_NumberRangeControl.call(this,value,options);
};
sui_controls_IntRangeControl.__name__ = ["sui","controls","IntRangeControl"];
sui_controls_IntRangeControl.__super__ = sui_controls_NumberRangeControl;
sui_controls_IntRangeControl.prototype = $extend(sui_controls_NumberRangeControl.prototype,{
	getInput1: function() {
		if(thx_Ints.canParse(this.input1.value)) return thx_Ints.parse(this.input1.value); else return null;
	}
	,getInput2: function() {
		if(thx_Ints.canParse(this.input2.value)) return thx_Ints.parse(this.input2.value); else return null;
	}
	,__class__: sui_controls_IntRangeControl
});
var sui_controls_LabelControl = function(defaultValue) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-label\"><output>" + defaultValue + "</output></div>";
	this.defaultValue = defaultValue;
	this.values = new sui_controls_ControlValues(defaultValue);
	this.streams = new sui_controls_ControlStreams(this.values.value,this.values.focused,this.values.enabled);
	this.el = dots_Html.parseNodes(template)[0];
	this.output = dots_Query.first("output",this.el);
	this.values.enabled.subscribe(function(v) {
		if(v) _g.el.classList.add("sui-disabled"); else _g.el.classList.remove("sui-disabled");
	});
};
sui_controls_LabelControl.__name__ = ["sui","controls","LabelControl"];
sui_controls_LabelControl.__interfaces__ = [sui_controls_IControl];
sui_controls_LabelControl.prototype = {
	el: null
	,output: null
	,defaultValue: null
	,streams: null
	,values: null
	,set: function(v) {
		this.output.innerHTML = v;
		this.values.value.set(v);
	}
	,get: function() {
		return this.values.value.get();
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
	}
	,blur: function() {
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,__class__: sui_controls_LabelControl
};
var sui_controls_MapControl = function(defaultValue,createMap,createKeyControl,createValueControl,options) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-array\">\n<table class=\"sui-map\"><tbody></tbody></table>\n<div class=\"sui-array-add\"><i class=\"sui-icon sui-icon-add\"></i></div>\n</div>";
	var t;
	var _0 = options;
	if(null == _0) t = null; else t = _0;
	if(t != null) options = t; else options = { };
	if(null == defaultValue) defaultValue = createMap();
	this.defaultValue = defaultValue;
	this.createMap = createMap;
	this.createKeyControl = createKeyControl;
	this.createValueControl = createValueControl;
	this.elements = [];
	this.length = 0;
	this.values = new sui_controls_ControlValues(defaultValue);
	this.streams = new sui_controls_ControlStreams(this.values.value,this.values.focused.debounce(0),this.values.enabled);
	this.el = dots_Html.parseNodes(template)[0];
	this.tbody = dots_Query.first("tbody",this.el);
	this.addButton = dots_Query.first(".sui-icon-add",this.el);
	thx_stream_dom_Dom.streamEvent(this.addButton,"click",false).subscribe(function(_) {
		_g.addControl(null,null);
	});
	this.values.enabled.subscribe(function(v) {
		if(v) _g.el.classList.add("sui-disabled"); else _g.el.classList.remove("sui-disabled");
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	thx_stream_EmitterBools.negate(this.values.enabled).subscribe(thx_stream_dom_Dom.subscribeToggleClass(this.el,"sui-disabled"));
	this.values.enabled.subscribe(function(v2) {
		_g.elements.map(function(_1) {
			if(v2) {
				_1.controlKey.enable();
				_1.controlValue.enable();
			} else {
				_1.controlKey.disable();
				_1.controlValue.disable();
			}
			return;
		});
	});
	this.setValue(defaultValue);
	this.reset();
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
};
sui_controls_MapControl.__name__ = ["sui","controls","MapControl"];
sui_controls_MapControl.__interfaces__ = [sui_controls_IControl];
sui_controls_MapControl.prototype = {
	el: null
	,tbody: null
	,addButton: null
	,defaultValue: null
	,streams: null
	,createMap: null
	,createKeyControl: null
	,createValueControl: null
	,length: null
	,values: null
	,elements: null
	,addControl: function(key,value) {
		var _g = this;
		var o = { controlKey : this.createKeyControl(key), controlValue : this.createValueControl(value), el : dots_Html.parseNodes("<tr class=\"sui-map-item\">\n<td class=\"sui-map-key\"></td>\n<td class=\"sui-map-value\"></td>\n<td class=\"sui-remove\"><i class=\"sui-icon sui-icon-remove\"></i></td>\n</tr>")[0], index : this.length++};
		this.tbody.appendChild(o.el);
		var removeElement = dots_Query.first(".sui-icon-remove",o.el);
		var controlKeyContainer = dots_Query.first(".sui-map-key",o.el);
		var controlValueContainer = dots_Query.first(".sui-map-value",o.el);
		controlKeyContainer.appendChild(o.controlKey.el);
		controlValueContainer.appendChild(o.controlValue.el);
		thx_stream_dom_Dom.streamEvent(removeElement,"click",false).subscribe(function(_) {
			_g.tbody.removeChild(o.el);
			_g.elements.splice(o.index,1);
			var _g2 = o.index;
			var _g1 = _g.elements.length;
			while(_g2 < _g1) {
				var i = _g2++;
				_g.elements[i].index--;
			}
			_g.length--;
			_g.updateValue();
		});
		this.elements.push(o);
		o.controlKey.streams.value.toNil().merge(o.controlValue.streams.value.toNil()).subscribe(function(_1) {
			_g.updateValue();
		});
		o.controlKey.streams.focused.merge(o.controlValue.streams.focused).subscribe(thx_stream_dom_Dom.subscribeToggleClass(o.el,"sui-focus"));
		o.controlKey.streams.focused.merge(o.controlValue.streams.focused).feed(this.values.focused);
	}
	,setValue: function(v) {
		var _g = this;
		thx_Iterators.map(v.keys(),function(_) {
			_g.addControl(_,v.get(_));
			return;
		});
	}
	,getValue: function() {
		var map = this.createMap();
		this.elements.map(function(o) {
			var k = o.controlKey.get();
			var v = o.controlValue.get();
			if(k == null || map.exists(k)) {
				o.controlKey.el.classList.add("sui-invalid");
				return;
			}
			o.controlKey.el.classList.remove("sui-invalid");
			map.set(k,v);
		});
		return map;
	}
	,updateValue: function() {
		this.values.value.set(this.getValue());
	}
	,set: function(v) {
		this.clear();
		this.setValue(v);
		this.values.value.set(v);
	}
	,get: function() {
		return this.values.value.get();
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
		if(this.elements.length > 0) thx_Arrays.last(this.elements).controlValue.focus();
	}
	,blur: function() {
		var el = window.document.activeElement;
		(function(_) {
			if(null == _) null; else el.blur();
			return;
		})(thx_Arrays.first(this.elements.filter(function(_1) {
			return _1.controlKey.el == el || _1.controlValue.el == el;
		})));
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,clear: function() {
		var _g = this;
		this.length = 0;
		this.elements.map(function(item) {
			_g.tbody.removeChild(item.el);
		});
		this.elements = [];
	}
	,__class__: sui_controls_MapControl
};
var sui_controls_NumberSelectControl = function(defaultValue,options) {
	sui_controls_SelectControl.call(this,defaultValue,"select-number",options);
};
sui_controls_NumberSelectControl.__name__ = ["sui","controls","NumberSelectControl"];
sui_controls_NumberSelectControl.__super__ = sui_controls_SelectControl;
sui_controls_NumberSelectControl.prototype = $extend(sui_controls_SelectControl.prototype,{
	__class__: sui_controls_NumberSelectControl
});
var sui_controls_DateKind = { __ename__ : ["sui","controls","DateKind"], __constructs__ : ["DateOnly","DateTime"] };
sui_controls_DateKind.DateOnly = ["DateOnly",0];
sui_controls_DateKind.DateOnly.toString = $estr;
sui_controls_DateKind.DateOnly.__enum__ = sui_controls_DateKind;
sui_controls_DateKind.DateTime = ["DateTime",1];
sui_controls_DateKind.DateTime.toString = $estr;
sui_controls_DateKind.DateTime.__enum__ = sui_controls_DateKind;
var sui_controls_FloatKind = { __ename__ : ["sui","controls","FloatKind"], __constructs__ : ["FloatNumber","FloatTime"] };
sui_controls_FloatKind.FloatNumber = ["FloatNumber",0];
sui_controls_FloatKind.FloatNumber.toString = $estr;
sui_controls_FloatKind.FloatNumber.__enum__ = sui_controls_FloatKind;
sui_controls_FloatKind.FloatTime = ["FloatTime",1];
sui_controls_FloatKind.FloatTime.toString = $estr;
sui_controls_FloatKind.FloatTime.__enum__ = sui_controls_FloatKind;
var sui_controls_TextKind = { __ename__ : ["sui","controls","TextKind"], __constructs__ : ["TextEmail","TextPassword","TextSearch","TextTel","PlainText","TextUrl"] };
sui_controls_TextKind.TextEmail = ["TextEmail",0];
sui_controls_TextKind.TextEmail.toString = $estr;
sui_controls_TextKind.TextEmail.__enum__ = sui_controls_TextKind;
sui_controls_TextKind.TextPassword = ["TextPassword",1];
sui_controls_TextKind.TextPassword.toString = $estr;
sui_controls_TextKind.TextPassword.__enum__ = sui_controls_TextKind;
sui_controls_TextKind.TextSearch = ["TextSearch",2];
sui_controls_TextKind.TextSearch.toString = $estr;
sui_controls_TextKind.TextSearch.__enum__ = sui_controls_TextKind;
sui_controls_TextKind.TextTel = ["TextTel",3];
sui_controls_TextKind.TextTel.toString = $estr;
sui_controls_TextKind.TextTel.__enum__ = sui_controls_TextKind;
sui_controls_TextKind.PlainText = ["PlainText",4];
sui_controls_TextKind.PlainText.toString = $estr;
sui_controls_TextKind.PlainText.__enum__ = sui_controls_TextKind;
sui_controls_TextKind.TextUrl = ["TextUrl",5];
sui_controls_TextKind.TextUrl.toString = $estr;
sui_controls_TextKind.TextUrl.__enum__ = sui_controls_TextKind;
var sui_controls_PasswordControl = function(value,options) {
	sui_controls_BaseTextControl.call(this,value,"text","password",options);
};
sui_controls_PasswordControl.__name__ = ["sui","controls","PasswordControl"];
sui_controls_PasswordControl.__super__ = sui_controls_BaseTextControl;
sui_controls_PasswordControl.prototype = $extend(sui_controls_BaseTextControl.prototype,{
	__class__: sui_controls_PasswordControl
});
var sui_controls_SearchControl = function(value,options) {
	if(null == options) options = { };
	sui_controls_BaseTextControl.call(this,value,"search","search",options);
};
sui_controls_SearchControl.__name__ = ["sui","controls","SearchControl"];
sui_controls_SearchControl.__super__ = sui_controls_BaseTextControl;
sui_controls_SearchControl.prototype = $extend(sui_controls_BaseTextControl.prototype,{
	__class__: sui_controls_SearchControl
});
var sui_controls_TelControl = function(value,options) {
	if(null == options) options = { };
	sui_controls_BaseTextControl.call(this,value,"tel","tel",options);
};
sui_controls_TelControl.__name__ = ["sui","controls","TelControl"];
sui_controls_TelControl.__super__ = sui_controls_BaseTextControl;
sui_controls_TelControl.prototype = $extend(sui_controls_BaseTextControl.prototype,{
	__class__: sui_controls_TelControl
});
var sui_controls_TextControl = function(value,options) {
	sui_controls_BaseTextControl.call(this,value,"text","text",options);
};
sui_controls_TextControl.__name__ = ["sui","controls","TextControl"];
sui_controls_TextControl.__super__ = sui_controls_BaseTextControl;
sui_controls_TextControl.prototype = $extend(sui_controls_BaseTextControl.prototype,{
	__class__: sui_controls_TextControl
});
var sui_controls_TextSelectControl = function(defaultValue,options) {
	sui_controls_SelectControl.call(this,defaultValue,"select-text",options);
};
sui_controls_TextSelectControl.__name__ = ["sui","controls","TextSelectControl"];
sui_controls_TextSelectControl.__super__ = sui_controls_SelectControl;
sui_controls_TextSelectControl.prototype = $extend(sui_controls_SelectControl.prototype,{
	__class__: sui_controls_TextSelectControl
});
var sui_controls_TimeControl = function(value,options) {
	if(null == options) options = { };
	sui_controls_SingleInputControl.call(this,value,"input","time","time",options);
	if(null != options.autocomplete) this.input.setAttribute("autocomplete",options.autocomplete?"on":"off");
	if(null != options.min) this.input.setAttribute("min",sui_controls_TimeControl.timeToString(options.min));
	if(null != options.max) this.input.setAttribute("max",sui_controls_TimeControl.timeToString(options.max));
	if(null != options.list) new sui_controls_DataList(this.el,options.list.map(function(o) {
		return { label : o.label, value : sui_controls_TimeControl.timeToString(o.value)};
	})).applyTo(this.input); else if(null != options.values) new sui_controls_DataList(this.el,options.values.map(function(o1) {
		return { label : sui_controls_TimeControl.timeToString(o1), value : sui_controls_TimeControl.timeToString(o1)};
	})).applyTo(this.input);
};
sui_controls_TimeControl.__name__ = ["sui","controls","TimeControl"];
sui_controls_TimeControl.timeToString = function(t) {
	var h = Math.floor(t / 3600000);
	t -= h * 3600000;
	var m = Math.floor(t / 60000);
	t -= m * 60000;
	var s = t / 1000;
	var hh = StringTools.lpad("" + h,"0",2);
	var mm = StringTools.lpad("" + m,"0",2);
	var ss;
	ss = (s >= 10?"":"0") + s;
	return "" + hh + ":" + mm + ":" + ss;
};
sui_controls_TimeControl.stringToTime = function(t) {
	var p = t.split(":");
	var h = Std.parseInt(p[0]);
	var m = Std.parseInt(p[1]);
	var s = parseFloat(p[2]);
	return s * 1000 + m * 60000 + h * 3600000;
};
sui_controls_TimeControl.__super__ = sui_controls_SingleInputControl;
sui_controls_TimeControl.prototype = $extend(sui_controls_SingleInputControl.prototype,{
	setInput: function(v) {
		this.input.value = sui_controls_TimeControl.timeToString(v);
	}
	,getInput: function() {
		return sui_controls_TimeControl.stringToTime(this.input.value);
	}
	,__class__: sui_controls_TimeControl
});
var sui_controls_TriggerControl = function(label,options) {
	var _g = this;
	var template = "<div class=\"sui-control sui-control-single sui-type-trigger\"><button>" + label + "</button></div>";
	if(null == options) options = { };
	this.defaultValue = thx_Nil.nil;
	this.el = dots_Html.parseNodes(template)[0];
	this.button = dots_Query.first("button",this.el);
	this.values = new sui_controls_ControlValues(thx_Nil.nil);
	var emitter = thx_stream_dom_Dom.streamEvent(this.button,"click",false).toNil();
	this.streams = new sui_controls_ControlStreams(emitter,this.values.focused,this.values.enabled);
	this.values.enabled.subscribe(function(v) {
		if(v) {
			_g.el.classList.add("sui-disabled");
			_g.button.removeAttribute("disabled");
		} else {
			_g.el.classList.remove("sui-disabled");
			_g.button.setAttribute("disabled","disabled");
		}
	});
	this.values.focused.subscribe(function(v1) {
		if(v1) _g.el.classList.add("sui-focused"); else _g.el.classList.remove("sui-focused");
	});
	thx_stream_dom_Dom.streamFocus(this.button).feed(this.values.focused);
	if(options.autofocus) this.focus();
	if(options.disabled) this.disable();
};
sui_controls_TriggerControl.__name__ = ["sui","controls","TriggerControl"];
sui_controls_TriggerControl.__interfaces__ = [sui_controls_IControl];
sui_controls_TriggerControl.prototype = {
	el: null
	,button: null
	,defaultValue: null
	,streams: null
	,values: null
	,set: function(v) {
		this.button.click();
	}
	,get: function() {
		return thx_Nil.nil;
	}
	,isEnabled: function() {
		return this.values.enabled.get();
	}
	,isFocused: function() {
		return this.values.focused.get();
	}
	,disable: function() {
		this.values.enabled.set(false);
	}
	,enable: function() {
		this.values.enabled.set(true);
	}
	,focus: function() {
		this.button.focus();
	}
	,blur: function() {
		this.button.blur();
	}
	,reset: function() {
		this.set(this.defaultValue);
	}
	,__class__: sui_controls_TriggerControl
};
var sui_controls_UrlControl = function(value,options) {
	if(null == options) options = { };
	if(null == options.placeholder) options.placeholder = "http://example.com";
	sui_controls_BaseTextControl.call(this,value,"url","url",options);
};
sui_controls_UrlControl.__name__ = ["sui","controls","UrlControl"];
sui_controls_UrlControl.__super__ = sui_controls_BaseTextControl;
sui_controls_UrlControl.prototype = $extend(sui_controls_BaseTextControl.prototype,{
	__class__: sui_controls_UrlControl
});
var sui_macro_Embed = function() { };
sui_macro_Embed.__name__ = ["sui","macro","Embed"];
var thx_Arrays = function() { };
thx_Arrays.__name__ = ["thx","Arrays"];
thx_Arrays.after = function(array,element) {
	return array.slice(HxOverrides.indexOf(array,element,0) + 1);
};
thx_Arrays.all = function(arr,predicate) {
	var _g = 0;
	while(_g < arr.length) {
		var item = arr[_g];
		++_g;
		if(!predicate(item)) return false;
	}
	return true;
};
thx_Arrays.any = function(arr,predicate) {
	var _g = 0;
	while(_g < arr.length) {
		var item = arr[_g];
		++_g;
		if(predicate(item)) return true;
	}
	return false;
};
thx_Arrays.at = function(arr,indexes) {
	return indexes.map(function(i) {
		return arr[i];
	});
};
thx_Arrays.before = function(array,element) {
	return array.slice(0,HxOverrides.indexOf(array,element,0));
};
thx_Arrays.compact = function(arr) {
	return arr.filter(function(v) {
		return null != v;
	});
};
thx_Arrays.contains = function(array,element,eq) {
	if(null == eq) return HxOverrides.indexOf(array,element,0) >= 0; else {
		var _g1 = 0;
		var _g = array.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(eq(array[i],element)) return true;
		}
		return false;
	}
};
thx_Arrays.cross = function(a,b) {
	var r = [];
	var _g = 0;
	while(_g < a.length) {
		var va = a[_g];
		++_g;
		var _g1 = 0;
		while(_g1 < b.length) {
			var vb = b[_g1];
			++_g1;
			r.push([va,vb]);
		}
	}
	return r;
};
thx_Arrays.crossMulti = function(array) {
	var acopy = array.slice();
	var result = acopy.shift().map(function(v) {
		return [v];
	});
	while(acopy.length > 0) {
		var array1 = acopy.shift();
		var tresult = result;
		result = [];
		var _g = 0;
		while(_g < array1.length) {
			var v1 = array1[_g];
			++_g;
			var _g1 = 0;
			while(_g1 < tresult.length) {
				var ar = tresult[_g1];
				++_g1;
				var t = ar.slice();
				t.push(v1);
				result.push(t);
			}
		}
	}
	return result;
};
thx_Arrays.distinct = function(array,predicate) {
	var result = [];
	if(array.length <= 1) return array;
	if(null == predicate) predicate = thx_Functions.equality;
	var _g = 0;
	while(_g < array.length) {
		var v = [array[_g]];
		++_g;
		var keep = !thx_Arrays.any(result,(function(v) {
			return function(r) {
				return predicate(r,v[0]);
			};
		})(v));
		if(keep) result.push(v[0]);
	}
	return result;
};
thx_Arrays.eachPair = function(array,callback) {
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		var _g3 = i;
		var _g2 = array.length;
		while(_g3 < _g2) {
			var j = _g3++;
			if(!callback(array[i],array[j])) return;
		}
	}
};
thx_Arrays.equals = function(a,b,equality) {
	if(a == null || b == null || a.length != b.length) return false;
	if(null == equality) equality = thx_Functions.equality;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(!equality(a[i],b[i])) return false;
	}
	return true;
};
thx_Arrays.extract = function(a,predicate) {
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(predicate(a[i])) return a.splice(i,1)[0];
	}
	return null;
};
thx_Arrays.find = function(array,predicate) {
	var _g = 0;
	while(_g < array.length) {
		var item = array[_g];
		++_g;
		if(predicate(item)) return item;
	}
	return null;
};
thx_Arrays.findLast = function(array,predicate) {
	var len = array.length;
	var j;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		j = len - i - 1;
		if(predicate(array[j])) return array[j];
	}
	return null;
};
thx_Arrays.first = function(array) {
	return array[0];
};
thx_Arrays.flatMap = function(array,callback) {
	return thx_Arrays.flatten(array.map(callback));
};
thx_Arrays.flatten = function(array) {
	return Array.prototype.concat.apply([],array);
};
thx_Arrays.from = function(array,element) {
	return array.slice(HxOverrides.indexOf(array,element,0));
};
thx_Arrays.groupByAppend = function(arr,resolver,map) {
	arr.map(function(v) {
		var key = resolver(v);
		var arr1 = map.get(key);
		if(null == arr1) {
			arr1 = [v];
			map.set(key,arr1);
		} else arr1.push(v);
	});
	return map;
};
thx_Arrays.head = function(array) {
	return array[0];
};
thx_Arrays.ifEmpty = function(value,alt) {
	if(null != value && 0 != value.length) return value; else return alt;
};
thx_Arrays.initial = function(array) {
	return array.slice(0,array.length - 1);
};
thx_Arrays.isEmpty = function(array) {
	return array.length == 0;
};
thx_Arrays.last = function(array) {
	return array[array.length - 1];
};
thx_Arrays.mapi = function(array,callback) {
	var r = [];
	var _g1 = 0;
	var _g = array.length;
	while(_g1 < _g) {
		var i = _g1++;
		r.push(callback(array[i],i));
	}
	return r;
};
thx_Arrays.mapRight = function(array,callback) {
	var i = array.length;
	var result = [];
	while(--i >= 0) result.push(callback(array[i]));
	return result;
};
thx_Arrays.order = function(array,sort) {
	var n = array.slice();
	n.sort(sort);
	return n;
};
thx_Arrays.pull = function(array,toRemove,equality) {
	var _g = 0;
	while(_g < toRemove.length) {
		var item = toRemove[_g];
		++_g;
		thx_Arrays.removeAll(array,item,equality);
	}
};
thx_Arrays.pushIf = function(array,condition,value) {
	if(condition) array.push(value);
	return array;
};
thx_Arrays.reduce = function(array,callback,initial) {
	return array.reduce(callback,initial);
};
thx_Arrays.resize = function(array,length,fill) {
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_Arrays.reducei = function(array,callback,initial) {
	return array.reduce(callback,initial);
};
thx_Arrays.reduceRight = function(array,callback,initial) {
	var i = array.length;
	while(--i >= 0) initial = callback(initial,array[i]);
	return initial;
};
thx_Arrays.removeAll = function(array,element,equality) {
	if(null == equality) equality = thx_Functions.equality;
	var i = array.length;
	while(--i >= 0) if(equality(array[i],element)) array.splice(i,1);
};
thx_Arrays.rest = function(array) {
	return array.slice(1);
};
thx_Arrays.sample = function(array,n) {
	n = thx_Ints.min(n,array.length);
	var copy = array.slice();
	var result = [];
	var _g = 0;
	while(_g < n) {
		var i = _g++;
		result.push(copy.splice(Std.random(copy.length),1)[0]);
	}
	return result;
};
thx_Arrays.sampleOne = function(array) {
	return array[Std.random(array.length)];
};
thx_Arrays.shuffle = function(a) {
	var t = thx_Ints.range(a.length);
	var array = [];
	while(t.length > 0) {
		var pos = Std.random(t.length);
		var index = t[pos];
		t.splice(pos,1);
		array.push(a[index]);
	}
	return array;
};
thx_Arrays.take = function(arr,n) {
	return arr.slice(0,n);
};
thx_Arrays.takeLast = function(arr,n) {
	return arr.slice(arr.length - n);
};
thx_Arrays.rotate = function(arr) {
	var result = [];
	var _g1 = 0;
	var _g = arr[0].length;
	while(_g1 < _g) {
		var i = _g1++;
		var row = [];
		result.push(row);
		var _g3 = 0;
		var _g2 = arr.length;
		while(_g3 < _g2) {
			var j = _g3++;
			row.push(arr[j][i]);
		}
	}
	return result;
};
thx_Arrays.zip = function(array1,array2) {
	var length = thx_Ints.min(array1.length,array2.length);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i]});
	}
	return array;
};
thx_Arrays.zip3 = function(array1,array2,array3) {
	var length = thx_ArrayInts.min([array1.length,array2.length,array3.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i]});
	}
	return array;
};
thx_Arrays.zip4 = function(array1,array2,array3,array4) {
	var length = thx_ArrayInts.min([array1.length,array2.length,array3.length,array4.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i], _3 : array4[i]});
	}
	return array;
};
thx_Arrays.zip5 = function(array1,array2,array3,array4,array5) {
	var length = thx_ArrayInts.min([array1.length,array2.length,array3.length,array4.length,array5.length]);
	var array = [];
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		array.push({ _0 : array1[i], _1 : array2[i], _2 : array3[i], _3 : array4[i], _4 : array5[i]});
	}
	return array;
};
thx_Arrays.unzip = function(array) {
	var a1 = [];
	var a2 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
	});
	return { _0 : a1, _1 : a2};
};
thx_Arrays.unzip3 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
	});
	return { _0 : a1, _1 : a2, _2 : a3};
};
thx_Arrays.unzip4 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4};
};
thx_Arrays.unzip5 = function(array) {
	var a1 = [];
	var a2 = [];
	var a3 = [];
	var a4 = [];
	var a5 = [];
	array.map(function(t) {
		a1.push(t._0);
		a2.push(t._1);
		a3.push(t._2);
		a4.push(t._3);
		a5.push(t._4);
	});
	return { _0 : a1, _1 : a2, _2 : a3, _3 : a4, _4 : a5};
};
var thx_ArrayFloats = function() { };
thx_ArrayFloats.__name__ = ["thx","ArrayFloats"];
thx_ArrayFloats.average = function(arr) {
	return thx_ArrayFloats.sum(arr) / arr.length;
};
thx_ArrayFloats.compact = function(arr) {
	return arr.filter(function(v) {
		return null != v && isFinite(v);
	});
};
thx_ArrayFloats.max = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(max,v) {
		if(v > max) return v; else return max;
	},arr[0]);
};
thx_ArrayFloats.min = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(min,v) {
		if(v < min) return v; else return min;
	},arr[0]);
};
thx_ArrayFloats.resize = function(array,length,fill) {
	if(fill == null) fill = 0.0;
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_ArrayFloats.sum = function(arr) {
	return arr.reduce(function(tot,v) {
		return tot + v;
	},0.0);
};
var thx_ArrayInts = function() { };
thx_ArrayInts.__name__ = ["thx","ArrayInts"];
thx_ArrayInts.average = function(arr) {
	return thx_ArrayInts.sum(arr) / arr.length;
};
thx_ArrayInts.max = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(max,v) {
		if(v > max) return v; else return max;
	},arr[0]);
};
thx_ArrayInts.min = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(min,v) {
		if(v < min) return v; else return min;
	},arr[0]);
};
thx_ArrayInts.resize = function(array,length,fill) {
	if(fill == null) fill = 0;
	while(array.length < length) array.push(fill);
	array.splice(length,array.length - length);
	return array;
};
thx_ArrayInts.sum = function(arr) {
	return arr.reduce(function(tot,v) {
		return tot + v;
	},0);
};
var thx_ArrayStrings = function() { };
thx_ArrayStrings.__name__ = ["thx","ArrayStrings"];
thx_ArrayStrings.compact = function(arr) {
	return arr.filter(function(v) {
		return !thx_Strings.isEmpty(v);
	});
};
thx_ArrayStrings.max = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(max,v) {
		if(v > max) return v; else return max;
	},arr[0]);
};
thx_ArrayStrings.min = function(arr) {
	if(arr.length == 0) return null; else return arr.reduce(function(min,v) {
		if(v < min) return v; else return min;
	},arr[0]);
};
var thx_Either = { __ename__ : ["thx","Either"], __constructs__ : ["Left","Right"] };
thx_Either.Left = function(value) { var $x = ["Left",0,value]; $x.__enum__ = thx_Either; $x.toString = $estr; return $x; };
thx_Either.Right = function(value) { var $x = ["Right",1,value]; $x.__enum__ = thx_Either; $x.toString = $estr; return $x; };
var thx_Error = function(message,stack,pos) {
	Error.call(this,message);
	this.message = message;
	if(null == stack) {
		try {
			stack = haxe_CallStack.exceptionStack();
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			stack = [];
		}
		if(stack.length == 0) try {
			stack = haxe_CallStack.callStack();
		} catch( e1 ) {
			haxe_CallStack.lastException = e1;
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
			stack = [];
		}
	}
	this.stackItems = stack;
	this.pos = pos;
};
thx_Error.__name__ = ["thx","Error"];
thx_Error.fromDynamic = function(err,pos) {
	if(js_Boot.__instanceof(err,thx_Error)) return err;
	return new thx_error_ErrorWrapper("" + Std.string(err),err,null,pos);
};
thx_Error.__super__ = Error;
thx_Error.prototype = $extend(Error.prototype,{
	pos: null
	,stackItems: null
	,toString: function() {
		return this.message + "\nfrom: " + this.pos.className + "." + this.pos.methodName + "() at " + this.pos.lineNumber + "\n\n" + haxe_CallStack.toString(this.stackItems);
	}
	,__class__: thx_Error
});
var thx_Floats = function() { };
thx_Floats.__name__ = ["thx","Floats"];
thx_Floats.angleDifference = function(a,b,turn) {
	if(turn == null) turn = 360;
	var r = (b - a) % turn;
	if(r < 0) r += turn;
	if(r > turn / 2) r -= turn;
	return r;
};
thx_Floats.ceilTo = function(f,decimals) {
	var p = Math.pow(10,decimals);
	return Math.ceil(f * p) / p;
};
thx_Floats.canParse = function(s) {
	return thx_Floats.pattern_parse.match(s);
};
thx_Floats.clamp = function(v,min,max) {
	if(v < min) return min; else if(v > max) return max; else return v;
};
thx_Floats.clampSym = function(v,max) {
	return thx_Floats.clamp(v,-max,max);
};
thx_Floats.compare = function(a,b) {
	if(a < b) return -1; else if(a > b) return 1; else return 0;
};
thx_Floats.floorTo = function(f,decimals) {
	var p = Math.pow(10,decimals);
	return Math.floor(f * p) / p;
};
thx_Floats.interpolate = function(f,a,b) {
	return (b - a) * f + a;
};
thx_Floats.interpolateAngle = function(f,a,b,turn) {
	if(turn == null) turn = 360;
	return thx_Floats.wrapCircular(thx_Floats.interpolate(f,a,a + thx_Floats.angleDifference(a,b,turn)),turn);
};
thx_Floats.interpolateAngleWidest = function(f,a,b,turn) {
	if(turn == null) turn = 360;
	return thx_Floats.wrapCircular(thx_Floats.interpolateAngle(f,a,b,turn) - turn / 2,turn);
};
thx_Floats.interpolateAngleCW = function(f,a,b,turn) {
	if(turn == null) turn = 360;
	a = thx_Floats.wrapCircular(a,turn);
	b = thx_Floats.wrapCircular(b,turn);
	if(b < a) b += turn;
	return thx_Floats.wrapCircular(thx_Floats.interpolate(f,a,b),turn);
};
thx_Floats.interpolateAngleCCW = function(f,a,b,turn) {
	if(turn == null) turn = 360;
	a = thx_Floats.wrapCircular(a,turn);
	b = thx_Floats.wrapCircular(b,turn);
	if(b > a) b -= turn;
	return thx_Floats.wrapCircular(thx_Floats.interpolate(f,a,b),turn);
};
thx_Floats.nearEquals = function(a,b) {
	return Math.abs(a - b) <= 10e-10;
};
thx_Floats.nearZero = function(n) {
	return Math.abs(n) <= 10e-10;
};
thx_Floats.normalize = function(v) {
	if(v < 0) return 0; else if(v > 1) return 1; else return v;
};
thx_Floats.parse = function(s) {
	if(s.substring(0,1) == "+") s = s.substring(1);
	return parseFloat(s);
};
thx_Floats.root = function(base,index) {
	return Math.pow(base,1 / index);
};
thx_Floats.roundTo = function(f,decimals) {
	var p = Math.pow(10,decimals);
	return Math.round(f * p) / p;
};
thx_Floats.sign = function(value) {
	if(value < 0) return -1; else return 1;
};
thx_Floats.wrap = function(v,min,max) {
	var range = max - min + 1;
	if(v < min) v += range * ((min - v) / range + 1);
	return min + (v - min) % range;
};
thx_Floats.wrapCircular = function(v,max) {
	v = v % max;
	if(v < 0) v += max;
	return v;
};
var thx_Functions0 = function() { };
thx_Functions0.__name__ = ["thx","Functions0"];
thx_Functions0.after = function(callback,n) {
	return function() {
		if(--n == 0) callback();
	};
};
thx_Functions0.join = function(fa,fb) {
	return function() {
		fa();
		fb();
	};
};
thx_Functions0.once = function(f) {
	return function() {
		var t = f;
		f = thx_Functions.noop;
		t();
	};
};
thx_Functions0.negate = function(callback) {
	return function() {
		return !callback();
	};
};
thx_Functions0.times = function(n,callback) {
	return function() {
		return thx_Ints.range(n).map(function(_) {
			return callback();
		});
	};
};
thx_Functions0.timesi = function(n,callback) {
	return function() {
		return thx_Ints.range(n).map(function(i) {
			return callback(i);
		});
	};
};
var thx_Functions1 = function() { };
thx_Functions1.__name__ = ["thx","Functions1"];
thx_Functions1.compose = function(fa,fb) {
	return function(v) {
		return fa(fb(v));
	};
};
thx_Functions1.join = function(fa,fb) {
	return function(v) {
		fa(v);
		fb(v);
	};
};
thx_Functions1.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v) {
		return "" + Std.string(v);
	};
	var map = new haxe_ds_StringMap();
	return function(v1) {
		var key = resolver(v1);
		if(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key)) return __map_reserved[key] != null?map.getReserved(key):map.h[key];
		var result = callback(v1);
		if(__map_reserved[key] != null) map.setReserved(key,result); else map.h[key] = result;
		return result;
	};
};
thx_Functions1.negate = function(callback) {
	return function(v) {
		return !callback(v);
	};
};
thx_Functions1.noop = function(_) {
};
thx_Functions1.times = function(n,callback) {
	return function(value) {
		return thx_Ints.range(n).map(function(_) {
			return callback(value);
		});
	};
};
thx_Functions1.timesi = function(n,callback) {
	return function(value) {
		return thx_Ints.range(n).map(function(i) {
			return callback(value,i);
		});
	};
};
thx_Functions1.swapArguments = function(callback) {
	return function(a2,a1) {
		return callback(a1,a2);
	};
};
var thx_Functions2 = function() { };
thx_Functions2.__name__ = ["thx","Functions2"];
thx_Functions2.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v1,v2) {
		return "" + Std.string(v1) + ":" + Std.string(v2);
	};
	var map = new haxe_ds_StringMap();
	return function(v11,v21) {
		var key = resolver(v11,v21);
		if(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key)) return __map_reserved[key] != null?map.getReserved(key):map.h[key];
		var result = callback(v11,v21);
		if(__map_reserved[key] != null) map.setReserved(key,result); else map.h[key] = result;
		return result;
	};
};
thx_Functions2.negate = function(callback) {
	return function(v1,v2) {
		return !callback(v1,v2);
	};
};
var thx_Functions3 = function() { };
thx_Functions3.__name__ = ["thx","Functions3"];
thx_Functions3.memoize = function(callback,resolver) {
	if(null == resolver) resolver = function(v1,v2,v3) {
		return "" + Std.string(v1) + ":" + Std.string(v2) + ":" + Std.string(v3);
	};
	var map = new haxe_ds_StringMap();
	return function(v11,v21,v31) {
		var key = resolver(v11,v21,v31);
		if(__map_reserved[key] != null?map.existsReserved(key):map.h.hasOwnProperty(key)) return __map_reserved[key] != null?map.getReserved(key):map.h[key];
		var result = callback(v11,v21,v31);
		if(__map_reserved[key] != null) map.setReserved(key,result); else map.h[key] = result;
		return result;
	};
};
thx_Functions3.negate = function(callback) {
	return function(v1,v2,v3) {
		return !callback(v1,v2,v3);
	};
};
var thx_Functions = function() { };
thx_Functions.__name__ = ["thx","Functions"];
thx_Functions.constant = function(v) {
	return function() {
		return v;
	};
};
thx_Functions.equality = function(a,b) {
	return a == b;
};
thx_Functions.identity = function(value) {
	return value;
};
thx_Functions.noop = function() {
};
var thx_Ints = function() { };
thx_Ints.__name__ = ["thx","Ints"];
thx_Ints.abs = function(v) {
	if(v < 0) return -v; else return v;
};
thx_Ints.canParse = function(s) {
	return thx_Ints.pattern_parse.match(s);
};
thx_Ints.clamp = function(v,min,max) {
	if(v < min) return min; else if(v > max) return max; else return v;
};
thx_Ints.clampSym = function(v,max) {
	return thx_Ints.clamp(v,-max,max);
};
thx_Ints.compare = function(a,b) {
	return a - b;
};
thx_Ints.interpolate = function(f,a,b) {
	return Math.round(a + (b - a) * f);
};
thx_Ints.isEven = function(v) {
	return v % 2 == 0;
};
thx_Ints.isOdd = function(v) {
	return v % 2 != 0;
};
thx_Ints.max = function(a,b) {
	if(a > b) return a; else return b;
};
thx_Ints.min = function(a,b) {
	if(a < b) return a; else return b;
};
thx_Ints.parse = function(s,base) {
	var v = parseInt(s,base);
	if(isNaN(v)) return null; else return v;
};
thx_Ints.random = function(min,max) {
	if(min == null) min = 0;
	return Std.random(max + 1) + min;
};
thx_Ints.range = function(start,stop,step) {
	if(step == null) step = 1;
	if(null == stop) {
		stop = start;
		start = 0;
	}
	if((stop - start) / step == Infinity) throw new js__$Boot_HaxeError("infinite range");
	var range = [];
	var i = -1;
	var j;
	if(step < 0) while((j = start + step * ++i) > stop) range.push(j); else while((j = start + step * ++i) < stop) range.push(j);
	return range;
};
thx_Ints.toString = function(value,base) {
	return value.toString(base);
};
thx_Ints.toBool = function(v) {
	return v != 0;
};
thx_Ints.sign = function(value) {
	if(value < 0) return -1; else return 1;
};
thx_Ints.wrapCircular = function(v,max) {
	v = v % max;
	if(v < 0) v += max;
	return v;
};
var thx_Iterators = function() { };
thx_Iterators.__name__ = ["thx","Iterators"];
thx_Iterators.all = function(it,predicate) {
	while( it.hasNext() ) {
		var item = it.next();
		if(!predicate(item)) return false;
	}
	return true;
};
thx_Iterators.any = function(it,predicate) {
	while( it.hasNext() ) {
		var item = it.next();
		if(predicate(item)) return true;
	}
	return false;
};
thx_Iterators.eachPair = function(it,handler) {
	thx_Arrays.eachPair(thx_Iterators.toArray(it),handler);
};
thx_Iterators.filter = function(it,predicate) {
	return thx_Iterators.reduce(it,function(acc,item) {
		if(predicate(item)) acc.push(item);
		return acc;
	},[]);
};
thx_Iterators.find = function(it,f) {
	while( it.hasNext() ) {
		var item = it.next();
		if(f(item)) return item;
	}
	return null;
};
thx_Iterators.first = function(it) {
	if(it.hasNext()) return it.next(); else return null;
};
thx_Iterators.isEmpty = function(it) {
	return !it.hasNext();
};
thx_Iterators.isIterator = function(v) {
	var fields;
	if(Reflect.isObject(v) && null == Type.getClass(v)) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"next") || !Lambda.has(fields,"hasNext")) return false;
	return Reflect.isFunction(Reflect.field(v,"next")) && Reflect.isFunction(Reflect.field(v,"hasNext"));
};
thx_Iterators.last = function(it) {
	var buf = null;
	while(it.hasNext()) buf = it.next();
	return buf;
};
thx_Iterators.map = function(it,f) {
	var acc = [];
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v));
	}
	return acc;
};
thx_Iterators.mapi = function(it,f) {
	var acc = [];
	var i = 0;
	while( it.hasNext() ) {
		var v = it.next();
		acc.push(f(v,i++));
	}
	return acc;
};
thx_Iterators.order = function(it,sort) {
	var n = thx_Iterators.toArray(it);
	n.sort(sort);
	return n;
};
thx_Iterators.reduce = function(it,callback,initial) {
	thx_Iterators.map(it,function(v) {
		initial = callback(initial,v);
	});
	return initial;
};
thx_Iterators.reducei = function(it,callback,initial) {
	thx_Iterators.mapi(it,function(v,i) {
		initial = callback(initial,v,i);
	});
	return initial;
};
thx_Iterators.toArray = function(it) {
	var items = [];
	while( it.hasNext() ) {
		var item = it.next();
		items.push(item);
	}
	return items;
};
var thx_Nil = { __ename__ : ["thx","Nil"], __constructs__ : ["nil"] };
thx_Nil.nil = ["nil",0];
thx_Nil.nil.toString = $estr;
thx_Nil.nil.__enum__ = thx_Nil;
var thx_Nulls = function() { };
thx_Nulls.__name__ = ["thx","Nulls"];
var thx_Options = function() { };
thx_Options.__name__ = ["thx","Options"];
thx_Options.equals = function(a,b,eq) {
	switch(a[1]) {
	case 1:
		switch(b[1]) {
		case 1:
			return true;
		default:
			return false;
		}
		break;
	case 0:
		switch(b[1]) {
		case 0:
			var a1 = a[2];
			var b1 = b[2];
			if(null == eq) eq = function(a2,b2) {
				return a2 == b2;
			};
			return eq(a1,b1);
		default:
			return false;
		}
		break;
	}
};
thx_Options.equalsValue = function(a,b,eq) {
	return thx_Options.equals(a,null == b?haxe_ds_Option.None:haxe_ds_Option.Some(b),eq);
};
thx_Options.flatMap = function(option,callback) {
	switch(option[1]) {
	case 1:
		return [];
	case 0:
		var v = option[2];
		return callback(v);
	}
};
thx_Options.map = function(option,callback) {
	switch(option[1]) {
	case 1:
		return haxe_ds_Option.None;
	case 0:
		var v = option[2];
		return haxe_ds_Option.Some(callback(v));
	}
};
thx_Options.toArray = function(option) {
	switch(option[1]) {
	case 1:
		return [];
	case 0:
		var v = option[2];
		return [v];
	}
};
thx_Options.toBool = function(option) {
	switch(option[1]) {
	case 1:
		return false;
	case 0:
		return true;
	}
};
thx_Options.toOption = function(value) {
	if(null == value) return haxe_ds_Option.None; else return haxe_ds_Option.Some(value);
};
thx_Options.toValue = function(option) {
	switch(option[1]) {
	case 1:
		return null;
	case 0:
		var v = option[2];
		return v;
	}
};
var thx__$Result_Result_$Impl_$ = {};
thx__$Result_Result_$Impl_$.__name__ = ["thx","_Result","Result_Impl_"];
thx__$Result_Result_$Impl_$.optionValue = function(this1) {
	switch(this1[1]) {
	case 1:
		var v = this1[2];
		return haxe_ds_Option.Some(v);
	default:
		return haxe_ds_Option.None;
	}
};
thx__$Result_Result_$Impl_$.optionError = function(this1) {
	switch(this1[1]) {
	case 0:
		var v = this1[2];
		return haxe_ds_Option.Some(v);
	default:
		return haxe_ds_Option.None;
	}
};
thx__$Result_Result_$Impl_$.value = function(this1) {
	switch(this1[1]) {
	case 1:
		var v = this1[2];
		return v;
	default:
		return null;
	}
};
thx__$Result_Result_$Impl_$.error = function(this1) {
	switch(this1[1]) {
	case 0:
		var v = this1[2];
		return v;
	default:
		return null;
	}
};
thx__$Result_Result_$Impl_$.get_isSuccess = function(this1) {
	switch(this1[1]) {
	case 1:
		return true;
	default:
		return false;
	}
};
thx__$Result_Result_$Impl_$.get_isFailure = function(this1) {
	switch(this1[1]) {
	case 0:
		return true;
	default:
		return false;
	}
};
var thx_Strings = function() { };
thx_Strings.__name__ = ["thx","Strings"];
thx_Strings.after = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return ""; else return value.substring(pos + searchFor.length);
};
thx_Strings.capitalize = function(s) {
	return s.substring(0,1).toUpperCase() + s.substring(1);
};
thx_Strings.capitalizeWords = function(value,whiteSpaceOnly) {
	if(whiteSpaceOnly == null) whiteSpaceOnly = false;
	if(whiteSpaceOnly) return thx_Strings.UCWORDSWS.map(value.substring(0,1).toUpperCase() + value.substring(1),thx_Strings.upperMatch); else return thx_Strings.UCWORDS.map(value.substring(0,1).toUpperCase() + value.substring(1),thx_Strings.upperMatch);
};
thx_Strings.collapse = function(value) {
	return thx_Strings.WSG.replace(StringTools.trim(value)," ");
};
thx_Strings.compare = function(a,b) {
	if(a < b) return -1; else if(a > b) return 1; else return 0;
};
thx_Strings.contains = function(s,test) {
	return s.indexOf(test) >= 0;
};
thx_Strings.dasherize = function(s) {
	return StringTools.replace(s,"_","-");
};
thx_Strings.ellipsis = function(s,maxlen,symbol) {
	if(symbol == null) symbol = "...";
	if(maxlen == null) maxlen = 20;
	if(s.length > maxlen) return s.substring(0,symbol.length > maxlen - symbol.length?symbol.length:maxlen - symbol.length) + symbol; else return s;
};
thx_Strings.filter = function(s,predicate) {
	return s.split("").filter(predicate).join("");
};
thx_Strings.filterCharcode = function(s,predicate) {
	return thx_Strings.toCharcodeArray(s).filter(predicate).map(function(i) {
		return String.fromCharCode(i);
	}).join("");
};
thx_Strings.from = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return ""; else return value.substring(pos);
};
thx_Strings.humanize = function(s) {
	return StringTools.replace(thx_Strings.underscore(s),"_"," ");
};
thx_Strings.isAlphaNum = function(value) {
	return thx_Strings.ALPHANUM.match(value);
};
thx_Strings.isLowerCase = function(value) {
	return value.toLowerCase() == value;
};
thx_Strings.isUpperCase = function(value) {
	return value.toUpperCase() == value;
};
thx_Strings.ifEmpty = function(value,alt) {
	if(null != value && "" != value) return value; else return alt;
};
thx_Strings.isDigitsOnly = function(value) {
	return thx_Strings.DIGITS.match(value);
};
thx_Strings.isEmpty = function(value) {
	return value == null || value == "";
};
thx_Strings.random = function(value,length) {
	if(length == null) length = 1;
	var pos = Math.floor((value.length - length + 1) * Math.random());
	return HxOverrides.substr(value,pos,length);
};
thx_Strings.iterator = function(s) {
	var _this = s.split("");
	return HxOverrides.iter(_this);
};
thx_Strings.map = function(value,callback) {
	return value.split("").map(callback);
};
thx_Strings.remove = function(value,toremove) {
	return StringTools.replace(value,toremove,"");
};
thx_Strings.removeAfter = function(value,toremove) {
	if(StringTools.endsWith(value,toremove)) return value.substring(0,value.length - toremove.length); else return value;
};
thx_Strings.removeBefore = function(value,toremove) {
	if(StringTools.startsWith(value,toremove)) return value.substring(toremove.length); else return value;
};
thx_Strings.repeat = function(s,times) {
	return ((function($this) {
		var $r;
		var _g = [];
		{
			var _g1 = 0;
			while(_g1 < times) {
				var i = _g1++;
				_g.push(s);
			}
		}
		$r = _g;
		return $r;
	}(this))).join("");
};
thx_Strings.reverse = function(s) {
	var arr = s.split("");
	arr.reverse();
	return arr.join("");
};
thx_Strings.stripTags = function(s) {
	return thx_Strings.STRIPTAGS.replace(s,"");
};
thx_Strings.surround = function(s,left,right) {
	return "" + left + s + (null == right?left:right);
};
thx_Strings.toArray = function(s) {
	return s.split("");
};
thx_Strings.toCharcodeArray = function(s) {
	return thx_Strings.map(s,function(s1) {
		return HxOverrides.cca(s1,0);
	});
};
thx_Strings.toChunks = function(s,len) {
	var chunks = [];
	while(s.length > 0) {
		chunks.push(s.substring(0,len));
		s = s.substring(len);
	}
	return chunks;
};
thx_Strings.trimChars = function(value,charlist) {
	return thx_Strings.trimCharsRight(thx_Strings.trimCharsLeft(value,charlist),charlist);
};
thx_Strings.trimCharsLeft = function(value,charlist) {
	var pos = 0;
	var _g1 = 0;
	var _g = value.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(thx_Strings.contains(charlist,value.charAt(i))) pos++; else break;
	}
	return value.substring(pos);
};
thx_Strings.trimCharsRight = function(value,charlist) {
	var len = value.length;
	var pos = len;
	var i;
	var _g = 0;
	while(_g < len) {
		var j = _g++;
		i = len - j - 1;
		if(thx_Strings.contains(charlist,value.charAt(i))) pos = i; else break;
	}
	return value.substring(0,pos);
};
thx_Strings.underscore = function(s) {
	s = new EReg("::","g").replace(s,"/");
	s = new EReg("([A-Z]+)([A-Z][a-z])","g").replace(s,"$1_$2");
	s = new EReg("([a-z\\d])([A-Z])","g").replace(s,"$1_$2");
	s = new EReg("-","g").replace(s,"_");
	return s.toLowerCase();
};
thx_Strings.upTo = function(value,searchFor) {
	var pos = value.indexOf(searchFor);
	if(pos < 0) return value; else return value.substring(0,pos);
};
thx_Strings.wrapColumns = function(s,columns,indent,newline) {
	if(newline == null) newline = "\n";
	if(indent == null) indent = "";
	if(columns == null) columns = 78;
	return thx_Strings.SPLIT_LINES.split(s).map(function(part) {
		return thx_Strings.wrapLine(StringTools.trim(thx_Strings.WSG.replace(part," ")),columns,indent,newline);
	}).join(newline);
};
thx_Strings.upperMatch = function(re) {
	return re.matched(0).toUpperCase();
};
thx_Strings.wrapLine = function(s,columns,indent,newline) {
	var parts = [];
	var pos = 0;
	var len = s.length;
	var ilen = indent.length;
	columns -= ilen;
	while(true) {
		if(pos + columns >= len - ilen) {
			parts.push(s.substring(pos));
			break;
		}
		var i = 0;
		while(!StringTools.isSpace(s,pos + columns - i) && i < columns) i++;
		if(i == columns) {
			i = 0;
			while(!StringTools.isSpace(s,pos + columns + i) && pos + columns + i < len) i++;
			parts.push(s.substring(pos,pos + columns + i));
			pos += columns + i + 1;
		} else {
			parts.push(s.substring(pos,pos + columns - i));
			pos += columns - i + 1;
		}
	}
	return indent + parts.join(newline + indent);
};
var thx_Timer = function() { };
thx_Timer.__name__ = ["thx","Timer"];
thx_Timer.debounce = function(callback,delayms,leading) {
	if(leading == null) leading = false;
	var cancel = thx_Functions.noop;
	var poll = function() {
		cancel();
		cancel = thx_Timer.delay(callback,delayms);
	};
	return function() {
		if(leading) {
			leading = false;
			callback();
		}
		poll();
	};
};
thx_Timer.throttle = function(callback,delayms,leading) {
	if(leading == null) leading = false;
	var waiting = false;
	var poll = function() {
		waiting = true;
		thx_Timer.delay(callback,delayms);
	};
	return function() {
		if(leading) {
			leading = false;
			callback();
			return;
		}
		if(waiting) return;
		poll();
	};
};
thx_Timer.repeat = function(callback,delayms) {
	return (function(f,id) {
		return function() {
			f(id);
		};
	})(thx_Timer.clear,setInterval(callback,delayms));
};
thx_Timer.delay = function(callback,delayms) {
	return (function(f,id) {
		return function() {
			f(id);
		};
	})(thx_Timer.clear,setTimeout(callback,delayms));
};
thx_Timer.frame = function(callback) {
	var cancelled = false;
	var f = thx_Functions.noop;
	var current = performance.now();
	var next;
	f = function() {
		if(cancelled) return;
		next = performance.now();
		callback(next - current);
		current = next;
		requestAnimationFrame(f);
	};
	requestAnimationFrame(f);
	return function() {
		cancelled = true;
	};
};
thx_Timer.nextFrame = function(callback) {
	var id = requestAnimationFrame(callback);
	return function() {
		cancelAnimationFrame(id);
	};
};
thx_Timer.immediate = function(callback) {
	return (function(f,id) {
		return function() {
			f(id);
		};
	})(thx_Timer.clear,setImmediate(callback));
};
thx_Timer.clear = function(id) {
	clearTimeout(id);
	return;
};
thx_Timer.time = function() {
	return performance.now();
};
var thx__$Tuple_Tuple0_$Impl_$ = {};
thx__$Tuple_Tuple0_$Impl_$.__name__ = ["thx","_Tuple","Tuple0_Impl_"];
thx__$Tuple_Tuple0_$Impl_$._new = function() {
	return thx_Nil.nil;
};
thx__$Tuple_Tuple0_$Impl_$["with"] = function(this1,v) {
	return v;
};
thx__$Tuple_Tuple0_$Impl_$.toString = function(this1) {
	return "Tuple0()";
};
thx__$Tuple_Tuple0_$Impl_$.toNil = function(this1) {
	return this1;
};
thx__$Tuple_Tuple0_$Impl_$.nilToTuple = function(v) {
	return thx_Nil.nil;
};
var thx__$Tuple_Tuple1_$Impl_$ = {};
thx__$Tuple_Tuple1_$Impl_$.__name__ = ["thx","_Tuple","Tuple1_Impl_"];
thx__$Tuple_Tuple1_$Impl_$._new = function(_0) {
	return _0;
};
thx__$Tuple_Tuple1_$Impl_$.get__0 = function(this1) {
	return this1;
};
thx__$Tuple_Tuple1_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1, _1 : v};
};
thx__$Tuple_Tuple1_$Impl_$.toString = function(this1) {
	return "Tuple1(" + Std.string(this1) + ")";
};
thx__$Tuple_Tuple1_$Impl_$.arrayToTuple = function(v) {
	return v[0];
};
var thx__$Tuple_Tuple2_$Impl_$ = {};
thx__$Tuple_Tuple2_$Impl_$.__name__ = ["thx","_Tuple","Tuple2_Impl_"];
thx__$Tuple_Tuple2_$Impl_$._new = function(_0,_1) {
	return { _0 : _0, _1 : _1};
};
thx__$Tuple_Tuple2_$Impl_$.get_left = function(this1) {
	return this1._0;
};
thx__$Tuple_Tuple2_$Impl_$.get_right = function(this1) {
	return this1._1;
};
thx__$Tuple_Tuple2_$Impl_$.flip = function(this1) {
	return { _0 : this1._1, _1 : this1._0};
};
thx__$Tuple_Tuple2_$Impl_$.dropLeft = function(this1) {
	return this1._1;
};
thx__$Tuple_Tuple2_$Impl_$.dropRight = function(this1) {
	return this1._0;
};
thx__$Tuple_Tuple2_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : v};
};
thx__$Tuple_Tuple2_$Impl_$.toString = function(this1) {
	return "Tuple2(" + Std.string(this1._0) + "," + Std.string(this1._1) + ")";
};
thx__$Tuple_Tuple2_$Impl_$.arrayToTuple2 = function(v) {
	return { _0 : v[0], _1 : v[1]};
};
var thx__$Tuple_Tuple3_$Impl_$ = {};
thx__$Tuple_Tuple3_$Impl_$.__name__ = ["thx","_Tuple","Tuple3_Impl_"];
thx__$Tuple_Tuple3_$Impl_$._new = function(_0,_1,_2) {
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx__$Tuple_Tuple3_$Impl_$.flip = function(this1) {
	return { _0 : this1._2, _1 : this1._1, _2 : this1._0};
};
thx__$Tuple_Tuple3_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2};
};
thx__$Tuple_Tuple3_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1};
};
thx__$Tuple_Tuple3_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : v};
};
thx__$Tuple_Tuple3_$Impl_$.toString = function(this1) {
	return "Tuple3(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + ")";
};
thx__$Tuple_Tuple3_$Impl_$.arrayToTuple3 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2]};
};
var thx__$Tuple_Tuple4_$Impl_$ = {};
thx__$Tuple_Tuple4_$Impl_$.__name__ = ["thx","_Tuple","Tuple4_Impl_"];
thx__$Tuple_Tuple4_$Impl_$._new = function(_0,_1,_2,_3) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx__$Tuple_Tuple4_$Impl_$.flip = function(this1) {
	return { _0 : this1._3, _1 : this1._2, _2 : this1._1, _3 : this1._0};
};
thx__$Tuple_Tuple4_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3};
};
thx__$Tuple_Tuple4_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2};
};
thx__$Tuple_Tuple4_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : v};
};
thx__$Tuple_Tuple4_$Impl_$.toString = function(this1) {
	return "Tuple4(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + ")";
};
thx__$Tuple_Tuple4_$Impl_$.arrayToTuple4 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2], _3 : v[3]};
};
var thx__$Tuple_Tuple5_$Impl_$ = {};
thx__$Tuple_Tuple5_$Impl_$.__name__ = ["thx","_Tuple","Tuple5_Impl_"];
thx__$Tuple_Tuple5_$Impl_$._new = function(_0,_1,_2,_3,_4) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4};
};
thx__$Tuple_Tuple5_$Impl_$.flip = function(this1) {
	return { _0 : this1._4, _1 : this1._3, _2 : this1._2, _3 : this1._1, _4 : this1._0};
};
thx__$Tuple_Tuple5_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3, _3 : this1._4};
};
thx__$Tuple_Tuple5_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3};
};
thx__$Tuple_Tuple5_$Impl_$["with"] = function(this1,v) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : v};
};
thx__$Tuple_Tuple5_$Impl_$.toString = function(this1) {
	return "Tuple5(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + ")";
};
thx__$Tuple_Tuple5_$Impl_$.arrayToTuple5 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2], _3 : v[3], _4 : v[4]};
};
var thx__$Tuple_Tuple6_$Impl_$ = {};
thx__$Tuple_Tuple6_$Impl_$.__name__ = ["thx","_Tuple","Tuple6_Impl_"];
thx__$Tuple_Tuple6_$Impl_$._new = function(_0,_1,_2,_3,_4,_5) {
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3, _4 : _4, _5 : _5};
};
thx__$Tuple_Tuple6_$Impl_$.flip = function(this1) {
	return { _0 : this1._5, _1 : this1._4, _2 : this1._3, _3 : this1._2, _4 : this1._1, _5 : this1._0};
};
thx__$Tuple_Tuple6_$Impl_$.dropLeft = function(this1) {
	return { _0 : this1._1, _1 : this1._2, _2 : this1._3, _3 : this1._4, _4 : this1._5};
};
thx__$Tuple_Tuple6_$Impl_$.dropRight = function(this1) {
	return { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4};
};
thx__$Tuple_Tuple6_$Impl_$.toString = function(this1) {
	return "Tuple6(" + Std.string(this1._0) + "," + Std.string(this1._1) + "," + Std.string(this1._2) + "," + Std.string(this1._3) + "," + Std.string(this1._4) + "," + Std.string(this1._5) + ")";
};
thx__$Tuple_Tuple6_$Impl_$.arrayToTuple6 = function(v) {
	return { _0 : v[0], _1 : v[1], _2 : v[2], _3 : v[3], _4 : v[4], _5 : v[5]};
};
var thx_Types = function() { };
thx_Types.__name__ = ["thx","Types"];
thx_Types.isAnonymousObject = function(v) {
	return Reflect.isObject(v) && null == Type.getClass(v);
};
thx_Types.isPrimitive = function(v) {
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 1:case 2:case 3:
			return true;
		case 0:case 5:case 7:case 4:case 8:
			return false;
		case 6:
			var c = _g[2];
			return Type.getClassName(c) == "String";
		}
	}
};
thx_Types.hasSuperClass = function(cls,sup) {
	while(null != cls) {
		if(cls == sup) return true;
		cls = Type.getSuperClass(cls);
	}
	return false;
};
thx_Types.sameType = function(a,b) {
	return thx_Types.typeToString(Type["typeof"](a)) == thx_Types.typeToString(Type["typeof"](b));
};
thx_Types.typeInheritance = function(type) {
	switch(type[1]) {
	case 1:
		return ["Int"];
	case 2:
		return ["Float"];
	case 3:
		return ["Bool"];
	case 4:
		return ["{}"];
	case 5:
		return ["Function"];
	case 6:
		var c = type[2];
		var classes = [];
		while(null != c) {
			classes.push(c);
			c = Type.getSuperClass(c);
		}
		return classes.map(Type.getClassName);
	case 7:
		var e = type[2];
		return [Type.getEnumName(e)];
	default:
		throw new js__$Boot_HaxeError("invalid type " + Std.string(type));
	}
};
thx_Types.typeToString = function(type) {
	switch(type[1]) {
	case 0:
		return "Null";
	case 1:
		return "Int";
	case 2:
		return "Float";
	case 3:
		return "Bool";
	case 4:
		return "{}";
	case 5:
		return "Function";
	case 6:
		var c = type[2];
		return Type.getClassName(c);
	case 7:
		var e = type[2];
		return Type.getEnumName(e);
	default:
		throw new js__$Boot_HaxeError("invalid type " + Std.string(type));
	}
};
thx_Types.valueTypeInheritance = function(value) {
	return thx_Types.typeInheritance(Type["typeof"](value));
};
thx_Types.valueTypeToString = function(value) {
	return thx_Types.typeToString(Type["typeof"](value));
};
var thx_color__$CIELCh_CIELCh_$Impl_$ = {};
thx_color__$CIELCh_CIELCh_$Impl_$.__name__ = ["thx","color","_CIELCh","CIELCh_Impl_"];
thx_color__$CIELCh_CIELCh_$Impl_$.create = function(lightness,chroma,hue) {
	var channels = [lightness,chroma,thx_Floats.wrapCircular(hue,360)];
	return channels;
};
thx_color__$CIELCh_CIELCh_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return thx_color__$CIELCh_CIELCh_$Impl_$.create(arr[0],arr[1],arr[2]);
};
thx_color__$CIELCh_CIELCh_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "cielch":
			return thx_color__$CIELCh_CIELCh_$Impl_$.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false));
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$CIELCh_CIELCh_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$CIELCh_CIELCh_$Impl_$.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx_color__$CIELCh_CIELCh_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$CIELCh_CIELCh_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$CIELCh_CIELCh_$Impl_$.complement = function(this1) {
	return thx_color__$CIELCh_CIELCh_$Impl_$.rotate(this1,180);
};
thx_color__$CIELCh_CIELCh_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolateAngle(t,this1[2],other[2],360)];
	return channels;
};
thx_color__$CIELCh_CIELCh_$Impl_$.rotate = function(this1,angle) {
	return thx_color__$CIELCh_CIELCh_$Impl_$.withHue(this1,this1[2] + angle);
};
thx_color__$CIELCh_CIELCh_$Impl_$.split = function(this1,spread) {
	if(spread == null) spread = 144.0;
	var _0 = thx_color__$CIELCh_CIELCh_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$CIELCh_CIELCh_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$CIELCh_CIELCh_$Impl_$.square = function(this1) {
	return thx_color__$CIELCh_CIELCh_$Impl_$.tetrad(this1,90);
};
thx_color__$CIELCh_CIELCh_$Impl_$.tetrad = function(this1,angle) {
	var _0 = thx_color__$CIELCh_CIELCh_$Impl_$.rotate(this1,0);
	var _1 = thx_color__$CIELCh_CIELCh_$Impl_$.rotate(this1,angle);
	var _2 = thx_color__$CIELCh_CIELCh_$Impl_$.rotate(this1,180);
	var _3 = thx_color__$CIELCh_CIELCh_$Impl_$.rotate(this1,180 + angle);
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx_color__$CIELCh_CIELCh_$Impl_$.triad = function(this1) {
	var _0 = thx_color__$CIELCh_CIELCh_$Impl_$.rotate(this1,-120);
	var _1 = thx_color__$CIELCh_CIELCh_$Impl_$.rotate(this1,0);
	var _2 = thx_color__$CIELCh_CIELCh_$Impl_$.rotate(this1,120);
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx_color__$CIELCh_CIELCh_$Impl_$.withLightness = function(this1,newlightness) {
	return [newlightness,this1[1],this1[2]];
};
thx_color__$CIELCh_CIELCh_$Impl_$.withChroma = function(this1,newchroma) {
	return [this1[0],newchroma,this1[2]];
};
thx_color__$CIELCh_CIELCh_$Impl_$.withHue = function(this1,newhue) {
	var channels = [this1[0],this1[1],thx_Floats.wrapCircular(newhue,360)];
	return channels;
};
thx_color__$CIELCh_CIELCh_$Impl_$.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10;
};
thx_color__$CIELCh_CIELCh_$Impl_$.toString = function(this1) {
	return "CIELCh(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$CIELCh_CIELCh_$Impl_$.toCIELab = function(this1) {
	var hradi = this1[2] * (Math.PI / 180);
	var a = Math.cos(hradi) * this1[1];
	var b = Math.sin(hradi) * this1[1];
	return [this1[0],a,b];
};
thx_color__$CIELCh_CIELCh_$Impl_$.toCMY = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMY(thx_color__$CIELCh_CIELCh_$Impl_$.toRGBX(this1));
};
thx_color__$CIELCh_CIELCh_$Impl_$.toCMYK = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMYK(thx_color__$CIELCh_CIELCh_$Impl_$.toRGBX(this1));
};
thx_color__$CIELCh_CIELCh_$Impl_$.toGrey = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toGrey(thx_color__$CIELCh_CIELCh_$Impl_$.toRGBX(this1));
};
thx_color__$CIELCh_CIELCh_$Impl_$.toHSL = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSL(thx_color__$CIELCh_CIELCh_$Impl_$.toRGBX(this1));
};
thx_color__$CIELCh_CIELCh_$Impl_$.toHSV = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSV(thx_color__$CIELCh_CIELCh_$Impl_$.toRGBX(this1));
};
thx_color__$CIELCh_CIELCh_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGB(thx_color__$CIELCh_CIELCh_$Impl_$.toRGBX(this1));
};
thx_color__$CIELCh_CIELCh_$Impl_$.toRGBA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$CIELCh_CIELCh_$Impl_$.toRGBXA(this1));
};
thx_color__$CIELCh_CIELCh_$Impl_$.toRGBX = function(this1) {
	return thx_color__$CIELab_CIELab_$Impl_$.toRGBX(thx_color__$CIELCh_CIELCh_$Impl_$.toCIELab(this1));
};
thx_color__$CIELCh_CIELCh_$Impl_$.toRGBXA = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGBXA(thx_color__$CIELCh_CIELCh_$Impl_$.toRGBX(this1));
};
thx_color__$CIELCh_CIELCh_$Impl_$.toXYZ = function(this1) {
	return thx_color__$CIELab_CIELab_$Impl_$.toXYZ(thx_color__$CIELCh_CIELCh_$Impl_$.toCIELab(this1));
};
thx_color__$CIELCh_CIELCh_$Impl_$.toYxy = function(this1) {
	return thx_color__$CIELab_CIELab_$Impl_$.toYxy(thx_color__$CIELCh_CIELCh_$Impl_$.toCIELab(this1));
};
thx_color__$CIELCh_CIELCh_$Impl_$.get_lightness = function(this1) {
	return this1[0];
};
thx_color__$CIELCh_CIELCh_$Impl_$.get_chroma = function(this1) {
	return this1[1];
};
thx_color__$CIELCh_CIELCh_$Impl_$.get_hue = function(this1) {
	return this1[2];
};
var thx_color__$CIELab_CIELab_$Impl_$ = {};
thx_color__$CIELab_CIELab_$Impl_$.__name__ = ["thx","color","_CIELab","CIELab_Impl_"];
thx_color__$CIELab_CIELab_$Impl_$.create = function(l,a,b) {
	return [l,a,b];
};
thx_color__$CIELab_CIELab_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return thx_color__$CIELab_CIELab_$Impl_$.create(arr[0],arr[1],arr[2]);
};
thx_color__$CIELab_CIELab_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "cielab":
			return thx_color__$CIELab_CIELab_$Impl_$.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3,false));
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$CIELab_CIELab_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$CIELab_CIELab_$Impl_$.distance = function(this1,other) {
	return (this1[0] - other[0]) * (this1[0] - other[0]) + (this1[1] - other[1]) * (this1[1] - other[1]) + (this1[2] - other[2]) * (this1[2] - other[2]);
};
thx_color__$CIELab_CIELab_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$CIELab_CIELab_$Impl_$.darker = function(this1,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],0),this1[1],this1[2]];
	return channels;
};
thx_color__$CIELab_CIELab_$Impl_$.lighter = function(this1,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],100),this1[1],this1[2]];
	return channels;
};
thx_color__$CIELab_CIELab_$Impl_$.match = function(this1,palette) {
	var it = palette;
	if(null == it) throw new thx_error_NullArgument("Iterable argument \"this\" cannot be null",{ fileName : "NullArgument.hx", lineNumber : 73, className : "thx.color._CIELab.CIELab_Impl_", methodName : "match"}); else if(!$iterator(it)().hasNext()) throw new thx_error_NullArgument("Iterable argument \"this\" cannot be empty",{ fileName : "NullArgument.hx", lineNumber : 75, className : "thx.color._CIELab.CIELab_Impl_", methodName : "match"});
	var dist = Infinity;
	var closest = null;
	var $it0 = $iterator(palette)();
	while( $it0.hasNext() ) {
		var color = $it0.next();
		var ndist = thx_color__$CIELab_CIELab_$Impl_$.distance(this1,color);
		if(ndist < dist) {
			dist = ndist;
			closest = color;
		}
	}
	return closest;
};
thx_color__$CIELab_CIELab_$Impl_$.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10;
};
thx_color__$CIELab_CIELab_$Impl_$.withLightness = function(this1,lightness) {
	return [lightness,this1[1],this1[2]];
};
thx_color__$CIELab_CIELab_$Impl_$.withA = function(this1,newa) {
	return [this1[0],newa,this1[2]];
};
thx_color__$CIELab_CIELab_$Impl_$.withB = function(this1,newb) {
	return [this1[0],this1[1],newb];
};
thx_color__$CIELab_CIELab_$Impl_$.toString = function(this1) {
	return "CIELab(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$CIELab_CIELab_$Impl_$.toCIELCh = function(this1) {
	var h = thx_Floats.wrapCircular(Math.atan2(this1[2],this1[1]) * 180 / Math.PI,360);
	var c = Math.sqrt(this1[1] * this1[1] + this1[2] * this1[2]);
	return [this1[0],c,h];
};
thx_color__$CIELab_CIELab_$Impl_$.toCMY = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMY(thx_color__$CIELab_CIELab_$Impl_$.toRGBX(this1));
};
thx_color__$CIELab_CIELab_$Impl_$.toCMYK = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMYK(thx_color__$CIELab_CIELab_$Impl_$.toRGBX(this1));
};
thx_color__$CIELab_CIELab_$Impl_$.toGrey = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toGrey(thx_color__$CIELab_CIELab_$Impl_$.toRGBX(this1));
};
thx_color__$CIELab_CIELab_$Impl_$.toHSL = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSL(thx_color__$CIELab_CIELab_$Impl_$.toRGBX(this1));
};
thx_color__$CIELab_CIELab_$Impl_$.toHSV = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSV(thx_color__$CIELab_CIELab_$Impl_$.toRGBX(this1));
};
thx_color__$CIELab_CIELab_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGB(thx_color__$CIELab_CIELab_$Impl_$.toRGBX(this1));
};
thx_color__$CIELab_CIELab_$Impl_$.toRGBA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$CIELab_CIELab_$Impl_$.toRGBXA(this1));
};
thx_color__$CIELab_CIELab_$Impl_$.toRGBX = function(this1) {
	return thx_color__$XYZ_XYZ_$Impl_$.toRGBX(thx_color__$CIELab_CIELab_$Impl_$.toXYZ(this1));
};
thx_color__$CIELab_CIELab_$Impl_$.toRGBXA = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGBXA(thx_color__$CIELab_CIELab_$Impl_$.toRGBX(this1));
};
thx_color__$CIELab_CIELab_$Impl_$.toXYZ = function(this1) {
	var y = (this1[0] + 16) / 116;
	var x = this1[1] / 500 + y;
	var z = y - this1[2] / 200;
	var p;
	p = Math.pow(y,3);
	if(p > 0.008856) y = p; else y = (y - 0.137931034482758619) / 7.787;
	p = Math.pow(x,3);
	if(p > 0.008856) x = p; else x = (x - 0.137931034482758619) / 7.787;
	p = Math.pow(z,3);
	if(p > 0.008856) z = p; else z = (z - 0.137931034482758619) / 7.787;
	return [95.047 * x,100 * y,108.883 * z];
};
thx_color__$CIELab_CIELab_$Impl_$.toYxy = function(this1) {
	return thx_color__$XYZ_XYZ_$Impl_$.toYxy(thx_color__$CIELab_CIELab_$Impl_$.toXYZ(this1));
};
thx_color__$CIELab_CIELab_$Impl_$.get_l = function(this1) {
	return this1[0];
};
thx_color__$CIELab_CIELab_$Impl_$.get_a = function(this1) {
	return this1[1];
};
thx_color__$CIELab_CIELab_$Impl_$.get_b = function(this1) {
	return this1[2];
};
var thx_color__$CMY_CMY_$Impl_$ = {};
thx_color__$CMY_CMY_$Impl_$.__name__ = ["thx","color","_CMY","CMY_Impl_"];
thx_color__$CMY_CMY_$Impl_$.create = function(cyan,magenta,yellow) {
	return [cyan < 0?0:cyan > 1?1:cyan,magenta < 0?0:magenta > 1?1:magenta,yellow < 0?0:yellow > 1?1:yellow];
};
thx_color__$CMY_CMY_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return thx_color__$CMY_CMY_$Impl_$.create(arr[0],arr[1],arr[2]);
};
thx_color__$CMY_CMY_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "cmy":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$CMY_CMY_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$CMY_CMY_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$CMY_CMY_$Impl_$.withCyan = function(this1,newcyan) {
	return [newcyan < 0?0:newcyan > 1?1:newcyan,this1[1],this1[2]];
};
thx_color__$CMY_CMY_$Impl_$.withMagenta = function(this1,newmagenta) {
	return [this1[0],newmagenta < 0?0:newmagenta > 1?1:newmagenta,this1[2]];
};
thx_color__$CMY_CMY_$Impl_$.withYellow = function(this1,newyellow) {
	return [this1[0],this1[1],newyellow < 0?0:newyellow > 1?1:newyellow];
};
thx_color__$CMY_CMY_$Impl_$.toString = function(this1) {
	return "cmy(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$CMY_CMY_$Impl_$.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10;
};
thx_color__$CMY_CMY_$Impl_$.toCIELab = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCIELab(thx_color__$CMY_CMY_$Impl_$.toRGBX(this1));
};
thx_color__$CMY_CMY_$Impl_$.toCIELCh = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCIELCh(thx_color__$CMY_CMY_$Impl_$.toRGBX(this1));
};
thx_color__$CMY_CMY_$Impl_$.toCMYK = function(this1) {
	var k = Math.min(Math.min(this1[0],this1[1]),this1[2]);
	if(k == 1) return [0,0,0,1]; else return [(this1[0] - k) / (1 - k),(this1[1] - k) / (1 - k),(this1[2] - k) / (1 - k),k];
};
thx_color__$CMY_CMY_$Impl_$.toGrey = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toGrey(thx_color__$CMY_CMY_$Impl_$.toRGBX(this1));
};
thx_color__$CMY_CMY_$Impl_$.toHSL = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSL(thx_color__$CMY_CMY_$Impl_$.toRGBX(this1));
};
thx_color__$CMY_CMY_$Impl_$.toHSV = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSV(thx_color__$CMY_CMY_$Impl_$.toRGBX(this1));
};
thx_color__$CMY_CMY_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGB(thx_color__$CMY_CMY_$Impl_$.toRGBX(this1));
};
thx_color__$CMY_CMY_$Impl_$.toRGBA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$CMY_CMY_$Impl_$.toRGBXA(this1));
};
thx_color__$CMY_CMY_$Impl_$.toRGBX = function(this1) {
	return [1 - this1[0],1 - this1[1],1 - this1[2]];
};
thx_color__$CMY_CMY_$Impl_$.toRGBXA = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGBXA(thx_color__$CMY_CMY_$Impl_$.toRGBX(this1));
};
thx_color__$CMY_CMY_$Impl_$.toXYZ = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toXYZ(thx_color__$CMY_CMY_$Impl_$.toRGBX(this1));
};
thx_color__$CMY_CMY_$Impl_$.toYxy = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toYxy(thx_color__$CMY_CMY_$Impl_$.toRGBX(this1));
};
thx_color__$CMY_CMY_$Impl_$.get_cyan = function(this1) {
	return this1[0];
};
thx_color__$CMY_CMY_$Impl_$.get_magenta = function(this1) {
	return this1[1];
};
thx_color__$CMY_CMY_$Impl_$.get_yellow = function(this1) {
	return this1[2];
};
var thx_color__$CMYK_CMYK_$Impl_$ = {};
thx_color__$CMYK_CMYK_$Impl_$.__name__ = ["thx","color","_CMYK","CMYK_Impl_"];
thx_color__$CMYK_CMYK_$Impl_$.create = function(cyan,magenta,yellow,black) {
	return [cyan < 0?0:cyan > 1?1:cyan,magenta < 0?0:magenta > 1?1:magenta,yellow < 0?0:yellow > 1?1:yellow,black < 0?0:black > 1?1:black];
};
thx_color__$CMYK_CMYK_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,4);
	return thx_color__$CMYK_CMYK_$Impl_$.create(arr[0],arr[1],arr[2],arr[3]);
};
thx_color__$CMYK_CMYK_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "cmyk":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,4);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$CMYK_CMYK_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$CMYK_CMYK_$Impl_$.darker = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Floats.interpolate(t,this1[3],1)];
	return channels;
};
thx_color__$CMYK_CMYK_$Impl_$.lighter = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Floats.interpolate(t,this1[3],0)];
	return channels;
};
thx_color__$CMYK_CMYK_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2]),thx_Floats.interpolate(t,this1[3],other[3])];
	return channels;
};
thx_color__$CMYK_CMYK_$Impl_$.withCyan = function(this1,newcyan) {
	return [newcyan < 0?0:newcyan > 1?1:newcyan,this1[1],this1[2],this1[3]];
};
thx_color__$CMYK_CMYK_$Impl_$.withMagenta = function(this1,newmagenta) {
	return [this1[0],newmagenta < 0?0:newmagenta > 1?1:newmagenta,this1[2],this1[3]];
};
thx_color__$CMYK_CMYK_$Impl_$.withYellow = function(this1,newyellow) {
	return [this1[0],this1[1],newyellow < 0?0:newyellow > 1?1:newyellow,this1[3]];
};
thx_color__$CMYK_CMYK_$Impl_$.withBlack = function(this1,newblack) {
	return [this1[0],this1[1],this1[2],newblack < 0?0:newblack > 1?1:newblack];
};
thx_color__$CMYK_CMYK_$Impl_$.toString = function(this1) {
	return "cmyk(" + this1[0] + "," + this1[1] + "," + this1[2] + "," + this1[3] + ")";
};
thx_color__$CMYK_CMYK_$Impl_$.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10 && Math.abs(this1[3] - other[3]) <= 10e-10;
};
thx_color__$CMYK_CMYK_$Impl_$.toCIELab = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCIELab(thx_color__$CMYK_CMYK_$Impl_$.toRGBX(this1));
};
thx_color__$CMYK_CMYK_$Impl_$.toCIELCh = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCIELCh(thx_color__$CMYK_CMYK_$Impl_$.toRGBX(this1));
};
thx_color__$CMYK_CMYK_$Impl_$.toCMY = function(this1) {
	return [this1[3] + (1 - this1[3]) * this1[0],this1[3] + (1 - this1[3]) * this1[1],this1[3] + (1 - this1[3]) * this1[2]];
};
thx_color__$CMYK_CMYK_$Impl_$.toGrey = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toGrey(thx_color__$CMYK_CMYK_$Impl_$.toRGBX(this1));
};
thx_color__$CMYK_CMYK_$Impl_$.toHSL = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSL(thx_color__$CMYK_CMYK_$Impl_$.toRGBX(this1));
};
thx_color__$CMYK_CMYK_$Impl_$.toHSV = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSV(thx_color__$CMYK_CMYK_$Impl_$.toRGBX(this1));
};
thx_color__$CMYK_CMYK_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGB(thx_color__$CMYK_CMYK_$Impl_$.toRGBX(this1));
};
thx_color__$CMYK_CMYK_$Impl_$.toRGBA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$CMYK_CMYK_$Impl_$.toRGBXA(this1));
};
thx_color__$CMYK_CMYK_$Impl_$.toRGBX = function(this1) {
	return [(1 - this1[3]) * (1 - this1[0]),(1 - this1[3]) * (1 - this1[1]),(1 - this1[3]) * (1 - this1[2])];
};
thx_color__$CMYK_CMYK_$Impl_$.toRGBXA = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGBXA(thx_color__$CMYK_CMYK_$Impl_$.toRGBX(this1));
};
thx_color__$CMYK_CMYK_$Impl_$.get_cyan = function(this1) {
	return this1[0];
};
thx_color__$CMYK_CMYK_$Impl_$.get_magenta = function(this1) {
	return this1[1];
};
thx_color__$CMYK_CMYK_$Impl_$.get_yellow = function(this1) {
	return this1[2];
};
thx_color__$CMYK_CMYK_$Impl_$.get_black = function(this1) {
	return this1[3];
};
thx_color__$CMYK_CMYK_$Impl_$.toXYZ = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toXYZ(thx_color__$CMYK_CMYK_$Impl_$.toRGBX(this1));
};
thx_color__$CMYK_CMYK_$Impl_$.toYxy = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toYxy(thx_color__$CMYK_CMYK_$Impl_$.toRGBX(this1));
};
var thx_color__$Grey_Grey_$Impl_$ = {};
thx_color__$Grey_Grey_$Impl_$.__name__ = ["thx","color","_Grey","Grey_Impl_"];
thx_color__$Grey_Grey_$Impl_$.create = function(v) {
	return v < 0?0:v > 1?1:v;
};
thx_color__$Grey_Grey_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "grey":case "gray":
			var grey = thx_color_parse_ColorParser.getFloatChannels(info.channels,1)[0];
			return grey;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Grey_Grey_$Impl_$._new = function(grey) {
	return grey;
};
thx_color__$Grey_Grey_$Impl_$.contrast = function(this1) {
	if(this1 > 0.5) return thx_color__$Grey_Grey_$Impl_$.black; else return thx_color__$Grey_Grey_$Impl_$.white;
};
thx_color__$Grey_Grey_$Impl_$.darker = function(this1,t) {
	var grey = thx_Floats.interpolate(t,this1,0);
	return grey;
};
thx_color__$Grey_Grey_$Impl_$.lighter = function(this1,t) {
	var grey = thx_Floats.interpolate(t,this1,1);
	return grey;
};
thx_color__$Grey_Grey_$Impl_$.interpolate = function(this1,other,t) {
	var grey = thx_Floats.interpolate(t,this1,other);
	return grey;
};
thx_color__$Grey_Grey_$Impl_$.toString = function(this1) {
	return "grey(" + this1 * 100 + "%)";
};
thx_color__$Grey_Grey_$Impl_$.equals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx_color__$Grey_Grey_$Impl_$.get_grey = function(this1) {
	return this1;
};
thx_color__$Grey_Grey_$Impl_$.toCIELab = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCIELab(thx_color__$Grey_Grey_$Impl_$.toRGBX(this1));
};
thx_color__$Grey_Grey_$Impl_$.toCIELCh = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCIELCh(thx_color__$Grey_Grey_$Impl_$.toRGBX(this1));
};
thx_color__$Grey_Grey_$Impl_$.toCMY = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMY(thx_color__$Grey_Grey_$Impl_$.toRGBX(this1));
};
thx_color__$Grey_Grey_$Impl_$.toCMYK = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMYK(thx_color__$Grey_Grey_$Impl_$.toRGBX(this1));
};
thx_color__$Grey_Grey_$Impl_$.toHSL = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSL(thx_color__$Grey_Grey_$Impl_$.toRGBX(this1));
};
thx_color__$Grey_Grey_$Impl_$.toHSV = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSV(thx_color__$Grey_Grey_$Impl_$.toRGBX(this1));
};
thx_color__$Grey_Grey_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGB(thx_color__$Grey_Grey_$Impl_$.toRGBX(this1));
};
thx_color__$Grey_Grey_$Impl_$.toRGBA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$Grey_Grey_$Impl_$.toRGBXA(this1));
};
thx_color__$Grey_Grey_$Impl_$.toRGBX = function(this1) {
	return [this1,this1,this1];
};
thx_color__$Grey_Grey_$Impl_$.toRGBXA = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGBXA(thx_color__$Grey_Grey_$Impl_$.toRGBX(this1));
};
thx_color__$Grey_Grey_$Impl_$.toXYZ = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toXYZ(thx_color__$Grey_Grey_$Impl_$.toRGBX(this1));
};
thx_color__$Grey_Grey_$Impl_$.toYxy = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toYxy(thx_color__$Grey_Grey_$Impl_$.toRGBX(this1));
};
var thx_color__$HSL_HSL_$Impl_$ = {};
thx_color__$HSL_HSL_$Impl_$.__name__ = ["thx","color","_HSL","HSL_Impl_"];
thx_color__$HSL_HSL_$Impl_$.create = function(hue,saturation,lightness) {
	var channels = [thx_Floats.wrapCircular(hue,360),saturation < 0?0:saturation > 1?1:saturation,lightness < 0?0:lightness > 1?1:lightness];
	return channels;
};
thx_color__$HSL_HSL_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return thx_color__$HSL_HSL_$Impl_$.create(arr[0],arr[1],arr[2]);
};
thx_color__$HSL_HSL_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "hsl":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$HSL_HSL_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$HSL_HSL_$Impl_$.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx_color__$HSL_HSL_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$HSL_HSL_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$HSL_HSL_$Impl_$.complement = function(this1) {
	return thx_color__$HSL_HSL_$Impl_$.rotate(this1,180);
};
thx_color__$HSL_HSL_$Impl_$.darker = function(this1,t) {
	var channels = [this1[0],this1[1],thx_Floats.interpolate(t,this1[2],0)];
	return channels;
};
thx_color__$HSL_HSL_$Impl_$.lighter = function(this1,t) {
	var channels = [this1[0],this1[1],thx_Floats.interpolate(t,this1[2],1)];
	return channels;
};
thx_color__$HSL_HSL_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolateAngle(t,this1[0],other[0],360),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$HSL_HSL_$Impl_$.rotate = function(this1,angle) {
	return thx_color__$HSL_HSL_$Impl_$.withHue(this1,this1[0] + angle);
};
thx_color__$HSL_HSL_$Impl_$.split = function(this1,spread) {
	if(spread == null) spread = 144.0;
	var _0 = thx_color__$HSL_HSL_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$HSL_HSL_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$HSL_HSL_$Impl_$.square = function(this1) {
	return thx_color__$HSL_HSL_$Impl_$.tetrad(this1,90);
};
thx_color__$HSL_HSL_$Impl_$.tetrad = function(this1,angle) {
	var _0 = thx_color__$HSL_HSL_$Impl_$.rotate(this1,0);
	var _1 = thx_color__$HSL_HSL_$Impl_$.rotate(this1,angle);
	var _2 = thx_color__$HSL_HSL_$Impl_$.rotate(this1,180);
	var _3 = thx_color__$HSL_HSL_$Impl_$.rotate(this1,180 + angle);
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx_color__$HSL_HSL_$Impl_$.triad = function(this1) {
	var _0 = thx_color__$HSL_HSL_$Impl_$.rotate(this1,-120);
	var _1 = thx_color__$HSL_HSL_$Impl_$.rotate(this1,0);
	var _2 = thx_color__$HSL_HSL_$Impl_$.rotate(this1,120);
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx_color__$HSL_HSL_$Impl_$.withAlpha = function(this1,alpha) {
	var channels = this1.concat([alpha < 0?0:alpha > 1?1:alpha]);
	return channels;
};
thx_color__$HSL_HSL_$Impl_$.withHue = function(this1,newhue) {
	var channels = [thx_Floats.wrapCircular(newhue,360),this1[1],this1[2]];
	return channels;
};
thx_color__$HSL_HSL_$Impl_$.withLightness = function(this1,newlightness) {
	return [this1[0],this1[1],newlightness < 0?0:newlightness > 1?1:newlightness];
};
thx_color__$HSL_HSL_$Impl_$.withSaturation = function(this1,newsaturation) {
	return [this1[0],newsaturation < 0?0:newsaturation > 1?1:newsaturation,this1[2]];
};
thx_color__$HSL_HSL_$Impl_$.toCSS3 = function(this1) {
	return thx_color__$HSL_HSL_$Impl_$.toString(this1);
};
thx_color__$HSL_HSL_$Impl_$.toString = function(this1) {
	return "hsl(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%)";
};
thx_color__$HSL_HSL_$Impl_$.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10;
};
thx_color__$HSL_HSL_$Impl_$.toCIELab = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCIELab(thx_color__$HSL_HSL_$Impl_$.toRGBX(this1));
};
thx_color__$HSL_HSL_$Impl_$.toCIELCh = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCIELCh(thx_color__$HSL_HSL_$Impl_$.toRGBX(this1));
};
thx_color__$HSL_HSL_$Impl_$.toCMY = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMY(thx_color__$HSL_HSL_$Impl_$.toRGBX(this1));
};
thx_color__$HSL_HSL_$Impl_$.toCMYK = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMYK(thx_color__$HSL_HSL_$Impl_$.toRGBX(this1));
};
thx_color__$HSL_HSL_$Impl_$.toGrey = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toGrey(thx_color__$HSL_HSL_$Impl_$.toRGBX(this1));
};
thx_color__$HSL_HSL_$Impl_$.toHSV = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSV(thx_color__$HSL_HSL_$Impl_$.toRGBX(this1));
};
thx_color__$HSL_HSL_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGB(thx_color__$HSL_HSL_$Impl_$.toRGBX(this1));
};
thx_color__$HSL_HSL_$Impl_$.toRGBA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$HSL_HSL_$Impl_$.toRGBXA(this1));
};
thx_color__$HSL_HSL_$Impl_$.toRGBX = function(this1) {
	var channels = [thx_color__$HSL_HSL_$Impl_$._c(this1[0] + 120,this1[1],this1[2]),thx_color__$HSL_HSL_$Impl_$._c(this1[0],this1[1],this1[2]),thx_color__$HSL_HSL_$Impl_$._c(this1[0] - 120,this1[1],this1[2])];
	return channels;
};
thx_color__$HSL_HSL_$Impl_$.toRGBXA = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGBXA(thx_color__$HSL_HSL_$Impl_$.toRGBX(this1));
};
thx_color__$HSL_HSL_$Impl_$.toHSLA = function(this1) {
	return thx_color__$HSL_HSL_$Impl_$.withAlpha(this1,1.0);
};
thx_color__$HSL_HSL_$Impl_$.toXYZ = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toXYZ(thx_color__$HSL_HSL_$Impl_$.toRGBX(this1));
};
thx_color__$HSL_HSL_$Impl_$.toYxy = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toYxy(thx_color__$HSL_HSL_$Impl_$.toRGBX(this1));
};
thx_color__$HSL_HSL_$Impl_$.get_hue = function(this1) {
	return this1[0];
};
thx_color__$HSL_HSL_$Impl_$.get_saturation = function(this1) {
	return this1[1];
};
thx_color__$HSL_HSL_$Impl_$.get_lightness = function(this1) {
	return this1[2];
};
thx_color__$HSL_HSL_$Impl_$._c = function(d,s,l) {
	var m2;
	if(l <= 0.5) m2 = l * (1 + s); else m2 = l + s - l * s;
	var m1 = 2 * l - m2;
	d = thx_Floats.wrapCircular(d,360);
	if(d < 60) return m1 + (m2 - m1) * d / 60; else if(d < 180) return m2; else if(d < 240) return m1 + (m2 - m1) * (240 - d) / 60; else return m1;
};
var thx_color__$HSLA_HSLA_$Impl_$ = {};
thx_color__$HSLA_HSLA_$Impl_$.__name__ = ["thx","color","_HSLA","HSLA_Impl_"];
thx_color__$HSLA_HSLA_$Impl_$.create = function(hue,saturation,lightness,alpha) {
	var channels = [thx_Floats.wrapCircular(hue,360),saturation < 0?0:saturation > 1?1:saturation,lightness < 0?0:lightness > 1?1:lightness,alpha < 0?0:alpha > 1?1:alpha];
	return channels;
};
thx_color__$HSLA_HSLA_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,4);
	return thx_color__$HSLA_HSLA_$Impl_$.create(arr[0],arr[1],arr[2],arr[3]);
};
thx_color__$HSLA_HSLA_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "hsl":
			return thx_color__$HSL_HSL_$Impl_$.toHSLA((function($this) {
				var $r;
				var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3);
				$r = channels;
				return $r;
			}(this)));
		case "hsla":
			var channels1 = thx_color_parse_ColorParser.getFloatChannels(info.channels,4);
			return channels1;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$HSLA_HSLA_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$HSLA_HSLA_$Impl_$.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx_color__$HSLA_HSLA_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$HSLA_HSLA_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$HSLA_HSLA_$Impl_$.complement = function(this1) {
	return thx_color__$HSLA_HSLA_$Impl_$.rotate(this1,180);
};
thx_color__$HSLA_HSLA_$Impl_$.darker = function(this1,t) {
	var channels = [this1[0],this1[1],thx_Floats.interpolate(t,this1[2],0),this1[3]];
	return channels;
};
thx_color__$HSLA_HSLA_$Impl_$.lighter = function(this1,t) {
	var channels = [this1[0],this1[1],thx_Floats.interpolate(t,this1[2],1),this1[3]];
	return channels;
};
thx_color__$HSLA_HSLA_$Impl_$.transparent = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Floats.interpolate(t,this1[3],0)];
	return channels;
};
thx_color__$HSLA_HSLA_$Impl_$.opaque = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Floats.interpolate(t,this1[3],1)];
	return channels;
};
thx_color__$HSLA_HSLA_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolateAngle(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2]),thx_Floats.interpolate(t,this1[3],other[3])];
	return channels;
};
thx_color__$HSLA_HSLA_$Impl_$.rotate = function(this1,angle) {
	return thx_color__$HSLA_HSLA_$Impl_$.create(this1[0] + angle,this1[1],this1[2],this1[3]);
};
thx_color__$HSLA_HSLA_$Impl_$.split = function(this1,spread) {
	if(spread == null) spread = 150.0;
	var _0 = thx_color__$HSLA_HSLA_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$HSLA_HSLA_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$HSLA_HSLA_$Impl_$.withAlpha = function(this1,newalpha) {
	return [this1[0],this1[1],this1[2],newalpha < 0?0:newalpha > 1?1:newalpha];
};
thx_color__$HSLA_HSLA_$Impl_$.withHue = function(this1,newhue) {
	var channels = [thx_Floats.wrapCircular(newhue,360),this1[1],this1[2],this1[3]];
	return channels;
};
thx_color__$HSLA_HSLA_$Impl_$.withLightness = function(this1,newlightness) {
	return [this1[0],this1[1],newlightness < 0?0:newlightness > 1?1:newlightness,this1[3]];
};
thx_color__$HSLA_HSLA_$Impl_$.withSaturation = function(this1,newsaturation) {
	return [this1[0],newsaturation < 0?0:newsaturation > 1?1:newsaturation,this1[2],this1[3]];
};
thx_color__$HSLA_HSLA_$Impl_$.toCSS3 = function(this1) {
	return thx_color__$HSLA_HSLA_$Impl_$.toString(this1);
};
thx_color__$HSLA_HSLA_$Impl_$.toString = function(this1) {
	return "hsla(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%," + this1[3] + ")";
};
thx_color__$HSLA_HSLA_$Impl_$.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10 && Math.abs(this1[3] - other[3]) <= 10e-10;
};
thx_color__$HSLA_HSLA_$Impl_$.toHSL = function(this1) {
	var channels = this1.slice(0,3);
	return channels;
};
thx_color__$HSLA_HSLA_$Impl_$.toHSVA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toHSVA(thx_color__$HSLA_HSLA_$Impl_$.toRGBXA(this1));
};
thx_color__$HSLA_HSLA_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGB(thx_color__$HSLA_HSLA_$Impl_$.toRGBXA(this1));
};
thx_color__$HSLA_HSLA_$Impl_$.toRGBA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$HSLA_HSLA_$Impl_$.toRGBXA(this1));
};
thx_color__$HSLA_HSLA_$Impl_$.toRGBXA = function(this1) {
	var channels = [thx_color__$HSLA_HSLA_$Impl_$._c(this1[0] + 120,this1[1],this1[2]),thx_color__$HSLA_HSLA_$Impl_$._c(this1[0],this1[1],this1[2]),thx_color__$HSLA_HSLA_$Impl_$._c(this1[0] - 120,this1[1],this1[2]),this1[3]];
	return channels;
};
thx_color__$HSLA_HSLA_$Impl_$.get_hue = function(this1) {
	return this1[0];
};
thx_color__$HSLA_HSLA_$Impl_$.get_saturation = function(this1) {
	return this1[1];
};
thx_color__$HSLA_HSLA_$Impl_$.get_lightness = function(this1) {
	return this1[2];
};
thx_color__$HSLA_HSLA_$Impl_$.get_alpha = function(this1) {
	return this1[3];
};
thx_color__$HSLA_HSLA_$Impl_$._c = function(d,s,l) {
	var m2;
	if(l <= 0.5) m2 = l * (1 + s); else m2 = l + s - l * s;
	var m1 = 2 * l - m2;
	d = thx_Floats.wrapCircular(d,360);
	if(d < 60) return m1 + (m2 - m1) * d / 60; else if(d < 180) return m2; else if(d < 240) return m1 + (m2 - m1) * (240 - d) / 60; else return m1;
};
var thx_color__$HSV_HSV_$Impl_$ = {};
thx_color__$HSV_HSV_$Impl_$.__name__ = ["thx","color","_HSV","HSV_Impl_"];
thx_color__$HSV_HSV_$Impl_$.create = function(hue,saturation,lightness) {
	var channels = [thx_Floats.wrapCircular(hue,360),saturation < 0?0:saturation > 1?1:saturation,lightness < 0?0:lightness > 1?1:lightness];
	return channels;
};
thx_color__$HSV_HSV_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return thx_color__$HSV_HSV_$Impl_$.create(arr[0],arr[1],arr[2]);
};
thx_color__$HSV_HSV_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "hsv":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$HSV_HSV_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$HSV_HSV_$Impl_$.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx_color__$HSV_HSV_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$HSV_HSV_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$HSV_HSV_$Impl_$.complement = function(this1) {
	return thx_color__$HSV_HSV_$Impl_$.rotate(this1,180);
};
thx_color__$HSV_HSV_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolateAngle(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$HSV_HSV_$Impl_$.rotate = function(this1,angle) {
	return thx_color__$HSV_HSV_$Impl_$.withHue(this1,this1[0] + angle);
};
thx_color__$HSV_HSV_$Impl_$.split = function(this1,spread) {
	if(spread == null) spread = 144.0;
	var _0 = thx_color__$HSV_HSV_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$HSV_HSV_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$HSV_HSV_$Impl_$.square = function(this1) {
	return thx_color__$HSV_HSV_$Impl_$.tetrad(this1,90);
};
thx_color__$HSV_HSV_$Impl_$.tetrad = function(this1,angle) {
	var _0 = thx_color__$HSV_HSV_$Impl_$.rotate(this1,0);
	var _1 = thx_color__$HSV_HSV_$Impl_$.rotate(this1,angle);
	var _2 = thx_color__$HSV_HSV_$Impl_$.rotate(this1,180);
	var _3 = thx_color__$HSV_HSV_$Impl_$.rotate(this1,180 + angle);
	return { _0 : _0, _1 : _1, _2 : _2, _3 : _3};
};
thx_color__$HSV_HSV_$Impl_$.triad = function(this1) {
	var _0 = thx_color__$HSV_HSV_$Impl_$.rotate(this1,-120);
	var _1 = thx_color__$HSV_HSV_$Impl_$.rotate(this1,0);
	var _2 = thx_color__$HSV_HSV_$Impl_$.rotate(this1,120);
	return { _0 : _0, _1 : _1, _2 : _2};
};
thx_color__$HSV_HSV_$Impl_$.withAlpha = function(this1,alpha) {
	var channels = this1.concat([alpha < 0?0:alpha > 1?1:alpha]);
	return channels;
};
thx_color__$HSV_HSV_$Impl_$.withHue = function(this1,newhue) {
	var channels = [thx_Floats.wrapCircular(newhue,360),this1[1],this1[2]];
	return channels;
};
thx_color__$HSV_HSV_$Impl_$.withValue = function(this1,newvalue) {
	return [this1[0],this1[1],newvalue < 0?0:newvalue > 1?1:newvalue];
};
thx_color__$HSV_HSV_$Impl_$.withSaturation = function(this1,newsaturation) {
	return [this1[0],newsaturation < 0?0:newsaturation > 1?1:newsaturation,this1[2]];
};
thx_color__$HSV_HSV_$Impl_$.toString = function(this1) {
	return "hsv(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%)";
};
thx_color__$HSV_HSV_$Impl_$.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10;
};
thx_color__$HSV_HSV_$Impl_$.toCIELab = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCIELab(thx_color__$HSV_HSV_$Impl_$.toRGBX(this1));
};
thx_color__$HSV_HSV_$Impl_$.toCIELCh = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCIELCh(thx_color__$HSV_HSV_$Impl_$.toRGBX(this1));
};
thx_color__$HSV_HSV_$Impl_$.toCMY = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMY(thx_color__$HSV_HSV_$Impl_$.toRGBX(this1));
};
thx_color__$HSV_HSV_$Impl_$.toCMYK = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMYK(thx_color__$HSV_HSV_$Impl_$.toRGBX(this1));
};
thx_color__$HSV_HSV_$Impl_$.toGrey = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toGrey(thx_color__$HSV_HSV_$Impl_$.toRGBX(this1));
};
thx_color__$HSV_HSV_$Impl_$.toHSL = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSL(thx_color__$HSV_HSV_$Impl_$.toRGBX(this1));
};
thx_color__$HSV_HSV_$Impl_$.toHSVA = function(this1) {
	return thx_color__$HSV_HSV_$Impl_$.withAlpha(this1,1.0);
};
thx_color__$HSV_HSV_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGB(thx_color__$HSV_HSV_$Impl_$.toRGBX(this1));
};
thx_color__$HSV_HSV_$Impl_$.toRGBA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$HSV_HSV_$Impl_$.toRGBXA(this1));
};
thx_color__$HSV_HSV_$Impl_$.toRGBX = function(this1) {
	if(this1[1] == 0) return [this1[2],this1[2],this1[2]];
	var r;
	var g;
	var b;
	var i;
	var f;
	var p;
	var q;
	var t;
	var h = this1[0] / 60;
	i = Math.floor(h);
	f = h - i;
	p = this1[2] * (1 - this1[1]);
	q = this1[2] * (1 - f * this1[1]);
	t = this1[2] * (1 - (1 - f) * this1[1]);
	switch(i) {
	case 0:
		r = this1[2];
		g = t;
		b = p;
		break;
	case 1:
		r = q;
		g = this1[2];
		b = p;
		break;
	case 2:
		r = p;
		g = this1[2];
		b = t;
		break;
	case 3:
		r = p;
		g = q;
		b = this1[2];
		break;
	case 4:
		r = t;
		g = p;
		b = this1[2];
		break;
	default:
		r = this1[2];
		g = p;
		b = q;
	}
	return [r,g,b];
};
thx_color__$HSV_HSV_$Impl_$.toRGBXA = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGBXA(thx_color__$HSV_HSV_$Impl_$.toRGBX(this1));
};
thx_color__$HSV_HSV_$Impl_$.toXYZ = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toXYZ(thx_color__$HSV_HSV_$Impl_$.toRGBX(this1));
};
thx_color__$HSV_HSV_$Impl_$.toYxy = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toYxy(thx_color__$HSV_HSV_$Impl_$.toRGBX(this1));
};
thx_color__$HSV_HSV_$Impl_$.get_hue = function(this1) {
	return this1[0];
};
thx_color__$HSV_HSV_$Impl_$.get_saturation = function(this1) {
	return this1[1];
};
thx_color__$HSV_HSV_$Impl_$.get_value = function(this1) {
	return this1[2];
};
var thx_color__$HSVA_HSVA_$Impl_$ = {};
thx_color__$HSVA_HSVA_$Impl_$.__name__ = ["thx","color","_HSVA","HSVA_Impl_"];
thx_color__$HSVA_HSVA_$Impl_$.create = function(hue,saturation,value,alpha) {
	var channels = [thx_Floats.wrapCircular(hue,360),saturation < 0?0:saturation > 1?1:saturation,value < 0?0:value > 1?1:value,alpha < 0?0:alpha > 1?1:alpha];
	return channels;
};
thx_color__$HSVA_HSVA_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,4);
	return thx_color__$HSVA_HSVA_$Impl_$.create(arr[0],arr[1],arr[2],arr[3]);
};
thx_color__$HSVA_HSVA_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "hsv":
			return thx_color__$HSV_HSV_$Impl_$.toHSVA((function($this) {
				var $r;
				var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3);
				$r = channels;
				return $r;
			}(this)));
		case "hsva":
			var channels1 = thx_color_parse_ColorParser.getFloatChannels(info.channels,4);
			return channels1;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$HSVA_HSVA_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$HSVA_HSVA_$Impl_$.analogous = function(this1,spread) {
	if(spread == null) spread = 30.0;
	var _0 = thx_color__$HSVA_HSVA_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$HSVA_HSVA_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$HSVA_HSVA_$Impl_$.complement = function(this1) {
	return thx_color__$HSVA_HSVA_$Impl_$.rotate(this1,180);
};
thx_color__$HSVA_HSVA_$Impl_$.transparent = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Floats.interpolate(t,this1[3],0)];
	return channels;
};
thx_color__$HSVA_HSVA_$Impl_$.opaque = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Floats.interpolate(t,this1[3],1)];
	return channels;
};
thx_color__$HSVA_HSVA_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolateAngle(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2]),thx_Floats.interpolate(t,this1[3],other[3])];
	return channels;
};
thx_color__$HSVA_HSVA_$Impl_$.rotate = function(this1,angle) {
	return thx_color__$HSVA_HSVA_$Impl_$.create(this1[0] + angle,this1[1],this1[2],this1[3]);
};
thx_color__$HSVA_HSVA_$Impl_$.split = function(this1,spread) {
	if(spread == null) spread = 150.0;
	var _0 = thx_color__$HSVA_HSVA_$Impl_$.rotate(this1,-spread);
	var _1 = thx_color__$HSVA_HSVA_$Impl_$.rotate(this1,spread);
	return { _0 : _0, _1 : _1};
};
thx_color__$HSVA_HSVA_$Impl_$.withAlpha = function(this1,newalpha) {
	return [this1[0],this1[1],this1[2],newalpha < 0?0:newalpha > 1?1:newalpha];
};
thx_color__$HSVA_HSVA_$Impl_$.withHue = function(this1,newhue) {
	var channels = [thx_Floats.wrapCircular(newhue,360),this1[1],this1[2],this1[3]];
	return channels;
};
thx_color__$HSVA_HSVA_$Impl_$.withLightness = function(this1,newvalue) {
	return [this1[0],this1[1],newvalue < 0?0:newvalue > 1?1:newvalue,this1[3]];
};
thx_color__$HSVA_HSVA_$Impl_$.withSaturation = function(this1,newsaturation) {
	return [this1[0],newsaturation < 0?0:newsaturation > 1?1:newsaturation,this1[2],this1[3]];
};
thx_color__$HSVA_HSVA_$Impl_$.toString = function(this1) {
	return "hsva(" + this1[0] + "," + this1[1] * 100 + "%," + this1[2] * 100 + "%," + this1[3] + ")";
};
thx_color__$HSVA_HSVA_$Impl_$.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10 && Math.abs(this1[3] - other[3]) <= 10e-10;
};
thx_color__$HSVA_HSVA_$Impl_$.toHSV = function(this1) {
	var channels = this1.slice(0,3);
	return channels;
};
thx_color__$HSVA_HSVA_$Impl_$.toHSLA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toHSLA(thx_color__$HSVA_HSVA_$Impl_$.toRGBXA(this1));
};
thx_color__$HSVA_HSVA_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGB(thx_color__$HSVA_HSVA_$Impl_$.toRGBXA(this1));
};
thx_color__$HSVA_HSVA_$Impl_$.toRGBA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$HSVA_HSVA_$Impl_$.toRGBXA(this1));
};
thx_color__$HSVA_HSVA_$Impl_$.toRGBXA = function(this1) {
	if(this1[1] == 0) return [this1[2],this1[2],this1[2],this1[3]];
	var r;
	var g;
	var b;
	var i;
	var f;
	var p;
	var q;
	var t;
	var h = this1[0] / 60;
	i = Math.floor(h);
	f = h - i;
	p = this1[2] * (1 - this1[1]);
	q = this1[2] * (1 - f * this1[1]);
	t = this1[2] * (1 - (1 - f) * this1[1]);
	switch(i) {
	case 0:
		r = this1[2];
		g = t;
		b = p;
		break;
	case 1:
		r = q;
		g = this1[2];
		b = p;
		break;
	case 2:
		r = p;
		g = this1[2];
		b = t;
		break;
	case 3:
		r = p;
		g = q;
		b = this1[2];
		break;
	case 4:
		r = t;
		g = p;
		b = this1[2];
		break;
	default:
		r = this1[2];
		g = p;
		b = q;
	}
	return [r,g,b,this1[3]];
};
thx_color__$HSVA_HSVA_$Impl_$.get_hue = function(this1) {
	return this1[0];
};
thx_color__$HSVA_HSVA_$Impl_$.get_saturation = function(this1) {
	return this1[1];
};
thx_color__$HSVA_HSVA_$Impl_$.get_value = function(this1) {
	return this1[2];
};
thx_color__$HSVA_HSVA_$Impl_$.get_alpha = function(this1) {
	return this1[3];
};
var thx_color__$RGB_RGB_$Impl_$ = {};
thx_color__$RGB_RGB_$Impl_$.__name__ = ["thx","color","_RGB","RGB_Impl_"];
thx_color__$RGB_RGB_$Impl_$.create = function(red,green,blue) {
	return (red & 255) << 16 | (green & 255) << 8 | blue & 255;
};
thx_color__$RGB_RGB_$Impl_$.createf = function(red,green,blue) {
	return thx_color__$RGB_RGB_$Impl_$.create(Math.round(red * 255),Math.round(green * 255),Math.round(blue * 255));
};
thx_color__$RGB_RGB_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseHex(color);
	if(null == info) info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "rgb":
			return thx_color__$RGB_RGB_$Impl_$.fromInts(thx_color_parse_ColorParser.getInt8Channels(info.channels,3));
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$RGB_RGB_$Impl_$.fromInts = function(arr) {
	thx_ArrayInts.resize(arr,3);
	return thx_color__$RGB_RGB_$Impl_$.create(arr[0],arr[1],arr[2]);
};
thx_color__$RGB_RGB_$Impl_$._new = function(rgb) {
	return rgb;
};
thx_color__$RGB_RGB_$Impl_$.darker = function(this1,t) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGB(thx_color__$RGBX_RGBX_$Impl_$.darker(thx_color__$RGB_RGB_$Impl_$.toRGBX(this1),t));
};
thx_color__$RGB_RGB_$Impl_$.lighter = function(this1,t) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGB(thx_color__$RGBX_RGBX_$Impl_$.lighter(thx_color__$RGB_RGB_$Impl_$.toRGBX(this1),t));
};
thx_color__$RGB_RGB_$Impl_$.interpolate = function(this1,other,t) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGB(thx_color__$RGBX_RGBX_$Impl_$.interpolate(thx_color__$RGB_RGB_$Impl_$.toRGBX(this1),thx_color__$RGB_RGB_$Impl_$.toRGBX(other),t));
};
thx_color__$RGB_RGB_$Impl_$.withAlpha = function(this1,alpha) {
	return thx_color__$RGBA_RGBA_$Impl_$.fromInts([thx_color__$RGB_RGB_$Impl_$.get_red(this1),thx_color__$RGB_RGB_$Impl_$.get_green(this1),thx_color__$RGB_RGB_$Impl_$.get_blue(this1),alpha]);
};
thx_color__$RGB_RGB_$Impl_$.withRed = function(this1,newred) {
	return thx_color__$RGB_RGB_$Impl_$.fromInts([newred,thx_color__$RGB_RGB_$Impl_$.get_green(this1),thx_color__$RGB_RGB_$Impl_$.get_blue(this1)]);
};
thx_color__$RGB_RGB_$Impl_$.withGreen = function(this1,newgreen) {
	return thx_color__$RGB_RGB_$Impl_$.fromInts([thx_color__$RGB_RGB_$Impl_$.get_red(this1),newgreen,thx_color__$RGB_RGB_$Impl_$.get_blue(this1)]);
};
thx_color__$RGB_RGB_$Impl_$.withBlue = function(this1,newblue) {
	return thx_color__$RGB_RGB_$Impl_$.fromInts([thx_color__$RGB_RGB_$Impl_$.get_red(this1),thx_color__$RGB_RGB_$Impl_$.get_green(this1),newblue]);
};
thx_color__$RGB_RGB_$Impl_$.toCSS3 = function(this1) {
	return "rgb(" + thx_color__$RGB_RGB_$Impl_$.get_red(this1) + "," + thx_color__$RGB_RGB_$Impl_$.get_green(this1) + "," + thx_color__$RGB_RGB_$Impl_$.get_blue(this1) + ")";
};
thx_color__$RGB_RGB_$Impl_$.toString = function(this1) {
	return thx_color__$RGB_RGB_$Impl_$.toHex(this1);
};
thx_color__$RGB_RGB_$Impl_$.toHex = function(this1,prefix) {
	if(prefix == null) prefix = "#";
	return "" + prefix + StringTools.hex(thx_color__$RGB_RGB_$Impl_$.get_red(this1),2) + StringTools.hex(thx_color__$RGB_RGB_$Impl_$.get_green(this1),2) + StringTools.hex(thx_color__$RGB_RGB_$Impl_$.get_blue(this1),2);
};
thx_color__$RGB_RGB_$Impl_$.equals = function(this1,other) {
	return thx_color__$RGB_RGB_$Impl_$.get_red(this1) == thx_color__$RGB_RGB_$Impl_$.get_red(other) && thx_color__$RGB_RGB_$Impl_$.get_green(this1) == thx_color__$RGB_RGB_$Impl_$.get_green(other) && thx_color__$RGB_RGB_$Impl_$.get_blue(this1) == thx_color__$RGB_RGB_$Impl_$.get_blue(other);
};
thx_color__$RGB_RGB_$Impl_$.toCIELab = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCIELab(thx_color__$RGB_RGB_$Impl_$.toRGBX(this1));
};
thx_color__$RGB_RGB_$Impl_$.toCIELCh = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCIELCh(thx_color__$RGB_RGB_$Impl_$.toRGBX(this1));
};
thx_color__$RGB_RGB_$Impl_$.toCMY = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMY(thx_color__$RGB_RGB_$Impl_$.toRGBX(this1));
};
thx_color__$RGB_RGB_$Impl_$.toCMYK = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMYK(thx_color__$RGB_RGB_$Impl_$.toRGBX(this1));
};
thx_color__$RGB_RGB_$Impl_$.toGrey = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toGrey(thx_color__$RGB_RGB_$Impl_$.toRGBX(this1));
};
thx_color__$RGB_RGB_$Impl_$.toHSL = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSL(thx_color__$RGB_RGB_$Impl_$.toRGBX(this1));
};
thx_color__$RGB_RGB_$Impl_$.toHSV = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSV(thx_color__$RGB_RGB_$Impl_$.toRGBX(this1));
};
thx_color__$RGB_RGB_$Impl_$.toRGBX = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.fromInts([thx_color__$RGB_RGB_$Impl_$.get_red(this1),thx_color__$RGB_RGB_$Impl_$.get_green(this1),thx_color__$RGB_RGB_$Impl_$.get_blue(this1)]);
};
thx_color__$RGB_RGB_$Impl_$.toRGBA = function(this1) {
	return thx_color__$RGB_RGB_$Impl_$.withAlpha(this1,255);
};
thx_color__$RGB_RGB_$Impl_$.toRGBXA = function(this1) {
	return thx_color__$RGBA_RGBA_$Impl_$.toRGBXA(thx_color__$RGB_RGB_$Impl_$.toRGBA(this1));
};
thx_color__$RGB_RGB_$Impl_$.toYxy = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toYxy(thx_color__$RGB_RGB_$Impl_$.toRGBX(this1));
};
thx_color__$RGB_RGB_$Impl_$.toXYZ = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toXYZ(thx_color__$RGB_RGB_$Impl_$.toRGBX(this1));
};
thx_color__$RGB_RGB_$Impl_$.get_red = function(this1) {
	return this1 >> 16 & 255;
};
thx_color__$RGB_RGB_$Impl_$.get_green = function(this1) {
	return this1 >> 8 & 255;
};
thx_color__$RGB_RGB_$Impl_$.get_blue = function(this1) {
	return this1 & 255;
};
var thx_color__$RGBA_RGBA_$Impl_$ = {};
thx_color__$RGBA_RGBA_$Impl_$.__name__ = ["thx","color","_RGBA","RGBA_Impl_"];
thx_color__$RGBA_RGBA_$Impl_$.create = function(red,green,blue,alpha) {
	return (red & 255) << 24 | (green & 255) << 16 | (blue & 255) << 8 | alpha & 255;
};
thx_color__$RGBA_RGBA_$Impl_$.fromFloats = function(arr) {
	var ints = thx_ArrayFloats.resize(arr,4).map(function(_) {
		return Math.round(_ * 255);
	});
	return thx_color__$RGBA_RGBA_$Impl_$.create(ints[0],ints[1],ints[2],ints[3]);
};
thx_color__$RGBA_RGBA_$Impl_$.fromInt = function(rgba) {
	return rgba;
};
thx_color__$RGBA_RGBA_$Impl_$.fromInts = function(arr) {
	thx_ArrayInts.resize(arr,4);
	return thx_color__$RGBA_RGBA_$Impl_$.create(arr[0],arr[1],arr[2],arr[3]);
};
thx_color__$RGBA_RGBA_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseHex(color);
	if(null == info) info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "rgb":
			return thx_color__$RGB_RGB_$Impl_$.toRGBA(thx_color__$RGB_RGB_$Impl_$.fromInts(thx_color_parse_ColorParser.getInt8Channels(info.channels,3)));
		case "rgba":
			return thx_color__$RGBA_RGBA_$Impl_$.create(thx_color_parse_ColorParser.getInt8Channel(info.channels[0]),thx_color_parse_ColorParser.getInt8Channel(info.channels[1]),thx_color_parse_ColorParser.getInt8Channel(info.channels[2]),Math.round(thx_color_parse_ColorParser.getFloatChannel(info.channels[3]) * 255));
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$RGBA_RGBA_$Impl_$._new = function(rgba) {
	return rgba;
};
thx_color__$RGBA_RGBA_$Impl_$.darker = function(this1,t) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$RGBXA_RGBXA_$Impl_$.darker(thx_color__$RGBA_RGBA_$Impl_$.toRGBXA(this1),t));
};
thx_color__$RGBA_RGBA_$Impl_$.lighter = function(this1,t) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$RGBXA_RGBXA_$Impl_$.lighter(thx_color__$RGBA_RGBA_$Impl_$.toRGBXA(this1),t));
};
thx_color__$RGBA_RGBA_$Impl_$.transparent = function(this1,t) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$RGBXA_RGBXA_$Impl_$.transparent(thx_color__$RGBA_RGBA_$Impl_$.toRGBXA(this1),t));
};
thx_color__$RGBA_RGBA_$Impl_$.opaque = function(this1,t) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$RGBXA_RGBXA_$Impl_$.opaque(thx_color__$RGBA_RGBA_$Impl_$.toRGBXA(this1),t));
};
thx_color__$RGBA_RGBA_$Impl_$.interpolate = function(this1,other,t) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$RGBXA_RGBXA_$Impl_$.interpolate(thx_color__$RGBA_RGBA_$Impl_$.toRGBXA(this1),thx_color__$RGBA_RGBA_$Impl_$.toRGBXA(other),t));
};
thx_color__$RGBA_RGBA_$Impl_$.withAlpha = function(this1,newalpha) {
	return thx_color__$RGBA_RGBA_$Impl_$.fromInts([this1 >> 24 & 255,this1 >> 16 & 255,this1 >> 8 & 255,newalpha]);
};
thx_color__$RGBA_RGBA_$Impl_$.withRed = function(this1,newred) {
	return thx_color__$RGBA_RGBA_$Impl_$.fromInts([newred,this1 >> 16 & 255,this1 >> 8 & 255]);
};
thx_color__$RGBA_RGBA_$Impl_$.withGreen = function(this1,newgreen) {
	return thx_color__$RGBA_RGBA_$Impl_$.fromInts([this1 >> 24 & 255,newgreen,this1 >> 8 & 255]);
};
thx_color__$RGBA_RGBA_$Impl_$.withBlue = function(this1,newblue) {
	return thx_color__$RGBA_RGBA_$Impl_$.fromInts([this1 >> 24 & 255,this1 >> 16 & 255,newblue]);
};
thx_color__$RGBA_RGBA_$Impl_$.toHSLA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toHSLA(thx_color__$RGBA_RGBA_$Impl_$.toRGBXA(this1));
};
thx_color__$RGBA_RGBA_$Impl_$.toHSVA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toHSVA(thx_color__$RGBA_RGBA_$Impl_$.toRGBXA(this1));
};
thx_color__$RGBA_RGBA_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGB_RGB_$Impl_$.create(this1 >> 24 & 255,this1 >> 16 & 255,this1 >> 8 & 255);
};
thx_color__$RGBA_RGBA_$Impl_$.toRGBX = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.fromInts([this1 >> 24 & 255,this1 >> 16 & 255,this1 >> 8 & 255]);
};
thx_color__$RGBA_RGBA_$Impl_$.toRGBXA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.fromInts([this1 >> 24 & 255,this1 >> 16 & 255,this1 >> 8 & 255,this1 & 255]);
};
thx_color__$RGBA_RGBA_$Impl_$.toCSS3 = function(this1) {
	return thx_color__$RGBA_RGBA_$Impl_$.toString(this1);
};
thx_color__$RGBA_RGBA_$Impl_$.toString = function(this1) {
	return "rgba(" + (this1 >> 24 & 255) + "," + (this1 >> 16 & 255) + "," + (this1 >> 8 & 255) + "," + (this1 & 255) / 255 + ")";
};
thx_color__$RGBA_RGBA_$Impl_$.toHex = function(this1,prefix) {
	if(prefix == null) prefix = "#";
	return "" + prefix + StringTools.hex(this1 & 255,2) + StringTools.hex(this1 >> 24 & 255,2) + StringTools.hex(this1 >> 16 & 255,2) + StringTools.hex(this1 >> 8 & 255,2);
};
thx_color__$RGBA_RGBA_$Impl_$.equals = function(this1,other) {
	return (this1 >> 24 & 255) == (other >> 24 & 255) && (this1 & 255) == (other & 255) && (this1 >> 16 & 255) == (other >> 16 & 255) && (this1 >> 8 & 255) == (other >> 8 & 255);
};
thx_color__$RGBA_RGBA_$Impl_$.get_alpha = function(this1) {
	return this1 & 255;
};
thx_color__$RGBA_RGBA_$Impl_$.get_red = function(this1) {
	return this1 >> 24 & 255;
};
thx_color__$RGBA_RGBA_$Impl_$.get_green = function(this1) {
	return this1 >> 16 & 255;
};
thx_color__$RGBA_RGBA_$Impl_$.get_blue = function(this1) {
	return this1 >> 8 & 255;
};
var thx_color__$RGBX_RGBX_$Impl_$ = {};
thx_color__$RGBX_RGBX_$Impl_$.__name__ = ["thx","color","_RGBX","RGBX_Impl_"];
thx_color__$RGBX_RGBX_$Impl_$.create = function(red,green,blue) {
	return [red < 0?0:red > 1?1:red,green < 0?0:green > 1?1:green,blue < 0?0:blue > 1?1:blue];
};
thx_color__$RGBX_RGBX_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return thx_color__$RGBX_RGBX_$Impl_$.create(arr[0],arr[1],arr[2]);
};
thx_color__$RGBX_RGBX_$Impl_$.fromInts = function(arr) {
	thx_ArrayInts.resize(arr,3);
	return thx_color__$RGBX_RGBX_$Impl_$.create(arr[0] / 255,arr[1] / 255,arr[2] / 255);
};
thx_color__$RGBX_RGBX_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseHex(color);
	if(null == info) info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "rgb":
			return thx_color__$RGBX_RGBX_$Impl_$.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3));
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$RGBX_RGBX_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$RGBX_RGBX_$Impl_$.darker = function(this1,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],0),thx_Floats.interpolate(t,this1[1],0),thx_Floats.interpolate(t,this1[2],0)];
	return channels;
};
thx_color__$RGBX_RGBX_$Impl_$.lighter = function(this1,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],1),thx_Floats.interpolate(t,this1[1],1),thx_Floats.interpolate(t,this1[2],1)];
	return channels;
};
thx_color__$RGBX_RGBX_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$RGBX_RGBX_$Impl_$.toCSS3 = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toString(this1);
};
thx_color__$RGBX_RGBX_$Impl_$.toString = function(this1) {
	return "rgb(" + this1[0] * 100 + "%," + this1[1] * 100 + "%," + this1[2] * 100 + "%)";
};
thx_color__$RGBX_RGBX_$Impl_$.toHex = function(this1,prefix) {
	if(prefix == null) prefix = "#";
	return "" + prefix + StringTools.hex(thx_color__$RGBX_RGBX_$Impl_$.get_red(this1),2) + StringTools.hex(thx_color__$RGBX_RGBX_$Impl_$.get_green(this1),2) + StringTools.hex(thx_color__$RGBX_RGBX_$Impl_$.get_blue(this1),2);
};
thx_color__$RGBX_RGBX_$Impl_$.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10;
};
thx_color__$RGBX_RGBX_$Impl_$.withAlpha = function(this1,alpha) {
	var channels = this1.concat([alpha < 0?0:alpha > 1?1:alpha]);
	return channels;
};
thx_color__$RGBX_RGBX_$Impl_$.withRed = function(this1,newred) {
	var channels = [newred < 0?0:newred > 1?1:newred,thx_color__$RGBX_RGBX_$Impl_$.get_green(this1),thx_color__$RGBX_RGBX_$Impl_$.get_blue(this1)];
	return channels;
};
thx_color__$RGBX_RGBX_$Impl_$.withGreen = function(this1,newgreen) {
	var channels = [thx_color__$RGBX_RGBX_$Impl_$.get_red(this1),newgreen < 0?0:newgreen > 1?1:newgreen,thx_color__$RGBX_RGBX_$Impl_$.get_blue(this1)];
	return channels;
};
thx_color__$RGBX_RGBX_$Impl_$.withBlue = function(this1,newblue) {
	var channels = [thx_color__$RGBX_RGBX_$Impl_$.get_red(this1),thx_color__$RGBX_RGBX_$Impl_$.get_green(this1),newblue < 0?0:newblue > 1?1:newblue];
	return channels;
};
thx_color__$RGBX_RGBX_$Impl_$.toCIELab = function(this1) {
	return thx_color__$XYZ_XYZ_$Impl_$.toCIELab(thx_color__$RGBX_RGBX_$Impl_$.toXYZ(this1));
};
thx_color__$RGBX_RGBX_$Impl_$.toCIELCh = function(this1) {
	return thx_color__$CIELab_CIELab_$Impl_$.toCIELCh(thx_color__$RGBX_RGBX_$Impl_$.toCIELab(this1));
};
thx_color__$RGBX_RGBX_$Impl_$.toCMY = function(this1) {
	return [1 - this1[0],1 - this1[1],1 - this1[2]];
};
thx_color__$RGBX_RGBX_$Impl_$.toCMYK = function(this1) {
	var c = 0.0;
	var y = 0.0;
	var m = 0.0;
	var k;
	if(this1[0] + this1[1] + this1[2] == 0) k = 1.0; else {
		k = 1 - Math.max(Math.max(this1[0],this1[1]),this1[2]);
		c = (1 - this1[0] - k) / (1 - k);
		m = (1 - this1[1] - k) / (1 - k);
		y = (1 - this1[2] - k) / (1 - k);
	}
	return [c,m,y,k];
};
thx_color__$RGBX_RGBX_$Impl_$.toGrey = function(this1) {
	return this1[0] * .2126 + this1[1] * .7152 + this1[2] * .0722;
};
thx_color__$RGBX_RGBX_$Impl_$.toPerceivedGrey = function(this1) {
	return this1[0] * .299 + this1[1] * .587 + this1[2] * .114;
};
thx_color__$RGBX_RGBX_$Impl_$.toPerceivedAccurateGrey = function(this1) {
	var grey = Math.pow(this1[0],2) * .241 + Math.pow(this1[1],2) * .691 + Math.pow(this1[2],2) * .068;
	return grey;
};
thx_color__$RGBX_RGBX_$Impl_$.toHSL = function(this1) {
	var min = Math.min(Math.min(this1[0],this1[1]),this1[2]);
	var max = Math.max(Math.max(this1[0],this1[1]),this1[2]);
	var delta = max - min;
	var h;
	var s;
	var l = (max + min) / 2;
	if(delta == 0.0) s = h = 0.0; else {
		if(l < 0.5) s = delta / (max + min); else s = delta / (2 - max - min);
		if(this1[0] == max) h = (this1[1] - this1[2]) / delta + (this1[1] < thx_color__$RGBX_RGBX_$Impl_$.get_blue(this1)?6:0); else if(this1[1] == max) h = (this1[2] - this1[0]) / delta + 2; else h = (this1[0] - this1[1]) / delta + 4;
		h *= 60;
	}
	return [h,s,l];
};
thx_color__$RGBX_RGBX_$Impl_$.toHSV = function(this1) {
	var min = Math.min(Math.min(this1[0],this1[1]),this1[2]);
	var max = Math.max(Math.max(this1[0],this1[1]),this1[2]);
	var delta = max - min;
	var h;
	var s;
	var v = max;
	if(delta != 0) s = delta / max; else {
		s = 0;
		h = -1;
		return [h,s,v];
	}
	if(this1[0] == max) h = (this1[1] - this1[2]) / delta; else if(this1[1] == max) h = 2 + (this1[2] - this1[0]) / delta; else h = 4 + (this1[0] - this1[1]) / delta;
	h *= 60;
	if(h < 0) h += 360;
	return [h,s,v];
};
thx_color__$RGBX_RGBX_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGB_RGB_$Impl_$.createf(this1[0],this1[1],this1[2]);
};
thx_color__$RGBX_RGBX_$Impl_$.toRGBXA = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.withAlpha(this1,1.0);
};
thx_color__$RGBX_RGBX_$Impl_$.toXYZ = function(this1) {
	var r = this1[0];
	var g = this1[1];
	var b = this1[2];
	r = 100 * (r > 0.04045?Math.pow((r + 0.055) / 1.055,2.4):r / 12.92);
	g = 100 * (g > 0.04045?Math.pow((g + 0.055) / 1.055,2.4):g / 12.92);
	b = 100 * (b > 0.04045?Math.pow((b + 0.055) / 1.055,2.4):b / 12.92);
	return [r * 0.4124 + g * 0.3576 + b * 0.1805,r * 0.2126 + g * 0.7152 + b * 0.0722,r * 0.0193 + g * 0.1192 + b * 0.9505];
};
thx_color__$RGBX_RGBX_$Impl_$.toYxy = function(this1) {
	return thx_color__$XYZ_XYZ_$Impl_$.toYxy(thx_color__$RGBX_RGBX_$Impl_$.toXYZ(this1));
};
thx_color__$RGBX_RGBX_$Impl_$.get_red = function(this1) {
	return Math.round(this1[0] * 255);
};
thx_color__$RGBX_RGBX_$Impl_$.get_green = function(this1) {
	return Math.round(this1[1] * 255);
};
thx_color__$RGBX_RGBX_$Impl_$.get_blue = function(this1) {
	return Math.round(this1[2] * 255);
};
thx_color__$RGBX_RGBX_$Impl_$.get_redf = function(this1) {
	return this1[0];
};
thx_color__$RGBX_RGBX_$Impl_$.get_greenf = function(this1) {
	return this1[1];
};
thx_color__$RGBX_RGBX_$Impl_$.get_bluef = function(this1) {
	return this1[2];
};
var thx_color__$RGBXA_RGBXA_$Impl_$ = {};
thx_color__$RGBXA_RGBXA_$Impl_$.__name__ = ["thx","color","_RGBXA","RGBXA_Impl_"];
thx_color__$RGBXA_RGBXA_$Impl_$.create = function(red,green,blue,alpha) {
	return [red < 0?0:red > 1?1:red,green < 0?0:green > 1?1:green,blue < 0?0:blue > 1?1:blue,alpha < 0?0:alpha > 1?1:alpha];
};
thx_color__$RGBXA_RGBXA_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,4);
	return thx_color__$RGBXA_RGBXA_$Impl_$.create(arr[0],arr[1],arr[2],arr[3]);
};
thx_color__$RGBXA_RGBXA_$Impl_$.fromInts = function(arr) {
	thx_ArrayInts.resize(arr,4);
	return thx_color__$RGBXA_RGBXA_$Impl_$.create(arr[0] / 255,arr[1] / 255,arr[2] / 255,arr[3] / 255);
};
thx_color__$RGBXA_RGBXA_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseHex(color);
	if(null == info) info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "rgb":
			return thx_color__$RGBX_RGBX_$Impl_$.toRGBXA(thx_color__$RGBX_RGBX_$Impl_$.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,3)));
		case "rgba":
			return thx_color__$RGBXA_RGBXA_$Impl_$.fromFloats(thx_color_parse_ColorParser.getFloatChannels(info.channels,4));
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$RGBXA_RGBXA_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$RGBXA_RGBXA_$Impl_$.darker = function(this1,t) {
	return thx_color__$RGBX_RGBX_$Impl_$.withAlpha(thx_color__$RGBX_RGBX_$Impl_$.darker(thx_color__$RGBXA_RGBXA_$Impl_$.toRGBX(this1),t),thx_color__$RGBXA_RGBXA_$Impl_$.get_alpha(this1));
};
thx_color__$RGBXA_RGBXA_$Impl_$.lighter = function(this1,t) {
	return thx_color__$RGBX_RGBX_$Impl_$.withAlpha(thx_color__$RGBX_RGBX_$Impl_$.lighter(thx_color__$RGBXA_RGBXA_$Impl_$.toRGBX(this1),t),thx_color__$RGBXA_RGBXA_$Impl_$.get_alpha(this1));
};
thx_color__$RGBXA_RGBXA_$Impl_$.transparent = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Ints.interpolate(t,this1[3],0)];
	return channels;
};
thx_color__$RGBXA_RGBXA_$Impl_$.opaque = function(this1,t) {
	var channels = [this1[0],this1[1],this1[2],thx_Ints.interpolate(t,this1[3],1)];
	return channels;
};
thx_color__$RGBXA_RGBXA_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Ints.interpolate(t,this1[0],other[0]),thx_Ints.interpolate(t,this1[1],other[1]),thx_Ints.interpolate(t,this1[2],other[2]),thx_Ints.interpolate(t,this1[3],other[3])];
	return channels;
};
thx_color__$RGBXA_RGBXA_$Impl_$.withAlpha = function(this1,newalpha) {
	var channels = [thx_color__$RGBXA_RGBXA_$Impl_$.get_red(this1),thx_color__$RGBXA_RGBXA_$Impl_$.get_green(this1),thx_color__$RGBXA_RGBXA_$Impl_$.get_blue(this1),newalpha < 0?0:newalpha > 1?1:newalpha];
	return channels;
};
thx_color__$RGBXA_RGBXA_$Impl_$.withRed = function(this1,newred) {
	var channels = [newred < 0?0:newred > 1?1:newred,thx_color__$RGBXA_RGBXA_$Impl_$.get_green(this1),thx_color__$RGBXA_RGBXA_$Impl_$.get_blue(this1),thx_color__$RGBXA_RGBXA_$Impl_$.get_alpha(this1)];
	return channels;
};
thx_color__$RGBXA_RGBXA_$Impl_$.withGreen = function(this1,newgreen) {
	var channels = [thx_color__$RGBXA_RGBXA_$Impl_$.get_red(this1),newgreen < 0?0:newgreen > 1?1:newgreen,thx_color__$RGBXA_RGBXA_$Impl_$.get_blue(this1),thx_color__$RGBXA_RGBXA_$Impl_$.get_alpha(this1)];
	return channels;
};
thx_color__$RGBXA_RGBXA_$Impl_$.withBlue = function(this1,newblue) {
	var channels = [thx_color__$RGBXA_RGBXA_$Impl_$.get_red(this1),thx_color__$RGBXA_RGBXA_$Impl_$.get_green(this1),newblue < 0?0:newblue > 1?1:newblue,thx_color__$RGBXA_RGBXA_$Impl_$.get_alpha(this1)];
	return channels;
};
thx_color__$RGBXA_RGBXA_$Impl_$.toCSS3 = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toString(this1);
};
thx_color__$RGBXA_RGBXA_$Impl_$.toString = function(this1) {
	return "rgba(" + this1[0] * 100 + "%," + this1[1] * 100 + "%," + this1[2] * 100 + "%," + this1[3] + ")";
};
thx_color__$RGBXA_RGBXA_$Impl_$.toHex = function(this1,prefix) {
	if(prefix == null) prefix = "#";
	return "" + prefix + StringTools.hex(thx_color__$RGBXA_RGBXA_$Impl_$.get_alpha(this1),2) + StringTools.hex(thx_color__$RGBXA_RGBXA_$Impl_$.get_red(this1),2) + StringTools.hex(thx_color__$RGBXA_RGBXA_$Impl_$.get_green(this1),2) + StringTools.hex(thx_color__$RGBXA_RGBXA_$Impl_$.get_blue(this1),2);
};
thx_color__$RGBXA_RGBXA_$Impl_$.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10 && Math.abs(this1[3] - other[3]) <= 10e-10;
};
thx_color__$RGBXA_RGBXA_$Impl_$.toHSLA = function(this1) {
	return thx_color__$HSL_HSL_$Impl_$.withAlpha(thx_color__$RGBX_RGBX_$Impl_$.toHSL(thx_color__$RGBXA_RGBXA_$Impl_$.toRGBX(this1)),thx_color__$RGBXA_RGBXA_$Impl_$.get_alpha(this1));
};
thx_color__$RGBXA_RGBXA_$Impl_$.toHSVA = function(this1) {
	return thx_color__$HSV_HSV_$Impl_$.withAlpha(thx_color__$RGBX_RGBX_$Impl_$.toHSV(thx_color__$RGBXA_RGBXA_$Impl_$.toRGBX(this1)),thx_color__$RGBXA_RGBXA_$Impl_$.get_alpha(this1));
};
thx_color__$RGBXA_RGBXA_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGB(thx_color__$RGBXA_RGBXA_$Impl_$.toRGBX(this1));
};
thx_color__$RGBXA_RGBXA_$Impl_$.toRGBX = function(this1) {
	var channels = this1.slice(0,3);
	return channels;
};
thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA = function(this1) {
	return thx_color__$RGBA_RGBA_$Impl_$.fromFloats([this1[0],this1[1],this1[2],this1[3]]);
};
thx_color__$RGBXA_RGBXA_$Impl_$.get_red = function(this1) {
	return Math.round(this1[0] * 255);
};
thx_color__$RGBXA_RGBXA_$Impl_$.get_green = function(this1) {
	return Math.round(this1[1] * 255);
};
thx_color__$RGBXA_RGBXA_$Impl_$.get_blue = function(this1) {
	return Math.round(this1[2] * 255);
};
thx_color__$RGBXA_RGBXA_$Impl_$.get_alpha = function(this1) {
	return Math.round(this1[3] * 255);
};
thx_color__$RGBXA_RGBXA_$Impl_$.get_redf = function(this1) {
	return this1[0];
};
thx_color__$RGBXA_RGBXA_$Impl_$.get_greenf = function(this1) {
	return this1[1];
};
thx_color__$RGBXA_RGBXA_$Impl_$.get_bluef = function(this1) {
	return this1[2];
};
thx_color__$RGBXA_RGBXA_$Impl_$.get_alphaf = function(this1) {
	return this1[3];
};
var thx_color__$XYZ_XYZ_$Impl_$ = {};
thx_color__$XYZ_XYZ_$Impl_$.__name__ = ["thx","color","_XYZ","XYZ_Impl_"];
thx_color__$XYZ_XYZ_$Impl_$.create = function(x,y,z) {
	return [x,y,z];
};
thx_color__$XYZ_XYZ_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return thx_color__$XYZ_XYZ_$Impl_$.create(arr[0],arr[1],arr[2]);
};
thx_color__$XYZ_XYZ_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "ciexyz":case "xyz":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$XYZ_XYZ_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$XYZ_XYZ_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$XYZ_XYZ_$Impl_$.withX = function(this1,newx) {
	return [newx,this1[1],this1[2]];
};
thx_color__$XYZ_XYZ_$Impl_$.withY = function(this1,newy) {
	return [this1[0],newy,this1[2]];
};
thx_color__$XYZ_XYZ_$Impl_$.withZ = function(this1,newz) {
	return [this1[0],this1[1],newz];
};
thx_color__$XYZ_XYZ_$Impl_$.toString = function(this1) {
	return "XYZ(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$XYZ_XYZ_$Impl_$.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10;
};
thx_color__$XYZ_XYZ_$Impl_$.toCIELab = function(this1) {
	var x = this1[0] * 0.0105211106;
	var y = this1[1] * 0.01;
	var z = this1[2] * 0.00918417016;
	var p;
	if(x > 0.008856) x = Math.pow(x,0.333333333333333315); else x = 7.787 * x + 0.137931034482758619;
	if(y > 0.008856) y = Math.pow(y,0.333333333333333315); else y = 7.787 * y + 0.137931034482758619;
	if(z > 0.008856) z = Math.pow(z,0.333333333333333315); else z = 7.787 * z + 0.137931034482758619;
	return y > 0.008856?[116 * y - 16,500 * (x - y),200 * (y - z)]:[903.3 * y,500 * (x - y),200 * (y - z)];
};
thx_color__$XYZ_XYZ_$Impl_$.toCIELCh = function(this1) {
	return thx_color__$CIELab_CIELab_$Impl_$.toCIELCh(thx_color__$XYZ_XYZ_$Impl_$.toCIELab(this1));
};
thx_color__$XYZ_XYZ_$Impl_$.toCMY = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMY(thx_color__$XYZ_XYZ_$Impl_$.toRGBX(this1));
};
thx_color__$XYZ_XYZ_$Impl_$.toCMYK = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMYK(thx_color__$XYZ_XYZ_$Impl_$.toRGBX(this1));
};
thx_color__$XYZ_XYZ_$Impl_$.toGrey = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toGrey(thx_color__$XYZ_XYZ_$Impl_$.toRGBX(this1));
};
thx_color__$XYZ_XYZ_$Impl_$.toHSL = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSL(thx_color__$XYZ_XYZ_$Impl_$.toRGBX(this1));
};
thx_color__$XYZ_XYZ_$Impl_$.toHSV = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSV(thx_color__$XYZ_XYZ_$Impl_$.toRGBX(this1));
};
thx_color__$XYZ_XYZ_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGB(thx_color__$XYZ_XYZ_$Impl_$.toRGBX(this1));
};
thx_color__$XYZ_XYZ_$Impl_$.toRGBA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$XYZ_XYZ_$Impl_$.toRGBXA(this1));
};
thx_color__$XYZ_XYZ_$Impl_$.toRGBX = function(this1) {
	var x = this1[0] / 100;
	var y = this1[1] / 100;
	var z = this1[2] / 100;
	var r = x * 3.2406 + y * -1.5372 + z * -0.4986;
	var g = x * -0.9689 + y * 1.8758 + z * 0.0415;
	var b = x * 0.0557 + y * -0.204 + z * 1.0570;
	if(r > 0.0031308) r = 1.055 * Math.pow(r,0.416666666666666685) - 0.055; else r = 12.92 * r;
	if(g > 0.0031308) g = 1.055 * Math.pow(g,0.416666666666666685) - 0.055; else g = 12.92 * g;
	if(b > 0.0031308) b = 1.055 * Math.pow(b,0.416666666666666685) - 0.055; else b = 12.92 * b;
	return [r,g,b];
};
thx_color__$XYZ_XYZ_$Impl_$.toRGBXA = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGBXA(thx_color__$XYZ_XYZ_$Impl_$.toRGBX(this1));
};
thx_color__$XYZ_XYZ_$Impl_$.toYxy = function(this1) {
	var sum = this1[0] + this1[1] + this1[2];
	return [this1[1],sum == 0?1:this1[0] / sum,sum == 0?1:this1[1] / sum];
};
thx_color__$XYZ_XYZ_$Impl_$.get_x = function(this1) {
	return this1[0];
};
thx_color__$XYZ_XYZ_$Impl_$.get_y = function(this1) {
	return this1[1];
};
thx_color__$XYZ_XYZ_$Impl_$.get_z = function(this1) {
	return this1[2];
};
var thx_color__$Yxy_Yxy_$Impl_$ = {};
thx_color__$Yxy_Yxy_$Impl_$.__name__ = ["thx","color","_Yxy","Yxy_Impl_"];
thx_color__$Yxy_Yxy_$Impl_$.create = function(y1,x,y2) {
	return [y1,x,y2];
};
thx_color__$Yxy_Yxy_$Impl_$.fromFloats = function(arr) {
	thx_ArrayFloats.resize(arr,3);
	return thx_color__$Yxy_Yxy_$Impl_$.create(arr[0],arr[1],arr[2]);
};
thx_color__$Yxy_Yxy_$Impl_$.fromString = function(color) {
	var info = thx_color_parse_ColorParser.parseColor(color);
	if(null == info) return null;
	try {
		var _g = info.name;
		switch(_g) {
		case "yxy":
			var channels = thx_color_parse_ColorParser.getFloatChannels(info.channels,3);
			return channels;
		default:
			return null;
		}
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
thx_color__$Yxy_Yxy_$Impl_$._new = function(channels) {
	return channels;
};
thx_color__$Yxy_Yxy_$Impl_$.interpolate = function(this1,other,t) {
	var channels = [thx_Floats.interpolate(t,this1[0],other[0]),thx_Floats.interpolate(t,this1[1],other[1]),thx_Floats.interpolate(t,this1[2],other[2])];
	return channels;
};
thx_color__$Yxy_Yxy_$Impl_$.withY1 = function(this1,newy1) {
	return [newy1,this1[1],this1[2]];
};
thx_color__$Yxy_Yxy_$Impl_$.withY = function(this1,newx) {
	return [this1[0],this1[1],this1[2]];
};
thx_color__$Yxy_Yxy_$Impl_$.withZ = function(this1,newy2) {
	return [this1[0],this1[1],this1[2]];
};
thx_color__$Yxy_Yxy_$Impl_$.toString = function(this1) {
	return "Yxy(" + this1[0] + "," + this1[1] + "," + this1[2] + ")";
};
thx_color__$Yxy_Yxy_$Impl_$.equals = function(this1,other) {
	return Math.abs(this1[0] - other[0]) <= 10e-10 && Math.abs(this1[1] - other[1]) <= 10e-10 && Math.abs(this1[2] - other[2]) <= 10e-10;
};
thx_color__$Yxy_Yxy_$Impl_$.toCIELab = function(this1) {
	return thx_color__$XYZ_XYZ_$Impl_$.toCIELab(thx_color__$Yxy_Yxy_$Impl_$.toXYZ(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toCIELCh = function(this1) {
	return thx_color__$CIELab_CIELab_$Impl_$.toCIELCh(thx_color__$Yxy_Yxy_$Impl_$.toCIELab(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toCMY = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMY(thx_color__$Yxy_Yxy_$Impl_$.toRGBX(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toCMYK = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toCMYK(thx_color__$Yxy_Yxy_$Impl_$.toRGBX(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toGrey = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toGrey(thx_color__$Yxy_Yxy_$Impl_$.toRGBX(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toHSL = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSL(thx_color__$Yxy_Yxy_$Impl_$.toRGBX(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toHSV = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toHSV(thx_color__$Yxy_Yxy_$Impl_$.toRGBX(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toRGB = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGB(thx_color__$Yxy_Yxy_$Impl_$.toRGBX(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toRGBA = function(this1) {
	return thx_color__$RGBXA_RGBXA_$Impl_$.toRGBA(thx_color__$Yxy_Yxy_$Impl_$.toRGBXA(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toRGBX = function(this1) {
	return thx_color__$XYZ_XYZ_$Impl_$.toRGBX(thx_color__$Yxy_Yxy_$Impl_$.toXYZ(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toRGBXA = function(this1) {
	return thx_color__$RGBX_RGBX_$Impl_$.toRGBXA(thx_color__$Yxy_Yxy_$Impl_$.toRGBX(this1));
};
thx_color__$Yxy_Yxy_$Impl_$.toXYZ = function(this1) {
	return [this1[1] * (this1[0] / this1[2]),this1[0],(1 - this1[1] - this1[2]) * (this1[0] / this1[2])];
};
thx_color__$Yxy_Yxy_$Impl_$.get_y1 = function(this1) {
	return this1[0];
};
thx_color__$Yxy_Yxy_$Impl_$.get_x = function(this1) {
	return this1[1];
};
thx_color__$Yxy_Yxy_$Impl_$.get_y2 = function(this1) {
	return this1[2];
};
var thx_color_parse_ColorParser = function() {
	this.pattern_color = new EReg("^\\s*([^(]+)\\s*\\(([^)]*)\\)\\s*$","i");
	this.pattern_channel = new EReg("^\\s*(\\d*.\\d+|\\d+)(%|deg|rad)?\\s*$","i");
};
thx_color_parse_ColorParser.__name__ = ["thx","color","parse","ColorParser"];
thx_color_parse_ColorParser.parseColor = function(s) {
	return thx_color_parse_ColorParser.parser.processColor(s);
};
thx_color_parse_ColorParser.parseHex = function(s) {
	return thx_color_parse_ColorParser.parser.processHex(s);
};
thx_color_parse_ColorParser.parseChannel = function(s) {
	return thx_color_parse_ColorParser.parser.processChannel(s);
};
thx_color_parse_ColorParser.getFloatChannels = function(channels,length,useInt8) {
	if(useInt8 == null) useInt8 = true;
	if(length != channels.length) throw new js__$Boot_HaxeError("invalid number of channels, expected " + length + " but it is " + channels.length);
	return channels.map((function(f,a2) {
		return function(a1) {
			return f(a1,a2);
		};
	})(thx_color_parse_ColorParser.getFloatChannel,useInt8));
};
thx_color_parse_ColorParser.getInt8Channels = function(channels,length) {
	if(length != channels.length) throw new js__$Boot_HaxeError("invalid number of channels, expected " + length + " but it is " + channels.length);
	return channels.map(thx_color_parse_ColorParser.getInt8Channel);
};
thx_color_parse_ColorParser.getFloatChannel = function(channel,useInt8) {
	if(useInt8 == null) useInt8 = true;
	switch(channel[1]) {
	case 5:
		var v = channel[2];
		if(v) return 1; else return 0;
		break;
	case 1:
		var v1 = channel[2];
		return v1;
	case 4:
		var v2 = channel[2];
		return v2;
	case 2:
		var v3 = channel[2];
		return v3;
	case 3:
		var v4 = channel[2];
		if(useInt8) return v4 / 255; else {
			var v5 = channel[2];
			return v5;
		}
		break;
	case 0:
		var v6 = channel[2];
		return v6 / 100;
	}
};
thx_color_parse_ColorParser.getInt8Channel = function(channel) {
	switch(channel[1]) {
	case 5:
		var v = channel[2];
		if(v) return 1; else return 0;
		break;
	case 3:
		var v1 = channel[2];
		return v1;
	case 0:
		var v2 = channel[2];
		return Math.round(255 * v2 / 100);
	default:
		throw new js__$Boot_HaxeError("unable to extract a valid int8 value");
	}
};
thx_color_parse_ColorParser.prototype = {
	pattern_color: null
	,pattern_channel: null
	,processHex: function(s) {
		if(!thx_color_parse_ColorParser.isPureHex.match(s)) {
			if(HxOverrides.substr(s,0,1) == "#") {
				if(s.length == 4) s = s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2) + s.charAt(3) + s.charAt(3); else if(s.length == 5) s = s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2) + s.charAt(3) + s.charAt(3) + s.charAt(4) + s.charAt(4); else s = HxOverrides.substr(s,1,null);
			} else if(HxOverrides.substr(s,0,2) == "0x") s = HxOverrides.substr(s,2,null); else return null;
		}
		var channels = [];
		while(s.length > 0) {
			channels.push(thx_color_parse_ChannelInfo.CIInt8(Std.parseInt("0x" + HxOverrides.substr(s,0,2))));
			s = HxOverrides.substr(s,2,null);
		}
		if(channels.length == 4) return new thx_color_parse_ColorInfo("rgba",channels.slice(1).concat([channels[0]])); else return new thx_color_parse_ColorInfo("rgb",channels);
	}
	,processColor: function(s) {
		if(!this.pattern_color.match(s)) return null;
		var name = this.pattern_color.matched(1);
		if(null == name) return null;
		name = name.toLowerCase();
		var m2 = this.pattern_color.matched(2);
		var s_channels;
		if(null == m2) s_channels = []; else s_channels = m2.split(",");
		var channels = [];
		var channel;
		var _g = 0;
		while(_g < s_channels.length) {
			var s_channel = s_channels[_g];
			++_g;
			channel = this.processChannel(s_channel);
			if(null == channel) return null;
			channels.push(channel);
		}
		return new thx_color_parse_ColorInfo(name,channels);
	}
	,processChannel: function(s) {
		if(!this.pattern_channel.match(s)) return null;
		var value = this.pattern_channel.matched(1);
		var unit = this.pattern_channel.matched(2);
		if(unit == null) unit = "";
		try {
			switch(unit) {
			case "%":
				if(thx_Floats.canParse(value)) return thx_color_parse_ChannelInfo.CIPercent(thx_Floats.parse(value)); else return null;
				break;
			case "deg":
				if(thx_Floats.canParse(value)) return thx_color_parse_ChannelInfo.CIDegree(thx_Floats.parse(value)); else return null;
				break;
			case "DEG":
				if(thx_Floats.canParse(value)) return thx_color_parse_ChannelInfo.CIDegree(thx_Floats.parse(value)); else return null;
				break;
			case "rad":
				if(thx_Floats.canParse(value)) return thx_color_parse_ChannelInfo.CIDegree(thx_Floats.parse(value) * 180 / Math.PI); else return null;
				break;
			case "RAD":
				if(thx_Floats.canParse(value)) return thx_color_parse_ChannelInfo.CIDegree(thx_Floats.parse(value) * 180 / Math.PI); else return null;
				break;
			case "":
				if(thx_Ints.canParse(value)) {
					var i = thx_Ints.parse(value);
					if(i == 0) return thx_color_parse_ChannelInfo.CIBool(false); else if(i == 1) return thx_color_parse_ChannelInfo.CIBool(true); else if(i < 256) return thx_color_parse_ChannelInfo.CIInt8(i); else return thx_color_parse_ChannelInfo.CIInt(i);
				} else if(thx_Floats.canParse(value)) return thx_color_parse_ChannelInfo.CIFloat(thx_Floats.parse(value)); else return null;
				break;
			default:
				return null;
			}
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return null;
		}
	}
	,__class__: thx_color_parse_ColorParser
};
var thx_color_parse_ColorInfo = function(name,channels) {
	this.name = name;
	this.channels = channels;
};
thx_color_parse_ColorInfo.__name__ = ["thx","color","parse","ColorInfo"];
thx_color_parse_ColorInfo.prototype = {
	name: null
	,channels: null
	,toString: function() {
		return "" + this.name + ", channels: " + Std.string(this.channels);
	}
	,__class__: thx_color_parse_ColorInfo
};
var thx_color_parse_ChannelInfo = { __ename__ : ["thx","color","parse","ChannelInfo"], __constructs__ : ["CIPercent","CIFloat","CIDegree","CIInt8","CIInt","CIBool"] };
thx_color_parse_ChannelInfo.CIPercent = function(value) { var $x = ["CIPercent",0,value]; $x.__enum__ = thx_color_parse_ChannelInfo; $x.toString = $estr; return $x; };
thx_color_parse_ChannelInfo.CIFloat = function(value) { var $x = ["CIFloat",1,value]; $x.__enum__ = thx_color_parse_ChannelInfo; $x.toString = $estr; return $x; };
thx_color_parse_ChannelInfo.CIDegree = function(value) { var $x = ["CIDegree",2,value]; $x.__enum__ = thx_color_parse_ChannelInfo; $x.toString = $estr; return $x; };
thx_color_parse_ChannelInfo.CIInt8 = function(value) { var $x = ["CIInt8",3,value]; $x.__enum__ = thx_color_parse_ChannelInfo; $x.toString = $estr; return $x; };
thx_color_parse_ChannelInfo.CIInt = function(value) { var $x = ["CIInt",4,value]; $x.__enum__ = thx_color_parse_ChannelInfo; $x.toString = $estr; return $x; };
thx_color_parse_ChannelInfo.CIBool = function(value) { var $x = ["CIBool",5,value]; $x.__enum__ = thx_color_parse_ChannelInfo; $x.toString = $estr; return $x; };
var thx_error_AbstractMethod = function(posInfo) {
	thx_Error.call(this,"method " + posInfo.className + "." + posInfo.methodName + "() is abstract",null,posInfo);
};
thx_error_AbstractMethod.__name__ = ["thx","error","AbstractMethod"];
thx_error_AbstractMethod.__super__ = thx_Error;
thx_error_AbstractMethod.prototype = $extend(thx_Error.prototype,{
	__class__: thx_error_AbstractMethod
});
var thx_error_ErrorWrapper = function(message,innerError,stack,pos) {
	thx_Error.call(this,message,stack,pos);
	this.innerError = innerError;
};
thx_error_ErrorWrapper.__name__ = ["thx","error","ErrorWrapper"];
thx_error_ErrorWrapper.__super__ = thx_Error;
thx_error_ErrorWrapper.prototype = $extend(thx_Error.prototype,{
	innerError: null
	,__class__: thx_error_ErrorWrapper
});
var thx_error_NullArgument = function(message,posInfo) {
	thx_Error.call(this,message,null,posInfo);
};
thx_error_NullArgument.__name__ = ["thx","error","NullArgument"];
thx_error_NullArgument.__super__ = thx_Error;
thx_error_NullArgument.prototype = $extend(thx_Error.prototype,{
	__class__: thx_error_NullArgument
});
var thx_promise_Future = function() {
	this.handlers = [];
	this.state = haxe_ds_Option.None;
};
thx_promise_Future.__name__ = ["thx","promise","Future"];
thx_promise_Future.sequence = function(arr) {
	return thx_promise_Future.create(function(callback) {
		var poll;
		var poll1 = null;
		poll1 = function(_) {
			if(arr.length == 0) callback(thx_Nil.nil); else arr.shift().then(poll1);
		};
		poll = poll1;
		poll(null);
	});
};
thx_promise_Future.afterAll = function(arr) {
	return thx_promise_Future.create(function(callback) {
		thx_promise_Future.all(arr).then(function(_) {
			callback(thx_Nil.nil);
		});
	});
};
thx_promise_Future.all = function(arr) {
	return thx_promise_Future.create(function(callback) {
		var results = [];
		var counter = 0;
		thx_Arrays.mapi(arr,function(p,i) {
			p.then(function(value) {
				results[i] = value;
				counter++;
				if(counter == arr.length) callback(results);
			});
		});
	});
};
thx_promise_Future.create = function(handler) {
	var future = new thx_promise_Future();
	handler($bind(future,future.setState));
	return future;
};
thx_promise_Future.flatMap = function(future) {
	return thx_promise_Future.create(function(callback) {
		future.then(function(future1) {
			future1.then(callback);
		});
	});
};
thx_promise_Future.value = function(v) {
	return thx_promise_Future.create(function(callback) {
		callback(v);
	});
};
thx_promise_Future.prototype = {
	handlers: null
	,state: null
	,delay: function(delayms) {
		if(null == delayms) return thx_promise_Future.flatMap(this.map(function(value) {
			return thx_promise_Timer.immediateValue(value);
		})); else return thx_promise_Future.flatMap(this.map(function(value1) {
			return thx_promise_Timer.delayValue(value1,delayms);
		}));
	}
	,hasValue: function() {
		return thx_Options.toBool(this.state);
	}
	,map: function(handler) {
		var _g = this;
		return thx_promise_Future.create(function(callback) {
			_g.then(function(value) {
				callback(handler(value));
			});
		});
	}
	,mapAsync: function(handler) {
		var _g = this;
		return thx_promise_Future.create(function(callback) {
			_g.then(function(result) {
				handler(result,callback);
			});
		});
	}
	,mapPromise: function(handler) {
		var _g = this;
		return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
			_g.then(function(result) {
				thx_promise__$Promise_Promise_$Impl_$.failure(thx_promise__$Promise_Promise_$Impl_$.success(handler(result),resolve),reject);
			});
		});
	}
	,mapFuture: function(handler) {
		return thx_promise_Future.flatMap(this.map(handler));
	}
	,then: function(handler) {
		this.handlers.push(handler);
		this.update();
		return this;
	}
	,toString: function() {
		return "Future";
	}
	,setState: function(newstate) {
		{
			var _g = this.state;
			switch(_g[1]) {
			case 1:
				this.state = haxe_ds_Option.Some(newstate);
				break;
			case 0:
				var r = _g[2];
				throw new thx_Error("future was already \"" + Std.string(r) + "\", can't apply the new state \"" + Std.string(newstate) + "\"",null,{ fileName : "Future.hx", lineNumber : 108, className : "thx.promise.Future", methodName : "setState"});
				break;
			}
		}
		this.update();
		return this;
	}
	,update: function() {
		{
			var _g = this.state;
			switch(_g[1]) {
			case 1:
				break;
			case 0:
				var result = _g[2];
				var index = -1;
				while(++index < this.handlers.length) this.handlers[index](result);
				this.handlers = [];
				break;
			}
		}
	}
	,__class__: thx_promise_Future
};
var thx_promise_Futures = function() { };
thx_promise_Futures.__name__ = ["thx","promise","Futures"];
thx_promise_Futures.join = function(p1,p2) {
	return thx_promise_Future.create(function(callback) {
		var counter = 0;
		var v1 = null;
		var v2 = null;
		var complete = function() {
			if(counter < 2) return;
			callback({ _0 : v1, _1 : v2});
		};
		p1.then(function(v) {
			counter++;
			v1 = v;
			complete();
		});
		p2.then(function(v3) {
			counter++;
			v2 = v3;
			complete();
		});
	});
};
thx_promise_Futures.log = function(future,prefix) {
	if(prefix == null) prefix = "";
	return future.then(function(r) {
		haxe_Log.trace("" + prefix + " VALUE: " + Std.string(r),{ fileName : "Future.hx", lineNumber : 155, className : "thx.promise.Futures", methodName : "log"});
	});
};
var thx_promise_FutureTuple6 = function() { };
thx_promise_FutureTuple6.__name__ = ["thx","promise","FutureTuple6"];
thx_promise_FutureTuple6.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx_promise_FutureTuple6.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,t._2,t._3,t._4,t._5,cb);
		return;
	});
};
thx_promise_FutureTuple6.mapTupleFuture = function(future,callback) {
	return thx_promise_Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4,t._5);
	}));
};
thx_promise_FutureTuple6.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
var thx_promise_FutureTuple5 = function() { };
thx_promise_FutureTuple5.__name__ = ["thx","promise","FutureTuple5"];
thx_promise_FutureTuple5.join = function(p1,p2) {
	return thx_promise_Future.create(function(callback) {
		thx_promise_Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx_promise_FutureTuple5.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4);
	});
};
thx_promise_FutureTuple5.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,t._2,t._3,t._4,cb);
		return;
	});
};
thx_promise_FutureTuple5.mapTupleFuture = function(future,callback) {
	return thx_promise_Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3,t._4);
	}));
};
thx_promise_FutureTuple5.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2,t._3,t._4);
	});
};
var thx_promise_FutureTuple4 = function() { };
thx_promise_FutureTuple4.__name__ = ["thx","promise","FutureTuple4"];
thx_promise_FutureTuple4.join = function(p1,p2) {
	return thx_promise_Future.create(function(callback) {
		thx_promise_Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx_promise_FutureTuple4.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3);
	});
};
thx_promise_FutureTuple4.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,t._2,t._3,cb);
		return;
	});
};
thx_promise_FutureTuple4.mapTupleFuture = function(future,callback) {
	return thx_promise_Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2,t._3);
	}));
};
thx_promise_FutureTuple4.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2,t._3);
	});
};
var thx_promise_FutureTuple3 = function() { };
thx_promise_FutureTuple3.__name__ = ["thx","promise","FutureTuple3"];
thx_promise_FutureTuple3.join = function(p1,p2) {
	return thx_promise_Future.create(function(callback) {
		thx_promise_Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx_promise_FutureTuple3.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1,t._2);
	});
};
thx_promise_FutureTuple3.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,t._2,cb);
		return;
	});
};
thx_promise_FutureTuple3.mapTupleFuture = function(future,callback) {
	return thx_promise_Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1,t._2);
	}));
};
thx_promise_FutureTuple3.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1,t._2);
	});
};
var thx_promise_FutureTuple2 = function() { };
thx_promise_FutureTuple2.__name__ = ["thx","promise","FutureTuple2"];
thx_promise_FutureTuple2.join = function(p1,p2) {
	return thx_promise_Future.create(function(callback) {
		thx_promise_Futures.join(p1,p2).then(function(t) {
			callback((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : t._1};
				return $r;
			}(this)));
		});
	});
};
thx_promise_FutureTuple2.mapTuple = function(future,callback) {
	return future.map(function(t) {
		return callback(t._0,t._1);
	});
};
thx_promise_FutureTuple2.mapTupleAsync = function(future,callback) {
	return future.mapAsync(function(t,cb) {
		callback(t._0,t._1,cb);
		return;
	});
};
thx_promise_FutureTuple2.mapTupleFuture = function(future,callback) {
	return thx_promise_Future.flatMap(future.map(function(t) {
		return callback(t._0,t._1);
	}));
};
thx_promise_FutureTuple2.tuple = function(future,callback) {
	return future.then(function(t) {
		callback(t._0,t._1);
	});
};
var thx_promise_FutureNil = function() { };
thx_promise_FutureNil.__name__ = ["thx","promise","FutureNil"];
thx_promise_FutureNil.join = function(p1,p2) {
	return thx_promise_Future.create(function(callback) {
		thx_promise_Futures.join(p1,p2).then(function(t) {
			callback(t._1);
		});
	});
};
thx_promise_FutureNil.nil = function(p) {
	return thx_promise_Future.create(function(callback) {
		p.then(function(_) {
			callback(thx_Nil.nil);
		});
	});
};
var thx_promise__$Promise_Promise_$Impl_$ = {};
thx_promise__$Promise_Promise_$Impl_$.__name__ = ["thx","promise","_Promise","Promise_Impl_"];
thx_promise__$Promise_Promise_$Impl_$.futureToPromise = function(future) {
	return future.map(function(v) {
		return thx_Either.Right(v);
	});
};
thx_promise__$Promise_Promise_$Impl_$.sequence = function(arr) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		var poll;
		var poll1 = null;
		poll1 = function(_) {
			if(arr.length == 0) resolve(thx_promise__$Promise_Promise_$Impl_$.nil); else thx_promise__$Promise_Promise_$Impl_$.mapFailure(thx_promise__$Promise_Promise_$Impl_$.mapSuccess(arr.shift(),poll1),reject);
		};
		poll = poll1;
		poll(null);
	});
};
thx_promise__$Promise_Promise_$Impl_$.afterAll = function(arr) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.either(thx_promise__$Promise_Promise_$Impl_$.all(arr),function(_) {
			resolve(thx_Nil.nil);
		},reject);
	});
};
thx_promise__$Promise_Promise_$Impl_$.all = function(arr) {
	if(arr.length == 0) return thx_promise__$Promise_Promise_$Impl_$.value([]);
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		var results = [];
		var counter = 0;
		var hasError = false;
		thx_Arrays.mapi(arr,function(p,i) {
			thx_promise__$Promise_Promise_$Impl_$.either(p,function(value) {
				if(hasError) return;
				results[i] = value;
				counter++;
				if(counter == arr.length) resolve(results);
			},function(err) {
				if(hasError) return;
				hasError = true;
				reject(err);
			});
		});
	});
};
thx_promise__$Promise_Promise_$Impl_$.create = function(callback) {
	return thx_promise_Future.create(function(cb) {
		callback(function(value) {
			cb(thx_Either.Right(value));
		},function(error) {
			cb(thx_Either.Left(error));
		});
	});
};
thx_promise__$Promise_Promise_$Impl_$.createFulfill = function(callback) {
	return thx_promise_Future.create(callback);
};
thx_promise__$Promise_Promise_$Impl_$.error = function(err) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(_,reject) {
		reject(err);
	});
};
thx_promise__$Promise_Promise_$Impl_$.value = function(v) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,_) {
		resolve(v);
	});
};
thx_promise__$Promise_Promise_$Impl_$.always = function(this1,handler) {
	this1.then(function(_) {
		handler();
	});
};
thx_promise__$Promise_Promise_$Impl_$.either = function(this1,success,failure) {
	this1.then(function(r) {
		switch(r[1]) {
		case 1:
			var value = r[2];
			success(value);
			break;
		case 0:
			var error = r[2];
			failure(error);
			break;
		}
	});
	return this1;
};
thx_promise__$Promise_Promise_$Impl_$.delay = function(this1,delayms) {
	return this1.delay(delayms);
};
thx_promise__$Promise_Promise_$Impl_$.isFailure = function(this1) {
	{
		var _g = this1.state;
		switch(_g[1]) {
		case 1:
			return false;
		case 0:
			switch(_g[2][1]) {
			case 1:
				return false;
			default:
				return true;
			}
			break;
		}
	}
};
thx_promise__$Promise_Promise_$Impl_$.isResolved = function(this1) {
	{
		var _g = this1.state;
		switch(_g[1]) {
		case 1:
			return false;
		case 0:
			switch(_g[2][1]) {
			case 0:
				return false;
			default:
				return true;
			}
			break;
		}
	}
};
thx_promise__$Promise_Promise_$Impl_$.failure = function(this1,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.either(this1,function(_) {
	},failure);
};
thx_promise__$Promise_Promise_$Impl_$.mapAlways = function(this1,handler) {
	return this1.map(function(_) {
		return handler();
	});
};
thx_promise__$Promise_Promise_$Impl_$.mapAlwaysAsync = function(this1,handler) {
	return this1.mapAsync(function(_,cb) {
		handler(cb);
		return;
	});
};
thx_promise__$Promise_Promise_$Impl_$.mapAlwaysFuture = function(this1,handler) {
	return thx_promise_Future.flatMap(this1.map(function(_) {
		return handler();
	}));
};
thx_promise__$Promise_Promise_$Impl_$.mapEither = function(this1,success,failure) {
	return this1.map(function(result) {
		switch(result[1]) {
		case 1:
			var value = result[2];
			return success(value);
		case 0:
			var error = result[2];
			return failure(error);
		}
	});
};
thx_promise__$Promise_Promise_$Impl_$.mapEitherFuture = function(this1,success,failure) {
	return thx_promise_Future.flatMap(this1.map(function(result) {
		switch(result[1]) {
		case 1:
			var value = result[2];
			return success(value);
		case 0:
			var error = result[2];
			return failure(error);
		}
	}));
};
thx_promise__$Promise_Promise_$Impl_$.mapFailure = function(this1,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.mapEither(this1,function(value) {
		return value;
	},failure);
};
thx_promise__$Promise_Promise_$Impl_$.mapFailureFuture = function(this1,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.mapEitherFuture(this1,function(value) {
		return thx_promise_Future.value(value);
	},failure);
};
thx_promise__$Promise_Promise_$Impl_$.mapFailurePromise = function(this1,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.mapEitherFuture(this1,function(value) {
		return thx_promise__$Promise_Promise_$Impl_$.value(value);
	},failure);
};
thx_promise__$Promise_Promise_$Impl_$.mapSuccess = function(this1,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapEitherFuture(this1,function(v) {
		return thx_promise__$Promise_Promise_$Impl_$.value(success(v));
	},function(err) {
		return thx_promise__$Promise_Promise_$Impl_$.error(err);
	});
};
thx_promise__$Promise_Promise_$Impl_$.mapSuccessPromise = function(this1,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapEitherFuture(this1,success,function(err) {
		return thx_promise__$Promise_Promise_$Impl_$.error(err);
	});
};
thx_promise__$Promise_Promise_$Impl_$.success = function(this1,success) {
	return thx_promise__$Promise_Promise_$Impl_$.either(this1,success,function(_) {
	});
};
thx_promise__$Promise_Promise_$Impl_$.throwFailure = function(this1) {
	return thx_promise__$Promise_Promise_$Impl_$.failure(this1,function(err) {
		throw err;
	});
};
thx_promise__$Promise_Promise_$Impl_$.toString = function(this1) {
	return "Promise";
};
var thx_promise_Promises = function() { };
thx_promise_Promises.__name__ = ["thx","promise","Promises"];
thx_promise_Promises.join = function(p1,p2) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		var hasError = false;
		var counter = 0;
		var v1 = null;
		var v2 = null;
		var complete = function() {
			if(counter < 2) return;
			resolve({ _0 : v1, _1 : v2});
		};
		var handleError = function(error) {
			if(hasError) return;
			hasError = true;
			reject(error);
		};
		thx_promise__$Promise_Promise_$Impl_$.either(p1,function(v) {
			if(hasError) return;
			counter++;
			v1 = v;
			complete();
		},handleError);
		thx_promise__$Promise_Promise_$Impl_$.either(p2,function(v3) {
			if(hasError) return;
			counter++;
			v2 = v3;
			complete();
		},handleError);
	});
};
thx_promise_Promises.log = function(promise,prefix) {
	if(prefix == null) prefix = "";
	return thx_promise__$Promise_Promise_$Impl_$.either(promise,function(r) {
		haxe_Log.trace("" + prefix + " SUCCESS: " + Std.string(r),{ fileName : "Promise.hx", lineNumber : 202, className : "thx.promise.Promises", methodName : "log"});
	},function(e) {
		haxe_Log.trace("" + prefix + " ERROR: " + e.toString(),{ fileName : "Promise.hx", lineNumber : 203, className : "thx.promise.Promises", methodName : "log"});
	});
};
var thx_promise_PromiseTuple6 = function() { };
thx_promise_PromiseTuple6.__name__ = ["thx","promise","PromiseTuple6"];
thx_promise_PromiseTuple6.mapTuplePromise = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx_promise_PromiseTuple6.mapTuple = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4,t._5);
	});
};
thx_promise_PromiseTuple6.tuple = function(promise,success,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.either(promise,function(t) {
		success(t._0,t._1,t._2,t._3,t._4,t._5);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseTuple5 = function() { };
thx_promise_PromiseTuple5.__name__ = ["thx","promise","PromiseTuple5"];
thx_promise_PromiseTuple5.join = function(p1,p2) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.either(thx_promise_Promises.join(p1,p2),function(t) {
			resolve((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : this1._4, _5 : t._1};
				return $r;
			}(this)));
		},function(e) {
			reject(e);
		});
	});
};
thx_promise_PromiseTuple5.mapTuplePromise = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4);
	});
};
thx_promise_PromiseTuple5.mapTuple = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2,t._3,t._4);
	});
};
thx_promise_PromiseTuple5.tuple = function(promise,success,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.either(promise,function(t) {
		success(t._0,t._1,t._2,t._3,t._4);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseTuple4 = function() { };
thx_promise_PromiseTuple4.__name__ = ["thx","promise","PromiseTuple4"];
thx_promise_PromiseTuple4.join = function(p1,p2) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.either(thx_promise_Promises.join(p1,p2),function(t) {
			resolve((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : this1._3, _4 : t._1};
				return $r;
			}(this)));
		},function(e) {
			reject(e);
		});
	});
};
thx_promise_PromiseTuple4.mapTuplePromise = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2,t._3);
	});
};
thx_promise_PromiseTuple4.mapTuple = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2,t._3);
	});
};
thx_promise_PromiseTuple4.tuple = function(promise,success,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.either(promise,function(t) {
		success(t._0,t._1,t._2,t._3);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseTuple3 = function() { };
thx_promise_PromiseTuple3.__name__ = ["thx","promise","PromiseTuple3"];
thx_promise_PromiseTuple3.join = function(p1,p2) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.either(thx_promise_Promises.join(p1,p2),function(t) {
			resolve((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : this1._2, _3 : t._1};
				return $r;
			}(this)));
		},function(e) {
			reject(e);
		});
	});
};
thx_promise_PromiseTuple3.mapTuplePromise = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1,t._2);
	});
};
thx_promise_PromiseTuple3.mapTuple = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccess(promise,function(t) {
		return success(t._0,t._1,t._2);
	});
};
thx_promise_PromiseTuple3.tuple = function(promise,success,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.either(promise,function(t) {
		success(t._0,t._1,t._2);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseTuple2 = function() { };
thx_promise_PromiseTuple2.__name__ = ["thx","promise","PromiseTuple2"];
thx_promise_PromiseTuple2.join = function(p1,p2) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.either(thx_promise_Promises.join(p1,p2),function(t) {
			resolve((function($this) {
				var $r;
				var this1 = t._0;
				$r = { _0 : this1._0, _1 : this1._1, _2 : t._1};
				return $r;
			}(this)));
		},function(e) {
			reject(e);
		});
	});
};
thx_promise_PromiseTuple2.mapTuplePromise = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccessPromise(promise,function(t) {
		return success(t._0,t._1);
	});
};
thx_promise_PromiseTuple2.mapTuple = function(promise,success) {
	return thx_promise__$Promise_Promise_$Impl_$.mapSuccess(promise,function(t) {
		return success(t._0,t._1);
	});
};
thx_promise_PromiseTuple2.tuple = function(promise,success,failure) {
	return thx_promise__$Promise_Promise_$Impl_$.either(promise,function(t) {
		success(t._0,t._1);
	},null == failure?function(_) {
	}:failure);
};
var thx_promise_PromiseNil = function() { };
thx_promise_PromiseNil.__name__ = ["thx","promise","PromiseNil"];
thx_promise_PromiseNil.join = function(p1,p2) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.either(thx_promise_Promises.join(p1,p2),function(t) {
			resolve(t._1);
		},function(e) {
			reject(e);
		});
	});
};
thx_promise_PromiseNil.nil = function(p) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.failure(thx_promise__$Promise_Promise_$Impl_$.success(p,function(_) {
			resolve(thx_Nil.nil);
		}),reject);
	});
};
var thx_promise_PromiseAPlus = function() { };
thx_promise_PromiseAPlus.__name__ = ["thx","promise","PromiseAPlus"];
thx_promise_PromiseAPlus.promise = function(p) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		p.then(resolve,function(e) {
			reject(thx_Error.fromDynamic(e,{ fileName : "Promise.hx", lineNumber : 352, className : "thx.promise.PromiseAPlus", methodName : "promise"}));
		});
	});
};
thx_promise_PromiseAPlus.aPlus = function(p) {
	return new Promise(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.failure(thx_promise__$Promise_Promise_$Impl_$.success(p,resolve),reject);
	});
};
var thx_promise_PromiseAPlusVoid = function() { };
thx_promise_PromiseAPlusVoid.__name__ = ["thx","promise","PromiseAPlusVoid"];
thx_promise_PromiseAPlusVoid.promise = function(p) {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,reject) {
		p.then(function() {
			resolve(thx_Nil.nil);
		},function(e) {
			reject(thx_Error.fromDynamic(e,{ fileName : "Promise.hx", lineNumber : 364, className : "thx.promise.PromiseAPlusVoid", methodName : "promise"}));
		});
	});
};
thx_promise_PromiseAPlusVoid.aPlus = function(p) {
	return new Promise(function(resolve,reject) {
		thx_promise__$Promise_Promise_$Impl_$.failure(thx_promise__$Promise_Promise_$Impl_$.success(p,function() {
			resolve(thx_Nil.nil);
		}),reject);
	});
};
var thx_promise_Timer = function() { };
thx_promise_Timer.__name__ = ["thx","promise","Timer"];
thx_promise_Timer.delay = function(delayms) {
	return thx_promise_Timer.delayValue(thx_Nil.nil,delayms);
};
thx_promise_Timer.delayValue = function(value,delayms) {
	return thx_promise_Future.create(function(callback) {
		thx_Timer.delay((function(f,a1) {
			return function() {
				f(a1);
			};
		})(callback,value),delayms);
	});
};
thx_promise_Timer.immediate = function() {
	return thx_promise_Timer.immediateValue(thx_Nil.nil);
};
thx_promise_Timer.immediateValue = function(value) {
	return thx_promise_Future.create(function(callback) {
		thx_Timer.immediate((function(f,a1) {
			return function() {
				f(a1);
			};
		})(callback,value));
	});
};
var thx_stream_Emitter = function(init) {
	this.init = init;
};
thx_stream_Emitter.__name__ = ["thx","stream","Emitter"];
thx_stream_Emitter.prototype = {
	init: null
	,feed: function(value) {
		var stream = new thx_stream_Stream(null);
		stream.subscriber = function(r) {
			switch(r[1]) {
			case 0:
				var v = r[2];
				value.set(v);
				break;
			case 1:
				var c = r[2];
				if(c) stream.cancel(); else stream.end();
				break;
			}
		};
		value.upStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(value.upStreams,stream);
		});
		this.init(stream);
		return stream;
	}
	,plug: function(bus) {
		var stream = new thx_stream_Stream(null);
		stream.subscriber = $bind(bus,bus.emit);
		bus.upStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(bus.upStreams,stream);
		});
		this.init(stream);
		return stream;
	}
	,sign: function(subscriber) {
		var stream = new thx_stream_Stream(subscriber);
		this.init(stream);
		return stream;
	}
	,subscribe: function(pulse,end) {
		if(null != pulse) pulse = pulse; else pulse = function(_) {
		};
		if(null != end) end = end; else end = function(_1) {
		};
		var stream = new thx_stream_Stream(function(r) {
			switch(r[1]) {
			case 0:
				var v = r[2];
				pulse(v);
				break;
			case 1:
				var c = r[2];
				end(c);
				break;
			}
		});
		this.init(stream);
		return stream;
	}
	,concat: function(other) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					stream.pulse(v);
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						other.init(stream);
						break;
					}
					break;
				}
			}));
		});
	}
	,count: function() {
		return this.map((function() {
			var c = 0;
			return function(_) {
				return ++c;
			};
		})());
	}
	,debounce: function(delay) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var cancel = function() {
			};
			stream.addCleanUp(function() {
				cancel();
			});
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					cancel();
					cancel = thx_Timer.delay((function(f,v1) {
						return function() {
							f(v1);
						};
					})($bind(stream,stream.pulse),v),delay);
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						thx_Timer.delay($bind(stream,stream.end),delay);
						break;
					}
					break;
				}
			}));
		});
	}
	,delay: function(time) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var cancel = thx_Timer.delay(function() {
				_g.init(stream);
			},time);
			stream.addCleanUp(cancel);
		});
	}
	,diff: function(init,f) {
		return this.window(2,null != init).map(function(a) {
			if(a.length == 1) return f(init,a[0]); else return f(a[0],a[1]);
		});
	}
	,merge: function(other) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			_g.init(stream);
			other.init(stream);
		});
	}
	,previous: function() {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var value = null;
			var first = true;
			var pulse = function() {
				if(first) {
					first = false;
					return;
				}
				stream.pulse(value);
			};
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					pulse();
					value = v;
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,reduce: function(acc,f) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					acc = f(acc,v);
					stream.pulse(acc);
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,window: function(size,emitWithLess) {
		if(emitWithLess == null) emitWithLess = false;
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var buf = [];
			var pulse = function() {
				if(buf.length > size) buf.shift();
				if(buf.length == size || emitWithLess) stream.pulse(buf.slice());
			};
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					buf.push(v);
					pulse();
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,map: function(f) {
		return this.mapFuture(function(v) {
			return thx_promise_Future.value(f(v));
		});
	}
	,mapFuture: function(f) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					f(v).then($bind(stream,stream.pulse));
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,toOption: function() {
		return this.map(function(v) {
			if(null == v) return haxe_ds_Option.None; else return haxe_ds_Option.Some(v);
		});
	}
	,toNil: function() {
		return this.map(function(_) {
			return thx_Nil.nil;
		});
	}
	,toTrue: function() {
		return this.map(function(_) {
			return true;
		});
	}
	,toFalse: function() {
		return this.map(function(_) {
			return false;
		});
	}
	,toValue: function(value) {
		return this.map(function(_) {
			return value;
		});
	}
	,filter: function(f) {
		return this.filterFuture(function(v) {
			return thx_promise_Future.value(f(v));
		});
	}
	,filterFuture: function(f) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					f(v).then(function(c) {
						if(c) stream.pulse(v);
					});
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,first: function() {
		return this.take(1);
	}
	,distinct: function(equals) {
		if(null == equals) equals = function(a,b) {
			return a == b;
		};
		var last = null;
		return this.filter(function(v) {
			if(equals(v,last)) return false; else {
				last = v;
				return true;
			}
		});
	}
	,last: function() {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var last = null;
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					last = v;
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.pulse(last);
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,memberOf: function(arr,equality) {
		return this.filter(function(v) {
			return thx_Arrays.contains(arr,v,equality);
		});
	}
	,notNull: function() {
		return this.filter(function(v) {
			return v != null;
		});
	}
	,skip: function(n) {
		return this.skipUntil((function() {
			var count = 0;
			return function(_) {
				return count++ < n;
			};
		})());
	}
	,skipUntil: function(predicate) {
		return this.filter((function() {
			var flag = false;
			return function(v) {
				if(flag) return true;
				if(predicate(v)) return false;
				return flag = true;
			};
		})());
	}
	,take: function(count) {
		return this.takeUntil((function(counter) {
			return function(_) {
				return counter++ < count;
			};
		})(0));
	}
	,takeAt: function(index) {
		return this.take(index + 1).last();
	}
	,takeLast: function(n) {
		return thx_stream_EmitterArrays.flatten(this.window(n).last());
	}
	,takeUntil: function(f) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var instream = null;
			instream = new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					if(f(v)) stream.pulse(v); else {
						instream.end();
						stream.end();
					}
					break;
				case 1:
					switch(r[2]) {
					case true:
						instream.cancel();
						stream.cancel();
						break;
					case false:
						instream.end();
						stream.end();
						break;
					}
					break;
				}
			});
			_g.init(instream);
		});
	}
	,withValue: function(expected) {
		return this.filter(function(v) {
			return v == expected;
		});
	}
	,pair: function(other) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var _0 = null;
			var _1 = null;
			stream.addCleanUp(function() {
				_0 = null;
				_1 = null;
			});
			var pulse = function() {
				if(null == _0 || null == _1) return;
				stream.pulse({ _0 : _0, _1 : _1});
			};
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					_0 = v;
					pulse();
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
			other.init(new thx_stream_Stream(function(r1) {
				switch(r1[1]) {
				case 0:
					var v1 = r1[2];
					_1 = v1;
					pulse();
					break;
				case 1:
					switch(r1[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,sampleBy: function(sampler) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var _0 = null;
			var _1 = null;
			stream.addCleanUp(function() {
				_0 = null;
				_1 = null;
			});
			var pulse = function() {
				if(null == _0 || null == _1) return;
				stream.pulse({ _0 : _0, _1 : _1});
			};
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					_0 = v;
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
			sampler.init(new thx_stream_Stream(function(r1) {
				switch(r1[1]) {
				case 0:
					var v1 = r1[2];
					_1 = v1;
					pulse();
					break;
				case 1:
					switch(r1[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,samplerOf: function(sampled) {
		return sampled.sampleBy(this).map(function(t) {
			return { _0 : t._1, _1 : t._0};
		});
	}
	,zip: function(other) {
		var _g = this;
		return new thx_stream_Emitter(function(stream) {
			var _0 = [];
			var _1 = [];
			stream.addCleanUp(function() {
				_0 = null;
				_1 = null;
			});
			var pulse = function() {
				if(_0.length == 0 || _1.length == 0) return;
				stream.pulse((function($this) {
					var $r;
					var _01 = _0.shift();
					var _11 = _1.shift();
					$r = { _0 : _01, _1 : _11};
					return $r;
				}(this)));
			};
			_g.init(new thx_stream_Stream(function(r) {
				switch(r[1]) {
				case 0:
					var v = r[2];
					_0.push(v);
					pulse();
					break;
				case 1:
					switch(r[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
			other.init(new thx_stream_Stream(function(r1) {
				switch(r1[1]) {
				case 0:
					var v1 = r1[2];
					_1.push(v1);
					pulse();
					break;
				case 1:
					switch(r1[2]) {
					case true:
						stream.cancel();
						break;
					case false:
						stream.end();
						break;
					}
					break;
				}
			}));
		});
	}
	,audit: function(handler) {
		return this.map(function(v) {
			handler(v);
			return v;
		});
	}
	,log: function(prefix,posInfo) {
		if(prefix == null) prefix = ""; else prefix = "" + prefix + ": ";
		return this.map(function(v) {
			haxe_Log.trace("" + prefix + Std.string(v),posInfo);
			return v;
		});
	}
	,split: function() {
		var _g = this;
		var inited = false;
		var streams = [];
		var init = function(stream) {
			streams.push(stream);
			if(!inited) {
				inited = true;
				thx_Timer.immediate(function() {
					_g.init(new thx_stream_Stream(function(r) {
						switch(r[1]) {
						case 0:
							var v = r[2];
							var _g1 = 0;
							while(_g1 < streams.length) {
								var s = streams[_g1];
								++_g1;
								s.pulse(v);
							}
							break;
						case 1:
							switch(r[2]) {
							case true:
								var _g11 = 0;
								while(_g11 < streams.length) {
									var s1 = streams[_g11];
									++_g11;
									s1.cancel();
								}
								break;
							case false:
								var _g12 = 0;
								while(_g12 < streams.length) {
									var s2 = streams[_g12];
									++_g12;
									s2.end();
								}
								break;
							}
							break;
						}
					}));
				});
			}
		};
		var _0 = new thx_stream_Emitter(init);
		var _1 = new thx_stream_Emitter(init);
		return { _0 : _0, _1 : _1};
	}
	,__class__: thx_stream_Emitter
};
var thx_stream_Bus = function(distinctValuesOnly,equal) {
	if(distinctValuesOnly == null) distinctValuesOnly = false;
	var _g = this;
	this.distinctValuesOnly = distinctValuesOnly;
	if(null == equal) this.equal = function(a,b) {
		return a == b;
	}; else this.equal = equal;
	this.downStreams = [];
	this.upStreams = [];
	thx_stream_Emitter.call(this,function(stream) {
		_g.downStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(_g.downStreams,stream);
		});
	});
};
thx_stream_Bus.__name__ = ["thx","stream","Bus"];
thx_stream_Bus.__super__ = thx_stream_Emitter;
thx_stream_Bus.prototype = $extend(thx_stream_Emitter.prototype,{
	downStreams: null
	,upStreams: null
	,distinctValuesOnly: null
	,equal: null
	,value: null
	,cancel: function() {
		this.emit(thx_stream_StreamValue.End(true));
	}
	,clear: function() {
		this.clearEmitters();
		this.clearStreams();
	}
	,clearStreams: function() {
		var _g = 0;
		var _g1 = this.downStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.end();
		}
	}
	,clearEmitters: function() {
		var _g = 0;
		var _g1 = this.upStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.cancel();
		}
	}
	,emit: function(value) {
		switch(value[1]) {
		case 0:
			var v = value[2];
			if(this.distinctValuesOnly) {
				if(this.equal(v,this.value)) return;
				this.value = v;
			}
			var _g = 0;
			var _g1 = this.downStreams.slice();
			while(_g < _g1.length) {
				var stream = _g1[_g];
				++_g;
				stream.pulse(v);
			}
			break;
		case 1:
			switch(value[2]) {
			case true:
				var _g2 = 0;
				var _g11 = this.downStreams.slice();
				while(_g2 < _g11.length) {
					var stream1 = _g11[_g2];
					++_g2;
					stream1.cancel();
				}
				break;
			case false:
				var _g3 = 0;
				var _g12 = this.downStreams.slice();
				while(_g3 < _g12.length) {
					var stream2 = _g12[_g3];
					++_g3;
					stream2.end();
				}
				break;
			}
			break;
		}
	}
	,end: function() {
		this.emit(thx_stream_StreamValue.End(false));
	}
	,pulse: function(value) {
		this.emit(thx_stream_StreamValue.Pulse(value));
	}
	,__class__: thx_stream_Bus
});
var thx_stream_Emitters = function() { };
thx_stream_Emitters.__name__ = ["thx","stream","Emitters"];
thx_stream_Emitters.skipNull = function(emitter) {
	return emitter.filter(function(value) {
		return null != value;
	});
};
thx_stream_Emitters.unique = function(emitter) {
	return emitter.filter((function() {
		var buf = [];
		return function(v) {
			if(HxOverrides.indexOf(buf,v,0) >= 0) return false; else {
				buf.push(v);
				return true;
			}
		};
	})());
};
var thx_stream_EmitterStrings = function() { };
thx_stream_EmitterStrings.__name__ = ["thx","stream","EmitterStrings"];
thx_stream_EmitterStrings.match = function(emitter,pattern) {
	return emitter.filter(function(s) {
		return pattern.match(s);
	});
};
thx_stream_EmitterStrings.toBool = function(emitter) {
	return emitter.map(function(s) {
		return s != null && s != "";
	});
};
thx_stream_EmitterStrings.truthy = function(emitter) {
	return emitter.filter(function(s) {
		return s != null && s != "";
	});
};
thx_stream_EmitterStrings.unique = function(emitter) {
	return emitter.filter((function() {
		var buf = new haxe_ds_StringMap();
		return function(v) {
			if(__map_reserved[v] != null?buf.existsReserved(v):buf.h.hasOwnProperty(v)) return false; else {
				if(__map_reserved[v] != null) buf.setReserved(v,true); else buf.h[v] = true;
				return true;
			}
		};
	})());
};
var thx_stream_EmitterInts = function() { };
thx_stream_EmitterInts.__name__ = ["thx","stream","EmitterInts"];
thx_stream_EmitterInts.average = function(emitter) {
	return emitter.map((function() {
		var sum = 0.0;
		var count = 0;
		return function(v) {
			return (sum += v) / ++count;
		};
	})());
};
thx_stream_EmitterInts.greaterThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v > x;
	});
};
thx_stream_EmitterInts.greaterThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v >= x;
	});
};
thx_stream_EmitterInts.inRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v <= max && v >= min;
	});
};
thx_stream_EmitterInts.insideRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v < max && v > min;
	});
};
thx_stream_EmitterInts.lessThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v < x;
	});
};
thx_stream_EmitterInts.lessThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v <= x;
	});
};
thx_stream_EmitterInts.max = function(emitter) {
	return emitter.filter((function() {
		var max = null;
		return function(v) {
			if(null == max || v > max) {
				max = v;
				return true;
			} else return false;
		};
	})());
};
thx_stream_EmitterInts.min = function(emitter) {
	return emitter.filter((function() {
		var min = null;
		return function(v) {
			if(null == min || v < min) {
				min = v;
				return true;
			} else return false;
		};
	})());
};
thx_stream_EmitterInts.sum = function(emitter) {
	return emitter.map((function() {
		var value = 0;
		return function(v) {
			return value += v;
		};
	})());
};
thx_stream_EmitterInts.toBool = function(emitter) {
	return emitter.map(function(i) {
		return i != 0;
	});
};
thx_stream_EmitterInts.unique = function(emitter) {
	return emitter.filter((function() {
		var buf = new haxe_ds_IntMap();
		return function(v) {
			if(buf.h.hasOwnProperty(v)) return false; else {
				buf.h[v] = true;
				return true;
			}
		};
	})());
};
var thx_stream_EmitterFloats = function() { };
thx_stream_EmitterFloats.__name__ = ["thx","stream","EmitterFloats"];
thx_stream_EmitterFloats.average = function(emitter) {
	return emitter.map((function() {
		var sum = 0.0;
		var count = 0;
		return function(v) {
			return (sum += v) / ++count;
		};
	})());
};
thx_stream_EmitterFloats.greaterThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v > x;
	});
};
thx_stream_EmitterFloats.greaterThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v >= x;
	});
};
thx_stream_EmitterFloats.inRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v <= max && v >= min;
	});
};
thx_stream_EmitterFloats.insideRange = function(emitter,min,max) {
	return emitter.filter(function(v) {
		return v < max && v > min;
	});
};
thx_stream_EmitterFloats.lessThan = function(emitter,x) {
	return emitter.filter(function(v) {
		return v < x;
	});
};
thx_stream_EmitterFloats.lessThanOrEqualTo = function(emitter,x) {
	return emitter.filter(function(v) {
		return v <= x;
	});
};
thx_stream_EmitterFloats.max = function(emitter) {
	return emitter.filter((function() {
		var max = -Infinity;
		return function(v) {
			if(v > max) {
				max = v;
				return true;
			} else return false;
		};
	})());
};
thx_stream_EmitterFloats.min = function(emitter) {
	return emitter.filter((function() {
		var min = Infinity;
		return function(v) {
			if(v < min) {
				min = v;
				return true;
			} else return false;
		};
	})());
};
thx_stream_EmitterFloats.sum = function(emitter) {
	return emitter.map((function() {
		var sum = 0.0;
		return function(v) {
			return sum += v;
		};
	})());
};
var thx_stream_EmitterOptions = function() { };
thx_stream_EmitterOptions.__name__ = ["thx","stream","EmitterOptions"];
thx_stream_EmitterOptions.either = function(emitter,some,none,end) {
	if(null == some) some = function(_) {
	};
	if(null == none) none = function() {
	};
	return emitter.subscribe(function(o) {
		switch(o[1]) {
		case 0:
			var v = o[2];
			some(v);
			break;
		case 1:
			none();
			break;
		}
	},end);
};
thx_stream_EmitterOptions.filterOption = function(emitter) {
	return emitter.filter(function(opt) {
		return thx_Options.toBool(opt);
	}).map(function(opt1) {
		return thx_Options.toValue(opt1);
	});
};
thx_stream_EmitterOptions.toBool = function(emitter) {
	return emitter.map(function(opt) {
		return thx_Options.toBool(opt);
	});
};
thx_stream_EmitterOptions.toValue = function(emitter) {
	return emitter.map(function(opt) {
		return thx_Options.toValue(opt);
	});
};
var thx_stream_EmitterBools = function() { };
thx_stream_EmitterBools.__name__ = ["thx","stream","EmitterBools"];
thx_stream_EmitterBools.negate = function(emitter) {
	return emitter.map(function(v) {
		return !v;
	});
};
var thx_stream_EmitterEmitters = function() { };
thx_stream_EmitterEmitters.__name__ = ["thx","stream","EmitterEmitters"];
thx_stream_EmitterEmitters.flatMap = function(emitter) {
	return new thx_stream_Emitter(function(stream) {
		emitter.init(new thx_stream_Stream(function(r) {
			switch(r[1]) {
			case 0:
				var em = r[2];
				em.init(stream);
				break;
			case 1:
				switch(r[2]) {
				case true:
					stream.cancel();
					break;
				case false:
					stream.end();
					break;
				}
				break;
			}
		}));
	});
};
var thx_stream_EmitterArrays = function() { };
thx_stream_EmitterArrays.__name__ = ["thx","stream","EmitterArrays"];
thx_stream_EmitterArrays.containerOf = function(emitter,value) {
	return emitter.filter(function(arr) {
		return HxOverrides.indexOf(arr,value,0) >= 0;
	});
};
thx_stream_EmitterArrays.flatten = function(emitter) {
	return new thx_stream_Emitter(function(stream) {
		emitter.init(new thx_stream_Stream(function(r) {
			switch(r[1]) {
			case 0:
				var arr = r[2];
				arr.map($bind(stream,stream.pulse));
				break;
			case 1:
				switch(r[2]) {
				case true:
					stream.cancel();
					break;
				case false:
					stream.end();
					break;
				}
				break;
			}
		}));
	});
};
var thx_stream_EmitterValues = function() { };
thx_stream_EmitterValues.__name__ = ["thx","stream","EmitterValues"];
thx_stream_EmitterValues.left = function(emitter) {
	return emitter.map(function(v) {
		return v._0;
	});
};
thx_stream_EmitterValues.right = function(emitter) {
	return emitter.map(function(v) {
		return v._1;
	});
};
var thx_stream_IStream = function() { };
thx_stream_IStream.__name__ = ["thx","stream","IStream"];
thx_stream_IStream.prototype = {
	cancel: null
	,__class__: thx_stream_IStream
};
var thx_stream_Stream = function(subscriber) {
	this.subscriber = subscriber;
	this.cleanUps = [];
	this.finalized = false;
	this.canceled = false;
};
thx_stream_Stream.__name__ = ["thx","stream","Stream"];
thx_stream_Stream.__interfaces__ = [thx_stream_IStream];
thx_stream_Stream.prototype = {
	subscriber: null
	,cleanUps: null
	,finalized: null
	,canceled: null
	,addCleanUp: function(f) {
		this.cleanUps.push(f);
	}
	,cancel: function() {
		this.canceled = true;
		this.finalize(thx_stream_StreamValue.End(true));
	}
	,end: function() {
		this.finalize(thx_stream_StreamValue.End(false));
	}
	,pulse: function(v) {
		this.subscriber(thx_stream_StreamValue.Pulse(v));
	}
	,finalize: function(signal) {
		if(this.finalized) return;
		this.finalized = true;
		while(this.cleanUps.length > 0) (this.cleanUps.shift())();
		this.subscriber(signal);
		this.subscriber = function(_) {
		};
	}
	,__class__: thx_stream_Stream
};
var thx_stream_StreamValue = { __ename__ : ["thx","stream","StreamValue"], __constructs__ : ["Pulse","End"] };
thx_stream_StreamValue.Pulse = function(value) { var $x = ["Pulse",0,value]; $x.__enum__ = thx_stream_StreamValue; $x.toString = $estr; return $x; };
thx_stream_StreamValue.End = function(cancel) { var $x = ["End",1,cancel]; $x.__enum__ = thx_stream_StreamValue; $x.toString = $estr; return $x; };
var thx_stream_Value = function(value,equals) {
	var _g = this;
	if(null == equals) this.equals = thx_Functions.equality; else this.equals = equals;
	this.value = value;
	this.downStreams = [];
	this.upStreams = [];
	thx_stream_Emitter.call(this,function(stream) {
		_g.downStreams.push(stream);
		stream.addCleanUp(function() {
			HxOverrides.remove(_g.downStreams,stream);
		});
		stream.pulse(_g.value);
	});
};
thx_stream_Value.__name__ = ["thx","stream","Value"];
thx_stream_Value.createOption = function(value,equals) {
	var def;
	if(null == value) def = haxe_ds_Option.None; else def = haxe_ds_Option.Some(value);
	return new thx_stream_Value(def,function(a,b) {
		return thx_Options.equals(a,b,equals);
	});
};
thx_stream_Value.__super__ = thx_stream_Emitter;
thx_stream_Value.prototype = $extend(thx_stream_Emitter.prototype,{
	value: null
	,downStreams: null
	,upStreams: null
	,equals: null
	,get: function() {
		return this.value;
	}
	,clear: function() {
		this.clearEmitters();
		this.clearStreams();
	}
	,clearStreams: function() {
		var _g = 0;
		var _g1 = this.downStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.end();
		}
	}
	,clearEmitters: function() {
		var _g = 0;
		var _g1 = this.upStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.cancel();
		}
	}
	,set: function(value) {
		if(this.equals(this.value,value)) return;
		this.value = value;
		this.update();
	}
	,update: function() {
		var _g = 0;
		var _g1 = this.downStreams.slice();
		while(_g < _g1.length) {
			var stream = _g1[_g];
			++_g;
			stream.pulse(this.value);
		}
	}
	,__class__: thx_stream_Value
});
var thx_stream_dom_Dom = function() { };
thx_stream_dom_Dom.__name__ = ["thx","stream","dom","Dom"];
thx_stream_dom_Dom.ready = function() {
	return thx_promise__$Promise_Promise_$Impl_$.create(function(resolve,_) {
		window.document.addEventListener("DOMContentLoaded",function(_1) {
			resolve(thx_Nil.nil);
		},false);
	});
};
thx_stream_dom_Dom.streamClick = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"click",capture);
};
thx_stream_dom_Dom.streamEvent = function(el,name,capture) {
	if(capture == null) capture = false;
	return new thx_stream_Emitter(function(stream) {
		el.addEventListener(name,$bind(stream,stream.pulse),capture);
		stream.addCleanUp(function() {
			el.removeEventListener(name,$bind(stream,stream.pulse),capture);
		});
	});
};
thx_stream_dom_Dom.streamFocus = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"focus",capture).toTrue().merge(thx_stream_dom_Dom.streamEvent(el,"blur",capture).toFalse());
};
thx_stream_dom_Dom.streamKey = function(el,name,capture) {
	if(capture == null) capture = false;
	return new thx_stream_Emitter((function($this) {
		var $r;
		if(!StringTools.startsWith(name,"key")) name = "key" + name;
		$r = function(stream) {
			el.addEventListener(name,$bind(stream,stream.pulse),capture);
			stream.addCleanUp(function() {
				el.removeEventListener(name,$bind(stream,stream.pulse),capture);
			});
		};
		return $r;
	}(this)));
};
thx_stream_dom_Dom.streamChecked = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"change",capture).map(function(_) {
		return el.checked;
	});
};
thx_stream_dom_Dom.streamChange = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"change",capture).map(function(_) {
		return el.value;
	});
};
thx_stream_dom_Dom.streamInput = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"input",capture).map(function(_) {
		return el.value;
	});
};
thx_stream_dom_Dom.streamMouseDown = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"mousedown",capture);
};
thx_stream_dom_Dom.streamMouseEvent = function(el,name,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,name,capture);
};
thx_stream_dom_Dom.streamMouseMove = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"mousemove",capture);
};
thx_stream_dom_Dom.streamMouseUp = function(el,capture) {
	if(capture == null) capture = false;
	return thx_stream_dom_Dom.streamEvent(el,"mouseup",capture);
};
thx_stream_dom_Dom.subscribeAttribute = function(el,name) {
	return function(value) {
		if(null == value) el.removeAttribute(name); else el.setAttribute(name,value);
	};
};
thx_stream_dom_Dom.subscribeFocus = function(el) {
	return function(focus) {
		if(focus) el.focus(); else el.blur();
	};
};
thx_stream_dom_Dom.subscribeHTML = function(el) {
	return function(html) {
		el.innerHTML = html;
	};
};
thx_stream_dom_Dom.subscribeText = function(el,force) {
	if(force == null) force = false;
	return function(text) {
		if(el.textContent != text || force) el.textContent = text;
	};
};
thx_stream_dom_Dom.subscribeToggleAttribute = function(el,name,value) {
	if(null == value) value = el.getAttribute(name);
	return function(on) {
		if(on) el.setAttribute(name,value); else el.removeAttribute(name);
	};
};
thx_stream_dom_Dom.subscribeToggleClass = function(el,name) {
	return function(on) {
		if(on) el.classList.add(name); else el.classList.remove(name);
	};
};
thx_stream_dom_Dom.subscribeSwapClass = function(el,nameOn,nameOff) {
	return function(on) {
		if(on) {
			el.classList.add(nameOn);
			el.classList.remove(nameOff);
		} else {
			el.classList.add(nameOff);
			el.classList.remove(nameOn);
		}
	};
};
thx_stream_dom_Dom.subscribeToggleVisibility = function(el) {
	var originalDisplay = el.style.display;
	if(originalDisplay == "none") originalDisplay = "";
	return function(on) {
		if(on) el.style.display = originalDisplay; else el.style.display = "none";
	};
};
var thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$ = {};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.__name__ = ["thx","unit","angle","_BinaryDegree","BinaryDegree_Impl_"];
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.pointToBinaryDegree = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
		}
		return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 * 40.7436654315252);
	}
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.floatToBinaryDegree = function(value) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(value);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.cos = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.0245436926061703);
	return Math.cos(this2);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.sin = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.0245436926061703);
	return Math.sin(this2);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(value);
	}
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.min = function(this1,other) {
	{
		var value = Math.min(this1,other);
		return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(value);
	}
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.max = function(this1,other) {
	{
		var value = Math.max(this1,other);
		return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(value);
	}
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.normalize = function(this1) {
	var a = this1 % thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.turn;
	if(a < 0) {
		var other = thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(a);
		return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.turn + other);
	} else return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(a);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.normalizeDirection = function(this1) {
	var a = thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(a - thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.turn); else return a;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.negate = function(this1) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(-this1);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.add = function(this1,other) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 + other);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.subtract = function(this1,other) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 - other);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.multiply = function(this1,other) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 * other);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.divide = function(this1,other) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 / other);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.modulo = function(this1,other) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 % other);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.equal = function(this1,other) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1) == other;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.notEqual = function(this1,other) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1) != other;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.less = function(this1,other) {
	return this1 < other;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.more = function(this1,other) {
	return this1 > other;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toDegree = function(this1) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 * 1.40625);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toGrad = function(this1) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 * 1.5625);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toHourAngle = function(this1) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 * 0.09375);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toMinuteOfArc = function(this1) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 * 84.375);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toPoint = function(this1) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 * 0.125);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toQuadrant = function(this1) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 * 0.015625);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toRadian = function(this1) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.0245436926061703);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toRevolution = function(this1) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 * 0.00390625);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toSecondOfArc = function(this1) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 * 5062.5);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toSextant = function(this1) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 * 0.0234375);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toTurn = function(this1) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 * 0.00390625);
};
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.toString = function(this1) {
	return this1 + "binary degree";
};
var thx_unit_angle__$Degree_Degree_$Impl_$ = {};
thx_unit_angle__$Degree_Degree_$Impl_$.__name__ = ["thx","unit","angle","_Degree","Degree_Impl_"];
thx_unit_angle__$Degree_Degree_$Impl_$.pointToDegree = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
		}
		return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 * 57.2957795130823);
	}
};
thx_unit_angle__$Degree_Degree_$Impl_$.floatToDegree = function(value) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(value);
};
thx_unit_angle__$Degree_Degree_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Degree_Degree_$Impl_$.cos = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.0174532925199433);
	return Math.cos(this2);
};
thx_unit_angle__$Degree_Degree_$Impl_$.sin = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.0174532925199433);
	return Math.sin(this2);
};
thx_unit_angle__$Degree_Degree_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return thx_unit_angle__$Degree_Degree_$Impl_$._new(value);
	}
};
thx_unit_angle__$Degree_Degree_$Impl_$.min = function(this1,other) {
	{
		var value = Math.min(this1,other);
		return thx_unit_angle__$Degree_Degree_$Impl_$._new(value);
	}
};
thx_unit_angle__$Degree_Degree_$Impl_$.max = function(this1,other) {
	{
		var value = Math.max(this1,other);
		return thx_unit_angle__$Degree_Degree_$Impl_$._new(value);
	}
};
thx_unit_angle__$Degree_Degree_$Impl_$.normalize = function(this1) {
	var a = this1 % thx_unit_angle__$Degree_Degree_$Impl_$.turn;
	if(a < 0) {
		var other = thx_unit_angle__$Degree_Degree_$Impl_$._new(a);
		return thx_unit_angle__$Degree_Degree_$Impl_$._new(thx_unit_angle__$Degree_Degree_$Impl_$.turn + other);
	} else return thx_unit_angle__$Degree_Degree_$Impl_$._new(a);
};
thx_unit_angle__$Degree_Degree_$Impl_$.normalizeDirection = function(this1) {
	var a = thx_unit_angle__$Degree_Degree_$Impl_$.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx_unit_angle__$Degree_Degree_$Impl_$._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx_unit_angle__$Degree_Degree_$Impl_$._new(a - thx_unit_angle__$Degree_Degree_$Impl_$.turn); else return a;
};
thx_unit_angle__$Degree_Degree_$Impl_$.negate = function(this1) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(-this1);
};
thx_unit_angle__$Degree_Degree_$Impl_$.add = function(this1,other) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 + other);
};
thx_unit_angle__$Degree_Degree_$Impl_$.subtract = function(this1,other) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 - other);
};
thx_unit_angle__$Degree_Degree_$Impl_$.multiply = function(this1,other) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 * other);
};
thx_unit_angle__$Degree_Degree_$Impl_$.divide = function(this1,other) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 / other);
};
thx_unit_angle__$Degree_Degree_$Impl_$.modulo = function(this1,other) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 % other);
};
thx_unit_angle__$Degree_Degree_$Impl_$.equal = function(this1,other) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1) == other;
};
thx_unit_angle__$Degree_Degree_$Impl_$.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx_unit_angle__$Degree_Degree_$Impl_$.notEqual = function(this1,other) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1) != other;
};
thx_unit_angle__$Degree_Degree_$Impl_$.less = function(this1,other) {
	return this1 < other;
};
thx_unit_angle__$Degree_Degree_$Impl_$.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx_unit_angle__$Degree_Degree_$Impl_$.more = function(this1,other) {
	return this1 > other;
};
thx_unit_angle__$Degree_Degree_$Impl_$.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Degree_Degree_$Impl_$.toBinaryDegree = function(this1) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 * 0.711111111111111);
};
thx_unit_angle__$Degree_Degree_$Impl_$.toGrad = function(this1) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 * 1.11111111111111);
};
thx_unit_angle__$Degree_Degree_$Impl_$.toHourAngle = function(this1) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 * 0.0666666666666667);
};
thx_unit_angle__$Degree_Degree_$Impl_$.toMinuteOfArc = function(this1) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 * 60);
};
thx_unit_angle__$Degree_Degree_$Impl_$.toPoint = function(this1) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 * 0.0888888888888889);
};
thx_unit_angle__$Degree_Degree_$Impl_$.toQuadrant = function(this1) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 * 0.0111111111111111);
};
thx_unit_angle__$Degree_Degree_$Impl_$.toRadian = function(this1) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.0174532925199433);
};
thx_unit_angle__$Degree_Degree_$Impl_$.toRevolution = function(this1) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 * 0.00277777777777778);
};
thx_unit_angle__$Degree_Degree_$Impl_$.toSecondOfArc = function(this1) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 * 3600);
};
thx_unit_angle__$Degree_Degree_$Impl_$.toSextant = function(this1) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 * 0.0166666666666667);
};
thx_unit_angle__$Degree_Degree_$Impl_$.toTurn = function(this1) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 * 0.00277777777777778);
};
thx_unit_angle__$Degree_Degree_$Impl_$.toString = function(this1) {
	return this1 + "°";
};
var thx_unit_angle__$Grad_Grad_$Impl_$ = {};
thx_unit_angle__$Grad_Grad_$Impl_$.__name__ = ["thx","unit","angle","_Grad","Grad_Impl_"];
thx_unit_angle__$Grad_Grad_$Impl_$.pointToGrad = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
		}
		return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 * 63.6619772367581);
	}
};
thx_unit_angle__$Grad_Grad_$Impl_$.floatToGrad = function(value) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(value);
};
thx_unit_angle__$Grad_Grad_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Grad_Grad_$Impl_$.cos = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.015707963267949);
	return Math.cos(this2);
};
thx_unit_angle__$Grad_Grad_$Impl_$.sin = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.015707963267949);
	return Math.sin(this2);
};
thx_unit_angle__$Grad_Grad_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return thx_unit_angle__$Grad_Grad_$Impl_$._new(value);
	}
};
thx_unit_angle__$Grad_Grad_$Impl_$.min = function(this1,other) {
	{
		var value = Math.min(this1,other);
		return thx_unit_angle__$Grad_Grad_$Impl_$._new(value);
	}
};
thx_unit_angle__$Grad_Grad_$Impl_$.max = function(this1,other) {
	{
		var value = Math.max(this1,other);
		return thx_unit_angle__$Grad_Grad_$Impl_$._new(value);
	}
};
thx_unit_angle__$Grad_Grad_$Impl_$.normalize = function(this1) {
	var a = this1 % thx_unit_angle__$Grad_Grad_$Impl_$.turn;
	if(a < 0) {
		var other = thx_unit_angle__$Grad_Grad_$Impl_$._new(a);
		return thx_unit_angle__$Grad_Grad_$Impl_$._new(thx_unit_angle__$Grad_Grad_$Impl_$.turn + other);
	} else return thx_unit_angle__$Grad_Grad_$Impl_$._new(a);
};
thx_unit_angle__$Grad_Grad_$Impl_$.normalizeDirection = function(this1) {
	var a = thx_unit_angle__$Grad_Grad_$Impl_$.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx_unit_angle__$Grad_Grad_$Impl_$._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx_unit_angle__$Grad_Grad_$Impl_$._new(a - thx_unit_angle__$Grad_Grad_$Impl_$.turn); else return a;
};
thx_unit_angle__$Grad_Grad_$Impl_$.negate = function(this1) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(-this1);
};
thx_unit_angle__$Grad_Grad_$Impl_$.add = function(this1,other) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 + other);
};
thx_unit_angle__$Grad_Grad_$Impl_$.subtract = function(this1,other) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 - other);
};
thx_unit_angle__$Grad_Grad_$Impl_$.multiply = function(this1,other) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 * other);
};
thx_unit_angle__$Grad_Grad_$Impl_$.divide = function(this1,other) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 / other);
};
thx_unit_angle__$Grad_Grad_$Impl_$.modulo = function(this1,other) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 % other);
};
thx_unit_angle__$Grad_Grad_$Impl_$.equal = function(this1,other) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1) == other;
};
thx_unit_angle__$Grad_Grad_$Impl_$.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx_unit_angle__$Grad_Grad_$Impl_$.notEqual = function(this1,other) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1) != other;
};
thx_unit_angle__$Grad_Grad_$Impl_$.less = function(this1,other) {
	return this1 < other;
};
thx_unit_angle__$Grad_Grad_$Impl_$.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx_unit_angle__$Grad_Grad_$Impl_$.more = function(this1,other) {
	return this1 > other;
};
thx_unit_angle__$Grad_Grad_$Impl_$.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Grad_Grad_$Impl_$.toBinaryDegree = function(this1) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 * 0.64);
};
thx_unit_angle__$Grad_Grad_$Impl_$.toDegree = function(this1) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 * 0.9);
};
thx_unit_angle__$Grad_Grad_$Impl_$.toHourAngle = function(this1) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 * 0.06);
};
thx_unit_angle__$Grad_Grad_$Impl_$.toMinuteOfArc = function(this1) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 * 54);
};
thx_unit_angle__$Grad_Grad_$Impl_$.toPoint = function(this1) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 * 0.08);
};
thx_unit_angle__$Grad_Grad_$Impl_$.toQuadrant = function(this1) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 * 0.01);
};
thx_unit_angle__$Grad_Grad_$Impl_$.toRadian = function(this1) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.015707963267949);
};
thx_unit_angle__$Grad_Grad_$Impl_$.toRevolution = function(this1) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 * 0.0025);
};
thx_unit_angle__$Grad_Grad_$Impl_$.toSecondOfArc = function(this1) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 * 3240);
};
thx_unit_angle__$Grad_Grad_$Impl_$.toSextant = function(this1) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 * 0.015);
};
thx_unit_angle__$Grad_Grad_$Impl_$.toTurn = function(this1) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 * 0.0025);
};
thx_unit_angle__$Grad_Grad_$Impl_$.toString = function(this1) {
	return this1 + "grad";
};
var thx_unit_angle__$HourAngle_HourAngle_$Impl_$ = {};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.__name__ = ["thx","unit","angle","_HourAngle","HourAngle_Impl_"];
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.pointToHourAngle = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
		}
		return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 * 3.81971863420549);
	}
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.floatToHourAngle = function(value) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(value);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.cos = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.261799387799149);
	return Math.cos(this2);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.sin = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.261799387799149);
	return Math.sin(this2);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(value);
	}
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.min = function(this1,other) {
	{
		var value = Math.min(this1,other);
		return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(value);
	}
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.max = function(this1,other) {
	{
		var value = Math.max(this1,other);
		return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(value);
	}
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.normalize = function(this1) {
	var a = this1 % thx_unit_angle__$HourAngle_HourAngle_$Impl_$.turn;
	if(a < 0) {
		var other = thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(a);
		return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(thx_unit_angle__$HourAngle_HourAngle_$Impl_$.turn + other);
	} else return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(a);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.normalizeDirection = function(this1) {
	var a = thx_unit_angle__$HourAngle_HourAngle_$Impl_$.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(a - thx_unit_angle__$HourAngle_HourAngle_$Impl_$.turn); else return a;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.negate = function(this1) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(-this1);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.add = function(this1,other) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 + other);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.subtract = function(this1,other) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 - other);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.multiply = function(this1,other) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 * other);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.divide = function(this1,other) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 / other);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.modulo = function(this1,other) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 % other);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.equal = function(this1,other) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1) == other;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.notEqual = function(this1,other) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1) != other;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.less = function(this1,other) {
	return this1 < other;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.more = function(this1,other) {
	return this1 > other;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toBinaryDegree = function(this1) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 * 10.6666666666667);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toDegree = function(this1) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 * 15);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toGrad = function(this1) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 * 16.6666666666667);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toMinuteOfArc = function(this1) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 * 900);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toPoint = function(this1) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 * 1.33333333333333);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toQuadrant = function(this1) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 * 0.166666666666667);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toRadian = function(this1) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.261799387799149);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toRevolution = function(this1) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 * 0.0416666666666667);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toSecondOfArc = function(this1) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 * 54000);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toSextant = function(this1) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 * 0.25);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toTurn = function(this1) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 * 0.0416666666666667);
};
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.toString = function(this1) {
	return this1 + "hour";
};
var thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$ = {};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.__name__ = ["thx","unit","angle","_MinuteOfArc","MinuteOfArc_Impl_"];
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.pointToMinuteOfArc = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
		}
		return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 * 3437.74677078494);
	}
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.floatToMinuteOfArc = function(value) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(value);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.cos = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.000290888208665722);
	return Math.cos(this2);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.sin = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.000290888208665722);
	return Math.sin(this2);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(value);
	}
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.min = function(this1,other) {
	{
		var value = Math.min(this1,other);
		return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(value);
	}
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.max = function(this1,other) {
	{
		var value = Math.max(this1,other);
		return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(value);
	}
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.normalize = function(this1) {
	var a = this1 % thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.turn;
	if(a < 0) {
		var other = thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(a);
		return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.turn + other);
	} else return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(a);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.normalizeDirection = function(this1) {
	var a = thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(a - thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.turn); else return a;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.negate = function(this1) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(-this1);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.add = function(this1,other) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 + other);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.subtract = function(this1,other) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 - other);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.multiply = function(this1,other) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 * other);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.divide = function(this1,other) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 / other);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.modulo = function(this1,other) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 % other);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.equal = function(this1,other) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1) == other;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.notEqual = function(this1,other) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1) != other;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.less = function(this1,other) {
	return this1 < other;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.more = function(this1,other) {
	return this1 > other;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toBinaryDegree = function(this1) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 * 0.0118518518518519);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toDegree = function(this1) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 * 0.0166666666666667);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toGrad = function(this1) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 * 0.0185185185185185);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toHourAngle = function(this1) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 * 0.00111111111111111);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toPoint = function(this1) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 * 0.00148148148148148);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toQuadrant = function(this1) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 * 0.000185185185185185);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toRadian = function(this1) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.000290888208665722);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toRevolution = function(this1) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 * 4.62962962962963e-05);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toSecondOfArc = function(this1) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 * 60);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toSextant = function(this1) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 * 0.000277777777777778);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toTurn = function(this1) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 * 4.62962962962963e-05);
};
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.toString = function(this1) {
	return this1 + "′";
};
var thx_unit_angle__$Point_Point_$Impl_$ = {};
thx_unit_angle__$Point_Point_$Impl_$.__name__ = ["thx","unit","angle","_Point","Point_Impl_"];
thx_unit_angle__$Point_Point_$Impl_$.pointToPoint = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
		}
		return thx_unit_angle__$Point_Point_$Impl_$._new(this1 * 5.09295817894065);
	}
};
thx_unit_angle__$Point_Point_$Impl_$.floatToPoint = function(value) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(value);
};
thx_unit_angle__$Point_Point_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Point_Point_$Impl_$.cos = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.196349540849362);
	return Math.cos(this2);
};
thx_unit_angle__$Point_Point_$Impl_$.sin = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.196349540849362);
	return Math.sin(this2);
};
thx_unit_angle__$Point_Point_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return thx_unit_angle__$Point_Point_$Impl_$._new(value);
	}
};
thx_unit_angle__$Point_Point_$Impl_$.min = function(this1,other) {
	{
		var value = Math.min(this1,other);
		return thx_unit_angle__$Point_Point_$Impl_$._new(value);
	}
};
thx_unit_angle__$Point_Point_$Impl_$.max = function(this1,other) {
	{
		var value = Math.max(this1,other);
		return thx_unit_angle__$Point_Point_$Impl_$._new(value);
	}
};
thx_unit_angle__$Point_Point_$Impl_$.normalize = function(this1) {
	var a = this1 % thx_unit_angle__$Point_Point_$Impl_$.turn;
	if(a < 0) {
		var other = thx_unit_angle__$Point_Point_$Impl_$._new(a);
		return thx_unit_angle__$Point_Point_$Impl_$._new(thx_unit_angle__$Point_Point_$Impl_$.turn + other);
	} else return thx_unit_angle__$Point_Point_$Impl_$._new(a);
};
thx_unit_angle__$Point_Point_$Impl_$.normalizeDirection = function(this1) {
	var a = thx_unit_angle__$Point_Point_$Impl_$.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx_unit_angle__$Point_Point_$Impl_$._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx_unit_angle__$Point_Point_$Impl_$._new(a - thx_unit_angle__$Point_Point_$Impl_$.turn); else return a;
};
thx_unit_angle__$Point_Point_$Impl_$.negate = function(this1) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(-this1);
};
thx_unit_angle__$Point_Point_$Impl_$.add = function(this1,other) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 + other);
};
thx_unit_angle__$Point_Point_$Impl_$.subtract = function(this1,other) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 - other);
};
thx_unit_angle__$Point_Point_$Impl_$.multiply = function(this1,other) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 * other);
};
thx_unit_angle__$Point_Point_$Impl_$.divide = function(this1,other) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 / other);
};
thx_unit_angle__$Point_Point_$Impl_$.modulo = function(this1,other) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 % other);
};
thx_unit_angle__$Point_Point_$Impl_$.equal = function(this1,other) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1) == other;
};
thx_unit_angle__$Point_Point_$Impl_$.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx_unit_angle__$Point_Point_$Impl_$.notEqual = function(this1,other) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1) != other;
};
thx_unit_angle__$Point_Point_$Impl_$.less = function(this1,other) {
	return this1 < other;
};
thx_unit_angle__$Point_Point_$Impl_$.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx_unit_angle__$Point_Point_$Impl_$.more = function(this1,other) {
	return this1 > other;
};
thx_unit_angle__$Point_Point_$Impl_$.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx_unit_angle__$Point_Point_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Point_Point_$Impl_$.toBinaryDegree = function(this1) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 * 8);
};
thx_unit_angle__$Point_Point_$Impl_$.toDegree = function(this1) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 * 11.25);
};
thx_unit_angle__$Point_Point_$Impl_$.toGrad = function(this1) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 * 12.5);
};
thx_unit_angle__$Point_Point_$Impl_$.toHourAngle = function(this1) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 * 0.75);
};
thx_unit_angle__$Point_Point_$Impl_$.toMinuteOfArc = function(this1) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 * 675);
};
thx_unit_angle__$Point_Point_$Impl_$.toQuadrant = function(this1) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 * 0.125);
};
thx_unit_angle__$Point_Point_$Impl_$.toRadian = function(this1) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 0.196349540849362);
};
thx_unit_angle__$Point_Point_$Impl_$.toRevolution = function(this1) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 * 0.03125);
};
thx_unit_angle__$Point_Point_$Impl_$.toSecondOfArc = function(this1) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 * 40500);
};
thx_unit_angle__$Point_Point_$Impl_$.toSextant = function(this1) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 * 0.1875);
};
thx_unit_angle__$Point_Point_$Impl_$.toTurn = function(this1) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 * 0.03125);
};
thx_unit_angle__$Point_Point_$Impl_$.toString = function(this1) {
	return this1 + "point";
};
var thx_unit_angle__$Quadrant_Quadrant_$Impl_$ = {};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.__name__ = ["thx","unit","angle","_Quadrant","Quadrant_Impl_"];
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.pointToQuadrant = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
		}
		return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 * 0.636619772367581);
	}
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.floatToQuadrant = function(value) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(value);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.cos = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 1.5707963267949);
	return Math.cos(this2);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.sin = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 1.5707963267949);
	return Math.sin(this2);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(value);
	}
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.min = function(this1,other) {
	{
		var value = Math.min(this1,other);
		return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(value);
	}
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.max = function(this1,other) {
	{
		var value = Math.max(this1,other);
		return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(value);
	}
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.normalize = function(this1) {
	var a = this1 % thx_unit_angle__$Quadrant_Quadrant_$Impl_$.turn;
	if(a < 0) {
		var other = thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(a);
		return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(thx_unit_angle__$Quadrant_Quadrant_$Impl_$.turn + other);
	} else return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(a);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.normalizeDirection = function(this1) {
	var a = thx_unit_angle__$Quadrant_Quadrant_$Impl_$.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(a - thx_unit_angle__$Quadrant_Quadrant_$Impl_$.turn); else return a;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.negate = function(this1) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(-this1);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.add = function(this1,other) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 + other);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.subtract = function(this1,other) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 - other);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.multiply = function(this1,other) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 * other);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.divide = function(this1,other) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 / other);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.modulo = function(this1,other) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 % other);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.equal = function(this1,other) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1) == other;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.notEqual = function(this1,other) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1) != other;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.less = function(this1,other) {
	return this1 < other;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.more = function(this1,other) {
	return this1 > other;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toBinaryDegree = function(this1) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 * 64);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toDegree = function(this1) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 * 90);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toGrad = function(this1) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 * 100);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toHourAngle = function(this1) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 * 6);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toMinuteOfArc = function(this1) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 * 5400);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toPoint = function(this1) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 * 8);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toRadian = function(this1) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 1.5707963267949);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toRevolution = function(this1) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 * 0.25);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toSecondOfArc = function(this1) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 * 324000);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toSextant = function(this1) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 * 1.5);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toTurn = function(this1) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 * 0.25);
};
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.toString = function(this1) {
	return this1 + "quad.";
};
var thx_unit_angle__$Radian_Radian_$Impl_$ = {};
thx_unit_angle__$Radian_Radian_$Impl_$.__name__ = ["thx","unit","angle","_Radian","Radian_Impl_"];
thx_unit_angle__$Radian_Radian_$Impl_$.pointToRadian = function(x,y) {
	{
		var value = Math.atan2(y,x);
		return thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
	}
};
thx_unit_angle__$Radian_Radian_$Impl_$.floatToRadian = function(value) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
};
thx_unit_angle__$Radian_Radian_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Radian_Radian_$Impl_$.cos = function(this1) {
	return Math.cos(this1);
};
thx_unit_angle__$Radian_Radian_$Impl_$.sin = function(this1) {
	return Math.sin(this1);
};
thx_unit_angle__$Radian_Radian_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
	}
};
thx_unit_angle__$Radian_Radian_$Impl_$.min = function(this1,other) {
	{
		var value = Math.min(this1,other);
		return thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
	}
};
thx_unit_angle__$Radian_Radian_$Impl_$.max = function(this1,other) {
	{
		var value = Math.max(this1,other);
		return thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
	}
};
thx_unit_angle__$Radian_Radian_$Impl_$.normalize = function(this1) {
	var a = this1 % thx_unit_angle__$Radian_Radian_$Impl_$.turn;
	if(a < 0) {
		var other = thx_unit_angle__$Radian_Radian_$Impl_$._new(a);
		return thx_unit_angle__$Radian_Radian_$Impl_$._new(thx_unit_angle__$Radian_Radian_$Impl_$.turn + other);
	} else return thx_unit_angle__$Radian_Radian_$Impl_$._new(a);
};
thx_unit_angle__$Radian_Radian_$Impl_$.normalizeDirection = function(this1) {
	var a = thx_unit_angle__$Radian_Radian_$Impl_$.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx_unit_angle__$Radian_Radian_$Impl_$._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx_unit_angle__$Radian_Radian_$Impl_$._new(a - thx_unit_angle__$Radian_Radian_$Impl_$.turn); else return a;
};
thx_unit_angle__$Radian_Radian_$Impl_$.negate = function(this1) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(-this1);
};
thx_unit_angle__$Radian_Radian_$Impl_$.add = function(this1,other) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 + other);
};
thx_unit_angle__$Radian_Radian_$Impl_$.subtract = function(this1,other) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 - other);
};
thx_unit_angle__$Radian_Radian_$Impl_$.multiply = function(this1,other) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * other);
};
thx_unit_angle__$Radian_Radian_$Impl_$.divide = function(this1,other) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 / other);
};
thx_unit_angle__$Radian_Radian_$Impl_$.modulo = function(this1,other) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 % other);
};
thx_unit_angle__$Radian_Radian_$Impl_$.equal = function(this1,other) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1) == other;
};
thx_unit_angle__$Radian_Radian_$Impl_$.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx_unit_angle__$Radian_Radian_$Impl_$.notEqual = function(this1,other) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1) != other;
};
thx_unit_angle__$Radian_Radian_$Impl_$.less = function(this1,other) {
	return this1 < other;
};
thx_unit_angle__$Radian_Radian_$Impl_$.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx_unit_angle__$Radian_Radian_$Impl_$.more = function(this1,other) {
	return this1 > other;
};
thx_unit_angle__$Radian_Radian_$Impl_$.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Radian_Radian_$Impl_$.toBinaryDegree = function(this1) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 * 40.7436654315252);
};
thx_unit_angle__$Radian_Radian_$Impl_$.toDegree = function(this1) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 * 57.2957795130823);
};
thx_unit_angle__$Radian_Radian_$Impl_$.toGrad = function(this1) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 * 63.6619772367581);
};
thx_unit_angle__$Radian_Radian_$Impl_$.toHourAngle = function(this1) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 * 3.81971863420549);
};
thx_unit_angle__$Radian_Radian_$Impl_$.toMinuteOfArc = function(this1) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 * 3437.74677078494);
};
thx_unit_angle__$Radian_Radian_$Impl_$.toPoint = function(this1) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 * 5.09295817894065);
};
thx_unit_angle__$Radian_Radian_$Impl_$.toQuadrant = function(this1) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 * 0.636619772367581);
};
thx_unit_angle__$Radian_Radian_$Impl_$.toRevolution = function(this1) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 * 0.159154943091895);
};
thx_unit_angle__$Radian_Radian_$Impl_$.toSecondOfArc = function(this1) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 * 206264.806247096);
};
thx_unit_angle__$Radian_Radian_$Impl_$.toSextant = function(this1) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 * 0.954929658551372);
};
thx_unit_angle__$Radian_Radian_$Impl_$.toTurn = function(this1) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 * 0.159154943091895);
};
thx_unit_angle__$Radian_Radian_$Impl_$.toString = function(this1) {
	return this1 + "rad";
};
var thx_unit_angle__$Revolution_Revolution_$Impl_$ = {};
thx_unit_angle__$Revolution_Revolution_$Impl_$.__name__ = ["thx","unit","angle","_Revolution","Revolution_Impl_"];
thx_unit_angle__$Revolution_Revolution_$Impl_$.pointToRevolution = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
		}
		return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 * 0.159154943091895);
	}
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.floatToRevolution = function(value) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(value);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.cos = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 6.28318530717959);
	return Math.cos(this2);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.sin = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 6.28318530717959);
	return Math.sin(this2);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(value);
	}
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.min = function(this1,other) {
	{
		var value = Math.min(this1,other);
		return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(value);
	}
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.max = function(this1,other) {
	{
		var value = Math.max(this1,other);
		return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(value);
	}
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.normalize = function(this1) {
	var a = this1 % thx_unit_angle__$Revolution_Revolution_$Impl_$.turn;
	if(a < 0) {
		var other = thx_unit_angle__$Revolution_Revolution_$Impl_$._new(a);
		return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(thx_unit_angle__$Revolution_Revolution_$Impl_$.turn + other);
	} else return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(a);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.normalizeDirection = function(this1) {
	var a = thx_unit_angle__$Revolution_Revolution_$Impl_$.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx_unit_angle__$Revolution_Revolution_$Impl_$._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(a - thx_unit_angle__$Revolution_Revolution_$Impl_$.turn); else return a;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.negate = function(this1) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(-this1);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.add = function(this1,other) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 + other);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.subtract = function(this1,other) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 - other);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.multiply = function(this1,other) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 * other);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.divide = function(this1,other) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 / other);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.modulo = function(this1,other) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 % other);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.equal = function(this1,other) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1) == other;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.notEqual = function(this1,other) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1) != other;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.less = function(this1,other) {
	return this1 < other;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.more = function(this1,other) {
	return this1 > other;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toBinaryDegree = function(this1) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 * 256);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toDegree = function(this1) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 * 360);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toGrad = function(this1) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 * 400);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toHourAngle = function(this1) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 * 24);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toMinuteOfArc = function(this1) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 * 21600);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toPoint = function(this1) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 * 32);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toQuadrant = function(this1) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 * 4);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toRadian = function(this1) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 6.28318530717959);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toSecondOfArc = function(this1) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 * 1296000);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toSextant = function(this1) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 * 6);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toTurn = function(this1) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1);
};
thx_unit_angle__$Revolution_Revolution_$Impl_$.toString = function(this1) {
	return this1 + "r";
};
var thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$ = {};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.__name__ = ["thx","unit","angle","_SecondOfArc","SecondOfArc_Impl_"];
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.pointToSecondOfArc = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
		}
		return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 * 206264.806247096);
	}
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.floatToSecondOfArc = function(value) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(value);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.cos = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 4.84813681109536e-06);
	return Math.cos(this2);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.sin = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 4.84813681109536e-06);
	return Math.sin(this2);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(value);
	}
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.min = function(this1,other) {
	{
		var value = Math.min(this1,other);
		return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(value);
	}
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.max = function(this1,other) {
	{
		var value = Math.max(this1,other);
		return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(value);
	}
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.normalize = function(this1) {
	var a = this1 % thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.turn;
	if(a < 0) {
		var other = thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(a);
		return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.turn + other);
	} else return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(a);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.normalizeDirection = function(this1) {
	var a = thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(a - thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.turn); else return a;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.negate = function(this1) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(-this1);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.add = function(this1,other) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 + other);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.subtract = function(this1,other) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 - other);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.multiply = function(this1,other) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 * other);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.divide = function(this1,other) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 / other);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.modulo = function(this1,other) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 % other);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.equal = function(this1,other) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1) == other;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.notEqual = function(this1,other) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1) != other;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.less = function(this1,other) {
	return this1 < other;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.more = function(this1,other) {
	return this1 > other;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toBinaryDegree = function(this1) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 * 0.000197530864197531);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toDegree = function(this1) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 * 0.000277777777777778);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toGrad = function(this1) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 * 0.000308641975308642);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toHourAngle = function(this1) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 * 1.85185185185185e-05);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toMinuteOfArc = function(this1) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 * 0.0166666666666667);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toPoint = function(this1) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 * 2.46913580246914e-05);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toQuadrant = function(this1) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 * 3.08641975308642e-06);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toRadian = function(this1) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 4.84813681109536e-06);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toRevolution = function(this1) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 * 7.71604938271605e-07);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toSextant = function(this1) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 * 4.62962962962963e-06);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toTurn = function(this1) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 * 7.71604938271605e-07);
};
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.toString = function(this1) {
	return this1 + "″";
};
var thx_unit_angle__$Sextant_Sextant_$Impl_$ = {};
thx_unit_angle__$Sextant_Sextant_$Impl_$.__name__ = ["thx","unit","angle","_Sextant","Sextant_Impl_"];
thx_unit_angle__$Sextant_Sextant_$Impl_$.pointToSextant = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
		}
		return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 * 0.954929658551372);
	}
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.floatToSextant = function(value) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(value);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.cos = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 1.0471975511966);
	return Math.cos(this2);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.sin = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 1.0471975511966);
	return Math.sin(this2);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(value);
	}
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.min = function(this1,other) {
	{
		var value = Math.min(this1,other);
		return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(value);
	}
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.max = function(this1,other) {
	{
		var value = Math.max(this1,other);
		return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(value);
	}
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.normalize = function(this1) {
	var a = this1 % thx_unit_angle__$Sextant_Sextant_$Impl_$.turn;
	if(a < 0) {
		var other = thx_unit_angle__$Sextant_Sextant_$Impl_$._new(a);
		return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(thx_unit_angle__$Sextant_Sextant_$Impl_$.turn + other);
	} else return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(a);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.normalizeDirection = function(this1) {
	var a = thx_unit_angle__$Sextant_Sextant_$Impl_$.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx_unit_angle__$Sextant_Sextant_$Impl_$._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(a - thx_unit_angle__$Sextant_Sextant_$Impl_$.turn); else return a;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.negate = function(this1) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(-this1);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.add = function(this1,other) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 + other);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.subtract = function(this1,other) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 - other);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.multiply = function(this1,other) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 * other);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.divide = function(this1,other) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 / other);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.modulo = function(this1,other) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 % other);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.equal = function(this1,other) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1) == other;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.notEqual = function(this1,other) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1) != other;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.less = function(this1,other) {
	return this1 < other;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.more = function(this1,other) {
	return this1 > other;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toBinaryDegree = function(this1) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 * 42.6666666666667);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toDegree = function(this1) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 * 60);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toGrad = function(this1) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 * 66.6666666666667);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toHourAngle = function(this1) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 * 4);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toMinuteOfArc = function(this1) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 * 3600);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toPoint = function(this1) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 * 5.33333333333333);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toQuadrant = function(this1) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 * 0.666666666666667);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toRadian = function(this1) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 1.0471975511966);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toRevolution = function(this1) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1 * 0.166666666666667);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toSecondOfArc = function(this1) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 * 216000);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toTurn = function(this1) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 * 0.166666666666667);
};
thx_unit_angle__$Sextant_Sextant_$Impl_$.toString = function(this1) {
	return this1 + "sextant";
};
var thx_unit_angle__$Turn_Turn_$Impl_$ = {};
thx_unit_angle__$Turn_Turn_$Impl_$.__name__ = ["thx","unit","angle","_Turn","Turn_Impl_"];
thx_unit_angle__$Turn_Turn_$Impl_$.pointToTurn = function(x,y) {
	{
		var this1;
		{
			var value = Math.atan2(y,x);
			this1 = thx_unit_angle__$Radian_Radian_$Impl_$._new(value);
		}
		return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 * 0.159154943091895);
	}
};
thx_unit_angle__$Turn_Turn_$Impl_$.floatToTurn = function(value) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(value);
};
thx_unit_angle__$Turn_Turn_$Impl_$._new = function(value) {
	return value;
};
thx_unit_angle__$Turn_Turn_$Impl_$.cos = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 6.28318530717959);
	return Math.cos(this2);
};
thx_unit_angle__$Turn_Turn_$Impl_$.sin = function(this1) {
	var this2 = thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 6.28318530717959);
	return Math.sin(this2);
};
thx_unit_angle__$Turn_Turn_$Impl_$.abs = function(this1) {
	{
		var value = Math.abs(this1);
		return thx_unit_angle__$Turn_Turn_$Impl_$._new(value);
	}
};
thx_unit_angle__$Turn_Turn_$Impl_$.min = function(this1,other) {
	{
		var value = Math.min(this1,other);
		return thx_unit_angle__$Turn_Turn_$Impl_$._new(value);
	}
};
thx_unit_angle__$Turn_Turn_$Impl_$.max = function(this1,other) {
	{
		var value = Math.max(this1,other);
		return thx_unit_angle__$Turn_Turn_$Impl_$._new(value);
	}
};
thx_unit_angle__$Turn_Turn_$Impl_$.normalize = function(this1) {
	var a = this1 % thx_unit_angle__$Turn_Turn_$Impl_$.turn;
	if(a < 0) {
		var other = thx_unit_angle__$Turn_Turn_$Impl_$._new(a);
		return thx_unit_angle__$Turn_Turn_$Impl_$._new(thx_unit_angle__$Turn_Turn_$Impl_$.turn + other);
	} else return thx_unit_angle__$Turn_Turn_$Impl_$._new(a);
};
thx_unit_angle__$Turn_Turn_$Impl_$.normalizeDirection = function(this1) {
	var a = thx_unit_angle__$Turn_Turn_$Impl_$.normalize(this1);
	if((function($this) {
		var $r;
		var other = thx_unit_angle__$Turn_Turn_$Impl_$._new(180);
		$r = a > other;
		return $r;
	}(this))) return thx_unit_angle__$Turn_Turn_$Impl_$._new(a - thx_unit_angle__$Turn_Turn_$Impl_$.turn); else return a;
};
thx_unit_angle__$Turn_Turn_$Impl_$.negate = function(this1) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(-this1);
};
thx_unit_angle__$Turn_Turn_$Impl_$.add = function(this1,other) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 + other);
};
thx_unit_angle__$Turn_Turn_$Impl_$.subtract = function(this1,other) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 - other);
};
thx_unit_angle__$Turn_Turn_$Impl_$.multiply = function(this1,other) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 * other);
};
thx_unit_angle__$Turn_Turn_$Impl_$.divide = function(this1,other) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 / other);
};
thx_unit_angle__$Turn_Turn_$Impl_$.modulo = function(this1,other) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1 % other);
};
thx_unit_angle__$Turn_Turn_$Impl_$.equal = function(this1,other) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1) == other;
};
thx_unit_angle__$Turn_Turn_$Impl_$.nearEquals = function(this1,other) {
	return Math.abs(this1 - other) <= 10e-10;
};
thx_unit_angle__$Turn_Turn_$Impl_$.notEqual = function(this1,other) {
	return thx_unit_angle__$Turn_Turn_$Impl_$._new(this1) != other;
};
thx_unit_angle__$Turn_Turn_$Impl_$.less = function(this1,other) {
	return this1 < other;
};
thx_unit_angle__$Turn_Turn_$Impl_$.lessEqual = function(this1,other) {
	return this1 <= other;
};
thx_unit_angle__$Turn_Turn_$Impl_$.more = function(this1,other) {
	return this1 > other;
};
thx_unit_angle__$Turn_Turn_$Impl_$.moreEqual = function(this1,other) {
	return this1 >= other;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toFloat = function(this1) {
	return this1;
};
thx_unit_angle__$Turn_Turn_$Impl_$.toBinaryDegree = function(this1) {
	return thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(this1 * 256);
};
thx_unit_angle__$Turn_Turn_$Impl_$.toDegree = function(this1) {
	return thx_unit_angle__$Degree_Degree_$Impl_$._new(this1 * 360);
};
thx_unit_angle__$Turn_Turn_$Impl_$.toGrad = function(this1) {
	return thx_unit_angle__$Grad_Grad_$Impl_$._new(this1 * 400);
};
thx_unit_angle__$Turn_Turn_$Impl_$.toHourAngle = function(this1) {
	return thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(this1 * 24);
};
thx_unit_angle__$Turn_Turn_$Impl_$.toMinuteOfArc = function(this1) {
	return thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(this1 * 21600);
};
thx_unit_angle__$Turn_Turn_$Impl_$.toPoint = function(this1) {
	return thx_unit_angle__$Point_Point_$Impl_$._new(this1 * 32);
};
thx_unit_angle__$Turn_Turn_$Impl_$.toQuadrant = function(this1) {
	return thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(this1 * 4);
};
thx_unit_angle__$Turn_Turn_$Impl_$.toRadian = function(this1) {
	return thx_unit_angle__$Radian_Radian_$Impl_$._new(this1 * 6.28318530717959);
};
thx_unit_angle__$Turn_Turn_$Impl_$.toRevolution = function(this1) {
	return thx_unit_angle__$Revolution_Revolution_$Impl_$._new(this1);
};
thx_unit_angle__$Turn_Turn_$Impl_$.toSecondOfArc = function(this1) {
	return thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(this1 * 1296000);
};
thx_unit_angle__$Turn_Turn_$Impl_$.toSextant = function(this1) {
	return thx_unit_angle__$Sextant_Sextant_$Impl_$._new(this1 * 6);
};
thx_unit_angle__$Turn_Turn_$Impl_$.toString = function(this1) {
	return this1 + "τ";
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
var __map_reserved = {}
dots_Dom.addCss(".sui-icon-add,.sui-icon-collapse,.sui-icon-down,.sui-icon-expand,.sui-icon-remove,.sui-icon-up{background-repeat:no-repeat}.sui-icon-add{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M45%2029H35V19c0-1.657-1.343-3-3-3s-3%201.343-3%203v10H19c-1.657%200-3%201.343-3%203s1.343%203%203%203h10v10c0%201.657%201.343%203%203%203s3-1.343%203-3V35h10c1.657%200%203-1.343%203-3s-1.343-3-3-3zM32%200C14.327%200%200%2014.327%200%2032s14.327%2032%2032%2032%2032-14.327%2032-32S49.673%200%2032%200zm0%2058C17.64%2058%206%2046.36%206%2032S17.64%206%2032%206s26%2011.64%2026%2026-11.64%2026-26%2026z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-collapse{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M52.16%2038.918l-18-18C33.612%2020.352%2032.847%2020%2032%2020h-.014c-.848%200-1.613.352-2.16.918l-18%2018%20.008.007c-.516.54-.834%201.27-.834%202.075%200%201.657%201.343%203%203%203%20.91%200%201.725-.406%202.275-1.046l15.718-15.718L47.917%2043.16c.54.52%201.274.84%202.083.84%201.657%200%203-1.343%203-3%200-.81-.32-1.542-.84-2.082z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-down{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M53%2023c0-1.657-1.343-3-3-3-.81%200-1.542.32-2.082.84L31.992%2036.764%2016.275%2021.046C15.725%2020.406%2014.91%2020%2014%2020c-1.657%200-3%201.343-3%203%200%20.805.318%201.536.835%202.075l-.008.008%2018%2018c.547.565%201.312.917%202.16.917H32c.85%200%201.613-.352%202.16-.918l18-18c.52-.54.84-1.273.84-2.082z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-expand{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M53%2023c0-1.657-1.343-3-3-3-.81%200-1.542.32-2.082.84L31.992%2036.764%2016.275%2021.046C15.725%2020.406%2014.91%2020%2014%2020c-1.657%200-3%201.343-3%203%200%20.805.318%201.536.835%202.075l-.008.008%2018%2018c.547.565%201.312.917%202.16.917H32c.85%200%201.613-.352%202.16-.918l18-18c.52-.54.84-1.273.84-2.082z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-remove{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M45%2029H19c-1.657%200-3%201.343-3%203s1.343%203%203%203h26c1.657%200%203-1.343%203-3s-1.343-3-3-3zM32%200C14.327%200%200%2014.327%200%2032s14.327%2032%2032%2032%2032-14.327%2032-32S49.673%200%2032%200zm0%2058C17.64%2058%206%2046.36%206%2032S17.64%206%2032%206s26%2011.64%2026%2026-11.64%2026-26%2026z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-icon-up{background-image:url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Cpath%20d%3D%22M52.16%2038.918l-18-18C33.612%2020.352%2032.847%2020%2032%2020h-.014c-.848%200-1.613.352-2.16.918l-18%2018%20.008.007c-.516.54-.834%201.27-.834%202.075%200%201.657%201.343%203%203%203%20.91%200%201.725-.406%202.275-1.046l15.718-15.718L47.917%2043.16c.54.52%201.274.84%202.083.84%201.657%200%203-1.343%203-3%200-.81-.32-1.542-.84-2.082z%22%20enable-background%3D%22new%22%2F%3E%3C%2Fsvg%3E\")}.sui-grid{border-collapse:collapse;}.sui-grid *{box-sizing:border-box}.sui-grid td{border-bottom:1px solid #ddd;margin:0;padding:0}.sui-grid tr:first-child td{border-top:1px solid #ddd}.sui-grid td:first-child{border-left:1px solid #ddd}.sui-grid td:last-child{border-right:1px solid #ddd}.sui-grid td.sui-top,.sui-grid td.sui-left{background-color:#fff}.sui-grid td.sui-bottom,.sui-grid td.sui-right{background-color:#f6f6f6}.sui-bottom-left,.sui-bottom-right,.sui-top-left,.sui-top-right{position:absolute;background-color:#fff}.sui-top-right{top:0;right:0;-webkit-box-shadow:-1px 1px 6px rgba(0,0,0,0.1);-moz-box-shadow:-1px 1px 6px rgba(0,0,0,0.1);box-shadow:-1px 1px 6px rgba(0,0,0,0.1);}.sui-top-right.sui-grid tr:first-child td{border-top:none}.sui-top-right.sui-grid td:last-child{border-right:none}.sui-top-left{top:0;left:0;-webkit-box-shadow:1px 1px 6px rgba(0,0,0,0.1);-moz-box-shadow:1px 1px 6px rgba(0,0,0,0.1);box-shadow:1px 1px 6px rgba(0,0,0,0.1);}.sui-top-left.sui-grid tr:first-child td{border-top:none}.sui-top-left.sui-grid td:last-child{border-left:none}.sui-bottom-right{bottom:0;right:0;-webkit-box-shadow:-1px 1px 6px rgba(0,0,0,0.1);-moz-box-shadow:-1px 1px 6px rgba(0,0,0,0.1);box-shadow:-1px 1px 6px rgba(0,0,0,0.1);}.sui-bottom-right.sui-grid tr:first-child td{border-bottom:none}.sui-bottom-right.sui-grid td:last-child{border-right:none}.sui-bottom-left{bottom:0;left:0;-webkit-box-shadow:1px 1px 6px rgba(0,0,0,0.1);-moz-box-shadow:1px 1px 6px rgba(0,0,0,0.1);box-shadow:1px 1px 6px rgba(0,0,0,0.1);}.sui-bottom-left.sui-grid tr:first-child td{border-bottom:none}.sui-bottom-left.sui-grid td:last-child{border-left:none}.sui-fill{position:absolute;width:100%;max-height:100%;top:0;left:0}.sui-append{width:100%}.sui-control,.sui-folder{-moz-user-select:-moz-none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;user-select:none;font-size:11px;font-family:Helvetica,\"Nimbus Sans L\",\"Liberation Sans\",Arial,sans-serif;line-height:18px;vertical-align:middle;}.sui-control *,.sui-folder *{box-sizing:border-box;margin:0;padding:0}.sui-control button,.sui-folder button{line-height:18px;vertical-align:middle}.sui-control input,.sui-folder input{line-height:18px;vertical-align:middle;border:none;background-color:#f6f6f6;max-width:16em}.sui-control button:hover,.sui-folder button:hover{background-color:#fafafa;border:1px solid #ddd}.sui-control button:focus,.sui-folder button:focus{background-color:#fafafa;border:1px solid #aaa;outline:#eee solid 2px}.sui-control input:focus,.sui-folder input:focus{outline:#eee solid 2px;$outline-offset:-2px;background-color:#fafafa}.sui-control output,.sui-folder output{padding:0 6px;background-color:#fff;display:inline-block}.sui-control input[type=\"number\"],.sui-folder input[type=\"number\"],.sui-control input[type=\"date\"],.sui-folder input[type=\"date\"],.sui-control input[type=\"datetime-local\"],.sui-folder input[type=\"datetime-local\"],.sui-control input[type=\"time\"],.sui-folder input[type=\"time\"]{text-align:right}.sui-control input[type=\"number\"],.sui-folder input[type=\"number\"]{font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace}.sui-control input,.sui-folder input{padding:0 6px}.sui-control input[type=\"color\"],.sui-folder input[type=\"color\"],.sui-control input[type=\"checkbox\"],.sui-folder input[type=\"checkbox\"]{padding:0;margin:0}.sui-control input[type=\"range\"],.sui-folder input[type=\"range\"]{margin:0 8px;min-height:19px}.sui-control button,.sui-folder button{background-color:#eee;border:1px solid #aaa;border-radius:4px}.sui-control.sui-control-single input,.sui-folder.sui-control-single input,.sui-control.sui-control-single output,.sui-folder.sui-control-single output,.sui-control.sui-control-single button,.sui-folder.sui-control-single button{width:100%}.sui-control.sui-control-single input[type=\"checkbox\"],.sui-folder.sui-control-single input[type=\"checkbox\"]{width:initial}.sui-control.sui-control-double input,.sui-folder.sui-control-double input,.sui-control.sui-control-double output,.sui-folder.sui-control-double output,.sui-control.sui-control-double button,.sui-folder.sui-control-double button{width:50%}.sui-control.sui-control-double .input1,.sui-folder.sui-control-double .input1{width:calc(100% - 7em);max-width:8em}.sui-control.sui-control-double .input2,.sui-folder.sui-control-double .input2{width:7em}.sui-control.sui-control-double .input1[type=\"range\"],.sui-folder.sui-control-double .input1[type=\"range\"]{width:calc(100% - 7em - 16px)}.sui-control.sui-type-bool,.sui-folder.sui-type-bool{text-align:center}.sui-control.sui-invalid,.sui-folder.sui-invalid{border-left:4px solid #d00}.sui-array{list-style:none;}.sui-array .sui-array-item{border-bottom:1px dotted #aaa;position:relative;}.sui-array .sui-array-item .sui-icon,.sui-array .sui-array-item .sui-icon-mini{opacity:.1}.sui-array .sui-array-item .sui-array-add .sui-icon,.sui-array .sui-array-item .sui-array-add .sui-icon-mini{opacity:.2}.sui-array .sui-array-item > *{vertical-align:top}.sui-array .sui-array-item:first-child > .sui-move > .sui-icon-up{visibility:hidden}.sui-array .sui-array-item:last-child{border-bottom:none;}.sui-array .sui-array-item:last-child > .sui-move > .sui-icon-down{visibility:hidden}.sui-array .sui-array-item > div{display:inline-block}.sui-array .sui-array-item .sui-move{position:absolute;width:8px;height:100%;}.sui-array .sui-array-item .sui-move .sui-icon-mini{display:block;position:absolute}.sui-array .sui-array-item .sui-move .sui-icon-up{top:0;left:1px}.sui-array .sui-array-item .sui-move .sui-icon-down{bottom:0;left:1px}.sui-array .sui-array-item .sui-control-container{margin:0 14px 0 10px;width:calc(100% - 24px)}.sui-array .sui-array-item .sui-remove{width:12px;position:absolute;right:1px;top:0}.sui-array .sui-array-item .sui-icon-remove,.sui-array .sui-array-item .sui-icon-up,.sui-array .sui-array-item .sui-icon-down{cursor:pointer}.sui-array .sui-array-item.sui-focus > .sui-move .sui-icon,.sui-array .sui-array-item.sui-focus > .sui-remove .sui-icon,.sui-array .sui-array-item.sui-focus > .sui-move .sui-icon-mini,.sui-array .sui-array-item.sui-focus > .sui-remove .sui-icon-mini{opacity:.4}.sui-array ~ .sui-control{margin-bottom:0}.sui-map{border-collapse:collapse;}.sui-map .sui-map-item > td{border-bottom:1px dotted #aaa;}.sui-map .sui-map-item > td:first-child{border-left:none}.sui-map .sui-map-item:last-child > td{border-bottom:none}.sui-map .sui-map-item .sui-icon{opacity:.1}.sui-map .sui-map-item .sui-array-add .sui-icon{opacity:.2}.sui-map .sui-map-item .sui-remove{width:14px;text-align:right;padding:0 1px}.sui-map .sui-map-item .sui-icon-remove{cursor:pointer}.sui-map .sui-map-item.sui-focus > .sui-remove .sui-icon{opacity:.4}.sui-disabled .sui-icon,.sui-disabled .sui-icon-mini,.sui-disabled .sui-icon:hover,.sui-disabled .sui-icon-mini:hover{opacity:.05 !important;cursor:default}.sui-array-add{text-align:right;}.sui-array-add .sui-icon,.sui-array-add .sui-icon-mini{margin-right:1px;opacity:.2;cursor:pointer}.sui-icon,.sui-icon-mini{display:inline-block;opacity:.4;vertical-align:middle;}.sui-icon:hover,.sui-icon-mini:hover{opacity:.8 !important}.sui-icon{width:12px;height:12px;background-size:12px 12px}.sui-icon-mini{width:8px;height:8px;background-size:8px 8px}.sui-folder{padding:0 6px;font-weight:bold}.sui-collapsible{cursor:pointer}.sui-bottom-left .sui-trigger-toggle,.sui-bottom-right .sui-trigger-toggle{transform:rotate(180deg)}.sui-choice-options > .sui-grid,.sui-grid-inner{width:100%}.sui-choice-options > .sui-grid > tr > td:first-child,.sui-choice-options > .sui-grid > tbody > tr > td:first-child{border-left:none}.sui-choice-options > .sui-grid > tr:last-child > td,.sui-choice-options > .sui-grid > tbody > tr:last-child > td{border-bottom:none}.sui-grid-inner{border-left:6px solid #f6f6f6}.sui-choice-header select{width:100%}");

      // Production steps of ECMA-262, Edition 5, 15.4.4.21
      // Reference: http://es5.github.io/#x15.4.4.21
      if (!Array.prototype.reduce) {
        Array.prototype.reduce = function(callback /*, initialValue*/) {
          'use strict';
          if (this == null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
          }
          if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
          }
          var t = Object(this), len = t.length >>> 0, k = 0, value;
          if (arguments.length == 2) {
            value = arguments[1];
          } else {
            while (k < len && ! k in t) {
              k++;
            }
            if (k >= len) {
              throw new TypeError('Reduce of empty array with no initial value');
            }
            value = t[k++];
          }
          for (; k < len; k++) {
            if (k in t) {
              value = callback(value, t[k], k, t);
            }
          }
          return value;
        };
      }
    ;
var scope = ("undefined" !== typeof window && window) || ("undefined" !== typeof global && global) || this;
if(!scope.setImmediate) scope.setImmediate = function(callback) {
	scope.setTimeout(callback,0);
};
var lastTime = 0;
var vendors = ["webkit","moz"];
var x = 0;
while(x < vendors.length && !scope.requestAnimationFrame) {
	scope.requestAnimationFrame = scope[vendors[x] + "RequestAnimationFrame"];
	scope.cancelAnimationFrame = scope[vendors[x] + "CancelAnimationFrame"] || scope[vendors[x] + "CancelRequestAnimationFrame"];
	x++;
}
if(!scope.requestAnimationFrame) scope.requestAnimationFrame = function(callback1) {
	var currTime = new Date().getTime();
	var timeToCall = Math.max(0,16 - (currTime - lastTime));
	var id = scope.setTimeout(function() {
		callback1(currTime + timeToCall);
	},timeToCall);
	lastTime = currTime + timeToCall;
	return id;
};
if(!scope.cancelAnimationFrame) scope.cancelAnimationFrame = function(id1) {
	scope.clearTimeout(id1);
};
if(typeof(scope.performance) == "undefined") scope.performance = { };
if(typeof(scope.performance.now) == "undefined") {
	var nowOffset = new Date().getTime();
	if(scope.performance.timing && scope.performance.timing.navigationStart) nowOffset = scope.performance.timing.navigationStart;
	var now = function() {
		return new Date() - nowOffset;
	};
	scope.performance.now = now;
}
Canvas.width = 800;
Canvas.height = 600;
dots_Html.pattern = new EReg("[<]([^> ]+)","");
dots_Query.doc = document;
haxe_ds_ObjectMap.count = 0;
js_Boot.__toStr = {}.toString;
sui_controls_ColorControl.PATTERN = new EReg("^[#][0-9a-f]{6}$","i");
sui_controls_DataList.nid = 0;
thx_Floats.TOLERANCE = 10e-5;
thx_Floats.EPSILON = 10e-10;
thx_Floats.pattern_parse = new EReg("^(\\+|-)?\\d+(\\.\\d+)?(e-?\\d+)?$","");
thx_Ints.pattern_parse = new EReg("^[+-]?(\\d+|0x[0-9A-F]+)$","i");
thx_Ints.BASE = "0123456789abcdefghijklmnopqrstuvwxyz";
thx_Strings.UCWORDS = new EReg("[^a-zA-Z]([a-z])","g");
thx_Strings.UCWORDSWS = new EReg("\\s[a-z]","g");
thx_Strings.ALPHANUM = new EReg("^[a-z0-9]+$","i");
thx_Strings.DIGITS = new EReg("^[0-9]+$","");
thx_Strings.STRIPTAGS = new EReg("</?[a-z]+[^>]*?/?>","gi");
thx_Strings.WSG = new EReg("\\s+","g");
thx_Strings.SPLIT_LINES = new EReg("\r\n|\n\r|\n|\r","g");
thx_Timer.FRAME_RATE = Math.round(16.6666666666666679);
thx_color__$Grey_Grey_$Impl_$.black = 0;
thx_color__$Grey_Grey_$Impl_$.white = 1;
thx_color_parse_ColorParser.parser = new thx_color_parse_ColorParser();
thx_color_parse_ColorParser.isPureHex = new EReg("^([0-9a-f]{2}){3,4}$","i");
thx_promise__$Promise_Promise_$Impl_$.nil = thx_promise__$Promise_Promise_$Impl_$.value(thx_Nil.nil);
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.turn = thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$._new(256);
thx_unit_angle__$BinaryDegree_BinaryDegree_$Impl_$.symbol = "binary degree";
thx_unit_angle__$Degree_Degree_$Impl_$.turn = thx_unit_angle__$Degree_Degree_$Impl_$._new(360);
thx_unit_angle__$Degree_Degree_$Impl_$.symbol = "°";
thx_unit_angle__$Grad_Grad_$Impl_$.turn = thx_unit_angle__$Grad_Grad_$Impl_$._new(400);
thx_unit_angle__$Grad_Grad_$Impl_$.symbol = "grad";
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.turn = thx_unit_angle__$HourAngle_HourAngle_$Impl_$._new(24);
thx_unit_angle__$HourAngle_HourAngle_$Impl_$.symbol = "hour";
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.turn = thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$._new(21600);
thx_unit_angle__$MinuteOfArc_MinuteOfArc_$Impl_$.symbol = "′";
thx_unit_angle__$Point_Point_$Impl_$.turn = thx_unit_angle__$Point_Point_$Impl_$._new(32);
thx_unit_angle__$Point_Point_$Impl_$.symbol = "point";
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.turn = thx_unit_angle__$Quadrant_Quadrant_$Impl_$._new(4);
thx_unit_angle__$Quadrant_Quadrant_$Impl_$.symbol = "quad.";
thx_unit_angle__$Radian_Radian_$Impl_$.turn = thx_unit_angle__$Radian_Radian_$Impl_$._new(6.28318530717959);
thx_unit_angle__$Radian_Radian_$Impl_$.symbol = "rad";
thx_unit_angle__$Revolution_Revolution_$Impl_$.turn = thx_unit_angle__$Revolution_Revolution_$Impl_$._new(1);
thx_unit_angle__$Revolution_Revolution_$Impl_$.symbol = "r";
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.turn = thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$._new(1296000);
thx_unit_angle__$SecondOfArc_SecondOfArc_$Impl_$.symbol = "″";
thx_unit_angle__$Sextant_Sextant_$Impl_$.turn = thx_unit_angle__$Sextant_Sextant_$Impl_$._new(6);
thx_unit_angle__$Sextant_Sextant_$Impl_$.symbol = "sextant";
thx_unit_angle__$Turn_Turn_$Impl_$.turn = thx_unit_angle__$Turn_Turn_$Impl_$._new(1);
thx_unit_angle__$Turn_Turn_$Impl_$.symbol = "τ";
Canvas.main();
})(typeof console != "undefined" ? console : {log:function(){}});
