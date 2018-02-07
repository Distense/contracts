import _ from 'lodash'
import { combineReducers } from 'redux'

import {
  RECEIVE_PULLREQUESTS,
  RECEIVE_PULLREQUEST,
  SUBMIT_PULLREQUEST
} from '../constants/actionTypes'

const pullRequestById = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_PULLREQUESTS:
      return {
        ...state,
        ...(action.pullRequests || []).reduce((obj, pullRequest) => {
          obj[pullRequest._id] = pullRequest
          return obj
        }, {})
      }
    case RECEIVE_PULLREQUEST:
      return action.pullRequest
        ? {
            ...state,
            [action.pullRequest._id]: action.pullRequest
          }
        : state
    case SUBMIT_PULLREQUEST:
      return action.pullRequest
        ? {
            ...state,
            [action.pullRequest._id]: {
              ...action.pullRequest,
              _submitting: true
            }
          }
        : state
    default:
      return state
  }
}

const pullRequests = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_PULLREQUESTS:
      const newPullRequestIds = action.pullRequests.map(({ _id }) => _id)
      return [..._.pullAll(state, newPullRequestIds), ...newPullRequestIds]
    case RECEIVE_PULLREQUEST:
    case SUBMIT_PULLREQUEST:
      if (!action.pullRequest) return state
      const { _id } = action.pullRequest
      return [..._.pull(state, _id), _id]
    default:
      return state
  }
}

const pendingPullRequestId = (state = null, action) => {
  switch (action.type) {
    case SUBMIT_PULLREQUEST:
      return action.pullRequest._id
    case RECEIVE_PULLREQUEST:
      return action.pullRequest && state === action.pullRequest._id
        ? null
        : state
    default:
      return state
  }
}

export default combineReducers({
  pullRequestById,
  pullRequests,
  pendingPullRequestId
})

export const getPullRequest = ({ pullRequests: { pullRequestById } }, _id) =>
  pullRequestById[_id]

export const getPendingPullRequest = state => {
  return getPullRequest(state, state.pullRequests.pendingPullRequestId)
}

export const getAllPullRequests = state => {
  return state.pullRequests.pullRequests.map(_id => getPullRequest(state, _id))
}
