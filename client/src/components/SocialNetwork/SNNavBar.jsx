import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link} from "react-router-dom";
import useEth from "../../contexts/EthContext/useEth";
import {useEffect, useState} from "react";

function SNNavBar() {
    const { state: { accounts } } = useEth();
    const [current_account, setCurrentAccount] = useState("");
    useEffect(() => {
        if (accounts) {
            setCurrentAccount(accounts[0]);
        }
    }, [accounts])
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">SN</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">All Posts</Nav.Link>
                        <Nav.Link as={Link} to="/following_posts">Following Posts</Nav.Link>
                        <Nav.Link as={Link} to="/following">Manage Following</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Text className="d-flex">{ current_account.substring(0, 8) }</Navbar.Text>
            </Container>
        </Navbar>
    )
}

export default SNNavBar;
