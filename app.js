const express = require("express");
const cookieParser = require("cookie-parser");
const usersRouter = require("./routes/users"); // 1회원가입, 2로그인, 3회원정보조회, 4회원정보수정, 5회원탈퇴
const postsRouter = require("./routes/posts.js"); // 1게시글전체조회, 2게시글상세조회, 3게시글생성, 4게시글수정, 5게시글삭제
const postLikesRouter = require("./routes/postlikes.js"); // 1게시글좋아요, 2게시글좋아요취소, 3게시글좋아요조회
const postRoportRouter = require("./routes/postReport.js"); // 1게시글신고, 2게시글신고취소
const commentsRouter = require("./routes/comments.js"); // 1댓글조회, 2댓글생성, 3댓글수정, 4댓글삭제
const commentLikesRouter = require("./routes/commentlikes.js"); // 1댓글좋아요, 2댓글좋아요취소, 3댓글좋아요조회
const commentRoportRouter = require("./routes/commentReport.js"); // 1댓글신고, 2댓글신고취소
const app = express();
const PORT = 3018;

// cd LV4로 하고 app.js하기

app.use(express.json());
app.use(cookieParser());
app.use(express.static("assets")); // assets이라는 폴더를 만들면 그 안에 폴더들은  html, css, js, 이미지 등 "정적 파일"에 대한 기본 경로를 제공해 준다
app.use(express.urlencoded({ extended: false })); // 즉 locathost:3018/index.html 브라우저에서 연결가능.
app.use('/api/users', [usersRouter]);
app.use('/api/posts', [postsRouter, postLikesRouter, postRoportRouter, commentsRouter,commentLikesRouter, commentRoportRouter]);


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