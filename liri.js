var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
require('dotenv').config();
var keys = require('./keys.js');
var fs = require('fs');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


switch(process.argv[2]){
    case 'my-tweets':
        getTweets();
    break;
    case 'spotify-this-song':
        if(process.argv[3]){
            var song = process.argv[3]
            for(var i = 4; typeof process.argv[i] !== 'undefined'; i++){
                song += ("+" + process.argv[i]);
            }
            getSong(song);
        }else{
            getSong('Ace of Base The Sign');
        }
    break;
    case 'movie-this':
        if(process.argv[3]){
            var movie = process.argv[3];
            for(var i = 4; typeof process.argv[i] !== 'undefined'; i++){
                movie += ("+" + process.argv[i]);
            }
            getMovie(movie);
        }else{
            getMovie('Mr. Nobody');
        }
    break;
    case 'do-what-it-says':
         doText();
    break;
    default:
        console.log("Please Enter a valid command")
    break;
}


function getTweets(){
    var params = {screen_name: 'themichaelttran',
                  count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response){
        if(error){
            console.log(error);
        }else {
            console.log("These are the 20 recent tweets from user @themichaeltran");
            for(var i = 0; i < tweets.length; i++){
                var tweetNum = i + 1;
                console.log("Tweet " + tweetNum);
                console.log("Created at : " + tweets[i].created_at);
                console.log(tweets[i].text)
                console.log("------------------------------------");
            }
        }
    })
};

function getSong(song){
    spotify.search({type: 'track', query: song, limit: 1}, function(err, data){
        if(err){
            return console.log('Error occurred ' + err);
        }
        var artist = data.tracks.items[0].artists
        console.log("List of artist");
        for(var j = 0; j < artist.length; j++){
            console.log("-" + artist[j].name);
        }
        console.log("The song's name");
        console.log("-" + data.tracks.items[0].name);
        console.log("Link of the song from Spotify");
        console.log("-" + data.tracks.items[0].external_urls.spotify);
        console.log("The album the song is from")
        console.log("-" + data.tracks.items[0].album.name);
        console.log("-----------------------------------------------------")
        
    })
}

function getMovie(movie){
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=f9722351";
    request(queryUrl, {json : true}, (err, res, body) => {
        if(err) {
            return console.log(err);
        }
        console.log('```');
        console.log(" * Title: " + body.Title);
        console.log(" * Year: " + body.Year);
        console.log(" * IMDB Rating: " + body.imdbRating);
        console.log(" * Rotten Tomatoes Rating: " + body.Ratings[1].Value);
        console.log(" * Country(s): " + body.Country);
        console.log(" * Language(s): " + body.Language);
        console.log(" * Plot: " + body.Plot);
        console.log(" * Actors: " + body.Actors);
        console.log('```');
    })
};

function doText(){
    fs.readFile('./random.txt', 'utf8', function(error, data){
        var dataArr = data.split(',');
        var method = dataArr[0];
        var argument = dataArr[1];

        console.log(method + " " + argument);
        switch(method){
            case 'spotify-this-song':
                getSong(argument);
            break;
            case 'movie-this':
                getMovie(argument);
            break;
        }

    })
}