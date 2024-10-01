const express = require('express');
const fs = require('fs'); 
const path = require('path');
const app = express();
const port = 5001;

app.use(express.static(path.join(__dirname, 'public')));

const getCities = () => {
    const data = fs.readFileSync(path.join(__dirname, '/data/cities.json'), 'utf8');
    return JSON.parse(data);
}

const getLandmarks = () => {
    const data = fs.readFileSync(path.join(__dirname, '/data/landmarks.json'), 'utf8');
    return JSON.parse(data);
}

app.get('/', (req, res) => {
    const cities = getCities(); // Reading cities data
    console.log(cities);
    console.log("hi")
    
    // Send HTML file as response
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/api/cities", (req, res) => {
    const cities = getCities();
    res.json(cities);
    

})

app.get("/api/cities/:id", (req, res) => {
    const cities = getCities(); // Fetch cities data
    const { id } = req.params;
    const city = cities.find(city => city.id === parseInt(id));

    if (!city) {
        return res.status(404).json({ message: "City not found" });
    }

    return res.json(city);
});

app.get("/api/landmarks", (req, res) => {
    const landmarks = getLandmarks();
    res.json(landmarks);
})

app.get("/api/landmarks/:id", (req, res) => {
    const cities = getCities(); // Fetch cities data
    const { id } = req.params;
    const city = cities.find(city => city.id === parseInt(id));

    if (!city) {
        return res.status(404).json({ message: "City not found" });
    }

    return res.json(city);
});



// Start the server
app.listen(port, () => {
    const cities = getCities(); 
    console.log(cities);

    console.log(`Server running on port ${port}`);
});

