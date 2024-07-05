import Link from "next/link";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
            <h5 className="text-lg font-bold">EconoBlock</h5>
            <p className="text-sm">Macroeconomic insights driving stocks and crypto.</p>
          </div>
          <div className="w-full md:w-auto flex justify-center md:justify-end space-x-4">
            <Link href="/about" className="text-sm">
              About Us
            </Link>
            <Link href="/contact" className="text-sm">
                Contact
            </Link>
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-6">
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter className="text-2xl hover:text-blue-500 transition-colors" />
          </Link>
          <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook className="text-2xl hover:text-blue-700 transition-colors" />
          </Link>
          <Link href="https://www.instagram.com/econo_block?igsh=MXNmaWE0Mmd4NTcyeA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="text-2xl hover:text-pink-500 transition-colors" />
          </Link>
          <Link href="https://www.linkedin.com/in/nived-reddy/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin className="text-2xl hover:text-blue-600 transition-colors" />
          </Link>
        </div>
        <div className="text-center mt-4 text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} EconoBlock. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
