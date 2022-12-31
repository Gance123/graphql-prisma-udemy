const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const APP_SECRET = require("../utils");

/*サーバーからDBにユーザーの新規情報を追加する ・・Mutation{signup()}で実行*/
/* ①クライアント側(自分)からDBにユーザーの新規情報を追加・・create*/
/* ② ①をMutation{signup()}の中で実行できるよう記述 */

// ユーザーの新規登録のリゾルバ( Mutation )

// サインアップ
async function signup(parent, args, context) {
  // パスワードの設定・・ハッシュ化
  const password = await bcrypt.hash(args.passward, 10);

  // ユーザーの新規作成
  const user = await context.prisma.user.create({
    data: {
      ...args, //・・・email, name
      password,
    },
  });

  // トークン・・userIDのフィールドを用意してuser.idで署名(暗号化)する
  //  APP_SECRET　・・・　秘密鍵・・・サーバーが復号するためのもの
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
    // signup(引数)でAuthPayLoad型である{ token, user }を作成する。
    // ・・・ :AuthPayLoad(schema.graphql)!
  };
}
//

//

//

// ログイン
async function login(parent, args, context) {
  //⓵ メールアドレス認証
  // prismaを用いてDBにあるuserのemailプロパティから、
  // 引数に設定した(ログイン時に記述した)と一致するものを"探して"返す
  const user = await context.prisma.user.findUnique({
    whrere: { email: args.email },
  });
  if (!user) {
    throw new Error("そのようなユーザーは存在しません");
  }

  // ⓶ パスワードの比較
  // emailがい一致すれば、その一致したユーザーのパスワードと引数のパスワードを比較
  //一致すればvalidはtrue
  const vaild = await bcrypt.compare(args.password, user.password);
  if (!vaild) {
    throw new Error("無効なパスワードです");
  }

  // ⓷ パスワードが正しいとき
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}
//

//

//

// ニュースを投稿するリゾルバ
async function post(parent, args, context) {
  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
    },
  });
}

module.exports = {
  signup,
  login,
  post,
};
