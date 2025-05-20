// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Admin {
    address public admin;

    enum VerificationStatus { Pending, Approved, Rejected }
    enum Role { Supplier, Manufacturer, MRO, Airline, RegulatoryAuthority }

    struct VerificationRequest {
        address user;
        Role role;
        VerificationStatus status;
    }

    mapping(address => mapping(Role => VerificationStatus)) public userRoles;
    VerificationRequest[] public requests;

    event VerificationRequested(address indexed user, Role role);
    event VerificationUpdated(address indexed user, Role role, VerificationStatus status);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function requestVerification(Role role) external {
        require(userRoles[msg.sender][role] != VerificationStatus.Pending, "Already requested or verified");

        userRoles[msg.sender][role] = VerificationStatus.Pending;
        requests.push(VerificationRequest(msg.sender, role, VerificationStatus.Pending));

        emit VerificationRequested(msg.sender, role);
    }

    function approveVerification(address user, Role role) external onlyAdmin {
        require(userRoles[user][role] == VerificationStatus.Pending, "Request not pending");

        userRoles[user][role] = VerificationStatus.Approved;
        updateRequestStatus(user, role, VerificationStatus.Approved);

        emit VerificationUpdated(user, role, VerificationStatus.Approved);
    }

    function rejectVerification(address user, Role role) external onlyAdmin {
        require(userRoles[user][role] == VerificationStatus.Pending, "Request not pending");

        userRoles[user][role] = VerificationStatus.Rejected;
        updateRequestStatus(user, role, VerificationStatus.Rejected);

        emit VerificationUpdated(user, role, VerificationStatus.Rejected);
    }

    function updateRequestStatus(address user, Role role, VerificationStatus status) internal {
        for (uint i = 0; i < requests.length; i++) {
            if (requests[i].user == user && requests[i].role == role) {
                requests[i].status = status;
                break;
            }
        }
    }

    function getRequests() external view returns (VerificationRequest[] memory) {
        return requests;
    }

    // ✅ Updated to check for 'Approved' status
    function isVerified(address user, Role role) external view returns (bool) {
        return userRoles[user][role] == VerificationStatus.Approved;
    }
}
