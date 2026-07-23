import LoginButton from "../components/LoginButton";

function AuthPage({ onAuthSuccess }) {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#111823",
          border: "1px solid #3a4255",
          borderRadius: "12px",
          padding: "40px 28px",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
        }}
      >
        <h2
          style={{
            color: "#f0f0f0",
            fontSize: "1.75rem",
            marginBottom: "12px",
            marginTop: 0,
            fontWeight: "600",
          }}
        >
          Join Skinplex!
        </h2>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.95rem",
            marginBottom: "28px",
            lineHeight: "1.6",
          }}
        >
          Whether you are creating a new account or logging back in,
          authenticate securely with Google. No passwords required!
        </p>

        <LoginButton onLoginSuccess={onAuthSuccess} />
      </div>
    </div>
  );
}

export default AuthPage;
