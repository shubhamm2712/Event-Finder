var data;
var eventData;
var venueData;

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
  
function auto_detect_click() {
    var auto_detect = document.getElementById("form_auto_detect");
    var location_input = document.getElementById("form_location");
    if(auto_detect.checked) {
        location_input.style.display = "none";
        location_input.removeAttribute("required");
    } else {
        location_input.style.display = "block";
        location_input.setAttribute("required","");
    }
}

function validate() {
    var form_keyword = document.getElementById("form_keyword");
    var form_auto_detect = document.getElementById("form_auto_detect");
    var form_location = document.getElementById("form_location");
    if(form_keyword.value.trim() == "") return false;
    if(!form_auto_detect.checked && form_location.value.trim() == "") return false;
    return true;
}

function display_error(error) {
    document.getElementById("no_events").innerHTML = "<div id = 'error_text'>"+error+"</div>";
}

function get_IP_location() {
    var ipinfo_token = "<YOUR_TOKEN>";
    var url = "https://ipinfo.io/"
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            var loc = response.loc.split(',');
            document.getElementById("form_latitude").value = loc[0];
            document.getElementById("form_longitude").value = loc[1];
            search_events();
        }
    }
    xmlhttp.open("GET", url + "?token=" + ipinfo_token, true);
    xmlhttp.send();
}

function get_location_from_address(address) {
    var geocoding_api = "<YOUR_TOKEN>";
    var url = "https://maps.googleapis.com/maps/api/geocode/json";
    var xmlhttp = new XMLHttpRequest();
    console.log(url + "?address=" + address + "&key=" + geocoding_api);
    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            if(response.status == "OK") {
                document.getElementById("form_latitude").value = response.results[0].geometry.location.lat
                document.getElementById("form_longitude").value = response.results[0].geometry.location.lng
                search_events();
            } else {
                document.getElementById("form_latitude").value = "";
                document.getElementById("form_longitude").value = "";
                display_error("Invalid Location");
            }
        }
    }
    xmlhttp.open("GET", url + "?address=" + address + "&key=" + geocoding_api, true);
    xmlhttp.send();
}

function change_order_event() {
    for(var i = 0; i < data["number_of_elements"]; i++) {
        for(var j = 0; j < data["number_of_elements"] - i - 1 ; j++) {
            if((data["name"] == 1 && data["events"][j]["name"] < data["events"][j+1]["name"]) || 
            (data["name"] == -1 && data["events"][j]["name"] > data["events"][j+1]["name"])) {
                temp = data["events"][j];
                data["events"][j] = data["events"][j+1];
                data["events"][j+1] = temp;
            }
        }
    }
    data["name"] *= -1;
    display_events();
}

function change_order_genre() {
    for(var i = 0; i < data["number_of_elements"]; i++) {
        for(var j = 0; j < data["number_of_elements"] - i - 1 ; j++) {
            if((data["genre"] == 1 && data["events"][j]["genre"] < data["events"][j+1]["genre"]) || 
            (data["genre"] == -1 && data["events"][j]["genre"] > data["events"][j+1]["genre"])) {
                temp = data["events"][j];
                data["events"][j] = data["events"][j+1];
                data["events"][j+1] = temp;
            }
        }
    }
    data["genre"] *= -1;
    display_events();
}

function change_order_venue() {
    for(var i = 0; i < data["number_of_elements"]; i++) {
        for(var j = 0; j < data["number_of_elements"] - i - 1 ; j++) {
            if((data["venue"] == 1 && data["events"][j]["venue"] < data["events"][j+1]["venue"]) || 
            (data["venue"] == -1 && data["events"][j]["venue"] > data["events"][j+1]["venue"])) {
                temp = data["events"][j];
                data["events"][j] = data["events"][j+1];
                data["events"][j+1] = temp;
            }
        }
    }
    data["venue"] *= -1;
    display_events();
}

function show_venue_card() {
    if(eventData.hasOwnProperty("error")) {
        display_error(venueData["error"]);
    } else {
        var venue_html = "<div id = 'venue_card_border'>";
        venue_html += "<div id = 'venue_card_inner_border'>";
        venue_html += "<div id = 'venue_card_name'>";
        if(venueData["name"]!=="" && venueData["name"].toLowerCase()!=="undefined") {
            venue_html += "&nbsp;&nbsp;" + venueData["name"] + "&nbsp;&nbsp;";
        }
        venue_html += "</div>";
        //image
        if(venueData["image"]!=="" && venueData["image"].toLowerCase()!=="undefined") {
            venue_html += "<div id = 'venue_image_card'><img src='";
            venue_html += venueData["image"];
            venue_html += "' id = 'venue_image'></div>";
        }
        //2divs
        venue_html += "<div id = 'container_venue'>";
        venue_html += "<div id = 'venue_info_1'>";
        //address
        venue_html += "<div id = 'venue_card_address'>"
        if(venueData["address"]!=="" || venueData["city"]!=="" || venueData["state_code"]!=="" || venueData["postal_code"]!=="") {
            venue_html += "<div id = 'address_part_1'><span id='write_address'>Address:</span>";
            venue_html += "</div>";
            venue_html += "<div id = 'address_part_2'>";
            if(venueData["address"]!=="") venue_html += venueData["address"] + "<br>";
            if(venueData["city"]!=="") venue_html += venueData["city"]+",";
            if(venueData["state_code"]!=="") venue_html += venueData["state_code"] + "<br>";
            if(venueData["postal_code"]!=="") venue_html += venueData["postal_code"];
            venue_html += "</div>";
        }
        venue_html += "</div>";
        //google maps
        venue_html += "<div><a class = 'venue_card_link' target='_blank' href = '" + venueData["maps"] + "'>Open in Google Maps</a></div>"
        venue_html += "</div>";
        venue_html += "<div id = 'venue_info_2'>";
        venue_html += "<a target = '_blank' class='venue_card_link' href = '";
        if(venueData["upcoming_events"]!=="" && venueData["upcoming_events"].toLowerCase()!=="undefined") venue_html += venueData["upcoming_events"];
        else venue_html += "#";
        venue_html += "'>More events at this venue</a>";
        venue_html += "</div>";
        venue_html += "</div>"
        venue_html += "</div>";
        venue_html += "</div>";
        document.getElementById("venue_details").innerHTML = venue_html;
        delay(250).then(() => document.getElementById("venue_details").scrollIntoView({"behavior":"smooth"}));
    }
}

function get_venue() {
    document.getElementById("show_venue").innerHTML = "";
    var url = "/venueDetails"
    url = url + "?keyword=" + eventData["venue"];
    console.log(url);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            venueData = response;
            console.log(venueData);
            show_venue_card();
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function show_venue_option() {
    var show_venue_html = "<div id = 'show_venue_text'>Show Venue Details</div>";
    show_venue_html += "<div id = 'show_venue_logo' onclick = 'get_venue();'></div>";
    document.getElementById("show_venue").innerHTML = show_venue_html;
}

function show_event_card() {
    if(eventData.hasOwnProperty("error")) {
        display_error(eventData["error"]);
    } else {
        var card_html = "";
        card_html += "<div id = 'event_card'>" + 
        "<div id = 'event_name'>" + eventData["name"] + "</div>" + 
        "<div id = 'card_1'>";
        //Date
        card_html += "<div class = 'card_detail_row'>";
        if(eventData["localDate"]!=="") {
            card_html += "<span class='card_detail_label'>Date</span>"
            card_html += "<span class='card_detail_info'>";
            card_html += eventData["localDate"] + " " + eventData["localTime"];
            card_html += "</span>";
        }
        card_html += "</div>";
        //Artist
        card_html += "<div class = 'card_detail_row'>";
        if(eventData["num_artists"]!=0 && eventData["artists"][0]["name"]!=="" && eventData["artists"][0]["name"].toLowerCase()!=="undefined") {
            card_html += "<span class='card_detail_label'>Artist/Team</span>"
            card_html += "<span class='card_detail_info'>";
            if(eventData["artists"][0]["url"]!=="" && eventData["artists"][0]["name"]!=="") {
                card_html += "<a href='" + eventData["artists"][0]["url"] + "' class = 'card_info_link' target='_blank'>";
                card_html += eventData["artists"][0]["name"];
                card_html += " </a>";
            } else if(eventData["artists"][0]["name"]!=="") {
                card_html += eventData["artists"][0]["name"] + " ";
            }
            for(var i = 1; i < eventData["num_artists"]; i++) {
                if(eventData["artists"][i]["url"]!=="" && eventData["artists"][i]["name"]!=="") {
                    card_html += "| <a href='" + eventData["artists"][i]["url"] + "' class = 'card_info_link' target='_blank'>";
                    card_html += eventData["artists"][i]["name"];
                    card_html += " </a>";
                } else if(eventData["artists"][i]["name"]!=="") {
                    card_html += "| " + eventData["artists"][i]["name"] + " ";
                }
            }
            card_html += "</span>";
        }
        card_html += "</div>";
        //Venue
        card_html += "<div class = 'card_detail_row'>";
        if(eventData["venue"]!=="" && eventData["venue"].toLowerCase()!=="undefined") {
            card_html += "<span class='card_detail_label'>Venue</span>"
            card_html += "<span class='card_detail_info'>";
            card_html += eventData["venue"];
            card_html += "</span>";
        }
        card_html += "</div>";
        //Genres
        card_html += "<div class = 'card_detail_row'>";
        var genre = [];
        if(eventData["segment"]!=="" && eventData["segment"].toLowerCase()!=="undefined") {
            genre.push(eventData["segment"]);
        }
        if(eventData["genre"]!=="" && eventData["genre"].toLowerCase()!=="undefined") {
            genre.push(eventData["genre"]);
        }
        if(eventData["subgenre"]!=="" && eventData["subgenre"].toLowerCase()!=="undefined") {
            genre.push(eventData["subgenre"]);
        }
        if(eventData["type"]!=="" && eventData["type"].toLowerCase()!=="undefined") {
            genre.push(eventData["type"]);
        }
        if(eventData["subType"]!=="" && eventData["subType"].toLowerCase()!=="undefined") {
            genre.push(eventData["subType"]);
        }
        if(genre.length!=0) {
            card_html += "<span class='card_detail_label'>Genres</span>"
            card_html += "<span class='card_detail_info'>";
            card_html += genre[0] + " ";
            for(var i=1;i<genre.length;i++) {
                card_html += "| " + genre[i] + " ";
            }
            card_html += "</span>";
        }
        card_html += "</div>";
        //Price
        card_html += "<div class = 'card_detail_row'>";
        if(eventData["min"]!=="" && eventData["max"]!=="") {
            card_html += "<span class='card_detail_label'>Price Ranges</span>"
            card_html += "<span class='card_detail_info'>";
            if(eventData["min"]!=="") card_html += eventData["min"];
            else card_html += eventData["max"];
            card_html += " - ";
            if(eventData["max"]!=="") card_html += eventData["max"];
            else card_html += eventData["min"];
            card_html += " "
            if(eventData["currency"]!=="") card_html += eventData["currency"];
            card_html += "</span>";
        }
        card_html += "</div>";
        //Ticket status
        card_html += "<div class = 'card_detail_row'>";
        if(eventData["ticket_status"]!=="" && eventData["ticket_status"].toLowerCase()!=="undefined") {
            card_html += "<span class='card_detail_label' id = 'ticket_status_label'>Ticket Status</span>"
            card_html += "<span class='card_detail_info'>";
            if(eventData["ticket_status"]=="onsale") {
                card_html += "<span class='on_sale_ticket_status'>";
                card_html += "On sale";
            }
            else if(eventData["ticket_status"]=="offsale") {
                card_html += "<span class='off_sale_ticket_status'>";
                card_html += "Off sale";
            }
            else if(eventData["ticket_status"]=="cancelled") {
                card_html += "<span class='cancelled_ticket_status'>";
                card_html += "Cancelled";
            }
            else if(eventData["ticket_status"]=="rescheduled") {
                card_html += "<span class='postponed_ticket_status'>";
                card_html += "Rescheduled";
            }
            else {
                card_html += "<span class='postponed_ticket_status'>";
                card_html += "Postponed";
            }
            card_html += "</span></span>";
        }
        card_html += "</div>";
        //Buy ticket at
        card_html += "<div class = 'card_detail_row'>";
        if(eventData["buy_ticket"]!=="" && eventData["buy_ticket"].toLowerCase()!=="undefined") {
            card_html += "<span class='card_detail_label'>Buy Ticket At:</span>"
            card_html += "<span class='card_detail_info'><a href='";
            card_html += eventData["buy_ticket"];
            card_html += "' class = 'card_info_link' target='_blank'>Ticketmaster</a></span>";
        }
        card_html += "</div>";
        //Close card_1
        card_html += "</div>" + 
        "<div id = 'card_2'>";
        if(eventData["seatmap"] !== ""){
        card_html += "<img src = '";
        card_html += eventData["seatmap"];
        card_html += "' id = 'seatmap_card'>";}
        card_html += "</div>" +
        "</div>";
        document.getElementById("event_details").innerHTML = card_html; 
        show_venue_option();
        delay(250).then(() => document.getElementById("event_details").scrollIntoView({"behavior":"smooth"}));
    }
}

function get_event(event_id) {
    eventData = null;
    venueData = null;
    document.getElementById('event_details').innerHTML = "";
    document.getElementById('show_venue').innerHTML = "";
    document.getElementById('venue_details').innerHTML = "";
    document.getElementById('no_events').innerHTML = "";
    document.getElementById("events_table").style.marginBottom = 0;
    var url = "/eventDetails"
    url = url + "?id=" + event_id;
    console.log(url);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            eventData = response;
            console.log(eventData);
            show_event_card();
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function display_events() {
    if(data["number_of_elements"] == 0) {
        display_error("No Records found");
    } else {
        var table = "<table id = 'events_table'>";
        table += 
        '<tr id = "table_header_row">' + 
            '<th id = "date_column"> Date </th>' +
            '<th id = "icon_column"> Icon </th>' +
            '<th id = "name_column" onclick = "change_order_event()"> Event </th>' +
            '<th id = "genre_column" onclick = "change_order_genre()"> Genre </th>' +
            '<th id = "venue_column" onclick = "change_order_venue()"> Venue </th>' +
        '</tr>'; 
        for(var i = 0; i < data["number_of_elements"]; i++) {
            table += 
            '<tr>' + 
                '<td><span class = "date_table">' + data["events"][i]["localDate"] + "</span><span class = 'time_table'>" + data["events"][i]["localTime"] + '</span></td>' + 
                '<td> <img class = "icon_table" src = "' + data["events"][i]["icon"] + '"> </td>' + 
                '<td><span class="event_names_clickable" onclick = "get_event(\'' + data["events"][i]["id"] + '\')">' + data["events"][i]["name"] + '</span></td>' + 
                '<td class="genre_table">' + data["events"][i]["genre"] + '</td>' + 
                '<td>' + data["events"][i]["venue"] + '</td>' + 
            '</tr>';
        }
        table += "</table>";
        document.getElementById("events_list").innerHTML = table;
    }
}

function clear_results() {
    data = 0;
    eventData = 0;
    venueData = 0;
    document.getElementById('events_list').innerHTML = ""
    document.getElementById('event_details').innerHTML = ""
    document.getElementById('show_venue').innerHTML = ""
    document.getElementById('venue_details').innerHTML = ""
    document.getElementById('no_events').innerHTML = ""
}
 
function search_events() {
    clear_results();
    var form_keyword = document.getElementById('form_keyword').value;
    var form_category = document.getElementById('form_category').value;
    var form_distance = document.getElementById('form_distance').value;
    if(form_distance == "") {
        form_distance = 10;
    }
    var form_latitude = document.getElementById('form_latitude').value;
    var form_longitude = document.getElementById('form_longitude').value;
    var form_unit = "miles";
    var url = "/searchEvents"
    url = url + "?keyword=" + form_keyword + "&segmentId=" + form_category;
    url = url + "&radius=" + form_distance + "&unit=" + form_unit;
    url = url + "&latitude=" + form_latitude + "&longitude=" + form_longitude; 
    console.log(url);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xmlhttp.responseText);
            data = response;
            console.log(response);
            display_events();
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function validate_and_search() {
    var validated = validate();
    if(validated) {
        var auto_detect = document.getElementById("form_auto_detect");
        if(auto_detect.checked) {
            get_IP_location();
        } else {
            var form_location = document.getElementById("form_location");
            get_location_from_address(form_location.value);
        }
    }
}

function clear_form() {
    document.getElementById('form_keyword').value = "";
    document.getElementById('form_distance').value = "";
    document.getElementById('form_category_default').setAttribute("selected","");
    document.getElementById('form_auto_detect').checked = false;
    auto_detect_click();
    document.getElementById('form_location').value = "";
    clear_results();
    return false;
}