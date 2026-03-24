import { Link } from "react-router-dom";

export default function ActionButton({
  children,
  variant = "primary",
  type = "button",
  to,
  href,
  ...props
}) {
  const className = `btn btn--${variant}`;

  if (to) {
    return (
      <Link className={className} to={to} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={className} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={className} {...props}>
      {children}
    </button>
  );
}
