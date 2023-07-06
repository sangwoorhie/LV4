const express = require("express");
const router = express.Router();
const Authmiddleware = require("../middlewares/auth-middleware");
const { Posts, PostLikes } = require("../models")


// 1.  게시글 좋아요 POST : localhost:3018/api/posts/:postId/like  (성공)
router.post('/posts/:postId/like', Authmiddleware, async (req, res) => {
    try{
        if(!req.params || !req.body){
            return res.status(412).json({message: "데이터 형식이 올바르지 않습니다."})
        }
        const { userId } = res.locals.user;
        const { postId } = req.params;
        const ExistsPost = await Posts.findOne({where: {postId}}); // 존재하는 게시글

        if(!userId) {
            return res.status(403).json({message: "로그인 후 이용할 수 있는 기능입니다."})
        } else if (!ExistsPost) {
            return res.status(404).json({message: "존재하지 않는 게시글입니다."})
        } else {
        await PostLikes.create({ postId: postId, userId: userId })
        return res.status(200).json({message: "게시글에 좋아요를 눌렀습니다."})}
    } catch (error){
        console.log(error)
        return res.status(400).json({message: "요청이 정상적으로 이루어지지 않았습니다."})
    }
});




// 2. 게시글 좋아요 취소 DELETE : localhost:3018/api/posts/:postId/like (성공)
router.delete('/posts/:postId/like', Authmiddleware, async (req, res) => {
    try {
        if(!req.params || !req.body){
            return res.status(412).json({message: "데이터의 형식이 올바르지 않습니다."})
        }
        const { userId } = res.locals.user;
        const { postId } = req.params;
        const ExistsPost = await Posts.findOne({where: {postId}})

        if(!userId){
            return res.status(403).json({message: "로그인 후 이용할 수 있는 기능입니다."})
        } else if (!ExistsPost) {
            return res.status(404).json({message: "게시글이 존재하지 않습니다."})
        }
        await PostLikes.destroy({where: {userId, postId}});
        return res.status(200).json({message: "좋아요가 취소되었습니다."})
    } catch(error){
        console.log(error);
        return res.status(400).json({message: "요청이 정상적으로 이루어지지 않았습니다."})
    }
});




// 3. 게시글당 좋아요 조회 GET : localhost:3018/api/posts/:postId/like (성공)
router.get('/posts/:postId/like', async (req, res) => {
   try{
    const { postId } = req.params;
    const ExistsPost = await Posts.findOne({where: {postId}})
    const LikedCount = await PostLikes.findAndCountAll({where: {postId}}); //시퀄라이즈 쿼리문
    if(!ExistsPost){
        return res.status(404).json({message: "게시글이 존재하지 않습니다."})
    } else if(!LikedCount){
        return res.status(200).json({message: "아직 좋아요가 없습니다."}) // 안나옴
    } else {
        return res.status(200).json({TotalLikedCount: LikedCount})}
   }catch(error){
    console.log(error);
    return res.status(400).json({message: "요청이 정상적으로 이루어지지 않았습니다."})
   }
});


// 4. 전체 게시글 좋아요 조회 GET: localhost:3018/api/posts/like  (안됨)
router.get("/posts/like", async (req, res) => {
    const likeList = await PostLikes.findAll({
        attributes: ['postId', 'likedCount', 'createdAt', 'updatedAt'],
        order: [['createdAt', 'DESC']] // createdAt기준 내림차순
    });
    return res.status(200).json({"좋아요 목록": likeList});
});




// // 5. 유저당 좋아요 조회 GET : localhost:3018/api/posts/:postId/like/:userId (null값으로 나옴)
// router.get('/posts/:postId/like/:userId', async (req, res) => {
//     try{
//         const { postId, userId } = req.params;
//         const likedUser = await PostLikes.findOne({where: {postId, userId}});
//         return res.status(200).json({likedUser: likedUser})
//     }catch(error){
//         console.log(error);
//         res.status(400).json({message: "요청이 정상적으로 이루어지지 않았습니다."})
//     }   
// })




module.exports = router;
