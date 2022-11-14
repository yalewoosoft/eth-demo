// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract SocialNetwork {
    struct Post {
        string content;
        address payable sender;
        uint64 upvotes;
        bool exists;
    }

    bytes32[] public posts_hash;
    mapping(bytes32 => Post) public posts;
    mapping(address => uint64) post_count;

    constructor() {
        bytes32 initial_post = 0xa0ec3c07d50d3c405f489573fa83a795402f6fc40a71e774564b8ac6bdc968f3;
        posts_hash.push(initial_post);
        posts[initial_post] = Post({
            content: "AAAA",
            sender: payable(msg.sender),
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


    function all_posts() public view returns (bytes32[] memory) {
        return posts_hash;
    }

    function new_post(string calldata post_content) public returns (bytes32) {
        post_count[msg.sender] += 1;
        bytes32 post_hash = keccak256(abi.encode(post_content, msg.sender));
        posts_hash.push(post_hash);
        posts[post_hash] = Post({
        content: post_content,
        sender: payable(msg.sender),
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

}
