import { JSX, createContext, createResource, useContext } from "solid-js"
import { initialize, build } from "esbuild-wasm"
import wasmURL from "esbuild-wasm/esbuild.wasm?url"
import { useFiles } from "../FileSystemProvider/FileSystemProvider"

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

export const BundleProvider = (props: { children: JSX.Element }) => {
  const [files] = useFiles()

  const [result] = createResource(files, async (source, { value: prior }) => {
    await window.esbuildReady

    const result = await build({
      format: "esm",
      bundle: true,
      minify: true,
      banner: { js: "(async () => {" },
      footer: { js: "})()" },
      entryPoints: ["index.js"],
      absWorkingDir: "/",
      plugins: [
        {
          name: "virtual-loader",
          setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => ({
              path: "/" + args.path.replace(/^\.\//, ""),
            }))
            build.onLoad({ filter: /.*/ }, ({ path }) => ({
              contents: source[path.substring(1)],
            }))
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

export const useBundle = () => {
  return useContext(Context).code
}
