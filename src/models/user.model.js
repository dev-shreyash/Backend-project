
import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const userSchema =new Schema({
    //cloudnary used to stored video,imag urls
    username:{
        type:String,
        required:true,
        unique: true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    avtar:{
        type:String,
        required:true,
    },
    coverimage:{
        type:String,
    },
    watchhistory:[
        {
            type:Schema.Types.ObjectId,
            ref:'Video'
        }
    ],
    password:{
        type:String,
        required:[true, "Please provide a password"],
        minlength:[8,"Password should be at least 8 characters"]
    },
    refreshtoken:{
       type:String
    }
        
       
},{timeseries:true});


userSchema.pre("save", async function(next){
    if(this.isModified( 'password')) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken=function () {
    jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRETE,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}
userSchema.methods.generateRefreshToken=function () {
    jwt.sign(
        {
            _id:this._id,
        
        },
        process.env.REFRESH_TOKEN_SECRETE,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    
}
export const User =  mongoose.model('User',userSchema)