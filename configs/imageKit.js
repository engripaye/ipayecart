import ImageKit from "@imagekit/nodejs";

export const imageKit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndPoint: process.env.IMAGEKIT_URL_ENDPOINT

});