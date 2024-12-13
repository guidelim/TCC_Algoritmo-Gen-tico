import jwt from 'jsonwebtoken';

export default async function generateRandomNonce(infos = '') {
    const randomBytes = new Uint8Array(16);
    window.crypto.getRandomValues(randomBytes);
    const tk = await generateNonceToken(Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join(''), infos);
    return tk
}
;
async function generateNonceToken(nonce: String, props: String) {
    try {
        const reqKey = process.env.SECRET_KEY;
        const token = jwt.sign({ nonce: nonce, infos: props }, reqKey);
        
        return token;   
    } catch (err) {
        console.log(err)
    }
}