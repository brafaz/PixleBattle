import io from "socket.io-client"
const socket = io("https://192.168.0.104:5000");
//const socket = io.connect("http://127.0.0.1:5000");
export default socket