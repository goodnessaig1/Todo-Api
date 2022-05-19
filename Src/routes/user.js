const router = require("express").Router()
const bcrypt = require("bcrypt");


// Middle ware
const { User } = require("../models/user");
const { Authenticated } = require("../middleware/Autentification");


router.get('',async(req, res)=>{
    try {
        const user = await User.find();
        res.json(user);
    } catch (err){
        res.json({message: err})
    }
      });

router.get('/:id', Authenticated ,async(req, res)=>{
    try {
        const user = await User.findOne();
        res.json(user);
    } catch (err){
        res.json({message: err})
    }
      });


// User create account route
router.post('', (req,res)=>{
    const user = new User(req.body);

    user.save((err)=>{
        if(err) 
         return res.json({success: false, err});
        res.status(200).json({
            success: true,
            message: "Account Successfully created. Login with your email and password" 
        });
        
    })
})
// Login route

router.post('/login',(req, res)=>{
  
    User.findOne({'username': req.body.username},(err, user)=>{
        if(!user) return res.json({Success:false,message:'Authentication failed,Dear user, please check your username and password and try again'});

        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch) return res.json({Success: false, message:'Wrong password'})


            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                res.cookie('w_auth',user.token).status(200).json({
                    Success: true
                })
            })
        })

    })
})


// USER TO DELETE ACCOUNT
router.delete("/:id", async (req, res) => {
    try {
        const deleteUser = await User.deleteOne({ _id: req.params.id});
        res.json(deleteUser);
    } catch (err){
        res.json({message: err});
    }
  });

  // update user
  router.patch('/:id',(req, res)=>{
    const id = req.params._id;
    const {username } = req.body;

    const user = User.find((user) => user._id == id);

    if(username) user.username = username;
    
    res.send("User with id ${id} has been changed")
})
//UPDATE
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can update only your account!");
  }
});



module.exports =  router