import React from 'react'

export const Toast = ({ toast }) => {
  if (!toast) return null
  return (
    <div className={`fixed top-24 right-6 z-50 animate-slide-in-right px-5 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm ${
      toast.tipo === 'error' ? 'bg-red-600 text-white' : 'bg-green-700 text-white'
    }`}>
      {toast.mensaje}
    </div>
  )
}

export default Toast
