import { createEffect, useContext } from "solid-js"
import { useBundle } from "../BundleProvider/BundleProvider"

export const Preview = () => {
  const code = useBundle()

  createEffect(() => console.log(code()))

  return <iframe srcdoc={`<h1>hello</h1><script>${code()}</script>`} />
}
