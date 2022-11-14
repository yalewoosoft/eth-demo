import SNNavBar from "./SNNavBar";
import Container from "react-bootstrap/Container";
import {Button, CardGroup, Col, Row} from "react-bootstrap";
import SNPost from "./SNPost";
import useEth from "../../contexts/EthContext/useEth";
import {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";

function SNApp() {
    const { state: { contract, accounts, web3 } } = useEth();
    const [posts, setPosts] = useState([]);
    const [is_loaded, setIsLoaded] = useState(false);
    const [new_post_content, setNewPostContent] = useState("");

    useEffect(() => {
        if (contract) {
            (async function () {
                // get all posts
                const current_posts = [];
                const allpost_hashes = await contract.methods.all_posts().call({from: accounts[0]});
                console.log(allpost_hashes);
                for (const i of allpost_hashes) {
                    const post = await contract.methods.posts(i).call({from: accounts[0]});
                    current_posts.push({
                        hash: i,
                        content: post.content,
                        sender: post.sender,
                        upvote_count: post.upvotes,
                    });
                }
                console.log(current_posts);
                setPosts(current_posts);
                setIsLoaded(true);
            })();
        }
    }, [contract])

    // Event subscriber: NewPost
    useEffect(() => {
        if (contract) {
            let subscription;
            (async function () {
                // create event listeners
                console.log('Creating event listeners for NewPost');
                subscription = await contract.events.event_NewPost()
                    .on("data", (event) => on_new_post_event(event));
            })();
            return () => subscription.unsubscribe();
        }
    }, [posts, is_loaded])

    const on_new_post_event = async (e) => {
        setPosts([
            ...posts,
            {
                hash: e.returnValues[0],
                content: e.returnValues[1],
                sender: e.returnValues[2],
                upvote_count: 0
            }
        ]);
    }

    // Event subscriber: Upvote
    useEffect(() => {
        if (contract) {
            let subscription;
            (async function () {
                // create event listeners
                console.log('Creating event listeners for upvote');
                subscription = await contract.events.event_Upvote()
                    .on("data", (event) => on_upvote_post_event(event));
            })();
            return () => subscription.unsubscribe();
        }
    }, [posts, is_loaded])

    const on_upvote_post_event = async (e) => {
        setPosts(
          posts.map((i) => {
              if (i.hash !== e.returnValues[0]) {
                  return i;
              } else {
                  return {
                      ...i,
                      upvote_count: e.returnValues[1]
                  }
              }
          })
        );
    }

    const on_new_post_content_changed = async (e) => {
        setNewPostContent(e.target.value);
    }
    const new_post = async () => {
        if (new_post_content) {
            const tx = await contract.methods.new_post(new_post_content).send({from: accounts[0]});
            console.log(tx);
        }
    }

    const on_reward = async (sender, amount) => {
        web3.eth.sendTransaction({
            to: sender,
            from: accounts[0],
            value: web3.utils.toWei(amount, "ether")
        }, (err) => {
            if (err) {
                alert(err)
            } else {
                alert('Reward success!')
            }
        })
    }

    const on_upvote = async (post_hash) => {
        const tx = await contract.methods.upvote_post(post_hash).send({
            from: accounts[0],
            value: web3.utils.toWei("1", "Gwei")
        });
        console.log(tx);
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
                            <SNPost post_hash={p.hash}
                                    content={p.content}
                                    sender={p.sender}
                                    upvote_count={p.upvote_count}
                                    on_reward={on_reward}
                                    on_upvote={on_upvote}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

export default SNApp;
