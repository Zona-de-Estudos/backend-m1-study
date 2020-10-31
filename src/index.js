const express =  require('express');
const {uuid, isUuid} = require("uuidv4");
const cors = require('cors');


const app = express();

app.use(cors())
app.use(express.json())

const projects = [];

// MIDDLEWARES

function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`

    console.time(logLabel)

    next()

    console.timeEnd(logLabel)
}

function validateProjectId(request, response, next) {
    const {id} = request.params;

    if(!isUuid(id)) return response.status(400).json({error: "Invalid project ID"})

    return next()
}

app.use(logRequests);

app.use("/projects/:id", validateProjectId);

// APIS

app.get("/projects", (req, res) => {
    const {title} = req.query;

    const results = title ? projects.filter(project => project.title.includes(title)) : projects;

    return res.json(results);
})

app.post("/projects", (req, res) => {
    const {title, owner} = req.body;

    const project = {id: uuid(), title, owner};

    projects.push(project)

    return res.json(project);
})

app.put("/projects/:id", (req, res) => {
    const {id} = req.params;
    const {title, owner} = req.body;

    const projectindex = projects.findIndex(project => project.id === id);

    if(projectindex < 0) return res.status(400).json({error: "project not found"}) 
    
    const project = {id, title, owner};
     
    projects[projectindex] = project;

    return res.json(project)
})

app.delete("/projects/:id", (req, res) => {
    const {id} = req.params;

    const projectindex = projects.findIndex(project => project.id === id);

    if(projectindex < 0) return res.status(400).json({error: "project not found"}) 

    projects.splice(projectindex, 1);

    res.status(204).send()
})

// START SERVER

app.listen(3333, () => {
    console.log("🚀 Server Started!");
})