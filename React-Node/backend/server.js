const express = require('express');
const cors = require('cors');
const tmApiParsers = require('./tmApiParser');
const spotifyApis = require('./spotifyApi');
const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello from App Engine!');
});

app.get('/searchEvents', async (req, res) => {
    var data = {};
    data['keyword'] = req.query.keyword;
    data['segmentId'] = req.query.segmentId;
    data['radius'] = req.query.radius;
    data['unit'] = req.query.unit;
    data['latitude'] = req.query.latitude;
    data['longitude'] = req.query.longitude;
    let result = await tmApiParsers.searchAllEvents(data);
    res.json(result);
});

app.get('/eventDetails', async (req, res) => {
    var id = req.query.id;
    let result = await tmApiParsers.searchEventDetails(id); 
    res.send(result);
});

app.get('/venueDetails', async (req, res) => {
    var venue = req.query.keyword;
    let result = await tmApiParsers.searchVenueDetails(venue);
    res.send(result);
});

app.get('/autocomplete', async (req, res) => {
    var keyword = req.query.keyword;
    let result = await tmApiParsers.autocompleteSuggest(keyword);
    res.send(result);
});

app.get('/spotifyLink', async (req, res) => {
    var keywordList = req.query.keyword;
    res.send(await spotifyApis.getSpotifyData(keywordList));
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});