import { Link } from "react-router";

export default function Logo({
  to = "/",
  className = "logo",
}: {
  to?: string;
  className?: string;
}) {
  const content = (
    <>
      <span className="mark">
        <svg viewBox="0 0 48 48">
          <path
            d="M24 5.5C15.7 5.5 9 12.1 9 20.3c0 10.6 15 22.2 15 22.2s15-11.6 15-22.2C39 12.1 32.3 5.5 24 5.5Z"
            fill="currentColor"
          />
          <path
            d="m16 24 8-6.5 8 6.5v7.5h-5.1v-5.2h-5.8v5.2H16V24Z"
            fill="#fff"
          />
        </svg>
      </span>
      <span>
        Addis <b>Kiray</b>
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className} style={{ textDecoration: "none" }}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
