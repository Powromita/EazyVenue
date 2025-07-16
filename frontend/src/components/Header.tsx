import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Header() {
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setRole(localStorage.getItem('role'));
    setUsername(localStorage.getItem('username'));
    setMounted(true);
    console.log('Header role:', localStorage.getItem('role'));

    // Listen for localStorage changes (cross-tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'username') {
        setUsername(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);

    // Listen for custom event (same-tab)
    const handleUsernameChanged = () => {
      setUsername(localStorage.getItem('username'));
    };
    window.addEventListener('usernameChanged', handleUsernameChanged);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('usernameChanged', handleUsernameChanged);
    };
  }, []);

  if (!mounted) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-purple-600 shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {router.pathname === '/profile-vendor' ? (
          <span className="text-2xl font-extrabold text-white tracking-wide">venue booking</span>
        ) : (
          <Link href="/">
            <span className="text-2xl font-extrabold text-white tracking-wide cursor-pointer hover:text-yellow-200 transition">venue booking</span>
          </Link>
        )}
        <nav className="flex items-center space-x-6">
          {/* Show Home button on all pages except homepage */}
          {router.pathname !== '/' && (
            <Link href={role === 'vendor' || role === 'VENUE_OWNER' ? '/admin' : '/'}>
              <span className="text-white hover:text-yellow-200 font-medium transition cursor-pointer">Home</span>
            </Link>
          )}
          {/* Hide navigation on profile page */}
          {router.pathname !== '/profile' && (
            <>
              {/* Show My Bookings only for logged-in customers and not on the bookings page */}
              {role === 'customer' && router.pathname !== '/bookings' && (
                <a
                  href="/bookings"
                  className="text-white hover:text-yellow-200 font-medium transition"
                >
                  My Bookings
                </a>
              )}
              {!role ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="inline-flex items-center text-white font-medium">
                    Login
                    <ChevronDownIcon className="ml-1 h-5 w-5" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/login/customer"
                            className={`block px-4 py-2 text-sm ${active ? 'bg-blue-100' : ''}`}
                          >
                            Login as Customer
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/login/vendor"
                            className={`block px-4 py-2 text-sm ${active ? 'bg-blue-100' : ''}`}
                          >
                            Login as Vendor
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <Menu as="div" className="relative flex flex-col items-center">
                  <Menu.Button className="flex flex-col items-center focus:outline-none">
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-white font-bold text-lg">
                        {username ? username.charAt(0).toUpperCase() : 'U'}
                      </div>
                      {username && (
                        <span className="text-xs text-gray-200 ml-2">{username.toLowerCase()}</span>
                      )}
                      <ChevronDownIcon className="ml-2 h-5 w-5 text-white" />
                    </div>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-12 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="flex flex-col items-center py-2 border-b">
                        {/* Profile icon and username removed from dropdown */}
                      </div>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href={role === 'vendor' || role === 'VENUE_OWNER' ? '/profile-vendor' : '/profile'}
                            className={`block px-4 py-2 text-sm text-blue-700 ${active ? 'bg-blue-100' : ''}`}
                          >
                            Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`block w-full text-left px-4 py-2 text-sm text-red-600 ${active ? 'bg-blue-100' : ''}`}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

// Add Footer component
function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-purple-600 text-white py-6 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-lg">venue booking</span> &copy; {new Date().getFullYear()}<br />
          Contact: <a href="tel:+1234567890" className="underline">+1 234 567 890</a>
        </div>
        <div className="flex gap-4 items-center">
          <a href="https://facebook.com/venuebooking" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
          <a href="https://twitter.com/venuebooking" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a>
          <a href="https://instagram.com/venuebooking" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
          <a href="mailto:info@venuebooking.com" className="hover:underline">info@venuebooking.com</a>
        </div>
      </div>
    </footer>
  );
}