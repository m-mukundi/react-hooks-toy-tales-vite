import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const API = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then(setToys);
  }, []);

  function handleAddToy(newToy) {
    setToys((prev) => [...prev, newToy]);
  }

  function handleLike(id) {
    const toy = toys.find((t) => t.id === id);
    fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: toy.likes + 1 }),
    })
      .then((r) => r.json())
      .then((updated) =>
        setToys((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      );
  }

  function handleDonate(id) {
    fetch(`${API}/${id}`, { method: "DELETE" }).then(() =>
      setToys((prev) => prev.filter((t) => t.id !== id))
    );
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={() => setShowForm((f) => !f)}>Add a Toy</button>
      </div>
      <ToyContainer toys={toys} onLike={handleLike} onDonate={handleDonate} />
    </>
  );
}

export default App;
