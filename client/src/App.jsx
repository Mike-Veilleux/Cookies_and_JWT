import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("No Message");

  async function login() {
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/login",
      data: {
        name: "kai",
      },
    });

    const data = response.data;
    console.log(data);

    setMessage(data.name);
  }

  async function test() {
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/test",
      withCredentials: true,
    });

    const data = response.data;
    console.log(response.data);

    setMessage(data);
  }

  return (
    <>
      <div>
        <button onClick={() => login()}>Login</button>
        <button onClick={() => test()}>Test</button>
      </div>
      <br />

      <div>{message}</div>
    </>
  );
}

export default App;
