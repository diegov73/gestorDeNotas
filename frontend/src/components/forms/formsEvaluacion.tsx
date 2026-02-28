import React, { useEffect, useState } from "react";
import type {Evaluacion} from "../../types/basics";
import { CallStatus } from "../../enums/estados";
import { useEvaluaciones } from "../../context/evaluacionesContext";

interface setWindow{
    
    idRamo: string;
    changeStatus: () => void;
}

const FormEvaluacion: React.FC<setWindow> = ({idRamo, changeStatus}) =>{

    const[estado, setEstado] = useState<CallStatus>(CallStatus.IDLE);

    const{postEvaluacion} = useEvaluaciones();

    const[input, setInput] = useState({
        nombre: "",
        peso: null,
        cantidad_notas: null,
        notas: []
    })

    useEffect(() =>{
        if(estado === CallStatus.ERROR || estado === CallStatus.SUCCES){
            const timer = setTimeout(() =>{
                changeStatus();
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [estado, changeStatus]);

    useEffect(() =>{
        console.log("Estado ha cambiado. Valor actual: ", estado);
    }, [estado])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        
        const{name, value, type} = e.target;

        const valorFinal = (type === 'number') ? parseFloat(value) || 0 : value;

        setInput({
            ...input,
            [name]: valorFinal
        })
    }

    const exportEva = async() =>{

        if(input.nombre === "" || input.cantidad_notas === null || input.peso === null){
            console.log("Uno o mas de los atributos esta vacio");
            return;
        }

        const newEva: Omit<Evaluacion, "id_evaluacion"> ={
            nombre: input.nombre,
            cantidad_notas: input.cantidad_notas !== null ? Number(input.cantidad_notas) : 1,
            peso: input.peso !== null ? Number(input.peso) : 20,
            notas: input.notas || []
        }

        console.log("Formulario recibido, interfaz cumplida: ", newEva);

        try{
            setEstado(CallStatus.LOADING);

            const post = await postEvaluacion(idRamo, newEva);

            if(!post){
                console.error("evaluacion enviada fallidamente");
                setEstado(CallStatus.ERROR);
            }
            else{
                console.log("Evaluacion enviada exitosamente");
                setEstado(CallStatus.SUCCES);
            }
            
            setTimeout(() =>{
                changeStatus();
            }, 2000);
        }
        catch(err){
            console.error("error al enviar la evaluacion", err);
        }
    }
    if(estado === CallStatus.SUCCES){
        return(
            <div className="fixed inset-0 flex items-top justify-end p-8 py-26">
                <div className="relative bg-white rounded-lg overflow-hidden flex flex-col w-80 h-16 z-30 shadow-xl">
                    <h1 className="flex items-center justify-center h-16 bg-green-600 text-white text-2xl z-20">Evaluacion registrada</h1>
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
        <div className="fixed inset-0 flex items-top justify-end p-8 py-26 z-999 bg-black/20 backdrop-blur-sm">
            <div className="relative bg-white rounded-lg overflow-hidden flex flex-col w-80 h-105 shadow-xl">

                <h1 className="flex items-center justify-center h-16 bg-green-600 text-white text-4xl z-20">Crear Evaluacion</h1>

                <div className="p-6 flex flex-col justify-start gap-4">

                    <div className="flex flex-col gap-1 text-2xl">
                        <span className="fond-bold">Nombre evaluacion:</span>
                        <input 
                            placeholder="...Escribe el nombre"
                            className="border text-center"
                            type = "text"
                            name = "nombre"
                            value = {input.nombre}
                            onChange = {handleChange}
                        />
                    </div>                            

                    <div className="flex flex-col gap-1 text-2xl">
                        <span className="fond-bold ">Peso (%):</span>
                        <input
                            placeholder="Ej: 30% del ramo"
                            className="border text-center"
                            type = "number"
                            name = "peso"
                            value = {input.peso || ""}
                            onChange = {handleChange}
                        />
                    </div>                

                    <div className="flex flex-col gap-1 text-2xl">
                        <span className="fond-bold">Cantidad de notas:</span>
                        <input
                            placeholder="Ej: lab de 7 notas"
                            className="border text-center"
                            type = "number"
                            name = "cantidad_notas"
                            value = {input.cantidad_notas || ""}
                            onChange = {handleChange}
                        />
                    </div>                

                </div>

                <div className="flex justify-around">
                    
                    <span
                        className="h-12 w-40 flex justify-center items-center text-white absolute bottom-0 left-0 font-bold bg-red-600 hover:text-black transition-colors duration-500"
                        onClick={() => changeStatus()}>
                        Cerrar
                    </span>
                    
                    <span 
                        className="h-12 w-40 flex justify-center items-center text-white absolute bottom-0 right-0 font-bold bg-blue-600 hover:text-black transition-colors duration-500"
                        onClick={() => exportEva()}>
                        Crear
                    </span>
                
                </div>
            </div>
        </div>
    )
}

export default FormEvaluacion