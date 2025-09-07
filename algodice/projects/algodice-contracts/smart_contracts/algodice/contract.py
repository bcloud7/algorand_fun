from algopy import (
    Account,
    ARC4Contract,
    Asset,
    Global,
    LocalState,
    Txn,
    UInt64,
    arc4,
    gtxn,
    itxn,
    op,
    subroutine,
    String,
)
# from lib_pcg import pcg128_init, pcg128_random
from algopy.arc4 import abimethod


class Algodice(ARC4Contract):

    @arc4.abimethod
    def roll_always_lose(self, pay: gtxn.PaymentTransaction) -> String:

        # Verify payment transaction
        assert pay.sender == Txn.sender, "payment sender must match transaction sender"
        assert pay.amount >= 100000, "Minimum bet size is 0.1 ALGO"

        return String("You Lose")

    @arc4.abimethod
    def roll_always_win(self, pay: gtxn.PaymentTransaction) -> String:
        # Verify payment transaction
        assert pay.sender == Txn.sender, "payment sender must match transaction sender"
        assert pay.amount >= 100000, "Minimum bet size is 0.1 ALGO"
        send_amount = pay.amount * UInt64(2) + UInt64(1000)
        itxn.Payment(amount=send_amount, receiver=Txn.sender, fee=1000).submit()

        return String("You Win")

    # @arc4.abimethod
    # def reveal(self) -> String:
    #     # TODO: use RANDOMNESS_BEACON example in https://github.com/CiottiGiorgio/verifiable-shuffle/blob/main/projects/verifiable-shuffle/smart_contracts/verifiable_shuffle/contract.py
    #     state = pcg128_init()


    @abimethod()
    def hello(self, name: String) -> String:
        return "Aha, " + name
