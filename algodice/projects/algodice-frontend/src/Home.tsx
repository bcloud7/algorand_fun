// src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import AppCalls from './components/AppCalls'
import RollDice from './components/Dice'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
  const [openDiceRolling, setOpenDiceRolling] = useState<boolean>(false)
  const [alwaysWin, setAlwaysWin] = useState<boolean>(false)
  const [alwaysLose, setAlwaysLose] = useState<boolean>(false)
  const { activeAddress } = useWallet()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleAppCallsModal = (alwaysWin, alwaysLose) => {
    setAlwaysWin(alwaysWin)
    setAlwaysLose(alwaysLose)
    setAppCallsDemoModal(!appCallsDemoModal)
  }

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal)
  }

  const toggleDiceRolling = () => {
    setOpenDiceRolling(!openDiceRolling)
  }

  return (
    <div className="hero min-h-screen bg-teal-400">
      <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-auto">
        <div className="max-w-md">
          <h1 className="text-4xl">
            Welcome to <div className="font-bold">Classic Dice Rolling Game! 🎲</div>
          </h1>
          <br />

          <div className="grid">
            {activeAddress && (
              <button
                data-test-id="getting-started"
                className="btn btn-primary m-2"
                onClick={toggleDiceRolling}
              >
                Roll Dice!
              </button>
            )}

            <div className="divider" />
            <button data-test-id="connect-wallet" className="btn m-2" onClick={toggleWalletModal}>
              Wallet Connection
            </button>

            <div className="divider" />


            {activeAddress && (
              <>
                <p className="py-6">
                  Following options are for dev testing purpose
                </p>
                <button data-test-id="transactions-demo" className="btn m-2" onClick={toggleDemoModal}>
                  Transactions Demo
                </button>
              </>
            )}

            {activeAddress && (
              <button data-test-id="appcalls-demo" className="btn m-2" onClick={() => toggleAppCallsModal(false, true)}>
                Roll to Lose
              </button>
            )}

           {activeAddress && (
              <button data-test-id="appcalls-demo" className="btn m-2" onClick={() => toggleAppCallsModal(true, false)}>
                Roll to Win
              </button>
            )}
          </div>

          <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
          <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
          <AppCalls openModal={appCallsDemoModal} alwaysWin={alwaysWin} alwaysLose={alwaysLose} setModalState={setAppCallsDemoModal} />
          <RollDice openModal={openDiceRolling} closeModal={setOpenDiceRolling} />
        </div>
      </div>
    </div>
  )
}

export default Home
