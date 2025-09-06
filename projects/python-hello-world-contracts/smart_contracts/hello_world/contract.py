from algopy import (
    Account,
    Application,
    ARC4Contract,
    Asset,
    Global,
    String,
    Txn,
    UInt64,
    arc4,
    compile_contract,
    itxn,
)
from algopy.arc4 import abimethod


class HelloWorld(ARC4Contract):

    @abimethod()
    def payment(self) -> UInt64:
        result = itxn.Payment(amount=5000, receiver=Txn.sender, fee=1000).submit()
        return result.amount

    @abimethod()
    def hello(self, name: String) -> String:
        return "My Hello, " + name
