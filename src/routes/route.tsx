// import { lazy } from 'react'
// import {Navigate} from 'react-router-dom'
import UpLoad from '../pages/UpLoad/index'
import Download from '../pages/Download/index'
import File from '../pages/File/index'

export default [
    {
      path: '/',
      element: <UpLoad/>
    },
    {
      path: '/download',
      element: <Download/>
    },
    {
      path: '/file',
      element: <File/>
    }
  ]