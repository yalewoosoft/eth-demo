import {Button, Card, ListGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form"
function SNPost({
    sender,
    content,
    upvote_count,
    on_upvote,
    on_reward
}) {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Header>{'From: ' + sender.substring(0,7)}</Card.Header>
            <Card.Body>
                <Card.Text>
                    { content }
                </Card.Text>
            </Card.Body>
            <ListGroup>
                <ListGroup.Item>
                    <Button variant="info">Upvote: {upvote_count}</Button>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Form.Control type="text" placeholder="Amount" />
                    <Button variant="primary">Send Reward</Button>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    )
}

export default SNPost;
