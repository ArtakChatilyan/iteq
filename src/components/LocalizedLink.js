import { Link, useParams } from "react-router-dom";
import { getLocalizedPath } from "../utils/getLocalizedPath";

export default function LocalizedLink({ to, children, ...props }) {
  const { lang } = useParams();
  const localizedPath = getLocalizedPath(lang, to);
  return (
    <Link to={localizedPath} {...props}>
      {children}
    </Link>
  );
}