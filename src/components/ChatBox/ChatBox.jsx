import React, { useContext, useEffect, useState } from "react";
import "./ChatBox.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import avatar from '../../imgs/profile.png'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, onChildAdded, remove, set, off } from "firebase/database";
import axios from "axios";
import { baseURL } from "../../constants/baseURL";
import BackspaceIcon from '@mui/icons-material/Backspace';

const ChatBox = () => {
    const userID = parseInt(sessionStorage.getItem('userID'));
    const [loading, setLoading] = useState(false);

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

    const [userIdToState, setUserIdToState] = useState();
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
        setLoading(true);
        // Your web app's Firebase configuration
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
        const fetchChat = ref(database, "chatmessage/");

        // GET LIST MESSAGE
        let y = []
        let xyz = []
        onChildAdded(fetchChat, (snapshot) => {
            const messages = snapshot.val();
            console.log("==============================================: ", messages.time)
            y.push({
                userIdFrom: messages.userIdFrom,
                userIdTo: messages.userIdTo,
                content: messages.content,
                time: messages.time
            })
            xyz.push({ ...messages })

            let z = y.filter(
                (item) => (item.userIdFrom === 3 && item.userIdTo === userIdToState)
                    || (item.userIdFrom === userIdToState && item.userIdTo === 3)
            )
            setMessageList(z);

        })

        // SORT MESSAGE BY TIMESTAMP
        let y1 = xyz.sort((x, y) => {
            return new Date(x.time) < new Date(y.time) ? 1 : -1
        })
        axios.get(`${baseURL}/api/v1/user`)
            .then((res) => {
                let listCustomerEdit = [];
                let listCustomer = res.data.filter(
                    (item) => item.role.id == 1
                )
                y1.map((mes) => {
                    let uniqueCus = listCustomer.find(
                        (cus) => cus.id === mes.userIdFrom || cus.id === mes.userIdTo
                    )
                    listCustomerEdit.push({ ...uniqueCus, contentMes: mes.content, timeMes: mes.time, fromMes: mes.userIdFrom });
                })

                // FILTER CUSTOMER DUPLICATE
                let unique = listCustomerEdit.filter(
                    (obj, index) =>
                        listCustomerEdit.findIndex((item) => item.id === obj.id) === index
                );
                setCustomerList(unique);

            })
            .catch((err) => console.log(err))
        off(fetchChat, (snapshot) => {
            const messages = snapshot.val();
            const message = `<li class=${messages.userIdFrom === 1 ? "sent" : "receive"
                }><span>${messages.userIdTo}: </span>${messages.content}</li>`;
            // append the message on the page
            document.getElementById("messages").innerHTML += message;
            console.log("=======================: ", messages.userIdFrom, messages.content);

        })
        setLoading(false);

    }, [sendMessageState, userIdToState])

    useEffect(() => {
        setSendMessageState(!sendMessageState);

    }, [])

    // SEND MESSAGE FUNCTION
    function sendMessage(userIdFrom, userIdTo, content) {
        const timestamp = Date.now();

        set(ref(database, 'chatmessage/' + timestamp), {
            userIdFrom: userIdFrom,
            userIdTo: userIdTo,
            content: content,
            time: timestamp,
        });

        setSendMessageState(!sendMessageState);
        setContent('');

    }
    // REMOVE MESSAGE
    const deleteMessage = (time) => {
        remove(ref(database, 'chatmessage/' + time));
        setSendMessageState(!sendMessageState);
    }
    if(loading) {
        <div className="MainDash">
            <p>Loading...</p>
        </div>
    }
    return (
        <div className="MainDash">
            <ToastContainer />
            <h1>Chat box</h1>
            <div className="chat__container">
                <div className="chat__sidebar-container">
                    {/* <div className="chat__sidebar-header">
                        <input
                            placeholder="Search who..."
                        />
                    </div> */}
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
                                        src={item.image.length > 0 ? item.image.slice(0, -1) : avatar}

                                    />
                                    <div>
                                        <h5>{item.name}</h5>
                                        <p style={{ fontSize: 13, width: 200 }}>{
                                            item.contentMes.length < 30 ? item.contentMes :
                                                `${item.contentMes.slice(0, 27)}...`
                                        }</p>

                                        <p style={{ fontSize: 13 }}>{
                                            new Date(Date.now() - item.timeMes).getMinutes() < 1 ? 'Vừa xong' :
                                                `${new Date(Date.now() - item.timeMes).getMinutes()} phút`
                                        }</p>
                                        {
                                            item.fromMes !== 3 &&
                                            <p style={{fontSize: 13, color: 'red'}}>
                                                Chưa trả lời
                                            </p>
                                        }

                                    </div>

                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="chat__content-container">
                    <div className="chat__content-header">
                        <img
                            src={userAvatarToState.slice(0, -1)}

                        />
                        <h5>{userNameToState}</h5>
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
                                                    src={userAvatarToState.slice(0, -1)}
                                                    style={{ marginRight: 10 }}
                                                />
                                            }
                                            {/* <h5>{item.userIdFrom}</h5> */}
                                            <p
                                                style={{
                                                    backgroundColor: item.userIdFrom === 3 ? '#FF919D' : '#ebe6e6'
                                                }}
                                            >{item.content}
                                                {
                                                    item.userIdFrom === 3 &&
                                                    <span
                                                        style={{fontSize: 12, cursor: 'pointer', paddingLeft: 10, color: 'red'}} 
                                                        onClick={() =>
                                                            deleteMessage(item.time)
                                                        }>
                                                        <BackspaceIcon fontSize="12px" />
                                                    </span>
                                                }
                                            </p>
                                            
                                    </div>

                                ))
                        }
                    </div>
                    <div className="chat__content-footer">
                        <input
                            onChange={(e) => setContent(e.target.value)}
                            value={content}
                        />
                        <button onClick={() => {
                            sendMessage(userID, userIdToState, content);

                        }}>Send</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ChatBox;
