"use strict";

let webSocket;

$(function() {

    // Initialize a socket connection
    setupSocket();
});

const CommCode = {
    PING: 0x00,
    PONG: 0x01,
    CONNECT_REQUEST: 0x02,
    CONNECT_RESPONSE: 0x03,
    LOGIN: 0x04,
    LOGIN_STATUS: 0x05,
    TEXT: 0x06,
};

let Packet = {
    // length:
    //  - byte +1
    //  - short +2
    //  - int +4
    //  - double +4
    //  - float +4
    //  - string 2+2*strLen
    encode: function (length) {
        this.buffer = new Uint8Array(length);
        this.idx = 0;
        this.packByte = function (b) {
            this.buffer[this.idx] = b & 255;
            this.idx++;
        };
        this.packShort = function (s) {
            this.buffer[this.idx] = (s >>> 8) & 255;
            this.buffer[this.idx + 1] = s & 255;
            this.idx += 2;
        };
        this.packInt = function (i) {
            this.buffer[this.idx] = ((i >>> 24) & 0xFF);
            this.buffer[this.idx + 1] = ((i >>> 16) & 0xFF);
            this.buffer[this.idx + 2] = ((i >>> 8) & 0xFF);
            this.buffer[this.idx + 3] = (i & 0xFF);
            this.idx += 4
        };
        this.packFloat = function (f) {
            this.packInt(f * 300)
        };
        this.packDouble = function (d) {
            this.packInt(d * 1e6)
        };
        this.packString = function (s) {
            this.packShort(s.length);
            for (let i = 0; i < s.length; i++) {
                this.packShort(s.charCodeAt(i))
            }
        }
    },
    decode: function (buffer) {
        this.buffer = new Uint8Array(buffer);
        this.idx = 0;
        this.eof = function () {
            return this.idx < this.buffer.length
        };
        this.unpackByte = function () {
            const i = this.idx;
            this.idx++;
            return this.buffer[i]
        };
        this.unpackShort = function () {
            const i = this.idx;
            this.idx += 2;
            return ((this.buffer[i] & 255) << 8) + (this.buffer[i + 1] & 255)
        };
        this.unpackInt = function () {
            const i = this.idx;
            this.idx += 4;
            return ((this.buffer[i] & 255) << 24)
                + ((this.buffer[i + 1] & 255) << 16)
                + ((this.buffer[i + 2] & 255) << 8)
                + ((this.buffer[i + 3] & 255))
        };
        this.unpackFloat = function () {
            return this.unpackInt() / 300
        };
        this.unpackDouble = function () {
            return this.unpackInt() / 1e6
        };
        this.unpackString = function () {

            const l = this.unpackShort();
            let str = '';
            for (let r = 0; r < l; r++) {
                const d = this.unpackShort();
                d > 0 && (str += String.fromCharCode(d))
            }
            return str;
        }
    }
};

function setupSocket() {

    $.get("server", function (data) {

        webSocket = new WebSocket(data);
        webSocket.binaryType = "arraybuffer";

        webSocket.onopen = onOpen;
        webSocket.onclose = onClose;
        webSocket.onmessage = onMessage;
        webSocket.onerror = function (ev) { console.log(ev); };

        function onOpen(evt) {

        }

        function onClose(evt) {

        }

        function onMessage(evt) {

            for (let i = new Packet.decode(evt.data); i.eof();) {
                switch (i.unpackByte()) {
                    case CommCode.TEXT:
                        displayMessage(i.unpackString(), i.unpackString());
                        break;
                }
            }
        }

    });
}

function sendLogin(username) {

    let pk = new Packet.encode(1 + 2 + 2 * username.length);
    pk.packByte(CommCode.LOGIN);
    pk.packString(username);

    webSocket.send(pk.buffer);
    return true;
}

function sendChat(message) {

    let username = 'Player';    // Placeholder for now

    let pk = new Packet.encode(1 + 2 + 2 * username.length + 2 + 2 * message.length);
    pk.packByte(CommCode.TEXT);
    pk.packString(username);
    pk.packString(message);

    webSocket.send(pk.buffer);
}
