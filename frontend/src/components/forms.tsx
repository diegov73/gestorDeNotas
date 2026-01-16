import React, { useState } from "react";

interface closeWindow{
    onClose: () => void;
}

const FloatwindowRamo: React.FC<closeWindow> =({onClose})=>{

    return(
        <div className="flex items-center justify-center">
            <div className="box-content size-200 border-2 fixed top-26">
                <h1 className="font-bold bg-green-600 text-white h-14 flex items-center justify-center
                ">
                Crear ramo
            </h1>
                <button className="text-2xl font-bold" onClick={onClose}>cerrar</button>
            </div>
        </div>
    )
}

export default FloatwindowRamo