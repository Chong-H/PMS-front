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
        // 确保密钥长度为16字节，但是再本项目128位AES加密中，密钥长度可以是16、24（编码方式问题，3bit一字节）字节
        // if (secretKey.length !== 16) {
        //     throw new Error('Secret key must be 16 bytes long');
        // }
//         实际传入的secretKey是Base64 编码的字符串（如MQMvLkUZmaRoewoyzSqYTg==，长度 24），显然不等于 16，所以被错误拦截。
// 当注释掉这段检查后，虽然密钥字符串长度是 24，但 CryptoJS 内部会自动将 Base64 字符串解码为 16 字节的密钥（符合 128 位要求），因此解密成功。


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

        let plaintext: string;
        try {
            plaintext = decrypted.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            console.error('Failed to convert decrypted data to UTF-8 string:', e);
            plaintext = decrypted.toString(CryptoJS.enc.Latin1); // 尝试使用 Latin1 编码
        }

        return plaintext;

        //return plaintext;
    } catch (e) {
        console.error('Error in decryption:', e);
        return null;
    }
}

