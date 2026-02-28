import React from "react";
import { levels } from "../../types/views"

interface addProps{
    current: number,
    level: levels,
    setWindow: () =>void;
}

const Add: React.FC<addProps> = ({current, level}) =>{

    const getLevel = () => {
        if(level === 'home'){
            return 'ramo'
        }
        else if(level === 'ramo'){
            return 'evaluacion'
        }
        else{
            return 'nota'
        }
    }
    
    if(level === 'home'){
        return(
            <>aun no desarrollado</>
        )
    }

    else if(level === 'ramo'){
        return(
            <div
            className="
                relative bg-gray-50 w-91 h-147 rounded-lg shadow-md border-2 border-dashed border-green-600 flex flex-col items-center justify-center cursor-pointer
                hover:bg-green-100 transition-all duration-300 group:
            ">
                <div className="text-6xl text-green-600 group-hover:scale-110 transition-transform">+</div>
                
                <span className="text-lg font-bold text-green-700 mt-4">    
                    
                    {100 - current}% disponible
            
                </span>
            </div>
        )
    }
    else{
        return(
            <div>
                <div
                    className="
                        relative bg-gray-50 w-91 h-147 rounded-lg shadow-md border-2 border-dashed border-green-600 flex flex-col items-center justify-center cursor-pointer
                        hover:bg-green-100 transition-all duration-300 group:
                    "
                >
                    <div className="text-6xl text-green-600 group-hover:scale-110 transition-transform">+</div>
                    <span className="text-lg font-bold text-green-700 mt-4">    
                    {
                        (getLevel() === 'evaluacion' && (current === 1) ? "queda 1 nota" : `quedan ${current} notas`)
                    }
                    </span>
                </div>
            </div>
        )
    }
}

export default Add