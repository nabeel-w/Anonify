/*eslint-disable */
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Button from "./Button";
import { Link } from "react-router-dom";

export const Review = ({ Data, setHomePage }) => {
  const [Page, setPage] = useState(0);
  const [data, setData] = useState(Data);
  const [addEntity, setAddEntity] = useState(false);
  const [selection, setSelection] = useState("");
  const totalPages = Data.length;
  const [unSelected, setUnselected] = useState(
    Array.from({ length: totalPages }, () => [])
  );
  const [buttonText, setButtonText] = useState("Cancel");

  useEffect(() => {

    const handleSelectionChange = () => {
      const selected = window.getSelection().toString().trim();
      if (selected.length <= 2) return;
      setSelection(selected);
      console.log(selection);
      setAddEntity(true);
    };

    // Add the event listener for selection change
    document.addEventListener('selectionchange', handleSelectionChange);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  })

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

  const handleAddNewEntity = () => {
    // Get the selected text and its length
    const selectedText = selection;
    const textLength = selectedText.length;

    if (textLength === 0) {
      console.error("No text selected");
      return; // No selection made
    }

    // Get the text data for the current page
    const dataText = Data[Page][0];

    // Find the start index of the selected text
    const startIndex = dataText.indexOf(selectedText);

    // Validate that the selected text exists in the current data text
    if (startIndex === -1) {
      console.error("Selected text not found in the data.");
      return; // Selected text not found in the data
    }

    // Calculate the end index based on the start index and the length of the selected text
    const endIndex = startIndex + textLength;

    // Prepare the new entity to be added
    const newEntity = [startIndex, endIndex, selectedText];

    // Update the current page's entities array
    setUnselected((prev) => {
      const update = [...prev];
      update[Page] = [...update[Page], newEntity]; // Add new entity to the current page's array
      return update;
    });

    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[Page][1] = [...updatedData[Page][1], newEntity]; // Add new entity to the current page's entity array
      return updatedData; // This will trigger a re-render
    });

    // Clear the selection and reset addEntity flag
    setSelection(""); // Clear the selection
    setAddEntity(false); // Hide the Add Entity button
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

          const filterUniqueEntities = (entities) => {
            return entities.filter((entity, index) => {
              // Find the first occurrence index of the current entity
              const firstIndex = entities.findIndex(e =>
                e[0] === entity[0] && e[1] === entity[1] && e[2] === entity[2]
              );
              // Keep the entity only if its index is the same as the first occurrence
              return firstIndex === index;
            });
          };


          const dataText = data[Page][0];
          let elements = filterUniqueEntities(data[Page][1]);
          let result = [];
          let currentIndex = 0;
          elements = elements.sort((a, b) => b[0] - a[0]);
          console.log(elements);

          elements.reverse().forEach((element, index) => {
            // Get text before the current element (button insertion point)
            const prevText = dataText.slice(currentIndex, element[0]);
            result.push(<span key={`text-${index}`}><p>{prevText}</p></span>);

            // Add the button at the right place with the correct text from element[3]
            result.push(
              <span key={`button-container-${index}`}>
                <button
                  id={unSelected[Page].includes(index) && "unselected"}
                  onClick={() => handleWordSelect(index)}
                >
                  {element[2]}
                </button>
              </span>
            );

            // Update currentIndex to the end of the button's position
            currentIndex = element[1];
          });

          // Add the remaining text after the last button
          result.push(
            <span key="last-text"><p>{dataText.slice(currentIndex)}</p></span>
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
        {addEntity && <button onClick={handleAddNewEntity} className="button">Add Entity</button>}
        {buttonText === "Home" ? (
          <Button content="Home" to={"/"} />
        ) : (
          <button className="button" onClick={handleCancel}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};
