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
//     try {
//         // 确保密钥长度为16字节，但是再本项目128位AES加密中，密钥长度可以是16、24（编码方式问题，3bit一字节）字节
//         // if (secretKey.length !== 16) {
//         //     throw new Error('Secret key must be 16 bytes long');
//         // }
// //         实际传入的secretKey是Base64 编码的字符串（如MQMvLkUZmaRoewoyzSqYTg==，长度 24），显然不等于 16，所以被错误拦截。
// // 当注释掉这段检查后，虽然密钥字符串长度是 24，但 CryptoJS 内部会自动将 Base64 字符串解码为 16 字节的密钥（符合 128 位要求），因此解密成功。


//         // 将密钥和IV转换为WordArray
//         const key = CryptoJS.enc.Utf8.parse(secretKey);
//         //const key = CryptoJS.enc.Base64.parse(secretKey);
//         // const iv = CryptoJS.enc.Utf8.parse(IV);
//         const ivWordArray = CryptoJS.enc.Utf8.parse("1234567890123456");

//         // 解密数据
//         const decrypted = CryptoJS.AES.decrypt(
//             encryptedData,
           
//             key,
//             {
//                 iv: ivWordArray,
//                 mode: CryptoJS.mode.CBC,
//                 padding: CryptoJS.pad.Pkcs7
//             }
//         );

//         let plaintext: string;
//         try {
//             plaintext = decrypted.toString(CryptoJS.enc.Utf8);
//         } catch (e) {
//             console.error('Failed to convert decrypted data to UTF-8 string:', e);
//             plaintext = decrypted.toString(CryptoJS.enc.Latin1); // 尝试使用 Latin1 编码
//         }

//         return plaintext;

//         //return plaintext;
//     } catch (e) {
//         console.error('Error in decryption:', e);
//         return null;
//     }
const key = CryptoJS.enc.Utf8.parse(secretKey); // secretKey 与后端完全一致
const ivWordArray = CryptoJS.enc.Utf8.parse("1234567890123456");

const decrypted = CryptoJS.AES.decrypt(
    encryptedData,
    key,
    {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }
);

return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 根据 classify 和 base key 派生实际 AES 密钥
 * 对应后端 C# GenerateKey 逻辑：
 *   1. 去掉 classify 中的中文字符
 *   2. 将剩余字母数字逐字节替换到 key 的对应位置
 */
export function generateKey(classify: string | null | undefined, baseKey: string): string {
  if (!classify || !baseKey) return baseKey;
  const filtered = classify.trim().replace(/[\u4e00-\u9fa5]/g, '');
  const keyBytes: number[] = [];
  for (let i = 0; i < baseKey.length; i++) {
    keyBytes.push(baseKey.charCodeAt(i));
  }
  for (let i = 0; i < filtered.length && i < keyBytes.length; i++) {
    const ch = filtered[i];
    if (/[a-zA-Z0-9]/.test(ch)) {
      keyBytes[i] = ch.charCodeAt(0);
    }
  }
  return String.fromCharCode(...keyBytes);
}

