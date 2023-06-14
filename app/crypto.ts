const buf2hex = (buffer: ArrayBuffer) => {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
};

export const sha1digest = async (buffer: ArrayBuffer): Promise<string> => {
  if (typeof crypto === "undefined") return "Error: crypto is undefined!";
  const hashBytes = await crypto.subtle.digest({ name: "SHA-1" }, buffer);
  return buf2hex(hashBytes);
};
