import cx from 'classnames';

const COLORS = {
  'blue': 'btn-blue',
  'green': 'btn-green',
  'red': 'btn-red'
};

function Button ({ type = 'button', color = 'blue', className, children, ...rest }) {
  return (
    <button
      {...rest}
      type={type}
      className={cx({
        'btn': true,
        [COLORS[color]]: true,
        [className]: !!className
      })}
    >
      {children}
    </button>
  )
}

export default Button;
