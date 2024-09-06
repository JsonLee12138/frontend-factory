import FingerprintJS from '@fingerprintjs/fingerprintjs';
export const getDeviceId = async () => {
  try {
    const finger = await FingerprintJS.load();
    const fingerRes = await finger.get();
    const deviceId = fingerRes.visitorId;
    localStorage.setItem('deviceId', deviceId);
    return deviceId;
  } catch {
    return Promise.resolve('');
  }
};
