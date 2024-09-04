/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {$createLinkNode} from '@lexical/link';
import {$createListItemNode, $createListNode} from '@lexical/list';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {$createHeadingNode, $createQuoteNode} from '@lexical/rich-text';
import {$createParagraphNode, $createTextNode, $getRoot, EditorState, LexicalEditor as editor} from 'lexical';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';
import * as React from 'react';
import './index.css';

import {useSettings} from './context/SettingsContext';
import {SharedAutocompleteContext} from './context/SharedAutocompleteContext';
import {SharedHistoryContext} from './context/SharedHistoryContext';
import Editor from './Editor';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import {TableContext} from './plugins/TablePlugin';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { FormInstance } from 'antd/lib/form';

console.warn(
  'If you are profiling the playground app, please ensure you turn off the debug view. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.',
);

export default function LexicalEditor({form, defaultValue}: {form: FormInstance, defaultValue?: string}): JSX.Element {
  const initialConfig = {
    editorState: null,
    namespace: 'Playground',
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };
  
  
  const onChange = (editorState: EditorState, editor: editor) => {
    editor.update(()=>{
      const html = $generateHtmlFromNodes(editor, null);
      const root = $getRoot();
      const textContent = root.getTextContent();
      
      if(textContent.length >= 1){
        form.setFieldsValue({content: html})
      }else{
        form.setFieldsValue({content: ''})
      }
    })
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <TableContext>
          <SharedAutocompleteContext>
            <div className="editor-shell">
              <Editor defaultValue={defaultValue}/>
              <OnChangePlugin onChange={onChange}/>
            </div>
          </SharedAutocompleteContext>
        </TableContext>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}