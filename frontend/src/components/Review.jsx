import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import Button from "./Button";
import { Link } from "react-router-dom";

export const Review = ({ Data, setHomePage }) => {
  const [Page, setPage] = useState(0);
  const totalPages = Data.length;
  const [unSelected, setUnselected] = useState(
    Array.from({ length: totalPages }, () => [])
  );
  const [buttonText, setButtonText] = useState("Cancel");

  const handlePageClick = (selected) => {
    setPage(selected.selected);
  };

  const handleCancel = () => {
    setHomePage(true);
  };

  const handleWordSelect = (index) => {
    setUnselected((prev) => {
      const update = [...prev];
      if (update[Page].includes(index)) {
        update[Page] = update[Page].filter((_) => _ !== index);
      } else {
        update[Page] = [...update[Page], index];
      }

      return update;
    });
  };

  const handleSubmit = async () => {
    const pagesData = [];
    for (let index = 0; index < Data.length; index++) {
      const element = Data[index];
      const text = element[0];
      let attributes = element[1];
      attributes = attributes.sort((a, b) => a[0] - b[0]);
      attributes = attributes.filter((_, i) => !unSelected[index].includes(i));

      pagesData.push([text, attributes]);
    }
    const jsonData = JSON.stringify(pagesData);
    const formData = new FormData();
    formData.append("pages", jsonData);
    try {
      const response = await fetch("/v2/redact", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        // Extract filename from the Content-Disposition header
        const contentDisposition = response.headers.get("Content-Disposition");
        const filename = contentDisposition
          ? contentDisposition.split("filename=")[1].replace(/"/g, "")
          : "default-filename.pdf";

        // Extract the file blob
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Create a link element and click it to download the file
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();

        // Clean up
        URL.revokeObjectURL(url);

        // Update button text to "Home"
        setButtonText("Home");
      } else {
        console.error("Download failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="review">
      <div className="text-container">
        {(() => {
          const dataText = Data[Page][0];
          let elements = Data[Page][1];
          let result = [];
          let currentIndex = 0;
          elements = elements.sort((a, b) => b[0] - a[0]);

          elements.reverse().forEach((element, index) => {
            // Get text before the current element (button insertion point)
            const prevText = dataText.slice(currentIndex, element[0]);
            result.push(<span key={`text-${index}`}>{prevText}</span>);

            // Add the button at the right place with the correct text from element[3]
            result.push(
              <button
                key={`button-${index}`}
                id={unSelected[Page].includes(index) && "unselected"}
                onClick={() => handleWordSelect(index)}
              >
                {element[2]}
              </button>
            );

            // Update currentIndex to the end of the button's position
            currentIndex = element[1];
          });

          // Add the remaining text after the last button
          result.push(
            <span key="last-text">{dataText.slice(currentIndex)}</span>
          );
          return result;
        })()}
      </div>

      <ReactPaginate
        previousLabel={"Prev"}
        nextLabel={"Next"}
        breakLabel="..."
        pageCount={totalPages}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
        disabledClassName={"disabled"}
      />

      <div className="buttonFeature">
        <button onClick={handleSubmit} className="button">Redact</button>
        {buttonText === "Home" ? (
          <Button content="Home" to={"/"}/>
        ) : (
          <button className="button" onClick={handleCancel}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};
