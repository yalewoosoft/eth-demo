import { EthProvider } from "./contexts/EthContext";
import "./App.css";
import SNApp from "./components/SocialNetwork/SNApp";

function App() {
  return (
    <EthProvider>
        <SNApp />
    </EthProvider>
  );
}

export default App;
