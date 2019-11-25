var Campground=require("../models/campground"); // define campgroud
var Comment=require("../models/comment");

// all the middleware goes here
var middlewareObj={}; // create an object
// add middleware functions to the object
middlewareObj.checkCampgroundOwnership =function(req,res,next){
    
    if (req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                req.flash("error","Campground not found");
                res.redirect("back");
            } else{
                // does user own the campground?
                if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){ //the first is a mongoose object, the right is a string, .equal is a mongoose function
                    next();
                } else{
                    // other wise ,redirect
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                   
                }
                
            }
        });
    } else {
        //redirect 
        req.flash("error","You need to be logged in to do that")
        res. redirect("back");
    }

}




middlewareObj.checkCommentOwnership = function(req,res,next){
    if (req.isAuthenticated()){
        //find the comment
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","Comment not found");
                res.redirect("back");
            } else{
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin){ //the first is a mongoose object, the right is a string, .equal is a mongoose function
                    next();
                } else{
                    // other wise ,redirect
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in to do that");
        res. redirect("back"); //sign in first
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    // we are not flashing right away,just gave it ability to flash, we do this before we redirect
    req.flash("error","You need to Login to do that.");// success is a key, the second parameter is the message we send to the user
    res.redirect("/login");
}


module.exports = middlewareObj; // export this object