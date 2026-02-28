import React, { useEffect, useState } from "react";
import type {Nota} from "../../types/basics";
import { CallStatus } from "../../enums/estados";
import { useNotas } from "../../context/notasContext";

interface setWindow{
    idEva: string;
    changeStatus: () => void;
}

const FormNota: React.FC<setWindow> = ({idEva, changeStatus}) =>{

    const[estado, setEstado] = useState<CallStatus>(CallStatus.IDLE);

    const {postNota} = useNotas();

    const[input, setInput] = useState({
        nombre: "",
        valor: null,
        fecha: null,
        peso: null
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
    }, [estado]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        
        const{name, value, type} = e.target;

        const valorFinal = (type === 'number') ? parseFloat(value) || 0 : value;

        setInput({
            ...input,
            [name]: valorFinal
        })
    }

    const exportNota = async() =>{

        if(input.nombre === ""){
            console.log("Nota debe tener nombre");
            return;
        }

        const newNota: Omit<Nota, "id_nota"> ={
            nombre: input.nombre,
            valor: (input.valor !== null) ? Number(input.valor) : 0,
            peso: (input.peso === null || input.peso === "") ? null! : Number(input.peso),
            fecha: (input.fecha === "" || input.fecha === null) ? null! : input.fecha
        }

        console.log("Formulario recibido, interfaz cumplida: ", newNota);

        try{
            setEstado(CallStatus.LOADING);

            const post = await postNota(idEva, newNota);

            if(!post){
                setEstado(CallStatus.ERROR);
            }
            else{
                setEstado(CallStatus.SUCCES);
            }
        }
        catch(err){
            setEstado(CallStatus.ERROR)
        }
    }

    if(estado === CallStatus.SUCCES){
        return(
            <div className="fixed inset-0 flex items-top justify-end p-8 py-26">
                <div className="relative bg-white rounded-lg overflow-hidden flex flex-col w-80 h-16 z-30 shadow-xl">
                    <h1 className="flex items-center justify-center h-16 bg-green-600 text-white text-2xl z-20">Nota registrada</h1>
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
            <div className="relative bg-white rounded-lg overflow-hidden flex flex-col w-80 h-125 shadow-xl">

                <h1 className="flex items-center justify-center h-16 bg-green-600 text-white text-4xl z-20">Crear nota</h1>

                <div className="p-6 flex flex-col justify-start gap-4">

                    <div className="flex flex-col gap-1 text-2xl">
                        <span className="fond-bold">Nombre nota:</span>
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
                        <span className="fond-bold ">Nota:</span>
                        <input
                            placeholder="nota obtenida"
                            className="border text-center"
                            type = "number"
                            name = "valor"
                            value = {input.valor || ""}
                            onChange = {handleChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1 text-2xl">
                        <span className="fond-bold ">Peso:</span>
                        <input
                            placeholder="Ej: lab final vale el 40%"
                            className="border text-center"
                            type = "number"
                            name = "peso"
                            value = {input.peso || ""}
                            onChange = {handleChange}
                        />
                    </div>                

                    <div className="flex flex-col gap-1 text-2xl">
                        <span className="fond-bold">fecha:</span>
                        <input
                            placeholder="Ej: yyyy-mm-dd"
                            className="border text-center"
                            type = "date"
                            name = "fecha"
                            value = {input.fecha || ""}
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
                        onClick={() => exportNota()}>
                        Crear
                    </span>
                
                </div>
            </div>
        </div>
    )
}

export default FormNota