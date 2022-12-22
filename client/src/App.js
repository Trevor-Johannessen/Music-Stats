import './App.css';
import HomeBody from './components/HomeBody/HomeBody'
import { GlobalDataContextProvider } from './dataContext';
import { GlobalStoreContextProvider } from './store'

function App() {
  return (
    <GlobalStoreContextProvider>
      <GlobalDataContextProvider>
        <HomeBody/>
      </GlobalDataContextProvider>
    </GlobalStoreContextProvider>
  );
}

export default App;
