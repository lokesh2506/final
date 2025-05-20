// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Admin.sol";
import "./Transaction.sol";
import "./Fine.sol";

contract RegulatoryAuthority {
    Admin public adminContract;
    Fine public fineContract;
    Transaction public transactionContract;

    struct Certification {
        uint certId;
        string partId;
        string certDetails;
        address issuedTo;
        string status; // "pending", "approved", "revoked"
    }

    uint public certCount;
    mapping(uint => Certification) public certifications;

    event CertificationIssued(uint certId, string partId, address issuedTo);
    event CertificationStatusUpdated(uint certId, string newStatus);

    modifier onlyVerifiedRegulator() {
        require(
            adminContract.isVerified(msg.sender, Admin.Role.RegulatoryAuthority),
            "Not a verified Regulatory Authority"
        );
        _;
    }

    constructor(address _adminContract, address _transaction, address _fine) {
        adminContract = Admin(_adminContract);
        transactionContract = Transaction(_transaction);
        fineContract = Fine(_fine);
    }

    function issueCertification(
        string memory partId,
        string memory certDetails,
        address issuedTo
    ) external onlyVerifiedRegulator {
        certCount++;
        certifications[certCount] = Certification({
            certId: certCount,
            partId: partId,
            certDetails: certDetails,
            issuedTo: issuedTo,
            status: "pending"
        });

        emit CertificationIssued(certCount, partId, issuedTo);
    }

    function updateCertificationStatus(
        uint certId,
        string memory newStatus
    ) external onlyVerifiedRegulator {
        require(certId <= certCount, "Invalid certification ID");
        certifications[certId].status = newStatus;
        emit CertificationStatusUpdated(certId, newStatus);
    }

    function getAllCertifications() external view returns (Certification[] memory) {
        Certification[] memory result = new Certification[](certCount);
        for (uint i = 1; i <= certCount; i++) {
            result[i - 1] = certifications[i];
        }
        return result;
    }
}
