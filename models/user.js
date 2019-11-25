var mongoose    = require("mongoose");
var passportLocalMongoose =require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
	username: {type: String, unique: true, required: true},
	email: {type: String, unique: true, required: true},
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false}
});
UserSchema.plugin(passportLocalMongoose);//add methods to User
module.exports=mongoose.model("User",UserSchema);