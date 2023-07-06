const jwt = require("jsonwebtoken")
const { Users } = require("../models")

module.exports = async(req, res, next) => {
    const { Authorization } = req.cookies;
    const [ TokenType, Token ] = (Authorization ?? "" ).split(" ")
    if(TokenType !== "Bearer"){
        res.status(401).json({ message: "토큰 타입이 일치하지 않습니다." });
    } else if (!Token) {
        res.status(401).json({ message: "토큰값이 존재하지 않습니다." })
    }
try {
    const DecodedToken = jwt.verify(Token, "customized-secret-key")
    const userId = DecodedToken.userId;
    const user = await Users.findOne({ where: {userId} })

    if(!user || !userId) {
        return res.status(401).json({ message:"토큰에 해당하는 사용자가 존재하지 않습니다." })
    }
    res.locals.user = user;
    next();

} catch(error){
    console.log(error)
    return res.status(401).json({ message: "비정상적인 접근입니다." })
    }
};