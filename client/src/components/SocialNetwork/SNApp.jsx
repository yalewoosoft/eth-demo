import SNNavBar from "./SNNavBar";
import Container from "react-bootstrap/Container";
import {Button, CardGroup, Col, Row} from "react-bootstrap";
import SNPost from "./SNPost";
import useEth from "../../contexts/EthContext/useEth";
import {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";

function SNApp() {
    const { state: { contract, accounts } } = useEth();
    const [posts, setPosts] = useState([]);
    const [new_post_content, setNewPostContent] = useState("");

    useEffect(() => {
        if (contract) {
            (async function () {
                const current_posts = [];
                const allpost_hashes = await contract.methods.all_posts().call({from: accounts[0]});
                console.log(allpost_hashes);
                for (const i of allpost_hashes) {
                    const content = await contract.methods.content(i).call({from: accounts[0]});
                    const sender = await contract.methods.sender(i).call({from: accounts[0]});
                    current_posts.push({
                        hash: i,
                        content,
                        sender,
                        upvote_count: 0
                    });
                }
                console.log(current_posts);
                setPosts(current_posts);
            })();
        }
    }, [contract, accounts])

    const on_new_post_content_changed = async (e) => {
        setNewPostContent(e.target.value);
    }
    const new_post = async () => {
        if (new_post_content) {
            const post_hash = await contract.methods.new_post(new_post_content).send({from: accounts[0]});
            console.log(post_hash);
        }
    }
    return (
        <>
            <SNNavBar />
            <Container>
                <Row>
                    <h1>Posts</h1>
                </Row>
                <Row>
                    <Col lg={11}>
                        <Form.Control type="text"
                                      placeholder="New Post Here"
                                      value={new_post_content}
                                      onChange={on_new_post_content_changed}/>
                    </Col>
                    <Col>
                        <Button variant="primary" onClick={new_post}>Send</Button>
                    </Col>
                </Row>
                <Row>
                    {posts.map(p => (
                        <Col key={p.hash}>
                            <SNPost content={p.content} sender={p.sender} upvote_count={p.upvote_count} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

export default SNApp;
