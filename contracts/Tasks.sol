pragma solidity ^0.4.11;

// Distense is a decentralized, for-profit code cooperative
// INSECURE/DRAFT

import './lib/SafeMath.sol';

contract Tasks {
  using SafeMath for uint256;

  address public votingAddress;

  struct Task {
    address createdBy;
    string title;
    string url;
    string tags;
    string ipfsHashID;
    uint256 createdAt;
    TaskStatus status;
  }

  string[] public taskIds;
  mapping (string => Task) tasks;

  enum TaskStatus { Proposal, Task, Contribution }

  function createTask(
    string _title,
    string _url,
    string _tags,
    string _ipfsHashID
  ) external returns (bool) {
    Task memory task = Task(msg.sender, _title, _url, _tags, _ipfsHashID, block.timestamp, TaskStatus.Proposal);
    taskIds.push(_ipfsHashID);
    tasks[_ipfsHashID] = task;
    return true;
  }

  function getNumTasks() public constant returns (uint) {
    return taskIds.length;
  }

  function getTaskByIndex(uint256 _index) public constant returns (
    address,
    string,
    string,
    string,
    string,
    uint256,
    TaskStatus
  ) {
    return getTask(taskIds[_index]);
  }

  function getTask(string _id) public constant returns (
    address,
    string,
    string,
    string,
    string,
    uint256,
    TaskStatus
  ) {
    return (
      tasks[_id].createdBy,
      tasks[_id].title,
      tasks[_id].url,
      tasks[_id].tags,
      tasks[_id].ipfsHashID,
      tasks[_id].createdAt,
      tasks[_id].status
    );
  }
}
