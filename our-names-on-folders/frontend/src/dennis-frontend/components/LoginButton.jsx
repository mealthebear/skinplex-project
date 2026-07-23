import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const API_URL = "http://localhost:3001";
const CLIENT_ID =
  "702851582781-c9j6t98aptdam1eiko8qudftc5d6m6h4.apps.googleusercontent.com";

function LoginButton({ onLoginSuccess }) {
  const handleSuccess = (credentialResponse) => {
    fetch(`${API_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: credentialResponse.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          console.log("Logged in user:", data.user);
          alert(`Welcome, ${data.user.username}!`);
          if (onLoginSuccess) {
            onLoginSuccess(data.user);
          }
        } else {
          alert("Login failed on the server.");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        alert("Something went wrong communicating with the server.");
      });
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "20px",
        }}
      >
        <h3>Sign In / Sign Up</h3>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => alert("Google Login Failed")}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default LoginButton;
