import React, {createContext, useContext, useState, useEffect, useCallback} from "react";
import type {Ramo} from '../types/basics';

interface RamosContexType{
    ramos: Ramo[],
    isLoading: boolean,

    refreshRamos: ()=>void;
    postRamo: (newRamo: Omit<Ramo, 'id_ramo'>) =>Promise<boolean>;
    deleteRamo: (id: string)=> Promise<boolean>;
}

const RamosContext = createContext<RamosContexType | null>(null);

export const RamosProvider: React.FC<{children: React.ReactNode}>=({children})=>{
    
    const[ramos, setRamos] = useState<Ramo[]>([]);
    const[isLoading, setIsLoading] = useState(false);

    const fetchRamos = useCallback(async ()=>{
        try{
            setIsLoading(true);
            
            const get = await fetch("/api/ramos/");

            if(get.ok){
                const data = await get.json();
                setRamos(data);
            }
            else{
                console.error("error cargando ramos");
            }
        }
        catch(error){
            console.error("error de coneccion", error);
        }
        finally{
            setIsLoading(false);
        }
    }, []);

    const postRamo = async(newRamo: Omit<Ramo, 'id'>) =>{
        try{
            const post = await fetch("/api/ramos/",{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newRamo)
            })

            if(post.ok){
                console.log("POST. el ramo se ha registrado con exito")
                const ramoCreado = await post.json();
                setRamos(prev =>[...prev, ramoCreado]);
                return true;
            }
            else{
                console.error("POST ERROR LOCAL. error al registrar el ramo: ", newRamo.nombre);
                return false
            }
        }
        catch(erro){
            console.error("POST ERROR EXTERNO. error al registrar el ramo: ", newRamo.nombre," ", erro);
            return false
        }
    };

    const deleteRamo = async(id: string)=>{
        try{    
            const del = await fetch(`/api/ramos/${id}`,{
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'}
            })
            
            if(del.ok){
                setRamos(prev => prev.filter(ramo => ramo.id_ramo !== id));
                console.log("DELETE. el Ramo se ha eliminado");
                return true;
            }
            else{
                console.error("DELETE ERROR LOCAL. el Ramo no se ha eliminado");
                return false;
            }
        }
        catch(erro){
            console.error("DELETE ERROR EXTERNO. el Ramo no se ha eliminado");
            return false;
        }
    }

    useEffect(()=>{fetchRamos();}, [fetchRamos]);

    return(
        <RamosContext.Provider value={{
            ramos,
            isLoading,
            refreshRamos: fetchRamos,
            postRamo,
            deleteRamo
        }}>
            {children}
        </RamosContext.Provider>
    )
};

export const useRamos=()=>{
    const context = useContext(RamosContext);
    
    if(!context) throw new Error('useRamos debe usarse dentro de ramosProvider');
    
    return context;
}