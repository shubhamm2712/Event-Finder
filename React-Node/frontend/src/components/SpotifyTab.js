import React from "react";
import { Container, Row, Col, Carousel, Image } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {BsSpotify} from 'react-icons/bs'
import {AiOutlineLeft, AiOutlineRight} from 'react-icons/ai'

class SpotifyTab extends React.Component {
    render() {
        if(this.props.data.spotify === null || this.props.data.spotify.artists.length === 0) {
            return <Container className="">
            <Row>
                <Col></Col>
                <Col className="spotify-error text-center text-danger pt-0 pb-0 mx-auto" xs={"auto"} sm={"auto"} md={8} lg={7}>No music related artist details to show</Col>
                <Col></Col>
            </Row>
        </Container>
        }
        if(this.props.data.spotify.artists.length === 1) {
            return <Container className="py-4">
            <Row>
                <Col></Col>
                <Col lg={3} className="px-4">
                    <Image className="rounded-circle" src={this.props.data.spotify.artists[0].image} width={window.screen.width>600?"100%":"60%"}></Image><br></br>
                    <div className="text-center spotify-artist-name">{this.props.data.spotify.artists[0].name}</div>
                </Col>
                <Col lg={2} className="pt-4">
                    <div className="text-center justify-contents-center spotify-heading">Popularity<br/>
                        <div className="mt-2" style={{ width: 30, height: 30, margin: "5px auto"}}>
                            <CircularProgressbar  value={this.props.data.spotify.artists[0].popularity} text={`${this.props.data.spotify.artists[0].popularity}`} styles={buildStyles({
                                textSize: '30px',
                                textColor: "white",
                                trailColor: 'rgba(0,0,0,0)',
                                pathColor: '#FF4040',
                            })}/>
                        </div>
                    </div>
                </Col>
                <Col lg={2} className="pt-4">
                    <div className={"ms-4 text-center spotify-heading"}>Followers</div>
                    <div className={"ms-4 mt-2 text-center"} id="spotify-followers">{Number(this.props.data.spotify.artists[0].followers).toLocaleString("en-US")}</div>
                </Col>
                <Col lg={3} className="pt-4">
                    <div className="text-center spotify-heading">Spotify Link</div>
                    <div className="mt-2 text-center"><a href={this.props.data.spotify.artists[0].link} target="_blank"><BsSpotify className="hover-pointer" size={30} color="#138a3d"></BsSpotify></a></div>
                </Col>
                <Col lg={1}></Col>
            </Row>
            <Row className="mt-4">
                <Col lg={1}></Col>
                <Col>
                    <div className="album-text">Album featuring {this.props.data.spotify.artists[0].name}</div>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col lg={1}></Col>
                <Col>
                    <Image src={this.props.data.spotify.artists[0].albums[0]} width={"100%"}></Image>
                </Col>
                <Col>
                    <Image src={this.props.data.spotify.artists[0].albums[1]} width={"100%"}></Image>
                </Col>
                <Col>
                    <Image src={this.props.data.spotify.artists[0].albums[2]} width={"100%"}></Image>
                </Col>
                <Col lg={1}></Col>
            </Row>
        </Container>
        }
        var carousel_items = this.props.data.spotify.artists.map((artist) => <Carousel.Item>
            <Container>
                <Row>
                    <Col></Col>
                    <Col lg={3} className="px-4">
                        <Image className="rounded-circle" src={artist.image} width={"100%"}></Image><br></br>
                        <div className="text-center spotify-artist-name">{artist.name}</div>
                    </Col>
                    <Col lg={2} className="pt-4">
                        <div className="text-center justify-contents-center spotify-heading">Popularity<br/>
                            <div className="mt-2" style={{ width: 30, height: 30, margin: "5px auto"}}>
                                <CircularProgressbar  value={artist.popularity} text={`${artist.popularity}`} styles={buildStyles({
                                    textSize: '30px',
                                    textColor: "white",
                                    trailColor: 'rgba(0,0,0,0)',
                                    pathColor: '#FF4040',
                                })}/>
                            </div>
                        </div>
                    </Col>
                    <Col lg={2} className="pt-4">
                        <div className="ms-4 text-center spotify-heading">Followers</div>
                        <div className="ms-4 mt-2 text-center" id="spotify-followers">{Number(artist.followers).toLocaleString("en-US")}</div>
                    </Col>
                    <Col lg={3} className="pt-4">
                        <div className="text-center spotify-heading">Spotify Link</div>
                        <div className="mt-2 text-center"><a href={artist.link} target="_blank"><BsSpotify className="hover-pointer" size={30} color="#138a3d"></BsSpotify></a></div>
                    </Col>
                    <Col lg={1}></Col>
                </Row>
                <Row className="mt-4">
                    <Col lg={1}></Col>
                    <Col>
                        <div className="album-text">Album featuring {artist.name}</div>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col lg={1}></Col>
                    <Col>
                        <Image src={artist.albums[0]} width={"100%"}></Image>
                    </Col>
                    <Col >
                        <Image src={artist.albums[1]} width={"100%"}></Image>
                    </Col>
                    <Col >
                        <Image src={artist.albums[2]} width={"100%"}></Image>
                    </Col>
                    <Col lg={1}></Col>
                </Row>
            </Container>
        </Carousel.Item>)
        return <Container fluid="md" className="py-4">
            <Carousel interval={null} prevIcon={<AiOutlineLeft size={30}></AiOutlineLeft>} nextIcon={<AiOutlineRight size={30}></AiOutlineRight>}>
                {carousel_items}
            </Carousel>
        </Container>
    }
}

export default SpotifyTab;