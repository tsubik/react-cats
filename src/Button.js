import cx from 'classnames';

const COLORS = {
  'blue': 'btn-blue',
  'red': 'btn-red'
};

function Button ({ color = 'blue', className, ...rest }) {
  return (
    <button
      {...rest}
      className={cx({
        'btn': true,
        [COLORS[color]]: true,
        [className]: !!className
      })}
    >
      Search
    </button>
  )
}

export default Button;
