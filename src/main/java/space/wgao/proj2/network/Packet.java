package space.wgao.proj2.network;

import space.wgao.proj2.utils.Binary;

import java.util.Arrays;

/**
 * Packet
 *
 * @author w.gao Copyright (c) 2018.05
 * @version 1.0
 */
public abstract class Packet {

    protected int offset = 0;
    public byte[] buffer;

    public abstract byte getID();

    protected boolean eof() {

        return !(this.offset >= 0 && this.offset + 1 <= this.buffer.length);
    }

    protected byte[] unpack(int len) {

        if (len < 0) {
            this.offset = this.buffer.length - 1;
            return new byte[0];
        }

        byte[] buffer = new byte[len];
        for (int i = 0; i < len; i++) {
            buffer[i] = this.buffer[this.offset++];
        }

        return buffer;
    }

    protected byte[] unpack() {

        try {
            return Arrays.copyOfRange(this.buffer, this.offset, this.buffer.length - 1);
        } catch (Exception e) {
            return new byte[0];
        }
    }

    protected void pack(byte[] b) {

        this.buffer = Binary.appendBytes(this.buffer, b);
    }

    protected byte unpackByte() {

        return this.buffer[this.offset++];
    }

    protected void packByte(byte b) {

        byte[] newBytes = new byte[this.buffer.length + 1];
        System.arraycopy(this.buffer, 0, newBytes, 0, this.buffer.length);
        newBytes[this.buffer.length] = b;
        this.buffer = newBytes;
    }

    protected int unpackShort() {

        return Binary.unpackShort(this.unpack(2));
    }

    protected void packShort(int v) {

        this.pack(Binary.packShort(v));
    }

    protected int unpackInt() {

        return Binary.unpackInt(this.unpack(4));
    }

    protected void packInt(int v) {

        this.pack(Binary.packInt(v));
    }

    protected float unpackFloat() {

        return Binary.unpackFloat(this.unpack(4));
    }

    protected void packFloat(float f) {

        this.pack(Binary.packFloat(f));
    }

    protected double unpackDouble() {

        return Binary.unpackDouble(this.unpack(4));
    }

    protected void packDouble(double d) {

        this.pack(Binary.packDouble(d));
    }

    protected String unpackString() {

        int length = this.unpackShort();
        StringBuilder str = new StringBuilder();
        for (int i = 0; i < length; i++) {
            str.append((char) this.unpackShort());
        }

        return str.toString();
    }

    protected void packString(String str) {

        this.packShort(str.length());
        for (char c : str.toCharArray()) {
            this.packShort(c);
        }
    }

    public void encode() {

        this.buffer = new byte[]{getID()};
    }

    public void decode() {

        this.offset = 1;
    }

}
