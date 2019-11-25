var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware"); // it automatically require the index.js file in this dir, so no need to add ../middleware/index.js


// ====================
// COMMENTS ROUTES
// ====================
// comments new
router.get("/new",middleware.isLoggedIn,function(req, res){
    // find campground by id, send campground to comments/new.ejs file
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});
// comments create
router.post("/",middleware.isLoggedIn,function(req,res){
    //loopup campground using ID
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            // console.log(req.body.comment);
            //create new comment
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                } else{
                    // add username and id to comment //req.user.username
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    // console.log(comment);
                    //redirect campground show page
                    req.flash("success","Sucessfully added your comment");
                    res.redirect("/campgrounds/"+campground._id);
                }
            })

        }

    });
    //connect new comment to campground
});

// COMMENT edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit",{
                campground_id:req.params.id,
                comment: foundComment
            });
        }
    })
    
});
// COMMENT update route
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if (err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/"+req.params.id); // because all comments are nested after campground in app.js so id here refers to the campground id
        }
    });
});
// comment destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    // res.send("you are trying to delete a comment");
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success","Comment is deleted!");
            res.redirect("/campgrounds/"+req.params.id);
        } //id is campground id since comment is nested after campground, comment_id is comment id
    });
});



module.exports=router;