define("base/event_emitter", [], function() {
    function t() {
        this._events = {}
    }

    function e(t, i) {
        t.prototype = Object.create(i.prototype), t.prototype.constructor = t, i.prototype._onExtend && i.prototype._onExtend(t), t.prototype._onInherit && t.prototype._onInherit(i), t.extend = e
    }
    var i = Array.prototype.shift,
        o = /[ ,]+/;
    return t.prototype.on = t.prototype.addEventListener = function(t, e, i) {
        var r, n = t.split(o),
            s = this._events;
        for (r = n.length; r--;) t = n[r], (s[t] || (s[t] = [])).push({
            listener: e,
            ctx: i || this
        });
        return this
    }, t.prototype.once = t.prototype.addEventListenerOnce = function(t, e, i) {
        function o() {
            r.off(t, o), e.apply(i, arguments)
        }
        var r = this;
        return i || (i = this), this.on(t, o, i)
    }, t.prototype.listenTo = t.prototype.addEventListenerTo = function(e, i, o, r) {
        if (!(e instanceof t)) throw "Can't listen to Object, its not a instance of EventEmitter";
        return e.on(i, o, r || this), this
    }, t.prototype.off = t.prototype.removeEventListener = function(t, e, i) {
        var r, n, s, h, a = t.split(o),
            p = this._events;
        for (s = a.length; s--;) {
            if (t = a[s], !t) {
                for (s in p) p[s].length = 0;
                return this
            }
            if (r = p[t], !r) return this;
            if (e) {
                for (i || (i = this), h = r.length; h--;)
                    if (n = r[h], n.listener === e && n.ctx === i) {
                        r.splice(h, 1);
                        break
                    }
            } else r.length = 0
        }
        return this
    }, t.prototype.emit = t.prototype.trigger = function(t) {
        var e, o, r, n, s, h, a = this._events[t];
        if (!a || !a.length) return this;
        switch (arguments.length) {
            case 1:
                for (h = a.length; h--;)(s = a[h]).listener.call(s.ctx);
                break;
            case 2:
                for (e = arguments[1], h = a.length; h--;)(s = a[h]).listener.call(s.ctx, e);
                break;
            case 3:
                for (e = arguments[1], o = arguments[2], h = a.length; h--;)(s = a[h]).listener.call(s.ctx, e, o);
                break;
            case 4:
                for (e = arguments[1], o = arguments[2], r = arguments[3], h = a.length; h--;)(s = a[h]).listener.call(s.ctx, e, o, r);
                break;
            case 5:
                for (e = arguments[1], o = arguments[2], r = arguments[3], n = arguments[4], h = a.length; h--;)(s = a[h]).listener.call(s.ctx, e, o, r, n);
                break;
            default:
                for (i.apply(arguments), h = a.length; h--;)(s = a[h]).listener.apply(s.ctx, arguments)
        }
        return this
    }, t.extend = e, t
}), define("base/class", ["base/event_emitter"], function(t) {
    function e() {
        t.call(this), this._id = ++i, this._serverId = -1, this._SYNC = {}
    }
    var i = 0;
    return t.extend(e, t), e.prototype.clone = function() {
        return (new this.constructor).copy(this)
    }, e.prototype.copy = function() {
        return this
    }, e.prototype.toSYNC = function(t) {
        return t || (t = this._SYNC), t._id = this._id, t
    }, e.prototype.fromSYNC = function() {
        return this
    }, e.prototype.toJSON = function(t) {
        return t || (t = {}), t._id = this._id, t
    }, e.prototype.fromJSON = function(t) {
        return this._serverId = t._id, this
    }, e
}), define("base/device", [], function() {
    function t() {
        var t = navigator.userAgent.toLowerCase(),
            e = new Audio,
            i = document.createElement("video");
        this.userAgent = t, this.pixelRatio = window.devicePixelRatio || 1, this.invPixelRatio = 1 / this.pixelRatio, this.browser = t.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i)[1], this.touch = "ontouchstart" in window, this.mobile = /android|webos|iphone|ipad|ipod|blackberry/i.test(t), this.webgl = function() {
            var t, e, i = document.createElement("canvas"),
                o = ["3d", "moz-webgl", "experimental-webgl", "webkit-3d", "webgl"];
            for (e = o.length; e-- && !(t = !! i.getContext(o[e])););
            return t
        }(), this.canvas = function() {
            var t = document.createElement("canvas"),
                e = !! t.getContext("2d");
            return e
        }(), this.gamepads = !! navigator.getGamepads || !! navigator.webkitGetGamepads || !! navigator.webkitGamepads, this.audioMpeg = !! e.canPlayType("audio/mpeg"), this.audioOgg = !! e.canPlayType("audio/ogg"), this.audioMp4 = !! e.canPlayType("audio/mp4"), this.videoWebm = !! i.canPlayType("video/webm"), this.videoOgg = !! i.canPlayType("video/ogg"), this.videoMp4 = !! i.canPlayType("video/mp4")
    }
    return new t
}), define("core/game/config", [], function() {
    function t() {
        this.debug = !1, this.forceCanvas = !1, this.renderer = "", this.host = "127.0.0.1", this.port = 3e3, this.MAX_SERVER_STATES = 10, this.SCENE_SYNC_RATE = .5, this.MIN_DELTA = 1e-6, this.MAX_DELTA = 1
    }
    return t.prototype.fromJSON = function(t) {
        for (var e in t) void 0 != this[e] && (this[e] = t[e]);
        return this
    }, new t
}), define("core/game/log", ["core/game/config"], function(t) {
    function e() {}
    var i = Object.prototype.hasOwnProperty;
    return e.prototype.debug = e.prototype.info = e.prototype.log = function() {
        t.debug && console.log.apply(console, arguments)
    }, e.prototype.warn = function() {
        t.debug && console.warn.apply(console, arguments)
    }, e.prototype.error = function() {
        t.debug && console.error.apply(console, arguments)
    }, e.prototype.object = function(e) {
        if (!t.debug) return "";
        var o, r, n, s = "",
            h = arguments[1] || (arguments[1] = []);
        for (o in e) i.call(e, o) && (r = e[o], ~h.indexOf(r) || (n = typeof r, "object" === n ? (h.push(r), s += "	" + o + " = " + this.object(r, h)) : "function" !== n ? s += "	" + o + " = " + r + "\n" : h.push(r)));
        return s
    }, new e
}), define("base/dom", ["core/game/log"], function(t) {
    function e() {}
    var i = /[ \,]+/,
        o = /attribute\s+([a-z]+\s+)?([A-Za-z0-9]+)\s+([a-zA-Z_0-9]+)\s*(\[\s*(.+)\s*\])?/,
        r = /uniform\s+([a-z]+\s+)?([A-Za-z0-9]+)\s+([a-zA-Z_0-9]+)\s*(\[\s*(.+)\s*\])?/,
        n = ["webgl", "webkit-3d", "moz-webgl", "experimental-webgl", "3d"],
        s = {
            alpha: !0,
            antialias: !0,
            depth: !0,
            premultipliedAlpha: !0,
            preserveDrawingBuffer: !1,
            stencil: !0
        };
    e.prototype.addEvent = function(t, e, o, r) {
        var n, s = e.split(i),
            h = r || t,
            a = function(t) {
                t = t || window.event, o && o.call(h, t)
            };
        for (n = s.length; n--;) e = s[n], t.attachEvent ? t.attachEvent("on" + e, a) : t.addEventListener(e, a, !1)
    }, e.prototype.removeEvent = function(t, e, o, r) {
        var n, s, h = e.split(i),
            a = r || t,
            p = function(t) {
                t = t || window.event, o && o.call(a, t)
            };
        for (n = 0, s = h.length; s > n; n++) e = h[n], t.detachEvent ? t.detachEvent("on" + e, p) : t.removeEventListener(e, p, !1)
    }, e.prototype.addMeta = function(t, e, i) {
        var o = document.createElement("meta"),
            r = document.head;
        t && (o.id = t), e && (o.name = e), i && (o.content = i), r.insertBefore(o, r.firstChild)
    }, e.prototype.getWebGLContext = function(e, i) {
        var o, r, h, a;
        i || (i = {});
        for (o in s) void 0 != i[o] && (i[o] = s[o]);
        for (a = n.length; a--;) {
            try {
                h = e.getContext(n[a], i)
            } catch (p) {
                r = p
            }
            if (h) break
        }
        return r && t.warn("Dom.getWebGLContext: could not get a WebGL Context " + r.message || ""), h
    };
    var h = e.prototype.createShader = function(e, i, o) {
        var r = e.createShader(o);
        return e.shaderSource(r, i), e.compileShader(r), e.getShaderParameter(r, e.COMPILE_STATUS) ? r : (t.warn("Dom.createShader: problem compiling shader " + e.getShaderInfoLog(r)), e.deleteShader(r), void 0)
    };
    return e.prototype.createProgram = function(e, i, o) {
        var r, n = e.createProgram();
        return r = h(e, i, e.VERTEX_SHADER), e.attachShader(n, r), e.deleteShader(r), r = h(e, o, e.FRAGMENT_SHADER), e.attachShader(n, r), e.deleteShader(r), e.linkProgram(n), e.validateProgram(n), e.useProgram(n), e.getProgramParameter(n, e.LINK_STATUS) ? n : (t.warn("Dom.createProgram: problem compiling Program " + e.getProgramInfoLog(n)), e.deleteProgram(n), void 0)
    }, e.prototype.parseUniformsAttributes = function(t, e, i, n, s, h) {
        var a, p, c, u, m, f, l, d = i + n,
            y = d.split("\n");
        for (f = y.length; f--;)
            if (m = y[f], a = m.match(o), p = m.match(r), a && (c = a[3], s[c] = t.getAttribLocation(e, c)), p)
                if (c = p[3], u = parseInt(p[5]))
                    for (h[c] = [], l = u; l--;) h[c][l] = t.getUniformLocation(e, c + "[" + l + "]");
                else h[c] = t.getUniformLocation(e, c)
    }, new e
}), define("base/object_pool", [], function() {
    function t(t) {
        this.pooled = [], this.objects = [], this.object = t
    }
    return t.prototype.create = function() {
        var t = this.pooled,
            e = t.length ? t.pop() : new this.object;
        return this.objects.push(e), e
    }, t.prototype.removeObject = function(t) {
        var e = this.objects,
            i = this.pooled,
            o = e.indexOf(t);
        return o > -1 && (i.push(t), e.splice(o, 1)), this
    }, t.prototype.remove = t.prototype.removeObjects = function() {
        for (var t = arguments.length; t--;) this.removeObject(arguments[t]);
        return this
    }, t.prototype.clear = function() {
        var t, e = this.objects,
            i = this.pooled;
        for (t = e.length; t--;) i.push(e[t]);
        return e.length = 0, this
    }, t
}), define("base/request_animation_frame", [], function() {
    var t = 1e3 / 60,
        e = "undefined" != typeof window ? window : global;
    return e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function(i) {
        return e.setTimeout(i, t)
    }
}), define("base/time", [], function() {
    function t() {
        return .001 * o.now()
    }

    function e() {
        this.start = s, this.sinceStart = 0, this.time = 0, this.fps = 60, this.delta = h, this.frameCount = 0, r(this, "scale", {
            get: function() {
                return c
            },
            set: function(t) {
                c = t, a = p * t
            }
        }), r(this, "fixedDelta", {
            get: function() {
                return a
            },
            set: function(t) {
                p = t, a = p * c
            }
        })
    }
    var i = "undefined" != typeof window ? window : {}, o = "undefined" != typeof i.performance ? i.performance : {}, r = Object.defineProperty,
        n = Date.now(),
        s = .001 * n,
        h = 1 / 60,
        a = h,
        p = h,
        c = 1;
    return o.now = o.now || o.webkitNow || o.mozNow || o.msNow || o.oNow || function() {
        return Date.now() - n
    }, e.prototype.now = t, e.prototype.stamp = function() {
        return s + t()
    }, new e
}), define("core/assets/asset", ["core/game/log"], function(t) {
    function e(t) {
        t || (t = {}), this._id = ++o, this._type = this.constructor.name || "UnknownAsset", this.sync = void 0 != t.sync ? !! t.sync : !1, this.json = void 0 != t.json ? !! t.json : !0, this.assets = void 0, this._name = void 0 != t.name ? t.name : "Asset" + this._id, this.src = t.src, this.raw = t.raw, r(this, "name", {
            get: function() {
                return this._name
            },
            set: function(t) {
                if (t) {
                    var e = this.assets;
                    e && (delete e[this._name], e[t] = this), this._name = t
                }
            }
        }), this._SYNC = {}
    }

    function i(t, e) {
        t.prototype = Object.create(e.prototype), t.prototype.constructor = t, e.prototype._onExtend && e.prototype._onExtend(t), t.extend = i
    }
    var o = 0,
        r = Object.defineProperty;
    return e.type = "Asset", e._types = {
        Asset: e
    }, e.prototype._onExtend = function(t) {
        e._types[t.type] = t
    }, e.prototype.clone = function() {
        return (new this.constructor).copy(this)
    }, e.prototype.copy = function(t) {
        return this.sync = t.sync, this.json = t.json, this.name = t.name + "." + this._id, this.src = t.src, this.raw = t.raw, this.assets !== t.assets && t.assets.addAsset(this), this
    }, e.prototype.mimeType = function() {
        return this.src ? this.src.split(".").pop() : !1
    }, e.prototype.clear = function() {
        return this.raw = null, this
    }, e.prototype.destroy = function() {
        return this.assets ? (this.assets.removeAsset(this), this.clear(), this) : (t.warn("Asset.destroy: can't destroy Asset if it's not added to Assets"), this)
    }, e.prototype.parse = function(t) {
        return this.raw = t, this
    }, e.prototype.toSYNC = function(t) {
        return t || (t = this._SYNC), t
    }, e.prototype.fromSYNC = function() {
        return this
    }, e.prototype.toJSON = function(t) {
        return t || (t = {}), t._type = this._type, t.name = this.name, t.src = this.src, t
    }, e.prototype.fromJSON = function(t) {
        return this._type = t._type, this.name = t.name, this.src = t.src, this
    }, e.extend = i, e
}), define("base/audio_context", ["core/game/log"], function(t) {
    var e = "undefined" != typeof window ? window : global,
        i = e.AudioContext || e.webkitAudioContext || e.mozAudioContext || e.oAudioContext || e.msAudioContext;
    return i || t.error("AudioContext not supported by Browser"), i ? new i : !1
}), define("core/assets/assets", ["core/assets/asset", "core/game/log"], function(t, e) {
    function o() {
        Array.call(this), this.hash = {}, this._SYNC = {}
    }
    return o.prototype = Object.create(Array.prototype), o.prototype.constructor = o, o.prototype.addAsset = function(t) {
        var i = t.name;
        return this.hash[i] ? (e.warn("Assets.addAsset: Assets already have Asset named " + t.name), void 0) : (t.assets = this, this.push(t), this.hash[i] = t, t)
    }, o.prototype.add = o.prototype.addAssets = function() {
        for (var t = arguments.length; t--;) this.addAsset(arguments[t])
    }, o.prototype.removeAsset = function(t) {
        var i = "string" == typeof t ? t : t.name;
        return (t = this.hash[i]) ? (this.splice(this.indexOf(t), 1), this.hash[i] = null, t) : (e.warn("Assets.removeAsset: Assets does not have an Asset named " + i), void 0)
    }, o.prototype.remove = o.prototype.removeAssets = function() {
        for (var t = arguments.length; t--;) this.removeAsset(arguments[t])
    }, o.prototype.toSYNC = function(t) {
        t || (t = this._SYNC);
        var e, o = t.assets || (t.assets = []);
        for (i = this.length; i--;)(e = this[i]).sync && (o[i] = e.toSYNC(o[i]));
        return t
    }, o.prototype.fromSYNC = function(e) {
        var i, o, r, n = this.hash,
            s = e.assets || (e.assets = []);
        for (r = s.length; r--;)(o = s[r]) && ((i = n[o.name]) ? i.fromSYNC(o) : this.add((new t._types[o._type]).fromJSON(o)));
        return this
    }, o.prototype.toJSON = function(t) {
        t || (t = {});
        var e, i, o = t.assets || (t.assets = []);
        for (i = this.length; i--;)(e = this[i]).json && (o[i] = e.toJSON(o[i]));
        return t
    }, o.prototype.fromJSON = function(e) {
        var i, o, r, n = this.hash,
            s = e.assets || (e.assets = []);
        for (r = s.length; r--;)(o = s[r]) && ((i = n[o.name]) ? i.fromJSON(o) : this.add((new t._types[o._type]).fromJSON(o)));
        return this
    }, new o
}), define("core/assets/asset_loader", ["base/event_emitter", "base/audio_context", "core/assets/asset", "core/assets/assets", "core/game/log"], function(t, e, i, o, r) {
    function n() {
        t.call(this)
    }
    var s = function() {};
    return t.extend(n, t), n.prototype.load = function(t, e) {
        t || (t = s);
        var i, n = this,
            h = o.length,
            a = function(e) {
                e && r.warn(e.message), h--, 0 === h && (n.emit("load"), t())
            };
        for (i = h; i--;) this.loadAsset(o[i], a, e)
    }, n.prototype.loadAsset = function(t, e, i) {
        var o, r = this;
        if (t.raw && !i) return e(), void 0;
        if (o = t.mimeType()) {
            if (!this[o]) return e(new Error("AssetLoader.load: has no loader named " + o)), void 0;
            this[o](t.src, function(i, o) {
                return i ? (e(new Error("AssetLoader.load: " + i.message)), void 0) : (t.parse(o), r.emit("loadAsset", t), e(), void 0)
            })
        }
    }, n.prototype.gif = n.prototype.jpg = n.prototype.jpeg = n.prototype.png = function(t, e) {
        var i = new Image;
        i.addEventListener("load", function() {
            e && e(null, i)
        }, !1), i.addEventListener("error", function(t) {
            e && e(t)
        }, !1), i.src = t
    }, n.prototype.json = function(t, e) {
        var i = new XMLHttpRequest;
        i.addEventListener("readystatechange", function(t) {
            if (1 == this.readyState) this.send(null);
            else if (4 == this.readyState) {
                var i, o = this.status;
                if (o > 199 && 301 > o || 304 == o) {
                    try {
                        i = JSON.parse(this.responseText)
                    } catch (t) {
                        return e && e(t), void 0
                    }
                    e && e(null, i)
                } else e && e(new Error(o))
            }
        }, !1), i.open("GET", t, !0)
    }, n.prototype.ogg = n.prototype.wav = n.prototype.mp3 = n.prototype.aac = function(t, e) {
        var i = new XMLHttpRequest;
        i.addEventListener("readystatechange", function() {
            if (1 == this.readyState) this.send(null);
            else if (4 == this.readyState) {
                var t = this.status;
                t > 199 && 301 > t || 304 == t ? e && e(null, this.response) : e && e(new Error(t))
            }
        }, !1), i.responseType = "arraybuffer", i.open("GET", t, !0)
    }, new n
}), define("core/assets/audio_clip", ["base/audio_context", "base/time", "core/assets/asset"], function(t, e, i) {
    function o(t) {
        t || (t = {}), i.call(this, t), this._volume = void 0 != t.volume ? t.volume : 1, this._loop = void 0 != t.loop ? t.loop : !1, this._playbackRate = void 0 != t.playbackRate ? t.playbackRate : 1, this._paused = !1, this._startTime = 0, this.currentTime = 0, this._buffer = void 0, this.source = void 0, this.gain = void 0, this.panner = void 0
    }

    function r(e) {
        var i = e.source = t.createBufferSource();
        return i.buffer = e._buffer, i.connect(e.panner), e.refresh && e.refresh(), i
    }
    var n = e.now,
        s = Object.defineProperty;
    return o.type = "AudioClip", i.extend(o, i), s(o.prototype, "volume", {
        get: function() {
            return this._volume
        },
        set: function(t) {
            this._volume = t, this.gain && (this.gain.gain.value = t)
        }
    }), s(o.prototype, "loop", {
        get: function() {
            return this._loop
        },
        set: function(t) {
            this._loop = t, this.source && (this.source.loop = t)
        }
    }), s(o.prototype, "playbackRate", {
        get: function() {
            return this._playbackRate
        },
        set: function(t) {
            this._playbackRate = t, this.source && (this.source.playbackRate.value = t)
        }
    }), s(o.prototype, "length", {
        get: function() {
            return this._buffer ? this._buffer.duration : 0
        }
    }), o.prototype.parse = function(e) {
        i.prototype.parse.call(this, e);
        var o = (this._buffer = t.createBuffer(e, !1), this.gain = t.createGain()),
            n = this.panner = t.createPanner(),
            s = r(this);
        return o.connect(t.destination), o.gain.value = this.volume, n.connect(o), s.loop = this.loop, s.playbackRate.value = this.playbackRate, this
    }, o.prototype.play = function(t, e, i) {
        return t || (t = 0), e && (this.currentTime = e), i || (i = this.length), this._startTime = n(), this.source && (this._paused || (r(this), this.currentTime = 0), this.source.start(t, this.currentTime, i), this._paused = !1), this
    }, o.prototype.pause = function() {
        return this._paused = !0, this.currentTime = n() - this._startTime, this.source && this.source.stop(0), this
    }, o.prototype.stop = function() {
        return this.currentTime = 0, this.source && this.source.stop(0), this
    }, o.prototype.setPosition = function(t, e, i) {
        return this.source ? (this.panner.setPosition(t, e, i), this) : this
    }, o.prototype.setOrientation = function(t, e, i) {
        return this.source ? (this.panner.setOrientation(t, e, i), this) : this
    }, o.prototype.toJSON = function(t) {
        return t || (t = {}), i.prototype.toJSON.call(this, t), t.loop = this.loop, t.volume = this.volume, t.playbackRate = this.playbackRate, t
    }, o.prototype.fromJSON = function(t) {
        return i.prototype.fromJSON.call(this, t), this.loop = t.loop, this.volume = t.volume, this.playbackRate = t.playbackRate, this
    }, o
}), define("core/assets/sprite_sheet", ["core/assets/asset", "core/game/log"], function(t, e) {
    function i(e) {
        e || (e = {}), t.call(this, e)
    }
    return i.type = "SpriteSheet", t.extend(i, t), i.prototype.parse = function(i) {
        t.prototype.parse.call(this, i);
        for (var o in i) this[o] ? e.warn("SpriteSheet.parse: bad name " + o + " in file " + this.src) : this[o] = i[o];
        return this
    }, i.prototype.clear = function() {
        for (var e in this.raw) this[e] = null;
        return t.prototype.clear.call(this), this
    }, i.prototype.toJSON = function(e) {
        return e || (e = {}), t.prototype.toJSON.call(this, e), !this.src && this.raw && (e.raw = JSON.stringify(this.raw)), e
    }, i.prototype.fromJSON = function(e) {
        return t.prototype.fromJSON.call(this, e), !e.src && e.raw && (this.raw = JSON.parse(e.raw)), this.parse(this.raw), this
    }, i
}), define("core/assets/texture", ["core/assets/asset"], function(t) {
    function e(e) {
        e || (e = {}), t.call(this, e), this.anisotropy = void 0 != e.anisotropy ? e.anisotropy : 1, this.minFilter = void 0 != e.minFilter ? e.minFilter : "LINEAR", this.magFilter = void 0 != e.magFilter ? e.magFilter : "LINEAR", this.format = void 0 !== e.format ? e.format : "RGBA", this._needsUpdate = !0
    }
    e.type = "Texture", t.extend(e, t), e.prototype.setAnisotropy = function(t) {
        this.anisotropy = t, this._needsUpdate = !0
    }, e.prototype.setMinFilter = function(t) {
        this.minFilter = t, this._needsUpdate = !0
    }, e.prototype.setMagFilter = function(t) {
        this.magFilter = t, this._needsUpdate = !0
    }, e.prototype.setFormat = function(t) {
        this.format = t, this._needsUpdate = !0
    };
    var i, o;
    return e.prototype.toJSON = function(e) {
        if (e || (e = {}), t.prototype.toJSON.call(this, e), !this.src && this.raw)
            if ("undefined" == typeof window) e.raw = this.raw;
            else {
                var r = this.raw,
                    n = i || (i = document.createElement("canvas")),
                    s = o || (o = i.getContext("2d"));
                n.width = r.width, n.height = r.height, s.clearRect(0, 0, n.width, n.height), s.drawImage(r, 0, 0), e.raw = n.toDataURL()
            }
        return e.anisotropy = this.anisotropy, e.minFilter = this.minFilter, e.magFilter = this.magFilter, e.format = this.format, e
    }, e.prototype.fromJSON = function(e) {
        if (t.prototype.fromJSON.call(this, e), !e.src && e.raw)
            if ("undefined" == typeof window) this.raw = e.raw;
            else {
                var i = new Image;
                i.src = e.raw, this.raw = i
            }
        return this.anisotropy = e.anisotropy, this.minFilter = e.minFilter, this.magFilter = e.magFilter, this.format = e.format, this
    }, e
}), define("math/mathf", [], function() {
    function t() {
        this.PI = f, this.TWO_PI = l, this.HALF_PI = d, this.EPSILON = m, this.TO_RADS = y, this.TO_DEGS = v
    }
    var e, i, o, r, n, s = Math.random,
        h = Math.abs,
        a = Math.pow,
        p = Math.floor,
        c = Math.ceil,
        u = Math.atan2,
        m = 1e-6,
        f = 3.141592653589793,
        l = 2 * f,
        d = .5 * f,
        y = f / 180,
        v = 180 / f;
    t.prototype.acos = Math.acos, t.prototype.asin = Math.asin, t.prototype.atan = Math.atan, t.prototype.atan2 = Math.atan2, t.prototype.cos = Math.cos, t.prototype.sin = Math.sin, t.prototype.tan = Math.tan, t.prototype.abs = Math.abs, t.prototype.ceil = Math.ceil, t.prototype.exp = Math.exp, t.prototype.floor = Math.floor, t.prototype.log = Math.log, t.prototype.max = Math.max, t.prototype.min = Math.min, t.prototype.pow = Math.pow, t.prototype.random = Math.random, t.prototype.round = Math.round, t.prototype.sqrt = Math.sqrt, t.prototype.equals = function(t, e, i) {
        return h(t - e) < (i || m)
    }, t.prototype.modulo = e = function(t, e) {
        var i = t % e;
        return 0 > i * e ? i + e : i
    }, t.prototype.standardRadian = o = function(t) {
        return e(t, l)
    }, t.prototype.standardAngle = r = function(t) {
        return e(t, 360)
    }, t.prototype.sign = function(t) {
        return t ? 0 > t ? -1 : 1 : 0
    }, t.prototype.clamp = function(t, e, i) {
        return e > t ? e : t > i ? i : t
    }, t.prototype.clampBottom = function(t, e) {
        return e > t ? e : t
    }, t.prototype.clampTop = function(t, e) {
        return t > e ? e : t
    }, t.prototype.clamp01 = i = function(t) {
        return 0 > t ? 0 : t > 1 ? 1 : t
    }, t.prototype.truncate = function(t, e) {
        var i = a(10, e),
            o = t * i;
        return (0 > o ? c(o) : p(o)) / i
    }, t.prototype.lerp = function(t, e, i) {
        return t + (e - t) * i
    }, t.prototype.lerpAngle = function(t, e, i) {
        return o(t + (e - t) * i)
    }, t.prototype.smoothStep = function(t, e, i) {
        return e >= t ? 0 : t >= i ? 1 : (t = (t - e) / (i - e), t * t * (3 - 2 * t))
    }, t.prototype.smootherStep = function(t, e, i) {
        return e >= t ? 0 : t >= i ? 1 : (t = (t - e) / (i - e), t * t * t * (t * (6 * t - 15) + 10))
    }, t.prototype.pingPong = function(t, e) {
        return e || (e = 1), e - h(t % (2 * e) - e)
    }, t.prototype.degsToRads = function(t) {
        return o(t * y)
    }, t.prototype.radsToDegs = n = function(t) {
        return r(t * v)
    }, t.prototype.randInt = function(t, e) {
        return~~ (t + s() * (e + 1 - t))
    }, t.prototype.randFloat = function(t, e) {
        return t + s() * (e - t)
    }, t.prototype.randChoice = function(t) {
        return t[~~(s() * t.length)]
    }, t.prototype.isPowerOfTwo = function(t) {
        return (t & -t) === t
    }, t.prototype.toPowerOfTwo = function(t) {
        for (var e = 2; t > e;) e *= 2;
        return e
    };
    var g = "right",
        x = "up_right",
        w = "up",
        b = "up_left",
        S = "left",
        _ = "down_left",
        O = "down",
        z = "down_right";
    return t.prototype.directionAngle = function(t) {
        return t = n(t), t > 337.5 && 22.5 > t ? g : t > 22.5 && 67.5 > t ? x : t > 67.5 && 112.5 > t ? w : t > 112.5 && 157.5 > t ? b : t > 157.5 && 202.5 > t ? S : t > 202.5 && 247.5 > t ? _ : t > 247.5 && 292.5 > t ? O : t > 292.5 && 337.5 > t ? z : g
    }, t.prototype.direction = function(t, e) {
        var i = n(u(e, t));
        return i > 337.5 && 22.5 > i ? g : i > 22.5 && 67.5 > i ? x : i > 67.5 && 112.5 > i ? w : i > 112.5 && 157.5 > i ? b : i > 157.5 && 202.5 > i ? S : i > 202.5 && 247.5 > i ? _ : i > 247.5 && 292.5 > i ? O : i > 292.5 && 337.5 > i ? z : g
    }, new t
}), define("math/vec2", [], function() {
    function t(t, e) {
        this.x = t || 0, this.y = e || 0
    }
    var e = Math.sqrt;
    return t.prototype.clone = function() {
        return new t(this.x, this.y)
    }, t.prototype.copy = function(t) {
        return this.x = t.x, this.y = t.y, this
    }, t.prototype.set = function(t, e) {
        return this.x = t, this.y = e, this
    }, t.prototype.add = function(t) {
        return this.x += t.x, this.y += t.y, this
    }, t.prototype.vadd = function(t, e) {
        return this.x = t.x + e.x, this.y = t.y + e.y, this
    }, t.prototype.sadd = function(t) {
        return this.x += t, this.y += t, this
    }, t.prototype.sub = function(t) {
        return this.x -= t.x, this.y -= t.y, this
    }, t.prototype.vsub = function(t, e) {
        return this.x = t.x - e.x, this.y = t.y - e.y, this
    }, t.prototype.ssub = function(t) {
        return this.x -= t, this.y -= t, this
    }, t.prototype.mul = function(t) {
        return this.x *= t.x, this.y *= t.y, this
    }, t.prototype.vmul = function(t, e) {
        return this.x = t.x * e.x, this.y = t.y * e.y, this
    }, t.prototype.smul = function(t) {
        return this.x *= t, this.y *= t, this
    }, t.prototype.div = function(t) {
        var e = t.x,
            i = t.y;
        return this.x *= 0 !== e ? 1 / e : 0, this.y *= 0 !== i ? 1 / i : 0, this
    }, t.prototype.vdiv = function(t, e) {
        var i = e.x,
            o = e.y;
        return this.x = 0 !== i ? t.x / i : 0, this.y = 0 !== o ? t.y / o : 0, this
    }, t.prototype.sdiv = function(t) {
        return t = 0 === t ? 0 : 1 / t, this.x *= t, this.y *= t, this
    }, t.prototype.length = function() {
        var t = this.x,
            i = this.y,
            o = t * t + i * i;
        return 1 === o ? 1 : o > 0 ? e(o) : 0
    }, t.prototype.lengthSq = function() {
        var t = this.x,
            e = this.y;
        return t * t + e * e
    }, t.prototype.setLength = function(t) {
        var i = this.x,
            o = this.y,
            r = i * i + o * o;
        return 1 === r ? (this.x *= t, this.y *= t, this) : (r = r > 0 ? 1 / e(r) : 0, this.x *= r * t, this.y *= r * t, this)
    }, t.prototype.normalize = function() {
        var t = this.x,
            i = this.y,
            o = t * t + i * i;
        return 1 === o ? this : (o = o > 0 ? 1 / e(o) : 0, this.x *= o, this.y *= o, this)
    }, t.prototype.inverse = function() {
        return this.x *= -1, this.y *= -1, this
    }, t.prototype.inverseVec = function(t) {
        return this.x = -t.x, this.y = -t.y, this
    }, t.prototype.lerp = function(t, e) {
        return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this
    }, t.prototype.vlerp = function(t, e, i) {
        var o = t.x,
            r = t.y;
        return this.x = o + (e.x - o) * i, this.y = r + (e.y - r) * i, this
    }, t.vdot = t.prototype.vdot = function(t, e) {
        return t.x * e.x + t.y * e.y
    }, t.prototype.dot = function(t) {
        return this.x * t.x + this.y * t.y
    }, t.vcross = t.prototype.vcross = function(t, e) {
        return t.x * e.y - t.y * e.x
    }, t.prototype.cross = function(t) {
        return this.x * t.y - this.y * t.x
    }, t.prototype.min = function(t) {
        var e = this.x,
            i = this.y,
            o = t.x,
            r = t.y;
        return this.x = e > o ? o : e, this.y = i > r ? r : i, this
    }, t.prototype.max = function(t) {
        var e = this.x,
            i = this.y,
            o = t.x,
            r = t.y;
        return this.x = o > e ? o : e, this.y = r > i ? r : i, this
    }, t.prototype.clamp = function(t, e) {
        var i = this.x,
            o = this.y,
            r = t.x,
            n = t.y,
            s = e.x,
            h = e.y;
        return this.x = r > i ? r : i > s ? s : i, this.y = n > o ? n : o > h ? h : o, this
    }, t.prototype.transformAngle = function(t) {
        var e = this.x,
            i = this.y,
            o = cos(t),
            r = sin(t);
        return this.x = e * o - i * r, this.y = e * r + i * o, this
    }, t.prototype.transformMat2 = function(t) {
        var e = t.elements,
            i = this.x,
            o = this.y;
        return this.x = i * e[0] + o * e[2], this.y = i * e[1] + o * e[3], this
    }, t.prototype.untransformMat2 = function(t) {
        var e = t.elements,
            i = this.x,
            o = this.y;
        return this.x = i * e[0] + o * e[1], this.y = i * e[2] + o * e[3], this
    }, t.prototype.transformMat32 = function(t) {
        var e = t.elements,
            i = this.x,
            o = this.y;
        return this.x = i * e[0] + o * e[2] + e[4], this.y = i * e[1] + o * e[3] + e[5], this
    }, t.prototype.untransformMat32 = function(t) {
        var e = t.elements,
            i = this.x - e[4],
            o = this.y - e[5];
        return this.x = i * e[0] + o * e[1], this.y = i * e[2] + o * e[3], this
    }, t.prototype.transformMat3 = function(t) {
        var e = t.elements,
            i = this.x,
            o = this.y;
        return this.x = i * e[0] + o * e[3] + e[6], this.y = i * e[1] + o * e[4] + e[7], this
    }, t.prototype.transformMat4 = function(t) {
        var e = t.elements,
            i = this.x,
            o = this.y;
        return this.x = i * e[0] + o * e[4] + e[12], this.y = i * e[1] + o * e[5] + e[13], this
    }, t.prototype.fromVec3 = function(t) {
        return this.x = t.x, this.y = t.y, this
    }, t.prototype.fromVec4 = function(t) {
        return this.x = t.x, this.y = t.y, this
    }, t.prototype.positionFromMat32 = function(t) {
        var e = t.elements;
        return this.x = e[4], this.y = e[5], this
    }, t.prototype.positionFromMat4 = function(t) {
        var e = t.elements;
        return this.x = e[12], this.y = e[13], this
    }, t.prototype.scaleFromMat2 = function(t) {
        var e = t.elements,
            i = this.set(e[0], t[2]).length(),
            o = this.set(e[1], t[3]).length();
        return this.x = i, this.y = o, this
    }, t.prototype.scaleFromMat32 = t.prototype.scaleFromMat2, t.prototype.fromJSON = function(t) {
        return this.x = t.x, this.y = t.y, this
    }, t.prototype.toJSON = function(t) {
        return t || (t = {}), t.x = this.x, t.y = this.y, t
    }, t.prototype.toString = function() {
        return "Vec2( " + this.x + ", " + this.y + " )"
    }, t
}), define("core/components/component", ["base/class", "core/game/log"], function(t, e) {
    function i(e, i, o) {
        t.call(this), this._type = e || "UnknownComponent", this._name = this._type.toLowerCase(), this.sync = void 0 != i ? !! i : !0, this.json = void 0 != o ? !! o : !0, this.gameObject = void 0
    }
    return t.extend(i, t), i.type = "Component", i._types = {}, i.prototype._onExtend = function(t) {
        i._types[t.type] = t
    }, i.prototype.init = function() {}, i.prototype.update = function() {}, i.prototype.clear = function() {}, i.prototype.destroy = function() {
        return this.gameObject ? (this.gameObject.removeComponent(this), this.emit("destroy"), this.clear(), this) : (e.warn("Component.destroy: can't destroy Component if it's not added to a GameObject"), this)
    }, i.prototype.sort = function(t, e) {
        return t === e ? -1 : 1
    }, i.prototype.toSYNC = function(e) {
        return e = t.prototype.toSYNC.call(this, e)
    }, i.prototype.fromSYNC = function() {
        return this
    }, i.prototype.toJSON = function(e) {
        return e || (e = {}), t.prototype.toJSON.call(this, e), e._type = this._type, e._name = this._name, e.sync = this.sync, e.json = this.json, e
    }, i.prototype.fromJSON = function(e) {
        return t.prototype.fromJSON.call(this, e), this._type = e._type, this._name = e._name, this.sync = e.sync, this.json = e.json, this
    }, i
}), define("core/components/audio_source", ["base/audio_context", "base/class", "math/mathf", "math/vec2", "core/components/component"], function(t, e, i, o, r) {
    function n(t) {
        t || (t = {}), r.call(this, "AudioSource", t.sync, t.json), this.clip = t.clip, this.doppler = void 0 != t.doppler ? !! t.doppler : !1, this.autoplay = void 0 != t.autoplay ? !! t.autoplay : !1, this.autoplay && this.play()
    }
    return i.clamp01, n.type = "AudioSource", e.extend(n, r), n.prototype.update = function() {
        if (this.doppler && this.gameObject.scene.game.camera) {
            var e = this.gameObject.scene.game.camera,
                i = e.transform2d.position,
                o = this.transform2d.position,
                r = this.clip;
            t.listener.setPosition(i.x, i.y, e.orthographicSize), r.setPosition(o.x, o.y, 0)
        }
    }, n.prototype.play = function(t, e, i) {
        return this.clip.play(t, e, i), this
    }, n.prototype.pause = function() {
        return this.clip.pause(), this
    }, n.prototype.stop = function() {
        return this.clip.stop(), this
    }, n.prototype.toSYNC = function(t) {
        return t = r.prototype.toSYNC.call(this, t)
    }, n.prototype.fromSYNC = function(t) {
        return r.prototype.fromSYNC.call(this, t), this
    }, n.prototype.toJSON = function(t) {
        return t || (t = {}), r.prototype.toJSON.call(this, t), t.doppler = this.doppler, t.clip = this.clip ? this.clip.name : void 0, t.autoplay = this.autoplay, t
    }, n.prototype.fromJSON = function(t) {
        return r.prototype.fromJSON.call(this, t), this.doppler = t.doppler, this.clip = t.clip ? Assets.hash[t.clip] : void 0, this.autoplay = t.autoplay, this.autoplay && this.play(), this
    }, n.prototype.sort = function(t, e) {
        return t === e ? -1 : 1
    }, n
}), define("math/color", ["math/mathf"], function(t) {
    function e(t, e, i) {
        this.r = 0, this.g = 0, this.b = 0, this._r = 0, this._g = 0, this._b = 0, this._hex = "#000000", this._rgb = "rgb(0,0,0)", this.set(t, e, i)
    }

    function i(t) {
        var e = (~~(255 * n(t))).toString(16);
        return 1 === e.length ? "0" + e : e
    }
    var o = Math.sqrt,
        r = Math.floor,
        n = t.clamp01;
    e.prototype.clone = function() {
        return new e(this.r, this.g, this.b)
    }, e.prototype.copy = function(t) {
        return this.r = t.r, this.g = t.g, this.b = t.b, this
    }, e.prototype.set = function(t, i, o) {
        var r = typeof t;
        return "number" === r ? (this.r = t, this.g = i, this.b = o) : "string" === r ? this.setStyle(t) : t instanceof e && (this.r = t.r, this.g = t.g, this.b = t.b), this
    }, e.prototype.setRGB = function(t, e, i) {
        return this.r = t, this.g = e, this.b = i, this
    }, e.prototype.setStyle = function() {
        var t = /^rgb\((\d+),(\d+),(\d+)\)$/i,
            e = /^rgb\((\d+)\%,(\d+)\%,(\d+)\%\)$/i,
            i = /^\#([0-9a-f]{6})$/i,
            o = /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i,
            r = /#(.)(.)(.)/,
            n = "#$1$1$2$2$3$3",
            h = /^(\w+)$/i,
            a = 1 / 255,
            p = .01;
        return function(c) {
            if (t.test(c)) {
                var u = t.exec(c);
                return this.r = min(255, Number(u[1])) * a, this.g = min(255, Number(u[2])) * a, this.b = min(255, Number(u[3])) * a, this
            }
            if (e.test(c)) {
                var u = e.exec(c);
                return this.r = min(100, Number(u[1])) * p, this.g = min(100, Number(u[2])) * p, this.b = min(100, Number(u[3])) * p, this
            }
            return i.test(c) ? (this.r = parseInt(c.substr(1, 2), 16) * a, this.g = parseInt(c.substr(3, 2), 16) * a, this.b = parseInt(c.substr(5, 2), 16) * a, this) : o.test(c) ? (c = c.replace(r, n), this.r = parseInt(c.substr(1, 2), 16) * a, this.g = parseInt(c.substr(3, 2), 16) * a, this.b = parseInt(c.substr(5, 2), 16) * a, this) : h.test(c) ? (c = s[c], this.r = parseInt(c.substr(1, 2), 16) * a, this.g = parseInt(c.substr(3, 2), 16) * a, this.b = parseInt(c.substr(5, 2), 16) * a, this) : this
        }
    }(), e.prototype.toHEX = function() {
        if (this.r !== this._r || this.g !== this._g || this.b !== this._b) {
            var t = i(this.r),
                e = i(this.g),
                o = i(this.b);
            this._r = this.r, this._g = this.g, this._b = this.b, this._hex = "#" + t + e + o
        }
        return this._hex
    }, e.prototype.toRGB = function() {
        if (this.r !== this._r || this.g !== this._g || this.b !== this._b) {
            var t = r(256 * n(this.r)),
                e = r(256 * n(this.g)),
                i = r(256 * n(this.b));
            this._r = this.r, this._g = this.g, this._b = this.b, this._rgb = "rgb(" + t + "," + e + "," + i + ")"
        }
        return this._rgb
    }, e.prototype.add = function(t) {
        return this.r += t.r, this.g += t.g, this.b += t.b, this
    }, e.prototype.cadd = function(t, e) {
        return this.r = t.r + e.r, this.g = t.g + e.g, this.b = t.b + e.b, this
    }, e.prototype.sadd = function(t) {
        return this.r += t, this.g += t, this.b += t, this
    }, e.prototype.sub = function(t) {
        return this.r -= t.r, this.g -= t.g, this.b -= t.b, this
    }, e.prototype.csub = function(t, e) {
        return this.r = t.r - e.r, this.g = t.g - e.g, this.b = t.b - e.b, this
    }, e.prototype.ssub = function(t) {
        return this.r -= t, this.g -= t, this.b -= t, this
    }, e.prototype.mul = function(t) {
        return this.r *= t.r, this.g *= t.g, this.b *= t.b, this
    }, e.prototype.cmul = function(t, e) {
        return this.r = t.r * e.r, this.g = t.g * e.g, this.b = t.b * e.b, this
    }, e.prototype.smul = function(t) {
        return this.r *= t, this.g *= t, this.b *= t, this
    }, e.prototype.div = function(t) {
        var e = t.r,
            i = t.g,
            o = t.b;
        return t.w, this.r *= 0 !== e ? 1 / e : 0, this.g *= 0 !== i ? 1 / i : 0, this.b *= 0 !== o ? 1 / o : 0, this
    }, e.prototype.cdiv = function(t, e) {
        var i = e.r,
            o = e.g,
            r = e.b;
        return this.r = 0 !== i ? t.r / i : 0, this.g = 0 !== o ? t.g / o : 0, this.b = 0 !== r ? t.b / r : 0, this
    }, e.prototype.sdiv = function(t) {
        return t = 0 === t ? 0 : 1 / t, this.r *= t, this.g *= t, this.b *= t, this
    }, e.prototype.length = function() {
        var t = this.r,
            e = this.g,
            i = this.b,
            r = t * t + e * e + i * i;
        return r > 0 ? 1 / o(r) : 0
    }, e.prototype.lengthSq = function() {
        var t = this.r,
            e = this.g,
            i = this.b;
        return t * t + e * e + i * i
    }, e.prototype.normalize = function() {
        var t = this.r,
            e = this.g,
            i = this.b,
            r = t * t + e * e + i * i;
        return r = r > 0 ? 1 / o(r) : 0, this.r *= r, this.g *= r, this.b *= r, this
    }, e.prototype.check = function() {
        var t = this.r,
            e = this.g,
            i = this.b;
        return this.r = t > 1 ? 1 : t, this.g = e > 1 ? 1 : e, this.b = i > 1 ? 1 : i, this
    }, e.prototype.lerp = function(t, e) {
        return this.r += (t.r - this.r) * e, this.g += (t.g - this.g) * e, this.b += (t.b - this.b) * e, this
    }, e.prototype.clerp = function(t, e, i) {
        var o = t.r,
            r = t.g,
            n = t.b;
        return this.r = o + (e.r - o) * i, this.g = r + (e.g - r) * i, this.b = n + (e.b - n) * i, this
    }, e.prototype.min = function(t) {
        var e = this.r,
            i = this.g,
            o = this.b,
            r = t.r,
            n = t.g,
            s = t.b;
        return this.r = e > r ? r : e, this.g = i > n ? n : i, this.b = o > s ? s : o, this
    }, e.prototype.max = function(t) {
        var e = this.r,
            i = this.g,
            o = this.b,
            r = t.r,
            n = t.g,
            s = t.b;
        return this.r = r > e ? r : e, this.g = n > i ? n : i, this.b = s > o ? s : o, this
    }, e.prototype.fromVec2 = function(t) {
        return this.r = t.x, this.g = t.y, this.b = 0, this
    }, e.prototype.fromVec3 = function(t) {
        return this.r = t.x, this.g = t.y, this.b = t.z, this
    }, e.prototype.fromVec4 = e.prototype.fromVec3, e.prototype.fromJSON = function(t) {
        return this.r = t.r, this.g = t.g, this.b = t.b, this
    }, e.prototype.toJSON = function(t) {
        return t || (t = {}), t.r = this.r, t.g = this.g, t.b = this.b, t
    }, e.prototype.toString = function() {
        return "Color( " + this.r + ", " + this.g + ", " + this.b + " )"
    };
    var s = e.colorNames = {
        aliceblue: "#f0f8ff",
        antiquewhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedalmond: "#ffebcd",
        blue: "#0000ff",
        blueviolet: "#8a2be2",
        brown: "#a52a2a",
        burlywood: "#deb887",
        cadetblue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflowerblue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkblue: "#00008b",
        darkcyan: "#008b8b",
        darkgoldenrod: "#b8860b",
        darkgray: "#a9a9a9",
        darkgreen: "#006400",
        darkkhaki: "#bdb76b",
        darkmagenta: "#8b008b",
        darkolivegreen: "#556b2f",
        darkorange: "#ff8c00",
        darkorchid: "#9932cc",
        darkred: "#8b0000",
        darksalmon: "#e9967a",
        darkseagreen: "#8fbc8f",
        darkslateblue: "#483d8b",
        darkslategray: "#2f4f4f",
        darkturquoise: "#00ced1",
        darkviolet: "#9400d3",
        deeppink: "#ff1493",
        deepskyblue: "#00bfff",
        dimgray: "#696969",
        dodgerblue: "#1e90ff",
        firebrick: "#b22222",
        floralwhite: "#fffaf0",
        forestgreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#dcdcdc",
        ghostwhite: "#f8f8ff",
        gold: "#ffd700",
        goldenrod: "#daa520",
        gray: "#808080",
        green: "#008000",
        greenyellow: "#adff2f",
        grey: "#808080",
        honeydew: "#f0fff0",
        hotpink: "#ff69b4",
        indianred: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        lavender: "#e6e6fa",
        lavenderblush: "#fff0f5",
        lawngreen: "#7cfc00",
        lemonchiffon: "#fffacd",
        lightblue: "#add8e6",
        lightcoral: "#f08080",
        lightcyan: "#e0ffff",
        lightgoldenrodyellow: "#fafad2",
        lightgrey: "#d3d3d3",
        lightgreen: "#90ee90",
        lightpink: "#ffb6c1",
        lightsalmon: "#ffa07a",
        lightseagreen: "#20b2aa",
        lightskyblue: "#87cefa",
        lightslategray: "#778899",
        lightsteelblue: "#b0c4de",
        lightyellow: "#ffffe0",
        lime: "#00ff00",
        limegreen: "#32cd32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        mediumaquamarine: "#66cdaa",
        mediumblue: "#0000cd",
        mediumorchid: "#ba55d3",
        mediumpurple: "#9370d8",
        mediumseagreen: "#3cb371",
        mediumslateblue: "#7b68ee",
        mediumspringgreen: "#00fa9a",
        mediumturquoise: "#48d1cc",
        mediumvioletred: "#c71585",
        midnightblue: "#191970",
        mintcream: "#f5fffa",
        mistyrose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajowhite: "#ffdead",
        navy: "#000080",
        oldlace: "#fdf5e6",
        olive: "#808000",
        olivedrab: "#6b8e23",
        orange: "#ffa500",
        orangered: "#ff4500",
        orchid: "#da70d6",
        palegoldenrod: "#eee8aa",
        palegreen: "#98fb98",
        paleturquoise: "#afeeee",
        palevioletred: "#d87093",
        papayawhip: "#ffefd5",
        peachpuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderblue: "#b0e0e6",
        purple: "#800080",
        red: "#ff0000",
        rosybrown: "#bc8f8f",
        royalblue: "#4169e1",
        saddlebrown: "#8b4513",
        salmon: "#fa8072",
        sandybrown: "#f4a460",
        seagreen: "#2e8b57",
        seashell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        skyblue: "#87ceeb",
        slateblue: "#6a5acd",
        slategray: "#708090",
        snow: "#fffafa",
        springgreen: "#00ff7f",
        steelblue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#ffffff",
        whitesmoke: "#f5f5f5",
        yellow: "#ffff00",
        yellowgreen: "#9acd32"
    };
    return e
}), define("math/vec3", [], function() {
    function t(t, e, i) {
        this.x = t || 0, this.y = e || 0, this.z = i || 0
    }
    var e = Math.sqrt;
    return t.prototype.clone = function() {
        return new t(this.x, this.y, this.z)
    }, t.prototype.copy = function(t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this
    }, t.prototype.set = function(t, e, i) {
        return this.x = t, this.y = e, this.z = i, this
    }, t.prototype.add = function(t) {
        return this.x += t.x, this.y += t.y, this.z += t.z, this
    }, t.prototype.vadd = function(t, e) {
        return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this
    }, t.prototype.sadd = function(t) {
        return this.x += t, this.y += t, this.z += t, this
    }, t.prototype.sub = function(t) {
        return this.x -= t.x, this.y -= t.y, this.z -= t.z, this
    }, t.prototype.vsub = function(t, e) {
        return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this
    }, t.prototype.ssub = function(t) {
        return this.x -= t, this.y -= t, this.z -= t, this
    }, t.prototype.mul = function(t) {
        return this.x *= t.x, this.y *= t.y, this.z *= t.z, this
    }, t.prototype.vmul = function(t, e) {
        return this.x = t.x * e.x, this.y = t.y * e.y, this.z = t.z * e.z, this
    }, t.prototype.smul = function(t) {
        return this.x *= t, this.y *= t, this.z *= t, this
    }, t.prototype.div = function(t) {
        var e = t.x,
            i = t.y,
            o = t.z;
        return t.w, this.x *= 0 !== e ? 1 / e : 0, this.y *= 0 !== i ? 1 / i : 0, this.z *= 0 !== o ? 1 / o : 0, this
    }, t.prototype.vdiv = function(t, e) {
        var i = e.x,
            o = e.y,
            r = e.z;
        return this.x = 0 !== i ? t.x / i : 0, this.y = 0 !== o ? t.y / o : 0, this.z = 0 !== r ? t.z / r : 0, this
    }, t.prototype.sdiv = function(t) {
        return t = 0 === t ? 0 : 1 / t, this.x *= t, this.y *= t, this.z *= t, this
    }, t.prototype.length = function() {
        var t = this.x,
            i = this.y,
            o = this.z,
            r = t * t + i * i + o * o;
        return 1 === r ? 1 : 0 === r ? 0 : e(r)
    }, t.prototype.lengthSq = function() {
        var t = this.x,
            e = this.y,
            i = this.z;
        return t * t + e * e + i * i
    }, t.prototype.setLength = function(t) {
        var i = this.x,
            o = this.y,
            r = this.z,
            n = i * i + o * o + r * r;
        return 1 === n ? (this.x *= t, this.y *= t, this.z *= t, this) : (n = n > 0 ? 1 / e(n) : 0, this.x *= n * t, this.y *= n * t, this.z *= n * t, this)
    }, t.prototype.normalize = function() {
        var t = this.x,
            i = this.y,
            o = this.z,
            r = t * t + i * i + o * o;
        return 1 === r ? this : (r = r > 0 ? 1 / e(r) : 0, this.x *= r, this.y *= r, this.z *= r, this)
    }, t.prototype.inverse = function() {
        return this.x *= -1, this.y *= -1, this.z *= -1, this
    }, t.prototype.inverseVec = function(t) {
        return this.x = -t.x, this.y = -t.y, this.z = -t.z, this
    }, t.prototype.lerp = function(t, e) {
        return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this
    }, t.prototype.vlerp = function(t, e, i) {
        var o = t.x,
            r = t.y,
            n = t.z;
        return this.x = o + (e.x - o) * i, this.y = r + (e.y - r) * i, this.z = n + (e.z - n) * i, this
    }, t.vdot = t.prototype.vdot = function(t, e) {
        return t.x * e.x + t.y * e.y + t.z * e.z
    }, t.prototype.dot = function(t) {
        return this.x * t.x + this.y * t.y + this.z * t.z
    }, t.vcross = t.prototype.vcross = function(t, e) {
        var i = t.x,
            o = t.y,
            r = t.z,
            n = e.x,
            s = e.y,
            h = e.z;
        return this.x = o * h - r * s, this.y = r * n - i * h, this.z = i * s - o * n, this
    }, t.prototype.cross = function(t) {
        var e = this.x,
            i = this.y,
            o = this.z,
            r = t.x,
            n = t.y,
            s = t.z;
        return this.x = i * s - o * n, this.y = o * r - e * s, this.z = e * n - i * r, this
    }, t.prototype.min = function(t) {
        var e = this.x,
            i = this.y,
            o = this.z,
            r = t.x,
            n = t.y,
            s = t.z;
        return this.x = e > r ? r : e, this.y = i > n ? n : i, this.z = o > s ? s : o, this
    }, t.prototype.max = function(t) {
        var e = this.x,
            i = this.y,
            o = this.z,
            r = t.x,
            n = t.y,
            s = t.z;
        return this.x = r > e ? r : e, this.y = n > i ? n : i, this.z = s > o ? s : o, this
    }, t.prototype.clamp = function(t, e) {
        var i = this.x,
            o = this.y,
            r = this.z,
            n = t.x,
            s = t.y,
            h = t.z,
            a = e.x,
            p = e.y,
            c = e.z;
        return this.x = n > i ? n : i > a ? a : i, this.y = s > o ? s : o > p ? p : o, this.z = h > r ? h : r > c ? c : r, this
    }, t.prototype.transformMat3 = function(t) {
        var e = t.elements,
            i = this.x,
            o = this.y,
            r = this.z;
        return this.x = i * e[0] + o * e[3] + r * e[6], this.y = i * e[1] + o * e[4] + r * e[7], this.z = i * e[2] + o * e[5] + r * e[8], this
    }, t.prototype.transformMat4 = function(t) {
        var e = t.elements,
            i = this.x,
            o = this.y,
            r = this.z;
        return this.x = i * e[0] + o * e[4] + r * e[8] + e[12], this.y = i * e[1] + o * e[5] + r * e[9] + e[13], this.z = i * e[2] + o * e[6] + r * e[10] + e[14], this
    }, t.prototype.transformQuat = function(t) {
        var e = this.x,
            i = this.y,
            o = this.z,
            r = t.x,
            n = t.y,
            s = t.z,
            h = t.w,
            a = h * e + n * o - s * i,
            p = h * i + s * e - r * o,
            c = h * o + r * i - n * e,
            u = -r * e - n * i - s * o;
        return this.x = a * h + u * -r + p * -s - c * -n, this.y = p * h + u * -n + c * -r - a * -s, this.z = c * h + u * -s + a * -n - p * -r, this
    }, t.prototype.fromVec2 = function(t) {
        return this.x = t.x, this.y = t.y, this.z = 0, this
    }, t.prototype.fromVec4 = function(t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this
    }, t.prototype.positionFromMat4 = function(t) {
        var e = t.elements;
        return this.x = e[12], this.y = e[13], this.z = e[14], this
    }, t.prototype.scaleFromMat3 = function(t) {
        var e = t.elements,
            i = this.set(e[0], e[3], e[6]).length(),
            o = this.set(e[1], e[4], e[7]).length(),
            r = this.set(e[2], e[5], e[8]).length();
        return this.x = i, this.y = o, this.z = r, this
    }, t.prototype.scaleFromMat4 = function(t) {
        var e = t.elements,
            i = this.set(e[0], e[4], e[8]).length(),
            o = this.set(e[1], e[5], e[9]).length(),
            r = this.set(e[2], e[6], e[10]).length();
        return this.x = i, this.y = o, this.z = r, this
    }, t.prototype.fromJSON = function(t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this
    }, t.prototype.toJSON = function(t) {
        return t || (t = {}), t.x = this.x, t.y = this.y, t.z = this.z, t
    }, t.prototype.toString = function() {
        return "Vec3( " + this.x + ", " + this.y + ", " + this.z + " )"
    }, t
}), define("math/mat4", ["math/mathf", "math/vec3"], function(t, e) {
    function i(t, e, i, o, r, n, s, h, a, p, c, u, m, f, l, d) {
        var y = new Float32Array(16);
        this.elements = y, y[0] = void 0 !== t ? t : 1, y[4] = e || 0, y[8] = i || 0, y[12] = o || 0, y[1] = r || 0, y[5] = void 0 !== n ? n : 1, y[9] = s || 0, y[13] = h || 0, y[2] = a || 0, y[6] = p || 0, y[10] = void 0 !== c ? c : 1, y[14] = u || 0, y[3] = m || 0, y[7] = f || 0, y[11] = l || 0, y[15] = void 0 !== d ? d : 1
    }
    var o = Math.sqrt,
        r = Math.cos,
        n = Math.sin,
        s = Math.tan,
        h = t.degsToRads;
    return i.prototype.clone = function() {
        var t = this.elements;
        return new i(t[0], t[4], t[8], t[12], t[1], t[5], t[9], t[13], t[2], t[6], t[10], t[14], t[3], t[7], t[11], t[15])
    }, i.prototype.copy = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[2], e[3] = i[3], e[4] = i[4], e[5] = i[5], e[6] = i[6], e[7] = i[7], e[8] = i[8], e[9] = i[9], e[10] = i[10], e[11] = i[11], e[12] = i[12], e[13] = i[13], e[14] = i[14], e[15] = i[15], this
    }, i.prototype.set = function(t, e, i, o, r, n, s, h, a, p, c, u, m, f, l, d) {
        var y = this.elements;
        return y[0] = t, y[4] = e, y[8] = i, y[12] = o, y[1] = r, y[5] = n, y[9] = s, y[13] = h, y[2] = a, y[6] = p, y[10] = c, y[14] = u, y[3] = m, y[7] = f, y[11] = l, y[15] = d, this
    }, i.prototype.mul = function(t) {
        var e = this.elements,
            i = t.elements,
            o = e[0],
            r = e[4],
            n = e[8],
            s = e[12],
            h = e[1],
            a = e[5],
            p = e[9],
            c = e[13],
            u = e[2],
            m = e[6],
            f = e[10],
            l = e[14],
            d = e[3],
            y = e[7],
            v = e[11],
            g = e[15],
            x = i[0],
            w = i[4],
            b = i[8],
            S = i[12],
            _ = i[1],
            O = i[5],
            z = i[9],
            N = i[13],
            C = i[2],
            A = i[6],
            E = i[10],
            T = i[14],
            J = i[3],
            R = i[7],
            M = i[11],
            j = i[15];
        return e[0] = o * x + r * _ + n * C + s * J, e[4] = o * w + r * O + n * A + s * R, e[8] = o * b + r * z + n * E + s * M, e[12] = o * S + r * N + n * T + s * j, e[1] = h * x + a * _ + p * C + c * J, e[5] = h * w + a * O + p * A + c * R, e[9] = h * b + a * z + p * E + c * M, e[13] = h * S + a * N + p * T + c * j, e[2] = u * x + m * _ + f * C + l * J, e[6] = u * w + m * O + f * A + l * R, e[10] = u * b + m * z + f * E + l * M, e[14] = u * S + m * N + f * T + l * j, e[3] = d * x + y * _ + v * C + g * J, e[7] = d * w + y * O + v * A + g * R, e[11] = d * b + y * z + v * E + g * M, e[15] = d * S + y * N + v * T + g * j, this
    }, i.prototype.mmul = function(t, e) {
        var i = this.elements,
            o = t.elements,
            r = e.elements,
            n = o[0],
            s = o[4],
            h = o[8],
            a = o[12],
            p = o[1],
            c = o[5],
            u = o[9],
            m = o[13],
            f = o[2],
            l = o[6],
            d = o[10],
            y = o[14],
            v = o[3],
            g = o[7],
            x = o[11],
            w = o[15],
            b = r[0],
            S = r[4],
            _ = r[8],
            O = r[12],
            z = r[1],
            N = r[5],
            C = r[9],
            A = r[13],
            E = r[2],
            T = r[6],
            J = r[10],
            R = r[14],
            M = r[3],
            j = r[7],
            B = r[11],
            k = r[15];
        return i[0] = n * b + s * z + h * E + a * M, i[4] = n * S + s * N + h * T + a * j, i[8] = n * _ + s * C + h * J + a * B, i[12] = n * O + s * A + h * R + a * k, i[1] = p * b + c * z + u * E + m * M, i[5] = p * S + c * N + u * T + m * j, i[9] = p * _ + c * C + u * J + m * B, i[13] = p * O + c * A + u * R + m * k, i[2] = f * b + l * z + d * E + y * M, i[6] = f * S + l * N + d * T + y * j, i[10] = f * _ + l * C + d * J + y * B, i[14] = f * O + l * A + d * R + y * k, i[3] = v * b + g * z + x * E + w * M, i[7] = v * S + g * N + x * T + w * j, i[11] = v * _ + g * C + x * J + w * B, i[15] = v * O + g * A + x * R + w * k, this
    }, i.prototype.smul = function(t) {
        var e = this.elements;
        return e[0] *= t, e[1] *= t, e[2] *= t, e[3] *= t, e[4] *= t, e[5] *= t, e[6] *= t, e[7] *= t, e[8] *= t, e[9] *= t, e[10] *= t, e[11] *= t, e[12] *= t, e[13] *= t, e[14] *= t, e[15] *= t, this
    }, i.prototype.sdiv = function(t) {
        var e = this.elements;
        return t = 0 !== t ? 1 / t : 1, e[0] *= t, e[1] *= t, e[2] *= t, e[3] *= t, e[4] *= t, e[5] *= t, e[6] *= t, e[7] *= t, e[8] *= t, e[9] *= t, e[10] *= t, e[11] *= t, e[12] *= t, e[13] *= t, e[14] *= t, e[15] *= t, this
    }, i.prototype.identity = function() {
        var t = this.elements;
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this
    }, i.prototype.zero = function() {
        var t = this.elements;
        return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 0, this
    }, i.prototype.determinant = function() {
        var t = (this.elements, ae[0]),
            e = ae[4],
            i = ae[8],
            o = ae[12],
            r = ae[1],
            n = ae[5],
            s = ae[9],
            h = ae[13],
            a = ae[2],
            p = ae[6],
            c = ae[10],
            u = ae[14],
            m = ae[3],
            f = ae[7],
            l = ae[11],
            d = ae[15];
        return m * (o * s * p - i * h * p - o * n * c + e * h * c + i * n * u - e * s * u) + f * (t * s * u - t * h * c + o * r * c - i * r * u + i * h * a - o * s * a) + l * (t * h * p - t * n * u - o * r * p + e * r * u + o * n * a - e * h * a) + d * (-i * n * a - t * s * p + t * n * c + i * r * p - e * r * c + e * s * a)
    }, i.prototype.inverse = function() {
        var t = this.elements,
            e = t[0],
            i = t[4],
            o = t[8],
            r = t[12],
            n = t[1],
            s = t[5],
            h = t[9],
            a = t[13],
            p = t[2],
            c = t[6],
            u = t[10],
            m = t[14],
            f = t[3],
            l = t[7],
            d = t[11],
            y = t[15],
            v = h * m * l - a * u * l + a * c * d - s * m * d - h * c * y + s * u * y,
            g = r * u * l - o * m * l - r * c * d + i * m * d + o * c * y - i * u * y,
            x = o * a * l - r * h * l + r * s * d - i * a * d - o * s * y + i * h * y,
            i = r * h * c - o * a * c - r * s * u + i * a * u + o * s * m - i * h * m,
            w = e * v + n * g + p * x + f * i;
        return w = 0 === w ? 0 : 1 / w, t[0] = v * w, t[4] = g * w, t[8] = x * w, t[12] = i * w, t[1] = (a * u * f - h * m * f - a * p * d + n * m * d + h * p * y - n * u * y) * w, t[5] = (o * m * f - r * u * f + r * p * d - e * m * d - o * p * y + e * u * y) * w, t[9] = (r * h * f - o * a * f - r * n * d + e * a * d + o * n * y - e * h * y) * w, t[13] = (o * a * p - r * h * p + r * n * u - e * a * u - o * n * m + e * h * m) * w, t[2] = (s * m * f - a * c * f + a * p * l - n * m * l - s * p * y + n * c * y) * w, t[6] = (r * c * f - i * m * f - r * p * l + e * m * l + i * p * y - e * c * y) * w, t[10] = (i * a * f - r * s * f + r * n * l - e * a * l - i * n * y + e * s * y) * w, t[14] = (r * s * p - i * a * p - r * n * c + e * a * c + i * n * m - e * s * m) * w, t[3] = (h * c * f - s * u * f - h * p * l + n * u * l + s * p * d - n * c * d) * w, t[7] = (i * u * f - o * c * f + o * p * l - e * u * l - i * p * d + e * c * d) * w, t[11] = (o * s * f - i * h * f - o * n * l + e * h * l + i * n * d - e * s * d) * w, t[15] = (i * h * p - o * s * p + o * n * c - e * h * c - i * n * u + e * s * u) * w, this
    }, i.prototype.inverseMat = function(t) {
        var e = this.elements,
            i = t.elements,
            o = i[0],
            r = i[4],
            n = i[8],
            s = i[12],
            h = i[1],
            a = i[5],
            p = i[9],
            c = i[13],
            u = i[2],
            m = i[6],
            f = i[10],
            l = i[14],
            d = i[3],
            y = i[7],
            v = i[11],
            g = i[15],
            x = p * l * y - c * f * y + c * m * v - a * l * v - p * m * g + a * f * g,
            w = s * f * y - n * l * y - s * m * v + r * l * v + n * m * g - r * f * g,
            b = n * c * y - s * p * y + s * a * v - r * c * v - n * a * g + r * p * g,
            r = s * p * m - n * c * m - s * a * f + r * c * f + n * a * l - r * p * l,
            S = o * x + h * w + u * b + d * r;
        return S = 0 === S ? 0 : 1 / S, e[0] = x * S, e[4] = w * S, e[8] = b * S, e[12] = r * S, e[1] = (c * f * d - p * l * d - c * u * v + h * l * v + p * u * g - h * f * g) * S, e[5] = (n * l * d - s * f * d + s * u * v - o * l * v - n * u * g + o * f * g) * S, e[9] = (s * p * d - n * c * d - s * h * v + o * c * v + n * h * g - o * p * g) * S, e[13] = (n * c * u - s * p * u + s * h * f - o * c * f - n * h * l + o * p * l) * S, e[2] = (a * l * d - c * m * d + c * u * y - h * l * y - a * u * g + h * m * g) * S, e[6] = (s * m * d - r * l * d - s * u * y + o * l * y + r * u * g - o * m * g) * S, e[10] = (r * c * d - s * a * d + s * h * y - o * c * y - r * h * g + o * a * g) * S, e[14] = (s * a * u - r * c * u - s * h * m + o * c * m + r * h * l - o * a * l) * S, e[3] = (p * m * d - a * f * d - p * u * y + h * f * y + a * u * v - h * m * v) * S, e[7] = (r * f * d - n * m * d + n * u * y - o * f * y - r * u * v + o * m * v) * S, e[11] = (n * a * d - r * p * d - n * h * y + o * p * y + r * h * v - o * a * v) * S, e[15] = (r * p * u - n * a * u + n * h * m - o * p * m - r * h * f + o * a * f) * S, this
    }, i.prototype.transpose = function() {
        var t, e = this.elements;
        return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this
    }, i.prototype.setTrace = function(t) {
        var e = this.elements,
            i = t.w;
        return e[0] = t.x, e[5] = t.y, e[10] = t.z, e[15] = void 0 !== i ? i : 1, this
    }, i.prototype.lookAt = function() {
        var t = new e(0, 0, 1),
            i = new e,
            o = new e,
            r = new e;
        return function(e, n, s) {
            var h = this.elements;
            return s = s || t, r.vsub(n, e).normalize(), i.vcross(s, r).normalize(), o.vcross(r, i), h[0] = i.x, h[4] = o.x, h[8] = r.x, h[1] = i.y, h[5] = o.y, h[9] = r.y, h[2] = i.z, h[6] = o.z, h[10] = r.z, this
        }
    }(), i.prototype.compose = function(t, e, i) {
        var o = this.elements,
            r = i.x,
            n = i.y,
            s = i.z,
            h = i.w,
            a = r + r,
            p = n + n,
            c = s + s,
            u = r * a,
            m = r * p,
            f = r * c,
            l = n * p,
            d = n * c,
            y = s * c,
            v = h * a,
            g = h * p,
            x = h * c,
            w = e.x,
            b = e.y,
            S = e.z;
        return o[0] = (1 - (l + y)) * w, o[4] = (m - x) * b, o[8] = (f + g) * S, o[1] = (m + x) * w, o[5] = (1 - (u + y)) * b, o[9] = (d - v) * S, o[2] = (f - g) * w, o[6] = (d + v) * b, o[10] = (1 - (u + l)) * S, o[3] = 0, o[7] = 0, o[11] = 0, o[12] = t.x, o[13] = t.y, o[14] = t.z, o[15] = 1, this
    }, i.prototype.decompose = function(t, e, i) {
        var r, n, s = this.elements,
            h = s[0],
            a = s[4],
            p = s[8],
            c = s[1],
            u = s[5],
            m = s[9],
            f = s[2],
            l = s[6],
            d = s[10],
            y = 0,
            v = 0,
            g = 0,
            x = 1,
            w = e.set(h, c, f).length(),
            b = e.set(a, u, l).length(),
            S = e.set(p, m, d).length(),
            _ = 1 / w,
            O = 1 / b,
            z = 1 / S;
        return e.x = w, e.y = b, e.z = S, t.x = s[12], t.y = s[13], t.z = s[14], h *= _, a *= O, p *= z, c *= _, u *= O, m *= z, f *= _, l *= O, d *= z, r = h + u + d, r > 0 ? (n = .5 / o(r + 1), x = .25 / n, y = (l - m) * n, v = (p - f) * n, g = (c - a) * n) : h > u && h > d ? (n = 2 * o(1 + h - u - d), x = (l - m) / n, y = .25 * n, v = (a + c) / n, g = (p + f) / n) : u > d ? (n = 2 * o(1 + u - h - d), x = (p - f) / n, y = (a + c) / n, v = .25 * n, g = (m + l) / n) : (n = 2 * o(1 + d - h - u), x = (c - a) / n, y = (p + f) / n, v = (m + l) / n, g = .25 * n), i.x = y, i.y = v, i.w = x, i.z = g, this
    }, i.prototype.setPosition = function(t) {
        var e = this.elements,
            i = t.z;
        return e[12] = t.x, e[13] = t.y, e[14] = void 0 !== i ? i : 0, this
    }, i.prototype.extractPosition = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[12] = i[12], e[13] = i[13], e[14] = i[14], this
    }, i.prototype.extractRotation = function() {
        var t = new e;
        return function(e) {
            var i = this.elements,
                r = e.elements,
                n = t.set(r[0], r[1], r[2]).lengthSq(),
                s = t.set(r[4], r[5], r[6]).lengthSq(),
                h = t.set(r[8], r[9], r[10]).lengthSq(),
                a = n > 0 ? 1 / o(n) : 0,
                p = s > 0 ? 1 / o(s) : 0,
                c = h > 0 ? 1 / o(h) : 0;
            return i[0] = r[0] * a, i[1] = r[1] * a, i[2] = r[2] * a, i[4] = r[4] * p, i[5] = r[5] * p, i[6] = r[6] * p, i[8] = r[8] * c, i[9] = r[9] * c, i[10] = r[10] * c, this
        }
    }(), i.prototype.extractRotationScale = function() {
        return new e,
        function(t) {
            var e = this.elements,
                i = t.elements;
            return e[0] = i[0], e[1] = i[1], e[2] = i[2], e[4] = i[4], e[5] = i[5], e[6] = i[6], e[8] = i[8], e[9] = i[9], e[10] = i[10], this
        }
    }(), i.prototype.translate = function(t) {
        var e = this.elements,
            i = t.x,
            o = t.y,
            r = t.z || 0;
        return e[12] = e[0] * i + e[4] * o + e[8] * r + e[12], e[13] = e[1] * i + e[5] * o + e[9] * r + e[13], e[14] = e[2] * i + e[6] * o + e[10] * r + e[14], e[15] = e[3] * i + e[7] * o + e[11] * r + e[15], this
    }, i.prototype.scale = function(t) {
        var e = this.elements,
            i = t.x,
            o = t.y,
            r = t.z;
        return e[0] *= i, e[4] *= o, e[8] *= r, e[1] *= i, e[5] *= o, e[9] *= r, e[2] *= i, e[6] *= o, e[10] *= r, e[3] *= i, e[7] *= o, e[11] *= r, this
    }, i.prototype.rotateX = function(t) {
        var e = this.elements,
            i = e[4],
            o = e[5],
            s = e[6],
            h = e[7],
            a = e[8],
            p = e[9],
            c = e[10],
            u = e[11],
            m = r(t),
            f = n(t);
        return e[4] = m * i + f * a, e[5] = m * o + f * p, e[6] = m * s + f * c, e[7] = m * h + f * u, e[8] = m * a - f * i, e[9] = m * p - f * o, e[10] = m * c - f * s, e[11] = m * u - f * h, this
    }, i.prototype.rotateY = function(t) {
        var e = this.elements,
            i = e[0],
            o = e[1],
            s = e[2],
            h = e[3],
            a = e[8],
            p = e[9],
            c = e[10],
            u = e[11],
            m = r(t),
            f = n(t);
        return e[0] = m * i - f * a, e[1] = m * o - f * p, e[2] = m * s - f * c, e[3] = m * h - f * u, e[8] = m * a + f * i, e[9] = m * p + f * o, e[10] = m * c + f * s, e[11] = m * u + f * h, this
    }, i.prototype.rotateZ = function(t) {
        var e = this.elements,
            i = e[0],
            o = e[1],
            s = e[2],
            h = e[3],
            a = e[4],
            p = e[5],
            c = e[6],
            u = e[7],
            m = r(t),
            f = n(t);
        return e[0] = m * i + f * a, e[1] = m * o + f * p, e[2] = m * s + f * c, e[3] = m * h + f * u, e[4] = m * a - f * i, e[5] = m * p - f * o, e[6] = m * c - f * s, e[7] = m * u - f * h, this
    }, i.prototype.makeTranslation = function(t, e, i) {
        return this.set(1, 0, 0, t, 0, 1, 0, e, 0, 0, 1, i, 0, 0, 0, 1)
    }, i.prototype.makeScale = function(t, e, i) {
        return this.set(t, 0, 0, 0, 0, e, 0, 0, 0, 0, i, 0, 0, 0, 0, 1)
    }, i.prototype.makeRotationX = function(t) {
        var e = r(t),
            i = n(t);
        return this.set(1, 0, 0, 0, 0, e, -i, 0, 0, i, e, 0, 0, 0, 0, 1)
    }, i.prototype.makeRotationY = function(t) {
        var e = r(t),
            i = n(t);
        return this.set(e, 0, i, 0, 0, 1, 0, 0, -i, 0, e, 0, 0, 0, 0, 1)
    }, i.prototype.makeRotationZ = function(t) {
        var e = r(t),
            i = n(t);
        return this.set(e, -i, 0, 0, i, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }, i.prototype.frustum = function(t, e, i, o, r, n) {
        var s = this.elements,
            h = 1 / (e - t),
            a = 1 / (o - i),
            p = 1 / (r - n);
        return s[0] = 2 * r * h, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = 2 * r * a, s[6] = 0, s[7] = 0, s[8] = (e + t) * h, s[9] = (o + i) * a, s[10] = (n + r) * p, s[11] = -1, s[12] = 0, s[13] = 0, s[14] = 2 * n * r * p, s[15] = 0, this
    }, i.prototype.perspective = function(t, e, i, o) {
        var r = this.elements,
            n = 1 / s(h(.5 * t)),
            a = 1 / (i - o);
        return r[0] = n / e, r[1] = 0, r[2] = 0, r[3] = 0, r[4] = 0, r[5] = n, r[6] = 0, r[7] = 0, r[8] = 0, r[9] = 0, r[10] = (o + i) * a, r[11] = -1, r[12] = 0, r[13] = 0, r[14] = 2 * o * i * a, r[15] = 0, this
    }, i.prototype.orthographic = function(t, e, i, o, r, n) {
        var s = this.elements,
            h = 1 / (t - e),
            a = 1 / (i - o),
            p = 1 / (r - n);
        return s[0] = -2 * h, s[1] = 0, s[2] = 0, s[3] = 0, s[4] = 0, s[5] = -2 * a, s[6] = 0, s[7] = 0, s[8] = 0, s[9] = 0, s[10] = 2 * p, s[11] = 0, s[12] = (t + e) * h, s[13] = (o + i) * a, s[14] = (n + r) * p, s[15] = 1, this
    }, i.prototype.fromMat2 = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = 0, e[3] = 0, e[4] = i[2], e[5] = i[3], e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this
    }, i.prototype.fromMat32 = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = 0, e[3] = 0, e[4] = i[2], e[5] = i[3], e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = i[4], e[13] = i[5], e[14] = 0, e[15] = 1, this
    }, i.prototype.fromMat3 = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[2], e[3] = 0, e[4] = i[3], e[5] = i[4], e[6] = i[5], e[7] = 0, e[8] = i[6], e[9] = i[7], e[10] = i[8], e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this
    }, i.prototype.fromQuat = function(t) {
        var e = this.elements,
            i = t.x,
            o = t.y,
            r = t.z,
            n = t.w,
            s = i + i,
            h = o + o,
            a = r + r,
            p = i * s,
            c = i * h,
            u = i * a,
            m = o * h,
            f = o * a,
            l = r * a,
            d = n * s,
            y = n * h,
            v = n * a;
        return e[0] = 1 - (m + l), e[4] = c - v, e[8] = u + y, e[1] = c + v, e[5] = 1 - (p + l), e[9] = f - d, e[2] = u - y, e[6] = f + d, e[10] = 1 - (p + m), e[3] = 0, e[7] = 0, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this
    }, i.prototype.fromJSON = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[2], e[3] = i[3], e[4] = i[4], e[5] = i[5], e[6] = i[6], e[7] = i[7], e[8] = i[8], e[9] = i[9], e[10] = i[10], e[11] = i[11], e[12] = i[12], e[13] = i[13], e[14] = i[14], e[15] = i[15], this
    }, i.prototype.toJSON = function() {
        json || (json = {});
        var t = this.elements,
            e = json.elements || (json.elements = []);
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], json
    }, i.prototype.toString = function() {
        var t = this.elements;
        return "Mat4[" + t[0] + ", " + t[4] + ", " + t[8] + ", " + t[12] + "]\n" + "     [" + t[1] + ", " + t[5] + ", " + t[9] + ", " + t[13] + "]\n" + "     [" + t[2] + ", " + t[6] + ", " + t[10] + ", " + t[14] + "]\n" + "     [" + t[3] + ", " + t[7] + ", " + t[11] + ", " + t[15] + "]"
    }, i
}), define("core/components/camera", ["base/class", "math/mathf", "math/color", "math/vec3", "math/mat4", "core/components/component"], function(t, e, i, o, r, n) {
    function s(t) {
        t || (t = {}), n.call(this, "Camera", t.sync, t.json), this.backgroundColor = void 0 !== t.backgroundColor ? t.backgroundColor : new i(.5, .5, .5), this.width = 960, this.height = 640, this.aspect = this.width / this.height, this.fov = void 0 !== t.fov ? t.fov : 35, this.near = void 0 !== t.near ? t.near : .1, this.far = void 0 !== t.far ? t.far : 512, this.orthographic = void 0 !== t.orthographic ? !! t.orthographic : !1, this.orthographicSize = void 0 !== t.orthographicSize ? t.orthographicSize : 2, this.minOrthographicSize = void 0 !== t.minOrthographicSize ? t.minOrthographicSize : .01, this.maxOrthographicSize = void 0 !== t.maxOrthographicSize ? t.maxOrthographicSize : 1024, this.projection = new r, this.view = new r, this._needsUpdate = !0, this._active = !1
    }
    var h = e.degsToRads;
    s.type = "Camera", t.extend(s, n), s.prototype.copy = function(t) {
        return this.backgroundColor.copy(t.backgroundColor), this.width = t.width, this.height = t.height, this.aspect = t.aspect, this.far = t.far, this.near = t.near, this.fov = t.fov, this.orthographic = t.orthographic, this.orthographicSize = t.orthographicSize, this.minOrthographicSize = t.minOrthographicSize, this.maxOrthographicSize = t.maxOrthographicSize, this._needsUpdate = !0, this
    }, s.prototype.set = function(t, e) {
        this.width = t, this.height = e, this.aspect = t / e, this._needsUpdate = !0
    }, s.prototype.setWidth = function(t) {
        this.width = t, this.aspect = t / this.height, this._needsUpdate = !0
    }, s.prototype.setHeight = function(t) {
        this.height = t, this.aspect = this.width / t, this._needsUpdate = !0
    }, s.prototype.setFov = function(t) {
        this.fov = t, this._needsUpdate = !0
    }, s.prototype.setNear = function(t) {
        this.near = t, this._needsUpdate = !0
    }, s.prototype.setFar = function(t) {
        this.far = t, this._needsUpdate = !0
    }, s.prototype.setOrthographic = function(t) {
        this.orthographic = !! t, this._needsUpdate = !0
    }, s.prototype.toggleOrthographic = function() {
        this.orthographic = !this.orthographic, this._needsUpdate = !0
    }, s.prototype.setOrthographicSize = function(t) {
        this.orthographicSize = clamp(t, this.minOrthographicSize, this.maxOrthographicSize), this._needsUpdate = !0
    };
    var a = new r,
        p = new o;
    return s.prototype.toWorld = function(t, e) {
        return e || (e = new o), e.x = 2 * t.x / this.width - 1, e.y = -2 * t.y / this.height + 1, e.transformMat4(a.mmul(this.projection, this.view).inverse()), e.z = this.near, e
    }, s.prototype.toScreen = function(t, e) {
        return e || (e = new Vec2), p.copy(t), p.transformMat4(a.mmul(this.projection, this.view)), e.x = .5 * (p.x + 1) * this.width, e.y = .5 * (1 - p.y) * this.height, t
    }, s.prototype.update = function() {
        if (this._active) {
            if (this._needsUpdate) {
                if (this.orthographic) {
                    this.orthographicSize = clamp(this.orthographicSize, this.minOrthographicSize, this.maxOrthographicSize);
                    var t = this.orthographicSize,
                        e = t * this.aspect,
                        i = -e,
                        o = t,
                        r = -o;
                    this.projection.orthographic(i, e, r, o, this.near, this.far)
                } else this.projection.perspective(h(this.fov), this.aspect, this.near, this.far);
                this._needsUpdate = !1
            }
            this.view.inverseMat(this.transform.matrixWorld)
        }
    }, s.prototype.sort = function(t, e) {
        return t._active ? -1 : e._active ? 1 : -1
    }, s.prototype.toSYNC = function(t) {
        return t = n.prototype.toSYNC.call(this, t), t.backgroundColor = this.backgroundColor.toJSON(t.backgroundColor), t.width = this.width, t.height = this.height, t.aspect = this.aspect, t.far = this.far, t.near = this.near, t.fov = this.fov, t.orthographic = this.orthographic, t.orthographicSize = this.orthographicSize, t.minOrthographicSize = this.minOrthographicSize, t.maxOrthographicSize = this.maxOrthographicSize, t
    }, s.prototype.fromSYNC = function(t) {
        return n.prototype.fromSYNC.call(this, t), (t.width !== this.width || t.height !== this.height) && (this._needsUpdate = !0), this.backgroundColor.fromJSON(t.backgroundColor), this.width = t.width, this.height = t.height, this.aspect = t.aspect, this.far = t.far, this.near = t.near, this.fov = t.fov, this.orthographic = t.orthographic, this.orthographicSize = t.orthographicSize, this.minOrthographicSize = t.minOrthographicSize, this.maxOrthographicSize = t.maxOrthographicSize, this
    }, s.prototype.toJSON = function(t) {
        return t || (t = {}), n.prototype.toJSON.call(this, t), t.backgroundColor = this.backgroundColor.toJSON(t.backgroundColor), t.width = this.width, t.height = this.height, t.aspect = this.aspect, t.far = this.far, t.near = this.near, t.fov = this.fov, t.orthographic = this.orthographic, t.orthographicSize = this.orthographicSize, t.minOrthographicSize = this.minOrthographicSize, t.maxOrthographicSize = this.maxOrthographicSize, t
    }, s.prototype.fromJSON = function(t) {
        return n.prototype.fromJSON.call(this, t), this.backgroundColor.fromJSON(t.backgroundColor), this.width = t.width, this.height = t.height, this.aspect = t.aspect, this.far = t.far, this.near = t.near, this.fov = t.fov, this.orthographic = t.orthographic, this.orthographicSize = t.orthographicSize, this.minOrthographicSize = t.minOrthographicSize, this.maxOrthographicSize = t.maxOrthographicSize, this._needsUpdate = !0, this
    }, s
}), define("math/mat32", [], function() {
    function t(t, e, i, o, r, n) {
        var s = new Float32Array(6);
        this.elements = s, s[0] = void 0 !== t ? t : 1, s[2] = e || 0, s[4] = i || 0, s[1] = o || 0, s[3] = void 0 !== r ? r : 1, s[5] = n || 0
    }
    var e = Math.sqrt,
        i = Math.cos,
        o = Math.sin,
        r = Math.atan2;
    return t.prototype.clone = function() {
        var e = this.elements;
        return new t(e[0], e[1], e[2], e[3], e[4], e[5])
    }, t.prototype.copy = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[2], e[3] = i[3], e[4] = i[4], e[5] = i[5], this
    }, t.prototype.set = function(t, e, i, o, r, n) {
        var s = this.elements;
        return s[0] = t, s[2] = e, s[4] = i, s[1] = o, s[3] = r, s[5] = n, this
    }, t.prototype.mul = function(t) {
        var e = this.elements,
            i = t.elements,
            o = e[0],
            r = e[2],
            n = e[4],
            s = e[1],
            h = e[3],
            a = e[5],
            p = i[0],
            c = i[2],
            u = i[4],
            m = i[1],
            f = i[3],
            l = i[5];
        return e[0] = o * p + s * c, e[2] = r * p + h * c, e[1] = o * m + s * f, e[3] = r * m + h * f, e[4] = o * u + r * l + n, e[5] = s * u + h * l + a, this
    }, t.prototype.mmul = function(t, e) {
        var i = this.elements,
            o = t.elements,
            r = e.elements,
            n = o[0],
            s = o[2],
            h = o[4],
            a = o[1],
            p = o[3],
            c = o[5],
            u = r[0],
            m = r[2],
            f = r[4],
            l = r[1],
            d = r[3],
            y = r[5];
        return i[0] = n * u + a * m, i[2] = s * u + p * m, i[1] = n * l + a * d, i[3] = s * l + p * d, i[4] = n * f + s * y + h, i[5] = a * f + p * y + c, this
    }, t.prototype.smul = function(t) {
        var e = this.elements;
        return e[0] *= t, e[1] *= t, e[2] *= t, e[3] *= t, e[4] *= t, e[5] *= t, this
    }, t.prototype.sdiv = function(t) {
        var e = this.elements;
        return t = 0 !== t ? 1 / t : 1, e[0] *= t, e[1] *= t, e[2] *= t, e[3] *= t, e[4] *= t, e[5] *= t, this
    }, t.prototype.identity = function() {
        var t = this.elements;
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, this
    }, t.prototype.zero = function() {
        var t = this.elements;
        return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 0, this
    }, t.prototype.determinant = function() {
        var t = this.elements;
        return t[0] * t[3] - t[2] * t[1]
    }, t.prototype.inverse = function() {
        var t = this.elements,
            e = t[0],
            i = t[2],
            o = t[4],
            r = t[1],
            n = t[3],
            s = t[5],
            h = e * n - i * r;
        return h = 0 !== h ? 1 / h : 0, t[0] = n * h, t[1] = -i * h, t[2] = -r * h, t[3] = e * h, t[4] = (i * s - n * o) * h, t[5] = (r * o - e * s) * h, this
    }, t.prototype.inverseMat = function(t) {
        var e = this.elements,
            i = t.elements,
            o = i[0],
            r = i[2],
            n = i[4],
            s = i[1],
            h = i[3],
            a = i[5],
            p = o * h - r * s;
        return p = 0 !== p ? 1 / p : 0, e[0] = h * p, e[1] = -r * p, e[2] = -s * p, e[3] = o * p, e[4] = (r * a - h * n) * p, e[5] = (s * n - o * a) * p, this
    }, t.prototype.transpose = function() {
        var t, e = this.elements;
        return t = e[1], e[1] = e[2], e[2] = t, this
    }, t.prototype.setTrace = function(t, e) {
        var i = this.elements;
        return i[0] = t, i[3] = e, this
    }, t.prototype.lookAt = function(t, e) {
        var n = this.elements,
            s = e.x - t.x,
            h = e.y - t.y,
            a = r(h, s) - HALF_PI,
            p = i(a),
            c = o(a);
        return n[0] = p, n[1] = c, n[2] = -c, n[3] = p, this
    }, t.prototype.compose = function(t, e, r) {
        var n = this.elements,
            s = e.x,
            h = e.y,
            a = i(r),
            p = o(r);
        return n[0] = a * s, n[1] = p * s, n[2] = -p * h, n[3] = a * h, n[4] = t.x, n[5] = t.y, this
    }, t.prototype.decompose = function(t, e) {
        var i = this.elements,
            o = i[0],
            n = i[1],
            s = e.set(o, n).length(),
            h = e.set(i[2], i[3]).length();
        return t.x = i[4], t.y = i[5], e.x = s, e.y = h, r(n, o)
    }, t.prototype.setRotation = function(t) {
        var e = this.elements,
            r = i(t),
            n = o(t);
        return e[0] = r, e[1] = n, e[2] = -n, e[3] = r, this
    }, t.prototype.getRotation = function() {
        var t = this.elements;
        return r(t[1], t[0])
    }, t.prototype.setPosition = function(t) {
        var e = this.elements;
        return e[4] = t.x, e[5] = t.y, this
    }, t.prototype.getPosition = function(t) {
        var e = this.elements;
        return t.x = e[4], t.y = e[5], t
    }, t.prototype.extractPosition = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[4] = i[4], e[5] = i[5], this
    }, t.prototype.extractRotation = function(t) {
        var i = this.elements,
            o = t.elements,
            r = o[0],
            n = o[2],
            s = o[1],
            h = o[3],
            a = r * r + s * s,
            p = n * n + h * h,
            c = a > 0 ? 1 / e(a) : 0,
            u = p > 0 ? 1 / e(p) : 0;
        return i[0] = r * c, i[1] = s * c, i[2] = n * u, i[3] = h * u, this
    }, t.prototype.translate = function(t) {
        var e = this.elements,
            i = t.x,
            o = t.y;
        return e[4] = e[0] * i + e[2] * o + e[4], e[5] = e[1] * i + e[3] * o + e[5], this
    }, t.prototype.rotate = function(t) {
        var e = this.elements,
            i = e[0],
            r = e[2],
            n = e[1],
            s = e[3],
            h = o(t),
            a = o(t);
        return e[0] = i * a + r * h, e[1] = i * -h + r * a, e[2] = n * a + s * h, e[3] = n * -h + s * a, this
    }, t.prototype.scale = function(t) {
        var e = this.elements,
            i = t.x,
            o = t.y;
        return e[0] *= i, e[1] *= i, e[4] *= i, e[2] *= o, e[3] *= o, e[5] *= o, this
    }, t.prototype.orthographic = function(t, e, i, o) {
        var r = this.elements,
            n = 1 / (e - t),
            s = 1 / (o - i),
            h = (e + t) * n,
            a = (o + i) * s;
        return r[0] = 2 * n, r[1] = 0, r[2] = 0, r[3] = 2 * s, r[4] = -h, r[5] = -a, this
    }, t.prototype.fromMat3 = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[3], e[3] = i[4], e[4] = 0, e[5] = 0, this
    }, t.prototype.fromMat4 = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[4], e[3] = i[5], e[4] = i[11], e[5] = i[12], this
    }, t.prototype.fromJSON = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[2], e[3] = i[3], e[4] = i[4], e[5] = i[5], this
    }, t.prototype.toJSON = function() {
        json || (json = {});
        var t = this.elements,
            e = json.elements || (json.elements = []);
        return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], json
    }, t.prototype.toString = function() {
        var t = this.elements;
        return "Mat32[ " + t[0] + ", " + t[2] + ", " + t[4] + "]\n" + "     [ " + t[1] + ", " + t[3] + ", " + t[5] + "]"
    }, t
}), define("core/components/camera2d", ["base/class", "math/mathf", "math/color", "math/vec2", "math/mat32", "math/mat4", "core/components/component"], function(t, e, i, o, r, n, s) {
    function h(t) {
        t || (t = {}), s.call(this, "Camera2D", t.sync, t.json), this.backgroundColor = void 0 !== t.backgroundColor ? t.backgroundColor : new i(.5, .5, .5), this.width = 960, this.height = 640, this.aspect = this.width / this.height, this.orthographicSize = void 0 !== t.orthographicSize ? t.orthographicSize : 2, this.minOrthographicSize = void 0 !== t.minOrthographicSize ? t.minOrthographicSize : .01, this.maxOrthographicSize = void 0 !== t.maxOrthographicSize ? t.maxOrthographicSize : 1024, this.projection = new r, this.view = new r, this._needsUpdate = !0, this._active = !1
    }
    var a = e.clamp;
    e.degsToRads, h.type = "Camera2D", t.extend(h, s), h.prototype.copy = function(t) {
        return this.backgroundColor.copy(t.backgroundColor), this.width = t.width, this.height = t.height, this.orthographicSize = t.orthographicSize, this.minOrthographicSize = t.minOrthographicSize, this.maxOrthographicSize = t.maxOrthographicSize, this._needsUpdate = !0, this
    }, h.prototype.set = function(t, e) {
        this.width = t, this.height = e, this.aspect = t / e, this._needsUpdate = !0
    }, h.prototype.setWidth = function(t) {
        this.width = t, this.aspect = t / this.height, this._needsUpdate = !0
    }, h.prototype.setHeight = function(t) {
        this.height = t, this.aspect = this.width / t, this._needsUpdate = !0
    }, h.prototype.setOrthographicSize = function(t) {
        this.orthographicSize = a(t, this.minOrthographicSize, this.maxOrthographicSize), this._needsUpdate = !0
    };
    var p = new r,
        c = new o;
    return h.prototype.toWorld = function(t, e) {
        return e || (e = new Vec3), e.x = 2 * t.x / this.width - 1, e.y = -2 * t.y / this.height + 1, e.transformMat32(p.mmul(this.projection, this.view).inverse()), e
    }, h.prototype.toScreen = function(t, e) {
        return e || (e = new o), c.copy(t).transformMat32(p.mmul(this.projection, this.view)), e.x = .5 * (c.x + 1) * this.width, e.y = .5 * (1 - c.y) * this.height, t
    }, h.prototype.update = function() {
        if (this._active) {
            if (this._needsUpdate) {
                var t = this.orthographicSize,
                    e = t * this.aspect,
                    i = -e,
                    o = t,
                    r = -o;
                this.projection.orthographic(i, e, r, o), this._needsUpdate = !1
            }
            this.view.inverseMat(this.transform2d.matrixWorld)
        }
    }, h.prototype.sort = function(t, e) {
        return t._active ? -1 : e._active ? 1 : -1
    }, h.prototype.toSYNC = function(t) {
        return t = s.prototype.toSYNC.call(this, t), t.backgroundColor = this.backgroundColor.toJSON(t.backgroundColor), t.width = this.width, t.height = this.height, t.orthographicSize = this.orthographicSize, t.minOrthographicSize = this.minOrthographicSize, t.maxOrthographicSize = this.maxOrthographicSize, t
    }, h.prototype.fromSYNC = function(t) {
        return s.prototype.fromSYNC.call(this, t), (t.width !== this.width || t.height !== this.height) && (this._needsUpdate = !0), this.backgroundColor.fromJSON(t.backgroundColor), this.width = t.width, this.height = t.height, this.orthographicSize = t.orthographicSize, this.minOrthographicSize = t.minOrthographicSize, this.maxOrthographicSize = t.maxOrthographicSize, this
    }, h.prototype.toJSON = function(t) {
        return t || (t = {}), s.prototype.toJSON.call(this, t), t.backgroundColor = this.backgroundColor.toJSON(t.backgroundColor), t.width = this.width, t.height = this.height, t.orthographicSize = this.orthographicSize, t.minOrthographicSize = this.minOrthographicSize, t.maxOrthographicSize = this.maxOrthographicSize, t
    }, h.prototype.fromJSON = function(t) {
        return s.prototype.fromJSON.call(this, t), this.backgroundColor.fromJSON(t.backgroundColor), this.width = t.width, this.height = t.height, this.orthographicSize = t.orthographicSize, this.minOrthographicSize = t.minOrthographicSize, this.maxOrthographicSize = t.maxOrthographicSize, this._needsUpdate = !0, this
    }, h
}), define("core/components/sprite2d", ["base/class", "base/time", "math/vec2", "core/components/component", "core/assets/assets"], function(t, e, i, o, r) {
    function n(t) {
        t || (t = {}), o.call(this, "Sprite2D", t.sync, t.json), this.visible = void 0 != t.visible ? !! t.visible : !0, this.z = void 0 != t.z ? t.z : 0, this.alpha = void 0 != t.alpha ? t.alpha : 1, this.texture = void 0 != t.texture ? t.texture : void 0, this.width = t.width || 1, this.height = t.height || 1, this.x = t.x || 0, this.y = t.y || 0, this.w = t.w || 1, this.h = t.h || 1
    }
    return n.type = "Sprite2D", t.extend(n, o), n.prototype.copy = function(t) {
        return this.visible = t.visible, this.z = t.z, this.alpha = t.alpha, this.texture = t.texture, this.width = t.width, this.height = t.height, this.x = t.x, this.y = t.y, this.w = t.w, this.h = t.h, this
    }, n.prototype.toSYNC = function(t) {
        return t = o.prototype.toSYNC.call(this, t), t.visible = this.visible, t.z = this.z, t.alpha = this.alpha, t.width = this.width, t.height = this.height, t
    }, n.prototype.fromSYNC = function(t) {
        return o.prototype.fromSYNC.call(this, t), this.visible = t.visible, this.z = t.z, this.alpha = t.alpha, this.width = t.width, this.height = t.height, this
    }, n.prototype.toJSON = function(t) {
        return t || (t = {}), o.prototype.toJSON.call(this, t), t.visible = this.visible, t.z = this.z, t.alpha = this.alpha, t.texture = this.texture ? this.texture.name : void 0, t.width = this.width, t.height = this.height, t.x = this.x, t.y = this.y, t.w = this.w, t.h = this.h, t
    }, n.prototype.fromJSON = function(t) {
        return o.prototype.fromJSON.call(this, t), this.visible = t.visible, this.z = t.z, this.alpha = t.alpha, this.texture = t.texture ? r.hash[t.texture] : void 0, this.width = t.width, this.height = t.height, this.x = t.x, this.y = t.y, this.w = t.w, this.h = t.h, this
    }, n.prototype.sort = function(t, e) {
        return e.z - t.z
    }, n.ONCE = 1, n.LOOP = 2, n.PING_PONG = 3, n
}), define("math/quat", ["math/mathf", "math/vec3"], function(t, e) {
    function i(t, e, i, o) {
        this.x = t || 0, this.y = e || 0, this.z = i || 0, this.w = void 0 !== o ? o : 1
    }
    var o = Math.abs,
        r = Math.sqrt,
        n = Math.acos,
        h = Math.sin,
        a = Math.cos,
        p = t.EPSILON;
    return i.prototype.clone = function() {
        return new i(this.x, this.y, this.z, this.w)
    }, i.prototype.copy = function(t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w, this
    }, i.prototype.set = function(t, e, i, o) {
        return this.x = t, this.y = e, this.z = i, this.w = o, this
    }, i.prototype.mul = function(t) {
        var e = this.x,
            i = this.y,
            o = this.z,
            r = this.w,
            n = t.x,
            s = t.y,
            h = t.z,
            a = t.w;
        return this.x = e * a + r * n + i * h - o * s, this.y = i * a + r * s + o * n - e * h, this.z = o * a + r * h + e * s - i * n, this.w = r * a - e * n - i * s - o * h, this
    }, i.prototype.qmul = function(t, e) {
        var i = t.x,
            o = t.y,
            r = t.z,
            n = t.w,
            s = e.x,
            h = e.y,
            a = e.z,
            p = e.w;
        return this.x = i * p + n * s + o * a - r * h, this.y = o * p + n * h + r * s - i * a, this.z = r * p + n * a + i * h - o * s, this.w = n * p - i * s - o * h - r * a, this
    }, i.prototype.div = function(t) {
        var e = this.x,
            i = this.y,
            o = this.z,
            r = this.w,
            n = -t.x,
            s = -t.y,
            h = -t.z,
            a = t.w;
        return this.x = e * a + r * n + i * h - o * s, this.y = i * a + r * s + o * n - e * h, this.z = o * a + r * h + e * s - i * n, this.w = r * a - e * n - i * s - o * h, this
    }, i.prototype.qdiv = function(t, e) {
        var i = t.x,
            o = t.y,
            r = t.z,
            n = t.w,
            s = -e.x,
            h = -e.y,
            a = -e.z,
            p = e.w;
        return this.x = i * p + n * s + o * a - r * h, this.y = o * p + n * h + r * s - i * a, this.z = r * p + n * a + i * h - o * s, this.w = n * p - i * s - o * h - r * a, this
    }, i.prototype.length = function() {
        var t = this.x,
            e = this.y,
            i = this.z,
            o = this.w,
            n = t * t + e * e + i * i + o * o;
        return n > 0 ? r(n) : 0
    }, i.prototype.lengthSq = function() {
        var t = this.x,
            e = this.y,
            i = this.z,
            o = this.w;
        return t * t + e * e + i * i + o * o
    }, i.prototype.normalize = function() {
        var t = this.x,
            e = this.y,
            i = this.z,
            o = this.w,
            n = t * t + e * e + i * i + o * o;
        return n = n > 0 ? 1 / r(n) : 0, this.x *= n, this.y *= n, this.z *= n, this.w *= n, this
    }, i.prototype.inverse = function() {
        var t = this.x,
            e = this.y,
            i = this.z,
            o = this.w,
            r = t * t + e * e + i * i + o * o,
            n = r > 0 ? 1 / r : 0;
        return this.x *= -n, this.y *= -n, this.z *= -n, this.w *= n, this
    }, i.prototype.inverseQuat = function(t) {
        var e = t.x,
            i = t.y,
            o = t.z,
            r = t.w,
            n = e * e + i * i + o * o + r * r,
            s = n > 0 ? 1 / n : 0;
        return this.x = -e * s, this.y = -i * s, this.z = -o * s, this.w = r * s, this
    }, i.prototype.conjugate = function() {
        return this.x = -this.x, this.y = -this.y, this.z = -this.z, this
    }, i.prototype.calculateW = function() {
        var t = this.x,
            e = this.y,
            i = this.z;
        return this.w = -r(o(1 - t * t - e * e - i * i)), this
    }, i.prototype.lerp = function(t, e) {
        return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this.w += (t.w - this.w) * e, this
    }, i.prototype.qlerp = function(t, e, i) {
        var o = t.x,
            r = t.y,
            n = t.z,
            s = t.w;
        return this.x = o + (e.x - o) * i, this.y = r + (e.y - r) * i, this.z = n + (e.z - n) * i, this.w = s + (e.w - s) * i, this
    }, i.prototype.nlerp = function(t, e) {
        return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this.w += (t.w - this.w) * e, this.normalize()
    }, i.prototype.qnlerp = function(t, e, i) {
        var o = t.x,
            r = t.y,
            n = t.z,
            s = t.w;
        return this.x = o + (e.x - o) * i, this.y = r + (e.y - r) * i, this.z = n + (e.z - n) * i, this.w = s + (e.w - s) * i, this.normalize()
    }, i.prototype.slerp = function(t, e) {
        var i, o, r, s, a = this.x,
            c = this.y,
            u = this.z,
            m = this.w,
            f = t.x,
            l = t.y,
            d = t.z,
            y = t.w,
            v = a * f + c * l + u * d + m * y;
        return 0 > v && (v *= -1, f *= -1, l *= -1, d *= -1, y *= -1), 1 - v > p ? (i = n(v), o = 1 / h(i), r = h((1 - e) * i) * o, s = h(e * i) * o) : (r = 1 - e, s = e), this.x = r * a + s * f, this.y = r * c + s * l, this.z = r * u + s * d, this.w = r * m + s * y, this
    }, i.prototype.qslerp = function(t, e, i) {
        var o, r, s, a, c = t.x,
            u = t.y,
            m = t.z,
            f = t.w,
            l = e.x,
            d = e.y,
            y = e.z,
            v = e.w,
            g = c * l + u * d + m * y + f * v;
        return 0 > g && (g *= -1, l *= -1, d *= -1, y *= -1, v *= -1), 1 - g > p ? (o = n(g), r = 1 / h(o), s = h((1 - i) * o) * r, a = h(i * o) * r) : (s = 1 - i, a = i), this.x = s * c + a * l, this.y = s * u + a * d, this.z = s * m + a * y, this.w = s * f + a * v, this
    }, i.qdot = i.prototype.qdot = function(t, e) {
        return t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w
    }, i.prototype.dot = function(t) {
        return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w
    }, i.prototype.rotateX = function(t) {
        var e = .5 * t,
            i = this.x,
            o = this.y,
            r = this.z,
            n = this.w,
            s = h(e),
            p = a(e);
        return this.x = i * p + n * s, this.y = o * p + r * s, this.z = r * p - o * s, this.w = n * p - i * s, this
    }, i.prototype.rotateY = function(t) {
        var e = .5 * t,
            i = this.x,
            o = this.y,
            r = this.z,
            n = this.w,
            s = h(e),
            p = a(e);
        return this.x = i * p - r * s, this.y = o * p + n * s, this.z = r * p + i * s, this.w = n * p - o * s, this
    }, i.prototype.rotateZ = function(t) {
        var e = .5 * t,
            i = this.x,
            o = this.y,
            r = this.z,
            n = this.w,
            s = h(e),
            p = a(e);
        return this.x = i * p + o * s, this.y = o * p - i * s, this.z = r * p + n * s, this.w = n * p - r * s, this
    }, i.prototype.rotate = function(t, e, i) {
        return this.rotateZ(i), this.rotateX(t), this.rotateY(e), this
    }, i.prototype.lookRotation = function(t, e) {
        var i = t.x,
            o = t.y,
            r = t.z,
            n = e.x,
            h = u.y,
            a = e.z,
            p = h * r - a * o,
            c = a * i - n * r,
            m = n * o - h * i,
            f = 2 * (1 + n * i + h * o + a * r),
            l = f * f;
        return s = 1 / l, this.x = p * s, this.y = c * s, this.z = m * s, this.w = .5 * l, this
    }, i.prototype.fromAxisAngle = function(t, e) {
        var i = .5 * e,
            o = h(i);
        return this.x = t.x * o, this.y = t.y * o, this.z = t.z * o, this.w = a(i), this
    }, i.prototype.fromVec3s = function() {
        var t = new e;
        return function(e, i) {
            return t.vcross(e, i), this.x = t.x, this.y = t.y, this.z = t.z, this.w = r(e.lengthSq() * i.lengthSq()) + e.dot(i), this.normalize()
        }
    }(), i.prototype.fromMat3 = function(t) {
        var e, i, o = t.elements,
            n = o[0],
            s = o[3],
            h = o[6],
            a = o[1],
            p = o[4],
            c = o[7],
            u = o[2],
            m = o[5],
            f = o[8],
            l = n + p + f;
        return l > 0 ? (e = .5 / r(l + 1), this.w = .25 / e, this.x = (m - c) * e, this.y = (h - u) * e, this.z = (a - s) * e) : n > p && n > f ? (e = 2 * r(1 + n - p - f), i = 1 / e, this.w = (m - c) * i, this.x = .25 * e, this.y = (s + a) * i, this.z = (h + u) * i) : p > f ? (e = 2 * r(1 + p - n - f), i = 1 / e, this.w = (h - u) * i, this.x = (s + a) * i, this.y = .25 * e, this.z = (c + m) * i) : (e = 2 * r(1 + f - n - p), i = 1 / e, this.w = (a - s) * i, this.x = (h + u) * i, this.y = (c + m) * i, this.z = .25 * e), this
    }, i.prototype.fromMat4 = function(t) {
        var e, i, o = t.elements,
            n = o[0],
            s = o[4],
            h = o[8],
            a = o[1],
            p = o[5],
            c = o[9],
            u = o[2],
            m = o[6],
            f = o[10],
            l = n + p + f;
        return l > 0 ? (e = .5 / r(l + 1), this.w = .25 / e, this.x = (m - c) * e, this.y = (h - u) * e, this.z = (a - s) * e) : n > p && n > f ? (e = 2 * r(1 + n - p - f), i = 1 / e, this.w = (m - c) * i, this.x = .25 * e, this.y = (s + a) * i, this.z = (h + u) * i) : p > f ? (e = 2 * r(1 + p - n - f), i = 1 / e, this.w = (h - u) * i, this.x = (s + a) * i, this.y = .25 * e, this.z = (c + m) * i) : (e = 2 * r(1 + f - n - p), i = 1 / e, this.w = (a - s) * i, this.x = (h + u) * i, this.y = (c + m) * i, this.z = .25 * e), this
    }, i.prototype.fromArray = function(t) {
        return this.x = t[0], this.y = t[1], this.z = t[2], this.w = t[3], this
    }, i.prototype.fromJSON = function(t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w, this
    }, i.prototype.toArray = function() {
        return [this.x, this.y, this.z, this.w]
    }, i.prototype.toJSON = function() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
            w: this.w
        }
    }, i.prototype.toString = function() {
        return "Quat( " + this.x + ", " + this.y + ", " + this.z + ", " + this.w + " )"
    }, i
}), define("core/components/transform", ["base/class", "math/mathf", "math/vec3", "math/quat", "math/mat4", "core/components/component", "core/game/log"], function(t, e, i, o, r, n, s) {
    function h(t) {
        t || (t = {}), n.call(this, "Transform", t.sync, t.json), this.root = this, this.depth = 0, this.parent = void 0, this.children = [], this.position = void 0 !== t.position ? t.position : new i, this.rotation = void 0 !== t.rotation ? t.rotation : new o, this.scale = void 0 !== t.scale ? t.scale : new i(1, 1, 1), this.matrix = new r, this.matrixWorld = new r, this.modelView = new r, this._modelViewNeedsUpdate = !1
    }

    function a(t, e) {
        var i, o = t.children;
        for (t.depth = e, i = o.length; i--;) a(o[i], e + 1)
    }
    var p = e.EPSILON;
    h.type = "Transform", t.extend(h, n), h.prototype.copy = function(t) {
        var e, i = t.children;
        for (this.position.copy(t.position), this.scale.copy(t.scale), this.rotation.copy(t.rotation), e = i.length; e--;) this.add(i[e].gameObject.clone().transform);
        return t.parent && t.parent.add(this), this
    }, h.prototype.translate = function() {
        var t = new i;
        return function(e, i) {
            return t.copy(e), i instanceof h ? t.transformQuat(i.rotation) : i instanceof o && t.transformQuat(i), this.position.add(t), this
        }
    }(), h.prototype.rotate = function() {
        var t = new i;
        return function(e, i) {
            return t.copy(e), i instanceof h ? t.transformQuat(i.rotation) : i instanceof o && t.transformQuat(i), this.rotation.rotate(t.x, t.y, t.z), this
        }
    }(), h.prototype.lookAt = function() {
        var t = new r,
            e = new i,
            o = new i(0, 0, 1);
        return function(i, r) {
            return r = r || o, i instanceof h ? e.copy(i.position) : e.copy(i), t.lookAt(this.position, e, r), this.rotation.fromMat4(t), this
        }
    }(), h.prototype.follow = function() {
        var t = new i,
            e = new i,
            o = new i;
        return function(i, r) {
            return e.set(0, 0, 0).transformMat4(this.matrixWorld), t.set(0, 0, 0).transformMat4(i.matrixWorld), o.vsub(t, e), o.lengthSq() > p && this.position.add(o.smul(r)), this
        }
    }(), h.prototype.addChild = function(t) {
        if (!(t instanceof h)) return s.warn("Transform.add: can't add passed argument, it is not instance of Transform"), this;
        var e, i, o = this.children,
            r = o.indexOf(t);
        if (0 > r) {
            for (t.parent && t.parent.remove(t), t.parent = this, o.push(t), e = this, i = 0; e.parent;) e = e.parent, i++;
            t.root = e, this.root = e, a(this, i)
        } else s.warn("Transform.add: child is not a member of this Transform");
        return this
    }, h.prototype.add = h.prototype.addChildren = function() {
        for (var t = arguments.length; t--;) this.addChild(arguments[t]);
        return this
    }, h.prototype.removeChild = function(t) {
        var e, i, o = this.children,
            r = o.indexOf(t);
        if (r > -1) {
            for (t.parent = void 0, o.splice(r, 1), e = this, i = 0; e.parent;) e = e.parent, i++;
            t.root = t, this.root = e, a(this, i)
        } else s.warn("Transform.remove: child is not a member of this Transform");
        return this
    }, h.prototype.remove = h.prototype.removeChildren = function() {
        for (var t = arguments.length; t--;) this.removeChild(arguments[t]);
        return this
    }, h.prototype.detachChildren = function() {
        var t, e = this.children;
        for (t = e.length; t--;) this.removeChild(e[t]);
        return this
    }, h.prototype.toWorld = function(t) {
        return t.transformMat4(this.matrixWorld)
    }, h.prototype.toLocal = function() {
        var t = new r;
        return function(e) {
            return e.transformMat4(t.inverseMat(this.matrixWorld))
        }
    }(), h.prototype.update = function() {
        var t = this.matrix,
            e = this.parent;
        t.compose(this.position, this.scale, this.rotation), e ? this.matrixWorld.mmul(e.matrixWorld, t) : this.matrixWorld.copy(t), this._modelViewNeedsUpdate = !0
    }, h.prototype.updateModelView = function(t) {
        this._modelViewNeedsUpdate && (this.modelView.mmul(t, this.matrixWorld), this._modelViewNeedsUpdate = !1)
    }, h.prototype.sort = function(t, e) {
        return e.depth - t.depth
    };
    var c = new i;
    return h.prototype.toSYNC = function(t) {
        return t = n.prototype.toSYNC.call(this, t), this.parent ? (t.position = this.toWorld(c.copy(this.position)).toJSON(t.position), t.scale = this.toWorld(c.copy(this.scale)).toJSON(t.scale), t.rotation = this.toWorld(c.copy(this.rotation)).toJSON(t.rotation)) : (t.position = this.position.toJSON(t.position), t.scale = this.scale.toJSON(t.scale), t.rotation = this.rotation.toJSON(t.rotation)), t
    }, h.prototype.fromSYNC = function(t) {
        return this.position.fromJSON(t.position), this.scale.fromJSON(t.scale), this.rotation.fromJSON(t.rotation), this
    }, h.prototype.toJSON = function(t) {
        return t || (t = {}), n.prototype.toJSON.call(this, t), t.position = this.position.toJSON(t.position), t.scale = this.scale.toJSON(t.scale), t.rotation = this.rotation.toJSON(t.rotation), t
    }, h.prototype.fromJSON = function(t) {
        return n.prototype.fromJSON.call(this, t), this.position.fromJSON(t.position), this.scale.fromJSON(t.scale), this.rotation.fromJSON(t.rotation), this
    }, h
}), define("core/components/transform2d", ["base/class", "math/mathf", "math/vec2", "math/mat32", "math/mat4", "core/components/component", "core/game/log"], function(t, e, i, o, r, n, s) {
    function h(t) {
        t || (t = {}), n.call(this, "Transform2D", t.sync, t.json), this.root = this, this.depth = 0, this.parent = void 0, this.children = [], this.position = void 0 != t.position ? t.position : new i, this.rotation = void 0 != t.rotation ? t.rotation : 0, this.scale = void 0 != t.scale ? t.scale : new i(1, 1), this.matrix = new o, this.matrixWorld = new o, this.modelView = new o, this._modelViewNeedsUpdate = !1
    }

    function a(t, e) {
        var i, o = t.children;
        for (t.depth = e, i = o.length; i--;) a(o[i], e + 1)
    }
    var p = (e.lerp, e.EPSILON);
    h.type = "Transform2D", t.extend(h, n), h.prototype.copy = function(t) {
        var e, i = t.children;
        for (this.position.copy(t.position), this.scale.copy(t.scale), this.rotation = t.rotation, e = i.length; e--;) this.add(i[e].gameObject.clone().transform);
        return t.parent && t.parent.add(this), this
    }, h.prototype.translate = function() {
        var t = new i;
        return function(e, i) {
            return t.copy(e), i instanceof h ? t.transformAngle(i.rotation) : i && t.transformAngle(i), this.position.add(t), this
        }
    }(), h.prototype.rotate = function() {
        var t = new i;
        return function(e, i) {
            return t.copy(e), i instanceof h ? t.transformAngle(i.rotation) : i && t.transformAngle(i), this.rotation.rotate(t.x, t.y, t.z), this
        }
    }(), h.prototype.lookAt = function() {
        var t = new o,
            e = new i;
        return function(i, o) {
            return o = o || dup, i instanceof h ? e.copy(i.position) : e.copy(i), t.lookAt(this.position, e), this.rotation = t.getRotation(), this
        }
    }(), h.prototype.follow = function() {
        var t = new i,
            e = new i,
            o = new i;
        return function(i, r) {
            return e.set(0, 0).transformMat32(this.matrixWorld), t.set(0, 0).transformMat32(i.matrixWorld), o.vsub(t, e), o.lengthSq() > p && this.position.add(o.smul(r)), this
        }
    }(), h.prototype.addChild = function(t) {
        if (!(t instanceof h)) return s.warn("Transform2D.add: can't add passed argument, it is not instance of Transform2D"), this;
        var e, i, o = this.children,
            r = o.indexOf(t);
        if (0 > r) {
            for (t.parent && t.parent.remove(t), t.parent = this, o.push(t), e = this, i = 0; e.parent;) e = e.parent, i++;
            t.root = e, this.root = e, a(this, i)
        } else s.warn("Transform2D.add: child is not a member of this Transform2D");
        return this
    }, h.prototype.add = h.prototype.addChildren = function() {
        for (var t = arguments.length; t--;) this.addChild(arguments[t]);
        return this
    }, h.prototype.removeChild = function(t) {
        var e, i, o = this.children,
            r = o.indexOf(t);
        if (r > -1) {
            for (t.parent = void 0, o.splice(r, 1), e = this, i = 0; e.parent;) e = e.parent, i++;
            t.root = t, this.root = e, a(this, i)
        } else s.warn("Transform2D.remove: child is not a member of this Transform2D");
        return this
    }, h.prototype.remove = h.prototype.removeChildren = function() {
        for (var t = arguments.length; t--;) this.removeChild(arguments[t]);
        return this
    }, h.prototype.detachChildren = function() {
        var t, e = this.children;
        for (t = e.length; t--;) this.removeChild(e[t]);
        return this
    }, h.prototype.toWorld = function(t) {
        return t.transformMat4(this.matrixWorld)
    }, h.prototype.toLocal = function() {
        var t = new o;
        return function(e) {
            return e.transformMat32(t.inverseMat(this.matrixWorld))
        }
    }(), h.prototype.update = function() {
        var t = this.matrix,
            e = this.parent;
        t.compose(this.position, this.scale, this.rotation), e ? this.matrixWorld.mmul(e.matrixWorld, t) : this.matrixWorld.copy(t), this._modelViewNeedsUpdate = !0
    }, h.prototype.updateModelView = function(t) {
        this._modelViewNeedsUpdate && (this.modelView.mmul(t, this.matrixWorld), this._modelViewNeedsUpdate = !1)
    }, h.prototype.sort = function(t, e) {
        return e.depth - t.depth
    };
    var c = new i;
    return h.prototype.toSYNC = function(t) {
        return t = n.prototype.toSYNC.call(this, t), this.parent ? (t.position = this.toWorld(c.copy(this.position)).toJSON(t.position), t.scale = this.toWorld(c.copy(this.scale)).toJSON(t.scale), t.rotation = this.rotation - this.parent.rotation) : (t.position = this.position.toJSON(t.position), t.scale = this.scale.toJSON(t.scale), t.rotation = this.rotation), t
    }, h.prototype.fromSYNC = function(t) {
        return this.position.fromJSON(t.position), this.scale.fromJSON(t.scale), this.rotation = t.rotation, this
    }, h.prototype.toJSON = function(t) {
        return t || (t = {}), n.prototype.toJSON.call(this, t), t.position = this.position.toJSON(t.position), t.scale = this.scale.toJSON(t.scale), t.rotation = this.rotation, t
    }, h.prototype.fromJSON = function(t) {
        return n.prototype.fromJSON.call(this, t), this.position.fromJSON(t.position), this.scale.fromJSON(t.scale), this.rotation = t.rotation, this
    }, h
}), define("core/game/loop", ["base/request_animation_frame", "core/game/log"], function(t, e) {
    function i(t, e) {
        e || (e = this), this._loopState = r, this._runState = s, this.callback = t, this.ctx = e || this;
        var i = this;
        this._run = function(r) {
            i._runState = n, t && (t.call(e, r), i._loopState === o ? i._pump() : i.pause()), i._runState = s
        }
    }
    i.prototype.init = i.prototype.resume = function() {
        return this.callback ? (this._loopState = o, this._runState === s && this._pump(), void 0) : (e.warn("Loop.resume: can't run loop without callback"), void 0)
    }, i.prototype.pause = function() {
        this._loopState = r
    }, i.prototype.isRunning = function() {
        return this._loopState === o
    }, i.prototype.isPaused = function() {
        return this._loopState === r
    }, i.prototype._pump = function() {
        t(this._run)
    };
    var o = i.L_RUNNING = 1,
        r = i.L_PAUSED = 2,
        n = i.R_RUNNING = 1,
        s = i.R_PAUSED = 2;
    return i
}), define("core/game_object", ["base/class", "core/components/component", "core/game/log"], function(t, e, i) {
    function o(e) {
        e || (e = {}), t.call(this), this.sync = void 0 != e.sync ? !! e.sync : !0, this.json = void 0 != e.json ? !! e.json : !0, this.scene = void 0, this.tags = [], this.components = [], this._componentHash = {}, this._componentHashServer = {}, e.tags && this.addTags.apply(this, e.tags), e.components && this.addComponents.apply(this, e.components)
    }
    return t.extend(o, t), o.prototype.copy = function(t) {
        var e, i = t.components,
            o = t.tags;
        for (this.clear(), e = i.length; e--;) this.addComponent(i[e].clone());
        for (e = o.length; e--;) this.addTag(o[e]);
        return this.scene && this.scene.removeGameObject(this), t.scene && t.scene.addGameObject(this), this
    }, o.prototype.clear = function() {
        var t, e = this.components,
            i = this.tags;
        for (t = i.length; t--;) this.removeTag(i[t]);
        for (t = e.length; t--;) this.removeComponent(e[t]);
        return this
    }, o.prototype.destroy = function() {
        return this.scene ? (this.scene.removeGameObject(this), this.emit("destroy"), this.clear(), this) : (i.warn("GameObject.destroy: can't destroy GameObject if it's not added to a Scene"), this)
    }, o.prototype.addTag = function(t) {
        var e = this.tags,
            i = e.indexOf(t);
        return -1 === i && e.push(t), this
    }, o.prototype.addTags = function() {
        for (var t = arguments.length; t--;) this.addTag(arguments[t]);
        return this
    }, o.prototype.removeTag = function(t) {
        var e = this.tags,
            i = e.indexOf(t);
        return -1 !== i && e.splice(i, 1), this
    }, o.prototype.removeTags = function() {
        for (var t = arguments.length; t--;) this.removeTag(arguments[t]);
        return this
    }, o.prototype.hasTag = function(t) {
        return -1 !== this.tags.indexOf(t)
    }, o.prototype.addComponent = function(t, o) {
        if ("string" == typeof t && (t = new e._types[t]), !(t instanceof e)) return i.warn("GameObject.addComponent: can't add passed argument, it is not instance of Component"), this;
        var r, n, s, h = t._name,
            a = this.components,
            p = a.indexOf(t);
        if (-1 === p) {
            if (t.gameObject && (t = t.clone()), a.push(t), this._componentHash[t._id] = t, -1 !== t._serverId && (this._componentHashServer[t._serverId] = t), t.gameObject = this, this[h] = t, !o)
                for (n = a.length; n--;)
                    if (r = a[n])
                        for (s = a.length; s--;) h = a[s]._name, r[h] = a[s];
            this.emit("add" + t._type, t), this.emit("addComponent", t), this.scene && this.scene._addComponent(t)
        } else i.warn("GameObject.addComponent: GameObject already has a(n) " + type + " Component");
        return this
    }, o.prototype.add = o.prototype.addComponents = function() {
        var t, e, i, o, r = (this.scene, arguments.length),
            n = this.components;
        for (i = r; i--;) this.addComponent(arguments[i], !0);
        for (i = n.length; i--;)
            if (t = n[i])
                for (o = n.length; o--;) e = n[o]._name, t[e] = n[o];
        return this
    }, o.prototype.removeComponent = function(t, o) {
        if ("string" == typeof t && (t = this.getComponent(t)), !(t instanceof e)) return i.warn("GameObject.removeComponent: can't remove passed argument, it is not instance of Component"), this;
        var r, n, s, h = t._name,
            a = this.components,
            p = a.indexOf(t);
        if (-1 !== p) {
            if (!o)
                for (n = a.length; n--;)
                    if (r = a[n])
                        for (s = a.length; s--;) h === a[s]._name && (r[h] = void 0);
            a.splice(p, 1), this._componentHash[t._id] = void 0, -1 !== t._serverId && (this._componentHashServer[t._serverId] = void 0), t.gameObject = void 0, this[h] = void 0, this.emit("remove" + t._type, t), this.emit("removeComponent", t), this.scene && this.scene._removeComponent(t)
        } else i.warn("GameObject.removeComponent: GameObject does not have a(n) " + type + " Component");
        return this
    }, o.prototype.remove = o.prototype.removeComponents = function() {
        var t, e, i, o, r = (this.scene, arguments.length),
            n = this.components,
            s = arguments;
        for (i = r; i--;) this.removeComponent(arguments[i], !0);
        for (i = n.length; i--;)
            if (t = n[i])
                for (e = t._name, o = s.length; o--;) e === s[i]._name && (t[e] = void 0);
        return this
    }, o.prototype.getComponent = function(t) {
        return this._componentHash[t] || this[t] || this[t.toLowerCase()]
    }, o.prototype.hasComponent = function(t) {
        var e, i = this.components;
        for (e = i.length; e--;)
            if (i[e]._type === t) return !0;
        return !1
    }, o.prototype.findComponentById = function(t) {
        return this._componentHash[t]
    }, o.prototype.findComponentByServerId = function(t) {
        return this._componentHashServer[t]
    }, o.prototype.toSYNC = function(e) {
        e = t.prototype.toSYNC.call(this, e);
        var i, o, r = this.components,
            n = e.components || (e.components = []);
        for (o = r.length; o--;)(i = r[o]).sync && (n[o] = i.toSYNC(n[o]));
        return e
    }, o.prototype.fromSYNC = function(i, o) {
        t.prototype.fromSYNC.call(this, i);
        var r, n, s, h, a = (this.components, i.components || (i.components = []));
        for (h = a.length; h--;)
            if (n = a[h])
                if (r = this.findComponentByServerId(n._id)) r.fromSYNC(n, o);
                else {
                    if (!(s = e._types[n._type])) continue;
                    this.addComponent((new s).fromSYNC(n, o))
                }
        return this
    }, o.prototype.toJSON = function(e) {
        e || (e = {}), t.prototype.toJSON.call(this, e);
        var i, o, r = this.components,
            n = e.components || (e.components = []),
            s = this.tags,
            h = e.tags || (e.tags = []);
        for (o = r.length; o--;)(i = r[o]).json && (n[o] = i.toJSON(n[o]));
        for (o = s.length; o--;) h[o] = s[o];
        return e
    }, o.prototype.fromJSON = function(i) {
        t.prototype.fromJSON.call(this, i);
        var o, r, n, s, h = (this.components, i.components || (i.components = [])),
            a = this.tags,
            p = i.tags || (i.tags = []);
        for (s = h.length; s--;)(r = h[s]) && (n = e._types[r._type]) && ((o = this.findComponentByServerId(r._id)) ? o.fromJSON(r) : this.addComponent((new n).fromJSON(r)));
        for (s = p.length; s--;) this.hasTag(p[s]) || a.push(p[s]);
        return this
    }, o
}), define("core/scene", ["base/class", "core/game_object", "core/game/log"], function(t, e, i) {
    function o(e) {
        e || (e = {}), t.call(this), this.game = void 0, this.gameObjects = [], this._gameObjectHash = {}, this._gameObjectServerHash = {}, this.components = {}, this._componentTypes = [], this._componentHash = {}, this._componentHashServer = {}, e.gameObjects && this.addGameObjects.apply(this, e.gameObjects)
    }
    return t.extend(o, t), o.prototype.init = function() {
        var t, e, i, o = this._componentTypes,
            r = this.gameObjects;
        for (e = o.length; e--;)
            for (t = o[e], i = t.length; i--;) t[i].init();
        for (e = r.length; e--;) r[e].emit("init")
    }, o.prototype.update = function() {
        var t, e, i, o = this._componentTypes,
            r = this.gameObjects;
        for (e = o.length; e--;)
            for (t = o[e], i = t.length; i--;) t[i].update();
        for (e = r.length; e--;) r[e].emit("update")
    }, o.prototype.clear = function() {
        var t, e = this.gameObjects;
        for (t = e.length; t--;) this.removeGameObject(e[t]);
        return this
    }, o.prototype.destroy = function() {
        return this.game ? (this.game.removeScene(this), this.emit("destroy"), this.clear(), this) : (i.warn("Scene.destroy: can't destroy Scene if it's not added to a Game"), this)
    }, o.prototype.addGameObject = function(t) {
        if (!(t instanceof e)) return i.warn("Scene.addGameObject: can't add argument to Scene, it's not an instance of GameObject"), this;
        var o, r, n = this.gameObjects,
            s = n.indexOf(t);
        if (-1 === s) {
            for (t.scene && t.scene.removeGameObject(t), n.push(t), this._gameObjectHash[t._id] = t, -1 !== t._serverId && (this._gameObjectServerHash[t._serverId] = t), t.scene = this, o = t.components, r = o.length; r--;) this._addComponent(o[r]);
            this.game && t.emit("init"), this.emit("addGameObject", t)
        } else i.warn("Scene.addGameObject: GameObject is already a member of Scene");
        return this
    }, o.prototype.add = o.prototype.addGameObjects = function() {
        for (var t = arguments.length; t--;) this.addGameObject(arguments[t]);
        return this
    }, o.prototype._addComponent = function(t) {
        if (t) {
            var e = t._type,
                i = this.components,
                o = !i[e],
                r = i[e] = i[e] || [];
            this._componentHash[t._id] = t, -1 !== t._serverId && (this._componentHashServer[t._serverId] = t), r.push(t), r.sort(t.sort), o && this._componentTypes.push(r), this.game && t.init(), this.emit("add" + e, t), this.emit("addComponent", t)
        }
    }, o.prototype.removeGameObject = function(t) {
        if (!(t instanceof e)) return i.warn("Scene.removeGameObject: can't remove argument from Scene, it's not an instance of GameObject"), this;
        var o, r, n = this.gameObjects,
            s = n.indexOf(t);
        if (-1 !== s) {
            for (n.splice(s, 1), this._gameObjectHash[t._id] = void 0, -1 !== t._serverId && (this._gameObjectServerHash[t._serverId] = void 0), t.scene = void 0, o = t.components, r = o.length; r--;) this._removeComponent(o[r]);
            this.emit("removeGameObject", t)
        } else i.warn("Scene.removeGameObject: GameObject is not a member of Scene");
        return this
    }, o.prototype.remove = o.prototype.removeGameObjects = function() {
        for (var t = arguments.length; t--;) this.removeGameObject(arguments[t]);
        return this
    }, o.prototype._removeComponent = function(t) {
        if (t) {
            var e = t._type,
                i = this.components,
                o = i[e],
                r = o.indexOf(t);
            this._componentHash[t._id] = void 0, -1 !== t._serverId && (this._componentHashServer[t._serverId] = void 0), o.splice(r, 1), o.sort(t.sort), this.emit("remove" + e, t), this.emit("removeComponent", t)
        }
    }, o.prototype.findById = function(t) {
        return this._gameObjectHash[t]
    }, o.prototype.findByServerId = function(t) {
        return this._gameObjectServerHash[t]
    }, o.prototype.findComponentById = function(t) {
        return this._componentHash[t]
    }, o.prototype.findComponentByServerId = function(t) {
        return this._componentHashServer[t]
    }, o.prototype.toSYNC = function(e) {
        e = t.prototype.toSYNC.call(this, e);
        var i, o, r = this.gameObjects,
            n = e.gameObjects || (e.gameObjects = []);
        for (o = r.length; o--;)(i = r[o]).sync && (n[o] = i.toSYNC(n[o]));
        return e
    }, o.prototype.fromSYNC = function(e, i) {
        t.prototype.fromSYNC.call(this, e);
        var o, r, n, s = (this.gameObjects, e.gameObjects);
        for (n = s.length; n--;)(r = s[n]) && (o = this.findByServerId(r._id)) && o.fromSYNC(r, i);
        return this
    }, o.prototype.toJSON = function(e) {
        e || (e = {}), t.prototype.toJSON.call(this, e);
        var i, o, r = this.gameObjects,
            n = e.gameObjects || (e.gameObjects = []);
        for (o = r.length; o--;)(i = r[o]).json && (n[o] = i.toJSON(n[o]));
        return e
    }, o.prototype.fromJSON = function(i) {
        t.prototype.fromJSON.call(this, i);
        var o, r, n, s = (this.gameObjects, i.gameObjects);
        for (n = s.length; n--;)(r = s[n]) && ((o = this.findByServerId(r._id)) ? o.fromJSON(r) : this.addGameObject((new e).fromJSON(r)));
        return this
    }, o
}), define("core/game/game", ["base/class", "core/game/loop", "core/scene", "core/game/log"], function(t, e, i, o) {
    function r(i) {
        i || (i = {}), t.call(this), this._loop = new e(this.loop, this), this.scenes = [], this._sceneHash = {}, this._sceneServerHash = {}
    }
    return t.extend(r, t), r.prototype.addScene = function(t) {
        if (!(t instanceof i)) return o.warn("Game.addScene: can't add argument to Game, it's not an instance of Scene"), this;
        var e = this.scenes,
            r = e.indexOf(t);
        return -1 === r ? (t.game && t.game.removeScene(t), e.push(t), this._sceneHash[t._id] = t, -1 !== t._serverId && (this._sceneServerHash[t._serverId] = t), t.game = this, this.emit("addScene", t)) : o.warn("Game.addScene: Scene is already a member of Game"), this
    }, r.prototype.add = r.prototype.addScenes = function() {
        for (var t = arguments.length; t--;) this.addScene(arguments[t]);
        return this
    }, r.prototype.removeScene = function(t) {
        if (!(t instanceof i)) return o.warn("Game.removeScene: can't remove argument from Game, it's not an instance of Scene"), this;
        var e = this.scenes,
            r = e.indexOf(t);
        return -1 !== r ? (e.splice(r, 1), this._sceneHash[t._id] = void 0, -1 !== t._serverId && (this._sceneServerHash[t._serverId] = void 0), t.game = void 0, this.emit("removeScene", t)) : o.warn("Game.removeScene: Scene not a member of Game"), this
    }, r.prototype.remove = r.prototype.removeScenes = function() {
        for (var t = arguments.length; t--;) this.removeScene(arguments[t]);
        return this
    }, r.prototype.findById = function(t) {
        return this._sceneHash[t]
    }, r.prototype.findByServerId = function(t) {
        return this._sceneServerHash[t]
    }, r.prototype.pause = function() {
        return this._loop.pause(), this
    }, r.prototype.resume = function() {
        return this._loop.resume(), this
    }, r.prototype.loop = function(t) {
        this.emit("update", t)
    }, r.prototype.toSYNC = function(t) {
        t || (t = this._SYNC);
        var e, i = this.scenes,
            o = t.jsonScenes || (t.jsonScenes = []);
        for (e = i.length; e--;) o[e] = i[e].toSYNC(o[e]);
        return t
    }, r.prototype.fromSYNC = function(t) {
        var e, i, o, r = (this.scenes, t.scenes);
        for (o = r.length; o--;) i = r[o], (e = this.findByServerId(i._serverId)) && e.fromSYNC(i);
        return this
    }, r.prototype.toJSON = function(e) {
        e || (e = {}), t.prototype.toJSON.call(this, e);
        var i, o = this.scenes,
            r = e.scenes || (e.scenes = []);
        for (i = o.length; i--;) r[i] = o[i].toJSON(r[i]);
        return e
    }, r.prototype.fromJSON = function(e) {
        t.prototype.fromJSON.call(this, e);
        var o, r, n, s = (this.scenes, e.scenes);
        for (n = s.length; n--;) r = s[n], (o = this.findByServerId(r._id)) ? o.fromJSON(r) : this.addScene((new i).fromJSON(r));
        return this
    }, r
}), define("core/rendering/canvas", ["base/event_emitter", "base/device", "base/dom", "core/game/config"], function(t, e, i, o) {
    function r(e, i) {
        t.call(this), this.fullScreen = void 0 === e && void 0 === i ? !0 : !1, this.width = void 0 !== e ? e : window.innerWidth, this.height = void 0 !== i ? i : window.innerHeight, this.aspect = this.width / this.height, this.pixelWidth = this.width, this.pixelHeight = this.height, this.element = void 0
    }
    var n = i.addEvent,
        s = i.removeEvent,
        h = i.addMeta,
        a = Math.floor,
        p = /-scale\s *=\s*[.0-9]+/g,
        c = "viewport",
        u = "viewport-width",
        m = "viewport-height",
        f = ["background: #000000;", "position: absolute;", "top: 50%;", "left: 50%;", "padding:0px;", "margin: 0px;"].join("\n");
    return h(c, "viewport", "initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"), h(u, "viewport", "width=device-width"), h(m, "viewport", "height=device-height"), t.extend(r, t), r.prototype.init = function() {
        this.element && this.destroy();
        var t = document.createElement("canvas");
        t.style.cssText = f, document.body.appendChild(t), o.debug || (t.oncontextmenu = function() {
            return !1
        }), n(window, "resize orientationchange", this._handleResize, this), this.element = t, this._handleResize()
    }, r.prototype.destroy = function() {
        return this.element ? (s(window, "resize orientationchange", this._handleResize, this), document.body.removeChild(this.element), this.element = void 0, canvas.off("resize"), this) : this
    }, r.prototype.setFullscreen = function(t) {
        return this.element && this.fullScreen !== t ? (this.fullScreen = !! t, this._handleResize(), this) : this
    }, r.prototype.setWidth = function(t) {
        return this.element && this.width !== t ? (this.width = t, this.fullScreen = !1, this.aspect = this.width / this.height, this._handleResize(), this) : this
    }, r.prototype.setHeight = function(t) {
        return this.element && this.height !== t ? (this.height = t, this.fullScreen = !1, this.aspect = this.width / this.height, this._handleResize(), this) : this
    }, r.prototype.style = function(t, e) {
        return this.element ? (this.element.style[t] = e, this) : this
    }, r.prototype.setBackgroundColor = function(t) {
        return this.element ? (this.element.style.background = t, this) : this
    }, r.prototype._handleResize = function() {
        var t, i, o = document.getElementById(c).getAttribute("content"),
            r = window.innerWidth,
            n = window.innerHeight,
            s = r / n,
            h = this.element,
            f = h.style;
        this.fullScreen ? (t = r, i = n) : s > this.aspect ? (t = n * this.aspect, i = n) : (t = r, i = r / this.aspect), this.pixelWidth = a(t), this.pixelHeight = a(i), h.width = t, h.height = i, f.marginLeft = -a(.5 * t) - 1 + "px", f.marginTop = -a(.5 * i) - 1 + "px", f.width = a(t) + "px", f.height = a(i) + "px", document.getElementById(c).setAttribute("content", o.replace(p, "-scale=" + e.invPixelRatio)), document.getElementById(u).setAttribute("content", "width=" + r), document.getElementById(m).setAttribute("content", "height=" + n), window.scrollTo(1, 1), this.emit("resize")
    }, r
}), define("core/rendering/canvas_renderer_2d", ["base/event_emitter", "base/device", "base/dom", "math/mathf", "math/mat32", "math/color"], function(t, e, i, o, r, n) {
    function s(e) {
        e || (e = {}), t.call(this), this.canvas = void 0, this.context = void 0, this._context = !1, this._lastCamera = void 0, this._lastResizeFn = void 0, this._lastBackground = new n
    }
    var h = [],
        a = new Image;
    a.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==", t.extend(s, t), s.prototype.init = function(t) {
        this.canvas && this.clear(), this.canvas = t;
        try {
            this.context = t.element.getContext("2d")
        } catch (e) {
            return this
        }
        return this._context = !0, this._lastCamera = void 0, this._lastResizeFn = void 0, this._lastBackground.set(0, 0, 0), this
    }, s.prototype.clear = function() {
        return this.canvas = void 0, this.context = void 0, this._context = !1, this._lastCamera = void 0, this._lastResizeFn = void 0, this._lastBackground.set(0, 0, 0), this
    }, s.prototype.render = function(t, e) {
        if (this._context) {
            var i, o, r, n = this.context,
                s = this._lastBackground,
                a = e.backgroundColor,
                p = t.components,
                c = p.Sprite2D || h;
            if ((s.r !== a.r || s.g !== a.g || s.b !== a.b) && (s.copy(a), n.fillStyle = a.toRGB()), this._lastCamera !== e) {
                var u = this.canvas,
                    m = u.pixelWidth,
                    f = u.pixelHeight,
                    l = .5 * m,
                    d = .5 * f;
                e.set(m, f), n.translate(l, d), n.scale(l, -d), this._lastResizeFn && u.off("resize", this._lastResizeFn), this._lastResizeFn = function() {
                    var t = this.pixelWidth,
                        i = this.pixelHeight,
                        o = .5 * t,
                        r = .5 * i;
                    e.set(t, i), n.translate(o, r), n.scale(o, -r)
                }, u.on("resize", this._lastResizeFn), this._lastCamera = e
            }
            for (n.fillRect(-1, -1, 2, 2), r = c.length; r--;) i = c[r], o = i.transform2d, o && (o.updateModelView(e.view), this.renderSprite2D(e, o, i))
        }
    };
    var p = new r;
    return s.prototype.renderSprite2D = function(t, e, i) {
        var o, r = this.context,
            n = i.texture;
        p.mmul(t.projection, e.modelView), o = p.elements, n = n ? n.raw : a, r.save(), r.transform(o[0], -o[2], -o[1], o[3], o[4], o[5]), r.scale(1, -1), 1 !== i.alpha && (r.globalAlpha = i.alpha), r.drawImage(n, i.x, i.y, i.w, i.h, i.width * -.5, i.height * -.5, i.width, i.height), r.restore()
    }, s
}), define("core/rendering/webgl_renderer_2d", ["base/event_emitter", "base/device", "base/dom", "core/game/log", "math/mathf", "math/vec2", "math/mat32", "math/mat4", "math/color"], function(t, e, i, o, r, n, s, h, a) {
    function p(e) {
        e || (e = {}), t.call(this), this.canvas = void 0, this.context = void 0, this._context = !1, this.attributes = g(e.attributes || {}, {
            alpha: !0,
            antialias: !0,
            depth: !0,
            premulipliedAlpha: !0,
            preserveDrawingBuffer: !1,
            stencil: !0
        }), this._webgl = {
            gpu: {
                precision: "highp",
                maxAnisotropy: 16,
                maxTextures: 16,
                maxTextureSize: 16384,
                maxCubeTextureSize: 16384,
                maxRenderBufferSize: 16384
            },
            ext: {
                textureFilterAnisotropic: void 0,
                textureFloat: void 0,
                standardDerivatives: void 0,
                compressedTextureS3TC: void 0
            },
            textures: {},
            shaders: {},
            buffers: {},
            lastTexture: void 0,
            lastShader: void 0,
            lastBuffer: void 0
        }, this._clearBytes = 17664, this._lastCamera = void 0, this._lastResizeFn = void 0, this._lastBackground = new a, this._lastBlending = void 0
    }

    function c(t, e, i) {
        var o = e.attributes,
            r = t.FLOAT,
            n = t.ARRAY_BUFFER;
        i.vertex && o.aVertexPosition > -1 && (t.bindBuffer(n, i.vertex), t.enableVertexAttribArray(o.aVertexPosition), t.vertexAttribPointer(o.aVertexPosition, 2, r, !1, 0, 0)), i.color && o.aVertexColor > -1 && (t.bindBuffer(n, i.color), t.enableVertexAttribArray(o.aVertexColor), t.vertexAttribPointer(o.aVertexColor, 2, r, !1, 0, 0)), i.uv && o.aVertexUv > -1 && (t.bindBuffer(n, i.uv), t.enableVertexAttribArray(o.aVertexUv), t.vertexAttribPointer(o.aVertexUv, 2, r, !1, 0, 0)), i.index && t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, i.index)
    }

    function u(t, e) {
        if (!e) return void 0;
        var i = t.context,
            o = t._webgl,
            r = o.buffers,
            n = r[e._id];
        if (n && !e._needsUpdate) return n;
        n = n || (r[e._id] = {});
        var s, h, a, p, c = U,
            u = e.dynamic ? i.DYNAMIC_DRAW : i.STATIC_DRAW,
            m = i.ARRAY_BUFFER,
            f = i.ELEMENT_ARRAY_BUFFER;
        if (s = e.vertices, s.length) {
            for (c.length = 0, a = 0, p = s.length; p > a; a++) h = s[a], c.push(h.x, h.y);
            c.length && (n.vertex = n.vertex || i.createBuffer(), i.bindBuffer(m, n.vertex), i.bufferData(m, new Float32Array(c), u)), n.vertices = s.length
        }
        if (s = e.uvs, s.length) {
            for (c.length = 0, a = 0, p = s.length; p > a; a++) h = s[a], c.push(h.x, h.y);
            c.length && (n.uv = n.uv || i.createBuffer(), i.bindBuffer(m, n.uv), i.bufferData(m, new Float32Array(c), u))
        }
        return s = e.indices || e.faces, s.length && (n.index = n.index || i.createBuffer(), i.bindBuffer(f, n.index), i.bufferData(f, new Int16Array(s), u), n.indices = s.length), n
    }

    function m(t, e) {
        var i, o, r = t.context,
            n = t._webgl,
            s = n.shaders,
            h = s[e._id];
        if (h && !e._needsUpdate) return h;
        h = h || (s[e._id] = {}), i = e.vertex || e.vertexShader, o = e.fragment || e.fragmentShader;
        var a = h.program = b(r, i, o);
        return h.vertex = i, h.fragment = o, S(r, a, i, o, h.attributes || (h.attributes = {}), h.uniforms || (h.uniforms = {})), h
    }

    function f(t, e) {
        if (!e || !e.raw) return t._webgl.textures[A];
        var i = t.context,
            o = t._webgl,
            r = o.textures,
            n = r[e._id],
            s = e.raw;
        if (n && !e._needsUpdate) return n;
        n = n || (r[e._id] = i.createTexture());
        var h = o.ext,
            a = o.gpu,
            p = h.textureFilterAnisotropic,
            c = N(s.width) && N(s.height),
            u = z(e.anisotropy, 1, a.maxAnisotropy),
            m = i.TEXTURE_2D,
            f = c ? i.REPEAT : i.CLAMP_TO_EDGE,
            l = i[e.magFilter] || i.LINEAR,
            d = i[e.minFilter] || i.LINEAR,
            y = i[e.format];
        return y = y ? y : i.RGBA, d = c ? d === i.NEAREST || d === i.LINEAR ? i.LINEAR_MIPMAP_NEAREST : d : d === i.NEAREST ? i.NEAREST : i.LINEAR, i.bindTexture(m, n), i.texImage2D(m, 0, y, y, i.UNSIGNED_BYTE, s), i.texParameteri(m, i.TEXTURE_MAG_FILTER, l), i.texParameteri(m, i.TEXTURE_MIN_FILTER, d), i.texParameteri(m, i.TEXTURE_WRAP_S, f), i.texParameteri(m, i.TEXTURE_WRAP_T, f), p && i.texParameterf(m, p.TEXTURE_MAX_ANISOTROPY_EXT, u), c && i.generateMipmap(m), o.lastTexture = n, e._needsUpdate = !1, n
    }

    function l(t) {
        return ["precision " + t + " float;", "uniform mat4 uMatrix;", "attribute vec2 aVertexPosition;", "void main() {", "gl_Position = uMatrix * vec4(aVertexPosition, 0.0, 1.0);", "}"].join("\n")
    }

    function d(t) {
        return ["precision " + t + " float;", "uniform float uAlpha;", "uniform vec3 uColor;", "void main() {", "gl_FragColor = vec4(uColor, uAlpha);", "}"].join("\n")
    }

    function y(t) {
        return ["precision " + t + " float;", "uniform mat4 uMatrix;", "uniform vec4 uCrop;", "attribute vec2 aVertexPosition;", "attribute vec2 aVertexUv;", "varying vec2 vUvPosition;", "void main() {", "vUvPosition = vec2(aVertexUv.x * uCrop.z, aVertexUv.y * uCrop.w) + uCrop.xy;", "gl_Position = uMatrix * vec4(aVertexPosition, 0.0, 1.0);", "}"].join("\n")
    }

    function v(t) {
        return ["precision " + t + " float;", "uniform float uAlpha;", "uniform sampler2D uTexture;", "varying vec2 vUvPosition;", "void main() {", "vec4 finalColor = texture2D(uTexture, vUvPosition);", "finalColor.w *= uAlpha;", "gl_FragColor = finalColor;", "}"].join("\n")
    }

    function g(t, e) {
        var i;
        for (i in e) void 0 == t[i] && (t[i] = e[i]);
        return t
    }

    function x(t) {
        var e;
        for (e in t) delete t[e];
        return t
    }
    var w = i.getWebGLContext,
        b = i.createProgram,
        S = i.parseUniformsAttributes,
        _ = i.addEvent,
        O = i.removeEvent,
        z = (Math.min, Math.max, r.clamp),
        N = r.isPowerOfTwo,
        C = new Uint8Array([255, 255, 255, 255]),
        A = -1,
        E = [new n(.5, .5), new n(-.5, .5), new n(-.5, -.5), new n(.5, -.5)],
        T = [new n(1, 0), new n(0, 0), new n(0, 1), new n(1, 1)],
        J = [0, 1, 2, 0, 2, 3],
        R = -1,
        M = -1,
        j = -2,
        B = [];
    t.extend(p, t), p.prototype.init = function(t) {
        this.canvas && this.clear();
        var e = t.element;
        return this.canvas = t, this.context = w(e, this.attributes), this.context ? (this._context = !0, _(e, "webglcontextlost", this._handleWebGLContextLost, this), _(e, "webglcontextrestored", this._handleWebGLContextRestored, this), this.setDefaults(), this) : this
    }, p.prototype.clear = function() {
        if (!this.canvas) return this;
        var t = this.canvas,
            e = t.element,
            i = this._webgl,
            o = i.ext;
        return this.canvas = void 0, this.context = void 0, this._context = !1, O(e, "webglcontextlost", this._handleWebGLContextLost, this), O(e, "webglcontextrestored", this._handleWebGLContextRestored, this), this._clearBytes = 17664, this._lastCamera = void 0, this._lastBackground.setRGB(0, 0, 0), this._lastBlending = void 0, o.compressedTextureS3TC = o.standardDerivatives = o.textureFilterAnisotropic = o.textureFloat = void 0, i.lastBuffer = i.lastShader = i.lastTexture = void 0, x(i.textures), x(i.buffers), x(i.shaders), this
    }, p.prototype.setDefaults = function() {
        var t = this.context,
            i = this._webgl,
            o = i.ext,
            r = i.gpu,
            n = t.getExtension("EXT_texture_filter_anisotropic") || t.getExtension("MOZ_EXT_texture_filter_anisotropic") || t.getExtension("WEBKIT_EXT_texture_filter_anisotropic"),
            s = t.getExtension("WEBGL_compressed_texture_s3tc") || t.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc"),
            h = t.getExtension("OES_standard_derivatives"),
            a = t.getExtension("OES_texture_float");
        o.textureFilterAnisotropic = n, o.standardDerivatives = h, o.textureFloat = a, o.compressedTextureS3TC = s;
        var p = t.VERTEX_SHADER,
            c = t.FRAGMENT_SHADER,
            f = t.HIGH_FLOAT,
            g = t.MEDIUM_FLOAT,
            x = "undefined" != typeof t.getShaderPrecisionFormat,
            w = o.textureFilterAnisotropic ? t.getParameter(o.textureFilterAnisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1,
            b = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),
            S = t.getParameter(t.MAX_TEXTURE_SIZE),
            _ = t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),
            O = t.getParameter(t.MAX_RENDERBUFFER_SIZE),
            z = x ? t.getShaderPrecisionFormat(p, f) : 0,
            N = x ? t.getShaderPrecisionFormat(p, g) : 1,
            B = x ? t.getShaderPrecisionFormat(c, f) : 0,
            k = x ? t.getShaderPrecisionFormat(c, g) : 1,
            D = z.precision > 0 && B.precision > 0,
            U = N.precision > 0 && k.precision > 0,
            P = "highp";
        (!D || e.mobile) && (P = U ? "mediump" : "lowp"), r.precision = P, r.maxAnisotropy = w, r.maxTextures = b, r.maxTextureSize = S, r.maxCubeTextureSize = _, r.maxRenderBufferSize = O, t.clearColor(0, 0, 0, 1), t.clearDepth(1), t.clearStencil(0), t.enable(t.DEPTH_TEST), t.depthFunc(t.LEQUAL), t.frontFace(t.CCW), t.cullFace(t.BACK), t.enable(t.CULL_FACE), t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !1), t.enable(t.BLEND), t.blendEquationSeparate(t.FUNC_ADD, t.FUNC_ADD), t.blendFuncSeparate(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA, t.ONE, t.ONE_MINUS_SRC_ALPHA), t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT | t.STENCIL_BUFFER_BIT);
        var I = t.createTexture();
        return t.bindTexture(t.TEXTURE_2D, I), t.texImage2D(t.TEXTURE_2D, 0, t.RGB, 1, 1, 0, t.RGB, t.UNSIGNED_BYTE, C), t.bindTexture(t.TEXTURE_2D, null), i.textures[A] = I, u(this, {
            _id: R,
            vertices: E,
            uvs: T,
            indices: J
        }), m(this, {
            _id: M,
            vertexShader: y(P),
            fragmentShader: v(P)
        }), m(this, {
            _id: j,
            vertexShader: l(P),
            fragmentShader: d(P)
        }), this._clearBytes = t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT | t.STENCIL_BUFFER_BIT, this
    }, p.prototype.setBlending = function(t) {
        var e = this.context;
        if (t !== this._lastBlending) {
            switch (t) {
                case 0:
                    e.disable(e.BLEND);
                    break;
                case 1:
                    e.enable(e.BLEND), e.blendEquation(e.FUNC_ADD), e.blendFunc(e.SRC_ALPHA, e.ONE);
                    break;
                case 2:
                    e.enable(e.BLEND), e.blendEquation(e.FUNC_ADD), e.blendFunc(e.ZERO, e.ONE_MINUS_SRC_COLOR);
                    break;
                case 3:
                    e.enable(e.BLEND), e.blendEquation(e.FUNC_ADD), e.blendFunc(e.ZERO, e.SRC_COLOR);
                    break;
                default:
                    e.enable(e.BLEND), e.blendEquationSeparate(e.FUNC_ADD, e.FUNC_ADD), e.blendFuncSeparate(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA)
            }
            this._lastBlending = t
        }
    }, p.prototype.render = function(t, e) {
        if (this._context) {
            var i, o, r, n = this.context,
                s = this._lastBackground,
                h = e.backgroundColor,
                a = t.components,
                p = a.Sprite2D || B;
            if ((s.r !== h.r || s.g !== h.g || s.b !== h.b) && (s.copy(h), n.clearColor(h.r, h.g, h.b, 1)), this._lastCamera !== e) {
                var c = this.canvas,
                    u = c.pixelWidth,
                    m = c.pixelHeight;
                e.set(u, m), n.viewport(0, 0, u, m), this._lastResizeFn && c.off("resize", this._lastResizeFn), this._lastResizeFn = function() {
                    var t = this.pixelWidth,
                        i = this.pixelHeight;
                    e.set(t, i), n.viewport(0, 0, t, i)
                }, c.on("resize", this._lastResizeFn), this._lastCamera = e
            }
            for (n.clear(this._clearBytes), r = p.length; r--;) i = p[r], o = i.transform2d, o && (o.updateModelView(e.view), this.renderSprite2D(e, o, i))
        }
    };
    var k = new s,
        D = new h;
    p.prototype.renderSprite2D = function(t, e, i) {
        var o, r, n = this.context,
            s = this._webgl,
            h = i.texture,
            a = s.lastBuffer,
            p = s.lastShader,
            u = s.lastTexture,
            m = s.shaders[M],
            l = s.buffers[R],
            d = f(this, h),
            y = m.uniforms,
            v = h.raw;
        k.mmul(t.projection, e.modelView), D.fromMat32(k), h && v && (o = 1 / v.width, r = 1 / v.height, p !== m && (n.useProgram(m.program), s.lastShader = m), a !== l && (c(n, m, l), s.lastBuffer = l), n.uniformMatrix4fv(y.uMatrix, !1, D.elements), n.uniform4f(y.uCrop, i.x * o, i.y * r, i.w * o, i.h * r), n.uniform1f(y.uAlpha, i.alpha), u !== d && (n.activeTexture(n.TEXTURE0), n.bindTexture(n.TEXTURE_2D, d), n.uniform1i(y.uTexture, 0), s.lastTexture = d), l.index ? n.drawElements(n.TRIANGLES, l.indices, n.UNSIGNED_SHORT, 0) : n.drawArrays(n.TRIANGLES, 0, l.vertices))
    }, p.prototype._handleWebGLContextLost = function(t) {
        t.preventDefault(), o.warn("WebGLRenderer2D: webgl context was lost"), this._context = !1, this.emit("webglcontextlost", t)
    }, p.prototype._handleWebGLContextRestored = function(t) {
        o.log("WebGLRenderer2D: webgl context was restored"), this.setDefaults(), this._context = !0, this.emit("webglcontextrestored", t)
    };
    var U = [];
    return p
}), define("core/input/button", [], function() {
    function t(t) {
        this.name = t, this.timeDown = -1, this.timeUp = -1, this.frameDown = -1, this.frameUp = -1, this.value = !1, this._first = !0, this._SYNC = {}
    }
    return t.prototype.toSYNC = function(t) {
        return t || (t = this._SYNC), t.name = this.name, t.timeDown = this.timeDown, t.timeUp = this.timeUp, t.frameDown = this.frameDown, t.frameUp = this.frameUp, t.value = this.value, t
    }, t.prototype.fromSYNC = function(t) {
        return this.name = t.name, this.timeDown = t.timeDown, this.timeUp = t.timeUp, this.frameDown = t.frameDown, this.frameUp = t.frameUp, this.value = t.value, this
    }, t.prototype.toJSON = function(t) {
        return t || (t = {}), t.name = this.name, t.timeDown = this.timeDown, t.timeUp = this.timeUp, t.frameDown = this.frameDown, t.frameUp = this.frameUp, t.value = this.value, t
    }, t.prototype.fromJSON = function(t) {
        return this.name = t.name, this.timeDown = t.timeDown, this.timeUp = t.timeUp, this.frameDown = t.frameDown, this.frameUp = t.frameUp, this.value = t.value, this
    }, t
}), define("core/input/buttons", ["base/time", "core/input/button", "core/game/log"], function(t, e, i) {
    function o() {
        Array.call(this), this.hash = {}, this._SYNC = {}, this.add("mouse0"), this.add("mouse1"), this.add("mouse2")
    }
    return o.prototype = Object.create(Array.prototype), o.prototype.constructor = o, o.prototype.add = function(t) {
        if (this.hash[t]) return i.warn("Buttons.add: Buttons already have Button name " + t), void 0;
        var o = new e(t);
        return this.push(o), this.hash[t] = o, o
    }, o.prototype.get = function(t) {
        return this.hash[t]
    }, o.prototype.on = function(e) {
        var i = this.hash[e] || this.add(e);
        i._first && (i.frameDown = t.frameCount + 1, i.timeDown = t.stamp(), i._first = !1), i.value = !0
    }, o.prototype.off = function(e) {
        var i = this.hash[e] || this.add(e);
        i.frameUp = t.frameCount + 1, i.timeUp = t.stamp(), i.value = !1, i._first = !0
    }, o.prototype.toSYNC = function(t) {
        t || (t = this._SYNC);
        var e, i = t.buttons || (t.buttons = []);
        for (e = this.length; e--;) i[e] = this[e].toSYNC(i[e]);
        return t
    }, o.prototype.fromSYNC = function(t) {
        var e, i, o, r = this.hash,
            n = t.buttons || (t.buttons = []);
        for (o = n.length; o--;) i = n[o], (e = r[i.name]) ? e.fromSYNC(i) : this.add(i.name).fromJSON(i);
        return this
    }, o.prototype.toJSON = function(t) {
        t || (t = {});
        var e, i = t.buttons || (t.buttons = []);
        for (e = this.length; e--;) i[e] = this[e].toJSON(i[key]);
        return t
    }, o.prototype.fromJSON = function(t) {
        var e, i, o, r = this.hash,
            n = t.buttons || (t.buttons = []);
        for (o = n.length; o--;) i = n[o], (e = r[i.name]) ? e.fromJSON(i) : this.add(i.name).fromJSON(i);
        return this
    }, o
}), define("core/input/axis", [], function() {
    function t(e) {
        e || (e = {}), this.name = void 0 != e.name ? e.name : "unknown", this.negButton = void 0 != e.negButton ? e.negButton : "", this.posButton = void 0 != e.posButton ? e.posButton : "", this.altNegButton = void 0 != e.altNegButton ? e.altNegButton : "", this.altPosButton = void 0 != e.altPosButton ? e.altPosButton : "", this.gravity = void 0 != e.gravity ? e.gravity : 3, this.sensitivity = void 0 != e.sensitivity ? e.sensitivity : 3, this.dead = void 0 != e.dead ? e.dead : .001, this.type = void 0 != e.type ? e.type : t.BUTTON, this.axis = void 0 != e.axis ? e.axis : "x", this.index = void 0 != e.index ? e.index : 0, this.joyNum = void 0 != e.joyNum ? e.joyNum : 0, this.value = 0, this._SYNC = {}
    }
    return t.prototype.toSYNC = function(t) {
        return t || (t = this._SYNC), t.name = this.name, t.value = this.value, t
    }, t.prototype.fromSYNC = function(t) {
        return this.name = t.name, this.value = t.value, this
    }, t.prototype.toJSON = function(t) {
        return t || (t = {}), t.name = this.name, t.negButton = this.negButton, t.posButton = this.posButton, t.altNegButton = this.altNegButton, t.altPosButton = this.altPosButton, t.gravity = this.gravity, t.sensitivity = this.sensitivity, t.dead = this.dead, t.type = this.type, t.axis = this.axis, t.index = this.index, t.joyNum = this.joyNum, t.value = this.value, t
    }, t.prototype.fromJSON = function(t) {
        return this.name = t.name, this.negButton = t.negButton, this.posButton = t.posButton, this.altNegButton = t.altNegButton, this.altPosButton = t.altPosButton, this.gravity = t.gravity, this.sensitivity = t.sensitivity, this.dead = t.dead, this.type = t.type, this.axis = t.axis, this.index = t.index, this.joyNum = t.joyNum, this.value = t.value, this
    }, t.BUTTON = 1, t.MOUSE = 2, t.TOUCH = 3, t.MOUSE_WHEEL = 4, t.JOYSTICK = 5, t
}), define("core/input/axes", ["core/input/axis", "core/game/log"], function(t, e) {
    function i() {
        Array.call(this), this.hash = {}, this._SYNC = {}, this.add({
            name: "horizontal",
            posButton: "right",
            negButton: "left",
            altPosButton: "d",
            altNegButton: "a",
            type: o
        }), this.add({
            name: "vertical",
            posButton: "up",
            negButton: "down",
            altPosButton: "w",
            altNegButton: "s",
            type: o
        }), this.add({
            name: "fire",
            posButton: "ctrl",
            negButton: "",
            altPosButton: "mouse0",
            altNegButton: "",
            type: o
        }), this.add({
            name: "jump",
            posButton: "space",
            negButton: "",
            altPosButton: "mouse2",
            altNegButton: "",
            type: o
        }), this.add({
            name: "mouseX",
            type: r,
            axis: "x"
        }), this.add({
            name: "mouseY",
            type: r,
            axis: "y"
        }), this.add({
            name: "touchX",
            type: n,
            axis: "x"
        }), this.add({
            name: "touchY",
            type: n,
            axis: "y"
        }), this.add({
            name: "mouseWheel",
            type: s
        })
    }
    var o = t.BUTTON,
        r = t.MOUSE,
        n = t.TOUCH,
        s = t.MOUSE_WHEEL;
    return t.JOYSTICK, i.prototype = Object.create(Array.prototype), i.prototype.constructor = i, i.prototype.add = function(i, o) {
        if ("object" == typeof i && (o = i, i = o.name), this.hash[i]) return e.warn("Axes.add: Axes already have Axis named " + i), void 0;
        o || (o = {}), o.name = i;
        var r = new t(o);
        return this.push(r), this.hash[i] = r, r
    }, i.prototype.get = function(t) {
        return this.hash[t]
    }, i.prototype.toSYNC = function(t) {
        t || (t = this._SYNC);
        var e, i = t.axes || (t.axes = []);
        for (e = this.length; e--;) i[e] = this[e].toSYNC(i[e]);
        return t
    }, i.prototype.fromSYNC = function(t) {
        var e, i, o, r = this.hash,
            n = t.axes || (t.axes = []);
        for (o = n.length; o--;) i = n[o], (e = r[i.name]) ? e.fromSYNC(i) : this.add(i.name).fromJSON(i);
        return this
    }, i.prototype.toJSON = function(t) {
        t || (t = {});
        var e, i = t.axes || (t.axes = []);
        for (e = this.length; e--;) i[e] = this[e].toJSON(i[e]);
        return t
    }, i.prototype.fromJSON = function(t) {
        var e, i, o, r = this.hash,
            n = t.axes || (t.axes = []);
        for (o = n.length; o--;) i = n[o], (e = r[i.name]) ? e.fromJSON(i) : this.add(i.name).fromJSON(i);
        return this
    }, i
}), define("core/input/touch", ["math/vec2"], function(t) {
    function e() {
        this.id = -1, this.delta = new t, this.position = new t, this._last = new t, this._first = !0, this._SYNC = {}
    }
    return e.prototype.clear = function() {
        return this.id = -1, this.position.set(0, 0), this.delta.set(0, 0), this._last.set(0, 0), this._first = !0, this
    }, e.prototype.fromEvent = function(t) {
        var e = this.position,
            i = this.delta,
            o = this._last,
            r = this._first,
            n = t.target || t.srcElement,
            s = n.offsetLeft,
            h = n.offsetTop,
            a = (t.pageX || t.clientX) - s,
            p = (t.pageY || t.clientY) - h;
        return o.x = r ? a : e.x, o.y = r ? p : e.y, e.x = a, e.y = p, i.x = e.x - o.x, i.y = e.y - o.y, this._first = !1, this
    }, e.prototype.toSYNC = function(t) {
        return t || (t = this._SYNC), t.id = this.id, t.delta = this.delta.toJSON(t.delta), t.position = this.position.toJSON(t.position), t._last = this._last.toJSON(t._last), t._first = this._first, t
    }, e.prototype.fromSYNC = function(t) {
        return this.id = t.id, this.delta.fromJSON(t.delta), this.position.fromJSON(t.position), this._last.fromJSON(t._last), this._first = t._first, this
    }, e.prototype.toJSON = function(t) {
        return t || (t = {}), t.id = this.id, t.delta = this.delta.toJSON(t.delta), t.position = this.position.toJSON(t.position), t._last = this._last.toJSON(t._last), t._first = this._first, t
    }, e.prototype.fromJSON = function(t) {
        return this.id = t.id, this.delta.fromJSON(t.delta), this.position.fromJSON(t.position), this._last.fromJSON(t._last), this._first = t._first, this
    }, e
}), define("core/input/touches", ["base/object_pool", "core/input/touch"], function(t, e) {
    function i() {
        Array.call(this), this._SYNC = {}
    }
    var o = new t(e),
        r = new t(Object);
    return i.prototype = Object.create(Array.prototype), i.prototype.constructor = i, i.TOUCH_POOL = o, i.prototype.start = function(t) {
        var e = o.create();
        return e.clear(), e.id = t.identifier, e.fromEvent(t), this.push(e), e
    }, i.prototype.end = function(t) {
        var e = this[t];
        return o.removeObject(e), this.splice(t, 1), e
    }, i.prototype.cancel = function() {
        return o.clear(), this.length = 0, this
    }, i.prototype.move = function(t, e) {
        var i = this[t];
        return i.fromEvent(e), i
    }, i.prototype.toSYNC = function(t) {
        t || (t = this._SYNC);
        var e = t.touches || (t.touches = []),
            i = this.length;
        for (e.length = 0, r.clear(); i--;) e[i] = this[i].toSYNC(r.create());
        return t
    }, i.prototype.fromSYNC = function(t) {
        var e = t.touches,
            i = e.length;
        for (this.length = 0, o.clear(); i--;) this[i] = o.create().fromSYNC(e[i]);
        return this
    }, i.prototype.toJSON = function(t) {
        t || (t = {});
        var e, i = t.touches || (t.touches = []);
        for (e = this.length; e--;) i[e] = this[e].toJSON(i[e]);
        return t
    }, i.prototype.fromJSON = function(t) {
        var e, i, r, n, s = t.touches;
        for (i = s.length, n = this.length, r = n; i--;) n > i && (this.splice(r--, 1), o.removeObject(this[r])), (e = this[i]) ? e.fromJSON(s[i]) : this[i] = o.create().fromJSON(s[i]);
        return this
    }, i
}), define("core/input/input", ["base/event_emitter", "base/object_pool", "base/time", "math/mathf", "math/vec2", "math/vec3", "core/input/buttons", "core/input/button", "core/input/axes", "core/input/axis", "core/input/touches", "core/input/touch"], function(t, e, i, o, r, n, s, h, a, p, c, u) {
    function m() {
        t.call(this), this.axes = new a, this.buttons = new s, this.mouseWheel = 0, this.mousePosition = new r, this.mouseDelta = new r, this.mouseMoveNeedsUpdate = !1, this.touches = new c, this.touchesMoveNeedsUpdate = !1, this.acceleration = new n, this.frameCount = 0, this._frameCount = void 0, this.time = 0, this._time = void 0, this._SYNC = {}
    }
    var f = Math.abs,
        l = o.sign,
        d = o.clamp,
        y = p.BUTTON,
        v = p.MOUSE,
        g = p.TOUCH,
        x = p.MOUSE_WHEEL,
        w = (p.JOYSTICK, {
            0: "mouse0",
            1: "mouse1",
            2: "mouse2"
        });
    return t.extend(m, t), m.Touch = u, m.Touches = c, m.Axis = p, m.Axes = a, m.Button = h, m.Buttons = s, m.prototype.update = function() {
        var t, e, o, r, n, s, h, a, p, c = this.axes,
            u = this.buttons.hash,
            m = i.delta;
        for (this.frameCount = this._frameCount ? this._frameCount : i.frameCount, this.time = this._time ? this._time : i.stamp(), this.mouseMoveNeedsUpdate = !0, this.touchesMoveNeedsUpdate = !0, p = c.length; p--;) {
            switch (o = c[p], r = o.value, n = o.sensitivity, o.type) {
                case y:
                    t = u[o.negButton], e = u[o.altNegButton], h = t && t.value || e && e.value, t = u[o.posButton], e = u[o.altPosButton], s = t && t.value || e && e.value;
                    break;
                case v:
                    o.value = this.mouseDelta[o.axis];
                    continue;
                case g:
                    var w = this.touches[o.index];
                    o.value = w ? w.delta[o.axis] : 0;
                    continue;
                case x:
                    r += this.mouseWheel
            }
            h && (r -= n * m), s && (r += n * m), s || h || 0 === r || (a = f(r), r -= d(l(r) * o.gravity * m, -a, a)), r = d(r, -1, 1), f(r) <= o.dead && (r = 0), o.value = r
        }
        this.mouseWheel = 0
    }, m.prototype.axis = function(t) {
        var e = this.axes.hash[t];
        return e ? e.value : 0
    }, m.prototype.mouseButton = function(t) {
        var e = this.buttons.hash[w[t]];
        return e && e.value
    }, m.prototype.mouseButtonDown = function(t) {
        var e = this.buttons.hash[w[t]];
        return e && e.value && e.frameDown >= this.frameCount
    }, m.prototype.mouseButtonUp = function(t) {
        var e = this.buttons.hash[w[t]];
        return e && e.frameUp >= this.frameCount
    }, m.prototype.anyKey = function() {
        var t, e = this.buttons;
        for (t = e.length; t--;)
            if (e[t].value) return !0;
        return !1
    }, m.prototype.anyKeyDown = function() {
        var t, e, i = this.buttons;
        for (e = i.length; e--;)
            if ((t = i[e]).value && t.frameDown >= this.frameCount) return !0;
        return !1
    }, m.prototype.key = function(t) {
        var e = this.buttons.hash[t];
        return e && e.value
    }, m.prototype.keyDown = function(t) {
        var e = this.buttons.hash[t];
        return e && e.value && e.frameDown >= this.frameCount
    }, m.prototype.keyUp = function(t) {
        var e = this.buttons.hash[t];
        return e && e.frameUp >= this.frameCount
    }, m.prototype.toSYNC = function(t) {
        return t || (t = this._SYNC), t._frameCount = i.frameCount, t._time = i.stamp(), t.buttons = this.buttons.toSYNC(t.buttons), t.mousePosition = this.mousePosition.toJSON(t.mousePosition), t.mouseDelta = this.mouseDelta.toJSON(t.mouseDelta), t.acceleration = this.acceleration.toJSON(t.acceleration), t.touches = this.touches.toSYNC(t.touches), t
    }, m.prototype.fromSYNC = function(t) {
        return this._frameCount = t._frameCount, this._time = t._time, this.buttons.fromSYNC(t.buttons), this.mousePosition.fromJSON(t.mousePosition), this.mouseDelta.fromJSON(t.mouseDelta), this.acceleration.fromJSON(t.acceleration), this.touches.fromSYNC(t.touches), this
    }, m.prototype.toJSON = function(t) {
        return t || (t = {}), t.buttons = this.buttons.toJSON(t.buttons), t.axes = this.axes.toJSON(t.axes), t.mousePosition = this.mousePosition.toJSON(t.mousePosition), t.mouseDelta = this.mouseDelta.toJSON(t.mouseDelta), t.acceleration = this.acceleration.toJSON(t.acceleration), t.touches = this.touches.toJSON(t.touches), t
    }, m.prototype.fromJSON = function(t) {
        return this.buttons.fromJSON(t.buttons), this.axes.fromJSON(t.axes), this.mousePosition.fromJSON(t.mousePosition), this.mouseDelta.fromJSON(t.mouseDelta), this.acceleration.fromJSON(t.acceleration), this.touches.fromJSON(t.touches), this
    }, new m
}), define("core/input/handler", ["base/event_emitter", "base/dom", "base/object_pool", "math/vec2", "core/input/input", "core/input/touch"], function(t, e, i, o, r, n) {
    function s() {
        t.call(this), this.element = void 0
    }

    function h(t) {
        var e, i = t.accelerationIncludingGravity;
        i && (e = this.acceleration, e.x = i.x, e.y = i.y, e.z = i.z, this.emit("acceleration"))
    }

    function a(t) {
        t.preventDefault();
        var e, i = this.touches,
            o = t.touches,
            r = t.changedTouches;
        switch (t.type) {
            case "touchstart":
                for (e = o.length; e--;) this.emit("touchstart", i.start(o[e]));
                break;
            case "touchend":
                for (e = r.length; e--;) this.emit("touchend", i.end(e));
                break;
            case "touchcancel":
                i.cancel(), this.emit("touchcancel");
                break;
            case "touchmove":
                if (this.touchesMoveNeedsUpdate) {
                    for (e = r.length; e--;) this.emit("touchmove", i.move(e, r[e]));
                    this.touchesMoveNeedsUpdate = !1
                }
        }
    }

    function p(t) {
        switch (t.preventDefault(), t.type) {
            case "mousedown":
                y = !0, this.buttons.on(x[t.button]), c(this, t), this.emit("mousedown");
                break;
            case "mouseup":
                this.buttons.off(x[t.button]), c(this, t), this.emit("mouseup");
                break;
            case "mouseout":
                this.buttons.off(x[t.button]), c(this, t), this.emit("mouseout");
                break;
            case "mousewheel":
            case "DOMMouseScroll":
                g = f(-1, m(1, t.wheelDelta || -t.detail)), this.mouseWheel = g, this.emit("mousewheel", g);
                break;
            case "mousemove":
                this.mouseMoveNeedsUpdate && (c(this, t), this.mouseMoveNeedsUpdate = !1), this.emit("mousemove")
        }
    }

    function c(t, e) {
        var i = t.mousePosition,
            o = t.mouseDelta,
            r = e.target || e.srcElement,
            n = r.offsetLeft || 0,
            s = r.offsetTop || 0,
            h = (e.pageX || e.clientX) - n,
            a = (e.pageY || e.clientY) - s;
        v.x = y ? i.x : h, v.y = y ? i.y : a, i.x = h, i.y = a, o.x = i.x - v.x, o.y = i.y - v.y
    }

    function u(t) {
        switch (t.preventDefault(), t.type) {
            case "keydown":
                this.buttons.on(w[t.keyCode]), this.emit("keydown");
                break;
            case "keyup":
                this.buttons.off(w[t.keyCode]), this.emit("keyup")
        }
    }
    var m = Math.min,
        f = Math.max,
        l = e.addEvent,
        d = e.removeEvent;
    new i(n), t.extend(s, t), s.prototype.setElement = function(t) {
        this.element && this.removeElement(), this.element = t, l(t, "mousedown mouseup mousemove mouseout mousewheel DOMMouseScroll", p, r), l(top, "keydown keyup", u, r), l(t, "touchstart touchmove touchend touchcancel", a, r), l(window, "devicemotion", h, r)
    }, s.prototype.removeElement = function() {
        if (this.element) {
            var t = this.element;
            d(t, "mousedown mouseup mousemove mouseout mousewheel DOMMouseScroll", p, r), d(top, "keydown keyup", u, r), d(t, "touchstart touchmove touchend touchcancel", a, r), d(window, "devicemotion", h, r), this.element = void 0
        }
    };
    for (var y = !1, v = new o, g = 0, x = {
            0: "mouse0",
            1: "mouse1",
            2: "mouse2"
        }, w = {
            8: "backspace",
            9: "tab",
            13: "enter",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause",
            20: "capslock",
            27: "escape",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "insert",
            46: "delete",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "numlock",
            145: "scrolllock",
            186: "semicolon",
            187: "equal",
            188: "comma",
            189: "dash",
            190: "period",
            191: "slash",
            192: "graveaccent",
            219: "openbracket",
            220: "backslash",
            221: "closebraket",
            222: "singlequote"
        }, b = 48; 90 >= b; b++) w[b] = String.fromCharCode(b).toLowerCase();
    return new s
}), define("core/game/client_game", ["base/class", "base/device", "base/time", "core/game/config", "core/game/game", "core/game/log", "core/rendering/canvas", "core/rendering/canvas_renderer_2d", "core/rendering/webgl_renderer_2d", "core/game_object", "core/components/component", "core/scene", "core/input/input", "core/input/handler", "core/assets/assets", "core/assets/asset_loader"], function(t, e, i, o, r, n, s, h, a, p, c, u, m, f, l, d) {
    function y(t) {
        t || (t = {}), o.fromJSON(t), r.call(this, t), this.io = void 0, this._sessionid = void 0, this._handler = f, this.input = m, this.scene = void 0, this.camera = void 0, this.canvas = new s(t.width, t.height), this.CanvasRenderer2D = void 0, this.WebGLRenderer2D = void 0, this._optsCanvasRenderer2D = t.CanvasRenderer2D, this._optsWebGLRenderer2D = t.WebGLRenderer2D, this.renderer = void 0
    }
    var v = i.now;
    i.stamp, t.extend(y, r), y.prototype.init = function() {
        return this.canvas.init(), this._loop.init(), this.emit("init"), this
    }, y.prototype.connect = function(t) {
        var i, o = this;
        return this.io = i = io.connect(), i.on("connect", function() {
            o._sessionid || (o._sessionid = this.socket.sessionid), o._sessionid !== this.socket.sessionid && location.reload(), i.emit("client_device", e)
        }), i.on("server_ready", function(e, r) {
            l.fromJSON(r), d.load(function() {
                o.fromJSON(e), i.emit("client_ready"), o.emit("connect", i), t && t.call(o, i)
            })
        }), i.on("server_sync_input", function() {
            i.emit("client_sync_input", m.toSYNC())
        }), i.on("server_sync_scene", function(t) {
            var e = o.scene;
            e && e.fromSYNC(t)
        }), i.on("server_setScene", function(t) {
            var e = o.findByServerId(t);
            o.setScene(e)
        }), i.on("server_setCamera", function(t) {
            if (!o.scene) return n.warn("Socket:server_setCamera: can't set camera without an active scene, use ServerGame.setScene first"), void 0;
            var e = o.scene.findByServerId(t),
                r = o.canvas;
            return e ? (o.setCamera(e), r.on("resize", function() {
                i.emit("client_resize", this.pixelWidth, this.pixelHeight)
            }), i.emit("client_resize", r.pixelWidth, r.pixelHeight), void 0) : (n.warn("Socket:server_setCamera: can't find camera in active scene"), void 0)
        }), i.on("server_addScene", function(t) {
            o.addScene((new u).fromJSON(t))
        }), i.on("server_addGameObject", function(t, e) {
            var i = o.findByServerId(t);
            i && i.addGameObject((new p).fromJSON(e))
        }), i.on("server_addComponent", function(t, e, i) {
            var r = o.findByServerId(t);
            if (r) {
                var n = r.findByServerId(e);
                n && n.addComponent(new c._types[i._type].fromJSON(i))
            }
        }), i.on("server_removeScene", function(t) {
            o.removeScene(o.findByServerId(t))
        }), i.on("server_removeGameObject", function(t, e) {
            var i = o.findByServerId(t);
            i && i.removeGameObject(i.findByServerId(e))
        }), i.on("server_removeComponent", function(t, e, i) {
            var r = o.findByServerId(t);
            if (r) {
                var n = r.findByServerId(e);
                n && n.removeComponent(n.getComponent(i))
            }
        }), this
    }, y.prototype.disconnect = function() {
        var t = this.io;
        return t.disconnect(), t.removeAllListeners(), this._sessionid = void 0, this
    }, y.prototype.setScene = function(t) {
        if (!(t instanceof u)) return n.warn("ClientGame.setScene: can't add passed argument, it is not instance of Scene"), this;
        var e = this.scenes,
            i = e.indexOf(t);
        return -1 !== i ? (this.scene = t, this.emit("setScene", t)) : n.warn("ClientGame.setScene: Scene is not a member of Game"), this
    }, y.prototype.setCamera = function(t) {
        if (!(t instanceof p)) return n.warn("Scene.addGameObject: can't add argument to Scene, it's not an instance of GameObject"), this;
        var e, i = this.scene,
            o = this.camera;
        return i ? (e = i.gameObjects.indexOf(t), -1 === e && (n.warn("ClientGame.setCamera: GameObject is not a member of the active Scene, adding it..."), i.addGameObject(t)), this.camera = t.camera || t.camera2d, this.camera ? (this.camera._active = !0, o && (o._active = !1), this.updateRenderer(), this.emit("setCamera", this.camera)) : n.warn("ClientGame.setCamera: GameObject does't have a Camera or a Camera2D Component"), this) : (n.warn("ClientGame.setCamera: can't set camera without an active scene, use ClientGame.setScene first"), this)
    }, y.prototype.updateRenderer = function() {
        var t, i = this.camera,
            r = this.renderer,
            s = this.canvas;
        i && (t = i.gameObject, o.renderer && this[o.renderer] ? (this.renderer = this[o.renderer], n.log("Game: setting up " + o.renderer)) : t.camera ? n.warn("Game.updateRenderer: no renderer for camera component yet") : t.camera2d && (!o.forceCanvas && e.webgl ? (this.renderer = this.WebGLRenderer2D || (this.WebGLRenderer2D = new a(this._optsWebGLRenderer2D)), n.log("Game: setting up WebGLRenderer2D")) : e.canvas ? (this.renderer = this.CanvasRenderer2D || (this.CanvasRenderer2D = new h(this._optsCanvasRenderer2D)), n.log("Game: setting up CanvasRenderer2D")) : n.error("Game.updateRenderer: Could not get a renderer for this device")), r !== this.renderer && (r && r.destroy(), this.renderer.init(s), f.setElement(s.element)))
    };
    var g = 0,
        x = -1 / 60,
        w = 0,
        b = 1 / 60,
        S = 0,
        _ = 0,
        O = 0;
    return y.prototype.loop = function() {
        var t = this.camera,
            e = this.scene,
            r = o.MIN_DELTA,
            n = o.MAX_DELTA;
        i.frameCount = g++, x = w, w = v(), i.sinceStart = w, O = w, S++, O > _ + 1 && (i.fps = S / (O - _), _ = O, S = 0), b = (w - x) * i.scale, i.delta = r > b ? r : b > n ? n : b, i.time = w * i.scale, m.update(), e && (e.update(), t && this.renderer.render(e, t)), this.emit("update", w)
    }, y
}), define("math/aabb2", ["math/mathf", "math/vec2"], function(t, e) {
    function i(t, i) {
        this.min = t || new e(1 / 0, 1 / 0), this.max = i || new e(-1 / 0, -1 / 0)
    }
    return i.prototype.clone = function() {
        return new i(this.min.clone(), this.max.clone())
    }, i.prototype.copy = function(t) {
        return this.min.copy(t.min), this.max.copy(t.max), this
    }, i.prototype.set = function(t, e) {
        return this.min.copy(t), this.max.copy(e), this
    }, i.prototype.expandPoint = function(t) {
        return this.min.min(t), this.max.max(t), this
    }, i.prototype.expandVec = function(t) {
        return this.min.sub(t), this.max.add(t), this
    }, i.prototype.expandScalar = function(t) {
        return this.min.ssub(t), this.max.sadd(t), this
    }, i.prototype.union = function(t) {
        return this.min.min(t.min), this.max.max(t.max), this
    }, i.prototype.clear = function() {
        return this.min.set(1 / 0, 1 / 0), this.max.set(-1 / 0, -1 / 0), this
    }, i.prototype.contains = function(t) {
        var e = this.min,
            i = this.max,
            o = t.x,
            r = t.y;
        return !(o < e.x || o > i.x || r < e.y || r > i.y)
    }, i.prototype.intersects = function(t) {
        var e = this.min,
            i = this.max,
            o = t.min,
            r = t.max;
        return !(r.x < e.x || o.x > i.x || r.y < e.y || o.y > i.y)
    }, i.prototype.fromPoints = function(t) {
        for (var e, i, o, r = t.length, n = 1 / 0, s = 1 / 0, h = -1 / 0, a = -1 / 0, p = this.min, c = this.max; r--;) e = t[r], i = e.x, o = e.y, n = n > i ? i : n, s = s > o ? o : s, h = i > h ? i : h, a = o > a ? o : a;
        return p.x = n, p.y = s, c.x = h, c.y = a, this
    }, i.prototype.fromCenterSize = function(t, e) {
        var i = this.min,
            o = this.max,
            r = t.x,
            n = t.y,
            s = .5 * e.x,
            h = .5 * e.y;
        return i.x = r - s, i.y = n - h, o.x = r + s, o.y = n + h, this
    }, i.prototype.fromJSON = function(t) {
        return this.min.fromJSON(t.min), this.max.fromJSON(t.max), this
    }, i.prototype.toJSON = function(t) {
        return t || (t = {}), t.min = this.min.toJSON(t.min), t.max = this.max.toJSON(t.max), t
    }, i.prototype.toString = function() {
        var t = this.min,
            e = this.max;
        return "AABB2( min: " + t + ", max: " + e + " )"
    }, i
}), define("math/aabb3", ["math/mathf", "math/vec3"], function(t, e) {
    function i(t, i) {
        this.min = t || new e(1 / 0, 1 / 0, 1 / 0), this.max = i || new e(-1 / 0, -1 / 0, -1 / 0)
    }
    return i.prototype.clone = function() {
        return new i(this.min.clone(), this.max.clone())
    }, i.prototype.copy = function(t) {
        return this.min.copy(t.min), this.max.copy(t.max), this
    }, i.prototype.set = function(t, e) {
        return this.min.copy(t), this.max.copy(e), this
    }, i.prototype.expandPoint = function(t) {
        return this.min.min(t), this.max.max(t), this
    }, i.prototype.expandVec = function(t) {
        return this.min.sub(t), this.max.add(t), this
    }, i.prototype.expandScalar = function(t) {
        return this.min.ssub(t), this.max.sadd(t), this
    }, i.prototype.union = function(t) {
        return this.min.min(t.min), this.max.max(t.max), this
    }, i.prototype.clear = function() {
        return this.min.set(1 / 0, 1 / 0, 1 / 0), this.max.set(-1 / 0, -1 / 0, -1 / 0), this
    }, i.prototype.contains = function(t) {
        var e = this.min,
            i = this.max,
            o = t.x,
            r = t.y,
            n = t.z;
        return !(o < e.x || o > i.x || r < e.y || r > i.y || n < e.z || n > i.z)
    }, i.prototype.intersects = function(t) {
        var e = this.min,
            i = this.max,
            o = t.min,
            r = t.max;
        return !(r.x < e.x || o.x > i.x || r.y < e.y || o.y > i.y || r.z < e.z || o.z > i.z)
    }, i.prototype.fromPoints = function(t) {
        for (var e, i, o, r, n = t.length, s = 1 / 0, h = 1 / 0, a = 1 / 0, p = -1 / 0, c = -1 / 0, u = -1 / 0, m = this.min, f = this.max; n--;) e = t[n], i = e.x, o = e.y, r = e.z, s = s > i ? i : s, h = h > o ? o : h, a = a > r ? r : a, p = i > p ? i : p, c = o > c ? o : c, u = r > u ? r : u;
        return m.x = s, m.y = h, m.z = a, f.x = p, f.y = c, f.z = u, this
    }, i.prototype.fromCenterSize = function(t, e) {
        var i = this.min,
            o = this.max,
            r = t.x,
            n = t.y,
            s = t.z,
            h = .5 * e.x,
            a = .5 * e.y,
            p = .5 * e.z;
        return i.x = r - h, i.y = n - a, i.z = s - p, o.x = r + h, o.y = n + a, o.z = s + p, this
    }, i.prototype.fromJSON = function(t) {
        return this.min.fromJSON(t.min), this.max.fromJSON(t.max), this
    }, i.prototype.toJSON = function(t) {
        return t || (t = {}), t.min = this.min.toJSON(t.min), t.max = this.max.toJSON(t.max), t
    }, i.prototype.toString = function() {
        var t = this.min,
            e = this.max;
        return "AABB3( min: " + t + ", max: " + e + " )"
    }, i
}), define("math/mat2", [], function() {
    function t(t, e, i, o) {
        var r = new Float32Array(4);
        this.elements = r, r[0] = void 0 !== t ? t : 1, r[2] = e || 0, r[1] = i || 0, r[3] = void 0 !== o ? o : 1
    }
    var e = Math.cos,
        i = Math.sin,
        o = Math.atan2;
    return t.prototype.clone = function() {
        var e = this.elements;
        return new t(e[0], e[1], e[2], e[3])
    }, t.prototype.copy = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[2], e[3] = i[3], this
    }, t.prototype.set = function(t, e, i, o) {
        var r = this.elements;
        return r[0] = t, r[2] = e, r[1] = i, r[3] = o, this
    }, t.prototype.mul = function(t) {
        var e = this.elements,
            i = t.elements,
            o = e[0],
            r = e[2],
            n = e[1],
            s = e[3],
            h = i[0],
            a = i[2],
            p = i[1],
            c = i[3];
        return e[0] = o * h + n * a, e[1] = r * h + s * a, e[2] = o * p + n * c, e[3] = r * p + s * c, this
    }, t.prototype.mmul = function(t, e) {
        var i = this.elements,
            o = t.elements,
            r = e.elements,
            n = o[0],
            s = o[2],
            h = o[1],
            a = o[3],
            p = r[0],
            c = r[2],
            u = r[1],
            m = r[3];
        return i[0] = n * p + h * c, i[1] = s * p + a * c, i[2] = n * u + h * m, i[3] = s * u + a * m, this
    }, t.prototype.smul = function(t) {
        var e = this.elements;
        return e[0] *= t, e[1] *= t, e[2] *= t, e[3] *= t, this
    }, t.prototype.sdiv = function(t) {
        var e = this.elements;
        return t = 0 !== t ? 1 / t : 1, e[0] *= t, e[1] *= t, e[2] *= t, e[3] *= t, this
    }, t.prototype.identity = function() {
        var t = this.elements;
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, this
    }, t.prototype.zero = function() {
        var t = this.elements;
        return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, this
    }, t.prototype.determinant = function() {
        var t = this.elements;
        return t[0] * t[3] - t[2] * t[1]
    }, t.prototype.inverse = function() {
        var t = this.elements,
            e = t[0],
            i = t[2],
            o = t[1],
            r = t[3],
            n = e * r - i * o;
        return n = 0 !== n ? 1 / n : 0, t[0] = r * n, t[1] = -i * n, t[2] = -o * n, t[3] = e * n, this
    }, t.prototype.inverseMat = function(t) {
        var e = this.elements,
            i = t.elements,
            o = i[0],
            r = i[2],
            n = i[1],
            s = i[3],
            h = o * s - r * n;
        return h = 0 !== h ? 1 / h : 0, e[0] = s * h, e[1] = -r * h, e[2] = -n * h, e[3] = o * h, this
    }, t.prototype.transpose = function() {
        var t, e = this.elements;
        return t = e[1], e[1] = e[2], e[2] = t, this
    }, t.prototype.setTrace = function(t, e) {
        var i = this.elements;
        return i[0] = t, i[3] = e, this
    }, t.prototype.setRotation = function(t) {
        var o = this.elements,
            r = e(t),
            n = i(t);
        return o[0] = r, o[1] = n, o[2] = -n, o[3] = r, this
    }, t.prototype.getRotation = function() {
        var t = this.elements;
        return o(t[1], t[0])
    }, t.prototype.rotate = function(t) {
        var e = this.elements,
            o = e[0],
            r = e[2],
            n = e[1],
            s = e[3],
            h = i(t),
            a = i(t);
        return e[0] = o * a + r * h, e[1] = o * -h + r * a, e[2] = n * a + s * h, e[3] = n * -h + s * a, this
    }, t.prototype.fromMat3 = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[3], e[3] = i[4], this
    }, t.prototype.fromMat4 = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[4], e[3] = i[5], this
    }, t.prototype.fromJSON = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[2], e[3] = i[3], this
    }, t.prototype.toJSON = function(t) {
        t || (t = {});
        var e = this.elements,
            i = t.elements || (t.elements = []);
        return i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], t
    }, t.prototype.toString = function() {
        var t = this.elements;
        return "Mat2[ " + t[0] + ", " + t[2] + "]\n" + "     [ " + t[1] + ", " + t[3] + "]"
    }, t
}), define("math/mat3", [], function() {
    function t(t, e, i, o, r, n, s, h, a) {
        var p = new Float32Array(9);
        this.elements = p, p[0] = void 0 !== t ? t : 1, p[3] = e || 0, p[6] = i || 0, p[1] = o || 0, p[4] = void 0 !== r ? r : 1, p[7] = n || 0, p[2] = s || 0, p[5] = h || 0, p[8] = void 0 !== a ? a : 1
    }
    var e = Math.cos,
        i = Math.sin;
    return t.prototype.clone = function() {
        var e = this.elements;
        return new t(e[0], e[3], e[6], e[1], e[4], e[7], e[2], e[5], e[8])
    }, t.prototype.copy = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[2], e[3] = i[3], e[4] = i[4], e[5] = i[5], e[6] = i[6], e[7] = i[7], e[8] = i[8], this
    }, t.prototype.set = function(t, e, i, o, r, n, s, h, a) {
        var p = this.elements;
        return p[0] = t, p[3] = e, p[6] = i, p[1] = o, p[4] = r, p[7] = n, p[2] = s, p[5] = h, p[8] = a, this
    }, t.prototype.mul = function(t) {
        var e = this.elements,
            i = t.elements,
            o = e[0],
            r = e[3],
            n = e[6],
            s = e[1],
            h = e[4],
            a = e[7],
            p = e[2],
            c = e[5],
            u = e[8],
            m = i[0],
            f = i[3],
            l = i[6],
            d = i[1],
            y = i[4],
            v = i[7],
            g = i[2],
            x = i[5],
            w = i[8];
        return e[0] = o * m + s * f + p * l, e[3] = r * m + h * f + c * l, e[6] = n * m + a * f + u * l, e[1] = o * d + s * y + p * v, e[4] = r * d + h * y + c * v, e[7] = n * d + a * y + u * v, e[2] = o * g + s * x + p * w, e[5] = r * g + h * x + c * w, e[8] = n * g + a * x + u * w, this
    }, t.prototype.mmul = function(t, e) {
        var i = this.elements,
            o = t.elements,
            r = e.elements,
            n = o[0],
            s = o[3],
            h = o[6],
            a = o[1],
            p = o[4],
            c = o[7],
            u = o[2],
            m = o[5],
            f = o[8],
            l = r[0],
            d = r[3],
            y = r[6],
            v = r[1],
            g = r[4],
            x = r[7],
            w = r[2],
            b = r[5],
            S = r[8];
        return i[0] = n * l + a * d + u * y, i[3] = s * l + p * d + m * y, i[6] = h * l + c * d + f * y, i[1] = n * v + a * g + u * x, i[4] = s * v + p * g + m * x, i[7] = h * v + c * g + f * x, i[2] = n * w + a * b + u * S, i[5] = s * w + p * b + m * S, i[8] = h * w + c * b + f * S, this
    }, t.prototype.smul = function(t) {
        var e = this.elements;
        return e[0] *= t, e[1] *= t, e[2] *= t, e[3] *= t, e[4] *= t, e[5] *= t, e[6] *= t, e[7] *= t, e[8] *= t, this
    }, t.prototype.sdiv = function(t) {
        var e = this.elements;
        return t = 0 === t ? 0 : 1 / t, e[0] *= t, e[1] *= t, e[2] *= t, e[3] *= t, e[4] *= t, e[5] *= t, e[6] *= t, e[7] *= t, e[8] *= t, this
    }, t.prototype.identity = function() {
        var t = this.elements;
        return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, this
    }, t.prototype.zero = function() {
        var t = this.elements;
        return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 0, this
    }, t.prototype.determinant = function() {
        var t = this.elements,
            e = t[0],
            i = t[1],
            o = t[2],
            r = t[3],
            n = t[4],
            s = t[5],
            h = t[6],
            a = t[7],
            p = t[8];
        return e * n * p - e * s * a - i * r * p + i * s * h + o * r * a - o * n * h
    }, t.prototype.inverse = function() {
        var t = this.elements,
            e = t[0],
            i = t[3],
            o = t[6],
            r = t[1],
            n = t[4],
            s = t[7],
            h = t[2],
            a = t[5],
            p = t[8],
            c = n * p - s * a,
            u = o * a - i * p,
            m = i * s - o * n,
            f = e * c + r * u + h * m;
        return f = 0 !== f ? 1 / f : 1, t[0] = c * f, t[1] = (s * h - r * p) * f, t[2] = (r * a - n * h) * f, t[3] = u * f, t[4] = (e * p - o * h) * f, t[5] = (i * h - e * a) * f, t[6] = m * f, t[7] = (o * r - e * s) * f, t[8] = (e * n - i * r) * f, this
    }, t.prototype.inverseMat = function(t) {
        var e = this.elements,
            i = t.elements,
            o = i[0],
            r = i[3],
            n = i[6],
            s = i[1],
            h = i[4],
            a = i[7],
            p = i[2],
            c = i[5],
            u = i[8],
            m = h * u - a * c,
            f = n * c - r * u,
            l = r * a - n * h,
            d = o * m + s * f + p * l;
        return d = 0 !== d ? 1 / d : 0, e[0] = m * d, e[1] = (a * p - s * u) * d, e[2] = (s * c - h * p) * d, e[3] = f * d, e[4] = (o * u - n * p) * d, e[5] = (r * p - o * c) * d, e[6] = l * d, e[7] = (n * s - o * a) * d, e[8] = (o * h - r * s) * d, this
    }, t.prototype.inverseMat4 = function(t) {
        var e = this.elements,
            i = t.elements,
            o = i[0],
            r = i[4],
            n = i[8],
            s = i[1],
            h = i[5],
            a = i[9],
            p = i[2],
            c = i[6],
            u = i[10],
            m = u * h - c * a,
            f = -u * r + c * n,
            l = a * r - h * n,
            d = o * m + s * f + p * l;
        return d = 0 !== d ? 1 / d : 0, e[0] = m * d, e[1] = (-u * s + p * a) * d, e[2] = (c * s - p * h) * d, e[3] = f * d, e[4] = (u * o - p * n) * d, e[5] = (-c * o + p * r) * d, e[6] = l * d, e[7] = (-a * o + s * n) * d, e[8] = (h * o - s * r) * d, this
    }, t.prototype.transpose = function() {
        var t, e = this.elements;
        return t = e[1], e[1] = e[3], e[3] = t, t = e[2], e[2] = e[6], e[6] = t, t = e[5], e[5] = e[7], e[7] = t, this
    }, t.prototype.setTrace = function(t) {
        var e = this.elements;
        return e[0] = t.x, e[4] = t.y, e[8] = t.z, this
    }, t.prototype.scale = function(t) {
        var e = this.elements,
            i = t.x,
            o = t.y,
            r = t.z;
        return e[0] *= i, e[3] *= o, e[6] *= r, e[1] *= i, e[4] *= o, e[7] *= r, e[2] *= i, e[5] *= o, e[8] *= r, this
    }, t.prototype.makeScale = function(t, e, i) {
        return this.set(t, 0, 0, 0, e, 0, 0, 0, i)
    }, t.prototype.makeRotationX = function(t) {
        var o = e(t),
            r = i(t);
        return this.set(1, 0, 0, 0, o, -r, 0, r, o)
    }, t.prototype.makeRotationY = function(t) {
        var o = e(t),
            r = i(t);
        return this.set(o, 0, r, 0, 1, 0, -r, 0, o)
    }, t.prototype.makeRotationZ = function(t) {
        var o = e(t),
            r = i(t);
        return this.set(o, -r, 0, r, o, 0, 0, 0, 1)
    }, t.prototype.fromMat2 = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = 0, e[3] = i[2], e[4] = i[3], e[5] = 0, e[6] = 0, e[7] = 0, e[8] = 1, this
    }, t.prototype.fromMat4 = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[2], e[3] = i[4], e[4] = i[5], e[5] = i[6], e[6] = i[8], e[7] = i[9], e[8] = i[10], this
    }, t.prototype.fromQuat = function(t) {
        var e = this.elements,
            i = t.x,
            o = t.y,
            r = t.z,
            n = t.w,
            s = i + i,
            h = o + o,
            a = r + r,
            p = i * s,
            c = i * h,
            u = i * a,
            m = o * h,
            f = o * a,
            l = r * a,
            d = n * s,
            y = n * h,
            v = n * a;
        return e[0] = 1 - (m + l), e[1] = c + v, e[2] = u - y, e[3] = c - v, e[4] = 1 - (p + l), e[5] = f + d, e[6] = u + y, e[7] = f - d, e[8] = 1 - (p + m), this
    }, t.prototype.fromJSON = function(t) {
        var e = this.elements,
            i = t.elements;
        return e[0] = i[0], e[1] = i[1], e[2] = i[2], e[3] = i[3], e[4] = i[4], e[5] = i[5], e[6] = i[6], e[7] = i[7], e[8] = i[8], this
    }, t.prototype.toJSON = function(t) {
        t || (t = {});
        var e = this.elements,
            i = t.elements || (t.elements = []);
        return i[0] = e[0], i[1] = e[1], i[2] = e[2], i[3] = e[3], i[4] = e[4], i[5] = e[5], i[6] = e[6], i[7] = e[7], i[8] = e[8], t
    }, t.prototype.toString = function() {
        var t = this.elements;
        return "Mat3[" + t[0] + ", " + t[3] + ", " + t[6] + "]\n" + "     [" + t[1] + ", " + t[4] + ", " + t[7] + "]\n" + "     [" + t[2] + ", " + t[5] + ", " + t[8] + "]"
    }, t
}), define("math/vec4", [], function() {
    function t(t, e, i, o) {
        this.x = t || 0, this.y = e || 0, this.z = i || 0, this.w = void 0 !== o ? o : 1
    }
    var e = Math.sqrt;
    return t.prototype.clone = function() {
        return new t(this.x, this.y, this.z, this.w)
    }, t.prototype.copy = function(t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w, this
    }, t.prototype.set = function(t, e, i, o) {
        return this.x = t, this.y = e, this.z = i, this.w = o, this
    }, t.prototype.add = function(t) {
        return this.x += t.x, this.y += t.y, this.z += t.z, this.w += t.w, this
    }, t.prototype.vadd = function(t, e) {
        return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this.w = t.w + e.w, this
    }, t.prototype.sadd = function(t) {
        return this.x += t, this.y += t, this.z += t, this.w += t, this
    }, t.prototype.sub = function(t) {
        return this.x -= t.x, this.y -= t.y, this.z -= t.z, this.w -= t.w, this
    }, t.prototype.vsub = function(t, e) {
        return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this.w = t.w - e.w, this
    }, t.prototype.ssub = function(t) {
        return this.x -= t, this.y -= t, this.z -= t, this.w -= t, this
    }, t.prototype.mul = function(t) {
        return this.x *= t.x, this.y *= t.y, this.z *= t.z, this.w *= t.w, this
    }, t.prototype.vmul = function(t, e) {
        return this.x = t.x * e.x, this.y = t.y * e.y, this.z = t.z * e.z, this.w = t.w * e.w, this
    }, t.prototype.smul = function(t) {
        return this.x *= t, this.y *= t, this.z *= t, this.w *= t, this
    }, t.prototype.div = function(t) {
        var e = t.x,
            i = t.y,
            o = t.z,
            r = t.w;
        return this.x *= 0 !== e ? 1 / e : 0, this.y *= 0 !== i ? 1 / i : 0, this.z *= 0 !== o ? 1 / o : 0, this.w *= 0 !== r ? 1 / r : 0, this
    }, t.prototype.vdiv = function(t, e) {
        var i = e.x,
            o = e.y,
            r = e.z,
            n = e.w;
        return this.x = 0 !== i ? t.x / i : 0, this.y = 0 !== o ? t.y / o : 0, this.z = 0 !== r ? t.z / r : 0, this.w = 0 !== n ? t.w / n : 0, this
    }, t.prototype.sdiv = function(t) {
        return t = 0 === t ? 0 : 1 / t, this.x *= t, this.y *= t, this.z *= t, this.w *= t, this
    }, t.prototype.length = function() {
        var t = this.x,
            i = this.y,
            o = this.z,
            r = this.w,
            n = t * t + i * i + o * o + r * r;
        return 1 === n ? 1 : n > 0 ? e(n) : 0
    }, t.prototype.lengthSq = function() {
        var t = this.x,
            e = this.y,
            i = this.z,
            o = this.w;
        return t * t + e * e + i * i + o * o
    }, t.prototype.setLength = function(t) {
        var i = this.x,
            o = this.y,
            r = this.z,
            n = this.w,
            s = i * i + o * o + r * r + n * n;
        return 1 === s ? (this.x *= t, this.y *= t, this.z *= t, this.w *= t, this) : (s = s > 0 ? 1 / e(s) : 0, this.x *= s * t, this.y *= s * t, this.z *= s * t, this.w *= s * t, this)
    }, t.prototype.normalize = function() {
        var t = this.x,
            i = this.y,
            o = this.z,
            r = this.w,
            n = t * t + i * i + o * o + r * r;
        return 1 === n ? this : (n = n > 0 ? 1 / e(n) : 0, this.x *= n, this.y *= n, this.z *= n, this.w *= n, this)
    }, t.prototype.inverse = function() {
        return this.x *= -1, this.y *= -1, this.z *= -1, this.w *= -1, this
    }, t.prototype.inverseVec = function(t) {
        return this.x = -t.x, this.y = -t.y, this.z = -t.z, this.w = -t.w, this
    }, t.prototype.lerp = function(t, e) {
        return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this.w += (t.w - this.w) * e, this
    }, t.prototype.vlerp = function(t, e, i) {
        var o = t.x,
            r = t.y,
            n = t.z,
            s = t.w;
        return this.x = o + (e.x - o) * i, this.y = r + (e.y - r) * i, this.z = n + (e.z - n) * i, this.w = s + (e.w - s) * i, this
    }, t.vdot = t.prototype.vdot = function(t, e) {
        return t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w
    }, t.prototype.dot = function(t) {
        return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w
    }, t.prototype.min = function(t) {
        var e = this.x,
            i = this.y,
            o = this.z,
            r = this.w,
            n = t.x,
            s = t.y,
            h = t.z,
            a = this.w;
        return this.x = e > n ? n : e, this.y = i > s ? s : i, this.z = o > h ? h : o, this.w = r > a ? a : r, this
    }, t.prototype.max = function(t) {
        var e = this.x,
            i = this.y,
            o = this.z,
            r = this.w,
            n = t.x,
            s = t.y,
            h = t.z,
            a = this.w;
        return this.x = n > e ? n : e, this.y = s > i ? s : i, this.z = h > o ? h : o, this.w = a > r ? a : r, this
    }, t.prototype.clamp = function(t, e) {
        var i = this.x,
            o = this.y,
            r = this.z,
            n = this.w,
            s = t.x,
            h = t.y,
            a = t.z,
            p = t.w,
            c = e.x,
            u = e.y,
            m = e.z,
            f = f;
        return this.x = s > i ? s : i > c ? c : i, this.y = h > o ? h : o > u ? u : o, this.z = a > r ? a : r > m ? m : r, this.w = p > n ? p : n > f ? f : n, this
    }, t.prototype.transformMat4 = function(t) {
        var e = t.elements,
            i = this.x,
            o = this.y,
            r = this.z,
            n = this.w;
        return this.x = i * e[0] + o * e[4] + r * e[8] + n * e[12], this.y = i * e[1] + o * e[5] + r * e[9] + n * e[13], this.z = i * e[2] + o * e[6] + r * e[10] + n * e[14], this.w = i * e[3] + o * e[7] + r * e[11] + n * e[15], this
    }, t.prototype.fromVec2 = function(t) {
        return this.x = t.x, this.y = t.y, this.z = 0, this.w = 1, this
    }, t.prototype.fromVec3 = function(t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this.w = 1, this
    }, t.prototype.positionFromMat4 = function(t) {
        var e = t.elements;
        return this.x = e[12], this.y = e[13], this.z = e[14], this.w = e[15], this
    }, t.prototype.fromJSON = function(t) {
        return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w, this
    }, t.prototype.toJSON = function(t) {
        return t || (t = {}), t.x = this.x, t.y = this.y, t.z = this.z, t.w = this.w, t
    }, t.prototype.toString = function() {
        return "Vec4( " + this.x + ", " + this.y + ", " + this.z + ", " + this.w + " )"
    }, t
}), define("odin", ["require", "base/class", "base/device", "base/dom", "base/event_emitter", "base/object_pool", "base/request_animation_frame", "base/time", "core/assets/asset", "core/assets/asset_loader", "core/assets/assets", "core/assets/audio_clip", "core/assets/sprite_sheet", "core/assets/texture", "core/components/audio_source", "core/components/camera", "core/components/camera2d", "core/components/component", "core/components/sprite2d", "core/components/transform", "core/components/transform2d", "core/game/game", "core/game/client_game", "core/game/log", "core/input/handler", "core/input/input", "core/rendering/canvas_renderer_2d", "core/rendering/webgl_renderer_2d", "core/game_object", "core/scene", "math/aabb2", "math/aabb3", "math/color", "math/mat2", "math/mat3", "math/mat32", "math/mat4", "math/mathf", "math/quat", "math/vec2", "math/vec3", "math/vec4"], function(t) {
    function e() {
        this.Class = t("base/class"), this.Device = t("base/device"), this.Dom = t("base/dom"), this.EventEmitter = t("base/event_emitter"), this.ObjectPool = t("base/object_pool"), this.requestAnimationFrame = t("base/request_animation_frame"), this.Time = t("base/time"), this.Asset = t("core/assets/asset"), this.AssetLoader = t("core/assets/asset_loader"), this.Assets = t("core/assets/assets"), this.AudioClip = t("core/assets/audio_clip"), this.SpriteSheet = t("core/assets/sprite_sheet"), this.Texture = t("core/assets/texture"), this.AudioSource = t("core/components/audio_source"), this.Camera = t("core/components/camera"), this.Camera2D = t("core/components/camera2d"), this.Component = t("core/components/component"), this.Sprite2D = t("core/components/sprite2d"), this.Transform = t("core/components/transform"), this.Transform2D = t("core/components/transform2d"), this.Game = t("core/game/game"), this.ClientGame = t("core/game/client_game"), this.Log = t("core/game/log"), this.Handler = t("core/input/handler"), this.Input = t("core/input/input"), this.CanvasRenderer2D = t("core/rendering/canvas_renderer_2d"), this.WebGLRenderer2D = t("core/rendering/webgl_renderer_2d"), this.GameObject = t("core/game_object"), this.Scene = t("core/scene"), this.AABB2 = t("math/aabb2"), this.AABB3 = t("math/aabb3"), this.Color = t("math/color"), this.Mat2 = t("math/mat2"), this.Mat3 = t("math/mat3"), this.Mat32 = t("math/mat32"), this.Mat4 = t("math/mat4"), this.Mathf = t("math/mathf"), this.Quat = t("math/quat"), this.Vec2 = t("math/vec2"), this.Vec3 = t("math/vec3"), this.Vec4 = t("math/vec4"), this.Device.mobile && (window.onerror = function(t, e, i) {
            alert("line: " + i + ", page: " + e + "\nmessage: " + t)
        })
    }
    return e.prototype.globalize = function() {
        for (var t in this) window[t] = this[t];
        window.Odin = this
    }, new e
});
