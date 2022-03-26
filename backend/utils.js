import config from './config'
import jwt from 'jsonwebtoken'

export const generateToken = (user) => {
  return jwt.sign({
    _id: user._id, 
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin
  },
  config.JWT_SECRET
  )
}
export const isAuth = (req, res, next) => {
  const bearerToken = req.headers.authorization // request header 에서 Authorization 헤더를 조회함
  if(!bearerToken){
    res.status(401).send({message: 'Token is not supplied'}) // 헤더에 토근이 없는 경우
  }else{
    const token = bearerToken.slice(7, bearerToken.length) // Bearer 글자는 제거하고 jwt 토큰만 추출함
    jwt.verify(token, config.JWT_SECRET, (err, data) => {
      if(err){
        res.status(401).send({message: 'Invalid Token'}) // 토큰 형식이 맞지 않은 경우
      }else{
        req.user = data // data : jwt 토큰을 디코딩한것 (즉, 사용자 정보) => 상품 주문 생성할때 사용함
        next()
      }
    })
  }
}
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Token is not valid for admin user' });
  }
};