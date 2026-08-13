export default function Footer() {
  return (
    <footer style={{
      background: "#0b1220",
      color: "white",
      padding: 20,
      marginTop: 40,
      textAlign: "center",
    }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {/* Instagram */}
        <svg width="22" height="22" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="instagramGradient" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#feda75" />
              <stop offset="35%" stopColor="#fa7e1e" />
              <stop offset="65%" stopColor="#d62976" />
              <stop offset="100%" stopColor="#4f5bd5" />
            </linearGradient>
          </defs>
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            fill="url(#instagramGradient)"
          />
          <circle
            cx="12"
            cy="12"
            r="4"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <circle cx="17.3" cy="6.8" r="1.2" fill="white" />
        </svg>

        {/* YouTube */}
        <svg width="25" height="22" viewBox="0 0 24 24">
          <rect
            x="2"
            y="5"
            width="20"
            height="14"
            rx="4"
            fill="#FF0000"
          />
          <polygon points="10,9 16,12 10,15" fill="white" />
        </svg>

        {/* TikTok */}
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path
            d="M14 3v11.5a4.5 4.5 0 1 1-3-4.24"
            fill="none"
            stroke="#25F4EE"
            strokeWidth="4"
          />
          <path
            d="M15 2v11.5a4.5 4.5 0 1 1-3-4.24M15 2c.5 3 2.2 4.5 5 5"
            fill="none"
            stroke="#FE2C55"
            strokeWidth="2"
          />
          <path
            d="M14 2v11.5a4.5 4.5 0 1 1-3-4.24M14 2c.5 3 2.2 4.5 5 5"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>

        <span>@dominioseminovos</span>
      </div>

      <p>Rua Joaquim Felício, 146 - São Paulo SP</p>
      <p>(11) 98122-3969 | (11) 94908-6139</p>
    </footer>
  );
}