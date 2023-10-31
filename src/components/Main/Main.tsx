import { JSX } from "solid-js"
import css from "./Main.module.css"
import { Editor } from "../Editor"
import { Preview } from "../Preview/Preview"

export const Main = () => {
  return (
    <main class={css.main}>
      <div>
        <Editor name="index.js" />
      </div>
      <div>
        <Preview />
      </div>
    </main>
  )
}
