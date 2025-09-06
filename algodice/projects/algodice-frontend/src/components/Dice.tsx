import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import DiceDescription from './DiceDescription'

interface DiceInterface {
  openModal: boolean
  closeModal: () => void
}

const RollDice = ({ openModal, closeModal }: DiceInterface) => {
  const { wallets, activeAddress } = useWallet()

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

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
            data-test-id="close-wallet-modal"
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
              data-test-id="logout"
              onClick={async () => {
                //dice
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
