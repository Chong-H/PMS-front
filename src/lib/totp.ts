import CryptoJS from 'crypto-js';

// RFC 4648 Base32 字母表（Google Authenticator / TOTP 标准）
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * 解码 Base32 字符串为字节数组
 * 自动忽略空格、小写转换为大写、忽略 '=' 填充
 */
export function base32Decode(input: string): Uint8Array {
  const clean = input.toUpperCase().replace(/[\s=]/g, '');
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (const ch of clean) {
    const idx = BASE32_ALPHABET.indexOf(ch);
    if (idx === -1) continue; // 忽略非法字符
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
}

function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (const b of bytes) hex += b.toString(16).padStart(2, '0');
  return hex;
}

function wordArrayToBytes(wa: CryptoJS.lib.WordArray): Uint8Array {
  const words = wa.words;
  const sigBytes = wa.sigBytes;
  const bytes: number[] = [];
  for (let i = 0; i < sigBytes; i++) {
    const wordIndex = i >>> 2;
    const byteIndex = (i & 3) << 3;
    bytes.push((words[wordIndex] >>> (24 - byteIndex)) & 0xff);
  }
  return new Uint8Array(bytes);
}

function intToBigEndianBytes(value: number): Uint8Array {
  const bytes = new Uint8Array(8);
  for (let i = 7; i >= 0; i--) {
    bytes[i] = value & 0xff;
    value = Math.floor(value / 256);
  }
  return bytes;
}

/**
 * 生成 TOTP 验证码（RFC 6238，HMAC-SHA1，默认 30 秒步长，6 位数字）
 * 与 Google Authenticator 兼容。
 *
 * @param secret   Base32 编码的共享密钥
 * @param timeStep 时间步长（秒），默认 30
 * @param digits   验证码位数，默认 6
 */
export function generateTOTP(secret: string, timeStep = 30, digits = 6): string {
  const keyBytes = base32Decode(secret);
  if (keyBytes.length === 0) {
    throw new Error('Invalid Base32 secret');
  }

  const counter = Math.floor(Date.now() / 1000 / timeStep);
  const counterBytes = intToBigEndianBytes(counter);

  const keyWordArray = CryptoJS.enc.Hex.parse(bytesToHex(keyBytes));
  const counterWordArray = CryptoJS.enc.Hex.parse(bytesToHex(counterBytes));

  // HMAC-SHA1 结果 20 字节
  const hmac = CryptoJS.HmacSHA1(counterWordArray, keyWordArray);
  const hmacBytes = wordArrayToBytes(hmac);

  // 动态截断（RFC 4226 §5.3）
  const offset = hmacBytes[hmacBytes.length - 1] & 0x0f;
  const binCode =
    ((hmacBytes[offset] & 0x7f) << 24) |
    ((hmacBytes[offset + 1] & 0xff) << 16) |
    ((hmacBytes[offset + 2] & 0xff) << 8) |
    (hmacBytes[offset + 3] & 0xff);

  const otp = binCode % Math.pow(10, digits);
  return otp.toString().padStart(digits, '0');
}
