import {useLoaderData} from "react-router-dom";
import useEth from "../../contexts/EthContext/useEth";
import {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Button, Col, Row} from "react-bootstrap";
import SNPost from "./SNPost";

export async function loader({params}) {
    return params.address;
}

function SNProfile() {
    const address = useLoaderData();
    const {state: {contract, accounts, web3}} = useEth();
    const [posts, setPosts] = useState([]);
    const [following, setFollowing] = useState(false);

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
                // Retrieve following list
                const following = await contract.methods.is_following(address).call({from: accounts[0]});
                setFollowing(following);
                for (const i of allpost_hashes) {
                    const post = await contract.methods.posts(i).call({from: accounts[0]});
                    if (post.sender === address) {
                        current_posts.push({
                            hash: i,
                            content: post.content,
                            sender: post.sender,
                            upvote_count: post.upvotes,
                        });
                    }
                }
                console.log(current_posts);
                setPosts(current_posts);
            })();
        }
    }, [contract, accounts, address])

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

    const on_upvote = async (post_hash) => {
        const tx = await contract.methods.upvote_post(post_hash).send({
            from: accounts[0],
            value: web3.utils.toWei("1", "Gwei")
        });
        console.log(tx);
    }

    return (
        <Container>
            <Row>
                <h1>Profile: {address.toString().substring(0, 8)}</h1>

            </Row>
            <Row>
                {
                    posts.map(p => (
                        <Col key={p.hash}>
                            <SNPost post_hash={p.hash}
                                    content={p.content}
                                    sender={p.sender}
                                    upvote_count={p.upvote_count}
                                    is_owner={false}
                                    on_reward={null}
                                    on_upvote={on_upvote}
                                    on_funding={null}
                            />
                        </Col>
                    ))
                }
            </Row>
        </Container>
    )
}

export default SNProfile;
