import { ArrowForward, SensorDoorOutlined } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import AddButton from '@mui/icons-material/Add';
import { Box, Button, CircularProgress, IconButton, Paper, TextField, Typography } from '@mui/material';
import * as React from 'react';

export interface ISpliterProps {
	index: number,
}

export type route = {
	srchost: string,
	dsthost: string,
	dstport: number,
}

// 必要なIPCメソッド
// Routingの常態... electron route
// Routingのリクエスト... react routeSet {enable: boolean}
// Routingテーブルの設定...react routeTable

export function Spliter (props: ISpliterProps) {

	const [routeList, setRoute] = React.useState<Array<route> >([]);
	const [routing, setRouting] = React.useState(false);

	React.useEffect(() => {

		(window as any).ipc.receive('route', (data:any) => {
			setRouting(data.enable);
		});

		(window as any).ipc.receive('routeTable', (data:any) => {
			console.log('receive route ipc');
			setRoute(data.route);
		});

		(window as any).ipc.splitReady();
	}, []);

	const reqRouting = () => {
		(window as any).ipc.routeSet({enable: true});
	}

	const reqStop = () => {
		(window as any).ipc.routeSet({enable: false});
	}

	const addRoute = () => {
		const rt: route = {
			srchost: '192.168.11.0',
			dsthost: 'localhost',
			dstport: 51001,
		}
		setRoute(routeList.concat(rt));
	}

	const removeRoute = (index: number) => {
		const list = routeList;
		list.splice(index, 1);
		setRoute(list.concat([]));
	}

	const changeSrcHost = (index: number, host: string) => {
		const list:Array<route> = routeList;
		list[index].srchost = host;
		setRoute(list.concat([]));
	}

	const changeDstHost = (index: number, host: string) => {
		const list:Array<route> = routeList;
		list[index].dsthost = host;
		setRoute(list.concat([]));
	}

	const changeDstPort = (index: number, port: number) => {
		const list:Array<route> = routeList;
		list[index].dstport = port;
		setRoute(list.concat([]));
	}

	React.useEffect(() => {
		(window as any).ipc.routeTable({table: routeList});
	}, [routeList]);


	const boxStyle = {
		display: props.index === 0 ? 'flex' : 'none',
		flexDirection: 'column',
		justifyContent: 'center',
		width: '100%',
		padding: '10px',
	}

	const textStyle = {
		margin: '5px',
	}

	const btStyle = {
		margin: '5px',
		borderRadius: '12px',
	}

	const paperStyle = {
		padding: '5px',
		borderRadius: '15px',
		marginBottom: '15px',
	}

	const paperInStyle = {
		padding: '5px',
		margin: '5px',
		borderRadius: '10px',
		marginBottom: '10px',
	}
	const splitSlotBox = {
		display: 'flex',
		justifyContent: 'left',
		alignItems: 'center',
	}

	return (
		<Box style={boxStyle as React.CSSProperties}>
		<Paper style={paperStyle}>
		
			<Typography variant='h5' style={{marginLeft: '10px'}}>Splitter</Typography>
			<Box style={{display:'flex'}}>
				<Button style={btStyle} fullWidth size='small' 
					disabled={routing}
					variant={routing ? 'outlined' : 'contained'}
					onClick={reqRouting}
					color='primary'>
					{routing ? <>now routing...<CircularProgress thickness={7} size={20}/></> : <>routing</>}
				</Button>
				<Button style={btStyle} fullWidth size='small' 
					disabled={!routing}
					variant={routing ? 'contained' : 'outlined'} 
					onClick={reqStop}
					color='info'>

					stop
				</Button>
			</Box>
			
			{routeList.map((rt, i) =>
			<Paper key={i} style={paperInStyle}>
				<Box style={splitSlotBox}>
					<TextField style={textStyle} label='source ip' size='small' value={rt.srchost} onChange={(e) => {changeSrcHost(i, e.target.value)}}/>
					<ArrowForward sx={{color: '#555'}}/>
					<TextField style={textStyle} label='dest ip' size='small' value={rt.dsthost} onChange={(e) => {changeDstHost(i, e.target.value)}} />
					<TextField type='number' style={textStyle} label='dest port' size='small' value={rt.dstport} onChange={(e) => {changeDstPort(i, parseInt(e.target.value))}} />
					<IconButton key={i} onClick={() => {removeRoute(i)}}>
						<CancelIcon sx={{color: '#aaa'}}/>
					</IconButton>
				</Box>
			</Paper>
			)}


			<IconButton onClick={addRoute}>
				<AddButton />
			</IconButton>
		</Paper>
		</Box>
	);
}

export default Spliter;