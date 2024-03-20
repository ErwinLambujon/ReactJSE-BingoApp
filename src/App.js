import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [gameCode, setGameCode] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://www.hyeumine.com/getcard.php?bcode=${gameCode}`
      );
      console.log("API Response:", response.data);
      if (response.data && response.data.card) {
        setCards((prevCards) => [...prevCards, response.data]);
        setLoading(false);
      } else {
        console.log("No card data available for the entered game code.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      setLoading(false);
    }
  };

  const handleJoinGame = () => {
    if (gameCode.trim() !== "") {
      fetchCards();
    } else {
      alert("Please enter a valid game code.");
    }
  };

  const checkWin = async (playcardToken) => {
    try {
      const response = await axios.post(
        `http://www.hyeumine.com/checkwin.php?playcard_token=${playcardToken}`
      );
      return response.data === 1;
    } catch (error) {
      console.error("Error checking win status:", error);
      return false;
    }
  };

  const handleCheckWin = async (playcardToken) => {
    try {
      const isWinner = await checkWin(playcardToken);
      console.log("Is winner:", isWinner);
      if (isWinner) {
        alert("Sana All Daug!");
      } else {
        alert("Malas Man Bawi Next Time!");
      }
    } catch (error) {
      console.error("Error checking win status:", error);
      alert("Error checking win status. Please try again later.");
    }
  };

  return (
    <div className="master">
      <h1>Bingo Game</h1>
      <input
        type="text"
        value={gameCode}
        onChange={(e) => setGameCode(e.target.value)}
        placeholder="Enter Game Code"
      />
      <button onClick={handleJoinGame}>Join Game</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="container">
            {cards.map((card, index) => (
              <div className="card-container" key={index}>
                <div className="card">
                  <h2>Card {index + 1}</h2>
                  {card && card.card ? (
                    <div className="bingo-card">
                      <table>
                        <thead>
                          <tr>
                            <th>B</th>
                            <th>I</th>
                            <th>N</th>
                            <th>G</th>
                            <th>O</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[0, 1, 2, 3, 4].map((rowIndex) => (
                            <tr key={rowIndex}>
                              {["B", "I", "N", "G", "O"].map(
                                (letter, colIndex) => (
                                  <td key={colIndex}>
                                    {card.card[letter] &&
                                      card.card[letter][rowIndex]}
                                  </td>
                                )
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No card data available</p>
                  )}
                </div>
                <button onClick={() => handleCheckWin(card.playcard_token)}>
                  Check Win
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
