const crypto = require("crypto");

// 32バイトのランダム文字列を生成
const jwtSecret = crypto.randomBytes(32).toString("hex");
console.log(jwtSecret);
