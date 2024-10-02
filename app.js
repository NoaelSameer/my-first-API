const express = require('express');
const fs = require('fs'); 
const path = require('path');
const app = express();
const port = 5001;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

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
    // console.log(cities);
    // console.log("hi")
    
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

app.post("/admin", (req,res)=>{
    if(req.body.password === "1"){
        console.log("great")
        res.status(202).json("City created")
        if(req.body.cities){
            res.status(202).json("City created")

        }
        if(req.body.landmarks){
            res.status(202).json("Landmark created")

        }
    }
    else{
        res.status(404).json("Wrong Password")
        console.log("bad")
    }
})







app.get("/api/admin", (req, res) => {
    if (req.query.password === "321123"){
        switch(res.query.method){
            case "cityAdd":
                break;
            case "landmarkAdd":
                break;
        }















        if(res.query.method === "addCity"){
            let cities = getCities();
            let id = cities.length + 1;
            let city = req.query.city || "null";
            let country = req.query.country || "null";
            let population = req.query.population? parseInt(req.query.population) : 0;
    
            const newCity = { id, city, country, population };
    
            cities.push(newCity);
    
            fs.writeFileSync(path.join(__dirname, "data/cities.json"), JSON.stringify(cities, null, 2));
        }


        console.log("password is correct");
        res.json("hi")

    }else{
        console.log("password is incorrect");
        res.status(401).json({ message: "Invalid password" });
    }
});


// app.get("/api/searchCities/:query", (req, res) => {
//     const { search } = req.query;
//     let cities = getCities();
//     let Place = "bob"
//     // console.log(cities);
//     console.log(Place);


//     if (search) {
//         cities = cities.filter(city => {
//             Place = city.name.toLowerCase().startsWith(search.toLowerCase());
//             // console.log(Place);
//             // res.status(200).json(Place);
//         });
//     }
//     else{
//         res.status(404)
//     }

//     res.status(200).json(Place);
// });






















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


app.get("/admin/", (req, res) => {
    res
})


// Start the server
app.listen(port, () => {

    console.log(`Server running on port ${port}`);
});

