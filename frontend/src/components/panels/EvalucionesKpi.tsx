import { Evaluacion, Nota } from "../../types/basics"
import { LogicKPIs } from "../../utils/notasLogic";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  ReferenceLine,
  ReferenceArea,
  LabelList
} from 'recharts';

import { levels } from "../../types/views";

interface evaKPIProps{
    
    eva: Evaluacion,
    level: levels
}

const EvaKPI: React.FC<evaKPIProps> = ({eva, level}) =>{

    const stats = LogicKPIs(eva)
    const notas: Nota[] = eva.notas;

    const {
        promedioActual: promedio,
        notaAcumulada: actual,
        maxPossible: maxPosible,
        progreso,
        hasPassed: hasPasssed,
        notaNeeded,
        evaHasFinished,
        notasResumen
    } = stats;



    const data: any[] = [];
    let thereNotaNeeded: boolean = false;

    for(let i: number = 0; i < eva.cantidad_notas; i ++){
        if(notas[i]){
            data.push(notas[i]);
        }
        else{
            if(notaNeeded >= 0 && notaNeeded <= 7 && thereNotaNeeded === false){
                thereNotaNeeded = true;
                data.push({
                    nombre: "pass",
                    valor: notaNeeded
                });
            }
            else{
                data.push({
                    nombre: "",
                    valor: 0
                })
            }
        }
    }

    if(level === 'ramo'){

        const dataProgreso = [{
            name: 'progreso', value: stats.progreso, total: 100
        }];

        return(
            <div className="flex-col flex w-80% h-full pb-12">
                
                <div className="flex flex-row justify-between">

                    <div className="text-[12px] flex p-2">
                        ID: {eva.id_evaluacion}
                    </div>

                    <div className="text-[25px] flex p-2">
                        {eva.peso}%
                    </div>
                </div>

                <div className="text-9xl flex h-full w-full justify-center items-center">
                    {promedio.toFixed(1)}
                </div>

                <div className="flex flex-row w-full mb-2 mt-4">
                    {notasResumen.map((grade, i, list)=>(
                        <div
                            className= "relative flex flex-1 justify-center items-center" 
                            key={grade.id}
                        >
                            <div className="text-[18px]">
                                {grade.valor} 
                            </div>
                            {(i !== list.length - 1) && (
                                <span className="absolute right-0 text-gray-300 select-none">
                                    |
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="w-full h-15 mt-auto">
                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart
                            layout="vertical"
                            data={dataProgreso}
                            margin={{left: 20, right: 20}}
                        >

                            <XAxis type="number" domain={[0, 100]} hide/>

                            <YAxis dataKey="name" type="category" hide/>

                            <Tooltip cursor={{fill: 'transparent'}}/>

                            <Bar
                                dataKey='value'
                                radius={[10, 10 ,10, 10]}
                                barSize={20}
                                fill={promedio > 4 ? '#079C36' : '#F52727'}
                                background={{ fill: '#e5e7eb', radius: 10 }}
                            >

                                <LabelList
                                    dataKey="value"
                                    position="center"
                                    fill="white"
                                    fontWeight="bold"
                                    fontSize={14}
                                    formatter={(val: any) => `${val}%`}
                                />
                                    
                            </Bar>
                            <Cell fill={stats.hasPassed ? '#22c55e' : '#3b82f6'} />
                        </BarChart>                        
                    </ResponsiveContainer>
                </div>

            </div>
        )
    }
    else{
        return(
            <div>
            <div
                className="relative bg-white w-91 h-147 rounded-lg shadow-lg flex flex-col 
                hover:bg-green-100 transition-all duration-300 group
                "
                >
                <h3 className="bg-green-600 text-white flex justify-center items-start text-5xl p-3">Rendimiento</h3>

                <ResponsiveContainer width="100%" height="60%">

                    <BarChart data={data} margin={{left:-28, right: 20, top: 20}}>

                        <YAxis
                            type="number"
                            domain={[0, 7]}
                            ticks={[1, 2, 3, 4, 5, 6, 7]}
                            interval={0}
                            stroke="#4b5563"
                            tick={{ fill: '#000000', fontSize: 15 }}
                            />

                        <XAxis
                            dataKey="nombre"
                            stroke="#4b5563"
                            tick={{fill: 'black', fontSize: 15}}
                            />

                        <ReferenceLine
                            y={promedio}
                            stroke="black"
                            label={{
                                value: "Promedio",
                                fontSize: 15,
                                fill: 'black',
                                position: 'top'
                            }}
                            />

                        <ReferenceLine
                            y={actual}
                            stroke='black'
                            strokeDasharray="3 3"
                            label={{
                                value: "Acumulado",
                                fontSize: 15,
                                fill: 'black',
                                position: 'bottom'
                            }}
                            />

                        <ReferenceArea
                            y1={0}
                            y2={4}
                            fill="rgba(255, 20, 20, 0.4)"
                            />

                        <ReferenceArea
                            y1={5}
                            y2={4}
                            fill="rgba(20, 20, 255, 0.4)"
                            />

                        <Tooltip
                            cursor={{fill: 'transparent'}}
                            />

                        <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                            {data.map((nota, index) =>(
                                
                                <Cell
                                key={`cell-${index}`}
                                fill={(nota.nombre === 'pass') ? '#f59e0b' : ((nota.valor < 4) ? '#ef4444' : '#22c55e')}
                                />
                            ))}
                        </Bar>

                    </BarChart>
                </ResponsiveContainer>

                {!evaHasFinished ?(
                    
                    <div className="flex flex-col justify-between items-between h-38 pl-3 pr-3  divide-y divide-gray-400">

                    <h1 className="text-[20px] pl-4">
                        Promedio: {promedio.toFixed(2)}
                    </h1>
                    
                    <h1 className="text-[20px] pl-4">
                        Acumulado: {actual.toFixed(2)}
                    </h1>

                    <h1 className="text-[20px] pl-4">
                        Maxima: {maxPosible.toFixed(2)}
                    </h1>

                    <h1 className="text-[20px] pl-4">
                        Progreso: {progreso}%
                    </h1>

                    <h1 className={`text-[20px] pl-4 ${hasPasssed ? 'bg-blue-500 rounded-2xl': ''}`}>
                        {(hasPasssed) ? 'Has pasado' : `Se necesita un ${notaNeeded.toFixed(2)}`}
                    </h1>

                </div>
                ):(
                    <div className="flex flex-col justify-center items-center">

                        <h1 className="p-2 text-[24px]">
                            {eva.nombre} terminado con:
                        </h1>
                        <h1 className="p-2 text-6xl">
                            {promedio.toFixed(2)}
                        </h1>

                    </div>
                )
                }
            </div>
        </div>
    )
    }
}

export default EvaKPI