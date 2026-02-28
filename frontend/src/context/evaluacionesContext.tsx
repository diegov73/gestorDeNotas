import React, {createContext, useContext, useMemo} from "react";
import type { Ramo, Evaluacion } from "../types/basics";
import { useRamos } from "./ramosContext";

interface EvaluacionesContext{

    evaluaciones: Evaluacion[];

    getRamo: (idRamo: string) => Ramo;
    getEvaluacionesById: (idRamo: string) => Evaluacion[];
    postEvaluacion: (idRamo: string, newEvaluacion: Omit<Evaluacion, "id_evaluacion">) => Promise<boolean>;
    deleteEvaluacion: (id: string) => Promise<boolean>
}

const EvaluacionesContext = createContext<EvaluacionesContext | null>(null);

export const EvaluacionesProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const {ramos, refreshRamos} = useRamos();

    const getEvaluacionesById = (idRamo: string): Evaluacion[] =>{
        
        const ramo = ramos.find(r => r.id_ramo === idRamo);

        return ramo ? ramo.evaluaciones: [];
    }

    const evaluaciones = useMemo(() => {
        
        const ev= ramos.flatMap(ramo => ramo.evaluaciones || []);

        return ev
    }, [ramos]);

    const postEvaluacion = async(idRamo: string, newEvaluacion: Omit<Evaluacion, 'id_evaluacion'>) =>{
        try{
            const post = await fetch(`http://localhost:8000/api/evaluaciones/${idRamo}`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newEvaluacion)
            })

            if(!post.ok){
                const err = await post.json();
                console.error('POST: error al registrar la evaluacion: ', newEvaluacion.nombre, ' del ramo con id: ', idRamo, err);
                return false;
            }
            else{
                console.log("POST. Ramo registrado con exito");
                refreshRamos();
                return true;
            }
        }
        catch(err){
            console.error("POST: error al registrar evalucion", err);
            return false;
        }
    }

    const deleteEvaluacion = async(id: string)=>{
        try{

            const del = await fetch(`http://localhost:8000/api/evaluaciones/${id}`,{
                method: 'DELETE',
                headers: {"Content-Type": "application/json"}
            })
            
            if(!del.ok){
                const err = await del.json();
                console.error("DELETE: La evaluacion no se ha eliminado", err);
                return false;
            }
            else{
                console.log("DELETE. Evaluacion eliminada con exito");
                refreshRamos();
                return true;
            }
        }
        catch(err){
            console.error("DELETE ERROR EXTERNO. La evaluacion no se ha eliminado");
            return false;
        }
    }

    const getRamo = (id: string): Ramo =>{
        return ramos.find((r) => r.id_ramo === id)!;
    }

    return(
        <EvaluacionesContext.Provider value={{
            evaluaciones,
            getRamo,
            getEvaluacionesById,
            postEvaluacion,
            deleteEvaluacion
        }}>
            {children}
        </EvaluacionesContext.Provider>
    )
}

export const useEvaluaciones = () =>{
    const context = useContext(EvaluacionesContext);

    if(!context) throw new Error('useEvaluanes debe usarse dentro de evaluacionesProvider');

    return context;
}