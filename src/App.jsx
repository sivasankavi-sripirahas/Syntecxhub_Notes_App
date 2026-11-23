
import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  // useRef for Title Input
  const titleInputRef = useRef(null);

  // Load saved notes from Local Storage
  const [notes, setNotes] = useState(() => {
    try {
      const savedNotes = localStorage.getItem("myNotes");
      return savedNotes ? JSON.parse(savedNotes) : [];
    } catch (error) {
      console.error("Error loading notes:", error);
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // Save notes in Local Storage
  useEffect(() => {
    localStorage.setItem("myNotes", JSON.stringify(notes));
  }, [notes]);

  // Clear Form
  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setContent("");
  };

  // Add or Update Note
  const addNote = () => {
    if (!title.trim() || !content.trim()) {
      alert("Please enter both title and note!");
      return;
    }

    if (editId !== null) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editId
            ? {
                ...note,
                title: title.trim(),
                content: content.trim(),
              }
            : note
        )
      );
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        isFavorite: false,
      };

      setNotes((prevNotes) => [...prevNotes, newNote]);
    }

    cancelEdit();

    // Focus Title Input after saving
    titleInputRef.current?.focus();
  };

  // Edit Note
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);

    // Focus Title Input after clicking Edit
    titleInputRef.current?.focus();
  };

  // Add or Remove Favorite
  const toggleFavorite = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? { ...note, isFavorite: !note.isFavorite }
          : note
      )
    );
  };

  // Delete Note
  const deleteNote = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    setNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== id)
    );

    if (editId === id) {
      cancelEdit();
    }
  };

  // Search Notes
  const filteredNotes = notes.filter((note) => {
    const searchText = search.toLowerCase().trim();

    return (
      note.title.toLowerCase().includes(searchText) ||
      note.content.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>📑 My Notes</h1>
        <p>Capture your thoughts, anytime.</p>
      </header>

      <main className="container">

        {/* Create or Edit Note */}
        <section className="note-form">

          <h2>
            {editId !== null ? "Edit Note" : "Create a New Note"}
          </h2>

          {/* Note Title */}
          <input
            ref={titleInputRef}
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Note Content */}
          <textarea
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Save and Cancel Buttons */}
          <div className="form-buttons">

            <button
              type="button"
              className="save-btn"
              onClick={addNote}
            >
              {editId !== null ? "Update Note" : "Save Note"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={cancelEdit}
            >
              Cancel
            </button>

          </div>
        </section>

        {/* Notes Section */}
        <section className="notes-section">

          <h2>My Notes ({notes.length})</h2>

          {/* Search Box */}
          <input
            type="text"
            className="search-input"
            placeholder="🔍︎ Search your notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Notes Grid */}
          <div className="notes-grid">

            {filteredNotes.map((note) => (

              <article className="note-card" key={note.id}>

                {/* Note Title */}
                <h3>{note.title}</h3>

                {/* Favorite Button */}
                <button
                  type="button"
                  className="favorite-btn"
                  onClick={() => toggleFavorite(note.id)}
                  title={
                    note.isFavorite
                      ? "Remove from Favorites"
                      : "Add to Favorites"
                  }
                  aria-label={
                    note.isFavorite
                      ? "Remove from Favorites"
                      : "Add to Favorites"
                  }
                >
                  {note.isFavorite ? "❤" : "♡"}
                </button>

                {/* Note Content */}
                <p>{note.content}</p>

                {/* Created Date and Time */}
                <small className="note-date">
                  Created:{" "}
                  {note.createdAt
                    ? new Date(note.createdAt).toLocaleString()
                    : "Date not available"}
                </small>

                {/* Edit and Delete Buttons */}
                <div className="card-buttons">

                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => editNote(note)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>

                </div>

              </article>

            ))}

          </div>

          {/* Empty Messages */}
          {notes.length === 0 && (
            <p className="empty-message">
              No notes yet. Create your first note!
            </p>
          )}

          {notes.length > 0 && filteredNotes.length === 0 && (
            <p className="empty-message">
              No matching notes found.
            </p>
          )}

        </section>

      </main>
    </div>
  );
}

export default App;
