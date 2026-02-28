import React, { useState } from "react";
import { useEvaluaciones } from "../../context/evaluacionesContext";
import { useView } from "../../context/viewContext";
import { Evaluacion } from "../../types/basics";
import FormEvaluacion from "../forms/formsEvaluacion";
import Add from "../panels/add";

import EvaKPI from "../panels/EvalucionesKpi";
import RamoKPI from "../panels/ramosKPI";

interface showEvaluacionesProps{

    idRamo: string;
}

const ShowEvaluaciones: React.FC<showEvaluacionesProps> = ({idRamo}) =>{

    const {zoomToEvaluacion} = useView(); 

    const {deleteEvaluacion, getRamo } = useEvaluaciones();

    const ramo = getRamo(idRamo);

    const[window, setWindow] = useState<boolean>(false);

    const evaluaciones = ramo.evaluaciones; 

    const currentPercent: number = evaluaciones.reduce((acc, ev) => acc + Number(ev.peso), 0);

    const is1Hundred: Boolean = currentPercent >= 100;

    const atLeastOne: Boolean = ramo.evaluaciones.length > 0;

    const handleClick = (eva: Evaluacion) =>{
        console.log("has seleccionado el ramo: ", eva.nombre);
        const id = eva.id_evaluacion!;
        zoomToEvaluacion(idRamo, id);
    }

    return(
        <div className="text-3xl h-full w-full">
            <div className="relative flex items-start flex-wrap justify-start gap-4 p-2">

                <div>
                    {atLeastOne && <RamoKPI ramo={ramo} level="ramo" />}
                </div>

                {evaluaciones.map((evalu)=>(
                    <div 
                        className="
                            relative flex flex-col bg-white w-91 h-147 rounded-lg shadow-lg overflow-hidden
                            hover:bg-green-100 transition-all duration-300 group
                        "
                        onClick={() => handleClick(evalu)}
                        key={evalu.id_evaluacion}
                    >
                        <h3 className="bg-green-600 h-20 text-white flex justify-center items-center">{evalu.nombre}</h3>
                        
                        <div className="flex-1 w-full relative">
                            <EvaKPI eva={evalu} level="ramo"/>
                        </div>

                        <button
                            className="
                                h-12 w-1/2 flex justify-center items-center text-white absolute bottom-0 left-0 font-bold bg-red-600 
                                hover:text-black transition-colors duration-500
                            "
                            onClick={(e) =>{
                                e.stopPropagation();
                                deleteEvaluacion(evalu.id_evaluacion!)
                            }}
                        >
                            borrar
                        </button>
                    </div>
                ))}

                <div 
                    onClick={() =>setWindow(true)}
                >
                {!is1Hundred && (
                    <Add current={currentPercent} level="ramo" setWindow={() => setWindow(false)}/>
                )}
                </div>
            </div>

            {window && (<FormEvaluacion idRamo={idRamo} changeStatus={() => setWindow(false)}/>)}
        </div>
    )
}

export default ShowEvaluaciones