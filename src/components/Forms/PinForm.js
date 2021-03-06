import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import getUser from '../../helpers/data/authData';
import pinsData from '../../helpers/data/pinsData';

class PinForm extends Component {
  state = {
    firebaseKey: this.props.pin?.firebaseKey || '',
    name: this.props.pin?.name || '',
    imageUrl: this.props.pin?.imageUrl || '',
    description: this.props.pin?.description || '',
    userId: this.props.pin?.userId || '',
    private: this.props.pin?.private || '',
  };

  componentDidMount() {
    const userId = getUser.getUid();
    this.setState({
      userId,
    });
  }

  handleChange = (e) => {
    if (e.target.name === 'filename') {
      this.setState({ imageUrl: '' });
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(
        `pinterest/${this.state.userId}/${Date.now()}${e.target.files[0].name}`,
      );
      imageRef.put(e.target.files[0]).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((imageUrl) => {
          this.setState({ imageUrl });
        });
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.firebaseKey === '') {
      pinsData.createPin(this.state).then(() => {
        this.props.onUpdate?.();
      });
    } else {
      pinsData.updatePin(this.state).then(() => {
        this.props.onUpdate?.(this.state.firebaseKey);
      });
    }
  };

  render() {
    return (
      <div className="d-flex justify-content-center">
        <form onSubmit={this.handleSubmit} className="add-board-form">
          <input
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="Pin Name"
            className="form-control form-control-lg m-1"
            required
          />
          <input
            type="text"
            name="description"
            value={this.state.description}
            onChange={this.handleChange}
            placeholder="Pin Description"
            className="form-control form-control-lg m-1"
            required
          />
          <input
            type="url"
            name="imageUrl"
            value={this.state.imageUrl}
            onChange={this.handleChange}
            placeholder="Enter an Image URL or Upload a File"
            className="form-control form-control-lg m-1"
            required
          />
          <input
            className="m-2"
            type="file"
            id="myFile"
            name="filename"
            accept="image/*"
            onChange={this.handleChange}
          />
          <select
            className="form-control form-control-lg m-1"
            name="private"
            value={this.state.private}
            onChange={this.handleChange}
            required
          >
            <option value="" selected disabled hidden>Choose here</option>
            <option className="dropdown-item">
              Public
            </option>
            <option className="dropdown-item">
              Private
            </option>
          </select>
          <button className="btn form-button form-button-text mt-1">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default PinForm;
