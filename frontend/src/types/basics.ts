export interface Nota{
    id_nota?: string,
    nombre: string,
    peso?: number,
    valor: number,
    fecha?: string,
    color?: string
}

export interface Evaluacion{
    id_evaluacion?: string,
    nombre: string,
    peso: number,
    cantidad_notas: number,
    color?: string,
    notas: Nota[]
}

export interface Ramo{
    id_ramo?: string,
    nombre: string,
    nota_aprobado: number,
    nota_examen: number,
    color?: string,
    evaluaciones: Evaluacion[]
}