package space.wgao.proj2.network;

/**
 * TextPacket
 *
 * @author w.gao Copyright (c) 2018.05
 * @version 1.0
 */
public class TextPacket extends Packet {

    public String sender;
    public String message;

    public byte getID() {

        return CommCode.TEXT;
    }

    public void encode() {

        super.encode();

        this.packString(this.sender);
        this.packString(this.message);

    }

    public void decode() {

        super.decode();

        this.sender = this.unpackString();
        this.message = this.unpackString();
    }
}
