import React, { useEffect, useState } from 'react';
import { modalService } from 'src/app/components/commons/ModalListener';
import ImportModal from 'src/app/components/account/ImportModal';
import Lottie from 'react-lottie';
// import * as step1Json from 'src/assets/jsons/winning.json';
import * as loadingJson from 'src/assets/jsons/cube-loader.json';
import metamaskLogo from 'src/assets/images/logos/metamask.svg';
import walletConnect from 'src/assets/images/logos/wallet-connect.svg';
import walletLink from 'src/assets/images/logos/wallet-link.svg';
import ImageSideUp from 'src/assets/images/logos/env-rafiki.png';
import LogoText from 'src/assets/images/logos/logo_text.png';

import { formatAddress, formatBigNumber, getAnimatedJsonOptions, displayFormattedNumber } from 'src/app/utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchClaimableAmount,
    fetchFirstUnlockAmount,
    fetchLockedAmount,
    fetchReleasedAmount,
    getFirstUnlockTxObject,
    getUnlockTxObject,
} from 'src/app/services/web3/Web3Service';
import { fetchContracts, fetchMerkleProof } from 'src/app/services/web3/apiService';
import { WALLET_TYPES } from 'src/app/configs/constants';
import { clearAccount } from 'src/app/actions/accountAction';
import ENV from 'src/app/configs/env';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { setContracts, setSelectedContract } from 'src/app/actions/globalAction';
import { ContractType } from 'src/app/types/tx-type';
import { TEXT_WORKS_CONFIG } from './txtHome';
import Footer from '../commons/footer';

export default function Home() {
    const dispatch = useDispatch();

    const { address, wallet, type } = useSelector((state: any) => state.account);
    const { contracts, selectedContract } = useSelector((state: any) => state.global);

    const [isLoading, setIsLoading] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimableAmount, setClaimableAmount] = useState(0);
    const [claimedAmount, setClaimedAmount] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isFirstUnlock, setIsFirstUnlock] = useState(true);
    const [proofData, setProofData] = useState();
    const [latestTxHash, setLatestTxHash] = useState('');

    useEffect(() => {
        setupContracts();
        document.getElementsByClassName('layout')[0].classList.add('home__layout');
        document.getElementsByClassName('decor--bot-right')[0].remove();
    }, []);

    useEffect(() => {
        if (!address || !selectedContract) return;
        setupData(address, selectedContract.name, selectedContract.contract);
    }, [address, selectedContract, dispatch]);

    async function setupContracts() {
        const result = await fetchContracts();
        if (result.length > 0) {
            dispatch(setContracts(result));

            if (!selectedContract) {
                dispatch(setSelectedContract(result[0]));
            }
        }
    }

    async function setupData(address: string, contractName: string, contractAddress: string) {
        setIsLoading(true);

        try {
            const proofResult = await fetchMerkleProof(contractName, address);
            const lockedAmount: number = await fetchLockedAmount(address, contractAddress);
            let total = proofResult.amount;
            let claimed, claimable;

            if (!proofResult.proof && !lockedAmount) {
                setTotalAmount(0);
                setClaimedAmount(0);
                setClaimableAmount(0);

                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);

                return;
            }

            if (lockedAmount === 0) {
                const firstUnlockAmount: number = await fetchFirstUnlockAmount(proofResult.amount, contractAddress);

                claimed = 0;
                claimable = firstUnlockAmount;
            } else {
                setIsFirstUnlock(false);

                if (!total) total = lockedAmount;
                claimed = await fetchReleasedAmount(address, contractAddress);
                claimable = await fetchClaimableAmount(address, contractAddress);
            }

            setTotalAmount(+formatBigNumber(total));
            setClaimedAmount(+formatBigNumber(claimed));
            setClaimableAmount(+formatBigNumber(claimable));
            setProofData(proofResult);
        } catch (e) {
            console.log(e.message);
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

    function openImportModal() {
        modalService.show(ImportModal);
    }

    function disconnect() {
        dispatch(clearAccount());
        setIsLoading(false);
    }

    async function claim() {
        if (isLoading) return;

        setIsClaiming(true);

        try {
            let claimTx;

            console.log('isFirstUnlock', isFirstUnlock, proofData);

            if (isFirstUnlock && proofData !== undefined) {
                // @ts-ignore
                claimTx = getFirstUnlockTxObject(address, proofData.index, address, proofData.amount, proofData.proof, selectedContract.contract);
            } else {
                claimTx = getUnlockTxObject(address, address, selectedContract ? selectedContract.contract : '');
            }

            const txHash = await wallet.makeTransaction(claimTx);
            setLatestTxHash(txHash);
        } catch (e) {
            console.log(e);
        }

        setIsClaiming(false);
    }

    function getWalletImage() {
        if (type === WALLET_TYPES.WALLET_CONNECT) {
            return walletConnect;
        } else if (type === WALLET_TYPES.WALLET_LINK) {
            return walletLink;
        } else {
            return metamaskLogo;
        }
    }

    function handleChangeContract(event: React.ChangeEvent<{ value: any }>) {
        const contractAddr = event.target.value;
        const selectedContract = contracts.find((contract: ContractType) => {
            return contract.contract === contractAddr;
        });
        dispatch(setSelectedContract(selectedContract));
    }

    return (
        <React.Fragment>
            <div className="home">
                <div className="decor decor--bot-right decor--bot-right-home" />
                <div className="home__content">
                    <img className="home__logo" alt="logo" src={LogoText} />
                    <div className="home__side-wrap">
                        <div className="home__title mb-4">NFTify Distribution Portal</div>
                        {!address && (
                            <div className="slide-up">
                                {/* <Lottie
                                height={220}
                                width={220}
                                isClickToPauseDisabled={true}
                                options={getAnimatedJsonOptions(step1Json)}
                                style={{ margin: '0px auto 35px' }}
                            /> */}
                                <img src={ImageSideUp} />
                                <div className="home__subtitle mt-3">Claim Your Vesting</div>
                                <div className="home__desc">
                                    Let us detect if you have any unclaimed NFTify in seed or private round by connecting to your wallet first.
                                </div>
                            </div>
                        )}

                        {address && (
                            <div className="fade-in">
                                <div className="home__address">
                                    <img style={{ width: 16 }} src={getWalletImage()} alt="wallet" />
                                    <span>{formatAddress(address, 8, -6)}</span>
                                </div>
                                <div className="home__disconnect" onClick={disconnect}>
                                    Disconnect
                                </div>

                                <div className="mt-5" style={{ fontSize: 12, fontWeight: 500 }}>
                                    <div>Select your Vesting Round</div>
                                    <FormControl className="mt-2" style={{ width: '50%', borderRadius: '10px' }}>
                                        <Select labelId="vesting-round" value={selectedContract.contract} onChange={handleChangeContract}>
                                            {contracts.map((contract: any, index: number) => {
                                                return (
                                                    <MenuItem value={contract.contract} key={index}>
                                                        {contract.name}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </div>

                                {latestTxHash !== '' && (
                                    <div className="mt-5 slide-up">
                                        <div className="mb-2 fw-medium">Tx Hash:</div>
                                        <a
                                            className="home__link"
                                            href={`${ENV.URLS.ETHERSCAN}/tx/${latestTxHash}`}
                                            target="_blank"
                                            rel="noreferrer noopener">
                                            {formatAddress(latestTxHash, 10, -8)}
                                        </a>
                                    </div>
                                )}

                                {isLoading && (
                                    <div>
                                        <Lottie
                                            height={150}
                                            width={220}
                                            style={{ marginBottom: '50px' }}
                                            isClickToPauseDisabled={true}
                                            options={getAnimatedJsonOptions(loadingJson)}
                                        />
                                    </div>
                                )}

                                {!isLoading && (
                                    <div className="fade-in">
                                        <div className="mt-6 mb-2">
                                            <span className="fw-medium mb-1 mr-1">Available:</span>
                                            <b>{displayFormattedNumber(totalAmount - claimedAmount, 4)} / {displayFormattedNumber(totalAmount, 4)} N1</b>
                                        </div>
                                        <div className="mb-2">
                                            <span className="fw-medium mb-1 mr-1">Claimed:</span>
                                            <b>{displayFormattedNumber(claimedAmount, 4)} N1</b>
                                        </div>
                                        <div className="mb-7">
                                            <span className="fw-medium mb-1 mr-1">Claimable:</span>
                                            <b>{displayFormattedNumber(claimableAmount, 4)} N1</b>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div
                            className={`btn btn--gradient ${isLoading || isClaiming ? 'disabled' : ''} ${
                                address && !claimableAmount ? 'disabled' : ''
                            }`}
                            onClick={address ? claim : openImportModal}>
                            {(isClaiming || isLoading) && <div>Loading...</div>}
                            {!isClaiming && !isLoading && <div>{address ? 'Claim' : 'Connect Wallet'}</div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="home__works-container container">
                <h2 className="home__works-title">How it works</h2>
                <div className="home__works-row row">
                    {TEXT_WORKS_CONFIG.map((item, index) => (
                        <div key={index} className="col-4">
                            <div className="home__works-icon-wrap">
                                <img src={item.icon} alt="icon-card" />
                            </div>
                            <h3 className="home__works-item-title">{item.title}</h3>
                            <h4 className="home__works-item-description">{item.description}</h4>
                            <ul className="home__works-item-list-description">
                                {item.listDescription.map((description, index) => {
                                    return <li key={index}>{description}</li>;
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
}
