package space.wgao.proj2.network;

/**
 * LoginPacket
 *
 * @author w.gao Copyright (c) 2018.05
 * @version 1.0
 */
public class LoginPacket extends Packet {

    public String username;

    public byte getID() {

        return CommCode.LOGIN;
    }

    public void decode() {

        super.decode();

        this.username = this.unpackString();
    }
}
