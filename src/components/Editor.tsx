import {
  createEffect,
  createSignal,
  createResource,
  onCleanup,
  untrack,
} from "solid-js"
import { EditorState } from "@codemirror/state"
import { EditorView, keymap, ViewUpdate } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"

import { makePersisted } from "@solid-primitives/storage"
import { useFile } from "./FileSystem/FileSystem"

export const Editor = (props: { name: string }) => {
  const [parent, setParent] = createSignal<HTMLDivElement>()
  const [file, setFile] = useFile(props.name)

  const startState = EditorState.create({
    doc: untrack(() => file()),
    extensions: [
      keymap.of(defaultKeymap),
      EditorView.updateListener.of((v: ViewUpdate) => {
        if (v.docChanged) {
          setFile(v.state.doc.toString())
        }
      }),
    ],
  })

  createEffect(() => {
    const view = new EditorView({
      state: startState,
      parent: parent(),
    })
    onCleanup(() => {
      view.destroy()
    })
  })

  return (
    <div>
      <div ref={setParent} />
    </div>
  )
}
