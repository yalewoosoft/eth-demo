import { EthProvider } from "./contexts/EthContext";
import "./App.css";
import SNNavBar from "./components/SocialNetwork/SNNavBar";

function App() {
  return (
    <EthProvider>
        <SNNavBar/>
    </EthProvider>
  );
}

export default App;
