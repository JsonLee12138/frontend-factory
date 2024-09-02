export const getAccessToken = () => {
  const userCache = localStorage.getItem(
    import.meta.env.VITE_PERSIST_CACHE_KEY,
  );
  if (userCache) {
    const userBuffer = JSON.parse(userCache).user;
    const userInfoStr = CryptoJS.AES.decrypt(
      userBuffer,
      import.meta.env.VITE_ENCRYPT_KEY,
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(userInfoStr).accessToken;
  }
  // return localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_CACHE_KEY);
  return '';
};

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(
    import.meta.env.VITE_ACCESS_TOKEN_CACHE_KEY,
    accessToken,
  );
};

export const removeAccessToken = () => {
  localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN_CACHE_KEY);
};

export const getAccessTokenAsync = () =>
  new Promise<string | null>((resolve) => {
    resolve(getAccessToken());
  });

export const setAccessTokenAsync = (accessToken: string) =>
  new Promise<void>((resolve) => {
    setAccessToken(accessToken);
    resolve();
  });

export const removeAccessTokenAsync = () =>
  new Promise<void>((resolve) => {
    removeAccessToken();
    resolve();
  });
