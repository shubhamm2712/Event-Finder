import React from "react";
import { Container, Form ,Row, Col, Button} from "react-bootstrap";
import AutofillComp from "./AutofillComp";

class SearchForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            distance: 10,
            category: "",
            autoDet: false,
            location: null,
            latitude: null,
            longitude: null,
            open: false,
            options: []
        }
    }

    autoDetectHandle = (event) => {
        if(event.target.checked) {
            document.getElementById("form_location").disabled = true;
            document.getElementById("form_location").value = "";
            this.setState({autoDet: true,location: null});
        } else {
            document.getElementById("form_location").disabled = false;
            this.setState({autoDet: false});
        }
    }

    keywordHandled = (event) => {
        this.setState({keyword: event.target.value});
    }

    keywordHandle = (word) => {
        if(word.length>0) {
            this.get_autocomplete(word)
        } else {
            this.setState({keyword: word})
        }
    }


    distanceHandle = (event) => {
        this.setState({distance: event.target.value});
    }

    categoryHandle = (event) => {
        this.setState({category: event.target.value});
    }

    locationHandle = (event) => {
        this.setState({location: event.target.value});
    }

    get_ip_location = async () => {
        var lat = null;
        var long = null;
        await fetch("https://ipinfo.io/?token=<YOUR_TOKEN>")
        .then(res => res.json())
        .then(data => {
            lat = data.loc.split(',')[0];
            long = data.loc.split(',')[1];
        });
        console.log(lat,long);
        return {"lat": lat,"long": long, "found": 1}
    }

    get_address_location = async() => {
        var lat = null;
        var long = null;
        var found = 1;
        await fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+this.state.location+"&key=<YOUR_TOKEN>")
        .then(res => res.json())
        .then(data => {
            if(data.status === "OK") {
                lat = data.results[0].geometry.location.lat;
                long = data.results[0].geometry.location.lng;
            } else {
                found = -1;
            }
        });
        return {"lat": lat,"long": long, "found": found};
    }

    get_events = async(latitude, longitude) => {
        var url = "https://sm-assign8.wl.r.appspot.com/searchEvents"
        url += "?keyword=" + this.state.keyword;
        url += "&segmentId=" + this.state.category;
        url += "&radius=" + this.state.distance;
        url += "&unit=miles";
        url += "&latitude=" + latitude;
        url += "&longitude=" + longitude;
        var events;
        await fetch(url)
        .then(res => res.json())
        .then(data => {
            events = data;
        });
        return events;
    }

    get_autocomplete = async(word) => {
        var result;
        await fetch('https://sm-assign8.wl.r.appspot.com/autocomplete?keyword='+word)
        .then(res => res.json())
        .then(data => {
            result = data;
        });
        console.log(result)
        this.setState({options: result.names,keyword: word})
        return;
    }

    handleSubmit = async (event) => {
        console.log("submit");
        this.props.change_table_view(false);
        this.props.update_events_list(null);
        this.props.change_details_view(false);
        this.props.update_event_details(null);
        event.preventDefault();
        var coordinates;
        if(this.state.autoDet) {
            coordinates = await this.get_ip_location();
        } else {
            coordinates = await this.get_address_location();
        }
        if(coordinates.found===1){
            var events = await this.get_events(coordinates.lat, coordinates.long);
            console.log(events)
            this.props.update_events_list(events);
            this.props.change_table_view(true);
        } else {
            this.props.update_events_list({error: "No address found"});
            this.props.change_table_view(true);
        }
    }

    handleClear = (event) => {
        console.log("clear");
        document.getElementById("form_keyword").value = "";
        document.getElementById("form_distance").value = 10;
        document.getElementById("form_category").selectedIndex = 0;
        document.getElementById("form_location").value = "";
        document.getElementById("form_location").disabled = false;
        document.getElementById("form_auto_detect").checked = false;
        this.setState({
            keyword: "",
            distance: 10,
            category: "",
            autoDet: false,
            location: null,
            latitude: null,
            longitude: null,
        });
        this.props.change_table_view(false);
        this.props.update_events_list(null);
        this.props.change_details_view(false);
        this.props.update_event_details(null);
    }

    render() {
        return <Container fluid="md">
            <Row>
                <Col></Col>
                <Col xs={12} sm={10} md={8} lg={6}>
                    <div className="search-box mx-auto p-4 pt-5">
                        {window.screen.width > 600 ? <h2 className="text-center">Events Search</h2> : <h1 className="text-center">Events Search</h1>}
                        <hr/>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="mb-1">Keyword <span className="text-danger">*</span></Form.Label>
                                <Form.Control id="form_keyword" onChange={this.keywordHandled} required></Form.Control>
                                {/* <AutofillComp get_autocomplete = {this.get_autocomplete} options = {this.state.options} open = {this.state.open} handle_keyword = {this.keywordHandle} keyword = {this.state.keyword}/> */}
                            </Form.Group>
                            <Row>
                                <Col xs={12} sm={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">Distance</Form.Label>
                                        <Form.Control type="number" id="form_distance" defaultValue={10} onChange={this.distanceHandle}></Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="mb-1">Category <span className="text-danger">*</span></Form.Label>
                                        <Form.Select className="w-75" id="form_category" onChange={this.categoryHandle}>
                                            <option value = "">Default</option>
                                            <option value = "KZFzniwnSyZfZ7v7nJ">Music</option>
                                            <option value = "KZFzniwnSyZfZ7v7nE">Sports</option>
                                            <option value = "KZFzniwnSyZfZ7v7na">Art and Theatre</option>
                                            <option value = "KZFzniwnSyZfZ7v7nn">Film</option>
                                            <option value = "KZFzniwnSyZfZ7v7n1">Miscellaneous</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label className="mb-1">Location <span className="text-danger">*</span></Form.Label>
                                <Form.Control id="form_location" onChange={this.locationHandle} required></Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check type="checkbox" id="form_auto_detect" label={'Auto-detect your location'} onClick={this.autoDetectHandle}></Form.Check>
                            </Form.Group>
                            <div className="text-center mb-4 mt-2">
                                <Button variant="danger" type="submit" className="me-3">SUBMIT</Button>
                                <Button onClick={this.handleClear}>CLEAR</Button>
                            </div>
                        </Form>
                    </div>
                </Col>
                <Col></Col>
            </Row>
        </Container>;
    }
}

export default SearchForm;