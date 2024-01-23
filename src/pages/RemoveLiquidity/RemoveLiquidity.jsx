import React from 'react';
import * as cryptography from '@liskhq/lisk-cryptography';
import Loader from '../../components/Loader';
import ModalContainer from '../../components/Modal/ModalContainer';
import { useNavigate, useParams } from 'react-router-dom';
import SlippageAndDeadlineConfig from '../../components/Config/SlippageAndDeadlineConfig';
import TokenAvatar from '../../components/Avatar/token';
import PriceRangeLabel from '../../components/Price/PriceRangeLabel';
import WalletActionButton from '../../components/Button/WalletActionButton';
import { useDebouncedCallback } from 'use-debounce';
import { getDEXPosition, getDEXPositionValue } from '../../service/dex';
import { useChain } from '../../context/ChainProvider';
import { tryToast } from '../../utils/toast/tryToast';
import * as env from '../../utils/config/env';
import SecondaryCard from '../../components/Card/SecondaryCard';
import PositionRemovedLiquidity from '../../components/Position/PositionRemovedLiquidity';
import { decodeNFTId } from '../../utils/address/poolAddress';
import BigNumber from 'bignumber.js';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import { useTransactionModal } from '../../context/TransactionModalProvider';

export default function RemoveLiquidity() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { auth, senderPublicKey } = useWalletConnect();
	const { selectedService } = useChain();
	const { sendTransaction } = useTransactionModal();

	const [isLoading, setIsLoading] = React.useState(true);
	const [position, setPosition] = React.useState();
	const [positionValue, setPositionValue] = React.useState();
	const [removed, setRemoved] = React.useState('0');
	const [debouncedRemoved, setDebouncedRemoved] = React.useState('0');

	const [slippage, setSlippage] = React.useState('');
	const [deadline, setDeadline] = React.useState('');

	const isEverythingReady = React.useMemo(() => {
		return removed !== '0';
	}, [removed]);

	const fetchPosition = useDebouncedCallback(async () => {
		const run = async () => {
			const pos = await getDEXPosition(
				{ search: id },
				selectedService ? selectedService.serviceURLs : undefined,
			);
			if (pos && pos.data && pos.data.length > 0) {
				setPosition(pos.data[0]);
			}

			const value = await getDEXPositionValue(
				{ tokenId: id },
				selectedService ? selectedService.serviceURLs : undefined,
			);
			if (value && value.data) {
				setPositionValue(value.data.value);
			}

			setIsLoading(false);
		};

		tryToast('Fetch positions failed', run, () => setIsLoading(false));
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	React.useEffect(() => {
		fetchPosition();
	}, [fetchPosition]);

	const handleRemovedChangeDebouced = useDebouncedCallback(e => {
		setDebouncedRemoved(e);
	}, 500);

	const handleRemovedChange = React.useCallback(
		e => {
			setRemoved(e.target.value);
			handleRemovedChangeDebouced(e.target.value);
		},
		[handleRemovedChangeDebouced],
	);

	const handleRemoveLiquidity = React.useCallback(() => {
		const deadlineFactor = deadline ? deadline : Number(env.DEFAULT_DEADLINE_MINUTE);
		const slippageFactor = slippage ? slippage : Number(env.DEFAULT_SLIPPAGE);
		const { index } = decodeNFTId(position.tokenId);

		const liquidity = new BigNumber(position.liquidity).multipliedBy(removed).div(100).toFixed(0);
		const amount0 = new BigNumber(positionValue.principal0)
			.multipliedBy(removed)
			.div(100)
			.toFixed(0);
		const amount1 = new BigNumber(positionValue.principal1)
			.multipliedBy(removed)
			.div(100)
			.toFixed(0);

		const transaction = {
			module: 'dex',
			command: 'decreaseLiquidity',
			fee: '1000000',
			params: {
				poolAddress: cryptography.address
					.getAddressFromLisk32Address(position.poolAddress)
					.toString('hex'),
				tokenId: index.toString(),
				liquidity,
				amount0Min: new BigNumber(amount0)
					.minus(new BigNumber(amount0).multipliedBy(slippageFactor).dividedBy(100))
					.toFixed(0)
					.toString(),
				amount1Min: new BigNumber(amount1)
					.minus(new BigNumber(amount1).multipliedBy(slippageFactor).dividedBy(100))
					.toFixed(0)
					.toString(),
				deadline: (Math.floor(Date.now() / 1000) + deadlineFactor * 60).toString(),
			},
			nonce: auth.nonce,
			senderPublicKey: senderPublicKey,
			signatures: new Array(auth.numberOfSignatures || 1).fill('0'.repeat(128)),
		};
		sendTransaction({
			transaction,
			onSuccess: () => {
				navigate(`/pools/${id}`);
			},
		});
	}, [
		auth,
		deadline,
		id,
		position,
		positionValue,
		removed,
		sendTransaction,
		senderPublicKey,
		slippage,
		navigate,
	]);

	const SetRemovedButton = React.useCallback(value => {
		return (
			<button
				style={{
					backgroundColor: 'color-mix(in srgb, var(--connect-btn) 50%, transparent)',
					color: 'var(--btn-color)',
					border: '0px',
					padding: '4px 12px',
					height: '32px',
					borderRadius: '32px',
					overflow: 'hidden',
					fontSize: '12px',
					margin: '0px 2px',
				}}
				onClick={() => {
					setRemoved(value.toString());
					setDebouncedRemoved(value.toString());
				}}
			>
				{value.toString() === '100' ? 'Max' : `${value}%`}
			</button>
		);
	}, []);

	return isLoading ? (
		<div
			style={{
				width: '100%',
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Loader size={20} />{' '}
		</div>
	) : !position || !positionValue ? (
		<div
			style={{
				width: '100%',
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			Liquidity position not found
		</div>
	) : (
		<div>
			<ModalContainer
				title={'Remove Liquidity'}
				titleFlex={5}
				width={450}
				backTo={`/pools/${id}`}
				style={{ padding: '16px 16px' }}
				topRightComponent={
					<SlippageAndDeadlineConfig
						slippage={slippage}
						setSlippage={setSlippage}
						deadline={deadline}
						setDeadline={setDeadline}
					/>
				}
			>
				<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 PositionPage__ResponsiveRow-sc-f1e5edbd-7 dKubqp cPCYrp bIFEzi iYnZBs">
					<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 PositionPage__PositionLabelRow-sc-f1e5edbd-14 dKubqp cPCYrp kjbeBO">
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<TokenAvatar src={position.token0Logo} size={24} tokenId={position.token0} />
							<TokenAvatar
								src={position.token1Logo}
								size={24}
								tokenId={position.token1}
								style={{ marginLeft: '-10px' }}
							/>
							<div style={{ margin: '0px 4px' }} />
							<div style={{ color: 'var(--color-white)', fontSize: '20px', fontWeight: 600 }}>
								{position.token0Symbol} / {position.token1Symbol}
							</div>
						</div>
						<div style={{ flex: 1 }} />
						<PriceRangeLabel
							liquidity={position.liquidity}
							currentTick={position.poolTick}
							tickLower={position.tickLower}
							tickUpper={position.tickUpper}
						/>
					</div>
				</div>

				<SecondaryCard style={{ padding: '12px' }}>
					<div style={{ color: 'var(--text-clr)', fontSize: '16px', marginBottom: '8px' }}>
						Amount
					</div>
					<div className="flex-above-375" style={{ alignItems: 'center' }}>
						<div
							style={{
								fontWeight: 600,
								fontSize: '36px',
								flex: 1,
								marginBottom: '8px',
								color: 'var(--color-white)',
							}}
						>
							{removed}%
						</div>
						<div style={{ marginBottom: '8px' }}>
							{SetRemovedButton(25)}
							{SetRemovedButton(50)}
							{SetRemovedButton(75)}
							{SetRemovedButton(100)}
						</div>
					</div>
					<input
						type={'range'}
						value={removed}
						min={0}
						max={100}
						step={1}
						onChange={handleRemovedChange}
						style={{ width: '100%', color: 'var(--model-btn-color)' }}
					/>
				</SecondaryCard>

				<PositionRemovedLiquidity
					position={position}
					value={positionValue}
					removed={debouncedRemoved}
				/>

				<WalletActionButton
					disabled={!isEverythingReady}
					onClick={handleRemoveLiquidity}
					style={{ height: '60px' }}
				>
					{removed === '0' ? 'Enter a percent' : isLoading ? 'Loading...' : 'Remove Liquidity'}
				</WalletActionButton>
			</ModalContainer>
		</div>
	);
}
