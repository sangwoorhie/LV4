const express = require("express");
const router = express.Router();
const Authmiddleware = require("../middlewares/auth-middleware")
const { Posts, Users, PostLikes } = require("../models")
const { Op } = require("sequelize");


// 1. 게시글 생성 POST : localhost:3018/api/posts (성공)
router.post("/posts", Authmiddleware, async (req, res) => {
try{
    const { userId } = res.locals.user;
    const { title, content } = req.body;

    if(!title){
        return res.status(412).json({message: "제목을 입력해주세요."})
    } else if (!content) {
        return res.status(412).json({message: "내용을 입력해주세요."})
    } else if (!userId){
        return res.status(401).json({message: "로그인 후 이용할 수 있는 기능입니다."})
    }
    const post = await Posts.create({ UserId: userId, title, content }
    );
    return res.status(201).json({ message: "게시글이 등록되었습니다." }) //data
}catch(error){
    console.log(error);
    res.status(401).json({message:"비정상적인 접근입니다."})
}});



// 2. 게시글 목록조회  GET : localhost:3018/api/posts (성공)
router.get('/posts', async (req, res) => {
    const postList = await Posts.findAll({
        attributes: ['postId', 'title', 'createdAt', 'updatedAt'],
        include: [{model: Users, attributes: ["nickname"]}, {model: PostLikes, attributes: ["likedCount"] }],
        order: [['createdAt', 'DESC']], //createdAt을 기준으로 내림차순 정렬
    });
    return res.status(200).json({"게시글 목록": postList}); // data
});


// likedCount 가 "좋아요 수"가 아닌 넘버링 형태로 나오고, LikedCount는 좋아요수는 나오지만 밑에 전체내용 다나옴


// 3. 게시글 상세조회 GET : localhost:3018/api/posts/:postId (성공) 
router.get('/posts/:postId', async (req, res) => {
    try{
        if(!req.params){ return res.status(400).json({message: "데이터 형식이 올바르지 않습니다."})}

    const { postId } = req.params;
    const post = await Posts.findOne({ //Posts모델에서 아래 5가지 컬럼을, Users모델에서 nickname 컬럼을 가져온다.
        attributes: ['postId', 'title', 'content', 'createdAt', 'updatedAt'],
        include: [{model: Users, attributes: ['nickname']}, {model: PostLikes, attributes: ["likedCount"] }],
        where: { postId } // Posts모델의 postId를 기준으로 조회한다.
    })
    const LikedCount = await PostLikes.findAndCountAll({where: {postId}});
    return res.status(200).json({"게시글 조회": post, "좋아요 수": LikedCount}); // data //singlePost
}catch(error){
    console.log(error);
    return res.status(400).json({message:"게시글 조회에 실패했습니다."})}
});



    // const singlePost = [post].map((item) => { // singlePost는 post를 map함수로 다시 추출함. 이렇게하는이유는 순서대로 정렬하기 위해서임.
    //     return{
    //     postId: item.postId,
    //     title: item.title,
    //     nickname: item.nickname, // 하지만 map매서드로 하니, 다른 테이블에서 온 nickname 조회안됨
    //     content: item.content,
    //     createdAt: item.createdAt,
    //     updatedAt: item.updatedAt,
    // }});




// 4. 게시글 수정 PUT : localhost:3018/api/posts/:postId (성공)
router.put('/posts/:postId', Authmiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const { title, content } = req.body;
    
    const post = await Posts.findOne({ where: { postId } });
    if(!post) {
        return res.status(404).json({message: "게시글이 존재하지 않습니다."})
    } else if (userId !== post.UserId) {
        return res.status(401).json({ message: "본인이 작성한 게시글만 수정할 수 있습니다." })
    }
    await Posts.update(
        { title, content },
        { where: {[Op.and]: [{ postId }, { UserId: userId }]} }
      );
    
      return res.status(200).json({ message: "게시글이 수정되었습니다." });
    });



// 5. 게시글 삭제 DELETE : localhost:3018/api/posts/:postId (성공)
router.delete('/posts/:postId', Authmiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const post = await Posts.findOne({ where : {postId} });
    if(!post) {
        return res.status(404).json({ message: "게시글이 존재하지 않습니다." }) 
    } else if (userId !== post.UserId){
        return res.status(401).json({ message: "본인이 작성한 게시글만 삭제할 수 있습니다."});
    }
    await Posts.destroy({
        where: {[Op.and]: [{ postId }, { UserId: userId }] }
      });
      return res.status(200).json({ message: "게시글이 삭제되었습니다." });
    });
    
    

module.exports = router;