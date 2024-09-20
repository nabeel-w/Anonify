import { Link } from "react-router-dom";

function Button({ content, to }) {
  return (
    <Link to={to} className="link">
      <div className="button">
        {content}
      </div>
    </Link>
  );
} 

export default Button;
