import { useParams } from "react-router-dom";
import styles from "./PortfolioItem.module.css"

const PortfolioItem=()=>{
    const portId = useParams().portfolioId;
    console.log(portId);
    
    return <div>
        portfolio item
    </div>
}

export default PortfolioItem