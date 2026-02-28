
import { Ramo, Evaluacion } from "../../types/basics"
import { levels } from "../../types/views"
import { LogicRamoKPI } from "../../utils/ramosLogic";
import React from "react";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Pie,
  ResponsiveContainer, 
  Cell,
  ReferenceLine,
  ReferenceArea,
  LabelList,
  PieChart
} from 'recharts';

interface ramoKPIProps{

    ramo: Ramo,
    level: levels
}

const RamoKPI: React.FC<ramoKPIProps> = ({ramo , level}) =>{
    
    const {graficos, porcRendidoT, ramoPonderacion, currentPercent, promedioPonderado} = LogicRamoKPI(ramo);

    if(level === 'ramo'){
        return(
            <div
                className="bg-white w-91 h-147 rounded-lg shadow-lg flex flex-col 
                hover:bg-green-100 transition-all duration-300 group
            ">
                <h3 className="bg-green-600 text-white flex justify-center items-start text-5xl p-3">Rendimiento</h3>

                <div className="relative w-full h-4/4 flex justify-center items-center p-4 overflow-x-hidden">

                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={graficos}
                                innerRadius={60}
                                outerRadius={110}
                                stroke="none"
                            >                                
                                {graficos.map((entry, i) =>(
                                    <Cell key = {`cell-${i}`} fill={entry.fill}/>
                                ))}
                            </Pie>

                            <Tooltip
                                formatter={(value: number | string | undefined) =>{
                                    if(typeof value === 'number'){
                                        return [`${value.toFixed(1)}%`, 'Peso del ramo'];
                                    }
                                    return ['0.0%', 'Peso del ramo'];
                                }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            />

                        </PieChart>
                    </ResponsiveContainer>
                    <div className="top-0 left-0 absolute w-full h-full flex flex-col justify-center items-center pointer-events-none">

                            <span className="text-3xl font-bold text-gray-800">
                                {Number(porcRendidoT.toFixed(2))}%
                            </span>   

                            <span className="text-[11px] text-gray-800z font-mono tracking-widest mt-1 uppercase">
                                Rendido
                            </span>                                                                                              
                    </div>
                </div>
                <div className=" top-0 left-0 h-3/7 relative grid grid-cols-3 text-[18px] p-3 items-between ">

                    <div>Nombre</div>
                    <div>Peso</div>
                    <div>Ponderacion</div>
                    
                    {ramoPonderacion.map((stats) =>(
                        <React.Fragment key={stats.id}>
                            <div>{stats.nombre}</div>
                            <div>{stats.peso}%</div>
                            <div>{stats.ponderacion.toFixed(2)}</div>
                        </React.Fragment>
                    ))}
                    
                    <div>total</div>
                    <div>{currentPercent}%</div>
                    <div>{promedioPonderado.toFixed(1)}</div>

                </div>
            </div>
        )   
    }
    else{
        return(
            <div className="relative flex flex-col top-0 left-0 h-121 w-full">

                <div className="flex flex-row justify-between">

                    <div className="text-[12px] flex p-2">
                        ID: {ramo.id_ramo}
                    </div>

                </div>

                <div className=" text-9xl flex h-94 w-full justify-center items-center">{promedioPonderado.toFixed(1)}</div>
                
                <div className=" w-full flex-1 bottom-0">
                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart
                            layout="vertical"
                            data={[{name: "rendido", value: porcRendidoT}]}
                            margin={{left: 20, right: 20}}
                        >
                            <XAxis type="number" domain={[0, 100]} hide/>
                            <YAxis dataKey="name" type="category" hide/>
                            <Tooltip cursor={{fill: 'transparent'}}/>

                            <Bar
                                dataKey='value'
                                radius={[10, 10 ,10, 10]}
                                barSize={20}
                                fill={'#0B68F4'}
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
                        </BarChart>                    
                    </ResponsiveContainer>
                </div>
            </div>
        )
    }
}

export default RamoKPI