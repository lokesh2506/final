// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Admin {
    address public admin;

    enum VerificationStatus { Pending, Approved, Rejected }
    
    struct VerificationRequest {
        address entityAddress;
        string role;
        VerificationStatus status;
    }

    mapping(address => mapping(string => VerificationStatus)) public entityRoles;
    VerificationRequest[] public verificationRequests;

    event VerificationRequested(address indexed entityAddress, string role);
    event VerificationUpdated(address indexed entityAddress, string role, VerificationStatus status);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function requestVerification(string memory role) external {
        require(entityRoles[msg.sender][role] == VerificationStatus.Pending, "Verification already requested or processed");
        entityRoles[msg.sender][role] = VerificationStatus.Pending;
        verificationRequests.push(VerificationRequest(msg.sender, role, VerificationStatus.Pending));
        emit VerificationRequested(msg.sender, role);
    }

    function verifyEntity(address entityAddress, string memory role, bool approve) external onlyAdmin {
        require(entityRoles[entityAddress][role] == VerificationStatus.Pending, "No pending request for this role");
        VerificationStatus newStatus = approve ? VerificationStatus.Approved : VerificationStatus.Rejected;
        entityRoles[entityAddress][role] = newStatus;

        for (uint i = 0; i < verificationRequests.length; i++) {
            if (verificationRequests[i].entityAddress == entityAddress && 
                keccak256(abi.encodePacked(verificationRequests[i].role)) == keccak256(abi.encodePacked(role))) {
                verificationRequests[i].status = newStatus;
                break;
            }
        }

        emit VerificationUpdated(entityAddress, role, newStatus);
    }

    function getVerificationRequests() external view returns (VerificationRequest[] memory) {
        return verificationRequests;
    }

    function isVerified(address entityAddress, string memory role) external view returns (bool) {
        return entityRoles[entityAddress][role] == VerificationStatus.Approved;
    }
}