import IconCash from 'src/assets/images/icons/icon_cash.svg';
import IconSelect from 'src/assets/images/icons/icon_select.svg';
import IconCheck from 'src/assets/images/icons/icon_check.svg';

export const TEXT_WORKS_CONFIG = [
    {
        icon: IconCash,
        title: "Connect Wallet",
        description: "Connect to Metamask Wallet",
        listDescription: [
            "Please install Metamask wallet extension on your browser or Metamask Mobile App on your phone.",
            "Make sure you already selected Ethereum Mainet on Metamask wallet.",
            "Make sure you already connected to your Contribution Wallet Address on Metamask.",
        ]
    },
    {
        icon: IconSelect,
        title: "Claim Your Vesting",
        description: "Select vesting round and claim",
        listDescription: [
         "Select the vesting round you would like to claim tokens.",
         "Check your token information before claim.",
         '"Available" is the remaining token balance after deducting the claimed tokens.',
         '"Claimed" is the number of tokens you already claimed.',
         '"Claimable" is the current number of tokens you allowed to claim.'
        ]
    },
    {
        icon: IconCheck,
        title: "Confirm Transaction",
        description: "Confirm to claim on Metamask",
        listDescription: [
         "Confirm paying gas fee on Metamask to proceed the claimed transaction. ",
         "After confirmation, the transaction hash will be displayed on the screen.",
         "Click on transaction hash to view detail transaction on Etherscan.",
         "Recheck your wallet and contact us if you have not received your tokens."
        ]
    }
]

