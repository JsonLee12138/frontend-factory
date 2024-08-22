import { createTransform } from 'redux-persist';
import CryptoJS from 'crypto-js';

const encryptTransform = createTransform((inboundState) => {
  return CryptoJS.AES.encrypt(JSON.stringify(inboundState), import.meta.env.VITE_ENCRYPT_KEY).toString();
}, (outboundState) => {
  const res = CryptoJS.AES.decrypt(outboundState, import.meta.env.VITE_ENCRYPT_KEY).toString(CryptoJS.enc.Utf8);
  return JSON.parse(res);
});

export default encryptTransform;
