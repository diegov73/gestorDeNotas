import React from "react";
import { useView } from "./context/viewContext";
import { useRamos } from "./context/ramosContext";

import StaticsBars from "./components/StaticsBars";

import ShowRamos from "./components/show/showRamos";
import ShowEvaluaciones from "./components/show/showEvaluaciones";
import ShowNotas from "./components/show/showNotas";

const Dashboard: React.FC=()=>{

    const {viewState} = useView();
    const {ramos} = useRamos();

    const getRamo = ramos.find(r=>r.id_ramo === viewState.selectedRamo);
    
    const getEval = getRamo?.evaluaciones.find(e => e.id_evaluacion === viewState.selectedEvaluacion);
    
    return(
        <>
        <StaticsBars/>
        {viewState.level === 'home' && <ShowRamos/>}

        {viewState.level === 'ramo' && <ShowEvaluaciones idRamo={getRamo?.id_ramo!}/>}

        {viewState.level === 'evaluacion' && getEval && <ShowNotas idEva={getEval.id_evaluacion!}/>}
        </>
    )
}

export default Dashboard