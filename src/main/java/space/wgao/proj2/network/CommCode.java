package space.wgao.proj2.network;

/**
 * CommCode
 *
 * @author w.gao Copyright (c) 2018.05
 * @version 1.0
 */
public interface CommCode {

    // ping server
    // C->S
    byte PING = 0x00,

    // response to PING
    // S->C
    PONG = 0x01,

    // request to establish a game session
    // C->S
    // payload: clientVersion(int)
    CONNECT_REQUEST = 0x02,

    // response to CONNECT_REQUEST
    // S->C
    // payload: canConnect(byte|boolean)
    CONNECT_RESPONSE = 0x03,

    // request to log into the server
    // C->S
    // payload: name(string)
    LOGIN = 0x04,

    // login status
    // S->C
    // payload: status(int)
    LOGIN_STATUS = 0x05,

    // text message transfer between server and client
    // C->S
    // S->C
    // payload: sender(string)
    //          payload(string)
    TEXT = 0x06;

}
