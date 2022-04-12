import { Button } from '@mui/material';
import * as React from 'react';

export interface IIpcSampleProps {
}

export function IpcSample (props: IIpcSampleProps) {

	const click = () => {
		(window as any).ipc.eFunc('hoge');
	}

	return (
		<div>
		<Button onClick={click} variant='contained'>ipc send</Button>
		</div>
	);
}
