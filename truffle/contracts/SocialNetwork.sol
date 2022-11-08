pragma solidity >=0.4.22 <0.9.0;

contract SocialNetwork {
    mapping(bytes32 => string) public content;
    mapping(bytes32 => address payable) public sender;

    event event_NewPost(
        bytes32 post_hash,
        string content,
        address sender
    );

    event event_DeletePost(
        bytes32 post_hash
    );

    function new_post(string calldata post_content) public returns (bytes32) {
        bytes32 post_hash = keccak256(abi.encode(post_content));
        content[post_hash] = post_content;
        sender[post_hash] = payable(msg.sender);
        emit event_NewPost(post_hash, post_content, msg.sender);
        return post_hash;
    }

    function delete_post(bytes32 post_hash) public {
        require(bytes(content[post_hash]).length > 0);
        require(sender[post_hash] == payable(msg.sender));
        content[post_hash] = "";
        sender[post_hash] = payable(0);
        emit event_DeletePost(post_hash);
    }

    function get_post_by_hash(bytes32 post_hash) public view returns (string memory) {
        require(bytes(content[post_hash]).length > 0);
        return content[post_hash];
    }

    function get_sender_by_hash(bytes32 post_hash) public view returns (address payable) {
        require(bytes(content[post_hash]).length > 0);
        return sender[post_hash];
    }
}
