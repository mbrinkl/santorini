export function getMobileOS() {
  const userAgent =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigator.userAgent || navigator.vendor || (window as any).opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  }

  if (/android/i.test(userAgent)) {
    return 'Android';
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    // && !window.MSStream) {
    return 'iOS';
  }

  return 'unknown';
}

export function isMobile() {
  return getMobileOS() !== 'unknown';
}

export const supportsCopying = !!document.queryCommandSupported('copy');

export function copyToClipboard(value: string) {
  const textField = document.createElement('textarea');
  textField.innerText = value;
  textField.style.opacity = '0';
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
}
