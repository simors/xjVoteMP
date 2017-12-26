/**
 * Created by yangyang on 2017/6/28.
 */
import { all } from 'redux-saga/effects'
import {authSaga} from '../utils/auth'
import {appStateSaga} from '../utils/appstate'
import {rehydrateSaga} from '../utils/rehydrateRedux'
import {voteSaga} from '../routes/Vote'
import {meSaga} from '../routes/Me'

export default function* rootSaga() {
  yield all([
    ...authSaga,
    ...appStateSaga,
    ...rehydrateSaga,
    ...voteSaga,
    ...meSaga,
  ])
}
