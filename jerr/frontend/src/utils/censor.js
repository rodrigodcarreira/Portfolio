export function censorWord(str) {
  return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
}

export function censorEmail(email) {
  var arr = email.split("@");
  return censorWord(arr[0]) + "@" + arr[1];
}
