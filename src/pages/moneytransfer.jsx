import React, { useState, useEffect } from "react";

const MoneyTransfer = () => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);

  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [rows, setRows] = useState([{ amount1: "", amount2: "" }]);
  const [noteTitle, setNoteTitle] = useState("");

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("all-notes2")) || [];
    // Ensure it's an array
    setNotes(Array.isArray(savedNotes) ? savedNotes : []);
    if (Array.isArray(savedNotes) && savedNotes.length > 0) {
      loadNote(savedNotes[0].id);
    }
  }, []);

  // Generate unique ID
  const generateId = () => Date.now().toString();

  // Load a note by ID
  const loadNote = (id) => {
    const note = Array.isArray(notes) ? notes.find((n) => n.id === id) : null;
    if (note) {
      setActiveNoteId(note.id);
      setNoteTitle(note.title || "");
      setName1(note.name1 || "");
      setName2(note.name2 || "");
      setRows(
        note.rows && note.rows.length > 0
          ? note.rows
          : [{ amount1: "", amount2: "" }]
      );
    }
  };

  // Handle amount change
  const handleAmountChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  // Add new row
  const addRow = () => {
    setRows([...rows, { amount1: "", amount2: "" }]);
  };

  // Save note
  const handleSave = () => {
    if (!noteTitle || !name1 || !name2) {
      alert("Please enter note title and both person names before saving.");
      return;
    }
    const validRows = rows.filter(
      (r) => r.amount1.trim() !== "" || r.amount2.trim() !== ""
    );
    const newNote = {
      id: activeNoteId || generateId(),
      title: noteTitle,
      name1,
      name2,
      rows: validRows,
    };
    const otherNotes = notes.filter((n) => n.id !== newNote.id);
    const updatedNotes = [...otherNotes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem("all-notes2", JSON.stringify(updatedNotes));
    setActiveNoteId(newNote.id);
    alert("Note saved successfully!");
  };

  // Clear note
  const handleClear = () => {
    setName1("");
    setName2("");
    setRows([{ amount1: "", amount2: "" }]);
    setNoteTitle("");
  };

  // Add new empty note
  const addNewNote = () => {
    handleClear();
    setActiveNoteId(null);
  };

  // Totals
  const total1 = rows
    .map((r) => parseFloat(r.amount1) || 0)
    .reduce((a, b) => a + b, 0);
  const total2 = rows
    .map((r) => parseFloat(r.amount2) || 0)
    .reduce((a, b) => a + b, 0);
  const net = total1 - total2;

  return (
    <div className="max-w-xl text-[#374151] mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-2xl text-[#34D399] font-semibold mb-6 text-center">
        Money Transfer
      </h2>

      {/* Note Selector */}
      <div className="flex gap-2 mb-4">
        {notes?.map((n) => (
          <button
            key={n.id}
            onClick={() => loadNote(n.id)}
            className={`px-3 py-1 rounded ${
              n.id === activeNoteId ? "bg-[#34D399] text-white" : "bg-gray-200"
            }`}
          >
            {n.title || "Untitled"}
          </button>
        ))}
        <button
          onClick={addNewNote}
          className="px-3 py-1 rounded bg-[#34D399] text-white"
        >
          + New Note
        </button>
      </div>

      {/* Note Title */}
      <input
        type="text"
        placeholder="Note Title"
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
        className="px-2 py-1 border font-semibold  text-[#374151] rounded w-full mb-4 text-center"
      />

      {/* Names */}
      <div className="grid grid-cols-2 font-semibold gap-4 mb-4">
        <input
          type="text"
          placeholder="Person 1 Name"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          className="px-2 py-1 border rounded text-center"
        />
        <input
          type="text"
          placeholder="Person 2 Name"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          className="px-2 py-1 border rounded text-center"
        />
      </div>

      {/* Amount rows */}
      {rows.map((row, idx) => (
        <div key={idx} className="grid grid-cols-2 gap-4 mb-2">
          <input
            type="number"
            placeholder={`Amount ${name1 || "Person 1"}`}
            value={row.amount1}
            onChange={(e) => handleAmountChange(idx, "amount1", e.target.value)}
            className="px-2 py-1 border rounded text-center"
          />
          <input
            type="number"
            placeholder={`Amount ${name2 || "Person 2"}`}
            value={row.amount2}
            onChange={(e) => handleAmountChange(idx, "amount2", e.target.value)}
            className="px-2 py-1 border rounded text-center"
          />
        </div>
      ))}

      {/* Add row button */}
      <div className="text-left mb-4">
        <button
          onClick={addRow}
          className="bg-[#34D399] text-white px-4 py-2 rounded"
        >
          ➕
        </button>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4 mb-4 font-semibold text-center">
        <div>
          {name1 || "Person 1"} : ₹ {total1}
        </div>
        <div>
          {name2 || "Person 2"} : ₹ {total2}
        </div>
      </div>

      <div className="text-center font-semibold mb-4">balance : ₹ {net}</div>

      {/* Save & Clear */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleSave}
          className="bg-[#34D399] text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={handleClear}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default MoneyTransfer;
