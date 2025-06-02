// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactPlayer from "react-player";
import CountUp from "react-countup";
import { Typewriter } from "react-simple-typewriter";
import Tilt from "react-parallax-tilt";
import Konami from "konami-code-js";


import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import GraphView from "./components/GraphView";
import Profile from "./components/Profile";
import PdfReport from "./components/PdfReport";
import ChainValidator from "./components/ChainValidator";
import Lottie from "lottie-react";
import blockchainAnim from "./assets/animations/welcome.json";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import {
  FaSignOutAlt,
  FaUser,
  FaFilePdf,
  FaChartBar,
  FaThLarge,
  FaMoon,
  FaBolt,
  FaGlobe,
  FaSearch,
  FaCheckCircle,
} from "react-icons/fa";

const translations = {
  tr: {
    title: "Dijital Kimlik Sistemi",
    dashboard: "Panel",
    graph: "Grafik",
    profile: "Profil",
    pdf: "PDF",
    theme: "Tema",
    lang: "Dil",
    logout: "Çıkış",
    search: "Ara...",
    validate: "Zincir Doğrula",
  },
  en: {
    title: "Digital Identity System",
    dashboard: "Dashboard",
    graph: "Graph",
    profile: "Profile",
    pdf: "PDF",
    theme: "Theme",
    lang: "Language",
    logout: "Logout",
    search: "Search...",
    validate: "Validate Chain",
  },
};

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function Navbar({ toggleTheme, handleLogout }) {
  const [language, setLanguage] = useState("tr");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const t = translations[language];
  const token = localStorage.getItem("token");

  const handleLanguageChange = () => {
    setLanguage((prev) => (prev === "tr" ? "en" : "tr"));
  };

  const allButtons = [
    { path: "/dashboard", icon: <FaThLarge />, label: t.dashboard },
    { path: "/graph", icon: <FaChartBar />, label: t.graph },
    { path: "/profile", icon: <FaUser />, label: t.profile },
    { path: "/report", icon: <FaFilePdf />, label: t.pdf },
    { path: "/validate", icon: <FaCheckCircle />, label: t.validate },
  ];

  const filteredButtons =
    search.trim() === ""
      ? allButtons
      : allButtons.filter((btn) =>
          btn.label.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <nav className="navbar flex flex-wrap items-center justify-between p-4 bg-gray-800 text-white gap-4 overflow-x-auto">
      <div
        className="text-xl font-bold flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <FaBolt /> {t.title}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder={t.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded px-2 py-1 text-black w-40 flex-shrink-0"
        />
        <FaSearch />

        {filteredButtons.map((btn) => (
          <button
            key={btn.label}
            className="btn-with-icon"
            onClick={() => navigate(btn.path)}
          >
            {btn.icon} {btn.label}
          </button>
        ))}

        <button className="btn-with-icon" onClick={toggleTheme}>
          <FaMoon /> {t.theme}
        </button>
        <button className="btn-with-icon" onClick={handleLanguageChange}>
          <FaGlobe /> {t.lang}
        </button>

        {token ? (
          <button className="btn-with-icon" onClick={handleLogout}>
            <FaSignOutAlt /> {t.logout}
          </button>
        ) : (
          <>
            <button
              className="btn-with-icon"
              onClick={() => navigate("/login")}
            >
              🔐 Giriş Yap
            </button>
            <button
              className="btn-with-icon"
              onClick={() => navigate("/register")}
            >
              📝 Kayıt Ol
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer text-center py-4 text-sm bg-gray-900 text-gray-400">
      © 2025 Hatice Gazel | Dağıtık Sistemler Blockchain Projesi
    </footer>
  );
}

export function LandingPageContent() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");

  const particlesInit = async (engine) => await loadSlim(engine);

  const sliderContent = [
    {
      title: "🔐 Güvenli Giriş",
      desc: "Blockchain ile kimlik bilgileriniz güvende.",
    },
    {
      title: "🧾 Şeffaf İşlemler",
      desc: "İşlemler zincire kaydedilir ve doğrulanabilir.",
    },
    {
      title: "🌍 Geleceğin Teknolojisi",
      desc: "Dijital kimlik ile Web3 dünyasına hazır olun.",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleToggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.classList.remove("dark", "light");
    document.body.classList.add(newTheme);
  };

  useEffect(() => {
  const easterEgg = new Konami(() => {
    alert("🎉 Konami Code aktif! Neon tema açıldı!");
    document.body.classList.add("bg-black", "text-green-400");
  });

}, []);


  return (
    <div
      className={`relative w-full min-h-screen transition-colors duration-700 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <Particles
  id="tsparticles"
  init={particlesInit}
  options={{
    background: {
      color: { value: theme === "dark" ? "#0f172a" : "#ffffff" },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "grab" },
        resize: true,
      },
      modes: {
        push: { quantity: 3 },
        grab: {
          distance: 140,
          links: {
            opacity: 0.6,
          },
        },
      },
    },
    particles: {
      number: {
        value: 160,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: theme === "dark" ? "#ffffff" : "#000000",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.8,
        random: true,
      },
      size: {
        value: 1.5,
        random: true,
      },
      move: {
        enable: true,
        speed: 0.3,
        direction: "none",
        outModes: { default: "out" },
      },
      links: {
        enable: true,
        color: theme === "dark" ? "#ffffff" : "#000000",
        distance: 150,
        opacity: 0.4,
        width: 0.7,
      },
    },
    detectRetina: true,
  }}
  className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none"
/>


      <div className="relative z-10 text-center pt-20 px-4 pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="glitch text-4xl md:text-5xl font-extrabold text-indigo-500 mb-4"
          data-text="👾 Dijital Kimliğe Hoş Geldiniz!"
        >
          👾 Dijital Kimliğe Hoş Geldiniz!
        </motion.h1>

        <div className="text-indigo-300 text-lg font-mono mt-2">
          <Typewriter
            words={[
              "💡 Güvenli Kimlikleme",
              "🔗 Zincir Üzerinde Doğrulama",
              "⚡ Web3 ile Entegre",
            ]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </div>

        {/* SLIDER */}
        <div className="max-w-2xl mx-auto px-4">
          <Slider {...sliderSettings}>
            {sliderContent.map((item, index) => (
              <Tilt glareEnable={true} glareMaxOpacity={0.3} scale={1.05}>
                <div className="bg-gray-800 rounded-2xl p-6 mx-2 shadow-xl flex flex-col items-center justify-center text-center max-w-xl mx-auto">
                  {/* Lottie animasyonu */}
                  <div className="animation-box">
                    <Lottie
                      animationData={blockchainAnim}
                      loop
                      autoplay
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>

                  {/* Yazılar */}
                  <div className="text-left max-w-lg">
                    <h3 className="text-xl font-bold text-indigo-300 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 mb-4">{item.desc}</p>
                    <button
                      onClick={() => navigate("/register")}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow transition"
                    >
                      Başla 🔐
                    </button>
                  </div>
                </div>
              </Tilt>
            ))}
          </Slider>
        </div>

        {/* VİDEO */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">🎞 Nasıl Çalışır?</h2>
          <ReactPlayer
            url="https://www.youtube.com/watch?v=SSo_EIwHSd4" // İstersen özel video ekleyebilirsin
            controls
            width="100%"
            height="360px"
          />
        </div>

        {/* SAYAÇLAR */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-indigo-400">
          <div>
            <h3 className="text-4xl font-bold">
              <CountUp end={134} duration={3} />
            </h3>
            <p className="mt-2 text-sm">Kayıtlı Kullanıcı</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">
              <CountUp end={512} duration={3} />
            </h3>
            <p className="mt-2 text-sm">Toplam İşlem</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">
              <CountUp end={89} duration={3} />
            </h3>
            <p className="mt-2 text-sm">Blok Sayısı</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold">
              <CountUp end={24} duration={3} />
            </h3>
            <p className="mt-2 text-sm">Saatte Ortalama Blok</p>
          </div>
        </div>

        {/* TEMA GEÇİŞİ */}
        <div className="mt-16">
          <button
            onClick={handleToggleTheme}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full transition duration-500 hover:scale-105"
          >
            {theme === "dark" ? "☀️ Aydınlık Moda Geç" : "🌙 Karanlık Moda Geç"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Layout() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(theme === "dark" ? "bg-gray-900" : "bg-white");
    document.body.classList.add(theme === "dark" ? "text-white" : "text-black");
    document.body.style.overflow = "auto";
  }, [theme]);

  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar toggleTheme={toggleTheme} handleLogout={handleLogout} />
      <main className="container flex-grow py-6 px-4">
        <Routes>
          <Route path="/" element={<LandingPageContent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/graph"
            element={
              <ProtectedRoute>
                <GraphView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <PdfReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/validate"
            element={
              <ProtectedRoute>
                <ChainValidator />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
