import { Form } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

export default function TextEditor() {
    const [value, setValue] = useState('');
    const childRef = useRef(null);

    const modules = {
        toolbar: [
          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
          [{size: []}],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, 
           {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image', 'video'],
          ['clean']                                         
        ],
        clipboard: {
          // Hãy giữ các định dạng khi dán từ bên ngoài
          matchVisual: false,
        }
    };
      
    const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
    ];  
  
    return (
      <Form.Item
        name={'content'}
        className='m-0'
        rules={[
          {
            required: true, message: 'Trường này là bắt buộc'
          }
        ]}
        >
        
        <ReactQuill
          ref={childRef}
          value={value}
          modules={modules}
          formats={formats}
          theme="snow" // hoặc 'bubble'
          className='h-[200px]'
        />
      </Form.Item>

    );

    
}
