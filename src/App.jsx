
import { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Heart,
  Pencil,
  Search,
  CalendarDays,
  Plus,
  Save,
  X,
  Sun,
  Moon,
  List,
} from "lucide-react";

import "./App.css";

const noteColors = [
  "#F8E1E7",
  "#E0F0E7",
  "#EAE3F5",
  "#DFECF7",
  "#FFF1C9",
];

function App() {
  const titleInputRef = useRef(null);

  const [darkMode, setDarkMode] = useState(false);

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

  useEffect(() => {
    localStorage.setItem("myNotes", JSON.stringify(notes));
  }, [notes]);

  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setContent("");
  };

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
        color: noteColors[notes.length % noteColors.length],
      };

      setNotes((prevNotes) => [...prevNotes, newNote]);
    }

    cancelEdit();
    titleInputRef.current?.focus();
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note.id);
    titleInputRef.current?.focus();
  };

  const toggleFavorite = (id) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? { ...note, isFavorite: !note.isFavorite }
          : note
      )
    );
  };

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

  const filteredNotes = notes.filter((note) => {
    const searchText = search.toLowerCase().trim();

    return (
      note.title.toLowerCase().includes(searchText) ||
      note.content.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className={darkMode ? "app dark-mode" : "app"}>

      {/* Header */}
      <header className="header">

      <div className="header-title">
  <div>
    <h1>My Notes</h1>
    <p>Your thoughts, beautifully organized.</p>
  </div>
</div>

        {/* Dark / Light Mode */}
        <button
          type="button"
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Light Mode" : "Dark Mode"}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Moon size={22} />
          ) : (
            <Sun size={22} />
          )}
        </button>

      </header>

      <main className="container">

        {/* Create or Edit Note */}
        <section className="note-form">

          <h2>
            <Plus size={25} strokeWidth={2.5} />
            {editId !== null ? "Edit Note" : "Create a New Note"}
          </h2>

          <input
            ref={titleInputRef}
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Save and Cancel */}
          <div className="form-buttons">

            <button
              type="button"
              className="save-btn"
              onClick={addNote}
            >
              <Save size={19} />
              {editId !== null ? "Update Note" : "Save Note"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={cancelEdit}
            >
              <X size={19} />
              Cancel
            </button>

          </div>
        </section>

        {/* Notes Section */}
        <section className="notes-section">

          <h2 className="notes-heading">
            <List size={27} strokeWidth={2.3} />
            My Notes ({notes.length})
          </h2>

          {/* Search Box */}
          <div className="search-wrapper">
            <Search size={19} className="search-icon" />

            <input
              type="text"
              className="search-input"
              placeholder="Search your notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Notes Grid */}
          <div className="notes-grid">

            {filteredNotes.map((note, index) => (

              <article
                className="note-card"
                key={note.id}
                style={{
                  backgroundColor:
                    note.color ||
                    noteColors[index % noteColors.length],
                }}
              >

                {/* Note Actions */}
                <div className="note-actions">

                  <button
                    type="button"
                    className="favorite-btn"
                    onClick={() => toggleFavorite(note.id)}
                    title={
                      note.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                    aria-label="Toggle favorite"
                  >
                    <Heart
                      size={21}
                      strokeWidth={1.8}
                      fill={note.isFavorite ? "currentColor" : "none"}
                    />
                  </button>

                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => editNote(note)}
                    title="Edit Note"
                    aria-label="Edit Note"
                  >
                    <Pencil size={20} strokeWidth={2} />
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteNote(note.id)}
                    title="Delete Note"
                    aria-label="Delete Note"
                  >
                    <Trash2 size={20} strokeWidth={1.8} />
                  </button>

                </div>

                <h3>{note.title}</h3>

                <p>{note.content}</p>

                {/* Created Date */}
                <small className="note-date">
                  <CalendarDays size={17} />
                  Created:{" "}
                  {note.createdAt
                    ? new Date(note.createdAt).toLocaleString()
                    : "Date not available"}
                </small>

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
