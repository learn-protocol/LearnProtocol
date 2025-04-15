import { BsStack } from "react-icons/bs";
import { ImStatsDots } from "react-icons/im";
import { TbMathIntegralX } from "react-icons/tb";
import { FaBitcoin, FaLeaf } from "react-icons/fa";
import { RiMentalHealthLine } from "react-icons/ri";
import { MdBubbleChart, MdOutlineScience } from "react-icons/md";
import { FaCode, FaEthereum, FaHtml5, FaRegStar } from "react-icons/fa6";

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
    const props = {
        size,
        style: generateIconProps(color, size),
        className: "category-icon",
    };

    switch (category) {
        case "Blockchain":
            return <BsStack {...props} />;
        case "Ethereum":
            return <FaEthereum {...props} />;
        case "Programming":
            return <FaCode {...props} />;
        case "Mathematics":
            return <TbMathIntegralX {...props} />;
        case "Science":
            return <MdOutlineScience {...props} />;
        case "Other":
            return <FaRegStar {...props} />;
        case "Biology":
            return <FaLeaf {...props} />;
        case "Bitcoin":
            return <FaBitcoin {...props} />;
        case "Philosophy":
            return <MdBubbleChart {...props} />;
        case "Psychology":
            return <RiMentalHealthLine {...props} />;
        case "Statistics":
            return <ImStatsDots {...props} />;
        case "Web Development":
            return <FaHtml5 {...props} />;
    }

    return null;
}
