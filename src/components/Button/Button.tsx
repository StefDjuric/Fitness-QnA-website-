import Image from "next/image";
import { title } from "process";

type ButtonProps = {
    type: "submit" | "button";
    label: string;
    icon?: string;
    styling: string;
};

function Button({ type, label, styling, icon }: ButtonProps) {
    return (
        <button className={`rounded-full flexCenter ${styling}`} type={type}>
            {icon && <Image src={icon} alt={title} width={24} height={24} />}
            {label}
        </button>
    );
}

export default Button;
