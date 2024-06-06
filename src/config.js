import path from 'path';


const config = {
    SERVER: 'remoto_atlas',
    PORT: 5050,
    
    DIRNAME: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/img` },
    MONGODB_URI: "mongodb+srv://coder_53160:coder2024@clustercoder.rtpeudw.mongodb.net/coder_53160",
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
    SECRET: "vani123_secret",
    PRODUCTS_PER_PAGE: 5
}

export default config;