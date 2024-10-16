document.addEventListener('DOMContentLoaded', function () {
  const noteForm = document.getElementById('noteForm');
  const noteTitle = document.getElementById('noteTitle');
  const noteContent = document.getElementById('noteContent');
  const noteTags = document.getElementById('noteTags');
  const noteColor = document.getElementById('noteColor');
  const searchBar = document.getElementById('searchBar');
  const notesContainer = document.getElementById('notesContainer');
  let editNoteId = null;

  function saveNotes(notes) {
      localStorage.setItem('notes', JSON.stringify(notes));
  }

  function getNotes() {
      return JSON.parse(localStorage.getItem('notes')) || [];
  }

  function renderNotes() {
      const notes = getNotes();
      notesContainer.innerHTML = '';
      notes.forEach((note, index) => {
          const noteElement = document.createElement('div');
          noteElement.classList.add('col-md-4');
          noteElement.innerHTML = `
              <div class="note-card ${note.color} p-3 mb-3">
                  <h5 class="note-title">${note.title}</h5>
                  <p class="note-content">${note.content}</p>
                  <p class="note-tags">Tags: ${note.tags}</p>
                  <div class="note-actions">
                      <button class="btn btn-primary btn-sm" onclick="editNote(${index})">Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="deleteNote(${index})">Delete</button>
                  </div>
              </div>
          `;
          notesContainer.appendChild(noteElement);
      });
  }

  noteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const title = noteTitle.value;
      const content = noteContent.value;
      const tags = noteTags.value.split(',').map(tag => tag.trim());
      const color = noteColor.value;

      const notes = getNotes();

      if (editNoteId !== null) {
          notes[editNoteId] = { title, content, tags, color };
          editNoteId = null;
      } else {
          notes.push({ title, content, tags, color });
      }

      saveNotes(notes);
      renderNotes();

      noteForm.reset();
  });

  window.editNote = function (index) {
      const notes = getNotes();
      const note = notes[index];

      noteTitle.value = note.title;
      noteContent.value = note.content;
      noteTags.value = note.tags.join(', ');
      noteColor.value = note.color;

      editNoteId = index;
  };

  window.deleteNote = function (index) {
      const notes = getNotes();
      notes.splice(index, 1);
      saveNotes(notes);
      renderNotes();
  };

  searchBar.addEventListener('input', function () {
      const searchTerm = searchBar.value.toLowerCase();
      const notes = getNotes();
      const filteredNotes = notes.filter(note =>
          note.title.toLowerCase().includes(searchTerm) ||
          note.content.toLowerCase().includes(searchTerm)
      );
      notesContainer.innerHTML = '';
      filteredNotes.forEach((note, index) => {
          const noteElement = document.createElement('div');
          noteElement.classList.add('col-md-4');
          noteElement.innerHTML = `
              <div class="note-card ${note.color} p-3 mb-3">
                  <h5 class="note-title">${note.title}</h5>
                  <p class="note-content">${note.content}</p>
                  <p class="note-tags">Tags: ${note.tags}</p>
                  <div class="note-actions">
                      <button class="btn btn-primary btn-sm" onclick="editNote(${index})">Edit</button>
                      <button class="btn btn-danger btn-sm" onclick="deleteNote(${index})">Delete</button>
                  </div>
              </div>
          `;
          notesContainer.appendChild(noteElement);
      });
  });

  renderNotes();
});
