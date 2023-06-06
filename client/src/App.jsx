import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("No Message");
  const [loginName, setLoginName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function login() {
    setErrorMsg("");
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/login",
      withCredentials: true,
      data: {
        name: loginName,
      },
    });
    if (response.status === 204) {
      setErrorMsg(`${loginName} is not in out database.`);
    } else {
      setErrorMsg("");
    }
    const data = response.data;
    setMessage(data);
  }

  async function logout() {
    setErrorMsg("");
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/logout",
      withCredentials: true,
    });
    const data = response.data;
    setMessage(data);
  }

  async function TestAuthRequest() {
    setErrorMsg("");
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/test",
      withCredentials: true,
    });
    if (response.status == 204) {
      setErrorMsg(`Authenticated request FAILED!`);
    } else {
      setErrorMsg(`Authenticated request SUCCESSFUL!`);
    }
  }

  useEffect(() => {
    setErrorMsg("");
    setLoginName(message);
  }, []);

  return (
    <>
      <h2>Cookies and JWT Test bed</h2>
      <div style={{ paddingBottom: 15 }}>
        <input
          type="text"
          value={loginName}
          placeholder="Enter your name..."
          onChange={(e) => setLoginName(e.target.value)}
        />
      </div>
      <div>
        <button
          disabled={loginName === "" ? true : false}
          onClick={() => login()}
        >
          Login
        </button>
      </div>
      <div>
        <button onClick={() => TestAuthRequest()}>
          Test Authenticated Request
        </button>
      </div>
      <div>
        <button
          disabled={Object.keys(message).length > 0 ? false : true}
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>

      <h3>Console logs...</h3>
      <div className="logContainer">
        {errorMsg == "" && (
          <>
            {Object.keys(message).length > 0 ? (
              <>
                <div>
                  <strong>Logged in as:</strong>
                </div>
                <div>{`id:   ${message.id}`}</div>
                <div>{`name:   ${message.name}`}</div>
                <div>{`title:   ${message.title}`}</div>
              </>
            ) : (
              <div>Cookie has been invalidated</div>
            )}
          </>
        )}
        {errorMsg !== "" && <div>{errorMsg}</div>}
      </div>
    </>
  );
}

export default App;
