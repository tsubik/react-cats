import cx from 'classnames';

const THEME = {
  primary: 'flex flex-col justify-between items-center space-y-3 p-4 border border-gray-300 shadow-lg rounded-lg'
}

function Card ({ theme = 'primary', children, ...rest }) {
  return (
    <div {...rest} className={cx({ [THEME[theme]]: true })}>
      {children}
    </div>
  )
}

export default Card;
