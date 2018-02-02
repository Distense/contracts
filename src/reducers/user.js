import { combineReducers } from 'redux'

import {
  RECEIVE_ACCOUNT_TRANSACTIONS,
  RECEIVE_ACCOUNT,
  RECEIVE_ACCOUNTS,
  RECEIVE_ACCOUNT_UNLOCKED,
  RECEIVE_HAS_WEB3,
  RECEIVE_IS_CONNECTED,
  RECEIVE_USER_NUM_DID,
  RECEIVE_NETWORK_ID
} from '../constants/actionTypes'

const user = (
  state = {
    hasWeb3: false,
    isConnected: false,
    accountUnlocked: false,
    numDID: 0,
    network: null
  },
  action
) => {
  switch (action.type) {
    case RECEIVE_HAS_WEB3:
      return Object.assign({}, state, {
        hasWeb3: true
      })
    case RECEIVE_IS_CONNECTED:
      return Object.assign({}, state, {
        isConnected: true
      })
    case RECEIVE_ACCOUNT_UNLOCKED:
      return Object.assign({}, state, {
        accountUnlocked: action.accountUnlocked
      })
    case RECEIVE_USER_NUM_DID:
      return Object.assign({}, state, {
        numDID: action.numDIDOwned
      })
    case RECEIVE_NETWORK_ID:
      return Object.assign({}, state, {
        network: action.network
      })
    default:
      return state
  }
}

const accountByAddress = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_ACCOUNTS:
      return {
        ...state,
        ...(action.accounts || []).reduce((obj, account) => {
          obj[account.address] = account
          return obj
        }, {})
      }
    default:
      return state
  }
}

const accounts = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_ACCOUNT:
      return [...state, action.account]
    default:
      return state
  }
}

const transactions = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_ACCOUNT_TRANSACTIONS:
      return (action.transactions || []).map(transaction => transaction)
    default:
      return state
  }
}

export default combineReducers({
  accounts,
  accountByAddress,
  transactions,
  user
})

export const getUserTransactions = state => {
  return state.user.transactions.map(tx => selectTransactionInfo(tx))
}

const selectTransactionInfo = tx => ({
  from: tx.from,
  to: tx.to
})

export const getAccounts = state => state.accounts
export const getCoinbase = state => state.user.accounts[0]
export const getNetworkId = state => state.user.network
