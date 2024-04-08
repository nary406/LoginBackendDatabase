
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser=require("body-parser")


const app = express();
dotenv.config()

app.use(bodyParser.json())

const port = process.env.PORT || 3000; 

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI)   
.then(()=>{
    console.log("connected")
})                              // Check MongoDB connection
.catch((err)=>{
    console.log(`error :connected${err}`)
})


// Define  schema
const employeeSchema=new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    }
})

// Define  model
const profile=mongoose.model("Employee", employeeSchema)

app.use(express.json());


//POST API call//
app.post("/add",async (req, res)=>{


    try{
        const {id, name}=req.body
        const employee=new profile({
            id,name 
        })
        await employee.save()
        res.status(200).json(employee)
    }
    catch(err){
        console.log(`catch error:${err}`)

   } 
})



//GET API call//
app.get('/employees', async (req, res) => {
    try {
        const todos = await profile.find();
        res.json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
