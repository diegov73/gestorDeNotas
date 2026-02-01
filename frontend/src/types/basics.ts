export interface Nota{
    id?: number,
    nombre: string,
    peso?: number,
    nota: number,
    fecha?: string
}

export interface Evaluacion{
    id?: number,
    nombre: string,
    peso: number,
    cantidadNotas: number,
    notas: Nota[]
}

export interface Ramo{
    id?: number,
    nombre: string,
    nota_aprobado: number,
    nota_examen: number,
    evaluaciones: Evaluacion[]
}