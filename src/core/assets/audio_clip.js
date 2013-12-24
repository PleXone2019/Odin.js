if (typeof define !== 'function') {
    var define = require('amdefine')(module)
}
define([
        "base/audio_ctx",
        "core/assets/asset"
    ],
    function(AudioCtx, Asset) {
        "use strict";


        var defineProperty = Object.defineProperty,
			fromCharCode = String.fromCharCode;


        function AudioClip(opts) {
            opts || (opts = {});

            Asset.call(this, opts);

            this.buffer = undefined;
        }

        AudioClip.type = "AudioClip";
        Asset.extend(AudioClip, Asset);


        defineProperty(AudioClip.prototype, "length", {
            get: function() {
                return this.buffer ? this.buffer.duration : 0;
            }
        });


        defineProperty(AudioClip.prototype, "samples", {
            get: function() {
                return this.buffer ? this.buffer.length : 0;
            }
        });


        defineProperty(AudioClip.prototype, "frequency", {
            get: function() {
                return this.buffer ? this.buffer.sampleRate : 44100;
            }
        });


        defineProperty(AudioClip.prototype, "channels", {
            get: function() {
                return this.buffer ? this.buffer.numberOfChannels : 0;
            }
        });


        AudioClip.prototype.getData = function(array, offset) {
            if (!this.buffer) return array;
            array || (array = []);

            return this.buffer.getChannelData(array, offset);
        };


        AudioClip.prototype.parse = function(raw) {
            Asset.prototype.parse.call(this, raw);

            this.buffer = AudioCtx.createBuffer(raw, false);
            return this;
        };


        AudioClip.prototype.toJSON = function(json, pack) {
			json || (json = {});
            Asset.prototype.toJSON.call(this, json, pack);
			
			if ((pack || !this.src) && this.raw) json.raw = arrayBufferToString(this.raw);
			
            return json;
        };


        AudioClip.prototype.fromJSON = function(json, pack) {
            Asset.prototype.fromJSON.call(this, json, pack);
			
			if ((pack || !this.src) && this.raw) this.raw = stringToArrayBuffer(json.raw);
			
            return this;
        };
		
		
		function arrayBufferToString(arrayBuffer) {
			return fromCharCode.apply(null, new Uint16Array(arrayBuffer));
		}
		
		
		function stringToArrayBuffer(str) {
			var len = str.length,
				arrayBuffer = new ArrayBuffer(len*2),
				array = new Uint16Array(arrayBuffer),
				i;
			
			for (i = len; i--;) array[i] = str.charCodeAt(i);
			return arrayBuffer;
		}


        return AudioClip;
    }
);