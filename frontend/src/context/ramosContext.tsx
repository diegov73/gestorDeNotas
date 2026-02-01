import React, {createContext, useContext, useState, useEffect, useCallback} from "react";
import type {Ramo} from '../types/basics';

interface RamosContexType{
    ramos: Ramo[],
    isLoading: boolean,
    refreshRamos: ()=>void;
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

    useEffect(()=>{
        fetchRamos();
    }, [fetchRamos]);

    return(
        <RamosContext.Provider value={{
            ramos,
            isLoading,
            refreshRamos: fetchRamos
        }}>{children}</RamosContext.Provider>
    )
};

export const useRamos=()=>{
    const context = useContext(RamosContext);
    
    if(!context) throw new Error('useRamos debe usarse dentro de ramosProvider');
    
    return context;
}