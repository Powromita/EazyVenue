import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function Header() {
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem('role'));
    setUsername(localStorage.getItem('username'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-purple-600 shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <span className="text-2xl font-extrabold text-white tracking-wide">EazyVenue</span>
        <nav className="flex items-center space-x-6">
          {/* Show My Bookings only for logged-in customers */}
          {role === 'customer' && (
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
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center focus:outline-none">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-white font-bold text-lg">
                  {username ? username.charAt(0).toUpperCase() : 'U'}
                </div>
                <ChevronDownIcon className="ml-1 h-5 w-5 text-white" />
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
                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
        </nav>
      </div>
    </header>
  );
}