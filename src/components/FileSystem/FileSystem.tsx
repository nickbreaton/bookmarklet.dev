import { makePersisted } from "@solid-primitives/storage"
import {
  Accessor,
  JSX,
  Setter,
  createContext,
  createSignal,
  useContext,
} from "solid-js"

type Files = Record<string, string>

const Context = createContext<[Accessor<Files>, Setter<Files>]>([
  () => ({}),
  () => {},
])

export const FileSystem = (props: { children: JSX.Element }) => {
  const [files, setFiles] = //makePersisted(
    createSignal<Files>({
      "index.js": `
        import { log } from './logger.js'
        log()
      `,
      "logger.js": `
        export const log = () => {
          console.log(123)
        }
      `,
    })
  // { name: "fs" },
  // )

  return (
    <Context.Provider value={[files, setFiles]}>
      {props.children}
    </Context.Provider>
  )
}

export const useFile = (
  name: string,
): [Accessor<string>, (content: string) => void] => {
  const [files, setFiles] = useContext(Context)
  return [
    () => files()[name],
    (content) => setFiles((prev) => ({ ...prev, [name]: content })),
  ]
}

export const useFiles = () => {
  const [files, setFiles] = useContext(Context)
  return [
    files,
    {
      delete(name: string) {
        setFiles((prev) => {
          const next = { ...prev }
          delete next[name]
          return next
        })
      },
      create(name: string) {
        setFiles((prev) => {
          return { ...prev, [name]: "" }
        })
      },
    },
  ] as const
}
