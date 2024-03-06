from geolib import geohash
from ticketMasterApis import *
import json

def searchAllEvents(data):
    data["geoPoint"] = geohash.encode(data["latitude"], data["longitude"], 7)
    data.pop("latitude")
    data.pop("longitude")

    response = getAllEvents(data)

    result = dict()
    if "page" not in response or "errors" in response:
        result["error"] = "Some error from ticketmaster"
        return result
    try:
        result["number_of_elements"] = min(response['page']['totalElements'],20)
    except: 
        result["number_of_elements"] = 0
    result["name"] = -1
    result["genre"] = -1
    result["venue"] = -1
    result["events"] = []
    for i in range(result["number_of_elements"]):
        event = response["_embedded"]["events"][i]
        result["events"].append(dict())
        try:
            result["events"][i]["localDate"] = event["dates"]["start"]["localDate"]
        except:
            result["events"][i]["localDate"] = ""
        try:
            result["events"][i]["localTime"] = event["dates"]["start"]["localTime"]
        except:
            result["events"][i]["localTime"] = ""
        try:
            if event["images"][0]["url"].lower() not in ["undefined","null","none"]:
                result["events"][i]["icon"] = event["images"][0]["url"]
            else:
                result["events"][i]["icon"] = ""
        except:
            result["events"][i]["icon"] = ""
        try:
            result["events"][i]["name"] = event["name"]
        except:
            result["events"][i]["name"] = ""
        try:
            result["events"][i]["id"] = event["id"]
        except:
            result["events"][i]["id"] = ""
        try:
            result["events"][i]["genre"] = event["classifications"][0]["segment"]["name"]
        except:
            result["events"][i]["genre"] = ""
        try:
            result["events"][i]["venue"] = event["_embedded"]["venues"][0]["name"]
        except:
            result["events"][i]["venue"] = ""
    return result

def searchEventDetails(id):
    response = getEventDetails(id)

    result = dict()
    if "errors" in response:
        result["error"] = "No Event found"
        return result
    try:
        result["name"] = response["name"]
    except:
        result["name"] = ""
    try:
        result["localDate"] = response["dates"]["start"]["localDate"]
    except:
        result["localDate"] = ""
    try:
        result["localTime"] = response["dates"]["start"]["localTime"]
    except:
        result["localTime"] = ""
    result["num_artists"] = 0
    result["artists"] = []
    try:
        for artist in response["_embedded"]["attractions"]:
            result["artists"].append(dict())
            try:
                result["artists"][-1]["name"] = artist["name"]
            except:
                result["artists"][-1]["name"] = ""
            try:
                result["artists"][-1]["url"] = artist["url"]
            except:
                result["artists"][-1]["url"] = ""
            result["num_artists"] += 1
    except:
        pass
    try:
        result["venue"] = response["_embedded"]["venues"][0]["name"]
    except:
        result["venue"] = ""
    try:
        result["subgenre"] = response["classifications"][0]["subgenre"]["name"] 
    except:
        result["subgenre"] = ""
    try:
        result["genre"] = response["classifications"][0]["genre"]["name"]
    except:
        result["genre"] = ""
    try:
        result["segment"] = response["classifications"][0]["segment"]["name"]
    except:
        result["segment"] = ""
    try:
        result["subType"] = response["classifications"][0]["subType"]["name"]
    except:
        result["subType"] = ""
    try:
        result["type"] = response["classifications"][0]["type"]["name"]
    except:
        result["type"] = ""
    try:
        result["min"] = response["priceRanges"][0]["min"]
    except:
        result["min"] = ""
    try:
        result["max"] = response["priceRanges"][0]["max"]
    except:
        result["max"] = ""
    try:
        result["currency"] = response["priceRanges"][0]["currency"]
    except:
        result["currency"] = ""
    try:
        result["ticket_status"] = response["dates"]["status"]["code"]
    except:
        result["ticket_status"] = ""
    try:
        result["buy_ticket"] = response["url"]
    except:
        result["buy_ticket"] = ""
    try:
        result["seatmap"] = response["seatmap"]["staticUrl"]
    except:
        result["seatmap"] = ""
    return result

def searchVenueDetails(venue):
    response = getVenueDetails(venue)

    result = dict()
    if "errors" in response:
        result["error"] = "No Venue found"
        return result
    try:
        if response["page"]["totalElements"] == 0:
            result["error"] = "No Venue found"
            return result
    except:
        result["error"] = "No Venue found due to error from ticketmaster"
        return result
    try:
        result["name"] = response["_embedded"]["venues"][0]["name"]
    except:
        result["name"] = ""
    try:
        result["address"] = response["_embedded"]["venues"][0]["address"]["line1"]
    except:
        result["address"] = ""
    try:
        result["city"] = response["_embedded"]["venues"][0]["city"]["name"]
    except:
        result["city"] = ""
    try:
        result["state_code"] = response["_embedded"]["venues"][0]["state"]["stateCode"]
    except:
        result["state_code"] = ""
    try:
        result["state"] = response["_embedded"]["venues"][0]["state"]["name"]
    except:
        result["state"] = ""
    try:
        result["postal_code"] = response["_embedded"]["venues"][0]["postalCode"]
    except:
        result["postal_code"] = ""
    try:
        result["upcoming_events"] = response["_embedded"]["venues"][0]["url"]
    except:
        result["upcoming_events"] = ""
    try:
        result["image"] = response["_embedded"]["venues"][0]["images"][0]["url"]
    except:
        result["image"] = ""
    result["maps"] = "https://www.google.com/maps/search/?api=1&query=" + result["name"] + " " + result["address"] + " " + result["city"] + " " + result["state"] + " " + result["postal_code"]
    return result