import React, { useState, useEffect } from 'react';
import { Editor, EditorState, ContentState, convertFromRaw, convertToRaw, CharacterMetadata, Modifier, RichUtils } from 'draft-js';
import './Editor.css'

const EditorComponent = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

  
    useEffect(() => {
      // Load the saved content from localStorage on component mount
      const savedContent = localStorage.getItem('editorContent');
      if (savedContent) {
        const contentState = convertFromRaw(JSON.parse(savedContent));
        setEditorState(EditorState.createWithContent(contentState));
      }
    }, []);


    //This is the function where we will put the checks for different formatting of text
    const handleEditorChange = (newEditorState) => {
        setEditorState(newEditorState);
      

      };

      // below is the function which stores the text into localStorage of browser.
    const handleSave = () => {
      const contentState = editorState.getCurrentContent();
      const rawContentState = convertToRaw(contentState);
      localStorage.setItem('editorContent', JSON.stringify(rawContentState));
    };
  
    return (
      <div className='container'>
        <h1 className='title'>Editor using Draft.js with React.js</h1>
        <div className='buttonContainer'>
            <button className='btn' onClick={handleSave}>SAVE</button>
        </div>
        <div className='editor'>
            <Editor editorState={editorState} onChange={handleEditorChange}/>
        </div>
      </div>
    );
  };
  
  export default EditorComponent;
  