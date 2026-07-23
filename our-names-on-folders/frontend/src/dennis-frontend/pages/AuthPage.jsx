import LoginButton from "../components/LoginButton";

function AuthPage({ onAuthSuccess }) {
  return (
    <div
      style={{
        padding: "60px 20px",
        maxWidth: "500px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h2>Join the Community</h2>
      <p style={{ color: "#666", marginBottom: "32px", lineHeight: "1.5" }}>
        Whether you are creating a new account or logging back in, just click
        the button below to authenticate securely with Google. No passwords
        required!
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "32px",
          borderRadius: "12px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        }}
      >
        <LoginButton onLoginSuccess={onAuthSuccess} />
      </div>
    </div>
  );
}

export default AuthPage;
