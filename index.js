import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();

app.use(cors());

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/ujjwall", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
    
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
    }

connectDB();


app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

const DataSchema = new mongoose.Schema({
    name: String,
    last: String,
    buy: String,
    sell: String,
    volume: String,
    base_unit: String,
    quote_unit: String,
    low: String,
    high: String,
    type: String,
    open: String,
    at: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Data = mongoose.model('Data', DataSchema);


app.get('/api/save', async (req, res) => {
    //dropn the collection
    await Data.collection.drop();
    try {
      const response = await fetch('https://api.wazirx.com/api/v2/tickers');
      const data = await response.json();
  
      // Loop through each cryptocurrency pair data
      for (const [key, value] of Object.entries(data)) {
        const dataObj = new Data({
          ...value, // Spread operator to map API data to model
          name: key, // Add key as the name
        });
        await dataObj.save();
      }
  
      res.json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error saving data' });
    }
  });
  

  app.get('/api/data', async (req, res) => {
    try {
      // Fetch all data from the database
      const data = await Data.find({

      });
  
      // Send the data as JSON response
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error fetching data' });
    }
  });
  
  


app.listen(8000, () => 
console.log('Server running on port 8000')

);