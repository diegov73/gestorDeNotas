import React, { useState } from "react";
import FloatWindowRamo from "./forms";

const StaticsBars: React.FC = ()=>{
    const[isOpen, setIsOpen] = useState<boolean>(false);

    const[WindowOpen, setWindowOpen] = useState<boolean>(false);

    const toggleSidebars = (): void =>{setIsOpen(!isOpen)}
    
    return(
        <div>
        <h1 className="font-bold text-white text-2xl h-18 bg-green-800 flex items-center justify-center">Notas</h1>

            <button onClick={toggleSidebars}
            className={`fixed top-4 z-50 p-2 bg-blue-600 rounded shadow-md hover:bg-blue-700 duration-700 ease-in-out
            ${isOpen ? 'translate-x-52 mt-16' : 'translate-x-4'}`}>
                &#9776;
            </button>
           
            <div className={`fixed top-18 left-0 h-full w-64 bg-green-700 text-white shadow-lg z-40 duration-700 ease-in-out 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-5">
                    <nav>
                        <ul className="space-y-8">
                            <li 
                                onClick={()=>setWindowOpen(true)}
                                className=" font-bold block text-center hover:text-black transition-colors">
                                Crear ramo
                            </li>
                            <li className=" font-bold block text-center hover:text-black transition-colors">mas opciones 1</li>
                            <li className=" font-bold block text-center hover:text-black transition-colors">mas opciones 2</li>
                            <li className=" font-bold block text-center hover:text-black transition-colors">mas opciones 3</li>
                        </ul>
                    </nav>
                </div>
            </div>
            {WindowOpen &&(
                <FloatWindowRamo onClose = {() => setWindowOpen(false)}/>
            )}
        </div>
    )
}

export default StaticsBars;