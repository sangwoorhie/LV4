const express = require("express");
const cookieParser = require("cookie-parser");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts.js");
const postLikesRouter = require("./routes/postlikes.js");
const commentsRouter = require("./routes/comments.js");
const commentLikesRouter = require("./routes/commentlikes.js");
const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());
app.use(express.static("assets")); // assets이라는 폴더를 만들면 그 안에 폴더들은  html, css, js, 이미지 등 "정적 파일"에 대한 기본 경로를 제공해 준다
app.use(express.urlencoded({ extended: false })); // 즉 locathost:3018/index.html 브라우저에서 연결가능.
app.use('/api', [usersRouter, postsRouter, postLikesRouter, commentsRouter, commentLikesRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 실행되었습니다.');
})


// MySQL
// SequelizeMeta = migration 정보를 갖고있음

// DELETE FROM SequelizeMeta;
// SELECT * FROM SequelizeMeta;
// npx sequelize db:migrate





// https://drawsql.app/teams/jake-7/diagrams/lv4

// const { sequelize } = require('./models/index.js');

// async function main() {
//   // model을 이용해 데이터베이스에 테이블을 삭제 후 생성합니다.
//   await sequelize.sync({ force: true });
// }

// main();