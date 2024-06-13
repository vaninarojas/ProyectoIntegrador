import path from 'path';


const config = {
    SERVER: 'remoto_atlas',
    PORT: 5050,
    
    DIRNAME: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/img` },
    MONGODB_URI: "mongodb+srv://coder_53160:coder2024@clustercoder.rtpeudw.mongodb.net/coder_53160",
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
    SECRET: "vani123_secret",
    PRODUCTS_PER_PAGE: 5,
    GITHUB_CLIENT_ID: 'Iv23lilDgWaLLc4w6fq1',
    GITHUB_CLIENT_SECRET: 'ce482817486d230f6b103334bfa317515d3f02bd',
    GITHUB_CALLBACK_URL: 'http://localhost:5050/api/sessions/ghlogincallback'
}


export default config;