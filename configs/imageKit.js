import ImageKit from "@imagekit/nodejs";

export const imageKit = new ImageKit({
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});