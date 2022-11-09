pragma solidity >=0.4.22 <0.9.0;

contract SocialNetwork {
    bytes32[] public posts;
    mapping(bytes32 => string) public content;
    mapping(bytes32 => address payable) public sender;
    mapping(bytes32 => uint64) public upvotes;

    constructor() {
        posts.push(0xe746d9cf4809cb70939dde3a173485059e56117bd429912342bb47663d464ef7);
        content[0xe746d9cf4809cb70939dde3a173485059e56117bd429912342bb47663d464ef7] = "ABCDEFGHFSFKSFHKJHFS";
        sender[0xe746d9cf4809cb70939dde3a173485059e56117bd429912342bb47663d464ef7] = payable(0x433220a86126eFe2b8C98a723E73eBAd2D0CbaDc);
        upvotes[0xe746d9cf4809cb70939dde3a173485059e56117bd429912342bb47663d464ef7] = 0;
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

    /*
    event event_DeletePost(
        bytes32 post_hash
    );
    */

    function all_posts() public view returns (bytes32[] memory) {
        return posts;
    }

    function new_post(string calldata post_content) public returns (bytes32) {
        bytes32 post_hash = keccak256(abi.encode(post_content));
        posts.push(post_hash);
        content[post_hash] = post_content;
        sender[post_hash] = payable(msg.sender);
        upvotes[post_hash] = 0;
        emit event_NewPost(post_hash, post_content, msg.sender);
        return post_hash;
    }

    function upvote_post(bytes32 post_hash) public payable {
        require(msg.value >= 1 gwei);
        require(bytes(content[post_hash]).length > 0);
        upvotes[post_hash] += 1;
        emit event_Upvote(post_hash, upvotes[post_hash]);
    }

    /*
    function delete_post(bytes32 post_hash) public {
        require(bytes(content[post_hash]).length > 0);
        require(sender[post_hash] == payable(msg.sender));
        content[post_hash] = "";
        sender[post_hash] = payable(0);
        emit event_DeletePost(post_hash);
    }
    */

    function get_post_by_hash(bytes32 post_hash) public view returns (string memory) {
        require(bytes(content[post_hash]).length > 0);
        return content[post_hash];
    }

    function get_sender_by_hash(bytes32 post_hash) public view returns (address payable) {
        require(bytes(content[post_hash]).length > 0);
        return sender[post_hash];
    }
}
