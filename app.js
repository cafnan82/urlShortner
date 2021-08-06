const express = require('express');
const app = express();
const config = require('./config/database');
const Url = require('./models/url'); 
var validUrl = require('valid-url');
const { body, validationResult } = require('express-validator');
var bodyParser = require('body-parser');
var shortid = require('shortid');


const mongoose = require('mongoose');
//connect to db
mongoose.connect(config.database, { 
    useUnifiedTopology: true,
    useNewUrlParser: true 
 });
  var db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("mongodb connected");
  });

app.use(express.json());
app.use(express.urlencoded());

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index');
  })

app.post('/',body('url').isEmpty(), async function (req, res) {
    var longUrl = req.body.ip;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() });
    }
    if (validUrl.isUri(longUrl)){
        const shortUrl = shortid.generate();
        let link = await Url.findOne({url: longUrl});
        if (link) {
            res.render("target.ejs", {
                surl: link,

            });
        } else {
            newLink = new Url({
                url: longUrl,
                redurl: shortUrl,
            });
            await newLink.save();
            Url.findOne({redurl: shortUrl}, function (err, l) {
                if (err){
                    console.log(err)
                }
                else{
                    res.render("target.ejs", {
                        surl: l,
                    });
                }
            });
            
        }
    } else {
        return res.json({ errors: "Not a URL" });
    }
});

app.post('/reduce/:url', async function (req, res) {
var surl = req.params['url'];
console.log(req.params['url']);
let link = await Url.findOne({redurl: surl});
res.redirect(link.url);
})
app.listen(3000, function() {
    console.log("server");
  })