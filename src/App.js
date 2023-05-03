import { useState } from "react";

const useCounter = () => {
  const [counter, setCounter] = useState(0)

  const increase = () => setCounter(counter + 1)
  const decrease = () => setCounter(counter - 1)
  const reset = () => setCounter(0)

  return {
    counter, increase, decrease, reset
  }
}

function App() {

  const counter1 = useCounter()
  const counter2 = useCounter()

  return (
    <div>
      <p>{counter1.counter}</p>
      <button onClick={counter1.increase}>+</button>
      <p>{counter2.counter}</p>
      <button onClick={counter2.increase}>+</button>
    </div>
  );
}
export default App;
