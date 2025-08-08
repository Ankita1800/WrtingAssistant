// src/components/Navbar.jsx
import Link from 'next/link';
import ThemeToggle from './ThemeToggle'; // Import the new component

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          AI Writing Assistant
        </Link>
        <ThemeToggle /> {/* Add the component here */}
      </div>
    </nav>
  );
};

export default Navbar;