import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Text.css";
import useCtrlS from "../hooks/useCtrlS";

const Text = () => {
    const [inputText, setInputText] = useState("");
    const [isChanged, setIsChanged] = useState(false);
    const [popupValue, setPopupValue] = useState("");
    let timeoutId = useRef(null);

    const CONTENT_SAVED = "Content saved";
    const CONTENT_COPIED = "Content copied";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://intractle.onrender.com/text");
                setInputText(response.data.content);
            } catch (error) {
                console.error("Error fetching content:", error);
            }
        };

        fetchData();
    }, []);

    // Handle text area changes and send data to backend
    const onChangeHandler = (e) => {
        setInputText(e.target.value);
        setIsChanged(true);
    };

    const saveText = async () => {
        try {
            const response = await axios.put("https://intractle.onrender.com/text", {
                content: inputText,
            });

            if (response.status === 200) {
                setIsChanged(false);
                showPopup(CONTENT_SAVED);
            }
        } catch (error) {
            console.error("Error sending data to backend:", error);
        }
    };

    useCtrlS(saveText);

    const showPopup = (message) => {
        setPopupValue(message);
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        timeoutId.current = setTimeout(() => {
            setPopupValue("");
        }, 2000);
    };

    const copyToClipboard = async () => {
        if (inputText) {
            try {
                await navigator.clipboard.writeText(inputText);
                showPopup(CONTENT_COPIED);
            } catch (err) {
                console.error("Failed to copy: ", err);
            }
        } else {
            alert("Nothing to copy!");
        }
    };

    const clearText = () => {
        setInputText("");
        setIsChanged(true);
    };

    return (
        <>
            <div className="fixed-header">
                <div className="buttons">
                    <button onClick={saveText} disabled={!isChanged} className="top-button">
                        Save
                    </button>

                    <button onClick={copyToClipboard} className="top-button">
                        Copy
                    </button>

                    <button onClick={clearText} className="top-button">
                        Clear
                    </button>
                </div>
            </div>

            <textarea
                className="terminal"
                value={inputText}
                onChange={onChangeHandler}
                placeholder="Paste or type here..."
            />

            {popupValue !== "" && <div className="popup">{popupValue}</div>}
        </>
    );
};

export default Text;
