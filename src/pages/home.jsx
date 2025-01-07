import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note"
import "../styles/Home.css"

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [show, setShow] = useState(false);
    const [showcreate, setShowcreate] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sorting, setSorting] = useState("latest")

    useEffect(() => {
        getNotes();
    }, [sorting]);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                if (sorting == "latest"){
                    const sortedNotes = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    setNotes(sortedNotes);
                    console.log(data);
                }
                else{
                    setNotes(data);
                    console.log(data)
                }
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                else alert("Failed to delete note.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", { content, title })
            .then((res) => {
                if (res.status === 201) alert("Note created!");
                else alert("Failed to make note.");
                setShowcreate(false)
                setContent("");
                setTitle("");
                getNotes();
            })
            .catch((err) => alert(err));
    };

    const editNote = (id, e) => {
        e.preventDefault();
        api
            .put(`/api/notes/update/${id}/`, { content, title })
            .then((res) => {
                if (res.status === 200){
                alert("Note updated!");
                setTitle('');
                setContent("");
                setShow(false);
                setEditingNote(null)
                }    
                else alert("Failed to edit note.");
                getNotes();
            })
            .catch((err) => alert(err));
    };

    const handleEditClick = (note) => {
        setTitle(note.title);
        setContent(note.content);
        setEditingNote(note);
        setShow(true);
      };

    const filteredNotes = notes.filter((note) => {
        return (
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <div>

            <div className="form-create" style={{...(show && {filter: "blur(10px)"} ), ...(showcreate && {filter: "blur(10px)"} )}} >
                <div className="nav">
                    <a onClick={()=>setShowcreate(true)}>create note</a>
                    <input type="text" placeholder="search notes" onChange={(e) => setSearchQuery(e.target.value)}/>
                    <a className="logout-btn" href="#/logout">logout</a>

                    <select onChange={(e) =>setSorting(e.target.value)}>
                        
                        <option value="latest">latest</option>
                        <option value="earliest">earliest</option>
                        
                    </select>
                </div>
                <div>
                    <h2>Notes</h2>

                    {filteredNotes === null ? (
                        <p>no notes yet</p>
                    ) : (
                        filteredNotes.map((note) => (
                            <Note note={note} onDelete={deleteNote} key={note.id} onEdit={handleEditClick} />
                        ))
                    )}
                </div>

            </div>

            {showcreate && 
                
                <div className="create">
                    <form onSubmit={createNote} id="create">
                        <label htmlFor="title">Title:</label>
                        <br />
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                        <label htmlFor="content">Content:</label>
                        <br />
                        <textarea
                            id="content"
                            name="content"
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>
                        <br />
                        <div className="btns">
                        <button onClick={()=>{setShowcreate(false)}}>cancel</button>
                        <input type="submit" value="Submit"></input>
                        </div>

                    </form>

                </div>
                }

            {show && 
            
            <div className="edit-form">

                <form onSubmit={(e) => editNote(editingNote.id, e)}>
                    <label htmlFor="title">Title:</label>
                    <br />
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                    <label htmlFor="content">Content:</label>
                    <br />
                    <textarea
                        id="content"
                        name="content"
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <br />
                    <div className="btns">
                    <button onClick={()=> setShow(false) }>cancel</button>
                    <input type="submit" value="Submit"></input>
                    </div>
                </form>
            </div>
            }
        </div>
    );
}

export default Home;
