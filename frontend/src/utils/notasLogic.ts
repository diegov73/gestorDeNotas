import { Evaluacion, Nota } from "../types/basics";

interface showNotas{
    id: string,
    valor: string | number
}

export const LogicKPIs = (eva: Evaluacion) =>{

    const notas: Nota[] = eva.notas || [];

    const cantidadTotal: number = eva.cantidad_notas;
    const cantidadActual: number = notas.length;
    const cantidadRestante: number = cantidadTotal - cantidadActual;

    const pesoAcc: number = notas.reduce((acc, n: Nota) => {
        const p = Number(n.peso) || 0;
        return acc + (p > 0 ? p : 0);
    }, 0);

    const notasSinPeso: number = notas.filter(n => (Number(n.peso) || 0) === 0).length + cantidadRestante;

    const pesoRest: number = 100 - pesoAcc;

    const pesoDinamico: number = notasSinPeso > 0 ? pesoRest / notasSinPeso : 0;

    let notaAcumulada: number = 0;
    let sumaPesosRendido: number = 0;

    notas.forEach(nota =>{
        const pesoReal = Number(nota.peso) || 0;
        const pesoAplicado: number = pesoReal > 0 ? pesoReal : pesoDinamico;
        notaAcumulada += nota.valor * (pesoAplicado / 100);
        sumaPesosRendido += pesoAplicado;
    });

    const promedioActual: number = sumaPesosRendido > 0 ? (notaAcumulada / (sumaPesosRendido / 100)) : 0;

    const puntajeFaltanteParaAprovar: number = 4.0 - notaAcumulada;    
    
    const pesofaltanteTotal: number = 100 - sumaPesosRendido;

    let notaNeeded: number = 0;
    if(pesofaltanteTotal > 0){
        notaNeeded = puntajeFaltanteParaAprovar / (pesofaltanteTotal / 100);
    }

    const maxPosible: number = notaAcumulada + (7.0 * (pesofaltanteTotal / 100));

    const progreso = cantidadTotal > 0 ? ((cantidadActual / cantidadTotal) * 100).toFixed(0) : 0;
    const hasPassed: boolean = notaNeeded <= 0 || notaAcumulada >= 4.0;
    const evaHasFinished: boolean = cantidadRestante === 0;

    const notasResumen: showNotas[] = notas.map((ev) =>({
            id: ev.id_nota!,
            valor: ev.valor
    }))
    if(notasResumen.length < cantidadTotal){
        for(let i: number = 0 ; i < cantidadRestante; i++){
            notasResumen.push({
                id:crypto.randomUUID(),
                valor: '--'
            })
        }
    }

    return{
        promedioActual: parseFloat(promedioActual.toFixed(2)),
        notaAcumulada: parseFloat(notaAcumulada.toFixed(2)),
        notaNeeded: parseFloat(notaNeeded.toFixed(2)),
        maxPossible: parseFloat(maxPosible.toFixed(2)),
        progreso,
        hasPassed,
        evaHasFinished,
        notasResumen
    };
};