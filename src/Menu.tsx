import { Box, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Paper, TextField, Typography, useStepContext } from '@mui/material';
import * as React from 'react';

export interface IMenuProps {
}

export default function Menu (props: IMenuProps) {

	const [rPort, setRPort] = React.useState('51000');
	const [tPort, setTPort] = React.useState('52000');
	const [tHost, setTHost] = React.useState('localhost');
	const [isRec, setRec] = React.useState(false);
	const [isPlay, setPlay] = React.useState(false);
	const [dataSize, setDataSize] = React.useState(0);
	const [time, setTime] = React.useState(0);
	const [loop, setLoop] = React.useState(true);
	const [fileName, setFileName] = React.useState('newFile');

	React.useEffect(() => {
		(window as any).ipc.receive('dataSize', (data: any) => {
			setDataSize(data);
		});

		(window as any).ipc.receive('stop', (d: any) => {
			setRec(false);
			setPlay(false);
		});

		(window as any).ipc.receive('time', (t: any) => {
			setTime(t);
		});

		(window as any).ipc.receive('fileName', (t: any) => {
			setFileName(t);
		});
		
	}, []);

	const bt_rec = () => {
		setRec(true);
		(window as any).ipc.rec({
			port: rPort
		});
	}

	const bt_stop = () => {
		setRec(false);
		setPlay(false);
		(window as any).ipc.stop();
	}

	const bt_play = () => {
		setPlay(true);
		(window as any).ipc.play({
			port: tPort,
			host: tHost
		});
	}

	const bt_save = () => {
		(window as any).ipc.save();
	}
	
	const bt_load = () => {
		(window as any).ipc.load();
	}

	const changeRPort = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRPort(event.target.value);
	}
	const changeTPort = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTPort(event.target.value);
	}
	const changeTHost = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTHost(event.target.value);
	}

	const changeLoop = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLoop(event.target.checked);
		(window as any).ipc.loop(loop);
	}

	const boxStyle = {
		display: 'flex',
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

	return (
		<Box style={boxStyle as React.CSSProperties}>
			<Paper style={paperStyle}>
				<Typography variant='h5' style={{marginLeft: '10px'}}>Data:{fileName}</Typography>
				<Typography variant='body1' style={{marginLeft: '10px'}}>Size:{dataSize} bytes</Typography>
				<Typography variant='body1' style={{marginLeft: '10px'}}>Time:{time} ms</Typography>
				
				<Box style={{display: 'flex'}}>
					<Button size='small' fullWidth style={btStyle} onClick={bt_save} variant='outlined'>Save</Button>
					<Button size='small' fullWidth style={btStyle} onClick={bt_load} variant='outlined'>Load</Button>
				</Box>

			</Paper>
			<Paper style={paperStyle}>
				<TextField type="number" onChange={changeRPort} value={rPort} style={textStyle} label='port receive' size='small'/>
				<Box style={{display: 'flex'}}>
					<Button size='small' disabled={isPlay} style={btStyle} fullWidth onClick={bt_rec} color='error' variant={isRec ? 'outlined' : 'contained'}>
						{isRec ? <CircularProgress size={20} thickness={5}/> : <>rec</>}
					</Button>
					<Button size='small' disabled={isPlay} style={btStyle} fullWidth onClick={bt_stop} color='info' variant={isRec ? 'outlined' : 'contained'}>stop</Button>
				</Box>
			</Paper>
			<Paper style={paperStyle}>
				<Box style={{display: 'flex'}}>
					<TextField onChange={changeTHost} value={tHost} fullWidth style={textStyle} label='host send' size='small'/>
					<TextField type="number" onChange={changeTPort} value={tPort} fullWidth style={textStyle} label='port send' size='small'/>
				</Box>
				<Box style={{display: 'flex'}}>
					<Button size='small' disabled={isRec} style={btStyle} fullWidth onClick={bt_play} variant={isPlay ? 'outlined' : 'contained'}>
						{isPlay ? <CircularProgress size={20} thickness={5}/> : <>play</>}
					</Button>
					<Button size='small' disabled={isRec} style={btStyle} fullWidth onClick={bt_stop} color='info' variant={isPlay ? 'outlined' : 'contained'}>stop</Button>
				</Box>
				<FormGroup>
						<FormControlLabel control={<Checkbox checked={loop} onChange={changeLoop} style={{marginLeft: '10px'}}/>} label="loop" />
				</FormGroup>
			</Paper>
		</Box>
	);
}