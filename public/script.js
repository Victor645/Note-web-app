// Note data
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
            <button onclick="togglePin(${note.id})" title="${note.isPinned ? 'Unpin' : 'Pin'}"
              class="absolute top-2 left-2 text-yellow-500 text-xl hover:scale-110 transition-transform">
              ${note.isPinned ? '📌' : '📍'}
            </button>
            <h3 class="font-bold text-lg mb-1 text-center truncate">${note.title}</h3>
            <p class="text-sm text-gray-700 mb-2 overflow-hidden line-clamp-3">${note.content}</p>
            <p class="text-xs text-gray-500 italic mb-2">${note.category || 'No Category'}</p>
            <div class="absolute bottom-3 right-3 flex gap-3">
              <button onclick="editNote(${note.id})" class="text-blue-600 hover:underline text-xs">Edit</button>
              <button onclick="showDeleteModal(${note.id})" class="text-red-600 hover:underline text-xs">Delete</button>
            </div>
          </div>
        `;
      })
      .join("")}`;
  }
}

function saveNote(e) {
  e.preventDefault();
  const newNote = {
    id: noteData.length + 1,
    title: document.getElementById('noteTitle').value,
    content: document.getElementById('noteContent').value,
    category: document.querySelector('#note-category').value,
    isPinned: false,
  };
  noteData.push(newNote);
  renderNotes(noteData);
  localStorage.setItem('noteList', JSON.stringify(noteData));
  noteForm.reset();
}

function removeNoteItem(id) {
  const index = noteData.findIndex(note => note.id === id);
  if (index !== -1) {
    noteData.splice(index, 1);
    renderNotes(noteData);
    localStorage.setItem('noteList', JSON.stringify(noteData));
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

function filterNotesByCategory(category) {
  if (!category) {
    renderNotes(noteData);
  } else {
    const filtered = noteData.filter(note => note.category === category);
    renderNotes(filtered);
  }
}

// Modal logic for delete confirmation
let noteIdToDelete = null;

function showDeleteModal(id) {
  noteIdToDelete = id;
  document.getElementById('deleteModal').classList.remove('hidden');
}

document.getElementById('cancelDelete').addEventListener('click', function() {
  document.getElementById('deleteModal').classList.add('hidden');
  noteIdToDelete = null;
});

document.getElementById('confirmDelete').addEventListener('click', function() {
  if (noteIdToDelete !== null) {
    removeNoteItem(noteIdToDelete);
    document.getElementById('deleteModal').classList.add('hidden');
    noteIdToDelete = null;
  }
});

// Pin/unpin logic (optional, stub)
function togglePin(id) {
  const note = noteData.find(n => n.id === id);
  if (note) {
    note.isPinned = !note.isPinned;
    renderNotes(noteData);
    localStorage.setItem('noteList', JSON.stringify(noteData));
  }
}

// Edit logic (optional, stub)
function editNote(id) {
  // Implement edit logic here
  alert('Edit feature coming soon!');
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
