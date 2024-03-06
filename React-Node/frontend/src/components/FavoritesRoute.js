import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {BsTrash} from "react-icons/bs"

class FavoritesRoute extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            length: 0,
            events: [],
            updated: false
        }
    }

    componentDidMount() {
        this.updateFavorites()
    }

    updateFavorites = () => {
        var favorites = localStorage.getItem("favorites")
        if(favorites===null) {
            this.setState({
                length: 0,
                events: [],
                updated: true  
            })
        } else {
            favorites = JSON.parse(favorites)
            this.setState({
                length: favorites.length,
                events: favorites,
                updated: true
            })
        }
    }

    removeFavorite = (event_id) => {
        var favorites = JSON.parse(localStorage.getItem("favorites"));
        localStorage.removeItem("favorites");
        var index = -1
        for(var i = 0; i<favorites.length; i++) {
            if(favorites[i].id === event_id){
                index = i
                break
            }
        }
        favorites.splice(index,1)
        localStorage.setItem("favorites", JSON.stringify(favorites))
        alert("Removed from Favorites!");
        this.setState({
            length: favorites.length,
            events: favorites,
            updated: true
        })
    }

    render() {
        if(this.state.length===0) {
            return <Container className="">
                <Row>
                    <Col></Col>
                    <Col className="no-favorites text-center text-danger mb-4 pt-0 pb-0 mx-auto" xs={"auto"} sm={"auto"} md={8} lg={6}>No favorite events to show</Col>
                    <Col></Col>
                </Row>
            </Container>
        }
        var tbody = this.state.events.map((event, index) => 
            (<tr className="row-hover" key={event.id}>
                <th>{index + 1}</th>
                <td>{event.date}</td>
                <td>{event.name}</td>
                <td>{event.category}</td>
                <td>{event.venue}</td>
                <td onClick={() => this.removeFavorite(event.id)}><BsTrash className="hover-pointer"></BsTrash></td>
            </tr>)      
        );        return <>
        <div className="text-center favorite-text">List of your favorite events</div>
        <Container fluid="md" className="">
            <Row>
                <Col></Col>
                <Col className="text-center mt-3 mb-4 pt-0 pb-0" xs={12} sm={12} md={10} lg={8}>
                    <table variant="light" className="events-table w-100" id="favorite-table">
                        <thead>
                            <tr>
                                <th id="table-head-left" style={{width: "30px"}}>#</th>
                                <th style={window.screen.width > 600 ? {width: "100px"} : {width: "100px"}}>Date</th>
                                <th>Event</th>
                                <th style={window.screen.width > 600 ? {width: "130px"} : {width: "130px"}}>Category</th>
                                <th style={window.screen.width > 600 ? {width: "170px"} : {width: "170px"}}>Venue</th>
                                <th id="table-head-right" style={window.screen.width > 600 ? {width: "80px"} : {width: "80px"}}>Favorite</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tbody}
                        </tbody>
                    </table>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    </>
    }
}

export default FavoritesRoute;
 