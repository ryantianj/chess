import './App.css';
import Chess from "./Chess/Chess";
import {ChessContextProvider} from "./Chess/ChessContext";

function App() {
  return (
    <div className="App">
        <ChessContextProvider>
            <Chess />
        </ChessContextProvider>
    </div>
  );
}

export default App;
