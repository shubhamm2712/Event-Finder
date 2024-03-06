import requests

# API key and URL
ticket_master_api_key = "<YOUR_TOKEN>"
search_events_url = "https://app.ticketmaster.com/discovery/v2/events.json"
event_details_url = "https://app.ticketmaster.com/discovery/v2/events/"
venue_details_url = "https://app.ticketmaster.com/discovery/v2/venues.json"
# https://app.ticketmaster.com/discovery/v2/events.json?apikey=q1fLWPda3G6TD8NoEBs4TcZL3iNG8cuT&keyword=University+of+Southern+California&segmentId=KZFzniwnSyZfZ7v7nE&radius=10&unit=miles&geoPoint=9q5cs

def getAllEvents(data):
    data["apikey"] = ticket_master_api_key
    res = requests.get(search_events_url,params = data)
    return res.json()

def getEventDetails(id):
    data = dict()
    data["apikey"] = ticket_master_api_key
    res = requests.get(event_details_url + str(id), params = data)
    return res.json()

def getVenueDetails(venue):
    data = dict()
    data["apikey"] = ticket_master_api_key
    data["keyword"] = venue
    res = requests.get(venue_details_url, params = data)
    return res.json()