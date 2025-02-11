import getCookie from "@/util/getCookie";

const cache = new Map<string, Promise<any>>();

export default function request(url: string, init?: RequestInit) {
  if (cache.has(url)) {
    return cache.get(url)!;
  }

  const promise = fetch(url, {
    ...init,
    headers: {
      Cookie: getCookie(),
      ...init?.headers,
    },
  }).then((res) => res.json());
  cache.set(url, promise);

  return promise;
}
