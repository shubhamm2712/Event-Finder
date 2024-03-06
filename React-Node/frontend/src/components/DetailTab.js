import React from "react";
import EventTab from "./EventTab";
import SpotifyTab from "./SpotifyTab";
import VenueTab from "./VenueTab";

class DetailTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        console.log(this.props.eventDetails);
        console.log('/*             <div className={"d-flex outer-div" + (this.props.tabValue===this.props.prevTab?"":(this.props.tabValue<this.props.prevTab?" right-to-left":" left-to-right"))}> */')
        var left_pane, right_pane, left_class, right_class;
        var mapping = {
            0: <EventTab data={this.props.eventDetails}></EventTab>,
            1: <SpotifyTab data={this.props.eventDetails}></SpotifyTab>,
            2: <VenueTab data={this.props.eventDetails}></VenueTab>
        }
        if(this.props.tabValue<=this.props.prevTab) {
            left_pane = mapping[this.props.tabValue]
            right_pane = mapping[this.props.prevTab]
            left_class = ""
            right_class = " hide-tab"
        } else {
            left_pane = mapping[this.props.prevTab]
            right_pane = mapping[this.props.tabValue]
            left_class = " hide-tab"
            right_class = ""
        }
        return <div className="full-width">
            <div className={"d-flex outer-div " + (this.props.tabValue===this.props.prevTab?"":"c"+this.props.prevTab+"-"+this.props.tabValue)}>
                <div className={"tab-item left-tab" + left_class}>{left_pane}</div>
                <div className={"tab-item right-tab" + right_class}>{right_pane}</div>
                {/* <div className="tab-item">Venue tab</div> */}
            </div>
        </div>
    }
}

export default DetailTabs;