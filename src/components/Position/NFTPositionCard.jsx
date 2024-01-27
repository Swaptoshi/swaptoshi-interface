import React from 'react';
import PrimaryCard from '../Card/PrimaryCard';
import { getIPFSUrl } from '../../utils/ipfs/url';
import useTokenColor from '../../utils/hook/useTokenColor';

export default function NFTPositionCard({ image, position }) {
	const token0Color = useTokenColor({ tokenId: position.token0 });
	const token1Color = useTokenColor({ tokenId: position.token1 });

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
				<img
					src={image}
					hidden=""
					className="PositionPage__NFTImage-sc-f1e5edbd-12 apbUF"
					style={{
						borderRadius: '32px',
						boxShadow: `color-mix(in srgb, ${token0Color} 20%, transparent) -30px -30px 100px, color-mix(in srgb, ${token1Color} 20%, transparent) 30px 30px 100px`,
					}}
				/>
			</div>
			<a
				href={getIPFSUrl(position.tokenURI)}
				target={'_blank'}
				rel="noreferrer"
				style={{ color: 'var(--primary)' }}
			>
				View on IPFS
			</a>
		</PrimaryCard>
	);
}
