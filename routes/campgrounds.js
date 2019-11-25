var express=require("express");
var router=express.Router();
var Campground =require("../models/campground");
var middleware=require("../middleware"); // it automatically require the index.js file in this dir, so no need to add ../middleware/index.js

//INDEX - show all campgrounds 
//INDEX /dogs mongoose method: Dog.find()
router.get("/", function(req, res){
    // console.log(req.user);
    // Get all campgrounds from DB {} look for everything
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user});//send allCampgrounds found to the ejs file
       }
    });
});

//CREATE - add new campground to DB - Dog.create()
router.post("/",middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price= req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name,price:price, image: image, description: desc, author:author}
    // console.log(req.user.username);
    // console.log(req.user._id);
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            // console.log(newlyCreated.author.username);
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn,function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    //Dog.findById(id,callbackfunction())
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            if (!foundCampground) {
                return res.status(400).send("Item not found.")
            }
            // console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
// EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findById(req.params.id,function(err,foundCampground){
            res.render("campgrounds/edit",{campground:foundCampground});
        });
});


// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    // find and update the correct campground
    // var newData = {name: req.body.name, image: req.body.image, price: req.body.price, desc: req.body.description};
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updateCampground){
      if (err){
        res.redirect("/campgrounds");
      } else{
        res.redirect("/campgrounds/"+req.params.id);
      }
    });
    // redirect somewhere ( show page)
});
// Destroy Campground Route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    // res.send("you are trying to delete");
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})



module.exports=router;
