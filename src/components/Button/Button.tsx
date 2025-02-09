import Image from "next/image";
import { MouseEventHandler } from "react";

type ButtonProps = {
    type: "submit" | "button";
    label: string;
    icon?: string;
    styling: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
};

function Button({ type, label, styling, icon, onClick }: ButtonProps) {
    return (
        <button
            className={`rounded-full flexCenter ${styling}`}
            type={type}
            onClick={onClick}
        >
            {icon && <Image src={icon} alt={label} width={24} height={24} />}
            {label}
        </button>
    );
}

export default Button;
