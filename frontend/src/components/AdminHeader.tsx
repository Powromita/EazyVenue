import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function AdminHeader() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    window.location.href = '/login/vendor';
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50 border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          <span className="text-xl font-semibold text-gray-900 tracking-tight">venue booking</span>
          <a
            href="/admin"
            className="text-orange-600 hover:text-orange-700 font-medium transition text-base px-3 py-1 rounded hover:bg-orange-50"
          >
            Home
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center focus:outline-none">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold text-lg">
                {username ? username.charAt(0).toUpperCase() : 'V'}
              </div>
              <span className="ml-2 text-sm font-normal text-orange-600 align-middle">Vendor</span>
              <ChevronDownIcon className="ml-1 h-5 w-5 text-orange-600" />
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
              <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => window.location.href = '/profile-vendor'}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${active ? 'bg-blue-100' : ''}`}
                    >
                      Profile
                    </button>
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
        </div>
      </div>
    </header>
  );
}