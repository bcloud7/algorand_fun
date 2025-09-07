import { useCallback, useState } from 'react'
import { AlgodiceClient } from '../contracts/Algodice'

// Property type for listed properties
export type AccountInfo = {
  address: string
  balance: number
}

/**
 * Custom hook to fetch the connected account's info
 *
 *
 * @param appClient The FractionalRealEstateClient instance
 * @param activeAddress The address of the connected user
 * @returns An object containing:
 *   - ownedProperties: Array of { assetId, sharesOwned, property } the user owns shares in
 *   - loading: Whether the fetch is in progress
 *   - error: Any error message encountered
 *   - refresh: Function to refresh the account info
 */
export function useAccountInfo(appClient: AlgodiceClient | null, activeAddress: string | null | undefined) {
  const [accountInfo, setAccountInfo] = useState<AccountInfo>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch all properties and filter for those owned by the connected account.
   */
  const fetchAccountInfo = useCallback(async () => {
    if (!appClient) {
      setError('App is not ready. Please try again in a moment.')
      setAccountInfo(undefined)
      console.log('App is not ready. Set AccountInfo to undefined')
      return
    }
    console.log("App is ready!")
    if (!activeAddress) {
      setError('Please connect your wallet to view your owned properties.')
      setAccountInfo(undefined)
      console.log('No active address. Set AccountInfo to undefined')
      return
    }
    setLoading(true)
    setError(null)
    try {
      // Get account info
      console.log('call get account info: ')
      const accountInfo = await appClient.algorand.account.getInformation(activeAddress)
      const accountBalance = accountInfo.balance.algo
      console.log('account balance is: ', accountBalance)

      // Build a list of properties the user owns shares in
      const aInfo: AccountInfo = {
        address: activeAddress,
        balance: accountBalance,
      }
      setAccountInfo(aInfo)
      console.log("set account info to:")
      console.log(aInfo)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch account info')
      console.log('failed to load account info, set account info to undefined')
      console.log(e)
      setAccountInfo(undefined)
    } finally {
      setLoading(false)
    }
  }, [appClient, activeAddress])

  // Fetch on mount and when dependencies change
  const refresh = fetchAccountInfo

  return { accountInfo, loading, error, refresh }
}
