import {Button, Card, ListGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form"
import {useState} from "react";
import {Link} from "react-router-dom";
function SNPost({
    post_hash,
    sender,
    content,
    upvote_count,
    is_owner,
    on_upvote,
    on_reward,
    on_funding
}) {
    const [amount, setAmount] = useState("");
    function on_reward_input_change(e) {
        setAmount(e.target.value);
    }
    function on_reward_click() {
        on_reward(sender, amount);
    }
    function on_upvote_click() {
        on_upvote(post_hash);
    }
    function on_funding_click() {
        on_funding(post_hash);
    }
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Header>
                {'From: ' }
                <Link to={`profile/${sender}`}>
                    { sender.substring(0, 8) }
                </Link>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    { content }
                </Card.Text>
            </Card.Body>
            <ListGroup>
                <ListGroup.Item>
                    <Button variant="info" onClick={on_upvote_click}>Upvote: {upvote_count}</Button>
                </ListGroup.Item>
                {
                    on_reward &&
                    <ListGroup.Item>
                        <Form.Control type="text"
                                      placeholder="Amount"
                                      value={amount}
                                      onChange={on_reward_input_change}/>
                        <Button variant="primary" onClick={on_reward_click}>Send Reward</Button>
                    </ListGroup.Item>
                }
                {
                    is_owner &&
                    <ListGroup.Item>
                        <Button variant="warning" onClick={on_funding_click}>Fund this post</Button>
                    </ListGroup.Item>
                }
            </ListGroup>
        </Card>
    )
}

export default SNPost;
