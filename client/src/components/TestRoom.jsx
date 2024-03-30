import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "./CSS/TestRoom.css"
const TestRoom = (props) => {
    const { id } = useParams();
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const socket = props.socket;
    const navigate = useNavigate();

    socket.on("joined_room", (id) => {
        console.log(`socket id : ${id} joined the room `);
        alert(`socket id : ${id} joined the room `);
    });
    socket.on("leaved_room" , (id)=>{
        console.log(`socket id : ${id} leaved the room `);
        alert(`socket id : ${id} leaved the room `);
    })

    useEffect(() => {
        socket.on("take_message", (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });
        return () => {
            socket.off("take_message");
        };
    }, [socket]);

    const sendMessage = () => {
        console.log(msg);
        socket.emit("message", msg, id);
        setMsg(""); // Clear the input field after sending the message
    };

    const handleChange = (e) => {
        setMsg(e.target.value);
    };

    const leaveRoom = async (id) => {
        await socket.emit("leave_room", id);
        navigate("/");
    };

    return (
        <div className="container-fluid mt-5"> {/* add some margin to the top */}
            <div className="row justify-content-center"> {/* center the chat box horizontally */}
                <div className="col-md-6 col-lg-4">
                    <div className='chat-box'>
                        <div className='chat-header'>
                            <h2>Room -  {id}</h2>
                            <button className='btn btn-danger' onClick={() => leaveRoom(id)}>Leave</button>
                        </div>
                        <div className='chat-messages'>
                            <ul>
                                {messages.map((message, index) => (
                                    <li key={index}>{message}</li>
                                ))}
                            </ul>
                        </div>
                        <div className='chat-input'>
                            <label htmlFor='message'>Message:</label>
                            <input
                                id='message'
                                placeholder='Type your message here...'
                                type='text'
                                value={msg}
                                onChange={handleChange}
                            />
                            <button className='btn btn-danger'onClick={sendMessage}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestRoom;
