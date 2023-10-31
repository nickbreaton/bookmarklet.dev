import { createEffect, useContext } from "solid-js"
import { useTransformedCode } from "../Transformer/Transformer"

export const Preview = () => {
  const code = useTransformedCode()

  createEffect(() => console.log(code()))

  return <iframe srcdoc={`<h1>hello</h1><script>${code()}</script>`} />
}
