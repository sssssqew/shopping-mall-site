import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  name: { type: String, required: true},
  email: { type: String, required: true, index: true, unique: true}, // unique: 색인(primary key) email은 중복불가, index : 보조색인 : email 과 관련된 쿼리를 줄때 성능이 향상됨
  password: { type: String, required: true},
  isAdmin: { type: Boolean, required: true, default: false}
})
const User = mongoose.model('User', userSchema)
export default User