const express = require("express");
const router = express.Router();
const { CommentLikes, Posts, Comments } = require('../models');
const Authmiddleware = require("../middlewares/auth-middleware")


// 1. 댓글 좋아요 POST : localhost:3018/api/posts/:postId/comments/:commentId/like (성공)
router.post('/posts/:postId/comments/:commentId/like', Authmiddleware, async (req, res) => {
    try{
        if(!req.params || !req.body){
            return res.status(412).json({message: "데이터 형식이 올바르지 않습니다."})
        }
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;
    const ExistsPost = await Posts.findOne({where: {postId}}); // 존재하는 게시글
    const ExistsComment = await Comments.findOne({where: {commentId}}) // 존재하는 댓글

    if(!userId){ // 유효성검사
        return res.status(403).json({message: "로그인 후 이용할 수 있는 기능입니다."})
    } else if (!ExistsPost){
        return res.status(404).json({message: "게시글이 존재하지 않습니다."})
    } else if (!ExistsComment) {
        return res.status(404).json({message: "댓글이 존재하지 않습니다."})
    } else {
        await CommentLikes.create({PostId: postId, commentId: commentId, UserId: userId})
        return res.status(200).json({message: "댓글에 좋아요를 눌렀습니다."})
    }}catch(error){
        console.log(error);
        return res.status(400).json({message: "요청이 정상적으로 이루어지지 않았습니다."})
    }
});



// 2. 댓글 좋아요 취소 DELETE : localhost:3018/api/posts/:postId/comments/:commentId/like (성공)
router.delete('/posts/:postId/comments/:commentId/like', Authmiddleware, async (req, res) => {
  try{
    if(!req.params || !req.body){
        return res.status(412).json({message: "데이터 형식이 올바르지 않습니다."})
    }
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;
    const ExistsPost = await Posts.findOne({where: {postId}}) // where절의 postId는 Posts모델의 컬럼
    const ExistsComment = await Comments.findOne({where: {commentId}}) // where절의 commentId는 Comments모델의 컬럼

    if(!userId){ 
        return res.status(403).json({message: "로그인 후 이용할 수 있는 기능입니다."})
    } else if (!ExistsPost) {
        return res.status(404).json({message: "게시글이 존재하지 않습니다."})
    } else if (!ExistsComment) {
        return res.status(404).json({message: "댓글이 존재하지 않습니다."})
    } else {
        await CommentLikes.destroy({where: {PostId: postId, commentId: commentId, UserId: userId}})
        return res.status(200).json({message: "좋아요가 취소되었습니다."})
    }}catch(error){
        console.log(error);
        return res.status(400).json({message:"요청이 정상적으로 이루어지지 않았습니다."})
    }
});


// 3. 댓글당 좋아요 조회 GET : localhost:3018/api/posts/:postId/comments/:commentId/like (성공)
router.get('/posts/:postId/comments/:commentId/like', async (req, res) => {
    try{
        const { postId, commentId } = req.params;
        const ExistsPost = await Posts.findOne({where: {postId}})
        const ExistsComment = await Comments.findOne({where: {commentId}})
        const LikedCount = await CommentLikes.findAndCountAll({where: {commentId}})

        if(!ExistsPost){
            return res.status(403).json({message: "게시글이 존재하지 않습니다."})
        } else if (!ExistsComment){
            return res.status(403).json({message: "댓글이 존재하지 않습니다."})
        } else if (!LikedCount) {
            return res.status(200).json({message: "아직 좋아요가 없습니다."})
        } else {
            return res.status(200).json({TotalLikedCount: LikedCount})
        }
    }catch(error){
        console.log(error);
        return res.status(400).json({message: "요청이 정상적으로 이루어지지 않았습니다."})
    }});




module.exports = router;
