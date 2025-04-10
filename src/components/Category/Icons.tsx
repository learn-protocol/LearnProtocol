import { BsStack } from "react-icons/bs";
import { TbMathIntegralX } from "react-icons/tb";
import { MdOutlineScience } from "react-icons/md";
import { FaCode, FaEthereum, FaRegStar } from "react-icons/fa6";

function generateIconProps(color: string, size: number) {
    return {
        color,
        minWidth: size,
    };
}

export default function CategoryIcon({
    category,
    color = "#2f4ce7",
    size = 20,
}: {
    category: string;
    color?: string;
    size?: number;
}) {
    switch (category) {
        case "Blockchain":
            return <BsStack size={size} style={generateIconProps(color, size)} className="category-icon" />;
        case "Ethereum":
            return (
                <FaEthereum size={size} style={generateIconProps(color, size)} className="category-icon" />
            );
        case "Programming":
            return <FaCode size={size} style={generateIconProps(color, size)} className="category-icon" />;
        case "Mathematics":
            return (
                <TbMathIntegralX
                    size={size}
                    style={generateIconProps(color, size)}
                    className="category-icon"
                />
            );
        case "Science":
            return (
                <MdOutlineScience
                    size={size}
                    style={generateIconProps(color, size)}
                    className="category-icon"
                />
            );
        case "Other":
            return <FaRegStar size={size} style={generateIconProps(color, size)} className="category-icon" />;
    }

    return null;
}
