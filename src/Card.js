import cx from 'classnames';

const THEME = {
  primary: 'flex justify-between items-center p-2 my-2 border border-gray-700 shadow-lg rounded'
}

function Card ({ theme = 'primary', children, ...rest }) {
  return (
    <div {...rest} className={cx({ [THEME[theme]]: true })}>
      {children}
    </div>
  )
}

export default Card;
