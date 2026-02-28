import React, { useEffect, useState} from "react";
import { useRamos } from "../../context/ramosContext";
import { useView } from "../../context/viewContext";
import FloatwindowRamo from "./../forms/formsRamo";
import RamoKPI from "../panels/ramosKPI";

const ShowRamos: React.FC=()=>{
    
    const{ zoomToRamo } = useView();
    const{ramos, isLoading, deleteRamo}=useRamos();

    const[windowOpen, setWindowOpen] = useState<boolean>(false);

    useEffect(()=>{
        console.log("Cargando ramos:", isLoading);
        console.log("Ramos recibidos", ramos);
    },[ramos, isLoading]);

    const handleClick = (id:string | undefined)=>{
        console.log("has hecho click en el ramo con ID: ", id);
        zoomToRamo(id!);
    }

    return(
        <div className="text-2xl h-full w-full">
            <div className="relative flex items-start flex-wrap justify-start gap-4 p-2">

                {ramos.map((ramo)=>(
                    <div key={ramo.id_ramo} className="relative bg-white w-91 h-147 rounded-lg shadow-lg hover:bg-green-100 transition-all duration-300 group" onClick={()=>handleClick(ramo.id_ramo)}>
                        <h3 className="bg-green-600 text-white flex h-18 items-center justify-center">{ramo.nombre}</h3>
                        <RamoKPI ramo={ramo} level="home"/>
                        <span 
                            className="h-12 w-1/2 flex justify-center items-center text-white absolute bottom-0 left-0 font-bold bg-red-600 hover:text-black transition-colors duration-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteRamo(ramo.id_ramo!)}
                            }>
                                borrar
                            </span>
                        <span
                            className="h-12 w-1/2 flex justify-center items-center text-white absolute bottom-0 right-0 font-bold bg-yellow-400 hover:text-black transition-colors duration-500">                            
                                editar
                        </span>
                    </div>
                ))}
                <div 
                        onClick={() => setWindowOpen(true)}
                        className="relative bg-gray-50 w-91 h-147 rounded-lg shadow-md border-2 border-dashed border-green-600 flex flex-col items-center justify-center cursor-pointer hover:bg-green-100 transition-all duration-300 group"
                    >
                    <div className="text-6xl text-green-600 group-hover:scale-110 transition-transform">+</div>
                    <span className="text-lg font-bold text-green-700 mt-4">Añadir Ramo</span>
                </div>
            </div>

            {windowOpen &&(<FloatwindowRamo onClose={() => setWindowOpen(false)}/>)}        
        </div>
    )
}

export default ShowRamos