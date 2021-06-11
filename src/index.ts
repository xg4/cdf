require('dotenv').config()

import retry from 'async-retry'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { task } from './task'

dayjs.extend(utc)
dayjs.extend(timezone)

retry(task, {
  retries: 3,
})
