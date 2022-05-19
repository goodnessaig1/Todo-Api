const router = require("express").Router();
const { Authenticated } = require("../middleware/Autentification");
const { Todo } = require("../models/todo");


//CREATE NEW TODO
router.post("", async (req, res) => {
    const newPost = new Todo(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//   UPDATE POST
router.put("/:id",Authenticated, async  (req, res) => {
    try {
      const post = await Todo.findById(req.params.id);
      if (post.username === req.body.username) {
        try {
          const updatedPost = await Todo.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          res.status(200).json(updatedPost);
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json("You can update only your own todo");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });



  //GET A SPECIFIC TODO
router.get("/:id",Authenticated,  async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      res.status(200).json(todo);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

 // GET ALL TODO
 router.get('',Authenticated,  async(req, res)=>{
    try {
        const todo = await Todo.find();
        res.json(todo);
    } catch (err){
        res.json({message: err})
    }
})
//DELETE A SPECIFIC TODO
router.delete("/:id",Authenticated,  async (req, res) => {
    try {
        const removedTodo = await Todo.deleteOne({ _id: req.params.id});
        res.json(removedTodo);
    } catch (err){
        res.json({message: err});
    }
  });
  
  module.exports = router;