package space.wgao.proj2.utils;

import java.nio.ByteBuffer;

/**
 * Binary
 *
 * @author w.gao Copyright (c) 2018.05
 * @version 1.0
 */
public class Binary {

    public static int unpackShort(byte[] bytes) {

        return ((bytes[0] & 0xFF) << 8) + (bytes[1] & 0xFF);
    }

    public static byte[] packShort(int s) {

        return new byte[]{
                (byte) ((s >>> 8) & 0xFF),
                (byte) (s & 0xFF)
        };
    }

    public static int unpackInt(byte[] bytes) {

        return ((bytes[0] & 0xff) << 24) +
                ((bytes[1] & 0xff) << 16) +
                ((bytes[2] & 0xff) << 8) +
                (bytes[3] & 0xff);
    }

    public static byte[] packInt(int i) {

        return new byte[]{
                (byte) ((i >>> 24) & 0xFF),
                (byte) ((i >>> 16) & 0xFF),
                (byte) ((i >>> 8) & 0xFF),
                (byte) (i & 0xFF)
        };
    }

    public static float unpackFloat(byte[] bytes) {

        return unpackInt((bytes)) / 300;
    }

    public static byte[] packFloat(float f) {

        return packInt((int) (f * 300));
    }

    public static double unpackDouble(byte[] bytes) {

        return unpackInt(bytes) / 1e6;
    }

    public static byte[] packDouble(double d) {

        return packInt((int) (d * 1e6));
    }

    public static byte[] appendBytes(byte[] bytes1, byte[]... bytes2) {

        int length = bytes1.length;
        for (byte[] bytes : bytes2) {
            length += bytes.length;
        }

        ByteBuffer buffer = ByteBuffer.allocate(length);
        buffer.put(bytes1);

        for (byte[] bytes : bytes2) {
            buffer.put(bytes);
        }

        return buffer.array();
    }

    public static String hexDump(byte[] src) {

        StringBuilder stringBuilder = new StringBuilder();
        if (src == null || src.length <= 0) {
            return null;
        }

        for (byte b : src) {
            if (!(stringBuilder.length() == 0)) {
                stringBuilder.append(" ");
            }
            int v = b & 0xFF;
            String hv = Integer.toHexString(v);
            if (hv.length() < 2) {
                stringBuilder.append(0);
            }
            stringBuilder.append(hv);
        }

        return stringBuilder.toString().toUpperCase();
    }

}
