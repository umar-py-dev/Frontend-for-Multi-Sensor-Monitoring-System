import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Label, ReferenceLine } from 'recharts';

import { LoadingService } from '../services/loadingService';
import { ErrorService } from '../services/errorService';


const Graph = (props) => {

    const handleLoading = LoadingService()

    if (props.data === 'err' || !props.data || props.data.length === 0) {
        return <div className="p-4 flex justify-center">No data available</div>
    }

    const formattedDate = (tick) =>{
        try {
            const date = new Date(tick);
            return date.toLocaleString('en-US', { 
                dateStyle: 'medium' 
            })
        } catch (e) {
            return tick;
        }
    }
    return (
        <AreaChart
        style={{ width: '100%', maxWidth: '1000', maxHeight: '55vh', aspectRatio: 1.618 }}
        responsive
        data={[...props.data].reverse()} 
        margin={{
            top: 20,
            right: 0,
            left: 0,
            bottom: 0,
        }}
        onContextMenu={(_, e) => e.preventDefault()}
        >
        <CartesianGrid strokeDasharray="3 3" />

        <ReferenceLine y={props.maxRefrence} stroke="red" strokeDasharray="3 3" label={`Max ${props.maxRefrence}`} />
        <ReferenceLine y={props.minRefrence} stroke="red" strokeDasharray="3 3" label={`Min ${props.minRefrence}`} />    

        <XAxis dataKey={props.XAxis} 
        tickFormatter={formattedDate}/>
        <YAxis width="auto" />
        <Tooltip 
            labelFormatter={(label) => new Date(label).toLocaleString('en-US', { 
                dateStyle: 'medium', 
                timeStyle: 'medium' 
            })} 
        />
        <Area type="monotone" dataKey={props.YAxis} stroke="blue" fill="blue" />
        
        </AreaChart>
    );
    };

export default Graph
