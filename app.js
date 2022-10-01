const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//connection to MongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

//create Schema
const articleSchema = {
    title: String,
    content: String
}

//create article model using mongoose
const Article = mongoose.model("Article", articleSchema);

//TODO

//chained routes
app.route("/articles")
//fetch all articles
.get(function(req,res){
    //look for articles in the wikiDB connected to localhost:27017
    Article.find(function(err, foundArticles){
        //if there are no errors, send articles found in DB to /articles URL
        if (!err) {
        res.send(foundArticles)
        } else {
            //if there is an error, show the errors
            res.send(err);
        }
    });
})
//post to articles
.post(function(req,res){

    //when creating a new article
    const newArticle = new Article ({
        title: req.body.title,
        content:req.body.content 
    });

    //save post to newArticle
    newArticle.save(function(err){
        if (!err) {
            res.send("Successfully added a new article.")
        } else {
            res.send(err);
        }
    });
})
//delete all articles
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err) {
            res.send("Successfully deleted all articles.")
        } else {
            res.send(err)
        }
    });
});

////////////////////////getting dynamic URL route//////////////
app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err,foundArticle){
        if(foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No Article Found.")
        }
    });
})

.put(function(req,res){
    Article.findOneAndUpdate(
        //condition to find
        {title: req.params.articleTitle},

        //data being updated
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated article")
            } else {
                res.send(err)
            }
        }
    );
})

.patch(function(req,res){

    Article.updateMany(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully updated article")
            } else {
                res.send(err)
            }
        }
    );
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err) {
            if(!err){
                res.send("Record Deleted")
            } else {
                res.send(err);
            }
        }
    )
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});