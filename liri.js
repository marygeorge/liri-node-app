var items = require("./keys.js");
var fsWrite=require("fs");
var log=process.argv[2];
for(var v=3; v<process.argv.length; v++){log+=" '"+process.argv[v]+"' "} // formating for multiword agrvs
log+="\n";
logData(log); //write to log.txt

if(process.argv[2]=== "do-what-it-says")
{ 
        var fs=require("fs");
        fs.readFile("random.txt","utf8",function(err,data){
        if(err){console.log(err);}
        data=data.split(",");
        //console.log(data[1]);console.log(data[2]);
        doOptions(data[0],data[1],data[2]);
        });
}
else
{
    doOptions(process.argv[2], "", "")
}


//----FUNCTIONS---------------------------------------------------------------------------
function doOptions(what, arg1, arg2)
{
switch (what)
{
   case "my-tweets": 
        myTwitter();
   break;
   
   case "spotify-this-song":
    if(arg1==="" && arg2==="")     
    {   var trk=""
        var artst=""
        if(process.argv.length>3)
            {trk=process.argv[3];
            artst=process.argv[4];}
        else
            {trk="The Sign";
            artst="Ace of Base";} 
    getSong(trk,artst);
    }  
    else{  getSong(arg1,arg2); }
   break;

   case "movie-this":
     if(arg1==="" && arg2==="")     
    {   var mve=""
        if(process.argv.length>3)
        {
            for(var t=3;t<process.argv.length; t++)
            {   mve+=process.argv[t]+" ";   }
            getMovie(mve);
        }
        else
        {   
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        } 
    }
    else
    {
        getMovie(arg1);
    }   
   break;
}
}

function myTwitter()
{
    console.log(log);
    var Twitter = require('twitter');
        var client = new Twitter({
            consumer_key: items.twitterKeys.consumer_key,
            consumer_secret: items.twitterKeys.consumer_secret,
            access_token_key: items.twitterKeys.access_token_key,
            access_token_secret: items.twitterKeys.access_token_secret
        });
        var params = {screen_name: 'reahgeorge'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
            var l=20;
            if(tweets.length<20){l=tweets.length;}
                for(var i=0;i<l;i++)
                {
                    var r=i+1;
                    var outputData="----------Tweet"+r+"---------------\n"+tweets[i].text+"\n"+tweets[i].created_at+"\n\n"
                    console.log(outputData);
                    logData(outputData); //write to log.txt
                }
            }
            else
            {
                console.log("Error: " + Error);
                logData("\nError: " + Error+"\n\n");
            }
        });
}

function getSong(trk,artst)
{
    var LastFmNode = require('lastfm').LastFmNode;
    var lastfm = new LastFmNode({
    api_key: items.lastFMKeys.API_key,
    secret: items.lastFMKeys.Shared_secret
    });
    console.log("Details for "+trk);
    lastfm.request("track.getInfo", {
        track: trk,
        artist:artst,
        handlers: 
        {
            success: function(data) {
                var outputData="ARTIST: "+data.track.artist.name+"\n";
                outputData+="SONG: "+data.track.name+"\n";
                outputData+="PREVIEW LINK: "+data.track.url+"\n";
                outputData+="ALBUM: "+data.track.album.title+"\n";
                console.log(outputData);
                logData(outputData+"\n\n"); //write to log.txt
                
            },
            error: function(error) {
                console.log("Error: " + error.message);
                logData("Error: " + error.message+"\n\n");
            }
        }
    });
}

function getMovie(mve)
{
    var request = require('request');
    //var queryURL="https://api.themoviedb.org/3/search/movie?api_key=259bd834a8c0e8bccff14619b9f5151c&query="+mve;
    var queryURL="http://www.omdbapi.com/?apikey=40e9cece&t="+mve;
    request(queryURL, function (error, response, body) 
    {
        if(!error)
        {
            var result=JSON.parse(body)
            var outputData="TITLE: "+result.Title+"\n";
            outputData+="RELEASED: "+result.Released+"\n";
            outputData+="IMDB RATING: "+result.Ratings[0].Value+"\n";
            outputData+="Rotten Tomatoes RATING: "+result.Ratings[1].Value+"\n";
            outputData+="COUNTRY: "+result.Country+"\n";
            outputData+="LANGUAGE: "+result.Language+"\n";
            outputData+="PLOT: "+result.Plot+"\n";
            outputData+="ACTORS: "+result.Actors+"\n";
            console.log(outputData);
            logData(outputData+"\n\n"); //write to log.txt
        }
        else
        {
            console.log("Error: "+error)
            logData("Error: "+error+"\n\n"); //write to log.txt
        }
    });

}

//____________$$-BONUS-$$__________________________
function logData(data)
{
    fsWrite.appendFile("log.txt",data, function(err)
    {
        if(err){conso.length(err);}
    });
}