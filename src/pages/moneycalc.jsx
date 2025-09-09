import { useState, useEffect, useMemo } from "react";

function MoneyCalculator() {
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState("");

  // Load all notes on mount
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("all-notes")) || {};
    const noteList = Object.entries(savedNotes).map(([id, data]) => ({
      id,
      name: data.name,
      date: data.date,
    }));

    if (noteList.length === 0) {
      const initialId = "1";
      const today = new Date().toISOString().split("T")[0];
      const defaultNote = {
        [initialId]: { name: "NOTE", date: today, inputs: [] },
      };
      localStorage.setItem("all-notes", JSON.stringify(defaultNote));
      setNotes([{ id: initialId, name: "NOTE", date: today }]);
    } else {
      setNotes(noteList);
    }
  }, []);

  // Add a new note
  const createNewNote = () => {
    const maxId =
      notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
    const newId = (maxId + 1).toString();
    const today = new Date().toISOString().split("T")[0];
    const noteName =
      prompt("Enter name for the new note:", `Note ${newId}`) ||
      `Note ${newId}`;

    // Load existing notes and add new
    const allNotes = JSON.parse(localStorage.getItem("all-notes")) || {};
    allNotes[newId] = { name: noteName, date: today, inputs: [] };
    localStorage.setItem("all-notes", JSON.stringify(allNotes));

    // Update state
    setNotes([...notes, { id: newId, name: noteName, date: today }]);
  };

  // Refresh notes from localStorage
  const refreshNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem("all-notes")) || {};
    const noteList = Object.entries(savedNotes).map(([id, data]) => ({
      id,
      name: data.name,
      date: data.date,
    }));
    setNotes(noteList);
  };

  const filteredNotes = notes.filter((n) =>
    (n.name || "").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen   tracking-widest bg-white  pb-10">
      <h2 className=" text-center text-2xl  font-semibold text-[#34D399]  tracking-widest py-4">
        Billings
      </h2>
      <div className="text-center flex md:block flex-col items-center justify-center mb-6">
        <input
          type="text"
          placeholder="Filter by name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 mr-0 md:mr-4"
        />

        <button
          onClick={createNewNote}
          className="bg-[#34D399]  px-4 my-4 md:my-0 py-2 rounded"
        >
          ➕
        </button>
      </div>

      <div className="space-y-8">
        {filteredNotes.map((note) => (
          <KeepNoteInputs
            key={note.id}
            noteId={note.id}
            noteMeta={{ name: note.name, date: note.date }}
            onSave={refreshNotes}
          />
        ))}

        {filteredNotes.length === 0 && (
          <div className="text-center text-gray-500">
            No notes match your filter.
          </div>
        )}
      </div>
    </div>
  );
}

function KeepNoteInputs({ noteId, noteMeta, onSave }) {
  const [inputs, setInputs] = useState([{ name: "", amount: "" }]);

  // Load saved inputs for this note
  useEffect(() => {
    const allNotes = JSON.parse(localStorage.getItem("all-notes")) || {};
    const savedInputs = allNotes[noteId]?.inputs || [{ name: "", amount: "" }];
    setInputs(
      savedInputs.length > 0 ? savedInputs : [{ name: "", amount: "" }]
    );
  }, [noteId]);

  const handleInputChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const addNewInput = () => {
    setInputs([...inputs, { name: "", amount: "" }]);
  };

  // Save this note
  const handleSave = () => {
    const validInputs = inputs.filter(
      (input) => input.name.trim() !== "" || input.amount.trim() !== ""
    );

    if (validInputs.length > 0) {
      const allNotes = JSON.parse(localStorage.getItem("all-notes")) || {};
      allNotes[noteId] = {
        name: noteMeta.name,
        date: noteMeta.date,
        inputs: validInputs,
      };
      localStorage.setItem("all-notes", JSON.stringify(allNotes));
      onSave();
      alert("Note saved successfully!");
    }
  };

  // Clear this note
  const handleClear = () => {
    const allNotes = JSON.parse(localStorage.getItem("all-notes")) || {};
    delete allNotes[noteId];
    localStorage.setItem("all-notes", JSON.stringify(allNotes));
    setInputs([{ name: "", amount: "" }]);
    onSave();
  };

  // Calculate totals
  const { total, average } = useMemo(() => {
    const amounts = inputs
      .map((input) => parseFloat(input.amount))
      .filter((num) => !isNaN(num));
    const total = amounts.reduce((a, b) => a + b, 0);
    const average =
      amounts.length > 0 ? (total / amounts.length).toFixed(2) : 0;
    return { total, average };
  }, [inputs]);

  return (
    <div className="max-w-2xl  text-[#374151]  !tracking-widest  mx-auto mt-6 p-4     bg-gray-100 shadow rounded">
      <h3 className="text-lg  font-semibold mb-2">
        <div className=" flex justify-between">
          <div> {noteMeta.name} </div>
          <div className=" text-xs">
            {new Date(noteMeta.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </h3>

      {inputs.map((input, idx) => (
        <div key={idx} className="flex w-full gap-4 mb-2">
          <input
            type="text"
            placeholder="Name"
            value={input.name}
            onChange={(e) => handleInputChange(idx, "name", e.target.value)}
            className="flex-grow min-w-0 border px-2 py-1"
          />
          <input
            type="number"
            placeholder="Amount"
            value={input.amount}
            onChange={(e) => handleInputChange(idx, "amount", e.target.value)}
            className="flex-grow min-w-0 border px-2 py-1"
          />
        </div>
      ))}

      <button
        onClick={addNewInput}
        className="bg-[#34D399]  px-3 py-1 rounded mb-4"
      >
        ➕
      </button>

      <div className="mb-4 text-center">
        <strong>Total :</strong> ₹{total} | <strong>Average :</strong> ₹
        {average}
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={handleSave}
          className="bg-[#34D399]  px-4 py-2 rounded"
        >
          Save Note
        </button>

        <button onClick={handleClear} className="bg-red-500  px-4 py-2 rounded">
          Clear Note
        </button>
      </div>
    </div>
  );
}

export default MoneyCalculator;
