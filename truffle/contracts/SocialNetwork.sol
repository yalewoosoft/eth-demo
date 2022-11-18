// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract SocialNetwork {
    struct Post {
        string content;
        address sender;
        uint64 upvotes;
        bool exists;
    }

    address private owner;
    bytes32[] public posts_hash;
    mapping(bytes32 => Post) public posts;
    mapping(address => uint64) public post_count;
    mapping(address => address[]) public following;

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        bytes32 initial_post = 0xa0ec3c07d50d3c405f489573fa83a795402f6fc40a71e774564b8ac6bdc968f3;
        posts_hash.push(initial_post);
        posts[initial_post] = Post({
            content: "AAAA",
            sender: msg.sender,
            upvotes: 0,
            exists: true
        });
    }

    event event_NewPost(
        bytes32 post_hash,
        string content,
        address sender
    );

    event event_Upvote(
        bytes32 post_hash,
        uint64 upvotes
    );

    event event_Following(
        address from,
        address to,
        bool follow
    );


    function all_posts() public view returns (bytes32[] memory) {
        return posts_hash;
    }

    function new_post(string calldata post_content) public returns (bytes32) {
        post_count[msg.sender] += 1;
        bytes32 post_hash = keccak256(abi.encode(post_content, post_count[msg.sender]));
        posts_hash.push(post_hash);
        posts[post_hash] = Post({
            content: post_content,
            sender: msg.sender,
            upvotes: 0,
            exists: true
        });
        emit event_NewPost(post_hash, post_content, msg.sender);
        return post_hash;
    }

    function upvote_post(bytes32 post_hash) public payable {
        require(msg.value >= 1 gwei);
        require(posts[post_hash].exists);
        posts[post_hash].upvotes += 1;
        emit event_Upvote(post_hash, posts[post_hash].upvotes);
    }

    function fund_post(bytes32 post_hash) public isOwner {
        require(address(this).balance > 0);
        payable(posts[post_hash].sender).transfer(address(this).balance);
    }

    function add_following(address to) public {
        following[msg.sender].push(to);
        emit event_Following(msg.sender, to, true);
    }

    function get_following(address from) public view returns (address[] memory) {
        return following[from];
    }

    function is_following(address to) public view returns (bool) {
        bool flag = false;
        uint256 array_length = following[msg.sender].length;
        for (uint256 i = 0; i < array_length; i++) {
            if (following[msg.sender][i] == to) {
                // found
                flag = true;
                break;
            }
        }
        return flag;
    }

    function delete_following(address to) public {
        bool flag = false;
        uint256 array_length = following[msg.sender].length;
        for (uint256 i = 0; i < array_length; i++) {
            if (following[msg.sender][i] == to) {
                // found
                flag = true;
                // delete element (set to 0)
                delete following[msg.sender][i];
                // move last to i
                following[msg.sender][i] = following[msg.sender][array_length - 1];
                // remove last element
                following[msg.sender].pop();
                emit event_Following(msg.sender, to, false);
                break;
            }
        }
        require(flag, "Cannot delete unexistent following!");
    }

    function get_owner() public view returns (address) {
        return owner;
    }

    function get_balance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}
