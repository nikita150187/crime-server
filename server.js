import express from "express";
import axios from "axios";
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
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
        console.log(response.data.data[0]);
        
    } catch (err) {
        console.error(err);
    }
});


app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
    
});
