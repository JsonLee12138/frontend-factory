export const getAccessToken = () => {
  return localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_CACHE_KEY);
}

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_CACHE_KEY, accessToken);
}

export const removeAccessToken = () => {
  localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN_CACHE_KEY);
}

export const getAccessTokenAsync = () => new Promise<string | null>((resolve)=> {
  resolve(getAccessToken())
})

export const setAccessTokenAsync = (accessToken: string) => new Promise<void>((resolve)=> {
  setAccessToken(accessToken)
  resolve()
})

export const removeAccessTokenAsync = () => new Promise<void>((resolve)=> {
  removeAccessToken()
  resolve()
})
