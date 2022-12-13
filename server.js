const express=require('express')
const app=express()
const dbConfig = require('./config/dbConfig')
const usersRoute=require('./routes/usersRoute')
const busesRoute=require('./routes/busesRoute')
const bookingsRoute=require('./routes/bookingsRoute')
const cors = require('cors')

require('dotenv').config()

app.use(express.json())
app.use(cors({
  origin:'*'
}))
dbConfig()

app.use('/api/users',usersRoute)
app.use('/api/buses',busesRoute)
app.use('/api/bookings',bookingsRoute)

const path=require("path");
app.use(express.static("client/build"));
  
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
    });
// if(process.env.NODE_ENV === "production")
// {
//     app.use(express.static("client/build"));
  
//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
//     });
// }


const port = process.env.PORT || 5000
app.listen(port,() => {
    console.log(`node server listening at port no ${port}`)
})
