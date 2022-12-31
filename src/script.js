// データベースにアクセス(データの追加等)するためのクライアントライブラリ
// ・・・クライアントとデータベース
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// クライアントから、
async function main() {
  // データベースに新しいデータを格納・・create
  const newLink = await prisma.link.create({
    data: {
      description: "今日の大阪の天気について",
      url: "www.udemy-graphql-tutorial.com",
    },
  });
  // データベースのすべてのデータを取得・・findMany
  const allLinks = await prisma.link.findMany();
}

main()
  .catch((error) => {
    // エラーを投げ(無視し)、
    throw error;
  })
  .finally(async () => {
    // データベース接続を閉じる
    prisma.$disconnect;
  });
