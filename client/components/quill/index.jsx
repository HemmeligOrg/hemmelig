import { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// https://github.com/zenoamaro/react-quill/issues/836#issuecomment-2440290893
class ReactQuillFixed extends ReactQuill {
    destroyEditor() {
        super.destroyEditor();
        delete this.editor;
    }
}

const Quill = ({ value, onChange, readOnly, defaultValue }) => {
    const quillRef = useRef(null);
    // Define modules based on readOnly state
    const modules = readOnly
        ? {
              toolbar: false, // Disable toolbar in read-only mode
          }
        : {
              toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'code-block'],
                  ['clean'],
              ],
          };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-md overflow-hidden">
            <ReactQuillFixed
                ref={quillRef}
                value={value || ''}
                onChange={onChange}
                readOnly={readOnly}
                placeholder={defaultValue}
                theme={readOnly ? 'bubble' : 'snow'}
                modules={modules}
                className="bg-gray-800 text-gray-100 placeholder-gray-500 [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-base [&_.ql-editor]:font-sans [&_.ql-editor]:leading-relaxed
                [&_.ql-toolbar]:border-gray-700 [&_.ql-toolbar]:bg-gray-900
                [&_.ql-container]:border-gray-700
                [&_.ql-editor_h1]:text-3xl [&_.ql-editor_h1]:font-bold [&_.ql-editor_h1]:mb-4
                [&_.ql-editor_h2]:text-2xl [&_.ql-editor_h2]:font-bold [&_.ql-editor_h2]:mb-3
                [&_.ql-editor_h3]:text-xl [&_.ql-editor_h3]:font-bold [&_.ql-editor_h3]:mb-2
                [&_.ql-editor_p]:mb-4
                [&_.ql-editor_ul]:list-disc [&_.ql-editor_ul]:ml-4
                [&_.ql-editor_ol]:list-decimal [&_.ql-editor_ol]:ml-4
                [&_.ql-snow_.ql-toolbar_button]:text-gray-300
                [&_.ql-snow_.ql-toolbar_button:hover]:text-white
                [&_.ql-snow_.ql-toolbar_button.ql-active]:text-blue-400"
            />
        </div>
    );
};

export default Quill;
