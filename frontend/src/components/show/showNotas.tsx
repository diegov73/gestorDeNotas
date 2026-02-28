import React, { useState } from "react";
import { Evaluacion, Nota } from "../../types/basics";

import { useNotas } from "../../context/notasContext";

import FormNota from "../forms/formsNota";

import Add from "../panels/add"
import EvaKPI from "../panels/EvalucionesKpi";

interface showNotasProps{
    idEva: string
}

const ShowNotas: React.FC<showNotasProps> = ({idEva}) =>{

    const {
        getEva,
        deleteNota,
    } = useNotas();

    const currentEva: Evaluacion = getEva(idEva)!;

    const notas: Nota[] = currentEva.notas;
    
    const currentNotas: number = notas.length;
    
    const howManyLeft = currentEva.cantidad_notas - notas.length

    const theresLeft: boolean = howManyLeft > 0;

    const atLeastOne: boolean = currentNotas > 0;

    const[window, setWindow] = useState<boolean>(false);

    const handleclick = (nota: Nota) =>{
        console.log("has clickeado la nota: ", nota.nombre);
    }

    return(
        <div className="text-3xl h-full w-full">

            <div className="relative flex items-start flex-wrap justify-start gap-4 p-2">

                <div>
                  {atLeastOne && (<EvaKPI eva={currentEva} level="evaluacion"/>)}
                </div>

                {notas.map((grade) =>(
                    <div 
                        className="
                            relative bg-white w-91 h-147 rounded-lg shadow-lg flex flex-col
                            hover:bg-green-100 transition-all duration-300 group
                        "
                        key={grade.id_nota}
                        onClick={() => handleclick(grade)}
                    >
                        <h3 className="bg-green-600 text-white flex justify-center text-7xl p-3">{grade.nombre}</h3>

                        <span className="text-[12px] flex justify-start p-1">ID: {grade.id_nota}</span>

                        <div className="flex-1 flex justify-center items-center text-[150px] text-black">{grade.valor}</div>

                        <div className="text-[12px] flex justify-between p-1">
                            <span>
                                {(grade.fecha === null) ? 'Fecha: No registrada' : `Fecha: ${grade.fecha}`}
                            </span>

                            <span>
                                Aporte: {(grade.valor/currentEva.cantidad_notas).toFixed(2)}
                            </span>
                        </div>

                        <div>
                            <span
                                className="
                                h-12 w-1/2 flex justify-center items-center text-2xl text-white font-bold bg-red-600
                                hover:text-black transition-colors duration-500
                                "
                                onClick={(e) =>{
                                    e.stopPropagation();
                                    deleteNota(grade.id_nota!);
                                }}
                                >
                                Borrar
                            </span>

                            <span
                                className="
                                h-12 w-1/2 flex justify-center items-center text-2xl text-white absolute bottom-0 right-0 font-bold bg-yellow-400 
                                hover:text-black transition-colors duration-500
                                "
                                >                            
                                editar
                            </span>
                        </div>
                    </div>
                ))}
                
                <div
                    onClick={() =>setWindow(true)}
                >
                    {theresLeft && (<Add current={howManyLeft} level={"evaluacion"} setWindow={() =>setWindow(false)}/>)}
                </div>
            </div>

            {window && (<FormNota idEva={idEva} changeStatus={() => setWindow(false)}/>)}
        </div>
    )
}

export default ShowNotas