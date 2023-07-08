const express = require("express");
const router = express.Router();
const { CommentLikes, Posts, Comments } = require('../models');
const Authmiddleware = require("../middlewares/auth-middleware")
const { Op } = require("sequelize");


// 1. 댓글 좋아요 POST : localhost:3018/api/posts/:postId/comments/:commentId/like (성공)
router.post("/:postId/comments/:commentId/like", Authmiddleware, async (req, res) => {
    try{
        if(!req.params || !req.body){
            return res.status(412).json({message: "데이터 형식이 올바르지 않습니다."})
        }
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;

    const ExistsPost = await Posts.findOne({where: {postId}}); // 존재하는 게시글
    const ExistsComment = await Comments.findOne({where: {commentId}}) // 존재하는 댓글
    const AlreadyClickedUser = await CommentLikes.findOne({ where: {[Op.and]: [{commentId: Number(commentId)}, {userId: Number(userId)}]}});
    const LikesCount = await CommentLikes.count({where : {commentId: Number(commentId)}});  // 좋아요 숫자

    if(!userId){ // 유효성검사
        return res.status(403).json({message: "로그인 후 이용할 수 있는 기능입니다."})
    } else if (!ExistsPost){
        return res.status(404).json({message: "게시글이 존재하지 않습니다."})
    } else if (!ExistsComment) {
        return res.status(404).json({message: "댓글이 존재하지 않습니다."})
    } else if (AlreadyClickedUser) {
        return res.status(401).json({message: "이미 좋아요를 누른 댓글입니다."})
    } 
        await CommentLikes.create({PostId: postId, commentId: Number(commentId), UserId: Number(userId)})
        return res.status(200).json({message: "댓글에 좋아요를 눌렀습니다.", likesCount: LikesCount, clicked: true})
    }catch(error){
        console.log(error);
        return res.status(400).json({message: "요청이 정상적으로 이루어지지 않았습니다."})
    }
});



// 2. 댓글 좋아요 취소 DELETE : localhost:3018/api/posts/:postId/comments/:commentId/like (성공)
router.delete('/:postId/comments/:commentId/like', Authmiddleware, async (req, res) => {
  try{
    if(!req.params || !req.body){
        return res.status(412).json({message: "데이터 형식이 올바르지 않습니다."})
    }
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;

    const ExistsPost = await Posts.findOne({where: {postId}}) // where절의 postId는 Posts모델의 컬럼
    const ExistsComment = await Comments.findOne({where: {commentId}}) // where절의 commentId는 Comments모델의 컬럼
    const AlreadyClickedUser = await CommentLikes.findOne({ where: {[Op.and]: [{userId: Number(userId)}, {commentId: Number(commentId)}]}});

    if(!userId){ 
        return res.status(403).json({message: "로그인 후 이용할 수 있는 기능입니다."})
    } else if (!ExistsPost) {
        return res.status(404).json({message: "게시글이 존재하지 않습니다."})
    } else if (!ExistsComment) {
        return res.status(404).json({message: "댓글이 존재하지 않습니다."})
    } else if (!AlreadyClickedUser) {
        return res.status(401).json({message: "본인이 누른 좋아요만 취소 가능합니다."})
    } {
        await CommentLikes.destroy({where: {[Op.and]: [{userId: Number(userId)}, {commentId: Number(commentId)}]}});
        return res.status(200).json({message: "좋아요가 취소되었습니다."})
    }}catch(error){
        console.log(error);
        return res.status(400).json({message:"요청이 정상적으로 이루어지지 않았습니다."})
    }
});


// 3. 댓글당 좋아요 조회 GET : localhost:3018/api/posts/:postId/comments/:commentId/like (성공)
router.get('/:postId/comments/:commentId/like', async (req, res) => {
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
