import { useView } from "../context/viewContext";
import { useRamos } from "../context/ramosContext";
import type { Ramo } from "../types/basics";

const StaticsBars: React.FC = ()=>{

    const{
        viewState,
        zoomOut,
        zoomHome,
    } = useView();
    const {ramos} = useRamos();

    const getHeader = ():String =>{
        
        const getRamo = ramos.find((r: Ramo) =>r.id_ramo === viewState.selectedRamo);        
        
        switch(viewState.level){

            case 'home':
                return 'inicio';
            
            case 'ramo':
                const nombreRamo = getRamo?.nombre || "cargando...";
                
                return `inicio > ${nombreRamo}`;

            case 'evaluacion':
                const getEva = getRamo?.evaluaciones.find((e) => e.id_evaluacion === viewState.selectedEvaluacion);

                const nombreRamo2 = getRamo?.nombre || "cargando";

                const nombreEva = getEva?.nombre || "...";

                return `inicio > ${nombreRamo2} > ${nombreEva}`
            default:
                return "inicio";
        }
    }
    
    return(
        <div className="font-bold text-white text-2xl h-18 bg-green-800 flex items-center justify-between p-6">
            <span
                onClick={() => zoomOut()}
            >
                ⇦
            </span>
            
            <span>
                {getHeader()}
            </span>
            
            <span onClick={() => zoomHome()}>
                🏠︎
            </span>
        </div>
    )
}

export default StaticsBars;