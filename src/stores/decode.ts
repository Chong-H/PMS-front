import CryptoJS from 'crypto-js';

const ALGORITHM = 'AES';
const IV = '1234567890123456'; // 初始化向量，必须是16字节

/**
 * AES解密
 * @param encryptedData 待解密数据（Base64编码）
 * @param secretKey 密钥（16字节）
 * @returns 解密后的数据
 */
export function decrypt(encryptedData: string, secretKey: string): string | null {
    try {
        // 确保密钥长度为16字节
        if (secretKey.length !== 16) {
            throw new Error('Secret key must be 16 bytes long');
        }

        // 将密钥和IV转换为WordArray
        const key = CryptoJS.enc.Utf8.parse(secretKey);
        const iv = CryptoJS.enc.Utf8.parse(IV);

        // 解密数据
        const decrypted = CryptoJS.AES.decrypt(
            encryptedData,
            key,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        // 将解密后的数据转换为字符串
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

        return decryptedText;
    } catch (e) {
        console.error('Error in decryption:', e);
        return null;
    }
}

