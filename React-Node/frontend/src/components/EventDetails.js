import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { IoIosArrowBack } from "react-icons/io"
import { MdOutlineFavoriteBorder, MdFavorite } from "react-icons/md"
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DetailTabs from "./DetailTab";

class EventDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            favorite: false,
            tab_value: 0,
            prev_tab: 0
        }
    }
    
    async componentDidMount() {
        this.checkFavorites();
        if(!this.props.event_details.updated) {
            await this.updateSpotifyandVenue()
        }
    }

    getSpotify = async (keywords) => {
        var url = "https://sm-assign8.wl.r.appspot.com/spotifyLink"
        url += "?keyword=-1";
        for(var i = 0; i < keywords.length; i++ ){
            url += "&keyword=" + keywords[i];
        }
        var spoitfyData;
        await fetch(url)
        .then(res => res.json())
        .then(data => {
            spoitfyData = data;
        });

        return spoitfyData;
    }

    getVenue = async (keyword) => {
        var url = "https://sm-assign8.wl.r.appspot.com/venueDetails"
        url += "?keyword=" + keyword;
        var venue;
        await fetch(url)
        .then(res => res.json())
        .then(data => {
            venue = data;
        });
        return venue;
    }
    
    updateSpotifyandVenue = async () => {
        var event = this.props.event_details.event
        var musicRelatedFlag = false;
        var keywords = [];
        for(var i=0;i<event.artists.length;i++) {
            if(event.artists[i].music) {
                musicRelatedFlag = true;
                keywords.push(event.artists[i].name);
            }
        }
        var spoitfyData;
        if(musicRelatedFlag){
            spoitfyData = await this.getSpotify(keywords);
        } else {
            spoitfyData = {
                artists : []
            }
        }
        console.log("here");
        var venue = await this.getVenue(event.venue);
        var all_details = {
            "event": event,
            "spotify": spoitfyData,
            "venue": venue,
            "updated": true
        }
        this.props.update_event_details(all_details);
    }

    handleTabChange = async (event, newValue) => {
        console.log("Event tab change",this.state.tab_value, newValue)
        this.setState({prev_tab: this.state.tab_value})
        if(newValue !== 1 && !this.props.event_details.updated) 
            await this.updateSpotifyandVenue();
        this.setState({tab_value : newValue})
    };
    
    backButton = () => {
        this.props.update_event_details(null);
        this.props.change_table_view(true);
        this.props.change_details_view(false);
    }

    isInFav = (favorites, id) => {
        if(favorites === null) return false
        favorites = JSON.parse(favorites)
        for(var i = 0;i<favorites.length; i++) {
            if(favorites[i].id === id){
                return true
            }
        }
        return false
    }


    checkFavorites = () => {
        var bool = this.isInFav(localStorage.getItem("favorites"), this.props.event_details.event.id)
        if(this.state.favorite && !bool) {
            this.setState({favorite: false})
        } else if((!this.state.favorite) && bool){
            this.setState({favorite: true})
        }
    }

    favorite = () => {
        var event_category = ""
        event_category += ((event_category===""||this.props.event_details.event.genre==="")?"":(" | ")) + this.props.event_details.event.genre
        event_category += ((event_category===""||this.props.event_details.event.subgenre==="")?"":(" | ")) + this.props.event_details.event.subgenre
        event_category += ((event_category===""||this.props.event_details.event.segment==="")?"":(" | ")) + this.props.event_details.event.segment
        event_category += ((event_category===""||this.props.event_details.event.type==="")?"":(" | ")) + this.props.event_details.event.type
        event_category += ((event_category===""||this.props.event_details.event.subType==="")?"":(" | ")) + this.props.event_details.event.subType
        var data = {
            id: this.props.event_details.event.id,
            name: this.props.event_details.event.name,
            date: this.props.event_details.event.localDate,
            time: this.props.event_details.event.localTime,
            category: event_category,
            venue: this.props.event_details.event.venue
        }
        var favorites = localStorage.getItem("favorites")
        if(favorites === null) {
            localStorage.setItem("favorites", JSON.stringify([data]))
        } else{
            var existing_favorites = JSON.parse(favorites)
            existing_favorites.push(data)
            localStorage.removeItem("favorites")
            localStorage.setItem("favorites", JSON.stringify(existing_favorites))
        }
        this.setState({favorite: true})
        alert("Event Added to Favorites!");
    }

    removeFavorite = () => {
        var favorites = JSON.parse(localStorage.getItem("favorites"));
        localStorage.removeItem("favorites");
        var index = -1
        for(var i = 0; i<favorites.length; i++) {
            if(favorites[i].id === this.props.event_details.event.id){
                index = i
                break
            }
        }
        favorites.splice(index,1)
        localStorage.setItem("favorites", JSON.stringify(favorites))
        alert("Removed from Favorites!");
        this.setState({favorite: false})
    }

    render() {
        return <Container fluid="md" className="">
        <Row>
            <Col></Col>
            <Col xs={12} sm={11} md={10} lg={8} className="">
                <div  id="event-detail-div" className="table-div mb-4 pt-2 pb-2 px-0">
                    <div>
                        <div id="back-button" onClick={() => this.backButton()}>
                            <IoIosArrowBack color={"rgb(180,180,180)"} size={18}></IoIosArrowBack><u>Back</u>
                        </div>
                    </div>
                    <h5 className="mt-4 mb-4 text-center">
                        {this.props.event_details.event.name}
                        {this.state.favorite?
                            <MdFavorite onClick={() => this.removeFavorite()} className="hover-pointer rounded-circle ms-3" size={35} color="red" style={{backgroundColor:"white", padding:"7px", paddingBottom:"5px"}}></MdFavorite>
                            :
                            <MdOutlineFavoriteBorder onClick={() => this.favorite()} className="hover-pointer rounded-circle ms-3" size={35} color="rgb(120,120,120)" style={{backgroundColor:"white", padding:"7px", paddingBottom:"5px"}}></MdOutlineFavoriteBorder>
                        }
                    </h5>
                    <Box id="tabs-box" sx={{ width: '100%'}}>
                        <Tabs value={this.state.tab_value} onChange={this.handleTabChange} centered>
                            {console.log(window.screen.width > 600 ?"tab-heading px-5":"tab-heading")}
                            <Tab className={window.screen.width > 600 ?"tab-heading px-5":"tab-heading"} value={0} label="Events" />
                            <Tab className={window.screen.width > 600 ?"tab-heading px-5":"tab-heading"} value={1} label="Artist/Teams" />
                            <Tab className={window.screen.width > 600 ?"tab-heading px-5":"tab-heading"} value={2} label="Venue" />
                        </Tabs>
                    </Box>
                <DetailTabs tabValue={this.state.tab_value} prevTab={this.state.prev_tab} eventDetails={this.props.event_details}></DetailTabs>
                </div>
            </Col>
            <Col></Col>
        </Row>
    </Container>;
    }
}

export default EventDetails;