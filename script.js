// Modal logic for delete confirmation
let noteIdToDelete = null;

function openDeleteModal(id) {
  noteIdToDelete = id;
  document.getElementById('deleteModal').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  // ...existing code...

  // Delete modal buttons
  const cancelDeleteBtn = document.getElementById('cancelDelete');
  const confirmDeleteBtn = document.getElementById('confirmDelete');
  const deleteModal = document.getElementById('deleteModal');

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
      deleteModal.classList.add('hidden');
      noteIdToDelete = null;
    });
  }
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (noteIdToDelete !== null) {
        removeNoteItem(noteIdToDelete);
        deleteModal.classList.add('hidden');
        noteIdToDelete = null;
      }
    });
  }
});
const noteData = [
  {
    id: 1,
    title: "First Note",
    content: "This is the content of the first note.",
    category: "Work",
    isPinned: false,
  },
  {
    id: 2,
    title: "Task List",
    content: "Code, Read, Play video games",
    category: "Personal",
    isPinned: true,
  },
  {
    id: 3,
    title: "My Ideas",
    content: "This is the content of the note.",
    category: "Ideas",
    isPinned: false,
  },
];

const noteForm = document.getElementById('note-form');

function renderNotes(notes) {
  const sortedNotes = [...notes].sort((a, b) => b.isPinned - a.isPinned);
  // Map categories to colors
  const categoryColors = {
    Work: "bg-yellow-200",
    Personal: "bg-blue-200",
    Ideas: "bg-green-200",
    default: "bg-gray-200"
  };

  const notesInnerContainer = document.getElementById('notesInnerContainer');
  if (notesInnerContainer) {
    notesInnerContainer.innerHTML = `${sortedNotes
      .map((note) => {
        const colorClass = categoryColors[note.category] || categoryColors.default;
        return `
          <div class="${colorClass} flex-shrink-0 rounded-lg shadow relative w-[180px] h-[150px] p-4">
            <button onclick="togglePin(${note.id})" title="${note.isPinned ? "Unpin" : "Pin"}"
              class="absolute top-2 left-2 text-yellow-500 text-xl hover:scale-110 transition-transform">
              ${note.isPinned ? "📌" : "📍"}
            </button>
            <h3 class="font-bold text-lg mb-1 text-center truncate">${note.title}</h3>
            <p class="text-sm text-gray-700 mb-2 overflow-hidden line-clamp-3">${note.content}</p>
            <p class="text-xs text-gray-500 italic mb-2">${note.category || "No Category"}</p>
            <div class="absolute bottom-3 right-3 flex gap-3">
              <button onclick="editNotes(${note.id})" class="text-blue-600 hover:underline text-xs">Edit</button>
              <button onclick="openDeleteModal(${note.id})" class="text-red-600 hover:underline text-xs">Delete</button>
            </div>
          </div>
        `;
      })
      .join("")}`;
  }
}

function filterNotesByCategory(category) {
  if (!category) {
    renderNotes(noteData);
  } else {
    const filtered = noteData.filter(note => note.category === category);
    renderNotes(filtered);
  }
}






function saveNote(e) {
  e.preventDefault();

  const title = document.getElementById('noteTitle').value;
  const content = document.getElementById('noteContent').value;
  const category = document.querySelector('#note-category').value;

  const editingId = noteForm.dataset.editingId;

  if (editingId) {
    // Update existing note
    const note = noteData.find(n => n.id === parseInt(editingId));
    if (note) {
      note.title = title;
      note.content = content;
      note.category = category;
    }
    delete noteForm.dataset.editingId; // Clear edit mode
  } else {
    // Add new note
    const newNote = {
      id: noteData.length ? Math.max(...noteData.map(n => n.id)) + 1 : 1,
      title,
      content,
      category,
      isPinned: false
    };
    noteData.push(newNote);
  }

  renderNotes(noteData);
  localStorage.setItem('noteList', JSON.stringify(noteData));
  noteForm.reset();
}


document.addEventListener('DOMContentLoaded', () => {
  // Load notes from localStorage first
  const savedNote = localStorage.getItem('noteList');
  if (savedNote) {
    const parsedNotes = JSON.parse(savedNote);
    noteData.length = 0;
    parsedNotes.forEach(item => {
      noteData.push(item);
    });
  }
  renderNotes(noteData);
  noteForm.addEventListener('submit', saveNote);

  // Category filter event
  const categoryFilter = document.getElementById('categoryFilter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterNotesByCategory);
  }

  // Scroll to Add Note form when Add new button is clicked
  const addNoteBtn = document.getElementById('addNoteBtn');
  if (addNoteBtn) {
    addNoteBtn.addEventListener('click', () => {
      const formSection = document.getElementById('note-form');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('noteTitle').focus();
      }
    });
  }
});


let noteToDelete = null;

// Your existing delete function (unchanged)
function removeNoteItem(id) {
  const index = noteData.findIndex(note => note.id === id);
  if (index !== -1) {
    noteData.splice(index, 1);
    renderNotes(noteData);
    localStorage.setItem('noteList', JSON.stringify(noteData));
  }
}

// Show modal before deletion
function openDeleteModal(id) {
let noteToDelete = null;

function openDeleteModal(id) {
  noteToDelete = id;
  document.getElementById("deleteModal").classList.remove("hidden");
}

document.addEventListener('DOMContentLoaded', () => {
  // ...existing code...

  // Delete modal buttons
  const cancelDeleteBtn = document.getElementById("cancelDelete");
  const confirmDeleteBtn = document.getElementById("confirmDelete");
  const deleteModal = document.getElementById("deleteModal");

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", () => {
      noteToDelete = null;
      deleteModal.classList.add("hidden");
    });
  }
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", () => {
      if (noteToDelete !== null) {
        removeNoteItem(noteToDelete);
      }
      deleteModal.classList.add("hidden");
      noteToDelete = null;
    });
  }
});
  noteForm.dataset.editingId = id;

  // Scroll to the form for convenience
  noteForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
}





function togglePin(id) {
  const note = noteData.find(n => n.id === id);
  if (note) {
    note.isPinned = !note.isPinned; // Toggle the pin status
    renderNotes(noteData); // Re-render the notes to reflect the change
    localStorage.setItem('noteList', JSON.stringify(noteData)); // Save updated notes to localStorage
  }
  else {
    console.error(`Note with id ${id} not found.`);
  }

}

function searchNotes() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const searchedNotes = noteData.filter(note =>
    note.title.toLowerCase().includes(searchInput) ||
    note.content.toLowerCase().includes(searchInput)
  );
renderNotes(searchedNotes);
}

