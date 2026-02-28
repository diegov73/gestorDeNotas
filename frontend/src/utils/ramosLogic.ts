import { Ramo, Evaluacion } from "../types/basics";
import { LogicKPIs } from "./notasLogic";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
const colors = ['#49a2d6','#1a9761','#e8730b','#9a73c6','#c25a81','#04a3d0']; 

interface statsRamo{
    id: string,
    nombre: string,
    peso:number,
    ponderacion: number
}

export const LogicRamoKPI = (ramo: Ramo) =>{

    const evals: Evaluacion[] = ramo.evaluaciones;
    
    const resumenEva = evals.map((ev) =>{

        const stats = LogicKPIs(ev);
        return{   
            id: ev.id_evaluacion,
            nombre: ev.nombre,
            Promedio: stats.promedioActual,
            porcentaje: ev.peso,
            notasTotales: ev.cantidad_notas,
            notasRendidas: ev.notas.length
        }
    });

    const atLeast1: boolean = ramo.evaluaciones.length > 0;

    const currentPercent: number = evals.reduce((acc, ev) => acc + Number(ev.peso), 0);

    const is1Hundred: Boolean = currentPercent >= 100;

    const notasTotal: number = resumenEva.reduce((acc, eva) => acc + eva.notasTotales, 0);

    const notasRedidas: number = resumenEva.reduce((acc, eva) => acc + eva.notasRendidas, 0);

    const porcRendidoT: number = notasTotal > 0 ? (notasRedidas / notasTotal) * 100 : 0;

    const promedioPonderado: number = resumenEva.reduce((acc, eva) =>{
        return eva.Promedio * eva.porcentaje / 100 + acc ;
    }, 0)

    const ramoPonderacion = resumenEva.reduce<statsRamo[]>((acc, ev) =>{
        
        const ponderacion: number = ev.Promedio * ev.porcentaje / 100;

        acc.push({
            id: ev.id!,
            nombre: ev.nombre,
            peso: ev.porcentaje,
            ponderacion: ponderacion
        });

        return acc;
    }, [])

    const graficos: {name: string, value: number, fill: string}[] = [];

    resumenEva.forEach((ev, i) =>{
        const porcRendida = ev.notasTotales > 0 ? ev.notasRendidas / ev.notasTotales : 0;

        const porcCompletado = ev.porcentaje * porcRendida;
        const porcPendiente = ev.porcentaje - porcCompletado;

        const colorBase = COLORS[i % COLORS.length];
        const colorSobra = colors[i % colors.length];

        if(porcCompletado > 0){
            graficos.push({
                name: `${ev.nombre} (Rendido)`,
                value: porcCompletado,
                fill: colorBase
            });
        }
        if(porcPendiente > 0){
            graficos.push({
                name: `${ev.nombre} (Pendiente)`,
                value: porcPendiente,
                fill: colorSobra
            })
        }
        if(currentPercent < 0){
            graficos.push({
                name: 'Sin asignar',
                value: 100 - currentPercent,
                fill: '##F87C63'
            })
        }
    })

        if(currentPercent < 100){
            graficos.push({
                name: 'Disponible',
                value: 100 - currentPercent,
                fill: '#DBDBDB'
            })
        }

    return{
        resumenEva,
        currentPercent,
        is1Hundred,
        evals,
        atLeast1,
        graficos,
        porcRendidoT,
        ramoPonderacion,
        promedioPonderado
    }
}