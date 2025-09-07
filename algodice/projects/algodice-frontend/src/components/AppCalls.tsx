import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { AlgodiceFactory } from '../contracts/Algodice'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { algo, AlgorandClient } from '@algorandfoundation/algokit-utils'
import confetti from 'canvas-confetti'

interface AppCallsInterface {
  openModal: boolean
  alwaysWin: boolean
  alwaysLose: boolean
  setModalState: (value: boolean) => void
  callbackAfterRoll: () => void
  addRecord: (amount: number, win: boolean) => void
}

const triggerConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  })
}

const AppCalls = ({ openModal, alwaysWin, alwaysLose, setModalState, callbackAfterRoll, addRecord }: AppCallsInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [contractInput, setContractInput] = useState<string>('')
  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig,
  })
  algorand.setDefaultSigner(transactionSigner)

  const sendAppCall = async () => {
    setLoading(true)

    // Please note, in typical production scenarios,
    // you wouldn't want to use deploy directly from your frontend.
    // Instead, you would deploy your contract on your backend and reference it by id.
    // Given the simplicity of the starter contract, we are deploying it on the frontend
    // for demonstration purposes.
    const factory = new AlgodiceFactory({
      defaultSender: activeAddress ?? undefined,
      algorand,
    })
    const deployResult = await factory
      .deploy({
        onSchemaBreak: OnSchemaBreak.AppendApp,
        onUpdate: OnUpdate.AppendApp,
      })
      .catch((e: Error) => {
        enqueueSnackbar(`Error deploying the contract: ${e.message}`, { variant: 'error' })
        setLoading(false)
        return undefined
      })

    if (!deployResult) {
      return
    }

    const { appClient } = deployResult

    // Create a payment transaction to pay the bet amount
    // This transaction is sent as a parameter to the roll transaction
    const paymentTxn = await appClient.algorand.createTransaction.payment({
      sender: activeAddress,
      amount: algo(Number(contractInput)),
      receiver: appClient.appAddress,
    })

    let response = undefined
    const roll = Math.floor(Math.random() * 100)
    const win = (alwaysWin || roll >= 50) && !alwaysLose
    if (!alwaysWin && !alwaysLose) {
      console.log(`You rolled: ${roll} ${win ? 'and win' : 'thus lose'}`)
    }
    if (win) {
      addRecord(Number(contractInput), true)
      triggerConfetti()
      response = await appClient.send.rollAlwaysWin({ args: { pay: paymentTxn } }).catch((e: Error) => {
        enqueueSnackbar(`Error calling the contract: ${e.message}`, { variant: 'error' })
        setLoading(false)
        return undefined
      })
    } else {
      addRecord(Number(contractInput), false)
      response = await appClient.send.rollAlwaysLose({ args: { pay: paymentTxn } }).catch((e: Error) => {
        enqueueSnackbar(`Error calling the contract: ${e.message}`, { variant: 'error' })
        setLoading(false)
        return undefined
      })
    }

    if (!response) {
      return
    }
    enqueueSnackbar(`Response from the contract: ${response.return}`, { variant: 'success' })
    callbackAfterRoll()
    setLoading(false)
    setModalState(!openModal)
  }

  return (
    <dialog id="appcalls_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Please input the bet amount</h3>
        <br />
        <input
          type="text"
          placeholder="How much Algo to gamble?"
          className="input input-bordered w-full"
          value={contractInput}
          onChange={(e) => {
            setContractInput(e.target.value)
          }}
        />
        <div className="modal-action ">
          <button className="btn" onClick={() => setModalState(!openModal)}>
            Cancel
          </button>
          <button className="btn btn-warning" onClick={sendAppCall}>
            {loading ? <span className="loading loading-spinner" /> : 'ROLL'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default AppCalls
