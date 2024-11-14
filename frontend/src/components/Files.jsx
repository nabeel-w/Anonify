/*eslint-disable */
import { useEffect, useState } from "react";
import MyLottieAnimation from "./Animation";
import { Review } from "./Review";
import { io } from "socket.io-client";
import SampleData from "../assets/Sample_JSON_data.json";


function Files() {
  const [fileName, setFileName] = useState("No file chosen");
  const [isFileChosen, setIsFileChosen] = useState(false);
  const [selectedScale, setSelectedScale] = useState("high");
  const [homePage, setHomePage] = useState(true);
  const [file, setFile] = useState(undefined);
  const [animation, setAnimation] = useState(false);
  const [Data, setData] = useState(undefined);
  const [socket, setSocket] = useState(io('', { path: '/socket.io/' }));

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    })
    return () => {
      socket.off('connect', () => {
        console.log(socket.id);
      });
    }
  }, [socket]);


  function handleFileChoose(event) {
    const chosenFile = event.target.files[0];
    if (chosenFile) {
      setFile(chosenFile);
      setFileName(chosenFile.name);
      setIsFileChosen(true);
    } else {
      setFileName("No file chosen");
      setIsFileChosen(false);
    }
  }

  function handleFileRemove() {
    setFileName("No file chosen");
    setIsFileChosen(false);
    document.getElementById("file-input").value = "";
    setSelectedScale("high");
    setFile(null);
  }

  function handleScaleChange(scale) {
    setSelectedScale(scale);
  }

  function handleConvert() {
    setAnimation(true);
    console.log("Is animation active:", animation);

    if (!file || !isFileChosen) {
      alert("Please choose a file and scale.");
      return;
    }

    socket.emit('register_task', { task_id: fileName })
    console.log(socket.id);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("level", selectedScale.toUpperCase());
    formData.append("sid", socket.id);

    fetch("/v2/analyze", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log("Is animation response:", animation);

        return response.json();
      })
      .then((data) => {
        setData(data);
        setAnimation(false);
        setHomePage(false); // Show the review page after conversion
        console.log("Is animation data:", animation);
      })
      .catch((error) => console.error("Error:", error));
  }

  return (
    <>
      {homePage ? (
        <div className="file-section">
          <div className="heading">Redact: Your Data Protector</div>

          {animation && <MyLottieAnimation handleAnimation={setAnimation} socket={socket} />}
          <div className="input">
            <div className="icons">
              <i className="bi bi-filetype-pdf"></i>
              <i className="bi bi-arrow-right-short"></i>
              <i className="bi bi-file-earmark-lock"></i>
            </div>
            <input
              type="file"
              id="file-input"
              className="file-input"
              onChange={handleFileChoose}
            />
            <label htmlFor="file-input" className="file-input-label">
              CHOOSE FILES
            </label>
            <span className="file-name">
              {fileName}{" "}
              {isFileChosen && (
                <span onClick={handleFileRemove}>
                  <i className="bi bi-x-circle"></i>
                </span>
              )}
            </span>
            <button
              className="button"
              style={{ visibility: isFileChosen ? "visible" : "hidden" }}
              onClick={handleConvert}
            >
              CONVERT
            </button>
          </div>
          <div className="scale">
            <button
              className={`button ${isFileChosen && selectedScale === "high" ? "selected" : ""
                }`}
              onClick={() => handleScaleChange("high")}
              disabled={animation}
            >
              HIGH
            </button>
            <button
              className={`button ${isFileChosen && selectedScale === "med" ? "selected" : ""
                }`}
              onClick={() => handleScaleChange("med")}
              disabled={animation}
            >
              MEDIUM
            </button>
            <button
              className={`button ${isFileChosen && selectedScale === "low" ? "selected" : ""
                }`}
              onClick={() => handleScaleChange("low")}
              disabled={animation}
            >
              LOW
            </button>
          </div>
        </div>
      ) : (
        <>
          <Review Data={Data} setHomePage={setHomePage} />
        </>
      )}
    </>
  );
}

export default Files;
