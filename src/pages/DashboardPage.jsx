import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteNote, getMyNotes, searchNotes } from "../services/notesService";
import NoteCard from "../components/notes/NoteCard";
import CreateNote from "./CreateNote";

const DashboardPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const fetchNotes = async () => {
    try {
      const data = await getMyNotes();
      setNotes(data.notes || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load notes.");
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
      setError("Failed to delete note.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchNotes();
      return;
    }

    try {
      const data = await searchNotes(searchQuery);
      setNotes(data.notes || []);
    } catch (err) {
      console.error("Failed to search notes:", err);
      setError("Failed to search notes.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loadingNotes)
    return (
      <div className="text-center mt-10 text-xl">Loading user notes...</div>
    );
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 ">
      <h1 className="text-4xl font-bold mb-8">
        Welcome, {user?.fullName || "User"} 👋
      </h1>

      {/* Search Bar */}

      <form
        onSubmit={handleSearch}
        className="mb-10 flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes by title, content, or tags"
          className="flex-1 border border-gray-300 px-4 py-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
        >
          Search
        </button>
      </form>

      {/* Button to Open Modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-6 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300 shadow-md"
      >
        ➕ Create Note
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative transition-transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
            >
              ✖
            </button>
            <CreateNote
              onNoteAdded={() => {
                fetchNotes();
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {Array.isArray(notes) && notes.length === 0 ? (
        <p className="text-gray-600">You have no notes yet. Start writing!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={handleDeleteNote} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
