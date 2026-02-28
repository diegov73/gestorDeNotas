import React, {createContext, useContext, useMemo} from "react";
import type { Evaluacion, Nota } from "../types/basics";
import { useRamos } from "./ramosContext";

interface NotasProps{

    notas: Nota[],

    getEva: (id: string) => Evaluacion | undefined,
    postNota: (idEva: string, newNota: Omit<Nota, "id_nota">) => Promise<boolean>
    deleteNota: (id: string) => Promise<boolean>
    getWeight: (idEva: string, id: Nota) => number;
}

const NotasContext = createContext<NotasProps | null>(null);

export const NotasProvider: React.FC<{children: React.ReactNode}> = ({children}) =>{

    const {ramos, refreshRamos}= useRamos();

    const getEva = (id: string): Evaluacion | undefined =>{

        for(const ramo of ramos){
            const evaluacion = ramo.evaluaciones.find((eva) => eva.id_evaluacion == id);
            
            return evaluacion!;
        }
        return undefined;
    } 
    
    const postNota = async(idEva: string, newNota: Omit<Nota, "id_nota">) =>{
        try{
            const post = await fetch(`http://localhost:8000/api/notas/${idEva}`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newNota)
            })

            if(!post.ok){
                const err = await post.json();
                console.error("POST: Error al registrar la nota: ", newNota.nombre, err);
                return false;
            }
            else{
                console.log("POST: Nota registrada con exito");
                refreshRamos();
                return true;
            }
        }
        catch(err){
            console.error('POST: Error al registrar la evaluacion', err);
            return false;
        }
    }

    const deleteNota = async(id: string) =>{
        try{
            const del = await fetch(`http://localhost:8000/api/notas/${id}`,{
                method: 'DELETE'
            })

            if(!del.ok){
                const err = await del.json();
                console.error("DELETE: la nota no se ha eliminado", err);
                return false;
            }

            else{
                console.log("DELETE: La nota se ha eliminado con exito");
                refreshRamos();
                return true;
            }
        }
        catch(err){
            console.error("DELETE: la nota no se ha a eliminado", err);
            return false;
        }
    }

    const getWeight =(idEva: string, nota: Nota) =>{
        
        const currentEva = ramos.flatMap(r => r.evaluaciones).find(e => e.id_evaluacion === idEva);
        
        return nota.valor/currentEva?.cantidad_notas!;
    }

    const value = useMemo(() => ({
        
        notas: ramos.flatMap(r => r.evaluaciones.flatMap(e => e.notas)),
        getEva,
        postNota,
        deleteNota,
        getWeight,
    }), [ramos, getEva]);

    return (
        <NotasContext.Provider value = {value}>
            {children}
        </NotasContext.Provider>
    )
}

export const useNotas = () =>{
        const context = useContext(NotasContext);
        if(!context){
            throw new Error("UseNotas debe usarse dentro de NotasProvider")
    }
    return context;
}