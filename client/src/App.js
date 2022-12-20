import './App.css';
import HomeBody from './components/HomeBody/HomeBody'
import { GlobalStoreContextProvider } from './store'

function App() {
  return (
    <GlobalStoreContextProvider>
      <HomeBody/>
    </GlobalStoreContextProvider>
  );
}

export default App;
