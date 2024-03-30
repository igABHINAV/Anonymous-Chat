import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CSS/Room.css"
const Room = (props) => {
  const socket = props.socket;
  const [room, setRoom] = useState(""); // Corrected to setRoom instead of setroom
  const navigate = useNavigate();

  const joinRoom = async () => {
    await socket.emit("join_room", room);
    console.log(`event of join room emmited`);
    navigate(`/room/${room}`);
  };



  return (
    <div className="room-container">
      <h1 className="mb-4 text-center">Join Room</h1>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your room name"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <button onClick={joinRoom} className="btn btn-primary btn-block mt-3">
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
