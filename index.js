const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Define schema
const employeeSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true
    },password: {
        type: String,
        required: true
    }
});

// Define model
const UserProfile = mongoose.model("LoginDetails", employeeSchema);

app.use(express.json());
app.use(cors());

// Login API call

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
      const user = await UserProfile.findOne({ name });
      console.log(user)
      if (!user) {
        return res.status(404).send('User not found');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).send('Invalid password');
      }

      const token = jwt.sign({ name: user.name }, 'secret_key');
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send('Login failed');
    }
  });


// POST API call
app.post("/signup", async (req, res) => {
    try {
        const { password, name } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
console.log(hashedPassword)
        const employee = new UserProfile({name, password:hashedPassword });
        await employee.save();
        res.status(200).json(employee);
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// GET API call
app.get('/userdetails', async (req, res) => {
    try {
        const employees = await UserProfile.find(); 

        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/user/:id', async (req, res) => {
   
    try {
        const employees = await UserProfile.findById(req.params.id); 

        if(!employees){
            res.send("notFound")
        }else{
            res.json(employees);
        }
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.put("/user/:id", async (req, res) => {
    try {
        const { name,password } = req.body;
        const update=await UserProfile.findByIdAndUpdate(req.params.id, {name, password})
       
       if(!update){
        res.json("not updated")
       } else{
        res.status(200).json(update);
       }
       
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.delete("/deleteuser/:id", async(req, res)=>{
    try{
        const deleteItem=await UserProfile.findByIdAndDelete(req.params.id,)
        res.json("deleted")
    }catch{
        res.json({message:"internal server issue"})
    }
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
