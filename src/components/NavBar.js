"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  BarChart2, 
  User, 
  Phone 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  // Configuración de los links para facilitar el mapeo
  const navLinks = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Consultas', href: '/consultas', icon: FileText },
    // { name: 'Estadisticas', href: '/dashboard/estadisticas', icon: BarChart2 },
  ];

  return (
    <nav className="w-full sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="mx-auto px-6 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-full text-white">
            <Phone size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-[#1e293b] tracking-tight">
            Telecom
          </span>
          <div className="h-6 w-[1px] bg-slate-200 mx-4 hidden md:block" />
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-all relative py-5 ${
                  isActive 
                    ? 'text-blue-600' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <link.icon size={18} />
                {link.name}
                
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-100 md:border-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-700 leading-tight">Aaron Garcia</p>
            </div>
            <div className="relative">
              <User className='size-5 rounded-full border' />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}