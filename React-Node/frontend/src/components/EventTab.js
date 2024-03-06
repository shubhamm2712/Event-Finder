import React from "react";
import { Col, Container, Row, Image } from "react-bootstrap";
import {ImFacebook2} from "react-icons/im"
import {BsTwitter} from "react-icons/bs"

class EventTab extends React.Component{
    render() {
        var artist = ""
        for(var i=0;i<this.props.data.event.artists.length;i++) {
            artist += (artist===""?"":" | ") + this.props.data.event.artists[i].name;
        }
        var event_category = ""
        event_category += ((event_category===""||this.props.data.event.segment==="")?"":(" | ")) + this.props.data.event.segment
        event_category += ((event_category===""||this.props.data.event.genre==="")?"":(" | ")) + this.props.data.event.genre
        event_category += ((event_category===""||this.props.data.event.subgenre==="")?"":(" | ")) + this.props.data.event.subgenre
        event_category += ((event_category===""||this.props.data.event.type==="")?"":(" | ")) + this.props.data.event.type
        event_category += ((event_category===""||this.props.data.event.subType==="")?"":(" | ")) + this.props.data.event.subType
        var text_mapping_status = {
            onsale: "On Sale",
            offsale: "Off Sale",
            canceled: "Canceled",
            postponed: "Postponed",
            rescheduled: "Rescheduled"
        }
        var date_element = <></>
        if(this.props.data.event.localDate!=="") {
            date_element = <div className={"event-data-field pt-2 pb-1"+(window.screen.width>600?" ps-3":"")}>
                <div className="text-center event-card-label">
                    Date
                </div>
                <div className="text-center event-card-data">
                    {this.props.data.event.localDate}
                </div>
            </div>
        }
        var artist_element = <></>
        if(artist!=="") {
            artist_element = <div className={"event-data-field pt-2 pb-1"+(window.screen.width>600?" ps-3":"")}>
                <div className="text-center event-card-label">
                    Artist/Team
                </div>
                <div className="text-center event-card-data">
                    {artist}
                </div>
            </div>
        }
        var venue_element = <></>
        if(this.props.data.event.venue!=="") {
            venue_element = <div className={"event-data-field pt-2 pb-1"+(window.screen.width>600?" ps-3":"")}>
                <div className="text-center event-card-label">
                    Venue
                </div>
                <div className="text-center event-card-data">
                    {this.props.data.event.venue}
                </div>
            </div>
        }
        var genre_element = <></>
        if(event_category!=="") {
            genre_element = <div className={"event-data-field pt-2 pb-1"+(window.screen.width>600?" ps-3":"")}>
                <div className="text-center event-card-label">
                    Genres
                </div>
                <div className="text-center event-card-data">
                    {event_category}
                </div>
            </div>
        }
        var price_element = <></>
        if(this.props.data.event.min!=="") {
            price_element = <div className={"event-data-field pt-2 pb-1"+(window.screen.width>600?" ps-3":"")}>
                <div className="text-center event-card-label">
                    Price Ranges
                </div>
                <div className="text-center event-card-data">
                    {this.props.data.event.min + "-" + this.props.data.event.max}
                </div>
            </div>
        }
        var status_element = <></>
        if(text_mapping_status.hasOwnProperty(this.props.data.event.ticket_status)) {
            status_element = <div className={window.screen.width>600?"event-data-field pt-2 pb-1 ps-3":"event-data-field pt-2 pb-1"}>
                <div className="text-center event-card-label">
                    Ticket Status
                </div>
                <div className="text-center event-card-data mt-1">
                    <span className={this.props.data.event.ticket_status}>{text_mapping_status[this.props.data.event.ticket_status]}</span>
                </div>
            </div>
        }
        return <Container className={window.screen.width>600?"p-2 ps-2 pe-4":"p-2"}>
            <Row>
                <Col xs={12} sm={12} md={5} lg={5} >
                    {date_element}
                    {artist_element}
                    {venue_element}
                    {genre_element}
                    {price_element}
                    {status_element}
                    <div className="event-data-field pt-2 pb-1 ps-3">
                        <div className="text-center event-card-label">
                            Buy Ticket At:
                        </div>
                        <div className="text-center event-card-data">
                            <a href={this.props.data.event.buy_ticket!==""?this.props.data.event.buy_ticket:"#"} target="_blank">Ticketmaster</a>
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={12} md={7} lg={7} height={"100%"} className={"d-flex align-items-center"+(window.screen.width>600?" pe-5":"")}>
                    <Image className="" src={this.props.data.event.seatmap} width={"100%"}></Image>
                </Col>
            </Row>
            <div className="text-center pt-4 share-text">
                Share on: 
                <a href={"http://twitter.com/share?text=Check "+this.props.data.event.name+" on Ticketmaster.&url="+this.props.data.event.buy_ticket+""} target="_blank">
                    <BsTwitter size={27} color="#1DA1F2" className="hover-pointer ms-2 mb-1"></BsTwitter>
                </a>
                <a target="_blank" href={"https://www.facebook.com/sharer/sharer.php?u="+this.props.data.event.buy_ticket+"&amp;src=sdkpreparse"}>
                    <ImFacebook2 size={24} color="#4060DF" className="hover-pointer ms-2 mb-1"></ImFacebook2>
                </a>
            </div>
        </Container>
    }
}

export default EventTab