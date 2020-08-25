import { Duplex } from "readable-stream";
/**
 *  PortDuplexStream creates a stream both readable/writable with any objects.
 *
 * @class
 * @param {Object} port Remote Port object
 */
export default class PortDuplexStream extends Duplex {
    _port: any;
    constructor(port: any);
    /**
     * Callback triggered when a message is received from
     * the remote Port associated with this Stream.
     *
     * @private
     * @param {Object} msg - Payload from the onMessage listener of Port
     */
    _onMessage(msg: any): void;
    /**
     * Callback triggered when the remote Port
     * associated with this Stream disconnects.
     *
     * @private
     */
    _onDisconnect(): void;
    _read: () => void;
    /**
     * Called internally when data should be written to
     * this writable stream.
     *
     * @private
     * @param {*} msg Arbitrary object to write
     * @param {string} encoding Encoding to use when writing payload
     * @param {Function} cb Called when writing is complete or an error occurs
     */
    _write(msg: any, _encoding: any, cb: any): any;
}
