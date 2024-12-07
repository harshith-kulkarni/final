import React, { useState } from "react";
import "./text.css";

function Text() {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("auto");

    const languages = [
        { code: "auto", name: "Auto-Detect" },
        { code: "hi", name: "Hindi" },
        { code: "fr", name: "French" },
        { code: "es", name: "Spanish" },
        { code: "zh", name: "Chinese" },
        { code: "de", name: "German" },
        { code: "en", name: "English" },
        { code: "te", name: "Telugu" },
        { code: "ja", name: "Japanese" },
    ];

    const generateImage = async () => {
        const username = localStorage.getItem("username");

        if (textInput && username) {
            const imageData = { prompt: textInput };

            try {
                setLoading(true);

                const response = await fetch("http://localhost:5001/generate-image", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(imageData),
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);
                    setImage(imageUrl);

                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64Image = reader.result.split(",")[1];
                        saveToMongoDB(username, textInput, base64Image);
                    };
                    reader.readAsDataURL(blob);
                } else {
                    const errorData = await response.json();
                    alert("Error from server: " + (errorData.error || "Unknown error"));
                }
            } catch (error) {
                console.error("Error caught:", error);
                alert("Error saving data: " + error.message);
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please enter a description and ensure the username is set!");
        }
    };

    const saveToMongoDB = async (username, prompt, base64Image) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("inputText", prompt);

        const blob = new Blob([Uint8Array.from(atob(base64Image), (c) => c.charCodeAt(0))], { type: "image/png" });
        formData.append("outputImage", blob, "generated-image.png");

        try {
            const response = await fetch("http://localhost:1234/upload-text-and-image", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Data saved successfully to MongoDB!");
            } else {
                const errorData = await response.json();
                alert("Error from server: " + (errorData.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error saving to MongoDB:", error);
            alert("Error saving to MongoDB: " + error.message);
        }
    };

    const startListening = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Speech recognition is not supported in this browser. Use Chrome.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = selectedLanguage;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setLoading(true); // Show loading spinner
            console.log("Listening for speech...");
        };

        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Transcription result (before translation):", transcript);

            const translatedText = await translateToEnglish(transcript, selectedLanguage);
            console.log("Translated Text:", translatedText);

            setTextInput(translatedText); // Update the input field
            setLoading(false); // Stop loading spinner
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            alert("Speech recognition error: " + event.error);
            setLoading(false);
        };

        recognition.onend = () => {
            setIsListening(false);
            setLoading(false);
            console.log("Speech recognition ended.");
        };

        recognition.start();
    };

    const translateToEnglish = async (text, sourceLang) => {
        try {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|en`
            );
            const data = await response.json();

            if (data.responseData) {
                console.log("Translated text:", data.responseData.translatedText);
                return data.responseData.translatedText;
            } else {
                throw new Error("Translation API returned no data");
            }
        } catch (error) {
            console.error("Error translating text:", error);
            alert("Translation error: " + error.message);
            return text; // Fallback to original text
        }
    };

    return (
        <div className="container">
            <h1>From Text to Visuals</h1>
            <p>
                Transform your ideas into vivid visuals by simply providing descriptive
                text, and we'll generate images that capture your vision.
            </p>

            <div className="language-selector">
                <label htmlFor="language">Select Language: </label>
                <select
                    id="language"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                    {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                            {lang.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="input-container">
                <textarea
                    id="textInput"
                    rows="5"
                    placeholder="Enter your description here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                ></textarea>
            </div>

            <div className="button-container">
                <button onClick={generateImage} disabled={loading}>
                    {loading ? "Generating..." : "Generate Image"}
                </button>
                <button onClick={startListening} className="ms-2" disabled={isListening}>
                    {isListening ? "Listening..." : "Use Microphone"}
                </button>
            </div>

            {loading && <div className="spinner"></div>}

            {image && (
                <div id="imageContainer">
                    <img src={image} alt="Generated Visual" />
                </div>
            )}
        </div>
    );
}

export default Text;
