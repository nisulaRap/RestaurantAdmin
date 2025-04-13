const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

// import routes
const resturantRoutes = require('./Routes/resturantRoutes');
const menuRoutes = require('./Routes/menuRoutes');
const orderRoutes = require('./Routes/orderRoutes');

app.use(cors(corsOptions));
app.use(express.json());    

// api endpoints
app.use('/api/resturant', resturantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/images', express.static('uploads'));
app.use('/api/order', orderRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const CONNECTION_STRING=process.env.CONNECTION_STRING;

mongoose.connect(CONNECTION_STRING)
    .then(()=>console.log("DB connected"))
    .catch((err)=>{
        console.log(err)
        process.exit(1);
    })

const port = 7001;
app.listen(port,()=>console.log(`App running in port ${port}`))