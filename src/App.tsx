import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProfileProvider } from "./context/ProfileContext";
import { Header } from "./components/layout/Header";
import { HomePage } from "./pages/HomePage";
import { PlayPage } from "./pages/PlayPage";
import { ConverterPage } from "./components/converter/ConverterPage";

function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <div className="bg-bg min-h-screen">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/play" replace />} />
              <Route path="/play" element={<HomePage />} />
              <Route path="/play/:levelId" element={<PlayPage />} />
              <Route path="/converter" element={<ConverterPage />} />
              <Route path="*" element={<Navigate to="/play" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ProfileProvider>
  );
}

export default App;
