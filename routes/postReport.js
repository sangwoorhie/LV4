const express = require('express')
const router = express.Router();
const { Posts, PostReport } = require('../models');
const Authmiddleware = require("../middlewares/auth-middleware")
const sequelize = require('sequelize');
const { Op } = require("sequelize");


// 1. 게시글 신고 생성 POST : localhost:3018/api/posts/:postId/report (성공)
router.post('/:postId/report', Authmiddleware, async (req, res) => {
    try{
        if(!req.params || !req.body) {
            return res.status(412).json({message: "데이터 형식이 올바르지 않습니다."})
        }
        const { postId } = req.params;
        const { content } =  req.body;
        const { userId } = res.locals.user;
        const post = await Posts.findOne({where: { postId }})
        const AlreadyReportedUser = await PostReport.findOne({where: {[Op.and]: [{PostId: Number(postId)}, {reportUserId: Number(userId)}]}});

        if(!postId) {
            return res.status(404).json({message: "게시글이 존재하지 않습니다."})
        } else if (!userId){
            return res.status(403).json({message: "로그인 후 이용할 수 있는 기능입니다."})
        } else if (!content){
            return res.status(412).json({message: "정당한 게시글 신고 사유를 기재해 주세요."})
        } else if (AlreadyReportedUser){
            return res.status(403).json({message: "이미 신고한 게시글입니다."})
        } else if (post){
            await PostReport.create({reportUserId: userId, PostId: postId, content})
            return res.status(201).json({message: "해당 게시글을 신고하였습니다."})
        }
    }catch(error){
        console.log(error);
        return res.status(400).json({message: "요청이 정상적으로 이루어지지 않았습니다."})
    }
})


// 2. 게시글 신고 취소 DELETE : localhost:3018/api/posts/:postId/report ((성공하였으나, 신고10개받으면 기존댓글 지우는 기능 미구현. 주석대로 할 시 에러메시지나오는게 아니라 계속 processing)
router.delete('/:postId/report', Authmiddleware, async (req, res) => {
    try{
        if(!req.params){
            return res.status(400).json({message: "데이터 형식이 올바르지 않습니다."})
        }
        const { postId } = req.params;
        const { userId } = res.locals.user;
        const post = await Posts.findOne({where: { postId }});
        const AlreadyReportedUser = await PostReport.findOne({where: {[Op.and]: [{PostId: Number(postId)}, {reportUserId: Number(userId)}]}});


        // PostReport테이블에서 postId컬럼만 갖고와서, where절로 postId속성이 지정된 postId값과 일치하는 값을 찾음.
        // group으로 그 결과를 하나로 묶고, SQL구문(sequelize.literal)으로 postId의 갯수가 9보다 큰 그룹만 선택하도록 필터링 설정함.

        // const post = await PostReport.findOne({
        //     attributes: ["postId"],
        //     where: {postId},
        //     group: ["postId"], 
        //     having: sequelize.literal(`COUNT(postId) > 9`) 
        // });

        // if (post){
        //     await Posts.destroy({where: {postId: post.postId}});
        //     await PostReport.destroy({where: {PostId: post.postId}});
        //     res.status(200).json({message: "게시글 신고가 취소되었습니다."})
        // } 
        //     res.status(400).json({message: "게시글 신고 취소에 실패했습니다."})
        
        
        if(!post){
            return res.status(404).json({message: "게시글이 존재하지 않습니다."})
        } else if (!userId) {
            return res.status(403).json({message: "로그인 후 이용할 수 있는 기능입니다."})
        } else if (!AlreadyReportedUser) {
            return res.status(403).json({message: "본인이 신고한 게시글만 취소요청이 가능합니다."})
        } 
            await PostReport.destroy({where : {[Op.and]: [{PostId: Number(postId)}, {reportUserId: Number(userId)}]}});
            return res.status(200).json({message: "게시글 신고가 취소 처리되었습니다."})      
    }catch(error){
        console.log(error);
        return res.status(400).json({message: "요청이 정상적으로 이루어지지 않았습니다."})
    }
});




module.exports = router;
