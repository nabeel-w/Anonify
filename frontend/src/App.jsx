import "./App.css";
import Home from "./components/Home";
import Document from "./components/Document";
import Loading from "./components/Loading";
import { CSSTransition } from "react-transition-group";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <>
        <Router>
          <CSSTransition
            in={isLoading}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <Loading />
          </CSSTransition>
          <CSSTransition
            in={!isLoading}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/document" element={<Document />} />
            </Routes>
          </CSSTransition>
        </Router>
      </>
    </>
  );
}

export default App;
