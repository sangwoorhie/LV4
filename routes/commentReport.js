const express = require('express')
const router = express.Router();
const { Comments, CommentReport, Posts } = require('../models');
const Authmiddleware = require("../middlewares/auth-middleware")
const sequelize = require('sequelize');
const { Op } = require("sequelize");


// 1. 댓글신고 생성 POST : localhost:3018/api/posts/:postId/comments/:commentId/report (성공)
router.post('/:postId/comments/:commentId/report', Authmiddleware, async (req, res) => {
    try{
        if(!req.params || !req.body) {
            return res.status(412).json({message: "데이터 형식이 올바르지 않습니다."})
        }
        const { postId, commentId } = req.params;
        const { content } = req.body;
        const { userId } = res.locals.user;
        const post = await Posts.findOne({where: { postId }})
        const comment = await Comments.findOne({where: {commentId}})
        const AlreadyReportedUser = await CommentReport.findOne({where: {[Op.and]: [{commentId: Number(commentId)}, {reportUserId: Number(userId)}]}});
        
        if(!post){
            return res.status(404).json({message: "게시글이 존재하지 않습니다."})
        } else if(!comment){
            return res.status(412).json({message: "댓글이 존재하지 않습니다."})
        } else if(!content){
            return res.status(412).json({message: "정당한 댓글 신고 사유를 기재해 주세요."})
        } else if(!userId){
            return res.status(403).json({message: "로그인 후 이용할 수 있는 기능입니다."})
        } else if(AlreadyReportedUser){
            return res.status(403).json({message: "이미 신고한 댓글입니다."})
        } else if (comment) {
            await CommentReport.create({reportUserId: userId, commentId, content})
            return res.status(201).json({message: "해당 댓글을 신고하였습니다."})
        }
    }catch(error){
        console.log(error);
        return res.status(400).json({message: "요청이 정상적으로 이루어지지 않았습니다."})
    }
});


// 2. 댓글신고 취소 DELETE : localhost:3018/api/posts/:postId/comments/:commentId/report (성공하였으나, 신고10개받으면 기존댓글 지우는 기능 미구현)
router.delete('/:postId/comments/:commentId/report', Authmiddleware, async (req, res) => {
    try{
        if(!req.params){
            return res.status(400).json({message: "데이터 형식이 올바르지 않습니다."})
        }
        const { postId, commentId } = req.params;
        const { userId } = res.locals.user;
        const post = await Posts.findOne({where: { postId }})
        const comment = await Comments.findOne({where: {commentId}})
        const AlreadyReportedUser = await CommentReport.findOne({where: {[Op.and]: [{commentId: Number(commentId)}, {reportUserId: Number(userId)}]}});

        // CommentReport테이블에서 commentId컬럼만 갖고와서, where절로 commentId속성이 지정된 commentId값과 일치하는 값을 찾음.
        // group으로 그 결과를 하나로 묶고, SQL구문(sequelize.literal)으로 commentId의 갯수가 9보다 큰 그룹만 선택하도록 필터링 설정함.

        // const comment = await CommentReport.findOne({
        //     attributes: ["commentId"],
        //     where: {commentId},
        //     group: ["commentId"], 
        //     having: sequelize.literal(`COUNT(commentId) > 9`)
        // });

        // if (comment){
        //     await Comments.destroy({where: {commentId: comment.commentId}});
        //     await CommentReport.destroy({where: {commentId: comment.commentId}});
        //     return res.status(200).json({message: "댓글 신고가 취소되었습니다."})
        // }


         if (!post){
            return res.status(404).json({message: "게시글이 존재하지 않습니다."})
        } else if (!comment){
            return res.status(403).json({message: "댓글이 존재하지 않습니다."})
        } else if (!userId){
            return res.status(403).json({message: "로그인 후 이용할 수 있는 권한입니다."})
        } else if (!AlreadyReportedUser){
            return res.status(401).json({message: "본인이 신고한 댓글만 취소요청이 가능합니다."})
        } 
            await CommentReport.destroy({where: {[Op.and]: [{reportUserId: Number(userId)}, {commentId: Number(commentId)}]}});
            return res.status(200).json({message: "댓글 신고가 취소 처리되었습니다."})
    }catch(error){
        console.log(error);
        return res.status(400).json({message: "요청이 정상적으로 이루어지지 않았습니다."})
    }
});




module.exports = router;
