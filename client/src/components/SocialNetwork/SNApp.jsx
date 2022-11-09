import SNNavBar from "./SNNavBar";
import Container from "react-bootstrap/Container";
import {CardGroup, Col, Row} from "react-bootstrap";
import SNPost from "./SNPost";

function SNApp() {
    return (
        <>
            <SNNavBar />
            <Container>
                <Row>
                    <h1>Posts</h1>
                </Row>
                <Row>
                    <Col>
                        <SNPost content="ABCD" sender="DDDD" upvote_count="0" />
                    </Col>
                    <Col>
                        <SNPost content="ABCD" sender="DDDD" upvote_count="0" />
                    </Col>
                    <Col>
                        <SNPost content="ABCD" sender="DDDD" upvote_count="0" />
                    </Col>
                    <Col>
                        <SNPost content="ABCD" sender="DDDD" upvote_count="0" />
                    </Col>
                    <Col>
                        <SNPost content="ABCD" sender="DDDD" upvote_count="0" />
                    </Col>
                    <Col>
                        <SNPost content="ABCD" sender="DDDD" upvote_count="0" />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default SNApp;
