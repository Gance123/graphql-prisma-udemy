const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

// メモリには残るがデータベースには残らない・・・永続化ができていない
// prismaを使用してデータベースへの保存や削除、やり取りを記述する
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/*リゾルバ関数*/
// サーバーから、
const resolvers = {
  // データベースのデータを取得・・Query
  Query: {
    info: () => "HackerNewsクローン",
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
  },
  // データベースのデータを更新、編集・・Mutation
  // 追加・・create
  Mutation: {
    post: (parent, args, context) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
  },
};

// ローカルサーバー
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: {
    prisma,
  },
});

server
  .listen()
  .then(({ url }) => console.log(`${url}でサーバーを起動中・・・`));
