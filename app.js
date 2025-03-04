const express = require("express");
const Song = require("./models/song");
var cors = require('cors')
const jwt = require('jwt-simple');
const app = express();
const User = require("./models/users");
const bcrypt = require("bcryptjs")


app.use(cors())

app.use(express.json());

const router = express.Router();
const secret = "supersecret"


router.post("/user", async(req,res) =>{
   if(!req.body.username || !req.body.password){
      res.status(400).json({error: "Missing username or passwword"})
   }

   const hash = bcrypt.hashSync(req.body.password, 10)
   const newUser = await new User({
      username: req.body.username,
      password: hash,
      status: req.body.status
   })
   try{
      await newUser.save()
      res.sendStatus(201)
   }
   catch(err){
      res.status(400).send
   }
})

router.post("/auth", async(req,res) =>{
   if(!req.body.username || !req.body.password){
      res.status(401).json({error: "Missing username or password"})
      return
   }
   try{
      const user = await User.findOne({username: req.body.username})
      if (!user){
         res.status(401).json({error: "User not found"})
     
      }
      else{
        if(bcrypt.compareSync(req.body.password,user.password)){
            const token = jwt.encode({username: user.username}, secret)
            res.json({token: token, username: user.username, userID: user._id})
         }
         else{
            res.status(401).json({error: "Invalid password"})
         }
      }
   }
   catch(err){
      res.status(400).send(err.message)
   }

      
   })



router.get("/songs", async(req,res) =>{
   try{
      const songs = await Song.find({})
      res.send(songs)
      console.log(songs)
   }
   catch (err){
      console.log(err)
   }

})

router.get("/songs/:id", async (req,res) =>{
   try{
      const song = await Song.findById(req.params.id)
      res.json(song)
   }
   catch (err){
      res.status(400).send(err)
   }
})

router.post("/songs", async(req,res) =>{
   try{
      const song = await new Song(req.body)
      await song.save()
      res.status(201).json(song)
      console.log(song)
   }
   catch(err){
      res.status(400).send(err)

   }
      
   
})

router.put("/songs/:id", async(req,res) =>{
   try{
      const song = req.body
      await Song.updateOne({_id: req.params.id},song)
      console.log(song)
      res.sendStatus(204)


   }
   catch(err){
      res.status(400).send(err)
   }
})

router.delete("/songs/:id", async(req,res) =>{
   try{
      const song = await Song.findById(req.params.id)
      console.log(song)
      await Song.deleteOne({_id: song._id})
      res.sendStatus(204)
   }
   catch(err){
      res.status(400).send(err)
   }
})

router.put("/playlist", async(req,res) =>{
   try{
      const user = await User.findById(req.body.userID)
      await user.updateOne({$push: {playlist: req.body.songID}})
      console.log(user)
      
      
      res.sendStatus(204)
   }
   catch(err){
      res.status(400).send(err)
   }
})

app.use("/api", router);

app.listen(process.env.PORT || 3000);