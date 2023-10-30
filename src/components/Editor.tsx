import { createEffect, createSignal, onCleanup, untrack } from "solid-js"
import { EditorState } from "@codemirror/state"
import { EditorView, keymap, ViewUpdate } from "@codemirror/view"
import { defaultKeymap } from "@codemirror/commands"

export const Editor = () => {
  const [parent, setParent] = createSignal<HTMLDivElement>()
  const [doc, setDoc] = createSignal("hello")

  const startState = EditorState.create({
    doc: untrack(() => doc()),
    extensions: [
      keymap.of(defaultKeymap),
      EditorView.updateListener.of((v: ViewUpdate) => {
        if (v.docChanged) {
          setDoc(v.state.doc.toString())
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
      <pre>{doc()}</pre>
    </div>
  )
}
