import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

export default function Editor({placeholder}){
	const editor = useRef(null);
	const [content, setContent] = useState('');

	// const config = useMemo(
	// 	{
	// 		readonly: false, // all options from https://xdsoft.net/jodit/docs/,
	// 		placeholder: placeholder || 'Start typings...'
	// 	},
	// 	[placeholder]
	// );

	return (
		// <div>Hi</div>
		<JoditEditor
			ref={editor}
			value={content}
			style={{ height: '500px' }}
			name='description'
			tabIndex={2} // tabIndex of textarea
			onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
			onChange={(newContent) => {console.log(newContent)}}
		/>
	);
};