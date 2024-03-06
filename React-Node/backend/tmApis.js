const axios = require('axios');
const res = require('express/lib/response');

// API key and URL
const ticket_master_api_key = "<YOUR_TOKEN>";
const search_events_url = "https://app.ticketmaster.com/discovery/v2/events.json";
const event_details_url = "https://app.ticketmaster.com/discovery/v2/events/";
const venue_details_url = "https://app.ticketmaster.com/discovery/v2/venues.json";
const suggest_autocomplete_url = "https://app.ticketmaster.com/discovery/v2/suggest";

async function getAllEvents(data) {
    data["apikey"] = ticket_master_api_key;
    try {
        const response = await axios.get(search_events_url, {params: data});
        if(response.status == 200) {
            return response.data;
        } else {
            console.log(response.status);
            return {"errors": "Some error from ticketmaster"};
        }
    } catch(error) {
        console.log(error);
        return {"errors": "Some error from ticketmaster"};
    }
}

async function getEventDetails(id) {
    data = {}
    data["apikey"] = ticket_master_api_key;
    try {
        const response = await axios.get(event_details_url + id, {params: data});
        if(response.status == 200) {
            return response.data;
        } else {
            console.log(response.status);
            return {"errors": "Some error from ticketmaster"};
        }
    } catch(error) {
        console.log(error);
        return {"errors": "Some error from ticketmaster"};
    }
}

async function getVenueDetails(venue) {
    data = {}
    data["apikey"] = ticket_master_api_key;
    data["keyword"] = venue;
    try {
        const response = await axios.get(venue_details_url, {params: data});
        if(response.status == 200) {
            return response.data;
        } else {
            console.log(response.status);
            return {"errors": "Some error from ticketmaster"};
        }
    } catch(error) {
        console.log(error);
        return {"errors": "Some error from ticketmaster"};
    }
}

async function suggest(keyword) {
    data = {}
    data["apikey"] = ticket_master_api_key;
    data["keyword"] = keyword;
    try {
        const response = await axios.get(suggest_autocomplete_url, {params: data});
        if(response.status == 200) {
            return response.data;
        } else {
            console.log(response.status);
            return {"errors": "Some error from ticketmaster"};
        }
    } catch(error) {
        console.log(error);
        return {"errors": "Some error from ticketmaster"};
    }
}

module.exports = {getAllEvents, getEventDetails, getVenueDetails, suggest};