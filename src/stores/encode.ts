// import { createCipheriv } from 'crypto';

// const encrypt = (data: string, publicKey: string): string => {
//   const buffer = Buffer.from(data, 'utf8');
//   const encrypted = createCipheriv('RSA_public', publicKey, null).update(buffer);
//   return encrypted.toString('base64');
// };

// // 示例
// const publicKey = 'your-public-key';
// const data = 'Hello, RSA!';
// const encrypted = encrypt(data, publicKey);
// console.log('Encrypted:', encrypted);