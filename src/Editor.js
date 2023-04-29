import React, { useState, useEffect } from 'react';
import { Editor, EditorState, ContentState, convertFromRaw, convertToRaw, CharacterMetadata, Modifier, RichUtils } from 'draft-js';
import './Editor.css'

const EditorComponent = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    //custom style for redline as draft.js does not provide any for this.
    const styleMap = {
        'REDLINE': {
          color: 'red',
        },
      };
  
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
        
        // Get the current line of text
        const contentState = newEditorState.getCurrentContent();
        const selectionState = newEditorState.getSelection();
        const currentBlockKey = selectionState.getStartKey();
        const currentBlock = contentState.getBlockForKey(currentBlockKey);
        const currentText = currentBlock.getText();
        // console.log(currentText);
      
        // Check for heading format
        if (currentText.startsWith('# ')) {
          const headingText = currentText.substring(2);
          const updatedBlock = currentBlock.merge({
            text: headingText,
            type: 'header-one'
          });
          const newContentState = contentState.merge({
            blockMap: contentState.getBlockMap().set(currentBlockKey, updatedBlock)
          });
          const newEditorStateWithHeading = EditorState.push(newEditorState, newContentState, 'change-block-data');
          setEditorState(newEditorStateWithHeading);
        }

        //check for bold formatting
        else if (currentText.startsWith('* ')) {
            // remove the '*' from the sentence, this is not working properly due to some issue
            const newText = currentText.substring(2);
  
            // create a new content block with the updated text and apply bold style
            const newContentState = Modifier.replaceText(
              editorState.getCurrentContent(),
              editorState.getSelection(),
              newText,
              editorState.getCurrentInlineStyle().merge(['BOLD']),
            );
  
            // update editor state
            setEditorState(EditorState.push(editorState, newContentState, 'apply-entity'));
          }

          //check for redline formatting
          else if (currentText.startsWith('** ')) {
            // remove the '**' from the sentence, this is not working properly due to some issue
            const newText = currentText.substring(3);
  
            // create a new content block with the updated text and apply red line style
            const newContentState = Modifier.replaceText(
              editorState.getCurrentContent(),
              editorState.getSelection(),
              newText,
              editorState.getCurrentInlineStyle().merge(['REDLINE']),
            );
  
            // update editor state
            setEditorState(EditorState.push(editorState, newContentState, 'apply-entity'));
          }

          //check for underline formatting
          else if (currentText.startsWith('*** ')) {
            // remove the '***' from the sentence
            const newText = currentText.substring(4);
  
            // create a new content block with the updated text and apply underline style
            const newContentState = Modifier.replaceText(
              editorState.getCurrentContent(),
              editorState.getSelection(),
              newText,
              editorState.getCurrentInlineStyle().merge(['UNDERLINE']),
            );
  
            // update editor state
            setEditorState(EditorState.push(editorState, newContentState, 'apply-entity'));
          }
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
            <Editor editorState={editorState} onChange={handleEditorChange} customStyleMap={styleMap}/>
        </div>
      </div>
    );
  };
  
  export default EditorComponent;
  