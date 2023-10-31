import { Editor } from "~/components/Editor"
import { FileSystem } from "~/components/FileSystem/FileSystem"
import { Main } from "~/components/Main/Main"
import { Transformer } from "~/components/Transformer/Transformer"

export default function Home() {
  return (
    <FileSystem>
      <Transformer>
        <Main />
      </Transformer>
    </FileSystem>
  )
}
