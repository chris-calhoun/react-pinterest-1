import axios from 'axios';

const baseUrl = 'https://dinnterest-532dd.firebaseio.com';

// Basic CRUD
const getPin = (pinId) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/react-pins/${pinId}.json`).then((response) => {
    resolve(response.data);
  }).catch((error) => reject(error));
});

const getAllPins = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/react-pins.json`).then((response) => {
    resolve(Object.values(response.data));
  }).catch((error) => reject(error));
});

const createPin = (pinObj) => new Promise((resolve, reject) => {
  axios.post(`${baseUrl}/react-pins.json`, pinObj)
    .then((response) => {
      axios.patch(`${baseUrl}/react-pins/${response.data.name}.json`, { firebaseKey: response.data.name }).then((res) => {
        resolve(res);
      });
    }).catch((error) => reject(error));
});

const updatePin = (pinObj) => new Promise((resolve, reject) => {
  axios.patch(`${baseUrl}/react-pins/${pinObj.firebaseKey}.json`, pinObj).then((response) => {
    resolve(response);
  }).catch((error) => reject(error));
});

const deletePin = (pinFirebasekey) => axios.delete(`${baseUrl}/react-pins/${pinFirebasekey}.json`);

// Join Tables
const getBoardPins = (boardId) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/react-boards-pins.json?orderBy="boardId"&equalTo="${boardId}"`).then((response) => {
    resolve(Object.values(response.data));
  }).catch((error) => reject(error));
});

const createBoardPin = (userId, boardId, pinId) => {
  axios.post(`${baseUrl}/react-boards-pins.json`, {
    userId,
    boardId,
    pinId,
  }).catch((error) => console.warn(error));
};

const deleteBoardPin = (pinId) => {
  axios.get(`${baseUrl}/react-boards-pins.json?orderBy="pinId"&equalTo="${pinId}"`)
    .then((response) => {
      const toBeDeleted = Object.keys(response.data);
      toBeDeleted.forEach((join) => {
        axios.delete(`${baseUrl}/react-boards-pins/${join}.json`);
      });
    });
};

// Search Pins
const searchPins = (uid, searchTerm) => new Promise((resolve, reject) => {
  getAllPins().then((response) => {
    const filteredArray = response.filter((r) => r.userId === uid || r.private === false);
    const searchResults = filteredArray.filter((r) => r.name.toLowerCase().includes(searchTerm) || r.description.toLowerCase().includes(searchTerm));
    resolve(searchResults);
  }).catch((error) => reject(error));
});

export default {
  getPin,
  getAllPins,
  createPin,
  updatePin,
  deletePin,
  getBoardPins,
  createBoardPin,
  deleteBoardPin,
  searchPins,
};
