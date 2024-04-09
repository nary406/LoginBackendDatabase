const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

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
    }
});

// Define model
const Employee = mongoose.model("Employee", employeeSchema);

app.use(express.json());

// POST API call
app.post("/add", async (req, res) => {
    try {
        const {  name } = req.body;
        const employee = new Employee({name });
        await employee.save();
        res.status(200).json(employee);
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// GET API call
app.get('/all', async (req, res) => {
    try {
        const employees = await Employee.find(); 

        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/all/:id', async (req, res) => {
   
    try {
        const employees = await Employee.findById(req.params.id); 

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


app.put("/all/:id", async (req, res) => {
    try {
        const { name } = req.body;
        const update=await Employee.findByIdAndUpdate(req.params.id, {name})
       
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


app.delete("/delete/:id", async(req, res)=>{
    try{
        const deleteItem=await Employee.fintByIdAndDelete(req,params.id,)
        res.json("deleted")
    }catch{
        res.json({message:"internal server issue"})
    }
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
