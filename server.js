import express from "express";
import axios from "axios";
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';

const app = express();
const PORT = 3000;


const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get("/crimes", async(req, res) => {
    try {
        const response = await axios.get(
            "https://brottsplatskartan.se/api/events/?location=helsingborg"
        );
        res.json(response.data.data[0]);
        //console.log(response.data.data[0]);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({message:`Error fetching crimes`});
    }
});

app.get("/crimes/locations", async(req, res) => {
    try {
        const response = await axios.get(
            "https://brottsplatskartan.se/api/events/?location=helsingborg&limit=5"
           );
           console.log(response.data);
           const locations = response.data.data.map(crime => crime.headline);
        res.json(locations);  
    } catch (err) {
        console.error(err);
        res.status(500).json({message: `Error fetching crime locations`});
    }
});

app.get("/crimes/search", async (req, res) => {
    const city = req.query.city;
    if (!city?.trim()) {
        return res.status(400).json({ message: "City parameter is required" });
    }
    try {
        const response = await axios.get(`https://brottsplatskartan.se/api/events/?location=${city}&limit=5`);
        console.log(response.data.data);
        
        res.json(response.data.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error searching crimes for the specified city" });
    }
});

app.get("/crimes/latest", async(req, res) => {
    try {
        const response = await axios.get("https://brottsplatskartan.se/api/events/?location=helsingborg&limit=5");
        const latestCrime = response.data.data[0];
        res.json(latestCrime);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching latest crime" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
    
});
