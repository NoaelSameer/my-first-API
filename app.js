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
    const cities = getCities(); 
    
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/api/cities", (req, res) => {
    const cities = getCities();
    res.json(cities);
    

})

// Searches for cities through ID
app.get("/api/cities/:id", (req, res) => {
    const cities = getCities(); 
    // id is now equal to :id
    const { id } = req.params;
    // Finds the city by trying to match the city id with the id param
    const city = cities.find(city => city.id === parseInt(id));

    if (!city) {
        return res.status(404).json({ message: "City not found" });
    }
    return res.json(city);
});

// Adds a city or landmark to list
app.post("/admin/add", (req,res)=>{
    // Checks if password is equal to 1
    if(req.body.password === "1"){
        // Checks if the city radio button is pressed, if it is itll only do the city portion, likewise with the other landmark section
        if(req.body.typer == "city"){
            let cities = getCities();
            // Makes a city object
            let city = {
                id: cities.length + 1,
                name: req.body.first,
                country: req.body.second,
                population: parseInt(req.body.third),
            }
            // pushes city into the cities, and then updates the file
            cities.push(city)
            fs.writeFileSync(path.join(__dirname, '/data/cities.json'), JSON.stringify(cities, null, 2));
            res.status(202).json("City created")
        }
        // Same logic as above, but with landmark
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
    // If password is wrong itll error out
    else{
        res.status(404).json("Wrong Password")
    }
})

// This is used to delete landmarks or cities
app.post("/admin/delete", (req,res)=>{
    if(req.body.password == "1"){
        if(req.body.typer == "city"){
            let cities = getCities()
            let indexer = cities.findIndex(city => city.id === parseInt(req.body.id))
            // It'll splice the index out, and then update the file throgh writeFileSync
            if(indexer!== -1){
                cities.splice(indexer, 1)
                fs.writeFileSync(path.join(__dirname, '/data/cities.json'), JSON.stringify(cities, null, 2))
                res.status(202).json("City deleted")
            }
        }
        else{
            // Same process as above
            let landmarks = getLandmarks()
            let indexer = landmarks.findIndex(landmark => landmark.id === parseInt(req.body.id))
            if(indexer!== -1){
                landmarks.splice(indexer, 1)
                fs.writeFileSync(path.join(__dirname, '/data/landmarks.json'), JSON.stringify(landmarks, null, 2))
                res.status(202).json("Landmark deleted")
            }


        }

    }
    else{
        res.status(404).json("Wrong Password")
    }

})


app.post("/admin/edit", (req, res) => {
    if (req.body.password == "1") {
        if (req.body.typer == "city") {
            let cities = getCities()
            let indexer = cities.findIndex(city => city.id == req.body.id)

            if (indexer !== -1){
                // This references the actual object in city, and changes that. Thats why we don't need to update editedCity but instead only need to update cities, since it already updates it as a reference. 
                let editedCity = cities[indexer]
                // Updates the values if the stuff are filled in, otherwise it maintains the original values
                if (req.body.first) editedCity.name = req.body.first;
                if (req.body.second) editedCity.country = req.body.second;
                if (req.body.third) editedCity.population = parseInt(req.body.third)
                fs.writeFileSync(path.join(__dirname, './data/cities.json'), JSON.stringify(cities, null, 2), 'utf8')
                    return res.status(200).json("City updated!")
            }
            else{
                res.status(404).json("invalid ID")
            }
        }
        else {
            let landmarks = getLandmarks()
            let indexer = landmarks.findIndex(landmark => landmark.id == req.body.id)
            
            if(indexer !== -1){
                let editedLandmark = landmarks[indexer]
                // Same logic as above
                if(req.body.first) editedLandmark.name = req.body.first;
                if(req.body.second) editedLandmark.type = req.body.second;
                if(req.body.third) editedLandmark.city_id = parseInt(req.body.third)

                fs.writeFileSync(path.join(__dirname, "./data/landmarks.json"), JSON.stringify(landmarks, null, 2), 'utf8')
            }
            else{
                res.status(404).json("invalid ID")
            }
            res.status(200).json("Landmark updates!")
        }
    } else {
        return res.status(403).json("403 Forbidden: Invalid password!");
    }
});








app.get("/api/landmarks", (req, res) => {
    const landmarks = getLandmarks();
    res.json(landmarks);
})

app.get("/api/landmarks/:id", (req, res) => {
    const cities = getCities(); 
    const { id } = req.params;
    const city = cities.find(city => city.id === parseInt(id));

    if (!city) {
        return res.status(404).json({ message: "City not found" });
    }

    return res.json(city);
});



app.listen(port, () => {

    console.log(`Server running on port ${port}`);
});

