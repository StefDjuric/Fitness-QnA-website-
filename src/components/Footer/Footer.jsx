import Link from "next/link";

function Footer() {
    return (
        <footer className="flexCenter mb-24">
            <div className="padding-container max-container bg-gray-50 flex w-full flex-col gap-14">
                <div className="flex flex-col items-start justify-center gap-[10%] md:flex-row">
                    <Link
                        href="/"
                        className="mb-10 font-bold text-2xl text-gray-90 "
                    >
                        <span className="text-green-900">Be</span>Lean.
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
