import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import DiceDescription from './DiceDescription'
import confetti from 'canvas-confetti'

interface DiceInterface {
  openModal: boolean
  closeModal: () => void
}

const RollDice = ({ openModal, closeModal }: DiceInterface) => {
  const { wallets, activeAddress } = useWallet()

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    })
  }

  return (
    <dialog id="connect_wallet_modal" className={`modal ${openModal ? 'modal-open' : ''}`} style={{ display: openModal ? 'block' : 'none' }}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-2xl">Roll dice!</h3>

        <div className="grid m-2 pt-5">
          {activeAddress && (
            <>
              <DiceDescription />
              <div className="divider" />
            </>
          )}

          {!activeAddress &&
            wallets?.map((wallet) => (
              <button
                data-test-id={`${wallet.id}-connect`}
                className="btn border-teal-800 border-1  m-2"
                key={`provider-${wallet.id}`}
                onClick={() => {
                  return wallet.connect()
                }}
              >
                {!isKmd(wallet) && (
                  <img
                    alt={`wallet_icon_${wallet.id}`}
                    src={wallet.metadata.icon}
                    style={{ objectFit: 'contain', width: '30px', height: 'auto' }}
                  />
                )}
                <span>{isKmd(wallet) ? 'Connect a wallet first!' : wallet.metadata.name}</span>
              </button>
            ))}
        </div>

        <div className="modal-action grid">
          <button
            className="btn"
            onClick={() => {
              closeModal()
            }}
          >
            Close
          </button>
          {activeAddress && (
            <button
              className="btn btn-warning"
              onClick={async () => {
                const roll = Math.floor(Math.random() * 6) + 1;
                if (roll > 3) {
                  console.log(`You rolled ${roll}! You Win!`);
                  triggerConfetti();
                } else if (roll <= 3) {
                console.log(`You rolled ${roll}. You Lose.`);
                }
              }}
            >
              Roll!!!
            </button>
          )}
        </div>
      </form>
    </dialog>
  )
}
export default RollDice
