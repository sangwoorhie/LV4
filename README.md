튜터님

기본 API외 추가 구현기능으로는 게시글 좋아요, 좋아요 취소 / 댓글 좋아요, 좋아요 취소
게시글 신고/ 신고취소, 댓글 신고/ 신고 취소 기능을 만들었습니다.

post Router 폴더의 2. 전체게시글 목록조회에서 좋아요의 Id는 가져올 수 있으나, 좋아요를 각 게시글마다 몇개 받았나 좋아요의 숫자를 가져와서 개별 게시글 정보에 넣는 방법을 모르겠습니다. (게시글 상세조회에서는 params에 userId가 있으므로 count함수와 숫자열화 Number를 사용했었는데, 전체게시글 목록조회에서는 특정 postId가 없으므로 사용하지 못했습니다.) map 매서드를 활용해서 넣고 싶은데, 방식을 알려주시면 감사하겠습니다.

마찬가지로 comments Routes 폴더의 게시글당 댓글 목록조회에서 댓글당 좋아요 숫자도 가져오는 방법을 모르곘습니다.

또한 게시글이나 댓글 신고기능에서 신고를 10개하면 기존 댓글이나 게시글이 자동삭제되는 기능을 만들고 싶었으나 문법이 적용되지 않아 그냥 취소하면 취소처리만
하게 했습니다. 주석 달아놓았는데 봐주시면 감사하겠습니다.

그 외에도 제 코드를 보시고 수정사항이나, 더 좋게 코드를 짤 수 있는 부분이 있다면 알려주시면 감사하겠습니다!
