import React from "react";
import {Navbar, Container, Nav} from 'react-bootstrap'
import { NavLink } from "react-router-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SearchRoute from './SearchRoute';
import FavoritesRoute from './FavoritesRoute'


class MenuBar extends React.Component {
    render () {
        return <BrowserRouter>
        <Navbar variant="dark">
            <Nav className="ms-auto mb-5 mt-2 me-3">
                <Nav.Link as={NavLink} to={"/search"} className="pt-2 pb-2 pe-3 ps-3">Search</Nav.Link>
                <Nav.Link as={NavLink} to={"/favorites"} className="pt-2 pb-2 pe-3 ps-3">Favorites</Nav.Link>
            </Nav>
        </Navbar>
        <Routes>
            <Route path="/" element={<Navigate to = "/search"/>}/>
            <Route path="/search" element={<SearchRoute />} />
            <Route path="/favorites" element={<FavoritesRoute />} />
        </Routes>
    </BrowserRouter>;
    }
}

export default MenuBar;