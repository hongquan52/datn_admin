import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import avatar from '../../imgs/profile.png'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, onChildAdded, set, off } from "firebase/database";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";


const ChatBox = () => {
    const userID = parseInt(sessionStorage.getItem('userID'));

    const firebaseConfig = {
        apiKey: "AIzaSyDkIqYefTbKOJ5r5gexI84Fzy4Tf1oQTrE",
        authDomain: "chatapp-839b6.firebaseapp.com",
        databaseURL: "https://chatapp-839b6-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "chatapp-839b6",
        storageBucket: "chatapp-839b6.appspot.com",
        messagingSenderId: "920125762908",
        appId: "1:920125762908:web:effab25f06bc17cecf6599",
        measurementId: "G-C4S6HDSKDE"
    };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const [messageList, setMessageList] = useState([]);
    const [content, setContent] = useState('');
    const [sendMessageState, setSendMessageState] = useState(false);

    const [customerList, setCustomerList] = useState([]);

    const [userIdToState, setUserIdToState] = useState(2);
    const [userAvatarToState, setUserAvatarToState] = useState('');
    const [userNameToState, setUserNameToState] = useState('');

    const database = getDatabase(app);
    // NOTIFY SUCESS

    const showToastMessageSuccess = (message) => {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    useEffect(() => {
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const fetchChat = ref(database, "chatmessage/");

        // GET LIST MESSAGE
        let y = []
        onChildAdded(fetchChat, (snapshot) => {
            const messages = snapshot.val();

            //     const message = `<li class=${messages.userIdFrom === 1 ? "sent" : "receive"
            // }><span>${messages.userIdTo}: </span>${messages.content}</li>`;
            // // append the message on the page
            // document.getElementById("messages").innerHTML += message;

            y.push({
                userIdFrom: messages.userIdFrom,
                userIdTo: messages.userIdTo,
                content: messages.content
            })

            let z = y.filter(
                (item) => (item.userIdFrom === 3 && item.userIdTo === userIdToState)
                || (item.userIdFrom === userIdToState && item.userIdTo === 3)
                )
            setMessageList(z);

        })
        off(fetchChat, (snapshot) => {
            const messages = snapshot.val();
            const message = `<li class=${messages.userIdFrom === 1 ? "sent" : "receive"
                }><span>${messages.userIdTo}: </span>${messages.content}</li>`;
            // append the message on the page
            document.getElementById("messages").innerHTML += message;
            console.log("=======================: ", messages.userIdFrom, messages.content);

        })

    }, [sendMessageState, userIdToState])
    console.log("+++++++++++++++++++++: ", customerList)
    useEffect(() => {
        setSendMessageState(!sendMessageState);

        axios.get(`${baseURL}/api/v1/user`)
            .then((res) => {
                let x = res.data.filter(
                    (item) => item.role.id == 1
                )
                
                setCustomerList(x);
            })
            .catch((err) => console.log(err))
    }, [])
    
    // SEND MESSAGE FUNCTION
    function sendMessage(userIdFrom, userIdTo, content) {
        const timestamp = Date.now();

        set(ref(database, 'chatmessage/' + timestamp), {
            userIdFrom: userIdFrom,
            userIdTo: userIdTo,
            content: content,

        });

        setSendMessageState(!sendMessageState);
        setContent('');

    }
    
    return (
        <div className="MainDash">
            <ToastContainer />
            <h1>Chat box</h1>
            <div className="chat__container">
                <div className="chat__sidebar-container">
                    <div className="chat__sidebar-header">
                        <input
                            placeholder="Search who..."
                        />
                    </div>
                    <div className="chat__sidebar-content">
                        {
                            customerList.map((item) => (
                                <div className="chat__sidebar-item"
                                    onClick={() => {
                                        setUserIdToState(item.id);
                                        setUserAvatarToState(item.image);
                                        setUserNameToState(item.name);
                                    }}
                                >
                                    <img
                                        src={item.image.length > 0 ? item.image.slice(0,-1) :avatar}

                                    />
                                    
                                    <h5>{item.name} ({item.id})</h5>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="chat__content-container">
                    <div className="chat__content-header">
                        <img
                            src={userAvatarToState.slice(0,-1)}

                        />
                        <h5>{userNameToState} ({userIdToState})</h5>
                    </div>
                    <div className="chat__content-content">
                        {
                            messageList
                            .map((item) => (
                                <div className="chat__content-message"
                                    style={{ flexDirection: item.userIdFrom === 3 ? 'row-reverse' : 'row' }}
                                >
                                    {
                                        item.userIdFrom !== 3 &&
                                        <img
                                            src={userAvatarToState.slice(0,-1)}
                                            style={{marginRight: 10}}
                                        />
                                    }
                                    {/* <h5>{item.userIdFrom}</h5> */}
                                    <p
                                        style={{
                                            backgroundColor: item.userIdFrom === 3 ? '#FF919D' : '#ebe6e6'
                                        }}
                                    >{item.content}</p>
                                </div>
                            ))
                        }
                    </div>
                    <div className="chat__content-footer">
                        <input
                            onChange={(e) => setContent(e.target.value)}
                            value={content}
                        />
                        <button onClick={() => sendMessage(userID, userIdToState, content)}>SEND</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ChatBox;
