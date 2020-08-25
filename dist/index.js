"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var readable_stream_1 = require("readable-stream");
var noop = function () { };
/**
 *  PortDuplexStream creates a stream both readable/writable with any objects.
 *
 * @class
 * @param {Object} port Remote Port object
 */
var PortDuplexStream = /** @class */ (function (_super) {
    __extends(PortDuplexStream, _super);
    function PortDuplexStream(port) {
        var _this = _super.call(this) || this;
        // read operations noop
        _this._read = noop;
        readable_stream_1.Duplex.call(_this, {
            objectMode: true,
        });
        _this._port = port;
        port.onMessage.addListener(_this._onMessage.bind(_this));
        port.onDisconnect.addListener(_this._onDisconnect.bind(_this));
        return _this;
    }
    /**
     * Callback triggered when a message is received from
     * the remote Port associated with this Stream.
     *
     * @private
     * @param {Object} msg - Payload from the onMessage listener of Port
     */
    PortDuplexStream.prototype._onMessage = function (msg) {
        if (Buffer.isBuffer(msg)) {
            //   delete msg._isBuffer;
            var data = new Buffer(msg);
            this.push(data);
        }
        else {
            this.push(msg);
        }
    };
    /**
     * Callback triggered when the remote Port
     * associated with this Stream disconnects.
     *
     * @private
     */
    PortDuplexStream.prototype._onDisconnect = function () {
        this.destroy();
    };
    /**
     * Called internally when data should be written to
     * this writable stream.
     *
     * @private
     * @param {*} msg Arbitrary object to write
     * @param {string} encoding Encoding to use when writing payload
     * @param {Function} cb Called when writing is complete or an error occurs
     */
    PortDuplexStream.prototype._write = function (msg, _encoding, cb) {
        try {
            if (Buffer.isBuffer(msg)) {
                var data = msg.toJSON();
                data._isBuffer = true;
                this._port.postMessage(data);
            }
            else {
                this._port.postMessage(msg);
            }
        }
        catch (err) {
            return cb(new Error("PortDuplexStream - disconnected"));
        }
        cb();
    };
    return PortDuplexStream;
}(readable_stream_1.Duplex));
exports.default = PortDuplexStream;
//# sourceMappingURL=index.js.map