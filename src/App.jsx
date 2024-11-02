import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p class="text-white">
        {count}
      </p>
      <button onClick={() => setCount((count) => count + 1)}>COUNT</button>
    </div>
  )
}

export default App
