// Route to get a city by its ID
app.get("/api/cities/:id", (req, res) => {
    const cities = getCities(); // Retrieve the list of cities
    const { id } = req.params; // Extract the city ID from the request parameters
    const city = cities.find(city => city.id === parseInt(id)); // Find the city by ID

    // If city not found, return 404 status
    if (!city) {
        return res.status(404).json({ message: "City not found" });
    }
    // Return the found city
    return res.json(city);
});

// Route to add a new city or landmark
app.post("/admin/add", (req,res) => {
    
    // Check if the provided password is correct
    if(req.body.password === "1"){
        // Check if the type is city
        if(req.body.typer == "city"){
            let cities = getCities(); // Retrieve current cities
            let city = {
                id: cities.length + 1, // Generate a new ID
                name: req.body.first, // Get the city name
                country: req.body.second, // Get the country
                population: parseInt(req.body.third), // Get the population as an integer
            };
            // Write updated cities to the file
            fs.writeFileSync(path.join(__dirname, '/data/cities.json'), JSON.stringify(cities, null, 2));
            res.status(202).json("City created");
        }
        // Check if the type is landmark
        if(req.body.typer == "landmark"){
            let landmarks = getLandmarks(); // Retrieve current landmarks
            let landmark = {
                id: landmarks.length + 1, // Generate a new ID
                name: req.body.first, // Get the landmark name
                type: req.body.second, // Get the type of landmark
                city_id: parseInt(req.body.third) // Get the associated city ID
            };
            landmarks.push(landmark); // Add the new landmark to the list
            // Write updated landmarks to the file
            fs.writeFileSync(path.join(__dirname, '/data/landmarks.json'), JSON.stringify(landmarks, null, 2));
            res.status(202).json("Landmark created");
        }
    } else {
        // If password is incorrect, return 404 status
        res.status(404).json("Wrong Password");
    }
});

// Route to delete a city or landmark
app.post("/admin/delete", (req,res) => {
    // Check if the provided password is correct
    if(req.body.password == "1"){
        // Check if the type is city
        if(req.body.typer == "city"){
            let cities = getCities(); // Retrieve current cities
            let indexer = cities.findIndex(city => city.id === parseInt(req.body.id)); // Find the index of the city to delete
            if(indexer !== -1){ // If city found
                cities.splice(indexer, 1); // Remove the city from the array
                // Write updated cities to the file
                fs.writeFileSync(path.join(__dirname, '/data/cities.json'), JSON.stringify(cities, null, 2));
                res.status(202).json("City deleted");
            }
        } else { // If the type is landmark
            let landmarks = getLandmarks(); // Retrieve current landmarks
            let indexer = landmarks.findIndex(landmark => landmark.id === parseInt(req.body.id)); // Find the index of the landmark to delete
            if(indexer !== -1){ // If landmark found
                landmarks.splice(indexer, 1); // Remove the landmark from the array
                // Write updated landmarks to the file
                fs.writeFileSync(path.join(__dirname, '/data/landmarks.json'), JSON.stringify(landmarks, null, 2));
                res.status(202).json("Landmark deleted");
            }
        }
    } else {
        // If password is incorrect, return 404 status
        res.status(404).json("Wrong Password");
    }
});

// Route to edit a city or landmark
app.post("/admin/edit", (req, res) => {
    // Check if the provided password is correct
    if (req.body.password == "1") {
        // Check if the type is city
        if (req.body.typer == "city") {
            let cities = getCities(); // Retrieve current cities
            let indexer = cities.findIndex(city => city.id == req.body.id); // Find the index of the city to edit

            if (indexer !== -1) { // If city found
                let editedCity = cities[indexer]; // Reference the found city

                // Update the city fields if provided in the request
                if (req.body.first) editedCity.name = req.body.first;
                if (req.body.second) editedCity.country = req.body.second;
                if (req.body.third) editedCity.population = parseInt(req.body.third);
                
                // Write updated cities to the file
                fs.writeFileSync(path.join(__dirname, './data/cities.json'), JSON.stringify(cities, null, 2), 'utf8');
                return res.status(200).json("City updated!");
            } else {
                return res.status(404).json("Invalid ID");
            }
        } else { // If the type is landmark
            let landmarks = getLandmarks(); // Retrieve current landmarks
            let indexer = landmarks.findIndex(landmark => landmark.id == req.body.id); // Find the index of the landmark to edit
            
            if (indexer !== -1) { // If landmark found
                let editedLandmark = landmarks[indexer]; // Reference the found landmark

                // Update the landmark fields if provided in the request
                if (req.body.first) editedLandmark.name = req.body.first;
                if (req.body.second) editedLandmark.type = req.body.second;
                if (req.body.third) editedLandmark.city_id = parseInt(req.body.third);
                
                // Write updated landmarks to the file
                fs.writeFileSync(path.join(__dirname, "./data/landmarks.json"), JSON.stringify(landmarks, null, 2), 'utf8');
                return res.status(200).json("Landmark updated!");
            } else {
                return res.status(404).json("Invalid ID");
            }
        }
    } else {
        // If password is incorrect, return 403 status
        return res.status(403).json("403 Forbidden: Invalid password!");
    }
});

// Route to get a landmark by its ID
app.get("/api/landmarks/:id", (req, res) => {
    const cities = getCities(); // Fetch cities data
    const { id } = req.params; // Extract the landmark ID from the request parameters
    const city = cities.find(city => city.id === parseInt(id)); // Find the city by ID

    // If city not found, return 404 status
    if (!city) {
        return res.status(404).json({ message: "City not found" });
    }

    // Return the found city
    return res.json(city);
});
