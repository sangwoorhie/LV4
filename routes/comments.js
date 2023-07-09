const express = require("express");
const router = express.Router();
const { Comments, Posts, Users, CommentLikes } = require('../models');
const Authmiddleware = require("../middlewares/auth-middleware")
const { Op } = require("sequelize");


// 1. 댓글 작성 POST : localhost:3018/api/posts/:postId/comments (성공)
router.post("/:postId/comments", Authmiddleware, async (req, res) => {
    try{
        if(!req.params || !req.body){
            return res.status(412).json({message: "데이터 형식이 올바르지 않습니다."})
        }
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = res.locals.user;
    const ExistsPost = await Posts.findOne({where : {postId}});

    if (!ExistsPost) {
        return res.status(404).json({message: "게시글이 존재하지 않습니다."})
    } else if (!content) {
        return res.status(412).json({message: "댓글을 입력해 주세요."})
    } else if (!userId){
        return res.status(403).json({message: "로그인 후 이용할 수 있는 기능입니다."})
    }
    await Comments.create({
        PostId: postId, // key값들은 models에 있는key값들을 써준다. 
        UserId: userId,
        comment: content
    })
    res.status(200).json({ message: "댓글이 작성되었습니다." })
    } catch(error){
        console.log(error)
        return res.status(400).json({ message: "요청이 정상적으로 이루어지지 않았습니다."})
    }
});



// 2. 게시글당 댓글 목록조회 GET : localhost:3018/api/posts/:postId/comments (성공)
router.get("/:postId/comments", async (req, res) => {
    try{
        if(!req.params || !req.body){ 
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." 
        })}

    const { postId } = req.params;
    const ExistsPost = await Posts.findOne({where:{postId}})
    const commentList = await Comments.findAll({
        raw: true,
        attributes:['commentId', 'userId', 'comment', 'createdAt', 'updatedAt'],
        include: [{model: Users, attributes:['nickname'], as:['nickname']}, {model: CommentLikes, attributes:['likeId'], as:['likes']}], // 목록조회에 닉네임 추가.
        where: {postId},
        order: [["createdAt", "DESC"]] // 작성일기준 내림차순
    });
    // const LikedCount = await CommentLikes.count({where: {commentId: Number(commentId)}});
    if(!ExistsPost) {
        return res.status(404).json({message: "게시글이 존재하지 않습니다."})
    } else if (!commentList){
        return res.status(404).json({message: "해당 게시글의 댓글이 조회되지 않습니다."})
    }
    return res.status(200).json({ "댓글 목록": commentList }); 

    }catch(error){
        console.log(error)
        return res.status(400).json({ message: "요청이 정상적으로 이루어지지 않았습니다."})
    }
});


    // const cmt = cmt.map((item) => {
    //     return {
    //         commentId: item.commentId,
    //         UserId: item.userId,
    //         nickname: item.nickname, // 닉네임은 Users 모델에서 왔어도, item.Users.nickname 이렇게 안써준다.
    //         comment: item.comment,
    //         createdAt: item.createdAt,
    //         updatedAt: item.updatedAt
    //     }
    // });
    // return res.json({ comments: cmt }); 


// 3. 댓글 수정 PUT : localhost:3018/api/posts/:postId/comments/:commentId (성공)
router.put('/:postId/comments/:commentId', Authmiddleware, async (req, res) => {
    try{
        if(!req.params || !req.body){
            return res.status(412).json({ message: "데이터 형식이 올바르지 않습니다." })
        }
        const { postId, commentId } = req.params;
        const { userId } = res.locals.user;
        const { content } = req.body;
        const existPost = await Posts.findOne({where : {postId}})
        const existComment = await Comments.findOne({where: {commentId}})

        if (!existPost) {
            return res.status(404).json({message: "게시글이 존재하지 않습니다."})
        } else if (!existComment) {
            return res.status(404).json({message: "댓글이 존재하지 않습니다."})
        }else if (!content){
            return res.status(412).json({message: "댓글 내용을 써 주세요."})
        } else if (!userId) {
            return res.status(403).json({ message: "로그인 후 이용할 수 있는 기능입니다." })
        } else if (userId !== existComment.UserId) {
            return res.status(403).json({ message: "본인이 작성한 댓글만 수정할 수 있습니다." })
        } else if (userId === existComment.UserId ){ // 대문자인이유는 Comments모델의 UserId컬럼이 대문자로시작. 
            await Comments.update({comment: content}, {where: {[Op.and]: [{commentId}, {UserId: userId}]} });
            return res.status(200).json({ message: "댓글이 수정되었습니다." })
        }
    } catch(error){
        console.log(error);
        return res.status(400).json({ message: "요청이 정상적으로 이루어지지 않았습니다." })
    }
});



// 4. 댓글 삭제 DELETE : localhost:3018/api/posts/:postId/comments/:commentId (성공)
router.delete('/:postId/comments/:commentId', Authmiddleware, async (req, res) => {
    try{
        if(!req.params || !req.body){
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
        }
        const { postId, commentId } = req.params;
        const { userId } = res.locals.user;
        const existPost = await Posts.findOne({where : {postId}})
        const existComment = await Comments.findOne({where: {commentId}})

        if (!existPost) {
            return res.status(404).json({message: "게시글이 존재하지 않습니다."})
        } else if (!existComment) {
            return res.status(404).json({message: "댓글이 존재하지 않습니다."})
        } else if (!userId) {
            return res.status(403).json({message: "로그인 후 이용할 수 있는 기능입니다."})
        } else if (userId !== existComment.UserId){
            return res.status(403).json({message: "본인이 작성한 댓글만 삭제할 수 있습니다."})
        } else if (userId === existComment.UserId){
            await Comments.destroy({where: {commentId}})
            return res.status(200).json({message: "댓글이 삭제되었습니다."})
        }
    } catch(error){
        console.log(error);
        return res.status(400).json({ message: "요청이 정상적으로 이루어지지 않았습니다." })
    }
})




module.exports = router;




// 만약 Users와 userInfos가 나뉜상태라면 아래와 같이 한다.

// // 2. 댓글 목록조회 GET : localhost:3018/api/posts/:postId/comments
//     const commets = await Comments.findAll({
//         attributes:['commentId', 'userId', 'content', 'createdAt', 'updatedAt'],
//         include: [{model: UserInfos, attributes:['nickname']}],
//         where: {postId},
//         order: [["createdAt", "DESC"]]
//     });
// 