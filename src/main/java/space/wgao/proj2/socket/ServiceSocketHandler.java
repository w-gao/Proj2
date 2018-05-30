package space.wgao.proj2.socket;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import space.wgao.proj2.client.Client;
import space.wgao.proj2.network.CommCode;
import space.wgao.proj2.network.LoginPacket;
import space.wgao.proj2.network.Packet;
import space.wgao.proj2.network.TextPacket;
import space.wgao.proj2.utils.Binary;

import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;

/**
 * ServiceSocketHandler
 *
 * @author w.gao Copyright (c) 2018.05
 * @version 1.0
 */
@WebSocket
public class ServiceSocketHandler {

    private static final Logger LOG = LoggerFactory.getLogger(ServiceSocketHandler.class);

    private static final Map<InetSocketAddress, Client> sessions = new HashMap<>();

    public static void broadcastPacket(Packet packet) {

        for (Client client : sessions.values()) {
            client.sendPacket(packet);
        }
    }

    @OnWebSocketConnect
    public void onConnect(Session session) {

        sessions.put(session.getRemoteAddress(), new Client(session));
        System.out.println(session.getRemoteAddress() + " -]-- Connected");
    }

    @OnWebSocketClose
    public void onDisconnect(Session session, int statusCode, String reason) {

        sessions.remove(session.getRemoteAddress());
        System.out.println(session.getRemoteAddress() + " -]-- Disconnected (status: " + statusCode + ",reason: " + reason + ")");
    }

    @OnWebSocketMessage
    public void onMessage(Session session, String buffer) {

        System.out.println(session.getRemoteAddress() + " -]-- Received String data: " + buffer);
    }

    @OnWebSocketMessage
    public void onByteArrayMessage(Session session, byte[] buffer, int offset, int length) {

        System.out.println(session.getRemoteAddress() + " -]-- Received binary data: ");
        System.out.println(Binary.hexDump(buffer));

        Client client = sessions.get(session.getRemoteAddress());

        Packet pk;

        switch (buffer[0]) {

            case CommCode.LOGIN:
                pk = new LoginPacket();
                pk.buffer = buffer;
                pk.decode();
                client.handleLogin((LoginPacket) pk);
                break;
            case CommCode.TEXT:
                pk = new TextPacket();
                pk.buffer = buffer;
                pk.decode();
                client.handleText((TextPacket) pk);
                break;
        }

    }

    @OnWebSocketError
    public void onError(Session session, Throwable error) {

        LOG.warn(session.getRemoteAddress() + " -]-- Error: " + error.getMessage());
//        error.printStackTrace();
    }

}
