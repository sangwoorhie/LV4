# LV4
이슈사항

게시글 좋아요 및 댓글 좋아요 기능도 만들었습니다.

/routes/posts.js의 게시글 목록조회에서

    const postList = await Posts.findAll({
        attributes: ['postId', 'title', 'createdAt', 'updatedAt'],
        include: [{model: Users, attributes: ["nickname"]}, {model: PostLikes, attributes: ["likedCount"] }],
        order: [['createdAt', 'DESC']], //createdAt을 기준으로 내림차순 정렬
    });

    이렇게 할 경우 attributes된 값인 likedCount는 단지 좋아요 카운터 넘버링을 의미하며, 실제 좋아요 수는 나오지 않습니다. 또한, 게시글 상세조회에서

        const post = await Posts.findOne({ //Posts모델에서 아래 5가지 컬럼을, Users모델에서 nickname 컬럼을 가져온다.
        attributes: ['postId', 'title', 'content', 'createdAt', 'updatedAt'],
        include: [{model: Users, attributes: ['nickname']}, {model: PostLikes, attributes: ["likedCount"] }],
        where: { postId } // Posts모델의 postId를 기준으로 조회한다.
        const LikedCount = await PostLikes.findAndCountAll({where: {postId}});
        return res.status(200).json({"게시글 조회": post, "좋아요 수": LikedCount});
        
        이렇게 할 경우 findAndCountAll을 통해 좋아요를 조회할경우 전체 종아요 수는 나오지만 그 밑에 좋아요 좋아요 넘버링(likedCount)이 다 나옵니다.

        또한, 좋아요의 경우 한번 누르면 생성되고 한번 누르면 취소되야 하는데 누르면 누를 때마다 여러개가 생성되고 삭제하면 모두 삭제됩니다.
        구글링했는데 addlikers 라는 매서드가 있는것 같으나, 공식문서에는 없어서 어떻게 하면 좋아요가 1만 추가되게 하는지 궁금합니다.
