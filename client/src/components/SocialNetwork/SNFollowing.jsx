import useEth from "../../contexts/EthContext/useEth";
import {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Button, Row, Table} from "react-bootstrap";

function SNFollowing() {
    const {state: {contract, accounts, web3}} = useEth();
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        console.log("UseEffect initial triggered");
        if (contract) {
            (async function () {
                console.log("Current contract: ", contract);
                console.log("Contract loaded; starting blockchain loading")
                // Retrieve following list
                const following = await contract.methods.get_following(accounts[0]).call({from: accounts[0]});
                setFollowing(following);
            })();
        }
    }, [contract, accounts])

    // Event subscriber: Following
    useEffect(() => {
        if (contract) {
            let subscription;
            (async function () {
                // create event listeners
                console.log('Creating event listeners for Follwoing');
                subscription = await contract.events.event_Following()
                    .on("data", (event) => on_following_event(event));
            })();
            return () => {
                if (subscription) {
                    console.log("Clean up event listeners Upvote");
                    subscription.unsubscribe();
                }
            }
        }
    }, [contract, following])

    const on_following_event = async (e) => {
        if (e.returnValues[0] === accounts[0]) {
            if (e.returnValues[2]) {
                // Add following
                setFollowing(following.concat([e.returnValues[1]]));
            } else {
                // Remove following
                setFollowing(following.filter(i => i !== e.returnValues[1]));
            }
        }
    }

    const on_unfollow = async (address) => {
        const tx = await contract.methods.delete_following(address).send({
            from: accounts[0],
        });
        console.log(tx);
    }

    return (
        <Container>
            <Row>
                <h1>Manage Followers</h1>
            </Row>
            <Table>
                <thead>
                <tr>
                    <th>Address</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {
                    following.map(i => (
                        <tr key={i}>
                            <td>{i}</td>
                            <td>
                                <Button variant="info" onClick={() => on_unfollow(i)}>Unfollow</Button>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </Table>
        </Container>


    )
}

export default SNFollowing;
