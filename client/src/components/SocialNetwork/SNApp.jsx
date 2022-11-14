import Container from "react-bootstrap/Container";
import {Button, CardGroup, Col, Row} from "react-bootstrap";
import SNPost from "./SNPost";
import useEth from "../../contexts/EthContext/useEth";
import {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";

function SNApp() {
    const { state: { contract, accounts, web3 } } = useEth();
    const [posts, setPosts] = useState([]);
    const [is_owner, setIsOwner] = useState(false);
    const [balance, setBalance] = useState(0);
    const [new_post_content, setNewPostContent] = useState("");

    useEffect(() => {
        console.log("UseEffect initial triggered");
        if (contract) {
            (async function () {
                console.log("Current contract: ", contract);
                // get all posts
                console.log("Contract loaded; starting blockchain loading")
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
                // check owner status
                const owner = await contract.methods.get_owner().call({from: accounts[0]});
                if (accounts[0] === owner) {
                    setIsOwner(true);
                    const local_balance = await contract.methods.get_balance().call({from: accounts[0]});
                    setBalance(local_balance);
                }
                setPosts(current_posts);
            })();
        }
    }, [contract, accounts])

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
            return () => {
                if (subscription) {
                    console.log("Clean up event listeners NewPost");
                    subscription.unsubscribe();
                }
            }
        }
    }, [posts, contract])

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
            return () => {
                if (subscription) {
                    console.log("Clean up event listeners Upvote");
                    subscription.unsubscribe();
                }
            }
        }
    }, [posts, contract])

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

    const on_funding = async (post_hash) => {
        const tx = await contract.methods.fund_post(post_hash).send({
            from: accounts[0],
        }, (err) => {
            if (err) {
                alert(err)
            } else {
                alert('Funding success!')
            }
        });
        console.log(tx);
    }

    return (
        <>
            <Container>
                <Row>
                    <h1>Posts</h1>
                </Row>
                {
                    is_owner &&
                    <Row>
                        <Col>
                            Contract Balance: {balance} Wei
                        </Col>
                    </Row>
                }
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
                                    is_owner={is_owner}
                                    on_reward={on_reward}
                                    on_upvote={on_upvote}
                                    on_funding={on_funding}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

export default SNApp;
