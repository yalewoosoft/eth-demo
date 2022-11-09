import {Button, Card, ListGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form"
import {useState} from "react";
function SNPost({
    sender,
    content,
    upvote_count,
    on_upvote,
    on_reward
}) {
    const [amount, setAmount] = useState();
    function on_reward_input_change(e) {
        setAmount(e.target.value);
    }
    function on_reward_click() {
        on_reward(sender, amount);
    }
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
                    <Form.Control type="text"
                                  placeholder="Amount"
                                  value={amount}
                                  onChange={on_reward_input_change}/>
                    <Button variant="primary" onClick={on_reward_click}>Send Reward</Button>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    )
}

export default SNPost;
