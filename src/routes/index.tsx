import { Editor } from "~/components/Editor"
import { FileSystemProvider } from "~/components/FileSystemProvider/FileSystemProvider"
import { Main } from "~/components/Main/Main"
import { BundleProvider } from "~/components/BundleProvider/BundleProvider"

export default function Home() {
  return (
    <FileSystemProvider>
      <BundleProvider>
        <Main />
      </BundleProvider>
    </FileSystemProvider>
  )
}
