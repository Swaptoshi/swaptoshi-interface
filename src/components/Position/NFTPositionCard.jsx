import React from 'react';
import PrimaryCard from '../Card/PrimaryCard';
import { getIPFSUrl } from '../../utils/ipfs/url';

export default function NFTPositionCard({ image, ipfsURL }) {
	return (
		<PrimaryCard
			width="100%"
			height="100%"
			className="sc-aXZVg Card-sc-a1e3c85c-0 Card__DarkCard-sc-a1e3c85c-4 gFAiiM frINir iqvqwM"
			style={{
				minWidth: '340px',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				justifyContent: 'space-around',
			}}
		>
			<div className="PositionPage__NFTGrid-sc-f1e5edbd-10 gGqapu">
				<canvas
					className="PositionPage__NFTCanvas-sc-f1e5edbd-11 hOKIdu"
					width="464"
					height="800"
					style={{ width: '232px', height: '400px' }}
				></canvas>
				<img src={image} hidden="" className="PositionPage__NFTImage-sc-f1e5edbd-12 apbUF" />
			</div>
			<a
				href={getIPFSUrl(ipfsURL)}
				target={'_blank'}
				rel="noreferrer"
				style={{ color: 'var(--model-btn-hover)' }}
			>
				View on IPFS
			</a>
		</PrimaryCard>
	);
}
