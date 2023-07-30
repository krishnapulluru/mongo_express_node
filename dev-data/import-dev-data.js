const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require('dotenv');

const Tour = require("./../models/toursModel");

dotenv.config({ path: './../config.env' });

// console.log(process.env.DATABASE)

// return
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB , {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then(()=>console.log("Connection established successfylly 🆗🆗🆗🆗🆗🆗 "))
.catch((err)=>console.log(err))

// Importing data from file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json` , 'utf-8'));

const importData = async()=>{
    try{
        await Tour.create(tours)
        console.log("Data Loaded Successfully 🍫🍫🍫🍫🍫🍫🍫🍫🍫🍫🍫🍫🍫🍫🍫 ")
        process.exit();
    }catch(e){
        console.log(e)
    }
}

const deleteData = async()=>{
    try{
        await Tour.deleteMany()
        console.log("Data Cleared Successfully 💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥")
    }catch(e){
        console.log(e)
    }
}

if(process.argv[2] === "--import"){
    importData()
} else if(process.argv[2] === "--delete"){
    deleteData()
}

