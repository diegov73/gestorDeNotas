
import './App.css';

import { ViewProvider } from './context/viewContext';

import { RamosProvider } from './context/ramosContext';
import { EvaluacionesProvider } from './context/evaluacionesContext';
import { NotasProvider } from './context/notasContext';

import Dashboard from './dashboard';

function App() {

  return (
    <ViewProvider>
      <RamosProvider>
        <EvaluacionesProvider>
          <NotasProvider>

            <Dashboard/>
            
          </NotasProvider>
        </EvaluacionesProvider>
      </RamosProvider>
    </ViewProvider>
  )
}

export default App
