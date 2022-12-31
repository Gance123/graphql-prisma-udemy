const jwt = require("jsonwebtoken");

APP_SECRET = "Graphql";

// トークンを復号するための関数
function getTokenPayload(token) {
  // トークン化されたものの前の情報(user.id)を復号する
  return jwt.verify(token, APP_SECRET);
}

//ユーザーIDを取得するための関数
function getUserId(req, authToken) {
  if (req) {
    // ヘッダーを確認します。認証権限があります？を確認する
    const autHeader = req.headers.authorization;
    // 権限があるなら
    if (autHeader) {
      const token = autHeader.replace("Bearer", "");
      if (!token) {
        throw new Error("トークンが見つかりませんでした");
      }
      // そのトークンを復号する
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("認証権限がありません");
}

module.exports = {
  APP_SECRET,
  getUserId,
};
