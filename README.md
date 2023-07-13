# API

localhost:3000/api


<users>
  
회원가입 (POST)
=> /users/signup

로그인 (POST)
=> /users/login

로그아웃 (POST)
=> /users/logout

사용자 정보 조회 (GET)
=> /users/:userId

사용자 정보 수정 (PATCH)
=> /users/:userId

회원탈퇴 (DELETE)
=> /users/:userId


<posts>
  
게시글 생성 (POST)
=> /posts

게시글 목록 조회 (GET)
=> /posts

게시글 상세 조회 (GET)
=> /posts/:postId

게시글 수정 (PUT)
=> /posts/:postId

게시글 삭제 (DELETE)
=> /posts/:postId


<postLikes>
  
게시글 좋아요 (POST)
-> /posts/:postId/like

게시글 좋아요 취소 (DELETE)
-> /posts/:postId/like


<postReport>
  
게시글 신고 (POST)
-> /posts/:postId/report

게시글 신고 취소 (DELETE)
-> /posts/:postId/report


<Comments>

댓글 생성 (POST)
=> /posts/:postId/comments

댓글 조회 (GET)
=> /posts/:postId/comments

댓글 수정 (PUT)
=> /posts/:postId/comments/:commentId

댓글 삭제 (DELETE)
=> /posts/:postId/comments/:commentId


<CommentLikes>
  
댓글 좋아요 (POST)
-> /posts/:postId/comments/:commentId/like

댓글 좋아요 취소 (DELETE)
-> /posts/:postId/comments/:commentId/like


<CommentReport>
  
댓글 신고 (POST)
-> /posts/:postId/comments/:commentId/report

댓글 신고 취소 (DELETE)
-> /posts/:postId/comments/:commentId/report
