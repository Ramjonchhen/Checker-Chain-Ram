export const addHttps = (url: string)=> {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "https://" + url;
  }
  return url;
}