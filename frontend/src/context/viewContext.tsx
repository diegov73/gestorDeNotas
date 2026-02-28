import React, {createContext, useContext, useState, useCallback} from "react";
import { ViewState } from "../types/views";

interface ViewContextType{
    viewState: ViewState;
    zoomToRamo: (id_ramo: string)=>void;
    zoomToEvaluacion: (id_ramo: string, id_evaluacion: string)=>void;
    zoomOut: ()=>void;
    zoomHome: ()=>void;
    getLevel: ()=>void;
}

const viewContext = createContext<ViewContextType | null>(null);

export const ViewProvider: React.FC<{children: React.ReactNode}>=({children})=>{
    const[viewState, setViewState]= useState<ViewState>({
        level: 'home'
    });

    const[history, setHistory] = useState<ViewState[]>([]);

    const zoomToRamo = useCallback((id_ramo: string | null)=>{
        console.log("vista al ramo con id", id_ramo);

        setHistory(prev => [...prev, viewState]);

        setViewState({
            level: 'ramo',
            selectedRamo: id_ramo
        });

    },[viewState]);

    const zoomToEvaluacion = useCallback((id_ramo:string | null, id_evaluacion: string | null)=>{
        console.log("vista a la evaluacion con id: ", id_evaluacion, " perteneciente a: ", id_ramo);

        setHistory(prev => [...prev, viewState]);

        setViewState({
            level: 'evaluacion',
            selectedRamo: id_ramo,
            selectedEvaluacion: id_evaluacion
        });
    }, [viewState]);

    const zoomOut = useCallback(()=>{
        if(history.length > 0){
            const prevState = history[history.length -1];
            setHistory(prev => prev.slice(0, -1));
            setViewState(prevState);
        }
        else{
            if(viewState.level==='evaluacion'){
                setViewState({
                    level: 'ramo',
                    selectedRamo: viewState.selectedRamo
                });
            }
            else if(viewState.level==='ramo'){
                setViewState({
                    level: 'home'
                })
            }
        }
    }, [viewState, history]);

    const zoomHome = useCallback(()=>{
        setHistory([]);
        setViewState({
            level: 'home'
        })
    }, []);

    const getLevel = useCallback(()=>{
        
        const path=['home'];

        if(viewState.selectedRamo){
            path.push(`Ramo: ${viewState.selectedRamo}`);
        }

        if(viewState.selectedEvaluacion){
            path.push(`Evaluacion: ${viewState.selectedEvaluacion}`);
        }
        return path;
    }, [viewState]);

    return(
        <viewContext.Provider value={{
            viewState,
            zoomHome,
            zoomOut,
            zoomToEvaluacion,
            zoomToRamo,
            getLevel
        }}>
            {children}
        </viewContext.Provider>
    );
};

export const useView=()=>{
    const context = useContext(viewContext);
    if(!context){
        throw new Error("viewContext debe ser usado ")
    }
    return context;
};
