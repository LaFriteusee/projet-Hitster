import { io } from 'socket.io-client';

// En dev (Vite), connecte au serveur local. En prod (servi par Express), même origine.
const SERVER_URL = import.meta.env.DEV ? 'http://localhost:3003' : window.location.origin;

const socket = io(SERVER_URL, { autoConnect: false });

export default socket;
