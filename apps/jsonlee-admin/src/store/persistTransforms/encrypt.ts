import { createTransform } from 'redux-persist';
import CryptoJS from 'crypto-js';

const encryptTransform = <T>() => createTransform((inboundState) => {
  return CryptoJS.AES.encrypt(JSON.stringify(inboundState), import.meta.env.VITE_ENCRYPT_KEY).toString();
}, (outboundState) => {
  if (!outboundState) return {} as T;
  try{
    const res = CryptoJS.AES.decrypt(outboundState, import.meta.env.VITE_ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
    return JSON.parse(res) as T;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }catch (e) {
    return {} as T;
  }
});

export default encryptTransform;
