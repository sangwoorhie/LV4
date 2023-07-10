const express = require("express");
const { Users } = require("../models");
const router = express.Router();
const jwt = require("jsonwebtoken");



// 비밀번호 정규식 (최소 4자 이상의 영문 대소문자 및 숫자)
const passwordCheck = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;


// 1. 회원가입 POST : localhost:3018/api/users/signup (성공)
router.post("/signup", async (req, res) => {
  const { email, password, confirmPassword, nickname, age, gender, profileImage } = req.body;
  
  try{const isExistUser = await Users.findOne({ where: { email } });

  if (isExistUser == email) {
    return res.status(409).json({ message: "이미 존재하는 이메일입니다. 다시 확인해주세요." });
  } else if (password !== confirmPassword) {
    return res.status(400).json({ message: "비밀번호와 확인 비밀번호가 일치하지 않습니다." })
  } else if (!email) {
    return res.status(409).json({ message: "이메일을 입력해주세요." });
  } else if (!password) {
    return res.status(409).json({ message: "비밀번호를 입력해주세요." });
  } else if (!confirmPassword) {
    return res.status(409).json({ message: "확인비밀번호를 입력해주세요." });
  } else if (!nickname) {
    return res.status(409).json({ message: "닉네임을 입력해주세요." });
  } else if (!age) {
    return res.status(409).json({ message: "나이를 입력해주세요." });
  } else if (!gender) {
    return res.status(409).json({ message: "성별을 입력해주세요." });
  } else if (!passwordCheck.test(password)) {
    return res.status(409).json({ message: "비밀번호는 최소 4자 이상의 영문 대소문자 및 숫자로 작성되어야 합니다." });
  } else {

  // Users 테이블에 사용자를 추가
  await Users.create({ email, password, nickname, age, gender: gender.toUpperCase(), profileImage}) // toUpperCase() 성별 대문자로

  return res.status(201).json({ message: "회원가입이 완료되었습니다." });
}}
catch(error){console.log(error)
    res.status(400).json({ message: "요청한 데이터 형식이 올바르지 않습니다." })
}
});



// 2. 로그인 POST : localhost:3018/api/users/login (성공)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ where : { email }});
    if(!user) {
        return res.status(401).json({ message : "존재하지 않는 이메일 입니다. 다시 확인해주세요."})
    } else if (!email) {
        return res.status(400).json({ message: "이메일을 입력해 주세요."})
    } else if (password !== user.password) {
        return res.status(401).json({ message: "비밀번호가 일치하지 않습니다. 다시 확인해주세요." })
    } else if (!password) {
        return res.status(400).json({ message: "비밀번호를 입력해주세요." })
    }
    const Token = jwt.sign({ userId: user.userId }, "customized-secret-key");
    res.cookie("Authorization", `Bearer ${Token}`);
    return res.status(200).json({ message: "로그인 되었습니다." })
}) 



// 3. 사용자 정보 조회 GET : localhost:3018/api/users/:userId (성공)
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if(!userId){
    return res.status(404).json({message: "사용자 정보가 조회되지 않습니다."})
  }
  const user = await Users.findOne({ 
    attributes: ["userId", "email",'nickname', 'gender', 'profileImage', "createdAt", "updatedAt"],
})
  return res.status(200).json({UserInfomation: user})

    // // 만약 User모델과 UserInfo모델로 나뉜경우 동시 조회. 아래처럼 attributes와 include를 쓰면 됨.
    // const user = await Users.findOne({ 
    //   attributes: ["userId", "email", "createdAt", "updatedAt"],
    //   include: { model: UserInfos, attributes:['nickname', 'age', 'gender', 'profileImage'] }
})


// 4. 사용자 정보 수정 PATCH : localhost:3018/api/users/:userId (성공)
router.patch("/:userId", async(req, res) => { // put 전체수정, patch 부분수정

  const { userId } = req.params;
  const user = await Users.findOne({
    attributes:['userId', 'email', 'password', 'nickname', 'age', 'gender', 'profileImage', 'createdAt', 'updatedAt'],
    where: { userId },
  })
  const { nickname, password, confirmPassword, age, gender, profileImage } = req.body;
  const ExistNickname = await Users.findOne({ where: {nickname} })

  if(!password){
    return res.status(409).json({message: "비밀번호를 입력해주세요."})
  } else if (password!==confirmPassword) {
    return res.status(401).json({message: "비밀번호와 확인 비밀번호가 일치하지 않습니다."})
  } else if (!passwordCheck.test(password)) {
    return res.status(409).json({message: "비밀번호는 최소 4자 이상의 영문 대소문자 및 숫자로 이루어져야 합니다."}) // 맨위 비밀번호 정규식
  } else if (password === user.password){
    return res.status(409).json({message: "기존 비밀번호와 동일합니다. 다른 비밀번호로 바꾸어 주세요."})
  } else if (user.nickname !== nickname && ExistNickname){
    return res.status(409).json({message: "다른 회원이 이미 해당 닉네임을 사용중입니다."})
  } else {
    await Users.update({ nickname, password, age, gender, profileImage }, { where : {userId} })
  } return res.status(201).json({ message: "회원정보 변경이 완료되었습니다." })
})


// 5. 사용자 정보 삭제 DELETE : localhost:3018/api/users/:userId  (성공)
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { email, password } = req.body;
  const user = await Users.findOne({
    attributes:['userId', 'email', 'password', 'nickname', 'age', 'gender', 'profileImage', 'createdAt', 'updatedAt'],
    where: { userId },
  })

 // "정말로 ID : " [ ] " 를 삭제하겠습니다." 사이에서 입력받도록 만들기
 // const confirmChar = "정말로 ID : " + users.id + " 를 삭제하겠습니다."

 if (!email){
  return res.status(409).json({message: "이메일을 입력해주세요."})
 } else if (!password){
  return res.status(409).json({message: "비밀번호를 입력해주세요."})
 } else if (password !== user.password){
  return res.status(401).json({message: "비밀번호가 일치하지 않습니다."})
 } else if (email !== user.email){
  return res.status(401).json({message: "이메일이 일치하지 않습니다."})
 } else {
  await Users.destroy({where : {userId}})
  return res.status(201).json({message: "회원 탈퇴가 완료되었습니다."}) 
 }
});



module.exports = router;