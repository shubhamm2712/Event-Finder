import React from "react";
import { Row, Col, Container, Table, Image } from "react-bootstrap";

class EventsTable extends React.Component {

    getEvent = async (event_id) => {
        var url = "https://sm-assign8.wl.r.appspot.com/eventDetails"
        url += "?id=" + event_id;
        var event;
        await fetch(url)
        .then(res => res.json())
        .then(data => {
            event = data;
        });
        return event;
    }

    showEvent = async (event_id) => {
        var event = await this.getEvent(event_id);
        // var musicRelatedFlag = false;
        // var keywords = [];
        // for(var i=0;i<event.artists.length;i++) {
        //     if(event.artists[i].music) {
        //         musicRelatedFlag = true;
        //         keywords.push(event.artists[i].name);
        //     }
        // }
        // var spoitfyData;
        // if(musicRelatedFlag){
        //     spoitfyData = await this.getSpotify(keywords);
        // } else {
        //     spoitfyData = {
        //         artists : []
        //     }
        // }
        // var venue = await this.getVenue(event.venue);
        var all_details = {
            "event": event,
            "spotify": null,
            "venue": null,
            "updated": false
        }
        console.log(all_details)
        this.props.update_event_details(all_details);
        this.props.change_table_view(false);
        this.props.change_details_view(true);
    }

    render() {
        if(this.props.events_list.hasOwnProperty('error')) {
            return <Container className="">
                <Row>
                    <Col></Col>
                    <Col className="table-error text-center text-danger mb-4 pt-0 pb-0 mx-auto" xs={"auto"} sm={"auto"} md={8} lg={7}>{this.props.events_list.error}</Col>
                    <Col></Col>
                </Row>
            </Container>
        }
        var tbody = this.props.events_list.events.map(event => 
            (<tr className="event-row" key={event.id} onClick={() => this.showEvent(event.id)}>
                <th>{event.localDate}<br/>{event.localTime}</th>
                <td><Image src={event.icon} className="events-table-icon"></Image></td>
                <td>{event.name}</td>
                <td>{event.genre}</td>
                <td>{event.venue}</td>
            </tr>)      
        );
        return <Container fluid="md" className="">
            <Row>
                <Col></Col>
                <Col className="table-div text-center text-danger mb-4 pt-0 pb-0" xs={12} sm={12} md={12} lg={10}>
                    <Table striped responsive variant="dark" className="events-table" id="events-table-id">
                        <thead>
                            <tr>
                                <th id="table-head-left" style={window.screen.width > 600 ? {width: "130px"} : {width: "130px"}}>Date/Time</th>
                                <th style={window.screen.width > 600 ? {width: "130px"} : {width: "130px"}}>Icon</th>
                                <th>Event</th>
                                <th style={window.screen.width > 600 ? {width: "110px"} : {width: "110px"}}>Genre</th>
                                <th id="table-head-right" style={window.screen.width > 600 ? {width: "170px"} : {width: "170px"}}>Venue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tbody}
                        </tbody>
                    </Table>
                </Col>
                <Col></Col>
            </Row>
        </Container>    
    }
}

export default EventsTable;