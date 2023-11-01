import { createEffect, createSignal, useContext } from "solid-js"
import { useBundle } from "../BundleProvider/BundleProvider"

export const Preview = () => {
  const code = useBundle()
  const [frame, setFrame] = createSignal<HTMLIFrameElement>()

  const nonce = crypto.randomUUID()

  const content = `
    <h1>hello</h1>
  `

  const script = /* html */ `
    <script>
      window.addEventListener('message', ({ data }) => {
        if (data.nonce === '${nonce}') {
          if (data.type === 'run') {
            eval(data.payload)
          }
        }
      })
    </script>
  `

  return (
    <div>
      <button
        onClick={() => {
          frame()?.contentWindow?.postMessage({
            type: "run",
            nonce,
            payload: code(),
          })
        }}
      >
        Run
      </button>
      <iframe ref={setFrame} srcdoc={`${content}${script}`} />
    </div>
  )
}
