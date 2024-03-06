import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import ShowMoreText from "react-show-more-text";
import {BiChevronDown, BiChevronUp} from "react-icons/bi";
import Modal from 'react-bootstrap/Modal';
import GoogleMapReact from 'google-map-react'

class VenueTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show_modal : false
        }
    }

    hide_show_modal = (bool) => {
        this.setState({show_modal: bool})
    }

    render() {
        if(this.props.data.venue === null) {
            return <Container className="">
            <Row>
                <Col></Col>
                <Col className="spotify-error text-center text-danger pt-0 pb-0 mx-auto" xs={"auto"} sm={"auto"} md={8} lg={7}>No venue</Col>
                <Col></Col>
            </Row>
        </Container>
        }
        var name_element = <></>
        if(this.props.data.venue.name!=="") {
            name_element = <div className={window.screen.width>600?"event-data-field pt-2 pb-1 ps-3":"event-data-field pt-2 pb-1"}>
                <div className="text-center event-card-label">
                    Name
                </div>
                <div className="text-center event-card-data">
                    {this.props.data.venue.name}
                </div>
            </div>
        }
        var address_element = <></>
        if(this.props.data.venue.address!=="") {
            address_element = <div className={window.screen.width>600?"event-data-field pt-2 pb-1 ps-3":"event-data-field pt-2 pb-1"}>
                <div className="text-center event-card-label">
                    Address
                </div>
                <div className="text-center event-card-data">
                    {this.props.data.venue.address}
                </div>
            </div>
        }
        var phone_element = <></>
        if(this.props.data.venue.phoneNumber!=="") {
            phone_element = <div className={window.screen.width>600?"event-data-field pt-2 pb-1 ps-3":"event-data-field pt-2 pb-1"}>
                <div className="text-center event-card-label">
                    Phone Number
                </div>
                <div className="text-center event-card-data">
                    {this.props.data.venue.phoneNumber}
                </div>
            </div>
        }
        var open_element = <></>
        if(this.props.data.venue.openHours!=="") {
            open_element = <div className="event-data-field pt-2 pb-1">
                <div className="text-center event-card-label">
                    Open Hours
                </div>
                <div className="text-center event-card-data">
                    <ShowMoreText
                        /* Default options */
                        lines={2}
                        more={<span className="show-venue-text"><br/>Show More<BiChevronDown size={23} className="pb-1" color="white"></BiChevronDown></span>}
                        less={<span className="show-venue-text"><br/>Show Less<BiChevronUp size={20} className="pt-0" color="white"></BiChevronUp></span>}
                        className="content-css"
                        anchorClass="show-more-less-clickable"
                        onClick={this.executeOnClick}
                        expanded={false}
                        width={304}
                        truncatedEndingComponent={""}
                    >
                        {this.props.data.venue.openHours}
                    </ShowMoreText>
                </div>
            </div>
        }
        var general_element = <></>
        if(this.props.data.venue.generalRule!=="") {
            general_element = <div className="event-data-field pt-2 pb-1">
                <div className="text-center event-card-label">
                    General Rule
                </div>
                <div className="text-center event-card-data">
                    <ShowMoreText
                        /* Default options */
                        lines={2}
                        more={<span className="show-venue-text"><br/>Show More<BiChevronDown size={23} className="pb-1" color="white"></BiChevronDown></span>}
                        less={<span className="show-venue-text"><br/>Show Less<BiChevronUp size={20} className="pt-0" color="white"></BiChevronUp></span>}
                        className="content-css"
                        anchorClass="show-more-less-clickable"
                        onClick={this.executeOnClick}
                        expanded={false}
                        width={304}
                        truncatedEndingComponent={""}
                    >
                        {this.props.data.venue.generalRule}
                    </ShowMoreText>
                </div>
            </div>
        }
        var child_element = <></>
        if(this.props.data.venue.childRule!=="") {
            child_element = <div className="event-data-field pt-2 pb-1">
                <div className="text-center event-card-label">
                    Child Rule
                </div>
                <div className="text-center event-card-data">
                    <ShowMoreText
                        /* Default options */
                        lines={2}
                        more={<span className="show-venue-text"><br/>Show More<BiChevronDown size={23} className="pb-1" color="white"></BiChevronDown></span>}
                        less={<span className="show-venue-text"><br/>Show Less<BiChevronUp size={20} className="pt-0" color="white"></BiChevronUp></span>}
                        className="content-css"
                        anchorClass="show-more-less-clickable"
                        onClick={this.executeOnClick}
                        expanded={false}
                        width={304}
                        truncatedEndingComponent={""}
                    >
                        {this.props.data.venue.childRule}
                    </ShowMoreText>
                </div>
            </div>
        }
        return <Container className={window.screen.width>600?"p-2 ps-2 pe-4":"p-2"}>
        <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
                {name_element}
                {address_element}
                {phone_element}
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
                {open_element}
                {general_element}
                {child_element}
            </Col>
        </Row>
        <div className="text-center pt-3 pb-2">
            <Button variant="danger" onClick={() => this.hide_show_modal(true)}>Show venue on Google map</Button>
            <Modal show={this.state.show_modal} onHide={() => this.hide_show_modal(false)}>
                <Modal.Header>
                  <Modal.Title>Event Venue</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Map
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="dark" onClick={() => this.hide_show_modal(false)}>
                    Close
                  </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </Container>
    }
}

export default VenueTab;