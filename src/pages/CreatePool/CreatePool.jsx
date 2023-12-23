import React from 'react';
import ModalContainer from '../../components/Modal/ModalContainer';

export default function CreatePool() {
	return (
		<ModalContainer title={'Create Pool'} backTo={'/pools'}>
			New Page
		</ModalContainer>
	);
}
