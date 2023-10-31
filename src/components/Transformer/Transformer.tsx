import { JSX, createContext, createResource, useContext } from "solid-js"
import { initialize, build } from "esbuild-wasm"
import wasmURL from "esbuild-wasm/esbuild.wasm?url"
import { useFile, useFiles } from "../FileSystem/FileSystem"
import path from "path"

const Context = createContext({
  code: (): string => "",
})

declare global {
  interface Window {
    esbuildReady: Promise<unknown>
  }
}

if (!window.esbuildReady) {
  window.esbuildReady = initialize({
    wasmURL,
  })
}

export const Transformer = (props: { children: JSX.Element }) => {
  const [files] = useFiles()

  const [result] = createResource(files, async (source, { value: prior }) => {
    await window.esbuildReady

    const result = await build({
      format: "iife",
      bundle: true,
      minify: true,
      entryPoints: ["index.js"],
      plugins: [
        {
          name: "virtual-loader",
          setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => ({
              path: args.path.replace(/^\.\//, ""),
              namespace: "virtual",
            }))
            build.onLoad(
              { filter: /.*/, namespace: "virtual" },
              ({ path }) => ({ contents: source[path] }),
            )
          },
        },
      ],
    }).catch(() => ({ code: prior }))

    const code =
      "outputFiles" in result ? result.outputFiles?.[0].text ?? "" : ""

    return code
  })

  return (
    <Context.Provider value={{ code: () => String(result.latest) }}>
      {props.children}
    </Context.Provider>
  )
}

export const useTransformedCode = () => {
  return useContext(Context).code
}
