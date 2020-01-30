import moment from 'moment';
import morgan from 'morgan';
import { AccessLogStream } from './winston';

// local datetime token
morgan.token('local-datetime', () => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
});

export default morgan(
  `:remote-addr - :remote-user :local-datetime ":method :url HTTP/:http-version" :status :res[content-length] DUR=":response-time ms" ":referrer" ":user-agent"`,
  { stream: new AccessLogStream() }
);
