import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-purple-600 text-white py-6 mt-12 w-full">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Link href="/">
            <span className="font-bold text-lg cursor-pointer hover:underline">venue booking</span>
          </Link> &copy; {new Date().getFullYear()}<br />
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