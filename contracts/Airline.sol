// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Admin.sol";
import "./Transaction.sol";
import "./Fine.sol";

contract Airline {
    struct MaintenanceLog {
        string status; // "logged", "inspected", "cleared"
        string aircraftId;
        string issueDescription;
        address airline;
        uint timestamp;
    }

    uint public logCount;
    mapping(uint => MaintenanceLog) public maintenanceLogs;

    event MaintenanceLogged(uint logId, string aircraftId, string issueDescription, uint timestamp);
    event StatusUpdated(uint logId, string newStatus);

    modifier onlyVerifiedAirline() {
        require(adminContract.isVerified(msg.sender, Admin.Role.Airline), "Not a verified Airline");
        _;
    }

    Admin public adminContract;
    Transaction public transactionContract;
    Fine public fineContract;

    constructor(address _adminContract, address _transaction, address _fine) {
        adminContract = Admin(_adminContract);
        transactionContract = Transaction(_transaction);
        fineContract = Fine(_fine);
    }

    function logMaintenance(string memory aircraftId, string memory issueDescription) external onlyVerifiedAirline {
        maintenanceLogs[logCount] = MaintenanceLog(
            "logged",
            aircraftId,
            issueDescription,
            msg.sender,
            block.timestamp
        );
        emit MaintenanceLogged(logCount, aircraftId, issueDescription, block.timestamp);
        logCount++;
    }

    function updateStatus(uint logId, string memory newStatus) external onlyVerifiedAirline {
        require(logId < logCount, "Invalid log ID");
        maintenanceLogs[logId].status = newStatus;
        emit StatusUpdated(logId, newStatus);
    }

    function getAllLogs() external view returns (MaintenanceLog[] memory) {
        MaintenanceLog[] memory result = new MaintenanceLog[](logCount);
        for (uint i = 0; i < logCount; i++) {
            result[i] = maintenanceLogs[i];
        }
        return result;
    }
}
