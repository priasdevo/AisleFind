import mongoose from "mongoose";

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer','owner'],
    required: true
  },
  imgUrl: {
    type: String,
    required: false
  }
})

export default mongoose.model("User",userSchema)

export interface IUser {
  username: string,
  password: string,
  role: 'customer' | 'owner'
  imgUrl?: string
  id: string
}
