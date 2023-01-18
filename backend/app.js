const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://david:???@cluster0.nkhbko8.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection failed!');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            postId: createdPost._id
        });
    });
    
});

app.use("/api/posts", (req, res, next) => {
    // const posts = [
    //     { 
    //         id: 13215,
    //         title: "First server-side post",
    //         content: "This is coming from the server"
    //     },
    //     { 
    //         id: 1235,
    //         title: "Second server-side post",
    //         content: "This is coming from the server!!"
    //     }
    // ];    
    Post.find().then((documents) => {
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts: documents
        });
    });    
});

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then((result) => {
        res.status(200).json({ message: 'Deleted' });
    });
});

module.exports = app;