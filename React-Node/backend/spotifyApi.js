var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: '<YOUR_TOKEN>',
    clientSecret: '<YOUR_TOKEN>'
});

// spotifyApi.setAccessToken("BQCW-8yPEDDy-T-Vtl29WiFcwF62R05X12AfnRcKHilIYM10VaI35XRpgaoAXj2DmV856ylR391gJijTKWlw5ypuYXF0ZPpwL8GPcdFDCOYbmhFDnMqA");
refresh_token();

async function refresh_token() {
    try{
        var response = await spotifyApi.clientCredentialsGrant()
        // spotifyApi.setAccessToken("BQCW-8yPEDDy-T-Vtl29WiFcwF62R05X12AfnRcKHilIYM10VaI35XRpgaoAXj2DmV856ylR391gJijTKWlw5ypuYXF0ZPpwL8GPcdFDCOYbmhFDnMqA");
        spotifyApi.setAccessToken(response.body.access_token);
        return true;
    } catch {
        return false;
    }
}

async function getSpotifyData(keywords) {
    var n = keywords.length;
    var result = {"artists":[]};
    for(var i = 1; i<n; i++) {
        keywords[i] = keywords[i].toLowerCase();
        var artist_results;
        try{
            artist_results = await spotifyApi.searchArtists(keywords[i]);
        } catch(e) {
            if(e.body.error===undefined || e.body.error.status==401) {
                var refreshed = await refresh_token();
                if(!refreshed) return result;
                artist_results = await spotifyApi.searchArtists(keywords[i]);
            } else{
                continue;
            }
        }
        if(artist_results.statusCode != 200) {console.log(keywords[i] + "caused some error");continue;}
        var results = [];
        try {
            results = artist_results.body.artists.items;
        } catch {}
        for(var j= 0; j <results.length; j++) {
            try{
                if(results[j].name.toLowerCase().localeCompare(keywords[i])==0){
                    var artist = {};
                    artist["name"] = results[j].name;
                    try{
                        artist["image"] = results[j].images[0].url
                    }catch {
                        artist["image"] = ""
                    }
                    try{
                        artist["id"] = results[j].id
                        artist["albums"] = []
                        var albums_response;
                        try{
                            albums_response = await spotifyApi.getArtistAlbums(artist["id"],{limit : 3});
                        } catch(e) {
                            if(e.body.error===undefined || e.body.error.status==401) {
                                var refreshed = await refresh_token();
                                if(!refreshed) return {"artists":[]};
                                albums_response = await spotifyApi.getArtistAlbums(artist["id"],{limit : 3});
                            } else{
                                console.log('Some weird error code from spotify',e);
                                return {"artists":[]};
                            }
                        }
                        if(albums_response.statusCode == 200) {
                            try{
                                var x = albums_response.body.items.length;
                                for(var k = 0 ;k<x;k++) {
                                    artist["albums"].push(albums_response.body.items[k].images[0].url)
                                }
                            } catch {}
                        }
                    }catch {
                        artist["id"] = ""
                        artist["albums"] = []
                    }
                    try {
                        artist["popularity"] = results[j].popularity
                    } catch {
                        artist["popularity"] = 0
                    }
                    try {
                        artist["followers"] = results[j].followers.total
                    } catch {
                        artist["followers"] = 0
                    }
                    try {
                        artist["link"] = results[j].external_urls.spotify;
                    } catch {
                        artist["link"] = "https://open.spotify.com/"
                    }
                    result.artists.push(artist);
                    break;
                }
            } catch {}
        }
    }
    return result;
}

module.exports = {getSpotifyData};