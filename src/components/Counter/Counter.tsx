import { createSignal } from "solid-js";
import css from './Counter.module.css'

export default function Counter() {
  const [count, setCount] = createSignal(0);
  return (
    <button class={css.increment} onClick={() => setCount(count() + 1)}>
      Clicks: {count()}
    </button>
  );
}
