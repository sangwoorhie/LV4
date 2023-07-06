const express = require("express");
const router = express.Router();
const Authmiddleware = require("../middlewares/auth-middleware");
const { Posts, PostLikes } = require("../models")
const { Op } = require("sequelize");



// 1.  게시글 좋아요 누르기 POST : localhost:3018/api/posts/:postId/like  (성공)
router.post('/:postId/like', Authmiddleware, async (req, res, next) => {
    try{
        if(!req.params || !req.body){
            return res.status(412).json({message: "데이터 형식이 올바르지 않습니다."})
        }
        const { postId } = req.params;
        const { userId } = res.locals.user;

        const ExistsPost = await Posts.findOne({where: {postId}}); // 존재하는 게시글
        const AlreadyClickedUser = await PostLikes.findOne({ where: {[Op.and]: [{postId: Number(postId)}, {userId: Number(userId)}]}});
        const LikesCount = await PostLikes.count({where: {postId: Number(postId)}}); //좋아요 숫자

        if (!userId) {
            return res.status(403).json({message: "로그인 후 이용할 수 있는 기능입니다."})
        } else if (!ExistsPost || !postId) {
            return res.status(404).json({message: "존재하지 않는 게시글입니다."})
        } else if (AlreadyClickedUser) {
            return res.status(401).json({message: "이미 좋아요를 누른 게시글입니다."})
        } else {
            await PostLikes.create({ postId: Number(postId), userId: Number(userId) })
        return res.status(200).json({message: "게시글에 좋아요를 눌렀습니다.", likesCount: LikesCount, clicked: true})
        }} catch (error){
        console.log(error)
        return res.status(400).json({message: "요청이 정상적으로 이루어지지 않았습니다."})
        }
    });




// 2. 게시글 좋아요 취소하기 DELETE : localhost:3018/api/posts/:postId/like (성공)
router.delete('/:postId/like', Authmiddleware, async (req, res) => {
    try {
        if(!req.params || !req.body){
            return res.status(412).json({message: "데이터의 형식이 올바르지 않습니다."})
        }
        const { postId } = req.params;
        const { userId } = res.locals.user;
        const ExistsPost = await Posts.findOne({where: {postId}})
        const AlreadyClickedUser = await PostLikes.findOne({where:{[Op.and]: [{userId: Number(userId)}, {postId: Number(postId)}]}});

        if(!userId){
            return res.status(403).json({message: "로그인 후 이용할 수 있는 기능입니다."})
        } else if (!ExistsPost || !postId) {
            return res.status(404).json({message: "게시글이 존재하지 않습니다."})
        } else if (!AlreadyClickedUser){
            return res.status(401).json({message: "본인이 누른 좋아요만 취소가 가능합니다."})
        }
        await PostLikes.destroy({where: {[Op.and]: [{userId: Number(userId)}, {postId: Number(postId)}]}});
        return res.status(200).json({message: "좋아요가 취소되었습니다."})
    } catch(error){
        console.log(error);
        return res.status(400).json({message: "요청이 정상적으로 이루어지지 않았습니다."})
    }
});




// 3. 게시글당 좋아요 조회 GET : localhost:3018/api/posts/:postId/like (성공)
router.get('/:postId/like', async (req, res) => {
   try{
    const { postId } = req.params;
    const ExistsPost = await Posts.findOne({where: {postId}})
    const LikedCount = await PostLikes.findAndCountAll({where: {postId}}); // 전체좋아요 수
    if(!ExistsPost || !postId){
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
router.get("/like", async (req, res) => {
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
