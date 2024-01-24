import React from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from '../../components/Forms/TextInput';
import SecondaryButton from '../../components/Button/SecondaryButton';
import { FileUploader } from 'react-drag-drop-files';
import WalletActionButton from '../../components/Button/WalletActionButton';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import { codec } from '@liskhq/lisk-codec';
import { factoryMetadataSchema } from '../../utils/schema/token_factory_create_metadata.js.js';
import { useTransactionModal } from '../../context/TransactionModalProvider';
import { useChain } from '../../context/ChainProvider';
import { getFactoryIsAvailable, postFactoryCreate } from '../../service/factory';
import ModalContainer from '../../components/Modal/ModalContainer.jsx';
import { useDebouncedCallback } from 'use-debounce';
import { tryToast } from '../../utils/toast/tryToast.js';
import TextButton from '../../components/Button/TextButton.jsx';

const CreateToken = () => {
	const navigate = useNavigate();
	const { auth, senderPublicKey } = useWalletConnect();
	const { sendTransaction } = useTransactionModal();
	const { selectedService } = useChain();

	const [showAdvanced, setShowAdvanced] = React.useState(false);
	const [logoError, setLogoError] = React.useState('');
	const [availabilityError, setAvailabilityError] = React.useState('');

	const [tokenName, setTokenName] = React.useState('');
	const [tokenSymbol, setTokenSymbol] = React.useState('');
	const [amount, setAmount] = React.useState('');
	const [description, setDescription] = React.useState('Token created by Swaptoshi Chain');
	const [baseDenom, setBaseDenom] = React.useState('unit');
	const [decimal, setDecimal] = React.useState('8');
	const [logo, setLogo] = React.useState();
	const [logoHex, setLogoHex] = React.useState();

	const checkNameAndSymbolAvailability = useDebouncedCallback(async () => {
		await tryToast('Check token availablility failed', async () => {
			if (tokenName && tokenSymbol) {
				const available = await getFactoryIsAvailable(
					{ tokenName, symbol: tokenSymbol },
					selectedService ? selectedService.serviceURLs : undefined,
				);
				if (available && available.data && !available.data.available) {
					setAvailabilityError('Token name and/or symbol is already taken');
				}
			}
		});
	}, 500);

	const handleTokenName = event => {
		setAvailabilityError();
		setTokenName(event.target.value);
		checkNameAndSymbolAvailability();
	};
	const handleTokenSymbol = event => {
		setAvailabilityError();
		setTokenSymbol(event.target.value);
		checkNameAndSymbolAvailability();
	};

	const handleAmount = event => setAmount(event.target.value);
	const handleDescription = event => setDescription(event.target.value);
	const handleDenomination = event => setBaseDenom(event.target.value);
	const handleDecimal = event => setDecimal(event.target.value);

	const isReady = React.useMemo(() => {
		return (
			tokenName && tokenSymbol && amount && description && baseDenom && decimal && logo && logoHex
		);
	}, [amount, baseDenom, decimal, description, logo, logoHex, tokenName, tokenSymbol]);

	const isNoError = React.useMemo(() => {
		return !availabilityError && !logoError;
	}, [availabilityError, logoError]);

	const toogleShowAdvanced = React.useCallback(() => {
		if (showAdvanced) setShowAdvanced(false);
		else setShowAdvanced(true);
	}, [showAdvanced]);

	const handleFileError = React.useCallback(e => {
		setLogoError(e);
	}, []);

	const handleChange = React.useCallback(async e => {
		setLogoHex(Buffer.from(await e.arrayBuffer()).toString('base64'));
		setLogo(URL.createObjectURL(e));
		setLogoError();
	}, []);

	const onFileDelete = React.useCallback(() => {
		setLogo();
		setLogoError();
	}, []);

	const handleSubmit = React.useCallback(
		e => {
			e.preventDefault();
			const transaction = {
				module: 'tokenFactory',
				command: 'create',
				fee: '1000000',
				params: { amount: (Number(amount) * 10 ** Number(decimal)).toString() },
				nonce: auth.nonce,
				senderPublicKey: senderPublicKey,
				signatures: new Array(auth.numberOfSignatures || 1).fill('0'.repeat(128)),
			};
			const metadata = codec
				.encode(factoryMetadataSchema, {
					tokenName,
					description,
					decimal,
					baseDenom,
					symbol: tokenSymbol,
				})
				.toString('hex');
			const logo = logoHex;

			sendTransaction({
				transaction,
				onSuccess: () => navigate('/tokens'),
				customHandler: async signed => {
					await postFactoryCreate(
						{ transaction: signed, metadata, logo },
						selectedService ? selectedService.serviceURLs : undefined,
					);
				},
			});
		},
		[
			navigate,
			amount,
			auth,
			senderPublicKey,
			tokenName,
			description,
			decimal,
			baseDenom,
			tokenSymbol,
			logoHex,
			sendTransaction,
			selectedService,
		],
	);

	return (
		<ModalContainer
			title={'Create Token'}
			backTo={'/tokens'}
			topRightComponent={
				<TextButton onClick={toogleShowAdvanced}>
					{showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
				</TextButton>
			}
		>
			<form onSubmit={handleSubmit}>
				<div className="Column__AutoColumn-sc-72c388fb-2 erfjwt">
					<div
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
						}}
					>
						{logo ? (
							<div
								style={{
									width: '120px',
									height: '200px',
									margin: 'auto',
									padding: '8px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
								}}
							>
								<img
									src={logo}
									style={{
										width: '100px',
										height: '100px',
										borderRadius: '100%',
										overflow: 'hidden',
										objectFit: 'cover',
										margin: 'auto',
									}}
									alt="coin"
								/>
								<SecondaryButton
									onClick={onFileDelete}
									style={{ margin: 'auto', marginTop: '8px' }}
								>
									delete
								</SecondaryButton>
							</div>
						) : (
							<FileUploader
								multiple={false}
								required
								types={['png']}
								onTypeError={handleFileError}
								maxSize={0.512}
								onSizeError={handleFileError}
								handleChange={handleChange}
								classes="custom-file-upload"
							>
								<div>
									<div style={{ width: '80px', margin: 'auto' }}>
										<svg
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											style={{ color: 'var(--text-3)' }}
										>
											<path
												d="M12 17L12 10M12 10L15 13M12 10L9 13"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M16 7H12H8"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
											/>
											<path
												d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
											/>
										</svg>
									</div>
									<div
										style={{
											textAlign: 'center',
											marginTop: '8px',
											color: 'var(--text-3)',
										}}
									>
										select or drop token icon here
										<br />
										(.png only, Max 512kb)
										{logoError && <div style={{ color: 'var(--red)' }}>{logoError}</div>}
									</div>
								</div>
							</FileUploader>
						)}
					</div>

					<TextInput
						style={{
							border: availabilityError ? `1px solid var(--red)` : undefined,
						}}
						fontSize="20px"
						type="text"
						placeholder={'Token Name'}
						onChange={handleTokenName}
						value={tokenName}
					/>

					<TextInput
						style={{
							border: availabilityError ? `1px solid var(--red)` : undefined,
						}}
						inputstyle={{
							textTransform: tokenSymbol.length > 0 ? 'uppercase' : undefined,
						}}
						fontSize="20px"
						type="text"
						pattern="^[a-zA-Z0-9]+$"
						minLength={1}
						maxLength={20}
						placeholder={'Token Symbol'}
						onChange={handleTokenSymbol}
						value={tokenSymbol}
					/>

					<TextInput
						className="no-arrow"
						fontSize="20px"
						type="number"
						pattern="^[0-9]+$"
						placeholder={'Supply'}
						onChange={handleAmount}
						value={amount}
					/>

					{showAdvanced && (
						<>
							<TextInput
								fontSize="20px"
								type="text"
								placeholder={'Description'}
								onChange={handleDescription}
								value={description}
							/>
							<TextInput
								fontSize="20px"
								type="text"
								placeholder={'Denomination'}
								onChange={handleDenomination}
								value={baseDenom}
							/>
							<TextInput
								className="no-arrow"
								fontSize="20px"
								type="number"
								placeholder={'Decimal'}
								onChange={handleDecimal}
								value={decimal}
							/>
						</>
					)}
					<WalletActionButton
						disabled={!isReady || !isNoError}
						type="submit"
						style={{ height: '60px' }}
					>
						Create Token
					</WalletActionButton>

					{availabilityError && (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								marginTop: '16px',
								color: 'var(--red)',
							}}
						>
							<i className="text ri-error-warning-line" style={{ color: 'var(--red)' }}></i>
							<div
								style={{
									color: 'var(--red)',
									fontWeight: 200,
									fontSize: '12px',
									marginLeft: '8px',
								}}
							>
								{availabilityError}
							</div>
						</div>
					)}
				</div>
			</form>
		</ModalContainer>
	);
};

export default CreateToken;
