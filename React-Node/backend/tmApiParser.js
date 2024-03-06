const tmApis = require('./tmApis');
const GeoHash = require('ngeohash');
const res = require('express/lib/response');

async function searchAllEvents(data) {
    data['geoPoint'] = GeoHash.encode(data.latitude, data.longitude);
    delete data.latitude;
    delete data.longitude;
    var response = await tmApis.getAllEvents(data);
    if(!response.hasOwnProperty('page') || response.hasOwnProperty('errors')) {
        return {"error": "Some error from ticketmaster"};
    } 
    var result = {};
    try {
        result["number_of_elements"] = Math.min(response.page.totalElements===undefined?0:response.page.totalElements,20)
    } catch {
        result["number_of_elements"] = 0
    }
    if(result["number_of_elements"]==0) {
        return {"error": "No results available"};
    }
    result["events"] = [];
    for(var i = 0; i < result["number_of_elements"]; i++) {
        var event = response["_embedded"]["events"][i]
        result["events"].push({});
        try {
            result["events"][i]["localDate"] = event["dates"]["start"]["localDate"]===undefined?"":event["dates"]["start"]["localDate"]
        } catch {
            result["events"][i]["localDate"] = ""
        }
        try {
            result["events"][i]["localTime"] = event["dates"]["start"]["localTime"]===undefined?"":event["dates"]["start"]["localTime"]
        } catch {
            result["events"][i]["localTime"] = ""
        }
        try {
            if(!(event["images"][0]["url"].toLowerCase() in {"undefined":1,"null":1,"none":1})) {
                result["events"][i]["icon"] = event["images"][0]["url"]===undefined?"":event["images"][0]["url"];
            } else {
                result["events"][i]["icon"] = ""
            }
        } catch {
                result["events"][i]["icon"] = ""
        }
        try {
            result["events"][i]["name"] = event["name"]===undefined?"":event["name"]
        } catch {
            result["events"][i]["name"] = ""
        }
        try {
                result["events"][i]["id"] = event["id"]===undefined?"":event["id"]
        } catch {
            result["events"][i]["id"] = ""
        }
        try {
            result["events"][i]["genre"] = event["classifications"][0]["segment"]["name"]===undefined?"":event["classifications"][0]["segment"]["name"]
        } catch {
            result["events"][i]["genre"] = ""
        }
        try {
            result["events"][i]["venue"] = event["_embedded"]["venues"][0]["name"]===undefined?"":event["_embedded"]["venues"][0]["name"]
        } catch {
            result["events"][i]["venue"] = ""
        }
    }
    for(var i = 0; i < result["number_of_elements"]; i++) {   
        for(var j = 0; j < result["number_of_elements"]-i-1; j++) {
            if(result["events"][j]["localDate"].localeCompare(result["events"][j+1]["localDate"])>0) {
                var temp = result["events"][j]
                result["events"][j] = result["events"][j+1]
                result["events"][j+1] = temp
            } else if(result["events"][j]["localDate"].localeCompare(result["events"][j+1]["localDate"])==0 && result["events"][j]["localTime"].localeCompare(result["events"][j+1]["localTime"])>0) {
                var temp = result["events"][j]
                result["events"][j] = result["events"][j+1]
                result["events"][j+1] = temp
            }
        }
    }
    return result;
}

async function searchEventDetails(id) {
    var response = await tmApis.getEventDetails(id);
    var result = {};
    if("errors" in response) {
        return {"error": "No Event found"};
    }
    try {
        result["name"] = response["name"]===undefined?"":response["name"]
    } catch {
        result["name"] = ""
    }
    result["id"] = id
    try {
        result["localDate"] = response["dates"]["start"]["localDate"]===undefined?"":response["dates"]["start"]["localDate"]
    } catch {
        result["localDate"] = ""
    }
    try {
        result["localTime"] = response["dates"]["start"]["localTime"]===undefined?"":response["dates"]["start"]["localTime"]
    } catch {
        result["localTime"] = ""
    }
    result["num_artists"] = 0
    result["artists"] = []
    try {
        var num_artists = response["_embedded"]["attractions"].length;
        for(var i = 0; i < num_artists; i++ ){
            var artist = response["_embedded"]["attractions"][i]
            result["artists"].push({});
            try {
                result["artists"][i]["name"] = artist["name"]===undefined?"":artist["name"]
            } catch {
                result["artists"][i]["name"] = ""
            }
            try {
                result["artists"][i]["url"] = artist["url"]===undefined?"":artist["url"]
            } catch {
                result["artists"][i]["url"] = ""
            }
            try {
                result["artists"][i]["music"] = (artist["classifications"][0]["segment"]["name"]=="Music"||artist["classifications"][0]["segment"]["name"]=="music")?true:false
            } catch {
                result["artists"][i]["music"] = false
            }
            result["num_artists"]++;
        }
    } catch {}
    try {
        result["venue"] = response["_embedded"]["venues"][0]["name"]===undefined?"":response["_embedded"]["venues"][0]["name"]
    } catch {
        result["venue"] = ""
    }
    try {
        result["subgenre"] = response["classifications"][0]["subGenre"]["name"]===undefined?"":response["classifications"][0]["subGenre"]["name"]
        result["subgenre"] = (result["subgenre"]==="Undefined" || result["subgenre"]==="undefined")?"":result["subgenre"]
    } catch {
        result["subgenre"] = ""
    }
    try {
        result["genre"] = response["classifications"][0]["genre"]["name"]===undefined?"":response["classifications"][0]["genre"]["name"]
        result["genre"] = (result["genre"]==="Undefined" || result["genre"]==="undefined")?"":result["genre"]
    } catch {
        result["genre"] = ""
    }
    try {
        result["segment"] = response["classifications"][0]["segment"]["name"]===undefined?"":response["classifications"][0]["segment"]["name"]
        result["segment"] = (result["segment"]==="Undefined" || result["segment"]==="undefined")?"":result["segment"]
    } catch {
        result["segment"] = ""
    }
    try {
        result["subType"] = response["classifications"][0]["subType"]["name"]===undefined?"":response["classifications"][0]["subType"]["name"]
        result["subType"] = (result["subType"]==="Undefined" || result["subType"]==="undefined")?"":result["subType"]
    } catch {
        result["subType"] = ""
    }
    try {
        result["type"] = response["classifications"][0]["type"]["name"]===undefined?"":response["classifications"][0]["type"]["name"]
        result["type"] = (result["type"]==="Undefined" || result["type"]==="undefined")?"":result["type"]
    } catch {
        result["type"] = ""
    }
    try {
        result["min"] = response["priceRanges"][0]["min"]===undefined?"":response["priceRanges"][0]["min"]
    } catch {
        result["min"] = ""
    }
    try {
        result["max"] = response["priceRanges"][0]["max"]===undefined?"":response["priceRanges"][0]["max"]
    } catch {
        result["max"] = ""
    }
    if(result["min"] === "") {
        result["min"] = result["max"]
    }
    if(result["max"] === "") {
        result["max"] = result["min"]
    }
    try {
        result["ticket_status"] = response["dates"]["status"]["code"]===undefined?"":response["dates"]["status"]["code"]
    } catch {
        result["ticket_status"] = ""
    }
    try {
        result["buy_ticket"] = response["url"]===undefined?"":response["url"]
    } catch {
        result["buy_ticket"] = ""
    }
    try {
        result["seatmap"] = response["seatmap"]["staticUrl"]===undefined?"":response["seatmap"]["staticUrl"]
    } catch {
        result["seatmap"] = ""
    }
    return result;
}

async function searchVenueDetails(venue) {
    var response = await tmApis.getVenueDetails(venue);
    var result = {};
    if("errors" in response) {
        return {"error": "No Venue found"};
    }
    try {
        if (response["page"]["totalElements"] == 0) {
            result["error"] = "No Venue found"
            return result
        }
    } catch {
            result["error"] = "No Venue found due to error from ticketmaster"
        return result
    }
    try {
        result["name"] = response["_embedded"]["venues"][0]["name"]===undefined?"":response["_embedded"]["venues"][0]["name"]
    } catch {
        result["name"] = ""
    }
    try {
        result["address"] = response["_embedded"]["venues"][0]["address"]["line1"]===undefined?"":response["_embedded"]["venues"][0]["address"]["line1"]
    } catch {
        result["address"] = ""
    }
    try {
        result["city"] = response["_embedded"]["venues"][0]["city"]["name"]===undefined?"":response["_embedded"]["venues"][0]["city"]["name"]
    } catch {
        result["city"] = ""
    }
    try {
        result["state"] = response["_embedded"]["venues"][0]["state"]["name"]===undefined?"":response["_embedded"]["venues"][0]["state"]["name"]
    } catch {
        result["state"] = ""
    }
    try {
        result["phoneNumber"] = response["_embedded"]["venues"][0]["boxOfficeInfo"]["phoneNumberDetail"]===undefined?"":response["_embedded"]["venues"][0]["boxOfficeInfo"]["phoneNumberDetail"]
    } catch {
        result["phoneNumber"] = ""
    } 
    try {
        result["openHours"] = response["_embedded"]["venues"][0]["boxOfficeInfo"]["openHoursDetail"]===undefined?"":response["_embedded"]["venues"][0]["boxOfficeInfo"]["openHoursDetail"]
    } catch {
        result["openHours"] = ""
    }
    try {
        result["generalRule"] = response["_embedded"]["venues"][0]["generalInfo"]["generalRule"]===undefined?"":response["_embedded"]["venues"][0]["generalInfo"]["generalRule"]
    } catch {
        result["generalRule"] = ""
    }
    try {
        result["childRule"] = response["_embedded"]["venues"][0]["generalInfo"]["childRule"]===undefined?"":response["_embedded"]["venues"][0]["generalInfo"]["childRule"]
    } catch {
        result["childRule"] = ""
    }
    try {
        result["latitude"] = response["_embedded"]["venues"][0]["location"]["latitude"]===undefined?"":response["_embedded"]["venues"][0]["location"]["latitude"]
    } catch {
        result["latitude"] = ""
    }
    try {
        result["longitude"] = response["_embedded"]["venues"][0]["location"]["longitude"]===undefined?"":response["_embedded"]["venues"][0]["location"]["longitude"]
    } catch {
        result["longitude"] = ""
    }
    result["maps"] = "https://www.google.com/maps/search/?api=1&query=" + result["name"] + " " + result["address"]
    return result;
}

async function autocompleteSuggest(keyword) {
    var result = await tmApis.suggest(keyword);
    var response = {"names" : []};
    try {
        response["number_of_elements"] = result["_embedded"]["attractions"].length
    } catch {
        response["number_of_elements"] = 0
    }
    for(var i = 0; i < response["number_of_elements"]; i++) {
        try {
            response["names"].push(result["_embedded"]["attractions"][i]["name"]===undefined?"":result["_embedded"]["attractions"][i]["name"])
        } catch {}
    }
    return response;
}

module.exports = {searchAllEvents, searchEventDetails, searchVenueDetails, autocompleteSuggest};