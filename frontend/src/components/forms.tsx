import React, { useEffect, useState } from "react";
import type {Ramo} from "../types/basics";
import { CallStatus } from "../enums/estados";

interface closeWindow{
    onClose: () => void;
}

const FloatwindowRamo: React.FC<closeWindow> =({onClose})=>{

    const API = "api/ramos/";

    const[estado, setEstado] = useState<CallStatus>(CallStatus.IDLE);

    const[input, setInput] = useState({
        nombre: "",
        notaAprobado: null,
        notaExamen: null,
        evaluaciones: []
    })

    useEffect(()=>{
        if(estado === CallStatus.ERROR || estado === CallStatus.SUCCES){
            const timer = setTimeout(()=>{
                onClose();
            }, 2500);

            return ()=>clearTimeout(timer);
        }
    }, [estado, onClose]);

    useEffect(()=>{
        console.log("Estado ha cambiado, valor actual: ", estado)
    }, [estado]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        
        const{name,value,type} = e.target;

        const valorFinal = type === 'number' ? parseFloat(value) || 0 : value;

        setInput({
            ...input,
            [name]: valorFinal
        })
    }

    const exportarRamo = async()=>{
        
        
        if(input.nombre == ""){
            console.log("Error, el nombre no puede estar vacio");
            return
        }
        
        const exportRamo:Ramo ={
            ...input,
            nota_aprobado: input.notaAprobado ?? 4,
            nota_examen: input.notaExamen ?? 5
        }

        console.log("Formulario recibido, interfaz cumplida:", exportRamo);

        try{

            setEstado(CallStatus.LOADING);

            const post = await fetch(`${API}`,{
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify(exportRamo)
            })
        
            if(post.ok){
                console.log("Ramo enviado exitosamente")
                setEstado(CallStatus.SUCCES);
            }
            else{
                console.log("Ramo enviado fallidamente")
                setEstado(CallStatus.ERROR);
            }

            setTimeout(()=>{
                onClose();
            }, 2000);
        }

        catch(error){
            console.error("hubo un error en el fetch")
            setEstado(CallStatus.ERROR);
        }
    }

    if(estado === CallStatus.SUCCES){
        return(
            <div className="fixed inset-0 flex items-top justify-end p-8 py-26">
                <div className="relative bg-white rounded-lg overflow-hidden flex flex-col w-80 h-16 z-30 shadow-xl">
                    <h1 className="flex items-center justify-center h-16 bg-green-600 text-white text-2xl z-20">Ramo creado</h1>
                </div>
            </div>
        )    
    }

    else if(estado === CallStatus.ERROR){
        return(
            <div className="fixed inset-0 flex items-top justify-end p-8 py-26">
                <div className="relative bg-white rounded-lg overflow-hidden flex flex-col w-80 h-16 z-30 shadow-xl">
                    <h1 className="flex items-center justify-center h-16 bg-red-600 text-white text-2xl z-20">Ha ocurrido un error</h1>
                </div>
            </div>
        )
    }

    return(
        <div className="fixed inset-0 flex items-top justify-end p-8 py-26">
            <div className="relative bg-white rounded-lg overflow-hidden flex flex-col w-80 h-90 z-30 shadow-xl">

                <h1 className="flex items-center justify-center h-16 bg-green-600 text-white text-2xl z-20">Crear ramo</h1>

                <div className="p-6 flex flex-col justify-start gap-4">

                    <div className="flex flex-col gap-1 ">
                        <span className="fond-bold">Nombre ramo:</span>
                        <input 
                            placeholder="...Escribe el nombre"
                            className="border text-center"
                            type = "text"
                            name = "nombre"
                            value = {input.nombre}
                            onChange = {handleChange}
                        />
                    </div>                            

                    <div className="flex flex-col gap-1 ">
                        <span className="fond-bold">Nota Aprovado:</span>
                        <input
                            placeholder="Nota por defecto: 4"
                            className="border text-center"
                            type = "number"
                            name = "notaAprovado"
                            value = {input.notaAprobado || ""}
                            onChange = {handleChange}
                        />
                    </div>                

                    <div className="flex flex-col gap-1 ">
                        <span className="fond-bold">Nota examen:</span>
                        <input
                            placeholder="Nota por defecto: 5"
                            className="border text-center"
                            type = "number"
                            name = "notaExamen"
                            value = {input.notaExamen || ""}
                            onChange = {handleChange}
                        />
                    </div>                

                </div>

                <div className="flex justify-around">
                    
                    <span
                        className="h-12 w-40 flex justify-center items-center text-white absolute bottom-0 left-0 font-bold bg-red-600 hover:text-black transition-colors duration-500"
                        onClick={onClose}>
                        Cerrar
                    </span>
                    
                    <span 
                        className="h-12 w-40 flex justify-center items-center text-white absolute bottom-0 right-0 font-bold bg-blue-600 hover:text-black transition-colors duration-500"
                        onClick={exportarRamo}>
                        Crear
                    </span>
                
                </div>
            </div>
        </div>
    )
}

export default FloatwindowRamo