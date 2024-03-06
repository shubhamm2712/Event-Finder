import React from "react";

import SearchForm from "./SearchForm";
import EventsTable from "./EventsTable";
import EventDetails from "./EventDetails";

class SearchRoute extends React.Component {

    state = {
        events_list: null,
        event_details: null,
        events_table: false,
        details: false
    }

    change_table_view = (table_view) => {
        this.setState({events_table: table_view})
    }

    change_details_view = (details_view) => {
        this.setState({details: details_view})
    }

    update_events_list = (events_list_object) => {
        this.setState({events_list: events_list_object})
    }

    update_event_details = (event_details_object) => {
        this.setState({event_details: event_details_object})
    }

    render() {
        return <>
        <SearchForm update_events_list={this.update_events_list} update_event_details={this.update_event_details} change_table_view={this.change_table_view} change_details_view={this.change_details_view} />
        {this.state.events_table?<EventsTable events_list={this.state.events_list} update_event_details={this.update_event_details} change_table_view={this.change_table_view} change_details_view={this.change_details_view}/>:<></>}
        {this.state.details?<EventDetails event_details={this.state.event_details} update_event_details={this.update_event_details} change_table_view={this.change_table_view} change_details_view={this.change_details_view}/>:<></>}
        </>;
    }
}

export default SearchRoute;
