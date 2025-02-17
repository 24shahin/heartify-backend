exports.codeGenaretore = (length) => {
  let code = "";
  let text = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  for (let i = 0; i < length; i++) {
    code += text.charAt(Math.floor(Math.random() * text.length));
  }
  return code;
};
