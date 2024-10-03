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

app.post("/admin/add", (req,res)=>{
    
    if(req.body.password === "1"){
        if(req.body.typer == "city"){
            let cities = getCities();
            let city = {
                id: cities.length + 1,
                name: req.body.first,
                country: req.body.second,
                population: parseInt(req.body.third),
            }
            fs.writeFileSync(path.join(__dirname, '/data/cities.json'), JSON.stringify(cities, null, 2));
            res.status(202).json("City created")

        }
        if(req.body.typer == "landmark"){
            let landmarks = getLandmarks();
            let landmark = {
                id: landmarks.length + 1,
                name: req.body.first,
                type: req.body.second,
                city_id: parseInt(req.body.third)
            }
            landmarks.push(landmark)
            fs.writeFileSync(path.join(__dirname, '/data/landmarks.json'), JSON.stringify(landmarks, null, 2));

            res.status(202).json("Landmark created")

        }
    }
    else{
        res.status(404).json("Wrong Password")
    }
})


app.post("/admin/delete", (req,res)=>{
    if(req.body.password == "1"){
        if(req.body.typer == "city"){
            let cities = getCities();
            let indexer = cities.findIndex(city => city.id === parseInt(req.body.id));
            if(indexer!== -1){
                cities.splice(indexer, 1);
                fs.writeFileSync(path.join(__dirname, '/data/cities.json'), JSON.stringify(cities, null, 2));
                res.status(202).json("City deleted")
            }
            // console.log(indexer);
            // console.log(req.body.id);
        }
        else{
            let landmarks = getLandmarks();
            let indexer = landmarks.findIndex(landmark => landmark.id === parseInt(req.body.id));
            if(indexer!== -1){
                landmarks.splice(indexer, 1);
                fs.writeFileSync(path.join(__dirname, '/data/landmarks.json'), JSON.stringify(landmarks, null, 2));
                res.status(202).json("Landmark deleted")
            }
            // console.log(indexer);
            // console.log(req.body.id);


        }

    }
    else{
        res.status(404).json("Wrong Password")
    }

})

// const fs = require('fs');
// const path = require('path');

// app.post("/admin/delete", (req, res) => {
//     if (req.body.password === "1") {
//         if (req.body.typer === "city") {
//             let cities = getCities();
//             let indexer = cities.findIndex(city => city.id === parseInt(req.body.id));

//             if (indexer !== -1) {
//                 cities.splice(indexer, 1);
//                 fs.writeFileSync(path.join(__dirname, '/data/cities.json'), JSON.stringify(cities, null, 2));
//                 return res.status(202).json("City deleted");
//             } else {
//                 return res.status(404).json("City not found");
//             }

//         } else if (req.body.typer === "landmark") {
//             let landmarks = getLandmarks();
//             let indexer = landmarks.findIndex(landmark => landmark.id === parseInt(req.body.id));

//             if (indexer !== -1) {
//                 landmarks.splice(indexer, 1);
//                 fs.writeFileSync(path.join(__dirname, '/data/landmarks.json'), JSON.stringify(landmarks, null, 2));
//                 return res.status(202).json("Landmark deleted");
//             } else {
//                 return res.status(404).json("Landmark not found");
//             }

//         } else {
//             return res.status(400).json("Invalid type specified");
//         }

//     } else {
//         return res.status(403).json("Wrong Password");
//     }
// });


// app.get("/api/searchCities/:query", (req, res) => {
//   ap  const { search } = req.query;
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

