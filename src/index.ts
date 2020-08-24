import { Duplex } from "readable-stream";

const noop = () => {};

/**
 *  PortDuplexStream creates a stream both readable/writable with any objects.
 *
 * @class
 * @param {Object} port Remote Port object
 */
export default class PortDuplexStream extends Duplex {
  _port: any;
  constructor(port: any) {
    super();
    Duplex.call(this, {
      objectMode: true,
    });
    this._port = port;
    port.onMessage.addListener(this._onMessage.bind(this));
    port.onDisconnect.addListener(this._onDisconnect.bind(this));
  }

  /**
   * Callback triggered when a message is received from
   * the remote Port associated with this Stream.
   *
   * @private
   * @param {Object} msg - Payload from the onMessage listener of Port
   */
  _onMessage(msg: any) {
    if (Buffer.isBuffer(msg)) {
      //   delete msg._isBuffer;
      var data = new Buffer(msg);
      this.push(data);
    } else {
      this.push(msg);
    }
  }

  /**
   * Callback triggered when the remote Port
   * associated with this Stream disconnects.
   *
   * @private
   */
  _onDisconnect() {
    this.destroy();
  }

  // read operations noop
  _read = noop;

  /**
   * Called internally when data should be written to
   * this writable stream.
   *
   * @private
   * @param {*} msg Arbitrary object to write
   * @param {string} encoding Encoding to use when writing payload
   * @param {Function} cb Called when writing is complete or an error occurs
   */
  _write(msg: any, _encoding: any, cb: any) {
    try {
      if (Buffer.isBuffer(msg)) {
        var data = msg.toJSON() as any;
        data._isBuffer = true;
        this._port.postMessage(data);
      } else {
        this._port.postMessage(msg);
      }
    } catch (err) {
      return cb(new Error("PortDuplexStream - disconnected"));
    }
    cb();
  }
}
