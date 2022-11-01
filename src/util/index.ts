export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export function deepClone<T>(obj: T) {
  return JSON.parse(JSON.stringify(obj)) as T;
}
